const container = document.querySelector('.grid-container');
const targetNumberElement = document.getElementById('target-number');
const scoreElement = document.getElementById('score');
const toggleButton = document.getElementById('toggle-button');
const directionsElement = document.getElementById('directions');
const gameModeSelect = document.getElementById('game-mode');

let correctClicks = 0;
let wrongClicks = 0;
let targetNumber;
let displayedNumber;
let numbersVisible = true; // Anfangszustand der Sichtbarkeit der Zahlen
let directions = [];
let gameMode = 'classic';

// Erstellt das 10x10-Gitter und speichert die Zahl im data-number Attribut
for (let i = 1; i <= 100; i++) {
    const cell = document.createElement('div');
    cell.classList.add('grid-item');
    cell.textContent = i; // Zeigt die Zahl im Grid an
    cell.setAttribute('data-number', i); // Speichert die Zahl im data-number-Attribut

    // Klick-Event für jede Zelle
    cell.addEventListener('click', () => {
        const cellNumber = parseInt(cell.getAttribute('data-number'));
        if (gameMode === 'classic') {
            checkClassicMode(cellNumber, cell);
        } else if (gameMode === 'advanced') {
            checkAdvancedMode(cellNumber, cell);
        }
        updateScore();
    });

    container.appendChild(cell);
}

// Überprüfen im klassischen Modus
function checkClassicMode(cellNumber, cell) {
    if (cellNumber === targetNumber) {
        correctClicks++;
        flashCell(cell, 'correct');
        setRandomTargetNumber();
    } else {
        wrongClicks++;
        flashCell(cell, 'wrong');
    }
}

// Überprüfen im erweiterten Modus
function checkAdvancedMode(cellNumber, cell) {
    if (cellNumber === targetNumber) {
        correctClicks++;
        flashCell(cell, 'correct');
        setAdvancedTargetNumber();
    } else {
        wrongClicks++;
        flashCell(cell, 'wrong');
    }
}

// Setzt eine Zufallszahl als Ziel im klassischen Modus
function setRandomTargetNumber() {
    targetNumber = Math.floor(Math.random() * 100) + 1;
    targetNumberElement.textContent = `Finde die Zahl: ${targetNumber}`;
    directionsElement.textContent = ''; // Keine Pfeile im klassischen Modus
}

// Setzt eine Zufallszahl und generiert zufällige Pfeile im erweiterten Modus
function setAdvancedTargetNumber() {
    displayedNumber = Math.floor(Math.random() * 100) + 1;
    targetNumberElement.textContent = `Finde die Zahl: ${displayedNumber}`;
    directions = generateValidDirections(); // Generiert nur gültige Pfeile
    directionsElement.textContent = directions.map(dir => `${dir.symbol}`).join(' ');
    calculateTargetNumber();
}

// Generiert zufällige Pfeile (1-3 Schritte in zufälliger Richtung)
function generateRandomDirections() {
    const directions = [];
    const directionSymbols = { up: '↑', down: '↓', left: '←', right: '→' };
    const directionDeltas = { up: -10, down: 10, left: -1, right: 1 };

    const steps = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < steps; i++) {
        const directionKeys = Object.keys(directionDeltas);
        const randomDirection = directionKeys[Math.floor(Math.random() * directionKeys.length)];
        directions.push({
            direction: randomDirection,
            symbol: directionSymbols[randomDirection],
            delta: directionDeltas[randomDirection]
        });
    }
    return directions;
}

// Generiert gültige Pfeile (1-3 Schritte in zufälliger Richtung)
function generateValidDirections() {
    const validDirections = [];
    const directionSymbols = { up: '↑', down: '↓', left: '←', right: '→' };
    const directionDeltas = { up: -10, down: 10, left: -1, right: 1 };

    const steps = Math.floor(Math.random() * 3) + 1;
    let currentPosition = displayedNumber;

    for (let i = 0; i < steps; i++) {
        const directionKeys = Object.keys(directionDeltas);
        const randomDirection = directionKeys[Math.floor(Math.random() * directionKeys.length)];
        const delta = directionDeltas[randomDirection];
        const newPosition = currentPosition + delta;

        // Prüfen, ob die neue Position innerhalb der Grenzen ist
        if (newPosition >= 1 && newPosition <= 100) {
            // Zusätzliche Prüfung für Bewegungen, die die Zeilen-/Spaltengrenzen überschreiten könnten
            if ((randomDirection === 'left' && currentPosition % 10 === 1) || // Links von einer linken Grenze
                (randomDirection === 'right' && currentPosition % 10 === 0)) { // Rechts von einer rechten Grenze
                continue; // Überspringt diesen Schritt, da er das Gitter verlassen würde
            }

            // Wenn der Schritt gültig ist, füge ihn zu den Pfeilen hinzu
            validDirections.push({
                direction: randomDirection,
                symbol: directionSymbols[randomDirection],
                delta: delta
            });

            currentPosition = newPosition; // Aktualisiert die Position für den nächsten Schritt
        }
    }

    return validDirections;
}

// Berechnet die Zielnummer basierend auf den Pfeilen im erweiterten Modus
function calculateTargetNumber() {
    targetNumber = displayedNumber;
    directions.forEach(dir => {
        let newTarget = targetNumber + dir.delta;

        // Prüfen, ob die neue Position innerhalb der Grenzen ist
        if (newTarget >= 1 && newTarget <= 100) {
            // Zusätzliche Prüfung für Bewegungen, die die Zeilen-/Spaltengrenzen überschreiten könnten
            if ((dir.direction === 'left' && targetNumber % 10 === 1) || // Links von einer linken Grenze
                (dir.direction === 'right' && targetNumber % 10 === 0)) { // Rechts von einer rechten Grenze
                return; // Schritt überspringen, da er das Gitter verlassen würde
            }
            targetNumber = newTarget;
        }
    });
}

// Aktualisiert die Punktzahl-Anzeige
function updateScore() {
    scoreElement.textContent = `Richtig: ${correctClicks} | Falsch: ${wrongClicks}`;
}

// Toggle-Button Funktion zum Ein- und Ausblenden der Zahlen
toggleButton.addEventListener('click', () => {
    numbersVisible = !numbersVisible; // Zustand umschalten
    document.querySelectorAll('.grid-item').forEach(cell => {
        cell.textContent = numbersVisible ? cell.getAttribute('data-number') : ''; // Zeigt die gespeicherte Zahl oder leert das Feld
    });
    toggleButton.textContent = numbersVisible ? 'Zahlen ausblenden' : 'Zahlen einblenden';
});

// Spielmodus wechseln
gameModeSelect.addEventListener('change', (event) => {
    gameMode = event.target.value;
    if (gameMode === 'classic') {
        setRandomTargetNumber();
    } else if (gameMode === 'advanced') {
        setAdvancedTargetNumber();
    }
});

// Funktion für den "Flash"-Effekt bei einem Klick
function flashCell(cell, status) {
    cell.classList.add(status);
    setTimeout(() => {
        cell.classList.remove(status);
    }, 300);
}

// Startet das Spiel im ausgewählten Modus
if (gameMode === 'classic') {
    setRandomTargetNumber();
} else if (gameMode === 'advanced') {
    setAdvancedTargetNumber();
}
