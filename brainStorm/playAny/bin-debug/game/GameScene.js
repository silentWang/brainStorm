var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GameScene = (function () {
    function GameScene() {
        this.init();
    }
    GameScene.prototype.init = function () {
        this._menuScene = new MenuScene();
    };
    Object.defineProperty(GameScene.prototype, "menuScene", {
        get: function () {
            return this._menuScene;
        },
        enumerable: true,
        configurable: true
    });
    GameScene.prototype.enterScene = function () {
        this._menuScene.exit();
        if (this._currentScene) {
            this._currentScene.exit();
        }
        var scene = new Scene_1();
        scene.enter();
        this._currentScene = scene;
    };
    return GameScene;
}());
__reflect(GameScene.prototype, "GameScene");
//# sourceMappingURL=GameScene.js.map