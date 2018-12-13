//绕圈小球
class Scene_031 extends BaseScene{
    constructor(){
        super();
        this.init();
    }

    private ball:egret.Sprite;
    private ballBtn:egret.Sprite;
    private ballAngle = 0;
    private startPt:egret.Point;
    private curIndex = 0;
    private enemies = [];
    private score = 0;
    private direction = 1;
    private init(){
        //sData 颜色数量<=7 tData 目标分（转一圈一分）  extData: num 出现球的数量 speed 速度 rate出现回头的概率
        let bg = SpriteUtil.createRect(SpriteUtil.stageWidth,SpriteUtil.stageHeight,0x000000);
        bg.alpha = 0.01;
        bg.x = SpriteUtil.stageCenterX;
        bg.y = SpriteUtil.stageCenterY;
        this.addChild(bg);
        bg.touchEnabled = true;
        bg.addEventListener(egret.TouchEvent.TOUCH_TAP,this.touchHandler,this);
        
        let sprite = new egret.Sprite();
        sprite.graphics.beginFill(0x000000,0.01);
        sprite.graphics.lineStyle(2,0x0000ff);
        sprite.graphics.drawCircle(0,0,300);
        sprite.x = SpriteUtil.stageCenterX;
        sprite.y = SpriteUtil.stageCenterY;
        this.addChild(sprite);
        this.startPt = new egret.Point(sprite.x + sprite.width/2,sprite.y);
        this.createBall();
        this.createEnemy();
        this.scoreItem = new ScoreItem();
        this.addChild(this.scoreItem);
        this.scoreItem.setSTScore(this.score,this.dataVo.tData);
        egret.startTick(this.loop,this);
    }

    private loop(timestamp){
        let xx = this.startPt.x - SpriteUtil.stageCenterX;
        let yy = this.startPt.y - SpriteUtil.stageCenterY;
        this.ball.x = xx*Math.cos(this.ballAngle) - yy*Math.sin(this.ballAngle) + SpriteUtil.stageCenterX;
        this.ball.y = yy*Math.cos(this.ballAngle) + xx*Math.sin(this.ballAngle) + SpriteUtil.stageCenterY;
        this.ballAngle += this.dataVo.extData.speed * this.direction*Math.PI/180/2;
        if(Math.abs(this.ballAngle) >= 2*Math.PI){
            this.ballAngle = this.ballAngle%(2*Math.PI);
        }
        let len = this.enemies.length;
        if(len == 0){
            this.createEnemy();
            return;
        }
        for(let i = len - 1;i >= 0;i--){
            let obj = this.enemies[i];
            let abs = Math.abs(this.ballAngle - obj.angle);
            if(obj.index == 10000){
                obj.shape.rotation += -1*this.direction;
            }
            if(abs < 5*Math.PI/180 || Math.abs(abs - 2*Math.PI) < 5*Math.PI/180){
                if(this.curIndex == obj.index){
                    this.removeChild(obj.shape);
                    this.enemies.splice(i,1);
                    this.score++;
                    this.scoreItem.setSTScore(this.score);
                    if(this.scoreItem.isCanPass()){
                        egret.stopTick(this.loop,this);
                        EffectUtil.showResultEffect(EffectUtil.PERFECT);
                        break;
                    }
                }
                else if(obj.index == 10000){
                    this.direction = -1*this.direction;
                    this.removeChild(obj.shape);
                    this.enemies.splice(i,1);
                }
                else{
                    egret.stopTick(this.loop,this);
                    this.removeChild(this.ball);
                    let points = this.calculateAngle(40,this.ball.x,this.ball.y,50);
                    this.playDestroy({x:this.ball.x,y:this.ball.y,num:50,radius:2,points:points}).then(()=>{
                        EffectUtil.showResultEffect();
                    });
                }
            }
        }
        return false;
    }

