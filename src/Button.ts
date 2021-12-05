import { TextStyle } from "pixi.js";
import Container = PIXI.Container;

export default class Button extends Container {
    private readonly _callback:()=>void;
	
	constructor(buttonName:string, callback:()=>void = null) {
        super();
        this._callback = callback;
        
        const button:PIXI.Graphics = new PIXI.Graphics;
        button.buttonMode = true;
        button.interactive = true;
        button
            .beginFill(0x3535ff, 1)
            .drawRoundedRect(0, 0, 120, 40, 10);
        this.addChild(button);

        let textStyle:TextStyle = new PIXI.TextStyle ({
            fontFamily: 'Arial',
            fontSize: 24,
            fontWeight: 'bold',
            fill: ['#000000'],
        });

        const buttonText:PIXI.Text = new PIXI.Text (buttonName, textStyle);
        buttonText.x = (button.width - buttonText.width)/2;
        buttonText.y = (button.height - buttonText.height)/2;
        button.addChild(buttonText);

        if (callback) {
			  button.addListener('pointertap', this.pointerTabHandler, this);
		  }
    }
    
    private pointerTabHandler():void {
		this._callback();
	}
}