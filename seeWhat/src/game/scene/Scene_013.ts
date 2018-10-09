//石头剪刀布
class Scene_013 extends BaseScene{
    constructor(){
        super();
        this.init();
    }

    private nameArr = ["阿诺","爱因斯坦","牛顿","作者","憨豆","贝克汉姆","范冰冰","成龙","吴京"];
    private nameTxt:egret.TextField;
    private enemySpr;
    private currWinIndex = 0;
    private isOperating:boolean = false;
    private score = 0;
    private init(){
        let len = this.dataVo.sData.length;
        let wid = (SpriteUtil.stageWidth - 100)/len;
        for(let i = 0;i < len;i++){
            let btn = SpriteUtil.createImage(this.dataVo.sData[i],true);
            let scale = wid/btn.width;
            btn.x = 30 + i*(wid+10) + scale*64/2;
            btn.y = SpriteUtil.stageCenterY + 100;
            btn.scaleX = scale;
            btn.scaleY = scale;
            this.addChild(btn);
            btn.name = 'index_'+i;
            btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.playDoing,this);
        }

        this.enemySpr = SpriteUtil.createImage(this.dataVo.sData[0]);
        this.enemySpr.scaleX = 4;
        this.enemySpr.scaleY = 4;
        this.enemySpr.x = SpriteUtil.stageCenterX;
        this.enemySpr.y = SpriteUtil.stageCenterY - 200;
        this.addChild(this.enemySpr);
        //
        this.nameTxt = SpriteUtil.createText("",48);
        this.addChild(this.nameTxt);
        this.nameTxt.y = this.enemySpr.y - 250;
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
        let index = Math.floor(len * Math.random());
        let str = this.nameArr[Math.floor(this.nameArr.length * Math.random())];
        this.nameTxt.text = str;
        this.nameTxt.x = SpriteUtil.stageCenterX - this.nameTxt.width;
        this.enemySpr.texture = RES.getRes(`${this.dataVo.sData[index]}_png`);
        this.currWinIndex = index > 0 ? (index - 1)%len : len - 1;
    }

    private playDoing(evt){
        if(this.isOperating) return;
        GameSound.instance().playSound('click');
        let name = evt.target.name;
        let index = name.split('_')[1];
        if(index == this.currWinIndex){
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