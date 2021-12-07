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
//颜色 红色 绿色 
var Scene_032 = (function (_super) {
    __extends(Scene_032, _super);
    function Scene_032() {
        var _this = _super.call(this) || this;
        _this.curIndex = -1;
        _this.colors = [];
        _this.balls = [];
        _this.score = 0;
        _this.isCanOperate = true;
        _this.init();
        return _this;
    }
    Scene_032.prototype.init = function () {
        this.colors = [0xff0000, 0xffff00, 0xff7d00, 0x0000ff, 0xff00ff, 0x00ffff, 0x000000];
        var text = SpriteUtil.createText("红", 160);
        text.x = SpriteUtil.stageCenterX;
        text.y = SpriteUtil.stageCenterY;
        this.addChild(text);
        this.titleTxt = text;
        this.next();
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
        this.timeItem.x = SpriteUtil.stageWidth - 250;
        this.scoreItem = new ScoreItem();
        this.scoreItem.setSTScore(this.score, this.dataVo.tData);
        this.addChild(this.scoreItem);
    };
    Scene_032.prototype.touchHandler = function (evt) {
        if (!this.isCanOperate)
            return;
        var ball = evt.target;
        var index = ball.name.split("_")[1];
        if (this.curIndex == index) {
            this.score++;
            this.scoreItem.setSTScore(this.score);
            if (this.scoreItem.isCanPass()) {
                this.timeItem.stop();
                this.clear();
                EffectUtil.showResultEffect(EffectUtil.PERFECT);
                this.isCanOperate = false;
                return;
            }
            this.next();
        }
        else {
            this.timeItem.stop();
            this.isCanOperate = false;
            EffectUtil.showResultEffect();
        }
    };
    Scene_032.prototype.next = function () {
        var obj = this.getTxtColor();
        this.curIndex = obj.index;
        this.titleTxt.textColor = obj.color;
        this.titleTxt.text = obj.name;
        this.createBalls(obj.index);
    };
    Scene_032.prototype.createBalls = function (index) {
        var _this = this;
        this.clear();
        var len = this.dataVo.sData;
        var _loop_1 = function (i) {
            var ball = SpriteUtil.createCircle(30 + 50 * Math.random(), this_1.colors[i]);
            ball.x = ball.width / 2 + (SpriteUtil.stageWidth - ball.width) * Math.random();
            ball.y = ball.width / 2 + (SpriteUtil.stageHeight - 400) * Math.random();
            this_1.addChild(ball);
            ball.alpha = 0.8;
            ball.name = "color_" + i;
            ball.touchEnabled = true;
            ball.addEventListener(egret.TouchEvent.TOUCH_TAP, this_1.touchHandler, this_1);
            ball.scaleX = 0;
            ball.scaleY = 0;
            this_1.balls.push(ball);
            egret.Tween.get(ball).to({ scaleX: 1, scaleY: 1 }, 200).call(function () {
                egret.Tween.removeTweens(ball);
                _this.playAnim(ball);
            });
        };
        var this_1 = this;
        for (var i = 0; i < len; i++) {
            _loop_1(i);
        }
    };
    Scene_032.prototype.clear = function () {
        for (var i = 0; i < this.balls.length; i++) {
            egret.Tween.removeTweens(this.balls[i]);
            this.removeChild(this.balls[i]);
        }
        this.balls.length = 0;
    };
    Scene_032.prototype.playAnim = function (ball) {
        var _this = this;
        egret.Tween.get(ball).to({
            x: ball.width / 2 + (SpriteUtil.stageWidth - ball.width) * Math.random(),
            y: ball.width / 2 + (SpriteUtil.stageHeight - 400) * Math.random()
        }, 2000).call(function () {
            egret.Tween.removeTweens(ball);
            _this.playAnim(ball);
        });
    };
    Scene_032.prototype.enter = function () {
        _super.prototype.enter.call(this);
        this.timeItem.start();
    };
    Scene_032.prototype.getTxtColor = function () {
        var index = Math.floor(this.colors.length * Math.random());
        var names = ["红", "黄", "橙", "蓝", "紫", "青", "黑"];
        var sindex = Math.floor(this.dataVo.sData * Math.random());
        return { index: sindex, color: this.colors[index], name: names[sindex] };
    };
    return Scene_032;
}(BaseScene));
__reflect(Scene_032.prototype, "Scene_032");
//# sourceMappingURL=Scene_032.js.map