class Wall {
    static width = 40
    static height = 40
    constructor({ coords, image }) {
      this.coords = coords
      this.width = 40
      this.height = 40
      this.image = image
    }
  
    create() {
      // c.fillStyle = 'blue'
      // c.fillRect(this.coords.x, this.coords.y, this.width, this.height)
  
      c.drawImage(this.image, this.coords.x, this.coords.y)
    }
  }
  //I can use this as a frame for the map we want
//after I design an outline I can iterate over each row of the map
//and draw a wall(these will later be replaced with pictures or sprites if time permits)