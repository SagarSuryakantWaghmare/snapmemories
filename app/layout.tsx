import type { Metadata } from 'next';
import './globals.css';
import { Geist } from 'next/font/google';
import { Caveat, Patrick_Hand } from 'next/font/google';
import { cn } from '@/lib/utils';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });
const caveat = Caveat({ subsets: ['latin'], variable: '--font-caveat', weight: ['400', '500', '600', '700'] });
const patrickHand = Patrick_Hand({ subsets: ['latin'], variable: '--font-patrick', weight: '400' });

export const metadata: Metadata = {
  title: 'MySketchBooth — Free Online Photo Booth',
  description: 'A free vintage online photobooth — take 4 snaps, get your strip!',
  viewport: 'width=device-width, initial-scale=1.0',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn('font-sans', geist.variable, caveat.variable, patrickHand.variable)}>
      <body className="w-full min-h-screen bg-bg text-ink overflow-x-hidden">
        <canvas id="c" className="hidden"></canvas>
        {children}
      </body>
    </html>
  );
}
