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
//连连看 字符版
var Scene_002 = (function (_super) {
    __extends(Scene_002, _super);
    function Scene_002() {
        var _this = _super.call(this) || this;
        _this.init();
        return _this;
    }
    Scene_002.prototype.init = function () {
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
            img.anchorOffsetX = 0;
            img.anchorOffsetY = 0;
            img.scaleX = wid / img.width;
            img.scaleY = wid / img.height;
            img.name = arr[i];
            img.x = (wid + 2) * (i % columns);
            img.y = (wid + 2) * Math.floor(i / columns);
            this.group.addChild(img);
            img.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clkHandler, this);
        }
        this.addChild(this.group);
        this.group.x = SpriteUtil.stageCenterX - this.group.width / 2;
        this.group.y = 200;
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
    };
    Scene_002.prototype.clkHandler = function (evt) {
        if (this.timeItem && this.timeItem.leftTime <= 0)
            return;
        GameSound.instance().playSound('click');
        if (!this.currentSelect) {
            this.currentSelect = evt.target;
            this.currentSelect.alpha = 0.5;
        }
        else if (this.currentSelect == evt.target) {
            this.currentSelect.alpha = 1;
            this.currentSelect = null;
        }
        else {
            if (this.currentSelect.name == evt.target.name) {
                this.group.removeChild(this.currentSelect);
                this.group.removeChild(evt.target);
                this.currentSelect = null;
            }
            else {
                this.currentSelect.alpha = 1;
                this.currentSelect = evt.target;
                this.currentSelect.alpha = 0.5;
            }
        }
        if (this.group.numChildren <= 0) {
            var leftTime = this.timeItem.leftTime;
            this.timeItem.stop();
            if (leftTime >= 60) {
                EffectUtil.showResultEffect(EffectUtil.PERFECT);
            }
            else if (leftTime >= 30) {
                EffectUtil.showResultEffect(EffectUtil.GREAT);
            }
            else {
                EffectUtil.showResultEffect(EffectUtil.GOOD);
            }
        }
    };
    Scene_002.prototype.enter = function () {
        _super.prototype.enter.call(this);
        this.timeItem.start();
    };
    Scene_002.prototype.exit = function () {
        _super.prototype.exit.call(this);
        while (this.numChildren > 1) {
            var child = this.getChildAt(this.numChildren - 1);
            if (child.hasEventListener(egret.TouchEvent.TOUCH_TAP)) {
                child.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.clkHandler, this);
            }
            this.removeChild(child);
        }
    };
    return Scene_002;
}(BaseScene));
__reflect(Scene_002.prototype, "Scene_002");
//# sourceMappingURL=Scene_002.js.map