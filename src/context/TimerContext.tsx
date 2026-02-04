import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';
import { useTimer } from '../hooks/useTimer';
import type { TimerMode, TimerStatus, TimerParams } from '../utils/timer';

interface TimerContextValue {
    mode: TimerMode;
    status: TimerStatus;
    timeLeft: number;
    params: TimerParams;
    setParams: (params: TimerParams) => void;
    start: () => void;
    pause: () => void;
    reset: () => void;
    skip: () => void;
    switchMode: (mode: TimerMode) => void;
}

const TimerContext = createContext<TimerContextValue | undefined>(undefined);

export const TimerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const timer = useTimer();

    return (
        <TimerContext.Provider value={timer}>
            {children}
        </TimerContext.Provider>
    );
};

export const useTimerContext = () => {
    const context = useContext(TimerContext);
    if (context === undefined) {
        throw new Error('useTimerContext must be used within a TimerProvider');
    }
    return context;
};
