const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

document.querySelector('#startButton').addEventListener('click', (e) => {
    document.querySelector('#startScreen').style.display = 'none';
    document.querySelector('#readyTag').style.display = 'block';
    setTimeout(() => {
        game.init();
        document.querySelector('#readyTag').style.display = 'none';
        document.querySelector('#goTag').style.display = 'block';
        document.querySelector('#pauseButton').style.display = 'block';
    }, 2000);
});

document.querySelector('#restartGameButton').addEventListener('click', () => {
    document.querySelector('#gameOverScreen').style.display = 'none';
    game.restart();
    game.init();
    game.initStart();
});
const scoreEl = document.querySelector('#scoreEl')

const maps = [
  [
    ['1', '-', '-', '-', ']', '.', '[', '-', '-', '-', '2'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', 'I', '|'],
    ['|', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '|', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '_', '.', '[', ']', '.', '|'],
    ['_', '.', '.', '.', '.', '.', '.', '.', '.', '.', '_'],
    ['.', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '.'],
    ['^', '.', '.', '.', '.', '.', '.', '.', '.', '.', '^'],
    ['|', '.', '[', ']', '.', '^', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '|', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '|'],
    ['|', 'I', '.', '.', '.', '.', '.', '.', '.', 'p', '|'],
    ['4', '-', '-', '-', ']', '.', '[', '-', '-', '-', '3'],
  ],
  [
    ['1', '-', '-', '-', ']', '.', '[', '-', '-', '-', '2'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', 'b', '.', '[', ']', '.', '|'],
    ['_', '.', '.', '.', '.', '.', '.', '.', '.', '.', '_'],
    ['.', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '.'],
    ['^', '.', '.', '.', '.', '.', '.', '.', '.', '.', '^'],
    ['|', '.', '[', ']', '.', 'b', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
    ['4', '-', '-', '-', ']', '.', '[', '-', '-', '-', '3'],
  ],
]

let pellets = [];
let powerPellets = [];
let monsters = [];
let player = {};
let items = [];
let monsterSpeed = 75;
const MONSTER_SPEED_INCREMENT = 25;

const keys = {
    w: {
      pressed: false,
    },
    a: {
      pressed: false,
    },
    s: {
      pressed: false,
    },
    d: {
      pressed: false,
    },
}
  
let lastKey = '';
let score = 0;
let animationId
let prevMs = Date.now()
let accumulatedTime = 0
let monsterReleaseIntervals = [0, 7, 14, 21]
let currentLevelIndex = 0
let walls = generateWalls(currentLevelIndex, maps)
let lives = 3

const monsterCoords = [
    [
      {
        x: Wall.width * 5 + Wall.width / 2,
        y: Wall.height * 5 + Wall.height / 2,
      },
      {
        x: Wall.width * 5 + Wall.width / 2,
        y: Wall.height * 6 + Wall.height / 2,
      },
      {
        x: Wall.width * 4 + Wall.width / 2,
        y: Wall.height * 6 + Wall.height / 2,
      },
      {
        x: Wall.width * 6 + Wall.width / 2,
        y: Wall.height * 6 + Wall.height / 2,
      },
    ],
    [
      {
        x: Wall.width * 5 + Wall.width / 2,
        y: Wall.height * 3 + Wall.height / 2,
      },
      {
        x: Wall.width * 5 + Wall.width / 2,
        y: Wall.height * 4 + Wall.height / 2,
      },
      {
        x: Wall.width * 4 + Wall.width / 2,
        y: Wall.height * 4 + Wall.height / 2,
      },
      {
        x: Wall.width * 6 + Wall.width / 2,
        y: Wall.height * 4 + Wall.height / 2,
      },
    ],
  ]

  const game = {
    isPaused: false,
    init() {
      pellets = []
      powerPellets = []
      items = []
      accumulatedTime = 0
      player = new Player({
        coords: {
          x: Wall.width + Wall.width / 2,
          y: Wall.height + Wall.height / 2,
        },
        velocity: {
          x: 0,
          y: 0,
        },
      })
      monsters = [
        new Monster({
          coords: monsterCoords[currentLevelIndex][0],
          velocity: {
            x: Monster.speed * (Math.random() < 0.5) ? -1 : 1,
            y: 0,
          },
          imgSrc: './assets/img/sprites/orangeGhost.png',
          state: 'active',
          speed: monsterSpeed,
          outOfCage: true,
        }),
        new Monster({
          coords: monsterCoords[currentLevelIndex][1],
          velocity: {
            x: Monster.speed * (Math.random() < 0.5) ? -1 : 1,
            y: 0,
          },
          imgSrc: './assets/img/sprites/greenGhost.png',
          speed: monsterSpeed,
        }),
        new Monster({
          coords: monsterCoords[currentLevelIndex][2],
          velocity: {
            x: Monster.speed * (Math.random() < 0.5) ? -1 : 1,
            y: 0,
          },
          imgSrc: './assets/img/sprites/redGhost.png',
          speed: monsterSpeed,
        }),
        new Monster({
          coords: monsterCoords[currentLevelIndex][3],
          velocity: {
            x: Monster.speed * (Math.random() < 0.5) ? -1 : 1,
            y: 0,
          },
          imgSrc: './assets/img/sprites/yellowGhost.png',
          speed: monsterSpeed,
        }),
      ]
  
      walls = generateWalls(currentLevelIndex, maps)
    },
    initStart() {
      player.state = 'paused'
      monsters.forEach((monster) => {
        monster.state = 'paused'
      })
  
      setTimeout(() => {
        monsters[0].state = 'active'
        monsters[1].state = null
        monsters[2].state = null
        monsters[3].state = null
        player.state = 'active'
      }, 1000)
    },
    nextRound() {
  
      player.state = 'paused'
      monsters.forEach((monster) => {
        monster.state = 'paused'
      })
  
      monsterSpeed += MONSTER_SPEED_INCREMENT
      monsterReleaseIntervals = monsterReleaseIntervals.map((interval, index) => {
        if (index === 0) return interval
        else if (index === 1 && interval > 1) return interval - 1
        else if (index === 2 && interval > 2) return interval - 1
        else if (index === 3 && interval > 3) return interval - 1
      })
  
      setTimeout(() => {
        currentLevelIndex++
        if (currentLevelIndex > maps.length - 1) currentLevelIndex = 0
        walls = generateWalls(currentLevelIndex, maps)
        game.init()
        game.initStart()
      }, 1000)
    },
    pause() {
      player.state = 'paused'
      monsters.forEach((monster) => {
        monster.state = 'paused'
      })
    },
    resume() {
      this.isPaused = false
      player.state = 'active'
      monsters.forEach((monster) => {
        monster.state = 'active'
      })
    },
    end() {
      document.querySelector('#gameOverScoreLabel').innerHTML = score
      document.querySelector('#gameOverScreen').style.display = 'block'
      document.querySelector('#pauseButton').style.display = 'none'
    },
    restart() {
      currentLevelIndex = 0
      walls = generateWalls(currentLevelIndex, maps)
      lives = 3
      score = 0
      scoreEl.innerHTML = score
      document.querySelector('#pauseButton').style.display = 'block'
    },
}
  
game.init()
game.pause()

function animate() {
    animationId = requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)
  
    const currentMs = Date.now()
    const delta = (currentMs - prevMs) / 1000
    prevMs = currentMs
  
    if (player.state === 'active') accumulatedTime += delta
  
    if (keys.w.pressed && lastKey === 'w') player.move('up')
    else if (keys.a.pressed && lastKey === 'a') player.move('left')
    else if (keys.s.pressed && lastKey === 's') player.move('down')
    else if (keys.d.pressed && lastKey === 'd') player.move('right')
  
    // detect collision between monsters and player
    for (let i = monsters.length - 1; 0 <= i; i--) {
      const monster = monsters[i]
      // monster touches player
      if (
        Math.hypot(
          monster.coords.x - player.coords.x,
          monster.coords.y - player.coords.y,
        ) <
          monster.radius + player.radius &&
        player.state === 'active'
      ) {
        if (monster.state === 'scared') {
          monsters.splice(i, 1)
        } else {
          lives--
          player.die(lives, game)
          monsters.forEach((monster) => {
            monster.state = 'paused'
          })
          console.log('you lose')
        }
      }
    }
  
    // win condition goes here
    if (pellets.length === 40 && player.state === 'active') {
      game.nextRound()
    }
  
    // power ups go
    for (let i = powerPellets.length - 1; 0 <= i; i--) {
      const powerPellet = powerPellets[i]
      powerPellet.create()
  
      // player collides with powerup
      if (
        Math.hypot(
          powerPellet.coords.x - player.coords.x,
          powerPellet.coords.y - player.coords.y,
        ) <
        powerPellet.radius + player.radius
      ) {
        powerPellets.splice(i, 1)

  
        // make monsters scared
        monsters.forEach((monster) => {
          monster.state = 'preScared'
  
          setTimeout(() => {
            monster.state = 'preActive'
          }, 5000)
        })
      }
    }
  
    // for our items
    for (let i = items.length - 1; 0 <= i; i--) {
      const item = items[i]
      item.create()
  
      // player collides with item
      if (
        Math.hypot(
          item.coords.x - player.coords.x,
          item.coords.y - player.coords.y,
        ) <
        item.radius + player.radius
      ) {

        items.splice(i, 1)
        score += 50
        scoreEl.innerHTML = score
      }
    }
  
    // touch pellets here
    for (let i = pellets.length - 1; 0 <= i; i--) {
      const pellet = pellets[i]
      pellet.create()
  
      if (
        Math.hypot(
          pellet.coords.x - player.coords.x,
          pellet.coords.y - player.coords.y,
        ) <
        pellet.radius + player.radius
      ) {
        
        pellets.splice(i, 1)
        score += 15
        scoreEl.innerHTML = score
      }
    }
  
    walls.forEach((wall) => {
      wall.create()
    })
  
    player.update(delta, walls)
  
    monsters.forEach((monster, index) => {
      monster.update(delta, walls)
  
      if (accumulatedTime > monsterReleaseIntervals[index] && !monster.outOfCage)
        monster.enterGame(monsterCoords[currentLevelIndex][1])
    })
  
    if (player.velocity.x > 0) player.rotation = 0
    else if (player.velocity.x < 0) player.rotation = Math.PI
    else if (player.velocity.y > 0) player.rotation = Math.PI / 2
    else if (player.velocity.y < 0) player.rotation = Math.PI * 1.5
  } // end of animate()
  
  animate()

  document.querySelector('#pauseButton').addEventListener('click', () => {
    if (game.isPaused) {
      game.resume()
    } else {
      game.pause()
      game.isPaused = true
    }
  })

  document.querySelector('#restartGameButton').addEventListener('click', () => {
    document.querySelector('#gameOverScreen').style.display = 'none'
    game.restart()
    game.init()
    game.initStart()
  })

  document.querySelector('#startButton').addEventListener('click', (e) => {
    document.querySelector('#startScreen').style.display = 'none'
    document.querySelector('#readyTag').style.display = 'block'
    setTimeout(() => {
      game.init()

      document.querySelector('#readyTag').style.display = 'none'
      document.querySelector('#goTag').style.display = 'block'
      document.querySelector('#pauseButton').style.display = 'block'
      
    }, 2000)
  })