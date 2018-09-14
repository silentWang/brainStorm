class Scene_016 extends BaseScene{
    constructor(){
        super();
        this.init();
    }

    private pointArr = [];
    private isBegin:boolean = false;
    private player:egret.TextField;
    private shape:egret.Shape;
    private lastPoint;
    private init(){
        this.shape = new egret.Shape();
        this.addChild(this.shape);

        let shape = new egret.Shape();
        shape.graphics.beginFill(0xff0000,0.001);
        shape.graphics.drawRect(0,0,SpriteUtil.stageWidth,SpriteUtil.stageHeight);
        shape.graphics.endFill();
        this.addChild(shape);
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.touchHandler,this);
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.touchHandler,this);
        this.addEventListener(egret.TouchEvent.TOUCH_END,this.touchHandler,this);

        this.player = SpriteUtil.createText(this.dataVo.sData,48);
        this.addChild(this.player);
        this.player.visible = false;
    }

    private touchHandler(evt){
        if(evt.type == egret.TouchEvent.TOUCH_BEGIN){
            this.isBegin = true;
        }
        else if(evt.type == egret.TouchEvent.TOUCH_MOVE){
            if(this.isBegin){
                let point = {x:evt['stageX'],y:evt['stageY']};
                this.shape.graphics.lineStyle(10,0xff0000,1);
                this.shape.graphics.lineTo(point.x,point.y);
                if(!this.lastPoint){
                    this.pointArr.push(point);
                }
                else{
                    let mx = this.lastPoint.x - point.x;
                    let my = this.lastPoint.y - point.y;
                    let mid = Math.sqrt(mx*mx+my*my);
                    if(mid > 10){
                        this.pointArr.push(point);
                    }
                }
                this.lastPoint = point;
            }
        }
        else if(evt.type == egret.TouchEvent.TOUCH_END){
            this.isBegin = false;
            console.log(this.pointArr);
            this.player.x = this.pointArr[0].x;
            this.player.y = this.pointArr[0].y;
            this.player.visible = true;
            this.startFly();
        }
    }

    private startFly(){
        let index = 1;
        let len = this.pointArr.length;
        let idx = egret.setInterval(()=>{
            if(index >= len){
                egret.clearInterval(idx);
                return;
            }
            let point = this.pointArr[index];
            this.player.x = point.x;
            this.player.y = point.y;
            index++;
        },this,40);
    }

}