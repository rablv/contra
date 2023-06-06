import { AnimatedSprite } from "../../../lib/pixi.mjs";
import Platform from "./Platform.js";

export default class BridgePlatform extends Platform{

    #target;
    #assets;

    constructor(view, assets){
        super(view);

        this.#assets = assets;
    }

    setTarget(target){
        this.#target = target;
    }

    update(){
        if(this.#target != null){
            if(this.x - this.#target.x < -50 && this.isActive){
                this.isActive = false;
                const deadAnimation = this.#showAndGetDeadAnimation();
                deadAnimation.onComplete = () => {
                    this.dead();
                }
            }
            return;
        }
    }

    #showAndGetDeadAnimation(){
        const explosion = new AnimatedSprite(this.#assets.getAnimationTextures("explosion"));
        explosion.animationSpeed = 1/5;
        explosion.scale.x = 1.5;
        explosion.scale.y = 1.5;
        explosion.x -= 10;
        explosion.loop = false;
        explosion.play();
        this._view.addChild(explosion);

        return explosion;
    }
}