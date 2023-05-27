import { Container, Graphics } from "../../../lib/pixi.mjs";

export default class BulletView extends Container{

    #collisionBox = {
        x:0,
        y:0,
        width:0,
        height:0,
    }

    constructor(){
        super();

        this.#collisionBox.width = 5;
        this.#collisionBox.height = 5;
    }

    get collisionBox(){
        this.#collisionBox.x = this.x;
        this.#collisionBox.y = this.y;
        return this.#collisionBox;
    }

    get hitBox() {
        return this.collisionBox;
    }
}