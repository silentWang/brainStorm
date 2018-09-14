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
var MenuScene = (function (_super) {
    __extends(MenuScene, _super);
    function MenuScene() {
        var _this = _super.call(this) || this;
        _this.init();
        return _this;
    }
    MenuScene.prototype.init = function () {
        var logo = new egret.Bitmap(RES.getRes("logo_png"));
        logo.anchorOffsetX = logo.width / 2;
        logo.x = SpriteUtil.stageCenterX;
        logo.y = 120;
        this.addChild(logo);
        var btn = SpriteUtil.createButton('开始');
        btn.x = SpriteUtil.stageCenterX - btn.width / 2;
        btn.y = SpriteUtil.stageCenterY;
        this.addChild(btn);
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            EventCenter.instance().dispatchEvent(new GameEvent(GameEvent.GOTO_NEXT));
        }, this);
        var rankbtn = SpriteUtil.createText('排行榜', 40, 0xEEB422);
        rankbtn.x = SpriteUtil.stageCenterX;
        rankbtn.y = btn.y + 200;
        this.addChild(rankbtn);
        rankbtn.touchEnabled = true;
        rankbtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (!GameData.isWxGame)
                return;
            Game.instance().gameView.rankView.open();
        }, this);
    };
    return MenuScene;
}(BaseScene));
__reflect(MenuScene.prototype, "MenuScene");
//# sourceMappingURL=MenuScene.js.map