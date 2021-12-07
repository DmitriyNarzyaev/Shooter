import { Container } from "pixi.js";

export class Stage extends Container {
    private _bg:PIXI.Graphics;

	constructor(BGWidth:number, BGHeight:number) {
		super();
        this.initialBackground(BGWidth, BGHeight);
    }

    private initialBackground(BGWidth:number, BGHeight:number):void {
        this._bg = new PIXI.Graphics;
        this._bg
            .beginFill(0x084408)
            .drawRect(0, 0, BGWidth, BGHeight);
        this.addChild(this._bg);
    }
}
