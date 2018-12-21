//九宫格解锁
class Scene_026 extends BaseScene{
    constructor(){
        super();
        this.init();
    }

    private lineShape:egret.Shape;
    private pointsArr = [];
    private passedArr = [];
    private isCanOperate = true;
    private init(){
        let bg = SpriteUtil.createRect(SpriteUtil.stageWidth,SpriteUtil.stageHeight,0xffffff);
        bg.alpha = 0.01;
        bg.anchorOffsetX = 0;
        bg.anchorOffsetY = 0;
        bg.touchEnabled = true;
        this.addChild(bg);
        this.createJoyHouse();
        this.lineShape = new egret.Shape();
        this.addChild(this.lineShape);

        let text = SpriteUtil.createText(this.dataVo.extData,36,0xF8F8FF);
        text.x = SpriteUtil.stageCenterX;
        text.y = 160;
        this.addChild(text);

        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);

        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.touchHandler,this);
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.touchHandler,this);
        this.addEventListener(egret.TouchEvent.TOUCH_END,this.touchHandler,this);
    }

    private createJoyHouse(){
        let sprite = new egret.Sprite();
        let len = this.dataVo.sData;
        let cols = Math.floor(Math.sqrt(len));
        for(let i = 0;i < len;i++){
            let spr = new egret.Sprite();
            spr.graphics.beginFill(0x000000,0.01);
            spr.graphics.lineStyle(5,0x000000);
            spr.graphics.drawCircle(0,0,60);
            spr.graphics.endFill();
            spr.graphics.beginFill(0xfff000);
            spr.graphics.drawCircle(0,0,10);
            spr.graphics.endFill();
            sprite.addChild(spr);
            spr.x = spr.width/2 + i%cols*(60*2 + 40);
            spr.y = spr.width/2 + Math.floor(i/cols)*(60*2+40);
            spr.touchEnabled = true;
            spr.name = 'house_' + i;
        }
        this.addChild(sprite);
        sprite.anchorOffsetX = sprite.width/2;
        sprite.anchorOffsetY = sprite.height/2;
        sprite.x = SpriteUtil.stageCenterX;
        sprite.y = SpriteUtil.stageCenterY;
    }

    private checkResult(){
        let len1 = this.dataVo.tData.length;
        let len2 = this.pointsArr.length;
        if(len1 != len2) return false;
        for(let i = 0;i < len1;i++){
            if(this.dataVo.tData[i] != this.passedArr[i]) return false;
        }
        return true;
    }

    private touchHandler(evt){
        if(!this.isCanOperate || this.timeItem.leftTime <= 0) return;
        let target = evt.target;
        let name = target.name;
        let type = evt.type;
        let px = evt["stageX"];
        let py = evt["stageY"];
        if(type == egret.TouchEvent.TOUCH_BEGIN){
            if(name.search("house") < 0) return;
            this.passedArr.push(name.split("_")[1]);
            this.pointsArr.push(target.parent.localToGlobal(target.x,target.y));
        }
        else if(type == egret.TouchEvent.TOUCH_MOVE){
            if(this.passedArr.length == 0) return;
            this.handleMove({x:px,y:py});
            if(name.search("house") >= 0 && this.passedArr.indexOf(name.split("_")[1]) < 0){
                this.pointsArr.push(target.parent.localToGlobal(target.x,target.y));
                this.passedArr.push(name.split("_")[1]);
            }
        }
        else if(type == egret.TouchEvent.TOUCH_END){
            this.handleMove(null);
        }
    }

    private handleMove(point){
        let len = this.pointsArr.length;
        if(len <= 0) return;
        if(point == null){
            if(this.checkResult()){
                this.drawPath(null,0xFFA500);
                this.isCanOperate = false;
                let time = this.timeItem.leftTime;
                this.timeItem.stop();
                if(time >= this.dataVo.time*2/3){
                    EffectUtil.showResultEffect(EffectUtil.PERFECT);
                }
                else if(time >= this.dataVo.time/3){
                    EffectUtil.showResultEffect(EffectUtil.GREAT);
                }
                else{
                    EffectUtil.showResultEffect(EffectUtil.GOOD);
                }
            }
            else{
                this.isCanOperate = false;
                this.drawPath(null,0xff0000);
                egret.Tween.get(this.lineShape).to({alpha:0.5},300).to({alpha:1},300).to({alpha:0.5},300).call(()=>{
                    egret.Tween.removeTweens(this.lineShape);
                    this.lineShape.graphics.clear();
                    this.lineShape.alpha = 1;
                    this.pointsArr = [];
                    this.passedArr = [];
                    this.isCanOperate = true;
                },this);
            }
        }
        else{
            this.drawPath(point,0xffff00);
        }
    }

    private drawPath(point,color){
        let len = this.pointsArr.length;
        let pt = this.pointsArr[0];
        this.lineShape.graphics.clear();
        this.lineShape.graphics.lineStyle(36,color,0.8);
        this.lineShape.graphics.beginFill(color,0.01);
        this.lineShape.graphics.moveTo(pt.x,pt.y);
        for(let i = 1;i < len;i++){
            this.lineShape.graphics.lineTo(this.pointsArr[i].x,this.pointsArr[i].y);
        }
        if(point){
            this.lineShape.graphics.lineTo(point.x,point.y);
        }
        this.lineShape.graphics.endFill();
    }

    enter(){
        super.enter();
        this.timeItem.start();
    }

}