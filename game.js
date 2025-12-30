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
    putShipsYourselfButton,
    putShipsAutomaticallyButton
  } = scanDom();
  const gameboards = [board1, board2];

  // Populate visual gameboards with cells
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
    "Carrier": 5,
    "Battleship": 4,
    "Cruiser": 3,
    "Submarine": 2,
    "Destroyer": 1,
  };
  const shipEntries = Object.entries(ships);

  // Place opponent's ships
  randomPlaceShips({
    playerName: "Player 2", 
    board: player2.board, 
    listOfShipTypesObject: ships,
    randomFn: Math.random,
    logFn: console.log,
    maxAttempts: 100
  });

  // Place own ships?
  dialog.showModal();

  putShipsYourselfButton.addEventListener("click", () => {

    dialog.close();

    let currentShipIndex = 0;

    board1.addEventListener("click", (e) => {

      const clicked = e.target;

      // make sure the click target is one of the cells
      if (!clicked.classList.contains("cell")) return;

      const startCell = Number(clicked.id);
      const [shipName, shipLength] = shipEntries[currentShipIndex];
      const vertical = false;
      const ship = new Ship(shipLength, vertical);

      const placed = player1.board.placeShip(ship, startCell);

      if (placed) {
        console.log(`${shipName} placed!`);
        visualizeBoard(board1, player1.board);

        currentShipIndex++;

        // All ships placed → remove listener
        if (currentShipIndex >= shipEntries.length) {
          board1.removeEventListener("click");
          console.log("All ships placed!");
        }
      };
    })
  });

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

  // Visualize the gameboards
  visualizeBoard(board1, player1.board);
  visualizeBoard(board2, player2.board);
});
