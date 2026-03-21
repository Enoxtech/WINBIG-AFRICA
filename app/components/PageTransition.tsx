'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [entering, setEntering] = useState(false);

  useEffect(() => {
    setEntering(true);
    const timer = setTimeout(() => setEntering(false), 700);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      <AnimatePresence>
        {entering && (
          <motion.div
            key="page-bar"
            initial={{ scaleX: 0, opacity: 1 }}
            animate={{ scaleX: 1, opacity: 0 }}
            exit={{ scaleX: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(to right, #D4AF37, #fbbf24, #D4AF37)',
              transformOrigin: 'left',
              zIndex: 9999,
            }}
          />
        )}
      </AnimatePresence>
      {children}
    </>
  );
}
