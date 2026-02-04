export interface Task {
    id: string;
    title: string;
    notes?: string;
    estimatedPomodoros: number;
    completedPomodoros: number;
    completed: boolean;
    createdAt: number;
}
