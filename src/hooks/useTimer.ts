import { useState, useEffect, useRef, useCallback } from 'react';
import type { TimerMode, TimerStatus, TimerParams } from '../utils/timer';
import { DEFAULT_PARAMS } from '../utils/timer';

// Tick rate for the timer loop
const TICK_RATE = 20; // 50Hz for smooth milliseconds

export const useTimer = (initialParams: Partial<TimerParams> = {}) => {
    const [mode, setMode] = useState<TimerMode>('focus');
    const [status, setStatus] = useState<TimerStatus>('idle');
    const [timeLeft, setTimeLeft] = useState(DEFAULT_PARAMS.focusDuration);
    const [params, setParams] = useState<TimerParams>({ ...DEFAULT_PARAMS, ...initialParams });
    const [sessionsCompleted, setSessionsCompleted] = useState(0);

    // Refs for drift correction
    const endTimeRef = useRef<number | null>(null);
    const rafRef = useRef<number | null>(null);
    const pausedTimeRef = useRef<number>(0);

    // Calculate duration based on current mode
    const getDuration = useCallback((currentMode: TimerMode) => {
        switch (currentMode) {
            case 'focus': return params.focusDuration;
            case 'short-break': return params.shortBreakDuration;
            case 'long-break': return params.longBreakDuration;
        }
    }, [params]);

    // Reset timer to initial state for current mode
    const reset = useCallback(() => {
        setStatus('idle');
        setTimeLeft(getDuration(mode));
        endTimeRef.current = null;
        pausedTimeRef.current = 0;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
    }, [mode, getDuration]);

    // Handle Mode Switching
    const switchMode = useCallback((newMode: TimerMode) => {
        setMode(newMode);
        setStatus('idle');
        setTimeLeft(getDuration(newMode));
        endTimeRef.current = null;
        pausedTimeRef.current = 0;
    }, [getDuration]);

    // Start / Resume
    const start = useCallback(() => {
        if (status === 'running') return;

        const now = Date.now();
        let targetEndTime: number;

        if (status === 'paused' && pausedTimeRef.current > 0) {
            targetEndTime = now + timeLeft;
        } else {
            targetEndTime = now + timeLeft;
        }

        endTimeRef.current = targetEndTime;
        setStatus('running');
    }, [status, timeLeft]);

    // Pause
    const pause = useCallback(() => {
        if (status !== 'running') return;
        setStatus('paused');
        endTimeRef.current = null;
    }, [status]);

    // Skip (Complete immediately)
    const skip = useCallback(() => {
        setStatus('completed');
        setTimeLeft(0);
        endTimeRef.current = null;
    }, []);

    // Helper to switch to next mode
    const proceedToNextMode = useCallback(() => {
        let nextMode: TimerMode = 'focus';

        if (mode === 'focus') {
            const newCompleted = sessionsCompleted + 1;
            setSessionsCompleted(newCompleted);
            if (newCompleted % params.longBreakInterval === 0) {
                nextMode = 'long-break';
            } else {
                nextMode = 'short-break';
            }
        } else {
            nextMode = 'focus';
        }

        switchMode(nextMode);
        if (params.autoStart) {
            // We need to wait a tick for state to update, or just force start?
            // Since switchMode sets idle, we can't immediately start comfortably without useEffect.
            // We rely on the effect below to handle auto-start? 
            // Actually, simplest is to use a flag or just assume user wants it running?
            // Let's rely on an effect listening to mode change?
        }
    }, [mode, sessionsCompleted, params.longBreakInterval, switchMode, params.autoStart]);


    // Auto-Transition watching 'completed' status
    useEffect(() => {
        if (status === 'completed') {
            // Wait 1 second to show 00:00 and let notification play
            const timer = setTimeout(() => {
                proceedToNextMode();
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [status, proceedToNextMode]);

    // Auto-start mechanic if needed
    // If we just switched mode and autoStart is true, we should start.
    // However, switchMode sets IDLE.
    // We can add a "shouldAutoStart" ref? 
    // Or check if previous status was completed?
    // Let's keep it simple: If autoStart is true, we simply start when mode changes?
    // No, that would start on manual switch too.

    // For now, let's just do the "Switch to Break Counter" part.
    // The AutoStart is a separate feature really. 
    // If params.autoStart is true, we should trigger start() inside the proceedToNextMode flow.
    // But State updates are async.
    // Let's handle it in the proceedToNextMode by setting a flag or using a ref.

    // Use RequestAnimationFrame or SetInterval for the loop
    useEffect(() => {
        if (status !== 'running' || !endTimeRef.current) {
            return;
        }

        const tick = () => {
            const now = Date.now();
            const remaining = endTimeRef.current! - now;

            setTimeLeft(Math.ceil(remaining));

            if (remaining <= 0) {
                if (params.overtime) {
                    // Overtime logic placeholder
                    setStatus('completed');
                    setTimeLeft(0);
                } else {
                    setStatus('completed');
                    setTimeLeft(0);
                }
            }
        };

        const intervalId = setInterval(tick, TICK_RATE);
        tick();

        return () => clearInterval(intervalId);
    }, [status, params.overtime]);

    // Handle Auto-Start after mode switch if needed
    useEffect(() => {
        if (status === 'idle' && params.autoStart) {
            // CAREFUL: This would auto-start even on manual reset or initial load?
            // We only want to auto-start if we CAME from a completion.
            // So this approach is risky.
            // Better to have proceedToNextMode set a "pendingStart" state?
        }
    }, [mode, status, params.autoStart]);

    return {
        mode,
        status,
        timeLeft,
        params,
        sessionsCompleted,
        setParams,
        start,
        pause,
        reset,
        skip,
        switchMode,
    };
};
