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
        this.tipsTxt.textColor = 0xffffff;
        this.tipsTxt.stroke = 1;
        this.tipsTxt.strokeColor = 0xff0000;
        this.tipsTxt.bold = true;
        this.tipsTxt.lineSpacing = 20;
        this.tipsTxt.width = SpriteUtil.stageWidth - 200;
        this.tipsTxt.x = (SpriteUtil.stageWidth - this.tipsTxt.width) / 2;
        this.addChild(this.tipsTxt);
        var btn = SpriteUtil.createText(">> 开始挑战 <<", 48, 0xffff00);
        btn.x = SpriteUtil.stageCenterX;
        btn.y = SpriteUtil.stageCenterY - 80;
        btn.touchEnabled = true;
        this.addChild(btn);
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            GameSound.instance().playSound('click');
            _this.close();
            EffectUtil.playReadyGo();
        }, this);
        this.startBtn = btn;
        EffectUtil.breath(btn, 0.05);
        var home = SpriteUtil.createImage('home');
        home.x = 80;
        home.y = 80;
        home.scaleX = 1.4;
        home.scaleY = 1.5;
        this.addChild(home);
        home.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            _this.close();
            Game.instance().gameScene.enterMenu();
        }, this);
    };
    GuideView.prototype.show = function () {
        this.tipsTxt.textFlow = this.getDesc();
        _super.prototype.open.call(this);
        this.tipsTxt.y = SpriteUtil.stageCenterY - this.tipsTxt.height / 2 - 100;
        this.startBtn.y = this.tipsTxt.y + this.tipsTxt.height + 60;
    };
    GuideView.prototype.getDesc = function () {
        var config = GameData.getLevelConfig();
        var arr = new Array();
        arr.push({ text: config.title, style: { bold: true, size: 40, textColor: 0xFFC125 } });
        arr.push({ text: '\n' });
        arr.push({ text: config['desc'], style: { size: 32, bold: false, textColor: 0xEEEED1, stroke: 0 } });
        return arr;
    };
    return GuideView;
}(BaseView));
__reflect(GuideView.prototype, "GuideView");
//# sourceMappingURL=GuideView.js.map