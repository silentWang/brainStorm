var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var BaseScene = (function (_super) {
    __extends(BaseScene, _super);
    function BaseScene() {
        var _this = _super.call(this) || this;
        _this.isShow = false;
        //倒计时 子类实现
        _this.timeItem = null;
        //分数 子类实现
        _this.scoreItem = null;
        _this.dataVo = GameData.getCurrentSceneData();
        return _this;
    }
    BaseScene.prototype.enter = function () {
        if (this.isShow)
            return;
        this.isShow = true;
        Game.instance().addBottom(this);
    };
    BaseScene.prototype.exit = function () {
        this.isShow = false;
        if (this.parent) {
            this.parent.removeChild(this);
        }
    };
    return BaseScene;
}(egret.DisplayObjectContainer));
__reflect(BaseScene.prototype, "BaseScene");
//# sourceMappingURL=BaseScene.js.map