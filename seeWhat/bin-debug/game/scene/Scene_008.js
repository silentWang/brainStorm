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
//摸瞎 指星星的 
var Scene_008 = (function (_super) {
    __extends(Scene_008, _super);
    function Scene_008() {
        var _this = _super.call(this) || this;
        _this.animalsArr = CommonUtil.allAnimals.concat();
        _this.needCount = 0;
        _this.isOperating = false;
        _this.init();
        return _this;
    }
    Scene_008.prototype.init = function () {
        this.passArr = [];
        this.animalsArr.sort(function (a, b) {
            if (Math.random() > 0.5)
                return 1;
            if (Math.random() < 0.5)
                return -1;
            return 0;
        });
        this.animalSpr = SpriteUtil.createText(this.animalsArr[this.needCount], 200);
        this.animalSpr.y = SpriteUtil.stageCenterY - 100;
        this.addChild(this.animalSpr);
        this.emojiSpr = SpriteUtil.createText('😭', 280);
        this.emojiSpr.visible = false;
        this.addChild(this.emojiSpr);
        EffectUtil.breath(this.emojiSpr);
        this.playShow();
    };
    //播放前动画
    Scene_008.prototype.playShow = function () {
        var _this = this;
        var animal = this.animalsArr[this.needCount];
        var emoji = this.dataVo.sData[Math.floor(this.dataVo.sData.length * Math.random())];
        this.passArr.push({ animal: animal, emoji: emoji });
        this.animalSpr.text = animal;
        var pos = this.getRandomPos();
        this.animalSpr.x = pos[0];
        this.animalSpr.y = pos[1];
        this.animalSpr.visible = true;
        egret.Tween.get(this.animalSpr).to({ x: SpriteUtil.stageCenterX, y: SpriteUtil.stageCenterY }, 500).call(function () {
            var idx = egret.setTimeout(function () {
                egret.clearTimeout(idx);
                egret.Tween.removeTweens(_this.animalSpr);
                _this.emojiSpr.x = _this.animalSpr.x;
                _this.emojiSpr.y = _this.animalSpr.y;
                _this.emojiSpr.text = emoji;
                _this.emojiSpr.visible = true;
                var xid = egret.setTimeout(function () {
                    egret.clearTimeout(xid);
                    _this.emojiSpr.visible = false;
                    _this.animalSpr.visible = false;
                    _this.needCount++;
                    if (_this.needCount >= 10) {
                        _this.startLook();
                        return;
                    }
                    _this.playShow();
                }, _this, 1500);
            }, _this, 1000);
        });
    };
    //random  position
    Scene_008.prototype.getRandomPos = function () {
        var arr = [
            [0, 0],
            [SpriteUtil.stageCenterX, 0],
            [SpriteUtil.stageWidth, 0],
            [0, SpriteUtil.stageCenterY],
            [SpriteUtil.stageWidth, SpriteUtil.stageCenterY],
            [0, SpriteUtil.stageHeight],
            [SpriteUtil.stageCenterX, SpriteUtil.stageHeight],
            [SpriteUtil.stageWidth, SpriteUtil.stageHeight]
        ];
        var index = Math.floor(arr.length * Math.random());
        return arr[index];
    };
    Scene_008.prototype.startLook = function () {
        egret.Tween.removeAllTweens();
        this.removeChild(this.animalSpr);
        this.removeChild(this.emojiSpr);
        this.dataVo.tData = this.passArr[Math.floor(this.passArr.length * Math.random())].emoji;
        console.log(this.passArr);
        var askstr = "\u8C1C\u9898:\u627E\u51FA\u6240\u6709\u53D1\u51FA\u8868\u60C5" + this.dataVo.tData + "\u7684\u52A8\u7269";
        var text = SpriteUtil.createText(askstr, 36, 0x0000FF);
        text.x = SpriteUtil.stageCenterX;
        text.y = 100;
        this.addChild(text);
        for (var i = 0; i < this.animalsArr.length; i++) {
            var spr = SpriteUtil.createText(this.animalsArr[i], 100);
            spr.x = 100 + (i % 5) * 125;
            spr.y = 200 + 125 * Math.floor(i / 5);
            spr.touchEnabled = true;
            spr.addEventListener(egret.TouchEvent.TOUCH_TAP, this.selectClk, this);
            this.addChild(spr);
        }
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
        this.timeItem.start();
    };
    Scene_008.prototype.selectClk = function (evt) {
        if (this.isOperating)
            return;
        var text = evt.target;
        var isFind = false;
        var len = this.passArr.length;
        for (var i = len - 1; i >= 0; i--) {
            var obj = this.passArr[i];
            if (obj.emoji == this.dataVo.tData && obj.animal == text.text) {
                text.alpha = 0.5;
                text.touchEnabled = false;
                isFind = true;
                this.passArr.splice(i, 1);
            }
        }
        if (!isFind) {
            this.isOperating = true;
            EffectUtil.showResultEffect();
        }
        else {
            if (this.isCanPass()) {
                if (this.timeItem.leftTime >= 25) {
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
    };
    //是否已经找完了
    Scene_008.prototype.isCanPass = function () {
        for (var _i = 0, _a = this.passArr; _i < _a.length; _i++) {
            var obj = _a[_i];
            if (obj.emoji == this.dataVo.tData) {
                return false;
            }
        }
        return true;
    };
    //exit
    Scene_008.prototype.exit = function () {
        _super.prototype.exit.call(this);
        this.timeItem.stop();
        egret.Tween.removeAllTweens();
    };
    return Scene_008;
}(BaseScene));
__reflect(Scene_008.prototype, "Scene_008");
//# sourceMappingURL=Scene_008.js.map