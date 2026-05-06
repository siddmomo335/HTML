const samples = [
  { title: 'Aha!', src: 'audio/aha.mp3' },
  { title: 'Back of the net', src: 'audio/back-of-the-net.mp3' },
  { title: 'Smell my cheese', src: 'audio/smell-my-cheese.mp3' },
  { title: 'Jurassic Park', src: 'audio/jurassic-park.mp3' },
  { title: 'Knowing me, knowing you', src: 'audio/knowing-me.mp3' },
  { title: 'Monkey tennis', src: 'audio/monkey-tennis.mp3' },
  { title: 'Dan!', src: 'audio/dan.mp3' },
  { title: 'Stop it', src: 'audio/stop-it.mp3' },
  { title: 'Game on', src: 'audio/game-on.mp3' }
];

const sampleGrid = document.getElementById('sampleGrid');
const audioCache = new Map();

function createSampleCard(sample) {
  const card = document.createElement('article');
  card.className = 'sample-card';

  const button = document.createElement('button');
  button.className = 'sample-button';
  button.textContent = sample.title;
  button.type = 'button';
  button.addEventListener('click', () => playSample(sample));

  const meta = document.createElement('p');
  meta.className = 'sample-meta';
  meta.textContent = 'Click to play';

  card.append(button, meta);
  return card;
}

function playSample(sample) {
  if (!audioCache.has(sample.src)) {
    const audio = new Audio(sample.src);
    audioCache.set(sample.src, audio);
  }
  const audio = audioCache.get(sample.src);
  audio.currentTime = 0;
  audio.play().catch(() => {
    alert('Please make sure the audio files are present in the audio folder and that your browser supports MP3.');
  });
}

function initSoundboard() {
  samples.forEach(sample => {
    sampleGrid.appendChild(createSampleCard(sample));
  });
}

initSoundboard();
