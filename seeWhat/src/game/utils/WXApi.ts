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
    let createGameClubButton:Function;//创建游戏圈按钮
    let navigateToMiniProgram:Function;//跳转小游戏
    let createBannerAd:Function;//创建广告
    let createRewardedVideoAd:Function;//激励视频
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
                                Game.instance().gameScene.enterMenu();
                            }
                        });
                        WXApi.showShareMenu();
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
            Game.instance().gameScene.enterMenu();
            return;
        }
        let sysInfo = wx.getSystemInfoSync();
        // console.log(sysInfo);
        let button = wx.createUserInfoButton({
            type: 'text',
            text: '登陆',
            style: {
                left: sysInfo.windowWidth/2 - 60,
                top: sysInfo.windowHeight/2 - 25,
                width: 120,
                height: 50,
                backgroundColor: '#0000ff',
                color: '#ffff00',
                textAlign: 'center',
                fontSize: 48,
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
                Game.instance().gameScene.enterMenu();
            }
        });
    }

    //显示转发菜单
    static showShareMenu(){
        wx.showShareMenu({"withShareTicket":false,complete:res=>{
            wx.onShareAppMessage(()=>{
                return {
                    title:'真的！原来我与正常人相差这么大距离！',
                    imageUrl:'resource/assets/head.png',
                    query:''
                }
            });
        }});
    }
    //主动转发
    static shareAppMessage(){
        wx.shareAppMessage({
            title:"有人@你，请你帮忙过了这一关！",
            imageUrl:'resource/assets/head.png',
            query:''
        });
    }
    //创建音频
    static createInnerAudioContext(url:string){
        let audio = wx.createInnerAudioContext();
        audio.src = url;
        return audio;
    }
    //游戏圈
    static createGameClubButton(){
        let btn = wx.createGameClubButton({
            icon: 'green',
            style: {
                left: 10,
                top: 10,
                width: 40,
                height: 40
            }
        });
        return btn;
    }
    //跳转到指定小游戏
    static navigateToMiniProgram(appid){
        wx.navigateToMiniProgram({
            appId:appid,
            success:function(){
                // console.log("跳转成功！");
            }
        });
    }
    //广告显示
    static globalBannerAd;
    static showBannerAd(b:boolean = true){
        if(!this.globalBannerAd){
            let systemInfo:any = wx.getSystemInfoSync();
            let shgt = SpriteUtil.stageHeight;
            let wid = SpriteUtil.stageWidth;
            if(shgt > systemInfo.windowHeight){
                shgt = systemInfo.windowHeight*wid/systemInfo.windowWidth;
            }
            let bannerAd = wx.createBannerAd({
                adUnitId: 'adunit-3f56016b3591065a',
                style: {
                    left: 0,
                    top: 0,
                    width: wid
                }
            });
            bannerAd.onResize(res=>{
                bannerAd.style.left = 0;
                bannerAd.style.top = systemInfo.windowHeight - res.height;
                this.globalBannerAd = bannerAd;
                if(b){
                    bannerAd.show();
                }
                else{
                    bannerAd.hide();
                }
            });
        }
        else{
            if(b){
                this.globalBannerAd.show();
            }
            else{
                this.globalBannerAd.hide();
            }
        }
    }
    //激励视频
    static showVideoAd(){
        let videoAd = wx.createRewardedVideoAd({
            adUnitId: 'adunit-37768ba621106947'
        });
        return videoAd;
    }
    //set user level
    //排行榜数据更新
    static updateRankLvl(chapter:number){
        let schapter = egret.localStorage.getItem('very_funny_small_game_chapter');
        if(parseInt(schapter) >= chapter) return;
        egret.localStorage.setItem("very_funny_small_game_chapter",""+chapter);
        let openDataContext = platform['openDataContext'];
        openDataContext.postMessage({
            command:'cmd_user',
            level:chapter
        });
    }
}