# MySketchBooth → Next.js + Tailwind CSS Conversion Prompt

**Copy the entire section below and paste into your AI assistant (Claude, ChatGPT, etc.)**

---

## COMPREHENSIVE BUILD PROMPT

You are building a **pixel-perfect Next.js + Tailwind CSS version** of MySketchBooth photo booth web app. The design, layout, animations, and functionality must be **100% identical** to the original HTML/CSS/JS implementation. No features omitted, no shortcuts.

### PROJECT SETUP & CONFIG

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS v3.4+
- **Language**: TypeScript (`.tsx`)
- **State**: React Hooks (`useState`, `useEffect`, `useRef`)
- **No backend needed**: Fully client-side, browser-based
- **No external APIs**: Canvas, MediaDevices (getUserMedia), File API only

---

## EXACT COLOR PALETTE & FONTS

Use these CSS custom properties in your Tailwind config:

```
--bg: #f0eeeb          (cream/beige background)
--white: #ffffff       (white)
--ink: #111111         (dark ink black)
--ink2: #333333        (medium gray-black)
--gray-border: #c8c4be (light tan border)
--gray-slot: #e8e5e0   (light slot gray)
--red: #e03030         (bright red for buttons)
--green: #2d9e4f       (not used, but leave available)

Font families:
- Caveat (serif/cursive) for headings, buttons, big text
- Patrick Hand (serif/cursive) for body text, descriptions
```

**Import fonts**: Use Google Fonts Link in `app/layout.tsx`:
```html
<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Patrick+Hand&display=swap" rel="stylesheet">
```

In `tailwind.config.ts`:
```js
theme: {
  extend: {
    colors: {
      bg: '#f0eeeb',
      ink: '#111111',
      ink2: '#333333',
      'gray-border': '#c8c4be',
      'gray-slot': '#e8e5e0',
      accent: '#e03030',
      green: '#2d9e4f',
    },
    fontFamily: {
      caveat: ['Caveat', 'cursive'],
      patrick: ['Patrick Hand', 'cursive'],
    },
  },
}
```

---

## ARCHITECTURE & COMPONENT STRUCTURE

Build as **one main `app/page.tsx`** with internal components, OR modularize as:
- `components/HomeScreen.tsx`
- `components/BoothScreen.tsx`
- `components/ResultScreen.tsx`
- `components/Modal.tsx`
- `utils/filters.ts` (filter logic)
- `utils/canvas.ts` (canvas capture logic)

**Preference**: Keep in single `page.tsx` for simplicity; refactor internals as needed.

---

## GLOBAL STATE (React Hooks)

In `app/page.tsx`, maintain these state variables:

```typescript
const [currentScreen, setCurrentScreen] = useState<'home' | 'booth' | 'result'>('home');
const [photos, setPhotos] = useState<(string | null)[]>([null, null, null, null]);
const [filteredPhotos, setFilteredPhotos] = useState<(string | null)[]>([null, null, null, null]);
const [isBW, setIsBW] = useState(false);
const [shooting, setShooting] = useState(false);
const [currentFilter, setCurrentFilter] = useState<'none' | 'bw' | 'warm' | 'cool' | 'vintage' | 'bold'>('none');
const [stream, setStream] = useState<MediaStream | null>(null);
const [showPrinting, setShowPrinting] = useState(false);
const [showFinalKiosk, setShowFinalKiosk] = useState(false);
const [showActionRow, setShowActionRow] = useState(false);

// Refs
const videoRef = useRef<HTMLVideoElement>(null);
const canvasRef = useRef<HTMLCanvasElement>(null);
const fileInputRef = useRef<HTMLInputElement>(null);
```

---

## SCREEN 1: HOME SCREEN

**Layout**: Centered flex column, full viewport height.

**Content (top to bottom)**:
1. **Title**: "mysketchbooth" 
   - Font: Caveat, clamp(2.4rem, 8vw, 4.2rem), weight 700
   - Letter-spacing: -1px
   - Color: var(--ink)

2. **Subtitle**: "A free vintage online photobooth — take 4 snaps, get your strip!"
   - Font: Patrick Hand, 1.05rem
   - Color: var(--ink2)
   - Max-width: 340px
   - Text-align: center
   - Line-height: 1.5

