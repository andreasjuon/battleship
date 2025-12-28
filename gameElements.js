import crypto from 'crypto';

class Ship {
  constructor(length, vertical = false, shipId = crypto.randomUUID()) {
    this.length = length;
    this.vertical = vertical;
    this.shipId = shipId;
    this.hitsSuffered = 0;
    this.sunk = false;
  }

  hit() {
    this.hitsSuffered += 1;
    return this.hitsSuffered;
  }

  isSunk() {
    this.sunk = this.hitsSuffered >= this.length;
    return this.sunk;
  }
}

class Gameboard {

    constructor(sideLength) {
        this.sideLength = sideLength;
        this.board = []
        this.ships = {};
    }

    createBoard() {
        const board = Array(this.sideLength * this.sideLength)
          .fill(null)
          .map(() => ({ shipId: null, hit: false }));
        this.board = board;
    }

    placeShip(ship, startCell) {

        const startCellIndexH = startCell % this.sideLength;
        const startCellIndexV = Math.floor(startCell / this.sideLength);

        if (ship.vertical === false) {

          //horizontal
          if (startCellIndexH + ship.length > this.sideLength) {
            console.log("Invalid choice. Ship extends horizontally beyond the board!");
            return false;
          } 
          
          else {
            this.ships[ship.shipId] = ship;
            for (var i = startCell; i < startCell + ship.length; i++) {
                const indexInArray = i;
                this.board[indexInArray].shipId = ship.shipId;
            }
            console.log(
              `Ship placed at cell (${startCellIndexH + 1}, ${
                startCellIndexV + 1
              })`
            );
            return true;
          }

        } 
        
        else {

          //vertical
          if (startCellIndexV + ship.length > this.sideLength) {
            console.log("Invalid choice. Ship extends vertically beyond the board!");
            return false;
          } 
          
          else {
            this.ships[ship.shipId] = ship;
            for (var i = 0; i < ship.length; i++) {
                const indexInArray = startCell + i * this.sideLength;
                this.board[indexInArray].shipId = ship.shipId;
            }
            console.log(
              `Ship placed at cell (${startCellIndexH + 1}, ${
                startCellIndexV + 1
              })`
            );
            return true;
          }
        }

    }

    receiveAttack(chosenCell) {

        console.log(`ShipID: ${this.board[chosenCell].shipId}.`);

        // already hit
        if (this.board[chosenCell].hit === true) {
            console.log("This cell has already been hit. Choose another one!");
            return undefined;
        }

        // cell not yet hit -> set to hit
        this.board[chosenCell].hit = true;

        // hit a ship
        if (this.board[chosenCell].shipId !== null) {
            this.ships[this.board[chosenCell].shipId].hitsSuffered += 1;
            console.log(
              `You hit ship with ID ${this.board[chosenCell].shipId}. Congrats!`
            );
            if (this.ships[this.board[chosenCell].shipId].isSunk()) {
              console.log(
                `You sunk ship with ID ${this.board[chosenCell].shipId}. Congrats bigly!`
              )
            };
            return true;
        }

        // nothing hit
        return false;

    }

    checkAllSunk() {
        return Object.values(this.ships).every((ship) => ship.sunk);
    }

}

class Player {
  constructor(type) {
    this.type = type;
    this.board = new Gameboard();
  }
}



module.exports = {Ship, Gameboard, Player};