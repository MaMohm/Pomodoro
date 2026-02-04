import React from 'react';
import { useTimerContext } from '../../context/TimerContext';
import { formatTime } from '../../utils/timer';
import './TimerDisplay.css'; // We'll create this next

export const TimerDisplay: React.FC = () => {
    const { timeLeft, mode, status } = useTimerContext();

    // Dynamic Title Update
    React.useEffect(() => {
        document.title = `${formatTime(timeLeft, false)} - ${mode.replace('-', ' ')}`;
    }, [timeLeft, mode]);

    return (
        <div className={`timer-display ${status === 'running' ? 'is-running' : ''}`} data-mode={mode}>
            <div className="timer-time" aria-live="polite">
                {formatTime(timeLeft)}
            </div>
            <div className="timer-status">
                {mode === 'focus' ? 'Focus' : mode === 'short-break' ? 'Short Break' : 'Long Break'}
            </div>
        </div>
    );
};
