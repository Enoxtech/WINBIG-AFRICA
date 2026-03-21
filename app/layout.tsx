import type { Metadata } from 'next';
import './globals.css';
import { SoundProvider } from './components/SoundEffects';
import ScrollProgressBar from './components/ScrollProgressBar';
import PageTransition from './components/PageTransition';
import CursorTrail from './components/CursorTrail';

export const metadata: Metadata = {
  title: 'WINBIG AFRICA — Africa\'s Premier Lottery & Raffle Platform',
  description: 'Win big with small entry fees. Join transparent, fair, and secure raffle campaigns across Nigeria and Africa.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <SoundProvider>
          <ScrollProgressBar />
          <PageTransition>
            <CursorTrail />
            {children}
          </PageTransition>
        </SoundProvider>
      </body>
    </html>
  );
}
