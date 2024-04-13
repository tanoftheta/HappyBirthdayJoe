import Phaser from 'phaser';

class Level2instructions extends Phaser.Scene {
    constructor() {
        super('level2instructions');
    }

    preload() {
        let imagePath, audioPath; 
        if (process.env.NODE_ENV === 'development') {
            imagePath = '/assets/sprites/teenHouseParty/';
            audioPath = '/assets/music/';
        } else {
            imagePath = '/happybirthdayjoe/assets/sprites/teenHouseParty/';
            audioPath = '/happybirthdayjoe/assets/music/';
        }
        this.load.image('cursor', `${imagePath}cursor.png`); 
        this.load.image('trash', `${imagePath}trash.PNG`);
        this.load.image('clock', `${imagePath}clock.PNG`);
        this.load.image('beerCan', `${imagePath}beerCan.PNG`);
        this.load.image('crushedCan', `${imagePath}crushedCan.PNG`);
        this.load.audio('housePartyMusic', `${audioPath}hbd_rock.wav`);
    }

    create() {
        const music = this.sound.add('housePartyMusic', {loop:true});
        music.play(); 
        const header = this.add.text(400, 100, 'LEVEL: TEEN HOUSE PARTY', {
            fontSize: '45px',
        }).setOrigin(0.5); 
        const instructions = this.add.text(400, 200, 'Your moms are getting home in 20 mins! \n Toss all the beer cans! \n Be sure to check behind the furniture.', {
            fontSize: '20px',
        }).setOrigin(0.5); 
        this.cameras.main.setBackgroundColor('#00008B');

        const beerCan = this.add.image(200, 400, 'beerCan'); 
        const crushedCan = this.add.image(250, 420, 'crushedCan'); 
        const trash = this.add.image(600, 400, 'trash');
        const cursor = this.add.image(225, 440, 'cursor').setOrigin(0.5); 
        cursor.setScale(.05); 

        const playButton = this.add.text(400, 400, 'Play', {
            fontSize: '32px',
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
            music.stop();
            this.scene.stop('level2instructions');
            this.scene.start('level2');
        });
    }
}

export default Level2instructions; 
