import Phaser from 'phaser';

class Level3instructions extends Phaser.Scene {
    constructor() {
        super('level3instructions');
        this.music = null; 
    }

    preload(){
        let imagePath, audioPath; 
        if (process.env.NODE_ENV === 'development') {
            imagePath = 'public/assets/sprites/bartender/';
            audioPath = 'public/assets/music/';
        } else {
            imagePath = '/happybirthdayjoe/assets/sprites/bartender/';
            audioPath = '/happybirthdayjoe/assets/music/';
        }
        this.load.audio('hbd_irish', `${audioPath}hbd_irish.wav`);
        this.load.image('cocktail', `${imagePath}cocktail.PNG`);
        this.load.image('shaker', `${imagePath}shaker.PNG`);
    }

    create() {
        if (!this.music) {
            this.music = this.sound.add('hbd_irish', {loop:true});
            this.music.play();
        }
        const headerBackground = this.add.graphics();
        headerBackground.fillStyle(0xFFA500, 1.0); // Set the fill color and transparency// Set the fill color and transparency
        headerBackground.fillRect(0, 50, 800, 100); 

        const header = this.add.text(400, 100, 'LEVEL: OH, BARTENDER!', {
            fontSize: '35px',
        }).setOrigin(0.5); 
        const instructions = this.add.text(400, 250, 'Make the cocktail on the ticket \n you only get one chance if you dont want to lose your tip!', {
            fontSize: '20px',
        }).setOrigin(0.5); 
        this.cameras.main.setBackgroundColor('#007a33');


        const playButton = this.add.text(400, 400, 'Play', {
            fontSize: '32px',
            fontFamily: 'RetroFont', 
            fill: '#FFF'
        }).setOrigin(0.5);

        const cocktail = this.add.image(200, 400, 'cocktail');
        cocktail.setScale(.4);
        const shaker = this.add.image(600, 400, 'shaker');
        shaker.setScale(.4);
        playButton.setInteractive();

        playButton.on('pointerover', () => {
            playButton.setFill('#ff0000'); // Change text color to red
            this.game.canvas.style.cursor = 'pointer'; // Change cursor style to pointer
            playButton.setScale(1.10); 
        });

        // Restore original text color and cursor style on pointer out
        playButton.on('pointerout', () => {
            playButton.setFill('#FFF'); // Restore original text color
            this.game.canvas.style.cursor = 'default'; // Restore original cursor style
            playButton.setScale(1.0); 
        });

        // Start level1 scene when the button is clicked
        playButton.on('pointerdown', () => {
            this.music.stop();
            this.music = null; 
            this.scene.stop('level3instructions');
            this.scene.start('level3');
        });
    }
}

export default Level3instructions; 