3. **SVG Booth Illustration**:
   - Width: clamp(200px, 50vw, 300px)
   - Cursor: pointer
   - Transition: transform 0.2s
   - Filter: drop-shadow(3px 5px 0 rgba(0,0,0,0.12))
   - **On hover**: transform scale(1.04) rotate(-1deg)
   - **On click**: `goToBooth()`
   - **SVG Content**: Hand-drawn photo booth kiosk with label "$0 4 pics" (use provided SVG)

4. **ENTER Button**:
   - Font: Caveat, 1.6rem, weight 700
   - Background: var(--ink)
   - Color: white
   - Border-radius: 4px
   - Padding: 0.6rem 3rem
   - Box-shadow: 4px 4px 0 #555
   - Transition: transform 0.12s, box-shadow 0.12s
   - Letter-spacing: 1px
   - **On hover**: transform translate(-2px,-2px), box-shadow: 6px 6px 0 #555
   - **On active**: transform translate(1px,1px), box-shadow: 2px 2px 0 #555
   - **On click**: `goToBooth()`

5. **Footer Note**: "no sign-up · free forever · works everywhere"
   - Font: Patrick Hand, 0.8rem
   - Color: #888

6. **Copyright Footer**: "© 2025 Sagar Suryakant Waghmare. All rights reserved."
   - Font: Patrick Hand, 0.78rem
   - Color: #999

**Animations**: 
- Screen transition: Fade in + slide up (0.35s)
- Each child staggered: fadeUp animation with delays (0.07s, 0.13s, 0.19s, 0.24s, 0.3s)

---

## SCREEN 2: BOOTH SCREEN

### Layout Structure
- Full-height flex column
- Background: var(--bg)
- Padding: 1.4rem 1rem 2rem
- Gap: 1rem

### Components (top to bottom):

#### A. TOP BAR
- Width: 100%, max-width: 680px
- Flex row, space-between
- Left: Logo text "mysketchbooth" (Caveat, 1.5rem, weight 700, cursor pointer)
  - **On hover**: opacity 0.65
  - **On click**: `goHome()`
- Right: Price badge (hand-drawn uneven circle)
  - Width/Height: 62px
  - Border: 3px solid var(--ink)
  - Border-radius: 55% 45% 50% 50% / 50% 55% 45% 50% (organic feel)
  - Background: var(--white)
  - Flex col, center content
  - Inside: "$0" (1.1rem) + "= 4 pics" (0.75rem, Patrick Hand)

#### B. MAIN BOOTH LAYOUT
- Width: 100%, max-width: 680px
- Flex row, wrap, center
- Gap: 1.2rem

##### LEFT: KIOSK BOX

**Outer container**:
- Position: relative
- Background: var(--white)
- Border: 4px solid var(--ink)
- Border-radius: 18px
- Padding: 12px
- Width: clamp(280px, 58vw, 400px)
- Box-shadow: 6px 6px 0 var(--ink)

**Eye-level annotation** (positioned absolute):
- Position: absolute, left: -90px, top: 50%, translateY(-50%)
- Font: Caveat, 1rem, weight 700
- Display: inline flex, gap: 4px
- Text: "eye\nlevel" + arrow SVG (28x18)
- **@media (max-width: 520px)**: display: none

**Inner grid (kiosk-inner)**:
- Border: 3px solid var(--ink)
- Border-radius: 10px
- Overflow: hidden
- Background: var(--ink) #111111
- Display: CSS Grid (2 cols, 2 rows)
- Grid-template-columns: 1fr 1fr
- Grid-template-rows: 1fr 1fr
- Gap: 3px
- Aspect-ratio: 4/3.2

**Grid Cells** (4 total):
Each `.grid-cell` has 3 states:

**State 1: LIVE (cell 0 during capture)**
- Background: #1a1a1a
- Position: relative
- Overflow: hidden
- Display: flex, center content
- Contains: `<video>` element + flash-cell div + countdown div
- Video styling:
  - Width/Height: 100%
  - Object-fit: cover
  - Transform: scaleX(-1) (mirror)

