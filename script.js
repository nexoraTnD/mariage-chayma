const intro = document.getElementById("intro");
const envelopeScreen = document.getElementById("envelopeScreen");
const invitation = document.getElementById("invitation");
const openIntro = document.getElementById("openIntro");
const envelope = document.getElementById("envelope");
const musicBtn = document.getElementById("musicBtn");
const petals = document.getElementById("petals");

let audioCtx;
let masterGain;
let musicOn = false;
let oscillators = [];
let melodyTimer = null;

createPetals();

openIntro.addEventListener("click", () => {
  startSoftMusic();
  intro.classList.remove("active");
  envelopeScreen.classList.add("active");
});

envelope.addEventListener("click", () => {
  envelope.classList.add("open");
  setTimeout(() => {
    envelopeScreen.classList.remove("active");
    invitation.classList.add("active");
  }, 1500);
});

musicBtn.addEventListener("click", () => {
  if (musicOn) stopSoftMusic();
  else startSoftMusic();
});

function startSoftMusic() {
  if (musicOn) return;

  audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
  musicOn = true;
  musicBtn.textContent = "♫ Pause";

  masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
  masterGain.gain.exponentialRampToValueAtTime(0.035, audioCtx.currentTime + 2.2);
  masterGain.connect(audioCtx.destination);

  const chord = [261.63, 329.63, 392.0, 523.25];

  oscillators = chord.map((freq, index) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.value = index === 0 ? 0.75 : 0.22;

    osc.connect(gain);
    gain.connect(masterGain);
    osc.start();

    return { osc, gain };
  });

  playGentleMelody();
}

function playGentleMelody() {
  if (!musicOn || !oscillators[0]) return;

  const melody = [
    392.0, 329.63, 261.63, 329.63,
    392.0, 523.25, 440.0, 392.0,
    329.63, 349.23, 392.0, 329.63
  ];

  let i = 0;

  const step = () => {
    if (!musicOn || !oscillators[0]) return;

    oscillators[0].osc.frequency.setTargetAtTime(
      melody[i % melody.length],
      audioCtx.currentTime,
      0.12
    );

    i++;
    melodyTimer = setTimeout(step, 1350);
  };

  step();
}

function stopSoftMusic() {
  musicOn = false;
  musicBtn.textContent = "♫ Musique";

  if (melodyTimer) clearTimeout(melodyTimer);

  if (masterGain && audioCtx) {
    masterGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
  }

  setTimeout(() => {
    oscillators.forEach(({ osc }) => {
      try { osc.stop(); } catch {}
    });
    oscillators = [];
  }, 900);
}

function updateCountdown() {
  const weddingDate = new Date("2026-07-17T18:00:00").getTime();
  const now = new Date().getTime();
  const diff = Math.max(weddingDate - now, 0);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById("days").textContent = String(days).padStart(2, "0");
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}

function createPetals() {
  const symbols = ["❀", "✿", "✾", "♡"];
  for (let i = 0; i < 22; i++) {
    const petal = document.createElement("span");
    petal.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    petal.style.left = `${Math.random() * 100}vw`;
    petal.style.animationDuration = `${8 + Math.random() * 8}s`;
    petal.style.animationDelay = `${Math.random() * 8}s`;
    petal.style.fontSize = `${15 + Math.random() * 14}px`;
    petal.style.opacity = `${0.25 + Math.random() * 0.45}`;
    petals.appendChild(petal);
  }
}

updateCountdown();
setInterval(updateCountdown, 1000);
