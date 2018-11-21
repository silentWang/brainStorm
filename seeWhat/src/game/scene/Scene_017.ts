//堆箱子
class Scene_017 extends BaseScene{
    constructor(){
        super();
        this.init();
    }

    private engine;
    private runner;
    private render;

    private skyBox;
    private boxArr;
    private isCanOperate:boolean = true;
    //丢掉的箱子
    private loseCnt = 0;
    //已使用的箱子
    private usedCnt = 0;
    private intervalId = 0;

    private init(){
        //sdata最多丢弃箱子的数目  tdata目标堆积的箱子数目 score:箱子总数 time:单位毫秒代表箱子移动周期时间
        let shape = new egret.Shape();
        shape.graphics.beginFill(0x00ff00,0.01);
        shape.graphics.drawRect(0,0,SpriteUtil.stageWidth,SpriteUtil.stageHeight);
        shape.graphics.endFill();
        this.addChild(shape);
        this.boxArr = [];
        //初始画引擎部分
        this.engine = Matter.Engine.create({enableSleeping:true},null);
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

        let box = SpriteUtil.createImage(this.dataVo.sData);
        box.x = box.width/2;
        box.y = 120;
        this.addChild(box);
        this.skyBox = box;

        let brbc = '以热爱祖国为荣  以危害祖国为耻\n以服务人民为荣  以背离人民为耻\n以崇尚科学为荣  以愚昧无知为耻\n以辛勤劳动为荣  以好逸恶劳为耻\n以团结互助为荣  以损人利己为耻\n以诚实守信为荣  以见利忘义为耻\n以遵纪守法为荣  以违法乱纪为耻\n以艰苦奋斗为荣  以骄奢淫逸为耻';
        // let bspr = SpriteUtil.createRect(360,200,0x000000);
        let bspr = SpriteUtil.createText(brbc,30,0xff0000,true);
        let body = Matter.Bodies.rectangle(SpriteUtil.stageCenterX,SpriteUtil.stageHeight - bspr.height/2,bspr.width,bspr.height,{
            isStatic:true,
            friction:5,
            frictionStatic:5,
            render:{
                sprite:bspr
            }
        });
        Matter.World.add(this.engine.world,body);

        this.scoreItem = new ScoreItem();
        this.addChild(this.scoreItem);
        this.refreshCnt();

        this.timeItem = new TimeItem(5*60);
        this.addChild(this.timeItem);
        this.timeItem.x = SpriteUtil.stageWidth - 300;
        //循环运动box
        egret.Tween.get(this.skyBox,{loop:true}).to({x:SpriteUtil.stageWidth - this.skyBox.width/2},this.dataVo.time).to({x:this.skyBox.width/2},this.dataVo.time);
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.tapAddBox,this);
        this.intervalId = egret.setInterval(()=>{
            let len = this.boxArr.length;
            for(let i = 0;i < len;i++){
                let bdy = this.boxArr[i];
                if(bdy.position.y > SpriteUtil.stageHeight + 2*bdy.render.sprite.width && !bdy.isStatic){
                    this.loseCnt++;
                    Matter.Body.setStatic(bdy,true);
                    Matter.Body.setPosition(bdy,{x:-(200 + 800*Math.random()),y:bdy.position.y});
                }
            }
            this.checkResult();
        },this,100);
    }

    private tapAddBox(evt){
        if(!this.isCanOperate) return;
        GameSound.instance().playSound('click');
        this.usedCnt++;
        this.isCanOperate = false;
        if(this.usedCnt > this.dataVo.score){
            EffectUtil.showResultEffect();
            return;
        }
        GameSound.instance().playSound('click');
        let idx = egret.setTimeout(()=>{
            egret.clearTimeout(idx);
            this.isCanOperate = true;
        },this,500);

        this.refreshCnt();
        this.createBox();
    }
    //创建墙壁
    private createBox(){
        let xx = this.skyBox.x;
        let yy = this.skyBox.y;
        let len = this.boxArr.length;
        for(let i = 0;i < len;i++){
            let bdy = this.boxArr[i];
            if(bdy.position.y > SpriteUtil.stageHeight + bdy.render.sprite.width/2 && bdy.position.x < -200){
                Matter.Body.setStatic(bdy,false);
                Matter.Body.setAngle(bdy,0);
                Matter.Body.setAngularVelocity(bdy,0);
                Matter.Body.setVelocity(bdy,{x:0,y:0});
                Matter.Body.setPosition(bdy,{x:xx,y:yy});
                Matter.Body.set(bdy,"restitution",0);
                Matter.Body.set(bdy,"friction",1);
                Matter.Body.set(bdy,'isSleeping',false);
                return;
            }
        }

        let sprite = SpriteUtil.createImage(this.dataVo.sData);
        let body = Matter.Bodies.rectangle(xx,yy,sprite.width,sprite.height,{
            frictionAir:0.005,
            friction:0.5,
            mass:10,
            render:{
                sprite:sprite
            }
        });
        Matter.World.add(this.engine.world,body);
        this.boxArr.push(body);
    }

    private checkResult(){
        this.refreshCnt();
        if(this.usedCnt < this.dataVo.tData) return;
        let cnt = 0;
        for(let bdy of this.boxArr){
            if(!bdy.isStatic && bdy.position.y <= SpriteUtil.stageHeight - 80 && bdy.isSleeping){
                cnt++;
            }
        }
        if(cnt >= this.dataVo.tData){
            this.isCanOperate = false;
            let time = this.timeItem.leftTime;
            this.destroy();
            if(time >= 1.5*60){
                EffectUtil.showResultEffect(EffectUtil.PERFECT);
            }
            else if(time >= 2.5*60){
                EffectUtil.showResultEffect(EffectUtil.GREAT);
            }
            else{
                EffectUtil.showResultEffect(EffectUtil.GOOD);
            }
        }
        else{
            let leftcnt = this.dataVo.score - this.usedCnt;
            if(leftcnt + this.usedCnt - this.loseCnt < this.dataVo.tData){
                this.isCanOperate = false;
                this.destroy();
                EffectUtil.showResultEffect();
            }
        }
    }

    private refreshCnt(){
        let str = `剩余 ${this.dataVo.score - this.usedCnt}  目标 ${this.dataVo.tData}`;
        this.scoreItem.setCustomText(str);
    }

    private destroy(){
        this.timeItem.stop();
        egret.clearInterval(this.intervalId);
        egret.Tween.removeTweens(this.skyBox);
        this.isCanOperate = false;
        Matter.Runner.stop(this.runner);
        EgretRender.stop();
        Matter.Engine.clear(this.engine);
        Matter.World.remove(this.engine.world,this.engine.world.bodies,0);
    }

    enter(){
        super.enter();
        this.timeItem.start((time)=>{
            if(time < 0){
                this.destroy();
                this.timeItem.stop();
                EffectUtil.showResultEffect();
            }
        },this);
    }

    exit(){
        this.destroy();
        super.exit();
    }

}