import type { ZoneId } from "@/types";

/**
 * Procedural music engine. Each zone has its own looping "song" — tempo, chord
 * pad, bassline and lead arpeggio — scheduled with a Web Audio lookahead clock
 * (setTimeout schedules notes ahead at precise AudioContext times). No audio
 * files: everything is synthesised, so it works offline and weighs nothing.
 */

type Wave = OscillatorType;

type ZoneTrack = {
  bpm: number;
  /** Sustained chords, cycled across the bar (one per equal section). */
  chords: number[][];
  /** 16-step patterns; each entry is a MIDI note or null (rest). */
  bass: (number | null)[];
  lead: (number | null)[];
  waves: { bass: Wave; lead: Wave; pad: Wave };
};

const STEPS = 16;

// Each track loops one bar of 16th notes. Roots, scales and tempo carry the
// mood: minor/atmospheric for The Void, bright/major for Seed Hall, etc.
const ZONE_TRACKS: Record<ZoneId, ZoneTrack> = {
  // A minor — slow, sparse, mysterious.
  void: {
    bpm: 72,
    chords: [
      [57, 60, 64],
      [53, 57, 60],
    ],
    bass: [45, null, null, null, null, null, null, null, 40, null, null, null, null, null, null, null],
    lead: [null, null, 69, null, null, null, 72, null, null, null, 76, null, null, 74, null, null],
    waves: { bass: "triangle", lead: "sine", pad: "sine" },
  },
  // C major — upbeat, bouncy.
  discord_plaza: {
    bpm: 112,
    chords: [
      [60, 64, 67],
      [55, 59, 62],
    ],
    bass: [36, null, null, null, 36, null, null, null, 43, null, null, null, 43, null, null, null],
    lead: [72, null, 76, null, 79, null, 76, null, 72, null, 76, null, 79, null, 84, null],
    waves: { bass: "triangle", lead: "square", pad: "triangle" },
  },
  // E minor — fast, driving, tense.
  event_arena: {
    bpm: 134,
    chords: [
      [52, 55, 59],
      [48, 52, 55],
    ],
    bass: [40, null, 40, null, 40, null, 40, null, 36, null, 36, null, 36, null, 36, null],
    lead: [64, null, 71, null, 67, null, 74, null, 72, null, 67, null, 71, null, 74, null],
    waves: { bass: "sawtooth", lead: "square", pad: "sawtooth" },
  },
  // D add9 — dreamy, airy, lydian colour.
  content_district: {
    bpm: 96,
    chords: [
      [62, 66, 69, 76],
      [59, 62, 69, 74],
    ],
    bass: [50, null, null, null, null, null, null, null, 47, null, null, null, null, null, null, null],
    lead: [74, null, 78, null, 81, null, 78, null, 74, null, 76, null, 81, null, 86, null],
    waves: { bass: "triangle", lead: "triangle", pad: "sine" },
  },
  // F minor — slow, low, solemn.
  moderator_gate: {
    bpm: 76,
    chords: [
      [53, 56, 60],
      [49, 53, 56],
    ],
    bass: [41, null, null, null, null, null, null, null, 36, null, null, null, null, null, null, null],
    lead: [null, null, 68, null, null, null, 72, null, null, null, 68, null, null, null, 63, null],
    waves: { bass: "triangle", lead: "sine", pad: "sine" },
  },
  // G major — bright, ascending, triumphant resolution (I-IV-V-I).
  seed_hall: {
    bpm: 100,
    chords: [
      [55, 59, 62],
      [60, 64, 67],
      [62, 66, 69],
      [67, 71, 74],
    ],
    bass: [43, null, null, null, 48, null, null, null, 50, null, null, null, 55, null, null, null],
    lead: [67, null, 74, null, 72, null, 79, null, 74, null, 81, null, 79, null, 86, null],
    waves: { bass: "triangle", lead: "square", pad: "triangle" },
  },
};

