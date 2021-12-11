import { Container, Sprite } from "pixi.js";

export class Player extends Container {
    private _player:PIXI.Sprite;
    public hitboxRadius:number = 50;
    public hitbox:PIXI.Graphics;
    public playerSpeed:number = 2.5;

	constructor(playerType:string) {
		super();
        this.initialPlayer(playerType);
    }

    private initialPlayer(playerType:string):void {
        this._player = Sprite.from(playerType);
        this.addChild(this._player);

        let hitboxGapX:number = 35;
        let hitboxGapY:number = 30;
        this.hitbox = new PIXI.Graphics;
        this.hitbox
            .beginFill(0xff4499, .3)
            .drawCircle(0, 0, 50);
        this.hitbox.x = this.hitboxRadius + hitboxGapX;
        this.hitbox.y = this.hitboxRadius + hitboxGapY;
        this.addChild(this.hitbox);
    }
}
