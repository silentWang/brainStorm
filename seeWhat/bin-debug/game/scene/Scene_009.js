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
//找出质量不一样的篮球
var Scene_009 = (function (_super) {
    __extends(Scene_009, _super);
    function Scene_009() {
        var _this = _super.call(this) || this;
        _this.isTouching = false;
        _this.init();
        return _this;
    }
    Scene_009.prototype.init = function () {
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
        this.engine = Matter.Engine.create({ enableSleeping: false }, null);
        this.runner = Matter.Runner.create(null);
        this.render = EgretRender.create({
            engine: this.engine,
            container: this,
            options: {
                width: SpriteUtil.stageWidth,
                height: SpriteUtil.stageHeight,
                wireframes: true,
            }
        });
        Matter.Runner.run(this.runner, this.engine);
        EgretRender.run(this.render);
        this.engine.world.gravity.y = 1;
        this.createWall();
        this.createBall();
        //平衡棒
        var aspr = SpriteUtil.createRect(200, 10, 0xff0000);
        var auncel = Matter.Bodies.rectangle(SpriteUtil.stageCenterX, 450, aspr.width, aspr.height, {
            frictionAir: 0.05,
            friction: 0,
            render: {
                sprite: aspr
            }
        });
        var constraint = Matter.Constraint.create({
            bodyA: auncel,
            pointB: { x: auncel.position.x, y: auncel.position.y },
            stiffness: 1
        });
        Matter.World.add(this.engine.world, [auncel, constraint]);
        aspr.touchEnabled = true;
        aspr.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            Matter.Body.setAngularVelocity(auncel, 0);
            var angle = auncel.angle == 0 ? Math.PI / 2 : 0;
            Matter.Body.setAngle(auncel, angle);
        }, this);
        this.createVc(60, 500, 0x000000);
        this.createVc(SpriteUtil.stageWidth - 100, 500, 0x000000);
        var lspr = SpriteUtil.createRect(200, 10, 0x0000ff);
        var leftBoard = Matter.Bodies.rectangle(80, SpriteUtil.stageCenterY, 200, 10, {
            isStatic: true,
            angle: Math.PI / 4,
            friction: 1,
            render: {
                sprite: lspr
            }
        });
        var rspr = SpriteUtil.createRect(200, 10, 0x0000ff);
        var rightBoard = Matter.Bodies.rectangle(SpriteUtil.stageWidth - 80, SpriteUtil.stageCenterY, 200, 10, {
            isStatic: true,
            angle: -Math.PI / 4,
            friction: 1,
            render: {
                sprite: rspr
            }
        });
        var lspr1 = SpriteUtil.createRect(200, 10, 0x0000ff);
        var leftBoard1 = Matter.Bodies.rectangle(80, 250, 200, 10, {
            isStatic: true,
            angle: Math.PI / 4,
            friction: 1,
            render: {
                sprite: lspr1
            }
        });
        var rspr1 = SpriteUtil.createRect(200, 10, 0x0000ff);
        var rightBoard1 = Matter.Bodies.rectangle(SpriteUtil.stageWidth - 80, 250, 200, 10, {
            isStatic: true,
            angle: -Math.PI / 4,
            friction: 1,
            render: {
                sprite: rspr1
            }
        });
        Matter.World.add(this.engine.world, [leftBoard, rightBoard, leftBoard1, rightBoard1]);
        Matter.Events.on(this.engine, 'collisionActive', this.collision.bind(this));
        this.createCatapult();
        this.createBoard();
    };
    //碰撞检测
    Scene_009.prototype.collision = function (evt) {
        var pairs = evt.pairs;
        var isHeavy = 0;
        var isLight = 0;
        var wrongNum = 0;
        var defmass = 50;
        for (var _i = 0, pairs_1 = pairs; _i < pairs_1.length; _i++) {
            var pair = pairs_1[_i];
            var body1 = pair.bodyA.label == 'basketBoard' ? pair.bodyA : null;
            var body2 = pair.bodyB;
            if (body1 == null) {
                body1 = pair.bodyB.label == 'basketBoard' ? pair.bodyB : null;
                body2 = pair.bodyA;
            }
            if (body1 == null)
                continue;
            if (body2.mass == defmass / 2) {
                isLight++;
            }
            else if (body2.mass == defmass * 2) {
                isHeavy++;
            }
            else if (body2.mass == defmass) {
                wrongNum++;
            }
        }
        if (isLight + isHeavy >= 2) {
            Matter.Events.off(this.engine, 'collisionActive', this.collision);
            Matter.Runner.stop(this.runner);
            EgretRender.stop();
            var time = this.timeItem.leftTime;
            this.timeItem.stop();
            if (time >= 30) {
                EffectUtil.showResultEffect(EffectUtil.PERFECT);
            }
            else if (time >= 15) {
                EffectUtil.showResultEffect(EffectUtil.GREAT);
            }
            else {
                EffectUtil.showResultEffect(EffectUtil.GOOD);
            }
        }
        else if ((isLight + isHeavy == 1) && wrongNum == 1) {
            Matter.Events.off(this.engine, 'collisionActive', this.collision);
            Matter.Runner.stop(this.runner);
            this.timeItem.stop();
            EgretRender.stop();
            EffectUtil.showResultEffect();
        }
        else if (wrongNum == 2) {
            Matter.Events.off(this.engine, 'collisionActive', this.collision);
            Matter.Runner.stop(this.runner);
            EgretRender.stop();
            this.timeItem.stop();
            EffectUtil.showResultEffect();
        }
    };
    Scene_009.prototype.touchBegin = function (evt) {
        var name = evt.target.name;
        if (!name || name.search('ball_') == -1)
            return;
        var index = name.split('_')[1];
        this.currDragBall = this.ballsArr[index];
        this.isTouching = true;
    };
    Scene_009.prototype.touchMove = function (evt) {
        if (this.isTouching && this.currDragBall) {
            //拖拽期间取消重力
            Matter.Body.setVelocity(this.currDragBall, { x: 0, y: -1 });
            Matter.Sleeping.set(this.currDragBall, false);
            Matter.Body.setPosition(this.currDragBall, { x: evt['stageX'], y: evt['stageY'] });
        }
    };
    Scene_009.prototype.touchEnd = function () {
        this.isTouching = false;
        Matter.Body.setVelocity(this.currDragBall, { x: 0, y: 0 });
        this.currDragBall = null;
    };
    //创建篮球
    Scene_009.prototype.createBall = function () {
        var _this = this;
        this.ballsArr = [];
        var nums = 0;
        var count = this.dataVo.sData;
        var rans = CommonUtil.getRandomNumFromARange(2, 0, count);
        rans.sort(function (a, b) {
            return a - b;
        });
        // console.log(rans);
        var xname = 'basketball';
        if (this.dataVo.level == 3) {
            xname = 'football';
        }
        var defmass = 50;
        var idx = egret.setInterval(function () {
            var spr = SpriteUtil.createImage(xname);
            var scale = 60 / spr.width;
            spr.scaleX = scale;
            spr.scaleY = scale;
            var xx = (SpriteUtil.stageWidth - 100) * Math.random();
            if (_this.dataVo.level != 1 && nums < _this.dataVo.sData - 2) {
                xx = nums % 2 == 0 ? 20 : SpriteUtil.stageWidth - 20;
            }
            var mass = defmass;
            if (_this.dataVo.level == 1) {
                mass = rans[0] == nums ? defmass * 2 : defmass;
                if (mass != defmass * 2) {
                    mass = rans[1] == nums ? defmass * 2 : defmass;
                }
            }
            else if (_this.dataVo.level == 2) {
                mass = rans[0] == nums ? defmass / 2 : defmass;
                if (mass != defmass / 2) {
                    mass = rans[1] == nums ? defmass / 2 : defmass;
                }
            }
            else if (_this.dataVo.level == 3) {
                mass = rans[0] == nums ? defmass * 2 : defmass;
                if (mass != defmass * 2) {
                    mass = rans[1] == nums ? defmass / 2 : defmass;
                }
            }
            spr.name = "ball_" + nums;
            var ball = Matter.Bodies.circle(xx, 0, scale * spr.height / 2, {
                restitution: 0.5,
                friction: 1,
                label: 'ball',
                render: {
                    sprite: spr
                }
            }, 0);
            Matter.World.add(_this.engine.world, ball);
            // Matter.Body.setInertia(ball,10000);
            Matter.Body.setMass(ball, mass);
            _this.ballsArr.push(ball);
            spr.touchEnabled = true;
            spr.addEventListener(egret.TouchEvent.TOUCH_BEGIN, _this.touchBegin, _this);
            spr.addEventListener(egret.TouchEvent.TOUCH_MOVE, _this.touchMove, _this);
            spr.addEventListener(egret.TouchEvent.TOUCH_END, _this.touchEnd, _this);
            spr.addEventListener(egret.TouchEvent.TOUCH_CANCEL, _this.touchEnd, _this);
            spr.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, _this.touchEnd, _this);
            nums++;
            if (nums >= count) {
                egret.clearInterval(idx);
            }
        }, this, 500);
        Matter.World.add(this.engine.world, this.ballsArr);
    };
    //创建装球的容器
    Scene_009.prototype.createVc = function (xx, yy, color) {
        if (color === void 0) { color = 0x00ff00; }
        var lspr = SpriteUtil.createRect(50, 10, color);
        var lbdy = Matter.Bodies.rectangle(xx, yy, 50, 10, {
            isStatic: true,
            angle: Math.PI / 3,
            render: {
                sprite: lspr
            }
        });
        var rspr = SpriteUtil.createRect(50, 10, color);
        var rbdy = Matter.Bodies.rectangle(xx + 40, yy, 50, 10, {
            isStatic: true,
            angle: -Math.PI / 3,
            render: {
                sprite: rspr
            }
        });
        //center  主要用来检测篮球是否放进篮子里了
        var cspr = SpriteUtil.createRect(30, 10, color);
        var cbdy = Matter.Bodies.rectangle(xx + 20, yy, 30, 10, {
            isStatic: true,
            label: 'basketBoard',
            render: {
                sprite: cspr
            }
        });
        var text = new egret.TextField();
        text.text = '实验结果';
        text.x = xx + 20;
        text.y = yy - 60;
        text.textAlign = 'center';
        text.textColor = 0x0000ff;
        text.size = 22;
        text.width = 100;
        text.anchorOffsetX = 50;
        this.addChild(text);
        Matter.World.add(this.engine.world, [lbdy, rbdy, cbdy]);
    };
    //创建墙壁
    Scene_009.prototype.createWall = function () {
        var left = Matter.Bodies.rectangle(-5, SpriteUtil.stageCenterY, 10, SpriteUtil.stageHeight, { isStatic: true });
        var right = Matter.Bodies.rectangle(SpriteUtil.stageWidth + 5, SpriteUtil.stageCenterY, 10, SpriteUtil.stageHeight, { isStatic: true });
        var top = Matter.Bodies.rectangle(SpriteUtil.stageCenterX, -5, SpriteUtil.stageWidth, 10, { isStatic: true });
        var bottom = Matter.Bodies.rectangle(SpriteUtil.stageCenterX, SpriteUtil.stageHeight - 100, SpriteUtil.stageWidth, 250, { isStatic: true });
        Matter.World.add(this.engine.world, [left, right, top, bottom]);
    };
    //创建竖直隔板
    Scene_009.prototype.createBoard = function () {
        var bodies = [];
        for (var i = 0; i < 6; i++) {
            var spr = SpriteUtil.createRect(10, 50, Math.ceil(0xffff00 * Math.random()) + 32);
            var board = Matter.Bodies.rectangle(10 + 100 * (i + 1), SpriteUtil.stageCenterY + 200, 10, 50, {
                isStatic: true,
                render: {
                    sprite: spr
                }
            });
            bodies.push(board);
        }
        Matter.World.add(this.engine.world, bodies);
    };
    //创建跷跷板
    Scene_009.prototype.createCatapult = function () {
        var rect = SpriteUtil.createRect(200, 16, 0xCD00CD);
        var catapult = Matter.Bodies.rectangle(SpriteUtil.stageWidth - 100, SpriteUtil.stageHeight - 290, rect.width, rect.height, {
            render: {
                sprite: rect
            }
        });
        var prect = SpriteUtil.createRect(20, 40, 0xff00ff);
        var pbody = Matter.Bodies.rectangle(SpriteUtil.stageWidth - 100, SpriteUtil.stageHeight - 270, prect.width, prect.height, {
            isStatic: true,
            render: {
                sprite: prect
            }
        });
        var srect = SpriteUtil.createRect(30, 30, 0x0f0f0f);
        var sbody = Matter.Bodies.rectangle(SpriteUtil.stageWidth - 15, SpriteUtil.stageHeight - 266, srect.width, srect.height, {
            isStatic: true,
            render: {
                sprite: srect
            }
        });
        var constraint = Matter.Constraint.create({
            bodyA: catapult,
            pointB: Matter.Vector.clone(catapult.position),
            stiffness: 1,
            length: 0
        });
        Matter.World.add(this.engine.world, [pbody, sbody, catapult, constraint]);
    };
    Scene_009.prototype.enter = function () {
        _super.prototype.enter.call(this);
        this.timeItem.start();
    };
    Scene_009.prototype.exit = function () {
        _super.prototype.exit.call(this);
        this.timeItem.stop();
        for (var _i = 0, _a = this.engine.world.bodies; _i < _a.length; _i++) {
            var body = _a[_i];
            if (body.label == 'ball') {
                body.render.sprite.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this);
                body.render.sprite.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMove, this);
                body.render.sprite.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEnd, this);
                body.render.sprite.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.touchEnd, this);
                body.render.sprite.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.touchEnd, this);
            }
        }
        Matter.World.remove(this.engine.world, this.engine.world.bodies, 0);
        Matter.World.remove(this.engine.world, this.engine.world.constraints, 0);
    };
    return Scene_009;
}(BaseScene));
__reflect(Scene_009.prototype, "Scene_009");
