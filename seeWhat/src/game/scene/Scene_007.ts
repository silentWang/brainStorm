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
        for(let i = 0;i < 40;i++){
            let point = new egret.Point();
            point.x = 90 + 140*(i%5);
            point.y = 120 + 120*Math.floor(i/5);
            this.pointsArr.push(point);
        }
    }

    private loop(time){
        if(time <= 0){
            this.isOperating = true;
            this.timeItem.stop();
            if(this.scoreItem.isCanPass()){
                let score = this.score - this.dataVo.score;
                if(score >= 10){
                    EffectUtil.showResultEffect(EffectUtil.PERFECT);
                }
                else if(score >= 5){
                    EffectUtil.showResultEffect(EffectUtil.GREAT);
                }
                else{
                    EffectUtil.showResultEffect(EffectUtil.GOOD);
                }
            }
            else{
                EffectUtil.showResultEffect();
            }
            return;
        }
        if(time <= 8){
            this.needNums = 30;
        }
        else if(time <= 10){
            this.needNums = 20;
        }
        else if(time <= 20){
            this.needNums = 15;
        }
        else if(time <= 25){
            this.needNums = 10;
        }
        else{
            this.needNums = 5;
        }
    }

    private showSprites(nums){
        let num = 0;
        let randnum = Math.floor(nums*Math.random());
        let arr = this.getRandomPoints(nums);
        let idx = egret.setInterval(()=>{
            if(this.isOperating){
                egret.clearInterval(idx);
                return;
            }
            let index = Math.floor(this.dataVo.sData.length * Math.random());
            if(num == randnum){
                index = 0;
            }
            let spr = this.getPools(index);
            spr.x = this.pointsArr[arr[num]].x;
            spr.y = this.pointsArr[arr[num]].y;
            num++;
            if(num >= nums){
                egret.clearInterval(idx);
                let xid = egret.setTimeout(()=>{
                    egret.clearTimeout(xid);
                    if(this.isOperating) return;
                    for(let spr of this.pools){
                        spr.visible = false;
                    }
                    this.showSprites(this.needNums);
                },this,1000);
            }
        },this,100);
    }
    //这个随机不同的逻辑写的不太好
    private getRandomPoints(nums:number){
        let arr = [];
        while(arr.length < nums){
            let index = Math.floor(40*Math.random());
            if(arr.indexOf(index) < 0){
                arr.push(index);
            }
        }
        return arr;
    }

    private getPools(index:number = 0){
        let char = this.dataVo.sData[index];
        let spr;
        if(!this.pools){
            this.pools = [];
        }
        else{
            for(let item of this.pools){
                if(!item.visible){
                    spr = item;
                    break;
                }
            }
        }
        if(!spr){
            spr = SpriteUtil.createImage(char);
            this.pools.push(spr);
            let scale = 100/spr.width;
            spr.scaleX = scale;
            spr.scaleY = scale;
            spr.addEventListener(egret.TouchEvent.TOUCH_TAP,(evt)=>{
                if(this.isOperating) return;
                GameSound.instance().playSound('click');
                let spr = evt.target;
                if(spr.name == this.dataVo.tData){
                    spr.visible = false;
                    this.score++;
                    this.scoreItem.setSTScore(this.score);
                }
                else{
                    this.timeItem.stop();
                    this.isOperating = true;
                    EffectUtil.showResultEffect();
                }
            },this);
        }
        else{
            spr.texture = RES.getRes(`${char}_png`);
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