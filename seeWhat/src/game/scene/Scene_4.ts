//考验观察力
class Scene_4 extends BaseScene{
    constructor(){
        super();
        this.init();
    }

    private giftBoxArr:Array<egret.TextField>;
    private giftDisplay:egret.TextField;
    private giftGroup:egret.Sprite;
    private startPoint:egret.Point;
    private rotatePoint:egret.Point;
    private rotateAngle = 0;
    //目标箱子索引
    private targetIndex = 0;
    //交换次数
    private exchangeTimes:number = 0;
    private isGameStart:boolean = false;
    private init(){
        this.dataVo.time = 15;

        this.giftBoxArr = [];
        this.giftGroup = new egret.Sprite();
        this.giftGroup.x = 200;
        this.giftGroup.y = 300;
        this.addChild(this.giftGroup);
        for(let i = 0;i < 16;i++){
            let bag = SpriteUtil.createText('🎁',100);
            bag.x = (i%4)*110;
            bag.y = 110*Math.floor(i/4);
            bag.name = `giftBag_${i}`;
            this.giftGroup.addChild(bag);
            bag.touchEnabled = true;
            bag.addEventListener(egret.TouchEvent.TOUCH_TAP,this.giftTap,this);
            this.giftBoxArr.push(bag);
        }
        this.rotatePoint = new egret.Point(SpriteUtil.stageCenterX,450);
        this.startPoint = new egret.Point(SpriteUtil.stageCenterX,150);


        this.giftDisplay = SpriteUtil.createText('🌹',60);
        this.giftDisplay.x = SpriteUtil.stageCenterX;
        this.giftDisplay.y = 50;
        this.addChild(this.giftDisplay);

        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);

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
                this.randomBox();
            });
        }
        return false;
    }
    //随机移动箱子
    private randomBox(){
        let index1 = Math.floor(this.giftBoxArr.length*Math.random());
        let index2 = Math.floor(this.giftBoxArr.length*Math.random());

        console.log(`${index1},${index2}`);
        if(index1 == index2){
            this.randomBox();
            return;
        }
        this.exchangeTimes++;
        if(this.exchangeTimes >= 50){
            this.isGameStart = true;
            this.timeItem.start();
            return;
        }
        let box1 = this.giftBoxArr[index1];
        let box2 = this.giftBoxArr[index2];
        let point1 = new egret.Point(box1.x,box1.y);
        let point2 = new egret.Point(box2.x,box2.y);
        egret.Tween.get(box1).to({x:point2.x,y:point2.y},120);
        egret.Tween.get(box2).to({x:point1.x,y:point1.y},120).call(()=>{
            let sid = egret.setTimeout(()=>{
                egret.clearTimeout(sid);
                this.randomBox();
            },this,50);
        });
        
    }

    private giftTap(evt){
        if(!this.isGameStart) return;
        let name:string = evt.target.name;
        if(name.search('giftBag') < 0) return;
        let index = evt.target.name.split('_')[1];
        this.timeItem.stop();
        if(index == this.targetIndex){
            EventCenter.instance().dispatchEvent(new GameEvent(GameEvent.GOTO_NEXT));
        }
        else{
            Game.instance().gameScene.gotoOver();
        }
    }

    enter(){
        super.enter();
        this.targetIndex = Math.floor(this.giftBoxArr.length*Math.random());
        console.log('targetIndex:'+this.targetIndex);
        this.playDrop();
    }

    exit(){
        egret.Tween.removeAllTweens();
        super.exit();
    }

}