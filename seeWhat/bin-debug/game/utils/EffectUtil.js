var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var EffectUtil = (function () {
    function EffectUtil() {
    }
    EffectUtil.showResultEffect = function (type) {
        var _this = this;
        if (type === void 0) { type = 0; }
        var str = 'you lose';
        if (type == 1) {
            str = 'good';
        }
        else if (type == 2) {
            str = 'great';
        }
        else if (type == 3) {
            str = 'perfect';
        }
        if (type == 0) {
            GameSound.instance().playSound("fail");
        }
        else {
            GameSound.instance().playSound(str);
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
                    if (GameData.reviveCard <= 0) {
                        GameData.reviveCard = 0;
                        Game.instance().gameView.tipsView.open(false);
                    }
                    else {
                        Game.instance().gameView.tipsView.open();
                    }
                }
                else {
                    EventCenter.instance().dispatchEvent(new GameEvent(GameEvent.GOTO_NEXT_LEVEL));
                }
            }, _this, 800);
        });
    };
    //ready go
    EffectUtil.playReadyGo = function () {
        var _this = this;
        var text1 = SpriteUtil.createText("Ready", 100, 0x54FF9F);
        text1.stroke = 5;
        text1.strokeColor = 0xff00ff;
        text1.bold = true;
        text1.x = SpriteUtil.stageCenterX;
        text1.y = SpriteUtil.stageCenterY - 200;
        text1.scaleX = 5;
        text1.scaleY = 5;
        text1.alpha = 0.1;
        Game.instance().addMiddle(text1);
        GameSound.instance().playSound('ready');
        egret.Tween.get(text1).to({ scaleX: 1, scaleY: 1, alpha: 1 }, 300, egret.Ease.cubicIn).call(function () {
            var idx = egret.setTimeout(function () {
                egret.clearTimeout(idx);
                text1.alpha = 0.01;
                text1.text = 'Go';
                text1.scaleX = 5;
                text1.scaleY = 5;
                text1.anchorOffsetX = text1.width / 2;
                text1.anchorOffsetY = text1.height / 2;
                egret.Tween.get(text1).to({ scaleX: 1, scaleY: 1, alpha: 1 }, 300, egret.Ease.cubicIn).call(function () {
                    var sid = egret.setTimeout(function () {
                        egret.clearTimeout(sid);
                        if (text1.parent) {
                            text1.parent.removeChild(text1);
                        }
                        egret.Tween.removeTweens(text1);
                        EventCenter.instance().dispatchEvent(new GameEvent(GameEvent.START_GAME));
                    }, _this, 200);
                });
            }, _this, 400);
        });
    };
    //特殊
    EffectUtil.showTextAndBack = function (txt, backFun, thisObj) {
        var _this = this;
        if (txt === void 0) { txt = ''; }
        if (backFun === void 0) { backFun = null; }
        if (thisObj === void 0) { thisObj = null; }
        if (!txt)
            return;
        var text = SpriteUtil.createText(txt, 100, 0xffff00);
        text.stroke = 5;
        text.strokeColor = 0x0000ff;
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
                egret.Tween.removeTweens(text);
                if (backFun) {
                    if (thisObj) {
                        backFun.call(thisObj);
                    }
                    else {
                        backFun();
                    }
                }
            }, _this, 800);
        });
    };
    //呼吸
    EffectUtil.breath = function (spr, scale) {
        if (scale === void 0) { scale = 0.8; }
        var sx = spr.scaleX;
        var sy = spr.scaleY;
        egret.Tween.get(spr, { loop: true }).to({ scaleX: sx + scale, scaleY: sy + scale }, 500).to({ scaleX: sx, scaleY: sy }, 500);
    };
    EffectUtil.GOOD = 1;
    EffectUtil.GREAT = 2;
    EffectUtil.PERFECT = 3;
    return EffectUtil;
}());
__reflect(EffectUtil.prototype, "EffectUtil");
