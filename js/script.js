const loadJsonFile = async (filePath) => {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error loading JSON file:", error);
        return null;
    }
}

const runGame = (WORDS) => {
    // console.log(WORDS);
    const word = WORDS[Math.floor(Math.random() * WORDS.length)]; 
    const letterAppearanceInWord = {};
    for (const letter of word) {
        letterAppearanceInWord[letter] = (letterAppearanceInWord[letter] || 0) + 1;
    }

    const wordLength = word.length;
    const maxAttempts = wordLength + 1;
    const word_attemps = []
    let currentAttempt = 0;
    let gameOver = false;

    const attemptsContainer = document.getElementById("attempts");
    const inputField = document.getElementById("letter-input");

    console.log(`The word to guess is: ${word}`);

    const checkGameState = (guess) => {
        if (gameOver) return;
        if (guess === word ) {
            gameOver = true;
            alert("Congratulations! You've guessed the word!");
            return;
        }
        if (currentAttempt >= maxAttempts) {
            gameOver = true;
            alert(`Game Over! The correct word was: ${word}`);
        }
    }
    const checkLetters = (current, guess) => {
        const appearances = {...letterAppearanceInWord};

        // First pass: check for correct letters
        for (let j = 0; j < wordLength; j++) {
            current.children[j].innerText = guess[j];
            if (appearances[guess[j]] > 0) {
                if (guess[j] === word[j]) {
                    current.children[j].classList.add("correct");
                    appearances[guess[j]]--;
                }
            }
        }
        // Second pass: check for semi-correct letters
        for (let j = 0; j < wordLength; j++) {
            if (appearances[guess[j]] > 0) {
                if (!current.children[j].classList.contains("correct")){
                    if (word.includes(guess[j])) {
                        current.children[j].classList.add("semi-correct");
                        appearances[guess[j]]--;
                    }
                }
            }
        }
        // Third pass: mark incorrect letters
        for (let j = 0; j < wordLength; j++) {
            if (!current.children[j].classList.contains("correct") && !current.children[j].classList.contains("semi-correct")){
                    current.children[j].classList.add("incorrect");
                    appearances[guess[j]]--;
            }
        }
    }
    const addEntry = (guess) => {
        currentAttempt++;
        word_attemps.push(guess);
        for (let i = 0; i < attemptsContainer.children.length; i++) {
            if (attemptsContainer.children[i].classList.contains("current")) {
                const current = attemptsContainer.children[i];

                checkLetters(current, guess);

                current.classList.remove("current");
                if (i + 1 < attemptsContainer.children.length) {
                    attemptsContainer.children[i+1].classList.add("current");
                }
                inputField.value = "";

                break;
            }
        }
        checkGameState(guess);
    }
    const checkEntry = (guess) => {
        if (guess.length !== wordLength) {
            alert(`Please enter a ${wordLength}-letter word.`);
            return;
        }
        if (word_attemps.includes(guess)) {
            alert("You've already tried that word. Please try a different one.");
            return;
        }

        addEntry(guess);
    }
    const setupGameBoard = () => {
        for (let i = 0; i < maxAttempts; i++) {
            const attemptRow = document.createElement("div");
            ;
            attemptRow.className = i == 0 ? "attempt current" : "attempt";
        
            for (let j = 0; j < wordLength; j++) {
                const letterBox = document.createElement("div");
                letterBox.className = "letter";
                attemptRow.appendChild(letterBox);
            }
        
            attemptsContainer.appendChild(attemptRow);
        }

        inputField.setAttribute("maxlength", wordLength);
        inputField.addEventListener("input", (e) => {
            const value = e.target.value.toUpperCase();
            e.target.value = value;
        });
        inputField.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && !gameOver) {
                checkEntry(e.target.value);
            }
        });
    }

    setupGameBoard();
};

loadJsonFile('data/words.json').then((WORDS) => {
    runGame(WORDS);
});
