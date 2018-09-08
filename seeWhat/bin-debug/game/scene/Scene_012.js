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
//一笔画
var Scene_012 = (function (_super) {
    __extends(Scene_012, _super);
    function Scene_012() {
        var _this = _super.call(this) || this;
        _this.isTouching = false;
        _this.lineCount = 0;
        _this.init();
        return _this;
    }
    Scene_012.prototype.init = function () {
        this.lineVs = [
            { x: 150, y: 270 },
            { x: 540, y: 270 },
            { x: 350, y: 520 },
            { x: 360, y: 180 },
            { x: 470, y: 640 },
            { x: 300, y: 660 },
            { x: 280, y: 850 },
            { x: 570, y: 840 },
            { x: 500, y: 980 },
            { x: 230, y: 1000 },
        ];
        this.lineEs = [
            { start: this.lineVs[0], end: this.lineVs[1] },
            { start: this.lineVs[1], end: this.lineVs[2] },
            { start: this.lineVs[0], end: this.lineVs[2] },
            { start: this.lineVs[0], end: this.lineVs[3] },
            { start: this.lineVs[3], end: this.lineVs[4] },
            { start: this.lineVs[4], end: this.lineVs[2] },
            { start: this.lineVs[2], end: this.lineVs[5] },
            { start: this.lineVs[5], end: this.lineVs[6] },
            { start: this.lineVs[6], end: this.lineVs[4] },
            { start: this.lineVs[4], end: this.lineVs[5] },
            { start: this.lineVs[5], end: this.lineVs[0] },
            { start: this.lineVs[0], end: this.lineVs[6] },
            { start: this.lineVs[6], end: this.lineVs[7] },
            { start: this.lineVs[7], end: this.lineVs[4] },
            { start: this.lineVs[4], end: this.lineVs[1] },
            { start: this.lineVs[1], end: this.lineVs[7] },
            { start: this.lineVs[7], end: this.lineVs[8] },
            { start: this.lineVs[8], end: this.lineVs[6] },
            { start: this.lineVs[6], end: this.lineVs[9] },
            { start: this.lineVs[9], end: this.lineVs[8] },
            { start: this.lineVs[8], end: this.lineVs[4] }
        ];
        this.drawLines();
        this.pathShape = new egret.Shape();
        this.addChild(this.pathShape);
        this.drawCircles();
        this.paths = [];
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
        // this.touchEnabled = true;
        // this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.touchHandler,this);
    };
    Scene_012.prototype.touchHandler = function (evt) {
        // let point = {x:evt['stageX'],y:evt['stageY']};
        // this.lineVs.push(point);
        // this.drawLines();
    };
    //点击开始连线
    Scene_012.prototype.clkStart = function (evt) {
        var ptshape = evt.target;
        var name = ptshape.name;
        var index = name.split('_')[1];
        var point = this.lineVs[index];
        if (this.isCanDraw(point)) {
            ptshape.alpha = 1;
            this.drawPath();
            if (this.lineEs.length == 0) {
                var leftTime_1 = this.timeItem.leftTime;
                this.timeItem.stop();
                var idx_1 = egret.setTimeout(function () {
                    egret.clearTimeout(idx_1);
                    if (leftTime_1 >= 60) {
                        EffectUtil.showResultEffect(EffectUtil.PERFECT);
                    }
                    else if (leftTime_1 >= 45) {
                        EffectUtil.showResultEffect(EffectUtil.EXCELLENT);
                    }
                    else {
                        EffectUtil.showResultEffect(EffectUtil.GOOD);
                    }
                }, this, 200);
            }
        }
        else {
            var alpha = ptshape.alpha == 1 ? 0.5 : 1;
            egret.Tween.get(ptshape).to({ alpha: alpha }, 300).to({ alpha: ptshape.alpha }, 300).call(function () {
                egret.Tween.removeTweens(ptshape);
            });
        }
    };
    //当前划线是否在原线数组重
    Scene_012.prototype.isCanDraw = function (point) {
        var plen = this.paths.length;
        if (plen == 0) {
            this.paths.push(point);
            return true;
        }
        var start1 = this.paths[plen - 1];
        var end1 = point;
        var len = this.lineEs.length;
        for (var i = len - 1; i >= 0; i--) {
            var start2 = this.lineEs[i].start;
            var end2 = this.lineEs[i].end;
            if (start1.x == start2.x && end1.x == end2.x && start1.y == start2.y && end1.y == end2.y) {
                this.lineEs.splice(i, 1);
                this.paths.push(point);
                return true;
            }
            else if (start1.x == end2.x && start1.y == end2.y && start2.x == end1.x && start2.y == end1.y) {
                this.lineEs.splice(i, 1);
                this.paths.push(point);
                return true;
            }
        }
        return false;
    };
    //
    Scene_012.prototype.drawPath = function () {
        this.pathShape.graphics.clear();
        if (this.paths.length == 0)
            return;
        this.pathShape.graphics.lineStyle(10, 0xff0000);
        this.pathShape.graphics.moveTo(this.paths[0].x, this.paths[0].y);
        for (var i = 1; i < this.paths.length; i++) {
            var pt = this.paths[i];
            this.pathShape.graphics.lineTo(pt.x, pt.y);
        }
    };
    //画线
    Scene_012.prototype.drawLines = function () {
        var line = new egret.Shape();
        line.graphics.clear();
        line.graphics.lineStyle(10, 0x7AC5CD, 0.8);
        for (var i = 0; i < this.lineEs.length; i++) {
            var start = this.lineEs[i].start;
            var end = this.lineEs[i].end;
            line.graphics.moveTo(start.x, start.y);
            line.graphics.lineTo(end.x, end.y);
        }
        this.addChild(line);
    };
    //画点
    Scene_012.prototype.drawCircles = function () {
        for (var i = 0; i < this.lineVs.length; i++) {
            var shape = new egret.Shape();
            var point = this.lineVs[i];
            shape.graphics.lineStyle(1, 0x000000);
            shape.graphics.beginFill(0xffffff);
            shape.graphics.drawCircle(point.x, point.y, 20);
            shape.graphics.endFill();
            shape.alpha = 0.5;
            this.addChild(shape);
            shape.name = 'vertex_' + i;
            shape.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clkStart, this);
            shape.touchEnabled = true;
        }
    };
    Scene_012.prototype.enter = function () {
        _super.prototype.enter.call(this);
        this.timeItem.start();
    };
    return Scene_012;
}(BaseScene));
__reflect(Scene_012.prototype, "Scene_012");
//# sourceMappingURL=Scene_012.js.map