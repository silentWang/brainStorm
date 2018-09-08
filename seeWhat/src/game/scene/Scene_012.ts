//一笔画
class Scene_012 extends BaseScene{
    constructor(){
        super();
        this.init();
    }

    private pathShape:egret.Shape;
    private isTouching:boolean = false;
    private startPoint:egret.Point;
    //欧拉路径 顶点数 2个奇数顶点 一个起点  一个终点
    //欧拉回路的一个原理：凡是只有两个奇点的连通图（其余都为偶点），一定可以一笔画成。画时必须把一个奇点为起点，另一个奇点终点。
    //线数组 每条线是由两个顶点组成
    private lineEs;
    //顶点数组
    private lineVs;
    //
    private paths;
    private lineCount = 0;
    private init(){
        this.lineVs = [
                {x:150,y:270},
                {x:540,y:270},
                {x:350,y:520},
                {x:360,y:180},
                {x:470,y:640},
                {x:300,y:660},
                {x:280,y:850},
                {x:570,y:840},
                {x:500,y:980},
                {x:230,y:1000},
            ];
        this.lineEs = [
            {start:this.lineVs[0],end:this.lineVs[1]},
            {start:this.lineVs[1],end:this.lineVs[2]},
            {start:this.lineVs[0],end:this.lineVs[2]},
            {start:this.lineVs[0],end:this.lineVs[3]},
            {start:this.lineVs[3],end:this.lineVs[4]},
            {start:this.lineVs[4],end:this.lineVs[2]},
            {start:this.lineVs[2],end:this.lineVs[5]},
            {start:this.lineVs[5],end:this.lineVs[6]},
            {start:this.lineVs[6],end:this.lineVs[4]},
            {start:this.lineVs[4],end:this.lineVs[5]},
            {start:this.lineVs[5],end:this.lineVs[0]},
            {start:this.lineVs[0],end:this.lineVs[6]},
            {start:this.lineVs[6],end:this.lineVs[7]},
            {start:this.lineVs[7],end:this.lineVs[4]},
            {start:this.lineVs[4],end:this.lineVs[1]},
            {start:this.lineVs[1],end:this.lineVs[7]},
            {start:this.lineVs[7],end:this.lineVs[8]},
            {start:this.lineVs[8],end:this.lineVs[6]},
            {start:this.lineVs[6],end:this.lineVs[9]},
            {start:this.lineVs[9],end:this.lineVs[8]},
            {start:this.lineVs[8],end:this.lineVs[4]}
        ];


        this.drawLines();
        this.pathShape = new egret.Shape();
        this.addChild(this.pathShape);
        this.drawCircles();

        this.paths = [];
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
        // this.touchEnabled = true;
        // this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.touchHandler,this);
    }

    private touchHandler(evt){
        // let point = {x:evt['stageX'],y:evt['stageY']};
        // this.lineVs.push(point);
        // this.drawLines();
    }
    //点击开始连线
    private clkStart(evt){
        let ptshape = evt.target;
        let name = ptshape.name;
        let index = name.split('_')[1];
        let point = this.lineVs[index];

        if(this.isCanDraw(point)){
            ptshape.alpha = 1;
            this.drawPath();
            if(this.lineEs.length == 0){
                let leftTime = this.timeItem.leftTime;
                this.timeItem.stop();
                let idx = egret.setTimeout(()=>{
                    egret.clearTimeout(idx);
                    if(leftTime >= 60){
                        EffectUtil.showResultEffect(EffectUtil.PERFECT);
                    }
                    else if(leftTime >= 45){
                        EffectUtil.showResultEffect(EffectUtil.EXCELLENT);
                    }
                    else{
                        EffectUtil.showResultEffect(EffectUtil.GOOD);
                    }
                },this,200);
            }
        }
        else{
            let alpha = ptshape.alpha == 1 ? 0.5 : 1;
            egret.Tween.get(ptshape).to({alpha:alpha},300).to({alpha:ptshape.alpha},300).call(()=>{
                egret.Tween.removeTweens(ptshape);
            });
        }
    }
    //当前划线是否在原线数组重
    private isCanDraw(point){
        let plen = this.paths.length;
        if(plen == 0){
            this.paths.push(point);
            return true;
        }
        let start1 = this.paths[plen - 1];
        let end1 = point;
        let len = this.lineEs.length;
        for(let i = len - 1;i >= 0;i--){
            let start2 = this.lineEs[i].start;
            let end2 = this.lineEs[i].end;
            if(start1.x == start2.x && end1.x == end2.x && start1.y == start2.y && end1.y == end2.y){
                this.lineEs.splice(i,1);
                this.paths.push(point);
                return true;
            }
            else if(start1.x == end2.x && start1.y == end2.y && start2.x == end1.x && start2.y == end1.y){
                this.lineEs.splice(i,1);
                this.paths.push(point);
                return true;
            }
        }
        return false;
    }
    //
    private drawPath(){
        this.pathShape.graphics.clear();
        if(this.paths.length == 0) return;
        this.pathShape.graphics.lineStyle(10,0xff0000);
        this.pathShape.graphics.moveTo(this.paths[0].x,this.paths[0].y);
        for(let i = 1;i < this.paths.length;i++){
            let pt = this.paths[i];
            this.pathShape.graphics.lineTo(pt.x,pt.y);
        }
    }

    //画线
    drawLines(){
        let line = new egret.Shape();
        line.graphics.clear();
        line.graphics.lineStyle(10,0x7AC5CD,0.8);
        for(let i = 0;i < this.lineEs.length;i++){
            let start = this.lineEs[i].start;
            let end = this.lineEs[i].end;
            line.graphics.moveTo(start.x,start.y);
            line.graphics.lineTo(end.x,end.y);
        }
        this.addChild(line);
    }
    //画点
    drawCircles(){
        for(let i = 0;i < this.lineVs.length;i++){
            let shape = new egret.Shape();
            let point = this.lineVs[i];
            shape.graphics.lineStyle(1,0x000000);
            shape.graphics.beginFill(0xffffff);
            shape.graphics.drawCircle(point.x,point.y,20);
            shape.graphics.endFill();
            shape.alpha = 0.5;
            this.addChild(shape);
            shape.name = 'vertex_'+i;
            shape.addEventListener(egret.TouchEvent.TOUCH_TAP,this.clkStart,this);
            shape.touchEnabled = true;
        }
    }

    enter(){
        super.enter();
        this.timeItem.start();
    }

}