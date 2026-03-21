'use client';
import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

interface SoundContextType {
  soundsEnabled: boolean;
  toggleSounds: () => void;
  playClick: () => void;
  playPurchase: () => void;
}

const SoundContext = createContext<SoundContextType>({
  soundsEnabled: false,
  toggleSounds: () => {},
  playClick: () => {},
  playPurchase: () => {},
});

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [soundsEnabled, setSoundsEnabled] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioCtxRef.current;
  }, []);

  const playClick = useCallback(() => {
    if (!soundsEnabled) return;
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.08);
    } catch {}
  }, [soundsEnabled, getCtx]);

  const playPurchase = useCallback(() => {
    if (!soundsEnabled) return;
    try {
      const ctx = getCtx();
      const notes = [523, 659, 784, 1047];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        const t = ctx.currentTime + i * 0.1;
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        osc.start(t);
        osc.stop(t + 0.2);
      });
    } catch {}
  }, [soundsEnabled, getCtx]);

  const toggleSounds = useCallback(() => {
    setSoundsEnabled(prev => !prev);
  }, []);

  return (
    <SoundContext.Provider value={{ soundsEnabled, toggleSounds, playClick, playPurchase }}>
      {children}
    </SoundContext.Provider>
  );
}

export const useSounds = () => useContext(SoundContext);