**State 2: EMPTY (before capture)**
- Background: var(--gray-slot) #e8e5e0
- Border: 2px dashed var(--gray-border)
- Display: flex, center
- Contains: `<div class="plus-label">`
  - Plus icon: font-size 1.8rem, color #bbb
  - Text: color #aaa, Patrick Hand, 0.85rem
  - Example: "+" + "Picture 2"

**State 3: FILLED (after capture)**
- Background: #1a1a1a
- Contains: `<img>` with src (captured photo)
- Image: width/height 100%, object-fit cover

**Flash overlay**:
- Position: absolute, inset: 0
- Background: white
- Opacity: 0 (default)
- Transition: opacity 0.05s
- On flash: opacity 1

**Countdown number**:
- Position: absolute, inset: 0
- Display: flex, center
- Font: Caveat, 4rem, weight 700
- Color: white, text-shadow: 2px 2px 8px rgba(0,0,0,0.7)
- Opacity: 0 (hidden)
- On show: opacity 1

##### RIGHT: RECORD BUTTON + LABEL

**Record button wrapper**:
- Flex col, center, gap: 4px

**Record outer button**:
- Width: 68px
- Background: var(--white)
- Border: 3.5px solid var(--ink)
- Border-radius: 10px
- Padding: 10px 0
- Display: flex col, center, gap: 10px
- Cursor: pointer
- Box-shadow: 4px 4px 0 var(--ink)
- Transition: transform 0.12s, box-shadow 0.12s
- **On hover**: transform translate(-2px,-2px), box-shadow: 6px 6px 0 var(--ink)
- **On active**: transform translate(2px,2px), box-shadow: 2px 2px 0 var(--ink)
- **When disabled**: opacity 0.45, cursor not-allowed, transform none

**Inside button**:
1. **Red circle**: 34x34px, background: var(--red) #e03030, border-radius: 50%, border: 2px solid var(--ink), box-shadow: 0 0 8px rgba(224,48,48,0.5)
2. **Black bar**: 18x22px, background: var(--ink), border-radius: 2px

**Label below button**:
- Font: Patrick Hand, 0.75rem
- Color: var(--ink2)
- Text: "Press to\nstart"
- Text-align: center

#### C. B&W TOGGLE

- Display: flex, center, gap: 1rem
- Font: Caveat, 1.15rem, weight 600
- Color: var(--ink)
- Contains: "b&w" text + toggle switch + "color" text

**Toggle switch (sketch-toggle)**:
- Position: relative
- Width: 58px, Height: 30px
- Cursor: pointer
- Flex-shrink: 0

**Track**:
- Position: absolute, inset: 0
- Border: 3px solid var(--ink)
- Border-radius: 999px
- Background: var(--gray-slot)
- Transition: background 0.2s

**Thumb**:
- Position: absolute, top: 3px, left: 3px
- Width/Height: 20px
- Background: var(--ink)
- Border-radius: 50%
- Transition: transform 0.2s

**Checked state**:
- Track background: #d0f0da (light green)
- Thumb transform: translateX(28px)

#### D. OR DIVIDER

- Display: flex, center, gap: 8px
- Font: Patrick Hand, 0.8rem, color: #999
- Text: "or"
- **Before/After**: `::before` and `::after` pseudo-elements
  - Content: ''
  - Flex: 1
  - Height: 1px
  - Background: #ccc

#### E. UPLOAD BUTTON

- Border: 2.5px dashed var(--ink)
- Border-radius: 8px
- Background: transparent
- Font: Patrick Hand, 0.9rem
- Color: var(--ink2)
- Padding: 0.5rem 1.2rem
- Cursor: pointer
- Width: 100%, max-width: 400px
- Transition: background 0.15s
- **On hover**: background: rgba(0,0,0,0.05)
- **On click**: trigger file input
- Text: "Upload photos from your device"

