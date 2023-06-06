import Bullet from "./Bullet.js";

export default class GravitableBullet extends Bullet{

    isForbiddenHorizontalCollision;

    #prevPoint = {
        x: 0,
        y: 0,
    };

    #velocityY = 0;
    #GRAVITY_FORCE = 0.2;

    constructor(view) {
        super(view);

        this.gravitable = true;
        this.isForbiddenHorizontalCollision = true;
    }


    get collisionBox() {
        return this._view.collisionBox;
    }

    get x() {
        return this._view.x;
    }
    set x(value) {
        this._view.x = value;
    }
    get y() {
        return this._view.y;
    }
    set y(value) {
        this._view.y = value;
    }

    get prevPoint() {
        return this.#prevPoint;
    }

    update() {
        this.#prevPoint.x = this.x;
        this.#prevPoint.y = this.y;

        this.x += this.speed;

        this.#velocityY += this.#GRAVITY_FORCE;
        this.y += this.#velocityY;
    }

    stay(platformY) {
        this.dead();
    }

    isJumpState() {
        return false;
    }
}