import { Graphics } from "../../../lib/pixi.mjs";
import BridgePlatform from "./BridgePlatform.js";
import Platform from "./Platform.js";
import PlatformView from "./PlatformView.js";

export default class PlatformFactory{
   
    #platformWidth = 128;
    #platformHeight = 24;

    #worldContainer;
    constructor(worldContainer){
        this.#worldContainer = worldContainer;
    }

    createPlatform(x, y) {
        const skin = new Graphics();
        skin.lineStyle(1, 0x004220);
        skin.beginFill(0x00ff00);
        skin.drawRect(0, 0, this.#platformWidth, this.#platformHeight);
        skin.beginFill(0x694216);
        skin.drawRect(0, this.#platformHeight, this.#platformWidth, this.#platformHeight*20);

        const view = new PlatformView(this.#platformWidth, this.#platformHeight);
        view.addChild(skin);

        const platform = new Platform(view);
        platform.x = x;
        platform.y = y;
        this.#worldContainer.background.addChild(view);

        return platform;
    }

    createBox(x, y){
        const skin = new Graphics();
        skin.lineStyle(1, 0x004220);
        skin.beginFill(0x00ff00);
        skin.drawRect(0, 0, this.#platformWidth, this.#platformHeight);
        skin.lineTo(this.#platformWidth, this.#platformHeight);
        skin.beginFill(0x694216);
        skin.drawRect(0, this.#platformHeight, this.#platformWidth, this.#platformHeight*20);

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
        const skin = new Graphics();
        skin.lineStyle(1, 0x0000ff);
        skin.beginFill(0x0b1e0f2);
        skin.drawRect(0, 0, this.#platformWidth * 3, 600);
        skin.lineTo(this.#platformWidth * 3, 600);

        const view = new PlatformView(this.#platformWidth * 3, 768);
        view.addChild(skin);

        const platform = new Platform(view);
        platform.x = x;
        platform.y = y;
        platform.type = "box";
        this.#worldContainer.background.addChild(view);

        return platform;
    }

    createBridge(x, y){
        const skin = new Graphics();
        skin.lineStyle(1, 0x111111);
        skin.beginFill(0xffffff);
        skin.drawRect(0, 0, this.#platformWidth, this.#platformHeight * 3);

        const view = new PlatformView(this.#platformWidth, this.#platformHeight);
        view.addChild(skin);

        const platform = new BridgePlatform(view);
        platform.x = x;
        platform.y = y;
        this.#worldContainer.background.addChild(view);

        return platform;
    }
}