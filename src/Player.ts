import { Container, Point, Sprite } from "pixi.js";

export class Player extends Container implements ICollision {
    public playerSprite:PIXI.Sprite;
    public hitboxRadius:number = 50;
    public hitbox:PIXI.Graphics;
    public playerSpeed:number = 2.5;
    public readonly radius:number = 50;

	constructor(playerType:string) {
		super();
        this.initialPlayer(playerType);
    }

    private initialPlayer(playerType:string):void {
        const playerXCorrector:number = 75;
        const playerYCorrector:number = 70;
        
        this.playerSprite = Sprite.from(playerType);
        this.playerSprite.x -= playerXCorrector;
        this.playerSprite.y -= playerYCorrector;
        this.addChild(this.playerSprite);

        const testBG:PIXI.Graphics = new PIXI.Graphics;
		testBG.beginFill(0x003344, .5);
		testBG.drawRect(0, 0, this.width, this.height);
		this.addChild(testBG);
    }

    public getShotSpawnPoint():Point {
        return new Point(235, 95);
    }
}
