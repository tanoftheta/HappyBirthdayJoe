import Phaser from 'phaser'; 

class BonusLevel extends Phaser.Scene{
    constructor(){
        super('BonusLevel');
        this.movesLeft = 8;
        this.movesLeftText ; 
        this.pieces = []; 
        this.swaps = [];
        this.success = null;
        this.music = null ;
        this.gameOverSound = null; 
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
        for (let  i = 0 ; i < 9 ; i++){
            this.load.image(`joe${i+1}`, `${imagePath}joe${i+1}.png`);
        }
        this.load.audio('success', `${audioPath}soundEffects/success.wav`);
        this.load.audio('happybirthday', `${audioPath}hbd_spongebob.wav`);
        this.load.audio('draw', `${audioPath}soundEffects/cardDraw.mp3`);
        this.load.audio('gameOver', `${audioPath}soundEffects/gameOver.wav`); 
    }

    create(){
        if (!this.music) {
            this.music = this.sound.add('happybirthday', {loop:true});
            this.music.play();
        }

        this.movesLeftText = this.add.text(50, 50, `moves left: ${this.movesLeft}`, {
            fontFamily: 'RetroFont', 
            fill: '#FFF',
            fontSize: '20px', 
        })

        let tempPieces = []; 

        // Create and position the pieces in a 3x3 grid
        for (let i = 0; i < 9; i++){
            // Calculate the row and column index
            const row = Math.floor(i / 3);
            const col = i % 3;
    
            // Calculate the position for each piece based on row and column index
            const x = col * 110 + 300; // 100 is the horizontal spacing between pieces, 50 is half the width of each piece
            const y = row * 150 + 100; // 100 is the vertical spacing between pieces, 50 is half the height of each piece
    
            // Create and add the piece to the scene
            let piece = this.add.sprite(x, y, `joe${i+1}`).setScale(0.4);
            tempPieces.push(piece);

        }

        Phaser.Utils.Array.Shuffle(tempPieces);
        this.pieces = tempPieces; 

        for (let i = 0; i < this.pieces.length; i++) {
            // Calculate the row and column index
            const row = Math.floor(i / 3);
            const col = i % 3;
    
            const x = col * 110 + 300; 
            const y = row * 150 + 100; 
    

            this.pieces[i].setPosition(x, y);
            this.pieces[i].setInteractive();
        }
        this.input.on('pointerdown', (pointer) => {
            for (let i = 0; i < this.pieces.length; i++) {
                const piece = this.pieces[i];
    
                if (piece.getBounds().contains(pointer.x, pointer.y)) {
                    this.swaps.push(i); 
                    if (this.swaps.length === 2) {
                        this.handleSwaps();
                    }
                    break; 
                }
            }
        });
    

    }

    update(){

        if (this.movesLeft <= 0){
            this.gameOver();
        }
        this.movesLeftText.setText(`moves left: ${this.movesLeft}`); 
        const expectedTextureKeys = [
            'joe1', 'joe2', 'joe3', 
            'joe4', 'joe5', 'joe6', 
            'joe7', 'joe8', 'joe9'
        ];


        let allPiecesCorrectlyPlaced = true;
        for (let i = 0; i < this.pieces.length; i++) {
            const piece = this.pieces[i];
            const expectedTextureKey = expectedTextureKeys[i];
            if (piece.texture.key !== expectedTextureKey) {
                allPiecesCorrectlyPlaced = false;
                break;
            }
        }

        if (allPiecesCorrectlyPlaced) {
            this.gameWon();
        }

    }
    
    handleSwaps() {
        const tempX = this.pieces[this.swaps[0]].x;
        const tempY = this.pieces[this.swaps[0]].y;
        this.pieces[this.swaps[0]].setPosition(this.pieces[this.swaps[1]].x, this.pieces[this.swaps[1]].y);
        this.pieces[this.swaps[1]].setPosition(tempX, tempY);

        [this.pieces[this.swaps[0]], this.pieces[this.swaps[1]]] = [this.pieces[this.swaps[1]], this.pieces[this.swaps[0]]];

        if (!this.sound.get('draw')) {
            const soundEffect = this.sound.add('draw');
            soundEffect.play();
            soundEffect.once('complete', () => {
                soundEffect.destroy();
            });
        this.swaps = [];
        this.movesLeft --; 
    }
    }
    gameWon(){
        if (!this.success) {
            this.success = this.sound.add('success'); 
            this.success.play();
        }

        
        const successText = this.add.text(400, 250, 'kapow!', {
            fontFamily: 'RetroFont',
            fontSize: '32px',
            fill: '#76ea7c',
            resolution: 10
        }).setOrigin(0.5);
        successText.setDepth(11);
        
        this.tweens.add({
            targets: successText, // The text object to animate
            scale: 1.2, // Scale up to 1.5 times its original size
            duration: 1000, // Duration of the tween in milliseconds
            ease: 'Linear', // Use linear easing for constant speed
            yoyo: true, // Yoyo effect makes the tween reverse, scaling back down
            repeat: 1 // Repeat once (total of two animations)
        });

        setTimeout(() => {
            this.movesLeft = 8;
            this.success = null 
            this.pieces = []; 
            this.swaps = []; 
            this.music.stop();
            this.music = null; 
            this.scene.stop('BonusLevel');
            this.scene.start('level2instructions');
        }, 3000); 
        
    }

    gameOver(){
        this.movesLeftText.setFill('#FF0000');

        if (!this.gameOverSound){
            this.gameOverSound = this.sound.add('gameOver'); 
            this.gameOverSound.play();
        }

        const gameOverText = this.add.text(400, 250, 'WHAT ABOUT UR CHINESE GENES ?!', {
            fontFamily: 'RetroFont',
            fontSize: '32px',
            fill: '#FF0000'
        }).setOrigin(0.5);
        gameOverText.setDepth(11);

        setTimeout(() => {
            this.movesLeft = 8;
            this.gameOverSound = null ;
            this.music.stop();
            this.pieces = []; 
            this.swaps = []; 
            this.music = null; 
            this.scene.stop('BonusLevel');
            this.scene.start('GameOver');
        }, 3000); 

    }

}

export default BonusLevel; 