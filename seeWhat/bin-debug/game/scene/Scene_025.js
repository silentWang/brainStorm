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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
//匀摇
var Scene_025 = (function (_super) {
    __extends(Scene_025, _super);
    function Scene_025() {
        var _this = _super.call(this) || this;
        _this.stonesArr = [];
        _this.housesArr = [];
        _this.curIndex = 0;
        _this.curCount = 0;
        _this.isCanOperate = true;
        _this.randomArr = [];
        _this.init();
        return _this;
    }
    Scene_025.prototype.init = function () {
        this.createJoyHouse();
        this.handSpr = SpriteUtil.createImage("paper");
        this.handSpr.visible = false;
        this.handSpr.scaleX = 2;
        this.handSpr.scaleY = 2;
        this.addChild(this.handSpr);
        this.next();
        this.eatText = SpriteUtil.createText("吃", 128);
        this.addChild(this.eatText);
        this.eatText.visible = false;
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
    };
    Scene_025.prototype.next = function () {
        return __awaiter(this, void 0, void 0, function () {
            var len, img, house, point, text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.curCount <= 0) {
                            this.checkResult();
                            this.isCanOperate = true;
                            return [2 /*return*/];
                        }
                        this.curIndex++;
                        len = this.housesArr.length;
                        if (this.curIndex >= len) {
                            this.curIndex = 0;
                        }
                        img = this.getPools();
                        house = this.housesArr[this.curIndex];
                        point = house.sprite.parent.localToGlobal(house.sprite.x, house.sprite.y);
                        this.handSpr["texture"] = RES.getRes("images_json#point");
                        this.handSpr.visible = true;
                        this.handSpr.rotation = 0;
                        this.handSpr.x = point.x;
                        this.handSpr.y = point.y;
                        return [4 /*yield*/, this.timeOutEff(500)];
                    case 1:
                        _a.sent();
                        house.sprite.addChild(img);
                        house.count++;
                        text = house.sprite.getChildAt(0);
                        text.text = house.count;
                        text.anchorOffsetX = text.width / 2;
                        this.curCount--;
                        this.handSpr.visible = false;
                        this.next();
                        return [2 /*return*/];
                }
            });
        });
    };
    Scene_025.prototype.checkResult = function () {
        var _this = this;
        var len = this.housesArr.length;
        if (this.curIndex >= len) {
            this.curIndex = 0;
        }
        var arr = [];
        for (var i = this.curIndex;; i += 2) {
            var n1 = i + 1;
            var n2 = i + 2;
            n1 = n1 % len;
            n2 = n2 % len;
            var house1 = this.housesArr[n1];
            var house2 = this.housesArr[n2];
            if (house1.count == 0 && house2.count > 0) {
                arr.push(n2);
                if (n2 == this.curIndex) {
                    break;
                }
            }
            else {
                break;
            }
        }
        if (arr.length == 0) {
            this.isCanOperate = true;
            return;
        }
        var index = 0;
        var xfun = function () {
            var house = _this.housesArr[arr[index]];
            var point = house.sprite.parent.localToGlobal(house.sprite.x, house.sprite.y);
            _this.eatText.x = point.x;
            _this.eatText.y = point.y;
            _this.eatText.visible = true;
            var idx = egret.setTimeout(function () {
                egret.clearTimeout(idx);
                _this.eatText.visible = false;
                while (house.sprite.numChildren > 1) {
                    house.sprite.removeChildAt(house.sprite.numChildren - 1);
                }
                house.count = 0;
                var text = house.sprite.getChildAt(0);
                text.text = house.count;
                text.anchorOffsetX = text.width / 2;
                index++;
                if (_this.timeItem.leftTime < 0)
                    return;
                if (index >= arr.length) {
                    if (_this.isCanPass()) {
                        _this.timeItem.stop();
                        EffectUtil.showResultEffect(EffectUtil.PERFECT);
                        return;
                    }
                    if (_this.isFail()) {
                        _this.timeItem.stop();
                        EffectUtil.showResultEffect();
                        return;
                    }
                    _this.isCanOperate = true;
                    return;
                }
                xfun();
            }, _this, 800);
        };
        xfun();
    };
    Scene_025.prototype.isCanPass = function () {
        for (var _i = 0, _a = this.housesArr; _i < _a.length; _i++) {
            var house = _a[_i];
            if (house.count != 0)
                return false;
        }
        return true;
    };
    Scene_025.prototype.isFail = function () {
        var cnt = 0;
        for (var _i = 0, _a = this.housesArr; _i < _a.length; _i++) {
            var house = _a[_i];
            cnt += house.count;
        }
        if (cnt < this.dataVo.sData.length / 2) {
            return true;
        }
        return false;
    };
    Scene_025.prototype.getPools = function () {
        var xx = -40 + 80 * Math.random();
        var yy = -40 + 80 * Math.random();
        var rotation = 180 * Math.random();
        for (var _i = 0, _a = this.stonesArr; _i < _a.length; _i++) {
            var img_1 = _a[_i];
            if (!img_1.visible || img_1.parent == null) {
                img_1.visible = true;
                img_1.x = xx;
                img_1.y = yy;
                img_1.rotation = rotation;
                return img_1;
            }
        }
        var img = SpriteUtil.createImage('stone');
        img.scaleX = 0.4;
        img.scaleY = 0.4;
        img.x = xx;
        img.y = yy;
        img.rotation = rotation;
        img.touchEnabled = false;
        this.stonesArr.push(img);
        return img;
    };
    Scene_025.prototype.createJoyHouse = function () {
        var sprite = new egret.Sprite();
        var rotation = 0;
        if (this.dataVo.level == 3) {
            rotation = Math.random() > 0.5 ? -90 : 90;
        }
        else if (this.dataVo.level == 5) {
            rotation = Math.random() > 0.5 ? 45 : -45;
        }
        var len = this.dataVo.sData.length;
        for (var i = 0; i < len; i++) {
            var spr = new egret.Sprite();
            spr.graphics.beginFill(0x000000, 0.01);
            spr.graphics.lineStyle(5, 0x000000);
            spr.graphics.drawCircle(0, 0, 60);
            spr.graphics.endFill();
            sprite.addChild(spr);
            var point = this.getPoint(i, spr.width);
            spr.x = point.x;
            spr.y = point.y;
            spr.touchEnabled = true;
            spr.name = 'house_' + i;
            var text = SpriteUtil.createText(this.dataVo.sData[i], 100);
            text.alpha = 0.5;
            spr.addChild(text);
            text.rotation = -rotation;
            spr.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandler, this);
            for (var a = 0; a < this.dataVo.sData[i]; a++) {
                var img = this.getPools();
                spr.addChild(img);
            }
            this.housesArr.push({ sprite: spr, count: this.dataVo.sData[i] });
        }
        this.addChild(sprite);
        sprite.anchorOffsetX = sprite.width / 2;
        sprite.anchorOffsetY = sprite.height / 2;
        sprite.rotation = rotation;
        sprite.x = SpriteUtil.stageCenterX;
        sprite.y = SpriteUtil.stageCenterY;
    };
    //布局模式
    Scene_025.prototype.getPoint = function (index, width) {
        var cols = 4;
        var temp = 0;
        var xx = 0;
        var yy = 0;
        if (this.dataVo.level == 4) {
            cols = 3;
        }
        if (this.dataVo.level == 6) {
            if (index <= 12) {
                var x0 = 2 * (width + 10), y0 = 2 * (width + 10);
                var x1 = 0, y1 = 2 * (width + 10);
                var angle = 2 * index * Math.asin((width / 2 + 2.5) / (2 * width + 20));
                xx = width / 2 + (x1 - x0) * Math.cos(angle) - (y1 - y0) * Math.sin(angle) + x0;
                yy = width / 2 + (y1 - y0) * Math.cos(angle) + (x1 - x0) * Math.sin(angle) + y0;
            }
            else {
                index = index - 12;
                temp = 4 - index % cols;
                xx = width / 2 + temp * (width + 10);
                yy = width / 2 + 2 * width + 20 + Math.floor(index / cols) * (width + 10);
            }
        }
        else if (this.dataVo.level == 7 || this.dataVo.level == 8) {
            //随机
            if (this.randomArr.length == 0) {
                var arr = [];
                for (var i = 0; i < 24; i++) {
                    arr.push({ x: (i % 4) * (width + 10), y: Math.floor(i / 4) * (width + 10) });
                }
                this.randomArr = arr;
            }
            var pt = this.randomArr.splice(Math.floor(this.randomArr.length * Math.random()), 1);
            xx = width / 2 + pt[0].x;
            yy = width / 2 + pt[0].y;
        }
        else {
            temp = Math.floor(index / cols) % 2 == 0 ? index % cols : 3 - index % cols;
            xx = width / 2 + temp * (width + 10);
            yy = width / 2 + Math.floor(index / cols) * (width + 10);
        }
        return new egret.Point(xx, yy);
    };
    Scene_025.prototype.touchHandler = function (evt) {
        if (!this.isCanOperate || this.timeItem.leftTime <= 0)
            return;
        this.curIndex = evt.target.name.split("_")[1];
        this.isCanOperate = false;
        this.playGetAnim().catch(function (err) {
            // console.log(err);
        });
    };
    Scene_025.prototype.playGetAnim = function () {
        return __awaiter(this, void 0, void 0, function () {
            var house, point, text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        house = this.housesArr[this.curIndex];
                        if (house.count == 0) {
                            this.isCanOperate = true;
                            return [2 /*return*/];
                        }
                        point = house.sprite.parent.localToGlobal(house.sprite.x, house.sprite.y);
                        this.handSpr["texture"] = RES.getRes("images_json#paper");
                        this.handSpr.visible = true;
                        this.handSpr.rotation = -60;
                        this.handSpr.x = point.x;
                        this.handSpr.y = point.y;
                        return [4 /*yield*/, this.timeOutEff()];
                    case 1:
                        _a.sent();
                        this.handSpr["texture"] = RES.getRes("images_json#rock");
                        if (this.timeItem.leftTime < 0)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.timeOutEff()];
                    case 2:
                        _a.sent();
                        this.handSpr.visible = false;
                        while (house.sprite.numChildren > 1) {
                            house.sprite.removeChildAt(house.sprite.numChildren - 1);
                        }
                        this.curCount = house.count;
                        house.count = 0;
                        text = house.sprite.getChildAt(0);
                        text.text = house.count;
                        text.anchorOffsetX = text.width / 2;
                        if (this.timeItem.leftTime < 0)
                            return [2 /*return*/];
                        this.next();
                        return [2 /*return*/];
                }
            });
        });
    };
    Scene_025.prototype.timeOutEff = function (time) {
        var _this = this;
        if (time === void 0) { time = 200; }
        var p = new Promise(function (resolve, reject) {
            var idx = egret.setTimeout(function () {
                egret.clearTimeout(idx);
                resolve();
            }, _this, time);
        });
        return p;
    };
    Scene_025.prototype.enter = function () {
        _super.prototype.enter.call(this);
        this.timeItem.start();
    };
    return Scene_025;
}(BaseScene));
__reflect(Scene_025.prototype, "Scene_025");
//# sourceMappingURL=Scene_025.js.map