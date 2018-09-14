class TimeItem extends egret.Sprite{
    constructor(time:number = 0){
        super();
        this._leftTime = time;
        this.init();
    }
    private _leftTime:number = 0;
    private timeTxt:egret.TextField;
    private timer:egret.Timer;
    //loop 回掉方法 没有则默认
    private loop:Function;
    private complete:Function;
    private callBackContext = null;
    private init(){
        this.timeTxt = new egret.TextField();
        this.timeTxt.width = 240;
        this.timeTxt.size = 32;
        this.timeTxt.textColor = 0xff0000;
        this.timeTxt.stroke = 1;
        this.timeTxt.strokeColor = 0x000000;
        this.timeTxt.text = `剩余时间  ${CommonUtil.getMSTimeBySeconds(this._leftTime)}`;
        this.y = 30;
        this.x = (SpriteUtil.stageWidth - 200)/2;
        this.addChild(this.timeTxt);
    }
    //开始
    start(loop?:Function,thisObj = null){
        this.timer = new egret.Timer(1000);
        this.loop = loop;
        this.callBackContext = thisObj;
        this.timer.addEventListener(egret.TimerEvent.TIMER,this.timerTick,this);
        this.timer.start();
    }
    //restart
    restart(time:number = 0,loop?:Function,thisObj = null){
        this._leftTime = time;
        this.timeTxt.text = `剩余时间  ${CommonUtil.getMSTimeBySeconds(this._leftTime)}`;
        this.timer = new egret.Timer(1000);
        this.loop = loop;
        this.callBackContext = thisObj;
        this.timer.addEventListener(egret.TimerEvent.TIMER,this.timerTick,this);
        this.timer.start();
    }

    get leftTime(){
        return this._leftTime;
    }

    private timerTick(){
        this._leftTime --;
        this.timeTxt.text = `剩余时间  ${CommonUtil.getMSTimeBySeconds(this._leftTime)}`;
        if(this.loop){
            this.loop.call(this.callBackContext,this._leftTime);
            return;
        }

        if(this._leftTime <= 0){
            if(!this.loop){
                EffectUtil.showResultEffect();
            }
            this.stop();
        }
    }

    public stop(){
        if(this.timer){
            this.timer.stop();
            this.timer.removeEventListener(egret.TimerEvent.TIMER,this.timerTick,this);
            this.timer = null;
        }
        this._leftTime = 0;
        this.loop = null;
        this.callBackContext = null;
    }

}