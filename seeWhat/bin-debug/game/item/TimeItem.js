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
        _this._leftTime = 0;
        _this.callBackContext = null;
        _this._leftTime = time;
        _this.init();
        return _this;
    }
    TimeItem.prototype.init = function () {
        this.timeTxt = new egret.TextField();
        this.timeTxt.width = 240;
        this.timeTxt.size = 32;
        this.timeTxt.textColor = 0xEE00EE;
        this.timeTxt.stroke = 0.5;
        this.timeTxt.strokeColor = 0x000000;
        this.timeTxt.bold = true;
        this.timeTxt.text = "\u5269\u4F59\u65F6\u95F4  " + CommonUtil.getMSTimeBySeconds(this._leftTime);
        this.y = 30;
        this.x = (SpriteUtil.stageWidth - 200) / 2;
        this.addChild(this.timeTxt);
    };
    //开始
    TimeItem.prototype.start = function (loop, thisObj) {
        if (thisObj === void 0) { thisObj = null; }
        this.timer = new egret.Timer(1000);
        this.loop = loop;
        this.callBackContext = thisObj;
        this.timer.addEventListener(egret.TimerEvent.TIMER, this.timerTick, this);
        this.timer.start();
    };
    //restart
    TimeItem.prototype.restart = function (time, loop, thisObj) {
        if (time === void 0) { time = 0; }
        if (thisObj === void 0) { thisObj = null; }
        this._leftTime = time;
        this.timeTxt.text = "\u5269\u4F59\u65F6\u95F4  " + CommonUtil.getMSTimeBySeconds(this._leftTime);
        this.timer = new egret.Timer(1000);
        this.loop = loop;
        this.callBackContext = thisObj;
        this.timer.addEventListener(egret.TimerEvent.TIMER, this.timerTick, this);
        this.timer.start();
    };
    Object.defineProperty(TimeItem.prototype, "leftTime", {
        get: function () {
            return this._leftTime;
        },
        enumerable: true,
        configurable: true
    });
    TimeItem.prototype.timerTick = function () {
        this._leftTime--;
        this.timeTxt.text = "\u5269\u4F59\u65F6\u95F4  " + CommonUtil.getMSTimeBySeconds(this._leftTime);
        if (this.loop) {
            this.loop.call(this.callBackContext, this._leftTime);
            return;
        }
        if (this._leftTime <= 0) {
            if (!this.loop) {
                EffectUtil.showResultEffect();
            }
            this.stop();
        }
    };
    TimeItem.prototype.stop = function () {
        if (this.timer) {
            this.timer.stop();
            this.timer.removeEventListener(egret.TimerEvent.TIMER, this.timerTick, this);
            this.timer = null;
        }
        this._leftTime = 0;
        this.loop = null;
        this.callBackContext = null;
    };
    return TimeItem;
}(egret.Sprite));
__reflect(TimeItem.prototype, "TimeItem");
