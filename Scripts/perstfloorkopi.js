const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


// UTILITY FUNCTIONS 
function fillBackground(color) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function fillCenteredText(x, y, text, font, color) {
  ctx.font = font;
  ctx.fillStyle = color;

  ctx.textAlign = "center";
  ctx.fillText(text, x, y);
}

function fillCenteredRect(x, y, width, height, color) {
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  ctx.fillStyle = color;
  ctx.fillRect(x - halfWidth, y - halfHeight, width, height);
}

class Vec2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  scale(value) {
    return new Vec2(this.x * value, this.y * value);
  }

  toJSON() {
    return { x: this.x, y: this.y }
  }
}

class Room {
  constructor(x, y, width, height, name, occupied) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.name = name;
    this.occupied = occupied;
  }

  isOccupied() {
    return this.occupied != null;
  }

  draw() {
    var bgColor;
    // probably replace this with ? :
    if(this.isOccupied()) {
      bgColor = "#95e67a"; 
    } else {
      bgColor = "#95e67a00"; 
    }

    fillCenteredRect(this.x, this.y, this.width, this.height, bgColor);
    fillCenteredText(this.x, this.y, this.name, "12px serif", "black");

    if(this.isOccupied())
      fillCenteredText(this.x, this.y + 15, this.occupied, "12px serif", "white");
  }

  isWithin(x, y) {
    const leftBound = this.x - this.width / 2;
    const rightBound = this.x + this.width / 2;

    const topBound = this.y - this.height / 2;
    const bottomBound = this.y + this.height / 2;

    return !(x < leftBound || x > rightBound || y < topBound || y > bottomBound);
  }

  toJSON() {
    return {
      x: this.x, y: this.y,
      width: this.width, height: this.height,
      name: this.name,
      occupied: this.occupied
    }
  }
}



// DATA BASE FUNCTIONS

// for now, since we arent using any kind of API (ie. MySQL / other kind of apis) to store values on another server
// that everyone can access, I suppose for now we just store locally using this method
// or else you only need to modify these two functions to handle all the data base functions
// maybe also in the future, you guys can use asynchronous and multithreading hehe
// just had a lot of fun doing this :P

// this does not scale big, consider caching the retreival value, and update only the required ones
// Maybe have an API checking for event broadcast?
function store(rooms) {
  // serialization
  const serialized = JSON.stringify(rooms); 
  localStorage.setItem("gaynigga", serialized); 
}

function retreive() {
  // deserializeation
  var rawObjects = JSON.parse(localStorage.getItem("gaynigga"));
  var resultRooms = [];

  rawObjects.forEach(object => {
    resultRooms.push(new Room(object.x, object.y, object.width, object.height, object.name, object.occupied));
  });

  return resultRooms;
}







function initializeExampleRooms() {
  var rooms = [
    new Room(102, 360, 100, 40, "Gym 1", null), 
    new Room(102, 575, 100, 40, "Gym 2", null),
    new Room(308, 309, 100, 40, "Canteen", null),
    new Room(308, 614, 100, 40, "Faculty", null), 
    new Room(446, 614, 100, 40, "Computer Lab 1", null), 
  ];

  store(rooms);
}


// DRAWING ROOMS
function renderSceneWithRooms() {
 const image = new Image();
 image.src = "Images/GroundFlr.png"; 
 ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  var rooms = retreive();

  

  for(var i = 0; i < rooms.length; i ++) {
    var room = rooms[i];
    room.draw();
  }
}





// MAIN
renderSceneWithRooms();

// registering an event listener whenever a click happens within the canvas
canvas.addEventListener('click', function (event) {
  const canvasLeft = canvas.offsetLeft + canvas.clientLeft;
  const canvasTop = canvas.offsetTop + canvas.clientTop;

  var x = event.pageX - canvasLeft;
  var y = event.pageY - canvasTop;
  console.log("x: " + x + ", y: " + y);

  var rooms = retreive(); 

  var modified = false; 

  rooms.forEach(function(room) {
    if(room.isWithin(x, y)) {

      if(room.occupied != null) {
        room.occupied = null;
      } else {
        room.occupied = prompt("please enter your name:");
      }

      modified = true;
    }
  });
  
  if(modified) {
    store(rooms);
    renderSceneWithRooms();
  }
}, false);

setInterval(() => {
  renderSceneWithRooms();
}, 1000);
