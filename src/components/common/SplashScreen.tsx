import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  onComplete?: () => void;
  duration?: number; // duration in ms, default 2000ms
  forceShow?: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  duration = 2000,
  forceShow = false,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        setIsVisible(false);
        if (onComplete) onComplete();
      }, 500);
    }, duration - 500);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  const handleDismiss = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 200);
  };

  if (!isVisible && !forceShow) return null;

  return (
    <div
      id="vayza-splash-screen"
      onClick={handleDismiss}
      className={`fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#FF6321] text-white select-none cursor-pointer transition-all duration-700 ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        backgroundColor: '#FF6321', // Pure uniform VAYZA Orange
      }}
    >
      <div className="flex flex-col items-center justify-center text-center animate-fadeIn">
        {/* Typographic Brand Display ONLY (Sans logo graphique) */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black font-display tracking-[0.14em] uppercase text-white drop-shadow-md">
          VAYZA
        </h1>
        <p className="text-xs sm:text-sm tracking-[0.35em] text-white/90 font-bold uppercase mt-3">
          Your Style. Your Step.
        </p>
      </div>
    </div>
  );
};
