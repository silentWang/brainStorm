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
//看图 然后从图中找到这几张图
var Scene_006 = (function (_super) {
    __extends(Scene_006, _super);
    function Scene_006() {
        var _this = _super.call(this) || this;
        _this.isOperating = false;
        _this.init();
        return _this;
    }
    Scene_006.prototype.init = function () {
        this.timeItem = new TimeItem(30);
        this.addChild(this.timeItem);
        //修身 齐家 治国 平天下
        var arr = this.dataVo.sData;
        this.tarSprite = this.createPic(arr);
        this.tarSprite.x = SpriteUtil.stageCenterX - this.tarSprite.width / 2;
        this.tarSprite.y = SpriteUtil.stageCenterY - this.tarSprite.height / 2 - 100;
        this.tarSprite.name = 'target_1';
        this.addChild(this.tarSprite);
        this.picSprs = [];
        //创建其他图形
        this.createRandomPic(arr, 2, 3);
        this.createRandomPic(arr, 3, 4);
        this.createRandomPic(arr, 2, 4);
        this.createRandomPic(arr, 3, 5);
        this.createRandomPic(arr, 5, 6);
        this.createRandomPic(arr, 4, 7);
        this.createRandomPic(arr, 5, 8);
        this.createRandomPic(arr, 6, 7);
        //这里的tdata代表展示图片的数量
        var num = this.dataVo.tData;
        if (num == 12) {
            this.createRandomPic(arr, 3, 8);
            this.createRandomPic(arr, 7, 9);
            this.createRandomPic(arr, 5, 11);
        }
    };
    Scene_006.prototype.startGame = function () {
        this.picSprs.push(this.tarSprite);
        this.tarSprite.touchEnabled = true;
        this.tarSprite.addEventListener(egret.TouchEvent.TOUCH_TAP, this.selectClk, this);
        this.picSprs.sort(function (a, b) { return Math.random() > 0.5 ? 1 : -1; });
        var num = this.dataVo.tData;
        var cols = 3;
        var scale = (SpriteUtil.stageWidth - 100) / (this.tarSprite.width * cols);
        var wid = scale * this.tarSprite.width;
        var hgt = scale * this.tarSprite.height;
        var sprite = new egret.Sprite();
        for (var i = 0; i < this.picSprs.length; i++) {
            var xx = (i % cols) * (wid + 10);
            var yy = (hgt + 5) * Math.floor(i / cols);
            this.picSprs[i].x = xx;
            this.picSprs[i].y = yy;
            sprite.addChild(this.picSprs[i]);
            this.picSprs[i].scaleX = scale;
            this.picSprs[i].scaleY = scale;
        }
        this.addChild(sprite);
        sprite.x = SpriteUtil.stageCenterX - sprite.width / 2;
        sprite.y = SpriteUtil.stageCenterY - sprite.height / 2;
    };
    Scene_006.prototype.createRandomPic = function (sarr, index1, index2) {
        if (sarr === void 0) { sarr = []; }
        if (index1 === void 0) { index1 = 0; }
        if (index2 === void 0) { index2 = 0; }
        var arr = sarr.concat();
        var temp = arr[index1];
        arr[index1] = arr[index2];
        arr[index2] = temp;
        var spr = this.createPic(arr);
        spr.addEventListener(egret.TouchEvent.TOUCH_TAP, this.selectClk, this);
        spr.name = 'mistake';
        spr.touchEnabled = true;
        this.picSprs.push(spr);
    };
    Scene_006.prototype.selectClk = function (evt) {
        if (this.isOperating)
            return;
        this.isOperating = true;
        GameSound.instance().playSound('click');
        var name = evt.target.name;
        if (name == 'mistake') {
            this.timeItem.stop();
            EffectUtil.showResultEffect();
            return;
        }
        if (!name || name.search('target_') < 0)
            return;
        var idx = parseInt(name.split('_')[1]);
        var spr = evt.target;
        spr.touchEnabled = false;
        spr.parent.setChildIndex(spr, spr.parent.numChildren - 1);
        var leftTime = this.timeItem.leftTime;
        this.timeItem.stop();
        egret.Tween.get(spr).to({ x: SpriteUtil.stageCenterX - spr.width * 0.5 / 2, y: 200, scaleX: 0.5, scaleY: 0.5 }, 800).call(function () {
            if (leftTime >= 30) {
                EffectUtil.showResultEffect(EffectUtil.PERFECT);
            }
            else if (leftTime >= 15) {
                EffectUtil.showResultEffect(EffectUtil.GREAT);
            }
            else {
                EffectUtil.showResultEffect(EffectUtil.GOOD);
            }
        });
    };
    //创建图片
    Scene_006.prototype.createPic = function (arr) {
        var len = arr.length;
        var cols = 3;
        var wid = (SpriteUtil.stageWidth - 120) / cols;
        var sprite = new egret.Sprite();
        for (var i = 0; i < len; i++) {
            var item = SpriteUtil.createImage(arr[i]);
            var scale = wid / item.width;
            item.scaleX = scale;
            item.scaleY = scale;
            item.x = 10 + wid / 2 + (i % cols) * (wid + 10);
            item.y = 10 + wid / 2 + (wid + 10) * Math.floor(i / cols);
            item.touchEnabled = false;
            sprite.addChild(item);
        }
        sprite.graphics.beginFill(0x707070);
        sprite.graphics.drawRect(0, 0, sprite.width + 20, sprite.height + 20);
        sprite.graphics.endFill();
        return sprite;
    };
    Scene_006.prototype.enter = function () {
        _super.prototype.enter.call(this);
        this.timeItem.start(this.loop, this);
    };
    Scene_006.prototype.exit = function () {
        _super.prototype.exit.call(this);
        this.timeItem.stop();
        for (var _i = 0, _a = this.picSprs; _i < _a.length; _i++) {
            var pic = _a[_i];
            pic.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.selectClk, this);
        }
    };
    Scene_006.prototype.loop = function (time) {
        if (time <= 0) {
            this.startGame();
            this.timeItem.stop();
            this.timeItem.restart(this.dataVo.time);
        }
    };
    return Scene_006;
}(BaseScene));
__reflect(Scene_006.prototype, "Scene_006");
//# sourceMappingURL=Scene_006.js.map