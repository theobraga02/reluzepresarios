import React, { useEffect, useState } from 'react';

interface AuroraBackgroundProps {
  variant?: 'landing' | 'app';
}

export const AuroraBackground: React.FC<AuroraBackgroundProps> = ({ variant = 'landing' }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (variant === 'app') return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [variant]);

  // Compute scroll progress for landing page
  const maxScroll = typeof document !== 'undefined' ? (document.documentElement.scrollHeight - window.innerHeight) || 2000 : 2000;
  const progress = Math.min(1, Math.max(0, scrollY / maxScroll));

  if (variant === 'app') {
    return (
      <div
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[#050B10]" />
        {/* Aurora discreta no canto inferior esquerdo */}
        <div
          className="absolute -bottom-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full blur-[100px] opacity-[0.25]"
          style={{
            background: 'radial-gradient(circle, #19B8A5 0%, #0E4B5A 60%, transparent 80%)',
          }}
        />
      </div>
    );
  }

  // Degradê sobe com a rolagem
  const translateY = (1 - progress) * 200; // sobe 200px
  const auroraOpacity = 0.35 + progress * 0.45; // de 0.35 para 0.80

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* (a) --abismo sólido */}
      <div className="absolute inset-0 bg-[#050B10]" />

      {/* (b) três gradientes radiais */}
      <div
        className="absolute inset-0 transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(0, ${translateY}px, 0)`,
          opacity: auroraOpacity,
        }}
      >
        {/* Aurora a 30% 100% */}
        <div
          className="absolute -bottom-[10%] left-[20%] w-[60vw] h-[50vh] rounded-full blur-[90px]"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(25, 184, 165, 0.45) 0%, transparent 70%)',
          }}
        />
        {/* Profundo a 70% 90% */}
        <div
          className="absolute -bottom-[5%] right-[10%] w-[50vw] h-[50vh] rounded-full blur-[110px]"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(14, 75, 90, 0.6) 0%, transparent 70%)',
          }}
        />
        {/* Menta a 50% 120% */}
        <div
          className="absolute -bottom-[20%] left-[30%] w-[45vw] h-[45vh] rounded-full blur-[120px]"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(127, 227, 198, 0.35) 0%, transparent 75%)',
          }}
        />
      </div>
    </div>
  );
};
