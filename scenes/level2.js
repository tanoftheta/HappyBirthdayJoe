import Phaser from 'phaser';

class Level2 extends Phaser.Scene {
    constructor() {
        super('level2');
        this.cans = [];
        this.timedEvent; 
        this.remainingTime; 
        this.clockTime; 
        this.music = null;
        this.clockTicking;
    }

    preload() {
        let imagePath, audioPath; 
        if (process.env.NODE_ENV === 'development') {
            imagePath = '/assets/sprites/teenHouseParty/';
            audioPath = '/assets/music/';
        } else {
            imagePath = '/HappyBirthdayJoe/assets/sprites/teenHouseParty/';
            audioPath = '/HappyBirthdayJoe/assets/music/';
        }
        this.load.image('backgroundImage', `${imagePath}housePartyBG.PNG`);
        this.load.image('couch',`${imagePath}couch.PNG`); 
        this.load.image('clock', `${imagePath}clock.PNG`);
        this.load.image('chair', `${imagePath}chair.PNG`); 
        this.load.image('table', `${imagePath}table.PNG`);
        this.load.image('trash', `${imagePath}trash.PNG`);
        this.load.image('beerCan', `${imagePath}beerCan.PNG`);
        this.load.image('crushedCan', `${imagePath}crushedCan.PNG`);

        this.load.audio('housePartyMusic', `${audioPath}hbd_rock.wav`);
        this.load.audio('canFx', `${audioPath}soundEffects/canOpen.wav`)
        this.load.audio('alarm', `${audioPath}soundEffects/clockTicking.wav`)
        this.load.audio('clockTicking', `${audioPath}soundEffects/alarm.wav`)
        this.load.audio('success', `${audioPath}soundEffects/success.wav`)
        
    }

    create() {
        if (!this.music) {
            this.music = this.sound.add('housePartyMusic', {loop:true});
            this.music.play();
        }
        this.clockTicking = this.sound.add('clockTicking'); 
        this.clockTicking.play(); 
        this.music.play();
        this.add.image(0,0, 'backgroundImage').setOrigin(0,0);
        this.clock = this.add.image(400, 100, 'clock').setOrigin(0.5);
        this.clock.setScale(1.5); 
        this.clockTime = this.add.text(400, 95, '9:00', {
            fontFamily: 'Digital',
            fontSize: '50px',
            fill: '#000',
        }).setOrigin(0.5);

        this.couch = this.add.image(200,350, 'couch').setOrigin(0.5);
        this.couch.setDepth(1);  
        this.couch.setInteractive(); 
        this.chair = this.add.image(700, 350, 'chair').setOrigin(0.5);
        this.chair.setScale(2.4); 
        this.chair.setDepth(2);  
        this.chair.setInteractive(); 
        this.table = this.add.image(600, 350, 'table').setOrigin(0.5);
        this.table.setScale(2.4); 
        this.table.setDepth(3); 
        this.table.setInteractive(); 
        this.trash = this.add.image(450, 400, 'trash').setOrigin(0.5);
        this.trash.setDepth(4);
        this.trash.setInteractive(); 
        this.physics.add.existing(this.trash);
        this.trash.body.setAllowGravity(false); 

        const numberOfCans = Phaser.Math.Between(10, 20);

        // Add each can to the array as you create them
        for (let i = 0; i < numberOfCans; i++) {
            const x = Phaser.Math.Between(0, 800);
            const y = Phaser.Math.Between(250, 500);
        
            // Randomly choose between beerCan and crushedCan
            const canType = Phaser.Math.Between(0, 1) === 0 ? 'beerCan' : 'crushedCan';
        
            // Create the can at the random position
            const can = this.add.image(x, y, canType).setOrigin(0.5);
            const depth = Phaser.Math.Between(0, 3);
            can.setDepth(depth);
            can.setInteractive(); 
            this.physics.add.existing(can);

            can.body.setAllowGravity(false);
            // Add the can to the array
            this.cans.push(can);
        
        }
        this.physics.add.overlap(this.trash, this.cans, (trash, can) => {
            this.destroyObject(can); 
        });

        this.input.on('pointerdown', this.startDrag, this); 

        this.timedEvent = this.time.delayedCall(20000, this.gameOver, [], this);
    }
    update(){
        this.remainingTime = this.timedEvent.getElapsedSeconds(); 
        const formattedSeconds = Math.round(this.remainingTime) < 10 ? `0${Math.round(this.remainingTime)}` : Math.round(this.remainingTime);
        this.clockTime.setText(`9:${formattedSeconds}`);
    }
    startDrag(pointer, targets){
        this.input.off('pointerdown', this.startDrag, this);
        this.dragObject = targets[0];
        this.input.on('pointermove', this.doDrag, this);
        this.input.on('pointerup', this.stopDrag, this);
    }
    doDrag(pointer){
        this.dragObject.x = pointer.x;
        if (this.dragObject.texture.key === 'beerCan' || this.dragObject.texture.key === 'crushedCan') {
            this.dragObject.y = pointer.y;
        } 
    }
    stopDrag(){
        this.input.on('pointerdown', this.startDrag, this);
        this.input.off('pointermove', this.doDrag, this);
        this.input.off('pointerup', this.stopDrag, this)
    }
    destroyObject(object) {
        if (!this.sound.get('canFx')) {
            const soundEffect = this.sound.add('canFx');
            soundEffect.play();
            soundEffect.once('complete', () => {
                soundEffect.destroy();
            });
        }    
        object.setDepth(5); 
        this.tweens.add({
            targets: object,
            alpha: 0, // Fade out the object
            duration: 500, // Duration of the animation
            onComplete: () => {
                // Destroy the object after the animation completes
                object.destroy();
                this.cans = this.cans.filter(can => can !== object);
                if (this.cans.length === 0) {
                    this.onAllCansDestroyed();
                }
            }
        });
    }
    onAllCansDestroyed() {
        this.clockTicking.stop(); 
        const success = this.sound.add('success'); 
        success.play(); 


        const background = this.add.rectangle(400, 300, 500, 200, 0xffffff);
        background.setDepth(10); // Ensure it's above everything else
        background.setAlpha(0.7); // Adjust transparency if needed
    
        // Add the success message
        const successText = this.add.text(0, 0, 'Success!', {
            fontFamily: 'Arial',
            fontSize: '32px',
            fill: '#000000'
        }).setOrigin(0.5);
        successText.setDepth(11); // Ensure it's above the background
    
        const extraText = this.add.text(400, 350, 'Watch out for those nosey neighbors though...', {
            fontFamily: 'Arial',
            fontSize: '20px',
            fill: '#000000'
        }).setOrigin(0.5);
        extraText.setDepth(11); 

        // Center the success message and background
        Phaser.Display.Align.In.Center(successText, background);
        setTimeout(() => {
            this.music.stop(); 
            this.scene.stop('Level2');
            this.scene.start('GameOver');
        }, 5000); 
    
    }

    gameOver(){
        if (this.cans.length > 0 ){
            this.clockTicking.stop(); 
            this.clockTime.setFill('red'); 
            this.cans.forEach(can => {
                can.setDepth(5);
                const yellowCircle = this.add.circle(can.x, can.y, 40, 0xffff00);
                yellowCircle.setStrokeStyle(2, 0xffff00);
                yellowCircle.setDepth(4); 
                can.disableInteractive(); 
            });
            const alarm = this.sound.add('alarm');

            alarm.once('complete', () => {
                this.music.stop(); 
                this.scene.stop('Level2');
                this.scene.start('GameOver');
            });
            
            alarm.play();
        }
    }
    
}

export default Level2; 
