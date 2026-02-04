import React from 'react';
import type { Task } from '../../types';
import { useTasksContext } from '../../context/TasksContext';
import './TaskItem.css'; // Will create

interface TaskItemProps {
    task: Task;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
    const { toggleTaskComplete, deleteTask, activeTaskId, setActiveTaskId } = useTasksContext();
    // const { status } = useTimerContext(); // Removed as per instruction

    const isActive = activeTaskId === task.id;

    const handleToggleActive = () => {
        if (isActive) {
            setActiveTaskId(null);
        } else {
            setActiveTaskId(task.id);
        }
    };

    return (
        <div className={`task-item ${isActive ? 'active' : ''} ${task.completed ? 'completed' : ''}`}>
            <div className="task-left">
                <button
                    className={`check-btn ${task.completed ? 'checked' : ''}`}
                    onClick={() => toggleTaskComplete(task.id)}
                    aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
                >
                    {task.completed && '✓'}
                </button>
                <span className="task-title">{task.title}</span>
            </div>

            <div className="task-right">
                <div className="pomodoro-count">
                    {task.completedPomodoros} / <span className="est">{task.estimatedPomodoros}</span>
                </div>

                <button
                    className="btn-icon"
                    onClick={handleToggleActive}
                    aria-label={isActive ? "Deselect active task" : "Select as active task"}
                >
                    {isActive ? '★' : '☆'}
                </button>

                <button
                    className="btn-icon delete-btn"
                    onClick={() => deleteTask(task.id)}
                    aria-label="Delete task"
                >
                    🗑
                </button>
            </div>
        </div>
    );
};
