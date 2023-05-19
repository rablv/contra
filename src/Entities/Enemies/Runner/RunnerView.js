import { Container, Graphics } from "../../../../lib/pixi.mjs";

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

    constructor() {
        super();
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
        const view = new Graphics();
        view.lineStyle(2, 0xff0000);
        view.drawRect(0, 0, 20, 90);
        view.transform.skew.x = -0.1;
        return view;
    }

    #getJumpImage() {
        const view = new Graphics();
        view.lineStyle(2, 0xff0000);
        view.drawRect(0, 0, 40, 40);
        view.x -= 10;
        view.y += 25;
        return view;
    }

    #getFallImage() {
        const view = new Graphics();
        view.lineStyle(2, 0xff0000);
        view.drawRect(0, 0, 20, 90);
        view.drawRect(10, 20, 5, 60);
        view.transform.skew.x = -0.1;
        return view;
    }
}