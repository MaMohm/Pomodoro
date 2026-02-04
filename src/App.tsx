import React from 'react';
import { TimerProvider, useTimerContext } from './context/TimerContext';
import { TasksProvider } from './context/TasksContext';
import { ToastProvider } from './context/ToastContext';
import { TimerDisplay } from './components/timer/TimerDisplay';
import { TimerControls } from './components/timer/TimerControls';
import { TaskList } from './components/tasks/TaskList';
import { SettingsModal } from './components/settings/SettingsModal';
import { useCompletionNotification } from './hooks/useCompletionNotification';
import './index.css';

const PomodoroApp: React.FC = () => {
  const { mode, status, params } = useTimerContext();
  useCompletionNotification(status, mode, params);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

  return (
    <div className="app-container" data-theme="light" data-mode={mode}>
      <header className="app-header">
        <h1>Pomodoro</h1>
        <button
          className="settings-btn"
          aria-label="Settings"
          onClick={() => setIsSettingsOpen(true)}
        >
          ⚙
        </button>
      </header>

      <main className="container">
        <TimerDisplay />
        <TimerControls />
        <TaskList />
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Marwan.M. All rights reserved.</p>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ToastProvider>
      <TimerProvider>
        <TasksProvider>
          <PomodoroApp />
        </TasksProvider>
      </TimerProvider>
    </ToastProvider>
  );
};

export default App;
