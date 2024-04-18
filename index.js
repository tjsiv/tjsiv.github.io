const startScreen = document.getElementById('startScreen');
const endScreen = document.getElementById('endScreen');

const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');

const canvas = document.querySelector('canvas'); //grab canvas
const c = canvas.getContext('2d'); //get methods for 2d space

const scoreTracker = document.querySelector('#scoreTracker');

canvas.width = innerWidth; //let canvas fill screen
canvas.height = innerHeight;

function showStartScreen() {
    startScreen.style.display = 'block';
    endScreen.style.display = 'none';
}
showStartScreen();


let score = 0;

function showEndScreen(score) {
    startScreen.style.display = 'none';
    endScreen.style.display = 'block';
    document.getElementById('finalScore').innerText = score;
}

class Wall { // these walls will be the boundary for the map and the objects in maze
    static width = 80
    static height = 80
    constructor({coords, image}){
        this.coords = coords //wall location
        this.width = 80 //this is the size and width of each block on the walls
        this.height = 80
        this.image = image
    }
    create(){ //this will make the blocks in the wall
        // c.fillStyle = 'red'
        // c.fillRect(this.coords.x, this.coords.y, this.width, this.height) //grab coordinate from constuctor
        c.drawImage(this.image, this.coords.x, this.coords.y)
    }
}


class Player {
    constructor({coords, velocity}){
        this.coords = coords;
        this.velocity = velocity;
        this.radius = 30;
    }
    create(){
        c.beginPath();
        c.arc(this.coords.x, this.coords.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = 'yellow';
        c.fill();
        c.closePath();
       
    }
    refresh() {// this is a way to update the character speed and position
        this.create()// remakes the character at a position
        this.coords.x += this.velocity.x;
        this.coords.y += this.velocity.y;
    }

}

class Monster {
    static speed = 2;

    constructor({ coords, velocity, color = 'red', imgSrc }) {
        this.initialCoords = { x: coords.x, y: coords.y }; // Store initial position
        this.coords = coords;
        this.velocity = velocity;
        this.radius = 30;
        this.color = color;
        this.lastCollision = [];
        this.speed = 2;
        this.scared = false;
        this.imageLoad = false;
        this.image = new Image();
        this.image.src = imgSrc;
        this.image.onload = () => {
            this.imageLoad = true;
        };
    }

    // Create monster
    create() {
        if (this.imageLoad) {
            const scaleWidth = this.image.width * 1.5;
            const scaleHeight = this.image.height * 1.5;
            // Adjust the position to center the image
            const adjustedX = this.coords.x - scaleWidth / 2;
            const adjustedY = this.coords.y - scaleHeight / 2;
            c.drawImage(this.image, adjustedX, adjustedY, scaleWidth, scaleHeight);
        } else {
            // Fallback to drawing a circle if the image hasn't loaded yet
            c.beginPath();
            c.arc(this.coords.x, this.coords.y, this.radius, 0, Math.PI * 2);
            c.fillStyle = this.scared ? 'blue' : this.color;
            c.fill();
            c.closePath();
        }
    }

    // Refresh monster
    refresh() {
        this.create();
        this.coords.x += this.velocity.x;
        this.coords.y += this.velocity.y;
    }

