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

  // Visualize gameboards
  for (let i = 0; i < gameboards.length; i++) {
    for (let j = 0; j < 100; j++) {
      gameboards[i].appendChild(document.createElement("div")).className =
        "cell";
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
    // TODO: implementation for user to choose ship and then choose vertical/horizontal and then choose position
    dialog.close();
  })
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


    
  // Create and (temporarily, for testing) populate their gameboards
  //const player1Ship1 = new Ship(4, false);
  //player1.board.placeShip(player1Ship1, 0);
  //const player2Ship1 = new Ship(4, false);
  //player2.board.placeShip(player2Ship1, 0);

  // Visualize the gameboards
  visualizeBoard(board1, player1.board);
  visualizeBoard(board2, player2.board);
});
