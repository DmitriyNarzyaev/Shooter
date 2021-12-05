import Application = PIXI.Application;
import Container = PIXI.Container;
import MainContainer from "./Main_Container";
import Global from "./Global";

export class Main extends Container {
	private _mainContainer:MainContainer;

	constructor(canvasId:string) {
		super();
		this.initPixiApp(canvasId);
		this.initMainContainer();
	}

	private initPixiApp(canvasId:string):void {
		Global.PIXI_APP = new Application({
			backgroundColor: 0x000000,
			view: document.getElementById(canvasId) as HTMLCanvasElement,
			// needed to avoid troubles with invisible fonts on some Android devices
			resolution: ((devicePixelRatio || 1) < 2) ? 1 : 2,
		});
		Global.PIXI_APP.stage.addChild(this);
		Global.PIXI_APP.renderer.view.style.width = MainContainer.WIDTH + "px";
		Global.PIXI_APP.renderer.view.style.height = MainContainer.HEIGHT + "px";
		Global.PIXI_APP.renderer.resize(MainContainer.WIDTH, MainContainer.HEIGHT);
	}

	private initMainContainer():void {
		this._mainContainer = new MainContainer();
		Global.PIXI_APP.stage.addChild(this._mainContainer);
	}
}