'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSound } from './SoundContext';

interface SoundEffectsContextType {
  playClick: () => void;
  playSuccess: () => void;
  playError: () => void;
  playChaChing: () => void;
}

const SoundEffectsContext = createContext<SoundEffectsContextType | null>(null);

export function SoundEffectsProvider({ children }: { children: ReactNode }) {
  const { soundsEnabled } = useSound();
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);

  useEffect(() => {
    if (soundsEnabled && typeof window !== 'undefined') {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioCtx(ctx);
      return () => { void ctx.close(); };
    }
  }, [soundsEnabled]);

  const playClick = () => {
    if (!soundsEnabled) return;
    try {
      const osc = new (window.AudioContext || (window as any).webkitAudioContext)();
      const gain = osc.createGain();
      osc.connect(gain);
      gain.connect(osc.destination);
      gain.gain.setValueAtTime(0.3, osc.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, osc.currentTime + 0.1);
      osc.start();
      osc.stop(osc.currentTime + 0.1);
      osc.onended = () => osc.close();
    } catch {}
  };

  const playSuccess = () => {
    if (!soundsEnabled) return;
    try {
      const osc = new (window.AudioContext || (window as any).webkitAudioContext)();
      const gain = osc.createGain();
      osc.connect(gain);
      gain.connect(osc.destination);
      gain.gain.setValueAtTime(0.3, osc.currentTime);
      osc.frequency.setValueAtTime(523.25, osc.currentTime);
      osc.frequency.setValueAtTime(659.25, osc.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, osc.currentTime + 0.3);
      osc.start();
      osc.stop(osc.currentTime + 0.3);
      osc.onended = () => osc.close();
    } catch {}
  };

  const playError = () => {
    if (!soundsEnabled) return;
    try {
      const osc = new (window.AudioContext || (window as any).webkitAudioContext)();
      const gain = osc.createGain();
      osc.connect(gain);
      gain.connect(osc.destination);
      gain.gain.setValueAtTime(0.3, osc.currentTime);
      osc.frequency.setValueAtTime(200, osc.currentTime);
      osc.frequency.setValueAtTime(150, osc.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, osc.currentTime + 0.3);
      osc.start();
      osc.stop(osc.currentTime + 0.3);
      osc.onended = () => osc.close();
    } catch {}
  };

  const playChaChing = () => {
    if (!soundsEnabled) return;
    try {
      const osc = new (window.AudioContext || (window as any).webkitAudioContext)();
      const gain = osc.createGain();
      osc.connect(gain);
      gain.connect(osc.destination);
      gain.gain.setValueAtTime(0.4, osc.currentTime);
      osc.frequency.setValueAtTime(1200, osc.currentTime);
      osc.frequency.setValueAtTime(1500, osc.currentTime + 0.1);
      osc.frequency.setValueAtTime(1800, osc.currentTime + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.01, osc.currentTime + 0.4);
      osc.start();
      osc.stop(osc.currentTime + 0.4);
      osc.onended = () => osc.close();
    } catch {}
  };

  return (
    <SoundEffectsContext.Provider value={{ playClick, playSuccess, playError, playChaChing }}>
      {children}
    </SoundEffectsContext.Provider>
  );
}

// Backwards compatibility alias
export const SoundProvider = SoundEffectsProvider;

export function useSoundEffects() {
  const context = useContext(SoundEffectsContext);
  if (!context) {
    return { playClick: () => {}, playSuccess: () => {}, playError: () => {}, playChaChing: () => {} };
  }
  return context;
}

// Force redeploy - Vercel cache buster: 2026-03-21-19-25-00
