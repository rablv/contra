import { Graphics } from "../../../lib/pixi.mjs";
import Bullet from "./Bullet.js";
import BulletView from "./BulletView.js";
import GravitableBullet from "./GravitableBullet.js";

export default class BulletFactory{

    #worldContainer;
    #entities;

    constructor(worldContainer, entities){
        this.#worldContainer = worldContainer;
        this.#entities = entities;
    }

    createBullet(bulletContext){

        const skin = new Graphics();
        skin.beginFill(0xffffff);
        skin.drawRect(0,0,5,5);

        const view = new BulletView();
        view.addChild(skin);

        this.#worldContainer.addChild(view);

        const bullet = new Bullet(view, bulletContext.angle);
        bullet.x = bulletContext.x;
        bullet.y = bulletContext.y;
        bullet.type = bulletContext.type;
        bullet.speed = 10;

        this.#entities.push(bullet);
    }

    createSpreadGunBullet(bulletContext){

        const skin = new Graphics();
        skin.beginFill(0xff2222);
        skin.drawCircle(0,0,6);
        skin.beginFill(0xdddddd);
        skin.drawCircle(-3,-3, 3);

        const view = new BulletView();
        view.addChild(skin);

        this.#worldContainer.addChild(view);

        const bullet = new Bullet(view, bulletContext.angle);
        bullet.x = bulletContext.x;
        bullet.y = bulletContext.y;
        bullet.type = bulletContext.type;
        bullet.speed = 7;


        this.#entities.push(bullet);
    }

    createBossBullet(bulletContext){
        const skin = new Graphics();
        skin.beginFill(0xff2222);
        skin.drawCircle(0,0,6);
        skin.beginFill(0xdddddd);
        skin.drawCircle(-3,-3, 3);

        const view = new BulletView();
        view.addChild(skin);

        this.#worldContainer.addChild(view);

        const bullet = new GravitableBullet(view);
        bullet.x = bulletContext.x;
        bullet.y = bulletContext.y;
        bullet.type = bulletContext.type;
        bullet.speed = Math.random() * -6 -2;

        this.#entities.push(bullet);
    }
}