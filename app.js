
let startBtn = document.getElementById("start");
let popUp = document.getElementById("difficultyPopup");
let gameOverPopup = document.getElementById("gameOverPopup");
let gameCanvas = document.getElementById("gameCanvas");
let context = gameCanvas.getContext("2d");
let currentDifficulty;

// Start button
startBtn.addEventListener("click", function () {
    popUp.classList.remove("hidden");
});

function startGame(difficulty) {
    currentDifficulty = difficulty;
    popUp.classList.add("hidden");
    document.querySelector(".home").classList.add("hidden");
    gameCanvas.classList.remove("hidden");

    gameCanvas.width = window.innerWidth;
    gameCanvas.height = window.innerHeight;

    // Set number of pillars based on difficulty
    let pillars;
    switch (difficulty) {
        case "easy":
            pillars = 20;
            break;
        case "medium":
            pillars = 40;
            break;
        case "hard":
            pillars = 60;
            break;
    }

    // Bird img
    const birdImg = new Image();
    birdImg.src = "images/crow.gif";

    // Pillar img
    const pillarImg = new Image();
    pillarImg.src = "images/pillar.png";

    //bird physics
    let bird = {
        x: 700,
        y: gameCanvas.height / 2,
        width: 100,
        height: 100,
        gravity: 0.4,
        lift: -15,
        velocity: 0,
    };

// Pipe physics
    let pipes = [];
    let pipeWidth = 100;
    let gap = 240;
    let frame = 0;
    let gameEnded = false;

    // Draw bird
    function drawBird() {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    // Draw pipes
    function drawPipes() {
        for (let pipe of pipes) {
            context.drawImage(pillarImg, pipe.x, pipe.y, pipe.width, pipe.height);
            context.drawImage(
                pillarImg,
                pipe.x,
                pipe.y + pipe.height + gap,
                pipe.width,
                gameCanvas.height - pipe.y - gap
            );
        }
    }

    // Update bird position
    function updateBird() {
        bird.velocity += bird.gravity;
        bird.velocity *= 0.9;
        bird.y += bird.velocity;

        if (bird.y + bird.height > gameCanvas.height || bird.y < 0) {
            showGameOver();
        }

        for (let pipe of pipes) {
            if (
                bird.x < pipe.x + pipe.width &&
                bird.x + bird.width > pipe.x &&
                (bird.y < pipe.y + pipe.height || bird.y + bird.height > pipe.y + pipe.height + gap)
            ) {
                showGameOver();
            }
        }
    }

    // Show game over popup
    function showGameOver() {
        gameEnded = true;
        gameOverPopup.classList.remove("hidden");
    }

    // Update pipes
    function updatePipes() {
        if (frame % 90 === 0) {
            let pipeHeight =
                Math.floor(Math.random() * (gameCanvas.height / 2 - gap)) + gap / 2;
            pipes.push({
                x: gameCanvas.width + pipeWidth,
                y: pipeHeight - gameCanvas.height,
                width: pipeWidth,
                height: gameCanvas.height,
            });
        }

        for (let i = 0; i < pipes.length; i++) {
            let pipe = pipes[i];
            pipe.x -= 4;

            if (pipe.x + pipeWidth < 0) {
                pipes.splice(i, 1);
                i--;
            }
        }

        // Pop up before game ends
        if (pipes.length >= pillars - 8 && !gameEnded) {
            document.getElementById("pop-text").classList.remove("hidden");
        } else {
            document.getElementById("pop-text").classList.add("hidden");
        }
    }

    // Reset game state
    function resetGame() {
        bird.y = gameCanvas.height / 2;
        bird.velocity = 0;
        pipes = [];
        frame = 0;
        gameEnded = false;
        gameOverPopup.classList.add("hidden");
        document.getElementById("win").classList.add("hidden");
    }

    // Check if player has won
    function checkWin() {
        if (pipes.length >= pillars) {
            gameEnded = true;
            document.getElementById("win").classList.remove("hidden");
            setTimeout(() => {
                resetGame();
                alert("Game restarting...");
                startGame(currentDifficulty);
            }, 3000);
        }
    }

    // Main game loop
    function gameLoop() {
        context.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

        updateBird();
        updatePipes();
        checkWin();

        drawBird();
        drawPipes();

        frame++;
        if (!gameEnded) {
            requestAnimationFrame(gameLoop);
        }
    }

    // Event listener for bird jump
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space' && !gameEnded) {
            bird.velocity += bird.lift;
        }
    });

    resetGame();
    gameLoop();
}

// Restart the game
function restartGame() {
    resetGame();
    gameOverPopup.classList.add("hidden");
    startGame(currentDifficulty);
}

// Go back to main menu
function goBack() {
    gameCanvas.classList.add("hidden");
    gameOverPopup.classList.add("hidden");
    document.getElementById("difficultyPopup").classList.add("hidden");
    document.querySelector(".home").classList.remove("hidden");
}
