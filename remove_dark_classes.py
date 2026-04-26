import re
import os

files = [
    'components/BoothScreen.tsx',
    'components/ErrorBoundary.tsx',
    'components/FloatingNav.tsx',
    'components/FrameSelection.tsx',
    'components/LoadingSpinner.tsx',
    'components/Modal.tsx',
    'components/ResultScreen.tsx',
    'components/TemplateSelection.tsx',
    'components/ui/button.tsx',
    'app/page.tsx'
]

for file in files:
    if os.path.exists(file):
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Remove all dark: classes (pattern: 'dark:' followed by any non-space characters)
        content = re.sub(r' dark:[^ "]+', '', content)
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f'✓ Processed: {file}')
    else:
        print(f'✗ File not found: {file}')
