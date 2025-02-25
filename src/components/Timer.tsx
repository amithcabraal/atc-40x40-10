import React, { useEffect, useRef } from 'react';
import { useWorkoutStore } from '../store/workoutStore';

interface Props {
  onComplete?: () => void;
}

export const Timer: React.FC<Props> = ({ onComplete }) => {
  const { workout, setTimeRemaining, toggleRest, nextExercise } = useWorkoutStore();
  const progressRef = useRef<number>(0);
  const lastUpdateRef = useRef<number>(0);

  useEffect(() => {
    if (!workout.isActive || workout.isPaused) return;

    let animationFrameId: number;
    
    const updateTimer = (timestamp: number) => {
      if (!lastUpdateRef.current) {
        lastUpdateRef.current = timestamp;
      }

      const deltaTime = timestamp - lastUpdateRef.current;
      lastUpdateRef.current = timestamp;
      
      if (workout.timeRemaining > 0) {
        progressRef.current += deltaTime / 1000; // Convert to seconds
        
        if (progressRef.current >= 1) {
          const secondsToSubtract = Math.floor(progressRef.current);
          setTimeRemaining(workout.timeRemaining - secondsToSubtract);
          progressRef.current -= secondsToSubtract;
        }
        
        animationFrameId = requestAnimationFrame(updateTimer);
      } else {
        if (workout.isResting) {
          if (workout.currentExercise >= workout.exercises.length - 1) {
            if (onComplete) {
              onComplete();
            }
            return;
          }
          nextExercise();
        } else {
          toggleRest();
        }
        lastUpdateRef.current = 0;
        progressRef.current = 0;
      }
    };

    animationFrameId = requestAnimationFrame(updateTimer);
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [workout.timeRemaining, workout.isResting, workout.isActive, workout.isPaused]);

  const minutes = Math.floor(workout.timeRemaining / 60);
  const seconds = workout.timeRemaining % 60;
  
  // Calculate progress percentage for the bar
  const totalTime = workout.isResting ? 20 : 40;
  const progress = (workout.timeRemaining / totalTime) * 100;

  return (
    <div className="w-full h-[25vh] relative">
      {/* Progress bar background */}
      <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700">
        <div
          className={`h-full transition-all duration-100 ${
            workout.isResting
              ? 'bg-green-500/20 dark:bg-green-400/20'
              : 'bg-blue-500/20 dark:bg-blue-400/20'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Timer text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`text-[15vh] font-bold tabular-nums tracking-tight ${
          workout.isResting
            ? 'text-green-700 dark:text-green-300'
            : 'text-blue-700 dark:text-blue-300'
        }`}>
          {minutes}:{seconds.toString().padStart(2, '0')}
        </div>
      </div>
    </div>
  );
};