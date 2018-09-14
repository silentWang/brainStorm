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
                        wx.getUserInfo({
                            success: function (res) {
                                GameData.wxUserInfo = res.userInfo;
                                Game.instance().gameScene.gotoMenu();
                            }
                        });
                    }
                    else {
                        WXApi.createUserInfoButton();
                    }
                }
            }
        });
    };
    //创建授权按钮
    WXApi.createUserInfoButton = function () {
        if (egret.Capabilities.runtimeType != "wxgame") {
            Game.instance().gameScene.gotoMenu();
            return;
        }
        var sysInfo = wx.getSystemInfoSync();
        console.log(sysInfo);
        var button = wx.createUserInfoButton({
            type: 'text',
            text: '登陆',
            style: {
                left: sysInfo.windowWidth / 2 - 60,
                top: sysInfo.windowHeight / 2 - 25,
                width: 120,
                height: 50,
                backgroundColor: '#0000ff',
                color: '#00ff00',
                textAlign: 'center',
                fontSize: 40,
                opacity: 1,
                borderRadius: 10,
            }
        });
        button.onTap(function (res) {
            if (res.errMsg == 'getUserInfo:ok') {
                button.hide();
                button.destroy();
                WXApi.showShareMenu();
                GameData.wxUserInfo = res.userInfo;
                Game.instance().gameScene.gotoMenu();
            }
        });
    };
    //显示转发菜单
    WXApi.showShareMenu = function () {
        wx.showShareMenu({ "withShareTicket": false, complete: function (res) {
                console.log(res.errMsg);
            } });
    };
    //set user level
    //排行榜数据更新
    WXApi.updateRankLvl = function () {
        var openDataContext = platform['openDataContext'];
        openDataContext.postMessage({
            command: 'cmd_user',
            level: GameData.currentLevel
        });
    };
    return WXApi;
}());
__reflect(WXApi.prototype, "WXApi");
//# sourceMappingURL=WXApi.js.map