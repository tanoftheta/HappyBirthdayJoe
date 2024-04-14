import Phaser from 'phaser';

class bonuslevelinstructions extends Phaser.Scene {
    constructor() {
        super('bonuslevelinstructions');
        this.music = null; 
    }

    preload() {
        let imagePath, audioPath; 
        if (process.env.NODE_ENV === 'development') {
            imagePath = 'public/assets/sprites/kidPuzzle/';
            audioPath = 'public/assets/music/';
        } else {
            imagePath = '/happybirthdayjoe/assets/sprites/kidPuzzle/';
            audioPath = '/happybirthdayjoe/assets/music/';
        }
        this.load.image('joe', `${imagePath}joe.PNG`);
        this.load.image('cursor', `${imagePath}cursor.png`)
        this.load.audio('happybirthday', `${audioPath}hbd_spongebob.wav`);
    }

    create() {
        if (!this.music) {
            this.music = this.sound.add('happybirthday', {loop:true});
            this.music.play();
        }
        const joe = this.add.image(400, 500, 'joe').setOrigin(0.5);
        joe.setScale(1.10)
        const header = this.add.text(400, 100, 'LEVEL: KARATE KID', {
            fontSize: '45px',
        }).setOrigin(0.5); 
        const instructions = this.add.text(400, 150, 'Unscramble this photo of Young Joe \n clicking two pieces will swap their places', {
            fontSize: '20px',
        }).setOrigin(0.5); 

        const cursor = this.add.image(400, 380, 'cursor').setOrigin(0.5); 
        cursor.setScale(.05); 
        const playButton = this.add.text(400, 350, 'Start', {
            fontSize: '30px',
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
            this.music = null; 
            this.scene.stop('bonuslevelinstructions');
            this.scene.start('BonusLevel');
        });
    }
}

export default bonuslevelinstructions; 
