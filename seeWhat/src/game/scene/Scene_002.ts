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
        let len = arr.length;
        for(let i = 0;i < len;i++){
            let img = SpriteUtil.createImage(arr[i],true);
            img.anchorOffsetX = 0;
            img.anchorOffsetY = 0;
            img.scaleX = wid/img.width;
            img.scaleY = wid/img.height;
            img.name = arr[i];
            img.x = (wid + 2)*(i%columns);
            img.y = (wid + 2)*Math.floor(i/columns);
            this.group.addChild(img);
            img.addEventListener(egret.TouchEvent.TOUCH_TAP,this.clkHandler,this);
        }

        this.addChild(this.group);
        this.group.x = SpriteUtil.stageCenterX - this.group.width/2;
        this.group.y = 200;

        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
    }

    private clkHandler(evt){
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
            if(this.currentSelect.name == evt.target.name){
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

    enter(){
        super.enter();
        this.timeItem.start();
    }

    exit(){
        super.exit();
        while(this.numChildren > 1){
            let child = this.getChildAt(this.numChildren - 1);
            if(child.hasEventListener(egret.TouchEvent.TOUCH_TAP)){
                child.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.clkHandler,this);
            }
            this.removeChild(child);
        }
    }

}