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
//大海捞针 找文字
var Scene_011 = (function (_super) {
    __extends(Scene_011, _super);
    function Scene_011() {
        var _this = _super.call(this) || this;
        _this.isOperating = false;
        _this.init();
        return _this;
    }
    Scene_011.prototype.init = function () {
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
        var sprite = new egret.Sprite();
        var rand = Math.floor(100 * Math.random() + 10);
        console.log(rand);
        for (var i = 0; i < 120; i++) {
            var text = void 0;
            if (i == rand) {
                text = this.createText(this.dataVo.tData);
                this.tarTxt = text;
            }
            else {
                text = this.createText(this.dataVo.sData);
            }
            text.x = (i % 10) * 66;
            text.y = 66 * Math.floor(i / 10);
            sprite.addChild(text);
        }
        sprite.anchorOffsetX = sprite.width / 2;
        // sprite.anchorOffsetY = sprite.height/2;
        sprite.x = SpriteUtil.stageCenterX;
        sprite.y = 100;
        this.addChild(sprite);
    };
    Scene_011.prototype.textClk = function (evt) {
        if (this.isOperating)
            return;
        this.isOperating = true;
        var name = evt.target.text;
        if (name == this.dataVo.tData) {
            var time = this.timeItem.leftTime;
            this.timeItem.stop();
            if (time >= 25) {
                EffectUtil.showResultEffect(EffectUtil.PERFECT);
            }
            else if (time >= 15) {
                EffectUtil.showResultEffect(EffectUtil.EXCELLENT);
            }
            else {
                EffectUtil.showResultEffect(EffectUtil.GOOD);
            }
        }
        else {
            this.timeItem.stop();
            this.tarTxt.textColor = 0xff0000;
            EffectUtil.showResultEffect();
        }
    };
    Scene_011.prototype.createText = function (name) {
        var text = new egret.TextField();
        text.size = 54;
        text.text = name;
        text.textColor = 0x0000ff; //0xffffff*(8*Math.random() + 2)/10;
        text.stroke = 0.5;
        text.strokeColor = 0xffff00;
        text.bold = true;
        this.addChild(text);
        text.touchEnabled = true;
        text.addEventListener(egret.TouchEvent.TOUCH_TAP, this.textClk, this);
        return text;
    };
    Scene_011.prototype.enter = function () {
        _super.prototype.enter.call(this);
        this.timeItem.start();
    };
    return Scene_011;
}(BaseScene));
__reflect(Scene_011.prototype, "Scene_011");
//# sourceMappingURL=Scene_011.js.map