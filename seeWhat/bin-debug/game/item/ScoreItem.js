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
var ScoreItem = (function (_super) {
    __extends(ScoreItem, _super);
    function ScoreItem() {
        var _this = _super.call(this) || this;
        _this.score = 0;
        _this.tarScore = 0;
        _this.init();
        return _this;
    }
    ScoreItem.prototype.init = function () {
        this.scoreTxt = new egret.TextField();
        this.scoreTxt.size = 32;
        this.scoreTxt.text = '0';
        this.scoreTxt.textColor = 0x00ff00;
        this.scoreTxt.width = 300;
        this.scoreTxt.stroke = 1;
        this.scoreTxt.strokeColor = 0x000000;
        // this.scoreTxt.bold = true;
        this.addChild(this.scoreTxt);
        this.y = 10;
    };
    //目标分和当前分
    ScoreItem.prototype.setSTScore = function (score, tarScore) {
        this.score = score;
        if (tarScore) {
            this.tarScore = tarScore;
        }
        this.scoreTxt.text = "\u5206\u6570 " + this.score + "  \u76EE\u6807 " + this.tarScore;
    };
    //分数
    ScoreItem.prototype.setScore = function (score) {
        this.score = score;
        this.scoreTxt.text = "\u5206\u6570 " + score;
    };
    //是否达成目标分
    ScoreItem.prototype.isCanPass = function () {
        if (this.score >= this.tarScore) {
            return true;
        }
        return false;
    };
    return ScoreItem;
}(egret.Sprite));
__reflect(ScoreItem.prototype, "ScoreItem");
//# sourceMappingURL=ScoreItem.js.map