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
//吃掉同颜色的方块
var Scene_028 = (function (_super) {
    __extends(Scene_028, _super);
    function Scene_028() {
        var _this = _super.call(this) || this;
        _this.btnArr = [];
        _this.numsVec = {};
        _this.isCanOperate = true;
        _this.init();
        return _this;
    }
    Scene_028.prototype.init = function () {
        //tdata 数组0是总共出现的次数  1是duration
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
        var len = this.dataVo.sData.length;
        for (var i = 0; i < len; i++) {
            this.numsVec[i] = 0;
        }
        this.playAnim();
    };
    Scene_028.prototype.touchHandler = function (evt) {
        if (!this.isCanOperate)
            return;
        var name = evt.target.name;
        var index = name.split("_")[1];
        var text = this.btnArr[index].getChildAt(0);
        var num = parseInt(text.text.split("x")[1]);
        num++;
        text.text = "x" + num;
        if (this.numsVec[index] < num) {
            this.isCanOperate = false;
            this.timeItem.stop();
            EffectUtil.showResultEffect();
        }
        else if (this.isCanPass()) {
            this.isCanOperate = false;
            var time = this.timeItem.leftTime;
            this.timeItem.stop();
            if (time >= this.dataVo.time * 2 / 3) {
                EffectUtil.showResultEffect(EffectUtil.PERFECT);
            }
            else if (time >= this.dataVo.time / 3) {
                EffectUtil.showResultEffect(EffectUtil.GREAT);
            }
            else {
                EffectUtil.showResultEffect(EffectUtil.GOOD);
            }
        }
    };
    Scene_028.prototype.isCanPass = function () {
        var len = this.btnArr.length;
        for (var i = 0; i < len; i++) {
            var text = this.btnArr[i].getChildAt(0);
            var num = parseInt(text.text.split("x")[1]);
            if (num != this.numsVec[i])
                return false;
        }
        return true;
    };
    Scene_028.prototype.playAnim = function () {
        var _this = this;
        var len = this.dataVo.sData.length;
        var num = this.dataVo.tData[0];
        var xnum = num;
        var duration = this.dataVo.tData[1];
        var idx = egret.setInterval(function () {
            var index = Math.floor(len * Math.random());
            var img = SpriteUtil.createImage(_this.dataVo.sData[index]);
            _this.numsVec[index]++;
            img.x = -img.width / 2;
            img.y = SpriteUtil.stageCenterY - 150;
            _this.addChild(img);
            egret.Tween.get(img).to({
                x: SpriteUtil.stageCenterX - 250
            }, duration).to({
                x: SpriteUtil.stageCenterX,
                y: SpriteUtil.stageCenterY - 300
            }, duration).to({
                x: SpriteUtil.stageCenterX + 250,
                y: SpriteUtil.stageCenterY - 160
            }, duration).to({
                x: SpriteUtil.stageWidth + img.width
            }, duration).call(function () {
                egret.Tween.removeTweens(img);
                _this.removeChild(img);
                xnum--;
                if (num <= 0 && xnum <= 0) {
                    _this.createBtnList();
                    _this.timeItem.start();
                }
            });
            num--;
            if (num <= 0) {
                egret.clearInterval(idx);
            }
        }, this, 250);
    };
    Scene_028.prototype.createBtnList = function () {
        var len = this.dataVo.sData.length;
        var title = SpriteUtil.createText("你能确定各自出现次数吗？", 48, 0xF8F8FF);
        title.x = SpriteUtil.stageCenterX;
        title.y = SpriteUtil.stageCenterY - 200;
        this.addChild(title);
        var container = new egret.Sprite();
        for (var i = 0; i < len; i++) {
            var sprite = this.createBtn(this.dataVo.sData[i], i);
            sprite.x = sprite.width / 2 + i * 200;
            sprite.y = sprite.height / 2;
            container.addChild(sprite);
            this.btnArr.push(sprite);
        }
        container.x = SpriteUtil.stageCenterX - container.width / 2;
        container.y = title.y + title.height - 40;
        this.addChild(container);
    };
    Scene_028.prototype.createBtn = function (str, index) {
        var sprite = new egret.Sprite();
        var img = SpriteUtil.createImage(str, true);
        img.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandler, this);
        img.scaleX = 2;
        img.scaleY = 2;
        img.name = str + "_" + index;
        var text = SpriteUtil.createText("x0", 48, 0xF8F8FF);
        text.touchEnabled = false;
        img.y = text.height + 80;
        sprite.addChild(text);
        sprite.addChild(img);
        return sprite;
    };
    return Scene_028;
}(BaseScene));
__reflect(Scene_028.prototype, "Scene_028");
//# sourceMappingURL=Scene_028.js.map