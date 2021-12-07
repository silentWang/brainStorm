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
//flappy bird
var Scene_016 = (function (_super) {
    __extends(Scene_016, _super);
    function Scene_016() {
        var _this = _super.call(this) || this;
        _this.isCanOperate = true;
        _this.score = 0;
        _this.intervalId = 0;
        _this.init();
        return _this;
    }
    Scene_016.prototype.init = function () {
        var _this = this;
        //datavo time代表出现墙的频率 单位毫秒   sdata表示player皮肤  tdata 速度
        var shape = new egret.Shape();
        shape.graphics.beginFill(0x00ff00, 0.01);
        shape.graphics.drawRect(0, 0, SpriteUtil.stageWidth, SpriteUtil.stageHeight);
        shape.graphics.endFill();
        this.addChild(shape);
        //初始画引擎部分
        this.engine = Matter.Engine.create({ enableSleeping: false }, null);
        this.runner = Matter.Runner.create(null);
        this.runner.isFixed = true;
        var render = EgretRender.create({
            engine: this.engine,
            container: this,
            options: {
                width: SpriteUtil.stageWidth,
                height: SpriteUtil.stageHeight,
                wireframes: true
            }
        });
        Matter.Runner.run(this.runner, this.engine);
        EgretRender.run(render);
        this.engine.world.gravity.y = 1;
        var bspr = SpriteUtil.createImage(this.dataVo.sData);
        var body = Matter.Bodies.rectangle(SpriteUtil.stageCenterX, 500, bspr.width - 20, bspr.height - 20, {
            label: 'bird',
            render: {
                sprite: bspr
            }
        });
        this.birdBody = body;
        Matter.World.add(this.engine.world, body);
        Matter.Events.on(this.engine, "collisionStart", this.collisionStart.bind(this));
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.tapMakeBirdFly, this);
        this.intervalId = egret.setInterval(function () {
            _this.createAWall();
        }, this, this.dataVo.time);
        this.beforeUpdateFun = function () {
            if (_this.birdBody.position.y >= SpriteUtil.stageHeight) {
                _this.birdBody.isStatic = true;
                _this.destroy();
                _this.checkResult();
                return;
            }
            if (!_this.isCanOperate)
                return;
            if (!_this.wallArr || _this.wallArr.length == 0)
                return;
            for (var _i = 0, _a = _this.wallArr; _i < _a.length; _i++) {
                var body_1 = _a[_i];
                var body1 = body_1.body1;
                var body2 = body_1.body2;
                var xx = body1.position.x;
                xx -= _this.dataVo.tData;
                Matter.Body.setPosition(body1, { x: xx, y: body1.position.y });
                Matter.Body.setPosition(body2, { x: xx, y: body2.position.y });
            }
        };
        Matter.Events.on(this.engine, 'beforeUpdate', this.beforeUpdateFun);
        this.scoreItem = new ScoreItem();
        this.addChild(this.scoreItem);
        this.scoreItem.setSTScore(this.score, this.dataVo.score);
        this.createAWall();
    };
    Scene_016.prototype.collisionStart = function (evt) {
        var pairs = evt.pairs;
        for (var _i = 0, pairs_1 = pairs; _i < pairs_1.length; _i++) {
            var pair = pairs_1[_i];
            if (pair.bodyA.label == "bird" || pair.bodyB.label == "bird") {
                this.isCanOperate = false;
                this.checkResult();
            }
        }
    };
    Scene_016.prototype.tapMakeBirdFly = function (evt) {
        if (!this.isCanOperate)
            return;
        GameSound.instance().playSound('click');
        Matter.Body.setVelocity(this.birdBody, { x: 0, y: -8 });
    };
    //创建墙壁
    Scene_016.prototype.createAWall = function () {
        if (!this.wallArr) {
            this.wallArr = [];
        }
        var rand = this.score % 2 == 0 ? true : false;
        var xx = SpriteUtil.stageWidth + 200;
        var len = this.wallArr.length;
        for (var i = len - 1; i >= 0; i--) {
            var body1_1 = this.wallArr[i].body1;
            var body2_1 = this.wallArr[i].body2;
            if (body1_1.position.x <= -body1_1.render.sprite.width) {
                Matter.World.remove(this.engine.world, [body1_1, body2_1], 0);
                this.removeChild(body1_1.render.sprite);
                this.removeChild(body2_1.render.sprite);
                this.wallArr.splice(i, 1);
                this.score++;
                this.scoreItem.setSTScore(this.score);
            }
        }
        var swid = 80 + 120 * Math.random();
        var kspr1 = SpriteUtil.createRect(swid, 550, 0xffffff * Math.random());
        var body1 = Matter.Bodies.rectangle(xx, 75 + 200 * Math.random(), kspr1.width, kspr1.height, {
            label: 'wall',
            isStatic: true,
            render: {
                sprite: kspr1
            }
        });
        var kspr2 = SpriteUtil.createRect(swid, 550, 0xffffff * Math.random());
        var body2 = Matter.Bodies.rectangle(xx, SpriteUtil.stageHeight - 75 - 200 * Math.random(), kspr2.width, kspr2.height, {
            label: 'wall',
            isStatic: true,
            render: {
                sprite: kspr2
            }
        });
        this.wallArr.push({ body1: body1, body2: body2 });
        Matter.World.add(this.engine.world, [body1, body2]);
    };
    Scene_016.prototype.checkResult = function () {
        this.birdBody.isStatic = true;
        this.destroy();
        if (this.scoreItem.isCanPass()) {
            var mid = this.score - this.dataVo.score;
            if (mid >= 15) {
                EffectUtil.showResultEffect(EffectUtil.PERFECT);
            }
            else if (mid >= 10) {
                EffectUtil.showResultEffect(EffectUtil.GREAT);
            }
            else {
                EffectUtil.showResultEffect(EffectUtil.GOOD);
            }
        }
        else {
            EffectUtil.showResultEffect();
        }
    };
    Scene_016.prototype.destroy = function () {
        this.isCanOperate = false;
        egret.clearInterval(this.intervalId);
        Matter.Runner.stop(this.runner);
        EgretRender.stop();
        Matter.Engine.clear(this.engine);
        Matter.Events.off(this.engine, "collisionStart", this.collisionStart);
        Matter.Events.off(this.engine, "beforeUpdate", this.beforeUpdateFun);
        Matter.World.remove(this.engine.world, this.engine.world.bodies, 0);
    };
    Scene_016.prototype.exit = function () {
        this.destroy();
        _super.prototype.exit.call(this);
    };
    return Scene_016;
}(BaseScene));
__reflect(Scene_016.prototype, "Scene_016");
//# sourceMappingURL=Scene_016.js.map