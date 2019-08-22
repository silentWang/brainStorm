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
//飞刀射木板
var Scene_018 = (function (_super) {
    __extends(Scene_018, _super);
    function Scene_018() {
        var _this = _super.call(this) || this;
        //源飞刀数组
        _this.knifeArr = [];
        //已经插上去的飞刀数组
        _this.hadKnifesArr = [];
        _this.rotateAngle = 0.6;
        _this.currCount = 0;
        _this.init();
        return _this;
    }
    Scene_018.prototype.init = function () {
        //创建刀列  tdata 旋转速度  sdata 数量
        this.rotateAngle = this.dataVo.tData;
        this.currCount = this.dataVo.sData;
        var len = this.dataVo.sData;
        for (var i = 0; i < len; i++) {
            var sprite = this.createKnifes();
            this.knifeArr.push({ sprite: sprite, angle: 0 });
        }
        //木头
        this.rotatePoint = new egret.Point(SpriteUtil.stageCenterX, 400);
        this.startPoint = new egret.Point(SpriteUtil.stageCenterX, 640);
        var image = SpriteUtil.createImage('earth');
        image.x = this.rotatePoint.x;
        image.y = this.rotatePoint.y;
        image.scaleX = 450 / 80;
        image.scaleY = 450 / 80;
        this.addChild(image);
        this.dartSprite = image;
        //
        this.createLeftTxt();
        this.showNext();
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
        egret.startTick(this.loop, this);
    };
    Scene_018.prototype.loop = function (timestamp) {
        if (timestamp === void 0) { timestamp = 0; }
        this.dartSprite.rotation += this.rotateAngle;
        for (var _i = 0, _a = this.hadKnifesArr; _i < _a.length; _i++) {
            var knife = _a[_i];
            knife.sprite.rotation += this.rotateAngle;
            var angle = knife.sprite.rotation * Math.PI / 180;
            var xx = this.startPoint.x - this.rotatePoint.x;
            var yy = this.startPoint.y - this.rotatePoint.y;
            var nx = xx * Math.cos(angle) - yy * Math.sin(angle) + this.rotatePoint.x;
            var ny = yy * Math.cos(angle) - xx * Math.sin(angle) + this.rotatePoint.y;
            knife.sprite.x = nx;
            knife.sprite.y = ny;
        }
        return true;
    };
    Scene_018.prototype.fireKnife = function (evt) {
        var _this = this;
        GameSound.instance().playSound('click');
        this.curKnife.sprite.touchEnabled = false;
        egret.Tween.get(this.curKnife.sprite).to({ y: this.startPoint.y }, 200, egret.Ease.cubicIn).call(function () {
            egret.Tween.removeTweens(_this.curKnife.sprite);
            var rotation = _this.dartSprite.rotation % 360;
            for (var _i = 0, _a = _this.hadKnifesArr; _i < _a.length; _i++) {
                var knife = _a[_i];
                //如果度数差小于12 就说明插不进去
                if (Math.abs(knife.angle - rotation) <= 12) {
                    egret.Tween.get(_this.curKnife.sprite).to({ y: SpriteUtil.stageHeight, rotation: 360 * (2 * Math.random() + 2) }, 3000).call(function () {
                        egret.Tween.removeTweens(_this.curKnife);
                        _this.leftKnifesTxt.text = "";
                        _this.timeItem.stop();
                        EffectUtil.showResultEffect();
                    });
                    return;
                }
            }
            _this.curKnife.angle = rotation;
            _this.hadKnifesArr.push(_this.curKnife);
            _this.showNext();
        }, this);
    };
    Scene_018.prototype.showNext = function () {
        if (this.currCount <= 0) {
            this.leftKnifesTxt.text = "";
            var leftTime = this.timeItem.leftTime;
            this.timeItem.stop();
            if (leftTime >= 2 * this.dataVo.time / 3) {
                EffectUtil.showResultEffect(EffectUtil.PERFECT);
            }
            else if (leftTime >= this.dataVo.time / 3) {
                EffectUtil.showResultEffect(EffectUtil.GREAT);
            }
            else {
                EffectUtil.showResultEffect(EffectUtil.GOOD);
            }
        }
        else {
            this.curKnife = this.knifeArr.pop();
            this.addChildAt(this.curKnife.sprite, 0);
            this.leftKnifesTxt.text = "x" + this.currCount;
            this.currCount--;
        }
    };
    Scene_018.prototype.createLeftTxt = function () {
        this.leftKnifesTxt = new egret.TextField();
        this.leftKnifesTxt.size = 48;
        this.leftKnifesTxt.bold = true;
        this.leftKnifesTxt.textColor = 0x0000ff;
        this.leftKnifesTxt.x = SpriteUtil.stageCenterX + 50;
        this.leftKnifesTxt.y = SpriteUtil.stageCenterY + 270;
        this.addChild(this.leftKnifesTxt);
    };
    //创建刀
    Scene_018.prototype.createKnifes = function () {
        var kspr = SpriteUtil.createImage('tree');
        kspr.x = SpriteUtil.stageCenterX;
        kspr.y = SpriteUtil.stageCenterY + 300;
        kspr.scaleX = 0.8;
        kspr.scaleY = -1;
        kspr.touchEnabled = true;
        kspr.addEventListener(egret.TouchEvent.TOUCH_TAP, this.fireKnife, this);
        return kspr;
    };
    Scene_018.prototype.enter = function () {
        _super.prototype.enter.call(this);
        this.timeItem.start();
    };
    Scene_018.prototype.exit = function () {
        _super.prototype.exit.call(this);
        this.timeItem.stop();
        egret.stopTick(this.loop, this);
    };
    return Scene_018;
}(BaseScene));
__reflect(Scene_018.prototype, "Scene_018");
