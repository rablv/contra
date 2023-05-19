import Entity from "../Entity.js";

export default class Platform extends Entity{
    constructor(view){
       super(view);

       this.isActive = true;
    }
}