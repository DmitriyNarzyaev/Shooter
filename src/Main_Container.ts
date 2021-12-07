import { Loader } from "pixi.js";
import Button from "./Button";
import Global from "./Global";
import { Player } from "./Player";
import { Stage } from "./Stage";
import { Title } from "./Title";
import Container = PIXI.Container;

export default class Main_Container extends Container {
	public static readonly WIDTH:number = 1200;
	public static readonly HEIGHT:number = 600;
	private _title:Title;
	private _button:Button;
	private _player:Player;
	private _stage:Stage;
	private BUTTON_LEFT:boolean = false;
	private BUTTON_RIGHT:boolean = false;
	private BUTTON_UP:boolean = false;
	private BUTTON_DOWN:boolean = false;

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

		this.initialBackground();
		this.initialPlayer()

		window.addEventListener("keydown",
			(e:KeyboardEvent) => {this._player
			this.keyDownHandler(e);
		},);
		window.addEventListener("keyup",
			(e:KeyboardEvent) => {
			this.keyUpHandler(e);
		},);

		Global.PIXI_APP.ticker.add(this.ticker, this);
	}

	private removeTitle():void {
		this.removeChild(this._title);
		this.removeChild(this._button);;
	}

	private initialBackground():void {
		this._stage = new Stage(Main_Container.WIDTH, Main_Container.HEIGHT);
		this.addChild(this._stage);
	}

	private initialPlayer():void {
		this._player = new Player("playerRifle");
		this._player.width /= 2;
		this._player.height /= 2;
		this._player.x = (Main_Container.WIDTH - this._player.width) / 2
		this._player.y = (Main_Container.HEIGHT - this._player.height) / 2
		this._player.interactive = true;
		this.addChild(this._player);
	}

	//Нажатие кнопок
    private keyDownHandler(e:KeyboardEvent):void {
		if (e.code == "ArrowRight") {
			this.BUTTON_RIGHT = true;
		}
		if (e.code == "ArrowLeft") {
			this.BUTTON_LEFT = true;
		}
		if (e.code == "ArrowUp") {
			this.BUTTON_UP = true;
		}
		if (e.code == "ArrowDown") {
			this.BUTTON_DOWN = true;
		}
	}

	//отпуск кнопок
	private keyUpHandler(e:KeyboardEvent):void {
		if (e.code == "ArrowRight") {
			this.BUTTON_RIGHT = false;
		}
		if (e.code == "ArrowLeft") {
			this.BUTTON_LEFT = false;
		}
		if (e.code == "ArrowUp") {
			this.BUTTON_UP = false;
		}
		if (e.code == "ArrowDown") {
			this.BUTTON_DOWN = false;
		}
    }

	private ticker():void {
		if (this.BUTTON_UP == true) {
			this._player.y -= this._player.playerSpeed;
		}
		if (this.BUTTON_LEFT == true) {
			this._player.x -= this._player.playerSpeed;
		}
		if (this.BUTTON_DOWN == true) {
			this._player.y += this._player.playerSpeed;
		}
		if (this.BUTTON_RIGHT == true) {
			this._player.x += this._player.playerSpeed;
		}
	}
}