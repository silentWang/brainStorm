class MenuScene extends BaseScene{
    constructor(){
        super();
        this.init();
    }

    private isInitOpenDataCtx:boolean = false;
    private init(){
        let logo = new egret.Bitmap(RES.getRes("logo_png"));
        logo.anchorOffsetX = logo.width/2;
        logo.x = SpriteUtil.stageCenterX;
        logo.y = 120;
        this.addChild(logo);

        let btn = SpriteUtil.createButton('开始');
        btn.x = SpriteUtil.stageCenterX - btn.width/2;
        btn.y = SpriteUtil.stageCenterY;
        this.addChild(btn);
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            GameSound.instance().playSound('click');
            EventCenter.instance().dispatchEvent(new GameEvent(GameEvent.GOTO_NEXT));
        },this);

        let rankbtn = SpriteUtil.createText('排行榜',40,0xEEB422);
        rankbtn.x = SpriteUtil.stageCenterX;
        rankbtn.y = btn.y + 200;
        this.addChild(rankbtn);
        rankbtn.touchEnabled = true;
        rankbtn.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            if(!GameData.isWxGame) return;
            GameSound.instance().playSound('click');
            Game.instance().gameView.rankView.open();
        },this);
    }

    enter(){
        super.enter();
        if(!this.isInitOpenDataCtx){
            this.isInitOpenDataCtx = true;
            let openDatactx = platform['openDataContext'];
            //由于没有服务器 暂时使用avatarUrl 标识用户
            openDatactx.postMessage({command:'cmd_openId',openId:GameData.wxUserInfo.avatarUrl});

        }
    }

}