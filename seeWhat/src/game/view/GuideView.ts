class GuideView extends BaseView{
    constructor(){
        super();
        this.init();
    }

    private tipsTxt:egret.TextField;
    private startBtn:egret.TextField;
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
        this.addChild(this.tipsTxt);

        let btn = SpriteUtil.createText(">> 开始挑战 <<",48,0xffff00);
        btn.x = SpriteUtil.stageCenterX;
        btn.y = SpriteUtil.stageCenterY - 80;
        btn.touchEnabled = true;
        this.addChild(btn);
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            GameSound.instance().playSound('click');
            this.close();
            EffectUtil.playReadyGo();
        },this);
        this.startBtn = btn;
        EffectUtil.breath(btn,0.05);

        let home = SpriteUtil.createImage('home');
        home.x = 80;
        home.y = 80;
        home.scaleX = 1.4;
        home.scaleY = 1.5;
        this.addChild(home);
        home.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            this.close();
            Game.instance().gameScene.enterMenu();
        },this);
    }

    public show(){
        this.tipsTxt.textFlow = this.getDesc();
        super.open();
        this.tipsTxt.y = SpriteUtil.stageCenterY - this.tipsTxt.height/2 - 100;
        this.startBtn.y = this.tipsTxt.y + this.tipsTxt.height + 60;
    }

    private getDesc(){
        let config = GameData.getLevelConfig();
        let arr = new Array<egret.ITextElement>();
        arr.push({text:config.title,style:{bold:true,size:40,textColor:0xFFC125}});
        arr.push({text:'\n'});
        arr.push({text:config['desc'],style:{size:32,bold:false,textColor:0xEEEED1,stroke:0}});
        return arr;
    }

}