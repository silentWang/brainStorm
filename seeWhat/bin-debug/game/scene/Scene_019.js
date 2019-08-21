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
//移动箱子消除
var Scene_019 = (function (_super) {
    __extends(Scene_019, _super);
    function Scene_019() {
        var _this = _super.call(this) || this;
        _this.allBoxDataArr = [];
        _this.curSelectIndex = -1;
        _this.isCanOperate = true;
        _this.stepNums = 0;
        //列 行
        _this.ROWS = 10;
        _this.COLUMNS = 8;
        _this.init();
        return _this;
    }
    Scene_019.prototype.init = function () {
        var _this = this;
        //游戏共8*10个格子  
        //算法思想 a、首先记录交换的两个箱子的index ->> b、交换index ->> c、对每一个index查找与其相邻的横竖格子是否有相同类型的箱子 
        // ->> d、有则保存到一个临时数组 ->> e、如果临时数组长度大于3则可消除 ->> f、记录消除后这些箱子上方需要下落的箱子的索引 ->> 回到c直到查找的数组为空 则停止
        var arr = [];
        var sprite = new egret.Sprite();
        for (var i = 0; i < this.COLUMNS * this.ROWS; i++) {
            var img = SpriteUtil.createImage('box');
            img.anchorOffsetX = 0;
            img.anchorOffsetY = 0;
            img.touchEnabled = false;
            var shape = new egret.Shape();
            shape.graphics.lineStyle(2, 0x0000ff, 1);
            shape.graphics.moveTo(0, 0);
            shape.graphics.lineTo(img.width, 0);
            shape.graphics.lineTo(img.width, img.height);
            shape.graphics.lineTo(0, img.height);
            shape.graphics.lineTo(0, 0);
            shape.visible = false;
            var spr = new egret.Sprite();
            spr.name = this.dataVo.sData[0] + '_' + i;
            spr.x = (img.width + 2) * (i % this.COLUMNS);
            spr.y = (img.width + 2) * Math.floor(i / this.COLUMNS);
            spr.addChild(img);
            spr.addChild(shape);
            sprite.addChild(spr);
            spr.touchEnabled = true;
            spr.addEventListener(egret.TouchEvent.TOUCH_TAP, this.tapExchange, this);
            arr.push({ index: i, box: spr });
        }
        sprite.x = SpriteUtil.stageCenterX - sprite.width / 2;
        sprite.y = 200;
        this.addChild(sprite);
        this.allBoxDataArr = arr;
        var rect = SpriteUtil.createRect(SpriteUtil.stageWidth, SpriteUtil.stageHeight - sprite.height - sprite.y, 0x000000);
        rect.anchorOffsetX = 0;
        rect.anchorOffsetY = 0;
        rect.y = sprite.y + sprite.height;
        this.addChild(rect);
        var btn = SpriteUtil.createButton("重置", 160, 80, 0x0000ff, 36);
        btn.x = SpriteUtil.stageCenterX - btn.width / 2;
        btn.y = 200;
        this.addChild(btn);
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (!_this.isCanOperate)
                return;
            _this.createList();
        }, this);
        this.scoreItem = new ScoreItem();
        this.addChild(this.scoreItem);
        this.createList();
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
    };
    Scene_019.prototype.createList = function () {
        for (var _i = 0, _a = this.allBoxDataArr; _i < _a.length; _i++) {
            var bda = _a[_i];
            bda.box.visible = false;
        }
        for (var i = 0; i < this.dataVo.sData.length; i++) {
            var config = this.dataVo.sData[i];
            var box = this.allBoxDataArr[config.index].box;
            box.getChildAt(0).texture = RES.getRes("images_json#" + config.box);
            box.visible = true;
            box.name = config.box + "_" + config.index;
        }
        this.stepNums = this.dataVo.tData;
        this.scoreItem.setCustomText("\u5269\u4F59\u6B65\u6570  " + this.stepNums);
    };
    Scene_019.prototype.tapExchange = function (evt) {
        if (!this.isCanOperate)
            return;
        if (this.timeItem.leftTime <= 0)
            return;
        GameSound.instance().playSound('click');
        var spr = evt.target;
        var index = spr.name.split('_')[1];
        spr.getChildAt(1).visible = true;
        if (this.curSelectIndex == -1) {
            this.curSelectIndex = index;
            return;
        }
        if (this.curSelectIndex == index) {
            return;
        }
        if (this.isNextTo(this.curSelectIndex, index)) {
            this.isCanOperate = false;
            this.stepNums--;
            this.scoreItem.setCustomText("\u5269\u4F59\u6B65\u6570  " + this.stepNums);
            this.exchangeBox(this.curSelectIndex, index);
            this.refreshPos([this.curSelectIndex, index]);
        }
        else {
            var box = this.allBoxDataArr[this.curSelectIndex].box;
            box.getChildAt(1).visible = false;
            this.curSelectIndex = index;
        }
    };
    //消除需要横向和纵向
    Scene_019.prototype.checkResult = function (indexArr) {
        // this.isCanOperate = true;
        // this.curSelectIndex = -1;
        // return;
        var arr = [];
        for (var i = 0; i < indexArr.length; i++) {
            var arr1 = this.getClearRowNums(indexArr[i]);
            var arr2 = this.getClearColNums(indexArr[i]);
            if (arr1.length >= 3) {
                arr = arr.concat(arr1);
            }
            if (arr2.length >= 3) {
                arr = arr.concat(arr2);
            }
        }
        if (arr.length == 0) {
            if (this.isCanPass()) {
                var time = this.timeItem.leftTime;
                this.timeItem.stop();
                if (time >= this.dataVo.time * 1 / 3) {
                    EffectUtil.showResultEffect(EffectUtil.PERFECT);
                }
                else if (time >= this.dataVo.time * 2 / 3) {
                    EffectUtil.showResultEffect(EffectUtil.GREAT);
                }
                else {
                    EffectUtil.showResultEffect(EffectUtil.GOOD);
                }
            }
            else if (this.stepNums <= 0) {
                this.isCanOperate = false;
                EffectUtil.showResultEffect();
                this.timeItem.stop();
            }
            else {
                this.isCanOperate = true;
                this.curSelectIndex = -1;
            }
            return;
        }
        //同时移除
        for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
            var index = arr_1[_i];
            this.allBoxDataArr[index].box.visible = false;
        }
        //刷新所有位置
        this.refreshAll(arr);
    };
    //行
    Scene_019.prototype.getClearRowNums = function (index) {
        var row = Math.floor(index / this.COLUMNS);
        var tindex = index % this.COLUMNS;
        var box = this.allBoxDataArr[index].box;
        var type = box.name.split('_')[0];
        var arr = [];
        for (var i = tindex; i >= 0; i--) {
            var sindex = i + row * this.COLUMNS;
            var sbox = this.allBoxDataArr[sindex].box;
            if (sbox.name.split('_')[0] == type && sbox.visible) {
                arr.push(sindex);
            }
            else {
                break;
            }
        }
        for (var i = tindex + 1; i < this.COLUMNS; i++) {
            var sindex = i + row * this.COLUMNS;
            var tbox = this.allBoxDataArr[sindex].box;
            if (tbox.name.split('_')[0] == type && tbox.visible) {
                arr.push(sindex);
            }
            else {
                break;
            }
        }
        return arr;
    };
    //列
    Scene_019.prototype.getClearColNums = function (index) {
        var rows = Math.floor(index / this.COLUMNS);
        var cols = index % this.COLUMNS;
        var box = this.allBoxDataArr[index].box;
        var type = box.name.split('_')[0];
        var arr = [];
        for (var i = rows; i >= 0; i--) {
            var sindex = i * this.COLUMNS + cols;
            var sbox = this.allBoxDataArr[sindex].box;
            if (sbox.name.split('_')[0] == type && sbox.visible) {
                arr.push(sindex);
            }
            else {
                break;
            }
        }
        for (var i = rows + 1; i < 10; i++) {
            var sindex = i * this.COLUMNS + cols;
            var tbox = this.allBoxDataArr[sindex].box;
            if (tbox.name.split('_')[0] == type && tbox.visible) {
                arr.push(sindex);
            }
            else {
                break;
            }
        }
        return arr;
    };
    //判断两个index是否是左右上下相邻的
    Scene_019.prototype.isNextTo = function (index1, index2) {
        if (Math.abs(index1 - index2) == 1)
            return true;
        if (Math.abs(index1 - index2) == this.COLUMNS)
            return true;
        return false;
    };
    //是否全部消除
    Scene_019.prototype.isCanPass = function () {
        for (var _i = 0, _a = this.allBoxDataArr; _i < _a.length; _i++) {
            var boxData = _a[_i];
            if (boxData.box.visible) {
                return false;
            }
        }
        return true;
    };
    //交换两个箱子  注意index也要交换
    Scene_019.prototype.exchangeBox = function (index1, index2) {
        var index = this.allBoxDataArr[index1].index;
        this.allBoxDataArr[index1].index = this.allBoxDataArr[index2].index;
        this.allBoxDataArr[index2].index = index;
        var boxData = this.allBoxDataArr[index1];
        this.allBoxDataArr[index1] = this.allBoxDataArr[index2];
        this.allBoxDataArr[index2] = boxData;
    };
    //刷新位置
    Scene_019.prototype.refreshPos = function (arr) {
        var _this = this;
        var _loop_1 = function (i) {
            var box = this_1.allBoxDataArr[arr[i]].box;
            var index = this_1.allBoxDataArr[arr[i]].index;
            var name_1 = box.name;
            box.name = name_1.split('_')[0] + '_' + index;
            box.getChildAt(1).visible = false;
            egret.Tween.get(box).to({ x: (box.getChildAt(0).width + 2) * (index % this_1.COLUMNS), y: (box.getChildAt(0).width + 2) * Math.floor(index / this_1.COLUMNS) }, 250).call(function () {
                egret.Tween.removeTweens(box);
                if (i == arr.length - 1) {
                    var idx_1 = egret.setTimeout(function () {
                        egret.clearTimeout(idx_1);
                        _this.checkResult(arr);
                    }, _this, 500);
                }
            }, this_1);
        };
        var this_1 = this;
        for (var i = 0; i < arr.length; i++) {
            _loop_1(i);
        }
    };
    //更新所有位置 visible=false的直接删除  从下向上排列
    Scene_019.prototype.refreshAll = function (arr) {
        var _this = this;
        var len = this.allBoxDataArr.length;
        for (var i = len - 1; i >= 0; i--) {
            var box = this.allBoxDataArr[i].box;
            if (!box.visible) {
                var rows = Math.floor(i / this.COLUMNS);
                var cols = i % this.COLUMNS;
                for (var j = rows - 1; j >= 0; j--) {
                    if (this.allBoxDataArr[j * this.COLUMNS + cols].box.visible) {
                        this.exchangeBox(j * this.COLUMNS + cols, i);
                        arr.push(j * this.COLUMNS + cols);
                        break;
                    }
                }
            }
        }
        len = this.allBoxDataArr.length;
        var _loop_2 = function (i) {
            var box = this_2.allBoxDataArr[i].box;
            var index = this_2.allBoxDataArr[i].index;
            var name_2 = box.name;
            box.name = name_2.split('_')[0] + '_' + index;
            egret.Tween.get(box).to({ x: (box.getChildAt(0).width + 2) * (index % this_2.COLUMNS), y: (box.getChildAt(0).width + 2) * Math.floor(index / this_2.COLUMNS) }, 250).call(function () {
                egret.Tween.removeTweens(box);
                if (i == 0 && arr.length > 0) {
                    var idx_2 = egret.setTimeout(function () {
                        egret.clearTimeout(idx_2);
                        _this.checkResult(arr);
                    }, _this, 300);
                }
            }, this_2);
        };
        var this_2 = this;
        for (var i = len - 1; i >= 0; i--) {
            _loop_2(i);
        }
    };
    Scene_019.prototype.enter = function () {
        _super.prototype.enter.call(this);
        this.timeItem.start();
    };
    return Scene_019;
}(BaseScene));
__reflect(Scene_019.prototype, "Scene_019");
//# sourceMappingURL=Scene_019.js.map