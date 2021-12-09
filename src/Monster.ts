import { Container, Sprite } from "pixi.js";

export class Monster extends Container {
    private _monster:PIXI.Sprite;
    public hitboxRadius:number = 50;
    public hitbox:PIXI.Graphics;
    public monsterSpeed:number = 1.2;

	constructor(monsterType:string) {
		super();
        this.initialMonster(monsterType);
    }

    private initialMonster(monsterType:string):void {
        this._monster = Sprite.from(monsterType);
        this.addChild(this._monster);

        this.hitbox = new PIXI.Graphics;
        this.hitbox
            .beginFill(0xff4499, .3)
            .drawCircle(0, 0, 170);
        this.hitbox.x = this._monster.width/2;
        this.hitbox.y = this._monster.height/2;
        this.addChild(this.hitbox);
    }
}
