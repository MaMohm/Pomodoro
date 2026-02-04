import React from 'react';
import { useTimerContext } from '../../context/TimerContext';
import './SettingsModal.css'; // We'll create this next

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const { params, setParams } = useTimerContext();
    const [localParams, setLocalParams] = React.useState(params);
    const [theme, setTheme] = React.useState<'light' | 'dark' | 'forest'>('light');

    React.useEffect(() => {
        setLocalParams(params);
    }, [params, isOpen]);

    // Sync theme
    React.useEffect(() => {
        const currentTheme = document.documentElement.getAttribute('data-theme') as 'light' | 'dark' | 'forest';
        if (currentTheme) setTheme(currentTheme);
    }, [isOpen]);

    const handleSave = () => {
        setParams(localParams);
        document.documentElement.setAttribute('data-theme', theme);
        onClose();
    };

    const handleDurationChange = (key: keyof typeof params, minutes: number) => {
        setLocalParams(prev => ({
            ...prev,
            [key]: minutes * 60 * 1000
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Settings</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    <section>
                        <h3>Timer (minutes)</h3>
                        <div className="input-group-row">
                            <label>
                                Focus
                                <input
                                    type="number"
                                    value={localParams.focusDuration / 60000}
                                    onChange={e => handleDurationChange('focusDuration', Number(e.target.value))}
                                />
                            </label>
                            <label>
                                Short Break
                                <input
                                    type="number"
                                    value={localParams.shortBreakDuration / 60000}
                                    onChange={e => handleDurationChange('shortBreakDuration', Number(e.target.value))}
                                />
                            </label>
                            <label>
                                Long Break
                                <input
                                    type="number"
                                    value={localParams.longBreakDuration / 60000}
                                    onChange={e => handleDurationChange('longBreakDuration', Number(e.target.value))}
                                />
                            </label>
                        </div>
                    </section>

                    <section>
                        <h3>Theme</h3>
                        <div className="theme-options">
                            {(['light', 'dark', 'forest'] as const).map(t => (
                                <button
                                    key={t}
                                    className={`theme-btn ${theme === t ? 'active' : ''}`}
                                    onClick={() => setTheme(t)}
                                    data-theme-preview={t}
                                >
                                    {t.charAt(0).toUpperCase() + t.slice(1)}
                                </button>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h3>Sound & Notifications</h3>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={localParams.notificationsEnabled}
                                onChange={e => {
                                    setLocalParams(p => ({ ...p, notificationsEnabled: e.target.checked }));
                                    if (e.target.checked) import('../../services/notifications').then(m => m.NotificationManager.requestPermission());
                                }}
                            />
                            Enable System Notifications
                        </label>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={localParams.soundEnabled}
                                onChange={e => setLocalParams(p => ({ ...p, soundEnabled: e.target.checked }))}
                            />
                            Enable Sound
                        </label>

                        {localParams.soundEnabled && (
                            <div style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <div className="input-group-row" style={{ alignItems: 'center' }}>
                                    <label style={{ flex: '0 0 auto' }}>Volume</label>
                                    <input
                                        type="range" min="0" max="1" step="0.1"
                                        value={localParams.soundVolume}
                                        onChange={e => {
                                            const vol = parseFloat(e.target.value);
                                            setLocalParams(p => ({ ...p, soundVolume: vol }));
                                            import('../../services/audio').then(m => {
                                                m.soundManager.setVolume(vol);
                                                m.soundManager.play(); // Preview
                                            });
                                        }}
                                        style={{ flex: 1 }}
                                    />
                                </div>
                                <div className="theme-options">
                                    {(['bell', 'knock', 'chime', 'digital'] as const).map(t => (
                                        <button
                                            key={t}
                                            className={`theme-btn ${localParams.soundType === t ? 'active' : ''}`}
                                            onClick={() => {
                                                setLocalParams(p => ({ ...p, soundType: t }));
                                                import('../../services/audio').then(m => {
                                                    m.soundManager.setType(t);
                                                    m.soundManager.setVolume(localParams.soundVolume);
                                                    m.soundManager.play();
                                                });
                                            }}
                                        >
                                            {t.charAt(0).toUpperCase() + t.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>

                    <section>
                        <h3>Options</h3>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={localParams.autoStart}
                                onChange={e => setLocalParams(p => ({ ...p, autoStart: e.target.checked }))}
                            />
                            Auto-start Breaks
                        </label>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={localParams.overtime}
                                onChange={e => setLocalParams(p => ({ ...p, overtime: e.target.checked }))}
                            />
                            Allow Overtime
                        </label>
                    </section>
                </div>

                <div className="modal-footer">
                    <button className="btn" onClick={onClose}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
                </div>
            </div>
        </div>
    );
};
