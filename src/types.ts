export interface Media {
  type: 'image' | 'video' | 'audio';
  url: string;
  thumbnail?: string;
  title?: string;
}

export interface Exercise {
  id?: number;
  title: string;
  instructions: string;
  categories: string[];
  body_part_focus: string[];
  media?: Media[];
}

export interface Session {
  id: string;
  created_at: string;
  exercises: Exercise[];
  rating?: number;
  notes?: string;
}

export interface WorkoutState {
  currentExercise: number;
  isResting: boolean;
  timeRemaining: number;
  exercises: Exercise[];
  isActive: boolean;
  isPaused: boolean;
  isIntro?: boolean;
}

export interface WorkoutStore {
  workout: WorkoutState;
  startWorkout: (exercises: Exercise[]) => void;
  pauseWorkout: () => void;
  resumeWorkout: () => void;
  stopWorkout: () => void;
  nextExercise: () => void;
  setTimeRemaining: (time: number) => void;
  toggleRest: () => void;
  shuffleNextExercise: () => void;
  completeIntro: () => void;
}

export type Theme = 'light' | 'dark' | 'system';