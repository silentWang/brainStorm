class RankView extends BaseView{
    constructor(){
        super();
        this.init();
    }

    private listSpr:egret.Sprite;
    private intervalId = 0;
    private init(){
        let shape = new egret.Shape();
        shape.graphics.beginFill(0x000000,0.96);
        shape.graphics.drawRect(0,0,SpriteUtil.stageWidth,SpriteUtil.stageHeight);
        shape.graphics.endFill();
        this.addChild(shape);
        shape.touchEnabled = true;
        shape.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            this.close();
        },this);

        this.listSpr = new egret.Sprite();
        this.listSpr.y = 100;
        this.addChild(this.listSpr);

        let txt = new egret.TextField();
        txt.text = '排行榜';
        txt.x = SpriteUtil.stageCenterX - txt.width/2;
        txt.y = 80;
        txt.size = 40;
        txt.textColor = 0xffff00;
        txt.bold = true;
        this.addChild(txt);
    }

    open(){
        super.open();
        this.intervalId = egret.setInterval(()=>{
            this.listSpr.removeChildren();
            let openDatactx = platform['openDataContext'];
            openDatactx.postMessage({command:'cmd_rank'});
            let rank = openDatactx.createDisplayObject();
            let scale = SpriteUtil.stageWidth/rank.width;
            this.listSpr.addChild(rank);
            this.listSpr.scaleX = scale;
            this.listSpr.scaleY = scale;

        },this,40);
    }

    close(){
        super.close();
        egret.clearInterval(this.intervalId);
    }

}