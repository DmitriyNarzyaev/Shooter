import { Container, Sprite } from "pixi.js";

export class Monster extends Container implements ICollision {
    private _monster:PIXI.Sprite;
    public hitboxRadius:number = 50;
    public hitbox:PIXI.Graphics;
    public monsterSpeed:number = 1.2;
    public readonly radius:number = 170;

	constructor(monsterType:string) {
		super();
        this.initialMonster(monsterType);
    }

    private initialMonster(monsterType:string):void {
        const monsterXCorrector:number = 100;
        const monsterYCorrector:number = 170;

        this._monster = Sprite.from(monsterType);
        this._monster.x -= monsterXCorrector;
        this._monster.y -= monsterYCorrector;
        this.addChild(this._monster);

        // const testBG:PIXI.Graphics = new PIXI.Graphics;
		// testBG.beginFill(0x442200, .5);
		// testBG.drawRect(0, 0, this.width, this.height);
		// this.addChild(testBG);
    }
}
