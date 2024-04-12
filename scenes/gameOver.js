import Phaser from 'phaser';

class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    preload() {
        this.load.audio('bgMusic', 'public/assets/music/hbd_sad.wav');
    }

    create() {
        // Set the background color to black
        this.cameras.main.setBackgroundColor('#000');

        const text = this.add.text(400, 200, 'Game Over', {
            fontSize: 100,
            fontFamily: 'Impact',
            fill: 'red'
        }).setOrigin(0.5); 
        const text2 = this.add.text(400, 275, ':(', {
            fontSize: 25,
            fontFamily: 'Roboto',
            fill: 'red'
        }).setOrigin(0.5); 

        const startButton = this.add.text(400, 400, 'Try again', {
            fontSize: '32px',
            fontFamily: 'RetroFont', 
            fill: 'yellow'
        }).setOrigin(0.5);

        startButton.setInteractive();

        startButton.on('pointerover', () => {
            startButton.setFill('green'); // Change text color to red
            this.game.canvas.style.cursor = 'pointer'; // Change cursor style to pointer
            startButton.setScale(1.10); 
        });

        // Restore original text color and cursor style on pointer out
        startButton.on('pointerout', () => {
            startButton.setFill('yellow'); // Restore original text color
            this.game.canvas.style.cursor = 'default'; // Restore original cursor style
            startButton.setScale(1.0); 
        });

        const music = this.sound.add('bgMusic', {loop:true});
        music.play();
        // Start level1 scene when the button is clicked
        startButton.on('pointerdown', () => {
            music.stop(); 
            this.scene.stop('GameOver');
            this.scene.start('startScreen');
        });
        
    }
    destroy() {
        this.sound.stopAll();
    }
}

export default GameOver;
