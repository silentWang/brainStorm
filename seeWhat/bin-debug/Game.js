var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 框架分三层 bottom,middle,top
 * 可直接通过gamestage添加新层
 * bottom游戏舞台层
 * middle中间处理层
 * top 视图层
 */
var Game = (function () {
    function Game() {
    }
    Game.instance = function () {
        if (this._instance == null) {
            this._instance = new Game();
        }
        return this._instance;
    };
    Game.prototype.setStage = function (stage) {
        this._gameStage = stage;
        SpriteUtil.stageWidth = stage.stageWidth;
        SpriteUtil.stageHeight = stage.stageHeight;
        SpriteUtil.stageCenterX = stage.stageWidth / 2;
        SpriteUtil.stageCenterY = stage.stageHeight / 2;
        this._bottom = new egret.DisplayObjectContainer();
        this._middle = new egret.DisplayObjectContainer();
        this._top = new egret.DisplayObjectContainer();
        this._gameStage.addChild(this._bottom);
        this._gameStage.addChild(this._middle);
        this._gameStage.addChild(this._top);
        this._gameScene = new GameScene();
        this._gameView = new GameView();
        //进入菜单
        if (!GameData.isWxGame) {
            this._gameScene.gotoMenu();
        }
        else {
            WXApi.getSetting();
        }
    };
    Game.prototype.addBottom = function (display) {
        this._bottom.addChild(display);
    };
    Game.prototype.addMiddle = function (display) {
        this._middle.addChild(display);
    };
    Game.prototype.addTop = function (display) {
        this._top.addChild(display);
    };
    Object.defineProperty(Game.prototype, "gameStage", {
        get: function () {
            return this._gameStage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "gameScene", {
        get: function () {
            return this._gameScene;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "gameView", {
        get: function () {
            return this._gameView;
        },
        enumerable: true,
        configurable: true
    });
    Game._instance = null;
    return Game;
}());
__reflect(Game.prototype, "Game");
//# sourceMappingURL=Game.js.map