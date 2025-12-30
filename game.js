import { Ship, Gameboard, Player, randomPlaceShips } from "./gameElements.js";
import {
  scanDom,
  visualizeBoard
} from "./controlDOM.js";

document.addEventListener("DOMContentLoaded", () => {
  // Scan DOM
  const {
    board1,
    board2,
    dialog,
    placingShipsP,
    verticalCheck,
    putShipsYourselfButton,
    putShipsAutomaticallyButton,
  } = scanDom();

  const gameboards = [board1, board2];

  // Populate visual gameboards with cells; hover effect for board 1
  for (let i = 0; i < gameboards.length; i++) {
    for (let j = 0; j < 100; j++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.id = j;
      gameboards[i].appendChild(cell);
    }
  }

  // Create players and their boards
  const player1 = new Player("human", 10);
  player1.board.createBoard();
  const player2 = new Player("computer", 10);
  player2.board.createBoard();

  // List of ships
  const ships = {
    Carrier: 5,
    Battleship: 4,
    Cruiser: 3,
    Submarine: 2,
    Destroyer: 1,
  };
  const shipEntries = Object.entries(ships);

  // Place opponent's ships
  randomPlaceShips({
    playerName: "Player 2",
    board: player2.board,
    listOfShipTypesObject: ships,
    randomFn: Math.random,
    logFn: console.log,
    maxAttempts: 100,
  });

  // Place own ships?
  dialog.showModal();
  console.log("placingShipsP:", placingShipsP);

  // Show placing ships message and option to pick vertical
  placingShipsP.style.display = "flex";
  let vertical = false;
  verticalCheck.addEventListener("change", () => {
    if (verticalCheck.checked) {
      vertical = true;
      console.log("Placing ship vertically");
    } else {
      vertical = false;
      console.log("Placing ship horizontally");
    }
  });

  putShipsYourselfButton.addEventListener("click", () => {
    dialog.close();
    placingShipsP.style.display = "flex";

    let currentShipIndex = 0;

    // Define the handler function
    const handleBoardClick = (e) => {
      const clicked = e.target;

      if (!clicked.classList.contains("cell")) return;

      const startCell = Number(clicked.id);
      const [shipName, shipLength] = shipEntries[currentShipIndex];
      const ship = new Ship(shipLength, vertical);

      const placed = player1.board.placeShip(ship, startCell);

      if (placed) {
        console.log(`${shipName} placed!`);
        visualizeBoard(board1, player1.board);

        currentShipIndex++;

        if (currentShipIndex >= shipEntries.length) {
          board1.removeEventListener("click", handleBoardClick); // <-- works now
          console.log("All ships placed!");
        }
      }
    };

    // Add the listener
    board1.addEventListener("click", handleBoardClick);
  });

  placingShipsP.style.display = "none";

  putShipsAutomaticallyButton.addEventListener("click", () => {
    randomPlaceShips({
      playerName: "Player 1",
      board: player1.board,
      listOfShipTypesObject: ships,
      randomFn: Math.random,
      logFn: console.log,
      maxAttempts: 100,
    });
    visualizeBoard(board1, player1.board);
    dialog.close();
  });

  visualizeBoard(board1, player1.board);
  visualizeBoard(board2, player2.board);

  // Define the handler for attack try function
  function attack({ attacker, defender, defenderBoardEl, cellIndex }) {
    const result = defender.board.receiveAttack(cellIndex);

    // Already hit → invalid attack
    if (result === undefined) {
      console.log("Cell already hit — retry turn");
      return { valid: false };
    }

    console.log(`${attacker.type} attacks cell ${cellIndex}`);

    visualizeBoard(defenderBoardEl, defender.board);

    const allSunk = defender.board.checkAllSunk();

    return {
      valid: true,
      allSunk,
      hit: result === true,
    };
  }

  // turn control
  let currentPlayer = player1; // human starts
  let gameOver = false;

  // human turn
  const humanTurnHandler = (e) => {
    if (gameOver) return;

    const clicked = e.target;
    if (!clicked.classList.contains("cell")) return;

    const cellIndex = Number(clicked.id);

    const result = attack({
      attacker: player1,
      defender: player2,
      defenderBoardEl: board2,
      cellIndex,
    });

    // Invalid move → same player tries again
    if (!result.valid) return;

    if (result.allSunk) {
      console.log("Human wins!");
      gameOver = true;
      board2.removeEventListener("click", humanTurnHandler);
      return;
    }

    // Valid move → switch to computer
    board2.removeEventListener("click", humanTurnHandler);
    setTimeout(computerTurn, 600);
  };

  board2.addEventListener("click", humanTurnHandler);

function computerTurn() {
  if (gameOver) return;

  let result;

  do {
    const cellIndex = Math.floor(Math.random() * 100);

    result = attack({
      attacker: player2,
      defender: player1,
      defenderBoardEl: board1,
      cellIndex,
    });
  } while (!result.valid);

  if (result.allSunk) {
    console.log("Computer wins!");
    gameOver = true;
    return;
  }

  // Back to human
  board2.addEventListener("click", humanTurnHandler);
}

})



