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
var TipsView = (function (_super) {
    __extends(TipsView, _super);
    function TipsView() {
        var _this = _super.call(this) || this;
        _this.init();
        return _this;
    }
    TipsView.prototype.init = function () {
        var _this = this;
        var sp = new egret.Shape();
        sp.graphics.beginFill(0x000000, 0.5);
        sp.graphics.drawRect(0, 0, SpriteUtil.stageWidth, SpriteUtil.stageHeight);
        sp.graphics.endFill();
        this.addChild(sp);
        sp.touchEnabled = true;
        var sprite = new egret.Sprite();
        this.addChild(sprite);
        var shape = new egret.Shape(); //SpriteUtil.createRect(SpriteUtil.stageWidth/1.2,SpriteUtil.stageWidth/1.8,0x8F8F8F);
        shape.graphics.beginFill(0x3498DB);
        shape.graphics.drawRoundRect(0, 0, SpriteUtil.stageWidth / 1.2, SpriteUtil.stageWidth / 1.8, 50);
        shape.graphics.endFill();
        // shape.anchorOffsetX = 0;
        // shape.anchorOffsetY = 0;
        sprite.addChild(shape);
        var title = SpriteUtil.createText('提示', 42, 0x00ff00);
        title.x = shape.width / 2;
        title.y = 50;
        sprite.addChild(title);
        var text = SpriteUtil.createText('你有1次复活机会！', 36, 0xffffff);
        text.anchorOffsetX = 0;
        text.anchorOffsetY = 0;
        text.x = 50;
        text.y = 100;
        text.width = shape.width - 100;
        text.height = 160;
        text.lineSpacing = 20;
        sprite.addChild(text);
        this.tipsTxt = text;
        var closebtn = SpriteUtil.createText("X", 48, 0xF0F8FF); //SpriteUtil.createButton('x',60,60,0x3498DB,48);
        closebtn.bold = true;
        closebtn.stroke = 1;
        closebtn.strokeColor = 0xeeeeee;
        closebtn.x = shape.width - 35;
        closebtn.y = 32;
        closebtn.touchEnabled = true;
        sprite.addChild(closebtn);
        closebtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            _this.close();
            Game.instance().gameScene.enterOver();
        }, this);
        var btn1 = SpriteUtil.createButton('立即复活', 200, 80, 0x00FF00, 32);
        btn1.x = shape.width / 2 - btn1.width - 40;
        btn1.y = shape.height - 100;
        sprite.addChild(btn1);
        btn1.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (GameData.reviveCard <= 0)
                return;
            _this.close();
            GameData.reviveCard--;
            GameData.currentLevel--;
            EventCenter.instance().dispatchEvent(new GameEvent(GameEvent.GOTO_NEXT_LEVEL));
        }, this);
        this.reviveBtn = btn1;
        var btn2 = SpriteUtil.createButton('看视频复活', 200, 80, 0x00FF00, 32);
        btn2.x = shape.width / 2 + 40;
        btn2.y = shape.height - 100;
        sprite.addChild(btn2);
        this.lookBtn = btn2;
        var bg = new egret.Shape();
        bg.graphics.beginFill(0x000000);
        bg.graphics.drawRect(0, 0, SpriteUtil.stageWidth, SpriteUtil.stageHeight);
        bg.graphics.endFill();
        bg.touchEnabled = true;
        bg.alpha = 0.6;
        this.background = bg;
        btn2.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            var videoAd = WXApi.showVideoAd();
            Game.instance().addTop(bg);
            videoAd.onError(function (res) {
                if (bg && bg.parent) {
                    bg.parent.removeChild(bg);
                }
                console.log(res.errMsg);
            });
            videoAd.load().then(function () {
                videoAd.show();
                videoAd.onClose(function (res) {
                    if (res.isEnded == true) {
                        _this.close();
                        GameData.currentLevel--;
                        EventCenter.instance().dispatchEvent(new GameEvent(GameEvent.GOTO_NEXT_LEVEL));
                    }
                    if (bg && bg.parent) {
                        bg.parent.removeChild(bg);
                    }
                });
            }).catch(function (err) {
                if (bg && bg.parent) {
                    bg.parent.removeChild(bg);
                }
                console.log(err.errMsg);
            });
        }, this);
        sprite.x = SpriteUtil.stageCenterX - shape.width / 2;
        sprite.y = SpriteUtil.stageCenterY - shape.height / 2;
    };
    TipsView.prototype.open = function (isbool) {
        if (isbool === void 0) { isbool = true; }
        this.reviveBtn.visible = isbool;
        if (isbool) {
            this.tipsTxt.text = "\u4F60\u8FD8\u5269\u4F59" + GameData.reviveCard + "\u6B21\u590D\u6D3B\u673A\u4F1A\uFF01";
            this.lookBtn.x = SpriteUtil.stageWidth / 1.2 / 2 + 40;
        }
        else {
            this.lookBtn.x = SpriteUtil.stageWidth / 1.2 / 2 - this.lookBtn.width / 2;
            this.tipsTxt.text = "\u60A8\u7684\u514D\u8D39\u590D\u6D3B\u6B21\u6570\u5DF2\u7528\u5149\n\u53EF\u4EE5\u770B\u89C6\u9891\u590D\u6D3B\uFF01";
        }
        _super.prototype.open.call(this);
    };
    return TipsView;
}(BaseView));
__reflect(TipsView.prototype, "TipsView");
