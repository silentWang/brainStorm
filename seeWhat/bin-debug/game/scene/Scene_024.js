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
//一心二用  两个方块
var Scene_024 = (function (_super) {
    __extends(Scene_024, _super);
    function Scene_024() {
        var _this = _super.call(this) || this;
        _this.startPt = null;
        _this.pools = [];
        _this.score = 0;
        _this.intervalId = 0;
        _this.init();
        return _this;
    }
    Scene_024.prototype.init = function () {
        var bg = SpriteUtil.createRect(SpriteUtil.stageWidth, SpriteUtil.stageHeight, 0xffffff);
        bg.alpha = 0.01;
        bg.anchorOffsetX = 0;
        bg.anchorOffsetY = 0;
        this.addChild(bg);
        this.engine = Matter.Engine.create({ enableSleeping: false }, null);
        this.runner = Matter.Runner.create(null);
        this.runner.isFixed = true;
        this.render = EgretRender.create({
            engine: this.engine,
            container: this,
            options: {
                width: SpriteUtil.stageWidth,
                height: SpriteUtil.stageHeight,
                wireframes: true
            }
        });
        Matter.Runner.run(this.runner, this.engine);
        EgretRender.run(this.render);
        this.engine.world.gravity.y = 0;
        var img1 = SpriteUtil.createImage('basketball');
        var ply1 = Matter.Bodies.circle(SpriteUtil.stageCenterX - 100, SpriteUtil.stageCenterY, img1.width / 2, {
            label: "player",
            collisionFilter: {
                category: 0x0002,
                mask: 0x0002 | 0x0008
            },
            render: {
                sprite: img1
            }
        }, 0);
        var img2 = SpriteUtil.createImage('football');
        var ply2 = Matter.Bodies.circle(SpriteUtil.stageCenterX + 100, SpriteUtil.stageCenterY, img2.width / 2, {
            label: "player",
            collisionFilter: {
                category: 0x0004,
                mask: 0x0004 | 0x0008
            },
            render: {
                sprite: img2
            }
        }, 0);
        Matter.World.add(this.engine.world, [ply1, ply2]);
        this.player1 = ply1;
        this.player2 = ply2;
        Matter.Events.on(this.engine, "collisionStart", this.collision.bind(this));
        this.scoreItem = new ScoreItem();
        this.addChild(this.scoreItem);
        this.scoreItem.setSTScore(this.score, this.dataVo.tData);
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchHandler, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.touchHandler, this);
        this.next();
    };
    Scene_024.prototype.next = function () {
        var _this = this;
        this.intervalId = egret.setInterval(function () {
            for (var i = 0; i < _this.dataVo.sData.length; i++) {
                _this.getPools(_this.dataVo.sData[i]);
            }
        }, this, this.dataVo.time);
    };
    Scene_024.prototype.getPools = function (type) {
        var isNeed = false;
        var xx = 0;
        var yy = 0;
        var velocity = { x: 0, y: 0 };
        var speed = 1 + Math.floor(3 * Math.random());
        if (type == 1) {
            xx = 40 + (SpriteUtil.stageWidth - 80) * Math.random();
            yy = -64;
            velocity.y = speed;
        }
        else if (type == 2) {
            xx = 40 + (SpriteUtil.stageWidth - 80) * Math.random();
            yy = SpriteUtil.stageHeight + 64;
            velocity.y = -speed;
        }
        else if (type == 3) {
            xx = -64;
            yy = 40 + (SpriteUtil.stageHeight - 80) * Math.random();
            velocity.x = speed;
        }
        else if (type == 4) {
            xx = SpriteUtil.stageWidth + 64;
            yy = 40 + (SpriteUtil.stageHeight - 80) * Math.random();
            velocity.x = -speed;
        }
        for (var _i = 0, _a = this.pools; _i < _a.length; _i++) {
            var body = _a[_i];
            var judgeBool = false;
            if (body.velocity.x > 0) {
                if (body.position.x >= SpriteUtil.stageWidth + body.render.sprite.width) {
                    judgeBool = true;
                }
            }
            else if (body.velocity.x < 0) {
                if (body.position.x <= -body.render.sprite.width) {
                    judgeBool = true;
                }
            }
            else if (body.velocity.y > 0) {
                if (body.position.y >= SpriteUtil.stageHeight + body.render.sprite.width) {
                    judgeBool = true;
                }
            }
            else if (body.velocity.y < 0) {
                if (body.position.y <= -body.render.sprite.width) {
                    judgeBool = true;
                }
            }
            //
            if (judgeBool) {
                this.score++;
                this.scoreItem.setSTScore(this.score);
                if (this.score >= this.dataVo.tData) {
                    this.destroy();
                    EffectUtil.showResultEffect(EffectUtil.PERFECT);
                    return null;
                }
                Matter.Body.setPosition(body, { x: xx, y: yy });
                isNeed = true;
            }
        }
        if (isNeed)
            return null;
        var sprite = SpriteUtil.createImage(CommonUtil.allEmoji[Math.floor(20 * Math.random())]);
        var enemy = Matter.Bodies.circle(xx, yy, sprite.width / 2, {
            frictionAir: 0,
            friction: 0,
            label: "enemy",
            collisionFilter: {
                category: 0x0008,
                mask: 0x0002 | 0x0004
            },
            render: {
                sprite: sprite
            }
        }, 0);
        Matter.World.add(this.engine.world, enemy);
        Matter.Body.setVelocity(enemy, velocity);
        this.pools.push(enemy);
        return enemy;
    };
    Scene_024.prototype.collision = function (evt) {
        var pairs = evt.pairs;
        for (var _i = 0, pairs_1 = pairs; _i < pairs_1.length; _i++) {
            var pair = pairs_1[_i];
            if (pair.bodyA.label == "player" || pair.bodyB.label == "player") {
                this.destroy();
                EffectUtil.showResultEffect();
            }
        }
    };
    Scene_024.prototype.touchHandler = function (evt) {
        if (evt.type == egret.TouchEvent.TOUCH_BEGIN) {
            this.startPt = new egret.Point(evt["stageX"], evt["stageY"]);
            this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchHandler, this);
        }
        else if (evt.type == egret.TouchEvent.TOUCH_MOVE) {
            if (this.startPt == null) {
                this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchHandler, this);
                return;
            }
            var nowPt = new egret.Point(evt["stageX"], evt["stageY"]);
            this.movePlayer(this.startPt, nowPt);
            this.startPt = nowPt;
        }
        else if (evt.type == egret.TouchEvent.TOUCH_END) {
            this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchHandler, this);
            this.startPt = null;
        }
    };
    Scene_024.prototype.movePlayer = function (start, end) {
        var xx = start.x - end.x;
        var yy = start.y - end.y;
        var x1 = this.player1.position.x + xx;
        var y1 = this.player1.position.y + yy;
        var x2 = this.player2.position.x - xx;
        var y2 = this.player2.position.y - yy;
        if (x1 < this.player1.render.sprite.width / 2) {
            x1 = this.player1.render.sprite.width / 2;
        }
        else if (x1 > SpriteUtil.stageWidth - this.player1.render.sprite.width / 2) {
            x1 = SpriteUtil.stageWidth - this.player1.render.sprite.width / 2;
        }
        if (y1 < this.player1.render.sprite.width / 2) {
            y1 = this.player1.render.sprite.width / 2;
        }
        else if (y1 > SpriteUtil.stageHeight - this.player1.render.sprite.width / 2) {
            y1 = SpriteUtil.stageHeight - this.player1.render.sprite.width / 2;
        }
        //
        if (x2 < this.player2.render.sprite.width / 2) {
            x2 = this.player2.render.sprite.width / 2;
        }
        else if (x2 > SpriteUtil.stageWidth - this.player2.render.sprite.width / 2) {
            x2 = SpriteUtil.stageWidth - this.player2.render.sprite.width / 2;
        }
        if (y2 < this.player2.render.sprite.width / 2) {
            y2 = this.player2.render.sprite.width / 2;
        }
        else if (y2 > SpriteUtil.stageHeight - this.player2.render.sprite.width / 2) {
            y2 = SpriteUtil.stageHeight - this.player2.render.sprite.width / 2;
        }
        Matter.Body.setPosition(this.player1, { x: x1, y: y1 });
        Matter.Body.setPosition(this.player2, { x: x2, y: y2 });
    };
    Scene_024.prototype.destroy = function () {
        egret.clearInterval(this.intervalId);
        Matter.Runner.stop(this.runner);
        EgretRender.stop();
        Matter.Engine.clear(this.engine);
        Matter.Events.off(this.engine, "collisionStart", this.collision);
    };
    return Scene_024;
}(BaseScene));
__reflect(Scene_024.prototype, "Scene_024");
