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
var GuideView = (function (_super) {
    __extends(GuideView, _super);
    function GuideView() {
        var _this = _super.call(this) || this;
        _this.init();
        return _this;
    }
    GuideView.prototype.init = function () {
        var _this = this;
        var sp = new egret.Shape();
        sp.graphics.beginFill(0x000000);
        sp.graphics.drawRect(0, 0, SpriteUtil.stageWidth, SpriteUtil.stageHeight);
        sp.graphics.endFill();
        this.addChild(sp);
        this.tipsTxt = new egret.TextField;
        this.tipsTxt.name = '';
        this.tipsTxt.textAlign = 'center';
        this.tipsTxt.size = 40;
        this.tipsTxt.textColor = 0x00ff00;
        this.tipsTxt.stroke = 1;
        this.tipsTxt.strokeColor = 0x0000ff;
        this.tipsTxt.bold = true;
        this.tipsTxt.lineSpacing = 10;
        this.tipsTxt.width = SpriteUtil.stageWidth - 200;
        this.tipsTxt.x = (SpriteUtil.stageWidth - this.tipsTxt.width) / 2;
        this.tipsTxt.y = SpriteUtil.stageHeight / 2 - 200;
        this.addChild(this.tipsTxt);
        var btn = SpriteUtil.createButton('我知道了');
        btn.x = SpriteUtil.stageCenterX - btn.width / 2;
        btn.y = SpriteUtil.stageCenterY + 100;
        this.addChild(btn);
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            _this.close();
            EventCenter.instance().dispatchEvent(new GameEvent(GameEvent.START_GAME));
        }, this);
    };
    GuideView.prototype.show = function (desc) {
        if (desc === void 0) { desc = ''; }
        this.tipsTxt.text = desc;
        _super.prototype.open.call(this);
    };
    return GuideView;
}(BaseView));
__reflect(GuideView.prototype, "GuideView");
//# sourceMappingURL=GuideView.js.map