import Container = PIXI.Container;

export default class Shot extends Container {
	private _shot:PIXI.Graphics;
	public shotRadius:number = 2;
    public gunRotationSave:number = 0;
    public shotSpeed:number = 16;
    public shotSpeedY:number = 0;

	constructor(rotation:number) {
        super();
        this._shot = new PIXI.Graphics();
        this._shot
            .beginFill(0xffffff)
            .drawCircle(0, 0, this.shotRadius);
        this.addChild(this._shot);
        this.gunRotationSave = rotation;
	}
}