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
//找出不一样的颜色块
var Scene_015 = (function (_super) {
    __extends(Scene_015, _super);
    function Scene_015() {
        var _this = _super.call(this) || this;
        _this.init();
        return _this;
    }
    Scene_015.prototype.init = function () {
        var color = this.dataVo.sData[0];
        var num = this.dataVo.sData[1];
        //多少列
        var columns = Math.round(Math.sqrt(num));
        //每个格子宽度
        var wid = Math.round(SpriteUtil.stageWidth - 120) / columns;
        var sprite = new egret.Sprite();
        var tindex = Math.floor(parseInt(num) * Math.random());
        for (var i = 0; i < num; i++) {
            var shape = void 0;
            if (i == tindex) {
                shape = this.createShape(this.dataVo.tData, wid);
                shape.name = this.dataVo.tData;
            }
            else {
                shape = this.createShape(color, wid);
                shape.name = color;
            }
            shape.x = (i % columns) * (wid + 5);
            shape.y = Math.floor(i / columns) * (wid + 5);
            sprite.addChild(shape);
            shape.touchEnabled = true;
            shape.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clkShape, this);
        }
        sprite.x = SpriteUtil.stageCenterX - sprite.width / 2;
        sprite.y = 120;
        this.addChild(sprite);
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
    };
    Scene_015.prototype.clkShape = function (evt) {
        if (this.timeItem.leftTime <= 0)
            return;
        GameSound.instance().playSound('click');
        var name = evt.target.name;
        if (name == this.dataVo.tData) {
            var leftTime = this.timeItem.leftTime;
            this.timeItem.stop();
            if (leftTime >= 2 * this.dataVo.time / 3) {
                EffectUtil.showResultEffect(EffectUtil.PERFECT);
            }
            else if (leftTime >= this.dataVo.time / 2) {
                EffectUtil.showResultEffect(EffectUtil.GREAT);
            }
            else {
                EffectUtil.showResultEffect(EffectUtil.GOOD);
            }
        }
        else {
            this.timeItem.stop();
            EffectUtil.showResultEffect();
        }
    };
    Scene_015.prototype.createShape = function (color, wid, type) {
        if (type === void 0) { type = 0; }
        var shape = new egret.Shape();
        shape.graphics.beginFill(color);
        shape.graphics.drawRect(0, 0, wid, wid);
        shape.graphics.endFill();
        return shape;
    };
    Scene_015.prototype.enter = function () {
        _super.prototype.enter.call(this);
        this.timeItem.start();
    };
    return Scene_015;
}(BaseScene));
__reflect(Scene_015.prototype, "Scene_015");
