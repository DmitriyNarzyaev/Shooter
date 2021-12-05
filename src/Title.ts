import { Container, Graphics, TextStyle } from "pixi.js";

export class Title extends Container {
	private _titleText:PIXI.Text;

	constructor(titleWidth:number, titleHeight:number) {
		super();
        this.initialTitleBackground(titleWidth, titleHeight);
        this.initTextWindow();
    }

    private initialTitleBackground(titleWidth:number, titleHeight:number):void {
        let bg: Graphics = new Graphics;
		bg.beginFill(0x00ff48);
		bg.drawRect(0, 0, titleWidth, titleHeight);
		this.addChild(bg);
    }

    private initTextWindow():void {
		let style:TextStyle = new PIXI.TextStyle ({
				fontFamily: 'Arial',
				fontSize: 50,
				fontWeight: 'bold',
				fill: ['#4444ff', '#2222ff', '#4444ff'],
				dropShadow: true,
				dropShadowColor: '#000000',
				dropShadowDistance:1,
				dropShadowAngle: Math.PI / 10,
				stroke: '#000000',
				strokeThickness: 4
			}
		);
		this._titleText = new PIXI.Text('SHOOTER', style);
		this._titleText.x = (this.width - this._titleText.width)/2;
		this.addChild(this._titleText);
	}
}
