export class NotificationManager {
    static async requestPermission(): Promise<NotificationPermission> {
        if (!('Notification' in window)) return 'denied';
        return await Notification.requestPermission();
    }

    static getPermission(): NotificationPermission {
        if (!('Notification' in window)) return 'denied';
        return Notification.permission;
    }

    /**
     * Attempts to claim a lock for sending a notification.
     * Returns true if successful (this tab wins), false otherwise.
     * Lock expires after 1 second.
     */
    static tryClaimNotificationLock(lockKey: string): boolean {
        const NOW = Date.now();
        const LOCK_EXPIRY = 2000;

        // Check if recently fired
        const lastFired = localStorage.getItem(`notify_lock_${lockKey}`);
        if (lastFired) {
            const timeDiff = NOW - parseInt(lastFired, 10);
            if (timeDiff < LOCK_EXPIRY) {
                console.log('Notification suppressed: Duplicate detected');
                return false;
            }
        }

        // Attempt to set lock
        localStorage.setItem(`notify_lock_${lockKey}`, NOW.toString());
        return true;
    }

    static send(title: string, options?: NotificationOptions) {
        if (this.getPermission() === 'granted') {
            try {
                new Notification(title, options);
            } catch (e) {
                console.error('Notification failed', e);
            }
        }
    }
}
