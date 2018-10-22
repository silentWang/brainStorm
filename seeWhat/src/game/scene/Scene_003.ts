//营救公主
class Scene_003 extends BaseScene{
    constructor(){
        super();
        this.init();
    }
    //引擎部分
    private engine;
    private runner;
    private render;
    private player;
    private girlbdy;
    private enemies;
    //数值部分
    private angleSpeed1 = 0.06;
    private angleSpeed2 = 0.06;
    private angleSpeed3 = 0.07;
    private angleSpeed4 = 0.08;
    private speedDir = 1;

    private isTouching:boolean = false;
    private categories = [0x0001,0x0002,0x0004,0x0008,0x0010,0x0020,0x0040,0x0080];
    private playerCategory = 0x0100;
    private isRunning = true;

    private init(){
        this.timeItem = new TimeItem(this.dataVo.time);
        this.timeItem.x = SpriteUtil.stageWidth - 250;
        this.addChild(this.timeItem);
        this.engine = Matter.Engine.create({enableSleeping:false},null);
        let world = this.engine.world;
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
        //取消重力
        world.gravity.y = 0;
        Matter.Runner.run(this.runner,this.engine);
        EgretRender.run(render);

        let enemy1 = this.createEnemy(0,560,this.categories[1]);
        Matter.World.add(world,enemy1);
        let enemy2 = this.createEnemy(200,560,this.categories[2]);
        Matter.World.add(world,enemy2);
        let enemy3 = this.createEnemy(400,560,this.categories[3]);
        Matter.World.add(world,enemy3);
        let enemy4 = this.createEnemy(580,560,this.categories[4]);
        Matter.World.add(world,enemy4);
        //大环两个一组
        let enemy5 = this.createEnemy(0,860,this.categories[5],15);
        Matter.World.add(world,enemy5);
        let enemy6 = this.createEnemy(400,860,this.categories[5],15);
        Matter.World.add(world,enemy6);
        //大环一个
        let enemy7 = this.createEnemy(210,1100,this.categories[5],15);
        Matter.World.add(world,enemy7);
        //包围机器人
        let enemy8 = this.createEnemy(160,100,this.categories[5]);
        Matter.World.add(world,enemy8);
        let enemy9 = this.createEnemy(310,200,this.categories[5]);
        Matter.World.add(world,enemy9);
        let enemy10 = this.createEnemy(460,100,this.categories[5]);
        Matter.World.add(world,enemy10);
        this.enemies = [enemy1,enemy2,enemy3,enemy4,enemy5,enemy6,enemy7,enemy8,enemy9,enemy10];
        //飞镖
        let arrowspr1 = SpriteUtil.createImage('insect');
        let scale = 50/arrowspr1.width;
        arrowspr1.scaleX = scale;
        arrowspr1.scaleY = scale;
        let arrow1 = Matter.Bodies.circle(100,300,scale*arrowspr1.width/2,{
            label:'Body_enemy',
            friction:0,
            frictionAir:0,
            render:{
                sprite:arrowspr1
            }
        },0);
        let arrowspr2 = SpriteUtil.createImage('insect');
        arrowspr2.scaleX = scale;
        arrowspr2.scaleY = scale;
        let arrow2 = Matter.Bodies.circle(SpriteUtil.stageWidth - 100,400,scale*arrowspr2.width/2,{
            label:'Body_enemy',
            friction:0,
            frictionAir:0,
            render:{
                sprite:arrowspr2
            }
        },0);
        Matter.World.add(world,[arrow1,arrow2]);
        this.enemies.push(arrow1);
        this.enemies.push(arrow2);
        //player
        let playerSpr = SpriteUtil.createText('👦',80);
        this.player = Matter.Bodies.circle(50,1250,playerSpr.width/2,{
            stiffness:1,
            collisionFilter:{
            category:this.playerCategory
            },
            render:{
                sprite:playerSpr
            }
        },0);

        //target
        let girl = SpriteUtil.createText('👧',80);
        this.girlbdy = Matter.Bodies.circle(SpriteUtil.stageCenterX,girl.height/2+10,girl.width/2,{
            stiffness:1,
            collisionFilter:{
                category:this.categories[0],
                mask:this.playerCategory | this.categories[0]
            },
            render:{
                sprite:girl
            }
        },0);
        Matter.World.add(world,[this.player,this.girlbdy]);
        //更新
        Matter.Events.on(this.engine,'beforeUpdate',this.beforeUpdateHandle.bind(this));
        //碰撞检测
        Matter.Events.on(this.engine,'collisionStart',this.collisionHandle.bind(this));

        playerSpr.touchEnabled = true;
        playerSpr.addEventListener(egret.TouchEvent.TOUCH_BEGIN,(evt:TouchEvent)=>{
            this.isTouching = true;
        },this);
        playerSpr.addEventListener(egret.TouchEvent.TOUCH_MOVE,(evt:TouchEvent)=>{
            if(this.isTouching){
                Matter.Body.setPosition(this.player,{x:evt['stageX'],y:evt['stageY']});
            }
        },this);
        playerSpr.addEventListener(egret.TouchEvent.TOUCH_END,(evt:TouchEvent)=>{
            this.isTouching = false;
        },this);
        //运动起来 旋转起来
        Matter.Body.setAngularVelocity(this.enemies[0][0],0.1);
        Matter.Body.setAngularVelocity(this.enemies[0][0],this.angleSpeed1);
        Matter.Body.setAngularVelocity(this.enemies[1][0],-this.angleSpeed1);
        Matter.Body.setAngularVelocity(this.enemies[2][0],-this.angleSpeed1);
        Matter.Body.setAngularVelocity(this.enemies[3][0],this.angleSpeed1);
        Matter.Body.setAngularVelocity(this.enemies[4][0],-this.angleSpeed2);
        Matter.Body.setAngularVelocity(this.enemies[5][0],this.angleSpeed2);
        Matter.Body.setAngularVelocity(this.enemies[6][0],-this.angleSpeed3);
        Matter.Body.setAngularVelocity(this.enemies[7][0],this.angleSpeed4);
        Matter.Body.setAngularVelocity(this.enemies[8][0],-this.angleSpeed4);
        Matter.Body.setAngularVelocity(this.enemies[9][0],this.angleSpeed4);

        Matter.Body.setVelocity(this.enemies[10], {x: this.speedDir*5, y: 0 });
        Matter.Body.setVelocity(this.enemies[11],{x: -this.speedDir*5,y:0});
    }

