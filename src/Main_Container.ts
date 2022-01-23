import { IPoint, Loader, Point } from "pixi.js";
import Button from "./Button";
import Global from "./Global";
import { Monster } from "./Monster";
import { Player } from "./Player";
import Shot from "./Shot";
import { Stage } from "./Stage";
import { Title } from "./Title";
import Container = PIXI.Container;

export default class Main_Container extends Container {
	public static readonly WIDTH:number = 1200;
	public static readonly HEIGHT:number = 600;
	private _title:Title;
	private _button:Button;
	private _playerContainer:PIXI.Container;
	private _player:Player;
	private _stage:Stage;
	private BUTTON_LEFT:boolean = false;
	private BUTTON_RIGHT:boolean = false;
	private BUTTON_UP:boolean = false;
	private BUTTON_DOWN:boolean = false;
	private _monsterContainer:PIXI.Container;
	private _monster:Monster;
	private _monsters:Set<Monster> = new Set();
	private _shots:Set<Shot> = new Set();

	constructor() {
		super();
		this.pictureLoader();
	}

	private pictureLoader():void {
		const loader:Loader = new Loader();
		//loader.add("background", "background.jpg");
		loader.add("playerRifle", "player_rifle.png");
		loader.add("playerShotgun", "player_shotgun.png");
		loader.add("zombie", "zombie.png");
		loader.on("complete", ()=> {
			this.initialTitle();
		});
		loader.load();
	}

	//заставка
	private initialTitle():void {
		this._title = new Title(Main_Container.WIDTH, Main_Container.HEIGHT);
		this.addChild(this._title);
		this.initialButton("START");
	}

	//кнопка запуска игры
	private initialButton(buttonName:string):void {
		this._button = new Button(buttonName, () => {this.initialGame();});
		this.addChild(this._button);
		this._button.x = (Main_Container.WIDTH - this._button.width)/2;
		this._button.y = Main_Container.HEIGHT - this._button.height*2;
	}

