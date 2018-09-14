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
//石头剪刀布
var Scene_013 = (function (_super) {
    __extends(Scene_013, _super);
    function Scene_013() {
        var _this = _super.call(this) || this;
        _this.nameArr = ["阿诺", "爱因斯坦", "牛顿", "作者", "憨豆", "贝克汉姆", "范冰冰", "成龙", "吴京"];
        _this.currWinIndex = 0;
        _this.isOperating = false;
        _this.score = 0;
        _this.init();
        return _this;
    }
    Scene_013.prototype.init = function () {
        var len = this.dataVo.sData.length;
        for (var i = 0; i < len; i++) {
            var btn = SpriteUtil.createButton(this.dataVo.sData[i], 160, 160, 0x000fff, 120);
            btn.x = 60 + 220 * i;
            btn.y = SpriteUtil.stageCenterY + 100;
            this.addChild(btn);
            btn.name = 'index_' + i;
            btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.playDoing, this);
        }
        this.enemySpr = SpriteUtil.createText(this.dataVo.sData[0], 300);
        this.enemySpr.x = SpriteUtil.stageCenterX;
        this.enemySpr.y = SpriteUtil.stageCenterY - 200;
        this.addChild(this.enemySpr);
        //
        this.nameTxt = SpriteUtil.createText("", 48);
        this.addChild(this.nameTxt);
        this.nameTxt.y = this.enemySpr.y - 250;
        this.enemyDoing();
        if (this.dataVo.time > 0) {
            this.timeItem = new TimeItem(this.dataVo.time);
            this.addChild(this.timeItem);
        }
        if (this.dataVo.score > 0) {
            this.scoreItem = new ScoreItem();
            this.scoreItem.setSTScore(0, this.dataVo.score);
            this.scoreItem.x = 50;
            this.addChild(this.scoreItem);
            this.timeItem.x = SpriteUtil.stageWidth - 300;
        }
    };
    Scene_013.prototype.enemyDoing = function () {
        var len = this.dataVo.sData.length;
        var index = Math.floor(len * Math.random());
        var str = this.nameArr[Math.floor(this.nameArr.length * Math.random())];
        this.nameTxt.text = str;
        this.nameTxt.x = SpriteUtil.stageCenterX - this.nameTxt.width;
        this.enemySpr.text = this.dataVo.sData[index];
        this.currWinIndex = index > 0 ? (index - 1) % len : len - 1;
    };
    Scene_013.prototype.playDoing = function (evt) {
        if (this.isOperating)
            return;
        var name = evt.target.name;
        var index = name.split('_')[1];
        if (index == this.currWinIndex) {
            this.enemyDoing();
            this.score++;
            this.scoreItem.setSTScore(this.score);
        }
        else {
            console.log('failed');
        }
    };
    Scene_013.prototype.enter = function () {
        _super.prototype.enter.call(this);
        this.timeItem.start(this.resultBack, this);
    };
    Scene_013.prototype.resultBack = function (time) {
        if (time <= 0) {
            this.isOperating = true;
            if (this.score >= this.dataVo.score + 10) {
                EffectUtil.showResultEffect(EffectUtil.PERFECT);
            }
            else if (this.score >= this.dataVo.score + 5) {
                EffectUtil.showResultEffect(EffectUtil.EXCELLENT);
            }
            else if (this.score >= this.dataVo.score) {
                EffectUtil.showResultEffect(EffectUtil.GOOD);
            }
            else {
                EffectUtil.showResultEffect();
            }
        }
    };
    return Scene_013;
}(BaseScene));
__reflect(Scene_013.prototype, "Scene_013");
//# sourceMappingURL=Scene_013.js.map