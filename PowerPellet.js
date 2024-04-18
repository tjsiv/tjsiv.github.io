class PowerPellet {
    constructor({ coords }) {
      this.coords = coords
      this.radius = 8
    }
  
    create() {
      c.beginPath()
      c.arc(this.coords.x, this.coords.y, this.radius, 0, Math.PI * 2)
      c.fillStyle = 'white'
      c.fill()
      c.closePath()
    }
  }
  