    private createBall(){
        let len = this.dataVo.sData;
        let sprite = new egret.Sprite();
        let colors = [0xff0000,0xffff00,0xff7d00,0x0000ff,0xff00ff,0x00ffff,0x000000];
        for(let i = 0;i < len;i++){
            let shp = new egret.Shape();
            shp.graphics.beginFill(colors[i]);
            shp.graphics.drawCircle(0,0,20);
            shp.graphics.endFill();
            shp.visible = (this.curIndex == i);
            sprite.addChild(shp);
        }
        this.ball = sprite;
        this.ball.x = this.startPt.x;
        this.ball.y = this.startPt.y;
        this.addChild(this.ball);

        let btn = new egret.Sprite();
        for(let i = 0;i < len;i++){
            let shp = new egret.Shape();
            shp.graphics.beginFill(colors[i]);
            shp.graphics.drawCircle(0,0,180);
            shp.graphics.endFill();
            btn.addChild(shp);
            shp.visible = (this.curIndex == i);
        }
        btn.x = SpriteUtil.stageCenterX;
        btn.y = SpriteUtil.stageCenterY;
        this.addChild(btn);
        btn.touchEnabled = true;
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.touchHandler,this);
        this.ballBtn = btn;
    }

    private touchHandler(evt){
        this.curIndex++;
        if(this.curIndex >= this.dataVo.sData){
            this.curIndex = 0;
        }
        for(let i = 0;i < this.ball.numChildren;i++){
            this.ball.$children[i].visible = i == this.curIndex;
            this.ballBtn.$children[i].visible = i == this.curIndex;
        }
    }

    private createEnemy(){
        let len = this.dataVo.sData;
        let colors = [0xff0000,0xffff00,0xff7d00,0x0000ff,0xff00ff,0x00ffff,0x000000];
        let xx = this.startPt.x - SpriteUtil.stageCenterX;
        let yy = this.startPt.y - SpriteUtil.stageCenterY;
        let num = this.dataVo.extData.num;

        let rate = this.dataVo.extData.rate*100;
        let rand = Math.ceil(100*Math.random());
        let bnm = rand < rate ? Math.floor(num*Math.random()) : -1;
        for(let i = 0;i < num;i++){
            if(i == bnm){
                let img = SpriteUtil.createImage("refresh");
                let angle = (this.ballAngle + (50*(i+1) + 30*Math.random())*Math.PI/180)%(2*Math.PI);
                let sprite = new egret.Sprite();
                sprite.graphics.beginFill(0x00ff00);
                sprite.graphics.drawCircle(0,0,img.width/2+5);
                sprite.graphics.endFill();
                sprite.addChild(img);
                let scale = 2*20/sprite.width;
                sprite.scaleX = scale;
                sprite.scaleY = scale;
                sprite.x = xx*Math.cos(angle) - yy*Math.sin(angle) + SpriteUtil.stageCenterX;
                sprite.y = yy*Math.cos(angle) + xx*Math.sin(angle) + SpriteUtil.stageCenterY;
                this.enemies.push({index:10000,angle:angle,shape:sprite});
                this.addChild(sprite);
                num++;
            }
            else{
                let shp = new egret.Shape();
                let index = Math.floor(len*Math.random());
                shp.graphics.beginFill(colors[index]);
                shp.graphics.drawCircle(0,0,20+10*Math.random());
                shp.graphics.endFill();
                let angle = (this.ballAngle + (60*(i+1) + 30*Math.random())*Math.PI/180)%(2*Math.PI);
                shp.x = xx*Math.cos(angle) - yy*Math.sin(angle) + SpriteUtil.stageCenterX;
                shp.y = yy*Math.cos(angle) + xx*Math.sin(angle) + SpriteUtil.stageCenterY;
                this.enemies.push({index:index,angle:angle,shape:shp});
                this.addChild(shp);
                this.playAnim(shp).then(()=>{
                    console.log("good");
                });
            }
        }
    }

    private playAnim(target){
        let p = new Promise((resolve,reject)=>{
            target.scaleX = 0;
            target.scaleY = 0;
            egret.Tween.get(target).to({scaleX:1,scaleY:1},200).call(()=>{
                egret.Tween.removeTweens(target);
            });
        });
        return p;
    }

    playDestroy(obj){
        let p = new Promise((resolve,reject)=>{
            let num = obj.num;
            let i = 0;
            let points = obj.points;
            while(i < num){
                let ball = SpriteUtil.createCircle(obj.radius + obj.radius * Math.random(),this.getColor());
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
            let xx = x + 3*wid*Math.random()*Math.cos(i*angle/Math.PI);
            let yy = y - 3*wid*Math.random()*Math.sin(i*angle/Math.PI);
            points.push({x:xx,y:yy});
        }
        return points;
    }

    private getColor(){
        let colors = [0xff0000,0xffff00,0xff7d00,0x0000ff,0xff00ff,0x00ffff,0x000000];
        let index = Math.floor(colors.length*Math.random());
        return colors[index];
    }

}