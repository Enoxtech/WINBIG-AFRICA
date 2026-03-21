'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';

interface SoundCtx { soundsEnabled: boolean; toggle: () => void; playClick: () => void; playSuccess: () => void; }

const SoundContext = createContext<SoundCtx>({ soundsEnabled: false, toggle: () => {}, playClick: () => {}, playSuccess: () => {} });
export const useSounds = () => useContext(SoundContext);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [soundsEnabled, setSoundsEnabled] = useState(false);
  const [audioCtx, setAudioCtx] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    const stored = localStorage.getItem('winbig-sounds');
    if (stored === 'true') setSoundsEnabled(true);
  }, []);

  useEffect(() => {
    if (soundsEnabled && typeof window !== 'undefined') {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioCtx(ctx);
      return () => ctx.close();
    }
  }, [soundsEnabled]);

  const playTone = useCallback((freq: number, dur: number, type: OscillatorType = 'sine', vol = 0.08) => {
    if (!audioCtx || !soundsEnabled) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(vol, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + dur);
    } catch {}
  }, [audioCtx, soundsEnabled]);

  const playClick = useCallback(() => playTone(800, 0.05, 'square', 0.05), [playTone]);
  const playSuccess = useCallback(() => {
    if (!audioCtx || !soundsEnabled) return;
    playTone(523, 0.1, 'sine', 0.1);
    setTimeout(() => playTone(659, 0.1, 'sine', 0.1), 100);
    setTimeout(() => playTone(784, 0.2, 'sine', 0.1), 200);
  }, [audioCtx, soundsEnabled, playTone]);

  const toggle = useCallback(() => {
    setSoundsEnabled(prev => {
      const next = !prev;
      localStorage.setItem('winbig-sounds', String(next));
      return next;
    });
  }, []);

  return (
    <SoundContext.Provider value={{ soundsEnabled, toggle, playClick, playSuccess }}>
      {children}
    </SoundContext.Provider>
  );
}