**File input**:
- Hidden
- Accept: image/*
- Multiple: true
- On change: `handleUpload(event)`

#### F. STEPS SECTION

- Width: 100%, max-width: 680px
- Display: flex (horizontal)
- Background: var(--white)
- Border: 3.5px solid var(--ink)
- Border-radius: 18px
- Overflow: hidden
- Box-shadow: 5px 5px 0 var(--ink)

**Each step** (3 total):
- Flex: 1
- Padding: 1rem 0.9rem
- Border-right: 2.5px solid var(--ink) (except last)
- Font: Patrick Hand, 0.88rem
- Color: var(--ink)
- Line-height: 1.45

**Step number**:
- Font: Caveat, 1.6rem, weight 700
- Display: block
- Margin-bottom: 2px

**Content**:
1. "Choose b&w or color filters with the toggle switch"
2. "Position yourself at eye level and click the red button"
3. "Press the red button to take photos and wait for them to be printed"

**@media (max-width: 520px)**:
- Flex-direction: column
- Border-right: none on steps
- Border-bottom: 2px solid var(--ink) instead (except last)
- Border-radius: 12px

---

## SCREEN 3: RESULT SCREEN

### Layout
- Full-height flex column
- Background: var(--bg)
- Padding: 1.5rem 1rem 2.5rem
- Gap: 1.2rem
- Align-items: center

### Content (top to bottom):

#### A. TITLE
- Font: Caveat, 2.2rem, weight 700
- Color: var(--ink)
- Text: "Your Photos are Ready! 🎉"

#### B. FILTER CHIPS ROW

- Display: flex, wrap, center
- Gap: 0.5rem

**Each chip button**:
- Padding: 0.35rem 0.85rem
- Border: 2.5px solid var(--ink)
- Border-radius: 999px
- Background: transparent
- Font: Caveat, 1rem
- Color: var(--ink)
- Cursor: pointer
- Transition: all 0.15s

**On hover OR active**:
- Background: var(--ink)
- Color: #fff

**Chips** (6 total):
- Original (active by default)
- B&W
- Warm
- Cool
- Vintage
- Bold

On click: `applyFilter(filterName)`

#### C. PRINTING BOX

- Display: none (hidden by default)
- Show class: display: flex
- Flex col, center, gap: 0.5rem

**SVG printer animation**:
- Shows a printer illustration
- Contains animated rectangle (height from 0 to 28px over 1.5s, repeats)

**Message**:
- Font: Patrick Hand, 1rem
- Color: var(--ink2)
- Text: "Printing your strip..."
- Animation: `dots` (opacity flicker 1.2s)

#### D. FINAL KIOSK (2x2 PHOTO STRIP)

- Display: none (hidden until printing done)
- Show class: display: block
- Background: var(--white)
- Border: 4px solid var(--ink)
- Border-radius: 14px
- Padding: 10px 10px 14px
- Box-shadow: 8px 8px 0 var(--ink)
- Cursor: pointer
- Transition: transform 0.2s
- **On hover**: transform rotate(-1deg) scale(1.02)

**Final grid**:
- Display: grid, 2 cols, 2 rows
- Gap: 4px
- Border: 3px solid var(--ink)
- Border-radius: 6px
- Overflow: hidden
- Width: clamp(220px, 55vw, 340px)
- Aspect-ratio: 4/3.2
- Background: var(--ink)

**Each final cell**:
- Overflow: hidden
- Contains: `<img>` with captured/filtered photo
- Image: width/height 100%, object-fit cover

**Final footer**:
- Text-align: center
- Font: Patrick Hand, 0.72rem
- Color: #888
- Text: "© 2025 Sagar Suryakant Waghmare · mysketchbooth"
- Margin-top: 8px
- Letter-spacing: 0.08em

#### E. ACTION BUTTONS ROW

- Display: none (hidden until printing done)
- Show class: display: flex
- Flex row, wrap, center
- Gap: 0.8rem

**Each action button** (3 total):
- Display: flex, center, gap: 0.4rem
- Padding: 0.6rem 1.4rem
- Font: Caveat, 1.1rem, weight 600
- Border: 3px solid var(--ink)
- Border-radius: 8px
- Cursor: pointer
- Transition: transform 0.12s, box-shadow 0.12s
- Box-shadow: 3px 3px 0 var(--ink)
- **On hover**: transform translate(-2px,-2px), box-shadow: 5px 5px 0 var(--ink)
- **On active**: transform translate(1px,1px), box-shadow: 1px 1px 0 var(--ink)

**Button variants**:
- Dark (first): background var(--ink), color #fff
- Light (second & third): background var(--white), color var(--ink)

**Button content**:
1. **Download** icon + text
   - **On click**: `downloadGrid()`
2. **Retake** icon + text
   - **On click**: `goToBooth()`
3. **Home** text
   - **On click**: `goHome()`

---

## MODAL (FULL SCREEN)

- Position: fixed, inset: 0, z-index: 200
- Display: none (hidden)
- Open class: display: flex
- Background: rgba(0,0,0,0.75)
- Flex col, center, gap: 1rem

**Image wrapper**:
- Background: #fff
- Border: 4px solid var(--ink)
- Border-radius: 8px
- Padding: 8px
- Box-shadow: 0 0 40px rgba(0,0,0,0.4)

**Modal image**:
- Width: clamp(200px, 65vw, 380px)
- Border-radius: 4px
- Display: block

**Close button**:
- Background: #fff
- Border: 3px solid var(--ink)
- Border-radius: 6px
- Font: Caveat, 1rem
- Padding: 0.4rem 1.2rem
- Cursor: pointer
- Box-shadow: 3px 3px 0 var(--ink)
- Text: "✕ Close"
- **On click**: `closeModal()`

**Click behavior**:
- Modal click (outside): `closeModal()`
- Image click (inside): `event.stopPropagation()` (don't close)

---

## ANIMATIONS & TRANSITIONS

### Screen Transitions
```js
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
}
```

**On screen.active**:
- Apply fadeUp to all children: 0.35s ease both
- Stagger delays: 0s, 0.07s, 0.13s, 0.19s, 0.24s, 0.3s

### Flash Animation
```js
.flash-cell (on capture) → opacity 0 → 1 → 0 (0.05s transition)
```

### Countdown Display
```js
.cell-countdown.show → opacity 1 (instant on text change, text flicker as countdown)
```

### Printing Animation
```js
.printing-msg → animation dots 1.2s infinite
@keyframes dots { 0%,100% { opacity: 1 } 50% { opacity: 0.4 } }
```

### Button Hover/Active Transitions
- All transitions: 0.12s to 0.2s
- Translate + box-shadow changes
- Smooth and snappy feel (not slow)

### Final Strip Appear
- Start: opacity 0, transform scale(0.92)
- End: opacity 1, transform scale(1)
- Transition: 0.4s ease-out

---

## FUNCTIONALITY & JAVASCRIPT LOGIC

### Camera Setup & Management

```typescript
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: 1280, height: 960 },
      audio: false,
    });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
    setStream(stream);
  } catch (e) {
    console.warn('Camera not available:', e);
    // Still allow app to run (will show "No camera" in cells)
  }
}

function stopCamera() {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    setStream(null);
  }
}
```

### Photo Capture Workflow

**startSession()** sequence:
1. Set `shooting = true`, disable record button
2. Reset cells 1-3 to empty state
3. For each of 4 photos (i = 0 to 3):
   a. If i > 0: Move live view to cell i (remake video element)
   b. Call `countdownInCell(i, 3)` → show 3, 2, 1 countdown
   c. Call `captureCell(i)` → capture photo from canvas
   d. Flash animation on cell
   e. Mark cell as filled with image
   f. Wait 700ms before next shot
4. Set `shooting = false`
5. Wait 300ms
6. Call `showResult()`

**countdownInCell(index, seconds)**:
- Find countdown element in cell
- Loop: display countdown number, decrement each 1000ms
- Hide countdown when done
- Return promise

**captureCell(index)**:
- Get video element size (or fallback to 640x480)
- Create canvas with same dimensions
- Draw video frame flipped (ctx.scale(-1, 1))
- If B&W: apply grayscale filter to canvas pixels
- Convert canvas to JPEG (0.92 quality)
- Store as data URL in photos array
- Trigger flash animation
- Mark cell as filled

### B&W Toggle

```typescript
function toggleBW(checked: boolean) {
  setIsBW(checked);
  // Apply filter to live video
  if (videoRef.current) {
    videoRef.current.style.filter = checked
      ? 'grayscale(1) contrast(1.1)'
      : '';
  }
}
```

When capturing: if `isBW`, apply grayscale to canvas before export.

### Filter Application

**applyFilter(filterName, buttonElement)**:
1. Set active button style
2. For each photo in photos array:
   a. If no photo: skip
   b. Create new Image from photo data
   c. Draw to canvas
   d. Apply filter effects to canvas pixels
   e. Export as JPEG data URL
   f. Store in filteredPhotos array
   g. Update final grid image src

**Filter implementations** (canvas pixel manipulation):
- **bw**: Grayscale using 0.299*R + 0.587*G + 0.114*B
- **warm**: globalCompositeOperation='multiply', fillStyle='rgba(255,200,120,0.22)'
- **cool**: globalCompositeOperation='multiply', fillStyle='rgba(120,170,255,0.22)'
- **vintage**: Shift RGB (R*1.08+18, G*0.88+8, B*0.72), then overlay multiply 'rgba(160,100,50,0.18)'
- **bold**: Increase contrast: ((value-128)*1.6)+128
- **none**: Original image (no changes)

### Photo Upload

**handleUpload(event)**:
1. Get files from file input (max 4)
2. For each file:
   a. FileReader.readAsDataURL()
   b. On load: store in photos array at correct index
   c. Mark cell as filled
3. When all files loaded: call showResult()

### Download Composite Image

**downloadGrid()**:
1. Build array of image sources (filteredPhotos or photos, use filtered if available)
2. Load all images using Image() objects
3. Once all loaded: call buildDownload()

**buildDownload(imageArray)**:
1. Set canvas size: 
   - cellWidth=320, cellHeight=240, gap=4, padding=14
   - totalW = 320*2 + 4 + 14*2 = 668
   - totalH = 240*2 + 4 + 14*2 + 24 = 536
2. Fill background with #111 (black)
3. Draw each image at position:
   - [0,0] → (14, 14)
   - [1,0] → (14+324, 14)
   - [0,1] → (14, 14+244)
   - [1,1] → (14+324, 14+244)
4. Add footer text: "© 2025 Sagar Suryakant Waghmare · mysketchbooth"
   - Font: 12px monospace
   - Color: rgba(255,255,255,0.35)
   - Position: bottom center
5. Create `<a>` download link:
   - Filename: `mysketchbooth-{timestamp}.jpg`
   - href: canvas.toDataURL('image/jpeg', 0.92)
   - Click to trigger download

### Screen Navigation

```typescript
function goHome() {
  stopCamera();
  resetAll();
  setCurrentScreen('home');
}

function goToBooth() {
  resetAll();
  setCurrentScreen('booth');
  setTimeout(() => startCamera(), 100);
}

function showResult() {
  stopCamera();
  setCurrentScreen('result');
  setShowFinalKiosk(false);
  setShowActionRow(false);
  setShowPrinting(true);
  
  // Simulated print delay
  await delay(1800);
  
  setShowPrinting(false);
  applyFilter('none', null);
  setShowFinalKiosk(true);
  setShowActionRow(true);
}
```

### Modal for Image Preview

On final-kiosk click (any image):
- Get clicked image src
- Show modal with image enlarged
- On modal background click: close
- On image click: stop propagation (don't close)
- On close button click: close

---

## STATE RESET

**resetAll()**: Called when navigating away from booth
- photos = [null, null, null, null]
- filteredPhotos = [null, null, null, null]
- shooting = false
- isBW = false
- currentFilter = 'none'
- B&W toggle unchecked
- Video filter removed
- Record button enabled

---

## RESPONSIVE DESIGN (@media queries)

### @media (max-width: 520px):
- Eye-level label: hidden (display: none)
- Steps section: flex-direction column, border-radius 12px
- Step borders: remove border-right, add border-bottom 2px (except last)
- Booth layout: reduce gap to 0.8rem

---

## TAILWIND INTEGRATION TIPS

### Custom CSS (`app/globals.css`):
```css
@layer components {
  .grid-cell {
    @apply relative overflow-hidden flex items-center justify-center;
  }
  
  .grid-cell.live video {
    @apply w-full h-full object-cover block;
    transform: scaleX(-1);
  }
  
  .sketch-toggle input { @apply hidden; }
  
  .flash-cell {
    @apply absolute inset-0 bg-white opacity-0 pointer-events-none transition-opacity duration-75;
  }
  
  .flash-cell.flashing { @apply opacity-100; }
  
  .cell-countdown {
    @apply absolute inset-0 flex items-center justify-center font-caveat text-4xl font-bold text-white opacity-0 pointer-events-none;
    text-shadow: 2px 2px 8px rgba(0,0,0,0.7);
  }
  
  .cell-countdown.show { @apply opacity-100; }
  
  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(18px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes dots {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
  
  .screen-active > * { animation: fadeUp 0.35s ease both; }
  .screen-active > *:nth-child(2) { animation-delay: 0.07s; }
  .screen-active > *:nth-child(3) { animation-delay: 0.13s; }
  .screen-active > *:nth-child(4) { animation-delay: 0.19s; }
  .screen-active > *:nth-child(5) { animation-delay: 0.24s; }
  .screen-active > *:nth-child(6) { animation-delay: 0.3s; }
}
```

### Prefer Tailwind classes:
- `flex`, `flex-col`, `items-center`, `justify-center`
- `w-full`, `max-w-[680px]`, `gap-4`
- `border-4`, `border-solid`, `border-ink`
- `bg-white`, `bg-gray-slot`
- `text-caveat`, `text-patrick`
- `hover:opacity-65`, `hover:scale-104`
- `transition-all`, `duration-120`
- `cursor-pointer`
- `rounded-lg`, `rounded-full`
- `shadow-lg`
- Avoid inline styles; use Tailwind utilities

---

## DIRECTORY STRUCTURE

```
mysketchbooth-next/
├── app/
│   ├── layout.tsx          (head, fonts, globals)
│   ├── page.tsx            (main component, all logic)
│   └── globals.css         (Tailwind directives + custom CSS)
├── public/
│   └── (any static assets)
├── tailwind.config.ts      (color + font config)
├── next.config.js
├── tsconfig.json
├── package.json
└── README.md
```

---

## IMPLEMENTATION CHECKLIST

- [ ] Set up Next.js 14+ with TypeScript + Tailwind
- [ ] Configure Tailwind with custom colors and fonts
- [ ] Create main `page.tsx` with all hooks/state
- [ ] Build Home Screen (title, SVG, button, footer)
- [ ] Build Booth Screen (top bar, kiosk grid, toggle, upload, steps)
- [ ] Build Result Screen (title, filters, printing box, final strip, buttons)
- [ ] Build Modal component
- [ ] Implement camera setup with getUserMedia
- [ ] Implement capture workflow (countdown → flash → filled)
- [ ] Implement B&W toggle + filter application
- [ ] Implement photo upload
- [ ] Implement filter effects (all 6)
- [ ] Implement download composite image
- [ ] Implement screen transitions + animations
- [ ] Test responsiveness (@media)
- [ ] Test on mobile (camera permissions)
- [ ] Test without camera (fallback)
- [ ] Verify pixel-perfect layout match

---

## KEY NOTES

1. **Caveat font** = Big, bold, hand-written feel for headings/buttons. Use weight 700.
2. **Patrick Hand font** = Readable serif cursive for body text. Default weight.
3. **Hand-drawn aesthetic**: Use uneven borders (border-radius %), organic shadows, slightly offset box-shadows.
4. **All transitions are snappy** (0.12s–0.2s), not slow.
5. **Canvas logic** is critical: mirror video, apply B&W before export, handle no-camera gracefully.
6. **State management**: Use React hooks, avoid Redux (overkill for this app).
7. **File input**: Hidden, triggered by button click.
8. **Video element**: Must be recreated when moving between cells (different DOM container).
9. **Image lazy loading**: Not required (data URLs in memory).
10. **No server needed**: 100% client-side; no API calls, no database.

---

## DEPLOYMENT

- Deploy to Vercel (built for Next.js)
- HTTPS required for getUserMedia camera access
- No environment variables needed
- Static site optimization via `next/image` (optional for final strip preview)

---

## FINAL CHECK

When complete, the Next.js version should be **pixel-perfect identical** to the original:
- Same colors, same spacing, same fonts
- Same animations (fade-up stagger, flash, countdown)
- Same functionality (all 4 buttons work, all filters apply correctly)
- Same responsive behavior (mobile-friendly)
- Same interaction feel (snappy, hand-drawn charm)

Good luck! This is a full, comprehensive specification for a complete rebuild. 🎉

