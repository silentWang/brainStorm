//石头剪刀布
class Scene_013 extends BaseScene{
    constructor(){
        super();
        this.init();
    }

    private nameArr = ["阿诺","爱因斯坦","牛顿","作者","憨豆","贝克汉姆","范冰冰","成龙","吴京"];
    private nameTxt:egret.TextField;
    private enemySpr:egret.TextField;
    private currWinIndex = 0;
    private isOperating:boolean = false;
    private score = 0;
    private init(){
        let len = this.dataVo.sData.length;
        for(let i = 0;i < len;i++){
            let btn = SpriteUtil.createButton(this.dataVo.sData[i],160,160,0x000fff,100);
            btn.x = 60 + 220*i;
            btn.y = SpriteUtil.stageCenterY + 100;
            btn.scaleX = 1.2;
            btn.scaleY = 1.2;
            this.addChild(btn);
            btn.name = 'index_'+i;
            btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.playDoing,this);
        }

        this.enemySpr = SpriteUtil.createText(this.dataVo.sData[0],100);
        this.enemySpr.scaleX = 3;
        this.enemySpr.scaleY = 3;
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
        this.enemySpr.text = this.dataVo.sData[index];
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