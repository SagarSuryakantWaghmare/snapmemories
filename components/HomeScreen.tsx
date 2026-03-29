'use client';

interface HomeScreenProps {
  onEnter: () => void;
}

export default function HomeScreen({ onEnter }: HomeScreenProps) {
  return (
    <div className="screen-active min-h-screen w-full flex flex-col items-center justify-center gap-6 p-4 md:p-8">
      {/* Title */}
      <h1 className="font-caveat text-5xl md:text-6xl font-bold text-ink text-center leading-tight -tracking-tighter">
        mysketchbooth
      </h1>

      {/* Subtitle */}
      <p className="font-patrick text-lg text-ink2 text-center max-w-sm leading-relaxed">
        A free vintage online photobooth — take 4 snaps, get your strip!
      </p>

      {/* SVG Booth Illustration */}
      <svg
        className="w-48 md:w-72 h-auto cursor-pointer transition-transform duration-200 hover:scale-104 hover:-rotate-1 drop-shadow-lg"
        onClick={onEnter}
        viewBox="0 0 240 290"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        {/* body */}
        <rect x="20" y="50" width="200" height="210" rx="14" fill="#fff" stroke="#111" strokeWidth="4" />
        {/* top banner */}
        <rect x="20" y="50" width="200" height="40" rx="14" fill="#111" />
        <rect x="20" y="74" width="200" height="16" fill="#111" />
        <text
          x="120"
          y="77"
          fontFamily="Caveat,cursive"
          fontSize="17"
          fontWeight="700"
          fill="#fff"
          textAnchor="middle"
        >
          PHOTO BOOTH
        </text>
        {/* inner frame */}
        <rect x="34" y="102" width="172" height="120" rx="6" fill="#111" stroke="#111" strokeWidth="3" />
        {/* 2x2 grid */}
        <rect x="36" y="104" width="83" height="57" rx="2" fill="#2a2a2a" />
        <rect x="121" y="104" width="83" height="57" rx="2" fill="#333" />
        <rect x="36" y="163" width="83" height="57" rx="2" fill="#e8e5e0" stroke="#ccc" strokeWidth="1.5" />
        <rect x="121" y="163" width="83" height="57" rx="2" fill="#e8e5e0" stroke="#ccc" strokeWidth="1.5" />
        <text x="77" y="197" fontFamily="sans-serif" fontSize="20" fill="#bbb" textAnchor="middle">
          +
        </text>
        <text x="162" y="197" fontFamily="sans-serif" fontSize="20" fill="#bbb" textAnchor="middle">
          +
        </text>
        {/* coin slot */}
        <rect x="90" y="234" width="60" height="14" rx="7" fill="#e0dcd4" stroke="#111" strokeWidth="2" />
        <rect x="112" y="238" width="16" height="4" rx="2" fill="#111" />
        {/* base */}
        <rect x="30" y="252" width="180" height="6" rx="3" fill="#ccc" stroke="#111" strokeWidth="1.5" />
        {/* legs */}
        <rect x="55" y="256" width="14" height="26" rx="3" fill="#111" />
        <rect x="171" y="256" width="14" height="26" rx="3" fill="#111" />
        {/* $0 badge */}
        <circle cx="196" cy="150" r="22" fill="#fff" stroke="#111" strokeWidth="3" />
        <text x="196" y="147" fontFamily="Caveat,cursive" fontSize="11" fontWeight="700" fill="#111" textAnchor="middle">
          $0
        </text>
        <text x="196" y="160" fontFamily="Caveat,cursive" fontSize="9" fill="#111" textAnchor="middle">
          4 pics
        </text>
      </svg>

      {/* ENTER Button */}
      <button
        onClick={onEnter}
        className="font-caveat text-2xl font-bold bg-ink text-white border-none px-12 py-3 rounded cursor-pointer shadow-lg transition-all duration-100 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-px active:shadow-md"
        style={{
          boxShadow: '4px 4px 0 #555',
          letterSpacing: '1px',
        }}
        onMouseDown={(e) => {
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '2px 2px 0 #555';
        }}
        onMouseUp={(e) => {
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '4px 4px 0 #555';
        }}
      >
        ENTER
      </button>

      {/* Footer Note */}
      <p className="font-patrick text-sm text-gray-500">
        no sign-up · free forever · works everywhere
      </p>

      {/* Copyright */}
      <footer className="text-center font-patrick text-xs text-gray-400 mt-8">
        © 2025 Sagar Suryakant Waghmare. All rights reserved.
      </footer>
    </div>
  );
}
