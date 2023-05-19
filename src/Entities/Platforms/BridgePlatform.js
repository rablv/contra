import Platform from "./Platform.js";

export default class BridgePlatform extends Platform{

    #target;

    constructor(view){
        super(view);
    }

    setTarget(target){
        this.#target = target;
    }

    update(){
        if(this.#target != null){
            if(this.x - this.#target.x < -50){
                this.isActive = false;
                this.dead();
            }
            return;
        }
    }
}