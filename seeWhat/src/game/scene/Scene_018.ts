//飞刀射木板
class Scene_018 extends BaseScene{
    constructor(){
        super();
        this.init();
    }

     //转盘
    private dartSprite;
    //源飞刀数组
    private knifeArr = [];
    //当前飞刀
    private curKnife;
    private leftKnifesTxt:egret.TextField;
    //已经插上去的飞刀数组
    private hadKnifesArr = [];
    private startPoint:egret.Point;
    private rotatePoint:egret.Point;
    private rotateAngle = 0.6;
    private currCount = 0;

    private init(){
        //创建刀列  tdata 旋转速度  sdata 数量
        this.rotateAngle = this.dataVo.tData;
        this.currCount = this.dataVo.sData;
        let len = this.dataVo.sData;
        for(let i = 0;i < len;i++){
            let sprite = this.createKnifes();
            this.knifeArr.push({sprite:sprite,angle:0});
        }
        //木头
        this.rotatePoint = new egret.Point(SpriteUtil.stageCenterX,400);
        this.startPoint = new egret.Point(SpriteUtil.stageCenterX,640);
        let image = SpriteUtil.createImage('earth');
        image.x = this.rotatePoint.x;
        image.y = this.rotatePoint.y;
        image.scaleX = 450/80;
        image.scaleY = 450/80;
        this.addChild(image);
        this.dartSprite = image;
        //
        this.createLeftTxt();
        this.showNext();

        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);

        egret.startTick(this.loop,this);
    }

    private loop(timestamp:number = 0){
        this.dartSprite.rotation += this.rotateAngle;
        for(let knife of this.hadKnifesArr){
            knife.sprite.rotation += this.rotateAngle;
            let angle = knife.sprite.rotation*Math.PI/180;
            let xx = this.startPoint.x - this.rotatePoint.x;
            let yy = this.startPoint.y - this.rotatePoint.y;
            let nx = xx*Math.cos(angle) - yy*Math.sin(angle) + this.rotatePoint.x;
            let ny = yy*Math.cos(angle) - xx*Math.sin(angle) + this.rotatePoint.y;
            knife.sprite.x = nx;
            knife.sprite.y = ny;
        }
        return true;
    }

    private fireKnife(evt){
        GameSound.instance().playSound('click');
        this.curKnife.sprite.touchEnabled = false;
        egret.Tween.get(this.curKnife.sprite).to({y:this.startPoint.y},200,egret.Ease.cubicIn).call(()=>{
            egret.Tween.removeTweens(this.curKnife.sprite);
            let rotation = this.dartSprite.rotation%360;
            for(let knife of this.hadKnifesArr){
                //如果度数差小于12 就说明插不进去
                if(Math.abs(knife.angle - rotation) <= 12){
                    egret.Tween.get(this.curKnife.sprite).to({y:SpriteUtil.stageHeight,rotation:360*(2*Math.random()+2)},3000).call(()=>{
                        egret.Tween.removeTweens(this.curKnife);
                        this.leftKnifesTxt.text = "";
                        this.timeItem.stop();
                        EffectUtil.showResultEffect();
                    });
                    return;
                }
            }
            this.curKnife.angle = rotation;
            this.hadKnifesArr.push(this.curKnife);
            this.showNext();
        },this);
    }

    private showNext(){
        GameSound.instance().playSound('click');
        if(this.currCount <= 0){
            this.leftKnifesTxt.text = "";
            let leftTime = this.timeItem.leftTime;
            this.timeItem.stop();
            if(leftTime >= 2*this.dataVo.time/3){
                EffectUtil.showResultEffect(EffectUtil.PERFECT);
            }
            else if(leftTime >= this.dataVo.time/3){
                EffectUtil.showResultEffect(EffectUtil.GREAT);
            }
            else{
                EffectUtil.showResultEffect(EffectUtil.GOOD);
            }
        }
        else{
            this.curKnife = this.knifeArr.pop();
            this.addChildAt(this.curKnife.sprite,0);
            this.leftKnifesTxt.text = `x${this.currCount}`;
            this.currCount--;
        }
    }

    private createLeftTxt(){
        this.leftKnifesTxt = new egret.TextField();
        this.leftKnifesTxt.size = 48;
        this.leftKnifesTxt.bold = true;
        this.leftKnifesTxt.textColor = 0x0000ff;
        this.leftKnifesTxt.x = SpriteUtil.stageCenterX + 50;
        this.leftKnifesTxt.y = SpriteUtil.stageCenterY + 300;
        this.addChild(this.leftKnifesTxt);
    }
    //创建刀
    private createKnifes(){
        let kspr = SpriteUtil.createImage('tree');
        kspr.x = SpriteUtil.stageCenterX;
        kspr.y = SpriteUtil.stageCenterY + 330;
        kspr.scaleX = 0.8;
        kspr.scaleY = -1;
        kspr.touchEnabled = true;
        kspr.addEventListener(egret.TouchEvent.TOUCH_TAP,this.fireKnife,this);
        return kspr;
    }

    enter(){
        super.enter();
        this.timeItem.start();
    }

    exit(){
        super.exit();
        this.timeItem.stop();
        egret.stopTick(this.loop,this);
    }

}