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
        _this.selectNum = 0;
        _this.init();
        return _this;
    }
    Scene_006.prototype.init = function () {
        this.dataVo.time = 60;
        this.timeItem = new TimeItem(30);
        this.addChild(this.timeItem);
        //修身 齐家 治国 平天下
        var arr1 = ['🔨', '💃', '💏', '👪', '💉', '🚩', '🍼', '👆', '👇'];
        this.tarSprite1 = this.createPic(arr1);
        this.tarSprite1.x = SpriteUtil.stageCenterX - this.tarSprite1.width / 2;
        this.tarSprite1.y = 100;
        this.tarSprite1.name = 'target_1';
        this.addChild(this.tarSprite1);
        //玉不琢，不成器。人不学，不知义
        var arr2 = ['🍦', '🌀', '✊', '📏', '✋', '☝', '☀', '🌿', '❄'];
        this.tarSprite2 = this.createPic(arr2);
        this.tarSprite2.x = SpriteUtil.stageCenterX - this.tarSprite2.width / 2;
        this.tarSprite2.y = this.tarSprite1.y + this.tarSprite1.height + 100;
        this.addChild(this.tarSprite2);
        this.tarSprite2.name = 'target_2';
        this.tarPoints = [];
        this.tarPoints.push(new egret.Point(80, SpriteUtil.stageCenterY + 200));
        this.tarPoints.push(new egret.Point(400, SpriteUtil.stageCenterY + 200));
        this.picSprs = [];
        //创建其他图形
        this.createRandomPic(arr1, 2, 3);
        this.createRandomPic(arr1, 1, 4);
        this.createRandomPic(arr1, 5, 6);
        this.createRandomPic(arr1, 0, 8);
        this.createRandomPic(arr1, 6, 3);
        this.createRandomPic(arr1, 1, 2);
        this.createRandomPic(arr1, 0, 4);
        this.createRandomPic(arr2, 2, 3);
        this.createRandomPic(arr2, 1, 4);
        this.createRandomPic(arr2, 5, 6);
        this.createRandomPic(arr2, 0, 8);
        this.createRandomPic(arr2, 6, 3);
        this.createRandomPic(arr2, 1, 2);
        this.createRandomPic(arr2, 0, 5);
    };
    Scene_006.prototype.startGame = function () {
        this.picSprs.push(this.tarSprite1);
        this.picSprs.push(this.tarSprite2);
        this.tarSprite1.touchEnabled = true;
        this.tarSprite2.touchEnabled = true;
        this.tarSprite1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.selectClk, this);
        this.tarSprite2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.selectClk, this);
        this.picSprs.sort(function (a, b) { return Math.random() > 0.5 ? 1 : -1; });
        for (var i = 0; i < this.picSprs.length; i++) {
            var xx = 10 + (i % 4) * 180;
            var yy = 100 + 175 * Math.floor(i / 4);
            this.picSprs[i].x = xx;
            this.picSprs[i].y = yy;
            this.addChild(this.picSprs[i]);
            this.picSprs[i].scaleX = 0.45;
            this.picSprs[i].scaleY = 0.45;
        }
    };
    Scene_006.prototype.createRandomPic = function (arr, index1, index2) {
        if (arr === void 0) { arr = []; }
        if (index1 === void 0) { index1 = 0; }
        if (index2 === void 0) { index2 = 0; }
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
        var _this = this;
        console.log(evt.target.name);
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
        egret.Tween.get(spr).to({ x: this.tarPoints[idx - 1].x, y: this.tarPoints[idx - 1].y, scaleX: 0.7, scaleY: 0.7 }, 800).call(function () {
            _this.selectNum++;
            if (_this.selectNum >= 2) {
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
    };
    Scene_006.prototype.createPic = function (arr) {
        var sprite = new egret.Sprite();
        for (var i = 0; i < arr.length; i++) {
            var item = SpriteUtil.createText(arr[i], 100);
            item.x = item.width / 2 + (i % 3) * 120;
            item.y = item.height / 2 + 120 * Math.floor(i / 3);
            item.stroke = 0.5;
            item.strokeColor = 0x00ff00;
            sprite.addChild(item);
        }
        sprite.width = sprite.height;
        sprite.graphics.beginFill(0x96cdcd);
        sprite.graphics.drawRect(0, 0, sprite.width, sprite.height);
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