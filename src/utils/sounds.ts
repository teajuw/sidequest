// Sound utility using Web Audio API
// Option 3: Modern UI (Tech Feel)

let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

// Start Tracking sound: Two notes - acknowledgment sound (not error-like)
export const playStartTrackingSound = () => {
  try {
    console.log('Playing start tracking sound');
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Two notes for acknowledgment - gentle and welcoming
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

      // Softer envelope for acknowledgment
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.12, startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    });
  } catch (error) {
    console.error('Error playing start tracking sound:', error);
  }
};

// Complete Task sound: Two notes - satisfying but distinct from quest
export const playCompleteTaskSound = () => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Two notes for task completion - same as start tracking
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

      // Envelope - same volume as tracking
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

// Complete Quest sound: Three notes - victorious arpeggio
export const playCompleteQuestSound = () => {
  try {
    console.log('Playing complete quest sound');
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Three notes in the arpeggio
    const notes = [
      { freq: 783, time: 0 },      // G5
      { freq: 987, time: 0.08 },   // B5
      { freq: 1174, time: 0.16 }   // D6
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
      gainNode.gain.linearRampToValueAtTime(0.18, startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    });
  } catch (error) {
    console.error('Error playing complete quest sound:', error);
  }
};

// Milestone sound: Four notes - celebratory fanfare (reserved for milestones only)
export const playMilestoneSound = () => {
  try {
    console.log('Playing milestone sound');
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Four notes ascending - big celebration
    const notes = [
      { freq: 783, time: 0 },       // G5
      { freq: 987, time: 0.08 },    // B5
      { freq: 1174, time: 0.16 },   // D6
      { freq: 1568, time: 0.24 }    // G6 - octave up for grand finale
    ];

    notes.forEach(({ freq, time }, index) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = freq;

      const startTime = now + time;
      const duration = index === notes.length - 1 ? 0.25 : 0.15; // Longer final note

      // Envelope - slightly louder for celebration
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.22, startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    });
  } catch (error) {
    console.error('Error playing milestone sound:', error);
  }
};
