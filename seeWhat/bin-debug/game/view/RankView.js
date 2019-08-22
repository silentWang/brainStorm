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
var RankView = (function (_super) {
    __extends(RankView, _super);
    function RankView() {
        var _this = _super.call(this) || this;
        _this.intervalId = 0;
        _this.init();
        return _this;
    }
    RankView.prototype.init = function () {
        var _this = this;
        var shape = new egret.Shape();
        shape.graphics.beginFill(0x000000, 0.96);
        shape.graphics.drawRect(0, 0, SpriteUtil.stageWidth, SpriteUtil.stageHeight);
        shape.graphics.endFill();
        this.addChild(shape);
        shape.touchEnabled = true;
        shape.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            _this.close();
        }, this);
        this.listSpr = new egret.Sprite();
        this.listSpr.y = 100;
        this.addChild(this.listSpr);
        var txt = new egret.TextField();
        txt.text = '排行榜';
        txt.x = SpriteUtil.stageCenterX - txt.width / 2;
        txt.y = 80;
        txt.size = 40;
        txt.textColor = 0xffff00;
        txt.bold = true;
        this.addChild(txt);
    };
    RankView.prototype.open = function () {
        var _this = this;
        _super.prototype.open.call(this);
        this.intervalId = egret.setInterval(function () {
            _this.listSpr.removeChildren();
            var openDatactx = platform['openDataContext'];
            openDatactx.postMessage({ command: 'cmd_rank' });
            var rank = openDatactx.createDisplayObject();
            var scale = SpriteUtil.stageWidth / rank.width;
            _this.listSpr.addChild(rank);
            _this.listSpr.scaleX = scale;
            _this.listSpr.scaleY = scale;
        }, this, 40);
    };
    RankView.prototype.close = function () {
        _super.prototype.close.call(this);
        egret.clearInterval(this.intervalId);
    };
    return RankView;
}(BaseView));
__reflect(RankView.prototype, "RankView");
