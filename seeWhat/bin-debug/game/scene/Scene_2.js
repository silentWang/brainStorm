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
//连连看 字符版
var Scene_2 = (function (_super) {
    __extends(Scene_2, _super);
    function Scene_2() {
        var _this = _super.call(this) || this;
        _this.init();
        return _this;
    }
    Scene_2.prototype.init = function () {
        this.dataVo.sData = '✍✉☎☀☻✌♈✿✪❈❦㊣☝☯➽❤▦卐❂☬☣※☂⊗◍✠♝♞㉿➽♬☑웃유❖☃☊큐☠Ю✍✉☎☀☻✌♈✿✪❈❦㊣☝☯➽❤▦卐❂☬☣※☂⊗◍✠♝♞㉿➽♬☑웃유❖☃☊큐☠Ю';
        this.dataVo.time = 120;
        //无序化
        var arr = this.dataVo.sData.split('');
        arr.sort(function (a, b) {
            if (Math.random() > 0.5)
                return 1;
            if (Math.random() < 0.5)
                return -1;
            return 0;
        });
        this.group = new egret.Sprite();
        this.group.x = 5;
        this.group.y = 200;
        var len = arr.length;
        for (var i = 0; i < len; i++) {
            var text = this.createText(arr[i]);
            text.x = 90 * (i % 8);
            text.y = 86 * Math.floor(i / 8);
            this.group.addChild(text);
        }
        this.addChild(this.group);
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
    };
    Scene_2.prototype.textClk = function (evt) {
        if (!this.currentSelect) {
            this.currentSelect = evt.target;
            this.currentSelect.alpha = 0.5;
        }
        else if (this.currentSelect == evt.target) {
            this.currentSelect.alpha = 1;
            this.currentSelect = null;
        }
        else {
            if (this.currentSelect.text == evt.target.text) {
                this.group.removeChild(this.currentSelect);
                this.group.removeChild(evt.target);
                this.currentSelect = null;
            }
            else {
                this.currentSelect.alpha = 1;
                this.currentSelect = evt.target;
                this.currentSelect.alpha = 0.5;
            }
        }
        if (this.group.numChildren <= 0) {
            this.timeItem.stop();
            EventCenter.instance().dispatchEvent(new GameEvent(GameEvent.GOTO_NEXT));
        }
    };
    Scene_2.prototype.createText = function (name) {
        var text = new egret.TextField();
        text.size = 60;
        text.text = name;
        text.textColor = 0x0000ff;
        text.stroke = 0.5;
        text.strokeColor = 0x000000;
        text.width = 80;
        text.height = 80;
        text.background = true;
        text.backgroundColor = 0xffff00;
        text.textAlign = 'center';
        text.verticalAlign = 'middle';
        text.bold = true;
        text.touchEnabled = true;
        text.addEventListener(egret.TouchEvent.TOUCH_TAP, this.textClk, this);
        return text;
    };
    Scene_2.prototype.exit = function () {
        _super.prototype.exit.call(this);
        while (this.numChildren > 1) {
            var child = this.getChildAt(this.numChildren - 1);
            if (child instanceof egret.TextField) {
                child.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.textClk, this);
            }
            this.removeChild(child);
        }
    };
    return Scene_2;
}(BaseScene));
__reflect(Scene_2.prototype, "Scene_2");
//# sourceMappingURL=Scene_2.js.map