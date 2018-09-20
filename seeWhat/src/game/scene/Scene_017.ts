//转盘插刀
class Scene_017 extends BaseScene{
    constructor(){
        super();
        this.init();
    }

    private engine;
    private runner;
    private render;

    //转盘
    private dartSprite;
    //飞到
    private knifeBody;
    private knifeArr = [];
    private knifeIndex = 0;
    private rotatePoint:egret.Point;
    private rotateAngle = 0.05;


    private init(){
        let matterContainer = new egret.Sprite();
        this.addChild(matterContainer);
        this.rotatePoint = new egret.Point(SpriteUtil.stageCenterX,360);
        this.engine = Matter.Engine.create({enableSleeping:false},null);
        this.runner = Matter.Runner.create(null);
        this.runner.isFixed = true;
        let render = EgretRender.create({
            engine:this.engine,
            container:matterContainer,
            options:{
                width:SpriteUtil.stageWidth,
                height:SpriteUtil.stageHeight,
                wireframes:true
            }
        });
        Matter.Runner.run(this.runner,this.engine);
        EgretRender.run(render);
        this.engine.world.gravity.y = 0;
        //创建刀列
        let len = this.dataVo.sData;
        for(let i = 0;i < len;i++){
            let body = this.createKnifes();
            this.knifeArr.push({body:body,angle:0,isShooted:false,point:{x:0,y:0}});
        }

        Matter.World.add(this.engine.world,this.knifeArr[this.knifeIndex].body);
        //木头仅仅是展示不做任何物理处理
        let image = SpriteUtil.createImage('wood_png');
        image.x = this.rotatePoint.x;
        image.y = this.rotatePoint.y;
        image.scaleX = 1.5;
        image.scaleY = 1.5;
        this.addChild(image);
        this.dartSprite = image;
        let circle = Matter.Bodies.circle(this.rotatePoint.x,this.rotatePoint.y,image.width/2,{
            label:'dart',
            frictionAir:0,
            restitution:0,
            isSensor:true,
            collisionFilter:{
                category:0x0020,
                mask:0x0040|0x0010
            }
        },null);
        Matter.Body.setAngularVelocity(circle,this.rotateAngle);
        let constraint = Matter.Constraint.create({
            pointB:{x:circle.position.x,y:circle.position.y},
            bodyA:circle,
            stiffness:1,
            damping:0.1,
            friction:0,
            restitution:0
        });
        Matter.World.add(this.engine.world,[circle,constraint]);
        //
        egret.startTick(this.loop,this);

        Matter.Events.on(this.engine,"collisionStart",this.collisionStart.bind(this));
    }

    private collisionStart(evt){
        let pairs = evt.pairs;
        for(let pair of pairs){
            if(pair.bodyA.label == "knife" && pair.bodyB.label == "knife"){
                // let idx = egret.setTimeout(()=>{
                //     EffectUtil.showResultEffect();
                // },this,800);
                console.log('fail');
            }
            else if(pair.bodyA.label == "dart" || pair.bodyB.label == "dart"){
                console.log('again');
                let knife = this.knifeArr[this.knifeIndex];
                Matter.Body.setVelocity(knife.body,{x:0,y:0});
                knife.body.speed = 0;
                knife.body.collisionFilter.category = 0x0080;
                Matter.Body.setAngularVelocity(knife.body,this.rotateAngle);
                Matter.Body.setMass(knife.body,999999);
                knife.body.restitution = 9;
                knife.body.friction = 0;
                knife.point = {x:knife.body.position.x,y:knife.body.position.y};
                knife.isShooted = true;
                this.knifeIndex++;
                if(this.knifeIndex < this.knifeArr.length){
                    Matter.World.add(this.engine.world,this.knifeArr[this.knifeIndex].body);
                }
            }
        }
    }

    private loop(timestamp:number = 0){
        this.dartSprite.rotation += this.rotateAngle*180/Math.PI;
        for(let knife of this.knifeArr){
            if(!knife.isShooted) continue;
            knife.angle += this.rotateAngle;
            let xx = knife.point.x - this.rotatePoint.x;
            let yy = knife.point.y - this.rotatePoint.y;
            let nx = xx*Math.cos(knife.angle) - yy*Math.sin(knife.angle) + this.rotatePoint.x;
            let ny = yy*Math.cos(knife.angle) - xx*Math.sin(knife.angle) + this.rotatePoint.y;
            Matter.Body.setPosition(knife.body,{x:nx,y:ny});
        }
        return true;
    }

    private fireKnife(evt){
        Matter.Body.setVelocity(this.knifeArr[this.knifeIndex].body,{x:0,y:-50});
    }
    //创建刀
    private createKnifes(){
        let kspr = SpriteUtil.createImage('knife_png');
        let body = Matter.Bodies.rectangle(this.rotatePoint.x,SpriteUtil.stageCenterY + 360,kspr.width,kspr.height,{
            label:'knife',
            frictionAir:0,
            restitution:1,
            friction:0,
            render:{
                sprite:kspr
            },
            collisionFilter:{
                category:0x0040
            }
        });

        kspr.touchEnabled = true;
        kspr.addEventListener(egret.TouchEvent.TOUCH_TAP,this.fireKnife,this);
        return body;
    }

    exit(){
        super.exit();
        egret.stopTick(this.loop,this);
        Matter.Runner.stop(this.runner);
        EgretRender.stop();
        Matter.Engine.clear(this.engine);
        Matter.Events.off(this.engine,'collisionStart',this.collisionStart);
        Matter.World.remove(this.engine.world,this.engine.world.bodies,0);
        Matter.World.remove(this.engine.world,this.engine.world.constraints,0);
    }

}