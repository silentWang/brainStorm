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
var Scene_6 = (function (_super) {
    __extends(Scene_6, _super);
    function Scene_6() {
        var _this = _super.call(this) || this;
        _this.init();
        return _this;
    }
    Scene_6.prototype.init = function () {
        this.tarSprite1 = new egret.Sprite();
        var arr = ['🔨', '💃', '💏', '👪', '💉', '🚩', '🍼', '👆', '👇'];
        for (var i = 0; i < arr.length; i++) {
            var item = SpriteUtil.createText(arr[i], 100);
            item.x = item.width / 2 + (i % 3) * 120;
            item.y = item.height / 2 + 120 * Math.floor(i / 3);
            item.stroke = 0.5;
            item.strokeColor = 0x00ff00;
            this.tarSprite1.addChild(item);
        }
        this.tarSprite1.graphics.beginFill(0x0000ff);
        this.tarSprite1.graphics.drawRect(0, 0, this.tarSprite1.width, this.tarSprite1.height);
        this.tarSprite1.graphics.endFill();
        this.addChild(this.tarSprite1);
        this.tarSprite1.x = SpriteUtil.stageCenterX - this.tarSprite1.width / 2;
        this.tarSprite1.y = 100;
    };
    return Scene_6;
}(BaseScene));
__reflect(Scene_6.prototype, "Scene_6");
//# sourceMappingURL=Scene_6.js.map