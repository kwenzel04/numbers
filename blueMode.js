// Elemente für den blauen Modus
const answerOptionsContainer = document.getElementById('answer-options');

// Startet den "Blaues Feld finden"-Modus
function startBlueMode() {
    correctClicks = 0;
    wrongClicks = 0;
    updateScore();
    resetGridHighlights();
    setBlueTargetNumber();
    answerOptionsContainer.style.display = 'flex'; // Zeigt Antwortoptionen an
}

// Wählt eine zufällige Zielnummer und hebt das Feld hervor
function setBlueTargetNumber() {
    targetNumber = Math.floor(Math.random() * 100) + 1;
    const targetCell = document.querySelector(`.grid-item[data-number="${targetNumber}"]`);
    targetCell.classList.add('highlight');
    generateAnswerOptions(targetNumber);
}

// Generiert vier Antwortoptionen für den blauen Modus
function generateAnswerOptions(correctAnswer) {
    const options = new Set([correctAnswer]);

    // Fügt 3 nahe, zufällige Zahlen hinzu
    while (options.size < 4) {
        const randomOffset = Math.floor(Math.random() * 11) - 5; // Offset von -5 bis +5
        const option = correctAnswer + randomOffset;
        if (option >= 1 && option <= 100) options.add(option);
    }

    answerOptionsContainer.innerHTML = '';
    Array.from(options).sort(() => Math.random() - 0.5).forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.className = 'answer-button';
        button.addEventListener('click', () => checkBlueModeAnswer(option, button));
        answerOptionsContainer.appendChild(button);
    });
}

// Überprüft die Antwort im blauen Modus und startet eine neue Runde
function checkBlueModeAnswer(selectedOption, button) {
    resetButtonColors();
    if (selectedOption === targetNumber) {
        correctClicks++;
        button.classList.add('correct'); // Grünes Feedback bei korrekter Antwort
    } else {
        wrongClicks++;
        button.classList.add('wrong'); // Rotes Feedback bei falscher Antwort
    }
    updateScore();
    setTimeout(() => {
        resetGridHighlights();
        setBlueTargetNumber(); // Startet nach kurzer Pause eine neue Runde
    }, 500);
}

// Aktualisiert die Punktzahl-Anzeige
function updateScore() {
    const scoreElement = document.getElementById('score');
    scoreElement.textContent = `Richtig: ${correctClicks} | Falsch: ${wrongClicks}`;
}

// Setzt alle Hervorhebungen auf dem Spielfeld zurück
function resetGridHighlights() {
    document.querySelectorAll('.grid-item').forEach(cell => cell.classList.remove('highlight'));
}

// Setzt die Farben der Antwortbuttons zurück
function resetButtonColors() {
    document.querySelectorAll('.answer-button').forEach(button => {
        button.classList.remove('correct', 'wrong');
    });
}
