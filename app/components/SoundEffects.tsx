'use client';
import { useRef, useState, createContext, useContext, ReactNode } from 'react';

interface SoundContextType {
  playClick: () => void;
  playWhoosh: () => void;
  enabled: boolean;
  setEnabled: (v: boolean) => void;
}

const SoundContext = createContext<SoundContextType>({
  playClick: () => {},
  playWhoosh: () => {},
  enabled: false,
  setEnabled: () => {},
});

export function useSound() {
  return useContext(SoundContext);
}

function createOscillatorSound(ctx: AudioContext, type: OscillatorType, freq: number, duration: number, volume = 0.15) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(freq * 0.5, ctx.currentTime + duration);
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

export function SoundProvider({ children }: { children: ReactNode }) {
  const ctxRef = useRef<AudioContext | null>(null);
  const enabledRef = useRef(false);

  const getCtx = () => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return ctxRef.current;
  };

  const playClick = () => {
    if (!enabledRef.current) return;
    try {
      const ctx = getCtx();
      createOscillatorSound(ctx, 'sine', 800, 0.08, 0.12);
    } catch {}
  };

  const playWhoosh = () => {
    if (!enabledRef.current) return;
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch {}
  };

  const [enabled, setEnabledState] = useState(false);

  const setEnabled = (v: boolean) => {
    enabledRef.current = v;
    setEnabledState(v);
  };

  return (
    <SoundContext.Provider value={{ playClick, playWhoosh, enabled, setEnabled }}>
      {children}
    </SoundContext.Provider>
  );
}
