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
        this.tipsTxt.textColor = 0xffffff;
        this.tipsTxt.stroke = 1;
        this.tipsTxt.strokeColor = 0xff0000;
        this.tipsTxt.bold = true;
        this.tipsTxt.lineSpacing = 20;
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

    public show(){
        this.tipsTxt.textFlow = this.getDesc();
        this.tipsTxt.y = SpriteUtil.stageCenterY - this.tipsTxt.height;
        super.open();
    }

    private getDesc(){
        let config = GameData.config[GameData.currentLevel];
        let arr = new Array<egret.ITextElement>();
        arr.push({text:config.title,style:{bold:true,size:40,textColor:0xFFC125}});
        arr.push({text:'\n'});
        arr.push({text:config['desc'],style:{size:32,bold:false,textColor:0xEEEED1,stroke:0}});
        return arr;
    }

}