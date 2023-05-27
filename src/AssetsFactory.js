import { BaseTexture, Spritesheet, Assets } from "../lib/pixi.mjs";

export default class AssetsFactory{

    #spritesheet;

    constructor(){
        this.#spritesheet = new Spritesheet(
            BaseTexture.from("./assets/atlas.png"),
            Assets.cache.get("./assets/atlas.json").data);
        this.#spritesheet.parse();
    }

    getTexture(textureName){
        return this.#spritesheet.textures[textureName];
    }

    getAnimationTextures(animationName){
        return this.#spritesheet.animations[animationName];
    }
}