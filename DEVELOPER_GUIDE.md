# SnapMemories - Developer Guide to New Features

## Quick Reference

### New Utilities
1. **error-messages.ts** - User-friendly error messages
2. **interaction-utils.ts** - Keyboard & haptic support
3. **color-contrast.ts** - WCAG compliance checking

### New Components
1. **ErrorBoundary.tsx** - Wraps app for error handling
2. **LoadingSpinner.tsx** - Loading indicator

### Updated Components
- HomeScreen, BoothScreen, ResultScreen
- TemplateSelection, FrameSelection
- Modal, FloatingNav
- layout.tsx

---

## Using Error Messages

### Basic Usage
```tsx
import { formatErrorForUser, ERROR_MESSAGES } from '@/lib/error-messages';

try {
  // Some operation
} catch (error) {
  const formatted = formatErrorForUser(error);
  console.error(formatted.title, formatted.message);
  // Show to user
}
```

### Specific Errors
```tsx
import { getErrorMessage } from '@/lib/error-messages';

const cameraError = getErrorMessage('CAMERA_PERMISSION');
// { title: 'Camera access denied', message: '...', action: '...' }
```

### Custom Error Handling
```tsx
const messages: Record<string, { title: string; message: string }> = {
  CAMERA_PERMISSION: ERROR_MESSAGES.CAMERA_PERMISSION,
  UPLOAD_FAILED: ERROR_MESSAGES.FILE_UPLOAD_ERROR,
};
```

---

## Using Error Boundary

### Setup
```tsx
import ErrorBoundary from '@/components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <YourComponent />
    </ErrorBoundary>
  );
}
```

### Custom Fallback
```tsx
<ErrorBoundary
  fallback={(error, reset) => (
    <div>
      <p>Error: {error.message}</p>
      <button onClick={reset}>Try Again</button>
    </div>
  )}
>
  <YourComponent />
</ErrorBoundary>
```

---

## Using Loading Spinner

### Inline Loading
```tsx
import LoadingSpinner from '@/components/LoadingSpinner';

{isLoading && <LoadingSpinner size="md" message="Processing..." />}
```

### Full Screen Loading
```tsx
{isLoading && <LoadingSpinner fullScreen size="lg" message="Please wait..." />}
```

### Size Options
- `sm` - Small (24x24)
- `md` - Medium (40x40) - default
- `lg` - Large (64x64)

---

## Using Interaction Utils

### Haptic Feedback
```tsx
import { triggerHapticFeedback } from '@/lib/interaction-utils';

const handleClick = () => {
  triggerHapticFeedback('medium'); // 'light' | 'medium' | 'heavy'
  // ... do something
};
```

### Keyboard Detection
```tsx
import { isKeyboardActivation } from '@/lib/interaction-utils';

const handleKeyDown = (event: KeyboardEvent) => {
  if (isKeyboardActivation(event)) {
    // Handle Enter or Space
  }
};
```

---

## Using Color Contrast

### Check Contrast
```tsx
import { checkContrast, isAccessibleColor } from '@/lib/color-contrast';

const contrast = checkContrast('#000000', '#FFFFFF');
console.log(contrast); // { AA: true, AAA: true, level: 'AAA' }

// Quick check
if (isAccessibleColor('#333333', '#FFFFFF', 'AA')) {
  // Colors are accessible
}
```

### Approved Colors
```tsx
import { APPROVED_COLOR_COMBINATIONS } from '@/lib/color-contrast';

const { foreground, background, ratio } = 
  APPROVED_COLOR_COMBINATIONS.blackOnWhite;
// Use these combinations for guaranteed accessibility
```

---

## Accessibility Checklist

### When Adding New Components

- [ ] Add `aria-label` to all interactive elements
- [ ] Add `title` attribute for tooltips
- [ ] Buttons are at least 44x44px
- [ ] Focus indicators are visible
- [ ] Keyboard navigation works
- [ ] Error messages are descriptive
- [ ] Color contrast meets WCAG AA
- [ ] Semantic HTML used (button, main, header, etc)

