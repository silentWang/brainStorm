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
var TimeItem = (function (_super) {
    __extends(TimeItem, _super);
    function TimeItem(time) {
        if (time === void 0) { time = 0; }
        var _this = _super.call(this) || this;
        _this.leftTime = 0;
        _this.leftTime = time;
        _this.init();
        return _this;
    }
    TimeItem.prototype.init = function () {
        this.timeTxt = new egret.TextField();
        this.timeTxt.width = 240;
        this.timeTxt.size = 32;
        this.timeTxt.textColor = 0x00ff00;
        this.timeTxt.text = "\u5269\u4F59\u65F6\u95F4  " + CommonUtil.getMSTimeBySeconds(this.leftTime);
        this.timeTxt.y = 10;
        this.timeTxt.x = (SpriteUtil.stageWidth - 200) / 2;
        this.addChild(this.timeTxt);
    };
    TimeItem.prototype.start = function () {
        this.timer = new egret.Timer(1000);
        this.timer.addEventListener(egret.TimerEvent.TIMER, this.timerTick, this);
        this.timer.start();
    };
    TimeItem.prototype.timerTick = function () {
        this.leftTime--;
        this.timeTxt.text = "\u5269\u4F59\u65F6\u95F4  " + CommonUtil.getMSTimeBySeconds(this.leftTime);
        if (this.leftTime <= 0) {
            Game.instance().gameScene.gotoOver();
        }
    };
    TimeItem.prototype.stop = function () {
        if (this.timer) {
            this.timer.stop();
            this.timer.removeEventListener(egret.TimerEvent.TIMER, this.timerTick, this);
            this.timer = null;
        }
    };
    return TimeItem;
}(egret.Sprite));
__reflect(TimeItem.prototype, "TimeItem");
//# sourceMappingURL=TimeItem.js.map