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
//十二生肖
var Scene_001 = (function (_super) {
    __extends(Scene_001, _super);
    function Scene_001() {
        var _this = _super.call(this) || this;
        _this.init();
        return _this;
    }
    Scene_001.prototype.init = function () {
        // this.dataVo.sData = '鼠鹅牛猫虎驴兔鸭龙鱼蛇龟马鸟羊象猴蛙鸡熊狗狼猪凤';
        // this.dataVo.tData = '鼠牛虎兔龙蛇马羊猴鸡狗猪';
        // this.dataVo.time = 60;
        this.selectedArr = [];
        var rect = SpriteUtil.createRect(SpriteUtil.stageWidth, SpriteUtil.stageHeight / 8, 0xCDCDC1);
        rect.x = SpriteUtil.stageWidth / 2;
        rect.y = SpriteUtil.stageHeight - rect.height / 2;
        rect.touchEnabled = true;
        this.bounds = { width: SpriteUtil.stageWidth - 60, height: SpriteUtil.stageHeight - SpriteUtil.stageHeight / 8 - 60 };
        for (var i = 0; i < this.dataVo.sData.length; i++) {
            this.createText(this.dataVo.sData.charAt(i));
        }
        this.addChild(rect);
        this.tarText = new egret.TextField();
        this.tarText.name = 'target_text';
        this.tarText.textAlign = 'center';
        this.tarText.text = '';
        this.tarText.size = 36;
        this.tarText.textColor = 0x0000ff;
        this.tarText.stroke = 1;
        this.tarText.strokeColor = 0xffff00;
        this.tarText.bold = true;
        this.tarText.width = SpriteUtil.stageWidth;
        this.tarText.y = rect.y - 30;
        this.addChild(this.tarText);
        this.tarText.touchEnabled = true;
        this.tarText.addEventListener(egret.TouchEvent.TOUCH_TAP, this.textClk, this);
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
    };
    //事件处理
    Scene_001.prototype.textClk = function (evt) {
        var _this = this;
        var text = evt.target;
        if (this.tarText == text) {
            text = this.selectedArr.pop();
            var xx = 200 + 320 * Math.random();
            var yy = SpriteUtil.stageHeight / 2 - 100;
            var tstr = this.tarText.text;
            this.tarText.text = tstr.substr(0, tstr.length - 1);
            egret.Tween.get(text).to({ x: xx, y: yy }, 500, egret.Ease.quadOut).call(function () {
                egret.Tween.removeTweens(text);
                _this.back(text);
            });
        }
        else {
            text.touchEnabled = false;
            this.tarText.touchEnabled = false;
            egret.Tween.removeTweens(text);
            egret.Tween.get(text).to({ x: this.tarText.x + this.tarText.width / 2, y: this.tarText.y, rotation: 0 }, 500).call(function () {
                egret.Tween.removeTweens(text);
                var str = "" + _this.tarText.text + text.text;
                _this.tarText.text = str;
                text.touchEnabled = true;
                _this.tarText.touchEnabled = true;
                _this.selectedArr.push(text);
                if (str == _this.dataVo.tData) {
                    if (_this.timeItem.leftTime >= 30) {
                        EffectUtil.showResultEffect(EffectUtil.PERFECT);
                    }
                    else if (_this.timeItem.leftTime >= 15) {
                        EffectUtil.showResultEffect(EffectUtil.EXCELLENT);
                    }
                    else {
                        EffectUtil.showResultEffect(EffectUtil.GOOD);
                    }
                    _this.timeItem.stop();
                }
            });
        }
    };
    Scene_001.prototype.createText = function (name) {
        var text = new egret.TextField();
        text.size = 48;
        text.text = name;
        text.textColor = 0xffffff * (8 * Math.random() + 2) / 10;
        text.stroke = 0.5;
        text.strokeColor = 0xffff00;
        text.bold = true;
        text.x = this.bounds.width * Math.random();
        text.y = this.bounds.height * Math.random();
        this.addChild(text);
        text.touchEnabled = true;
        text.addEventListener(egret.TouchEvent.TOUCH_TAP, this.textClk, this);
        this.back(text);
    };
    Scene_001.prototype.back = function (target) {
        var _this = this;
        egret.Tween.get(target).to({
            x: this.bounds.width * Math.random(),
            y: this.bounds.height * Math.random(),
            rotation: 360 * Math.random()
        }, 5000 + 2000 * Math.random()).call(function () {
            _this.back(target);
        });
    };
    Scene_001.prototype.enter = function () {
        _super.prototype.enter.call(this);
        this.timeItem.start();
    };
    //清内存
    Scene_001.prototype.exit = function () {
        while (this.numChildren > 1) {
            var child = this.getChildAt(this.numChildren - 1);
            if (child instanceof egret.TextField) {
                child.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.textClk, this);
            }
            egret.Tween.removeTweens(child);
            this.removeChild(child);
        }
        this.timeItem.stop();
        _super.prototype.exit.call(this);
    };
    return Scene_001;
}(BaseScene));
__reflect(Scene_001.prototype, "Scene_001");
//# sourceMappingURL=Scene_001.js.map