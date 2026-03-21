'use client';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollProgressBar from './components/ScrollProgressBar';
import CursorTrail from './components/CursorTrail';
import { SoundProvider } from './components/SoundEffects';
import ClientPageTransition from './components/ClientPageTransition';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SoundProvider>
        <ScrollProgressBar />
        <CursorTrail />
        <Navbar />
        <ClientPageTransition>
          <main className="pt-16">
            {children}
          </main>
        </ClientPageTransition>
        <Footer />
      </SoundProvider>
    </AuthProvider>
  );
}
