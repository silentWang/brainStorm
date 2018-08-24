//看图 然后从图中找到这几张图
class Scene_6 extends BaseScene{
    constructor(){
        super();
        this.init();
    }

    private tarSprite1:egret.Sprite;
    private tarSprite2:egret.Sprite;
    private init(){
        //修身 齐家 治国 平天下
        let arr1 = ['🔨','💃','💏','👪','💉','🚩','🍼','👆','👇'];
        this.tarSprite1 = this.createPic(arr1);
        this.tarSprite1.x = SpriteUtil.stageCenterX - this.tarSprite1.width/2;
        this.tarSprite1.y = 100;
        this.addChild(this.tarSprite1);
        //玉不琢，不成器。人不学，不知义
        let arr2 = ['🍦','🌀','✊','📏','✋','☝','☀','🌿','❄'];




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
        sprite.graphics.beginFill(0x0000ff);
        sprite.graphics.drawRect(0,0,sprite.width,sprite.height);
        sprite.graphics.endFill();
        return sprite;
    }

}