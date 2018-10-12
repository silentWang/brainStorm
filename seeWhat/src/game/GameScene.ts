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
        //一笔画  
        this.allScenes = {};
        this.allScenes['001'] = Scene_001;
        this.allScenes['002'] = Scene_002;
        this.allScenes['003'] = Scene_003;
        this.allScenes['004'] = Scene_004;
        this.allScenes['005'] = Scene_005;
        this.allScenes['006'] = Scene_006;
        this.allScenes['007'] = Scene_007;
        this.allScenes['008'] = Scene_008;
        this.allScenes['009'] = Scene_009; 
        this.allScenes['010'] = Scene_010;
        this.allScenes['011'] = Scene_011;
        this.allScenes['012'] = Scene_012;
        this.allScenes['013'] = Scene_013;
        this.allScenes['014'] = Scene_014;
        this.allScenes['015'] = Scene_015;
        this.allScenes['016'] = Scene_016;
        this.allScenes['017'] = Scene_017;
        this.allScenes['018'] = Scene_018;
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
        GameSound.instance().stopMusic();
    }
    //game over
    gotoOver(){
        if(this._currentScene){
            this._currentScene.exit();
        }
        if(GameData.isWxGame){
            WXApi.updateRankLvl();
        }
        this._menuScene.exit();
        this._overScene.enter();
        GameData.currentLevel = 0;
        GameSound.instance().stopMusic();
    }
    //下一关
    private gotoNext(evt:GameEvent = null){
        let lvl = GameData.currentLevel;
        lvl++;
        GameData.currentLevel = lvl;
        //only test
        GameData.currentLevel = 41;
        Game.instance().gameView.guideView.show();
        this._menuScene.exit();
        this._overScene.exit();
        if(this._currentScene){
            this._currentScene.exit();
            GameSound.instance().stopMusic();
        }
    }
    //开始当前关卡
    private startGame(evt:GameEvent = null){
        GameSound.instance().playMusic();
        let config = GameData.getLevelConfig();
        this._currentScene = new this.allScenes[config.levelType]();
        this._currentScene.enter();
    }


}