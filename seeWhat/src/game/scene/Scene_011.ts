//大海捞针 找文字
class Scene_011 extends BaseScene{
    constructor(){
        super();
        this.init();
    }

    private isOperating:boolean = false;
    private init(){
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);

        let sprite = new egret.Sprite();
        let rand = Math.floor(100*Math.random() + 10);
        console.log(rand);
        for(let i = 0;i < 120;i++){
            let text;
            if(i == rand){
                text = this.createText(this.dataVo.tData);
            }
            else{
                text = this.createText(this.dataVo.sData);
            }

            text.x = (i%10)*66;
            text.y = 66*Math.floor(i/10);
            sprite.addChild(text);
        }
        sprite.anchorOffsetX = sprite.width/2;
        // sprite.anchorOffsetY = sprite.height/2;
        sprite.x = SpriteUtil.stageCenterX;
        sprite.y = 100;
        this.addChild(sprite);
    }

    private textClk(evt){
        if(this.isOperating) return;
        this.isOperating = true;
        let name = evt.target.text;
        if(name == this.dataVo.tData){
            let time = this.timeItem.leftTime;
            this.timeItem.stop();
            if(time >= 25){
                EffectUtil.showResultEffect(EffectUtil.PERFECT);
            }
            else if(time >= 15){
                EffectUtil.showResultEffect(EffectUtil.EXCELLENT);
            }
            else{
                EffectUtil.showResultEffect(EffectUtil.GOOD);
            }
        }
        else{
            this.timeItem.stop();
            EffectUtil.showResultEffect();
        }
    }

    private createText(name){
        let text = new egret.TextField();
        text.size = 54;
        text.text = name;
        text.textColor = 0x0000ff;//0xffffff*(8*Math.random() + 2)/10;
        text.stroke = 0.5;
        text.strokeColor = 0xffff00;
        text.bold = true;
        this.addChild(text);
        text.touchEnabled = true;
        text.addEventListener(egret.TouchEvent.TOUCH_TAP,this.textClk,this);
        return text;
    }

    enter(){
        super.enter();
        this.timeItem.start();
    }
}