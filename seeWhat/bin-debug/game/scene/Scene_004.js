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
//考验观察力
var Scene_004 = (function (_super) {
    __extends(Scene_004, _super);
    function Scene_004() {
        var _this = _super.call(this) || this;
        _this.rotateAngle = 0;
        //目标箱子索引
        _this.targetIndex = 0;
        //交换间隔时间
        _this.intervalTime = 0;
        //交换次数
        _this.exchangeTimes = 0;
        //最大交换次数
        _this.maxTimes = 0;
        _this.isGameStart = false;
        _this.init();
        return _this;
    }
    Scene_004.prototype.init = function () {
        this.giftBoxArr = [];
        this.giftGroup = new egret.Sprite();
        this.addChild(this.giftGroup);
        var box = this.dataVo.sData[0];
        var num = this.dataVo.sData[1];
        var cols = Math.sqrt(num);
        var wid = (SpriteUtil.stageWidth - 100) / cols;
        for (var i = 0; i < num; i++) {
            var bag = SpriteUtil.createImage(box);
            var scale = wid / bag.width;
            bag.scaleX = scale;
            bag.scaleY = scale;
            bag.x = wid / 2 + (i % cols) * (wid + 10);
            bag.y = wid / 2 + (wid + 10) * Math.floor(i / cols);
            bag.name = "giftBag_" + i;
            this.giftGroup.addChild(bag);
            bag.touchEnabled = true;
            bag.addEventListener(egret.TouchEvent.TOUCH_TAP, this.giftTap, this);
            this.giftBoxArr.push(bag);
        }
        this.giftGroup.x = SpriteUtil.stageCenterX - this.giftGroup.width / 2;
        this.giftGroup.y = SpriteUtil.stageCenterY - this.giftGroup.height / 2 - 200;
        this.rotatePoint = new egret.Point(SpriteUtil.stageCenterX, SpriteUtil.stageCenterY - 200);
        this.startPoint = new egret.Point(SpriteUtil.stageCenterX, 100);
        this.giftDisplay = SpriteUtil.createImage(this.dataVo.tData);
        this.giftDisplay.scaleX = wid / this.giftDisplay.width / 1.5;
        this.giftDisplay.scaleY = wid / this.giftDisplay.width / 1.5;
        this.giftDisplay.x = SpriteUtil.stageCenterX;
        this.giftDisplay.y = 50;
        this.addChild(this.giftDisplay);
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
        //确定交换时间 写死
        if (num == 9) {
            this.intervalTime = 300;
            this.maxTimes = 25;
        }
        else if (num == 16) {
            this.intervalTime = 200;
            this.maxTimes = 30;
        }
        else {
            this.intervalTime = 180;
            this.maxTimes = 60;
        }
        this.playDrop();
    };
    //放礼物
    Scene_004.prototype.playDrop = function () {
        var _this = this;
        egret.Tween.get(this.giftDisplay).to({ x: this.giftDisplay.x, y: this.startPoint.y }, 500).call(function () {
            egret.startTick(_this.loop, _this);
        }).wait(500);
    };
    Scene_004.prototype.loop = function (timeStamp) {
        var _this = this;
        this.rotateAngle += 0.1;
        var xx = this.startPoint.x - this.rotatePoint.x;
        var yy = this.startPoint.y - this.rotatePoint.y;
        this.giftDisplay.x = xx * Math.cos(this.rotateAngle) - yy * Math.sin(this.rotateAngle) + this.rotatePoint.x;
        this.giftDisplay.y = yy * Math.cos(this.rotateAngle) - xx * Math.sin(this.rotateAngle) + this.rotatePoint.y;
        if (this.rotateAngle > 2 * Math.PI + 2 * Math.PI * Math.random()) {
            egret.stopTick(this.loop, this);
            var point = this.giftGroup.localToGlobal(this.giftBoxArr[this.targetIndex].x, this.giftBoxArr[this.targetIndex].y);
            egret.Tween.get(this.giftDisplay).to({ x: point.x, y: point.y }, 500, egret.Ease.cubicIn).to({ alpha: 0 }, 1000).call(function () {
                egret.Tween.removeTweens(_this.giftDisplay);
                _this.giftDisplay.visible = false;
                _this.randomBox(true);
            });
        }
        return false;
    };
    //随机移动箱子
    Scene_004.prototype.randomBox = function (isbool) {
        var _this = this;
        if (isbool === void 0) { isbool = false; }
        var index1 = Math.random() < 0.2 || isbool ? this.targetIndex : Math.floor(this.giftBoxArr.length * Math.random());
        var index2 = Math.floor(this.giftBoxArr.length * Math.random());
        if (index1 == index2) {
            this.randomBox();
            return;
        }
        this.exchangeTimes++;
        if (this.exchangeTimes >= this.maxTimes) {
            this.isGameStart = true;
            this.timeItem.start();
            return;
        }
        var box1 = this.giftBoxArr[index1];
        var box2 = this.giftBoxArr[index2];
        var point1 = new egret.Point(box1.x, box1.y);
        var point2 = new egret.Point(box2.x, box2.y);
        egret.Tween.get(box1).to({ x: point2.x, y: point2.y }, this.intervalTime);
        egret.Tween.get(box2).to({ x: point1.x, y: point1.y }, this.intervalTime).call(function () {
            var sid = egret.setTimeout(function () {
                egret.clearTimeout(sid);
                _this.randomBox();
            }, _this, 50);
        });
    };
    Scene_004.prototype.giftTap = function (evt) {
        var _this = this;
        if (!this.isGameStart)
            return;
        GameSound.instance().playSound('click');
        var name = evt.target.name;
        if (name.search('giftBag') < 0)
            return;
        this.isGameStart = false;
        var index = evt.target.name.split('_')[1];
        var point = this.giftGroup.localToGlobal(this.giftBoxArr[this.targetIndex].x, this.giftBoxArr[this.targetIndex].y);
        this.giftDisplay.x = point.x;
        this.giftDisplay.y = point.y;
        this.giftDisplay.alpha = 0;
        this.giftDisplay.visible = true;
        if (index == this.targetIndex) {
            var leftTime_1 = this.timeItem.leftTime;
            this.timeItem.stop();
            egret.Tween.get(this.giftDisplay).to({ alpha: 1 }, 300).call(function () {
                egret.Tween.removeTweens(_this.giftDisplay);
                if (leftTime_1 >= 10) {
                    EffectUtil.showResultEffect(EffectUtil.PERFECT);
                }
                else if (leftTime_1 >= 5) {
                    EffectUtil.showResultEffect(EffectUtil.GREAT);
                }
                else {
                    EffectUtil.showResultEffect(EffectUtil.GOOD);
                }
            });
        }
        else {
            this.timeItem.stop();
            egret.Tween.get(this.giftDisplay).to({ alpha: 1 }, 300).call(function () {
                egret.Tween.removeTweens(_this.giftDisplay);
                EffectUtil.showResultEffect();
            });
        }
    };
    Scene_004.prototype.enter = function () {
        _super.prototype.enter.call(this);
        this.targetIndex = Math.floor(this.giftBoxArr.length * Math.random());
        // console.log('targetIndex:'+this.targetIndex);
        this.playDrop();
    };
    Scene_004.prototype.exit = function () {
        egret.Tween.removeAllTweens();
        _super.prototype.exit.call(this);
    };
    return Scene_004;
}(BaseScene));
__reflect(Scene_004.prototype, "Scene_004");
