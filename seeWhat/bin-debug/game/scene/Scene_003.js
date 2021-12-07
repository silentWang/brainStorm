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
//营救公主
var Scene_003 = (function (_super) {
    __extends(Scene_003, _super);
    function Scene_003() {
        var _this = _super.call(this) || this;
        //数值部分
        _this.angleSpeed1 = 0.06;
        _this.angleSpeed2 = 0.06;
        _this.angleSpeed3 = 0.07;
        _this.angleSpeed4 = 0.075;
        _this.isTouching = false;
        _this.categories = [0x0001, 0x0002, 0x0004, 0x0008, 0x0010, 0x0020, 0x0040, 0x0080];
        _this.playerCategory = 0x0100;
        _this.isRunning = true;
        _this.init();
        return _this;
    }
    Scene_003.prototype.init = function () {
        var _this = this;
        //sdata 代表移动敌人的速度
        this.timeItem = new TimeItem(this.dataVo.time);
        this.timeItem.x = SpriteUtil.stageWidth - 250;
        this.addChild(this.timeItem);
        this.engine = Matter.Engine.create({ enableSleeping: false }, null);
        var world = this.engine.world;
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
        //取消重力
        world.gravity.y = 0;
        Matter.Runner.run(this.runner, this.engine);
        EgretRender.run(render);
        //player
        var playerSpr = SpriteUtil.createImage("boy");
        this.player = Matter.Bodies.rectangle(50, 1250, playerSpr.width - 20, playerSpr.height - 6, {
            stiffness: 1,
            collisionFilter: {
                category: this.playerCategory
            },
            render: {
                sprite: playerSpr
            }
        });
        //target
        var girl = SpriteUtil.createImage("girl");
        this.girlbdy = Matter.Bodies.circle(SpriteUtil.stageCenterX, girl.height / 2 + 60, girl.width / 2, {
            stiffness: 1,
            collisionFilter: {
                category: this.categories[0],
                mask: this.playerCategory | this.categories[0]
            },
            render: {
                sprite: girl
            }
        }, 0);
        Matter.World.add(world, [this.player, this.girlbdy]);
        playerSpr.touchEnabled = true;
        playerSpr.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function (evt) {
            _this.isTouching = true;
        }, this);
        playerSpr.addEventListener(egret.TouchEvent.TOUCH_MOVE, function (evt) {
            if (_this.isTouching) {
                var xx = evt['stageX'];
                var yy = evt['stageY'];
                if (xx < 0) {
                    xx = 0;
                }
                else if (xx > SpriteUtil.stageWidth) {
                    xx = SpriteUtil.stageWidth;
                }
                if (yy > SpriteUtil.stageHeight) {
                    yy = SpriteUtil.stageHeight;
                }
                else if (yy < 0) {
                    yy = 0;
                }
                Matter.Body.setPosition(_this.player, { x: xx, y: yy });
            }
        }, this);
        playerSpr.addEventListener(egret.TouchEvent.TOUCH_END, function (evt) {
            _this.isTouching = false;
        }, this);
        if (this.dataVo.level == 1) {
            this.initL1();
        }
        else if (this.dataVo.level == 2) {
            this.initL2();
        }
        else if (this.dataVo.level == 3) {
            this.initL3();
        }
        //更新
        Matter.Events.on(this.engine, 'beforeUpdate', this.beforeUpdateHandle.bind(this));
        //碰撞检测
        Matter.Events.on(this.engine, 'collisionStart', this.collisionHandle.bind(this));
    };
    Scene_003.prototype.initL1 = function () {
        var world = this.engine.world;
        var enemy1 = this.createEnemy(SpriteUtil.stageCenterX - 360, SpriteUtil.stageCenterY, this.categories[1], 36);
        Matter.World.add(this.engine.world, enemy1);
        this.enemies = [enemy1];
        Matter.Body.setAngularVelocity(this.enemies[0][0], this.angleSpeed1 * 1.2);
        //飞镖
        var arrowspr1 = SpriteUtil.createImage('insect');
        var scale = 50 / arrowspr1.width;
        arrowspr1.scaleX = scale;
        arrowspr1.scaleY = scale;
        var arrow1 = Matter.Bodies.circle(100, 200, scale * arrowspr1.width / 2, {
            label: 'Body_enemy',
            friction: 0,
            frictionAir: 0,
            render: {
                sprite: arrowspr1
            }
        }, 0);
        var arrowspr2 = SpriteUtil.createImage('insect');
        arrowspr2.scaleX = scale;
        arrowspr2.scaleY = scale;
        var arrow2 = Matter.Bodies.circle(SpriteUtil.stageWidth - 100, SpriteUtil.stageHeight - 200, scale * arrowspr2.width / 2, {
            label: 'Body_enemy',
            friction: 0,
            frictionAir: 0,
            render: {
                sprite: arrowspr2
            }
        }, 0);
        Matter.World.add(world, [arrow1, arrow2]);
        this.enemies.push(arrow1);
        this.enemies.push(arrow2);
        Matter.Body.setVelocity(arrow1, { x: this.dataVo.sData, y: 0 });
        Matter.Body.setVelocity(arrow2, { x: -1 * this.dataVo.sData, y: 0 });
    };
    Scene_003.prototype.initL2 = function () {
        var _this = this;
        var world = this.engine.world;
        //飞镖
        var func = function (i) {
            var arrowspr1 = SpriteUtil.createImage('insect');
            var scale = 50 / arrowspr1.width;
            arrowspr1.scaleX = scale;
            arrowspr1.scaleY = scale;
            var xx = i % 2 == 0 ? SpriteUtil.stageWidth - 250 : 250;
            var arrow1 = Matter.Bodies.circle(xx, 200 + i * 100, scale * arrowspr1.width / 2, {
                label: 'Body_enemy',
                friction: 0,
                frictionAir: 0,
                render: {
                    sprite: arrowspr1
                }
            }, 0);
            var dir = i % 2 == 0 ? -1 : 1;
            Matter.Body.setVelocity(arrow1, { x: dir * _this.dataVo.sData * 10, y: 0 });
            return arrow1;
        };
        this.enemies = [];
        for (var i = 0; i < 8; i++) {
            this.enemies.push(func(i));
        }
        Matter.World.add(world, this.enemies);
    };
    Scene_003.prototype.initL3 = function () {
        var world = this.engine.world;
        var enemy1 = this.createEnemy(0, 560, this.categories[1]);
        Matter.World.add(world, enemy1);
        var enemy2 = this.createEnemy(200, 560, this.categories[2]);
        Matter.World.add(world, enemy2);
        var enemy3 = this.createEnemy(400, 560, this.categories[3]);
        Matter.World.add(world, enemy3);
        var enemy4 = this.createEnemy(580, 560, this.categories[4]);
        Matter.World.add(world, enemy4);
        //大环两个一组
        var enemy5 = this.createEnemy(0, 860, this.categories[5], 15);
        Matter.World.add(world, enemy5);
        var enemy6 = this.createEnemy(400, 860, this.categories[5], 15);
        Matter.World.add(world, enemy6);
        //大环一个
        var enemy7 = this.createEnemy(210, 1100, this.categories[5], 15);
        Matter.World.add(world, enemy7);
        //包围机器人
        var enemy8 = this.createEnemy(160, 160, this.categories[5]);
        Matter.World.add(world, enemy8);
        var enemy9 = this.createEnemy(310, 260, this.categories[5]);
        Matter.World.add(world, enemy9);
        var enemy10 = this.createEnemy(460, 160, this.categories[5]);
        Matter.World.add(world, enemy10);
        this.enemies = [enemy1, enemy2, enemy3, enemy4, enemy5, enemy6, enemy7, enemy8, enemy9, enemy10];
        //飞镖
        var arrowspr1 = SpriteUtil.createImage('insect');
        var scale = 50 / arrowspr1.width;
        arrowspr1.scaleX = scale;
        arrowspr1.scaleY = scale;
        var arrow1 = Matter.Bodies.circle(100, 360, scale * arrowspr1.width / 2, {
            label: 'Body_enemy',
            friction: 0,
            frictionAir: 0,
            render: {
                sprite: arrowspr1
            }
        }, 0);
        var arrowspr2 = SpriteUtil.createImage('insect');
        arrowspr2.scaleX = scale;
        arrowspr2.scaleY = scale;
        var arrow2 = Matter.Bodies.circle(SpriteUtil.stageWidth - 100, 460, scale * arrowspr2.width / 2, {
            label: 'Body_enemy',
            friction: 0,
            frictionAir: 0,
            render: {
                sprite: arrowspr2
            }
        }, 0);
        Matter.World.add(world, [arrow1, arrow2]);
        this.enemies.push(arrow1);
        this.enemies.push(arrow2);
        //运动起来 旋转起来
        Matter.Body.setAngularVelocity(this.enemies[0][0], 0.1);
        Matter.Body.setAngularVelocity(this.enemies[0][0], this.angleSpeed1);
        Matter.Body.setAngularVelocity(this.enemies[1][0], -this.angleSpeed1);
        Matter.Body.setAngularVelocity(this.enemies[2][0], -this.angleSpeed1);
        Matter.Body.setAngularVelocity(this.enemies[3][0], this.angleSpeed1);
        Matter.Body.setAngularVelocity(this.enemies[4][0], -this.angleSpeed2);
        Matter.Body.setAngularVelocity(this.enemies[5][0], this.angleSpeed2);
        Matter.Body.setAngularVelocity(this.enemies[6][0], -this.angleSpeed3);
        Matter.Body.setAngularVelocity(this.enemies[7][0], this.angleSpeed4);
        Matter.Body.setAngularVelocity(this.enemies[8][0], -this.angleSpeed4);
        Matter.Body.setAngularVelocity(this.enemies[9][0], this.angleSpeed4);
        Matter.Body.setVelocity(this.enemies[10], { x: this.dataVo.sData, y: 0 });
        Matter.Body.setVelocity(this.enemies[11], { x: -1 * this.dataVo.sData, y: 0 });
    };
    //bdfore update
    Scene_003.prototype.beforeUpdateHandle = function (evt) {
        if (!this.isRunning)
            return;
        var len = this.enemies.length;
        var num = 0;
        if (this.dataVo.level == 1 || this.dataVo.level == 3) {
            num = len - 2;
        }
        for (var i = len - 1; i >= num; i--) {
            if (this.enemies[i].position.x < 0) {
                Matter.Body.setVelocity(this.enemies[i], { x: this.dataVo.sData, y: 0 });
            }
            else if (this.enemies[i].position.x > SpriteUtil.stageWidth) {
                Matter.Body.setVelocity(this.enemies[i], { x: -1 * this.dataVo.sData, y: 0 });
            }
        }
    };
    //collisionStart
    Scene_003.prototype.collisionHandle = function (evt) {
        var pairs = evt.pairs;
        for (var _i = 0, pairs_1 = pairs; _i < pairs_1.length; _i++) {
            var pair = pairs_1[_i];
            if (pair.bodyA == this.player || pair.bodyB == this.player) {
                if (pair.bodyA.label == 'Body_enemy' || pair.bodyB.label == 'Body_enemy') {
                    this.isRunning = false;
                    this.timeItem.stop();
                    this.player.render.sprite.touchEnabled = false;
                    Matter.Runner.stop(this.runner);
                    EgretRender.stop();
                    Matter.Engine.clear(this.engine);
                    Matter.Sleeping.afterCollisions(pairs, 0.01);
                    Matter.Events.off(this.engine, 'beforeUpdate', this.beforeUpdateHandle);
                    Matter.Events.off(this.engine, 'collisionStart', this.collisionHandle);
                    EffectUtil.showResultEffect();
                }
                else if (pair.bodyA == this.girlbdy || pair.bodyB == this.girlbdy) {
                    this.isRunning = false;
                    this.player.render.sprite.touchEnabled = false;
                    Matter.Runner.stop(this.runner);
                    EgretRender.stop();
                    Matter.Engine.clear(this.engine);
                    Matter.Sleeping.afterCollisions(pairs, 0.01);
                    Matter.Events.off(this.engine, 'collisionStart', this.collisionHandle);
                    if (this.timeItem.leftTime >= 30) {
                        EffectUtil.showResultEffect(EffectUtil.PERFECT);
                    }
                    else if (this.timeItem.leftTime >= 15) {
                        EffectUtil.showResultEffect(EffectUtil.GREAT);
                    }
                    else {
                        EffectUtil.showResultEffect(EffectUtil.GOOD);
                    }
                    this.timeItem.stop();
                }
            }
        }
    };
    //创建敌人加碰撞过滤
    Scene_003.prototype.createEnemy = function (xx, yy, category, num) {
        if (category === void 0) { category = 0x0001; }
        if (num === void 0) { num = 7; }
        var radius = 10;
        var stack1 = Matter.Composites.stack(xx, yy, num, 1, 0, 0, function (x, y) {
            return Matter.Bodies.circle(x, y, radius, {
                label: 'Body_enemy'
            }, 0);
        });
        var spr = new egret.Sprite();
        var scale = radius * 2 / 64;
        for (var i = 0; i < num; i++) {
            var t1 = SpriteUtil.createImage("fireball");
            t1.scaleX = scale;
            t1.scaleY = scale;
            t1.x = i * radius * 2;
            spr.addChild(t1);
        }
        spr.anchorOffsetX = spr.width / 2 - radius - radius / 2;
        var enemy = Matter.Body.create({
            parts: stack1.bodies,
            friction: 0,
            frictionAir: 0,
            render: {
                sprite: spr
            },
            collisionFilter: {
                category: category,
                mask: this.playerCategory | category
            }
        });
        var constaint1 = Matter.Constraint.create({
            pointB: { x: enemy.position.x, y: enemy.position.y },
            bodyA: enemy,
            stiffness: 1,
            friction: 0,
            length: 0
        });
        return [enemy, constaint1];
    };
    Scene_003.prototype.enter = function () {
        _super.prototype.enter.call(this);
        this.timeItem.start();
    };
    Scene_003.prototype.exit = function () {
        Matter.World.remove(this.engine.world, this.engine.world.bodies, 0);
        Matter.World.remove(this.engine.world, this.engine.world.constraints, 0);
        Matter.Runner.stop(this.runner);
        EgretRender.stop();
        Matter.Engine.clear(this.engine);
        Matter.Events.off(this.engine, 'collisionStart', this.collisionHandle);
        while (this.numChildren > 1) {
            var child = this.getChildAt(this.numChildren - 1);
            this.removeChild(child);
        }
        _super.prototype.exit.call(this);
    };
    return Scene_003;
}(BaseScene));
__reflect(Scene_003.prototype, "Scene_003");
//# sourceMappingURL=Scene_003.js.map