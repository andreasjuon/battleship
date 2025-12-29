const generateId =
  typeof crypto !== "undefined" && crypto.randomUUID
    ? () => crypto.randomUUID()
    : () => Math.random().toString(36).slice(2);


class Ship {
  constructor(length, vertical = false, shipId = generateId()) {
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
    this.board = [];
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

    //horizontal
    if (ship.vertical === false) {

      // check whether ship extends beyond board
      if (startCellIndexH + ship.length > this.sideLength) {
        console.log(
          "Invalid choice. Ship extends horizontally beyond the board!"
        );
        return false;
      } 

      // check overlap
        for (let i = startCell; i < startCell + ship.length; i++) {
          if (this.board[i].shipId !== null) {
            console.log("Invalid choice. Ship overlaps another ship!");
            return false;
          }
        
        } 
        
        // place ship
        this.ships[ship.shipId] = ship;
        for (var i = startCell; i < startCell + ship.length; i++) {
          const indexInArray = i;
          this.board[indexInArray].shipId = ship.shipId;
        }
        console.log(
          `Ship placed at cell (${startCellIndexH + 1}, ${startCellIndexV + 1})`
        );
        return true;
      
    } 

    //vertical
    else {
      
      // check whether ship extends beyond board
      if (startCellIndexV + ship.length > this.sideLength) {
        console.log(
          "Invalid choice. Ship extends vertically beyond the board!"
        );
        return false;
      } 

      // check overlap
        for (let i = 0; i < ship.length; i++) {
            const indexInArray = startCell + i * this.sideLength;
            if (this.board[indexInArray].shipId !== null) {
                console.log("Invalid choice. Ship overlaps another ship!");
                return false;
            }
        }
      
      // place ship
        this.ships[ship.shipId] = ship;
        for (var i = 0; i < ship.length; i++) {
          const indexInArray = startCell + i * this.sideLength;
          this.board[indexInArray].shipId = ship.shipId;
        }
        console.log(
          `Ship placed at cell (${startCellIndexH + 1}, ${startCellIndexV + 1})`
        );
        return true;
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
        );
      }
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
  constructor(type, sideLength) {
    this.type = type;
    this.board = new Gameboard(sideLength);
  }
}

function randomPlaceShips({
  playerName,
  board,
  listOfShipTypesObject,
  randomFn = Math.random, // injectable for tests
  logFn = () => {}, // injectable logger
  maxAttempts = 100,
}) {
  const placedShips = [];

  for (const [shipType, shipSize] of Object.entries(listOfShipTypesObject)) {
    logFn(`Placing ${playerName}'s ship: ${shipType}!`);

    let shipPlaced = false;
    let attempts = 0;

    while (!shipPlaced && attempts < maxAttempts) {
      const vertical = randomFn() < 0.5;
      const ship = new Ship(shipSize, vertical);
      const startCell = Math.floor(randomFn() * board.sideLength ** 2);

      shipPlaced = board.placeShip(ship, startCell);
      attempts++;
      if (shipPlaced) placedShips.push({ shipType, ship, startCell });
    }

    if (!shipPlaced) {
      throw new Error(`Failed to place ship ${shipType} for ${playerName}`);
    }
  }

  return placedShips; // returns useful info for testing
}

export { Ship, Gameboard, Player, randomPlaceShips };
