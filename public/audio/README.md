# Sweet Love Theme ❤️

`sweet-love-theme.wav` is an **original** 26.7-second seamless loop synthesized
by [`scripts/generate-theme.mjs`](../../scripts/generate-theme.mjs). No
third-party music is used, so there are no licensing concerns.

- Chord progression: Cmaj7 – G/B – Am7 – Fmaj7
- Tempo: 72 BPM, 8 bars
- Instruments: warm pad, piano bass, arpeggios, melody and bell accents
- Format: 44.1 kHz, 16-bit stereo WAV

Regenerate the track at any time:

```bash
node scripts/generate-theme.mjs
```

The file is played by `src/components/MusicToggle.tsx`. Audio starts **off** and
only begins after a user gesture, in line with browser autoplay policies.
