let audioContext = null;
let soundOn = true;

function getContext() {
  if (audioContext === null) {
    audioContext = new AudioContext();
  }

  return audioContext;
}

function resumeContext() {
  const context = getContext();

  if (context.state === 'suspended') {
    context.resume().catch(() => undefined);
  }
}

export function setSoundOn(next) {
  soundOn = next;

  if (soundOn) {
    resumeContext();
  }
}

export function unlockSound() {
  if (!soundOn) {
    return;
  }

  resumeContext();
}

export function playMoveSound() {
  if (!soundOn) {
    return;
  }

  const context = getContext();
  const start = context.currentTime;
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(660, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.12, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.14);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + 0.15);
}
