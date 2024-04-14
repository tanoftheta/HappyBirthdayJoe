import Phaser from 'phaser'; 

class Level3 extends Phaser.Scene {
    constructor() {
        super('level3');
        this.selectedCocktail; 
        this.success = null; 
        this.gameOverSound = null; 
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
        this.load.image('theBar', `${imagePath}thebar.PNG`);
        this.load.audio('success', `${audioPath}soundEffects/success.wav`)
        this.load.audio('gameOver', `${audioPath}soundEffects/gameOver.wav`)
        this.load.audio('hbd_irish', `${audioPath}hbd_irish.wav`);
    }

    create() {
        if (!this.music) {
            this.music = this.sound.add('hbd_irish', {loop:true});
            this.music.play();
        }
        this.add.image(0,0, 'theBar').setOrigin(0,0);
        const backgroundColor = this.add.rectangle(0, 225, 800, 150, 0xffffff).setOrigin(0,0);

        const cocktails = [
            {
                name: 'Negroni',
                ingredients: ['Gin', 'Vermouth', 'Campari']
            },
            {
                name: 'Margarita',
                ingredients: ['Tequila', 'Triple Sec', 'Lime Juice']
            },
            {
                name: 'Moscow Mule',
                ingredients: ['Vodka', 'Ginger Beer', 'Lime Juice']
            },
            {
                name: 'Dark and Stormy',
                ingredients: ['Rum', 'Ginger Beer', 'Lime Juice']
            },
            {
                name: 'Old Fashioned',
                ingredients: ['Whiskey', 'Sugar Cube', 'Angostura Bitters']
            },
            {
                name: 'Boulevardier',
                ingredients: ['Whiskey', 'Vermouth', 'Campari']
            }
        ];
        const randomIndex = Phaser.Math.Between(0, cocktails.length - 1);
        this.selectedCocktail = cocktails[randomIndex];
        this.add.text(400, 100, `${this.selectedCocktail.name}`, {fill: '#000'}).setOrigin(0.5);
        this.selectors = [];

        this.createSelector(100, 'Spirit', ['Gin', 'Vodka', 'Whiskey', 'Tequila', 'Rum']);
        this.createSelector(400, 'Sweetener', ['Ginger Beer', 'Triple Sec', 'Vermouth', 'Sugar Cube'])
        this.createSelector(700, 'Juice', ['Lime Juice', 'Angostura Bitters', 'Orange Juice', 'Campari']);

        // Add a 'create' button
        const createButtonBg = this.add.rectangle(400, 450, 200, 50, 0x90EE90).setOrigin(0.5).setStrokeStyle(2, 0x000000);
        const createButton = this.add.text(400, 450, 'CREATE', { fontSize: '30px', fill: '#FFFFFF' }).setOrigin(0.5);
        createButton.setInteractive();
        createButton.on('pointerdown', () => {
            this.checkSelections();
        });
        createButton.on('pointerover', () => {
            createButton.setFill('#ff0000'); // Change text color to red
            this.game.canvas.style.cursor = 'pointer'; // Change cursor style to pointer
            createButton.setScale(1.10); 
        });
        createButton.on('pointerout', () => {
            createButton.setFill('#FFFFFF'); // Restore original text color
            this.game.canvas.style.cursor = 'default'; // Restore original cursor style
            createButton.setScale(1.0); 
        });
    }

    createSelector(xPosition, label, items) {
        // Create a group for each selector
        const selectorGroup = this.add.group();
        const yPosition = 300; 
        this.selectors.push(selectorGroup);
    
        let selectedIndex = 0;
    
        // Add navigation buttons to cycle through the items
        const prevButton = this.add.text(xPosition, yPosition - 50, '↑', { fontSize: '30px', fill: '#000' }).setOrigin(0.5);
        prevButton.setInteractive();
        prevButton.on('pointerdown', () => {
            selectedIndex = (selectedIndex - 1 + items.length) % items.length;
            selectedText.setText(items[selectedIndex]);
        });
        selectorGroup.add(prevButton);
    
        const selectedText = this.add.text(xPosition, yPosition, items[selectedIndex], { fontSize: '20px', fill: '#000' }).setOrigin(0.5);
        selectorGroup.add(selectedText);
    
        const nextButton = this.add.text(xPosition, yPosition + 50, '↓', { fontSize: '30px', fill: '#000' }).setOrigin(0.5);
        nextButton.setInteractive();
        nextButton.on('pointerdown', () => {
            selectedIndex = (selectedIndex + 1) % items.length;
            selectedText.setText(items[selectedIndex]);
        });
        selectorGroup.add(nextButton);
    
    }
    

    checkSelections() {
        const spiritIndex = this.selectors[0].getChildren()[1].text;
        const sweetenerIndex = this.selectors[1].getChildren()[1].text;
        const juiceIndex = this.selectors[2].getChildren()[1].text;
        const selectedIngredients = [spiritIndex, sweetenerIndex, juiceIndex];
        console.log(selectedIngredients);
        // Check if spirit is 'Gin' and juice is 'Pineapple Juice'
        const isMatch = this.selectedCocktail.ingredients.every(ingredient => selectedIngredients.includes(ingredient));

        if (isMatch) {
            console.log('Correct! You made a', this.selectedCocktail.name);
            this.gameWon();
            // Add logic to handle correct selection
        } else {
            console.log('Incorrect ingredients for', this.selectedCocktail.name);
            this.gameOver();
            // Add logic to handle incorrect selection
        }
    }

    gameWon(){
        if (!this.success){
            this.input.setDefaultCursor('');
            this.success = this.sound.add('success'); 
            this.success.play();
            }
        const successText = this.add.text(400, 250, 'BARTENDER LEVEL 1000!', {
                fontFamily: 'RetroFont',
                fontSize: '50px',
                fill: '#76ea7c'
            }).setOrigin(0.5);
            successText.setDepth(11);

            setTimeout(() => {
                this.selectedCocktail = null;
                this.success= null; 
                this.music.stop(); 
                this.music = null ; 
                this.scene.stop('level3');
                this.scene.start('level4instructions');
            }, 3000); 
    }
    gameOver(){
        if (!this.gameOverSound){
            this.gameOverSound = this.sound.add('gameOver'); 
            this.gameOverSound.play();
            }
        const gameOverText = this.add.text(400, 250, `The right ingredients were: \n ${this.selectedCocktail.ingredients[0]} \n ${this.selectedCocktail.ingredients[1]} \n ${this.selectedCocktail.ingredients[2]} `, {
                fontFamily: 'RetroFont',
                fontSize: '32px',
                fill: '#FF0000'
            }).setOrigin(0.5);
            gameOverText.setDepth(11);

            setTimeout(() => {
                this.selectedCocktail = null; 
                this.gameOverSound = null ;
                this.music.stop();
                this.music = null; 
                this.scene.stop('level3');
                this.scene.start('GameOver');
            }, 3000); 
    }
}

export default Level3;
