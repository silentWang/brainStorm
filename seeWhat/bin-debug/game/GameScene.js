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
        this.allScenes = [0, Scene_1, Scene_2, Scene_3, Scene_4, Scene_5, Scene_6];
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
        this._menuScene.exit();
        this._overScene.enter();
    };
    //下一关
    GameScene.prototype.gotoNext = function (evt) {
        if (evt === void 0) { evt = null; }
        var lvl = GameData.currentLevel;
        lvl++;
        GameData.currentLevel = lvl;
        GameData.currentLevel = 6;
        Game.instance().gameView.guideView.show('本关：十二生肖\n在有限时间内尽可能找出十二生肖所对应的文字，要按照顺序额');
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