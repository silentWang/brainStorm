//十二生肖
class Scene_001 extends BaseScene{
    constructor(){
        super();
        this.init();
    }
    
    private tarText:egret.TextField;
    private selectedArr:Array<egret.TextField>;
    private bounds;
    private init(){
        // this.dataVo.sData = '鼠鹅牛猫虎驴兔鸭龙鱼蛇龟马鸟羊象猴蛙鸡熊狗狼猪凤';
        // this.dataVo.tData = '鼠牛虎兔龙蛇马羊猴鸡狗猪';
        // this.dataVo.time = 60;
        
        this.selectedArr = [];
        let rect = SpriteUtil.createRect(SpriteUtil.stageWidth,SpriteUtil.stageHeight/8,0xCDCDC1);
        rect.x = SpriteUtil.stageWidth/2;
        rect.y = SpriteUtil.stageHeight - rect.height/2;
        rect.touchEnabled = true;
        this.bounds = {width:SpriteUtil.stageWidth - 60,height:SpriteUtil.stageHeight - SpriteUtil.stageHeight/8 - 60};
        for(let i = 0;i < this.dataVo.sData.length;i++){
            this.createText(this.dataVo.sData.charAt(i));
        }

        this.addChild(rect);
        this.tarText = new egret.TextField();
        this.tarText.name = 'target_text';
        this.tarText.textAlign = 'center';
        this.tarText.text = '';
        this.tarText.size = 36;
        this.tarText.textColor = 0x0000ff;
        this.tarText.stroke = 1;
        this.tarText.strokeColor = 0xffff00;
        this.tarText.bold = true;
        this.tarText.width = SpriteUtil.stageWidth;
        this.tarText.y = rect.y - 30;
        this.addChild(this.tarText);
        this.tarText.touchEnabled = true;
        this.tarText.addEventListener(egret.TouchEvent.TOUCH_TAP,this.textClk,this);

        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
    }
    //事件处理
    private textClk(evt){
        let text = evt.target;
        if(this.tarText == text){
            text = this.selectedArr.pop();
            let xx = 200 + 320*Math.random();
            let yy = SpriteUtil.stageHeight/2 - 100;
            let tstr = this.tarText.text;
            this.tarText.text = tstr.substr(0,tstr.length - 1);
            egret.Tween.get(text).to({x:xx,y:yy},500,egret.Ease.quadOut).call(()=>{
                egret.Tween.removeTweens(text);
                this.back(text);
            });
        }
        else{
            text.touchEnabled = false;
            this.tarText.touchEnabled = false;
            egret.Tween.removeTweens(text);
            egret.Tween.get(text).to({x:this.tarText.x + this.tarText.width/2,y:this.tarText.y,rotation:0},500).call(()=>{
                egret.Tween.removeTweens(text);
                let str = `${this.tarText.text}${text.text}`;
                this.tarText.text = str;
                text.touchEnabled = true;
                this.tarText.touchEnabled = true;
                this.selectedArr.push(text);
                if(str == this.dataVo.tData){
                    if(this.timeItem.leftTime >= 30){
                        EffectUtil.showResultEffect(EffectUtil.PERFECT);
                    }
                    else if(this.timeItem.leftTime >= 15){
                        EffectUtil.showResultEffect(EffectUtil.EXCELLENT);
                    }
                    else{
                        EffectUtil.showResultEffect(EffectUtil.GOOD);
                    }
                    this.timeItem.stop();
                }
            });
        }
    }

    private createText(name){
        let text = new egret.TextField();
        text.size = 48;
        text.text = name;
        text.textColor = 0xffffff*(8*Math.random() + 2)/10;
        text.stroke = 0.5;
        text.strokeColor = 0xffff00;
        text.bold = true;
        text.x = this.bounds.width * Math.random();
        text.y = this.bounds.height * Math.random();
        this.addChild(text);
        text.touchEnabled = true;
        text.addEventListener(egret.TouchEvent.TOUCH_TAP,this.textClk,this);
        this.back(text);
    }

    private back(target){
        egret.Tween.get(target).to({
            x:this.bounds.width*Math.random(),
            y:this.bounds.height*Math.random(),
            rotation:360*Math.random()},
            5000+2000*Math.random()).call(()=>{
                this.back(target);
            });
    }

    enter(){
        super.enter();
        this.timeItem.start();
    }

    //清内存
    exit(){
        while(this.numChildren > 1){
            let child = this.getChildAt(this.numChildren - 1);
            if(child instanceof egret.TextField){
                child.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.textClk,this);
            }
            egret.Tween.removeTweens(child);
            this.removeChild(child);
        }
        this.timeItem.stop();
        super.exit();
    }

}