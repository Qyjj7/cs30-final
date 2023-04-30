// Project Title
// Your Name
// Description


class Room {
  constructor(x, y, w, h) {
    this.width = w;
    this.height = h;
    this.x = x;
    this.y = y;
    this.color = color(random(255), random(255), random(255));
    this.cells = [];
  }


  display() {
    fill(this.color);
    rect(this.x*CELLSIZE, this.y*CELLSIZE, this.width*CELLSIZE, this.height* CELLSIZE);
  }


  createNeighbor(x, y, w, h) {

    let newRoom = new Room(x, y, w, h);

    let spawningSide = random(directions);
    
    if (spawningSide === "north") {
      newRoom.y -= newRoom.height+1;
      newRoom.x += floor(random(-newRoom.width+1, this.width-1));
    }
    if (spawningSide === "south") {
      newRoom.y += this.height+1;
      newRoom.x += floor(random(-newRoom.width+1, this.width-1));
    }
    if (spawningSide === "east") {
      newRoom.x += this.width+1;
      newRoom.y += floor(random(-newRoom.height+1, this.height-1));
    }
    if (spawningSide === "west") {
      newRoom.x -= newRoom.width+1;
      newRoom.y += floor(random(-newRoom.height+1, this.height-1));
    } 
    return newRoom;
}


  positionValid() {

    let roomA = [];
    for (let y = this.y-1; y < this.y+this.height; y++) {
      for (let x = this.x-1; x < this.x+this.width; x++) {
        roomA.push(new Cell(x, y));
      }
    }

    for (let otherRoom of rooms) {

      let roomB = [];
      for (let y = otherRoom.y-1; y < otherRoom.y+otherRoom.height; y++) {
        for (let x = otherRoom.x-1; x < otherRoom.x+otherRoom.width; x++) {
          roomB.push(new Cell(x, y));
        }
      }

      for (let i = 0; i < roomA.length; i++) {
        for (let j = 0; j < roomB.length; j++) {
          if (roomA[i].x === roomB[j].x && roomA[i].y === roomB[j].y) {
            return false;
          }
        }
      }
    }
    return true;
  }


  spawnDoors() {

    for (let direction of directions) {

      if (direction === "north") {
        for (let i = this.x; i < this.x+this.width; i++) {
          for (let someCell of cells) {
            if (someCell.x === i && someCell.y === this.y-2 && someCell.object !== "door") {
              
              let newCell = new Cell(i, this.y-1);
              newCell.object = "door";
              newCell.color = "black"
              cells.push(newCell);
            }
          }
        }
      }
      if (direction === "south") {
        for (let i = this.x; i < this.x+this.width; i++) {
          for (let someCell of cells) {
            if (someCell.x === i && someCell.y === this.y+this.height+1 && someCell.object !== "door") {
              
              let newCell = new Cell(i, this.y+this.height);
              newCell.object = "door";
              newCell.color = "black"
              cells.push(newCell);
            }
          }
        }
      }
      if (direction === "east") {
        for (let i = this.y; i < this.y+this.height; i++) {
          for (let someCell of cells) {
    
            if (someCell.y === i && someCell.x === this.x+this.width+1 && someCell.object !== "door") {
              let newCell = new Cell(this.x+this.width, i);
              newCell.object = "door";
              newCell.color = "black"
              cells.push(newCell);
            }
          }
        }
      }
      if (direction === "west") {
        for (let i = this.y; i < this.y+this.height; i++) {
          for (let someCell of cells) {
            if (someCell.y === i && someCell.x === this.x-2 && someCell.object !== "door") {
              
              let newCell = new Cell(this.x-1, i);
              newCell.object = "door";
              newCell.color = "black"
              cells.push(newCell);
            }
          }
        }
      }
    }
  }


  addCells() {

    for (let y = this.y; y < this.y+this.height; y++) {
      for (let x = this.x; x < this.x+this.width; x++) {
        let newCell = new Cell(x, y);
        this.cells.push(newCell);
        cells.push(newCell);
      }
    }
  }

}


class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.object = "blank";
    this.color = "white";
  }

  display() {
    fill(this.color);
    rect(this.x*CELLSIZE, this.y*CELLSIZE, CELLSIZE, CELLSIZE);
  }
}


const MAXROOMSIZE = 6;
const MINROOMSIZE = 2;
const ROOMQUANTITY = 30;
const CELLSIZE = 20;

let cells = [];
let rooms = [];
let doors = [];
let directions = ["north", "south", "east", "west"];


function setup() {

  createCanvas(windowWidth, windowHeight);

  createFirstRoom();
  generateRooms();
  generateDoors();
}


function draw() {

  background(220);
  display();
}


function display() {

  for (let someCell of cells) {
    someCell.display();
  }
  //for (let someRoom of rooms) {
    //someRoom.display();
  //}
}


function createFirstRoom() {

  let h = MINROOMSIZE;
  let w = MINROOMSIZE;
  let x = floor(width/CELLSIZE/2 - w/2);
  let y = floor(height/CELLSIZE/2 - h/2);

  let someRoom = new Room(x, y, w, h);
  rooms.push(someRoom);
  someRoom.addCells();
}


function generateRooms() {

  while (rooms.length < ROOMQUANTITY) {
    let validRooms = [...rooms];
    let h = floor(random(MINROOMSIZE, MAXROOMSIZE));
    let w = floor(random(MINROOMSIZE, MAXROOMSIZE));
  
    while (validRooms.length > 0) {
      let someRoom = random(validRooms);
      let x = someRoom.x;
      let y = someRoom.y;
      let newRoom = someRoom.createNeighbor(x, y, w, h)
  
      if (! newRoom.positionValid()) {
        for (let i = 0; i < validRooms.length; i++) {
          validRooms.splice(i, 1);
        }
      }
      else {
        rooms.push(newRoom);
        newRoom.addCells()
        break;
      }
    }
  }
}


function generateDoors() {

  for (let someRoom of rooms) {
    someRoom.spawnDoors();
  }
}


function mousePressed() {
  generateRooms();
}


function keyPressed() {
  
}