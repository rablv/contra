import { AnimatedSprite, Container, Graphics, Sprite } from "../../../../lib/pixi.mjs";

export default class TourelleView extends Container{

    #gunView;

    #collisionBox = {
        x:0,
        y:0,
        width:0,
        height:0,
    }

    #assets;

    constructor(assets){
        super();

        this.#assets = assets;

        const view = new Sprite(this.#assets.getTexture("tourelle0000"));
        view.scale.x = 1.4;
        view.scale.y = 1.4;
        view.x -= view.width/2;
        view.y -= view.height/2;

        this.addChild(view);

        this.#gunView = new Sprite(this.#assets.getTexture("tourellegun0000"));
        this.#gunView.pivot.x = 22;
        this.#gunView.pivot.y = 19;
        this.#gunView.x = view.width/2 - 17;
        this.#gunView.y = view.width/2 - 15;

        this.#collisionBox.width = 128;
        this.#collisionBox.height = 128;
        
        view.addChild(this.#gunView);
    }

    get gunRotation(){
        return this.#gunView.rotation;
    }

    set gunRotation(value){
        this.#gunView.rotation = value;
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
        this.#gunView.visible = false;
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