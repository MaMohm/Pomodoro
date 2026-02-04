import { renderHook, act } from '@testing-library/react';
import { useTimer } from './useTimer';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('useTimer', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should initialize with default focus time (25min)', () => {
        const { result } = renderHook(() => useTimer());
        expect(result.current.timeLeft).toBe(25 * 60 * 1000);
        expect(result.current.mode).toBe('focus');
        expect(result.current.status).toBe('idle');
    });

    it('should start the timer and decrease time', () => {
        const { result } = renderHook(() => useTimer());

        act(() => {
            result.current.start();
        });

        expect(result.current.status).toBe('running');

        act(() => {
            vi.advanceTimersByTime(1000);
        });

        // Check roughly 1s passed. 
        // Note: useTimer tick loop updates state. 
        // Since we mock Date.now() behavior with vitest's fake timers implicitly if we use 'modern' timers,
        // actually standard vi.useFakeTimers() might catch setTimeout but NOT Date.now() automatically unless configured.
        // However, vitest's fake timers usually intercept Date.now().
        expect(result.current.timeLeft).toBeLessThan(25 * 60 * 1000);
        expect(result.current.timeLeft).toBeGreaterThanOrEqual(25 * 60 * 1000 - 1100);
    });

    it('should switch modes correctly', () => {
        const { result } = renderHook(() => useTimer());

        act(() => {
            result.current.switchMode('short-break');
        });

        expect(result.current.mode).toBe('short-break');
        expect(result.current.timeLeft).toBe(5 * 60 * 1000);
    });

    it('should pause and resume without losing time', () => {
        const { result } = renderHook(() => useTimer());

        act(() => {
            result.current.start();
            vi.advanceTimersByTime(5000);
        });

        act(() => {
            result.current.pause();
        });

        expect(result.current.status).toBe('paused');
        const pausedTime = result.current.timeLeft;

        // Advance time while paused
        act(() => {
            vi.advanceTimersByTime(10000);
        });

        // Time shouldn't change
        expect(result.current.timeLeft).toBe(pausedTime);

        // Resume
        act(() => {
            result.current.start();
        });

        expect(result.current.status).toBe('running');
    });

    it('should complete when time reaches 0', () => {
        // Start with a short duration for testing
        const { result } = renderHook(() => useTimer({ focusDuration: 2000 }));

        // Set a fixed start time
        const startTime = Date.now();
        vi.setSystemTime(startTime);

        act(() => {
            result.current.start();
        });

        // Advance time past the duration
        const futureTime = startTime + 2100;
        vi.setSystemTime(futureTime);

        act(() => {
            vi.advanceTimersByTime(2100);
        });

        expect(result.current.status).toBe('completed');
        expect(result.current.timeLeft).toBe(0);
    });
});
