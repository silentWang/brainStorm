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
var Scene_000 = (function (_super) {
    __extends(Scene_000, _super);
    function Scene_000() {
        var _this = _super.call(this) || this;
        _this.init();
        return _this;
    }
    Scene_000.prototype.init = function () {
        var text = SpriteUtil.createText('你是怎么来到这个关卡的\n真是难以置信');
        text.x = SpriteUtil.stageCenterX;
        text.y = SpriteUtil.stageCenterY;
        this.addChild(text);
    };
    return Scene_000;
}(BaseScene));
__reflect(Scene_000.prototype, "Scene_000");