function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

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
  private musicGain: GainNode | null = null;
  private currentZone: ZoneId | null = null;
  private track: ZoneTrack | null = null;
  private timer: number | null = null;
  private nextNoteTime = 0;
  private step = 0;
  private enabled = true;
  private volume = 0.5;

  private readonly lookaheadMs = 25;
  private readonly scheduleAhead = 0.16;

  init(): void {
    if (this.ctx || typeof window === "undefined") return;
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.enabled ? this.volume : 0;
    this.master.connect(this.ctx.destination);
    // Music sits under sound effects so feedback cues stay audible.
    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.value = 0.6;
    this.musicGain.connect(this.master);
  }

  setEnabled(on: boolean): void {
    this.enabled = on;
    if (this.master) this.master.gain.value = on ? this.volume : 0;
    if (on) {
      if (this.currentZone) this.startSequencer();
    } else {
      this.stopSequencer();
    }
  }

  setVolume(v: number): void {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.master && this.enabled) this.master.gain.value = this.volume;
  }

  async resume(): Promise<void> {
    if (this.ctx?.state === "suspended") await this.ctx.resume();
    // Re-anchor the clock after a gesture/visibility resume so the loop doesn't
    // fire a catch-up burst of notes.
    if (this.enabled && this.currentZone) this.startSequencer();
  }

  async suspend(): Promise<void> {
    this.stopSequencer();
    if (this.ctx?.state === "running") await this.ctx.suspend();
  }

  /** Switch the looping music to a zone's theme. */
  startAmbient(zone: ZoneId): void {
    if (this.currentZone === zone && this.timer !== null) return;
    this.currentZone = zone;
    if (!this.enabled || !this.ctx || !this.musicGain) return;
    this.startSequencer();
  }

  stopAmbient(): void {
    this.stopSequencer();
    this.currentZone = null;
    this.track = null;
  }

  private startSequencer(): void {
    if (!this.enabled || !this.ctx || !this.musicGain || !this.currentZone) return;
    this.stopSequencer();
    this.track = ZONE_TRACKS[this.currentZone];
    this.step = 0;
    this.nextNoteTime = this.ctx.currentTime + 0.1;
    this.scheduler();
  }

  private stopSequencer(): void {
    if (this.timer !== null) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
  }

  private scheduler = (): void => {
    if (!this.ctx || !this.track) return;
    const secondsPerStep = 60 / this.track.bpm / 4;

    while (this.nextNoteTime < this.ctx.currentTime + this.scheduleAhead) {
      this.scheduleStep(this.step, this.nextNoteTime, secondsPerStep);
      this.nextNoteTime += secondsPerStep;
      this.step = (this.step + 1) % STEPS;
    }

    this.timer = window.setTimeout(this.scheduler, this.lookaheadMs);
  };

  private scheduleStep(step: number, time: number, secondsPerStep: number): void {
    const track = this.track;
    if (!track || !this.musicGain) return;

    const bassNote = track.bass[step];
    if (bassNote != null) {
      this.playNote(bassNote, time, secondsPerStep * 3.6, track.waves.bass, 0.16);
    }

    const leadNote = track.lead[step];
    if (leadNote != null) {
      this.playNote(leadNote, time, secondsPerStep * 2.2, track.waves.lead, 0.09);
    }

    const sectionLen = STEPS / track.chords.length;
    if (step % sectionLen === 0) {
      const chord = track.chords[step / sectionLen];
      const duration = secondsPerStep * sectionLen * 0.96;
      for (const note of chord) {
        this.playPad(note, time, duration, track.waves.pad);
      }
    }
  }

  private playNote(midi: number, time: number, duration: number, type: Wave, peak: number): void {
    if (!this.ctx || !this.musicGain) return;
    const osc = this.ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = midiToFreq(midi);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(peak, time + 0.014);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    osc.connect(gain);
    gain.connect(this.musicGain);
    osc.start(time);
    osc.stop(time + duration + 0.05);
  }

  private playPad(midi: number, time: number, duration: number, type: Wave): void {
    if (!this.ctx || !this.musicGain) return;
    const osc = this.ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = midiToFreq(midi);
    const gain = this.ctx.createGain();
    const attack = Math.min(0.4, duration * 0.35);
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.05, time + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    osc.connect(gain);
    gain.connect(this.musicGain);
    osc.start(time);
    osc.stop(time + duration + 0.05);
  }

  // ---- Sound effects (play over the music, straight into master) ----

  playTick(): void {
    this.playEnvelope({ freq: 880, duration: 0.04, peak: 0.1, type: "square" });
  }

  playChoice(): void {
    this.playEnvelope({ freq: 520, duration: 0.12, peak: 0.12, sweepTo: 720, type: "triangle" });
  }

  playEp(): void {
    this.playEnvelope({ freq: 660, duration: 0.18, peak: 0.14, sweepTo: 990, type: "sine" });
  }

  playCorrect(): void {
    this.playChord([659.25, 987.77], 0.22);
  }

  playWrong(): void {
    this.playEnvelope({ freq: 196, duration: 0.28, peak: 0.12, sweepTo: 138, type: "sawtooth" });
  }

  playComplete(): void {
    this.playChord([523.25, 659.25, 783.99], 0.55);
  }

  playRankUp(): void {
    // Ascending fanfare resolving into a bright major chord.
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, index) => {
      this.playEnvelope({ freq, duration: 0.5 - index * 0.05, peak: 0.13, type: "triangle", delay: index * 0.09 });
    });
    this.playChord([523.25, 659.25, 783.99, 1046.5], 0.8, 0.4);
  }

  private playEnvelope({ freq, duration, peak, sweepTo, type = "sine", delay = 0 }: EnvelopeOptions & { delay?: number }): void {
    if (!this.enabled || !this.ctx || !this.master) return;
    const ctx = this.ctx;
    const start = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    if (sweepTo) {
      osc.frequency.exponentialRampToValueAtTime(sweepTo, start + duration);
    }
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(peak, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(gain);
    gain.connect(this.master);
    osc.start(start);
    osc.stop(start + duration + 0.02);
  }

  private playChord(freqs: number[], duration: number, delay = 0): void {
    if (!this.enabled || !this.ctx || !this.master) return;
    const ctx = this.ctx;
    const start = ctx.currentTime + delay;
    const chordGain = ctx.createGain();
    chordGain.gain.setValueAtTime(0.0001, start);
    chordGain.gain.exponentialRampToValueAtTime(0.11, start + 0.02);
    chordGain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    chordGain.connect(this.master);

    for (const freq of freqs) {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      osc.connect(chordGain);
      osc.start(start);
      osc.stop(start + duration + 0.05);
    }
  }
}

export const audioEngine = new AudioEngine();
