class TimeItem extends egret.Sprite{
    constructor(time:number = 0){
        super();
        this.leftTime = time;
        this.init();
    }
    private leftTime:number = 0;
    private timeTxt:egret.TextField;
    private timer:egret.Timer;
    private init(){
        this.timeTxt = new egret.TextField();
        this.timeTxt.width = 240;
        this.timeTxt.size = 32;
        this.timeTxt.textColor = 0x00ff00;
        this.timeTxt.text = `剩余时间  ${CommonUtil.getMSTimeBySeconds(this.leftTime)}`;
        this.timeTxt.y = 10;
        this.timeTxt.x = (SpriteUtil.stageWidth - 200)/2;
        this.addChild(this.timeTxt);
    }

    start(){
        this.timer = new egret.Timer(1000);
        this.timer.addEventListener(egret.TimerEvent.TIMER,this.timerTick,this);
        this.timer.start();
    }

    private timerTick(){
        this.leftTime --;
        this.timeTxt.text = `剩余时间  ${CommonUtil.getMSTimeBySeconds(this.leftTime)}`;
        if(this.leftTime <= 0){
            Game.instance().gameScene.gotoOver();
        }
    }

    public stop(){
        if(this.timer){
            this.timer.stop();
            this.timer.removeEventListener(egret.TimerEvent.TIMER,this.timerTick,this);
            this.timer = null;
        }
    }

}