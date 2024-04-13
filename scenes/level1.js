import Phaser from 'phaser';
import generateMaze from 'generate-maze';

class Level1 extends Phaser.Scene {
    constructor() {
        super('level1');
        this.walls = []; 
    }

    preload() {
    }

    create() {
        const mazeWidth = 10;
        const mazeHeight = 10;
        const tileSize = 50;

        const entryPoint = Phaser.Math.Between(0, mazeHeight-1);
        const exitPoint = Phaser.Math.Between(0, mazeHeight-1); 
        const maze = generateMaze(mazeWidth, mazeHeight);
        maze[entryPoint][0].left = false;
        maze[exitPoint][mazeWidth-1].right = false;
        console.log(maze);
        for (let i = 0; i < mazeHeight; i++) {
            for (let j = 0; j < mazeWidth; j++) {
                const cellX = j * tileSize + 150;
                const cellY = i * tileSize;
        
                if (maze[i][j].top) {
                    const wall = this.add.rectangle(cellX + tileSize / 2, cellY, tileSize, 2, 0xffffff);
                    this.walls.push(wall);
                }
                // If maze[i][j].bottom is true, add a white rectangle to the bottom of the cell
                if (maze[i][j].bottom) {
                    const wall = this.add.rectangle(cellX + tileSize / 2, cellY + tileSize, tileSize, 2, 0xffffff);
                    this.walls.push(wall);
                }
                // If maze[i][j].left is true, add a white rectangle to the left of the cell
                if (maze[i][j].left) {
                    const wall = this.add.rectangle(cellX, cellY + tileSize / 2, 2, tileSize, 0xffffff);
                    this.walls.push(wall);
                }
                // If maze[i][j].right is true, add a white rectangle to the right of the cell
                if (maze[i][j].right) {
                    const wall = this.add.rectangle(cellX + tileSize, cellY + tileSize / 2, 2, tileSize, 0xffffff);
                    this.walls.push(wall);
                }                  
            }
        }  
        this.walls.forEach(wall => {
            this.physics.add.existing(wall, true);
            
        });

        this.input.on('pointermove', pointer => {
            this.walls.forEach(wall => {
                if (Phaser.Geom.Rectangle.Contains(wall.getBounds(), pointer.x, pointer.y)) {
                    wall.setFillStyle(0xff0000);
                } else {
                    wall.setFillStyle(0xffffff);
                }
            });
        });
    }      
}

export default Level1; 
