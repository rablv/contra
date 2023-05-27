import { Container, Sprite } from "../../../lib/pixi.mjs";

export default class PowerupView extends Container{

    #collisionBox = {
        x:0,
        y:0,
        width:0,
        height:0,
    }

    constructor(assets){
        super();

        const view = new Sprite(assets.getTexture("powerup0000"));
        this.addChild(view);

        this.#collisionBox.width = 50;
        this.#collisionBox.height = 20;
    }

    get collisionBox(){
        this.#collisionBox.x = this.x;
        this.#collisionBox.y = this.y;
        return this.#collisionBox;
    }

    get hitBox(){
        return this.collisionBox;
    }
}