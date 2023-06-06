import Entity from "../../Entity.js";

export default class BossGun extends Entity{

    #target;
    #bulletFactory;
    #timeCounter = 0;
    #health = 5;

    type = "enemy";
    
    constructor(view, target, bulletFactory){
        super(view);

        this.#target = target;
        this.#bulletFactory = bulletFactory;

        this.isActive = false;
    }

    update(){
        if (this.#target.isDead){
            return;
        }

        if(!this.isActive){
            if(this.x - this.#target.x < 512 + this.collisionBox.width*2){
                this.isActive = true;
            }
            return;
        }

        this.#fire();
    }

    damage(){
        this.#health--;

        if (this.#health < 1){
            this.#timeCounter = 0;
            const deadAnimation = this._view.showAndGetDeadAnimation();
            deadAnimation.onComplete = () => {
                this.dead();
            }
        }
    }

    #fire(){
        this.#timeCounter++;

        if(this.#timeCounter < 50 && Math.random() > 0.01){
            return;
        }

        const bulletContext = {};
        bulletContext.x = this.x;
        bulletContext.y = this.y;
        bulletContext.angle = 180;
        bulletContext.type = "enemyBullet";

        this.#bulletFactory.createBossBullet(bulletContext);

        this.#timeCounter = 0;
    }
}