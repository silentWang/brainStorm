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
//绕圈小球
var Scene_031 = (function (_super) {
    __extends(Scene_031, _super);
    function Scene_031() {
        var _this = _super.call(this) || this;
        _this.ballAngle = 0;
        _this.curIndex = 0;
        _this.enemies = [];
        _this.score = 0;
        _this.direction = 1;
        _this.init();
        return _this;
    }
    Scene_031.prototype.init = function () {
        //sData 颜色数量<=7 tData 目标分（转一圈一分）  extData: num 出现球的数量 speed 速度 rate出现回头的概率
        var bg = SpriteUtil.createRect(SpriteUtil.stageWidth, SpriteUtil.stageHeight, 0x000000);
        bg.alpha = 0.01;
        bg.x = SpriteUtil.stageCenterX;
        bg.y = SpriteUtil.stageCenterY;
        this.addChild(bg);
        bg.touchEnabled = true;
        bg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandler, this);
        var sprite = new egret.Sprite();
        sprite.graphics.beginFill(0x000000, 0.01);
        sprite.graphics.lineStyle(2, 0xF8F8FF);
        sprite.graphics.drawCircle(0, 0, 300);
        sprite.x = SpriteUtil.stageCenterX;
        sprite.y = SpriteUtil.stageCenterY;
        this.addChild(sprite);
        this.startPt = new egret.Point(sprite.x + sprite.width / 2, sprite.y);
        this.createBall();
        this.createEnemy();
        this.scoreItem = new ScoreItem();
        this.addChild(this.scoreItem);
        this.scoreItem.setSTScore(this.score, this.dataVo.tData);
        egret.startTick(this.loop, this);
    };
    Scene_031.prototype.loop = function (timestamp) {
        var xx = this.startPt.x - SpriteUtil.stageCenterX;
        var yy = this.startPt.y - SpriteUtil.stageCenterY;
        this.ball.x = xx * Math.cos(this.ballAngle) - yy * Math.sin(this.ballAngle) + SpriteUtil.stageCenterX;
        this.ball.y = yy * Math.cos(this.ballAngle) + xx * Math.sin(this.ballAngle) + SpriteUtil.stageCenterY;
        this.ballAngle += this.dataVo.extData.speed * this.direction * Math.PI / 180 / 2;
        if (Math.abs(this.ballAngle) >= 2 * Math.PI) {
            this.ballAngle = this.ballAngle % (2 * Math.PI);
        }
        var len = this.enemies.length;
        if (len == 0) {
            this.createEnemy();
            return;
        }
        for (var i = len - 1; i >= 0; i--) {
            var obj = this.enemies[i];
            var abs = Math.abs(this.ballAngle - obj.angle);
            if (obj.index == 10000) {
                obj.shape.rotation += -1 * this.direction;
            }
            if (abs < 5 * Math.PI / 180 || Math.abs(abs - 2 * Math.PI) < 5 * Math.PI / 180) {
                if (this.curIndex == obj.index) {
                    this.removeChild(obj.shape);
                    this.enemies.splice(i, 1);
                    this.score++;
                    this.scoreItem.setSTScore(this.score);
                    if (this.scoreItem.isCanPass()) {
                        egret.stopTick(this.loop, this);
                        EffectUtil.showResultEffect(EffectUtil.PERFECT);
                        break;
                    }
                }
                else if (obj.index == 10000) {
                    this.direction = -1 * this.direction;
                    this.removeChild(obj.shape);
                    this.enemies.splice(i, 1);
                }
                else {
                    egret.stopTick(this.loop, this);
                    this.removeChild(this.ball);
                    var points = this.calculateAngle(40, this.ball.x, this.ball.y, 50);
                    this.playDestroy({ x: this.ball.x, y: this.ball.y, num: 50, radius: 2, points: points }).then(function () {
                        EffectUtil.showResultEffect();
                    });
                }
            }
        }
        return false;
    };
    Scene_031.prototype.createBall = function () {
        var len = this.dataVo.sData;
        var sprite = new egret.Sprite();
        var colors = [0xff0000, 0xffff00, 0xff7d00, 0x0000ff, 0xff00ff, 0x00ffff, 0x000000];
        for (var i = 0; i < len; i++) {
            var shp = new egret.Shape();
            shp.graphics.beginFill(colors[i]);
            shp.graphics.drawCircle(0, 0, 20);
            shp.graphics.endFill();
            shp.visible = (this.curIndex == i);
            sprite.addChild(shp);
        }
        this.ball = sprite;
        this.ball.x = this.startPt.x;
        this.ball.y = this.startPt.y;
        this.addChild(this.ball);
        var btn = new egret.Sprite();
        for (var i = 0; i < len; i++) {
            var shp = new egret.Shape();
            shp.graphics.beginFill(colors[i]);
            shp.graphics.drawCircle(0, 0, 180);
            shp.graphics.endFill();
            btn.addChild(shp);
            shp.visible = (this.curIndex == i);
        }
        btn.x = SpriteUtil.stageCenterX;
        btn.y = SpriteUtil.stageCenterY;
        this.addChild(btn);
        btn.touchEnabled = true;
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandler, this);
        this.ballBtn = btn;
    };
    Scene_031.prototype.touchHandler = function (evt) {
        this.curIndex++;
        if (this.curIndex >= this.dataVo.sData) {
            this.curIndex = 0;
        }
        for (var i = 0; i < this.ball.numChildren; i++) {
            this.ball.$children[i].visible = i == this.curIndex;
            this.ballBtn.$children[i].visible = i == this.curIndex;
        }
    };
    Scene_031.prototype.createEnemy = function () {
        var len = this.dataVo.sData;
        var colors = [0xff0000, 0xffff00, 0xff7d00, 0x0000ff, 0xff00ff, 0x00ffff, 0x000000];
        var xx = this.startPt.x - SpriteUtil.stageCenterX;
        var yy = this.startPt.y - SpriteUtil.stageCenterY;
        var num = this.dataVo.extData.num;
        var rate = this.dataVo.extData.rate * 100;
        var rand = Math.ceil(100 * Math.random());
        var bnm = rand < rate ? Math.floor(num * Math.random()) : -1;
        for (var i = 0; i < num; i++) {
            if (i == bnm) {
                var img = SpriteUtil.createImage("refresh");
                var angle = (this.ballAngle + (50 * (i + 1) + 30 * Math.random()) * Math.PI / 180) % (2 * Math.PI);
                var sprite = new egret.Sprite();
                sprite.graphics.beginFill(0x00ff00);
                sprite.graphics.drawCircle(0, 0, img.width / 2 + 5);
                sprite.graphics.endFill();
                sprite.addChild(img);
                var scale = 2 * 20 / sprite.width;
                sprite.scaleX = scale;
                sprite.scaleY = scale;
                sprite.x = xx * Math.cos(angle) - yy * Math.sin(angle) + SpriteUtil.stageCenterX;
                sprite.y = yy * Math.cos(angle) + xx * Math.sin(angle) + SpriteUtil.stageCenterY;
                this.enemies.push({ index: 10000, angle: angle, shape: sprite });
                this.addChild(sprite);
                num++;
            }
            else {
                var shp = new egret.Shape();
                var index = Math.floor(len * Math.random());
                shp.graphics.beginFill(colors[index]);
                shp.graphics.drawCircle(0, 0, 20 + 10 * Math.random());
                shp.graphics.endFill();
                var angle = (this.ballAngle + (60 * (i + 1) + 30 * Math.random()) * Math.PI / 180) % (2 * Math.PI);
                shp.x = xx * Math.cos(angle) - yy * Math.sin(angle) + SpriteUtil.stageCenterX;
                shp.y = yy * Math.cos(angle) + xx * Math.sin(angle) + SpriteUtil.stageCenterY;
                this.enemies.push({ index: index, angle: angle, shape: shp });
                this.addChild(shp);
                this.playAnim(shp).then(function () {
                    console.log("good");
                });
            }
        }
    };
    Scene_031.prototype.playAnim = function (target) {
        var p = new Promise(function (resolve, reject) {
            target.scaleX = 0;
            target.scaleY = 0;
            egret.Tween.get(target).to({ scaleX: 1, scaleY: 1 }, 200).call(function () {
                egret.Tween.removeTweens(target);
            });
        });
        return p;
    };
    Scene_031.prototype.playDestroy = function (obj) {
        var _this = this;
        var p = new Promise(function (resolve, reject) {
            var num = obj.num;
            var i = 0;
            var points = obj.points;
            var _loop_1 = function () {
                var ball = SpriteUtil.createCircle(obj.radius + obj.radius * Math.random(), _this.getColor());
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
                _loop_1();
            }
        });
        return p;
    };
    Scene_031.prototype.calculateAngle = function (wid, x, y, num) {
        var angle = 360 / num;
        var points = [];
        for (var i = 0; i < num; i++) {
            var xx = x + 3 * wid * Math.random() * Math.cos(i * angle / Math.PI);
            var yy = y - 3 * wid * Math.random() * Math.sin(i * angle / Math.PI);
            points.push({ x: xx, y: yy });
        }
        return points;
    };
    Scene_031.prototype.getColor = function () {
        var colors = [0xff0000, 0xffff00, 0xff7d00, 0x0000ff, 0xff00ff, 0x00ffff, 0x000000];
        var index = Math.floor(colors.length * Math.random());
        return colors[index];
    };
    return Scene_031;
}(BaseScene));
__reflect(Scene_031.prototype, "Scene_031");
//# sourceMappingURL=Scene_031.js.map