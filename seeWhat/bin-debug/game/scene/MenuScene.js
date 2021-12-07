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
var MenuScene = (function (_super) {
    __extends(MenuScene, _super);
    function MenuScene() {
        var _this = _super.call(this) || this;
        _this.isInitOpenDataCtx = false;
        _this.init();
        return _this;
    }
    MenuScene.prototype.init = function () {
        var logo = new egret.Bitmap(RES.getRes("home_json#logo"));
        logo.anchorOffsetX = logo.width / 2;
        logo.x = SpriteUtil.stageCenterX;
        logo.y = 120;
        this.addChild(logo);
        var btn = new egret.Bitmap(RES.getRes('home_json#social'));
        btn.anchorOffsetX = btn.width / 2;
        btn.anchorOffsetY = btn.height / 2;
        btn.x = SpriteUtil.stageCenterX;
        btn.y = SpriteUtil.stageCenterY - 20;
        btn.scaleX = 2;
        btn.scaleY = 2;
        this.addChild(btn);
        btn.touchEnabled = true;
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            GameSound.instance().playSound('click');
            Game.instance().gameScene.enterChapter();
            // EventCenter.instance().dispatchEvent(new GameEvent(GameEvent.GOTO_NEXT));
        }, this);
        this.startBtn = btn;
        var rankbtn = SpriteUtil.createImage('rank');
        rankbtn.x = SpriteUtil.stageCenterX - 100;
        rankbtn.y = btn.y + 220;
        rankbtn.scaleX = 1.5;
        rankbtn.scaleY = 1.5;
        this.addChild(rankbtn);
        rankbtn.touchEnabled = true;
        rankbtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (!GameData.isWxGame)
                return;
            GameSound.instance().playSound('click');
            Game.instance().gameView.rankView.open();
        }, this);
        var sharebtn = SpriteUtil.createImage('share');
        sharebtn.x = SpriteUtil.stageCenterX + 100;
        sharebtn.y = btn.y + 220;
        sharebtn.scaleX = 1.5;
        sharebtn.scaleY = 1.5;
        this.addChild(sharebtn);
        sharebtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (!GameData.isWxGame)
                return;
            WXApi.shareAppMessage();
        }, this);
        if (GameData.isWxGame) {
            // let sprite = new egret.Sprite();
            //超越指尖
            // let cybtn = new egret.Bitmap(RES.getRes('home_json#zhijian'));
            // cybtn.anchorOffsetX = cybtn.width/2;
            // cybtn.anchorOffsetY = cybtn.height/2;
            // cybtn.x = cybtn.width/2;
            // this.addChild(cybtn);
            // cybtn.touchEnabled = true;
            // cybtn.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{ 
            //     if(!GameData.isWxGame) return;
            //     WXApi.navigateToMiniProgram("wxf461dfd74e17709f");
            // },this);
            // sprite.addChild(cybtn);
            //球球回家
            // let qqbtn = new egret.Bitmap(RES.getRes('home_json#qiuqiuhome'));
            // qqbtn.anchorOffsetX = qqbtn.width/2;
            // qqbtn.anchorOffsetY = qqbtn.height/2;
            // qqbtn.x = cybtn.x + cybtn.width + 40;
            // this.addChild(qqbtn);
            // qqbtn.touchEnabled = true;
            // qqbtn.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{ 
            //     if(!GameData.isWxGame) return;
            //     WXApi.navigateToMiniProgram("wxe79f94f71d43ffd7");
            // },this);
            // sprite.addChild(qqbtn);
            //逻辑迷宫
            // let jumpbtn = new egret.Bitmap(RES.getRes('home_json#migong'));
            // jumpbtn.anchorOffsetX = jumpbtn.width/2;
            // jumpbtn.anchorOffsetY = jumpbtn.height/2;
            // jumpbtn.x = qqbtn.x + qqbtn.width + 40;
            // this.addChild(jumpbtn);
            // jumpbtn.touchEnabled = true;
            // jumpbtn.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{ 
            //     if(!GameData.isWxGame) return;
            //     WXApi.navigateToMiniProgram("wx8bc01658647ef87a");
            // },this);
            // sprite.addChild(jumpbtn);
            // sprite.x = SpriteUtil.stageCenterX - sprite.width/2;
            // sprite.y = rankbtn.y + rankbtn.height + 50;
            // this.addChild(sprite);
            this.gameClubBtn = WXApi.createGameClubButton();
            //
            EventCenter.instance().addEventListener(GameEvent.AUTHORIZE_REFRESH, this.initOpenData, this);
            WXApi.getSetting();
        }
    };
    MenuScene.prototype.initOpenData = function () {
        EventCenter.instance().removeEventListener(GameEvent.AUTHORIZE_REFRESH, this.initOpenData, this);
        var avatarUrl = egret.localStorage.getItem("very_funny_small_game_user_avatar_url");
        if (!this.isInitOpenDataCtx) {
            this.isInitOpenDataCtx = true;
            var openDatactx = platform['openDataContext'];
            //由于没有服务器 暂时使用avatarUrl 标识用户
            openDatactx.postMessage({ command: 'cmd_openId', openId: avatarUrl });
        }
    };
    MenuScene.prototype.enter = function () {
        _super.prototype.enter.call(this);
        egret.Tween.get(this.startBtn, { loop: true }).to({ scaleX: 2.2, scaleY: 2.2 }, 1500).to({ scaleX: 2, scaleY: 2 }, 1500);
        if (GameData.isWxGame) {
            this.gameClubBtn.show();
        }
    };
    MenuScene.prototype.exit = function () {
        _super.prototype.exit.call(this);
        if (GameData.isWxGame) {
            this.gameClubBtn.hide();
        }
        egret.Tween.removeTweens(this.startBtn);
        this.startBtn.scaleX = 2;
        this.startBtn.scaleY = 2;
    };
    return MenuScene;
}(BaseScene));
__reflect(MenuScene.prototype, "MenuScene");
//# sourceMappingURL=MenuScene.js.map