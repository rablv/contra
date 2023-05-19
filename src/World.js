import { Container } from "../lib/pixi.mjs";

export default class World extends Container{
    
    #background;
    #game;
    #foreground;

    constructor(){
        super();
        
        this.#background = new Container();
        this.addChild(this.#background);

        this.#game = new Container();
        this.addChild(this.#game);

        this.#foreground = new Container();
        this.addChild(this.#foreground);
    }

    get background(){
        return this.#background;
    }

    get game(){
        return this.#game;
    }

    get foreground(){
        return this.#foreground;
    }
}