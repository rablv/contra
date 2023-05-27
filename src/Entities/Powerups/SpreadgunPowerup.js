import Entity from "../Entity.js";

export default class SpreadgunPowerup extends Entity{

    #GRAVITY_FORCE = 0.2;
    #velocityX = 4;
    #velocityY = -5;

    type = "spreadgunPowerup";
    powerupType = 2;

    #prevPoint = {
        x:0,
        y:0,
    }

    constructor(view){
        super(view);

        this.gravitable = true;
    }

    get prevPoint(){
        return this.#prevPoint;
    }

    update(){
        this.#prevPoint.x = this.x;
        this.#prevPoint.y = this.y;

        this.#velocityX -= 0.05;
        if(this.#velocityX < 0){
            this.#velocityX = 0;
        }
        this.x += this.#velocityX;

        this.#velocityY += this.#GRAVITY_FORCE;
        this.y += this.#velocityY;
    }

    stay(platformY){
        this.#velocityX = 0;
        this.#velocityY = 0;

        this.y = platformY - this._view.collisionBox.height;
    }

    isJumpState(){
        return false;
    }
    
    damage(){
        this.dead();
    }
}