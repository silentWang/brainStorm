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
//方向敏感度测试 依次出现不同方向的形状 来判断方向
var Scene_023 = (function (_super) {
    __extends(Scene_023, _super);
    function Scene_023() {
        var _this = _super.call(this) || this;
        _this.pools = [];
        _this.deaths = [];
        _this.score = 0;
        _this.isCanOperate = true;
        _this.init();
        return _this;
    }
    Scene_023.prototype.init = function () {
        var up = this.createDirBtn("up");
        var down = this.createDirBtn("down");
        var left = this.createDirBtn("left");
        var right = this.createDirBtn("right");
        up.x = SpriteUtil.stageCenterX;
        up.y = SpriteUtil.stageHeight - up.height * 2.5 - 300;
        down.x = up.x;
        down.y = SpriteUtil.stageHeight - down.height / 2 - 300;
        left.x = SpriteUtil.stageCenterX - left.height;
        left.y = SpriteUtil.stageHeight - left.height * 1.5 - 300;
        right.x = SpriteUtil.stageCenterX + left.height;
        right.y = left.y;
        var bg = SpriteUtil.createImage('together');
        bg.x = SpriteUtil.stageCenterX;
        bg.y = SpriteUtil.stageHeight - left.height * 1.5 - 300;
        bg.scaleX = 1.8;
        bg.scaleY = 1.8;
        bg.alpha = 0.8;
        this.addChild(bg);
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
        this.timeItem.x = SpriteUtil.stageWidth - 300;
        this.scoreItem = new ScoreItem();
        this.addChild(this.scoreItem);
        this.scoreItem.setSTScore(this.score, this.dataVo.tData);
        // this.flyDirection();
        egret.startTick(this.loop, this);
    };
    Scene_023.prototype.loop = function () {
        for (var _i = 0, _a = this.pools; _i < _a.length; _i++) {
            var spr = _a[_i];
            spr.x += this.dataVo.sData;
            if (spr.x > SpriteUtil.stageWidth) {
                egret.stopTick(this.loop, this);
                this.timeItem.stop();
                this.isCanOperate = false;
                EffectUtil.showResultEffect();
                break;
            }
        }
        if (this.pools.length > 0) {
            var lastspr = this.pools[this.pools.length - 1];
            if (lastspr.x >= lastspr.width * 2) {
                this.flyDirection();
            }
        }
        else {
            this.flyDirection();
        }
        return true;
    };
    Scene_023.prototype.flyDirection = function () {
        var fly = this.getPools();
    };
    Scene_023.prototype.getPools = function () {
        var obj = this.getRandomDir();
        if (this.deaths.length > 0) {
            var sprite = this.deaths.shift();
            sprite.rotation = obj.rotation;
            sprite.name = obj.name;
            sprite.x = -sprite.width / 2;
            sprite.visible = true;
            this.pools.push(sprite);
            return sprite;
        }
        var fly = SpriteUtil.createImage("left");
        fly.scaleX = 1.8;
        fly.scaleY = 1.8;
        fly.rotation = obj.rotation;
        fly.name = obj.name;
        fly.y = SpriteUtil.stageCenterY - 200;
        fly.x = -fly.width / 2;
        this.addChild(fly);
        fly.visible = true;
        this.pools.push(fly);
        return fly;
    };
    Scene_023.prototype.getRandomDir = function () {
        var rd = Math.floor(4 * Math.random());
        if (rd == 0) {
            return { rotation: 0, name: "left" };
        }
        else if (rd == 1) {
            return { rotation: 90, name: "up" };
        }
        else if (rd == 2) {
            return { rotation: 180, name: "right" };
        }
        return { rotation: -90, name: "down" };
    };
    Scene_023.prototype.touchHandler = function (evt) {
        if (!this.isCanOperate)
            return;
        GameSound.instance().playSound('click');
        var name = evt.target.name;
        var nowSpr = this.pools.shift();
        if (name == nowSpr.name) {
            this.deaths.push(nowSpr);
            nowSpr.visible = false;
            this.score++;
            this.scoreItem.setSTScore(this.score);
            if (this.score >= this.dataVo.tData) {
                egret.stopTick(this.loop, this);
                this.isCanOperate = false;
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
        }
        else {
            this.isCanOperate = false;
            egret.stopTick(this.loop, this);
            EffectUtil.showResultEffect();
        }
    };
    Scene_023.prototype.createDirBtn = function (name) {
        if (name === void 0) { name = ""; }
        var direction = SpriteUtil.createImage('circle');
        direction.scaleX = 1.8;
        direction.scaleY = 1.8;
        direction.touchEnabled = false;
        var text = new egret.TextField();
        text.size = 80;
        text.bold = true;
        text.textColor = 0xffffff;
        text.stroke = 1;
        text.strokeColor = 0x0000ff;
        if (name == "up") {
            text.text = "上";
        }
        else if (name == "down") {
            text.text = "下";
        }
        else if (name == "left") {
            text.text = "左";
        }
        else if (name == "right") {
            text.text = "右";
        }
        text.anchorOffsetX = text.width / 2;
        text.anchorOffsetY = text.height / 2;
        var sprite = new egret.Sprite();
        sprite.addChild(direction);
        sprite.addChild(text);
        this.addChild(sprite);
        sprite.touchEnabled = true;
        sprite.name = name;
        sprite.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandler, this);
        return sprite;
    };
    Scene_023.prototype.enter = function () {
        _super.prototype.enter.call(this);
        this.timeItem.start();
    };
    return Scene_023;
}(BaseScene));
__reflect(Scene_023.prototype, "Scene_023");
