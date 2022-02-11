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
	private _player:Player;
	private _stage:Stage;
	private BUTTON_LEFT:boolean = false;
	private BUTTON_RIGHT:boolean = false;
	private BUTTON_UP:boolean = false;
	private BUTTON_DOWN:boolean = false;
	private _monsters:Set<Monster> = new Set();
	private _monsterRespownPoint:number[] = [50, 50, 1150, 550, 50, 550, 1150, 50];
	private _shots:Set<Shot> = new Set();
	private _monsterRespownIterator:number = 0;

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
		//this.initialMonster();		//FIXME: TEST!!!!!!!!!!!
		window.addEventListener("keydown",
			(e:KeyboardEvent) => {this._player
			this.keyDownHandler(e);
		},);
		window.addEventListener("keyup",
			(e:KeyboardEvent) => {
			this.keyUpHandler(e);
		},);
		Global.PIXI_APP.ticker.add(this.ticker, this);

		this.monsterRespButton();
	}

	//создание точек респа мобов
	private monsterRespButton():void {
		for (let i:number = 0; i < this._monsterRespownPoint.length; i += 2) {
			let respPoint:PIXI.Graphics = new PIXI.Graphics;
			respPoint
				.beginFill(0xff0000)
				.drawCircle(0, 0, 5);
			this.addChild(respPoint);
			respPoint.x = this._monsterRespownPoint[i];
			respPoint.y = this._monsterRespownPoint[i+1];
		}
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
		let shotSpawnPoint:IPoint = this._player.playerSprite.toGlobal(this._player.getShotSpawnPoint());

		const shot = new Shot(this._player.rotation);
		shot.x = shotSpawnPoint.x;
		shot.y = shotSpawnPoint.y;
		this.addChild(shot);
		this._shots.add(shot);
	}

	//персонаж
	private initialPlayer():void {
		let sizecorrector:number = 2;
		this._player = new Player("playerRifle");
		this._player.width /= sizecorrector;
		this._player.height /= sizecorrector;
		this.addChild(this._player);
		this._player.x = (Main_Container.WIDTH - this._player.width) / 2;
		this._player.y = (Main_Container.HEIGHT - this._player.height) / 2;
	}

	//монстр
	private initialMonster():void {
		// let centerXCorrector:number = 20;
		// let centerYCorrector:number = 45;
		let monster:Monster = new Monster("zombie");;
		let sizecorrector:number = 5;
		
		monster.width /= sizecorrector;
		monster.height /= sizecorrector;
		this.addChild(monster);
		this._monsters.add(monster);

		let numberRespown:number = Math.floor(Math.random()*this._monsterRespownPoint.length/2);
		console.log(numberRespown);

		monster.x = this._monsterRespownPoint[numberRespown*2];
		monster.y = this._monsterRespownPoint[numberRespown*2 + 1];
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
		let mousePoint:IPoint = this._player.parent.toLocal(mousePosition);
		this.rotationObjectToTarget(this._player, mousePoint);
	}

	//столкновения
	// private collision(object1:ICollision, object2:ICollision):boolean {
	// 	let radius1:number = object1.radius * object1.scale.x;
	// 	let radius2:number = object2.radius * object2.scale.x;
	// 	let xdiff = this._player.x - this._monster.x;
	// 	let ydiff = this._player.y - this._monster.y;
	// 	let distance = Math.sqrt(xdiff * xdiff + ydiff * ydiff);
	// 	return distance<radius1 + radius2;
	// }

	private ticker(dt:number):void {
		this._monsterRespownIterator ++;
		if (this._monsterRespownIterator >= 60) {
			this.initialMonster();
			this._monsterRespownIterator = 0;
		}

		if (this.BUTTON_LEFT == true) {
			this._player.x -= this._player.playerSpeed;
		}
		if (this.BUTTON_RIGHT == true) {
			this._player.x += this._player.playerSpeed;
		}
		if (this.BUTTON_UP == true) {
			this._player.y -= this._player.playerSpeed;
		}
		if (this.BUTTON_DOWN == true) {
			this._player.y += this._player.playerSpeed;
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

		if (this._monsters.size >= 1) {
			this._monsters.forEach((monster) => {
				monster.x += Math.cos(monster.rotation) * monster.monsterSpeed * dt;
				monster.y += (Math.sin(monster.rotation) * monster.monsterSpeed ) * dt;
			
				// if (this.collision(this._player, monster)){
				// 	console.log("collision");
				// }
				this.rotationObjectToTarget(monster, this._player);
			});
		}
		this.refreshPlayerRotation();
	}
}
