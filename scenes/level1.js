import Phaser from 'phaser';
import generateMaze from 'generate-maze';

class Level1 extends Phaser.Scene {
    constructor() {
        super('level1');
        this.walls = []; 
        this.player;
        this.success = null;
        this.gameOverSound = null; 
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
        this.load.audio('success', `${audioPath}soundEffects/success.wav`)
        this.load.audio('gameOver', `${audioPath}soundEffects/gameOver.wav`)
        this.load.audio('lullaby', `${audioPath}hbd_lullaby.wav`)
    }

    create() {

        if (!this.music) {
            this.music = this.sound.add('lullaby', {loop:true});
            this.music.play();
        }

        this.input.setDefaultCursor('none');

        const mazeWidth = 8;
        const mazeHeight = 8;
        const tileSize = {
            x: 600 / mazeWidth, 
            y: 500 / mazeHeight, 
        }

        //sperm animation
        this.anims.create({
            key: 'moving',
            frames: this.anims.generateFrameNames('sperm', { prefix: 'sperm', start: 1, end: 4 }), // Assuming frame names are like 'sperm1', 'sperm2', etc.
            frameRate: 10,
            repeat: -1
        });
        
        const petridish = this.physics.add.image(750, 250, 'petridish');
        petridish.setImmovable(true); 
        petridish.body.allowGravity = false; 
        petridish.setScale(.4);
        this.player = this.physics.add.sprite(50, 250, 'sperm');
        this.player.anims.play('moving');
        this.player.setImmovable(true); 
        this.player.body.allowGravity = false; 
        this.player.setCollideWorldBounds(true); 

        const entryPoint = Phaser.Math.Between(0, mazeHeight-1);
        const exitPoint = Phaser.Math.Between(0, mazeHeight-1); 
        const maze = generateMaze(mazeWidth, mazeHeight);
        maze[entryPoint][0].left = false;
        maze[exitPoint][mazeWidth-1].right = false;
        for (let i = 0; i < mazeHeight; i++) {
            for (let j = 0; j < mazeWidth; j++) {
                const cellX = j * tileSize.x + 100;
                const cellY = i * tileSize.y;
        
                if (maze[i][j].top) {
                    const wall = this.add.rectangle(cellX + tileSize.x / 2, cellY, tileSize.x, 2, 0xffffff);
                    this.walls.push(wall);
                }
                // If maze[i][j].bottom is true, add a white rectangle to the bottom of the cell
                if (maze[i][j].bottom) {
                    const wall = this.add.rectangle(cellX + tileSize.x / 2, cellY + tileSize.y, tileSize.x, 2, 0xffffff);
                    this.walls.push(wall);
                }
                // If maze[i][j].left is true, add a white rectangle to the left of the cell
                if (maze[i][j].left) {
                    const wall = this.add.rectangle(cellX, cellY + tileSize.y / 2, 2, tileSize.y, 0xffffff);
                    this.walls.push(wall);
                }
                // If maze[i][j].right is true, add a white rectangle to the right of the cell
                if (maze[i][j].right) {
                    const wall = this.add.rectangle(cellX + tileSize.x, cellY + tileSize.y / 2, 2, tileSize.y, 0xffffff);
                    this.walls.push(wall);
                }                  
            }
        }  
        this.walls.forEach(wall => {
            this.physics.add.existing(wall, true);
            
        });

        this.input.on('pointermove', pointer => {
            this.player.x = pointer.x;
            this.player.y = pointer.y;
        });

        this.physics.add.overlap(this.player, petridish, this.gameWon, null, this);

        this.physics.add.overlap(this.player, this.walls, (player, wall) => {
            this.gameOver(wall);
        }, null, this);
    }
    
    gameWon(){
        this.input.off('pointermove', this.pointerMoveListener);
        if (!this.success){
        this.input.setDefaultCursor('');
        this.success = this.sound.add('success'); 
        this.success.play();
        }
        const successText = this.add.text(400, 250, 'ARTIFICIALLY INSEMINATED!', {
            fontFamily: 'RetroFont',
            fontSize: '32px',
            fill: '#76ea7c'
        }).setOrigin(0.5);
        successText.setDepth(11);

        setTimeout(() => {
            this.walls = []; 
            this.success= null; 
            this.music.stop(); 
            this.music = null ; 
            this.scene.stop('level1');
            this.scene.start('level2instructions');
        }, 4000); 
    }

    gameOver(wall){
        this.input.off('pointermove', this.pointerMoveListener);
        this.input.setDefaultCursor('');
        if (!this.gameOverSound){
            this.gameOverSound = this.sound.add('gameOver'); 
            this.gameOverSound.play();
            }
        wall.setFillStyle(0xff0000);

        const gameOverText = this.add.text(400, 250, 'WE LOST U SWIMMER :(', {
            fontFamily: 'RetroFont',
            fontSize: '32px',
            fill: '#FF0000'
        }).setOrigin(0.5);
        gameOverText.setDepth(11);

        setTimeout(() => {
            this.walls = []; 
            this.gameOverSound = null ;
            this.music.stop();
            this.music = null; 
            this.scene.stop('level1');
            this.scene.start('GameOver');
        }, 3000); 
    }
}

export default Level1; 
