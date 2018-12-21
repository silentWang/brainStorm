//石头剪刀布
class Scene_013 extends BaseScene{
    constructor(){
        super();
        this.init();
    }

    private leftSpr;
    private rightSpr;
    private leftIndex = 0;
    private rightIndex = 0;
    private xScale = 3.2;
    private isOperating:boolean = false;
    private score = 0;
    private init(){
        //sdata 规则物品  tdata 相应规则
        let arr = ["赢","和","赢"];
        let len = arr.length;
        let wid = (SpriteUtil.stageWidth - 100)/len;
        let sprite = new egret.Sprite;
        for(let i = 0;i < len;i++){
            let btn = SpriteUtil.createText(arr[i],100,0xff0000,true);
            let scale = wid/btn.width;
            btn.x = i*(wid+10) + scale*btn.width/2;
            btn.scaleX = scale;
            btn.scaleY = scale;
            this.addChild(btn);
            btn.name = 'index_'+i;
            btn.touchEnabled = true;
            btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.playDoing,this);
            sprite.addChild(btn);
        }
        this.addChild(sprite);
        sprite.anchorOffsetX = sprite.width/2;
        sprite.anchorOffsetY = sprite.height/2;
        sprite.x = SpriteUtil.stageCenterX;
        sprite.y = SpriteUtil.stageCenterY + 280;

        this.leftSpr = SpriteUtil.createImage(this.dataVo.sData[0]);
        this.leftSpr.scaleY = this.xScale;
        this.leftSpr.x = SpriteUtil.stageCenterX - 160;
        this.leftSpr.y = SpriteUtil.stageCenterY - 160;
        this.addChild(this.leftSpr);
        this.rightSpr = SpriteUtil.createImage(this.dataVo.sData[0]);
        this.rightSpr.scaleY = this.xScale;
        this.rightSpr.x = SpriteUtil.stageCenterX + 160;
        this.rightSpr.y = SpriteUtil.stageCenterY - 160;
        this.addChild(this.rightSpr);
        //
        this.enemyDoing();

        if(this.dataVo.time > 0){
            this.timeItem = new TimeItem(this.dataVo.time);
            this.addChild(this.timeItem);
        }
        if(this.dataVo.score > 0){
            this.scoreItem = new ScoreItem();
            this.scoreItem.setSTScore(0,this.dataVo.score);
            this.scoreItem.x = 50;
            this.addChild(this.scoreItem);
            this.timeItem.x = SpriteUtil.stageWidth - 300;
        }

    }

    private enemyDoing(){
        let len = this.dataVo.sData.length;
        this.leftIndex = Math.floor(len * Math.random());
        this.leftSpr.texture = RES.getRes(`images_json#${this.dataVo.sData[this.leftIndex]}`);
        this.rightIndex = Math.floor(len * Math.random());
        this.rightSpr.texture = RES.getRes(`images_json#${this.dataVo.sData[this.rightIndex]}`);
        if(this.dataVo.level <= 2){
            if(this.leftIndex == 2){
                this.leftSpr.scaleX = this.xScale;
            }
            else{
                this.leftSpr.scaleX = -this.xScale;
            }
            if(this.rightIndex == 2){
                this.rightSpr.scaleX = -this.xScale;
            }
            else{
                this.rightSpr.scaleX = this.xScale;
            }
            
        }
        else if(this.dataVo.level <= 4){
            if(this.leftIndex == 2){
                this.leftSpr.scaleX = -this.xScale;
            }
            else{
                this.leftSpr.scaleX = this.xScale;
            }
            if(this.rightIndex == 1 || this.rightIndex == 3){
                this.rightSpr.scaleX = -this.xScale;
            }
            else{
                this.rightSpr.scaleX = this.xScale;
            }

        }
        else{
            this.leftSpr.scaleX = this.xScale;
            this.rightSpr.scaleX = this.xScale;
        }
    }

    private playDoing(evt){
        if(this.isOperating) return;
        GameSound.instance().playSound('click');
        let name = evt.target.name;
        let index = name.split('_')[1];
        if(index == this.getResult()){
            this.enemyDoing();
            this.score++;
            this.scoreItem.setSTScore(this.score);
        }
        else{
            this.timeItem.stop();
            this.isOperating = true;
            EffectUtil.showResultEffect();
        }
    }
    
    private getResult(){
        let len = this.dataVo.sData.length;
        let index = 0;
        if(this.dataVo.level == 5){
            let temp = this.leftIndex - this.rightIndex;
            if(temp == 2 || temp == -3){
                index = 2;
            }
            else if(temp == -1 || temp == 3){
                index == 0;
            }
            else{
                index = 1;
            }
            return index;
        }
        if(this.leftIndex == len - 1){
            if(this.rightIndex == this.leftIndex - 1){
                index = 2;
            }
            else if(this.rightIndex == 0){
                index = 0;
            }
            else{
                index = 1;
            }
        }
        else if(this.rightIndex == len - 1){
            if(this.leftIndex == this.rightIndex - 1){
                index = 0;
            }
            else if(this.leftIndex == 0){
                index = 2;
            }
            else{
                index = 1;
            }
        }
        else if(this.leftIndex - this.rightIndex == 1){
            index = 2;
        }
        else if(this.leftIndex - this.rightIndex == -1){
            index = 0;
        }
        else{
            index = 1;
        }
        return index;
    }

    enter(){
        super.enter();
        this.timeItem.start(this.resultBack,this);
    }

    private resultBack(time){
        if(time <= 0){
            this.isOperating = true;
            this.timeItem.stop();
            if(this.score >= this.dataVo.score + 10){
                EffectUtil.showResultEffect(EffectUtil.PERFECT);
            }
            else if(this.score >= this.dataVo.score + 5){
                EffectUtil.showResultEffect(EffectUtil.GREAT);
            }
            else if(this.score >= this.dataVo.score){
                EffectUtil.showResultEffect(EffectUtil.GOOD);
            }
            else{
                EffectUtil.showResultEffect();
            }
        }
    }


}