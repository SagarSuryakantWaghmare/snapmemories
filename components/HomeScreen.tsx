'use client';

interface HomeScreenProps {
  onEnter: () => void;
}

export default function HomeScreen({ onEnter }: HomeScreenProps) {
  return (
    <div className="w-screen h-screen bg-bg overflow-hidden flex flex-col">
      <style>{`
        @keyframes wave {
          0%, 100% { transform: translateY(0px); }
          25% { transform: translateY(-8px); }
          50% { transform: translateY(0px); }
          75% { transform: translateY(8px); }
        }
        .curtain-wave {
          animation: wave 4s ease-in-out infinite;
        }
        .curtain-wave-1 { animation-delay: 0s; }
        .curtain-wave-2 { animation-delay: 0.3s; }
        .curtain-wave-3 { animation-delay: 0.6s; }
        .curtain-wave-4 { animation-delay: 0.9s; }
        .curtain-wave-5 { animation-delay: 1.2s; }
      `}</style>

      {/* Top Title Bar */}
      <div className="h-24 flex items-center justify-center border-4 border-ink bg-white flex-shrink-0">
        <h1
          style={{
            fontFamily: "'Caveat', cursive",
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#111',
            letterSpacing: '3px',
          }}
        >
          PHOTOBOOTH
        </h1>
      </div>

      {/* Main Content Section */}
      <div className="flex-1 flex items-center justify-center gap-8 px-8 overflow-hidden">
        
        {/* LEFT SIDE: Featured Strips */}
        <div className="flex-shrink-0">
          <div className="border-4 border-ink rounded-lg bg-white p-3" style={{ width: '140px', height: '280px' }}>
            <p
              className="text-xs text-center mb-2 text-ink2"
              style={{ fontFamily: "'Patrick Hand', cursive" }}
            >
              featured
              <br />
              strips
            </p>
            {/* 5 vertical strips */}
            <div className="flex gap-2 h-full">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex-1 border-2 border-gray-border rounded bg-gray-100 flex flex-col gap-1 p-1"
                >
                  {[0, 1, 2].map((j) => (
                    <div
                      key={j}
                      className="flex-1 bg-gray-300 rounded border border-gray-400"
                    ></div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER: Booth & Button */}
        <div className="flex flex-col items-center gap-6 flex-shrink-0">
          {/* Person Illustration */}
          <svg
            width="160"
            height="240"
            viewBox="0 0 160 280"
            onClick={onEnter}
            style={{ cursor: 'pointer' }}
          >
            {/* Head */}
            <circle cx="80" cy="40" r="20" fill="none" stroke="#111" strokeWidth="2" />
            {/* Eyes */}
            <circle cx="74" cy="38" r="2" fill="#111" />
            <circle cx="86" cy="38" r="2" fill="#111" />
            {/* Smile */}
            <path d="M 74 42 Q 80 45 86 42" fill="none" stroke="#111" strokeWidth="1.5" />
            {/* Body (shirt) */}
            <rect x="65" y="63" width="30" height="40" fill="none" stroke="#111" strokeWidth="2" rx="3" />
            {/* Arms */}
            <path d="M 65 75 L 40 90" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 95 75 L 120 90" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" />
            {/* Hands */}
            <circle cx="38" cy="92" r="4" fill="#111" />
            <circle cx="122" cy="92" r="4" fill="#111" />
            {/* Pants */}
            <rect x="70" y="105" width="8" height="50" fill="none" stroke="#111" strokeWidth="2" />
            <rect x="82" y="105" width="8" height="50" fill="none" stroke="#111" strokeWidth="2" />
            {/* Shoes */}
            <ellipse cx="74" cy="160" rx="6" ry="4" fill="#111" />
            <ellipse cx="86" cy="160" rx="6" ry="4" fill="#111" />
            {/* Legs extension */}
            <path d="M 74 155 Q 70 180 60 200" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" />
            <path d="M 86 155 Q 90 180 100 200" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" />
          </svg>

          {/* Enter Button */}
          <button
            onClick={onEnter}
            className="px-8 py-3 bg-white border-4 border-ink rounded font-bold hover:shadow-lg active:shadow-none transition-shadow"
            style={{
              fontFamily: "'Caveat', cursive",
              fontSize: '1.3rem',
              color: '#111',
              boxShadow: '3px 3px 0 #111',
            }}
          >
            enter →
          </button>
        </div>

        {/* RIGHT SIDE: Animated Curtains */}
        <div className="flex gap-4 flex-shrink-0 h-80">
          {[1, 2, 3, 4, 5].map((i) => (
            <svg
              key={i}
              width="24"
              height="320"
              viewBox="0 0 24 320"
              className={`curtain-wave curtain-wave-${i}`}
              style={{
                filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.1))',
              }}
            >
              {/* Wavy curtain lines */}
              <path
                d="M 6 0 Q 12 10 6 20 Q 0 30 6 40 Q 12 50 6 60 Q 0 70 6 80 Q 12 90 6 100 Q 0 110 6 120 Q 12 130 6 140 Q 0 150 6 160 Q 12 170 6 180 Q 0 190 6 200 Q 12 210 6 220 Q 0 230 6 240 Q 12 250 6 260 Q 0 270 6 280 Q 12 290 6 300 Q 0 310 6 320"
                fill="none"
                stroke="#111"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M 18 0 Q 24 10 18 20 Q 12 30 18 40 Q 24 50 18 60 Q 12 70 18 80 Q 24 90 18 100 Q 12 110 18 120 Q 24 130 18 140 Q 12 150 18 160 Q 24 170 18 180 Q 12 190 18 200 Q 24 210 18 220 Q 12 230 18 240 Q 24 250 18 260 Q 12 270 18 280 Q 24 290 18 300 Q 12 310 18 320"
                fill="none"
                stroke="#111"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ))}
        </div>
      </div>
    </div>
  );
}
