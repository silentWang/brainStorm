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
        //交换次数
        _this.exchangeTimes = 0;
        _this.isGameStart = false;
        _this.init();
        return _this;
    }
    Scene_004.prototype.init = function () {
        this.giftBoxArr = [];
        this.giftGroup = new egret.Sprite();
        this.giftGroup.x = 200;
        this.giftGroup.y = 300;
        this.addChild(this.giftGroup);
        for (var i = 0; i < 16; i++) {
            var bag = SpriteUtil.createText(this.dataVo.sData, 100);
            bag.x = (i % 4) * 110;
            bag.y = 110 * Math.floor(i / 4);
            bag.name = "giftBag_" + i;
            this.giftGroup.addChild(bag);
            bag.touchEnabled = true;
            bag.addEventListener(egret.TouchEvent.TOUCH_TAP, this.giftTap, this);
            this.giftBoxArr.push(bag);
        }
        this.rotatePoint = new egret.Point(SpriteUtil.stageCenterX, 450);
        this.startPoint = new egret.Point(SpriteUtil.stageCenterX, 150);
        this.giftDisplay = SpriteUtil.createText(this.dataVo.tData, 60);
        this.giftDisplay.x = SpriteUtil.stageCenterX;
        this.giftDisplay.y = 50;
        this.addChild(this.giftDisplay);
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
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
                _this.randomBox();
            });
        }
        return false;
    };
    //随机移动箱子
    Scene_004.prototype.randomBox = function () {
        var _this = this;
        var index1 = Math.floor(this.giftBoxArr.length * Math.random());
        var index2 = Math.floor(this.giftBoxArr.length * Math.random());
        console.log(index1 + "," + index2);
        if (index1 == index2) {
            this.randomBox();
            return;
        }
        this.exchangeTimes++;
        if (this.exchangeTimes >= 50) {
            this.isGameStart = true;
            this.timeItem.start();
            return;
        }
        var box1 = this.giftBoxArr[index1];
        var box2 = this.giftBoxArr[index2];
        var point1 = new egret.Point(box1.x, box1.y);
        var point2 = new egret.Point(box2.x, box2.y);
        egret.Tween.get(box1).to({ x: point2.x, y: point2.y }, 120);
        egret.Tween.get(box2).to({ x: point1.x, y: point1.y }, 120).call(function () {
            var sid = egret.setTimeout(function () {
                egret.clearTimeout(sid);
                _this.randomBox();
            }, _this, 50);
        });
    };
    Scene_004.prototype.giftTap = function (evt) {
        if (!this.isGameStart)
            return;
        var name = evt.target.name;
        if (name.search('giftBag') < 0)
            return;
        this.isGameStart = false;
        var index = evt.target.name.split('_')[1];
        this.timeItem.stop();
        if (index == this.targetIndex) {
            if (this.timeItem.leftTime >= 10) {
                EffectUtil.showResultEffect(EffectUtil.PERFECT);
            }
            else if (this.timeItem.leftTime >= 5) {
                EffectUtil.showResultEffect(EffectUtil.EXCELLENT);
            }
            else {
                EffectUtil.showResultEffect(EffectUtil.GOOD);
            }
            this.timeItem.stop();
        }
        else {
            EffectUtil.showResultEffect();
        }
    };
    Scene_004.prototype.enter = function () {
        _super.prototype.enter.call(this);
        this.targetIndex = Math.floor(this.giftBoxArr.length * Math.random());
        console.log('targetIndex:' + this.targetIndex);
        this.playDrop();
    };
    Scene_004.prototype.exit = function () {
        egret.Tween.removeAllTweens();
        _super.prototype.exit.call(this);
    };
    return Scene_004;
}(BaseScene));
__reflect(Scene_004.prototype, "Scene_004");
//# sourceMappingURL=Scene_004.js.map