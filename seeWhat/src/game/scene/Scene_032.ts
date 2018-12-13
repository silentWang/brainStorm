//颜色 红色 绿色 
class Scene_032 extends BaseScene{
    constructor(){
        super();
        this.init();
    }

    private titleTxt:egret.TextField;
    private curIndex = -1;
    private colors = [];
    private balls = [];
    private score = 0;
    private isCanOperate = true;
    private init(){
        this.colors = [0xff0000,0xffff00,0xff7d00,0x0000ff,0xff00ff,0x00ffff,0x000000];
        let text = SpriteUtil.createText("红",160);
        text.x = SpriteUtil.stageCenterX;
        text.y = SpriteUtil.stageCenterY;
        this.addChild(text);
        this.titleTxt = text;
        this.next();

        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
        this.timeItem.x = SpriteUtil.stageWidth - 250;
        this.scoreItem = new ScoreItem();
        this.scoreItem.setSTScore(this.score,this.dataVo.tData);
        this.addChild(this.scoreItem);
    }

    private touchHandler(evt){
        if(!this.isCanOperate) return;
        let ball = evt.target;
        let index = ball.name.split("_")[1];
        if(this.curIndex == index){
            this.score++;
            this.scoreItem.setSTScore(this.score);
            if(this.scoreItem.isCanPass()){
                this.timeItem.stop();
                this.clear();
                EffectUtil.showResultEffect(EffectUtil.PERFECT);
                this.isCanOperate = false;
                return;
            }
            this.next();
        }
        else{
            this.timeItem.stop();
            this.isCanOperate = false;
            EffectUtil.showResultEffect();
        }
    }

    private next(){
        let obj = this.getTxtColor();
        this.curIndex = obj.index;
        this.titleTxt.textColor = obj.color;
        this.titleTxt.text = obj.name;
        this.createBalls(obj.index);
    }

    private createBalls(index){
        this.clear();
        let len = this.dataVo.sData;
        for(let i = 0; i < len;i++){
            let ball = SpriteUtil.createCircle(30 + 50*Math.random(),this.colors[i]);
            ball.x = ball.width/2 + (SpriteUtil.stageWidth - ball.width)*Math.random();
            ball.y = ball.width/2 + (SpriteUtil.stageHeight - 400)*Math.random();
            this.addChild(ball);
            ball.alpha = 0.8;
            ball.name = `color_${i}`;
            ball.touchEnabled = true;
            ball.addEventListener(egret.TouchEvent.TOUCH_TAP,this.touchHandler,this);
            ball.scaleX = 0;
            ball.scaleY = 0;
            this.balls.push(ball);
            egret.Tween.get(ball).to({scaleX:1,scaleY:1},200).call(()=>{
                egret.Tween.removeTweens(ball);
                this.playAnim(ball);
            });
        }
    }

    private clear(){
        for(let i = 0; i < this.balls.length;i++){
            egret.Tween.removeTweens(this.balls[i]);
            this.removeChild(this.balls[i]);
        }
        this.balls.length = 0;
    }

    private playAnim(ball){
        egret.Tween.get(ball).to({
            x:ball.width/2 + (SpriteUtil.stageWidth - ball.width)*Math.random(),
            y:ball.width/2 + (SpriteUtil.stageHeight - 400)*Math.random()
        },2000).call(()=>{
            egret.Tween.removeTweens(ball);
            this.playAnim(ball);
        });
    }

    enter(){
        super.enter();
        this.timeItem.start();
    }

    private getTxtColor(){
        let index = Math.floor(this.colors.length*Math.random());
        let names = ["红","黄","橙","蓝","紫","青","黑"];
        let sindex = Math.floor(this.dataVo.sData*Math.random());
        return {index:sindex,color:this.colors[index],name:names[sindex]};
    }

}