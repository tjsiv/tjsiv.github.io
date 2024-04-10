const canvas = document.querySelector('canvas') //grab canvas
const c = canvas.getContext('2d') //get methods for 2d space

canvas.width = innerWidth //let canvas fill screen
canvas.height = innerHeight

class Wall { // these walls will be the boundary for the map and the objects in maze
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
const map = [ //I can use this as a frame for tthe map we want
//after I design an outline I can iterate over each row of the map
//and draw a wall(these will later be replaced with pictures or sprites if time permits)
    ['-','-','-','-','-','-'],
    ['-',' ',' ',' ',' ','-'],
    ['-',' ',' ',' ',' ','-'],
    ['-','-','-','-','-','-']
    // ['-'],[' '],[' '],[' '],[' '],['-'],
    // ['-'],['-'],['-'],['-'],['-'],['-']
];
const walls =  [] 
map.forEach((row, i) =>{ //this is the wall itterator with index of y
    row.forEach((symbol, j) =>{ //this is the itterator index of x
        switch(symbol) {
            case '-':
                walls.push(
                    new Wall({
                        coords: {
                            x: 40 * j,
                            y: 40 * i
                        }
                     })
                ) //make a wall for the symbol
                break
        }
    })
})
walls.forEach((Wall) =>{
    console.log(Wall)
    Wall.create()
})