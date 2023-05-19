import Game from "./Game.js"
import * as PIXI from "../lib/pixi.mjs"

const pixiApp = new PIXI.Application({
    width: 1024,
    height: 768,
});
const game = new Game(pixiApp);

document.body.appendChild(pixiApp.view);

document.addEventListener("keydown", (key) => game.keyboardProcessor.onKeyDown(key));
document.addEventListener("keyup", (key) => game.keyboardProcessor.onKeyUp(key));

pixiApp.ticker.add(game.update, game);