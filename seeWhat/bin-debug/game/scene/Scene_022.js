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
//记忆力能力 首先出现一个球 然后出现第二个 以此类推
var Scene_022 = (function (_super) {
    __extends(Scene_022, _super);
    function Scene_022() {
        var _this = _super.call(this) || this;
        _this.pointsArr = [];
        _this.score = 0;
        _this.curCnt = 0;
        _this.init();
        return _this;
    }
    Scene_022.prototype.init = function () {
        //sdata 代表一次出现的数量  tdata代表目标分数
        this.sContainer = new egret.Sprite();
        this.addChild(this.sContainer);
        var rect = SpriteUtil.createRect(SpriteUtil.stageWidth, SpriteUtil.stageHeight, 0x000000);
        rect.x = SpriteUtil.stageCenterX;
        rect.y = SpriteUtil.stageCenterY;
        this.addChild(rect);
        rect.alpha = 0;
        this.blackBg = rect;
        this.scoreItem = new ScoreItem();
        this.scoreItem.setSTScore(this.score, this.dataVo.tData);
        this.addChild(this.scoreItem);
        this.timeItem = new TimeItem(this.dataVo.time);
        this.timeItem.x = SpriteUtil.stageWidth - 300;
        this.addChild(this.timeItem);
        var h = Math.floor(SpriteUtil.stageWidth - 100) / 100;
        var v = Math.floor(SpriteUtil.stageHeight - 480) / 100;
        for (var i = 0; i < h * v; i++) {
            var point = new egret.Point(50 + (i % h) * 100, 180 + Math.floor(i / h) * 100);
            this.pointsArr.push(point);
        }
        this.next();
    };
    Scene_022.prototype.next = function () {
        var _this = this;
        egret.Tween.get(this.blackBg).to({ alpha: 1 }, 250).call(function () {
            _this.nextHandler();
            egret.Tween.get(_this.blackBg).to({ alpha: 0 }, 250).call(function () {
                egret.Tween.removeTweens(_this.blackBg);
            });
        });
    };
    Scene_022.prototype.nextHandler = function () {
        var len = this.dataVo.sData;
        for (var i = 0; i < len; i++) {
            this.createShape();
        }
    };
    Scene_022.prototype.createShape = function () {
        var num = Math.floor(3 * Math.random());
        var shape;
        var w = 30 + 20 * Math.random();
        if (this.dataVo.level == 5) {
            num = 1;
        }
        else if (this.dataVo.level == 6) {
            num = 0;
        }
        else if (this.dataVo.level >= 3) {
            num = Math.floor(2 * Math.random());
        }
        if (num == 0) {
            shape = SpriteUtil.createCircle(w, this.getSevenColor());
        }
        else if (num == 1) {
            shape = SpriteUtil.createRect(w * 2, w * 2, this.getSevenColor());
        }
        else if (num == 2) {
            shape = SpriteUtil.createPolygon([0, 0, w, w, w, -w], this.getSevenColor());
        }
        shape.rotation = 360 * Math.random();
        var index = Math.floor(this.pointsArr.length * Math.random());
        var point = this.pointsArr.splice(index, 1)[0];
        shape.x = point.x;
        shape.y = point.y;
        this.sContainer.addChild(shape);
        shape.name = "target";
        shape.touchEnabled = true;
        shape.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandler, this);
    };
    Scene_022.prototype.touchHandler = function (e) {
        if (this.timeItem.leftTime <= 0)
            return;
        GameSound.instance().playSound("click");
        var target = e.target;
        if (target.name == "target") {
            target.name = "passed";
            this.score++;
            this.scoreItem.setSTScore(this.score);
            if (this.score >= this.dataVo.tData) {
                var time = this.timeItem.leftTime;
                this.timeItem.stop();
                if (time >= this.dataVo.time * 2 / 3) {
                    EffectUtil.showResultEffect(EffectUtil.PERFECT);
                }
                else if (time >= this.dataVo.time / 3) {
                    EffectUtil.showResultEffect(EffectUtil.GREAT);
                }
                else {
                    EffectUtil.showResultEffect(EffectUtil.GOOD);
                }
            }
            else {
                this.curCnt++;
                if (this.curCnt >= this.dataVo.sData) {
                    this.curCnt = 0;
                    this.next();
                }
            }
        }
        else if (target.name == "passed") {
            this.timeItem.stop();
            EffectUtil.showResultEffect();
        }
    };
    Scene_022.prototype.getSevenColor = function () {
        var random = 0;
        var arr = [0xFF0000, 0xFF7F00, 0xFFFF00, 0x0000FF, 0x8B00FF, 0xFF00FF, 0xEED2EE];
        if (this.dataVo.level == 1) {
            random = Math.floor(7 * Math.random());
        }
        else if (this.dataVo.level == 2) {
            random = Math.floor(5 * Math.random());
        }
        else if (this.dataVo.level == 3) {
            random = Math.floor(3 * Math.random());
        }
        else if (this.dataVo.level == 4) {
            random = 5;
        }
        else if (this.dataVo.level == 5) {
            random = 6;
        }
        return arr[random];
    };
    Scene_022.prototype.enter = function () {
        _super.prototype.enter.call(this);
        this.timeItem.start();
    };
    return Scene_022;
}(BaseScene));
__reflect(Scene_022.prototype, "Scene_022");
