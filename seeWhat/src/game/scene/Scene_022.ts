//记忆力能力 首先出现一个球 然后出现第二个 以此类推
class Scene_022 extends BaseScene{
    constructor(){
        super();
        this.init();
    }

    private sContainer:egret.Sprite;
    private blackBg;
    private pointsArr = [];
    private score = 0;
    private curCnt = 0;
    private init(){
        //sdata 代表一次出现的数量  tdata代表目标分数
        this.sContainer = new egret.Sprite();
        this.addChild(this.sContainer);

        let rect = SpriteUtil.createRect(SpriteUtil.stageWidth,SpriteUtil.stageHeight,0x000000);
        rect.x = SpriteUtil.stageCenterX;
        rect.y = SpriteUtil.stageCenterY;
        this.addChild(rect);
        rect.alpha = 0;
        this.blackBg = rect;

        this.scoreItem = new ScoreItem();
        this.scoreItem.setSTScore(this.score,this.dataVo.tData);
        this.addChild(this.scoreItem);

        this.timeItem = new TimeItem(this.dataVo.time);
        this.timeItem.x = SpriteUtil.stageWidth - 300;
        this.addChild(this.timeItem);

        let h = Math.floor(SpriteUtil.stageWidth - 100)/100;
        let v = Math.floor(SpriteUtil.stageHeight - 480)/100;
        for(let i = 0;i < h*v;i++){
            let point = new egret.Point(50+(i%h)*100,240+Math.floor(i/h)*100);
            this.pointsArr.push(point);
        }

        this.next();
    }

    private next(){
        egret.Tween.get(this.blackBg).to({alpha:1},250).call(()=>{
            this.nextHandler();
            egret.Tween.get(this.blackBg).to({alpha:0},250).call(()=>{
                egret.Tween.removeTweens(this.blackBg);
            });
        });
    }

    private nextHandler(){
        let len = this.dataVo.sData;
        for(let i = 0;i < len;i++){
            this.createShape();
        }
    }

    private createShape(){
        let num = Math.floor(3*Math.random());
        let shape;
        let w = 30+20*Math.random();
        if(this.dataVo.level == 5){
            num = 1;
        }
        else if(this.dataVo.level == 6){
            num = 0;
        }
        else if(this.dataVo.level >= 3){
            num = Math.floor(2*Math.random());
        }

        if(num == 0){
            shape = SpriteUtil.createCircle(w,this.getSevenColor());
        }
        else if(num == 1){
            shape = SpriteUtil.createRect(w*2,w*2,this.getSevenColor());
        }
        else if(num == 2){
            shape = SpriteUtil.createPolygon([0,0,w,w,w,-w],this.getSevenColor());
        }
        shape.rotation = 360*Math.random();
        let index = Math.floor(this.pointsArr.length * Math.random());
        let point = this.pointsArr.splice(index,1)[0];
        shape.x = point.x;
        shape.y = point.y;
        this.sContainer.addChild(shape);
        shape.name = "target";
        shape.touchEnabled = true;
        shape.addEventListener(egret.TouchEvent.TOUCH_TAP,this.touchHandler,this);
    }

    private touchHandler(e:egret.TouchEvent){
        if(this.timeItem.leftTime <= 0) return;
        GameSound.instance().playSound("click");
        let target = e.target;
        if(target.name == "target"){
            target.name = "passed";
            this.score++;
            this.scoreItem.setSTScore(this.score);
            if(this.score >= this.dataVo.tData){
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
            else{
                this.curCnt++;
                if(this.curCnt >= this.dataVo.sData){
                    this.curCnt = 0;
                    this.next();
                }
            }
        }
        else if(target.name == "passed"){
            this.timeItem.stop();
            EffectUtil.showResultEffect();
        }
    }

    private getSevenColor(){
        let random = 0;
        let arr = [0xFF0000,0xFF7F00,0xFFFF00,0x0000FF,0x8B00FF,0xFF00FF,0xEED2EE];
        if(this.dataVo.level == 1){
            random = Math.floor(7*Math.random());
        }
        else if(this.dataVo.level == 2){
            random = Math.floor(5*Math.random());
        }
        else if(this.dataVo.level == 3){
            random = Math.floor(3*Math.random());
        }
        else if(this.dataVo.level == 4){
            random = 5;
        }
        else if(this.dataVo.level == 5){
            random = 6;
        }
        return arr[random];
    }

    enter(){
        super.enter();
        this.timeItem.start();
    }

}