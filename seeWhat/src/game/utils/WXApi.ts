declare namespace wx {
    let createUserInfoButton:Function;//授权按钮
    let getSetting:Function;//是否授权
    let getUserInfo:Function;//用户wx信息
    let showShareMenu:Function;//显示转发菜单
    let getShareInfo:Function;//获取转发信息
    let onShareAppMessage:Function;//转发回掉
    let shareAppMessage:Function;//主动转发
    let getLaunchOptionsSync:Function;//获取启动参数
    let setUserCloudStorage:Function;//用户缓存
    let getSystemInfoSync:Function;//
    let createInnerAudioContext:Function;//创建音频context
}

class WXApi{
    static getSetting(){
        wx.getSetting({
            complete:res=>{
                if(res.errMsg == 'getSetting:ok'){
                    let settings = res.authSetting;
                    if(settings['scope.userInfo'] == true){
                        //已经授权
                        wx.getUserInfo({
                            success:res=>{
                                GameData.wxUserInfo = res.userInfo;
                                Game.instance().gameScene.gotoMenu();
                            }
                        });
                    }
                    else{
                        WXApi.createUserInfoButton();
                    }
                }
            }
        });
    }

    //创建授权按钮
    static createUserInfoButton(){
        if (egret.Capabilities.runtimeType != "wxgame") {
            Game.instance().gameScene.gotoMenu();
            return;
        }
        let sysInfo = wx.getSystemInfoSync();
        console.log(sysInfo);
        let button = wx.createUserInfoButton({
            type: 'text',
            text: '登陆',
            style: {
                left: sysInfo.windowWidth/2 - 60,
                top: sysInfo.windowHeight/2 - 25,
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
        button.onTap(res=>{
            if(res.errMsg == 'getUserInfo:ok'){
                button.hide();
                button.destroy();
                WXApi.showShareMenu();
                GameData.wxUserInfo = res.userInfo;
                Game.instance().gameScene.gotoMenu();
            }
        });
    }

    //显示转发菜单
    static showShareMenu(){
        wx.showShareMenu({"withShareTicket":false,complete:res=>{
            console.log(res.errMsg);
        }});
    }
    //创建音频
    static createInnerAudioContext(url:string){
        let audio = wx.createInnerAudioContext();
        audio.src = url;
        return audio;
    }
    //set user level
    //排行榜数据更新
    static updateRankLvl(){
        let openDataContext = platform['openDataContext'];
        openDataContext.postMessage({
            command:'cmd_user',
            level:GameData.currentLevel
        });
    }
}