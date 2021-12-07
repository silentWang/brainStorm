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
//色子游戏
var Scene_010 = (function (_super) {
    __extends(Scene_010, _super);
    function Scene_010() {
        var _this = _super.call(this) || this;
        //items 列条目
        _this.items = [];
        _this.curIndex = 0;
        _this.isCanOperate = true;
        _this.init();
        return _this;
    }
    Scene_010.prototype.init = function () {
        var config = GameData.getConfig("scene" + this.dataVo.levelType);
        this.items = config['items'];
        this.questionTxt = new egret.TextField();
        this.questionTxt.size = 30;
        this.questionTxt.width = SpriteUtil.stageWidth - 120;
        this.questionTxt.textColor = 0xEE00EE;
        this.questionTxt.stroke = 2;
        this.questionTxt.strokeColor = 0xffffff;
        this.questionTxt.bold = true;
        this.questionTxt.lineSpacing = 20;
        this.questionTxt.textAlign = 'left';
        this.questionTxt.verticalAlign = 'middle';
        this.questionTxt.anchorOffsetX = this.questionTxt.width / 2;
        this.questionTxt.anchorOffsetY = this.questionTxt.height / 2;
        this.questionTxt.x = SpriteUtil.stageCenterX;
        this.questionTxt.y = 120;
        this.questionTxt.text = "麻烦透露下您的性别";
        this.addChild(this.questionTxt);
        this.btnsArr = [];
        var sprite = new egret.Sprite();
        for (var i = 0; i < 10; i++) {
            var btn = this.createText('');
            btn.x = 280 * (i % 2);
            btn.y = Math.floor(i / 2) * 80;
            sprite.addChild(btn);
            this.btnsArr.push(btn);
            btn.name = "btn_" + i;
            btn.touchEnabled = true;
            btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clkSwitch, this);
        }
        sprite.x = SpriteUtil.stageCenterX - sprite.width / 2;
        sprite.y = 480;
        this.addChild(sprite);
        this.optionSpr = sprite;
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
    };
    Scene_010.prototype.clkSwitch = function (evt) {
        var _this = this;
        if (!this.isCanOperate)
            return;
        if (this.curIndex >= this.items.length - 1) {
            Game.instance().gameScene.enterMenu();
            return;
        }
        var target = evt.target;
        var name = target.name;
        if (!name || name.search('btn_') < 0)
            return;
        var idx = name.split('_')[1];
        var answer = this.items[this.curIndex].answer;
        this.isCanOperate = false;
        if (idx == answer) {
            EffectUtil.showTextAndBack('✓', function () {
                _this.curIndex++;
                _this.nextItem();
                _this.isCanOperate = true;
            });
        }
        else {
            this.timeItem.stop();
            EffectUtil.showResultEffect();
        }
    };
    Scene_010.prototype.nextItem = function () {
        var item = this.items[this.curIndex];
        var ops = item.options;
        this.questionTxt.text = "\u261B " + item.question;
        var len = this.btnsArr.length;
        for (var i = 0; i < len; i++) {
            if (ops[i]) {
                this.btnsArr[i].text = ops[i];
                this.btnsArr[i].visible = true;
            }
            else {
                this.btnsArr[i].visible = false;
            }
        }
        this.optionSpr.y = this.questionTxt.y + this.questionTxt.height + 40;
    };
    Scene_010.prototype.createText = function (str) {
        if (str === void 0) { str = ""; }
        var text = new egret.TextField();
        text.size = 32;
        text.text = str;
        text.textColor = 0x551A8B;
        text.textAlign = 'center';
        text.verticalAlign = 'middle';
        text.width = 200;
        text.height = 60;
        text.bold = true;
        text.background = true;
        text.backgroundColor = 0x00E5EE;
        return text;
    };
    Scene_010.prototype.enter = function () {
        _super.prototype.enter.call(this);
        this.nextItem();
        this.timeItem.start();
    };
    Scene_010.prototype.exit = function () {
        _super.prototype.exit.call(this);
        this.timeItem.stop();
    };
    return Scene_010;
}(BaseScene));
__reflect(Scene_010.prototype, "Scene_010");
//# sourceMappingURL=Scene_010.js.map