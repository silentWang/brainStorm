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
        //
        _this.vsArr = [];
        _this.lineCount = 0;
        _this.init();
        return _this;
    }
    Scene_012.prototype.init = function () {
        var _this = this;
        this.lineVs = this.dataVo.sData;
        var lines = this.dataVo.tData;
        var len = lines.length;
        this.lineEs = [];
        for (var i = 0; i < len; i++) {
            var line = lines[i];
            this.lineEs.push({ start: this.lineVs[line[0]], end: this.lineVs[line[1]] });
        }
        this.drawLines();
        this.pathShape = new egret.Shape();
        this.addChild(this.pathShape);
        this.drawCircles();
        this.paths = [];
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
        var btn = SpriteUtil.createButton("重来", 140, 60, 0x0000ff, 28);
        btn.x = SpriteUtil.stageCenterX - btn.width / 2;
        btn.y = SpriteUtil.stageHeight - 300;
        this.addChild(btn);
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            _this.pathShape.graphics.clear();
            _this.paths = [];
            _this.lineEs = [];
            for (var i = 0; i < len; i++) {
                var line = lines[i];
                _this.lineEs.push({ start: _this.lineVs[line[0]], end: _this.lineVs[line[1]] });
            }
            for (var _i = 0, _a = _this.vsArr; _i < _a.length; _i++) {
                var shape = _a[_i];
                shape.alpha = 0.5;
            }
        }, this);
        //only for looking for point
        // this.touchEnabled = true;
        // let rect = SpriteUtil.createRect(SpriteUtil.stageWidth,SpriteUtil.stageHeight);
        // rect.alpha = 0.01;
        // rect.anchorOffsetX = 0;
        // rect.anchorOffsetY = 0;
        // this.addChild(rect);
        // this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.touchHandler,this);
    };
    Scene_012.prototype.touchHandler = function (evt) {
        var point = { x: evt['stageX'], y: evt['stageY'] };
        this.paths.push(point);
        this.drawPath();
    };
    //点击开始连线
    Scene_012.prototype.clkStart = function (evt) {
        if (this.timeItem.leftTime <= 0)
            return;
        GameSound.instance().playSound('click');
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
                        EffectUtil.showResultEffect(EffectUtil.GREAT);
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
        // console.clear();
        // console.table(this.paths);
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
        this.vsArr = [];
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
            this.vsArr.push(shape);
        }
    };
    Scene_012.prototype.enter = function () {
        _super.prototype.enter.call(this);
        this.timeItem.start();
    };
    Scene_012.prototype.exit = function () {
        _super.prototype.exit.call(this);
        for (var _i = 0, _a = this.vsArr; _i < _a.length; _i++) {
            var shape = _a[_i];
            shape.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.clkStart, this);
            if (shape.parent) {
                shape.parent.removeChild(shape);
            }
        }
    };
    return Scene_012;
}(BaseScene));
__reflect(Scene_012.prototype, "Scene_012");
