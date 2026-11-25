// Script to synthesize an original romantic piano instrumental: "Sweet Love Theme"
// Chord progression: Cmaj7 - G/B - Am7 - Fmaj7 (72 BPM)
import fs from 'fs'
import path from 'path'

const SAMPLE_RATE = 44100
const BPM = 72
const BEAT_DURATION = 60 / BPM // ~0.8333s
const BAR_DURATION = BEAT_DURATION * 4 // ~3.3333s
const NUM_BARS = 8
const TOTAL_DURATION = NUM_BARS * BAR_DURATION // ~26.67 seconds
const TOTAL_SAMPLES = Math.floor(TOTAL_DURATION * SAMPLE_RATE)

// Frequency map for musical notes
const NOTES = {
  'C2': 65.41, 'D2': 73.42, 'E2': 82.41, 'F2': 87.31, 'G2': 98.00, 'A2': 110.00, 'B2': 123.47,
  'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
  'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
  'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
  'C6': 1046.50, 'D6': 1174.66, 'E6': 1318.51, 'G6': 1567.98
}

// Float32 stereo buffers
const leftChannel = new Float32Array(TOTAL_SAMPLES)
const rightChannel = new Float32Array(TOTAL_SAMPLES)

// Helper: render a piano note with natural harmonics and envelope
function addPianoNote(note, startTime, duration, velocity = 0.5, pan = 0) {
  const freq = NOTES[note]
  if (!freq) return

  const startSample = Math.floor(startTime * SAMPLE_RATE)
  const lengthSamples = Math.floor(duration * SAMPLE_RATE)

  for (let i = 0; i < lengthSamples; i++) {
    const idx = (startSample + i) % TOTAL_SAMPLES
    const t = i / SAMPLE_RATE

    // Piano amplitude envelope: quick attack, natural decay
    const attack = Math.min(1, t / 0.008)
    const decay = Math.exp(-t * (3.0 / Math.pow(freq / 261.63, 0.4)))
    const env = attack * decay * velocity

    // Piano harmonic structure (fundamental + warmth harmonics)
    const s1 = Math.sin(2 * Math.PI * freq * t)
    const s2 = 0.45 * Math.sin(2 * Math.PI * freq * 2 * t) * Math.exp(-t * 4)
    const s3 = 0.25 * Math.sin(2 * Math.PI * freq * 3 * t) * Math.exp(-t * 6)
    const s4 = 0.12 * Math.sin(2 * Math.PI * freq * 4 * t) * Math.exp(-t * 9)
    const s5 = 0.05 * Math.sin(2 * Math.PI * freq * 5 * t) * Math.exp(-t * 12)

    const sample = (s1 + s2 + s3 + s4 + s5) * env

    // Stereo panning
    const leftGain = Math.cos((pan + 1) * Math.PI / 4)
    const rightGain = Math.sin((pan + 1) * Math.PI / 4)

    leftChannel[idx] += sample * leftGain
    rightChannel[idx] += sample * rightGain
  }
}

// Helper: render a warm ambient pad tone
function addWarmPad(notes, startTime, duration, velocity = 0.15) {
  const startSample = Math.floor(startTime * SAMPLE_RATE)
  const lengthSamples = Math.floor(duration * SAMPLE_RATE)

  notes.forEach((noteName, chordIdx) => {
    const freq = NOTES[noteName]
    if (!freq) return
    const pan = (chordIdx / (notes.length - 1 || 1) - 0.5) * 0.7

    for (let i = 0; i < lengthSamples; i++) {
      const idx = (startSample + i) % TOTAL_SAMPLES
      const t = i / SAMPLE_RATE

      // Soft swell envelope
      const attack = Math.min(1, t / 0.7)
      const release = Math.min(1, (duration - t) / 0.7)
      const env = Math.max(0, attack * release) * velocity

      // Warm sine + subtle detuned chorus
      const s1 = Math.sin(2 * Math.PI * freq * t)
      const s2 = 0.4 * Math.sin(2 * Math.PI * (freq * 1.002) * t)
      const s3 = 0.3 * Math.sin(2 * Math.PI * (freq * 0.998) * t)

      const sample = (s1 + s2 + s3) * env

      const leftGain = Math.cos((pan + 1) * Math.PI / 4)
      const rightGain = Math.sin((pan + 1) * Math.PI / 4)

      leftChannel[idx] += sample * leftGain
      rightChannel[idx] += sample * rightGain
    }
  })
}

