class TipsView extends BaseView{
    constructor(){
        super();
        this.init();
    }

    private tipsTxt:egret.TextField;
    private background:egret.Shape;
    private reviveBtn:egret.Sprite;
    private lookBtn:egret.Sprite;
    init(){
        let sp = new egret.Shape();
        sp.graphics.beginFill(0x000000,0.5);
        sp.graphics.drawRect(0,0,SpriteUtil.stageWidth,SpriteUtil.stageHeight);
        sp.graphics.endFill();
        this.addChild(sp);
        sp.touchEnabled = true;

        let sprite = new egret.Sprite();
        this.addChild(sprite);
        let shape = SpriteUtil.createRect(SpriteUtil.stageWidth/1.2,SpriteUtil.stageWidth/1.8,0xB03060);
        shape.anchorOffsetX = 0;
        shape.anchorOffsetY = 0;
        sprite.addChild(shape);
        let title = SpriteUtil.createText('提示',42,0x00ff00);
        title.x = shape.width/2;
        title.y = 50;
        sprite.addChild(title);

        let text = SpriteUtil.createText('你有1次复活机会！',36,0xeeeeee);
        text.anchorOffsetX = 0;
        text.anchorOffsetY = 0;
        text.x = 50;
        text.y = 100;
        text.width = shape.width - 100;
        text.height = 160;
        text.lineSpacing = 20;
        sprite.addChild(text);
        this.tipsTxt = text;

        let closebtn = SpriteUtil.createButton('X',80,80,0xB03060,50);
        closebtn.x = shape.width - 82;
        closebtn.y = 2;
        sprite.addChild(closebtn);
        closebtn.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            this.close();
            Game.instance().gameScene.enterOver();
        },this);

        let btn1 = SpriteUtil.createButton('立即复活',200,80,0x0000ff,32);
        btn1.x = shape.width/2 - btn1.width - 40;
        btn1.y = shape.height - 100;
        sprite.addChild(btn1);
        btn1.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            if(GameData.reviveCard <= 0) return;
            this.close();
            GameData.reviveCard--;
            GameData.currentLevel--;
            EventCenter.instance().dispatchEvent(new GameEvent(GameEvent.GOTO_NEXT_LEVEL));
        },this);
        this.reviveBtn = btn1;

        let btn2 = SpriteUtil.createButton('看视频复活',200,80,0x0000ff,32);
        btn2.x = shape.width/2 + 40;
        btn2.y = shape.height - 100;
        sprite.addChild(btn2);
        this.lookBtn = btn2;

        let bg = new egret.Shape();
        bg.graphics.beginFill(0x000000);
        bg.graphics.drawRect(0,0,SpriteUtil.stageWidth,SpriteUtil.stageHeight);
        bg.graphics.endFill();
        bg.touchEnabled = true;
        bg.alpha = 0.6;
        this.background = bg;
        btn2.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            let videoAd = WXApi.showVideoAd();
            Game.instance().addTop(bg);
            videoAd.onError((res)=>{
                if(bg && bg.parent){
                    bg.parent.removeChild(bg);
                }
                console.log(res.errMsg);
            });
            videoAd.load().then(() => {
                videoAd.show();
                videoAd.onClose((res)=>{
                    if(res.isEnded == true){
                        this.close();
                        GameData.currentLevel--;
                        EventCenter.instance().dispatchEvent(new GameEvent(GameEvent.GOTO_NEXT_LEVEL));
                    }
                    if(bg && bg.parent){
                        bg.parent.removeChild(bg);
                    }
                });
            }).catch(err => {
                if(bg && bg.parent){
                    bg.parent.removeChild(bg);
                }
                console.log(err.errMsg);
            });
        },this);
        
        sprite.x = SpriteUtil.stageCenterX - shape.width/2;
        sprite.y = SpriteUtil.stageCenterY - shape.height/2;
    }

    open(isbool = true){
        this.reviveBtn.visible = isbool;
        if(isbool){
            this.tipsTxt.text = `你还剩余${GameData.reviveCard}次复活机会！`;
            this.lookBtn.x = SpriteUtil.stageWidth/1.2/2 + 40;
        }
        else{
            this.lookBtn.x = SpriteUtil.stageWidth/1.2/2 - this.lookBtn.width/2;
            this.tipsTxt.text = `您的免费复活次数已用光\n可以看视频复活！`;
        }
        super.open();
    }
}