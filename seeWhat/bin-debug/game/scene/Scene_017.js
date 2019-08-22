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
//堆箱子
var Scene_017 = (function (_super) {
    __extends(Scene_017, _super);
    function Scene_017() {
        var _this = _super.call(this) || this;
        _this.isCanOperate = true;
        //丢掉的箱子
        _this.loseCnt = 0;
        //已使用的箱子
        _this.usedCnt = 0;
        _this.intervalId = 0;
        _this.init();
        return _this;
    }
    Scene_017.prototype.init = function () {
        var _this = this;
        //sdata最多丢弃箱子的数目  tdata目标堆积的箱子数目 score:箱子总数 time:单位毫秒代表箱子移动周期时间
        var shape = new egret.Shape();
        shape.graphics.beginFill(0x00ff00, 0.01);
        shape.graphics.drawRect(0, 0, SpriteUtil.stageWidth, SpriteUtil.stageHeight);
        shape.graphics.endFill();
        this.addChild(shape);
        this.boxArr = [];
        //初始画引擎部分
        this.engine = Matter.Engine.create({ enableSleeping: true }, null);
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
        var box = SpriteUtil.createImage(this.dataVo.sData);
        box.x = box.width / 2;
        box.y = 120;
        this.addChild(box);
        this.skyBox = box;
        var brbc = '以热爱祖国为荣  以危害祖国为耻\n以服务人民为荣  以背离人民为耻\n以崇尚科学为荣  以愚昧无知为耻\n以辛勤劳动为荣  以好逸恶劳为耻\n以团结互助为荣  以损人利己为耻\n以诚实守信为荣  以见利忘义为耻\n以遵纪守法为荣  以违法乱纪为耻\n以艰苦奋斗为荣  以骄奢淫逸为耻';
        // let bspr = SpriteUtil.createRect(360,200,0x000000);
        var bspr = SpriteUtil.createText(brbc, 30, 0xff0000, true);
        var body = Matter.Bodies.rectangle(SpriteUtil.stageCenterX, SpriteUtil.stageHeight - bspr.height / 2, bspr.width, bspr.height, {
            isStatic: true,
            friction: 5,
            frictionStatic: 5,
            render: {
                sprite: bspr
            }
        });
        Matter.World.add(this.engine.world, body);
        this.scoreItem = new ScoreItem();
        this.addChild(this.scoreItem);
        this.refreshCnt();
        this.timeItem = new TimeItem(5 * 60);
        this.addChild(this.timeItem);
        this.timeItem.x = SpriteUtil.stageWidth - 300;
        //循环运动box
        egret.Tween.get(this.skyBox, { loop: true }).to({ x: SpriteUtil.stageWidth - this.skyBox.width / 2 }, this.dataVo.time).to({ x: this.skyBox.width / 2 }, this.dataVo.time);
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.tapAddBox, this);
        this.intervalId = egret.setInterval(function () {
            var len = _this.boxArr.length;
            for (var i = 0; i < len; i++) {
                var bdy = _this.boxArr[i];
                if (bdy.position.y > SpriteUtil.stageHeight + 2 * bdy.render.sprite.width && !bdy.isStatic) {
                    _this.loseCnt++;
                    Matter.Body.setStatic(bdy, true);
                    Matter.Body.setPosition(bdy, { x: -(200 + 800 * Math.random()), y: bdy.position.y });
                }
            }
            _this.checkResult();
        }, this, 100);
    };
    Scene_017.prototype.tapAddBox = function (evt) {
        var _this = this;
        if (!this.isCanOperate)
            return;
        GameSound.instance().playSound('click');
        this.usedCnt++;
        this.isCanOperate = false;
        if (this.usedCnt > this.dataVo.score) {
            EffectUtil.showResultEffect();
            return;
        }
        GameSound.instance().playSound('click');
        var idx = egret.setTimeout(function () {
            egret.clearTimeout(idx);
            _this.isCanOperate = true;
        }, this, 500);
        this.refreshCnt();
        this.createBox();
    };
    //创建墙壁
    Scene_017.prototype.createBox = function () {
        var xx = this.skyBox.x;
        var yy = this.skyBox.y;
        var len = this.boxArr.length;
        for (var i = 0; i < len; i++) {
            var bdy = this.boxArr[i];
            if (bdy.position.y > SpriteUtil.stageHeight + bdy.render.sprite.width / 2 && bdy.position.x < -200) {
                Matter.Body.setStatic(bdy, false);
                Matter.Body.setAngle(bdy, 0);
                Matter.Body.setAngularVelocity(bdy, 0);
                Matter.Body.setVelocity(bdy, { x: 0, y: 0 });
                Matter.Body.setPosition(bdy, { x: xx, y: yy });
                Matter.Body.set(bdy, "restitution", 0);
                Matter.Body.set(bdy, "friction", 1);
                Matter.Body.set(bdy, 'isSleeping', false);
                return;
            }
        }
        var sprite = SpriteUtil.createImage(this.dataVo.sData);
        var body = Matter.Bodies.rectangle(xx, yy, sprite.width, sprite.height, {
            frictionAir: 0.005,
            friction: 0.5,
            mass: 10,
            render: {
                sprite: sprite
            }
        });
        Matter.World.add(this.engine.world, body);
        this.boxArr.push(body);
    };
    Scene_017.prototype.checkResult = function () {
        this.refreshCnt();
        if (this.usedCnt < this.dataVo.tData)
            return;
        var cnt = 0;
        for (var _i = 0, _a = this.boxArr; _i < _a.length; _i++) {
            var bdy = _a[_i];
            if (!bdy.isStatic && bdy.position.y <= SpriteUtil.stageHeight - 80 && bdy.isSleeping) {
                cnt++;
            }
        }
        if (cnt >= this.dataVo.tData) {
            this.isCanOperate = false;
            var time = this.timeItem.leftTime;
            this.destroy();
            if (time >= 1.5 * 60) {
                EffectUtil.showResultEffect(EffectUtil.PERFECT);
            }
            else if (time >= 2.5 * 60) {
                EffectUtil.showResultEffect(EffectUtil.GREAT);
            }
            else {
                EffectUtil.showResultEffect(EffectUtil.GOOD);
            }
        }
        else {
            var leftcnt = this.dataVo.score - this.usedCnt;
            if (leftcnt + this.usedCnt - this.loseCnt < this.dataVo.tData) {
                this.isCanOperate = false;
                this.destroy();
                EffectUtil.showResultEffect();
            }
        }
    };
    Scene_017.prototype.refreshCnt = function () {
        var str = "\u5269\u4F59 " + (this.dataVo.score - this.usedCnt) + "  \u76EE\u6807 " + this.dataVo.tData;
        this.scoreItem.setCustomText(str);
    };
    Scene_017.prototype.destroy = function () {
        this.timeItem.stop();
        egret.clearInterval(this.intervalId);
        egret.Tween.removeTweens(this.skyBox);
        this.isCanOperate = false;
        Matter.Runner.stop(this.runner);
        EgretRender.stop();
        Matter.Engine.clear(this.engine);
        Matter.World.remove(this.engine.world, this.engine.world.bodies, 0);
    };
    Scene_017.prototype.enter = function () {
        var _this = this;
        _super.prototype.enter.call(this);
        this.timeItem.start(function (time) {
            if (time < 0) {
                _this.destroy();
                _this.timeItem.stop();
                EffectUtil.showResultEffect();
            }
        }, this);
    };
    Scene_017.prototype.exit = function () {
        this.destroy();
        _super.prototype.exit.call(this);
    };
    return Scene_017;
}(BaseScene));
__reflect(Scene_017.prototype, "Scene_017");
