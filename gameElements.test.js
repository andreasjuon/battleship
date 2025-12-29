import { Ship, Gameboard, Player } from "./gameElements.js";

test("Ship of size 3 being hit 1 time is it 1 time", () => {
  const testShip = new Ship(3);
  expect(testShip.hit()).toBe(1);
});

test("Ship of size 3 being hit 3 times is sunk", () => {
  const testShip = new Ship(3);
  testShip.hit();
  testShip.hit();
  testShip.hit();
  expect(testShip.isSunk()).toBe(true);
});

test("Gameboard of size 10 by 10 has length 100", () => {
  const gameboard = new Gameboard(10);
  gameboard.createBoard();
  expect(gameboard.board.length).toBe(100);
});

describe("Gameboard ship placement tests", () => {
  let gameboard;

  beforeEach(() => {
    gameboard = new Gameboard(10);
    gameboard.createBoard();
  });

  test("Can place a ship of size 4 horizontally in the first cell", () => {
    const shipH = new Ship(4);
    expect(gameboard.placeShip(shipH, 0)).toBe(true);
  });
  test("Cannot place a ship of size 4 horizontally in cell 9", () => {
    const shipH = new Ship(4);
    expect(gameboard.placeShip(shipH, 9)).toBe(false);
  });
  test("Can place a ship of size 4 horizontally in cell 10", () => {
    const shipH = new Ship(4);
    expect(gameboard.placeShip(shipH, 10)).toBe(true);
  });
  test("Can place a ship of size 4 horizontally in cell 16", () => {
    const shipH = new Ship(4);
    expect(gameboard.placeShip(shipH, 16)).toBe(true);
  });
  test("Cannot place a ship of size 5 horizontally in cell 16", () => {
    const shipH = new Ship(5);
    expect(gameboard.placeShip(shipH, 16)).toBe(false);
  });
  test("Cannot place a ship of size 4 horizontally in cell 17", () => {
    const shipH = new Ship(4);
    expect(gameboard.placeShip(shipH, 17)).toBe(false);
  });

  test("Can place a ship of size 4 vertically in the first cell", () => {
    const shipV = new Ship(4, true);
    expect(gameboard.placeShip(shipV, 0)).toBe(true);
  });
  test("Cannot place a ship of size 4 vertically in cell 90", () => {
    const shipV = new Ship(4, true);
    expect(gameboard.placeShip(shipV, 90)).toBe(false);
  });
  test("Can place a ship of size 4 vertically in cell 10", () => {
    const shipV = new Ship(4, true);
    expect(gameboard.placeShip(shipV, 10)).toBe(true);
  });
  test("Can place a ship of size 4 vertically in cell 60", () => {
    const shipV = new Ship(4, true);
    expect(gameboard.placeShip(shipV, 60)).toBe(true);
  });
  test("Cannot place a ship of size 4 vertically in cell 70", () => {
    const shipV = new Ship(4, true);
    expect(gameboard.placeShip(shipV, 70)).toBe(false);
  });
});


describe("Cannot place ships in overlapping manner", () => {
  let gameboard;

  beforeEach(() => {
    gameboard = new Gameboard(10);
    gameboard.createBoard();
  });

  test("Try placing overlapping ships", () => {
    const shipH = new Ship(4);
    expect(gameboard.placeShip(shipH, 0)).toBe(true);
    expect(gameboard.placeShip(shipH, 0)).toBe(false);
    expect(gameboard.placeShip(shipH, 5)).toBe(true);
    expect(gameboard.placeShip(shipH, 6)).toBe(false);
  });
});


describe("Try to sink a ship", () => {
  let gameboard;

  beforeEach(() => {
    gameboard = new Gameboard(10);
    gameboard.createBoard();
  });

  test("Aim at a cell that does not contain a ship", () => {
    expect(gameboard.receiveAttack(0)).toBe(false);
  });

  test("Aim twice at the same cell", () => {
    gameboard.receiveAttack(0);
    expect(gameboard.receiveAttack(0)).toBe(undefined);
  });

  test("Aim at a cell with a ship", () => {
    const shipV = new Ship(4, true, 1138);
    gameboard.placeShip(shipV, 0);
    expect(gameboard.receiveAttack(0)).toBe(true);
    expect(gameboard.receiveAttack(20)).toBe(true);
    expect(gameboard.ships[1138].hitsSuffered).toBe(2);
  });

  test("Aim at a cell with a ship II", () => {
    const shipH = new Ship(4);
    gameboard.placeShip(shipH, 40);
    expect(gameboard.receiveAttack(41)).toBe(true);
    expect(gameboard.receiveAttack(43)).toBe(true);
    expect(gameboard.receiveAttack(44)).toBe(false);
  });

  test("Sink all ships", () => {
    const shipH = new Ship(4);
    gameboard.placeShip(shipH, 40);
    expect(gameboard.receiveAttack(40)).toBe(true);
    expect(gameboard.receiveAttack(41)).toBe(true);
    expect(gameboard.receiveAttack(42)).toBe(true);
    expect(gameboard.checkAllSunk()).toBe(false);
    expect(gameboard.receiveAttack(43)).toBe(true);
    expect(gameboard.checkAllSunk()).toBe(true);
  });
});
