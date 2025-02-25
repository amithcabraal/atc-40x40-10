import React, { useState } from 'react';
import { useWorkoutStore } from '../store/workoutStore';
import { Timer } from './Timer';
import { Play, Pause, Square, Star, SkipForward, Shuffle } from 'lucide-react';
import { Exercise } from '../types';
import { MediaGallery } from './MediaGallery';
import { IntroView } from './IntroView';

interface Props {
  onComplete: (exercises: Exercise[], rating?: number, notes?: string) => void;
}

export const ExerciseDisplay: React.FC<Props> = ({ onComplete }) => {
  const { 
    workout, 
    pauseWorkout, 
    resumeWorkout, 
    stopWorkout, 
    nextExercise, 
    toggleRest, 
    shuffleNextExercise,
    completeIntro 
  } = useWorkoutStore();
  
  const [rating, setRating] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [showRating, setShowRating] = useState(false);
  
  const currentExercise = workout.exercises[workout.currentExercise];
  const nextExerciseData = workout.exercises[workout.currentExercise + 1];
  const progress = ((workout.currentExercise + 1) / workout.exercises.length) * 100;

  const handleComplete = () => {
    onComplete(workout.exercises, rating, notes);
    stopWorkout();
    localStorage.removeItem('workoutState');
  };

  const handleSkip = () => {
    if (workout.currentExercise >= workout.exercises.length - 1) {
      setShowRating(true);
    } else {
      if (workout.isResting) {
        nextExercise();
      } else {
        toggleRest();
      }
    }
  };

  if (workout.isIntro) {
    return <IntroView onComplete={completeIntro} />;
  }

  if (showRating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-2xl w-full">
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Rate Your Workout</h2>
          <div className="flex justify-center space-x-2 mb-6">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                onClick={() => setRating(value)}
                className={`p-2 ${rating >= value ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                <Star className="w-8 h-8 fill-current" />
              </button>
            ))}
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about your workout (optional)"
            className="w-full p-4 border rounded-lg mb-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            rows={4}
          />
          <button
            onClick={handleComplete}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Save Workout
          </button>
        </div>
      </div>
    );
  }

  if (!workout.isActive) return null;

  const handleStop = () => {
    setShowRating(true);
  };

  return (
    <div className={`flex flex-col h-screen ${
      workout.isResting 
        ? 'bg-green-50 dark:bg-green-950' 
        : 'bg-blue-50 dark:bg-blue-950'
    } transition-colors duration-300`}>
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700">
        <div 
          className="h-full bg-blue-500 dark:bg-blue-400 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="px-4 py-2 flex justify-end">
        <p className={`text-lg font-medium ${
          workout.isResting
            ? 'text-green-600 dark:text-green-400'
            : 'text-blue-600 dark:text-blue-400'
        }`}>
          {workout.currentExercise + 1} / {workout.exercises.length}
        </p>
      </div>

      <Timer onComplete={handleStop} />

      <div className="flex-1 flex flex-col justify-center px-4 py-2 overflow-hidden">
        {workout.isResting ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-green-600 dark:text-green-300">
              Rest Period
            </h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xl text-green-800 dark:text-green-200">
                  Next up: {nextExerciseData?.title}
                </h3>
                <button
                  onClick={shuffleNextExercise}
                  className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-transform hover:scale-105"
                  title="Shuffle next exercise"
                >
                  <Shuffle size={20} />
                </button>
              </div>
              <p className="text-lg text-green-700 dark:text-green-300">
                {nextExerciseData?.instructions}
              </p>
              {nextExerciseData?.media && (
                <MediaGallery 
                  media={nextExerciseData.media} 
                  theme={workout.isResting ? 'green' : 'blue'}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-blue-800 dark:text-blue-200 line-clamp-2">
              {currentExercise.title}
            </h1>
            <p className="text-xl text-blue-700 dark:text-blue-300">
              {currentExercise.instructions}
            </p>
            {currentExercise?.media && (
              <MediaGallery 
                media={currentExercise.media}
                theme={workout.isResting ? 'green' : 'blue'}
              />
            )}
          </div>
        )}
      </div>

      <div className={`w-full ${
        workout.isResting
          ? 'bg-green-100 dark:bg-green-900'
          : 'bg-blue-100 dark:bg-blue-900'
      } p-4 transition-colors duration-300`}>
        <div className="flex justify-center space-x-6">
          {workout.isPaused ? (
            <button
              onClick={resumeWorkout}
              className="p-4 bg-green-500 text-white rounded-full hover:bg-green-600 transition-transform hover:scale-105"
            >
              <Play size={24} />
            </button>
          ) : (
            <button
              onClick={pauseWorkout}
              className="p-4 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-transform hover:scale-105"
            >
              <Pause size={24} />
            </button>
          )}
          <button
            onClick={handleSkip}
            className="p-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-transform hover:scale-105"
            title="Skip to next"
          >
            <SkipForward size={24} />
          </button>
          <button
            onClick={handleStop}
            className="p-4 bg-red-500 text-white rounded-full hover:bg-red-600 transition-transform hover:scale-105"
          >
            <Square size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};