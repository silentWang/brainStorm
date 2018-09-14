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
//打小白鼠
var Scene_007 = (function (_super) {
    __extends(Scene_007, _super);
    function Scene_007() {
        var _this = _super.call(this) || this;
        _this.needNums = 0;
        _this.score = 0;
        _this.isOperating = false;
        _this.init();
        return _this;
    }
    Scene_007.prototype.init = function () {
        //时间和分数
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
        this.scoreItem = new ScoreItem();
        this.scoreItem.x = 50;
        this.scoreItem.setSTScore(this.score, this.dataVo.score);
        this.addChild(this.scoreItem);
        this.timeItem.x = SpriteUtil.stageWidth - 300;
        this.needNums = 1;
        this.pointsArr = [];
        for (var i = 0; i < 40; i++) {
            var point = new egret.Point();
            point.x = 90 + 140 * (i % 5);
            point.y = 120 + 120 * Math.floor(i / 5);
            this.pointsArr.push(point);
        }
    };
    Scene_007.prototype.loop = function (time) {
        if (time <= 0) {
            this.isOperating = true;
            this.timeItem.stop();
            return;
        }
        if (time <= 8) {
            this.needNums = 30;
        }
        else if (time <= 10) {
            this.needNums = 20;
        }
        else if (time <= 20) {
            this.needNums = 15;
        }
        else if (time <= 25) {
            this.needNums = 10;
        }
        else {
            this.needNums = 5;
        }
    };
    Scene_007.prototype.showSprites = function (nums) {
        var _this = this;
        var num = 0;
        var randnum = Math.floor(nums * Math.random());
        var arr = this.getRandomPoints(nums);
        var idx = egret.setInterval(function () {
            if (_this.isOperating) {
                egret.clearInterval(idx);
                return;
            }
            var index = Math.floor(_this.dataVo.sData.length * Math.random());
            if (num == randnum) {
                index = 0;
            }
            var spr = _this.getPools(index);
            if (spr.name == '🐁') {
                console.log('ccccccccccccc');
            }
            spr.x = _this.pointsArr[arr[num]].x;
            spr.y = _this.pointsArr[arr[num]].y;
            num++;
            if (num >= nums) {
                egret.clearInterval(idx);
                var xid_1 = egret.setTimeout(function () {
                    egret.clearTimeout(xid_1);
                    if (_this.isOperating)
                        return;
                    for (var _i = 0, _a = _this.pools; _i < _a.length; _i++) {
                        var spr_1 = _a[_i];
                        spr_1.visible = false;
                        spr_1.scaleX = 1;
                        spr_1.scaleY = 1;
                        spr_1.text = '';
                    }
                    _this.showSprites(_this.needNums);
                }, _this, 1000);
            }
        }, this, 100);
    };
    //这个随机不同的逻辑写的不太好
    Scene_007.prototype.getRandomPoints = function (nums) {
        var arr = [];
        while (arr.length < nums) {
            var index = Math.floor(40 * Math.random());
            if (arr.indexOf(index) < 0) {
                arr.push(index);
            }
        }
        return arr;
    };
    Scene_007.prototype.getPools = function (index) {
        var _this = this;
        if (index === void 0) { index = 0; }
        var char = this.dataVo.sData[index];
        var spr;
        if (!this.pools) {
            this.pools = [];
        }
        else {
            for (var _i = 0, _a = this.pools; _i < _a.length; _i++) {
                var item = _a[_i];
                if (!item.visible && item.text == '') {
                    spr = item;
                    break;
                }
            }
        }
        if (!spr) {
            spr = SpriteUtil.createText(char, 100);
            this.pools.push(spr);
            spr.addEventListener(egret.TouchEvent.TOUCH_TAP, function (evt) {
                if (_this.isOperating)
                    return;
                var spr = evt.target;
                if (spr.name == '🐁') {
                    spr.visible = false;
                    spr.scaleX = 1;
                    spr.scaleY = 1;
                    spr.text = '';
                    _this.score++;
                    _this.scoreItem.setSTScore(_this.score);
                    if (_this.scoreItem.isCanPass()) {
                        _this.isOperating = true;
                        var leftTime = _this.timeItem.leftTime;
                        _this.timeItem.stop();
                        if (leftTime >= 10) {
                            EffectUtil.showResultEffect(EffectUtil.PERFECT);
                        }
                        else if (leftTime >= 5) {
                            EffectUtil.showResultEffect(EffectUtil.EXCELLENT);
                        }
                        else {
                            EffectUtil.showResultEffect(EffectUtil.GOOD);
                        }
                    }
                }
                else {
                    _this.timeItem.stop();
                    _this.isOperating = true;
                    EffectUtil.showResultEffect();
                }
            }, this);
        }
        else {
            spr.text = char;
            spr.visible = true;
        }
        spr.touchEnabled = true;
        spr.name = char;
        this.addChild(spr);
        return spr;
    };
    Scene_007.prototype.enter = function () {
        _super.prototype.enter.call(this);
        this.timeItem.start(this.loop, this);
        this.showSprites(this.needNums);
    };
    Scene_007.prototype.exit = function () {
        _super.prototype.exit.call(this);
        this.timeItem.stop();
    };
    return Scene_007;
}(BaseScene));
__reflect(Scene_007.prototype, "Scene_007");
//# sourceMappingURL=Scene_007.js.map