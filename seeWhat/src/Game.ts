/**
 * 框架分三层 bottom,middle,top
 * 可直接通过gamestage添加新层
 * bottom游戏舞台层
 * middle中间处理层
 * top 视图层
 */
class Game{
    constructor(){
    }

    private static _instance:Game = null;
    public static instance(){
        if(this._instance == null){
            this._instance = new Game();
        }
        return this._instance;
    }

    private _gameStage:egret.Stage;
    private _bottom:egret.DisplayObjectContainer;
    private _middle:egret.DisplayObjectContainer;
    private _top:egret.DisplayObjectContainer;
    private _gameScene:GameScene;
    private _gameView:GameView;
    setStage(stage:egret.Stage){
        this._gameStage = stage;
        SpriteUtil.stageWidth = stage.stageWidth;
        SpriteUtil.stageHeight = stage.stageHeight;
        SpriteUtil.stageCenterX = stage.stageWidth/2;
        SpriteUtil.stageCenterY = stage.stageHeight/2;

        this._bottom = new egret.DisplayObjectContainer();
        this._middle = new egret.DisplayObjectContainer();
        this._top = new egret.DisplayObjectContainer();
        this._gameStage.addChild(this._bottom);
        this._gameStage.addChild(this._middle);
        this._gameStage.addChild(this._top);
        this._gameScene = new GameScene();
        this._gameView = new GameView();
        //进入菜单
        this._gameScene.gotoMenu();
    }

    addBottom(display:egret.DisplayObject){
        this._bottom.addChild(display);
    }

    addMiddle(display:egret.DisplayObject){
        this._middle.addChild(display);
    }

    addTop(display:egret.DisplayObject){
        this._top.addChild(display);
    }

    get gameStage(){
        return this._gameStage;
    }

    get gameScene(){
        return this._gameScene;
    }

    get gameView(){
        return this._gameView;
    }

}