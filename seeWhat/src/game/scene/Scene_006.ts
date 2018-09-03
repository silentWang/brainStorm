//看图 然后从图中找到这几张图
class Scene_006 extends BaseScene{
    constructor(){
        super();
        this.init();
    }

    private tarSprite1:egret.Sprite;
    private tarSprite2:egret.Sprite;
    private tarPoints:Array<egret.Point>;
    private picSprs:Array<egret.Sprite>;
    private selectNum:number = 0;
    private init(){
        this.dataVo.time = 60;

        this.timeItem = new TimeItem(30);
        this.addChild(this.timeItem);
        //修身 齐家 治国 平天下
        let arr1 = ['🔨','💃','💕','🏡','💉','🚩','🍼','👆','👇'];
        this.tarSprite1 = this.createPic(arr1);
        this.tarSprite1.x = SpriteUtil.stageCenterX - this.tarSprite1.width/2;
        this.tarSprite1.y = 100;
        this.tarSprite1.name = 'target_1';
        this.addChild(this.tarSprite1);
        //玉不琢，不成器。人不学，不知义
        let arr2 = ['🍦','🌀','👌','📏','✋','☝','☀','🌿','❄'];
        this.tarSprite2 = this.createPic(arr2);
        this.tarSprite2.x = SpriteUtil.stageCenterX - this.tarSprite2.width/2;
        this.tarSprite2.y = this.tarSprite1.y + this.tarSprite1.height + 100;
        this.addChild(this.tarSprite2);
        this.tarSprite2.name = 'target_2';

        this.tarPoints = []
        this.tarPoints.push(new egret.Point(80,SpriteUtil.stageCenterY + 200));
        this.tarPoints.push(new egret.Point(400,SpriteUtil.stageCenterY + 200));
        this.picSprs = [];
        //创建其他图形
        this.createRandomPic(arr1,2,3);
        this.createRandomPic(arr1,1,4);
        this.createRandomPic(arr1,5,6);
        this.createRandomPic(arr1,0,8);
        this.createRandomPic(arr1,6,3);
        this.createRandomPic(arr1,1,2);
        this.createRandomPic(arr1,0,4);

        this.createRandomPic(arr2,2,3);
        this.createRandomPic(arr2,1,4);
        this.createRandomPic(arr2,5,6);
        this.createRandomPic(arr2,0,8);
        this.createRandomPic(arr2,6,3);
        this.createRandomPic(arr2,1,2);
        this.createRandomPic(arr2,0,5);
    }

    private startGame(){
        this.picSprs.push(this.tarSprite1);
        this.picSprs.push(this.tarSprite2);
        this.tarSprite1.touchEnabled = true;
        this.tarSprite2.touchEnabled = true;
        this.tarSprite1.addEventListener(egret.TouchEvent.TOUCH_TAP,this.selectClk,this);
        this.tarSprite2.addEventListener(egret.TouchEvent.TOUCH_TAP,this.selectClk,this);
        this.picSprs.sort((a,b)=>{return Math.random() > 0.5 ? 1 : -1;});
        for(let i = 0;i < this.picSprs.length;i++){
            let xx = 10 + (i%4)*180;
            let yy = 100 + 175*Math.floor(i/4);
            this.picSprs[i].x = xx;
            this.picSprs[i].y = yy;
            this.addChild(this.picSprs[i]);
            this.picSprs[i].scaleX = 0.45;
            this.picSprs[i].scaleY = 0.45;
        }
    }

    private createRandomPic(arr = [],index1 = 0,index2 = 0){
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
        console.log(evt.target.name);
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
        egret.Tween.get(spr).to({x:this.tarPoints[idx-1].x,y:this.tarPoints[idx-1].y,scaleX:0.7,scaleY:0.7},800).call(()=>{
            this.selectNum++;
            if(this.selectNum >= 2){
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

    private createPic(arr){
        let sprite = new egret.Sprite();
        for(let i = 0;i < arr.length;i++){
            let item = SpriteUtil.createText(arr[i],100);
            item.x = item.width/2+(i%3)*120;
            item.y = item.height/2 + 120*Math.floor(i/3);
            item.stroke = 0.5;
            item.strokeColor = 0x00ff00;
            sprite.addChild(item);
        }
        sprite.width = sprite.height;
        sprite.graphics.beginFill(0x96cdcd);
        sprite.graphics.drawRect(0,0,sprite.width,sprite.height);
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