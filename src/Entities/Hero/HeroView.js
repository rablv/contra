import { Container, Graphics } from "../../../lib/pixi.mjs";

export default class HeroView extends Container {

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
    #hitBox = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        shiftX: 0,
        shiftY: 0,
    }
    #stm = {
        currentState: "default",
        states: {}
    }

    #bulletPointShift = {
        x:0,
        y:0,
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

        this.#stm.states.stay = this.#getStayImage();
        this.#stm.states.stayUp = this.#getStayUpImage();
        this.#stm.states.run = this.#getRunImage();
        this.#stm.states.runUp = this.#getRunUpImage();
        this.#stm.states.runDown = this.#getRunDownImage();
        this.#stm.states.lay = this.#getLayImage();
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
        this.#hitBox.x = this.x + this.#hitBox.shiftX;
        this.#hitBox.y = this.y + this.#hitBox.shiftY;
        return this.#hitBox;
    }

    get isFliped(){
        return this.#rootNode.scale.x == -1;
    }

    get bulletPointShift(){
        return this.#bulletPointShift;
    }

    showStay() {
        this.#toState("stay");
        this.#setBulletPointShift(65, 30);

        this.#hitBox.width = 20;
        this.#hitBox.height = 90;
        this.#hitBox.shiftX = 0;
        this.#hitBox.shiftY = 0;
    }

    showStayUp() {
        this.#toState("stayUp");
        this.#setBulletPointShift(-2, -40);

        this.#hitBox.width = 20;
        this.#hitBox.height = 90;
        this.#hitBox.shiftX = 0;
        this.#hitBox.shiftY = 0;
    }

    showRun() {
        this.#toState("run");
        this.#setBulletPointShift(65, 30);

        this.#hitBox.width = 20;
        this.#hitBox.height = 90;
        this.#hitBox.shiftX = 0;
        this.#hitBox.shiftY = 0;
    }

    showRunUp() {
        this.#toState("runUp");
        this.#setBulletPointShift(40, -20);

        this.#hitBox.width = 20;
        this.#hitBox.height = 90;
        this.#hitBox.shiftX = 0;
        this.#hitBox.shiftY = 0;
    }

    showRunDown() {
        this.#toState("runDown");
        this.#setBulletPointShift(20, 55);

        this.#hitBox.width = 20;
        this.#hitBox.height = 90;
        this.#hitBox.shiftX = 0;
        this.#hitBox.shiftY = 0;
    }

    showLay() {
        this.#toState("lay");
        this.#setBulletPointShift(65, 70);

        this.#hitBox.width = 90;
        this.#hitBox.height = 20;
        this.#hitBox.shiftX = -45;
        this.#hitBox.shiftY = 70;
    }

    showJump() {
        this.#toState("jump");
        this.#setBulletPointShift(-2, 40);

        this.#hitBox.width = 40;
        this.#hitBox.height = 40;
        this.#hitBox.shiftX = -10;
        this.#hitBox.shiftY = 25;
    }

    showFall() {
        this.#toState("fall");

        this.#hitBox.width = 20;
        this.#hitBox.height = 90;
        this.#hitBox.shiftX = 0;
        this.#hitBox.shiftY = 0;
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

    #setBulletPointShift(x, y){
        this.#bulletPointShift.x = (x + this.#rootNode.pivot.x * this.#rootNode.scale.x) * this.#rootNode.scale.x;
        this.#bulletPointShift.y = y;
    }

    #getStayImage() {
        const view = new Graphics();
        view.lineStyle(2, 0xffff00);
        view.drawRect(0, 0, 20, 90);
        view.drawRect(0, 30, 70, 5);
        return view;
    }

    #getStayUpImage() {
        const view = new Graphics();
        view.lineStyle(2, 0xffff00);
        view.drawRect(0, 0, 20, 90);
        view.drawRect(8, -40, 5, 40);
        return view;
    }

    #getRunImage() {
        const view = new Graphics();
        view.lineStyle(2, 0xffff00);
        view.drawRect(0, 0, 20, 90);
        view.drawRect(0, 30, 70, 5);
        view.transform.skew.x = -0.1;
        return view;
    }

    #getRunUpImage() {
        const view = new Graphics();
        view.lineStyle(2, 0xffff00);
        view.drawRect(0, 0, 20, 90);
        view.lineTo(0, 30);
        view.lineTo(40, -20);
        view.lineTo(45, -15);
        view.lineTo(0, 40);
        view.transform.skew.x = -0.1;
        return view;
    }

    #getRunDownImage() {
        const view = new Graphics();
        view.lineStyle(2, 0xffff00);
        view.drawRect(0, 0, 20, 90);
        view.lineTo(0, 20);
        view.lineTo(40, 60);
        view.lineTo(35, 65);
        view.lineTo(0, 30);
        view.transform.skew.x = -0.1;
        return view;
    }

    #getLayImage() {
        const view = new Graphics();
        view.lineStyle(2, 0xffff00);
        view.drawRect(0, 0, 90, 20);
        view.drawRect(90, 0, 40, 5);
        view.x -= 45;
        view.y += 70;
        return view;
    }

    #getJumpImage() {
        const view = new Graphics();
        view.lineStyle(2, 0xffff00);
        view.drawRect(0, 0, 40, 40);
        view.x -= 10;
        view.y += 25;
        return view;
    }

    #getFallImage() {
        const view = new Graphics();
        view.lineStyle(2, 0xffff00);
        view.drawRect(0, 0, 20, 90);
        view.drawRect(10, 20, 5, 60);
        view.transform.skew.x = -0.1;
        return view;
    }
}