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
//点击次数
var Scene_020 = (function (_super) {
    __extends(Scene_020, _super);
    function Scene_020() {
        var _this = _super.call(this) || this;
        //二维数组 存储三个palyer的路径
        _this.roadAllArr = [];
        //三个player 对应的阶段
        _this.leftIndex = 0;
        _this.rightIndex = 0;
        _this.ownIndex = 0;
        _this.diceArr = [];
        _this.isRunning = false;
        _this.intervalId = 0;
        _this.isCanOperate = true;
        _this.init();
        return _this;
    }
    Scene_020.prototype.init = function () {
        var sprite = new egret.Sprite();
        this.addChild(sprite);
        this.container = sprite;
        var shape = new egret.Shape();
        shape.graphics.beginFill(0x000000, 0.1);
        shape.graphics.lineStyle(30, 0x8B7765);
        shape.graphics.drawRect(0, 0, 250, 250);
        shape.anchorOffsetX = shape.width / 2;
        shape.anchorOffsetY = shape.height / 2;
        shape.x = SpriteUtil.stageCenterX + 15;
        shape.y = SpriteUtil.stageCenterY - 100;
        this.container.addChild(shape);
        var lspr = this.createLeftCastle();
        lspr.x = 115;
        lspr.y = SpriteUtil.stageCenterY - 110;
        this.container.addChild(lspr);
        var rspr = this.createRightCastle();
        rspr.x = SpriteUtil.stageCenterX + 130;
        rspr.y = lspr.y;
        this.container.addChild(rspr);
        var mspr = this.createMiddleCastle();
        mspr.x = SpriteUtil.stageCenterX;
        mspr.y = lspr.y + 120;
        this.container.addChild(mspr);
        var kp1 = SpriteUtil.createText(this.dataVo.sData[4], 60, 0x00ff00, true);
        kp1.x = shape.x - shape.width / 2;
        kp1.y = shape.y - shape.height / 2;
        this.container.addChild(kp1);
        var kp2 = SpriteUtil.createText(this.dataVo.sData[5], 60, 0x00ff00, true);
        kp2.x = shape.x - 15;
        kp2.y = shape.y - shape.height / 2;
        this.container.addChild(kp2);
        var kp3 = SpriteUtil.createText(this.dataVo.sData[6], 60, 0x00ff00, true);
        kp3.x = shape.x + shape.width / 2 - 30;
        kp3.y = shape.y - shape.height / 2;
        this.container.addChild(kp3);
        var kp4 = SpriteUtil.createText(this.dataVo.sData[7], 60, 0x00ff00, true);
        kp4.x = shape.x + shape.width / 2 - 30;
        kp4.y = shape.y + shape.height / 2 - 30;
        this.container.addChild(kp4);
        var kp5 = SpriteUtil.createText(this.dataVo.sData[8], 60, 0x00ff00, true);
        kp5.x = shape.x - shape.width / 2;
        kp5.y = shape.y + shape.height / 2 - 30;
        this.container.addChild(kp5);
        var kp6 = SpriteUtil.createText(this.dataVo.sData[9], 60, 0x00ff00, true);
        kp6.x = shape.x - 15;
        kp6.y = shape.y - 10;
        this.container.addChild(kp6);
        var kp7 = SpriteUtil.createText(this.dataVo.sData[10], 60, 0x00ff00, true);
        kp7.x = shape.x - 15;
        kp7.y = SpriteUtil.stageCenterY - shape.height / 2 - 200;
        this.container.addChild(kp7);
        var kp8 = SpriteUtil.createText(this.dataVo.sData[11], 60, 0x00ff00, true);
        kp8.x = shape.x - 15;
        kp8.y = SpriteUtil.stageCenterY - shape.height / 2 - 300;
        this.container.addChild(kp8);
        var pyramid = SpriteUtil.createImage('pyramid');
        pyramid.x = SpriteUtil.stageCenterX;
        pyramid.y = SpriteUtil.stageCenterY - shape.height / 2 - 400;
        this.container.addChild(pyramid);
        var pshp = SpriteUtil.createRect(30, 400, 0xFFD7000);
        pshp.anchorOffsetY = 0;
        pshp.x = shape.x - 15;
        pshp.y = pyramid.y + 20;
        this.container.addChildAt(pshp, 1);
        this.roadAllArr[0] = this.storagePoint(lspr);
        this.roadAllArr[1] = this.storagePoint(mspr);
        this.roadAllArr[2] = this.storagePoint(rspr);
        this.roadAllArr[0] = this.roadAllArr[0].concat([{ x: kp5.x, y: kp5.y }, { x: kp4.x, y: kp4.y }, { x: kp3.x, y: kp3.y }, { x: kp2.x, y: kp2.y }, { x: kp1.x, y: kp1.y }]);
        this.roadAllArr[1] = this.roadAllArr[1].concat([{ x: kp4.x, y: kp4.y }, { x: kp3.x, y: kp3.y }, { x: kp2.x, y: kp2.y }, { x: kp1.x, y: kp1.y }, { x: kp5.x, y: kp5.y }]);
        this.roadAllArr[2] = this.roadAllArr[2].concat([{ x: kp3.x, y: kp3.y }, { x: kp2.x, y: kp2.y }, { x: kp1.x, y: kp1.y }, { x: kp5.x, y: kp5.y }, { x: kp4.x, y: kp4.y }]);
        for (var i = 0; i < 3; i++) {
            this.roadAllArr[i] = this.roadAllArr[i].concat([{ x: kp6.x, y: kp6.y }, { x: kp7.x, y: kp7.y }, { x: kp8.x, y: kp8.y }, { x: pyramid.x, y: pyramid.y }]);
        }
        this.leftPlayer = SpriteUtil.createImage('emoji11');
        this.leftPlayer.x = this.roadAllArr[0][0].x;
        this.leftPlayer.y = this.roadAllArr[0][0].y;
        this.container.addChild(this.leftPlayer);
        EffectUtil.breath(this.leftPlayer, 0.2);
        this.ownPlayer = SpriteUtil.createImage('emoji16');
        this.ownPlayer.x = this.roadAllArr[1][0].x;
        this.ownPlayer.y = this.roadAllArr[1][0].y;
        this.container.addChild(this.ownPlayer);
        EffectUtil.breath(this.ownPlayer, 0.2);
        this.rightPlayer = SpriteUtil.createImage('emoji19');
        this.rightPlayer.x = this.roadAllArr[2][0].x;
        this.rightPlayer.y = this.roadAllArr[2][0].y;
        this.container.addChild(this.rightPlayer);
        EffectUtil.breath(this.rightPlayer, 0.2);
        var dice1 = SpriteUtil.createImage('dice1');
        dice1.x = SpriteUtil.stageCenterX - 100;
        dice1.y = SpriteUtil.stageCenterY + 500;
        this.container.addChild(dice1);
        var dice2 = SpriteUtil.createImage('dice2');
        dice2.x = SpriteUtil.stageCenterX;
        dice2.y = SpriteUtil.stageCenterY + 500;
        this.container.addChild(dice2);
        var dice3 = SpriteUtil.createImage('dice3');
        dice3.x = SpriteUtil.stageCenterX + 100;
        dice3.y = SpriteUtil.stageCenterY + 500;
        this.container.addChild(dice3);
        this.container.scaleX = 0.8;
        this.container.scaleY = 0.8;
        this.container.x = this.container.width * 0.2 / 2;
        this.diceArr = [dice1, dice2, dice3];
        dice1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.diceTap, this);
        dice2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.diceTap, this);
        dice3.addEventListener(egret.TouchEvent.TOUCH_TAP, this.diceTap, this);
    };
    Scene_020.prototype.diceTap = function () {
        if (!this.isCanOperate)
            return;
        this.isRunning = !this.isRunning;
        if (this.isRunning) {
            this.startDices();
        }
        else {
            egret.clearInterval(this.intervalId);
            this.isCanOperate = false;
            var cnt = 0;
            for (var _i = 0, _a = this.diceArr; _i < _a.length; _i++) {
                var dice = _a[_i];
                cnt += parseInt(dice.name);
            }
            if (cnt % 3 == 1) {
                this.leftIndex++;
                this.movePlayer(0, this.leftIndex);
            }
            else if (cnt % 3 == 2) {
                this.ownIndex++;
                this.movePlayer(1, this.ownIndex);
            }
            else if (cnt % 3 == 0) {
                this.rightIndex++;
                this.movePlayer(2, this.rightIndex);
            }
        }
    };
    Scene_020.prototype.startDices = function () {
        var _this = this;
        this.intervalId = egret.setInterval(function () {
            for (var _i = 0, _a = _this.diceArr; _i < _a.length; _i++) {
                var dice = _a[_i];
                var index = Math.ceil(6 * Math.random());
                dice['texture'] = RES.getRes("images_json#dice" + index);
                dice.name = '' + index;
            }
        }, this, 40);
    };
    Scene_020.prototype.movePlayer = function (playerIndex, posIndex) {
        var _this = this;
        var player;
        if (playerIndex == 0) {
            player = this.leftPlayer;
        }
        else if (playerIndex == 1) {
            player = this.ownPlayer;
        }
        else if (playerIndex == 2) {
            player = this.rightPlayer;
        }
        var tween = egret.Tween.get(player);
        tween.wait(500);
        tween.to({ x: this.roadAllArr[playerIndex][posIndex].x, y: this.roadAllArr[playerIndex][posIndex].y }, 500).call(function () {
            _this.isCanOperate = true;
            _this.checkResult();
        }, this);
    };
    Scene_020.prototype.checkResult = function () {
        if (this.leftIndex >= this.roadAllArr[0].length - 1 || this.rightIndex >= this.roadAllArr[2].length - 1) {
            this.isCanOperate = false;
            EffectUtil.showResultEffect();
        }
        else if (this.ownIndex >= this.roadAllArr[1].length - 1) {
            EffectUtil.showResultEffect(EffectUtil.PERFECT);
            this.isCanOperate = false;
        }
    };
    Scene_020.prototype.createLeftCastle = function () {
        var sprite = new egret.Sprite();
        var house = SpriteUtil.createImage('house');
        house.y = 300;
        sprite.addChild(house);
        var kp1 = SpriteUtil.createText(this.dataVo.sData[0], 60, 0x00ff00, true);
        kp1.y = 200;
        sprite.addChild(kp1);
        var kp2 = SpriteUtil.createText(this.dataVo.sData[1], 60, 0x00ff00, true);
        kp2.y = 100;
        sprite.addChild(kp2);
        var kp3 = SpriteUtil.createText(this.dataVo.sData[2], 60, 0x00ff00, true);
        sprite.addChild(kp3);
        var mountain = SpriteUtil.createText(this.dataVo.sData[3], 60, 0x00ff00, true);
        mountain.x = 120;
        sprite.addChild(mountain);
        var shape = SpriteUtil.createRect(30, house.y, 0x8B7765);
        shape.anchorOffsetY = 0;
        sprite.addChildAt(shape, 0);
        var lshape = SpriteUtil.createRect(mountain.x, 30, 0x8B7765);
        lshape.anchorOffsetX = 0;
        sprite.addChildAt(lshape, 0);
        return sprite;
    };
    Scene_020.prototype.createRightCastle = function () {
        var sprite = new egret.Sprite();
        var xx = 120;
        var house = SpriteUtil.createImage('house');
        house.x = xx;
        house.y = 300;
        sprite.addChild(house);
        var kp1 = SpriteUtil.createText(this.dataVo.sData[0], 60, 0x00ff00, true);
        kp1.x = xx;
        kp1.y = 200;
        sprite.addChild(kp1);
        var kp2 = SpriteUtil.createText(this.dataVo.sData[1], 60, 0x00ff00, true);
        kp2.x = xx;
        kp2.y = 100;
        sprite.addChild(kp2);
        var kp3 = SpriteUtil.createText(this.dataVo.sData[2], 60, 0x00ff00, true);
        kp3.x = xx;
        sprite.addChild(kp3);
        var mountain = SpriteUtil.createText(this.dataVo.sData[3], 60, 0x00ff00, true);
        sprite.addChild(mountain);
        var shape = SpriteUtil.createRect(30, house.y, 0x8B7765);
        shape.anchorOffsetY = 0;
        shape.x = xx;
        sprite.addChildAt(shape, 0);
        var lshape = SpriteUtil.createRect(xx, 30, 0x8B7765);
        lshape.anchorOffsetX = 0;
        sprite.addChildAt(lshape, 0);
        return sprite;
    };
    Scene_020.prototype.createMiddleCastle = function () {
        var sprite = new egret.Sprite();
        var house = SpriteUtil.createImage('house');
        house.y = 400;
        sprite.addChild(house);
        var kp1 = SpriteUtil.createText(this.dataVo.sData[0], 60, 0x00ff00, true);
        kp1.y = 300;
        sprite.addChild(kp1);
        var kp2 = SpriteUtil.createText(this.dataVo.sData[1], 60, 0x00ff00, true);
        kp2.y = 200;
        sprite.addChild(kp2);
        var kp3 = SpriteUtil.createText(this.dataVo.sData[2], 60, 0x00ff00, true);
        kp3.y = 100;
        sprite.addChild(kp3);
        var mountain = SpriteUtil.createText(this.dataVo.sData[3], 60, 0x00ff00, true);
        sprite.addChild(mountain);
        var shape = SpriteUtil.createRect(30, house.y, 0x8B7765);
        shape.anchorOffsetY = 0;
        sprite.addChildAt(shape, 0);
        return sprite;
    };
    Scene_020.prototype.storagePoint = function (sprite) {
        var arr = [];
        for (var i = sprite.numChildren - 1, j = 0; j < 5; i--, j++) {
            var spr = sprite.getChildAt(i);
            var point = sprite.localToGlobal(spr.x, spr.y);
            arr.push({ x: point.x, y: point.y });
        }
        arr.reverse();
        return arr;
    };
    Scene_020.prototype.exit = function () {
        _super.prototype.exit.call(this);
        for (var _i = 0, _a = this.diceArr; _i < _a.length; _i++) {
            var dice = _a[_i];
            egret.Tween.removeTweens(dice);
        }
        egret.Tween.removeTweens(this.leftPlayer);
        egret.Tween.removeTweens(this.ownPlayer);
        egret.Tween.removeTweens(this.rightPlayer);
        egret.clearInterval(this.intervalId);
    };
    return Scene_020;
}(BaseScene));
__reflect(Scene_020.prototype, "Scene_020");
