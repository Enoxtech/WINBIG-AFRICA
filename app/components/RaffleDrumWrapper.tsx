'use client';
import { useState, useEffect } from 'react';

export default function RaffleDrumWrapper() {
  const [RaffleDrum, setRaffleDrum] = useState<React.ComponentType<{ containerSize?: number }> | null>(null);

  useEffect(() => {
    import('./RaffleDrum').then((m) => setRaffleDrum(() => m.default));
  }, []);

  if (!RaffleDrum) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-16 h-16 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  return <RaffleDrum />;
}
