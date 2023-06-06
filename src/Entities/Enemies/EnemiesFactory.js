import RunnerView from "./Runner/RunnerView.js";
import TourelleView from "./Tourelle/TourelleView.js";
import Runner from "./Runner/Runner.js";
import Tourelle from "./Tourelle/Tourelle.js";
import BossView from "./Boss/BossView.js";
import Boss from "./Boss/Boss.js";
import BossGunView from "./Boss/BossGunView.js";
import BossGun from "./Boss/BossGun.js";

export default class EnemiesFactory{
    #worldContainer;
    #target;
    #bulletFactory;
    #entities;
    #assets;

    constructor(worldContainer, target, bulletFactory, entities, assets){
        this.#worldContainer = worldContainer;
        this.#target = target;
        this.#bulletFactory = bulletFactory;
        this.#entities = entities;
        this.#assets = assets;
    }

    createRunner(x, y){
        const view = new RunnerView(this.#assets);
        this.#worldContainer.addChild(view);

        const runner = new Runner(view, this.#target);
        runner.x = x;
        runner.y = y;

        this.#entities.push(runner);

        return runner;
    }

    createTourelle(x, y){
        const view = new TourelleView(this.#assets);
        this.#worldContainer.addChild(view);

        const tourelle = new Tourelle(view, this.#target, this.#bulletFactory);
        tourelle.x = x;
        tourelle.y = y;

        this.#entities.push(tourelle);

        return tourelle;
    }

    createBoss(x, y){
        const view = new BossView(this.#assets);
        this.#worldContainer.addChild(view);

        const boss = new Boss(view);
        boss.x = x - 35;
        boss.y = y + 95;

        this.#entities.push(boss);

        const gun1 = this.#createBossGun();
        gun1.x = x - 56;
        gun1.y = y;

        const gun2 = this.#createBossGun();
        gun2.x = x + 34;
        gun2.y = y;

        return boss;
    }
    
    #createBossGun(){
        const gunView = new BossGunView(this.#assets);
        this.#worldContainer.addChild(gunView);
        const bossGun = new BossGun(gunView, this.#target, this.#bulletFactory);
        this.#entities.push(bossGun);
        return bossGun;
    }
}