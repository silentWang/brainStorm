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
//问答 奇趣
var Scene_010 = (function (_super) {
    __extends(Scene_010, _super);
    function Scene_010() {
        var _this = _super.call(this) || this;
        _this.curIndex = 0;
        _this.isOperating = false;
        _this.init();
        return _this;
    }
    Scene_010.prototype.init = function () {
        this.questions = GameData.questions;
        this.questions.sort(function (a, b) {
            if (Math.random() > 0.5)
                return 1;
            if (Math.random() < 0.5)
                return -1;
            return 0;
        });
        this.questionTxt = new egret.TextField();
        this.questionTxt.size = 32;
        this.questionTxt.width = SpriteUtil.stageWidth - 120;
        this.questionTxt.textColor = 0x0000ff;
        this.questionTxt.stroke = 2;
        this.questionTxt.strokeColor = 0xffffff;
        this.questionTxt.bold = true;
        this.questionTxt.lineSpacing = 20;
        this.questionTxt.textAlign = 'center';
        this.questionTxt.verticalAlign = 'middle';
        this.questionTxt.anchorOffsetX = this.questionTxt.width / 2;
        this.questionTxt.anchorOffsetY = this.questionTxt.height / 2;
        this.questionTxt.x = SpriteUtil.stageCenterX;
        this.questionTxt.y = 200;
        this.addChild(this.questionTxt);
        var btn1 = this.createAnswerButton('✅');
        btn1.x = SpriteUtil.stageCenterX - btn1.width;
        btn1.name = 'btn_1';
        var btn2 = this.createAnswerButton('🅾');
        btn2.x = SpriteUtil.stageCenterX;
        btn2.name = 'btn_0';
        var btn3 = this.createAnswerButton('❎');
        btn3.x = SpriteUtil.stageCenterX + btn3.width;
        btn3.name = 'btn_2';
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
    };
    Scene_010.prototype.clkSwitch = function (evt) {
        if (this.isOperating)
            return;
        var target = evt.target;
        var name = target.name;
        if (!name || name.search('btn_') < 0)
            return;
        var idx = name.split('_')[1];
        if (idx == this.questions[this.curIndex].answer) {
            this.curIndex++;
            this.askQuestion();
        }
        else {
            this.isOperating = true;
            this.timeItem.stop();
            EffectUtil.showResultEffect();
        }
    };
    Scene_010.prototype.createAnswerButton = function (str) {
        var text = SpriteUtil.createText(str, 160);
        text.y = SpriteUtil.stageCenterY + 100;
        this.addChild(text);
        text.touchEnabled = true;
        text.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clkSwitch, this);
        return text;
    };
    Scene_010.prototype.askQuestion = function () {
        var question = this.questions[this.curIndex];
        this.questionTxt.text = "\u7591\u60D1\uFF1A" + question.question;
    };
    Scene_010.prototype.enter = function () {
        _super.prototype.enter.call(this);
        this.askQuestion();
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