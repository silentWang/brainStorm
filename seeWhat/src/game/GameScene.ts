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
        this.allScenes = [0,Scene_001,Scene_002,Scene_003,Scene_004,Scene_005,Scene_006,Scene_007,Scene_008,Scene_009,Scene_010];
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
        GameData.currentLevel = 0;
        this._menuScene.exit();
        this._overScene.enter();
    }
    //下一关
    private gotoNext(evt:GameEvent = null){
        let lvl = GameData.currentLevel;
        lvl++;
        GameData.currentLevel = lvl;
        // GameData.currentLevel = 10;

        let desc = `${GameData.config[GameData.currentLevel]['title']}\n${GameData.config[GameData.currentLevel]['desc']}`;
        Game.instance().gameView.guideView.show(desc);
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