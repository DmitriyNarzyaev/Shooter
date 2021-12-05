import { Loader } from "pixi.js";
import Button from "./Button";
import { Title } from "./Title";
import Container = PIXI.Container;

export default class Main_Container extends Container {
	public static readonly WIDTH:number = 1200;
	public static readonly HEIGHT:number = 600;
	private _title:Title;
	private _button:Button;

	constructor() {
		super();
		this.pictureLoader();
	}

	private pictureLoader():void {
		const loader:Loader = new Loader();
		//loader.add("background", "background.jpg");
		loader.add("playerRifle", "player_rifle.png");
		loader.add("playerShotgun", "player_shotgun.png");
		loader.on("complete", ()=> {
			this.initialTitle();
		});
		loader.load();
	}

	private initialTitle():void {
		this._title = new Title(Main_Container.WIDTH, Main_Container.HEIGHT);
		this.addChild(this._title);
		this.initialButton("START");
	}

	private initialButton(buttonName:string):void {
		this._button = new Button(buttonName, () => {this.initialGame();});
		this.addChild(this._button);
		this._button.x = (Main_Container.WIDTH - this._button.width)/2;
		this._button.y = Main_Container.HEIGHT - this._button.height*2;
	}

	private initialGame():void {
		this.removeTitle();
	}

	private removeTitle():void {
		this.removeChild(this._title);
		this.removeChild(this._button);
	}
}