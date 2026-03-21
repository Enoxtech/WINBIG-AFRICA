import { createContext, useContext, useState } from 'react';

interface SoundContextType {
  soundsEnabled: boolean;
  toggleSound: () => void;
}

const SoundContext = createContext<SoundContextType | null>(null);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [soundsEnabled, setSoundsEnabled] = useState(true);

  const toggleSound = () => {
    setSoundsEnabled(prev => !prev);
  };

  return (
    <SoundContext.Provider value={{ soundsEnabled, toggleSound }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (!context) {
    return { soundsEnabled: true, toggleSound: () => {} };
  }
  return context;
}