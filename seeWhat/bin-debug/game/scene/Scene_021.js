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
var Scene_021 = (function (_super) {
    __extends(Scene_021, _super);
    function Scene_021() {
        var _this = _super.call(this) || this;
        _this.init();
        return _this;
    }
    Scene_021.prototype.init = function () {
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
        var circle = SpriteUtil.createImage(this.dataVo.sData);
        var scale = 64 / circle.width;
        circle.scaleX = scale;
        circle.scaleY = scale;
        this.player = Matter.Bodies.circle(50, 50, scale * circle.width / 2, {
            label: 'player',
            render: {
                sprite: circle
            }
        }, 0);
        Matter.World.add(this.engine.world, this.player);
        var tcircle = SpriteUtil.createImage(this.dataVo.tData);
        var target = Matter.Bodies.circle(SpriteUtil.stageWidth - tcircle.width / 2 - 10, SpriteUtil.stageHeight - tcircle.height / 2 - 10, tcircle.width / 2, {
            label: 'target',
            isStatic: true,
            render: {
                sprite: tcircle
            }
        }, 0);
        Matter.World.add(this.engine.world, target);
        this.target = target;
        this.createWall();
        if (this.dataVo.level == 1) {
            this.createEnemy0();
        }
        else if (this.dataVo.level == 2) {
            this.createEnemy1();
        }
        else if (this.dataVo.level == 3) {
            this.createEnemy2();
        }
        else if (this.dataVo.level == 4) {
            this.createEnemy3();
        }
        else if (this.dataVo.level == 5) {
            this.createEnemy4();
        }
        else if (this.dataVo.level == 6) {
            this.createEnemy5();
        }
        else if (this.dataVo.level == 7) {
            this.createEnemy6();
        }
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
        Matter.Events.on(this.engine, "collisionStart", this.collisionHandle.bind(this));
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchHandler, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.touchHandler, this);
    };
    Scene_021.prototype.touchHandler = function (evt) {
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
    Scene_021.prototype.movePlayer = function (start, end) {
        var xx = start.x - end.x;
        var yy = start.y - end.y;
        Matter.Body.setPosition(this.player, { x: this.player.position.x + xx, y: this.player.position.y + yy });
    };
    Scene_021.prototype.collisionHandle = function (evt) {
        // console.log("碰撞o%",evt);
        var pairs = evt.pairs;
        for (var _i = 0, pairs_1 = pairs; _i < pairs_1.length; _i++) {
            var pair = pairs_1[_i];
            if (pair.bodyA.label == "target" && pair.bodyB.label == "player") {
                this.destroy();
                var time = this.timeItem.leftTime;
                this.timeItem.stop();
                if (time >= this.dataVo.time / 3) {
                    EffectUtil.showResultEffect(EffectUtil.PERFECT);
                }
                else if (time >= this.dataVo.time * 2 / 3) {
                    EffectUtil.showResultEffect(EffectUtil.GREAT);
                }
                else {
                    EffectUtil.showResultEffect(EffectUtil.GOOD);
                }
            }
            else if (pair.bodyA.label == "player" && pair.bodyB.label == "target") {
                this.destroy();
                var time = this.timeItem.leftTime;
                this.timeItem.stop();
                if (time >= this.dataVo.time / 3) {
                    EffectUtil.showResultEffect(EffectUtil.PERFECT);
                }
                else if (time >= this.dataVo.time * 2 / 3) {
                    EffectUtil.showResultEffect(EffectUtil.GREAT);
                }
                else {
                    EffectUtil.showResultEffect(EffectUtil.GOOD);
                }
            }
            else if (pair.bodyA.label == "player" || pair.bodyB.label == "player") {
                this.destroy();
                this.timeItem.stop();
                EffectUtil.showResultEffect();
            }
        }
    };
    Scene_021.prototype.createEnemy0 = function () {
        var rect = SpriteUtil.createRect(SpriteUtil.stageWidth / 3, SpriteUtil.stageHeight / 2, this.getSevenColor(), true);
        var wall = Matter.Bodies.rectangle(SpriteUtil.stageWidth - rect.width / 2, SpriteUtil.stageCenterY, rect.width, rect.height, {
            isStatic: true,
            render: {
                sprite: rect
            }
        });
        Matter.World.add(this.engine.world, wall);
        var rect1 = SpriteUtil.createRect(SpriteUtil.stageWidth / 3, SpriteUtil.stageHeight / 2, this.getSevenColor(), true);
        var left = Matter.Bodies.rectangle(rect1.width / 2, SpriteUtil.stageCenterY, rect1.width, rect1.height, {
            isStatic: true,
            render: {
                sprite: rect1
            }
        });
        Matter.World.add(this.engine.world, left);
    };
    Scene_021.prototype.createEnemy1 = function () {
        var rect = SpriteUtil.createRect(SpriteUtil.stageWidth / 3, SpriteUtil.stageHeight / 2, this.getSevenColor(), true);
        var right = Matter.Bodies.rectangle(SpriteUtil.stageWidth - rect.width / 2, SpriteUtil.stageCenterY, rect.width, rect.height, {
            isStatic: true,
            render: {
                sprite: rect
            }
        });
        Matter.World.add(this.engine.world, right);
        var rect1 = SpriteUtil.createRect(SpriteUtil.stageWidth / 3, SpriteUtil.stageHeight / 2, this.getSevenColor(), true);
        var left = Matter.Bodies.rectangle(rect1.width / 2, SpriteUtil.stageCenterY, rect1.width, rect1.height, {
            isStatic: true,
            render: {
                sprite: rect1
            }
        });
        Matter.World.add(this.engine.world, left);
        //top
        var rect2 = SpriteUtil.createRect(SpriteUtil.stageWidth / 2, SpriteUtil.stageWidth / 3.5, this.getSevenColor(), true);
        var top = Matter.Bodies.rectangle(SpriteUtil.stageCenterX, rect2.height / 2, rect2.width, rect2.height, {
            isStatic: true,
            render: {
                sprite: rect2
            }
        });
        Matter.World.add(this.engine.world, top);
        //bottom
        var rect3 = SpriteUtil.createRect(SpriteUtil.stageWidth / 2, SpriteUtil.stageWidth / 3.5, this.getSevenColor(), true);
        var bottom = Matter.Bodies.rectangle(SpriteUtil.stageCenterX, SpriteUtil.stageHeight - rect2.height / 2, rect2.width, rect3.height, {
            isStatic: true,
            render: {
                sprite: rect3
            }
        });
        Matter.World.add(this.engine.world, bottom);
    };
    Scene_021.prototype.createEnemy2 = function () {
        var rect = SpriteUtil.createRect(SpriteUtil.stageWidth / 1.4, SpriteUtil.stageHeight / 1.3, this.getSevenColor(), true);
        var wall = Matter.Bodies.rectangle(SpriteUtil.stageCenterX, SpriteUtil.stageCenterY, rect.width, rect.height, {
            isStatic: true,
            render: {
                sprite: rect
            }
        });
        Matter.World.add(this.engine.world, wall);
    };
    Scene_021.prototype.createEnemy3 = function () {
        var rect = SpriteUtil.createRect(SpriteUtil.stageWidth - 100, SpriteUtil.stageHeight / 8, this.getSevenColor(), true);
        var wall = Matter.Bodies.rectangle(rect.width / 2, 200, rect.width, rect.height, {
            isStatic: true,
            render: {
                sprite: rect
            }
        });
        Matter.World.add(this.engine.world, wall);
        var recta = SpriteUtil.createRect(SpriteUtil.stageWidth - 100, SpriteUtil.stageHeight / 8, this.getSevenColor(), true);
        var walla = Matter.Bodies.rectangle(SpriteUtil.stageWidth - recta.width / 2, SpriteUtil.stageHeight - 200, recta.width, recta.height, {
            isStatic: true,
            render: {
                sprite: recta
            }
        });
        Matter.World.add(this.engine.world, walla);
        var rect1 = SpriteUtil.createRect(SpriteUtil.stageWidth / 6, SpriteUtil.stageHeight / 2.4, this.getSevenColor(), true);
        var wall1 = Matter.Bodies.rectangle(SpriteUtil.stageCenterX, SpriteUtil.stageCenterY, rect1.width, rect1.height, {
            isStatic: true,
            render: {
                sprite: rect1
            }
        });
        Matter.World.add(this.engine.world, wall1);
        var rect2 = SpriteUtil.createRect(SpriteUtil.stageWidth - 200, SpriteUtil.stageWidth / 5, this.getSevenColor(), true);
        var wall2 = Matter.Bodies.rectangle(SpriteUtil.stageCenterX, SpriteUtil.stageCenterY, rect2.width, rect2.height, {
            isStatic: true,
            render: {
                sprite: rect2
            }
        });
        Matter.World.add(this.engine.world, wall2);
    };
    Scene_021.prototype.createEnemy4 = function () {
        var rect = SpriteUtil.createRect(SpriteUtil.stageWidth - 100, SpriteUtil.stageHeight / 5, this.getSevenColor(), true);
        var wall = Matter.Bodies.rectangle(SpriteUtil.stageCenterX - 50, SpriteUtil.stageHeight / 4, rect.width, rect.height, {
            isStatic: true,
            render: {
                sprite: rect
            }
        });
        Matter.World.add(this.engine.world, wall);
        var rect1 = SpriteUtil.createRect(SpriteUtil.stageWidth - 100, SpriteUtil.stageHeight / 8, this.getSevenColor(), true);
        var wall1 = Matter.Bodies.rectangle(SpriteUtil.stageCenterX + 50, SpriteUtil.stageHeight / 2, rect1.width, rect1.height, {
            isStatic: true,
            render: {
                sprite: rect1
            }
        });
        Matter.World.add(this.engine.world, wall1);
        var rect2 = SpriteUtil.createRect(SpriteUtil.stageWidth - 100, SpriteUtil.stageHeight / 5, this.getSevenColor(), true);
        var wall2 = Matter.Bodies.rectangle(SpriteUtil.stageCenterX - 50, SpriteUtil.stageHeight * 3 / 4, rect2.width, rect2.height, {
            isStatic: true,
            render: {
                sprite: rect2
            }
        });
        Matter.World.add(this.engine.world, wall2);
    };
    Scene_021.prototype.createEnemy5 = function () {
        var rect = SpriteUtil.createRect(SpriteUtil.stageWidth / 6, SpriteUtil.stageHeight / 1.2, this.getSevenColor(), true);
        var wall = Matter.Bodies.rectangle(180, rect.height / 2, rect.width, rect.height, {
            isStatic: true,
            render: {
                sprite: rect
            }
        });
        Matter.World.add(this.engine.world, wall);
        var rect1 = SpriteUtil.createRect(SpriteUtil.stageWidth / 6, SpriteUtil.stageHeight / 1.2, this.getSevenColor(), true);
        var wall1 = Matter.Bodies.rectangle(wall.position.x + 220, SpriteUtil.stageHeight - rect1.height / 2, rect1.width, rect1.height, {
            isStatic: true,
            render: {
                sprite: rect1
            }
        });
        Matter.World.add(this.engine.world, wall1);
        var rect2 = SpriteUtil.createRect(SpriteUtil.stageWidth / 6, SpriteUtil.stageHeight / 1.2, this.getSevenColor(), true);
        var wall2 = Matter.Bodies.rectangle(wall1.position.x + 220, rect2.height / 2, rect2.width, rect2.height, {
            isStatic: true,
            render: {
                sprite: rect2
            }
        });
        Matter.World.add(this.engine.world, wall2);
    };
    Scene_021.prototype.createEnemy6 = function () {
        var tlen = SpriteUtil.stageHeight / 16;
        var recth1 = SpriteUtil.createRect(SpriteUtil.stageWidth / 1.2, tlen, this.getSevenColor(), true);
        var wallh1 = Matter.Bodies.rectangle(recth1.width / 2, 160, recth1.width, recth1.height, {
            isStatic: true,
            render: {
                sprite: recth1
            }
        });
        Matter.World.add(this.engine.world, wallh1);
        var rect1 = SpriteUtil.createRect(tlen, SpriteUtil.stageHeight / 8, this.getSevenColor(), true);
        var wall1 = Matter.Bodies.rectangle(recth1.width - rect1.width / 2, wallh1.position.y + recth1.height / 2 + rect1.height / 2, rect1.width, rect1.height, {
            isStatic: true,
            render: {
                sprite: rect1
            }
        });
        Matter.World.add(this.engine.world, wall1);
        var rect1x = SpriteUtil.createRect(tlen, SpriteUtil.stageHeight / 8, this.getSevenColor(), true);
        var wall1x = Matter.Bodies.rectangle(200, wallh1.position.y + recth1.height / 2 + rect1x.height / 2, rect1x.width, rect1x.height, {
            isStatic: true,
            render: {
                sprite: rect1x
            }
        });
        Matter.World.add(this.engine.world, wall1x);
        var recth2 = SpriteUtil.createRect(SpriteUtil.stageWidth / 1.2 + 30, tlen, this.getSevenColor(), true);
        var wallh2 = Matter.Bodies.rectangle(SpriteUtil.stageWidth - recth2.width / 2, wall1.position.y + rect1.height / 2 + 120, recth2.width, recth2.height, {
            isStatic: true,
            render: {
                sprite: recth2
            }
        });
        Matter.World.add(this.engine.world, wallh2);
        var rect2 = SpriteUtil.createRect(tlen, rect1.height, this.getSevenColor(), true);
        var wall2 = Matter.Bodies.rectangle(wall1.position.x - 180, wallh2.position.y - recth2.height / 2 - rect2.height / 2, rect2.width, rect2.height, {
            isStatic: true,
            render: {
                sprite: rect2
            }
        });
        Matter.World.add(this.engine.world, wall2);
        var rect2x = SpriteUtil.createRect(tlen, rect1.height, this.getSevenColor(), true);
        var wall2x = Matter.Bodies.rectangle(wallh2.position.x - recth2.width / 2 + rect2x.width / 2, wallh2.position.y + recth2.height / 2 + rect2x.height / 2, rect2x.width, rect2x.height, {
            isStatic: true,
            render: {
                sprite: rect2x
            }
        });
        Matter.World.add(this.engine.world, wall2x);
        var recth3 = SpriteUtil.createRect(rect1.height * 2 + 20, tlen, this.getSevenColor(), true);
        var wallh3 = Matter.Bodies.rectangle(recth3.width / 2, wall2x.position.y + rect2x.height / 2 + 120, recth3.width, recth3.height, {
            isStatic: true,
            render: {
                sprite: recth3
            }
        });
        Matter.World.add(this.engine.world, wallh3);
        var rect3x = SpriteUtil.createRect(tlen, rect1.height, this.getSevenColor(), true);
        var wall3x = Matter.Bodies.rectangle(recth3.width - rect3x.width / 2, wallh3.position.y - recth3.height / 2 - rect3x.height / 2, rect3x.width, rect3x.height, {
            isStatic: true,
            render: {
                sprite: rect3x
            }
        });
        Matter.World.add(this.engine.world, wall3x);
        var rect3y = SpriteUtil.createRect(tlen - 30, rect1.height * 2, this.getSevenColor(), true);
        var wall3y = Matter.Bodies.rectangle(wall3x.position.x + 160, wall3x.position.y + recth3.height + 50, rect3y.width, rect3y.height, {
            isStatic: true,
            render: {
                sprite: rect3y
            }
        });
        Matter.World.add(this.engine.world, wall3y);
        var rect3z = SpriteUtil.createRect(tlen - 30, rect1.height * 2.5, this.getSevenColor(), true);
        var wall3z = Matter.Bodies.rectangle(wall3y.position.x + 140, wall3x.position.y + recth3.height + 0.5 * rect1.height / 2 + 50, rect3z.width, rect3z.height, {
            isStatic: true,
            render: {
                sprite: rect3z
            }
        });
        Matter.World.add(this.engine.world, wall3z);
        var recth4 = SpriteUtil.createRect(rect1.height * 2 + 20, tlen - 30, this.getSevenColor(), true);
        var wallh4 = Matter.Bodies.rectangle(wall3y.position.x - rect3y.width / 2 - recth4.width / 2, wall3y.position.y + rect3y.height / 2 - recth4.height / 2, recth4.width, recth4.height, {
            isStatic: true,
            render: {
                sprite: recth4
            }
        });
        Matter.World.add(this.engine.world, wallh4);
        var rect4x = SpriteUtil.createRect(tlen - 30, rect1.height, this.getSevenColor(), true);
        var wall4x = Matter.Bodies.rectangle(wallh4.position.x - recth4.width / 2 + rect4x.width / 2, wallh4.position.y + recth4.height / 2 + rect4x.height / 2, rect4x.width, rect4x.height, {
            isStatic: true,
            render: {
                sprite: rect4x
            }
        });
        Matter.World.add(this.engine.world, wall4x);
        var recth5 = SpriteUtil.createRect(rect1.height * 2 + rect3z.width + 20, tlen - 30, this.getSevenColor(), true);
        var wallh5 = Matter.Bodies.rectangle(wall3z.position.x + rect3z.width / 2 - recth5.width / 2, wall3z.position.y + rect3z.height / 2 + recth5.height / 2, recth5.width, recth5.height, {
            isStatic: true,
            render: {
                sprite: recth5
            }
        });
        Matter.World.add(this.engine.world, wallh5);
        var recth6 = SpriteUtil.createRect(rect1.height * 2 + rect3z.width + 40, tlen - 40, this.getSevenColor(), true);
        var wallh6 = Matter.Bodies.rectangle(SpriteUtil.stageWidth - recth6.width / 2, wallh5.position.y + recth5.height / 2 + 100, recth6.width, recth6.height, {
            isStatic: true,
            render: {
                sprite: recth6
            }
        });
        Matter.World.add(this.engine.world, wallh6);
        Matter.Body.setPosition(this.target, { x: wallh6.position.x - recth6.width / 2 - 80, y: this.target.position.y });
    };
    Scene_021.prototype.getSevenColor = function () {
        var random = Math.floor(7 * Math.random());
        var arr = [0xFF0000, 0xFF7F00, 0xFFFF00, 0x00FF00, 0x00FFFF, 0x0000FF, 0x8B00FF];
        return arr[random];
    };
    //创建墙壁
    Scene_021.prototype.createWall = function () {
        var left = Matter.Bodies.rectangle(0, SpriteUtil.stageCenterY, 10, SpriteUtil.stageHeight, { isStatic: true });
        var right = Matter.Bodies.rectangle(SpriteUtil.stageWidth, SpriteUtil.stageCenterY, 10, SpriteUtil.stageHeight, { isStatic: true });
        var top = Matter.Bodies.rectangle(SpriteUtil.stageCenterX, 0, SpriteUtil.stageWidth, 10, { isStatic: true });
        var bottom = Matter.Bodies.rectangle(SpriteUtil.stageCenterX, SpriteUtil.stageHeight, SpriteUtil.stageWidth, 10, { isStatic: true });
        Matter.World.add(this.engine.world, [left, right, top, bottom]);
    };
    Scene_021.prototype.destroy = function () {
        this.touchEnabled = false;
        Matter.Events.off(this.engine, "collisionStart", this.collisionHandle);
        Matter.Runner.stop(this.runner);
        EgretRender.stop();
        Matter.Engine.clear(this.engine);
    };
    Scene_021.prototype.enter = function () {
        _super.prototype.enter.call(this);
        this.timeItem.start();
    };
    Scene_021.prototype.exit = function () {
        _super.prototype.exit.call(this);
        this.destroy();
    };
    return Scene_021;
}(BaseScene));
__reflect(Scene_021.prototype, "Scene_021");
//# sourceMappingURL=Scene_021.js.map