import type { ZoneId } from "@/types";

const ZONE_BASE_FREQ: Record<ZoneId, number> = {
  void: 110,
  discord_plaza: 220,
  event_arena: 165,
  content_district: 196,
  moderator_gate: 130,
  seed_hall: 246,
};

type EnvelopeOptions = {
  freq: number;
  duration: number;
  peak: number;
  sweepTo?: number;
  type?: OscillatorType;
};

class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private ambientNodes: OscillatorNode[] = [];
  private currentZone: ZoneId | null = null;
  private enabled = true;
  private volume = 0.5;

  init(): void {
    if (this.ctx || typeof window === "undefined") return;
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.enabled ? this.volume : 0;
    this.master.connect(this.ctx.destination);
  }

  setEnabled(on: boolean): void {
    this.enabled = on;
    if (this.master) this.master.gain.value = on ? this.volume : 0;
    if (!on) this.stopAmbient();
  }

  setVolume(v: number): void {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.master && this.enabled) this.master.gain.value = this.volume;
  }

  async resume(): Promise<void> {
    if (this.ctx?.state === "suspended") await this.ctx.resume();
  }

  async suspend(): Promise<void> {
    if (this.ctx?.state === "running") await this.ctx.suspend();
  }

  startAmbient(zone: ZoneId): void {
    if (!this.enabled || !this.ctx || !this.master) return;
    if (this.currentZone === zone && this.ambientNodes.length > 0) return;
    this.stopAmbient();

    const ctx = this.ctx;
    const base = ZONE_BASE_FREQ[zone];

    const drone1 = ctx.createOscillator();
    drone1.type = "triangle";
    drone1.frequency.value = base;

    const drone2 = ctx.createOscillator();
    drone2.type = "sine";
    drone2.frequency.value = base * 1.5;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 900;
    filter.Q.value = 0.4;

    const ambientGain = ctx.createGain();
    ambientGain.gain.value = 0.045;

    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.12;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.018;
    lfo.connect(lfoGain);
    lfoGain.connect(ambientGain.gain);

    drone1.connect(filter);
    drone2.connect(filter);
    filter.connect(ambientGain);
    ambientGain.connect(this.master);

    drone1.start();
    drone2.start();
    lfo.start();

    this.ambientNodes = [drone1, drone2, lfo];
    this.currentZone = zone;
  }

  stopAmbient(): void {
    for (const node of this.ambientNodes) {
      try {
        node.stop();
      } catch {
        // node may already be stopped
      }
    }
    this.ambientNodes = [];
    this.currentZone = null;
  }

  playTick(): void {
    this.playEnvelope({ freq: 880, duration: 0.04, peak: 0.12, type: "square" });
  }

  playEp(): void {
    this.playEnvelope({ freq: 660, duration: 0.18, peak: 0.14, sweepTo: 990, type: "sine" });
  }

  playComplete(): void {
    this.playChord([523.25, 659.25, 783.99], 0.55);
  }

  private playEnvelope({ freq, duration, peak, sweepTo, type = "sine" }: EnvelopeOptions): void {
    if (!this.enabled || !this.ctx || !this.master) return;
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    if (sweepTo) {
      osc.frequency.exponentialRampToValueAtTime(sweepTo, ctx.currentTime + duration);
    }
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(peak, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.master);
    osc.start();
    osc.stop(ctx.currentTime + duration + 0.02);
  }

  private playChord(freqs: number[], duration: number): void {
    if (!this.enabled || !this.ctx || !this.master) return;
    const ctx = this.ctx;
    const chordGain = ctx.createGain();
    chordGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    chordGain.gain.exponentialRampToValueAtTime(0.11, ctx.currentTime + 0.02);
    chordGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    chordGain.connect(this.master);

    for (const freq of freqs) {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      osc.connect(chordGain);
      osc.start();
      osc.stop(ctx.currentTime + duration + 0.05);
    }
  }
}

export const audioEngine = new AudioEngine();
