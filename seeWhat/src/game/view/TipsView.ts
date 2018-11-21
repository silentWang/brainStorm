class TipsView extends BaseView{
    constructor(){
        super();
        this.init();
    }

    private tipsTxt:egret.TextField;
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

        let text = SpriteUtil.createText('你有3次复活机会！',36,0xeeeeee);
        text.anchorOffsetX = 0;
        text.anchorOffsetY = 0;
        text.x = 50;
        text.y = 100;
        text.width = shape.width - 100;
        text.height = 160;
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
            this.close();
            GameData.currentLevel--;
            EventCenter.instance().dispatchEvent(new GameEvent(GameEvent.GOTO_NEXT_LEVEL));
        },this);

        let btn2 = SpriteUtil.createButton('看视频复活',200,80,0x0000ff,32);
        btn2.x = shape.width/2 + 40;
        btn2.y = shape.height - 100;
        sprite.addChild(btn2);
        btn2.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            return;
            this.close();
            console.log('看视频');
        },this);
        
        sprite.x = SpriteUtil.stageCenterX - shape.width/2;
        sprite.y = SpriteUtil.stageCenterY - shape.height/2;
    }

    open(){
        this.tipsTxt.text = `你还剩余${GameData.reviveCard}次复活机会！`;
        super.open();
    }
}