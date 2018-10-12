//flappy bird
class Scene_016 extends BaseScene{
    constructor(){
        super();
        this.init();
    }

    private engine;
    private runner;
    private render;
    //飞到
    private birdBody;
    private wallArr;
    private wallspeed = 3;
    private isCanOperate:boolean = true;
    private beforeUpdateFun:Function;
    private score = 0;
    private intervalId = 0;

    private init(){
        //datavo time代表出现墙的频率 单位毫秒
        let shape = new egret.Shape();
        shape.graphics.beginFill(0x00ff00,0.01);
        shape.graphics.drawRect(0,0,SpriteUtil.stageWidth,SpriteUtil.stageHeight);
        shape.graphics.endFill();
        this.addChild(shape);
        //初始画引擎部分
        this.engine = Matter.Engine.create({enableSleeping:false},null);
        this.runner = Matter.Runner.create(null);
        this.runner.isFixed = true;
        let render = EgretRender.create({
            engine:this.engine,
            container:this,
            options:{
                width:SpriteUtil.stageWidth,
                height:SpriteUtil.stageHeight,
                wireframes:true
            }
        });
        Matter.Runner.run(this.runner,this.engine);
        EgretRender.run(render);
        this.engine.world.gravity.y = 1;

        let bspr = SpriteUtil.createImage(this.dataVo.tData);
        let body = Matter.Bodies.circle(SpriteUtil.stageCenterX,500,bspr.height/2,{
            label:'bird',
            render:{
                sprite:bspr
            }
        },0);
        this.birdBody = body;
        Matter.World.add(this.engine.world,body);

        Matter.Events.on(this.engine,"collisionStart",this.collisionStart.bind(this));
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.tapMakeBirdFly,this);

        this.intervalId = egret.setInterval(()=>{
            this.createAWall();
        },this,this.dataVo.time);
        
        this.beforeUpdateFun = ()=>{
            if(this.birdBody.position.y >= SpriteUtil.stageHeight){
                this.birdBody.isStatic = true;
                this.destroy();
                this.checkResult();
                return;
            }
            if(!this.isCanOperate) return;
            if(!this.wallArr || this.wallArr.length == 0) return;
            for(let body of this.wallArr){
                let body1 = body.body1;
                let body2 = body.body2;
                let xx = body1.position.x;
                xx -= this.wallspeed;
                Matter.Body.setPosition(body1,{x:xx,y:body1.position.y});
                Matter.Body.setPosition(body2,{x:xx,y:body2.position.y});
            }
        }
        Matter.Events.on(this.engine,'beforeUpdate',this.beforeUpdateFun);

        this.scoreItem = new ScoreItem();
        this.addChild(this.scoreItem);
        this.scoreItem.setSTScore(this.score,this.dataVo.score);

        this.createAWall();
    }

    private collisionStart(evt){
        let pairs = evt.pairs;
        for(let pair of pairs){
            if(pair.bodyA.label == "bird" || pair.bodyB.label == "bird"){
                this.isCanOperate = false;
                this.checkResult();
            }
        }
    }

    private tapMakeBirdFly(evt){
        if(!this.isCanOperate) return;
        Matter.Body.setVelocity(this.birdBody,{x:0,y:-8});
    }
    //创建墙壁
    private createAWall(){
        if(!this.wallArr){
            this.wallArr = [];
        }

        let rand = this.score%2 == 0 ? true : false;
        let xx = SpriteUtil.stageWidth + 200;
        let len = this.wallArr.length;
        for(let i = len - 1;i >= 0;i--){
            let body1 = this.wallArr[i].body1;
            let body2 = this.wallArr[i].body2;
            if(body1.position.x <= -body1.render.sprite.width){
                Matter.World.remove(this.engine.world,[body1,body2],0);
                this.removeChild(body1.render.sprite);
                this.removeChild(body2.render.sprite);
                this.wallArr.splice(i,1);
                this.score++;
                this.scoreItem.setSTScore(this.score);
            }
        }

        let swid = 80+120*Math.random();
        let kspr1 = SpriteUtil.createRect(swid,550,0xffffff*Math.random());
        let body1 = Matter.Bodies.rectangle(xx,75+200*Math.random(),kspr1.width,kspr1.height,{
            label:'wall',
            isStatic:true,
            render:{
                sprite:kspr1
            }
        });
        let kspr2 = SpriteUtil.createRect(swid,550,0xffffff*Math.random());
        let body2 = Matter.Bodies.rectangle(xx,SpriteUtil.stageHeight - 75 - 200*Math.random(),kspr2.width,kspr2.height,{
            label:'wall',
            isStatic:true,
            render:{
                sprite:kspr2
            }
        });
        this.wallArr.push({body1:body1,body2:body2});
        Matter.World.add(this.engine.world,[body1,body2]);
    }

    private checkResult(){
        this.birdBody.isStatic = true;
        this.destroy();
        if(this.scoreItem.isCanPass()){
            let mid = this.score - this.dataVo.score;
            if(mid >= 15){
                EffectUtil.showResultEffect(EffectUtil.PERFECT);
            }
            else if(mid >= 10){
                EffectUtil.showResultEffect(EffectUtil.GREAT);
            }
            else{
                EffectUtil.showResultEffect(EffectUtil.GOOD);
            }
        }
        else{
            EffectUtil.showResultEffect();
        }
    }

    private destroy(){
        this.isCanOperate = false;
        egret.clearInterval(this.intervalId);
        Matter.Runner.stop(this.runner);
        EgretRender.stop();
        Matter.Engine.clear(this.engine);
        Matter.Events.off(this.engine,"collisionStart",this.collisionStart);
        Matter.Events.off(this.engine,"beforeUpdate",this.beforeUpdateFun);
        Matter.World.remove(this.engine.world,this.engine.world.bodies,0);
    }

    exit(){
        this.destroy();
        super.exit();
    }

}