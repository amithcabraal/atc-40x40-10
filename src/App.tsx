import React, { useState, useEffect } from 'react';
import { Exercise, Session, Theme } from './types';
import { useWorkoutStore } from './store/workoutStore';
import { ExerciseDisplay } from './components/ExerciseDisplay';
import { WorkoutHistory } from './components/WorkoutHistory';
import { Calendar, HelpCircle, List, Menu, Settings, Share2, Sun, Moon, Laptop } from 'lucide-react';
import exerciseData from './data/exercises.json';

function App() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [theme, setTheme] = useState<Theme>('system');
  const [showMenu, setShowMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { workout, startWorkout } = useWorkoutStore();

  useEffect(() => {
    const welcomeShown = localStorage.getItem('welcomeShown');
    if (welcomeShown) {
      setShowWelcome(false);
    }

    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme('system');
    }

    const savedSessions = localStorage.getItem('workout-sessions');
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const isDark = 
      newTheme === 'dark' || 
      (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    document.documentElement.classList.toggle('dark', isDark);
  };

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  const saveSession = (exercises: Exercise[], rating?: number, notes?: string) => {
    const newSession: Session = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      exercises,
      rating,
      notes
    };

    const updatedSessions = [newSession, ...sessions];
    setSessions(updatedSessions);
    localStorage.setItem('workout-sessions', JSON.stringify(updatedSessions));
  };

  const startNewWorkout = () => {
    const categorizedExercises = exerciseData.exercises.reduce((acc, exercise) => {
      const category = exercise.categories[0];
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(exercise);
      return acc;
    }, {} as Record<string, Exercise[]>);

    const selectedExercises: Exercise[] = [];
    const categories = Object.keys(categorizedExercises);
    
    const exercisesPerCategory = Math.floor(40 / categories.length);
    categories.forEach(category => {
      const exercises = categorizedExercises[category];
      const shuffled = [...exercises].sort(() => Math.random() - 0.5);
      selectedExercises.push(...shuffled.slice(0, exercisesPerCategory));
    });

    const remaining = 40 - selectedExercises.length;
    if (remaining > 0) {
      const allRemaining = exerciseData.exercises.filter(ex => !selectedExercises.includes(ex));
      const shuffled = [...allRemaining].sort(() => Math.random() - 0.5);
      selectedExercises.push(...shuffled.slice(0, remaining));
    }

    const finalSelection = selectedExercises.sort(() => Math.random() - 0.5);
    startWorkout(finalSelection);
  };

  const dismissWelcome = () => {
    localStorage.setItem('welcomeShown', 'true');
    setShowWelcome(false);
  };

  const shareApp = async () => {
    try {
      await navigator.share({
        title: 'Workout App',
        text: 'Check out this awesome workout app!',
        url: window.location.href
      });
    } catch (error) {
      console.log('Sharing failed', error);
    }
  };

  if (workout.isActive) {
    return <ExerciseDisplay onComplete={saveSession} />;
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Workout App</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <Settings className="w-6 h-6" />
            </button>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Welcome Modal */}
      {showWelcome && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md m-4">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Welcome to Workout App!</h2>
            <p className="mb-6 dark:text-gray-300">
              Get ready for an amazing workout experience. This app will help you:
            </p>
            <ul className="list-disc pl-5 mb-6 dark:text-gray-300">
              <li>Complete 40-second exercises with 20-second rests</li>
              <li>Track your progress</li>
              <li>Save and repeat your favorite workouts</li>
            </ul>
            <button
              onClick={dismissWelcome}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md m-4">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">Settings</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 dark:text-gray-200">Theme</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => changeTheme('light')}
                    className={`w-full flex items-center justify-between p-3 rounded ${
                      theme === 'light' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700'
                    }`}
                  >
                    <span className="flex items-center">
                      <Sun className="w-5 h-5 mr-2" />
                      Light
                    </span>
                  </button>
                  <button
                    onClick={() => changeTheme('dark')}
                    className={`w-full flex items-center justify-between p-3 rounded ${
                      theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700'
                    }`}
                  >
                    <span className="flex items-center">
                      <Moon className="w-5 h-5 mr-2" />
                      Dark
                    </span>
                  </button>
                  <button
                    onClick={() => changeTheme('system')}
                    className={`w-full flex items-center justify-between p-3 rounded ${
                      theme === 'system' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700'
                    }`}
                  >
                    <span className="flex items-center">
                      <Laptop className="w-5 h-5 mr-2" />
                      System
                    </span>
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowSettings(false)}
              className="w-full mt-6 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <button
              onClick={startNewWorkout}
              className="w-full bg-blue-500 text-white py-4 rounded-lg text-xl font-bold hover:bg-blue-600 transition-colors mb-8"
            >
              Start New Workout
            </button>
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              {exerciseData.exercises.length} exercises available
            </div>
            <WorkoutHistory
              sessions={sessions}
              onRepeat={(session) => startWorkout(session.exercises)}
            />
          </div>
        </div>
      </main>

      {/* Menu */}
      {showMenu && (
        <div className="fixed inset-y-0 right-0 w-64 bg-white dark:bg-gray-800 shadow-lg p-4 z-50">
          <div className="space-y-4">
            <button 
              onClick={() => window.open('/help', '_blank')}
              className="w-full flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded dark:text-white"
            >
              <HelpCircle className="w-5 h-5" />
              <span>Help</span>
            </button>
            <button 
              onClick={shareApp}
              className="w-full flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded dark:text-white"
            >
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button>
            <button 
              onClick={() => window.open('/privacy', '_blank')}
              className="w-full flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded dark:text-white"
            >
              <List className="w-5 h-5" />
              <span>Privacy Policy</span>
            </button>
            <button 
              onClick={() => setShowSettings(true)}
              className="w-full flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded dark:text-white"
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;