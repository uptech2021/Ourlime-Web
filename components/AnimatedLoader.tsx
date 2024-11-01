import React from 'react';
import Image from 'next/image';

// Define custom styles for spinning and pulsing animation
const animationStyle = `
  @keyframes spinPulse {
    0% {
      transform: rotate(0) scale(1);
    }
    50% {
      transform: rotate(360deg) scale(1.5);
    }
    100% {
      transform: rotate(720deg) scale(1);
    }
  }
`;

const AnimatedLogo = () => {
  return (
    <>
      <style>{animationStyle}</style>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="w-16 h-16 animate-[spinPulse_2s_linear_infinite]">
          <Image 
            src="/images/transparentLogo.png"
            alt="Loading..."
            width={100}
            height={100}
            className="w-full h-full"
          />
        </div>
      </div>
    </>
  );
};

export default AnimatedLogo;