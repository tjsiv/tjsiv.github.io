

//This for each function below will check every symboll in the array called map and spawn a specific item for each one
//it checks each row (the arrays of string), then the symbol in them to figure out what to spawn
function generateWalls(currentLevelIndex, maps) {
    const walls = []
    const MAP_ROWS = maps[currentLevelIndex].length
    const MAP_COLUMNS = maps[currentLevelIndex][0].length
    canvas.width = Wall.width * MAP_COLUMNS
    canvas.height = Wall.height * MAP_ROWS
  
    maps[currentLevelIndex].forEach((row, i) => {
      row.forEach((symbol, j) => {
        switch (symbol) {
          case '-':
            walls.push(
              new Wall({
                coords: {
                  x: Wall.width * j,
                  y: Wall.height * i,
                },
                image: createImage('./assets/img/pipeHorizontal.png'),
              }),
            )
            break
          case '|':
            walls.push(
              new Wall({
                coords: {
                  x: Wall.width * j,
                  y: Wall.height * i,
                },
                image: createImage('./assets/img/pipeVertical.png'),
              }),
            )
            break
          case '1':
            walls.push(
              new Wall({
                coords: {
                  x: Wall.width * j,
                  y: Wall.height * i,
                },
                image: createImage('./assets/img/pipeCorner1.png'),
              }),
            )
            break
          case '2':
            walls.push(
              new Wall({
                coords: {
                  x: Wall.width * j,
                  y: Wall.height * i,
                },
                image: createImage('./assets/img/pipeCorner2.png'),
              }),
            )
            break
          case '3':
            walls.push(
              new Wall({
                coords: {
                  x: Wall.width * j,
                  y: Wall.height * i,
                },
                image: createImage('./assets/img/pipeCorner3.png'),
              }),
            )
            break
          case '4':
            walls.push(
              new Wall({
                coords: {
                  x: Wall.width * j,
                  y: Wall.height * i,
                },
                image: createImage('./assets/img/pipeCorner4.png'),
              }),
            )
            break
          case 'b':
            walls.push(
              new Wall({
                coords: {
                  x: Wall.width * j,
                  y: Wall.height * i,
                },
                image: createImage('./assets/img/block.png'),
              }),
            )
            break
          case '[':
            walls.push(
              new Wall({
                coords: {
                  x: j * Wall.width,
                  y: i * Wall.height,
                },
                image: createImage('./assets/img/capLeft.png'),
              }),
            )
            break
          case ']':
            walls.push(
              new Wall({
                coords: {
                  x: j * Wall.width,
                  y: i * Wall.height,
                },
                image: createImage('./assets/img/capRight.png'),
              }),
            )
            break
          case '_':
            walls.push(
              new Wall({
                coords: {
                  x: j * Wall.width,
                  y: i * Wall.height,
                },
                image: createImage('./assets/img/capBottom.png'),
              }),
            )
            break
          case '^':
            walls.push(
              new Wall({
                coords: {
                  x: j * Wall.width,
                  y: i * Wall.height,
                },
                image: createImage('./assets/img/capTop.png'),
              }),
            )
            break
          case '+':
            walls.push(
              new Wall({
                coords: {
                  x: j * Wall.width,
                  y: i * Wall.height,
                },
                image: createImage('./assets/img/pipeCross.png'),
              }),
            )
            break
          case '5':
            walls.push(
              new Wall({
                coords: {
                  x: j * Wall.width,
                  y: i * Wall.height,
                },
                color: 'blue',
                image: createImage('./assets/img/pipeConnectorTop.png'),
              }),
            )
            break
          case '6':
            walls.push(
              new Wall({
                coords: {
                  x: j * Wall.width,
                  y: i * Wall.height,
                },
                color: 'blue',
                image: createImage('./assets/img/pipeConnectorRight.png'),
              }),
            )
            break
          case '7':
            walls.push(
              new Wall({
                coords: {
                  x: j * Wall.width,
                  y: i * Wall.height,
                },
                color: 'blue',
                image: createImage('./assets/img/pipeConnectorBottom.png'),
              }),
            )
            break
          case '8':
            walls.push(
              new Wall({
                coords: {
                  x: j * Wall.width,
                  y: i * Wall.height,
                },
                image: createImage('./assets/img/pipeConnectorLeft.png'),
              }),
            )
            break
          case '.':
            pellets.push(
              new Pellet({
                coords: {
                  x: j * Wall.width + Wall.width / 2,
                  y: i * Wall.height + Wall.height / 2,
                },
              }),
            )
            break
  
          case 'p':
            powerPellets.push(
              new PowerPellet({
                coords: {
                  x: j * Wall.width + Wall.width / 2,
                  y: i * Wall.height + Wall.height / 2,
                },
              }),
            )
            break
  
          case 'I':
            items.push(
              new Item({
                coords: {
                  x: j * Wall.width + Wall.width / 2,
                  y: i * Wall.height + Wall.height / 2,
                },
                imgSrc: './assets/img/sprites/cherry.png',
              }),
            )
            break
        }
      })
    })
    return walls
  }
  