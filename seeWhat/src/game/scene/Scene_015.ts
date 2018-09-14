//找出不一样的颜色块
class Scene_015 extends BaseScene{
    constructor(){
        super();
        this.init();
    }

    private colorArr;
    private init(){
        let color = this.dataVo.sData[0];
        let num = this.dataVo.sData[1];
        //多少列
        let columns = Math.round(Math.sqrt(num));
        //每个格子宽度
        let wid = Math.round(SpriteUtil.stageWidth - 120)/columns;

        let sprite = new egret.Sprite();
        let tindex = Math.floor(parseInt(num)*Math.random());
        for(let i = 0;i < num;i++){
            let shape:egret.Shape;
            if(i == tindex){
                shape = this.createShape(this.dataVo.tData,wid);
                shape.name = this.dataVo.tData;
            }
            else{
                shape = this.createShape(color,wid);
                shape.name = color;
            }
            shape.x = (i%columns)*(wid + 5);
            shape.y = Math.floor(i/columns)*(wid+5);
            sprite.addChild(shape);
            shape.touchEnabled = true;
            shape.addEventListener(egret.TouchEvent.TOUCH_TAP,this.clkShape,this);
        }

        sprite.x = SpriteUtil.stageCenterX - sprite.width/2;
        sprite.y = 120;
        this.addChild(sprite);

        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
    }

    private clkShape(evt){
        if(this.timeItem.leftTime <= 0) return;
        GameSound.instance().playSound('click');
        let name = evt.target.name;
        if(name == this.dataVo.tData){
            let leftTime = this.timeItem.leftTime;
            this.timeItem.stop();
            if(leftTime >= 2*this.dataVo.time/3){
                EffectUtil.showResultEffect(EffectUtil.PERFECT);
            }
            else if(leftTime >= this.dataVo.time/2){
                EffectUtil.showResultEffect(EffectUtil.GREAT);
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

    private createShape(color,wid,type = 0){
        let shape = new egret.Shape();
        shape.graphics.beginFill(color);
        shape.graphics.drawRect(0,0,wid,wid);
        shape.graphics.endFill();
        return shape;
    }

    enter(){
        super.enter();
        this.timeItem.start();
    }

}