let userScore = 0;
let computerScore = 0;
let roundCount = 0;
let isThinking = false;
let streakOwner = "";
let streakCount = 0;
const history = [];

const choices = ["rock", "paper", "scissors"];
const choiceEmojis = {
    rock: "✊",
    paper: "✋",
    scissors: "✌️"
};

const userChoiceText = document.getElementById("userChoice");
const computerChoiceText = document.getElementById("computerChoice");
const resultText = document.getElementById("result");
const userScoreText = document.getElementById("userScore");
const computerScoreText = document.getElementById("computerScore");
const streakText = document.getElementById("streak");
const historyList = document.getElementById("historyList");
const resultPanel = document.getElementById("resultPanel");
const choiceButtons = document.querySelectorAll(".choice-btn");

choiceButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const userChoice = button.dataset.choice;
        playGame(userChoice);
    });
});

function toDisplayChoice(choice) {
    const emoji = choiceEmojis[choice] || "";
    const label = choice.charAt(0).toUpperCase() + choice.slice(1);
    return emoji + " " + label;
}

function setButtonsDisabled(disabled) {
    choiceButtons.forEach((button) => {
        button.disabled = disabled;
    });
}

function setResultState(stateClass) {
    resultPanel.classList.remove("state-idle", "state-thinking", "state-win", "state-lose", "state-draw");
    resultPanel.classList.add(stateClass);
}

function getOutcome(userChoice, computerChoice) {
    if (userChoice === computerChoice) {
        return {
            text: "🤝 It's a Draw!",
            winner: "draw",
            stateClass: "state-draw"
        };
    }

    if (
        (userChoice === "rock" && computerChoice === "scissors") ||
        (userChoice === "paper" && computerChoice === "rock") ||
        (userChoice === "scissors" && computerChoice === "paper")
    ) {
        return {
            text: "🎉 You Win!",
            winner: "user",
            stateClass: "state-win"
        };
    }

    return {
        text: "💻 Computer Wins!",
        winner: "computer",
        stateClass: "state-lose"
    };
}

function updateScores(winner) {
    if (winner === "user") {
        userScore++;
    } else if (winner === "computer") {
        computerScore++;
    }

    userScoreText.innerText = userScore;
    computerScoreText.innerText = computerScore;
}

function updateStreak(winner) {
    if (winner === "draw") {
        streakOwner = "";
        streakCount = 0;
        streakText.innerText = "Streak: Draw reset the streak.";
        return;
    }

    if (streakOwner === winner) {
        streakCount++;
    } else {
        streakOwner = winner;
        streakCount = 1;
    }

    if (winner === "user") {
        streakText.innerText = "Streak: You x" + streakCount;
    } else {
        streakText.innerText = "Streak: Computer x" + streakCount;
    }
}

function renderHistory() {
    historyList.innerHTML = "";

    if (history.length === 0) {
        const emptyState = document.createElement("li");
        emptyState.className = "history-empty";
        emptyState.innerText = "No rounds yet. Make your first move.";
        historyList.appendChild(emptyState);
        return;
    }

    history.forEach((entry) => {
        const item = document.createElement("li");
        item.className = "history-item " + entry.winner;

        const round = document.createElement("span");
        round.className = "history-round";
        round.innerText = "R" + entry.round;

        const choicesText = document.createElement("span");
        choicesText.className = "history-choices";
        choicesText.innerText = toDisplayChoice(entry.userChoice) + " vs " + toDisplayChoice(entry.computerChoice);

        const outcome = document.createElement("span");
        outcome.className = "history-outcome";
        if (entry.winner === "user") {
            outcome.innerText = "You";
        } else if (entry.winner === "computer") {
            outcome.innerText = "Computer";
        } else {
            outcome.innerText = "Draw";
        }

        item.appendChild(round);
        item.appendChild(choicesText);
        item.appendChild(outcome);
        historyList.appendChild(item);
    });
}

function rememberRound(userChoice, computerChoice, winner) {
    history.unshift({
        round: roundCount,
        userChoice: userChoice,
        computerChoice: computerChoice,
        winner: winner
    });

    if (history.length > 5) {
        history.pop();
    }

    renderHistory();
}

async function playGame(userChoice) {
    if (isThinking) {
        return;
    }

    isThinking = true;
    setButtonsDisabled(true);

    userChoiceText.innerText = "Your Choice: " + toDisplayChoice(userChoice);
    computerChoiceText.innerText = "Computer Choice: ...thinking";
    resultText.innerText = "Computer is deciding...";
    setResultState("state-thinking");

    const computerChoice = choices[Math.floor(Math.random() * choices.length)];

    await new Promise((resolve) => {
        setTimeout(resolve, 420);
    });

    computerChoiceText.innerText = "Computer Choice: " + toDisplayChoice(computerChoice);

    const outcome = getOutcome(userChoice, computerChoice);
    resultText.innerText = outcome.text;
    setResultState(outcome.stateClass);

    updateScores(outcome.winner);
    updateStreak(outcome.winner);

    roundCount++;
    rememberRound(userChoice, computerChoice, outcome.winner);

    setButtonsDisabled(false);
    isThinking = false;
}
