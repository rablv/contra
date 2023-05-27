import Powerup from "./Powerup.js";
import PowerupView from "./PowerupView.js";
import SpreadgunPowerup from "./SpreadgunPowerup.js";
import SpreadgunPowerupView from "./SpreadgunPowerupView.js";

export default class PowerupsFactory{

    #entities;
    #assets;
    #worldContainer;
    #target;

    constructor(entities, assets, worldContainer, target){
        this.#entities = entities;
        this.#assets = assets;
        this.#worldContainer = worldContainer;
        this.#target = target;
    }

    createPowerup(x, y){
        const view = new PowerupView(this.#assets);

        const powerup = new Powerup(this, view, y, this.#target);

        view.x = x;

        this.#worldContainer.addChild(view);
        this.#entities.push(powerup);
    }

    createSpreadGunPowerup(x, y){
        const view = new SpreadgunPowerupView(this.#assets);
        const powerup = new SpreadgunPowerup(view);

        powerup.x = x;
        powerup.y = y;

        this.#worldContainer.addChild(view);
        this.#entities.push(powerup);
    }
}