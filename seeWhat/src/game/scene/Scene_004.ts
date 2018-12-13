//考验观察力
class Scene_004 extends BaseScene{
    constructor(){
        super();
        this.init();
    }
    private giftBoxArr;
    private giftDisplay;
    private giftGroup:egret.Sprite;
    private startPoint:egret.Point;
    private rotatePoint:egret.Point;
    private rotateAngle = 0;
    //目标箱子索引
    private targetIndex = 0;
    //交换间隔时间
    private intervalTime = 0;
    //交换次数
    private exchangeTimes:number = 0;
    //最大交换次数
    private maxTimes:number = 0;
    private isGameStart:boolean = false;
    private init(){
        this.giftBoxArr = [];
        this.giftGroup = new egret.Sprite();
        this.addChild(this.giftGroup);
        let box = this.dataVo.sData[0];
        let num = this.dataVo.sData[1];
        let cols = Math.sqrt(num);
        let wid = (SpriteUtil.stageWidth - 100)/cols;
        for(let i = 0;i < num;i++){
            let bag = SpriteUtil.createImage(box);
            let scale = wid/bag.width;
            bag.scaleX = scale;
            bag.scaleY = scale;
            bag.x = wid/2 + (i%cols)*(wid + 10);
            bag.y = wid/2 + (wid + 10)*Math.floor(i/cols);
            bag.name = `giftBag_${i}`;
            this.giftGroup.addChild(bag);
            bag.touchEnabled = true;
            bag.addEventListener(egret.TouchEvent.TOUCH_TAP,this.giftTap,this);
            this.giftBoxArr.push(bag);
        }

        this.giftGroup.x = SpriteUtil.stageCenterX - this.giftGroup.width/2;
        this.giftGroup.y = SpriteUtil.stageCenterY - this.giftGroup.height/2 - 200;

        this.rotatePoint = new egret.Point(SpriteUtil.stageCenterX,SpriteUtil.stageCenterY - 200);
        this.startPoint = new egret.Point(SpriteUtil.stageCenterX,100);

        this.giftDisplay = SpriteUtil.createImage(this.dataVo.tData);
        this.giftDisplay.scaleX = wid/this.giftDisplay.width/1.5;
        this.giftDisplay.scaleY = wid/this.giftDisplay.width/1.5;
        this.giftDisplay.x = SpriteUtil.stageCenterX;
        this.giftDisplay.y = 50;
        this.addChild(this.giftDisplay);

        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
        //确定交换时间 写死
        if(num == 9){
            this.intervalTime = 300;
            this.maxTimes = 25;
        }
        else if(num == 16){
            this.intervalTime = 200;
            this.maxTimes = 30;
        }
        else {
            this.intervalTime = 180;
            this.maxTimes = 60;
        }

        this.playDrop();
    }
    //放礼物
    private playDrop(){
        egret.Tween.get(this.giftDisplay).to({x:this.giftDisplay.x,y:this.startPoint.y},500).call(()=>{
            egret.startTick(this.loop,this);
        }).wait(500);
    }

    private loop(timeStamp:number){
        this.rotateAngle += 0.1;
        let xx = this.startPoint.x - this.rotatePoint.x;
        let yy = this.startPoint.y - this.rotatePoint.y;
        this.giftDisplay.x = xx*Math.cos(this.rotateAngle) - yy*Math.sin(this.rotateAngle) + this.rotatePoint.x;
        this.giftDisplay.y = yy*Math.cos(this.rotateAngle) - xx*Math.sin(this.rotateAngle) + this.rotatePoint.y;
        if(this.rotateAngle > 2*Math.PI + 2*Math.PI*Math.random()){
            egret.stopTick(this.loop,this);
            let point = this.giftGroup.localToGlobal(this.giftBoxArr[this.targetIndex].x,this.giftBoxArr[this.targetIndex].y);
            egret.Tween.get(this.giftDisplay).to({x:point.x,y:point.y},500,egret.Ease.cubicIn).to({alpha:0},1000).call(()=>{
                egret.Tween.removeTweens(this.giftDisplay);
                this.giftDisplay.visible = false;
                this.randomBox(true);
            });
        }
        return false;
    }
    //随机移动箱子
    private randomBox(isbool:boolean = false){
        let index1 = Math.random() < 0.2 || isbool ? this.targetIndex : Math.floor(this.giftBoxArr.length*Math.random());
        let index2 = Math.floor(this.giftBoxArr.length*Math.random());

        if(index1 == index2){
            this.randomBox();
            return;
        }
        this.exchangeTimes++;
        if(this.exchangeTimes >= this.maxTimes){
            this.isGameStart = true;
            this.timeItem.start();
            return;
        }
        let box1 = this.giftBoxArr[index1];
        let box2 = this.giftBoxArr[index2];
        let point1 = new egret.Point(box1.x,box1.y);
        let point2 = new egret.Point(box2.x,box2.y);
        egret.Tween.get(box1).to({x:point2.x,y:point2.y},this.intervalTime);
        egret.Tween.get(box2).to({x:point1.x,y:point1.y},this.intervalTime).call(()=>{
            let sid = egret.setTimeout(()=>{
                egret.clearTimeout(sid);
                this.randomBox();
            },this,50);
        });
        
    }

    private giftTap(evt){
        if(!this.isGameStart) return;
        GameSound.instance().playSound('click');
        let name:string = evt.target.name;
        if(name.search('giftBag') < 0) return;
        this.isGameStart = false;
        let index = evt.target.name.split('_')[1];
        let point = this.giftGroup.localToGlobal(this.giftBoxArr[this.targetIndex].x,this.giftBoxArr[this.targetIndex].y);
        this.giftDisplay.x = point.x;
        this.giftDisplay.y = point.y;
        this.giftDisplay.alpha = 0;
        this.giftDisplay.visible = true;
        if(index == this.targetIndex){
            let leftTime = this.timeItem.leftTime;
            this.timeItem.stop();
            egret.Tween.get(this.giftDisplay).to({alpha:1},300).call(()=>{
                egret.Tween.removeTweens(this.giftDisplay);
                if(leftTime >= 10){
                    EffectUtil.showResultEffect(EffectUtil.PERFECT);
                }
                else if(leftTime >= 5){
                    EffectUtil.showResultEffect(EffectUtil.GREAT);
                }
                else{
                    EffectUtil.showResultEffect(EffectUtil.GOOD);
                }
            });
        }
        else{
            this.timeItem.stop();
            egret.Tween.get(this.giftDisplay).to({alpha:1},300).call(()=>{
                egret.Tween.removeTweens(this.giftDisplay);
                EffectUtil.showResultEffect();
            });
        }
    }

    enter(){
        super.enter();
        this.targetIndex = Math.floor(this.giftBoxArr.length*Math.random());
        // console.log('targetIndex:'+this.targetIndex);
        this.playDrop();
    }

    exit(){
        egret.Tween.removeAllTweens();
        super.exit();
    }

}