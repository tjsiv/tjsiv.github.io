const sound = {
    pellets: [
        new Howl({
            src: './assets/audio/pellet.mp3',
            volume: 0.5,
        }),
        new Howl({
            src: './assets/audio/pellet2.mp3',
            volume: 0.5,
        }),
    ],
    siren: new Howl({
        src: './assets/audio/siren.mp3',
        loop: true,
        volume: 0.5,
    }),
    cherry: new Howl({
        src: './assets/audio/cherry.wav',
        volume: 0.5,
    }),
    powerUp: new Howl({
        src: './assets/audio/powerup.wav',
        volume: 0.5,
    }),
    ghostScared: new Howl({
        src: './assets/audio/ghostScared.wav',
        loop: true,
        volume: 0.3,
    }),
    success: new Howl({
        src: './assets/audio/success.wav',
        volume: 0.5,
    }),
    die: new Howl({
        src: './assets/audio/die.wav',
        volume: 0.5,
    }),

    gameOver: new Howl({
        src: './assets/audio/gameOver.wav',
        volume: 0.5,
    }),
}
