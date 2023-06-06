import { Text, TextStyle } from "../lib/pixi.mjs";
import Camera from "./Camera.js";
import BulletFactory from "./Entities/Bullets/BulletFactory.js";
import EnemiesFactory from "./Entities/Enemies/EnemiesFactory.js";
import HeroFactory from "./Entities/Hero/HeroFactory.js";
import PlatformFactory from "./Entities/Platforms/PlatformFactory.js";
import PowerupsFactory from "./Entities/Powerups/PowerupsFactory.js";
import KeyboardProcessor from "./KeyboardProcessor.js";
import Physics from "./Physics.js";
import SceneFactory from "./SceneFactory.js";
import StaticBackground from "./StaticBackground.js";
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
    #isEndGame = false;

    keyboardProcessor;

    constructor(pixiApp, assets) {
        this.#pixiApp = pixiApp;

        this.#worldContainer = new World();
        this.#pixiApp.stage.addChild(new StaticBackground(this.#pixiApp.screen, assets));
        this.#pixiApp.stage.addChild(this.#worldContainer);

        this.#bulletFactory = new BulletFactory(this.#worldContainer.game, this.#entities);

        const heroFactory = new HeroFactory(this.#worldContainer.game, assets);
        this.#hero = heroFactory.create(160, 100);

        this.#entities.push(this.#hero);

        const enemyFactory = new EnemiesFactory(this.#worldContainer.game, this.#hero, this.#bulletFactory, this.#entities, assets);

        const platformFactory = new PlatformFactory(this.#worldContainer, assets);

        const powerupFactory = new PowerupsFactory(this.#entities, assets, this.#worldContainer.game, this.#hero);

        const sceneFactory = new SceneFactory(this.#platforms, this.#entities, platformFactory, enemyFactory, this.#hero, powerupFactory);
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

            if(entity.type == "hero" || entity.type == "enemy" || entity.type == "powerupBox" || entity.type == "spreadgunPowerup"){
                this.#checkDamage(entity);
                this.#checkPlatforms(entity);
            }

            this.#checkEntityStatus(entity, i);
        }

        this.#camera.update();
        this.#weapon.update(this.#hero.bulletContext);

        this.#checkGameStatus();
    }

    #checkGameStatus(){

        if(this.#isEndGame){
            return;
        }

        const isBossDead = this.#entities.some(e => e.isBoss && !e.isActive);
        if(isBossDead){
            const enemies = this.#entities.filter(e => e.type == "enemy" && !e.isBoss);
            enemies.forEach(e => e.dead());
            this.#isEndGame = true;
            this.#showEndGame();
        }

        const isHeroDead = !this.#entities.some(e => e.type == "hero") && this.#hero.isDead;
        if(isHeroDead){
            this.#entities.push(this.#hero);
            this.#worldContainer.game.addChild(this.#hero._view);
            this.#hero.reset();
            this.#hero.x = -this.#worldContainer.x + 160;
            this.#hero.y = 100;
            this.#weapon.setWeapon(1);
        }
    }

    #showEndGame(){
        const style = new TextStyle({
            fontFamily: "Impact",
            fontSize: 50,
            fill: [0xffffff, 0xdd0000],
            stroke: 0x000000,
            strokeThickness: 5,
            letterSpacing: 30,
        })

        const text = new Text("STAGE CLEAR", style);
        text.x = this.#pixiApp.screen.width/2 - text.width/2;
        text.y = this.#pixiApp.screen.height/2 - text.height/2;

        this.#pixiApp.stage.addChild(text);
    }

    #checkDamage(entity){
        const damagers = this.#entities.filter(damager => ((entity.type == "enemy" || entity.type == "powerupBox") && damager.type == "heroBullet")
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

        const powerups = this.#entities.filter(powerup => powerup.type == "spreadgunPowerup" && entity.type == "hero");
        for(let powerup of powerups){
            if(Physics.isCheckAABB(powerup.hitBox, entity.hitBox)){
                powerup.damage();
                this.#weapon.setWeapon(powerup.powerupType);
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
        if (collisionResult.horizontal == true && platform.type == "box" && !character.isForbiddenHorizontalCollision) {
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
                const bullets = this.#entities.filter(bullet => bullet.type == this.#hero.bulletContext.type);
                if(bullets.length > 10){
                    return;
                }
                this.#weapon.startFire();
                this.#hero.setView(this.getArrowButtonContext());
            }
        }
        this.keyboardProcessor.getButton("KeyA").executeUp = function () {
            if(!this.#hero.isDead && !this.#hero.isFall){
                this.#weapon.stopFire();
                this.#hero.setView(this.getArrowButtonContext());
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
        buttonContext.shoot = this.keyboardProcessor.isButtonPressed("KeyA");
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