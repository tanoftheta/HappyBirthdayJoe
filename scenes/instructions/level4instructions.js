import Phaser from 'phaser';

class Level4instructions extends Phaser.Scene {
    constructor() {
        super('level4instructions');
        this.music = null; 
    }

    preload() {
        let imagePath, audioPath; 
        if (process.env.NODE_ENV === 'development') {
            audioPath = 'public/assets/music/';
            imagePath = 'public/assets/sprites/frontalLobe/';
        } else {
            audioPath = '/happybirthdayjoe/assets/music/'; 
            imagePath = '/happybirthdayjoe/assets/sprites/frontalLobe/';
        }
        this.load.audio('techHBD', `${audioPath}hbd_tech.wav`);
        this.load.image('arrowKeys', `${imagePath}arrowkeys.PNG`);
        this.load.image('brainCell', `${imagePath}brainCell.PNG`);
        this.load.image('drug', `${imagePath}drug.PNG`);     
    }

    create() {
        if (!this.music) {
            this.music = this.sound.add('techHBD', {loop:true});
            this.music.play();
        }
        const headerBackground = this.add.graphics();
        headerBackground.fillStyle('red', 0.5); // Set the fill color and transparency
        headerBackground.fillRect(0, 50, 800, 100); 

        const header = this.add.text(400, 100, 'LEVEL: FULLY DEVELOPED FRONTAL LOBE', {
            fontSize: '35px',
        }).setOrigin(0.5); 
        const instructions = this.add.text(400, 250, 'Congratulations on turning 25 and having a fully developed brain. \n Collect a brain cell for every year to win. \n Watch out for drugs! they look eerily similar to brain cells, \n but those kill a random number of brain cells, between 2-5. \n if you reach a negative number of brain cells, game over.', {
            fontSize: '20px',
        }).setOrigin(0.5); 
        this.cameras.main.setBackgroundColor('#FFC0CB');
        const arrowkeys = this.add.image(600, 400, 'arrowKeys');
        arrowkeys.setScale(0.15); 

        const brainCell = this.add.image(200, 400, 'brainCell').setOrigin(0.5); 
        brainCell.setScale(.3);
        const drug = this.add.image(125, 410, 'drug').setOrigin(0.5);
        drug.setScale(.7); 
        const playButton = this.add.text(400, 400, 'Play', {
            fontSize: '32px',
            fontFamily: 'RetroFont', 
            fill: '#FFF'
        }).setOrigin(0.5);

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
            this.scene.stop('level4instructions');
            this.scene.start('level4');
        });
    }
}

export default Level4instructions; 
