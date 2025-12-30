
function scanDom() {
    const board1 = document.querySelector(".gameboard.player1");
    const board2 = document.querySelector(".gameboard.player2");
    const dialog = document.getElementById("placeShips");
    const placingShipsP = document.querySelector("#placingShipsP");
    const verticalCheck = document.querySelector("#verticalCheck");
    const putShipsYourselfButton = document.querySelector("#putShipsYourselfButton");
    const putShipsAutomaticallyButton = document.querySelector("#putShipsAutomaticallyButton");
    return {
      board1,
      board2,
      dialog,
      placingShipsP,
      verticalCheck,
      putShipsYourselfButton,
      putShipsAutomaticallyButton,
    };
}

function visualizeBoard(visualBoard, gameBoard) {
    for (var i = 0; i < gameBoard.sideLength**2; i++) {

        if (gameBoard.board[i].hit === true) {
            visualBoard.children[i].classList.add("hit")
        } else {
        visualBoard.children[i].classList.remove("hit");
        }

        if (gameBoard.board[i].shipId !== null) {
            visualBoard.children[i].classList.add("ship")
        } else {
        visualBoard.children[i].classList.remove("ship");
        }

    }
};

export { scanDom, visualizeBoard };