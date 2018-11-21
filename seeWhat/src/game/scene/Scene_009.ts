//找出质量不一样的篮球
class Scene_009 extends BaseScene{
    constructor(){
        super();
        this.init();
    }
    
    //引擎部分
    private engine;
    private runner;
    private render;

    private isTouching:boolean = false;
    private ballsArr;
    private currDragBall;

    private init(){
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);

        this.engine = Matter.Engine.create({enableSleeping:false},null);
        this.runner = Matter.Runner.create(null);
        this.render = EgretRender.create({
            engine:this.engine,
            container:this,
            options:{
                width:SpriteUtil.stageWidth,
                height:SpriteUtil.stageHeight,
                wireframes:true,
            }
        });
        Matter.Runner.run(this.runner,this.engine);
        EgretRender.run(this.render);
        this.engine.world.gravity.y = 1;

        this.createWall();

        this.createBall();
        //平衡棒
        let aspr = SpriteUtil.createRect(200,10,0xff0000);
        let auncel = Matter.Bodies.rectangle(SpriteUtil.stageCenterX,450,aspr.width,aspr.height,{
            frictionAir:0.05,
            friction:0,
            render:{
                sprite:aspr
            }
        });
        let constraint = Matter.Constraint.create({
            bodyA:auncel,
            pointB:{x:auncel.position.x,y:auncel.position.y},
            stiffness:1
        });
        Matter.World.add(this.engine.world,[auncel,constraint]);
        aspr.touchEnabled = true;
        aspr.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            Matter.Body.setAngularVelocity(auncel,0);
            let angle = auncel.angle == 0 ? Math.PI/2 : 0; 
            Matter.Body.setAngle(auncel,angle);
        },this);

        this.createVc(60,500,0x000000);
        this.createVc(SpriteUtil.stageWidth - 100,500,0x000000);

        let lspr = SpriteUtil.createRect(200,10,0x0000ff);
        let leftBoard = Matter.Bodies.rectangle(80,SpriteUtil.stageCenterY,200,10,{
            isStatic:true,
            angle:Math.PI/4,
            friction:1,
            render:{
                sprite:lspr
            }
        });
        let rspr = SpriteUtil.createRect(200,10,0x0000ff);
        let rightBoard = Matter.Bodies.rectangle(SpriteUtil.stageWidth - 80,SpriteUtil.stageCenterY,200,10,{
            isStatic:true,
            angle:-Math.PI/4,
            friction:1,
            render:{
                sprite:rspr
            }
        });

        let lspr1 = SpriteUtil.createRect(200,10,0x0000ff);
        let leftBoard1 = Matter.Bodies.rectangle(80,250,200,10,{
            isStatic:true,
            angle:Math.PI/4,
            friction:1,
            render:{
                sprite:lspr1
            }
        });
        let rspr1 = SpriteUtil.createRect(200,10,0x0000ff);
        let rightBoard1 = Matter.Bodies.rectangle(SpriteUtil.stageWidth - 80,250,200,10,{
            isStatic:true,
            angle:-Math.PI/4,
            friction:1,
            render:{
                sprite:rspr1
            }
        });

        Matter.World.add(this.engine.world,[leftBoard,rightBoard,leftBoard1,rightBoard1]);

        Matter.Events.on(this.engine,'collisionActive',this.collision.bind(this));
        this.createCatapult();
        this.createBoard();
    }
    //碰撞检测
    private collision(evt){
        let pairs = evt.pairs;
        let isHeavy = 0;
        let isLight = 0;
        let wrongNum = 0;
        let defmass = 50;
        for(let pair of pairs){
            let body1 = pair.bodyA.label == 'basketBoard' ? pair.bodyA : null;
            let body2 = pair.bodyB;
            if(body1 == null){
                body1 = pair.bodyB.label == 'basketBoard' ? pair.bodyB : null;
                body2 = pair.bodyA;
            }
            if(body1 == null) continue;
            if(body2.mass == defmass/2){
                isLight++;
            }
            else if(body2.mass == defmass*2){
                isHeavy++;
            }
            else if(body2.mass == defmass){
                wrongNum++;
            }
        }
        if(isLight + isHeavy >= 2){
            Matter.Events.off(this.engine,'collisionActive',this.collision);
            Matter.Runner.stop(this.runner);
            EgretRender.stop();
            let time = this.timeItem.leftTime;
            this.timeItem.stop();
            if(time >= 30){
                EffectUtil.showResultEffect(EffectUtil.PERFECT);
            }
            else if(time >= 15){
                EffectUtil.showResultEffect(EffectUtil.GREAT);
            }
            else{
                EffectUtil.showResultEffect(EffectUtil.GOOD);
            }
        }
        else if((isLight + isHeavy == 1) && wrongNum == 1){
            Matter.Events.off(this.engine,'collisionActive',this.collision);
            Matter.Runner.stop(this.runner);
            this.timeItem.stop();
            EgretRender.stop();
            EffectUtil.showResultEffect();
        }
        else if(wrongNum == 2){
            Matter.Events.off(this.engine,'collisionActive',this.collision);
            Matter.Runner.stop(this.runner);
            EgretRender.stop();
            this.timeItem.stop();
            EffectUtil.showResultEffect();
        }
    }

    private touchBegin(evt){
        let name = evt.target.name;
        if(!name || name.search('ball_') == -1) return;
        let index = name.split('_')[1];
        this.currDragBall = this.ballsArr[index];
        this.isTouching = true;
    }

    private touchMove(evt){
        if(this.isTouching && this.currDragBall){
            //拖拽期间取消重力
            Matter.Body.setVelocity(this.currDragBall,{x:0,y:-1});
            Matter.Sleeping.set(this.currDragBall,false);
            Matter.Body.setPosition(this.currDragBall,{x:evt['stageX'],y:evt['stageY']});
        }
    }

    private touchEnd(){
        this.isTouching = false;
        Matter.Body.setVelocity(this.currDragBall,{x:0,y:0});
        this.currDragBall = null;
    }
    //创建篮球
    private createBall(){
        this.ballsArr = [];
        let nums = 0;
        let count = this.dataVo.sData;
        let rans = CommonUtil.getRandomNumFromARange(2,0,count);
        rans.sort((a,b)=>{
            return a - b;
        });
        console.log(rans);
        let xname = 'basketball';
        if(this.dataVo.level == 3){
            xname = 'football';
        }
        let defmass = 50;
        let idx = egret.setInterval(()=>{
            let spr = SpriteUtil.createImage(xname);
            let scale = 60/spr.width;
            spr.scaleX = scale;
            spr.scaleY = scale;
            let xx = (SpriteUtil.stageWidth - 100)*Math.random();
            if(this.dataVo.level != 1 && nums < this.dataVo.sData - 2){
                xx = nums%2 == 0 ? 20 : SpriteUtil.stageWidth - 20;
            }
            let mass = defmass;
            if(this.dataVo.level == 1){
                mass = rans[0] == nums ? defmass*2 : defmass;
                if(mass != defmass*2){
                    mass = rans[1] == nums ? defmass*2 : defmass;
                }
            }
            else if(this.dataVo.level == 2){
                mass = rans[0] == nums ? defmass/2 : defmass;
                if(mass != defmass/2){
                    mass = rans[1] == nums ? defmass/2 : defmass;
                }
            }
            else if(this.dataVo.level == 3){
                mass = rans[0] == nums ? defmass*2 : defmass;
                if(mass != defmass*2){
                    mass = rans[1] == nums ? defmass/2 : defmass;
                }
            }
            spr.name = `ball_${nums}`;
            let ball = Matter.Bodies.circle(xx,0,scale*spr.height/2,{
                restitution:0.5,
                friction:1,
                label:'ball',  
                render:{
                    sprite:spr
                }
            },0);
            Matter.World.add(this.engine.world,ball);
            // Matter.Body.setInertia(ball,10000);
            Matter.Body.setMass(ball,mass);
            this.ballsArr.push(ball);

            spr.touchEnabled = true;
            spr.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.touchBegin,this);
            spr.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.touchMove,this);
            spr.addEventListener(egret.TouchEvent.TOUCH_END,this.touchEnd,this);
            spr.addEventListener(egret.TouchEvent.TOUCH_CANCEL,this.touchEnd,this);
            spr.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE,this.touchEnd,this);
            nums++;
            if(nums >= count){
                egret.clearInterval(idx);
            }
        },this,500);
        
        Matter.World.add(this.engine.world,this.ballsArr);
    }

    //创建装球的容器
    private createVc(xx,yy,color = 0x00ff00){
        let lspr = SpriteUtil.createRect(50,10,color);
        let lbdy = Matter.Bodies.rectangle(xx,yy,50,10,{
            isStatic:true,
            angle:Math.PI/3,
            render:{
                sprite:lspr
            }
        });

        let rspr = SpriteUtil.createRect(50,10,color);
        let rbdy = Matter.Bodies.rectangle(xx + 40,yy,50,10,{                                                 
            isStatic:true,
            angle:-Math.PI/3,
            render:{
                sprite:rspr
            }
        });
        //center  主要用来检测篮球是否放进篮子里了
        let cspr = SpriteUtil.createRect(30,10,color);
        let cbdy = Matter.Bodies.rectangle(xx + 20,yy,30,10,{                                                 
            isStatic:true,
            label:'basketBoard',
            render:{
                sprite:cspr
            }
        });

        let text = new egret.TextField();
        text.text = '实验结果';
        text.x = xx + 20;
        text.y = yy - 60;
        text.textAlign = 'center';
        text.textColor = 0x0000ff;
        text.size = 22;
        text.width = 100;
        text.anchorOffsetX = 50;
        this.addChild(text);

        Matter.World.add(this.engine.world,[lbdy,rbdy,cbdy]);
    }

    //创建墙壁
    private createWall(){
        let left = Matter.Bodies.rectangle(-5,SpriteUtil.stageCenterY,10,SpriteUtil.stageHeight,{isStatic:true});
        let right = Matter.Bodies.rectangle(SpriteUtil.stageWidth + 5,SpriteUtil.stageCenterY,10,SpriteUtil.stageHeight,{isStatic:true});
        let top = Matter.Bodies.rectangle(SpriteUtil.stageCenterX,-5,SpriteUtil.stageWidth,10,{isStatic:true});
        let bottom = Matter.Bodies.rectangle(SpriteUtil.stageCenterX,SpriteUtil.stageHeight - 100,SpriteUtil.stageWidth,200,{isStatic:true});
        Matter.World.add(this.engine.world,[left,right,top,bottom]);
    }
    //创建竖直隔板
    private createBoard(){
        let bodies = [];
        for(let i = 0;i < 6;i++){
            let spr = SpriteUtil.createRect(10,50,Math.ceil(0xffff00*Math.random())+32);
            let board = Matter.Bodies.rectangle(10+100*(i+1),SpriteUtil.stageCenterY + 200,10,50,{
                isStatic:true,
                render:{
                    sprite:spr
                }
            });
            bodies.push(board);
        }
        Matter.World.add(this.engine.world,bodies);
    }

    //创建跷跷板
    private createCatapult(){
        let rect = SpriteUtil.createRect(200,16,0xCD00CD);
        let catapult = Matter.Bodies.rectangle(SpriteUtil.stageWidth - 100,SpriteUtil.stageHeight - 240,rect.width,rect.height,{
            render:{
                sprite:rect
            }
        });

        let prect = SpriteUtil.createRect(20,40,0xff00ff);
        let pbody = Matter.Bodies.rectangle(SpriteUtil.stageWidth - 100,SpriteUtil.stageHeight - 220,prect.width,prect.height,{
            isStatic:true,
            render:{
                sprite:prect
            }
        });

        let srect = SpriteUtil.createRect(30,30,0x0f0f0f);
        let sbody = Matter.Bodies.rectangle(SpriteUtil.stageWidth - 15,SpriteUtil.stageHeight - 216,srect.width,srect.height,{
            isStatic:true,
            render:{
                sprite:srect
            }
        });

        let constraint = Matter.Constraint.create({
            bodyA:catapult,
            pointB:Matter.Vector.clone(catapult.position),
            stiffness:1,
            length:0
        });

        Matter.World.add(this.engine.world,[pbody,sbody,catapult,constraint]);
    }

    enter(){
        super.enter();
        this.timeItem.start();
    }

    exit(){
        super.exit();
        this.timeItem.stop();
        for(let body of this.engine.world.bodies){
            if(body.label == 'ball'){
                body.render.sprite.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.touchBegin,this);
                body.render.sprite.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.touchMove,this);
                body.render.sprite.addEventListener(egret.TouchEvent.TOUCH_END,this.touchEnd,this);
                body.render.sprite.addEventListener(egret.TouchEvent.TOUCH_CANCEL,this.touchEnd,this);
                body.render.sprite.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE,this.touchEnd,this);
            }
        }
        Matter.World.remove(this.engine.world,this.engine.world.bodies,0);
        Matter.World.remove(this.engine.world,this.engine.world.constraints,0);
    }

}