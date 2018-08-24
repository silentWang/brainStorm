class GameScene{
    constructor(){
        this.init();
    }

    private allScenes;
    private _menuScene:MenuScene;
    private _overScene:OverScene;
    private _currentScene;

    private init(){
        this._menuScene = new MenuScene();
        this._overScene = new OverScene();
        //十二生肖  连连看  营救女友  
        this.allScenes = [0,Scene_1,Scene_2,Scene_3,Scene_4,Scene_5,Scene_6];
        //添加事件
        this.addEvent();
    }

    //添加事件
    private addEvent(){
        EventCenter.instance().addEventListener(GameEvent.START_GAME,this.startGame,this);
        EventCenter.instance().addEventListener(GameEvent.GOTO_NEXT,this.gotoNext,this);
    }

    //回菜单
    gotoMenu(){
        if(this._currentScene){
            this._currentScene.exit();
        }
        this._overScene.exit();
        this._menuScene.enter();
    }
    //game over
    gotoOver(){
        if(this._currentScene){
            this._currentScene.exit();
        }
        this._menuScene.exit();
        this._overScene.enter();
    }
    //下一关
    private gotoNext(evt:GameEvent = null){
        let lvl = GameData.currentLevel;
        lvl++;
        GameData.currentLevel = lvl;
        GameData.currentLevel = 6;

        Game.instance().gameView.guideView.show('本关：十二生肖\n在有限时间内尽可能找出十二生肖所对应的文字，要按照顺序额');
        this._menuScene.exit();
        this._overScene.exit();
        if(this._currentScene){
            this._currentScene.exit();
        }
    }
    //开始当前关卡
    private startGame(evt:GameEvent = null){
        this._currentScene = new this.allScenes[GameData.currentLevel]();
        this._currentScene.enter();
    }


}