export type TimerMode = 'focus' | 'short-break' | 'long-break';
export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

export interface TimerState {
    mode: TimerMode;
    status: TimerStatus;
    timeLeft: number; // in milliseconds
    duration: number; // total duration in milliseconds
    startTime: number | null; // Date.now() when timer started/resumed
    sessionsCompleted: number;
    params: TimerParams;
}

export interface TimerParams {
    focusDuration: number;
    shortBreakDuration: number;
    longBreakDuration: number;
    longBreakInterval: number; // sessions before long break
    autoStart: boolean;
    overtime: boolean;
    notificationsEnabled: boolean;
    soundEnabled: boolean;
    soundType: 'bell' | 'knock' | 'chime' | 'digital';
    soundVolume: number; // 0-1
}

export const DEFAULT_PARAMS: TimerParams = {
    focusDuration: 25 * 60 * 1000,
    shortBreakDuration: 5 * 60 * 1000,
    longBreakDuration: 15 * 60 * 1000,
    longBreakInterval: 4,
    autoStart: false,
    overtime: false,
    notificationsEnabled: false,
    soundEnabled: true,
    soundType: 'bell',
    soundVolume: 0.5,
};

export const formatTime = (ms: number, includeMs: boolean = true): string => {
    const isNegative = ms < 0;
    const absMs = Math.abs(ms);
    const totalSeconds = Math.floor(absMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const sign = isNegative ? '-' : '';
    const m = minutes.toString().padStart(2, '0');
    const s = seconds.toString().padStart(2, '0');

    if (includeMs) {
        const milliseconds = Math.floor((absMs % 1000) / 10); // 2 digits (0-99)
        const msStr = milliseconds.toString().padStart(2, '0');
        return `${sign}${m}:${s}.${msStr}`;
    }

    return `${sign}${m}:${s}`;
};
