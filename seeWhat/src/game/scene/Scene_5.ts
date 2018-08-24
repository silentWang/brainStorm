//只能吃水果
class Scene_5 extends BaseScene{
    constructor(){
        super();
        this.init();
    }

    //引擎部分
    private engine;
    private runner;
    private render;
    private player;
    private fruits;
    private others;
    //item body 组
    private fruitArr:Array<any>;
    //待回收的item组
    private recycleArr:Array<any>;
    private itemCategory = 0x0002;
    private playerCategory = 0x0100;
    private isTouching:boolean = false;
    
    private init(){
        this.engine = Matter.Engine.create({enableSleeping:false},null);
        this.runner = Matter.Runner.create(null);
        this.render = EgretRender.create({
            engine:this.engine,
            container:this,
            options:{
                width:SpriteUtil.stageWidth,
                height:SpriteUtil.stageHeight,
                wireframes:true
            }
        });
        Matter.Runner.run(this.runner,this.engine);
        EgretRender.run(this.render);
        this.engine.world.gravity.y = 0;

        this.recycleArr = [];
        this.initAllItem();

        let plySpr = SpriteUtil.createText('🙉',100);
        this.player = Matter.Bodies.circle(100,1230,plySpr.height/2,{
            isStatic:true,
            collisionFilter:{
                category:this.playerCategory
            },
            render:{
                sprite:plySpr
            }
        },0);
        Matter.World.add(this.engine.world,this.player);
        plySpr.touchEnabled = true;
        plySpr.addEventListener(egret.TouchEvent.TOUCH_BEGIN,()=>{
            this.isTouching = true;
        },this);
        plySpr.addEventListener(egret.TouchEvent.TOUCH_MOVE,(evt)=>{
            if(this.isTouching){
                Matter.Body.setPosition(this.player,{x:evt['stageX'],y:1230});
            }
        },this);
        plySpr.addEventListener(egret.TouchEvent.TOUCH_END,()=>{
            this.isTouching = false;
        },this);

        Matter.Events.on(this.engine,'beforeUpdate',this.beforeUpdate.bind(this));
        Matter.Events.on(this.engine,'collisionStart',this.collisionStart.bind(this));

        let ids = egret.setInterval(()=>{
            if(!this.playAttack()){
                egret.clearInterval(ids);
            }
        },this,500);
    }
    //创建items
    private initAllItem(){
        this.recycleArr = [];
        this.fruitArr = [];
        let arr1 = ['🍏','🍐','🍑','🍒','🍓','🍅','🍇','🍈','🍉','🍊','🍋','🍌','🍍'];
        let arr2 = ['💩','🍖','🍗','🍬','🍔','🍕','🍩','🍡','⚽','🍭','🍟','💣','🔋'];
        let len1 = arr1.length;
        let len2 = arr2.length;
        let index = 0;
        for(let i = 0;i < 80;i++){
            let xx = 50 + (i%10)*70;
            let yy = 25 + 70*Math.floor(i/10);
            let fruit;
            if(Math.random() > 0.5){
                index = Math.floor(len1*Math.random());
                fruit = this.createItem(arr1[index],'fruit',xx,yy);
            }
            else{
                index = Math.floor(len2*Math.random());
                fruit = this.createItem(arr2[index],'enemy',xx,yy);
            }
            this.fruitArr.push(fruit);
        }
        Matter.World.add(this.engine.world,this.fruitArr);
    }

    private beforeUpdate(){
        if(!this.recycleArr || this.recycleArr.length == 0) return;
        this.removeBody();
    }

    private collisionStart(evt){
        let pairs = evt.pairs;
        for(let pair of pairs){
            if(pair.bodyA == this.player){
                if(pair.bodyB.name == 'fruit'){
                    this.removeBody(pair.bodyB);
                }
                else if(pair.bodyB.name == 'enemy'){
                    this.destroy();
                    Game.instance().gameScene.gotoOver();
                }
            }
            else if(pair.bodyB == this.player){
                if(pair.bodyA.name == 'fruit'){
                    this.removeBody(pair.bodyA);
                }
                else if(pair.bodyA.name == 'enemy'){
                    this.destroy();
                    Game.instance().gameScene.gotoOver();
                }
            }
        }
    }

    //回收
    private removeBody(tbody = null){
        if(tbody){
            let index = this.recycleArr.indexOf(tbody);
            if(index >= 0){
                this.recycleArr.splice(index,1);
                Matter.World.remove(this.engine.world,tbody,0);
                this.removeChild(tbody.render.sprite);
            }
        }
        else{
            let len = this.recycleArr.length;
            for(let i = len - 1;i>=0;i--){
                let body = this.recycleArr[i];
                if(body.position.y > SpriteUtil.stageHeight){
                    Matter.World.remove(this.engine.world,body,0);
                    this.recycleArr.splice(i,1);
                    this.removeChild(body.render.sprite);
                }
            }
        }
    }
    //item开始下落
    private playAttack(){
        let len = this.fruitArr.length;
        if(len <= 0){
            if(this.recycleArr.length == 0){
                this.destroy();
                EventCenter.instance().dispatchEvent(new GameEvent(GameEvent.GOTO_NEXT));
                return false;
            }
            return true;
        }
        let num1 = Math.floor(len * Math.random());
        let body = this.fruitArr.splice(num1,1)[0];
        this.recycleArr.push(body);
        let dx = this.player.position.x - body.position.x;
        let dy = this.player.position.y - body.position.y;
        let rate = dy/dx;
        if(rate > 5){
            rate = 5;
        }
        if(rate < -5){
            rate = -5;
        }
        let fx = dx/Math.abs(dx);
        let fy = fx*rate;
        Matter.Body.setVelocity(body,{x:fx*3,y:fy*3});
        Matter.Body.setAngularVelocity(body,0.01*fx);
        return true;
    }

    //create fruit
    private createItem(cstr:string,name:string,sx:number = 0,sy:number = 0){
        let item = SpriteUtil.createText(cstr,50);
        let itemBody = Matter.Bodies.circle(sx,sy,item.width/2,{
            name:name,
            frictionAir:0,
            collisionFilter:{
                category:this.itemCategory,
                mask:this.playerCategory | 0x0001
            },
            render:{
                sprite:item
            }
        },0);
        return itemBody;
    }

    //destroy
    private destroy(){
        Matter.Runner.stop(this.runner);
        EgretRender.stop();
        Matter.Engine.clear(this.engine);
        Matter.Events.off(this.engine,'beforeUpdate',this.beforeUpdate);
        Matter.Events.off(this.engine,'collisionStart',this.collisionStart);
        Matter.World.remove(this.engine.world,this.engine.world.bodies,0);
        Matter.World.remove(this.engine.world,this.engine.world.constraints,0);
    }

    exit(){
        this.destroy();
        while(this.numChildren > 1){
            let child = this.getChildAt(this.numChildren - 1);
            this.removeChild(child);
        }
        super.exit();
    }

}