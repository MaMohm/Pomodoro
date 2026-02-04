import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { StorageService } from '../services/storage';
import type { Task } from '../types';

interface TasksContextValue {
    tasks: Task[];
    activeTaskId: string | null;
    setActiveTaskId: (id: string | null) => void;
    addTask: (title: string, est: number) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    toggleTaskComplete: (id: string) => void;
    reorderTasks: (newOrder: Task[]) => void;
    incrementTaskPomodoro: (id: string) => void;
}

const TasksContext = createContext<TasksContextValue | undefined>(undefined);

export const TasksProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

    // Load from storage on mount
    useEffect(() => {
        const loadedTasks = StorageService.getTasks();
        if (loadedTasks) setTasks(loadedTasks);
    }, []);

    // Save to storage on change
    useEffect(() => {
        StorageService.saveTasks(tasks);
    }, [tasks]);

    const addTask = (title: string, est: number) => {
        const newTask: Task = {
            id: crypto.randomUUID(),
            title,
            estimatedPomodoros: est,
            completedPomodoros: 0,
            completed: false,
            createdAt: Date.now(),
        };
        setTasks(prev => [newTask, ...prev]);
    };

    const updateTask = (id: string, updates: Partial<Task>) => {
        setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
    };

    const deleteTask = (id: string) => {
        setTasks(prev => prev.filter(t => t.id !== id));
        if (activeTaskId === id) setActiveTaskId(null);
    };

    const toggleTaskComplete = (id: string) => {
        setTasks(prev => prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
    };

    const reorderTasks = (newOrder: Task[]) => {
        setTasks(newOrder);
    };

    const incrementTaskPomodoro = (id: string) => {
        setTasks(prev => prev.map(t => (t.id === id ? { ...t, completedPomodoros: t.completedPomodoros + 1 } : t)));
    };

    return (
        <TasksContext.Provider value={{
            tasks,
            activeTaskId,
            setActiveTaskId,
            addTask,
            updateTask,
            deleteTask,
            toggleTaskComplete,
            reorderTasks,
            incrementTaskPomodoro
        }}>
            {children}
        </TasksContext.Provider>
    );
};

export const useTasksContext = () => {
    const context = useContext(TasksContext);
    if (context === undefined) {
        throw new Error('useTasksContext must be used within a TasksProvider');
    }
    return context;
};
