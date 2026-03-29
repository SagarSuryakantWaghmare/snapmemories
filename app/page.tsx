'use client';

import { useState, useEffect, useRef } from 'react';
import HomeScreen from '@/components/HomeScreen';
import BoothScreen from '@/components/BoothScreen';
import ResultScreen from '@/components/ResultScreen';
import Modal from '@/components/Modal';
import { captureVideoFrame, downloadCompositeImage, delay } from '@/utils/canvas';
import { filterImageData, applyFilterToCanvas, type FilterName } from '@/utils/filters';

type Screen = 'home' | 'booth' | 'result';

export default function Home() {
  // Navigation
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');

  // State
  const [photos, setPhotos] = useState<(string | null)[]>([null, null, null, null]);
  const [filteredPhotos, setFilteredPhotos] = useState<(string | null)[]>([null, null, null, null]);
  const [isBW, setIsBW] = useState(false);
  const [shooting, setShooting] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<FilterName>('none');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [showPrinting, setShowPrinting] = useState(false);
  const [showFinalKiosk, setShowFinalKiosk] = useState(false);
  const [showActionRow, setShowActionRow] = useState(false);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cellRefsArray = useRef<HTMLDivElement[]>([]);

  // Camera setup
  useEffect(() => {
    if (currentScreen === 'booth') {
      startCamera();
    }
    return () => {
      if (currentScreen !== 'booth') {
        stopCamera();
      }
    };
  }, [currentScreen]);

  async function startCamera() {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 1280, height: 960 },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (e) {
      console.warn('Camera not available:', e);
    }
  }

  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }

  // Navigation
  function goHome() {
    stopCamera();
    resetAll();
    setCurrentScreen('home');
  }

  function goToBooth() {
    resetAll();
    setCurrentScreen('booth');
  }

  // Toggle B&W
  function toggleBW(checked: boolean) {
    setIsBW(checked);
    if (videoRef.current) {
      videoRef.current.style.filter = checked ? 'grayscale(1) contrast(1.1)' : '';
    }
  }

  // Reset all
  function resetAll() {
    setPhotos([null, null, null, null]);
    setFilteredPhotos([null, null, null, null]);
    setShooting(false);
    setIsBW(false);
    setCurrentFilter('none');
    setShowPrinting(false);
    setShowFinalKiosk(false);
    setShowActionRow(false);
  }

  // Photo capture workflow
  async function startSession() {
    if (shooting) return;
    setShooting(true);
    setPhotos([null, null, null, null]);

    // Reset cells 1-3 to empty
    const newPhotos = [null, null, null, null];

    for (let i = 0; i < 4; i++) {
      // Move live view to cell i
      if (i > 0) {
        moveLiveToCell(i);
      }

      // Countdown
      await countdownInCell(i, 3);

      // Capture
      const captured = captureCell(i);
      if (captured) {
        newPhotos[i] = captured;
      }

      // Flash animation
      triggerFlash(i);

      // Wait before next shot
      await delay(700);
    }

    setPhotos(newPhotos);
    setShooting(false);
    await delay(300);
    await showResult();
  }

  function moveLiveToCell(index: number) {
    // Video already tracks; just update visual indication
    if (videoRef.current && cellRefsArray.current[index]) {
      const cell = cellRefsArray.current[index];
      if (!cell.querySelector('video')) {
        const video = document.createElement('video');
        video.autoplay = true;
        video.playsInline = true;
        video.muted = true;
        video.style.cssText =
          'width:100%;height:100%;object-fit:cover;display:block;transform:scaleX(-1)';
        if (isBW) {
          video.style.filter = 'grayscale(1) contrast(1.1)';
        }
        if (stream) {
          video.srcObject = stream;
        }
        cell.appendChild(video);
      }
    }
  }

  function countdownInCell(index: number, secs: number): Promise<void> {
    return new Promise((resolve) => {
      const el = document.getElementById(`cdown-${index}`);
      if (!el) {
        resolve();
        return;
      }
      let n = secs;
      el.textContent = String(n);
      el.classList.add('show');
      const interval = setInterval(() => {
        n--;
        if (n <= 0) {
          clearInterval(interval);
          el.classList.remove('show');
          resolve();
        } else {
          el.textContent = String(n);
        }
      }, 1000);
    });
  }

  function captureCell(index: number): string | null {
    if (!videoRef.current || !canvasRef.current) return null;
    const url = captureVideoFrame(videoRef.current, canvasRef.current, { isBW });
    return url;
  }

  function triggerFlash(index: number) {
    const el = document.getElementById(`flash-${index}`);
    if (el) {
      el.classList.add('flashing');
      setTimeout(() => el.classList.remove('flashing'), 120);
    }
  }

  // Show result
  async function showResult() {
    stopCamera();
    setCurrentScreen('result');
    setShowFinalKiosk(false);
    setShowActionRow(false);
    setShowPrinting(true);

    await delay(1800);

    setShowPrinting(false);
    applyFilter('none');
    setShowFinalKiosk(true);
    setShowActionRow(true);
  }

  // Upload photos
  function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []).slice(0, 4);
    let done = 0;
    const newPhotos = [...photos];

    files.forEach((file, idx) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        newPhotos[idx] = result;
        done++;
        if (done === files.length) {
          setPhotos(newPhotos);
          setTimeout(() => showResult(), 600);
        }
      };
      reader.readAsDataURL(file);
    });
    event.target.value = '';
  }

  // Apply filters
  function applyFilter(filterName: FilterName, btn?: HTMLButtonElement) {
    setCurrentFilter(filterName);
    if (btn) {
      document.querySelectorAll('.filter-chip').forEach((c) => c.classList.remove('active'));
      btn.classList.add('active');
    }

    const newFiltered = [...filteredPhotos];
    photos.forEach((photo, i) => {
      if (!photo) {
        newFiltered[i] = null;
        return;
      }
      filterImageData(photo, filterName, (result) => {
        newFiltered[i] = result;
        setFilteredPhotos([...newFiltered]);
      });
    });
  }

  // Get cells for render
  const cells = photos.map((src, i) => ({
    type: (src ? 'filled' : currentScreen === 'booth' && i === 0 ? 'live' : 'empty') as
      | 'live'
      | 'empty'
      | 'filled',
    src: src || undefined,
    index: i,
  }));

  return (
    <>
      <canvas ref={canvasRef} className="hidden" />

      {currentScreen === 'home' && <HomeScreen onEnter={goToBooth} />}

      {currentScreen === 'booth' && (
        <BoothScreen
          isBW={isBW}
          onBWToggle={toggleBW}
          onRecordClick={startSession}
          onUpload={handleUpload}
          onHome={goHome}
          recordDisabled={shooting || !stream}
          videoRef={videoRef}
          cells={cells}
          cellRefs={cellRefsArray}
        />
      )}

      {currentScreen === 'result' && (
        <ResultScreen
          photos={filteredPhotos.map((f, i) => f || photos[i])}
          showPrinting={showPrinting}
          showFinalKiosk={showFinalKiosk}
          showActionRow={showActionRow}
          currentFilter={currentFilter}
          onFilterClick={(filter, el) => applyFilter(filter as FilterName, el)}
          onDownload={() => downloadCompositeImage(filteredPhotos.map((f, i) => f || photos[i]))}
          onRetake={goToBooth}
          onHome={goHome}
          onImageClick={(src) => {
            setModalImage(src);
            setModalOpen(true);
          }}
        />
      )}

      <Modal isOpen={modalOpen} imageSrc={modalImage} onClose={() => setModalOpen(false)} />
    </>
  );
}
