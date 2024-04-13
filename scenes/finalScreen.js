import Phaser from 'phaser';

class FinalScreen extends Phaser.Scene {
    constructor() {
        super('FinalScreen');
        this.music = null ; 
    }

    preload() {
        let imagePath, audioPath; 
        if (process.env.NODE_ENV === 'development') {
            imagePath = '/assets/';
            audioPath = '/assets/music/';
        } else {
            imagePath = '/happybirthdayjoe/assets/';
            audioPath = '/happybirthdayjoe/assets/music/';
        }
        this.load.image('finalScreen', `${imagePath}finalScreen.jpeg`); 
        this.load.audio('happybirthdayjoe', `${audioPath}happybirthdayjoe.wav`);
    }

    create() {
        if (!this.music) {
            this.music = this.sound.add('happybirthdayjoe');
            this.music.play();
        }
        const bg = this.add.image(400,240, 'finalScreen').setOrigin(0.5);
        bg.setScale(.40); 

        const startButton = this.add.text(600, 450, 'Play Again', {
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
            this.music.stop(); 
            this.music = null ; 
            this.scene.stop('FinalScreen');
            this.scene.start('startScreen');
        });
    }
}

export default FinalScreen; 
