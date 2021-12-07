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
//记忆连连看
var Scene_029 = (function (_super) {
    __extends(Scene_029, _super);
    function Scene_029() {
        var _this = _super.call(this) || this;
        _this.isCanOperate = true;
        _this.init();
        return _this;
    }
    Scene_029.prototype.init = function () {
        this.createItems();
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
    };
    Scene_029.prototype.clkHandler = function (evt) {
        var _this = this;
        if (this.timeItem && this.timeItem.leftTime <= 0)
            return;
        if (!this.isCanOperate)
            return;
        GameSound.instance().playSound('click');
        this.isCanOperate = false;
        if (!this.currentSelect) {
            this.currentSelect = evt.target;
            this.playAnim(this.currentSelect, true).then(function () {
                _this.isCanOperate = true;
            });
        }
        else if (this.currentSelect == evt.target) {
            this.isCanOperate = true;
        }
        else {
            var target_1 = evt.target;
            this.playAnim(target_1, true).then(function () {
                if (_this.currentSelect.name == target_1.name) {
                    _this.currentSelect.alpha = 0.5;
                    _this.currentSelect.touchEnabled = false;
                    target_1.alpha = 0.5;
                    target_1.touchEnabled = false;
                    _this.isCanOperate = true;
                    _this.currentSelect = null;
                    _this.checkResult();
                }
                else {
                    Promise.all([_this.playAnim(target_1, false), _this.playAnim(_this.currentSelect, false)]).then(function () {
                        _this.currentSelect = null;
                        _this.isCanOperate = true;
                    });
                }
            });
        }
    };
    Scene_029.prototype.checkResult = function () {
        if (this.isCanPass()) {
            var leftTime = this.timeItem.leftTime;
            this.timeItem.stop();
            if (leftTime >= this.dataVo.time * 2 / 3) {
                EffectUtil.showResultEffect(EffectUtil.PERFECT);
            }
            else if (leftTime >= this.dataVo.time / 3) {
                EffectUtil.showResultEffect(EffectUtil.GREAT);
            }
            else {
                EffectUtil.showResultEffect(EffectUtil.GOOD);
            }
        }
    };
    Scene_029.prototype.isCanPass = function () {
        for (var _i = 0, _a = this.group.$children; _i < _a.length; _i++) {
            var child = _a[_i];
            if (child.alpha != 0.5)
                return false;
        }
        return true;
    };
    Scene_029.prototype.playAnim = function (target, isbool) {
        var p = new Promise(function (resolve, reject) {
            egret.Tween.get(target).to({ scaleX: 0 }, 100).call(function () {
                target.getChildAt(0).visible = isbool;
            }).to({ scaleX: 1 }, 100).wait(300).call(function () {
                egret.Tween.removeTweens(target);
                resolve();
            });
        });
        return p;
    };
    Scene_029.prototype.createItems = function () {
        //无序化
        var arr1 = this.dataVo.sData;
        var arr = arr1.concat(arr1);
        var num = arr.length;
        //多少列
        var columns = Math.round(Math.sqrt(num));
        //每个格子宽度
        var wid = Math.round(SpriteUtil.stageWidth - 50) / columns;
        //乱序
        arr.sort(function (a, b) {
            if (Math.random() > 0.5)
                return 1;
            if (Math.random() < 0.5)
                return -1;
            return 0;
        });
        this.group = new egret.Sprite();
        var len = arr.length;
        for (var i = 0; i < len; i++) {
            var img = SpriteUtil.createImage(arr[i], true);
            img.scaleX = wid / img.width;
            img.scaleY = wid / img.height;
            img.touchEnabled = false;
            img.visible = false;
            var w = img.width * img.scaleX;
            var sprite = new egret.Sprite();
            sprite.graphics.beginFill(0xFF6A6A);
            sprite.graphics.drawRect(-w / 2, -w / 2, w, w);
            sprite.graphics.endFill();
            sprite.addChild(img);
            sprite.touchEnabled = true;
            sprite.name = arr[i];
            sprite.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clkHandler, this);
            sprite.x = sprite.width / 2 + (wid + 2) * (i % columns);
            sprite.y = sprite.width / 2 + (wid + 2) * Math.floor(i / columns);
            this.group.addChild(sprite);
        }
        this.addChild(this.group);
        this.group.x = SpriteUtil.stageCenterX - this.group.width / 2;
        this.group.y = 200;
    };
    Scene_029.prototype.enter = function () {
        _super.prototype.enter.call(this);
        this.timeItem.start();
    };
    Scene_029.prototype.exit = function () {
        _super.prototype.exit.call(this);
        while (this.numChildren > 1) {
            var child = this.getChildAt(this.numChildren - 1);
            if (child.hasEventListener(egret.TouchEvent.TOUCH_TAP)) {
                child.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.clkHandler, this);
            }
            this.removeChild(child);
        }
    };
    return Scene_029;
}(BaseScene));
__reflect(Scene_029.prototype, "Scene_029");
//# sourceMappingURL=Scene_029.js.map