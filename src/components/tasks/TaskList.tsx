import React, { useState } from 'react';
import { useTasksContext } from '../../context/TasksContext';
import { TaskItem } from './TaskItem';
import './TaskList.css'; // Will create

export const TaskList: React.FC = () => {
    const { tasks, addTask, activeTaskId } = useTasksContext();
    const [isAdding, setIsAdding] = useState(false);
    const [title, setTitle] = useState('');
    const [est, setEst] = useState(1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            addTask(title, est);
            setTitle('');
            setEst(1);
            setIsAdding(false);
        }
    };

    const activeTask = tasks.find(t => t.id === activeTaskId);

    return (
        <div className="task-list-container">
            <div className="task-header">
                <h2>Tasks</h2>
                <div className="task-menu">
                    <button className="btn-icon">⋮</button>
                </div>
            </div>

            {activeTask && (
                <div className="current-task-banner">
                    <span>Working on:</span>
                    <strong>{activeTask.title}</strong>
                </div>
            )}

            <div className="tasks-scroll">
                {tasks.map(task => (
                    <TaskItem key={task.id} task={task} />
                ))}
            </div>

            {!isAdding ? (
                <button className="add-task-btn" onClick={() => setIsAdding(true)}>
                    <span className="plus">+</span> Add Task
                </button>
            ) : (
                <form className="add-task-form" onSubmit={handleSubmit}>
                    <input
                        autoFocus
                        type="text"
                        placeholder="What are you working on?"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="task-input"
                    />
                    <div className="form-footer">
                        <div className="est-control">
                            <label>Est Pomodoros</label>
                            <input
                                type="number"
                                min="1"
                                max="10"
                                value={est}
                                onChange={e => setEst(parseInt(e.target.value))}
                            />
                        </div>
                        <div className="form-actions">
                            <button type="button" className="btn" onClick={() => setIsAdding(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary">Save</button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};
