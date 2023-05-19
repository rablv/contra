import Entity from "../Entity.js";

export default class extends Entity{

    #SPEED = 10;
    #angle;

    type;

    constructor(view, angle){
        super(view);

        this.#angle = angle * Math.PI / 180;
    }

    update(){
        this.x += this.#SPEED * Math.cos(this.#angle);
        this.y += this.#SPEED * Math.sin(this.#angle);
    }
}