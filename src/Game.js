import Camera from "./Camera.js";
import BulletFactory from "./Entities/Bullets/BulletFactory.js";
import EnemiesFactory from "./Entities/Enemies/EnemiesFactory.js";
import HeroFactory from "./Entities/Hero/HeroFactory.js";
import PlatformFactory from "./Entities/Platforms/PlatformFactory.js";
import KeyboardProcessor from "./KeyboardProcessor.js";
import Physics from "./Physics.js";
import SceneFactory from "./SceneFactory.js";
import Weapon from "./Weapon.js";
import World from "./World.js";

export default class Game {

    #pixiApp;
    #hero;
    #platforms = [];
    #entities = [];
    #camera;
    #bulletFactory;
    #runnerFactory;
    #worldContainer;
    #weapon;

    keyboardProcessor;

    constructor(pixiApp) {
        this.#pixiApp = pixiApp;

        this.#worldContainer = new World();
        this.#pixiApp.stage.addChild(this.#worldContainer);

        this.#bulletFactory = new BulletFactory(this.#worldContainer.game, this.#entities);

        const heroFactory = new HeroFactory(this.#worldContainer.game);
        this.#hero = heroFactory.create(160, 100);

        this.#entities.push(this.#hero);

        const enemyFactory = new EnemiesFactory(this.#worldContainer.game, this.#hero, this.#bulletFactory, this.#entities);

        const platformFactory = new PlatformFactory(this.#worldContainer);

        const sceneFactory = new SceneFactory(this.#platforms, this.#entities, platformFactory, enemyFactory, this.#hero);
        sceneFactory.createScene();

        this.keyboardProcessor = new KeyboardProcessor(this);
        this.setKeys();

        const cameraSettings = {
            target: this.#hero,
            world: this.#worldContainer,
            screenSize: this.#pixiApp.screen,
            maxWorldWidth: this.#worldContainer.width,
            isBackScrollX: false,
        }
        this.#camera = new Camera(cameraSettings);


        this.#weapon = new Weapon(this.#bulletFactory);
        this.#weapon.setWeapon(1);
    }

    update(){
        for(let i = 0; i < this.#entities.length; i++){
            const entity = this.#entities[i];
            entity.update();

            if(entity.type == "hero" || entity.type == "enemy"){
                this.#checkDamage(entity);
                this.#checkPlatforms(entity);
            }

            this.#checkEntityStatus(entity, i);
        }

        this.#camera.update();
    }

    #checkDamage(entity){
        const damagers = this.#entities.filter(damager => (entity.type == "enemy" && damager.type == "heroBullet")
                                                        ||(entity.type == "hero" && (damager.type == "enemyBullet" || damager.type == "enemy")));
        
        for (let damager of damagers){
            if(Physics.isCheckAABB(damager.hitBox, entity.hitBox)){
                entity.damage();
                if(damager.type != "enemy"){
                    damager.dead();
                }

                break;
            }
        }
    }

    #checkPlatforms(character){
        if(character.isDead || !character.gravitable){
            return;
        }

        for (let platform of this.#platforms){
            if(character.isJumpState() && platform.type != "box" || !platform.isActive){
                continue;
            }
            this.checkPlatfromCollision(character, platform)
        }

        if(character.type == "hero" && character.x < -this.#worldContainer.x){
            character.x = character.prevPoint.x;
        }
    }

    checkPlatfromCollision(character, platform) {

        const prevPoint = character.prevPoint;
        const collisionResult = Physics.getOrientCollisionResult(character.collisionBox, platform.collisionBox, prevPoint);

        if (collisionResult.vertical == true) {
            character.y = prevPoint.y;
            character.stay(platform.y);
        }
        if (collisionResult.horizontal == true && platform.type == "box") {
            if (platform.isStep) {
                character.stay(platform.y);
            }
            else {
                character.x = prevPoint.x;
            }
        }
    }

    setKeys() {

        this.keyboardProcessor.getButton("KeyA").executeDown = function () {
            if(!this.#hero.isDead && !this.#hero.isFall){
                this.#weapon.fire(this.#hero.bulletContext);
            }
        }

        this.keyboardProcessor.getButton("KeyS").executeDown = function () {
            if (this.keyboardProcessor.isButtonPressed("ArrowDown")
                && !(this.keyboardProcessor.isButtonPressed("ArrowLeft") || this.keyboardProcessor.isButtonPressed("ArrowRight"))) {
                this.#hero.throwDown();
            }
            else {
                this.#hero.jump();
            }
        };

        const arrowLeft = this.keyboardProcessor.getButton("ArrowLeft");
        arrowLeft.executeDown = function () {
            this.#hero.startLeftMove();
            this.#hero.setView(this.getArrowButtonContext());
        };
        arrowLeft.executeUp = function () {
            this.#hero.stopLeftMove();
            this.#hero.setView(this.getArrowButtonContext());
        };

        const arrowRight = this.keyboardProcessor.getButton("ArrowRight");
        arrowRight.executeDown = function () {
            this.#hero.startRightMove();
            this.#hero.setView(this.getArrowButtonContext());
        };
        arrowRight.executeUp = function () {
            this.#hero.stopRightMove();
            this.#hero.setView(this.getArrowButtonContext());
        };

        const arrowUp = this.keyboardProcessor.getButton("ArrowUp");
        arrowUp.executeDown = function () {
            this.#hero.setView(this.getArrowButtonContext());
        };
        arrowUp.executeUp = function () {
            this.#hero.setView(this.getArrowButtonContext());
        };

        const arrowDown = this.keyboardProcessor.getButton("ArrowDown")
        arrowDown.executeDown = function () {
            this.#hero.setView(this.getArrowButtonContext());
        };
        arrowDown.executeUp = function () {
            this.#hero.setView(this.getArrowButtonContext());
        };
    }

    getArrowButtonContext() {
        const buttonContext = {}
        buttonContext.arrowLeft = this.keyboardProcessor.isButtonPressed("ArrowLeft");
        buttonContext.arrowRight = this.keyboardProcessor.isButtonPressed("ArrowRight");
        buttonContext.arrowUp = this.keyboardProcessor.isButtonPressed("ArrowUp");
        buttonContext.arrowDown = this.keyboardProcessor.isButtonPressed("ArrowDown");
        return buttonContext;
    }

    #checkEntityStatus(entity, index){
        if(entity.isDead || this.#isScreenOut(entity)){
            entity.removeFromStage();
            this.#entities.splice(index, 1)
        }
    }

    #isScreenOut(entity) {
        if (entity.type == "heroBullet" || entity.type == "enemyBullet") {
            return (entity.x > (this.#pixiApp.screen.width - this.#worldContainer.x)
                || entity.x < (-this.#worldContainer.x)
                || entity.y > this.#pixiApp.screen.height
                || entity.y < 0);
        }
        else if (entity.type == "enemy" || entity.type == "hero") {
            return entity.x < (-this.#worldContainer.x) || entity.y > this.#pixiApp.screen.height;
        }
    }
}