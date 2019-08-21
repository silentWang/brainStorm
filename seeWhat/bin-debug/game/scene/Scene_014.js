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
//拼图游戏 先选图片再拼图
var Scene_014 = (function (_super) {
    __extends(Scene_014, _super);
    function Scene_014() {
        var _this = _super.call(this) || this;
        _this.currTarget = null;
        _this.isOperating = false;
        _this.init();
        return _this;
    }
    Scene_014.prototype.init = function () {
        this.cropPoints = [];
        this.cropPics = [];
        this.createFruit();
    };
    //选择水果  sData 各种图像  tdata 标题
    Scene_014.prototype.createFruit = function () {
        var arr = this.dataVo.sData;
        var len = arr.length;
        this.beforeContainer = new egret.Sprite();
        this.addChild(this.beforeContainer);
        for (var i = 0; i < len; i++) {
            var xx = 25 + 225 * (i % 3);
            var yy = 150 + 225 * Math.floor(i / 3);
            var bit = SpriteUtil.createImage(arr[i]);
            bit.anchorOffsetX = 0;
            bit.anchorOffsetY = 0;
            bit.width = 200;
            bit.height = 200;
            bit.x = xx;
            bit.y = yy;
            bit.name = arr[i];
            bit.touchEnabled = true;
            bit.addEventListener(egret.TouchEvent.TOUCH_TAP, this.selectPic, this);
            this.beforeContainer.addChild(bit);
        }
        this.titleTxt = SpriteUtil.createText(this.dataVo.tData, 32, 0xF8F8FF);
        this.titleTxt.x = SpriteUtil.stageCenterX;
        this.titleTxt.y = 100;
        this.addChild(this.titleTxt);
    };
    Scene_014.prototype.selectPic = function (evt) {
        GameSound.instance().playSound('click');
        var name = evt.target.name;
        this.createSeparate("images_json#" + name);
        this.beforeContainer.visible = false;
        this.removeChild(this.beforeContainer);
        this.titleTxt.text = '来吧！还原这个图像！';
        this.titleTxt.anchorOffsetX = this.titleTxt.width / 2;
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
        this.timeItem.start();
    };
    //裁剪纹理
    Scene_014.prototype.createSeparate = function (res) {
        this.picContainer = new egret.Sprite();
        var rect = new egret.Shape();
        rect.graphics.beginFill(0x00000f);
        rect.graphics.drawRect(0, 0, 660, 660);
        rect.graphics.endFill();
        this.picContainer.addChild(rect);
        this.picContainer.x = 30;
        this.picContainer.y = 200;
        this.addChild(this.picContainer);
        var bitmap = new egret.Bitmap(RES.getRes(res));
        bitmap.width = 640;
        bitmap.height = 640;
        var arr = [];
        for (var i = 0; i < 16; i++) {
            arr.push(i);
            var xx = 2 + 165 * (i % 4);
            var yy = 2 + 165 * Math.floor(i / 4);
            this.cropPoints.push({ x: xx, y: yy });
            //裁剪纹理
            var renderTexture = new egret.RenderTexture();
            renderTexture.drawToTexture(bitmap, new egret.Rectangle(160 * (i % 4), 160 * Math.floor(i / 4), 160, 160));
            var bit = new egret.Bitmap();
            bit.texture = renderTexture;
            bit.x = xx;
            bit.y = yy;
            bit['sIndex'] = i;
            bit['tIndex'] = i;
            bit.touchEnabled = true;
            bit.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clkCrop, this);
            this.picContainer.addChild(bit);
            this.cropPics.push(bit);
        }
        arr.sort(function (a, b) {
            return Math.random() > 0.5 ? 1 : -1;
        });
        for (var i = 0; i < arr.length; i++) {
            var index = arr[i];
            this.cropPics[i]['tIndex'] = index;
            this.cropPics[i].x = this.cropPoints[index].x;
            this.cropPics[i].y = this.cropPoints[index].y;
        }
    };
    //事件处理
    Scene_014.prototype.clkCrop = function (evt) {
        var _this = this;
        if (this.isOperating || this.timeItem.leftTime <= 0)
            return;
        GameSound.instance().playSound('click');
        var pic = evt.target;
        if (this.currTarget == null) {
            this.currTarget = pic;
            pic.alpha = 0.5;
        }
        else if (this.currTarget == pic) {
            this.currTarget = null;
            pic.alpha = 1;
        }
        else {
            var index1 = pic['tIndex'];
            var index2 = this.currTarget['tIndex'];
            //交换tindex
            pic['tIndex'] = index2;
            this.currTarget['tIndex'] = index1;
            //互换位置
            pic.alpha = 1;
            this.currTarget.alpha = 1;
            egret.Tween.get(this.currTarget).to({ x: this.cropPoints[index1].x, y: this.cropPoints[index1].y }, 200).call(function () {
                egret.Tween.removeTweens(_this.currTarget);
                _this.currTarget = null;
            });
            egret.Tween.get(pic).to({ x: this.cropPoints[index2].x, y: this.cropPoints[index2].y }, 200).call(function () {
                egret.Tween.removeTweens(pic);
                _this.checkOver();
            });
        }
    };
    Scene_014.prototype.checkOver = function () {
        if (this.isCanPass()) {
            var leftTime = this.timeItem.leftTime;
            this.timeItem.stop();
            if (leftTime >= 90) {
                EffectUtil.showResultEffect(EffectUtil.PERFECT);
            }
            else if (leftTime >= 60) {
                EffectUtil.showResultEffect(EffectUtil.GREAT);
            }
            else {
                EffectUtil.showResultEffect(EffectUtil.GOOD);
            }
        }
    };
    Scene_014.prototype.isCanPass = function () {
        for (var _i = 0, _a = this.cropPics; _i < _a.length; _i++) {
            var pic = _a[_i];
            if (pic['sIndex'] != pic['tIndex'])
                return false;
        }
        return true;
    };
    return Scene_014;
}(BaseScene));
__reflect(Scene_014.prototype, "Scene_014");
//# sourceMappingURL=Scene_014.js.map