import './style.css'
import Phaser from 'phaser'
import React from 'react'; 
import { createRoot } from 'react-dom/client';
import TimeSince from './components/joesAge'; 
import Level1 from './scenes/level1';
import StartScreen from './scenes/startScreen';
import GameOver from './scenes/gameOver';

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
  scene: [StartScreen, Level1, GameOver]
}

const game = new Phaser.Game(config); 