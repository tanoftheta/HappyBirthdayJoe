import Phaser from 'phaser';

class Level1instructions extends Phaser.Scene {
    constructor() {
        super('level1instructions');
        this.music = null; 
    }

    preload() {
        let imagePath, audioPath; 
        if (process.env.NODE_ENV === 'development') {
            imagePath = 'public/assets/sprites/conception/';
            audioPath = 'public/assets/music/';
        } else {
            imagePath = '/happybirthdayjoe/assets/sprites/conception/';
            audioPath = '/happybirthdayjoe/assets/music/';
        }
        this.load.atlas('sperm', `${imagePath}sperm.PNG`, `${imagePath}spermAnimation.json`);
        this.load.image('petridish', `${imagePath}petridish.PNG`);
        this.load.image('cursor', `${imagePath}cursor.png`)
        this.load.image('maze', `${imagePath}maze.png`)
        this.load.audio('lullaby', `${audioPath}hbd_lullaby.wav`)
    }

    create() {
        if (!this.music) {
            this.music = this.sound.add('lullaby', {loop:true});
            this.music.play();
        }
        const header = this.add.text(400, 100, 'LEVEL: CONCEPTION', {
            fontSize: '45px',
        }).setOrigin(0.5); 
        const instructions = this.add.text(400, 200, 'Lead the sperm cell to the petridish \n Be careful not to touch the maze walls.', {
            fontSize: '20px',
        }).setOrigin(0.5); 
        const cursor = this.add.image(225, 400, 'cursor').setOrigin(0.5); 
        cursor.setScale(.05); 
        const petridish = this.add.image(600, 400, 'petridish'); 
        petridish.setScale(.7);
        const maze = this.add.image(400, 375, 'maze'); 
        maze.setScale(.15); 
        const sperm = this.add.image(200, 350, 'sperm'); 
        sperm.setScale(1.2);
        const playButton = this.add.text(50, 250, 'Start', {
            fontSize: '16px',
            fontFamily: 'RetroFont', 
            fill: '#76ea7c'
        }).setOrigin(0.5);

        playButton.setInteractive();

        playButton.on('pointerover', () => {
            playButton.setFill('#ff0000'); // Change text color to red
            this.game.canvas.style.cursor = 'pointer'; // Change cursor style to pointer
            playButton.setScale(1.10); 
        });

        // Restore original text color and cursor style on pointer out
        playButton.on('pointerout', () => {
            playButton.setFill('#76ea7c'); // Restore original text color
            this.game.canvas.style.cursor = 'default'; // Restore original cursor style
            playButton.setScale(1.0); 
        });

        // Start level1 scene when the button is clicked
        playButton.on('pointerdown', () => {
            this.music.stop();
            this.scene.stop('level1instructions');
            this.scene.start('level1');
        });
    }
}

export default Level1instructions; 
