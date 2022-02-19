import { Sprite } from "pixi.js";
import Container = PIXI.Container;

export class Shot extends Container implements ICollision {
    private _shot:PIXI.Sprite;
	public radius:number = 4;
    public gunRotationSave:number = 0;
    public shotSpeed:number = 20;

	constructor(rotation:number, shotType:string) {
        super();
        this.gunRotationSave = rotation;
        this.initialShot(shotType);
	}

    private initialShot(shotType:string):void {
        this._shot = Sprite.from(shotType);
        const monsterXCorrector:number = this._shot.width/2;
        const monsterYCorrector:number = this._shot.height/2;
        this._shot.x -= monsterXCorrector;
        this._shot.y -= monsterYCorrector;
        this.addChild(this._shot);
    }
}