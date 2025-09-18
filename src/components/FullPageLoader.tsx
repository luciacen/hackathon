'use client';

import React, { useEffect, useState } from 'react';

const FullPageLoader: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setFading(true), 1600); // show for 2s
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!fading) return;
    const t = window.setTimeout(() => setVisible(false), 300); // match CSS transition
    return () => window.clearTimeout(t);
  }, [fading]);

  if (!visible) return null;

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#ffffff',
        transition: 'opacity 300ms ease',
        opacity: fading ? 0 : 1,
      }}
    >
      {/* Three bouncing dots */}
      <div role="status" aria-label="Loading" style={{ display: 'flex', gap: 10 }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: 20,
              height: 20,
              background: '#4d68f1',
              display: 'inline-block',
              animation: `fp-bounce 900ms ${i * 120}ms infinite ease-in-out`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes fp-bounce {
          0%, 80%, 100% { opacity: 1; }
          40% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

export default FullPageLoader;
