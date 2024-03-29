var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GameView = (function () {
    function GameView() {
        this.init();
    }
    GameView.prototype.init = function () {
        this._guideView = new GuideView();
        this._rankView = new RankView();
        this._tipsView = new TipsView();
    };
    Object.defineProperty(GameView.prototype, "guideView", {
        get: function () {
            return this._guideView;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameView.prototype, "rankView", {
        get: function () {
            return this._rankView;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameView.prototype, "tipsView", {
        get: function () {
            return this._tipsView;
        },
        enumerable: true,
        configurable: true
    });
    return GameView;
}());
__reflect(GameView.prototype, "GameView");
//# sourceMappingURL=GameView.js.map