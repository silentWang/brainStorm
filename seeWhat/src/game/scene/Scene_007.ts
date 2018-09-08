//打小白鼠
class Scene_007 extends BaseScene{
    constructor(){
        super();
        this.init();
    }

    private pools:Array<egret.TextField>;
    private pointsArr:Array<egret.Point>;
    private needNums:number = 0;
    private score = 0;
    private isOperating:boolean = false;
    private init(){
        //时间和分数
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
        this.scoreItem = new ScoreItem();
        this.scoreItem.x = 50;
        this.scoreItem.setSTScore(this.score,this.dataVo.score);
        this.addChild(this.scoreItem);
        this.timeItem.x = SpriteUtil.stageWidth - 300;
        this.needNums  = 1;
        this.pointsArr = [];
        for(let i = 0;i < 50;i++){
            let point = new egret.Point();
            point.x = 104+104*(i%5);
            point.y = 108 + 108*Math.floor(i/5);
            this.pointsArr.push(point);
        }
    }

    private loop(time){
        if(time <= 0){
            this.timeItem.stop();
            return;
        }
        if(time <= 8){
            this.needNums = 15;
        }
        else if(time <= 10){
            this.needNums = 12;
        }
        else if(time <= 20){
            this.needNums = 8;
        }
        else if(time <= 25){
            this.needNums = 4;
        }
        else if(time <= 30){
            this.needNums = 1;
        }
    }

    private showSprites(nums){
        let num = 0;
        let arr = this.getRandomPoints(nums);
        let idx = egret.setInterval(()=>{
            let index = 0;
            if(num > 0){
                index = Math.floor(this.dataVo.sData.length * Math.random());
            }
            let spr = this.getPools(index);
            spr.x = this.pointsArr[arr[num]].x;
            spr.y = this.pointsArr[arr[num]].y;
            num++;
            if(num >= nums){
                egret.clearInterval(idx);
                let xid = egret.setTimeout(()=>{
                    egret.clearTimeout(xid);
                    for(let spr of this.pools){
                        spr.visible = false;
                        spr.scaleX = 1;
                        spr.scaleY = 1;
                        spr.text = '';
                    }
                    this.showSprites(this.needNums);
                },this,1000);
            }
        },this,200);
    }
    //这个随机不同的逻辑写的不太好
    private getRandomPoints(nums:number){
        let arr = [];
        while(arr.length < nums){
            let index = Math.floor(50*Math.random());
            if(arr.indexOf(index) < 0){
                arr.push(index);
            }
        }
        return arr;
    }

    private getPools(index:number = 0){
        let char = this.dataVo.sData[index];
        let spr:egret.TextField;
        if(!this.pools){
            this.pools = [];
        }
        else{
            for(let item of this.pools){
                if(!item.visible && item.text == ''){
                    spr = item;
                    break;
                }
            }
        }
        if(!spr){
            spr = SpriteUtil.createText(char,100);
            this.pools.push(spr);
            spr.addEventListener(egret.TouchEvent.TOUCH_TAP,(evt)=>{
                if(this.isOperating) return;
                let spr = evt.target;
                if(spr.name == '🐁'){
                    spr.visible = false;
                    spr.scaleX = 1;
                    spr.scaleY = 1;
                    spr.text = '';
                    this.score++;
                    this.scoreItem.setSTScore(this.score);
                    if(this.scoreItem.isCanPass()){
                        if(this.timeItem.leftTime >= 10){
                            EffectUtil.showResultEffect(EffectUtil.PERFECT);
                        }
                        else if(this.timeItem.leftTime >= 5){
                            EffectUtil.showResultEffect(EffectUtil.EXCELLENT);
                        }
                        else{
                            EffectUtil.showResultEffect(EffectUtil.GOOD);
                        }
                        this.timeItem.stop();
                    }
                }
                else{
                    this.timeItem.stop();
                    this.isOperating = true;
                    EffectUtil.showResultEffect();
                }
            },this);
        }
        else{
            spr.text = char;
            spr.visible = true;
        }
        spr.touchEnabled = true;
        spr.name = char;
        this.addChild(spr);
        return spr;
    }

    enter(){
        super.enter();
        this.timeItem.start(this.loop,this);
        this.showSprites(this.needNums);
    }

    exit(){
        super.exit();
        this.timeItem.stop();
    }

}