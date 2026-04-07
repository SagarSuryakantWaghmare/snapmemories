'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import HomeScreen from '@/components/HomeScreen';
import TemplateSelection from '@/components/TemplateSelection';
import BoothScreen from '@/components/BoothScreen';
import FrameSelection from '@/components/FrameSelection';
import ResultScreen from '@/components/ResultScreen';
import Modal from '@/components/Modal';
import { Screen, FilterName } from '@/lib/types';
import { PhotoStripTemplate, PHOTO_STRIP_TEMPLATES, DEFAULT_TEMPLATE } from '@/lib/templates';
import { startCamera, stopCamera, captureVideoFrame, applyVideoFilter } from '@/lib/camera';
import { downloadCompositeImage, delay } from '@/lib/canvas';
import { batchFilterImages } from '@/lib/filters';
import { PHOTO_COUNT, COUNTDOWN_SECONDS, FLASH_DURATION_MS, CAPTURE_DELAY_MS, PRINTING_ANIMATION_MS } from '@/lib/constants';

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
  
  // Frame selection
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  
  // Result screen state
  const [showPrinting, setShowPrinting] = useState(false);
  const [showFinalKiosk, setShowFinalKiosk] = useState(false);
  
  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);
  
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Camera management
  const initCamera = useCallback(async () => {
    try {
      const mediaStream = await startCamera();
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        // Explicitly play the video
        try {
          await videoRef.current.play();
        } catch (playError) {
          console.warn('Video play() called but may already be playing:', playError);
        }
        
        // Wait for video to be ready
        await new Promise<void>((resolve) => {
          const video = videoRef.current;
          if (!video) {
            resolve();
            return;
          }
          
          // If video is already ready, resolve immediately
          if (video.readyState >= 2) {
            console.log('Video already ready');
            resolve();
            return;
          }
          
          // Wait for loadeddata event
          const onLoadedData = () => {
            console.log('Video loaded and ready', {
              videoWidth: video.videoWidth,
              videoHeight: video.videoHeight,
              readyState: video.readyState,
              paused: video.paused
            });
            video.removeEventListener('loadeddata', onLoadedData);
            resolve();
          };
          
          video.addEventListener('loadeddata', onLoadedData);
          
          // Fallback timeout
          setTimeout(() => {
            console.log('Video load timeout, continuing anyway');
            video.removeEventListener('loadeddata', onLoadedData);
            resolve();
          }, 5000);
        });
      }
    } catch (error) {
      console.error('Failed to start camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  }, []);

  const cleanupCamera = useCallback(() => {
    if (stream) {
      stopCamera(stream);
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [stream]);

  // Start camera when entering booth screen
  useEffect(() => {
    if (currentScreen === 'booth') {
      initCamera();
    } else {
      cleanupCamera();
    }
    
    return () => {
      if (currentScreen !== 'booth') {
        cleanupCamera();
      }
    };
  }, [currentScreen, initCamera, cleanupCamera]);

  // Apply B&W filter to video
  useEffect(() => {
    if (videoRef.current) {
      applyVideoFilter(videoRef.current, isBW);
    }
  }, [isBW]);

  // Navigation functions
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

  const resetAll = useCallback(() => {
    setPhotos(Array(PHOTO_COUNT).fill(null));
    setFilteredPhotos(Array(PHOTO_COUNT).fill(null));
    setIsCapturing(false);
    setIsBW(false);
    setCurrentFilter('none');
    setShowPrinting(false);
    setShowFinalKiosk(false);
    setCurrentFrameIndex(0);
    setCurrentPhotoIndex(0);
  }, []);

  // B&W toggle
  const toggleBW = useCallback((checked: boolean) => {
    setIsBW(checked);
  }, []);

  // Photo capture sequence
  const startPhotoSession = useCallback(async () => {
    if (isCapturing || !stream || !videoRef.current || !canvasRef.current) {
      console.log('Cannot start capture:', {
        isCapturing,
        hasStream: !!stream,
        hasVideo: !!videoRef.current,
        hasCanvas: !!canvasRef.current
      });
      return;
    }
    
    setIsCapturing(true);
    setCurrentPhotoIndex(0);
    
    // Create array to hold all photos
    const capturedPhotos: string[] = [];

    for (let i = 0; i < PHOTO_COUNT; i++) {
      setCurrentPhotoIndex(i);
      
      console.log(`Starting photo ${i + 1}/${PHOTO_COUNT}`);
      
      // Countdown
      await showCountdown(i);
      
      // Wait a tiny bit after countdown for stability
      await delay(100);
      
      // Capture photo
      const photo = captureVideoFrame(videoRef.current, canvasRef.current, { isBW });
      console.log(`Photo ${i + 1} captured:`, photo ? 'Success' : 'FAILED');
      
      if (photo) {
        capturedPhotos.push(photo);
        // Update state immediately with current photos
        const updatedPhotos = [...capturedPhotos];
        while (updatedPhotos.length < PHOTO_COUNT) {
          updatedPhotos.push(null);
        }
        setPhotos(updatedPhotos);
      } else {
        console.error(`Failed to capture photo ${i + 1}`);
      }
      
      // Flash effect
      triggerFlash(i);
      
      // Delay before next photo
      if (i < PHOTO_COUNT - 1) {
        await delay(CAPTURE_DELAY_MS);
      }
    }

    console.log(`Capture complete! Total photos: ${capturedPhotos.length}`);
    setIsCapturing(false);
    await delay(500);
    
    // Only go to frame selection if we have photos
    if (capturedPhotos.length > 0) {
      cleanupCamera();
      setCurrentScreen('frameSelection');
    } else {
      console.error('No photos captured! Staying on booth screen');
      setIsCapturing(false);
    }
  }, [isCapturing, stream, isBW, cleanupCamera]);

  // Countdown animation
  const showCountdown = async (photoIndex: number): Promise<void> => {
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
        flashEl.style.opacity = '0';
      }, FLASH_DURATION_MS);
    }
  };

  // Upload photos
  const handleUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []).slice(0, PHOTO_COUNT);
    if (files.length === 0) return;

    const newPhotos = [...photos];
    let loadedCount = 0;

    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        newPhotos[index] = result;
        loadedCount++;
        
        if (loadedCount === files.length) {
          setPhotos(newPhotos);
          setTimeout(() => {
            cleanupCamera();
            setCurrentScreen('frameSelection');
          }, 300);
        }
      };
      reader.readAsDataURL(file);
    });

    event.target.value = '';
  }, [photos, cleanupCamera]);

  // Frame selection
  const handleFrameChange = useCallback((index: number) => {
    setCurrentFrameIndex(index);
  }, []);

  const handleSelectFrame = useCallback(async () => {
    setCurrentScreen('result');
    setShowFinalKiosk(false);
    setShowPrinting(true);
    
    await delay(PRINTING_ANIMATION_MS);
    
    setShowPrinting(false);
    setShowFinalKiosk(true);
    
    // Apply initial filter (none)
    applyFilter('none');
  }, [applyFilter]);

  // Filter application
  const applyFilter = useCallback((filterName: FilterName) => {
    setCurrentFilter(filterName);
    
    batchFilterImages(photos, filterName, (results) => {
      setFilteredPhotos(results);
    });
  }, [photos]);

  // Download
  const handleDownload = useCallback(() => {
    const photosToDownload = filteredPhotos.some(p => p !== null) ? filteredPhotos : photos;
    downloadCompositeImage(photosToDownload, selectedTemplate);
  }, [filteredPhotos, photos, selectedTemplate]);

  // Modal
  const handleImageClick = useCallback((src: string) => {
    setModalImage(src);
    setModalOpen(true);
  }, []);

  return (
    <div className="w-full h-screen overflow-hidden bg-white">
      <canvas ref={canvasRef} className="hidden" />

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
          onBWToggle={toggleBW}
          onRecordClick={startPhotoSession}
          onUpload={handleUpload}
          onHome={goHome}
          recordDisabled={!stream || isCapturing}
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
          photos={filteredPhotos.some(p => p !== null) ? filteredPhotos : photos}
          showPrinting={showPrinting}
          showFinalKiosk={showFinalKiosk}
          currentFilter={currentFilter}
          onFilterChange={applyFilter}
          onDownload={handleDownload}
          onRetake={goToBooth}
          onHome={goHome}
          onImageClick={handleImageClick}
        />
      )}

      <Modal
        isOpen={modalOpen}
        imageSrc={modalImage}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