    //bdfore update
    private beforeUpdateHandle(evt){
        if(!this.isRunning) return;
        if(this.enemies[10].position.x > SpriteUtil.stageWidth){
            this.speedDir = -1;
            Matter.Body.setVelocity(this.enemies[10], {x: this.speedDir*5, y: 0 });
            Matter.Body.setVelocity(this.enemies[11],{x: -this.speedDir*5,y:0});
        }
        if(this.enemies[10].position.x < 0){
            this.speedDir = 1;
            Matter.Body.setVelocity(this.enemies[10], {x: this.speedDir*5, y: 0 });
            Matter.Body.setVelocity(this.enemies[11],{x: -this.speedDir*5,y:0});
        }
    }
    //collisionStart
    private collisionHandle(evt){
        let pairs = evt.pairs;
        for(let pair of pairs){
            if(pair.bodyA == this.player || pair.bodyB == this.player){
                if(pair.bodyA.label == 'Body_enemy' || pair.bodyB.label == 'Body_enemy'){
                    this.isRunning = false;
                    this.timeItem.stop();
                    this.player.render.sprite.touchEnabled = false;
                    Matter.Runner.stop(this.runner);
                    EgretRender.stop();
                    Matter.Engine.clear(this.engine);
                    Matter.Sleeping.afterCollisions(pairs,0.01);
                    Matter.Events.off(this.engine,'beforeUpdate',this.beforeUpdateHandle);
                    Matter.Events.off(this.engine,'collisionStart',this.collisionHandle);
                    EffectUtil.showResultEffect();
                }
                else if(pair.bodyA == this.girlbdy || pair.bodyB == this.girlbdy){
                    this.isRunning = false;
                    this.player.render.sprite.touchEnabled = false;
                    Matter.Runner.stop(this.runner);
                    EgretRender.stop();
                    Matter.Engine.clear(this.engine);
                    Matter.Sleeping.afterCollisions(pairs,0.01);
                    Matter.Events.off(this.engine,'collisionStart',this.collisionHandle);
                    if(this.timeItem.leftTime >= 30){
                        EffectUtil.showResultEffect(EffectUtil.PERFECT);
                    }
                    else if(this.timeItem.leftTime >= 15){
                        EffectUtil.showResultEffect(EffectUtil.GREAT);
                    }
                    else{
                        EffectUtil.showResultEffect(EffectUtil.GOOD);
                    }
                    this.timeItem.stop();
                }
            }
        }
    }

    //创建敌人加碰撞过滤
    private createEnemy(xx,yy,category = 0x0001,num = 7){
        let radius = 10;
        let stack1 = Matter.Composites.stack(xx,yy,num,1,0,0,(x,y)=>{
            return Matter.Bodies.circle(x,y,radius,{
                label:'Body_enemy'
            },0);
        });

        let spr = new egret.Sprite();
        for(let i = 0;i < num;i++){
            let t1 = SpriteUtil.createText('🔥',radius*2,0xff0000,false);
            t1.x = i*radius*2;
            spr.addChild(t1);
        }
        spr.anchorOffsetX = spr.width/2 - radius - radius/2;
        let enemy = Matter.Body.create({
            parts:stack1.bodies,
            friction:0,
            frictionAir:0,
            render:{
                sprite:spr
            },
            collisionFilter:{
                category:category,
                mask:this.playerCategory | category
            }
        });
        let constaint1 = Matter.Constraint.create({
            pointB:{x:enemy.position.x,y:enemy.position.y},
            bodyA:enemy,
            stiffness:1,
            friction:0,
            length:0
        });
        return [enemy,constaint1];
    }

    enter(){
        super.enter();
        this.timeItem.start();
    }

    exit(){
        Matter.World.remove(this.engine.world,this.engine.world.bodies,0);
        Matter.World.remove(this.engine.world,this.engine.world.constraints,0);
        Matter.Runner.stop(this.runner);
        EgretRender.stop();
        Matter.Engine.clear(this.engine);
        Matter.Events.off(this.engine,'collisionStart',this.collisionHandle);
        while(this.numChildren > 1){
            let child = this.getChildAt(this.numChildren - 1);
            this.removeChild(child);
        }
        super.exit();
    }

}