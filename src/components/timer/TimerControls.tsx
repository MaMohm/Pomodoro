import React from 'react';
import { useTimerContext } from '../../context/TimerContext';

export const TimerControls: React.FC = () => {
    const { status, start, pause, reset, skip } = useTimerContext();

    return (
        <div className="timer-controls">
            {status === 'running' ? (
                <button className="btn btn-primary" onClick={pause} aria-label="Pause Timer">
                    Pause
                </button>
            ) : (
                <button className="btn btn-primary" onClick={start} aria-label="Start Timer">
                    Start
                </button>
            )}

            <button className="btn" onClick={reset} aria-label="Reset Timer" disabled={status === 'idle'}>
                Reset
            </button>

            <button className="btn" onClick={skip} aria-label="Skip Session">
                Skip
            </button>
        </div>
    );
};
