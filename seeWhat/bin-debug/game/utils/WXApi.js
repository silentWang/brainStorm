var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var WXApi = (function () {
    function WXApi() {
    }
    WXApi.getSetting = function () {
        wx.getSetting({
            complete: function (res) {
                if (res.errMsg == 'getSetting:ok') {
                    var settings = res.authSetting;
                    if (settings['scope.userInfo'] == true) {
                        //已经授权
                        var avatarUrl = egret.localStorage.getItem("very_funny_small_game_user_avatar_url");
                        if (!avatarUrl) {
                            wx.getUserInfo({
                                success: function (res) {
                                    GameData.wxUserInfo = res.userInfo;
                                    egret.localStorage.setItem('very_funny_small_game_user_avatar_url', res.userInfo.avatarUrl);
                                    EventCenter.instance().dispatchEvent(new GameEvent(GameEvent.AUTHORIZE_REFRESH));
                                }
                            });
                        }
                        else {
                            EventCenter.instance().dispatchEvent(new GameEvent(GameEvent.AUTHORIZE_REFRESH));
                        }
                        WXApi.showShareMenu();
                    }
                    else {
                        WXApi.createUserInfoButton();
                    }
                }
                else {
                    console.error(res);
                }
            }
        });
    };
    WXApi.showModal = function (obj) {
        wx.showModal(obj);
    };
    //创建授权按钮
    WXApi.createUserInfoButton = function () {
        if (egret.Capabilities.runtimeType != "wxgame") {
            Game.instance().gameScene.enterMenu();
            return;
        }
        var sysInfo = wx.getSystemInfoSync();
        // console.log(sysInfo);
        var button = wx.createUserInfoButton({
            type: 'text',
            text: '',
            style: {
                left: 0,
                top: 0,
                width: sysInfo.windowWidth,
                height: sysInfo.windowHeight,
                backgroundColor: '#0000ff',
                color: '#ffff00',
                textAlign: 'center',
                fontSize: 48,
                opacity: 0.1,
                borderRadius: 0,
            }
        });
        button.onTap(function (res) {
            if (res.errMsg == 'getUserInfo:ok') {
                button.hide();
                button.destroy();
                WXApi.showShareMenu();
                GameData.wxUserInfo = res.userInfo;
                egret.localStorage.setItem('very_funny_small_game_user_avatar_url', res.userInfo.avatarUrl);
                EventCenter.instance().dispatchEvent(new GameEvent(GameEvent.AUTHORIZE_REFRESH));
            }
        });
    };
    //显示转发菜单
    WXApi.showShareMenu = function () {
        wx.showShareMenu({ "withShareTicket": false, complete: function (res) {
                wx.onShareAppMessage(function () {
                    var obj = GameData.shareConf[Math.floor(GameData.shareConf.length * Math.random())];
                    return {
                        title: obj.title,
                        imageUrl: obj.head,
                        query: ''
                    };
                });
            } });
    };
    //主动转发
    WXApi.shareAppMessage = function () {
        var obj = GameData.shareConf[Math.floor(GameData.shareConf.length * Math.random())];
        wx.shareAppMessage({
            title: obj.title,
            imageUrl: obj.head,
            query: ''
        });
    };
    //创建音频
    WXApi.createInnerAudioContext = function (url) {
        var audio = wx.createInnerAudioContext();
        audio.src = url;
        return audio;
    };
    //游戏圈
    WXApi.createGameClubButton = function () {
        var btn = wx.createGameClubButton({
            icon: 'green',
            style: {
                left: 10,
                top: 10,
                width: 40,
                height: 40
            }
        });
        return btn;
    };
    //跳转到指定小游戏
    WXApi.navigateToMiniProgram = function (appid) {
        wx.navigateToMiniProgram({
            appId: appid,
            success: function () {
                // console.log("跳转成功！");
            }
        });
    };
    WXApi.showBannerAd = function (b) {
        var _this = this;
        if (b === void 0) { b = true; }
        if (!GameData.isWxGame)
            return;
        if (!this.globalBannerAd) {
            var systemInfo_1 = wx.getSystemInfoSync();
            var shgt = SpriteUtil.stageHeight;
            var wid = SpriteUtil.stageWidth;
            if (shgt > systemInfo_1.windowHeight) {
                shgt = systemInfo_1.windowHeight * wid / systemInfo_1.windowWidth;
            }
            var bannerAd_1 = wx.createBannerAd({
                adUnitId: 'adunit-3f56016b3591065a',
                style: {
                    left: 0,
                    top: 0,
                    width: wid
                }
            });
            bannerAd_1.onResize(function (res) {
                bannerAd_1.style.left = 0;
                bannerAd_1.style.top = systemInfo_1.windowHeight - res.height;
                _this.globalBannerAd = bannerAd_1;
                if (b) {
                    bannerAd_1.show();
                }
                else {
                    bannerAd_1.hide();
                }
            });
            bannerAd_1.onError(function (res) {
                console.log(res.errMsg);
            });
        }
        else {
            if (b) {
                this.globalBannerAd.show();
            }
            else {
                this.globalBannerAd.hide();
            }
        }
    };
    //激励视频
    WXApi.showVideoAd = function () {
        var videoAd = wx.createRewardedVideoAd({
            adUnitId: 'adunit-37768ba621106947'
        });
        return videoAd;
    };
    //set user level
    //排行榜数据更新
    WXApi.updateRankLvl = function (chapter) {
        var schapter = egret.localStorage.getItem('very_funny_small_game_chapter');
        if (parseInt(schapter) >= chapter)
            return;
        egret.localStorage.setItem("very_funny_small_game_chapter", "" + chapter);
        if (GameData.isWxGame) {
            var openDataContext = platform['openDataContext'];
            openDataContext.postMessage({
                command: 'cmd_user',
                level: chapter
            });
        }
    };
    return WXApi;
}());
__reflect(WXApi.prototype, "WXApi");