// Helper: render delicate bell chime accent
function addBellChime(note, startTime, duration = 3.5, velocity = 0.18, pan = 0.3) {
  const freq = NOTES[note]
  if (!freq) return

  const startSample = Math.floor(startTime * SAMPLE_RATE)
  const lengthSamples = Math.floor(duration * SAMPLE_RATE)

  for (let i = 0; i < lengthSamples; i++) {
    const idx = (startSample + i) % TOTAL_SAMPLES
    const t = i / SAMPLE_RATE

    const env = Math.exp(-t * 2.2) * velocity
    const s1 = Math.sin(2 * Math.PI * freq * t)
    const s2 = 0.25 * Math.sin(2 * Math.PI * freq * 2.005 * t) * Math.exp(-t * 3.5)
    const s3 = 0.15 * Math.sin(2 * Math.PI * freq * 3.01 * t) * Math.exp(-t * 5.0)

    const sample = (s1 + s2 + s3) * env

    const leftGain = Math.cos((pan + 1) * Math.PI / 4)
    const rightGain = Math.sin((pan + 1) * Math.PI / 4)

    leftChannel[idx] += sample * leftGain
    rightChannel[idx] += sample * rightGain
  }
}

// ----------------------------------------------------------------------
// COMPOSITION: "Sweet Love Theme ❤️"
// 8-Bar Seamless Romantic Loop
// Chords: Cmaj7 - G/B - Am7 - Fmaj7 | Cmaj7 - G/B - Am7 - Fmaj7 (resolved)
// ----------------------------------------------------------------------

const CHORDS = [
  // Section A (Bars 1-4)
  { name: 'Cmaj7', pad: ['C3', 'G3', 'B3', 'E4'], bass: 'C2', arpeg: ['C3', 'E3', 'G3', 'B3'] },
  { name: 'G/B',   pad: ['B2', 'G3', 'D4', 'G4'], bass: 'B2', arpeg: ['B2', 'D3', 'G3', 'D4'] },
  { name: 'Am7',   pad: ['A2', 'E3', 'G3', 'C4'], bass: 'A2', arpeg: ['A2', 'C3', 'E3', 'G3'] },
  { name: 'Fmaj7', pad: ['F2', 'C3', 'E3', 'A3'], bass: 'F2', arpeg: ['F2', 'A2', 'C3', 'E3'] },

  // Section B (Bars 5-8) - richer romantic variation
  { name: 'Cmaj7', pad: ['C3', 'E3', 'G3', 'B3', 'E4'], bass: 'C2', arpeg: ['C3', 'G3', 'C4', 'E4'] },
  { name: 'G/B',   pad: ['B2', 'D3', 'G3', 'B3', 'D4'], bass: 'B2', arpeg: ['B2', 'G3', 'D4', 'G4'] },
  { name: 'Am7',   pad: ['A2', 'E3', 'A3', 'C4', 'E4'], bass: 'A2', arpeg: ['A2', 'E3', 'A3', 'C4'] },
  { name: 'Fmaj7', pad: ['F2', 'C3', 'E3', 'G3', 'A3'], bass: 'F2', arpeg: ['F2', 'C3', 'A3', 'C4'] },
]

// 1. Render Warm Ambient Pads across all bars
CHORDS.forEach((chord, barIdx) => {
  const barStart = barIdx * BAR_DURATION
  addWarmPad(chord.pad, barStart, BAR_DURATION + 0.5, 0.14)
})

