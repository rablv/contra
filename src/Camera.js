export default class Camera {

    #target;
    #world;
    #isBackScrollX;
    #centerScreenPointX;
    #rightBorderWorldPointX;
    #lastTargetX = 0;

    constructor(cameraSettings){
        this.#target = cameraSettings.target;
        this.#world = cameraSettings.world;
        this.#isBackScrollX = cameraSettings.isBackScrollX;

        this.#centerScreenPointX = cameraSettings.screenSize.width / 2;
        this.#rightBorderWorldPointX = this.#world.width - this.#centerScreenPointX;
    }

    update(){
        if(this.#target.x > this.#centerScreenPointX 
            && this.#target.x < this.#rightBorderWorldPointX
            && (this.#isBackScrollX || this.#target.x > this.#lastTargetX)){
            this.#world.x = this.#centerScreenPointX - this.#target.x;
            this.#lastTargetX = this.#target.x;
        }
    }
}