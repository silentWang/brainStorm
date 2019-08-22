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
/**
 * view 基类
 */
var BaseView = (function (_super) {
    __extends(BaseView, _super);
    function BaseView() {
        var _this = _super.call(this) || this;
        _this.isOpen = false;
        return _this;
    }
    BaseView.prototype.open = function () {
        if (this.isOpen)
            return;
        this.isOpen = true;
        Game.instance().addTop(this);
    };
    BaseView.prototype.close = function () {
        this.isOpen = false;
        if (this.parent) {
            this.parent.removeChild(this);
        }
    };
    return BaseView;
}(egret.Sprite));
__reflect(BaseView.prototype, "BaseView");