// 2. Render Piano Bass Notes & Gentle Arpeggios
CHORDS.forEach((chord, barIdx) => {
  const barStart = barIdx * BAR_DURATION

  // Bass root note on beat 1
  addPianoNote(chord.bass, barStart, BEAT_DURATION * 3, 0.45, -0.4)

  // Gentle arpeggio on beats 1, 2, 3, 4
  chord.arpeg.forEach((note, noteIdx) => {
    const noteTime = barStart + noteIdx * BEAT_DURATION
    addPianoNote(note, noteTime, BEAT_DURATION * 2, 0.35, -0.2 + noteIdx * 0.1)
  })

  // Subtle eighth-note pulse on beat 2.5 and 4.5
  addPianoNote(chord.arpeg[1], barStart + BEAT_DURATION * 1.5, BEAT_DURATION, 0.25, -0.1)
  addPianoNote(chord.arpeg[2], barStart + BEAT_DURATION * 3.5, BEAT_DURATION, 0.25, 0.1)
})

// 3. Render Romantic Piano Melody (Sweet, dreamy, memorable line)
const MELODY = [
  // Bar 1 (Cmaj7): Welcoming, gentle phrase
  { note: 'E5', bar: 0, beat: 1,   dur: 1.5, vel: 0.62 },
  { note: 'G5', bar: 0, beat: 2.5, dur: 0.8, vel: 0.58 },
  { note: 'E5', bar: 0, beat: 3.5, dur: 1.2, vel: 0.55 },

  // Bar 2 (G/B): Descending tender step
  { note: 'D5', bar: 1, beat: 1,   dur: 2.0, vel: 0.60 },
  { note: 'B4', bar: 1, beat: 3,   dur: 1.2, vel: 0.52 },
  { note: 'D5', bar: 1, beat: 4,   dur: 0.8, vel: 0.54 },

  // Bar 3 (Am7): Emotional heart of phrase
  { note: 'C5', bar: 2, beat: 1,   dur: 1.5, vel: 0.62 },
  { note: 'E5', bar: 2, beat: 2.5, dur: 0.8, vel: 0.58 },
  { note: 'A5', bar: 2, beat: 3.5, dur: 1.5, vel: 0.64 },

  // Bar 4 (Fmaj7): Sweet resolution to gentle rest
  { note: 'G5', bar: 3, beat: 1,   dur: 2.2, vel: 0.60 },
  { note: 'E5', bar: 3, beat: 3,   dur: 0.9, vel: 0.52 },
  { note: 'D5', bar: 3, beat: 4,   dur: 1.0, vel: 0.50 },

  // Bar 5 (Cmaj7): Section B opens higher, romantic warmth
  { note: 'E5', bar: 4, beat: 1,   dur: 1.2, vel: 0.64 },
  { note: 'G5', bar: 4, beat: 2,   dur: 1.0, vel: 0.60 },
  { note: 'C6', bar: 4, beat: 3,   dur: 2.0, vel: 0.68 },

  // Bar 6 (G/B): Loving response
  { note: 'B5', bar: 5, beat: 1,   dur: 1.5, vel: 0.62 },
  { note: 'G5', bar: 5, beat: 2.5, dur: 1.0, vel: 0.56 },
  { note: 'D5', bar: 5, beat: 3.5, dur: 1.4, vel: 0.54 },

  // Bar 7 (Am7): Passionate intimate peak
  { note: 'E5', bar: 6, beat: 1,   dur: 1.0, vel: 0.60 },
  { note: 'A5', bar: 6, beat: 2,   dur: 1.2, vel: 0.65 },
  { note: 'G5', bar: 6, beat: 3.2, dur: 0.8, vel: 0.58 },
  { note: 'E5', bar: 6, beat: 4,   dur: 1.0, vel: 0.56 },

  // Bar 8 (Fmaj7): Soft, sweet ending that loops seamlessly back to Bar 1
  { note: 'D5', bar: 7, beat: 1,   dur: 1.8, vel: 0.58 },
  { note: 'C5', bar: 7, beat: 2.8, dur: 1.2, vel: 0.52 },
  { note: 'D5', bar: 7, beat: 4,   dur: 1.0, vel: 0.48 }
]

