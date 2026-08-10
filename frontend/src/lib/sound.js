// Simple Web Audio API bell chime — no external asset needed.
let _ctx = null;
const getCtx = () => {
  if (typeof window === "undefined") return null;
  if (!_ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    _ctx = new AC();
  }
  return _ctx;
};

export const playBell = () => {
  try {
    const ctx = getCtx();
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume();
    const now = ctx.currentTime;

    // Two-tone bell: high ping + soft resonance
    const notes = [
      { freq: 880, dur: 0.35, gain: 0.16, start: 0 },
      { freq: 1318.5, dur: 0.45, gain: 0.12, start: 0.06 },
      { freq: 660, dur: 0.5, gain: 0.08, start: 0.14 },
    ];
    for (const n of notes) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(n.freq, now + n.start);
      g.gain.setValueAtTime(0.0001, now + n.start);
      g.gain.exponentialRampToValueAtTime(n.gain, now + n.start + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + n.start + n.dur);
      osc.connect(g).connect(ctx.destination);
      osc.start(now + n.start);
      osc.stop(now + n.start + n.dur + 0.05);
    }
  } catch (err) {
    // Web Audio not available or blocked — silent fallback
    if (typeof window !== "undefined" && window.console) {
      window.console.warn("playBell: audio playback failed", err?.message);
    }
  }
};
