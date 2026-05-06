// RGB Colour Guessing Game JavaScript file
// Get references to HTML elements
const rgbDisplay = document.getElementById('rgb-display');
const optionsDiv = document.getElementById('options');
const messageP = document.getElementById('message');
const scoreP = document.getElementById('score');
const livesP = document.getElementById('lives');
const replayBtn = document.getElementById('replay');

// Game variables
let score = 0;
let lives = 3;
let correctColor;

// Function to generate a random RGB color
function generateRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

// Function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Function to start a new round
function startRound() {
    // Generate correct color
    correctColor = generateRandomColor();
    // Display the RGB value
    rgbDisplay.textContent = correctColor.toUpperCase();
    // Generate options: 4 colors, one correct
    const options = [correctColor];
    while (options.length < 4) {
        const newColor = generateRandomColor();
        if (!options.includes(newColor)) {
            options.push(newColor);
        }
    }
    // Shuffle options
    shuffleArray(options);
    // Clear previous options
    optionsDiv.innerHTML = '';
    // Create buttons for options
    options.forEach(color => {
        const btn = document.createElement('button');
        btn.className = 'color-option';
        btn.style.backgroundColor = color;
        btn.addEventListener('click', () => checkGuess(color));
        optionsDiv.appendChild(btn);
    });
    // Clear message
    messageP.textContent = '';
}

// Function to check the user's guess
function checkGuess(guessedColor) {
    if (guessedColor === correctColor) {
        messageP.textContent = 'Correct!';
        messageP.style.color = 'green';
        score++;
        scoreP.textContent = `Score: ${score}`;
    } else {
        messageP.textContent = 'Incorrect!';
        messageP.style.color = 'red';
        lives--;
        livesP.textContent = `Lives: ${lives}`;
    }
    // Check if game over
    if (lives === 0) {
        messageP.textContent = `Game Over! Final Score: ${score}`;
        replayBtn.style.display = 'block';
        optionsDiv.innerHTML = '';
    } else {
        // Start next round after a short delay
        setTimeout(startRound, 1000);
    }
}

// Function to reset the game
function resetGame() {
    score = 0;
    lives = 3;
    scoreP.textContent = 'Score: 0';
    livesP.textContent = 'Lives: 3';
    replayBtn.style.display = 'none';
    startRound();
}

// Event listener for replay button
replayBtn.addEventListener('click', resetGame);

// Start the game
startRound();