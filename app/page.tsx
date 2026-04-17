'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import HomeScreen from '@/components/HomeScreen';
import TemplateSelection from '@/components/TemplateSelection';
import BoothScreen from '@/components/BoothScreen';
import FrameSelection from '@/components/FrameSelection';
import ResultScreen from '@/components/ResultScreen';
import Modal from '@/components/Modal';
import ErrorBoundary from '@/components/ErrorBoundary';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Screen, FilterName } from '@/lib/types';
import { PhotoStripTemplate, PHOTO_STRIP_TEMPLATES, DEFAULT_TEMPLATE } from '@/lib/templates';
import { startCamera, stopCamera, captureVideoFrame, applyVideoFilter, waitForVideoReady } from '@/lib/camera';
import { downloadCompositeImage, delay } from '@/lib/canvas';
import { batchFilterImages } from '@/lib/filters';
import { PHOTO_COUNT, COUNTDOWN_SECONDS, FLASH_DURATION_MS, CAPTURE_DELAY_MS, PRINTING_ANIMATION_MS, FRAMES } from '@/lib/constants';

export default function Home() {
  // Screen navigation
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');

  // Template selection
  const [selectedTemplate, setSelectedTemplate] = useState<PhotoStripTemplate>(DEFAULT_TEMPLATE);

  // Photo state
  const [photos, setPhotos] = useState<(string | null)[]>(Array(PHOTO_COUNT).fill(null));
  const [filteredPhotos, setFilteredPhotos] = useState<(string | null)[]>(Array(PHOTO_COUNT).fill(null));
  const [isBW, setIsBW] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<FilterName>('none');

  // Capture state
  const [isCapturing, setIsCapturing] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Camera state
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Frame selection
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);

  // Result screen state
  const [showPrinting, setShowPrinting] = useState(false);
  const [showFinalKiosk, setShowFinalKiosk] = useState(false);

  // Download state
  const [isDownloading, setIsDownloading] = useState(false);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);

  // Refs — canvasRef is typed to allow null so we can guard properly
  const videoRef = useRef<HTMLVideoElement>(null!);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const cameraSessionIdRef = useRef(0);
  // Keep a ref mirror of photos so capture closure is never stale
  const photosRef = useRef<(string | null)[]>(Array(PHOTO_COUNT).fill(null));
  const isCapturingRef = useRef(false);

  // Sync photosRef whenever photos state changes
  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  // Camera management
  const initCamera = useCallback(async () => {
    const sessionId = ++cameraSessionIdRef.current;
    setIsCameraReady(false);
    setCameraError(null);

    try {
      const mediaStream = await startCamera();

      if (cameraSessionIdRef.current !== sessionId) {
        stopCamera(mediaStream);
        return;
      }

      if (streamRef.current) {
        stopCamera(streamRef.current);
      }
      streamRef.current = mediaStream;
      setStream(mediaStream);

      const video = videoRef.current;
      if (!video) {
        stopCamera(mediaStream);
        streamRef.current = null;
        setStream(null);
        setCameraError('Camera started but preview could not initialize. Please try again.');
        return;
      }

      video.srcObject = mediaStream;

      try {
        await video.play();
      } catch {
        // Auto-play may be blocked; video.play() isn't critical — events will fire anyway
      }

      const ready = await waitForVideoReady(video, 10000);

      if (cameraSessionIdRef.current !== sessionId) {
        stopCamera(mediaStream);
        return;
      }

      if (ready) {
        setIsCameraReady(true);
        setCameraError(null);
      } else {
        setCameraError('Camera is warming up. Please wait a moment then try capturing.');
        // Continue polling — the sync effect below will mark ready when video fires
      }
    } catch (error) {
      if (cameraSessionIdRef.current !== sessionId) return;

      if (streamRef.current) {
        stopCamera(streamRef.current);
        streamRef.current = null;
      }
      setStream(null);
      setIsCameraReady(false);

      const msg = error instanceof Error && error.message.includes('Permission')
        ? 'Camera permission denied. Please allow camera access or upload photos instead.'
        : 'Unable to access camera. Check permissions or upload photos instead.';
      setCameraError(msg);
    }
  }, []);

  const cleanupCamera = useCallback(() => {
    cameraSessionIdRef.current += 1;
    setIsCameraReady(false);
    if (streamRef.current) {
      stopCamera(streamRef.current);
      streamRef.current = null;
    }
    setStream(null);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Start camera when entering booth screen
  useEffect(() => {
    if (currentScreen !== 'booth') {
      cleanupCamera();
      return;
    }
    void initCamera();
    return cleanupCamera;
  }, [currentScreen, initCamera, cleanupCamera]);

  // Keep camera readiness in sync with video element state
  useEffect(() => {
    if (currentScreen !== 'booth' || isCameraReady || !stream || !videoRef.current) return;

    const video = videoRef.current;
    const markReadyIfAvailable = () => {
      if (video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) {
        setIsCameraReady(true);
        setCameraError(null);
        return true;
      }
      return false;
    };

    if (markReadyIfAvailable()) return;

    const intervalId = setInterval(() => {
      if (markReadyIfAvailable()) clearInterval(intervalId);
    }, 200);

    return () => clearInterval(intervalId);
  }, [currentScreen, isCameraReady, stream]);

  // Apply B&W filter to video
  useEffect(() => {
    if (videoRef.current) {
      applyVideoFilter(videoRef.current, isBW);
    }
  }, [isBW]);

  // Reset all state
  const resetAll = useCallback(() => {
    const empty = Array(PHOTO_COUNT).fill(null);
    setPhotos(empty);
    photosRef.current = empty;
    setFilteredPhotos(empty);
    setIsCapturing(false);
    isCapturingRef.current = false;
    setIsBW(false);
    setCurrentFilter('none');
    setShowPrinting(false);
    setShowFinalKiosk(false);
    setCurrentFrameIndex(0);
    setCurrentPhotoIndex(0);
    setCameraError(null);
    setIsDownloading(false);
  }, []);

  // Navigation
  const goHome = useCallback(() => {
    cleanupCamera();
    resetAll();
    setCurrentScreen('home');
  }, [cleanupCamera, resetAll]);

  const goToTemplateSelection = useCallback(() => {
    setCurrentScreen('templateSelection');
  }, []);

  const goToBooth = useCallback(() => {
    resetAll();
    setCurrentScreen('booth');
  }, [resetAll]);

  const toggleBW = useCallback((checked: boolean) => {
    setIsBW(checked);
  }, []);

  // Countdown overlay
  const showCountdown = (photoIndex: number): Promise<void> => {
    return new Promise((resolve) => {
      const countdownEl = document.getElementById(`countdown-${photoIndex}`);
      if (!countdownEl) {
        resolve();
        return;
      }

      let count = COUNTDOWN_SECONDS;
      countdownEl.textContent = String(count);
      countdownEl.style.opacity = '1';

      const interval = setInterval(() => {
        count--;
        if (count <= 0) {
          clearInterval(interval);
          countdownEl.style.opacity = '0';
          resolve();
        } else {
          countdownEl.textContent = String(count);
        }
      }, 1000);
    });
  };

  // Flash effect
  const triggerFlash = (photoIndex: number) => {
    const flashEl = document.getElementById(`flash-${photoIndex}`);
    if (flashEl) {
      flashEl.style.opacity = '1';
      setTimeout(() => {
        if (flashEl) flashEl.style.opacity = '0';
      }, FLASH_DURATION_MS);
    }
  };

  // Photo capture sequence
  const startPhotoSession = useCallback(async () => {
    // Guard: already capturing
    if (isCapturingRef.current) return;

    // Guard: no stream
    if (!streamRef.current) {
      setCameraError('No camera stream. Please wait for the camera to start or upload photos.');
      return;
    }

    // Guard: camera not ready
    if (!isCameraReady) {
      setCameraError('Camera is still warming up. Please wait a moment.');
      return;
    }

    // Guard: video not available
    const video = videoRef.current;
    if (!video) {
      setCameraError('Video element not found. Please refresh the page.');
      return;
    }

    // Guard: canvas not available
    const canvas = canvasRef.current;
    if (!canvas) {
      setCameraError('Canvas not ready. Please refresh the page.');
      return;
    }

    isCapturingRef.current = true;
    setIsCapturing(true);
    setCurrentPhotoIndex(0);
    setCameraError(null);

    const capturedPhotos: (string | null)[] = Array(PHOTO_COUNT).fill(null);

    for (let i = 0; i < PHOTO_COUNT; i++) {
      setCurrentPhotoIndex(i);

      // Show countdown for this slot
      await showCountdown(i);
      await delay(150);

      // Try to capture with retries
      let photo: string | null = null;
      for (let attempt = 0; attempt < 5; attempt++) {
        const ready = await waitForVideoReady(video, 1500);
        if (!ready) {
          await delay(100);
          continue;
        }
        photo = captureVideoFrame(video, canvas, { isBW });
        if (photo) break;
        await delay(100);
      }

      if (photo) {
        capturedPhotos[i] = photo;
      } else {
        console.warn(`Photo ${i + 1}: capture failed after 5 attempts`);
      }

      // Update strip preview immediately
      setPhotos([...capturedPhotos]);
      photosRef.current = [...capturedPhotos];

      // Flash
      triggerFlash(i);

      // Pause before next photo (skip after last)
      if (i < PHOTO_COUNT - 1) {
        await delay(CAPTURE_DELAY_MS);
      }
    }

    isCapturingRef.current = false;
    setIsCapturing(false);

    const anyPhoto = capturedPhotos.some((p) => p !== null);
    if (anyPhoto) {
      await delay(400);
      cleanupCamera();
      setCurrentScreen('frameSelection');
    } else {
      // All failed — show friendly error, stay on booth so user can retry or upload
      setCameraError('Could not capture any photos. Try again or use the Upload button.');
    }
  }, [isCameraReady, isBW, cleanupCamera]);

  // Upload photos — does NOT rely on stale photos state
  const handleUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []).slice(0, PHOTO_COUNT);
    if (files.length === 0) return;

    // Reset to fresh array, don't merge with stale state
    const newPhotos: (string | null)[] = Array(PHOTO_COUNT).fill(null);
    let loadedCount = 0;

    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          newPhotos[index] = result;
        }
        loadedCount++;

        if (loadedCount === files.length) {
          setPhotos([...newPhotos]);
          photosRef.current = [...newPhotos];
          setCameraError(null);
          // Small delay so state settles before navigating
          setTimeout(() => {
            cleanupCamera();
            setCurrentScreen('frameSelection');
          }, 300);
        }
      };
      reader.onerror = () => {
        loadedCount++;
        if (loadedCount === files.length) {
          if (newPhotos.some((p) => p !== null)) {
            setPhotos([...newPhotos]);
            photosRef.current = [...newPhotos];
            setTimeout(() => {
              cleanupCamera();
              setCurrentScreen('frameSelection');
            }, 300);
          } else {
            setCameraError('Failed to read uploaded files. Please try again.');
          }
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input so the same file can be re-selected
    event.target.value = '';
  }, [cleanupCamera]);

  // Frame selection
  const handleFrameChange = useCallback((index: number) => {
    setCurrentFrameIndex(index);
  }, []);

  // Filter application — uses photosRef to avoid stale closure
  const applyFilter = useCallback((filterName: FilterName) => {
    setCurrentFilter(filterName);
    const currentPhotos = photosRef.current;

    batchFilterImages(currentPhotos, filterName, (results) => {
      setFilteredPhotos(results);
    });
  }, []);

  const handleSelectFrame = useCallback(async () => {
    setCurrentScreen('result');
    setShowFinalKiosk(false);
    setShowPrinting(true);

    await delay(PRINTING_ANIMATION_MS);

    setShowPrinting(false);
    setShowFinalKiosk(true);

    // Apply initial "none" filter to populate filteredPhotos
    applyFilter('none');
  }, [applyFilter]);

  // Download with guard against double-click
  const handleDownload = useCallback(async () => {
    if (isDownloading) return;
    setIsDownloading(true);

    try {
      const photosToDownload = filteredPhotos.some((p) => p !== null) ? filteredPhotos : photosRef.current;
      const selectedFrame = FRAMES[currentFrameIndex];
      downloadCompositeImage(photosToDownload, selectedTemplate, selectedFrame);
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      // Re-enable download after a short guard window
      setTimeout(() => setIsDownloading(false), 2000);
    }
  }, [isDownloading, filteredPhotos, selectedTemplate, currentFrameIndex]);

  // Modal
  const handleImageClick = useCallback((src: string) => {
    setModalImage(src);
    setModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
    setModalImage(null);
  }, []);

  return (
    <ErrorBoundary>
      <div className="w-full min-h-screen overflow-hidden bg-white">
        <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

        {currentScreen === 'home' && <HomeScreen onEnter={goToTemplateSelection} />}

        {currentScreen === 'templateSelection' && (
          <TemplateSelection
            templates={PHOTO_STRIP_TEMPLATES}
            selectedTemplate={selectedTemplate}
            onSelectTemplate={setSelectedTemplate}
            onContinue={goToBooth}
            onHome={goHome}
          />
        )}

        {currentScreen === 'booth' && (
          <BoothScreen
            isBW={isBW}
            isCameraReady={isCameraReady}
            cameraError={cameraError}
            onBWToggle={toggleBW}
            onRecordClick={startPhotoSession}
            onUpload={handleUpload}
            onHome={goHome}
            recordDisabled={!stream || !isCameraReady || isCapturing}
            videoRef={videoRef}
            photos={photos}
            currentPhotoIndex={currentPhotoIndex}
            isCapturing={isCapturing}
          />
        )}

        {currentScreen === 'frameSelection' && (
          <FrameSelection
            photos={photos}
            currentFrameIndex={currentFrameIndex}
            onFrameChange={handleFrameChange}
            onSelectFrame={handleSelectFrame}
            onHome={goHome}
          />
        )}

        {currentScreen === 'result' && (
          <ResultScreen
            photos={filteredPhotos.some((p) => p !== null) ? filteredPhotos : photos}
            showPrinting={showPrinting}
            showFinalKiosk={showFinalKiosk}
            selectedFrame={FRAMES[currentFrameIndex]}
            currentFilter={currentFilter}
            onFilterChange={applyFilter}
            onDownload={handleDownload}
            isDownloading={isDownloading}
            onRetake={goToBooth}
            onHome={goHome}
            onImageClick={handleImageClick}
          />
        )}

        <Modal
          isOpen={modalOpen}
          imageSrc={modalImage}
          onClose={handleModalClose}
        />
      </div>
    </ErrorBoundary>
  );
}
