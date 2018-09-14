//摸瞎 指星星的 
class Scene_008 extends BaseScene{
    constructor(){
        super();
        this.init();
    }

    private passArr:Array<any>;
    private animalsArr= CommonUtil.allAnimals.concat();
    private animalSpr:egret.TextField;
    private emojiSpr:egret.TextField;
    private needCount = 0;
    private isOperating:boolean = false;
    private init(){
        this.passArr = [];
        this.animalsArr.sort((a,b)=>{
            if(Math.random() > 0.5) return 1;
            if(Math.random() < 0.5) return -1;
            return 0;
        });

        this.animalSpr = SpriteUtil.createText(this.animalsArr[this.needCount],100);
        this.animalSpr.y = SpriteUtil.stageCenterY - 100;
        this.animalSpr.scaleX = 2;
        this.animalSpr.scaleY = 2;
        this.addChild(this.animalSpr);

        this.emojiSpr = SpriteUtil.createText('😭',100);
        this.emojiSpr.scaleX = 3;
        this.emojiSpr.scaleY = 3;
        this.emojiSpr.visible = false;
        this.addChild(this.emojiSpr);
        EffectUtil.breath(this.emojiSpr);
        this.playShow();
    }

    //播放前动画
    private playShow(){
        let animal = this.animalsArr[this.needCount];
        let emoji = this.dataVo.sData[Math.floor(this.dataVo.sData.length * Math.random())];
        this.passArr.push({animal:animal,emoji:emoji});
        this.animalSpr.text = animal;
        let pos = this.getRandomPos();
        this.animalSpr.x = pos[0];
        this.animalSpr.y = pos[1];
        this.animalSpr.visible = true;
        egret.Tween.get(this.animalSpr).to({x:SpriteUtil.stageCenterX,y:SpriteUtil.stageCenterY},500).call(()=>{
            let idx = egret.setTimeout(()=>{
                egret.clearTimeout(idx);
                egret.Tween.removeTweens(this.animalSpr);
                
                this.emojiSpr.x = this.animalSpr.x;
                this.emojiSpr.y = this.animalSpr.y;
                this.emojiSpr.text = emoji;
                this.emojiSpr.visible = true;

                let xid = egret.setTimeout(()=>{
                    egret.clearTimeout(xid);
                    this.emojiSpr.visible = false;
                    this.animalSpr.visible = false;
                    this.needCount++;
                    if(this.needCount >= this.dataVo.tData){
                        this.startLook();
                        return;
                    }
                    this.playShow();
                },this,1500);
            },this,1000);
        });
    }
    //random  position
    private getRandomPos(){
        let arr = [
            [0,0],
            [SpriteUtil.stageCenterX,0],
            [SpriteUtil.stageWidth,0],
            [0,SpriteUtil.stageCenterY],
            [SpriteUtil.stageWidth,SpriteUtil.stageCenterY],
            [0,SpriteUtil.stageHeight],
            [SpriteUtil.stageCenterX,SpriteUtil.stageHeight],
            [SpriteUtil.stageWidth,SpriteUtil.stageHeight]
        ];
        let index = Math.floor(arr.length * Math.random());
        return arr[index];
    }

    private startLook(){
        egret.Tween.removeAllTweens();
        this.removeChild(this.animalSpr);
        this.removeChild(this.emojiSpr);

        this.dataVo.tData = this.passArr[Math.floor(this.passArr.length * Math.random())].emoji;
        console.log(this.passArr);

        let askstr = `谜题:找出所有发出表情${this.dataVo.tData}的动物`
        let text = SpriteUtil.createText(askstr,36,0x0000FF);
        text.x = SpriteUtil.stageCenterX;
        text.y = 150;
        this.addChild(text);

        for(let i = 0;i < this.animalsArr.length;i++){
            let spr = SpriteUtil.createText(this.animalsArr[i],100);
            spr.x = 100 + (i%5)*125;
            spr.y = 250 + 125*Math.floor(i/5);
            spr.touchEnabled = true;
            spr.addEventListener(egret.TouchEvent.TOUCH_TAP,this.selectClk,this);
            this.addChild(spr);
        }

        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
        this.timeItem.start();
    }

    private selectClk(evt){
        if(this.isOperating) return;
        GameSound.instance().playSound('click');
        let text = evt.target;
        let isFind = false;
        let len = this.passArr.length;
        for(let i = len - 1;i >= 0;i--){
            let obj = this.passArr[i];
            if(obj.emoji == this.dataVo.tData && obj.animal == text.text){
                text.alpha = 0.5;
                text.touchEnabled = false;
                isFind = true;
                this.passArr.splice(i,1);
            }
        }
        if(!isFind){
            this.isOperating = true;
            EffectUtil.showResultEffect();
        }
        else{
            if(this.isCanPass()){
                if(this.timeItem.leftTime >= 25){
                    EffectUtil.showResultEffect(EffectUtil.PERFECT);
                }
                else if(this.timeItem.leftTime >= 15){
                    EffectUtil.showResultEffect(EffectUtil.GREAT);
                }
                else{
                    EffectUtil.showResultEffect(EffectUtil.GOOD);
                }
                this.timeItem.stop();
            }
        }
    }
    //是否已经找完了
    private isCanPass(){
        for(let obj of this.passArr){
            if(obj.emoji == this.dataVo.tData){
                return false;
            }
        }
        return true;
    }

    //exit
    exit(){
        super.exit();
        this.timeItem.stop();
        egret.Tween.removeAllTweens();
    }

}