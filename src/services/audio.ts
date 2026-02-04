import bellSound from '../assets/sounds/soft_chime_pomodoro.mp3';

export type SoundType = 'bell' | 'knock' | 'chime' | 'digital';

class SoundManager {
    private ctx: AudioContext | null = null;
    private volume: number = 0.5;
    private type: SoundType = 'bell';
    private enabled: boolean = true;
    private audioBuffer: AudioBuffer | null = null;

    constructor() {
        this.ctx = typeof window !== 'undefined' ? new (window.AudioContext || (window as any).webkitAudioContext)() : null;
        this.loadBuffer();
    }

    private async loadBuffer() {
        if (!this.ctx) return;
        try {
            const response = await fetch(bellSound);
            const arrayBuffer = await response.arrayBuffer();
            this.audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);
        } catch (e) {
            console.error('Failed to load sound', e);
        }
    }

    setVolume(vol: number) {
        this.volume = Math.max(0, Math.min(1, vol));
    }

    setType(type: SoundType) {
        this.type = type;
    }

    setEnabled(enabled: boolean) {
        this.enabled = enabled;
    }

    play() {
        if (!this.enabled || !this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();

        // Prioritize custom sound for 'bell' or 'chime'
        if (this.type === 'bell' || this.type === 'chime') {
            if (this.audioBuffer) {
                const source = this.ctx.createBufferSource();
                const gain = this.ctx.createGain();
                source.buffer = this.audioBuffer;
                source.connect(gain);
                gain.connect(this.ctx.destination);
                gain.gain.value = this.volume;
                source.start(0);
                return;
            }
        }

        // Fallback to synthesis for others or if file fails
        this.playSynthesized();
    }

    private playSynthesized() {
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        const masterVol = this.volume;

        switch (this.type) {
            case 'knock':
                osc.frequency.setValueAtTime(150, t);
                osc.type = 'triangle';
                gain.gain.setValueAtTime(0, t);
                gain.gain.linearRampToValueAtTime(masterVol * 0.8, t + 0.01);
                gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
                osc.start(t);
                osc.stop(t + 0.1);
                break;

            case 'digital':
                osc.frequency.setValueAtTime(440, t);
                osc.type = 'square';
                const filter = this.ctx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.value = 600;
                osc.disconnect();
                osc.connect(filter);
                filter.connect(gain);
                gain.gain.setValueAtTime(0, t);
                gain.gain.linearRampToValueAtTime(masterVol * 0.3, t + 0.01);
                gain.gain.linearRampToValueAtTime(0, t + 0.2);
                osc.start(t);
                osc.stop(t + 0.2);
                break;

            default: // fallthrough to mild beep if buffer missing
                osc.frequency.setValueAtTime(880, t);
                gain.gain.setValueAtTime(0, t);
                gain.gain.linearRampToValueAtTime(masterVol * 0.5, t + 0.01);
                gain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);
                osc.start(t);
                osc.stop(t + 0.5);
                break;
        }
    }
}

export const soundManager = new SoundManager();
