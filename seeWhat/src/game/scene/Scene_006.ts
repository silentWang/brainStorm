//看图 然后从图中找到这几张图
class Scene_006 extends BaseScene{
    constructor(){
        super();
        this.init();
    }

    private tarSprite:egret.Sprite;
    private picSprs:Array<egret.Sprite>;
    private isOperating:boolean = false;
    private init(){
        this.timeItem = new TimeItem(30);
        this.addChild(this.timeItem);
        //修身 齐家 治国 平天下
        let arr = this.dataVo.sData;
        this.tarSprite = this.createPic(arr);
        this.tarSprite.x = SpriteUtil.stageCenterX - this.tarSprite.width/2;
        this.tarSprite.y = SpriteUtil.stageCenterY - this.tarSprite.height/2 - 100;
        this.tarSprite.name = 'target_1';
        this.addChild(this.tarSprite);

        this.picSprs = [];
        //创建其他图形
        this.createRandomPic(arr,2,3);
        this.createRandomPic(arr,3,4);
        this.createRandomPic(arr,2,4);
        this.createRandomPic(arr,3,5);
        this.createRandomPic(arr,5,6);
        this.createRandomPic(arr,4,7);
        this.createRandomPic(arr,5,8);
        this.createRandomPic(arr,6,7);
        //这里的tdata代表展示图片的数量
        let num = this.dataVo.tData;
        let snum = this.dataVo.sData.length;
        if(num == 16 && snum == 9){
            this.createRandomPic(arr,1,4);
            this.createRandomPic(arr,2,6);
            this.createRandomPic(arr,0,6);
            this.createRandomPic(arr,7,3);
            this.createRandomPic(arr,5,2);
            this.createRandomPic(arr,7,4);
            this.createRandomPic(arr,0,7);
        }
        else if(num == 16 && snum == 16){
            this.createRandomPic(arr,9,12);
            this.createRandomPic(arr,10,14);
            this.createRandomPic(arr,8,15);
            this.createRandomPic(arr,6,11);
            this.createRandomPic(arr,7,13);
            this.createRandomPic(arr,3,12);
            this.createRandomPic(arr,4,10);
        }
    }

    private startGame(){
        this.picSprs.push(this.tarSprite);
        this.tarSprite.touchEnabled = true;
        this.tarSprite.addEventListener(egret.TouchEvent.TOUCH_TAP,this.selectClk,this);
        this.picSprs.sort((a,b)=>{return Math.random() > 0.5 ? 1 : -1;});
        let num = this.dataVo.tData;
        let cols = Math.sqrt(num);
        let scale = (SpriteUtil.stageWidth - 50) / (this.tarSprite.width*cols);
        let wid = scale*this.tarSprite.width;
        let sprite = new egret.Sprite();
        for(let i = 0;i < this.picSprs.length;i++){
            let xx = (i%cols)*(wid+10);
            let yy = 100 + (wid+20)*Math.floor(i/cols);
            this.picSprs[i].x = xx;
            this.picSprs[i].y = yy;
            sprite.addChild(this.picSprs[i]);
            this.picSprs[i].scaleX = scale;
            this.picSprs[i].scaleY = scale;
        }
        this.addChild(sprite);
        sprite.x = SpriteUtil.stageCenterX - sprite.width/2;
        sprite.y = 100;
    }

    private createRandomPic(sarr = [],index1 = 0,index2 = 0){
        let arr = sarr.concat();
        let temp = arr[index1];
        arr[index1] = arr[index2];
        arr[index2] = temp;
        let spr = this.createPic(arr);
        spr.addEventListener(egret.TouchEvent.TOUCH_TAP,this.selectClk,this);
        spr.name = 'mistake';
        spr.touchEnabled = true;
        this.picSprs.push(spr);
    }

    private selectClk(evt){
        if(this.isOperating) return;
        this.isOperating = true;
        GameSound.instance().playSound('click');
        let name:string = evt.target.name;
        if(name == 'mistake'){
            this.timeItem.stop();
            EffectUtil.showResultEffect();
            return;
        }
        if(!name || name.search('target_') < 0) return;
        let idx:number = parseInt(name.split('_')[1]);
        let spr:egret.Sprite = evt.target;
        spr.touchEnabled = false;
        spr.parent.setChildIndex(spr,spr.parent.numChildren - 1);
        let leftTime = this.timeItem.leftTime;
        this.timeItem.stop();
        egret.Tween.get(spr).to({x:SpriteUtil.stageCenterX - spr.width*0.5/2,y:200,scaleX:0.5,scaleY:0.5},800).call(()=>{
            if(leftTime >= 30){
                EffectUtil.showResultEffect(EffectUtil.PERFECT);
            }
            else if(leftTime >= 15){
                EffectUtil.showResultEffect(EffectUtil.GREAT);
            }
            else{
                EffectUtil.showResultEffect(EffectUtil.GOOD);
            }
        });
    }
    //创建图片
    private createPic(arr){
        let len = arr.length;
        let cols = Math.sqrt(len);
        let wid = (SpriteUtil.stageWidth - 120)/cols;
        let sprite = new egret.Sprite();
        for(let i = 0;i < len;i++){
            let item = SpriteUtil.createText(arr[i],100);
            let scale = wid/item.width;
            item.scaleX = scale;
            item.scaleY = scale;
            item.x = wid/2+(i%cols)*(wid + 10);
            item.y = wid/2 + (wid + 10)*Math.floor(i/cols);
            sprite.addChild(item);
        }
        sprite.graphics.beginFill(0x707070);
        sprite.graphics.drawRect(0,0,(wid+10)*cols,(wid + 20)*cols);
        sprite.graphics.endFill();
        return sprite;
    }

    enter(){
        super.enter();
        this.timeItem.start(this.loop,this);
    }
    exit(){
        super.exit();
        this.timeItem.stop();
        for(let pic of this.picSprs){
            pic.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.selectClk,this);
        }
    }

    private loop(time:number){
        if(time <= 0){
            this.startGame();
            this.timeItem.stop();
            this.timeItem.restart(this.dataVo.time);
        }
    }

}