import Hero from "./Hero.js";
import HeroView from "./HeroView.js";

export default class HeroFactory{
    #worldContainer;
    constructor(worldContainer){
        this.#worldContainer = worldContainer;
    }

    create(x, y){
        const heroView = new HeroView();
        this.#worldContainer.addChild(heroView);

        const hero = new Hero(heroView);
        hero.x = x;
        hero.y = y;

        return hero;
    }
}