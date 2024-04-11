const canvas = document.querySelector('canvas') //grab canvas
const c = canvas.getContext('2d') //get methods for 2d space

canvas.width = innerWidth //let canvas fill screen
canvas.height = innerHeight

class Wall { // these walls will be the boundary for the map and the objects in maze
    static width = 40
    static height = 40
    constructor({coords}){
        this.coords = coords //wall location
        this.width = 40 //this is the size and width of each block on the walls
        this.height = 40
    }
    create(){ //this will make the blocks in the wall
        c.fillStyle = 'red'
        c.fillRect(this.coords.x, this.coords.y, this.width, this.height) //grab coordinate from constuctor

    }
}


class Player {
    constructor({coords, velocity}){
        this.coords = coords
        this.velocity = velocity
        this.radius = 10
    }
    create(){
        c.beginPath()
        c.arc(this.coords.x, this.coords.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'yellow'
        c.fill()
        c.closePath()
    }
    refresh() {// this is a way to update the character speed and position
        this.create()// remakes the character at a position
        this.coords.x += this.velocity.x
        this.coords.y += this.velocity.y
    }

}

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


const map = [ //I can use this as a frame for tthe map we want
//after I design an outline I can iterate over each row of the map
//and draw a wall(these will later be replaced with pictures or sprites if time permits)
    ['-','-','-','-','-','-','-','-','-','-','-','-','-','-'],
    ['-',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','-'],
    ['-',' ',' ',' ',' ','-','-','-',' ',' ',' ',' ',' ','-'],
    ['-',' ','-',' ','-',' ',' ',' ',' ',' ',' ',' ',' ','-'],
    ['-',' ','-',' ','-',' ',' ',' ',' ',' ',' ',' ',' ','-'],
    ['-',' ','-',' ','-',' ',' ',' ',' ',' ',' ',' ',' ','-'],
    ['-',' ','-','-','-',' ',' ',' ',' ',' ',' ',' ',' ','-'],
    ['-',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','-'],
    ['-','-','-','-','-','-','-','-','-','-','-','-','-','-']
    
];
const walls =  [] 

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
                        }
                        
                     })
                ) //make a wall for the symbol
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
            player.velocity.y = -5
            break
        case 'a':
            player.velocity.x = -5
            break
        case 's':
            player.velocity.y = 5
            break
        case 'd':
            player.velocity.x = 5
            break
    }
}) 
function animate(){
    requestAnimationFrame(animate)

    c.clearRect(0, 0, canvas.width, canvas.height)//clears the previous drawing

    player.refresh() //re create the player locatikon
    walls.forEach((Wall) =>{ //walls will not move
        //coordinate check
        Wall.create()
    })
    
}
animate()