import React, { useEffect, useState } from 'react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      setIsPointer(
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'A'
      );
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <style>{`
        body {
          cursor: none;
        }
        a, button, [role="button"] {
          cursor: none;
        }
      `}</style>
      <div
        className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
        style={{ pointerEvents: 'none' }}
      >
        {/* Main Dot */}
        <div
          className="absolute h-4 w-4 rounded-full bg-[#34A853] border-2 border-white shadow-sm transition-transform duration-75 ease-out will-change-transform"
          style={{
            left: position.x,
            top: position.y,
            transform: `translate(-50%, -50%) scale(${isPointer ? 1.5 : 1})`,
          }}
        />
      </div>
    </>
  );
};

export default CustomCursor;
