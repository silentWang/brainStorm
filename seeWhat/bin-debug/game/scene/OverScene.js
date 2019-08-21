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
        var img = new egret.Bitmap(RES.getRes("home_json#lose"));
        img.anchorOffsetX = img.width / 2;
        img.anchorOffsetY = img.height / 2;
        img.scaleX = 1.5;
        img.scaleY = 3;
        img.x = SpriteUtil.stageCenterX;
        img.y = SpriteUtil.stageCenterY - 300;
        this.addChild(img);
        var btn = SpriteUtil.createText(">> 继 续 <<", 60, 0xffff00);
        btn.x = SpriteUtil.stageCenterX;
        btn.y = SpriteUtil.stageCenterY - 80;
        btn.touchEnabled = true;
        this.addChild(btn);
        EffectUtil.breath(btn, 0.05);
        var btn1 = SpriteUtil.createText(">> 菜 单 <<", 60, 0xffff00);
        btn1.x = SpriteUtil.stageCenterX;
        btn1.y = SpriteUtil.stageCenterY + 20;
        btn1.touchEnabled = true;
        this.addChild(btn1);
        EffectUtil.breath(btn1, 0.05);
        var btn2 = SpriteUtil.createText(">> 分 享 <<", 60, 0xffff00);
        btn2.x = SpriteUtil.stageCenterX;
        btn2.y = SpriteUtil.stageCenterY + 120;
        btn2.touchEnabled = true;
        this.addChild(btn2);
        EffectUtil.breath(btn2, 0.05);
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            GameSound.instance().playSound('click');
            Game.instance().gameScene.enterChapter();
        }, this);
        btn1.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            GameSound.instance().playSound('click');
            Game.instance().gameScene.enterMenu();
        }, this);
        btn2.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            GameSound.instance().playSound('click');
            WXApi.shareAppMessage();
        }, this);
    };
    return OverScene;
}(BaseScene));
__reflect(OverScene.prototype, "OverScene");
//# sourceMappingURL=OverScene.js.map