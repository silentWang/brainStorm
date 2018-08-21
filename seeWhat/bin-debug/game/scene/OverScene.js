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
var OverScene = (function (_super) {
    __extends(OverScene, _super);
    function OverScene() {
        var _this = _super.call(this) || this;
        _this.init();
        return _this;
    }
    OverScene.prototype.init = function () {
        var text = new egret.TextField();
        text.name = 'target_text';
        text.textAlign = 'center';
        text.text = 'Game\nOver';
        text.size = 120;
        text.textColor = 0xCFCFCF;
        text.stroke = 1;
        text.strokeColor = 0xffffff;
        text.bold = true;
        text.width = SpriteUtil.stageWidth;
        text.y = SpriteUtil.stageHeight / 2 - 200;
        this.addChild(text);
        var btn = SpriteUtil.createButton('回主页');
        btn.x = SpriteUtil.stageCenterX - btn.width / 2;
        btn.y = SpriteUtil.stageCenterY + 100;
        this.addChild(btn);
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            Game.instance().gameScene.gotoMenu();
        }, this);
    };
    return OverScene;
}(BaseScene));
__reflect(OverScene.prototype, "OverScene");
//# sourceMappingURL=OverScene.js.map