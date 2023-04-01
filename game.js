let canvas = document.getElementById("canvas"),
    ctx = canvas.getContext('2d'),
    WIDTH = canvas.width,
    HEIGHT = canvas.height,
    CENTER_WIDTH = canvas.width/2,
    CENTER_HEIGHT = canvas.height/2,
    keysDown = {},
    SCALE = 32,
    keys = {
      down: 40,
      up: 38,
      right: 39,
      left: 37,
      jump: 32,
      q:81,
      w:87,
      e:69,
      r:82
    },
    frameRate = 1/60,
     mouseX = 0,
    mouseY = 0,
    frameDelay = 1000*frameRate;
    const constant  = {
  gravity: 5,
  drag: .047,
};

canvas.onmousedown = Down;
canvas.onmouseup = Up;
canvas.onmousemove = Move;

function radToDeg(angle) {
    return angle * (180 / Math.PI);
}
function degToRad(angle) {
    return angle * (Math.PI / 180);
}

function renderMouseAngle(player) {
    let centerx = player.x + player.width/2,
        centery = player.y + player.height/2;
 
    // Draw the angle
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(centerx, centery);
    ctx.lineTo(centerx + 1.5*SCALE * Math.cos(degToRad(player.angle)),
                   centery - 1.5*SCALE * Math.sin(degToRad(player.angle)));
    ctx.stroke();
}
  
function Up(){
  //canvas.onmousemove = null;
}

function Move(e){
  mouseX = (e.pageX - canvas.offsetLeft)-CENTER_WIDTH ;
  mouseY = (e.pageY - canvas.offsetTop)-CENTER_HEIGHT;
  
  
/*  let mouseAngle = radToDeg(Math.atan2((game.player.y+game.player.width/2) - mouseY, mouseX  - (game.player.x+game.player.height/2))), lowerBound = 8, upperBound = 172;
   if (mouseAngle < 0) {
        mouseAngle = (180 + (180 + mouseAngle));
   }
   game.player.angle = mouseAngle;
 */
 
}


function Down(e){
  mouseX = (e.pageX - canvas.offsetLeft) ;
  mouseY = (e.pageY - canvas.offsetTop) ;
  

 
}



ctx.translate(CENTER_WIDTH, CENTER_HEIGHT); // translate to 0,0 (origin)
var requestInterval = function (fn, delay) {
  var requestAnimFrame = (function () {
    return window.requestAnimationFrame || function (callback, element) {
      window.setTimeout(callback,  frameDelay);
    };
  })(),
      start = new Date().getTime(),
      handle = {};
  function loop() {
    handle.value = requestAnimFrame(loop);
    var current = new Date().getTime(),
        delta = current - start;
    if (delta >= delay) {
      fn.call();
      start = new Date().getTime();
    }
  }
  handle.value = requestAnimFrame(loop);
  return handle;
};
addEventListener("keydown", function (e) {
  keysDown[e.keyCode] = true;
}, false);
addEventListener("keyup", function (e) {
  delete keysDown[e.keyCode];
}, false);
function addText(string, x, y, size, color){
  ctx.font = size+"px Arial";
  ctx.fillStyle = color;
  return ctx.fillText(string, x, y);
}
function random(min, max){
return Math.floor(Math.random()*(max-min+1))+min;
}
function drawAll(items){
  let i;
  for(i = 0; i < items.length; i++){
    items[i].draw();
  }
}
function collide(a,b){
  return (a.x < b.x + b.width &&
   a.x + a.width > b.x &&
   a.y < b.y + b.height &&
   a.y + a.height > b.y);
}
function distanceBetween(a,b){
  return Math.sqrt( ((b.x-a.x)*(b.x-a.x)) + ((b.y-a.y)*(b.y-a.y)) )
}


//######################################################################

class Rectangle{
  constructor(x,y,w,h, color){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color;
    this.dx = 0;
    this.dy = 0;
    this.angle = 45;
    this.scrollX = 0; 
    this.scrollY = 0;
    this.id = 0;
    this.inBoundsX = (this.x <= -CENTER_WIDTH+this.w || this.x >= CENTER_WIDTH-this.w) || (this.scrollX <= -CENTER_WIDTH+this.w || this.scrollX >= CENTER_WIDTH-this.w);
    this.inBoundsY = (this.y <= -CENTER_HEIGHT+this.h ||this.y >= CENTER_HEIGHT-this.h) || (this.scrollY <= -CENTER_HEIGHT+this.h || this.scrollY >= CENTER_HEIGHT-this.h );
  }
  
