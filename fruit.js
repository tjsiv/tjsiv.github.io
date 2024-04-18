//currently only one fruit
class Item {
    constructor({ coords, imgSrc = './img/sprites/cherry.png' }) {
      this.coords = coords
      this.radius = 8
      this.image = new Image()
      this.image.src = imgSrc
      this.loaded = false
      this.image.onload = () => {
        this.loaded = true
      }
      this.center = JSON.parse(JSON.stringify(coords))
      this.radians = 0
    }
  
    create() {
      if (!this.loaded) return
  
      c.drawImage(
        this.image,
        this.coords.x - this.image.width / 2,
        this.coords.y - this.image.height / 2,
      )
  
      this.radians += 0.05
  
      this.coords.x = this.center.x + Math.cos(this.radians)
      this.coords.y = this.center.y + Math.sin(this.radians)
    }
  }
  
