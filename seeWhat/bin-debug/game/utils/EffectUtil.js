var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var EffectUtil = (function () {
    function EffectUtil() {
    }
    EffectUtil.showResultEffect = function (type) {
        var _this = this;
        if (type === void 0) { type = 0; }
        var str = 'oh shit!';
        if (type == 1) {
            str = 'good';
        }
        else if (type == 2) {
            str = 'excellent';
        }
        else if (type == 3) {
            str = 'perfect';
        }
        var text = SpriteUtil.createText(str, 100, 0xFFD700);
        text.stroke = 5;
        text.strokeColor = 0xFF0000;
        text.bold = true;
        text.x = SpriteUtil.stageCenterX;
        text.y = SpriteUtil.stageCenterY - 200;
        text.scaleX = 5;
        text.scaleY = 5;
        text.alpha = 0.1;
        Game.instance().addMiddle(text);
        egret.Tween.get(text).to({ scaleX: 1, scaleY: 1, alpha: 1 }, 500, egret.Ease.cubicIn).call(function () {
            var ids = egret.setTimeout(function () {
                egret.clearTimeout(ids);
                if (text.parent) {
                    text.parent.removeChild(text);
                }
                if (type == 0) {
                    Game.instance().gameScene.gotoOver();
                }
                else {
                    EventCenter.instance().dispatchEvent(new GameEvent(GameEvent.GOTO_NEXT));
                }
            }, _this, 800);
        });
    };
    //呼吸
    EffectUtil.breath = function (spr, scale) {
        if (scale === void 0) { scale = 0.8; }
        egret.Tween.get(spr, { loop: true }).to({ scaleX: scale, scaleY: scale }, 500).to({ scaleX: 1, scaleY: 1 }, 500);
    };
    EffectUtil.GOOD = 1;
    EffectUtil.EXCELLENT = 2;
    EffectUtil.PERFECT = 3;
    return EffectUtil;
}());
__reflect(EffectUtil.prototype, "EffectUtil");
//# sourceMappingURL=EffectUtil.js.map