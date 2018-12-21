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
    let showModal:Function;//对话框
}

class WXApi{
    static getSetting(){
        wx.getSetting({
            complete:res=>{
                if(res.errMsg == 'getSetting:ok'){
                    let settings = res.authSetting;
                    if(settings['scope.userInfo'] == true){
                        //已经授权
                        let avatarUrl = egret.localStorage.getItem("very_funny_small_game_user_avatar_url");
                        if(!avatarUrl){
                            wx.getUserInfo({
                                success:res=>{
                                    GameData.wxUserInfo = res.userInfo;
                                    egret.localStorage.setItem('very_funny_small_game_user_avatar_url',res.userInfo.avatarUrl);
                                    EventCenter.instance().dispatchEvent(new GameEvent(GameEvent.AUTHORIZE_REFRESH));
                                }
                            });
                        }
                        else{
                            EventCenter.instance().dispatchEvent(new GameEvent(GameEvent.AUTHORIZE_REFRESH));
                        }
                        WXApi.showShareMenu();
                    }
                    else{
                        WXApi.createUserInfoButton();
                    }
                }
                else{
                    console.error(res);
                }
            }
        });
    }

    static showModal(obj){
        wx.showModal(obj);
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
        button.onTap(res=>{
            if(res.errMsg == 'getUserInfo:ok'){
                button.hide();
                button.destroy();
                WXApi.showShareMenu();
                GameData.wxUserInfo = res.userInfo;
                egret.localStorage.setItem('very_funny_small_game_user_avatar_url',res.userInfo.avatarUrl);
                EventCenter.instance().dispatchEvent(new GameEvent(GameEvent.AUTHORIZE_REFRESH));
            }
        });
    }

    //显示转发菜单
    static showShareMenu(){
        wx.showShareMenu({"withShareTicket":false,complete:res=>{
            wx.onShareAppMessage(()=>{
                let obj = GameData.shareConf[Math.floor(GameData.shareConf.length*Math.random())];
                return {
                    title:obj.title,
                    imageUrl:obj.head,
                    query:''
                }
            });
        }});
    }
    //主动转发
    static shareAppMessage(){
        let obj = GameData.shareConf[Math.floor(GameData.shareConf.length*Math.random())];
        wx.shareAppMessage({
            title:obj.title,
            imageUrl:obj.head,
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
            bannerAd.onError((res)=>{
                console.log(res.errMsg);
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