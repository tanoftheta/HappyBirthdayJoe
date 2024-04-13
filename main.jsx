import './style.css'
import Phaser from 'phaser'
import React from 'react'; 
import { createRoot } from 'react-dom/client';
import TimeSince from './components/joesAge'; 
import Level1 from './scenes/level1';
import Level2instructions from './scenes/instructions/level2instructions';
import Level2 from './scenes/level2';
import StartScreen from './scenes/startScreen';
import GameOver from './scenes/gameOver';
import FinalScreen from './scenes/finalScreen';
import Level4instructions from './scenes/instructions/level4instructions'
import Level4 from './scenes/level4';
import Level1instructions from './scenes/instructions/level1instructions';

const rootElement = document.getElementById('header');
const root = createRoot(rootElement);
root.render(<TimeSince />);

const sizes = {
  width: 800, 
  height: 500
}
const speedDown = 300

const config = {
  type: Phaser.WEBGL, 
  width: sizes.width, 
  height: sizes.height,
  canvas: gameCanvas,
  physics: {
    default: 'arcade',
    arcade: {
      gravity:{y:speedDown},
      debug: false
    }
  },
  scene: [StartScreen, Level1instructions, Level1, Level2instructions, Level2, Level4instructions, Level4, GameOver, FinalScreen]
}

const game = new Phaser.Game(config); 