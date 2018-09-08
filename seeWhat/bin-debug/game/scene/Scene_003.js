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
        _this.angleSpeed1 = 0.05;
        _this.angleSpeed2 = 0.06;
        _this.angleSpeed3 = 0.065;
        _this.angleSpeed4 = 0.08;
        _this.speedDir = 1;
        _this.isTouching = false;
        _this.categories = [0x0001, 0x0002, 0x0004, 0x0008, 0x0010, 0x0020, 0x0040, 0x0080];
        _this.playerCategory = 0x0100;
        _this.isRunning = true;
        _this.init();
        return _this;
    }
    Scene_003.prototype.init = function () {
        var _this = this;
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
        var enemy8 = this.createEnemy(160, 100, this.categories[5]);
        Matter.World.add(world, enemy8);
        var enemy9 = this.createEnemy(310, 200, this.categories[5]);
        Matter.World.add(world, enemy9);
        var enemy10 = this.createEnemy(460, 100, this.categories[5]);
        Matter.World.add(world, enemy10);
        this.enemies = [enemy1, enemy2, enemy3, enemy4, enemy5, enemy6, enemy7, enemy8, enemy9, enemy10];
        //飞镖
        var arrowspr1 = SpriteUtil.createText('🐙', 50, 0xff0000);
        var arrow1 = Matter.Bodies.circle(100, 300, arrowspr1.width / 2, {
            label: 'Body_enemy',
            render: {
                sprite: arrowspr1
            }
        }, 0);
        var arrowspr2 = SpriteUtil.createText('🐙', 50, 0xff0000);
        var arrow2 = Matter.Bodies.circle(SpriteUtil.stageWidth - 100, 400, arrowspr2.width / 2, {
            label: 'Body_enemy',
            render: {
                sprite: arrowspr2
            }
        }, 0);
        Matter.World.add(world, [arrow1, arrow2]);
        this.enemies.push(arrow1);
        this.enemies.push(arrow2);
        //player
        var playerSpr = SpriteUtil.createText('👦', 80);
        this.player = Matter.Bodies.circle(50, 1250, playerSpr.width / 2, {
            stiffness: 1,
            collisionFilter: {
                category: this.playerCategory
            },
            render: {
                sprite: playerSpr
            }
        }, 0);
        //target
        var girl = SpriteUtil.createText('👧', 80);
        this.girlbdy = Matter.Bodies.circle(SpriteUtil.stageCenterX, girl.height / 2 + 10, girl.width / 2, {
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
        //更新
        Matter.Events.on(this.engine, 'beforeUpdate', this.beforeUpdateHandle.bind(this));
        //碰撞检测
        Matter.Events.on(this.engine, 'collisionStart', this.collisionHandle.bind(this));
        playerSpr.touchEnabled = true;
        playerSpr.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function (evt) {
            _this.isTouching = true;
        }, this);
        playerSpr.addEventListener(egret.TouchEvent.TOUCH_MOVE, function (evt) {
            if (_this.isTouching) {
                Matter.Body.setPosition(_this.player, { x: evt['stageX'], y: evt['stageY'] });
            }
        }, this);
        playerSpr.addEventListener(egret.TouchEvent.TOUCH_END, function (evt) {
            _this.isTouching = false;
        }, this);
    };
    //bdfore update
    Scene_003.prototype.beforeUpdateHandle = function (evt) {
        if (!this.isRunning)
            return;
        if (this.enemies[10].position.x > SpriteUtil.stageWidth) {
            this.speedDir = -1;
        }
        if (this.enemies[10].position.x < 0) {
            this.speedDir = 1;
        }
        Matter.Body.setVelocity(this.enemies[10], { x: this.speedDir * 5, y: 0 });
        Matter.Body.setVelocity(this.enemies[11], { x: -this.speedDir * 5, y: 0 });
        Matter.Body.rotate(this.enemies[0][0], 0.05, null);
        Matter.Body.rotate(this.enemies[1][0], -0.05, null);
        Matter.Body.rotate(this.enemies[2][0], -0.05, null);
        Matter.Body.rotate(this.enemies[3][0], 0.05, null);
        Matter.Body.rotate(this.enemies[4][0], -this.angleSpeed2, null);
        Matter.Body.rotate(this.enemies[5][0], this.angleSpeed2, null);
        Matter.Body.rotate(this.enemies[6][0], -this.angleSpeed3, null);
        Matter.Body.rotate(this.enemies[7][0], this.angleSpeed4, null);
        Matter.Body.rotate(this.enemies[8][0], -this.angleSpeed4, null);
        Matter.Body.rotate(this.enemies[9][0], this.angleSpeed4, null);
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
                        EffectUtil.showResultEffect(EffectUtil.EXCELLENT);
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
        for (var i = 0; i < num; i++) {
            var t1 = SpriteUtil.createText('🔥', radius * 2, 0xff0000, false);
            t1.x = i * radius * 2;
            spr.addChild(t1);
        }
        spr.anchorOffsetX = spr.width / 2 - radius - radius / 2;
        var enemy = Matter.Body.create({
            parts: stack1.bodies,
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