import React from 'react';
import EyeOfSauron from './EyeOfSauron';

export default function LoadingScreen() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-black to-zinc-950">
      <div className="flex flex-col items-center justify-center p-8 space-y-6">
        <div className="animate-pulse">
          <EyeOfSauron />
        </div>
        <div className="relative w-48 h-1 bg-zinc-900 rounded-full overflow-hidden">
          <div className="absolute inset-0 bg-green-500/20">
            <div className="absolute inset-0 bg-green-400/30 animate-slide" />
          </div>
        </div>
      </div>
    </div>
  );
}