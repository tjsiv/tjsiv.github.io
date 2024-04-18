function circleCollidesWithSquare({ circle, square }) {
    const padding = Wall.width / 2 - circle.radius - 2
    return (
      circle.coords.y - circle.radius + circle.velocity.y <=
        square.coords.y + square.height + padding &&
      circle.coords.x + circle.radius + circle.velocity.x >=
        square.coords.x - padding &&
      circle.coords.y + circle.radius + circle.velocity.y >=
        square.coords.y - padding &&
      circle.coords.x - circle.radius + circle.velocity.x <=
        square.coords.x + square.width + padding
    )
  }
  
  function createImage(src) {
    const image = new Image()
    image.src = src
    return image
  }
  //colision detec
    //circle ➡️ square collision detection works by measuring the center position
    //of the circle plus its radius against the position plus width of the square
    //as the two objects aproach the value will aproch zero upon getting to close a 
    //colision is called this was orriginally an if else statement but it was too repetitive and messy
    