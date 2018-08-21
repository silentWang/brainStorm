class GuideView extends BaseView{
    constructor(){
        super();
        this.init();
    }

    private tipsTxt:egret.TextField;
    private init(){
        let sp = new egret.Shape();
        sp.graphics.beginFill(0x000000);
        sp.graphics.drawRect(0,0,SpriteUtil.stageWidth,SpriteUtil.stageHeight);
        sp.graphics.endFill();
        this.addChild(sp);

        this.tipsTxt = new egret.TextField;
        this.tipsTxt.name = '';
        this.tipsTxt.textAlign = 'center';
        this.tipsTxt.size = 40;
        this.tipsTxt.textColor = 0x00ff00;
        this.tipsTxt.stroke = 1;
        this.tipsTxt.strokeColor = 0x0000ff;
        this.tipsTxt.bold = true;
        this.tipsTxt.lineSpacing = 10;
        this.tipsTxt.width = SpriteUtil.stageWidth - 200;
        this.tipsTxt.x = (SpriteUtil.stageWidth - this.tipsTxt.width)/2;
        this.tipsTxt.y = SpriteUtil.stageHeight/2 - 200;
        this.addChild(this.tipsTxt);

        let btn = SpriteUtil.createButton('我知道了');
        btn.x = SpriteUtil.stageCenterX - btn.width/2;
        btn.y = SpriteUtil.stageCenterY + 100;
        this.addChild(btn);
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            this.close();
            EventCenter.instance().dispatchEvent(new GameEvent(GameEvent.START_GAME));
        },this);
    }

    public show(desc:string = ''){
        this.tipsTxt.text = desc;
        super.open();
    }

}