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
var Scene_016 = (function (_super) {
    __extends(Scene_016, _super);
    function Scene_016() {
        var _this = _super.call(this) || this;
        _this.pointArr = [];
        _this.isBegin = false;
        _this.init();
        return _this;
    }
    Scene_016.prototype.init = function () {
        this.shape = new egret.Shape();
        this.addChild(this.shape);
        var shape = new egret.Shape();
        shape.graphics.beginFill(0xff0000, 0.001);
        shape.graphics.drawRect(0, 0, SpriteUtil.stageWidth, SpriteUtil.stageHeight);
        shape.graphics.endFill();
        this.addChild(shape);
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchHandler, this);
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchHandler, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.touchHandler, this);
        this.player = SpriteUtil.createText(this.dataVo.sData, 48);
        this.addChild(this.player);
        this.player.visible = false;
    };
    Scene_016.prototype.touchHandler = function (evt) {
        if (evt.type == egret.TouchEvent.TOUCH_BEGIN) {
            this.isBegin = true;
        }
        else if (evt.type == egret.TouchEvent.TOUCH_MOVE) {
            if (this.isBegin) {
                var point = { x: evt['stageX'], y: evt['stageY'] };
                this.shape.graphics.lineStyle(10, 0xff0000, 1);
                this.shape.graphics.lineTo(point.x, point.y);
                if (!this.lastPoint) {
                    this.pointArr.push(point);
                }
                else {
                    var mx = this.lastPoint.x - point.x;
                    var my = this.lastPoint.y - point.y;
                    var mid = Math.sqrt(mx * mx + my * my);
                    if (mid > 10) {
                        this.pointArr.push(point);
                    }
                }
                this.lastPoint = point;
            }
        }
        else if (evt.type == egret.TouchEvent.TOUCH_END) {
            this.isBegin = false;
            console.log(this.pointArr);
            this.player.x = this.pointArr[0].x;
            this.player.y = this.pointArr[0].y;
            this.player.visible = true;
            this.startFly();
        }
    };
    Scene_016.prototype.startFly = function () {
        var _this = this;
        var index = 1;
        var len = this.pointArr.length;
        var idx = egret.setInterval(function () {
            if (index >= len) {
                egret.clearInterval(idx);
                return;
            }
            var point = _this.pointArr[index];
            _this.player.x = point.x;
            _this.player.y = point.y;
            index++;
        }, this, 40);
    };
    return Scene_016;
}(BaseScene));
__reflect(Scene_016.prototype, "Scene_016");
//# sourceMappingURL=Scene_016.js.map