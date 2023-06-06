import Entity from "../../Entity.js";

export default class Boss extends Entity{

    #health = 5;

    type = "enemy";
    isBoss = true;

    constructor(view){
        super(view);

        this.isActive = true;
    }

    update(){

    }

    damage(){
        this.#health--;

        if(this.#health < 1){
            this.isActive = false;

            const deadAnimation = this._view.showAndGetDeadAnimation();
            deadAnimation.onComplete = () => {
                this._view.showAdditionalExplosions();
                deadAnimation.removeFromParent();
            }
        }
    }
}