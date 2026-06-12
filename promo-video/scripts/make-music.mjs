// Deterministic upbeat chiptune bed (~58s) rendered straight to WAV.
// Soft mix by design — it sits under narration at low volume.
import { writeFileSync } from "node:fs";

const SR = 44100;
const BPM = 126;
const BEAT = 60 / BPM;
const STEP = BEAT / 2; // 8th notes
const BARS = 30; // 30 bars * 4 beats * ~0.476s ≈ 57.1s
const DUR = BARS * 4 * BEAT + 1.5; // tail for release
const N = Math.ceil(DUR * SR);
const L = new Float32Array(N);
const R = new Float32Array(N);

const noteHz = (semisFromA4) => 440 * Math.pow(2, semisFromA4 / 12);
// C major scale degrees as semitones from A4 (C4 = -9)
const C4 = -9;
// Chord progression per bar: C - G - Am - F (roots, semitones from A4)
const PROG = [
  { root: C4, chord: [0, 4, 7] },        // C
  { root: C4 + 7, chord: [0, 4, 7] },    // G
  { root: C4 + 9, chord: [0, 3, 7] },    // Am
  { root: C4 + 5, chord: [0, 4, 7] },    // F
];

function osc(type, phase) {
  const p = phase % 1;
  if (type === "square") return p < 0.5 ? 1 : -1;
  if (type === "triangle") return 4 * Math.abs(p - 0.5) - 1;
  if (type === "saw") return 2 * p - 1;
  return Math.sin(2 * Math.PI * p);
}

function addNote({ t, dur, hz, type, gain, pan = 0, attack = 0.005, release = 0.05 }) {
  const start = Math.floor(t * SR);
  const len = Math.floor((dur + release) * SR);
  let phase = 0;
  const lg = gain * (1 - pan) * 0.5 + gain * 0.5;
  const rg = gain * (1 + pan) * 0.5 + gain * 0.5;
  for (let i = 0; i < len; i++) {
    const idx = start + i;
    if (idx >= N) break;
    const time = i / SR;
    let env = 1;
    if (time < attack) env = time / attack;
    else if (time > dur) env = Math.max(0, 1 - (time - dur) / release);
    phase += hz / SR;
    const v = osc(type, phase) * env * gain;
    L[idx] += v * (1 - Math.max(0, pan));
    R[idx] += v * (1 + Math.min(0, pan));
  }
}

function addHat(t, gain) {
  const start = Math.floor(t * SR);
  const len = Math.floor(0.03 * SR);
  let seed = 1234567 + start;
  for (let i = 0; i < len; i++) {
    const idx = start + i;
    if (idx >= N) break;
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    const v = ((seed / 0x7fffffff) * 2 - 1) * gain * (1 - i / len);
    L[idx] += v * 0.8;
    R[idx] += v;
  }
}

function addKick(t, gain) {
  const start = Math.floor(t * SR);
  const len = Math.floor(0.12 * SR);
  let phase = 0;
  for (let i = 0; i < len; i++) {
    const idx = start + i;
    if (idx >= N) break;
    const time = i / SR;
    const hz = 110 * Math.pow(0.25, time / 0.12) + 40;
    phase += hz / SR;
    const v = Math.sin(2 * Math.PI * phase) * gain * (1 - time / 0.12);
    L[idx] += v;
    R[idx] += v;
  }
}

// Lead melody pattern per bar (scale steps relative to chord root, -1 = rest)
const LEAD_A = [0, 7, 4, 7, 12, 7, 4, 7];
const LEAD_B = [0, 4, 7, 12, 7, 12, 16, 12];

for (let bar = 0; bar < BARS; bar++) {
  const t0 = bar * 4 * BEAT;
  const { root, chord } = PROG[bar % 4];
  const intro = bar < 2; // sparse intro
  const bSection = bar >= 14 && bar < 22; // brighter mid-section
  const outro = bar >= BARS - 2;

  // Kick on 1 and 3, hats on 8ths
  for (let beat = 0; beat < 4; beat++) {
    if (!intro) addKick(t0 + beat * BEAT, beat % 2 === 0 ? 0.16 : 0.1);
    addHat(t0 + beat * BEAT + STEP, intro ? 0.02 : 0.04);
  }

  // Bass: triangle roots on 8ths, octave bounce
  for (let s = 0; s < 8; s++) {
    const oct = s % 2 === 0 ? -24 : -12;
    addNote({
      t: t0 + s * STEP,
      dur: STEP * 0.85,
      hz: noteHz(root + oct),
      type: "triangle",
      gain: intro ? 0.05 : 0.09,
    });
  }

  // Chord stabs: soft squares on offbeats 2 & 4
  if (!intro) {
    for (const beat of [1, 3]) {
      chord.forEach((iv, k) =>
        addNote({
          t: t0 + beat * BEAT,
          dur: BEAT * 0.4,
          hz: noteHz(root + iv),
          type: "square",
          gain: 0.022,
          pan: k === 0 ? -0.3 : k === 2 ? 0.3 : 0,
        }),
      );
    }
  }

  // Lead: square arpeggio melody (skip intro + outro for breathing room)
  if (!intro && !outro) {
    const pattern = bSection ? LEAD_B : LEAD_A;
    for (let s = 0; s < 8; s++) {
      const step = pattern[s];
      if (step < 0) continue;
      addNote({
        t: t0 + s * STEP,
        dur: STEP * 0.7,
        hz: noteHz(root + step + (bSection ? 12 : 0)),
        type: "square",
        gain: bSection ? 0.035 : 0.03,
        pan: s % 2 === 0 ? 0.15 : -0.15,
      });
    }
  }
}

// Gentle fade-out over the final 2s
const fadeStart = Math.floor((DUR - 2) * SR);
for (let i = fadeStart; i < N; i++) {
  const g = Math.max(0, 1 - (i - fadeStart) / (N - fadeStart));
  L[i] *= g;
  R[i] *= g;
}

// Write 16-bit stereo WAV
const data = Buffer.alloc(N * 4);
for (let i = 0; i < N; i++) {
  data.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(L[i] * 32767))), i * 4);
  data.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(R[i] * 32767))), i * 4 + 2);
}
const header = Buffer.alloc(44);
header.write("RIFF", 0);
header.writeUInt32LE(36 + data.length, 4);
header.write("WAVEfmt ", 8);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20);
header.writeUInt16LE(2, 22);
header.writeUInt32LE(SR, 24);
header.writeUInt32LE(SR * 4, 28);
header.writeUInt16LE(4, 32);
header.writeUInt16LE(16, 34);
header.write("data", 36);
header.writeUInt32LE(data.length, 40);
writeFileSync(new URL("../audio/music.wav", import.meta.url), Buffer.concat([header, data]));
console.log(`music.wav written: ${DUR.toFixed(1)}s`);
