import { AnimatedSprite, Container, Graphics, Sprite } from "../../../../lib/pixi.mjs";

export default class RunnerView extends Container {

    #bounds = {
        width: 0,
        height: 0,
    }
    #collisionBox = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    }
    #stm = {
        currentState: "default",
        states: {}
    }

    #rootNode;
    #assets;

    constructor(assets) {
        super();
        this.#assets = assets;

        this.#createNodeStructure();

        this.#rootNode.pivot.x = 10;
        this.#rootNode.x = 10;
        this.#bounds.width = 20;
        this.#bounds.height = 90;
        this.#collisionBox.width = this.#bounds.width;
        this.#collisionBox.height = this.#bounds.height;

        this.#stm.states.run = this.#getRunImage();
        this.#stm.states.jump = this.#getJumpImage();
        this.#stm.states.fall = this.#getFallImage();

        for (let key in this.#stm.states) {
            this.#rootNode.addChild(this.#stm.states[key])
        }
    }

    get collisionBox() {
        this.#collisionBox.x = this.x;
        this.#collisionBox.y = this.y;
        return this.#collisionBox;
    }

    get hitBox() {
        return this.collisionBox;
    }

    get isFliped(){
        return this.#rootNode.scale.x == -1;
    }

    showRun() {
        this.#toState("run");
    }

    showJump() {
        this.#toState("jump");
    }

    showFall() {
        this.#toState("fall");
    }

    flip(direction) {
        switch (direction) {
            case 1:
            case -1:
                this.#rootNode.scale.x = direction;
        }
    }

    showAndGetDeadAnimation(){
        this.#rootNode.visible = false;
        this.#collisionBox.width = 0;
        this.#collisionBox.height = 0;

        const explosion = new AnimatedSprite(this.#assets.getAnimationTextures("explosion"));
        explosion.animationSpeed = 1/5;
        explosion.x = -explosion.width/2;
        explosion.loop = false;
        explosion.play();
        this.addChild(explosion);

        return explosion;
    }

    #toState(key) {
        if (this.#stm.currentState == key) {
            return;
        }
        for (let key in this.#stm.states) {
            this.#stm.states[key].visible = false;
        }
        this.#stm.states[key].visible = true;
        this.#stm.currentState = key;
    }

    #createNodeStructure() {
        const rootNode = new Container();
        this.addChild(rootNode);
        this.#rootNode = rootNode;
    }

    #getRunImage() {
        const view = new AnimatedSprite(this.#assets.getAnimationTextures("runnerrun"));
        view.animationSpeed = 1 / 10;
        view.play();
        view.y += 2;
        return view;
    }

    #getJumpImage() {
        const view = new Sprite(this.#assets.getTexture("runnerjump0000"));
        return view;
    }

    #getFallImage() {
        const view = new Sprite(this.#assets.getTexture("runnerjump0000"));
        return view;
    }
}