  draw(){ 
    ctx.fillStyle = this.color;
    //this.x = this.scrollX;
    //this.y = this.scrollY;
    ctx.fillRect(this.x, this.y, this.w,this.h);
    this.inBoundsX = (this.x <= -CENTER_WIDTH+this.w || this.x >= CENTER_WIDTH-this.w) || (this.scrollX <= -CENTER_WIDTH+this.w || this.scrollX >= CENTER_WIDTH-this.w);
    this.inBoundsY = (this.y <= -CENTER_HEIGHT+this.h ||this.y >= CENTER_HEIGHT-this.h) || (this.scrollY <= -CENTER_HEIGHT+this.h || this.scrollY >= CENTER_HEIGHT-this.h );
    
 
  }
  
  keys(speed){
      //console.log("inBoundY", this.inBoundsY)
      //console.log("inBoundX", this.inBoundsX)
    if(keys.up in keysDown){
         this.scrollY -= speed; 
         this.y -= speed;
      }
    else if(keys.down in keysDown){
        this.scrollY += speed;
        this.y += speed;
      }
    else if(keys.right in keysDown){
        this.scrollX += speed;
        this.x += speed;
    }else if(keys.left in keysDown){
         this.scrollX -= speed;
         this.x -= speed;
    
      
      //this.scrollX -= speed;
      //this.x -= speed;
       //console.log("scrollY", this.scrollY)
    }
    //console.log("########################")
  }
  
  move(speed){
    this.dx = speed;
    this.dy = speed;
   
     //this.x += this.dx * Math.cos(this.angle * Math.PI /180);
     //this.y += this.dy * Math.sin(this.angle * Math.PI /180);
     this.scrollX += this.dx * Math.cos(this.angle * Math.PI /180);
     this.scrollY += this.dy * Math.sin(this.angle * Math.PI /180);

      if ((this.x <= -CENTER_WIDTH+this.w || this.x >= CENTER_WIDTH-this.w) ||(this.scrollX <= -CENTER_WIDTH+this.w || this.scrollX >= CENTER_WIDTH-this.w) ){
          this.x += this.dx * Math.cos(this.angle * Math.PI /180);
           this.angle = 180-(this.angle); 
        this.scrollX += this.dx * Math.cos(this.angle * Math.PI /180);
      }
      else if ((this.y <= -CENTER_HEIGHT+this.h ||this.y >= CENTER_HEIGHT-this.h) || this.scrollY <= -CENTER_HEIGHT+this.h ||this.scrollY >= CENTER_HEIGHT-this.h ) {
           this.angle = 360-(this.angle-15); 
            this.scrollY += this.dy * Math.sin(this.angle * Math.PI /180);
            this.y += this.dy * Math.sin(this.angle * Math.PI /180);
           
           
      }
    
   
  }
  
}

let TILE_SCALE = 64;

let map = [
   [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
   [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
   [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
   [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
   [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
   [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
   [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
   [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
   [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
   [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
   [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
   [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
   [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
   [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
   [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
   [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  
]

let player = new Rectangle(0, 0, 25,25, "red");


function randomizeMap(map, amount){
  if(map[0][0] != 0){
    for(let i = 0; i < map.length; i++){
      let x = random_x = random(0, map.length-1)
      let y = random_y = random(0, map.length-1);
      map[x][y].id = random(1,2)
    }
  }
}



function preRender(map) {
    for(let x = 0; x < map.length; x++){
      for(let y = 0; y < map[x].length; y++){
        let id = map[x][y];
        map[x][y] = new Rectangle(0, 0, TILE_SCALE,TILE_SCALE, "white");
        map[x][y].id = id;
        
      }
    }
}

function RenderTileMap(player,map, drawRadius){
  //let renderMap = []
  for(let x = 0; x < map.length; x++){
    for(let y = 0; y < map[x].length; y++){
      if(Math.abs(player.scrollX, x) < drawRadius && Math.abs(player.scrollY, y) < drawRadius) {
          map[x][y].x = x*TILE_SCALE-CENTER_WIDTH-player.scrollX;
          map[x][y].y = y*TILE_SCALE-CENTER_HEIGHT-player.scrollY;
        switch(map[x][y].id){
          case 0:
            map[x][y].color = "green";
            break;
          case 1:
              map[x][y].color = "brown";
              break;
          case 2:
            map[x][y].color = "blue"; 
            break;    
        }
      }
      
    }
    //renderMap = map;
  }

return map;
}

function drawMap(map){
    for(let x = 0; x < map.length; x++){
      for(let y = 0; y < map[x].length; y++){
        map[x][y].draw();
      }
  }
  
}

let mapp = preRender(map);
randomizeMap(map, 300);

function update(){
  let mapp = RenderTileMap(player,map, WIDTH-100);
  ctx.clearRect(-CENTER_WIDTH, -CENTER_HEIGHT, WIDTH, HEIGHT);

  player.keys(1);
  //player.move(2)
  drawMap(mapp);
   player.draw();
  
} 



requestInterval(update, frameDelay);
