// Type definitions for Photo Booth application

export type Screen = 'home' | 'booth' | 'frameSelection' | 'result';

export type FilterName = 'none' | 'bw' | 'warm' | 'cool' | 'vintage' | 'bold';

export type FrameType = 'classic' | 'modern' | 'vintage' | 'polaroid';

export interface Photo {
  id: number;
  dataUrl: string | null;
  capturedAt: number;
}

export interface Frame {
  id: FrameType;
  name: string;
  price: number;
}

export interface CaptureOptions {
  isBW?: boolean;
}

export interface CameraState {
  stream: MediaStream | null;
  isActive: boolean;
  error: string | null;
}

export interface BoothScreenProps {
  isBW: boolean;
  onBWToggle: (checked: boolean) => void;
  onRecordClick: () => void;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onHome: () => void;
  recordDisabled: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  photos: (string | null)[];
  currentPhotoIndex: number;
  isCapturing: boolean;
}

export interface HomeScreenProps {
  onEnter: () => void;
}

export interface FrameSelectionProps {
  photos: (string | null)[];
  currentFrameIndex: number;
  onFrameChange: (index: number) => void;
  onSelectFrame: () => void;
  onHome: () => void;
}

export interface ResultScreenProps {
  photos: (string | null)[];
  showPrinting: boolean;
  showFinalKiosk: boolean;
  currentFilter: FilterName;
  onFilterChange: (filter: FilterName) => void;
  onDownload: () => void;
  onRetake: () => void;
  onHome: () => void;
  onImageClick: (src: string) => void;
}

export interface ModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  onClose: () => void;
}
