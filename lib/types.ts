// Type definitions for Photo Booth application

export type Screen = 'home' | 'templateSelection' | 'booth' | 'frameSelection' | 'result';

export type FilterName = 'none' | 'bw' | 'warm' | 'cool' | 'vintage' | 'bold';

export type FrameShape = 'heart' | 'circle' | 'polaroid' | 'rectangle';

export type FrameType = 'heart-pink' | 'circle-black' | 'polaroid-white' | 'polaroid-orange' | 'bold-black' | 'dark-elegant';

export interface Photo {
  id: number;
  dataUrl: string | null;
  capturedAt: number;
}

export interface Frame {
  id: FrameType;
  name: string;
  price: number;
  shape: FrameShape;
  borderColor: string;
  borderWidth: number;
  backgroundColor: string;
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
  isCameraReady: boolean;
  cameraError: string | null;
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
  selectedFrame: Frame;
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
