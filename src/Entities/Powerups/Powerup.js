import Entity from "../Entity.js";

export default class Powerup extends Entity{

    #powerupFactory;
    #flyY;
    #target;

    type = "powerupBox";

    constructor(powerupFactory, view, flyY, target){
        super(view);

        this.#powerupFactory = powerupFactory;
        this.#flyY = flyY;
        this.#target = target;

        this.isActive = false;
        this._view.visible = false;
    }

    get collisionBox(){
        return this._view.collisionBox;
    }

    get x(){
        return this._view.x;
    }
    set x(value){
        this._view.x = value;
    }

    get y(){
        return this._view.y;
    }
    set y(value){
        this._view.y = value;
    }

    update(){
        if(!this.isActive){
            if(this.x - this.#target.x < -512 - this.collisionBox.width){
                this.isActive = true;
                this._view.visible = true;
            }
            return;
        }

        this.x += 4;
        this.y = this.#flyY + Math.sin(this.x * 0.02) * 50;
    }

    damage(){

        if(this.isActive == false){
            return;
        }

        this.#powerupFactory.createSpreadGunPowerup(this.x, this.y);
        this.dead();
    }
}