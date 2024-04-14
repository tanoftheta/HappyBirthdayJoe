import Phaser from 'phaser';

class Level4 extends Phaser.Scene {
    constructor() {
        super('level4');
        this.player; 
        this.cursor; 
        this.playerSpeed = 450; 
        this.brainCells = []; 
        this.drugs = []; 
        this.score = 0;
        this.ScoreText;
        this.gameOverSound = null ; 
        this.successSound = null ; 
        this.music = null ;   
    }

    preload() {
        let imagePath, audioPath; 
        if (process.env.NODE_ENV === 'development') {
            audioPath = '/assets/music/';
            imagePath = '/assets/sprites/frontalLobe/';
        } else {
            imagePath = '/happybirthdayjoe/assets/sprites/frontalLobe/';
            audioPath = '/happybirthdayjoe/assets/music/';
        }
        this.load.audio('techHBDBG', `${audioPath}hbd_tech.wav`);
        this.load.audio('success', `${audioPath}soundEffects/success.wav`)
        this.load.audio('gameOver', `${audioPath}soundEffects/gameOver.wav`)
        this.load.image('brain', `${imagePath}brain.PNG`);
        this.load.image('brainCell', `${imagePath}brainCell.PNG`);
        this.load.image('drug', `${imagePath}drug.PNG`);
    }

    create() {
        if (!this.music) {
            this.music = this.sound.add('techHBDBG', {loop:true});
            this.music.play();
        }
        this.cameras.main.setBackgroundColor('#FFC0CB');

        this.ScoreText= this.add.text(400, 25, `Number of Brain Cells Collected: ${this.score}`, {
            fontFamily: 'RetroFont',
            fontSize: '30px',
            fill: '#FFF',
        }).setOrigin(0.5);


        const numberofBrainCells = 4; 
        for (let i = 0; i < numberofBrainCells; i++){
            const x = Phaser.Math.Between(10, 790);
            const y = 50;
            const velocityY = Phaser.Math.Between(150, 300);
            const brainCell = this.physics.add.sprite(x, y, 'brainCell'); // Create a sprite
            brainCell.setScale(0.1); // Adjust scale if needed
    
            // Set physics properties
            brainCell.setVelocity(0, velocityY);
            brainCell.setGravityY(0);
            brainCell.setMaxVelocity(0, velocityY);
    
            this.brainCells.push(brainCell); 
        }

        const numberofDrugs = 3; 
        for (let i = 0; i < numberofDrugs; i++){
            const x = Phaser.Math.Between(10, 790);
            const y = 50;
            const velocityY = Phaser.Math.Between(150, 300);
            const drug = this.physics.add.sprite(x, y, 'drug');
            drug.setScale(0.4); 

            drug.setVelocity(0, velocityY);
            drug.setGravityY(0);
            drug.setMaxVelocity(0, velocityY);
    
            this.drugs.push(drug); 
        }

        this.player = this.physics.add.image(400,450, 'brain').setOrigin(0.5);
        this.player.setImmovable(true); 
        this.player.body.allowGravity = false; 
        this.player.setCollideWorldBounds(true); 
        this.player.setScale(1.2);


        this.physics.add.overlap(this.player, this.brainCells, (player, brainCell) => {
            this.brainCellCaptured(brainCell); 
        }, null, this);

        this.physics.add.overlap(this.player, this.drugs, (player, drug) => {
            this.drugUse(drug); 
        }, null, this);

        this.cursor = this.input.keyboard.createCursorKeys();
    }

    update(){
        if (this.score >= 25){
            this.gameWon();
        }
        if (this.score < 0){
            this.gameOver(); 
        }
        this.ScoreText.setText(`Number of Brain Cells Collected: ${this.score}`);
        for (const brainCell of this.brainCells) {
            if (brainCell.y >= 500) {
                brainCell.setY(0); 
                brainCell.setX(Phaser.Math.Between(10, 790));
            }
        }

        for (const drug of this.drugs) {
            if (drug.y >= 500) {
                drug.setY(0); 
                drug.setX(Phaser.Math.Between(10, 790));
            }
        }
        const {left, right} = this.cursor;
        if (left.isDown){
            this.player.setVelocityX(-this.playerSpeed);
        } else if (right.isDown){
            this.player.setVelocityX(this.playerSpeed); 
        } else {
            this.player.setVelocityX(0); 
        }
    }

    brainCellCaptured(brainCell) {
        this.score++;
        const text = this.add.text(brainCell.x, brainCell.y, `+1`, {
            fontFamily: 'Arial',
            fontSize: 16,
            color: '#00FF00',
        }).setOrigin(0.5);
    
        this.tweens.add({
            targets: text,
            y: '-=50',
            alpha: 0,
            duration: 1000,
            onComplete: () => {
                text.destroy();
            }
        });                 
        brainCell.setY(0); 
        brainCell.setX(Phaser.Math.Between(10, 790));
    }

    drugUse(drug){
        const scoreReduction = Phaser.Math.Between(2,5); 
        this.score = this.score - scoreReduction; 
        const text = this.add.text(drug.x, drug.y, `-${scoreReduction}`, {
            fontFamily: 'Arial',
            fontSize: 16,
            color: '#ff0000',
        }).setOrigin(0.5);
    
        this.tweens.add({
            targets: text,
            y: '-=50',
            alpha: 0,
            duration: 1000,
            onComplete: () => {
                text.destroy();
            }
        });
    
        drug.setY(0); 
        drug.setX(Phaser.Math.Between(10, 790));
    }

    gameWon(){
        this.player.setVelocity(0);
        if (this.brainCells) {
            for (const brainCell of this.brainCells) {
                if (brainCell && brainCell.setVelocity) {
                    brainCell.setVelocity(0);
                }
            }
        }
        if (this.drugs) {
            for (const drug of this.drugs) {
                if (drug && drug.setVelocity) {
                    drug.setVelocity(0);
                }
            }
        }
    
        this.ScoreText.setFill('green');
        if (!this.successSound){
            this.successSound = this.sound.add('success'); 
            this.successSound.play(); 
        }
        const successText = this.add.text(400, 250, 'FULL FRONTAL LOBE!', {
            fontFamily: 'RetroFont',
            fontSize: '32px',
            fill: '#76ea7c'
        }).setOrigin(0.5);
        successText.setDepth(11);
        setTimeout(() => {
            this.score = 0; 
            this.successSound = null; 
            this.music.stop(); 
            this.music = null; 
            this.scene.stop('Level4');
            this.scene.start('FinalScreen');
        }, 4000); 
    }
    
    gameOver(){
        this.ScoreText.setFill('red');
        this.player.setVelocity(0);
        if (this.brainCells) {
            for (const brainCell of this.brainCells) {
                if (brainCell) {
                    brainCell.setVelocity(0);
                }
            }
        }
        if (this.drugs) {
            for (const drug of this.drugs) {
                if (drug) {
                    drug.setVelocity(0);
                }
            }
        }
        if (!this.gameOverSound){
        this.gameOverSound = this.sound.add('gameOver'); 
        this.gameOverSound.play();
        }
        const gameOverText = this.add.text(400, 250, 'NEGATIVE BRAIN CELLS!', {
            fontFamily: 'RetroFont',
            fontSize: '32px',
            fill: '#FF0000'
        }).setOrigin(0.5);
        gameOverText.setDepth(11);
        setTimeout(() => {
            this.score = 0; 
            this.gameOverSound = null ; 
            this.music.stop(); 
            this.music = null; 
            this.scene.stop('Level4');
            this.scene.start('GameOver');
        }, 3000); 
    }
}

export default Level4; 
