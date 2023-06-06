import { Container, Graphics, Sprite } from "../lib/pixi.mjs";

export default class StaticBackground extends Container{
    constructor(screenSize, assets){
        super();

        this.#createMounts(assets, 600, 250, 1.3);
        this.#createMounts(assets, 820, 230, 1.6);

        for(let i=0; i<300; i++){
            const star = this.#createStar();
            star.x = Math.random() * screenSize.width;
            star.y = Math.random() * screenSize.height;
        }

        const water = new Graphics();
        water.beginFill(0x0072ec);
        water.drawRect(0, screenSize.height/2+130, screenSize.width, screenSize.height);
        this.addChild(water);
    }

    #createStar(){
        const star = new Graphics();
        star.beginFill(0xdddddd);
        star.drawRect(0,0,2,2);
        this.addChild(star);

        return star;
    }

    #createMounts(assets, x, y, scale){
        const mounts = new Sprite(assets.getTexture("mounts0000"));
        mounts.scale.x = scale;
        mounts.scale.y = scale;
        mounts.x = x;
        mounts.y = y;
        this.addChild(mounts);
    }
}