var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var Scene_1 = (function (_super) {
    __extends(Scene_1, _super);
    function Scene_1() {
        var _this = _super.call(this) || this;
        _this.init();
        return _this;
    }
    Scene_1.prototype.init = function () {
        var engine = Matter.Engine.create({ enableSleeping: true }, null);
        var world = engine.world;
        var runner = Matter.Runner.create(null);
        //设置runner以固定帧率计算
        runner.isFixed = true;
        var render = EgretRender.create({
            engine: engine,
            element: document.body,
            options: {
                width: SpriteUtil.stageWidth,
                height: SpriteUtil.stageHeight,
                container: this,
                wireframes: false,
            }
        });
        Matter.Runner.run(runner, engine);
        EgretRender.run(render);
        //事件相关
        Matter.Events.on(world, 'afterAdd', function (evt) {
            console.log('add body ....', evt);
        });
        Matter.Events.on(engine, 'beforeUpdate', function (evt) {
            // console.log('before update ...',evt);
        });
        Matter.Events.on(engine, 'collisionStart', function (evt) {
            console.log('collision start..', evt);
            var pairs = evt.pairs;
            for (var _i = 0, pairs_1 = pairs; _i < pairs_1.length; _i++) {
                var pair = pairs_1[_i];
                pair.bodyA.render.fillStyle = 0xff0000;
                pair.bodyB.render.fillStyle = 0xff0000;
            }
        });
        Matter.Events.on(engine, 'collisionActive', function (evt) {
            console.log('collision active', evt);
            var pairs = evt.pairs;
            for (var _i = 0, pairs_2 = pairs; _i < pairs_2.length; _i++) {
                var pair = pairs_2[_i];
                pair.bodyA.render.fillStyle = 0x00ff00;
                pair.bodyB.render.fillStyle = 0x00ff00;
            }
        });
        Matter.Events.on(engine, 'collisionEnd', function (evt) {
            console.log('collision end', evt);
            var pairs = evt.pairs;
            for (var _i = 0, pairs_3 = pairs; _i < pairs_3.length; _i++) {
                var pair = pairs_3[_i];
                pair.bodyA.render.fillStyle = 0x0000ff;
                pair.bodyB.render.fillStyle = 0x0000ff;
            }
        });
        // let stack = Matter.Composites.stack(70, 100, 9, 4, 50, 50, function(x, y) {
        //     return Matter.Bodies.circle(x, y, 15, { restitution: 1 ,render:{fillStyle:0x00FFFF}},0);
        // });
        var circle = Matter.Bodies.circle(250, 50, 50, {
            restitution: 1,
            render: {
                fillStyle: 0xFFFF00
            }
        }, 0);
        var rect = Matter.Bodies.rectangle(200, 300, 350, 50, {
            restitution: 1,
            render: {
                fillStyle: 0xFFFF00
            }
        });
        Matter.World.add(world, [circle, rect]);
        //碰撞相关
        // let defaultCategory = 0x0001;
        // let redCategory = 0x0002;
        // let greenCategory = 0x0004;
        // let blueCategory = 0x0008;
        // let stack = Matter.Composites.stack(20,800,15,15,0,0,(x,y,columns,rows)=>{
        //     let category = redCategory;
        //     let color = 0xFF0000;
        //     if(columns <= 10 && columns > 5){
        //         category = greenCategory;
        //         color = 0x00FF00;
        //     }
        //     if(columns > 10){
        //         category = blueCategory;
        //         color = 0x0000FF;
        //     }
        //     return Matter.Bodies.circle(x,y,20,{
        //         collisionFilter:{
        //             category:category,
        //         },
        //         render:{
        //             strokeStyle:color,
        //             fillStyle:'transparent',
        //             lineWidth:1
        //         }
        //     },0);
        // });
        // Matter.World.add(world,stack);
        // Matter.World.add(world,Matter.Bodies.circle(400,50,50,{
        //     collisionFilter:{
        //         mask:defaultCategory | redCategory
        //     },
        //     render:{
        //         strokeStyle:0xff0000,
        //         fillStyle:0xff0000,
        //         lineWidth:1
        //     }
        // },0));
        // Matter.World.add(world,Matter.Bodies.circle(400,150,50,{
        //     collisionFilter:{
        //         mask:defaultCategory | greenCategory
        //     },
        //     render:{
        //         strokeStyle:0x00ff00,
        //         fillStyle:0x00ff00,
        //         lineWidth:1
        //     }
        // },0));
        // Matter.World.add(world,Matter.Bodies.circle(400,200,50,{
        //     collisionFilter:{
        //         mask:defaultCategory | blueCategory
        //     },
        //     render:{
        //         strokeStyle:0x0000ff,
        //         fillStyle:0x0000ff,
        //         lineWidth:1
        //     }
        // },0));
        //约束和睡眠
        //constraint 约束总汇
        // let s3 = Matter.Bodies.polygon(150,200,3,30,{stiffness:0.05});
        // let constraint3 = Matter.Constraint.create({
        //     pointA:{x:150,y:100},
        //     pointB:{x:-10,y:-10},
        //     bodyB:s3
        // });
        // Matter.World.add(world,[s3,constraint3]);
        // let s5 = Matter.Bodies.polygon(300,200,5,30,{stiffness:0.01});
        // let con5 = Matter.Constraint.create({
        //     pointA:{x:300,y:100},
        //     pointB:{x:-10,y:-10},
        //     bodyB:s5,
        //     stiffness: 0.001
        // });
        // Matter.World.add(world,[s5,con5]);
        // let rect = Matter.Bodies.rectangle(450,400,300,50,{});
        // let ball = Matter.Bodies.circle(400,100,30,{restitution:0.5,mass:10},0);
        // let conrect = Matter.Constraint.create({
        //     bodyB:rect,
        //     pointA:{x:rect.position.x,y:rect.position.y},
        //     length:0
        // });
        // Matter.World.add(world,[rect,ball,conrect]);
        // //rect constraint to ball
        // let rect1 = Matter.Bodies.rectangle(200,600,120,120,{friction:0.8});
        // let ball1 = Matter.Bodies.circle(200,200,60,null,0);
        // let rbcon = Matter.Constraint.create({
        //     bodyA:rect1,
        //     bodyB:ball1,
        //     pointA:{x:0,y:0},
        //     pointB:{x:0,y:0},
        //     stiffness:0.001
        // });
        // Matter.World.add(world,[rect1,ball1,rbcon]);
        // Matter.Events.on(ball,'sleepStart sleepEnd',()=>{
        //     if(ball.isSleeping){
        //         ball.isSleeping = false;
        //         Matter.Body.setVelocity(ball,{x:0,y:-50});
        //     }
        //     console.log(ball.isSleeping);
        // });
        // Matter.Events.on(engine,'beforeUpdate',()=>{
        //     if(rect1.isSleeping){
        //         console.log(rect1.isSleeping);
        //         Matter.Body.setVelocity(rect1,{x:0,y:-10});
        //     }
        // });
        //组合的body
        // let stack = Matter.Composites.stack(100,0,6,6,0,0,(x,y)=>{
        //     let rect = SpriteUtil.createRect(80,30);
        //     let circle = SpriteUtil.createCircle(30,0xffffff*Math.random());
        //     let sprite = new egret.Sprite();
        //     sprite.addChild(rect);
        //     sprite.addChild(circle);
        //     // sprite.anchorOffsetX = sprite.width/2;
        //     // sprite.anchorOffsetY = sprite.height/2;
        //     sprite.x = x;
        //     sprite.y = y;
        //     let bodyA = Matter.Bodies.rectangle(x,y,rect.width,rect.height,null);
        //     let bodyB = Matter.Bodies.circle(x,y,30,null,0);
        //     return Matter.Body.create({parts:[bodyA,bodyB],render:{sprite:sprite}});
        // });
        // Matter.World.add(world,stack);
        //绳子
        // let group = Matter.Body.nextGroup(true);
        // let stack = Matter.Composites.stack(50,50,1,10,0,0,(x,y)=>{
        //     let rect1 = SpriteUtil.createRect(50,50);
        //     return Matter.Bodies.rectangle(x,y,50,50,{render:{sprite:rect1}}); 
        // });
        // let rope1 = Matter.Composites.chain(stack,0.5,0,-0.5,0,{stiffness:1,length:2,render:{type:'line'}});
        // let constraint = Matter.Composite.add(rope1,Matter.Constraint.create({
        //     bodyB:stack.bodies[0],
        //     pointB:{x:-25,y:0},
        //     pointA:{x:stack.bodies[0].position.x,y:stack.bodies[0].position.y},
        //     stiffness:0.01
        // }));
        // Matter.World.add(world,[stack]);
        //约束 和 跷跷板
        // let grp = Matter.Body.nextGroup(true);
        // let stack = Matter.Composites.stack(120,600,1,4,0,0,(x,y)=>{
        // let rect1 = SpriteUtil.createRect(50,50);
        // return Matter.Bodies.rectangle(x,y,50,50,{render:{sprite:rect1}});
        // });
        // let circle = SpriteUtil.createCircle(50);
        // let cbody = Matter.Bodies.circle(600,0,50,{
        //     render:{sprite:circle},
        //     frictionAir:0.001,
        //     density:0.5
        // },0);
        // let rect2 = SpriteUtil.createRect(600,20,0xffffff*Math.random());
        // let catapult = Matter.Bodies.rectangle(400,960,rect2.width,rect2.height,{collisionFilter:{group:grp},render:{sprite:rect2}});
        // let cons = Matter.Constraint.create({
        //     bodyA:catapult,
        //     pointB:Matter.Vector.clone(catapult.position),
        //     stiffness:1,
        //     length:0
        // });
        // Matter.World.add(world,[
        //     stack,
        //     cbody,
        //     catapult,
        //     Matter.Bodies.rectangle(180, 1000, 20, 50, { isStatic: true }),
        //     Matter.Bodies.rectangle(400, 980, 20, 80, { isStatic: true, collisionFilter: { group: grp } }),
        //     cons
        // ]);
        //car
        // let scale = 0.6;
        // let car1 = Matter.Composites.car(200,0,200*scale,50*scale,50*scale);
        // let rect1 = SpriteUtil.createRect(700,20);
        // let grnd1 = Matter.Bodies.rectangle(250,200,700,20,{isStatic:true,angle:Math.PI*0.25,render:{sprite:rect1}});
        // let rect2 = SpriteUtil.createRect(700,20);
        // let grnd2 = Matter.Bodies.rectangle(500,750,700,20,{isStatic:true,angle:-Math.PI*0.25,render:{sprite:rect2}});
        // Matter.World.add(world,[grnd1,grnd2,car1]);
        //桥
        // let group = Matter.Body.nextGroup(true);
        // let bridge = Matter.Composites.stack(140,250,15,1,0,0,(x,y)=>{
        //     let rect = SpriteUtil.createRect(53,20,0xffffff*Math.random());
        //     return Matter.Bodies.rectangle(x-20,y,rect.width,rect.height,{
        //         collisionFilter:{group:group},
        //         chamfer:5,
        //         density:0.005,
        //         frictionAir:0.01,
        //         render:{
        //             sprite:rect
        //         }
        //     });
        // });
        // Matter.Composites.chain(bridge,0.3,0,-0.3,0,{
        //     stiffness:1,
        //     length:0,
        //     render:{
        //         visible:true
        //     }
        // });
        // let stack = Matter.Composites.stack(200,50,6,3,0,0,(x,y)=>{
        //     let rect = SpriteUtil.createRect(50,50,0xffffff*Math.random());
        //     return Matter.Bodies.rectangle(x,y,50,50,{
        //         render:{
        //             sprite:rect
        //         },
        //         frictionAir:0.1
        //     }); 
        // });
        // Matter.World.add(world,[
        //     bridge,
        //     stack,
        //     Matter.Bodies.rectangle(30,800,220,380,{isStatic:true,chamfer:{radius:20}}),
        //     Matter.Bodies.rectangle(660,800,220,380,{isStatic:true,chamfer:{radius:20}}),
        //     Matter.Constraint.create({
        //         pointA:{x:140,y:800},
        //         bodyB:bridge.bodies[0],
        //         pointB:{x:-25,y:0},
        //         length:2,
        //         stiffness:0.9
        //     }),
        //     Matter.Constraint.create({
        //         pointA: { x: 550, y: 800 }, 
        //         bodyB: bridge.bodies[bridge.bodies.length - 1], 
        //         pointB: { x: 25, y: 0 },
        //         length: 2,
        //         stiffness: 0.9
        //     })
        // ]);
        //Composites 组合body
        // let stack = Matter.Composites.stack(20,20,20,20,0,0,(x,y)=>{
        //     let circle = SpriteUtil.createCircle(Matter.Common.random(10,20),0xffffff*Math.random());
        //     return Matter.Bodies.circle(x,y,circle.width/2,{
        //         friction:0.001,
        //         restitution:0.4,
        //         density:0.001,
        //         render:{
        //             sprite:circle
        //         }
        //     },0);
        // });
        // Matter.World.add(world,[
        //     stack,
        //     Matter.Bodies.polygon(200, 460, 3, 60,null),
        //     Matter.Bodies.polygon(400, 460, 10, 60,null),
        //     Matter.Bodies.rectangle(600, 460, 80, 80,null)
        // ]);
        // //Composites 组合
        // let stack = Matter.Composites.stack(20,20,20,5,0,0,(x,y)=>{
        //     let circle = SpriteUtil.createCircle(Matter.Common.random(10,20),0xffffff*Math.random());
        //     return Matter.Bodies.circle(x,y,circle.width/2,{
        //         friction:0.001,
        //         restitution:0.5,
        //         density:0.001,
        //         render:{
        //             sprite:circle
        //         }
        //     },null);
        // })
        // Matter.World.add(world,stack);
        // //添加斜板
        // Matter.World.add(world,[
        //     Matter.Bodies.rectangle(200,150,500,20,{isStatic:true,angle:Math.PI*0.06}),
        //     Matter.Bodies.rectangle(500,350,500,20,{isStatic:true,angle:-Math.PI*0.06}),
        //     Matter.Bodies.rectangle(340,580,500,20,{isStatic:true,angle:Math.PI*0.04})
        // ]);
        //基础
        // let bitmap = new egret.Bitmap(RES.getRes('smiley_002_png'));
        // bitmap.width = bitmap.width/2;
        // bitmap.height = bitmap.height/2;
        // bitmap.anchorOffsetX = bitmap.width/2;
        // bitmap.anchorOffsetY = bitmap.height/2;
        // let boxA = Matter.Bodies.rectangle(200,80,bitmap.width,bitmap.height,{
        //     render:{
        //         sprite:bitmap
        //     },
        //     frictionAir:0.5
        // });
        // bitmap.touchEnabled = true;
        // bitmap.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
        //     // boxA.position[1] = 10;
        //     console.log('ccccccccc');
        //     boxA.frictionAir = 0.01;
        // },this);
        // let shape = SpriteUtil.createCircle(60);
        // let boxB = Matter.Bodies.circle(80,80,60,{
        //     render:{
        //         sprite:shape
        //     },
        //     frictionAir:0.01
        // },null);
        var gsh = new egret.Shape();
        gsh.graphics.beginFill(0xfffff0);
        gsh.graphics.drawRect(0, 0, 720, 50);
        gsh.graphics.endFill();
        gsh.anchorOffsetX = gsh.width / 2;
        gsh.anchorOffsetY = gsh.height / 2;
        var ground = Matter.Bodies.rectangle(360, 1260, 720, 50, {
            isStatic: true,
            render: {
                sprite: gsh
            }
        });
        Matter.World.add(world, [ground]);
    };
    return Scene_1;
}(BaseScene));
__reflect(Scene_1.prototype, "Scene_1");
//# sourceMappingURL=Scene_1.js.map