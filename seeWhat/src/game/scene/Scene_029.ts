//记忆连连看
class Scene_029 extends BaseScene{
    constructor(){
        super();
        this.init();
    }

    private currentSelect:egret.Sprite;
    private group:egret.Sprite;
    private isCanOperate = true;
    private init(){
        this.createItems();
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
    }

    private clkHandler(evt){
        if(this.timeItem && this.timeItem.leftTime <= 0) return;
        if(!this.isCanOperate) return;
        GameSound.instance().playSound('click');
        this.isCanOperate = false;
        if(!this.currentSelect){
            this.currentSelect = evt.target;
            this.playAnim(this.currentSelect,true).then(()=>{
                this.isCanOperate = true;
            });
        }
        else if(this.currentSelect == evt.target){
            this.isCanOperate = true;
        }
        else{
            let target = evt.target;
            this.playAnim(target,true).then(()=>{
                if(this.currentSelect.name == target.name){
                    this.currentSelect.alpha = 0.5;
                    this.currentSelect.touchEnabled = false;
                    target.alpha = 0.5;
                    target.touchEnabled = false;
                    this.isCanOperate = true;
                    this.currentSelect = null;
                    this.checkResult();
                }
                else{
                    Promise.all([this.playAnim(target,false),this.playAnim(this.currentSelect,false)]).then(()=>{
                        this.currentSelect = null;
                        this.isCanOperate = true;
                    });
                }
            });
        }
    }

    private checkResult(){
        if(this.isCanPass()){
            let leftTime = this.timeItem.leftTime;
            this.timeItem.stop();
            if(leftTime >= this.dataVo.time*2/3){
                EffectUtil.showResultEffect(EffectUtil.PERFECT);
            }
            else if(leftTime >= this.dataVo.time/3){
                EffectUtil.showResultEffect(EffectUtil.GREAT);
            }
            else{
                EffectUtil.showResultEffect(EffectUtil.GOOD);
            }
        }
    }

    private isCanPass(){
        for(let child of this.group.$children){
            if(child.alpha != 0.5) return false;
        }
        return true;
    }

    private playAnim(target,isbool){
        let p = new Promise((resolve,reject)=>{
            egret.Tween.get(target).to({scaleX:0},100).call(()=>{
                target.getChildAt(0).visible = isbool;
            }).to({scaleX:1},100).wait(300).call(()=>{
                egret.Tween.removeTweens(target);
                resolve();
            });
        });
        return p;
    }

    private createItems(){
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
            img.scaleX = wid/img.width;
            img.scaleY = wid/img.height;
            img.touchEnabled = false;
            img.visible = false;
            let w = img.width*img.scaleX;
            let sprite = new egret.Sprite();
            sprite.graphics.beginFill(0xFF6A6A);
            sprite.graphics.drawRect(-w/2,-w/2,w,w);
            sprite.graphics.endFill();
            sprite.addChild(img);
            sprite.touchEnabled = true;
            sprite.name = arr[i];
            sprite.addEventListener(egret.TouchEvent.TOUCH_TAP,this.clkHandler,this);
            sprite.x = sprite.width/2 + (wid + 2)*(i%columns);
            sprite.y = sprite.width/2 + (wid + 2)*Math.floor(i/columns);
            this.group.addChild(sprite);
        }

        this.addChild(this.group);
        this.group.x = SpriteUtil.stageCenterX - this.group.width/2;
        this.group.y = 200;
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