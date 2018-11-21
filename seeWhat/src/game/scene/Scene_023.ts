//方向敏感度测试 依次出现不同方向的形状 来判断方向
class Scene_023 extends BaseScene{
    constructor(){
        super();
        this.init();
    }

    private pools = [];
    private deaths = [];
    private score = 0;
    private isCanOperate = true;
    private init(){
        let up = this.createDirBtn("up");
        let down = this.createDirBtn("down");
        let left = this.createDirBtn("left");
        let right = this.createDirBtn("right");
        up.x = SpriteUtil.stageCenterX;
        up.y = SpriteUtil.stageHeight - up.height*2.5 - 200;
        down.x = up.x;
        down.y = SpriteUtil.stageHeight - down.height/2 - 200;
        left.x = SpriteUtil.stageCenterX - left.height;
        left.y = SpriteUtil.stageHeight - left.height*1.5 - 200;
        right.x = SpriteUtil.stageCenterX + left.height;
        right.y = left.y;

        let bg = SpriteUtil.createImage('together');
        bg.x = SpriteUtil.stageCenterX;
        bg.y = SpriteUtil.stageHeight - left.height*1.5 - 200;
        bg.scaleX = 1.8;
        bg.scaleY = 1.8;
        bg.alpha = 0.8
        this.addChild(bg);

        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
        this.timeItem.x = SpriteUtil.stageWidth - 300;

        this.scoreItem = new ScoreItem();
        this.addChild(this.scoreItem);
        this.scoreItem.setSTScore(this.score,this.dataVo.tData);

        // this.flyDirection();
        egret.startTick(this.loop,this);
    }

    private loop(){
        for(let spr of this.pools){
            spr.x += this.dataVo.sData;
            if(spr.x > SpriteUtil.stageWidth){
                egret.stopTick(this.loop,this);
                this.timeItem.stop();
                this.isCanOperate = false;
                EffectUtil.showResultEffect();
                break;
            }
        }
        if(this.pools.length > 0){
            let lastspr = this.pools[this.pools.length - 1];
            if(lastspr.x >= lastspr.width*2){
                this.flyDirection();
            }
        }
        else{
            this.flyDirection();
        }
        return true;
    }

    private flyDirection(){
        let fly = this.getPools();
    }

    private getPools(){
        let obj = this.getRandomDir();
        if(this.deaths.length > 0){
            let sprite = this.deaths.shift();
            sprite.rotation = obj.rotation;
            sprite.name = obj.name;
            sprite.x = -sprite.width/2;
            sprite.visible = true;
            this.pools.push(sprite);
            return sprite;
        }

        let fly = SpriteUtil.createImage("left");
        fly.scaleX = 1.8;
        fly.scaleY = 1.8;
        fly.rotation = obj.rotation;
        fly.name = obj.name;
        fly.y = SpriteUtil.stageCenterY - 200;
        fly.x = -fly.width/2;
        this.addChild(fly);
        fly.visible = true;
        this.pools.push(fly);
        return fly;
    }

    private getRandomDir(){
        let rd = Math.floor(4*Math.random());
        if(rd == 0){
            return {rotation:0,name:"left"};
        }
        else if(rd == 1){
            return {rotation:90,name:"up"};
        }
        else if(rd == 2){
            return {rotation:180,name:"right"};
        }
        return {rotation:-90,name:"down"};
    }

    private touchHandler(evt){
        if(!this.isCanOperate) return;
        GameSound.instance().playSound('click');
        let name = evt.target.name;
        let nowSpr = this.pools.shift();
        if(name == nowSpr.name){
            this.deaths.push(nowSpr);
            nowSpr.visible = false;
            this.score++;
            this.scoreItem.setSTScore(this.score);
            if(this.score >= this.dataVo.tData){
                egret.stopTick(this.loop,this);
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
        else{
            this.isCanOperate = false;
            egret.stopTick(this.loop,this);
            EffectUtil.showResultEffect();
        }
    }

    private createDirBtn(name = ""){
        let direction = SpriteUtil.createImage('circle');
        direction.scaleX = 1.8;
        direction.scaleY = 1.8;
        direction.touchEnabled = false;
        let text = new egret.TextField();
        text.size = 80;
        text.bold = true;
        text.textColor = 0xffffff;
        text.stroke = 1;
        text.strokeColor = 0x0000ff;
        if(name == "up"){
            text.text = "上";
        }
        else if(name == "down"){
            text.text = "下";
        }
        else if(name == "left"){
            text.text = "左";
        }
        else if(name == "right"){
            text.text = "右";
        }
        text.anchorOffsetX = text.width/2;
        text.anchorOffsetY = text.height/2;
        let sprite = new egret.Sprite();
        sprite.addChild(direction);
        sprite.addChild(text);
        this.addChild(sprite);
        sprite.touchEnabled = true;
        sprite.name = name;
        sprite.addEventListener(egret.TouchEvent.TOUCH_TAP,this.touchHandler,this);
        return sprite;
    }

    enter(){
        super.enter();
        this.timeItem.start();
    }

}