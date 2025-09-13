import React from 'react';
import splitScreenImage from "@/assets/split-screen-comparison.png";

export const CoverSlide = () => {
  return (
    <div className="text-center">
      <div className="w-full max-w-xs sm:max-w-sm mx-auto -mt-5">
        <img 
          src={splitScreenImage} 
          alt="Split screen comparison showing chaos of traditional systems versus calm simplicity of Hobson"
          className="w-full h-auto rounded-lg shadow-lg object-contain max-h-48 sm:max-h-none border-2 border-red-500"
        />
      </div>
    </div>
  );
};