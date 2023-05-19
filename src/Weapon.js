export default class Weapon{

    #currentGunStrategy;
    #bulletFactory;

    constructor(bulletFactory){
        this.#bulletFactory = bulletFactory;

        this.#currentGunStrategy = this.#defaultGunStrategy;
    }

    setWeapon(type){
        switch(type){
            case 1: 
                this.#currentGunStrategy = this.#defaultGunStrategy;
                break;
            case 2: 
                this.#currentGunStrategy = this.#spreadGunStrategy;
                break;
        }
    }

    fire(bulletContext){
        this.#currentGunStrategy(bulletContext);
    }

    #defaultGunStrategy(bulletContext){
        this.#bulletFactory.createBullet(bulletContext);
    }

    #spreadGunStrategy(bulletContext){
        let angleShift = -20;
        for(let i=0; i<5; i++){
            const localBulletContext = {
                x: bulletContext.x,
                y: bulletContext.y,
                angle: bulletContext.angle + angleShift,
                type: bulletContext.type,
            }

            this.#bulletFactory.createBullet(localBulletContext);
            angleShift += 10;
        }
    }
}