//拼图游戏 先选图片再拼图
class Scene_014 extends BaseScene{
    constructor(){
        super();
        this.init();
    }

    private beforeContainer:egret.Sprite;
    private picContainer:egret.Sprite;
    private titleTxt:egret.TextField;
    private cropPoints;
    private cropPics;
    private currTarget = null;
    private isOperating:boolean = false;
    private init(){
        this.cropPoints = [];
        this.cropPics = [];

        this.createFruit();
    }
    //选择水果  sData 各种图像  tdata 标题
    private createFruit(){
        let arr = this.dataVo.sData;
        let len = arr.length;
        this.beforeContainer = new egret.Sprite();
        this.addChild(this.beforeContainer);
        for(let i = 0;i < len;i++){
            let xx = 25 + 225*(i%3);
            let yy = 150 + 225*Math.floor(i/3);
            let bit = SpriteUtil.createImage(arr[i]);
            bit.anchorOffsetX = 0;
            bit.anchorOffsetY = 0;
            bit.width = 200;
            bit.height = 200;
            bit.x = xx;
            bit.y = yy;
            bit.name = arr[i];
            bit.touchEnabled = true;
            bit.addEventListener(egret.TouchEvent.TOUCH_TAP,this.selectPic,this);
            this.beforeContainer.addChild(bit);
        }

        this.titleTxt = SpriteUtil.createText(this.dataVo.tData,32,0x0000ff);
        this.titleTxt.x = SpriteUtil.stageCenterX;
        this.titleTxt.y = 100;
        this.addChild(this.titleTxt);
    }

    private selectPic(evt){
        GameSound.instance().playSound('click');
        let name = evt.target.name;
        this.createSeparate(`${name}_png`);
        this.beforeContainer.visible = false;
        this.removeChild(this.beforeContainer);
        this.titleTxt.text = '没错！还原这个图像！';
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
        this.timeItem.start();
    }
    //裁剪纹理
    private createSeparate(res){
        this.picContainer = new egret.Sprite();
        let rect = new egret.Shape();
        rect.graphics.beginFill(0x00000f);
        rect.graphics.drawRect(0,0,660,660);
        rect.graphics.endFill();
        this.picContainer.addChild(rect);
        this.picContainer.x = 30;
        this.picContainer.y = 200;
        this.addChild(this.picContainer);

        let bitmap = new egret.Bitmap(RES.getRes(res));
        bitmap.width = 640;
        bitmap.height = 640;
        let arr = [];
        for(let i = 0;i < 16;i++){
            arr.push(i);
            let xx = 2+165*(i%4);
            let yy = 2+165*Math.floor(i/4);
            this.cropPoints.push({x:xx,y:yy});
            //裁剪纹理
            let renderTexture = new egret.RenderTexture();
            renderTexture.drawToTexture(bitmap,new egret.Rectangle(160*(i%4),160*Math.floor(i/4),160,160));
            let bit = new egret.Bitmap();
            bit.texture = renderTexture;
            bit.x = xx;
            bit.y = yy;
            bit['sIndex'] = i;
            bit['tIndex'] = i;
            bit.touchEnabled = true;
            bit.addEventListener(egret.TouchEvent.TOUCH_TAP,this.clkCrop,this);
            this.picContainer.addChild(bit);
            this.cropPics.push(bit);
        }

        arr.sort((a,b)=>{
            return Math.random() > 0.5 ? 1 : -1;
        });

        for(let i = 0;i < arr.length;i++){
            let index = arr[i];
            this.cropPics[i]['tIndex'] = index;
            this.cropPics[i].x = this.cropPoints[index].x;
            this.cropPics[i].y = this.cropPoints[index].y;
        }
    }
    //事件处理
    private clkCrop(evt){
        if(this.isOperating || this.timeItem.leftTime <= 0) return;
        GameSound.instance().playSound('click');
        let pic = evt.target;
        if(this.currTarget == null){
            this.currTarget = pic;
            pic.alpha = 0.5;
        }
        else if(this.currTarget == pic){
            this.currTarget = null;
            pic.alpha = 1;
        }
        else{
            let index1 = pic['tIndex'];
            let index2 = this.currTarget['tIndex'];
            //交换tindex
            pic['tIndex'] = index2;
            this.currTarget['tIndex'] = index1;
            //互换位置
            pic.alpha = 1;
            this.currTarget.alpha = 1;
            egret.Tween.get(this.currTarget).to({x:this.cropPoints[index1].x,y:this.cropPoints[index1].y},200).call(()=>{
                egret.Tween.removeTweens(this.currTarget);
                this.currTarget = null;
            });
            egret.Tween.get(pic).to({x:this.cropPoints[index2].x,y:this.cropPoints[index2].y},200).call(()=>{
                egret.Tween.removeTweens(pic);
                this.checkOver();
            });
        }
    }

    private checkOver(){
        if(this.isCanPass()){
            let leftTime = this.timeItem.leftTime;
            this.timeItem.stop();
            if(leftTime >= 90){
                EffectUtil.showResultEffect(EffectUtil.PERFECT);
            }
            else if(leftTime >= 60){
                EffectUtil.showResultEffect(EffectUtil.GREAT);
            }
            else{
                EffectUtil.showResultEffect(EffectUtil.GOOD);
            }
        }
    }

    private isCanPass(){
        for(let pic of this.cropPics){
            if(pic['sIndex'] != pic['tIndex']) return false;
        }
        return true;
    }

}