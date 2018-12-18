//吃掉同颜色的方块
class Scene_028 extends BaseScene{
    constructor(){
        super();
        this.init();
    }

    private btnArr = [];
    private numsVec = {};
    private isCanOperate = true;
    private init(){
        //tdata 数组0是总共出现的次数  1是duration
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
        let len = this.dataVo.sData.length;
        for(let i = 0;i < len; i++){
            this.numsVec[i] = 0;
        }
        this.playAnim();
    }

    private touchHandler(evt){
        if(!this.isCanOperate) return;
        let name = evt.target.name;
        let index = name.split("_")[1];
        let text = this.btnArr[index].getChildAt(0);
        let num = parseInt(text.text.split("x")[1]);
        num++;
        text.text = "x"+num;
        if(this.numsVec[index] < num){
            this.isCanOperate = false;
            this.timeItem.stop();
            EffectUtil.showResultEffect();
        }
        else if(this.isCanPass()){
            this.isCanOperate = false;
            let time = this.timeItem.leftTime;
            this.timeItem.stop();
            if(time >= this.dataVo.time*2/3){
                EffectUtil.showResultEffect(EffectUtil.PERFECT);
            }
            else if(time >= this.dataVo.time/3){
                EffectUtil.showResultEffect(EffectUtil.GREAT);
            }
            else{
                EffectUtil.showResultEffect(EffectUtil.GOOD);
            }
        }
    }

    private isCanPass(){
        let len = this.btnArr.length;
        for(let i = 0;i < len;i++){
            let text = this.btnArr[i].getChildAt(0);
            let num = parseInt(text.text.split("x")[1]);
            if(num != this.numsVec[i]) return false;
        }
        return true;
    }

    private playAnim(){
        let len = this.dataVo.sData.length;
        let num = this.dataVo.tData[0];
        let xnum = num;
        let duration = this.dataVo.tData[1];
        let idx = egret.setInterval(()=>{
            let index = Math.floor(len * Math.random());
            let img = SpriteUtil.createImage(this.dataVo.sData[index]);
            this.numsVec[index]++;
            img.x = -img.width/2;
            img.y = SpriteUtil.stageCenterY - 150;
            this.addChild(img);
            egret.Tween.get(img).to({
                x:SpriteUtil.stageCenterX - 250
            },duration).to({
                x:SpriteUtil.stageCenterX,
                y:SpriteUtil.stageCenterY - 300
            },duration).to({
                x:SpriteUtil.stageCenterX + 250,
                y:SpriteUtil.stageCenterY - 160
            },duration).to({
                x:SpriteUtil.stageWidth + img.width
            },duration).call(()=>{
                egret.Tween.removeTweens(img);
                this.removeChild(img);
                xnum--;
                if(num <= 0 && xnum <= 0){
                    this.createBtnList();
                    this.timeItem.start();
                }
            });
            num--;
            if(num <= 0){
                egret.clearInterval(idx);
            }
        },this,250);
    }

    private createBtnList(){
        let len = this.dataVo.sData.length;
        let title = SpriteUtil.createText("你能确定各自出现次数吗？",48,0xF8F8FF);
        title.x = SpriteUtil.stageCenterX;
        title.y = SpriteUtil.stageCenterY - 200;
        this.addChild(title);
        let container:egret.Sprite = new egret.Sprite();
        for(let i = 0; i < len;i++){
            let sprite = this.createBtn(this.dataVo.sData[i],i);
            sprite.x = sprite.width/2 + i*200;
            sprite.y = sprite.height/2;
            container.addChild(sprite);
            this.btnArr.push(sprite);
        }
        container.x = SpriteUtil.stageCenterX - container.width/2;
        container.y = title.y + title.height - 40;
        this.addChild(container);
    }

    private createBtn(str,index){
        let sprite = new egret.Sprite();
        let img = SpriteUtil.createImage(str,true);
        img.addEventListener(egret.TouchEvent.TOUCH_TAP,this.touchHandler,this);
        img.scaleX = 2;
        img.scaleY = 2;
        img.name = str+"_"+index;
        let text = SpriteUtil.createText("x0",48,0xF8F8FF);
        text.touchEnabled = false;
        img.y = text.height + 80;
        sprite.addChild(text);
        sprite.addChild(img);
        return sprite;
    }

}