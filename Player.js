const SPEED = 200
const CHOMP_RATE = 30

class Player {
  constructor({ coords, velocity }) {
    this.coords = coords
    this.velocity = velocity
    this.radius = 15
    this.radians = 0.75
    this.openRate = 0.12
    this.rotation = 0
    this.desiredDirection = {
      x: 0,
      y: 0,
    }
    this.state = 'active'
  }

  create() {
    c.save()
    c.translate(this.coords.x, this.coords.y)
    c.rotate(this.rotation)
    c.translate(-this.coords.x, -this.coords.y)
    c.beginPath()
    c.arc(
      this.coords.x,
      this.coords.y,
      this.radius,
      this.radians,
      Math.PI * 2 - this.radians,
    )
    c.lineTo(this.coords.x, this.coords.y)
    c.fillStyle = 'yellow'
    c.fill()
    c.closePath()
    c.restore()
  }

  move(direction) {
    switch (direction) {
      case 'up':
        this.desiredDirection = {
          x: 0,
          y: -1,
        }
        break
      case 'down':
        this.desiredDirection = {
          x: 0,
          y: 1,
        }
        break
      case 'left':
        this.desiredDirection = {
          x: -1,
          y: 0,
        }
        break
      case 'right':
        this.desiredDirection = {
          x: 1,
          y: 0,
        }
        break
    }
  }

  collision(walls) {
    for (const wall of walls) {
      if (
        circleCollidesWithSquare({
          circle: this,
          square: wall,
        })
      ) {
        return true
      }
    }

    return false
  }

  snapToGrid() {
    const CELL_SIZE = 20
    this.coords = {
      x: Math.round(this.coords.x / CELL_SIZE) * CELL_SIZE,
      y: Math.round(this.coords.y / CELL_SIZE) * CELL_SIZE,
    }
  }

  isValidMove(walls) {
    const PIXEL_BUFFER = 5
    for (const wall of walls) {
      if (
        circleCollidesWithSquare({
          circle: {
            ...this,
            velocity: {
              x: this.desiredDirection.x * PIXEL_BUFFER,
              y: this.desiredDirection.y * PIXEL_BUFFER,
            },
          },
          square: wall,
        })
      ) {
        return false
      }
    }

    return true
  }

  movePlayerWithInput(delta, walls) {
    if (this.isValidMove(walls)) {
      this.velocity.x = this.desiredDirection.x
      this.velocity.y = this.desiredDirection.y
    }

    if (this.collision(walls)) {
      this.velocity.x = 0
      this.velocity.y = 0
      this.snapToGrid()
    } else {
      this.coords.x += this.velocity.x * delta * SPEED
      this.coords.y += this.velocity.y * delta * SPEED
    }

    // chomp
    if (this.radians < 0 || this.radians > 0.75) this.openRate = -this.openRate
    this.radians = Math.max(0, Math.min(this.radians, 0.75))
    this.radians += this.openRate * delta * CHOMP_RATE

    this.checkTransportOnVerticalAxis()
    this.checkTransportOnHorizontalAxis()
  }

  checkTransportOnVerticalAxis() {
    if (this.coords.y + this.radius < 0) this.coords.y = canvas.height
    else if (this.coords.y - this.radius > canvas.height) this.coords.y = 0
  }

  checkTransportOnHorizontalAxis() {
    if (this.coords.x + this.radius < 0) this.coords.x = canvas.width
    else if (this.coords.x - this.radius > canvas.width) this.coords.x = 0
  }

  die(lives, game) {
    this.state = 'initDeath'
    gsap.to(this, {
      radians: Math.PI - 0.00001,
      onComplete: () => {
        setTimeout(() => {
          if (lives > 0) {
            game.init()
            game.initStart()
          } else {
            game.end()
          }
        }, 750)
      },
    })
  }

  update(delta, walls) {
    this.create()

    switch (this.state) {
      case 'active':
        this.movePlayerWithInput(delta, walls)
        break
      case 'initDeath':
        this.state = 'death'
        break
    }
  }
}
