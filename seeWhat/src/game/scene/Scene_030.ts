//点破小球
class Scene_030 extends BaseScene{
    constructor(){
        super();
        this.init();
    }
    private pointsArr = [];
    private init(){
        //sData 0 初始球的数量 1 每次分裂个数 tData 爆破次数
        this.createBalls();
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
    }

    private createBalls(){
        for(let i = 0; i < this.dataVo.sData[0];i++){
            let ball = SpriteUtil.createCircle(80,this.getColor());
            ball.x = SpriteUtil.stageCenterX;
            ball.y = SpriteUtil.stageCenterY;
            this.addChild(ball);
            ball.name = "first_"+this.dataVo.tData;
            ball.touchEnabled = true;
            ball.addEventListener(egret.TouchEvent.TOUCH_TAP,this.touchHandler,this);
            this.playAnim(ball);
        }
    }

    private touchHandler(evt){
        if(this.timeItem.leftTime <= 0) return;
        let ball = evt.target;
        let name = ball.name.split("_")[0];
        let index = ball.name.split("_")[1];
        if(name == "first"){
            let x = ball.x;
            let y = ball.y;
            let wid = ball.width;
            this.removeChild(ball);
            egret.Tween.removeTweens(ball);
            if(index > 0){
                let points = this.calculateAngle(wid,x,y,this.dataVo.sData[1]);
                let obj = {
                    x:x,
                    y:y,
                    radius:wid/3,
                    points:points
                }
                index--;
                this.playExplosion(obj,`${name}_${index}`);
            }
            else{
                let points = this.calculateAngle(wid,x,y,50);
                let obj = {
                    x:x,
                    y:y,
                    radius:wid/50,
                    points:points,
                    num:50
                }
                this.playDestroy(obj).then(()=>{
                    this.checkResult();
                });
            }
        }
    }

    private checkResult(){
        if(this.numChildren == 1){
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

    private playExplosion(obj:any,name){
        let num = this.dataVo.sData[1];
        let i = 0;
        let points = obj.points;
        while(i < num){
            let ball = SpriteUtil.createCircle(obj.radius,this.getColor());
            this.addChild(ball);
            ball.touchEnabled = true;
            ball.x = obj.x;
            ball.y = obj.y;
            ball.name = name;
            ball.addEventListener(egret.TouchEvent.TOUCH_TAP,this.touchHandler,this);
            let pt = points[i%num];
            egret.Tween.get(ball).to({x:pt.x,y:pt.y},800,egret.Ease.circOut).call(()=>{
                egret.Tween.removeTweens(ball);
                this.playAnim(ball);
            });
            i++;
        }
    }
    //不可分裂的直接爆掉
    playDestroy(obj){
        let p = new Promise((resolve,reject)=>{
            let num = obj.num;
            let i = 0;
            let points = obj.points;
            while(i < num){
                let ball = SpriteUtil.createCircle(obj.radius,this.getColor());
                this.addChild(ball);
                ball.x = obj.x;
                ball.y = obj.y;
                let pt = points[i%num];
                egret.Tween.get(ball).to({x:pt.x,y:pt.y},300,egret.Ease.circOut).call(()=>{
                    egret.Tween.removeTweens(ball);
                    this.removeChild(ball);
                    if(i == num){
                        resolve();
                    }
                });
                i++;
            }
        });
        return p;
    }

    private calculateAngle(wid,x,y,num){
        let angle = 360/num;
        let points = [];
        for(let i = 0;i < num;i++){
            let xx = x + 2*wid*Math.cos(i*angle/Math.PI);
            let yy = y - 2*wid*Math.sin(i*angle/Math.PI);
            points.push({x:xx,y:yy});
        }
        return points;
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

    private getColor(){
        let colors = [0xff0000,0xffff00,0x551A8B,0x0000ff,0xff00ff,0xffffff,0x000000];
        let index = Math.floor(colors.length*Math.random());
        return colors[index];
    }

    enter(){
        super.enter();
        this.timeItem.start();
    }

}