var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GameScene = (function () {
    function GameScene() {
        this.init();
    }
    GameScene.prototype.init = function () {
        this._menuScene = new MenuScene();
        this._overScene = new OverScene();
        //十二生肖  连连看  营救女友  
        this.allScenes = [0, Scene_001, Scene_002, Scene_003, Scene_004, Scene_005, Scene_006, Scene_007, Scene_008, Scene_009, Scene_010];
        //添加事件
        this.addEvent();
    };
    //添加事件
    GameScene.prototype.addEvent = function () {
        EventCenter.instance().addEventListener(GameEvent.START_GAME, this.startGame, this);
        EventCenter.instance().addEventListener(GameEvent.GOTO_NEXT, this.gotoNext, this);
    };
    //回菜单
    GameScene.prototype.gotoMenu = function () {
        if (this._currentScene) {
            this._currentScene.exit();
        }
        this._overScene.exit();
        this._menuScene.enter();
    };
    //game over
    GameScene.prototype.gotoOver = function () {
        if (this._currentScene) {
            this._currentScene.exit();
        }
        GameData.currentLevel = 0;
        this._menuScene.exit();
        this._overScene.enter();
    };
    //下一关
    GameScene.prototype.gotoNext = function (evt) {
        if (evt === void 0) { evt = null; }
        var lvl = GameData.currentLevel;
        lvl++;
        GameData.currentLevel = lvl;
        GameData.currentLevel = 10;
        var desc = GameData.config[GameData.currentLevel]['title'] + "\n" + GameData.config[GameData.currentLevel]['desc'];
        Game.instance().gameView.guideView.show(desc);
        this._menuScene.exit();
        this._overScene.exit();
        if (this._currentScene) {
            this._currentScene.exit();
        }
    };
    //开始当前关卡
    GameScene.prototype.startGame = function (evt) {
        if (evt === void 0) { evt = null; }
        this._currentScene = new this.allScenes[GameData.currentLevel]();
        this._currentScene.enter();
    };
    return GameScene;
}());
__reflect(GameScene.prototype, "GameScene");
//# sourceMappingURL=GameScene.js.map