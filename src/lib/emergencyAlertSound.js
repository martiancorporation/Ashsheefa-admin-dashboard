// Plays the Emergency SOS alert sound (public/assets/mp3/) to draw attention
// when an emergency comes in.
//
// IMPORTANT: browsers block audio until the user has interacted with the page
// (autoplay policy). On a fresh page load / reload playback is blocked until the
// first user gesture. To handle that we:
//   1. Listen for the first user interaction (click / touch / key) and unlock
//      audio then — it stays unlocked for the rest of the session.
//   2. If an alert is requested while audio is still locked, we remember it and
//      fire it the moment the user interacts.

const ALERT_SRC = "/assets/mp3/mixkit-classic-alarm-995.wav";

let audioEl = null;
let unlocked = false;
let pendingAlert = false;

function getAudioEl() {
  if (typeof window === "undefined") return null;
  if (!audioEl) {
    audioEl = new Audio(ALERT_SRC);
    audioEl.preload = "auto";
  }
  return audioEl;
}

function emitAlert() {
  const el = getAudioEl();
  if (!el) return;
  try {
    el.currentTime = 0;
  } catch (_) {
    /* ignore */
  }
  const p = el.play();
  if (p && typeof p.catch === "function") {
    p.catch(() => {
      // Blocked (no user gesture yet) — queue and wait for interaction.
      pendingAlert = true;
      armUnlockListeners();
    });
  }
}

// Attach listeners that unlock audio on the first user gesture.
function armUnlockListeners() {
  if (typeof window === "undefined" || unlocked) return;

  const handler = () => {
    unlocked = true;
    ["pointerdown", "keydown", "touchstart"].forEach((ev) =>
      window.removeEventListener(ev, handler)
    );
    // If an alert came in while we were locked, play it now.
    if (pendingAlert) {
      pendingAlert = false;
      emitAlert();
    }
  };

  ["pointerdown", "keydown", "touchstart"].forEach((ev) =>
    window.addEventListener(ev, handler)
  );
}

/**
 * Arm the audio-unlock listeners as early as possible (call once on app/
 * dashboard mount). The admin's first interaction anywhere then unlocks audio
 * for the whole session, so later SOS alerts play without needing a click.
 */
export function initEmergencyAudioUnlock() {
  if (typeof window === "undefined" || unlocked) return;
  getAudioEl(); // warm up / preload
  armUnlockListeners();
}

/**
 * Play the emergency alert sound. If audio is still locked by the browser, the
 * sound is queued and plays on the next user interaction.
 */
export function playEmergencyAlert() {
  emitAlert();
}

/**
 * Stop the emergency alert sound. Call this when the admin dismisses/acts on the
 * SOS popup so the alarm doesn't keep ringing to the end of the clip. Also drops
 * any alert queued behind the browser's autoplay unlock.
 */
export function stopEmergencyAlert() {
  pendingAlert = false;
  if (!audioEl) return;
  try {
    audioEl.pause();
    audioEl.currentTime = 0;
  } catch (_) {
    /* ignore */
  }
}

export default playEmergencyAlert;