	//старт игры
	private initialGame():void {
		this.removeTitle();

		this.initialStage();
		this.initialPlayer();
		this.initialMonster();		//FIXME: TEST!!!!!!!!!!!
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

	//удаление заставки
	private removeTitle():void {
		this.removeChild(this._title);
		this.removeChild(this._button);
	}

	//уровень
	private initialStage():void {
		this._stage = new Stage(Main_Container.WIDTH, Main_Container.HEIGHT);
		this.addChild(this._stage);
		this._stage.interactive = true;
		this._stage.addListener('pointerdown', this.initialShot, this);
	}

	//выстрел
	private initialShot():void {
		let shotSpawnPoint:IPoint = this._player.toGlobal(this._player.getShotSpawnPoint());

		const shot = new Shot(this._playerContainer.rotation);
		shot.x = shotSpawnPoint.x;
		shot.y = shotSpawnPoint.y;
		this.addChild(shot);
		this._shots.add(shot);
	}

	//персонаж
	private initialPlayer():void {
		// let centerXCorrector:number = 35;
		// let centerYCorrector:number = 48;
		let sizecorrector:number = 2;
		this._playerContainer = new PIXI.Container;
		this.addChild(this._playerContainer);
		this._player = new Player("playerRifle");
		this._player.width /= sizecorrector;
		this._player.height /= sizecorrector;
		this._playerContainer.addChild(this._player);
		this._player.x -= this._player.width/2;
		this._player.y -= this._player.height/2;
		this._playerContainer.x = (Main_Container.WIDTH - this._player.width) / 2;
		this._playerContainer.y = (Main_Container.HEIGHT - this._player.height) / 2;

		const testBG:PIXI.Graphics = new PIXI.Graphics;
		testBG.beginFill(0x003344, .5);
		testBG.drawRect(0, 0, this._playerContainer.width, this._playerContainer.height);
		this._playerContainer.addChild(testBG);
	}

	//монстр
	private initialMonster():void {
		// let centerXCorrector:number = 20;
		// let centerYCorrector:number = 45;
		let sizecorrector:number = 5;
		this._monsterContainer = new PIXI.Container;
		this.addChild(this._monsterContainer);
		this._monster = new Monster("zombie");
		this._monster.width /= sizecorrector;
		this._monster.height /= sizecorrector;
		this._monsterContainer.addChild(this._monster);
		this._monsters.add(this._monster);
		this._monster.x -= this._monster.width/2;
		this._monster.y -= this._monster.height/2;
		this._monsterContainer.x = 180;
		this._monsterContainer.y = 180;

		const testBG:PIXI.Graphics = new PIXI.Graphics;
		testBG.beginFill(0x003344, .5);
		testBG.drawRect(0, 0, this._monsterContainer.width, this._monsterContainer.height);
		this._monsterContainer.addChild(testBG);
	}

	//Нажатие кнопок
    private keyDownHandler(e:KeyboardEvent):void {
		if (e.code == "ArrowLeft") {
			this.BUTTON_LEFT = true;
		}
		if (e.code == "ArrowRight") {
			this.BUTTON_RIGHT = true;
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
		if (e.code == "ArrowLeft") {
			this.BUTTON_LEFT = false;
		}
		if (e.code == "ArrowRight") {
			this.BUTTON_RIGHT = false;
		}
		if (e.code == "ArrowUp") {
			this.BUTTON_UP = false;
		}
		if (e.code == "ArrowDown") {
			this.BUTTON_DOWN = false;
		}
    }

	//поворот объекта к цели
	private rotationObjectToTarget(rotationObject:Container, targetObject:any):void {
		rotationObject.rotation = Math.atan2 (
			targetObject.y - rotationObject.y,
			targetObject.x - rotationObject.x
		)
	}

	//вращение персонажа
	private refreshPlayerRotation():void {
		let mousePosition = Global.PIXI_APP.renderer.plugins.interaction.mouse.global;
		let mousePoint:IPoint = this._playerContainer.parent.toLocal(mousePosition);
		this.rotationObjectToTarget(this._playerContainer, mousePoint);
	}

	//столкновения
	private collision(player:Player, monster:Monster):boolean {
		let playerRadius:number = player.radius*player.scale.x;
		let monsterRadius:number = monster.radius*monster.scale.x;
		let xdiff = this._playerContainer.x - this._monsterContainer.x;
		let ydiff = this._playerContainer.y - this._monsterContainer.y;
		let distance = Math.sqrt(xdiff * xdiff + ydiff * ydiff);
		return distance<playerRadius + monsterRadius;
	}

	//движения объектов
	private ticker(dt:number):void {
		if (this.BUTTON_LEFT == true) {
			this._playerContainer.x -= this._player.playerSpeed;
		}
		if (this.BUTTON_RIGHT == true) {
			this._playerContainer.x += this._player.playerSpeed;
		}
		if (this.BUTTON_UP == true) {
			this._playerContainer.y -= this._player.playerSpeed;
		}
		if (this.BUTTON_DOWN == true) {
			this._playerContainer.y += this._player.playerSpeed;
		}
		
		//движение пуль
		this._shots.forEach((shot) => {
			shot.x += Math.cos(shot.gunRotationSave) * shot.shotSpeed * dt;
			shot.y += (Math.sin(shot.gunRotationSave) * shot.shotSpeed) * dt;

			if (shot && shot.parent && shot.x >= Main_Container.WIDTH + shot.width ||
				shot.y >= Main_Container.HEIGHT + shot.height ||
				shot.y <= shot.height ||
				shot.x <= shot.height){
				this._shots.delete(shot);
				shot.parent.removeChild(shot);
			}
		});

		this._monsters.forEach((monster) => {
			// this._monsterContainer.x += Math.cos(this._monsterContainer.rotation) * monster.monsterSpeed * dt;
			// this._monsterContainer.y += (Math.sin(this._monsterContainer.rotation) * monster.monsterSpeed ) * dt;
		
			if (this.collision(this._player, monster)){
				console.log("collision");
			}
			
		});

		this.rotationObjectToTarget(this._monsterContainer, this._playerContainer);
		this.refreshPlayerRotation();
	}
}
