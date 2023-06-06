import { AnimatedSprite, Container, Sprite } from "../../../../lib/pixi.mjs";

export default class BossGunView extends Container{

    #collisionBox = {
        x:0,
        y:0,
        width:0,
        height:0,
    }

    #assets;
    #view;

    constructor(assets){
        super();

        this.#assets = assets;

        const view = new Sprite(this.#assets.getTexture("bossgun0000"));
        view.scale.x = 1.4;
        view.scale.y = 1.4;

        this.addChild(view);

        this.#view = view;

        this.#collisionBox.width = 38;
        this.#collisionBox.height = 18;
    }

    get collisionBox(){
        this.#collisionBox.x = this.x - this.#collisionBox.width/2;
        this.#collisionBox.y = this.y - this.#collisionBox.height/2;
        return this.#collisionBox;
    }

    get hitBox() {
        return this.collisionBox;
    }

    showAndGetDeadAnimation(){
        this.#view.visible = false;
        this.#collisionBox.width = 0;
        this.#collisionBox.height = 0;

        const explosion = new AnimatedSprite(this.#assets.getAnimationTextures("explosion"));
        explosion.animationSpeed = 1/5;
        explosion.scale.x = 2;
        explosion.scale.y = 2;
        explosion.x = -explosion.width/2;
        explosion.y = -explosion.height/2;
        explosion.loop = false;
        explosion.play();
        this.addChild(explosion);

        return explosion;
    }
}