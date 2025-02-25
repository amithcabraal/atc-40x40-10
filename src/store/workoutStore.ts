import { create } from 'zustand';
import { Exercise, WorkoutStore } from '../types';

const initialWorkoutState = {
  currentExercise: 0,
  isResting: false,
  timeRemaining: 20, // Start with intro countdown
  exercises: [],
  isActive: false,
  isPaused: false,
  isIntro: true,
};

export const useWorkoutStore = create<WorkoutStore>((set, get) => ({
  workout: initialWorkoutState,
  startWorkout: (exercises: Exercise[]) => {
    const workoutState = { 
      ...initialWorkoutState, 
      exercises, 
      isActive: true,
      timeRemaining: 20, // Intro countdown
      isIntro: true,
    };
    set({ workout: workoutState });
    localStorage.setItem('workoutState', JSON.stringify(workoutState));
  },
  completeIntro: () => {
    const newState = {
      ...get().workout,
      isIntro: false,
      timeRemaining: 40,
    };
    set({ workout: newState });
    localStorage.setItem('workoutState', JSON.stringify(newState));
  },
  pauseWorkout: () => {
    const newState = { ...get().workout, isPaused: true };
    set({ workout: newState });
    localStorage.setItem('workoutState', JSON.stringify(newState));
  },
  resumeWorkout: () => {
    const newState = { ...get().workout, isPaused: false };
    set({ workout: newState });
    localStorage.setItem('workoutState', JSON.stringify(newState));
  },
  stopWorkout: () => {
    set({ workout: initialWorkoutState });
    localStorage.removeItem('workoutState');
  },
  nextExercise: () => {
    const newState = {
      ...get().workout,
      currentExercise: get().workout.currentExercise + 1,
      isResting: false,
      timeRemaining: 40,
    };
    set({ workout: newState });
    localStorage.setItem('workoutState', JSON.stringify(newState));
  },
  setTimeRemaining: (time: number) => {
    const newState = { ...get().workout, timeRemaining: time };
    set({ workout: newState });
    localStorage.setItem('workoutState', JSON.stringify(newState));
  },
  toggleRest: () => {
    const newState = {
      ...get().workout,
      isResting: !get().workout.isResting,
      timeRemaining: get().workout.isResting ? 40 : 20,
    };
    set({ workout: newState });
    localStorage.setItem('workoutState', JSON.stringify(newState));
  },
  shuffleNextExercise: () => {
    const { workout } = get();
    const currentExercises = [...workout.exercises];
    const nextExerciseIndex = workout.currentExercise + 1;
    
    // Get all exercises except the current and next one
    const availableExercises = currentExercises.filter((_, index) => 
      index !== workout.currentExercise && index !== nextExerciseIndex
    );
    
    // Pick a random exercise from the available ones
    const randomIndex = Math.floor(Math.random() * availableExercises.length);
    const newExercise = availableExercises[randomIndex];
    
    // Replace the next exercise with the randomly selected one
    currentExercises[nextExerciseIndex] = newExercise;
    
    const newState = {
      ...workout,
      exercises: currentExercises
    };
    
    set({ workout: newState });
    localStorage.setItem('workoutState', JSON.stringify(newState));
  }
}));