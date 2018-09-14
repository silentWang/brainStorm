//连连看 字符版
class Scene_002 extends BaseScene{
    constructor(){
        super();
        this.init();
    }

    private currentSelect:egret.TextField;
    private group:egret.Sprite;
    private init(){
        //无序化
        let arr1 = this.dataVo.sData;
        let arr = arr1.concat(arr1);
        let num = arr.length;
        //多少列
        let columns = Math.round(Math.sqrt(num));
        //每个格子宽度
        let wid = Math.round(SpriteUtil.stageWidth - 50)/columns;
        //乱序
        arr.sort((a,b)=>{
            if(Math.random() > 0.5) return 1;
            if(Math.random() < 0.5) return -1;
            return 0;
        });
        
        this.group = new egret.Sprite();
        this.group.x = 5;
        this.group.y = 200;
        let len = arr.length;
        let size = columns == 10 ? wid - 20 : wid - 40;
        for(let i = 0;i < len;i++){
            let text = this.createText(arr[i],size,wid);
            text.x = (wid+5)*(i%columns);
            text.y = (wid+5)*Math.floor(i/columns);
            this.group.addChild(text);
        }
        this.addChild(this.group);

        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
    }

    private textClk(evt){
        if(this.timeItem && this.timeItem.leftTime <= 0) return;
        GameSound.instance().playSound('click');
        if(!this.currentSelect){
            this.currentSelect = evt.target;
            this.currentSelect.alpha = 0.5;
        }
        else if(this.currentSelect == evt.target){
            this.currentSelect.alpha = 1;
            this.currentSelect = null;
        }
        else{
            if(this.currentSelect.text == evt.target.text){
                this.group.removeChild(this.currentSelect);
                this.group.removeChild(evt.target);
                this.currentSelect = null;
            }
            else{
                this.currentSelect.alpha = 1;
                this.currentSelect = evt.target;
                this.currentSelect.alpha = 0.5;
            }
        }

        if(this.group.numChildren <= 0){
            let leftTime = this.timeItem.leftTime;
            this.timeItem.stop();
            if(leftTime >= 60){
                EffectUtil.showResultEffect(EffectUtil.PERFECT);
            }
            else if(leftTime >= 30){
                EffectUtil.showResultEffect(EffectUtil.GREAT);
            }
            else{
                EffectUtil.showResultEffect(EffectUtil.GOOD);
            }
        }
    }

    private createText(name:string,size = 60,width = 0){
        let text = new egret.TextField();
        text.size = size;
        text.text = name;
        text.textColor = 0x0000ff;
        text.stroke = 0.5;
        text.strokeColor = 0x000000;
        text.width = width;
        text.height = width;
        text.background = true;
        text.backgroundColor = 0x00C5CD;
        text.textAlign = 'center';
        text.verticalAlign = 'middle';
        text.bold = true;
        text.touchEnabled = true;
        text.addEventListener(egret.TouchEvent.TOUCH_TAP,this.textClk,this);
        return text;
    }

    enter(){
        super.enter();
        this.timeItem.start();
    }

    exit(){
        super.exit();
        while(this.numChildren > 1){
            let child = this.getChildAt(this.numChildren - 1);
            if(child instanceof egret.TextField){
                child.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.textClk,this);
            }
            this.removeChild(child);
        }
    }

}