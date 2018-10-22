//移动箱子消除
class Scene_019 extends BaseScene{
    constructor(){
        super();
        this.init();
    }

    private allBoxDataArr = [];
    private curSelectIndex = -1;
    private isCanOperate = true;
    private stepNums = 0;
    //列 行
    private ROWS = 10;
    private COLUMNS = 8;
    private init(){
        //游戏共8*10个格子  
        //算法思想 a、首先记录交换的两个箱子的index ->> b、交换index ->> c、对每一个index查找与其相邻的横竖格子是否有相同类型的箱子 
        // ->> d、有则保存到一个临时数组 ->> e、如果临时数组长度大于3则可消除 ->> f、记录消除后这些箱子上方需要下落的箱子的索引 ->> 回到c直到查找的数组为空 则停止
        let arr = [];
        let sprite = new egret.Sprite();
        for(let i = 0;i < this.COLUMNS * this.ROWS;i++){
            let img = SpriteUtil.createImage('box');
            img.anchorOffsetX = 0;
            img.anchorOffsetY = 0;
            img.touchEnabled = false;
            let shape = new egret.Shape();
            shape.graphics.lineStyle(2,0x0000ff,1);
            shape.graphics.moveTo(0,0);
            shape.graphics.lineTo(img.width,0);
            shape.graphics.lineTo(img.width,img.height);
            shape.graphics.lineTo(0,img.height);
            shape.graphics.lineTo(0,0);
            shape.visible = false;
            let spr = new egret.Sprite();
            spr.name = this.dataVo.sData[0]+'_'+i;
            spr.x = (img.width + 2) * (i%this.COLUMNS);
            spr.y = (img.width + 2) * Math.floor(i/this.COLUMNS);
            spr.addChild(img);
            spr.addChild(shape);
            sprite.addChild(spr);
            spr.touchEnabled = true;
            spr.addEventListener(egret.TouchEvent.TOUCH_TAP,this.tapExchange,this);
            arr.push({index:i,box:spr});
        }
        sprite.x = SpriteUtil.stageCenterX - sprite.width/2;
        sprite.y = 200;
        this.addChild(sprite);
        this.allBoxDataArr = arr;

        let rect = SpriteUtil.createRect(SpriteUtil.stageWidth,SpriteUtil.stageHeight - sprite.height - sprite.y,0x000000);
        rect.anchorOffsetX = 0;
        rect.anchorOffsetY = 0;
        rect.y = sprite.y + sprite.height;
        this.addChild(rect);

        let btn = SpriteUtil.createButton("重置",160,80,0x0000ff,36);
        btn.x = SpriteUtil.stageCenterX - btn.width/2;
        btn.y = SpriteUtil.stageHeight - 200;
        this.addChild(btn);
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            if(!this.isCanOperate) return;
            this.createList();
        },this);

        this.scoreItem = new ScoreItem();
        this.addChild(this.scoreItem);
        this.createList();
    }

    private createList(){
        for(let bda of this.allBoxDataArr){
            bda.box.visible = false;
        }

        for(let i = 0;i < this.dataVo.sData.length;i++){
            let config = this.dataVo.sData[i];
            let box = this.allBoxDataArr[config.index].box;
            box.getChildAt(0).texture = RES.getRes(`${config.box}_png`);
            box.visible = true;
            box.name = `${config.box}_${config.index}`;
        }

        this.stepNums = this.dataVo.tData;
        this.scoreItem.setCustomText(`剩余步数  ${this.stepNums}`);
    }

    private tapExchange(evt){
        if(!this.isCanOperate) return;
        GameSound.instance().playSound('click');
        let spr = evt.target;
        let index = spr.name.split('_')[1];
        spr.getChildAt(1).visible = true;
        if(this.curSelectIndex == -1){
            this.curSelectIndex = index;
            return;
        }
        if(this.curSelectIndex == index){
            return;
        }
        
        if(this.isNextTo(this.curSelectIndex,index)){
            this.isCanOperate = false;
            this.stepNums--;
            this.scoreItem.setCustomText(`剩余步数  ${this.stepNums}`);
            this.exchangeBox(this.curSelectIndex,index);
            this.refreshPos([this.curSelectIndex,index]);
        }
        else{
            let box = this.allBoxDataArr[this.curSelectIndex].box;
            box.getChildAt(1).visible = false;
            this.curSelectIndex = index;
        }
        
    }
    //消除需要横向和纵向
    private checkResult(indexArr){
        // this.isCanOperate = true;
        // this.curSelectIndex = -1;
        // return;
        let arr = [];
        for(let i = 0;i < indexArr.length;i++){
            let arr1 = this.getClearRowNums(indexArr[i]);
            let arr2 = this.getClearColNums(indexArr[i]);
            if(arr1.length >= 3){
                arr = arr.concat(arr1);
            }
            if(arr2.length >= 3){
                arr = arr.concat(arr2);
            }
        }
        if(arr.length == 0){
            if(this.isCanPass()){
                EffectUtil.showResultEffect(EffectUtil.PERFECT);
            }
            else if(this.stepNums <= 0){
                this.isCanOperate = false;
                EffectUtil.showResultEffect();
            }
            else{
                this.isCanOperate = true;
                this.curSelectIndex = -1;
            }
            return;
        }
        //同时移除
        for(let index of arr){
            this.allBoxDataArr[index].box.visible = false;
        }
        //刷新所有位置
        this.refreshAll(arr);
    }
    //行
    private getClearRowNums(index){
        let row = Math.floor(index/this.COLUMNS);
        let tindex = index%this.COLUMNS;
        let box = this.allBoxDataArr[index].box;
        let type = box.name.split('_')[0];
        let arr = [];
        for(let i = tindex;i >= 0;i--){
            let sindex = i + row*this.COLUMNS;
            let sbox = this.allBoxDataArr[sindex].box;
            if(sbox.name.split('_')[0] == type && sbox.visible){
                arr.push(sindex);
            }
            else{
                break;
            }
        }
        for(let i = tindex + 1;i < this.COLUMNS;i++){
            let sindex = i + row*this.COLUMNS;
            let tbox = this.allBoxDataArr[sindex].box;
            if(tbox.name.split('_')[0] == type && tbox.visible){
                arr.push(sindex);
            }
            else{
                break;
            }
        }
        return arr;
    }
    //列
    private getClearColNums(index){
        let rows = Math.floor(index/this.COLUMNS);
        let cols = index%this.COLUMNS;
        let box = this.allBoxDataArr[index].box;
        let type = box.name.split('_')[0];
        let arr = [];
        for(let i = rows;i >= 0;i--){
            let sindex = i*this.COLUMNS + cols;
            let sbox = this.allBoxDataArr[sindex].box;
            if(sbox.name.split('_')[0] == type && sbox.visible){
                arr.push(sindex);
            }
            else{
                break;
            }
        }
        for(let i = rows + 1;i < 10;i++){
            let sindex = i*this.COLUMNS + cols;
            let tbox = this.allBoxDataArr[sindex].box;
            if(tbox.name.split('_')[0] == type && tbox.visible){
                arr.push(sindex);
            }
            else{
                break;
            }
        }
        return arr;
    }

    //判断两个index是否是左右上下相邻的
    private isNextTo(index1,index2){
        if(Math.abs(index1 - index2) == 1) return true;
        if(Math.abs(index1 - index2) == this.COLUMNS) return true;
        return false;
    }
    //是否全部消除
    private isCanPass(){
        for(let boxData of this.allBoxDataArr){
            if(boxData.box.visible){
                return false;
            }
        }
        return true;
    }
    //交换两个箱子  注意index也要交换
    private exchangeBox(index1,index2){
        let index = this.allBoxDataArr[index1].index;
        this.allBoxDataArr[index1].index = this.allBoxDataArr[index2].index;
        this.allBoxDataArr[index2].index = index;

        let boxData = this.allBoxDataArr[index1];
        this.allBoxDataArr[index1] = this.allBoxDataArr[index2];
        this.allBoxDataArr[index2] = boxData;
    }
    //刷新位置
    private refreshPos(arr){
        for(let i = 0;i < arr.length;i++){
            let box = this.allBoxDataArr[arr[i]].box;
            let index = this.allBoxDataArr[arr[i]].index;
            let name = box.name;
            box.name = name.split('_')[0] +'_'+index;
            box.getChildAt(1).visible = false;
            egret.Tween.get(box).to({x:(box.getChildAt(0).width+2)*(index%this.COLUMNS),y:(box.getChildAt(0).width + 2)*Math.floor(index/this.COLUMNS)},250).call(()=>{
                egret.Tween.removeTweens(box);
                if(i == arr.length - 1){
                    let idx = egret.setTimeout(()=>{
                        egret.clearTimeout(idx);
                        this.checkResult(arr);
                    },this,500);
                }
            },this);
        }
    }
    //更新所有位置 visible=false的直接删除  从下向上排列
    private refreshAll(arr){
        let len = this.allBoxDataArr.length;
        for(let i = len - 1;i >= 0;i--){
            let box = this.allBoxDataArr[i].box;
            if(!box.visible){
                let rows = Math.floor(i/this.COLUMNS);
                let cols = i%this.COLUMNS;
                for(let j = rows - 1;j >= 0;j--){
                    if(this.allBoxDataArr[j*this.COLUMNS+cols].box.visible){
                        this.exchangeBox(j*this.COLUMNS+cols,i);
                        arr.push(j*this.COLUMNS+cols);
                        break;
                    }
                }
            }
        }
        len = this.allBoxDataArr.length;
        for(let i = len - 1;i >= 0;i--){
            let box = this.allBoxDataArr[i].box;
            let index = this.allBoxDataArr[i].index;
            let name = box.name;
            box.name = name.split('_')[0] +'_'+index;
            egret.Tween.get(box).to({x:(box.getChildAt(0).width+2)*(index%this.COLUMNS),y:(box.getChildAt(0).width + 2)*Math.floor(index/this.COLUMNS)},250).call(()=>{
                egret.Tween.removeTweens(box);
                if(i == 0 && arr.length > 0){
                    let idx = egret.setTimeout(()=>{
                        egret.clearTimeout(idx);
                        this.checkResult(arr);
                    },this,300);
                }
            },this);
        }
    }

}