import Bullet from "./Bullet.js";
import BulletView from "./BulletView.js";

export default class BulletFactory{

    #worldContainer;
    #entities;

    constructor(worldContainer, entities){
        this.#worldContainer = worldContainer;
        this.#entities = entities;
    }

    createBullet(bulletContext){
        const view = new BulletView();
        this.#worldContainer.addChild(view);

        const bullet = new Bullet(view, bulletContext.angle);
        bullet.x = bulletContext.x;
        bullet.y = bulletContext.y;
        bullet.type = bulletContext.type;

        this.#entities.push(bullet);
    }
}