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
//横向踩白块
var Scene_027 = (function (_super) {
    __extends(Scene_027, _super);
    function Scene_027() {
        var _this = _super.call(this) || this;
        _this.pools1 = [];
        _this.pools2 = [];
        _this.isCanOperate = true;
        _this.count = 0;
        _this.init();
        return _this;
    }
    Scene_027.prototype.init = function () {
        //sdata 总数  tdata 最大可遗漏的数  extData.direction 方向 分两个sprite  左上 和 右下
        this.direction = this.dataVo.extData.direction;
        if (this.direction[0] != 0 && this.direction[1] != 0) {
            this.createJustRect(this.dataVo.sData / 2);
            this.createOppRect(this.dataVo.sData / 2);
        }
        else if (this.direction[0] != 0) {
            this.createJustRect(this.dataVo.sData);
        }
        else if (this.direction[1] != 0) {
            this.createOppRect(this.dataVo.sData);
        }
        this.scoreItem = new ScoreItem();
        this.scoreItem.setSTLose(0, this.dataVo.tData);
        this.addChild(this.scoreItem);
        egret.startTick(this.loop, this);
    };
    Scene_027.prototype.loop = function () {
        if (this.direction[0] == 1) {
            this.container1.x += 5;
        }
        else if (this.direction[0] == 2) {
            this.container1.y += 5;
        }
        if (this.direction[1] == 3) {
            this.container2.x -= 5;
        }
        else if (this.direction[1] == 4) {
            this.container2.y -= 5;
        }
        if (this.handleContainer())
            return;
        this.checkResult();
        return false;
    };
    Scene_027.prototype.handleContainer = function () {
        for (var _i = 0, _a = this.pools1; _i < _a.length; _i++) {
            var spr = _a[_i];
            if (this.isMiss(spr, this.direction[0])) {
                var index = spr.name.split("_")[1];
                this.pools1.splice(parseInt(index), 1);
                this.container1.removeChild(spr);
                spr.name = "";
                spr.touchEnabled = false;
                spr.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandler);
                this.count++;
                this.scoreItem.setSTLose(this.count);
                if (this.count >= this.dataVo.tData) {
                    this.isCanOperate = false;
                    egret.stopTick(this.loop, this);
                    EffectUtil.showResultEffect();
                    return true;
                }
            }
        }
        for (var _b = 0, _c = this.pools2; _b < _c.length; _b++) {
            var spr = _c[_b];
            if (this.isMiss(spr, this.direction[1])) {
                var index = spr.name.split("_")[1];
                this.pools2.splice(parseInt(index), 1);
                this.container2.removeChild(spr);
                spr.name = "";
                spr.touchEnabled = false;
                spr.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandler);
                this.count++;
                this.scoreItem.setSTLose(this.count);
                if (this.count >= this.dataVo.tData) {
                    this.isCanOperate = false;
                    egret.stopTick(this.loop, this);
                    EffectUtil.showResultEffect();
                    return true;
                }
            }
        }
        return false;
    };
    //正面的
    Scene_027.prototype.createJustRect = function (total) {
        this.container1 = new egret.Sprite();
        for (var i = 0; i < total; i++) {
            var ptd = this.getPoint(i, this.direction[0]);
            var color = Math.random() > 0.5 ? 0x000000 : 0xffffff;
            var spr = SpriteUtil.createRect(ptd.sdt, ptd.sdt, color, true);
            spr.name = color == 0x000000 ? "black_" + i : "white_" + i;
            spr.touchEnabled = true;
            spr.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandler, this);
            spr.x = ptd.xx;
            spr.y = ptd.yy;
            this.container1.addChild(spr);
            this.pools1.push(spr);
        }
        if (this.direction[0] == 1) {
            this.container1.x = -this.container1.width;
            this.container1.y = 250;
        }
        else if (this.direction[0] == 2) {
            this.container1.x = this.isOnlyOne() ? SpriteUtil.stageCenterX - this.container1.width / 2 : SpriteUtil.stageCenterX - this.container1.width;
            this.container1.y = -this.container1.height;
        }
        this.addChild(this.container1);
    };
    //反面的
    Scene_027.prototype.createOppRect = function (total) {
        this.container2 = new egret.Sprite();
        for (var i = 0; i < total; i++) {
            var ptd = this.getPoint(i, this.direction[1]);
            var color = Math.random() > 0.5 ? 0x000000 : 0xffffff;
            var spr = SpriteUtil.createRect(ptd.sdt, ptd.sdt, color, true);
            spr.name = color == 0x000000 ? "black_" + i : "white_" + i;
            spr.touchEnabled = true;
            spr.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandler, this);
            spr.x = ptd.xx;
            spr.y = ptd.yy;
            this.container2.addChild(spr);
            this.pools2.push(spr);
        }
        if (this.direction[1] == 3) {
            this.container2.x = SpriteUtil.stageWidth;
            this.container2.y = this.isOnlyOne() ? 250 : this.container1.y + this.container1.height;
        }
        else {
            this.container2.x = this.isOnlyOne() ? SpriteUtil.stageCenterX - this.container2.width / 2 : SpriteUtil.stageCenterX;
            this.container2.y = SpriteUtil.stageHeight;
        }
        this.addChild(this.container2);
    };
    Scene_027.prototype.getPoint = function (index, direction) {
        var sdt = 0, num = 3, xnum = 3;
        var xx = 0, yy = 0;
        if (this.isOnlyOne()) {
            if (this.dataVo.level <= 2) {
                num = 3;
                xnum = 3;
            }
            else {
                num = 4;
                xnum = 4;
            }
        }
        else {
            num = 4;
            xnum = 2;
        }
        if (direction == 1 || direction == 3) {
            sdt = (SpriteUtil.stageHeight - 400) / num;
            xx = Math.floor(index / xnum) * sdt + sdt / 2;
            yy = (index % xnum) * sdt + sdt / 2;
        }
        else {
            sdt = (SpriteUtil.stageWidth - 8) / num;
            xx = (index % xnum) * sdt + sdt / 2;
            yy = Math.floor(index / xnum) * sdt + sdt / 2;
        }
        return { xx: xx, yy: yy, sdt: sdt };
    };
    //是否只有一个方向
    Scene_027.prototype.isOnlyOne = function () {
        if (this.direction[0] != 0 && this.direction[1] != 0)
            return false;
        return true;
    };
    //是否错过黑块
    Scene_027.prototype.isMiss = function (sprite, direction) {
        var name = sprite.name;
        if (name.search("black") < 0)
            return false;
        if (this.direction[0] != 0) {
            var pt = this.container1.localToGlobal(sprite.x, sprite.y);
            if (direction == 1) {
                if (pt.x > SpriteUtil.stageWidth + sprite.width / 2)
                    return true;
            }
            else if (direction == 2) {
                if (pt.y > SpriteUtil.stageHeight + sprite.height / 2)
                    return true;
            }
        }
        if (this.direction[1] != 0) {
            var pt = this.container2.localToGlobal(sprite.x, sprite.y);
            if (direction == 3) {
                if (pt.x < -sprite.width / 2)
                    return true;
            }
            else if (direction == 4) {
                if (pt.y < -sprite.height / 2)
                    return true;
            }
        }
        return false;
    };
    Scene_027.prototype.checkResult = function () {
        var success = false;
        if (this.direction[0] == 1) {
            if (this.container1.x > SpriteUtil.stageWidth) {
                success = true;
            }
        }
        else if (this.direction[0] == 2) {
            if (this.container1.y > SpriteUtil.stageHeight) {
                success = true;
            }
        }
        if (this.direction[1] == 3) {
            if (this.container2.x < -this.container2.width) {
                success = true;
            }
        }
        else if (this.direction[1] == 4) {
            if (this.container2.y < -this.container2.height) {
                success = true;
            }
        }
        if (success) {
            egret.stopTick(this.loop, this);
            this.isCanOperate = false;
            if (this.count < this.dataVo.tData / 3) {
                EffectUtil.showResultEffect(EffectUtil.PERFECT);
            }
            else if (this.count < this.dataVo.tData * 2 / 3) {
                EffectUtil.showResultEffect(EffectUtil.GREAT);
            }
            else {
                EffectUtil.showResultEffect(EffectUtil.GOOD);
            }
        }
    };
    Scene_027.prototype.touchHandler = function (evt) {
        if (!this.isCanOperate)
            return;
        var spr = evt.target;
        if (spr.name.search("black") >= 0) {
            var index = this.pools1.indexOf(spr);
            if (index >= 0) {
                this.pools1.splice(index, 1);
                this.container1.removeChild(spr);
            }
            else {
                index = this.pools2.indexOf(spr);
                this.pools2.splice(index, 1);
                this.container2.removeChild(spr);
            }
            spr.name = "";
            spr.touchEnabled = false;
            spr.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandler);
        }
        else if (spr.name.search("white") >= 0) {
            this.isCanOperate = false;
            EffectUtil.showResultEffect();
            egret.stopTick(this.loop, this);
        }
    };
    return Scene_027;
}(BaseScene));
__reflect(Scene_027.prototype, "Scene_027");
//# sourceMappingURL=Scene_027.js.map