    // Reset monster position to initial position
    reset() {
        this.coords.x = this.initialCoords.x;
        this.coords.y = this.initialCoords.y;
    }
}


class Pellet {
    constructor({coords}){
        this.coords = coords
        this.radius = 8
    }
    create(){
        c.beginPath()
        c.arc(this.coords.x, this.coords.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'white'
        c.fill()
        c.closePath()
       
    }
    
}
class PowerPellet {
    constructor({coords}){
        this.coords = coords
        this.radius = 16
    }
    create(){
        c.beginPath()
        c.arc(this.coords.x, this.coords.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'white'
        c.fill()
        c.closePath()
       
    }
    
}
const keys = { //we have to declare this class to account for muliple keys getting pressed together
    w: {
        pressed: false
    },
    s: {
        pressed: false
    },
    a: {
        pressed: false
    },
    d: {
        pressed: false
    }
}//after checking the stae of the key we have more control

let lastKey = ''//had to declare a last key variable to acount for the fact that
// the animate function couldn't call multiple keys being pressed by the character


const player = new Player({ //this is the palyer character
    coords: {
        x: Wall.width + Wall.width / 2, //spawns them in the top right corner
        y: Wall.height + Wall.height / 2
    },
    velocity: { //character speed
        x: 0,
        y: 0
    }
    
})

const pellets = [];
const powerPellets = []
const walls =  [];
const monsters = [
    new Monster({
        coords: {
            x: Wall.width * 6 + Wall.width / 2, 
            y: Wall.height + Wall.height / 2
        },
        velocity: {
            x: Monster.speed,
            y: 0
        },
        imgSrc: './assets/slime-move.gif'
    }),
    new Monster({
        coords: {
            x: Wall.width * 6 + Wall.width / 2, 
            y: Wall.height * 3 + Wall.height / 2
        },
        velocity: {
            x: Monster.speed,
            y: 0
        }, 
        imgSrc: './assets/Mino-walk-L-ezgif.com-resize.gif'
    }),
    new Monster({
        coords: {
            x: Wall.width * 18 + Wall.width / 2, 
            y: Wall.height  + Wall.height / 2
        },
        velocity: {
            x: Monster.speed,
            y: 0
        }, 
        imgSrc: './assets/Mino-walk-L-ezgif.com-resize.gif'
    })
];

const map = [ //I can use this as a frame for tte map we want
//after I design an outline I can iterate over each row of the map
//and draw a wall(these will later be replaced with pictures or sprites if time permits)

    ['c', '-', '-', '-', '-', '-', '-', '-', '-','-', '-', '-', '-', '-', '-',  '-', '-', '-', '-','-', '-','-', '-', '-', '-', '-','-', 'c'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.','.','.','p', '|'],
    ['|', '.', '-', '.', '-', '-', '-', '.', '-', '.','.', '-', '.', '-', '.','.', '-', '.', '-', '-', '-', '.', '-', '.','.', '-', '.', '|'],
    ['|', '.', '.', '.', '.', '-', '.', '.', '.', '.','.', '.', '.', '.', '-', '.', '.', '.', '.','.', '.', '.', '.', '-', '.','-', '.', '|'],
    ['|', '.', '-', '-', '.', '-', '.', '-', '-', '-','-', '-', '-', '.', '-', '.', '-', '-', '.','-', '-', '-', '.', '-', '.','-', '.', '|'],
    ['|', '.', '.', '.', '.', '.', '.','.', '.','.', '.', '.', '.', '.', '.', '.', '.', '.','.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
    ['|', '.', '-', '.', '-', '-', '-', '.', '-', '-','-', '-', '.', '-', '-', '-', '.', '-', '.','.','-',  '.', '-', '.','.', '-', '.', '|'],
    ['|', '.', '.', '.', '.', '-', '.', '.', '.', '.','.', '.', '.', '.', '-', '.', '.', '.','.', '-', '.', '.', '.', '-','-', '.', '.', '|'],
    ['|', '.', '-', '-', '.', '.', '.', '-', '-', '.','.', '-', '-', '.', '.', '.', '-', '-', '.','-', '-', '-', '.', '-','.', '-', '.', '|'],
    ['|', '.', '.', '.', '.', '-', '.', '.', '.', '.','.', '.', '.', '.', '-', '.', '.', '.', '.', '.', '-', '.', '.', '.','.','.', '.', '|'],
    ['|', '.', '-', '.', '-', '-', '-', '.', '-', '.','-', '.', '-',  '.','-', '.', '-', '-', '-', '.', '-', '.','-', '.', '-', '-', '.','|'],
    ['|', 'p', '.', '.', '.', '.', '.', '.', '.','.', '.', '.', '.',  '.', '.', '.', '.', '.', '.','.', '.', '.', '.', '.', '.', '.','p','|'],
    ['c', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-','-', '-', '-','-','c']   
    
];
function genAsset(src){
    const image = new Image();
    image.src = src;
    return image;
}



//This for each function below will check every symboll in the array called map and spawn a specific item for each one
//it checks each row (the arrays of string), then the symbol in them to figure out what to spawn.
map.forEach((row, i) =>{ //this is the wall itterator with index of y 
    row.forEach((symbol, j) =>{ //this is the itterator index of x
        switch(symbol) {
            case '-':
                walls.push(
                    new Wall({
                        coords: {
                            x: Wall.width * j, //spaces wall by offset from zero of the index count
                            y: Wall.height * i
                        },
                        image: genAsset('./assets/stone_wall_1.png')
                     })
                ) //make a wall for the symbol
                break
        
            case '|':
                walls.push(
                    new Wall({
                        coords: {
                            x: Wall.width * j, //spaces wall by offset from zero of the index count
                            y: Wall.height * i
                        },
                        image: genAsset('./assets/stone_wall_1_rleft.png')
                     })
                ) 
                break
            case 'c':
                walls.push(
                    new Wall({
                        coords: {
                            x: Wall.width * j, //spaces wall by offset from zero of the index count
                            y: Wall.height * i
                        },
                        image: genAsset('./assets/stone_pillar_2.png')
                     })
                ) 
                break
            case '.':
                pellets.push(
                  new Pellet({
                    coords: {
                      x: j * Wall.width + Wall.width / 2,
                      y: i * Wall.height + Wall.height / 2
                    }
                  })
                )
                break   
            case 'p':
                powerPellets.push(
                  new PowerPellet({
                    coords: {
                      x: j * Wall.width + Wall.width / 2,
                      y: i * Wall.height + Wall.height / 2
                    }
                  })
                )
                break   
            
        
        }
    })
})


//player movement decided on  w a s d
//with a switch that changes the velocity
//of the player
window.addEventListener('keydown', ({key}) => { 
    switch(key) {
        case 'w':
            keys.w.pressed = true;
            lastKey = 'w'
            break
        case 'a':
            keys.a.pressed = true;
            lastKey = 'a'
            break
        case 's':
            keys.s.pressed = true;
            lastKey = 's'
            break
        case 'd':
            keys.d.pressed = true;
            lastKey = 'd'
            break
    }
}); 
window.addEventListener('keyup', ({key}) => { //to fix diagonal movement ** this actually caused another issue
    switch(key) {
        case 'w':
            keys.w.pressed = false;
            lastKey = 'w'
            break
        case 'a':
            keys.a.pressed = false;
            lastKey = 'a'
            break
        case 's':
            keys.s.pressed = false;
            lastKey = 's'
            break
        case 'd':
            keys.d.pressed = false;
            lastKey = 'd'
            break
    }
});


function resetGame() {
    // Stop animation loop
    cancelAnimationFrame(animationId);

    // Reset score and update score display
    score = 0;
    scoreTracker.innerHTML = score;

    // Reset player position
    player.coords.x = Wall.width + Wall.width / 2;
    player.coords.y = Wall.height + Wall.height / 2;

    // Clear pellet and power pellet arrays
    pellets.length = 0;
    powerPellets.length = 0;

    //reset monster coords
    monsters.forEach(monster => {
        monster.reset();
    });

    // Reinitialize pellets and power pellets
    map.forEach((row, i) => {
        row.forEach((symbol, j) => {
            switch (symbol) {
                case '.':
                    pellets.push(new Pellet({ coords: { x: j * Wall.width + Wall.width / 2, y: i * Wall.height + Wall.height / 2 } }));
                    break;
                case 'p':
                    powerPellets.push(new PowerPellet({ coords: { x: j * Wall.width + Wall.width / 2, y: i * Wall.height + Wall.height / 2 } }));
                    break;
            }
        });
    });

    // Show the start screen
    showStartScreen();
}



//colision detec
    //circle ➡️ square collision detection works by measuring the center position
    //of the circle plus its radius against the position plus width of the square
    //as the two objects aproach the value will aproch zero upon getting to close a 
    //colision is called this was orriginally an if else statement but it was too repetitive and messy
    
function circleSquareColide({circle, square}) {
    const padding= Wall.width / 2 - circle.radius - 1
    return(
        circle.coords.y - circle.radius + circle.velocity.y <= square.coords.y + square.height + padding//top
        && circle.coords.x + circle.radius + circle.velocity.x >= square.coords.x - padding//left
        && circle.coords.y + circle.radius + circle.velocity.y >= square.coords.y - padding//down
        && circle.coords.x -circle.radius + circle.velocity.x <= square.coords.x + square.width + padding
    )
}

    startButton.addEventListener('click', () => {
        // Hide start screen
        startScreen.style.display = 'none';
        // Start game logic
        animate();
    });
    
    restartButton.addEventListener('click', () => {
        // Reset the game
        resetGame();
        // Show the start screen
        showStartScreen();
        // Start the game animation loop

    });
    
    

let animationId;
function animate(){//loop to animate the screen and what happens
    animationId = requestAnimationFrame(animate)

    c.clearRect(0, 0, canvas.width, canvas.height)//clears the previous drawing

    //powerpellet collision
    for( let i = powerPellets.length - 1; 0 <= i; i--){
        const powerPellet = powerPellets[i]
        powerPellet.create();

        if(Math.hypot(powerPellet.coords.x - player.coords.x, powerPellet.coords.y - player.coords.y) < 
            powerPellet.radius + player.radius){
                console.log('touched power pellet');
                powerPellets.splice(i, 1);
                monsters.forEach(monster => {
                    monster.scared = true
                    

                    setTimeout(() => {
                        monster.scared = false
                        
                    }, 3000)
                })
        }
    }

    //monster collision
    for( let i = monsters.length - 1; 0 <= i; i--){
        const monster = monsters[i]

        if(Math.hypot(monster.coords.x - player.coords.x, monster.coords.y - player.coords.y) < 
        monster.radius + player.radius ){
            if(monster.scared){
                monsters.splice(i, 1);
                score += 40;
            scoreTracker.innerHTML = score;
            } else{
                showEndScreen(score)
                cancelAnimationFrame(animationId)
                console.log('you lose')
            }
        }
    }
    //wc
    if(pellets.length === 0){
        showEndScreen(score)
        cancelAnimationFrame(animationId)
    }
    
    //make and eat pellets
    pellets.forEach((pellet, i) =>{
        pellet.create();
        if(Math.hypot(pellet.coords.x - player.coords.x, pellet.coords.y - player.coords.y) < 
        pellet.radius + player.radius){
            console.log('touched pell');
            pellets.splice(i, 1);
            score += 10;
            scoreTracker.innerHTML = score;
        }
    })

    walls.forEach((Wall) =>{ //walls will not move
            //coordinate check
            Wall.create();

            if( circleSquareColide({
                circle: player,
                square: Wall
            })){
                console.log('collision');
                player.velocity.y=0;
                player.velocity.x=0;
            }
            
        });
    player.refresh() //re create the player location

    monsters.forEach(monster => {
        monster.refresh();
        

        const collisions = [];
        walls.forEach((Wall) =>{ 
        if( !collisions.includes('right') &&
            circleSquareColide({ 
            circle: {...monster, velocity: {
                x: monster.speed,
                y: 0
                }
            },
            square: Wall
        })){
            collisions.push('right');
        };

        if( !collisions.includes('left') &&
            circleSquareColide({
            circle: {...monster, velocity: {
                x: -monster.speed,
                y: 0
                }
            },
            square: Wall
        })){
            collisions.push('left');
        }; 

        if( !collisions.includes('up') &&
            circleSquareColide({
            circle: {...monster, velocity: {
                x: 0,
                y: -monster.speed
                }
            },
            square: Wall
        })){
            collisions.push('up')
        }; 

        if( !collisions.includes('down') &&
            circleSquareColide({
            circle: {...monster, velocity: {
                x: 0,
                y: monster.speed
                }
            },
            square: Wall
        })){
            collisions.push('down')
        }; 
        
        });
        if(collisions.length > monster.lastCollision.length)
        monster.lastCollision = collisions;

        if (JSON.stringify(collisions) !== JSON.stringify(monster.lastCollision)){

            if(monster.velocity.x > 0) monster.lastCollision.push('right')
            else if(monster.velocity.x < 0) monster.lastCollision.push('left')
            else if(monster.velocity.y > 0) monster.lastCollision.push('down')
            else if(monster.velocity.y < 0) monster.lastCollision.push('up')

            const track = monster.lastCollision.filter((collision) => {
                return !collisions.includes(collision)
            });
            const direction = track[Math.floor(Math.random() * track.length)]
            switch(direction){
                case 'down':
                    monster.velocity.y = monster.speed;
                    monster.velocity.x = 0;
                    break
                case 'up':
                    monster.velocity.y = -monster.speed;
                    monster.velocity.x = 0;
                    break
                case 'right':
                    monster.velocity.y = 0;
                    monster.velocity.x = monster.speed;
                    break
                case 'left':
                    monster.velocity.y = 0;
                    monster.velocity.x = -monster.speed;
                    break
                
            }
            monster.lastCollision = [];
        }
    })
   

    //&& lastKey === 'w' this and statement allows us to use more than one 
    //key to defin our direction and helps fix our diagonal problem
    if(keys.w.pressed && lastKey === 'w'){
        
        for(let i = 0; i < walls.length; i++) {

            const wall = walls[i];
            if( circleSquareColide({
                circle: {...player, velocity: {
                    x: 0,
                    y: -5
                    }
                },//spread will save me 🙏
                square: wall
            })) {
                player.velocity.y = 0   
                break 
            } else(
                player.velocity.y = -5    
            )
        }
        
    } else if (keys.a.pressed && lastKey === 'a'){

        for(let i = 0; i < walls.length; i++) {

            const wall = walls[i]
            if( circleSquareColide({
                circle: {...player, velocity: {
                    x: -5,
                    y: 0
                    }
                },//spread will save me 🙏
                square: wall
            })) {
                player.velocity.x = 0   
                break 
            } else(
                player.velocity.x = -5    
            )
        }
    } else if (keys.s.pressed && lastKey === 's'){
        
        for(let i = 0; i < walls.length; i++) {

            const wall = walls[i]
            if( circleSquareColide({
                circle: {...player, velocity: {
                    x: 0,
                    y: 5
                    }
                },//spread will save me 🙏
                square: wall
            })) {
                player.velocity.y = 0   
                break 
            } else(
                player.velocity.y = 5    
            )
        }
        
    } else if (keys.d.pressed && lastKey === 'd'){

        for(let i = 0; i < walls.length; i++) {

            const wall = walls[i]
            if( circleSquareColide({
                circle: {...player, velocity: {
                    x: 5,
                    y: 0
                    }
                },//spread will save me 🙏
                square: wall
            })) {
                player.velocity.x = 0 
                break 
            } else(
                player.velocity.x = 5    
            )
        }
    }
    
    
    
}