MELODY.forEach(m => {
  const noteTime = m.bar * BAR_DURATION + (m.beat - 1) * BEAT_DURATION
  addPianoNote(m.note, noteTime, m.dur * BEAT_DURATION, m.vel, 0.15)
})

// 4. Render Delicate Bell Accents on key emotional peaks
addBellChime('E6', 0 * BAR_DURATION + 0 * BEAT_DURATION, 2.5, 0.15, 0.35)
addBellChime('G6', 2 * BAR_DURATION + 2.5 * BEAT_DURATION, 2.5, 0.16, -0.35)
addBellChime('C6', 4 * BAR_DURATION + 2 * BEAT_DURATION, 3.0, 0.18, 0.4)
addBellChime('E6', 6 * BAR_DURATION + 1 * BEAT_DURATION, 2.5, 0.15, -0.3)

// ----------------------------------------------------------------------
// Simple Warm Stereo Reverb / Comb Simulation for Acoustic Depth
// ----------------------------------------------------------------------
const reverbDelaySamples = Math.floor(0.065 * SAMPLE_RATE)
const reverbFeedback = 0.28
for (let i = reverbDelaySamples; i < TOTAL_SAMPLES; i++) {
  leftChannel[i] += leftChannel[i - reverbDelaySamples] * reverbFeedback
  rightChannel[i] += rightChannel[i - reverbDelaySamples] * reverbFeedback
}

// ----------------------------------------------------------------------
// Peak Normalization and WAV File Encoding
// ----------------------------------------------------------------------
let maxPeak = 0
for (let i = 0; i < TOTAL_SAMPLES; i++) {
  maxPeak = Math.max(maxPeak, Math.abs(leftChannel[i]), Math.abs(rightChannel[i]))
}

const targetPeak = 0.88 // Gentle mastering headroom
const gain = targetPeak / (maxPeak || 1)

// Generate 16-bit PCM WAV
const bytesPerSample = 2
const numChannels = 2
const dataSize = TOTAL_SAMPLES * numChannels * bytesPerSample
const buffer = Buffer.alloc(44 + dataSize)

// RIFF header
buffer.write('RIFF', 0)
buffer.writeUInt32LE(36 + dataSize, 4)
buffer.write('WAVE', 8)

// fmt subchunk
buffer.write('fmt ', 12)
buffer.writeUInt32LE(16, 16) // Subchunk1Size (16 for PCM)
buffer.writeUInt16LE(1, 20)  // AudioFormat (1 = PCM)
buffer.writeUInt16LE(numChannels, 22)
buffer.writeUInt32LE(SAMPLE_RATE, 24)
buffer.writeUInt32LE(SAMPLE_RATE * numChannels * bytesPerSample, 28) // ByteRate
buffer.writeUInt16LE(numChannels * bytesPerSample, 32) // BlockAlign
buffer.writeUInt16LE(bytesPerSample * 8, 34) // BitsPerSample

// data subchunk
buffer.write('data', 36)
buffer.writeUInt32LE(dataSize, 40)

let offset = 44
for (let i = 0; i < TOTAL_SAMPLES; i++) {
  const left = Math.max(-1, Math.min(1, leftChannel[i] * gain))
  const right = Math.max(-1, Math.min(1, rightChannel[i] * gain))

  const leftInt = left < 0 ? left * 0x8000 : left * 0x7FFF
  const rightInt = right < 0 ? right * 0x8000 : right * 0x7FFF

  buffer.writeInt16LE(Math.floor(leftInt), offset)
  offset += 2
  buffer.writeInt16LE(Math.floor(rightInt), offset)
  offset += 2
}

const outputDir = path.resolve('public', 'audio')
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

const outputPath = path.join(outputDir, 'sweet-love-theme.wav')
fs.writeFileSync(outputPath, buffer)

console.log(`Successfully generated original Sweet Love Theme:`)
console.log(`- Path: ${outputPath}`)
console.log(`- Duration: ${TOTAL_DURATION.toFixed(2)} seconds`)
console.log(`- File size: ${(buffer.length / 1024 / 1024).toFixed(2)} MB`)
