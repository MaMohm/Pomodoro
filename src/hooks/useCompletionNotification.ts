import { useEffect } from 'react';
import type { TimerState } from '../utils/timer';
import { NotificationManager } from '../services/notifications';
import { soundManager } from '../services/audio';
import { useToast } from '../context/ToastContext';

export const useCompletionNotification = (
    status: TimerState['status'],
    mode: TimerState['mode'],
    params: TimerState['params']
) => {
    const { addToast } = useToast();

    useEffect(() => {
        // Only trigger on completion
        if (status !== 'completed') return;

        // 1. Lock Prevention
        const lockKey = `complete_${mode}_${Math.floor(Date.now() / 1000)}`;
        const hasLock = NotificationManager.tryClaimNotificationLock(lockKey);

        // We always show toast locally (per tab) or maybe we want toast only once too?
        // Usually toast is fine per tab.
        const title = mode === 'focus' ? 'Focus Session Complete!' : 'Break Over!';
        addToast(title, 'success', 5000);

        // If we didn't get the lock for system-wide effects, stop here
        if (!hasLock) return;

        // 2. Sound
        if (params.soundEnabled) {
            soundManager.setEnabled(true);
            soundManager.setVolume(params.soundVolume);
            soundManager.setType(params.soundType);
            soundManager.play();
        }

        // 3. System Notification
        if (params.notificationsEnabled) {
            NotificationManager.send(title, {
                body: 'Time to switch tasks!',
                requireInteraction: true,
                icon: '/favicon.ico' // Assuming standard vite favicon
            });
        }

    }, [status, mode]); // Params omitted to avoid re-triggering on setting change, only status change matters
};
