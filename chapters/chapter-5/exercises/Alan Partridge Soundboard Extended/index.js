const samples = [
  { title: 'Aha!', src: 'audio/aha.mp3' },
  { title: 'Back of the net', src: 'audio/back-of-the-net.mp3' },
  { title: 'Smell my cheese', src: 'audio/smell-my-cheese.mp3' },
  { title: 'Jurassic Park', src: 'audio/jurassic-park.mp3' },
  { title: 'Knowing me, knowing you', src: 'audio/knowing-me.mp3' },
  { title: 'Monkey tennis', src: 'audio/monkey-tennis.mp3' },
  { title: 'Dan!', src: 'audio/dan.mp3' },
  { title: 'Stop it', src: 'audio/stop-it.mp3' },
  { title: 'Game on', src: 'audio/game-on.mp3' },
  { title: 'Smug face', src: 'audio/smug-face.mp3' },
  { title: 'Coffee break', src: 'audio/coffee-break.mp3' },
  { title: 'Err... right', src: 'audio/err-right.mp3' },
  { title: 'Weekend!', src: 'audio/weekend.mp3' },
  { title: 'Broom cupboard', src: 'audio/broom-cupboard.mp3' },
  { title: 'Glass of champers', src: 'audio/glass-of-champers.mp3' }
];

const itemsPerPage = 9;
let currentPage = 0;
const audioCache = new Map();

const sampleList = document.getElementById('sampleList');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const pageIndicator = document.getElementById('pageIndicator');
const speakButton = document.getElementById('speakButton');
const ttsText = document.getElementById('ttsText');
const ttsStatus = document.getElementById('ttsStatus');
const voiceSelect = document.getElementById('voiceSelect');

function getPageSamples() {
  const start = currentPage * itemsPerPage;
  return samples.slice(start, start + itemsPerPage);
}

function updatePager() {
  const totalPages = Math.ceil(samples.length / itemsPerPage);
  prevButton.disabled = currentPage === 0;
  nextButton.disabled = currentPage === totalPages - 1;
  pageIndicator.textContent = `Page ${currentPage + 1} of ${totalPages}`;
}

function createSampleElement(sample) {
  const card = document.createElement('article');
  card.className = 'sample-card';

  const button = document.createElement('button');
  button.className = 'sample-button';
  button.type = 'button';
  button.textContent = sample.title;
  button.addEventListener('click', () => playSample(sample));

  const duration = document.createElement('p');
  duration.className = 'sample-duration';
  duration.textContent = 'Duration: loading...';

  card.append(button, duration);
  loadDuration(sample, duration);
  return card;
}

function renderSamples() {
  sampleList.innerHTML = '';
  getPageSamples().forEach(sample => sampleList.appendChild(createSampleElement(sample)));
  updatePager();
}

function loadDuration(sample, durationElement) {
  const audio = new Audio(sample.src);
  audio.addEventListener('loadedmetadata', () => {
    const seconds = Math.round(audio.duration);
    durationElement.textContent = `Duration: ${seconds} sec`;
  });
  audio.addEventListener('error', () => {
    durationElement.textContent = 'Duration: unavailable';
  });
}

function playSample(sample) {
  if (!audioCache.has(sample.src)) {
    const audio = new Audio(sample.src);
    audioCache.set(sample.src, audio);
  }
  const audio = audioCache.get(sample.src);
  audio.currentTime = 0;
  audio.play().catch(() => {
    ttsStatus.textContent = 'Could not play audio. Ensure local files are available in audio/.';
  });
}

function populateVoices() {
  const voices = speechSynthesis.getVoices();
  voiceSelect.innerHTML = '';
  voices.forEach((voice, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = `${voice.name} (${voice.lang})${voice.default ? ' — default' : ''}`;
    voiceSelect.appendChild(option);
  });
}

function speakText() {
  const text = ttsText.value.trim();
  if (!text) {
    ttsStatus.textContent = 'Enter text before speaking.';
    return;
  }
  if (!('speechSynthesis' in window)) {
    ttsStatus.textContent = 'Speech synthesis is not supported in this browser.';
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  const voices = speechSynthesis.getVoices();
  const selectedVoice = voices[voiceSelect.value];
  if (selectedVoice) utterance.voice = selectedVoice;

  utterance.onstart = () => {
    ttsStatus.textContent = 'Speaking now...';
  };
  utterance.onend = () => {
    ttsStatus.textContent = 'Ready to speak again.';
  };
  utterance.onerror = () => {
    ttsStatus.textContent = 'Speech failed. Try a different voice or browser.';
  };

  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}

prevButton.addEventListener('click', () => {
  if (currentPage > 0) {
    currentPage -= 1;
    renderSamples();
  }
});

nextButton.addEventListener('click', () => {
  const totalPages = Math.ceil(samples.length / itemsPerPage);
  if (currentPage < totalPages - 1) {
    currentPage += 1;
    renderSamples();
  }
});

speakButton.addEventListener('click', speakText);

window.addEventListener('load', () => {
  renderSamples();
  populateVoices();
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoices;
  }
});
