import type { Metadata } from 'next';
import './globals.css';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Patrick+Hand&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="w-full min-h-screen bg-bg text-ink overflow-x-hidden">
        <canvas id="c" className="hidden"></canvas>
        {children}
      </body>
    </html>
  );
}
