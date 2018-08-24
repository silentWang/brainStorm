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
//只能吃水果
var Scene_5 = (function (_super) {
    __extends(Scene_5, _super);
    function Scene_5() {
        var _this = _super.call(this) || this;
        _this.itemCategory = 0x0002;
        _this.playerCategory = 0x0100;
        _this.isTouching = false;
        _this.init();
        return _this;
    }
    Scene_5.prototype.init = function () {
        var _this = this;
        this.engine = Matter.Engine.create({ enableSleeping: false }, null);
        this.runner = Matter.Runner.create(null);
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
        this.recycleArr = [];
        this.initAllItem();
        var plySpr = SpriteUtil.createText('🙉', 100);
        this.player = Matter.Bodies.circle(100, 1230, plySpr.height / 2, {
            isStatic: true,
            collisionFilter: {
                category: this.playerCategory
            },
            render: {
                sprite: plySpr
            }
        }, 0);
        Matter.World.add(this.engine.world, this.player);
        plySpr.touchEnabled = true;
        plySpr.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function () {
            _this.isTouching = true;
        }, this);
        plySpr.addEventListener(egret.TouchEvent.TOUCH_MOVE, function (evt) {
            if (_this.isTouching) {
                Matter.Body.setPosition(_this.player, { x: evt['stageX'], y: 1230 });
            }
        }, this);
        plySpr.addEventListener(egret.TouchEvent.TOUCH_END, function () {
            _this.isTouching = false;
        }, this);
        Matter.Events.on(this.engine, 'beforeUpdate', this.beforeUpdate.bind(this));
        Matter.Events.on(this.engine, 'collisionStart', this.collisionStart.bind(this));
        var ids = egret.setInterval(function () {
            if (!_this.playAttack()) {
                egret.clearInterval(ids);
            }
        }, this, 500);
    };
    //创建items
    Scene_5.prototype.initAllItem = function () {
        this.recycleArr = [];
        this.fruitArr = [];
        var arr1 = ['🍏', '🍐', '🍑', '🍒', '🍓', '🍅', '🍇', '🍈', '🍉', '🍊', '🍋', '🍌', '🍍'];
        var arr2 = ['💩', '🍖', '🍗', '🍬', '🍔', '🍕', '🍩', '🍡', '⚽', '🍭', '🍟', '💣', '🔋'];
        var len1 = arr1.length;
        var len2 = arr2.length;
        var index = 0;
        for (var i = 0; i < 80; i++) {
            var xx = 50 + (i % 10) * 70;
            var yy = 25 + 70 * Math.floor(i / 10);
            var fruit = void 0;
            if (Math.random() > 0.5) {
                index = Math.floor(len1 * Math.random());
                fruit = this.createItem(arr1[index], 'fruit', xx, yy);
            }
            else {
                index = Math.floor(len2 * Math.random());
                fruit = this.createItem(arr2[index], 'enemy', xx, yy);
            }
            this.fruitArr.push(fruit);
        }
        Matter.World.add(this.engine.world, this.fruitArr);
    };
    Scene_5.prototype.beforeUpdate = function () {
        if (!this.recycleArr || this.recycleArr.length == 0)
            return;
        this.removeBody();
    };
    Scene_5.prototype.collisionStart = function (evt) {
        var pairs = evt.pairs;
        for (var _i = 0, pairs_1 = pairs; _i < pairs_1.length; _i++) {
            var pair = pairs_1[_i];
            if (pair.bodyA == this.player) {
                if (pair.bodyB.name == 'fruit') {
                    this.removeBody(pair.bodyB);
                }
                else if (pair.bodyB.name == 'enemy') {
                    this.destroy();
                    Game.instance().gameScene.gotoOver();
                }
            }
            else if (pair.bodyB == this.player) {
                if (pair.bodyA.name == 'fruit') {
                    this.removeBody(pair.bodyA);
                }
                else if (pair.bodyA.name == 'enemy') {
                    this.destroy();
                    Game.instance().gameScene.gotoOver();
                }
            }
        }
    };
    //回收
    Scene_5.prototype.removeBody = function (tbody) {
        if (tbody === void 0) { tbody = null; }
        if (tbody) {
            var index = this.recycleArr.indexOf(tbody);
            if (index >= 0) {
                this.recycleArr.splice(index, 1);
                Matter.World.remove(this.engine.world, tbody, 0);
                this.removeChild(tbody.render.sprite);
            }
        }
        else {
            var len = this.recycleArr.length;
            for (var i = len - 1; i >= 0; i--) {
                var body = this.recycleArr[i];
                if (body.position.y > SpriteUtil.stageHeight) {
                    Matter.World.remove(this.engine.world, body, 0);
                    this.recycleArr.splice(i, 1);
                    this.removeChild(body.render.sprite);
                }
            }
        }
    };
    //item开始下落
    Scene_5.prototype.playAttack = function () {
        var len = this.fruitArr.length;
        if (len <= 0) {
            if (this.recycleArr.length == 0) {
                this.destroy();
                EventCenter.instance().dispatchEvent(new GameEvent(GameEvent.GOTO_NEXT));
                return false;
            }
            return true;
        }
        var num1 = Math.floor(len * Math.random());
        var body = this.fruitArr.splice(num1, 1)[0];
        this.recycleArr.push(body);
        var dx = this.player.position.x - body.position.x;
        var dy = this.player.position.y - body.position.y;
        var rate = dy / dx;
        if (rate > 5) {
            rate = 5;
        }
        if (rate < -5) {
            rate = -5;
        }
        var fx = dx / Math.abs(dx);
        var fy = fx * rate;
        Matter.Body.setVelocity(body, { x: fx * 3, y: fy * 3 });
        Matter.Body.setAngularVelocity(body, 0.01 * fx);
        return true;
    };
    //create fruit
    Scene_5.prototype.createItem = function (cstr, name, sx, sy) {
        if (sx === void 0) { sx = 0; }
        if (sy === void 0) { sy = 0; }
        var item = SpriteUtil.createText(cstr, 50);
        var itemBody = Matter.Bodies.circle(sx, sy, item.width / 2, {
            name: name,
            frictionAir: 0,
            collisionFilter: {
                category: this.itemCategory,
                mask: this.playerCategory | 0x0001
            },
            render: {
                sprite: item
            }
        }, 0);
        return itemBody;
    };
    //destroy
    Scene_5.prototype.destroy = function () {
        Matter.Runner.stop(this.runner);
        EgretRender.stop();
        Matter.Engine.clear(this.engine);
        Matter.Events.off(this.engine, 'beforeUpdate', this.beforeUpdate);
        Matter.Events.off(this.engine, 'collisionStart', this.collisionStart);
        Matter.World.remove(this.engine.world, this.engine.world.bodies, 0);
        Matter.World.remove(this.engine.world, this.engine.world.constraints, 0);
    };
    Scene_5.prototype.exit = function () {
        this.destroy();
        while (this.numChildren > 1) {
            var child = this.getChildAt(this.numChildren - 1);
            this.removeChild(child);
        }
        _super.prototype.exit.call(this);
    };
    return Scene_5;
}(BaseScene));
__reflect(Scene_5.prototype, "Scene_5");
//# sourceMappingURL=Scene_5.js.map