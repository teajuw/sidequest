// Sound utility using Web Audio API
// Option 3: Modern UI (Tech Feel)

let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

// Start Tracking sound: Single ding - first note of the completion theme
export const playStartTrackingSound = () => {
  try {
    console.log('Playing start tracking sound');
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Single note - same as first note of completion
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // G5 (783Hz) - same as first completion note
    oscillator.frequency.value = 783;

    const duration = 0.12;

    // Same envelope as task completion
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.15, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

    oscillator.start(now);
    oscillator.stop(now + duration);
  } catch (error) {
    console.error('Error playing start tracking sound:', error);
  }
};

// Complete Task sound: Shorter version - first two notes of quest completion
export const playCompleteTaskSound = () => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Just the first two notes - a gentle "chirp"
    const notes = [
      { freq: 783, time: 0 },      // G5
      { freq: 987, time: 0.08 }    // B5
    ];

    notes.forEach(({ freq, time }) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = freq;

      const startTime = now + time;
      const duration = 0.12;

      // Envelope - slightly softer than quest completion
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    });
  } catch (error) {
    console.error('Error playing complete task sound:', error);
  }
};

// Complete Quest sound: "Success" arpeggio - more victorious with higher final note
export const playCompleteQuestSound = () => {
  try {
    console.log('Playing complete quest sound');
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Three notes in the arpeggio - higher final note for more victory
    const notes = [
      { freq: 783, time: 0 },      // G5
      { freq: 987, time: 0.1 },    // B5
      { freq: 1318, time: 0.2 }    // E6 (higher than before for more victory)
    ];

    notes.forEach(({ freq, time }) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = freq;

      const startTime = now + time;
      const duration = 0.15;

      // Envelope
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    });
  } catch (error) {
    console.error('Error playing complete quest sound:', error);
  }
};
