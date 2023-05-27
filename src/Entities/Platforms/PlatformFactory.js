import { Graphics, Sprite } from "../../../lib/pixi.mjs";
import BridgePlatform from "./BridgePlatform.js";
import Platform from "./Platform.js";
import PlatformView from "./PlatformView.js";

export default class PlatformFactory{
   
    #platformWidth = 128;
    #platformHeight = 24;

    #worldContainer;
    #assets;

    constructor(worldContainer, assets){
        this.#worldContainer = worldContainer;
        this.#assets = assets;
    }

    createPlatform(x, y) {
        const skin =  this.#getGroundPlatform();
        const view = new PlatformView(this.#platformWidth, this.#platformHeight);
        view.addChild(skin);

        const platform = new Platform(view);
        platform.x = x;
        platform.y = y;
        this.#worldContainer.background.addChild(view);

        return platform;
    }

    createBox(x, y){
        const skin =  this.#getGroundPlatform();
        const view = new PlatformView(this.#platformWidth, this.#platformHeight);
        view.addChild(skin);

        const platform = new Platform(view);
        platform.x = x;
        platform.y = y;
        platform.type = "box";
        this.#worldContainer.background.addChild(view);

        return platform;
    }

    createStepBox(x, y){
        const box = this.createBox(x, y);
        box.isStep = true;

        return box;
    }

    createWater(x, y){
        const skin = new Graphics();
        skin.lineStyle(1, 0x0000ff);
        skin.beginFill(0x0000ff);
        skin.drawRect(0, -this.#platformHeight, this.#platformWidth, this.#platformHeight);
        skin.lineTo(this.#platformWidth, this.#platformHeight);

        const view = new PlatformView(this.#platformWidth, this.#platformHeight);
        view.addChild(skin);

        const platform = new Platform(view);
        platform.x = x;
        platform.y = y;
        platform.type = "box";
        this.#worldContainer.foreground.addChild(view);

        return platform;
    }

    createBossWall(x, y){
        const skin = new Sprite(this.#assets.getTexture("boss0000"));
        skin.scale.x = 1.5;
        skin.scale.y = 1.5;

        const view = new PlatformView(this.#platformWidth * 3, 768);
        view.addChild(skin);

        const platform = new Platform(view);
        platform.x = x-64;
        platform.y = y-45;
        platform.type = "box";
        this.#worldContainer.background.addChild(view);

        return platform;
    }

    createBridge(x, y){
        const skin = new Sprite(this.#assets.getTexture("bridge0000"));
        const view = new PlatformView(this.#platformWidth, this.#platformHeight);
        view.addChild(skin);

        const platform = new BridgePlatform(view);
        platform.x = x;
        platform.y = y;
        this.#worldContainer.background.addChild(view);

        return platform;
    }

    #getGroundPlatform(){
        const grass = new Sprite(this.#assets.getTexture("platform0000"));
        const ground = new Sprite(this.#assets.getTexture("ground0000"));
        ground.y = grass.height - 1;
        const ground2 = new Sprite(this.#assets.getTexture("ground0000"));
        ground2.y = grass.height*2 - 2;
        const ground3 = new Sprite(this.#assets.getTexture("ground0000"));
        ground3.y = grass.height*3 - 4;

        grass.addChild(ground);
        grass.addChild(ground2);
        grass.addChild(ground3);

        return grass;
    }
}