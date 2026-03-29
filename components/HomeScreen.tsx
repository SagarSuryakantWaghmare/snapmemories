'use client';

interface HomeScreenProps {
  onEnter: () => void;
}

export default function HomeScreen({ onEnter }: HomeScreenProps) {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center gap-4 md:gap-6 p-4 bg-bg overflow-hidden">
      {/* Title */}
      <h1
        className="text-center"
        style={{
          fontFamily: "'Caveat', cursive",
          fontSize: 'clamp(2rem, 6vw, 3.5rem)',
          color: '#111',
          fontWeight: 700,
          letterSpacing: '2px',
        }}
      >
        MY SKETCH BOOTH
      </h1>

      {/* Subtitle */}
      <p
        className="text-center max-w-xs"
        style={{
          fontFamily: "'Patrick Hand', cursive",
          fontSize: 'clamp(0.9rem, 3vw, 1.1rem)',
          color: '#333',
          lineHeight: 1.5,
        }}
      >
        Free vintage photo booth — take 4 snaps, get your strip!
      </p>

      {/* SVG Booth Icon */}
      <svg
        width="200"
        height="240"
        viewBox="0 0 240 290"
        className="my-2 md:my-4"
        style={{ maxHeight: '35vh' }}
        onClick={onEnter}
      >
        <rect x="30" y="60" width="180" height="210" fill="none" stroke="#111" strokeWidth="3" />
        <rect x="55" y="85" width="130" height="160" fill="#f0eeeb" stroke="#111" strokeWidth="2" />
        <circle cx="120" cy="55" r="18" fill="none" stroke="#111" strokeWidth="2" />
        <circle cx="120" cy="55" r="12" fill="none" stroke="#111" strokeWidth="1.5" />
        <rect x="145" y="40" width="25" height="15" fill="none" stroke="#111" strokeWidth="1.5" rx="2" />
        <path d="M 80 110 L 90 100 L 150 100 L 160 110" fill="none" stroke="#111" strokeWidth="1.5" />
        <circle cx="200" cy="140" r="6" fill="none" stroke="#111" strokeWidth="1.5" />
        <circle cx="200" cy="165" r="6" fill="none" stroke="#111" strokeWidth="1.5" />
        <circle cx="200" cy="190" r="6" fill="none" stroke="#111" strokeWidth="1.5" />
        <line x1="55" y1="270" x2="40" y2="290" stroke="#111" strokeWidth="2" />
        <line x1="185" y1="270" x2="200" y2="290" stroke="#111" strokeWidth="2" />
      </svg>

      {/* Enter Button */}
      <button
        onClick={onEnter}
        className="mt-6 px-10 py-3 bg-ink text-bg font-bold rounded-lg hover:shadow-lg active:shadow-none transition-shadow"
        style={{
          fontFamily: "'Caveat', cursive",
          fontSize: 'clamp(1.1rem, 4vw, 1.4rem)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
      >
        ENTER
      </button>

    </div>
  );
}
  