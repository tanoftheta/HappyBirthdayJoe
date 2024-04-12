import Phaser from 'phaser';

class StartScreen extends Phaser.Scene {
    constructor() {
        super('startScreen');
    }

    preload() {
        this.load.image('twentyfive', '/public/assets/25.png');
        this.load.audio('backgroundMusic', 'public/assets/music/hbd_classic.wav');
    }

    create() {
        // Set the background color to white
        this.bounceCount = 0;
        const music = this.sound.add('backgroundMusic', {loop:true});
        music.play();
        const speedDown = 300; 
        this.cameras.main.setBackgroundColor('#ffffff');

        // Add the image and set its scale to make it smaller
        this.image = this.physics.add.image(400, 0, 'twentyfive').setOrigin(0.5);
        this.image.setMaxVelocity(0, speedDown)
        this.image.setGravityY(speedDown);
        this.image.setCollideWorldBounds(true);
        this.image.setBounce(0.5);
        this.image.setScale(0.40);
        

        const text = this.add.text(400, 300, 'the Game', {
            fontFamily: 'Roboto',
            fill: 'red'
        }).setOrigin(0.5); 
        // Add the start button
        const startButton = this.add.text(400, 400, 'Start', {
            fontSize: '32px',
            fontFamily: 'RetroFont', 
            fill: '#000'
        }).setOrigin(0.5);

        startButton.setInteractive();

        startButton.on('pointerover', () => {
            startButton.setFill('#ff0000'); // Change text color to red
            this.game.canvas.style.cursor = 'pointer'; // Change cursor style to pointer
            startButton.setScale(1.10); 
        });

        // Restore original text color and cursor style on pointer out
        startButton.on('pointerout', () => {
            startButton.setFill('#000'); // Restore original text color
            this.game.canvas.style.cursor = 'default'; // Restore original cursor style
            startButton.setScale(1.0); 
        });

        // Start level1 scene when the button is clicked
        startButton.on('pointerdown', () => {
            music.stop(); 
            this.scene.stop('StartScreen');
            this.scene.start('GameOver');
        });
        
    }

    update() {
        if (this.image.y >= 200){
            if (this.bounceCount < 5){
                this.image.setVelocityY(-300 + (this.bounceCount * 50))
                this.bounceCount ++; 
            }
            this.image.setY(200);
        }

    }
}

export default StartScreen;
