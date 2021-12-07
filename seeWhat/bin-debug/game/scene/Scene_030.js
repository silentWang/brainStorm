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
//点破小球
var Scene_030 = (function (_super) {
    __extends(Scene_030, _super);
    function Scene_030() {
        var _this = _super.call(this) || this;
        _this.pointsArr = [];
        _this.init();
        return _this;
    }
    Scene_030.prototype.init = function () {
        //sData 0 初始球的数量 1 每次分裂个数 tData 爆破次数
        this.createBalls();
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
    };
    Scene_030.prototype.createBalls = function () {
        for (var i = 0; i < this.dataVo.sData[0]; i++) {
            var ball = SpriteUtil.createCircle(80, this.getColor());
            ball.x = SpriteUtil.stageCenterX;
            ball.y = SpriteUtil.stageCenterY;
            this.addChild(ball);
            ball.name = "first_" + this.dataVo.tData;
            ball.touchEnabled = true;
            ball.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandler, this);
            this.playAnim(ball);
        }
    };
    Scene_030.prototype.touchHandler = function (evt) {
        var _this = this;
        if (this.timeItem.leftTime <= 0)
            return;
        var ball = evt.target;
        var name = ball.name.split("_")[0];
        var index = ball.name.split("_")[1];
        if (name == "first") {
            var x = ball.x;
            var y = ball.y;
            var wid = ball.width;
            this.removeChild(ball);
            egret.Tween.removeTweens(ball);
            if (index > 0) {
                var points = this.calculateAngle(wid, x, y, this.dataVo.sData[1]);
                var obj = {
                    x: x,
                    y: y,
                    radius: wid / 3,
                    points: points
                };
                index--;
                this.playExplosion(obj, name + "_" + index);
            }
            else {
                var points = this.calculateAngle(wid, x, y, 50);
                var obj = {
                    x: x,
                    y: y,
                    radius: wid / 50,
                    points: points,
                    num: 50
                };
                this.playDestroy(obj).then(function () {
                    _this.checkResult();
                });
            }
        }
    };
    Scene_030.prototype.checkResult = function () {
        if (this.numChildren == 1) {
            var leftTime = this.timeItem.leftTime;
            this.timeItem.stop();
            if (leftTime >= this.dataVo.time * 2 / 3) {
                EffectUtil.showResultEffect(EffectUtil.PERFECT);
            }
            else if (leftTime >= this.dataVo.time / 3) {
                EffectUtil.showResultEffect(EffectUtil.GREAT);
            }
            else {
                EffectUtil.showResultEffect(EffectUtil.GOOD);
            }
        }
    };
    Scene_030.prototype.playExplosion = function (obj, name) {
        var _this = this;
        var num = this.dataVo.sData[1];
        var i = 0;
        var points = obj.points;
        var _loop_1 = function () {
            var ball = SpriteUtil.createCircle(obj.radius, this_1.getColor());
            this_1.addChild(ball);
            ball.touchEnabled = true;
            ball.x = obj.x;
            ball.y = obj.y;
            ball.name = name;
            ball.addEventListener(egret.TouchEvent.TOUCH_TAP, this_1.touchHandler, this_1);
            var pt = points[i % num];
            egret.Tween.get(ball).to({ x: pt.x, y: pt.y }, 800, egret.Ease.circOut).call(function () {
                egret.Tween.removeTweens(ball);
                _this.playAnim(ball);
            });
            i++;
        };
        var this_1 = this;
        while (i < num) {
            _loop_1();
        }
    };
    //不可分裂的直接爆掉
    Scene_030.prototype.playDestroy = function (obj) {
        var _this = this;
        var p = new Promise(function (resolve, reject) {
            var num = obj.num;
            var i = 0;
            var points = obj.points;
            var _loop_2 = function () {
                var ball = SpriteUtil.createCircle(obj.radius, _this.getColor());
                _this.addChild(ball);
                ball.x = obj.x;
                ball.y = obj.y;
                var pt = points[i % num];
                egret.Tween.get(ball).to({ x: pt.x, y: pt.y }, 300, egret.Ease.circOut).call(function () {
                    egret.Tween.removeTweens(ball);
                    _this.removeChild(ball);
                    if (i == num) {
                        resolve();
                    }
                });
                i++;
            };
            while (i < num) {
                _loop_2();
            }
        });
        return p;
    };
    Scene_030.prototype.calculateAngle = function (wid, x, y, num) {
        var angle = 360 / num;
        var points = [];
        for (var i = 0; i < num; i++) {
            var xx = x + 2 * wid * Math.cos(i * angle / Math.PI);
            var yy = y - 2 * wid * Math.sin(i * angle / Math.PI);
            points.push({ x: xx, y: yy });
        }
        return points;
    };
    Scene_030.prototype.playAnim = function (ball) {
        var _this = this;
        egret.Tween.get(ball).to({
            x: ball.width / 2 + (SpriteUtil.stageWidth - ball.width) * Math.random(),
            y: ball.width / 2 + (SpriteUtil.stageHeight - 400) * Math.random()
        }, 2000).call(function () {
            egret.Tween.removeTweens(ball);
            _this.playAnim(ball);
        });
    };
    Scene_030.prototype.getColor = function () {
        var colors = [0xff0000, 0xffff00, 0x551A8B, 0x0000ff, 0xff00ff, 0xffffff, 0x000000];
        var index = Math.floor(colors.length * Math.random());
        return colors[index];
    };
    Scene_030.prototype.enter = function () {
        _super.prototype.enter.call(this);
        this.timeItem.start();
    };
    return Scene_030;
}(BaseScene));
__reflect(Scene_030.prototype, "Scene_030");
//# sourceMappingURL=Scene_030.js.map