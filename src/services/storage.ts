import type { Task } from '../types';

const TASKS_KEY = 'pomodoro-tasks';

export const StorageService = {
    getTasks: (): Task[] | null => {
        try {
            const item = localStorage.getItem(TASKS_KEY);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Failed to load tasks', e);
            return null;
        }
    },

    saveTasks: (tasks: Task[]) => {
        try {
            localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
        } catch (e) {
            console.error('Failed to save tasks', e);
        }
    },

    // Placeholder for settings
    getSettings: () => {
        // ...
    }
};
