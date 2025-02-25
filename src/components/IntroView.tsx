import React from 'react';
import { Timer } from './Timer';
import { Play } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

export const IntroView: React.FC<Props> = ({ onComplete }) => {
  return (
    <div className="flex flex-col h-screen bg-purple-50 dark:bg-purple-950">
      <Timer onComplete={onComplete} />
      
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-4xl font-bold text-purple-800 dark:text-purple-200 mb-8">
          Get Ready!
        </h1>
        <div className="space-y-6 max-w-2xl">
          <p className="text-2xl text-purple-700 dark:text-purple-300">
            Find a comfortable space and get into position.
          </p>
          <ul className="text-xl text-purple-600 dark:text-purple-400 space-y-4">
            <li>• Clear your workout area</li>
            <li>• Have water nearby</li>
            <li>• Take a deep breath</li>
          </ul>
          <button
            onClick={onComplete}
            className="mt-8 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xl font-semibold flex items-center justify-center gap-2 transition-transform hover:scale-105"
          >
            <Play className="w-6 h-6" />
            Start Now
          </button>
        </div>
      </div>
    </div>
  );
};