### When Adding New Forms

- [ ] Labels associated with inputs
- [ ] Required fields marked
- [ ] Error messages shown
- [ ] Success state confirmed
- [ ] Help text available

### When Adding New Buttons

```tsx
// Do this ✅
<button
  type="button"
  aria-label="Descriptive action"
  title="Tooltip text"
  className="h-11 w-11 sm:h-12 sm:w-12 ... focus-visible:ring-2"
>
  Icon or Text
</button>

// Not this ❌
<button className="h-8 w-8">
  Icon
</button>
```

---

## Patterns & Best Practices

### Error Handling Pattern
```tsx
import { formatErrorForUser } from '@/lib/error-messages';

try {
  await doSomething();
} catch (error) {
  const formatted = formatErrorForUser(error);
  setErrorState({
    title: formatted.title,
    message: formatted.message,
    details: formatted.details,
  });
}
```

### Loading State Pattern
```tsx
import LoadingSpinner from '@/components/LoadingSpinner';

{isLoading ? (
  <LoadingSpinner message="Loading..." />
) : (
  <YourContent />
)}
```

### Keyboard Navigation Pattern
```tsx
import { isKeyboardActivation } from '@/lib/interaction-utils';

const handleKeyDown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'Escape':
      onClose();
      break;
    case 'ArrowLeft':
      goToPrevious();
      break;
    case 'ArrowRight':
      goToNext();
      break;
  }
};
```

---

## Component Props Reference

### ErrorBoundary
```tsx
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}
```

### LoadingSpinner
```tsx
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  fullScreen?: boolean;
}
```

---

## Testing

### Testing Accessibility
```bash
# Chrome DevTools
1. Open DevTools → Lighthouse
2. Run Accessibility audit
3. Fix any issues

# Manual Testing
1. Use Tab to navigate
2. Use Screen Reader
3. Check color contrast
4. Verify focus indicators
```

### Testing on Mobile
```bash
1. Use Chrome DevTools device emulation
2. Test actual device if possible
3. Check touch targets with 44px minimum
4. Verify safe area support
```

---

## Common Issues & Solutions

### Issue: Focus Not Visible
```tsx
// Solution: Add focus-visible
className="... focus-visible:ring-2 focus-visible:ring-black"
```

### Issue: Button Too Small
```tsx
// Solution: Use min-h and min-w
className="min-h-11 min-w-11 sm:min-h-12 sm:min-w-12"
```

### Issue: Error Not User-Friendly
```tsx
// Solution: Use error-messages utility
import { formatErrorForUser } from '@/lib/error-messages';
const friendly = formatErrorForUser(error);
```

### Issue: No Loading Feedback
```tsx
// Solution: Add loading spinner
{isLoading && <LoadingSpinner message="Loading..." />}
```

---

## Migration Guide

### For Existing Components

**Before:**
```tsx
<button className="px-2 py-1 text-xs">
  Click
</button>
```

**After:**
```tsx
<button
  aria-label="Description of action"
  title="Tooltip"
  className="px-4 py-2.5 sm:py-3 min-h-11 text-sm focus-visible:ring-2"
>
  Click
</button>
```

---

## File Structure

```
lib/
  ├── error-messages.ts      ← User-friendly errors
  ├── interaction-utils.ts   ← Keyboard & haptic
  └── color-contrast.ts      ← WCAG compliance

components/
  ├── ErrorBoundary.tsx      ← Error wrapper
  ├── LoadingSpinner.tsx     ← Loading indicator
  └── [other components]     ← Updated with a11y
```

---

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Keyboard Accessibility](https://www.a11y-101.com/)
- [Touch Target Sizing](https://www.smashingmagazine.com/2022/09/inline-links-touch-targets/)

---

**Remember**: Accessibility is not optional. Every component should be usable by everyone, including:
- Keyboard-only users
- Screen reader users
- Users with motor disabilities
- Users with visual impairments
- Mobile/tablet users

**Questions?** Check the components and utilities for real examples!
