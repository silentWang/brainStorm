class MenuScene extends BaseScene{
    constructor(){
        super();
        this.init();
    }

    private isInitOpenDataCtx:boolean = false;
    private startBtn;
    private gameClubBtn;
    private init(){
        let logo = new egret.Bitmap(RES.getRes("logo_png"));
        logo.anchorOffsetX = logo.width/2;
        logo.x = SpriteUtil.stageCenterX;
        logo.y = 120;
        this.addChild(logo);

        let btn = SpriteUtil.createImage('social');
        btn.x = SpriteUtil.stageCenterX;
        btn.y = SpriteUtil.stageCenterY;
        btn.scaleX = 2.2;
        btn.scaleY = 2.2;
        this.addChild(btn);
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            GameSound.instance().playSound('click');
            Game.instance().gameScene.enterChapter();
            // EventCenter.instance().dispatchEvent(new GameEvent(GameEvent.GOTO_NEXT));
        },this);
        this.startBtn = btn;

        let rankbtn = SpriteUtil.createImage('rank');
        rankbtn.x = SpriteUtil.stageCenterX - 100;
        rankbtn.y = btn.y + 250;
        rankbtn.scaleX = 1.5;
        rankbtn.scaleY = 1.5;
        this.addChild(rankbtn);
        rankbtn.touchEnabled = true;
        rankbtn.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            if(!GameData.isWxGame) return;
            GameSound.instance().playSound('click');
            Game.instance().gameView.rankView.open();
        },this);

        let sharebtn = SpriteUtil.createImage('share');
        sharebtn.x = SpriteUtil.stageCenterX + 100;
        sharebtn.y = btn.y + 250;
        sharebtn.scaleX = 1.5;
        sharebtn.scaleY = 1.5;
        this.addChild(sharebtn);
        sharebtn.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{ 
            if(!GameData.isWxGame) return;
            WXApi.shareAppMessage();
        },this);

        let jumpbtn = SpriteUtil.createImage('game_more_1');
        jumpbtn.x = SpriteUtil.stageWidth - jumpbtn.width + 10;
        jumpbtn.y = 150;
        jumpbtn.scaleX = 1.2;
        jumpbtn.scaleY = 1.2;
        this.addChild(jumpbtn);
        jumpbtn.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{ 
            if(!GameData.isWxGame) return;
            //逻辑迷宫
            WXApi.navigateToMiniProgram("wx8bc01658647ef87a");
        },this);

        this.gameClubBtn = WXApi.createGameClubButton();
        //
        EventCenter.instance().addEventListener(GameEvent.AUTHORIZE_REFRESH,this.initOpenData,this);
        WXApi.getSetting();
    }

    private initOpenData(){
        EventCenter.instance().removeEventListener(GameEvent.AUTHORIZE_REFRESH,this.initOpenData,this);
        if(!this.isInitOpenDataCtx){
            this.isInitOpenDataCtx = true;
            let openDatactx = platform['openDataContext'];
            //由于没有服务器 暂时使用avatarUrl 标识用户
            openDatactx.postMessage({command:'cmd_openId',openId:GameData.wxUserInfo.avatarUrl});
        }
    }

    enter(){
        super.enter();
        egret.Tween.get(this.startBtn,{loop:true}).to({scaleX:2.4,scaleY:2.4},1500).to({scaleX:2.2,scaleY:2.2},1500);
        this.gameClubBtn.show();
    }
    exit(){
        super.exit();
        this.gameClubBtn.hide();
        egret.Tween.removeTweens(this.startBtn);
        this.startBtn.scaleX = 2.2;
        this.startBtn.scaleY = 2.2;
    }

}