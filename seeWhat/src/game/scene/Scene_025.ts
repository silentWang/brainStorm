//匀摇
class Scene_025 extends BaseScene{
    constructor(){
        super();
        this.init();
    }
    //手型
    private handSpr;
    //吃
    private eatText;
    private stonesArr = [];
    private housesArr = [];
    private curIndex = 0;
    private curCount = 0;
    private isCanOperate = true;
    private randomArr = [];
    private init(){
        this.createJoyHouse();
        this.handSpr = SpriteUtil.createImage("paper");
        this.handSpr.visible = false;
        this.handSpr.scaleX = 2;
        this.handSpr.scaleY = 2;
        this.addChild(this.handSpr);
        this.next();
        this.eatText = SpriteUtil.createText("吃",128);
        this.addChild(this.eatText);
        this.eatText.visible = false;
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
    }

    private async next(){
        if(this.curCount <= 0){
            this.checkResult();
            this.isCanOperate = true;
            return;
        }

        this.curIndex++;
        let len = this.housesArr.length;
        if(this.curIndex >= len){
            this.curIndex = 0;
        }

        let img = this.getPools();
        let house = this.housesArr[this.curIndex];
        let point = house.sprite.parent.localToGlobal(house.sprite.x,house.sprite.y);
        this.handSpr["texture"] = RES.getRes("images_json#point");
        this.handSpr.visible = true;
        this.handSpr.rotation = 0;
        this.handSpr.x = point.x;
        this.handSpr.y = point.y;

        await this.timeOutEff(500);
        house.sprite.addChild(img);
        house.count++;
        let text = house.sprite.getChildAt(0);
        text.text = house.count;
        text.anchorOffsetX = text.width/2;
        this.curCount--;
        this.handSpr.visible = false;
        this.next();
    }

    private checkResult(){
        let len = this.housesArr.length;
        if(this.curIndex >= len){
            this.curIndex = 0;
        }
        let arr = [];
        for(let i = this.curIndex;;i+=2){
            let n1 = i+1;
            let n2 = i+2;
            n1 = n1%len;
            n2 = n2%len;
            let house1 = this.housesArr[n1];
            let house2 = this.housesArr[n2];
            if(house1.count == 0 && house2.count > 0){
                arr.push(n2);
                if(n2 == this.curIndex){
                    break;
                }
            }
            else{
                break;
            }
        }
        if(arr.length == 0){
            this.isCanOperate = true;
            return;
        }
        let index = 0;
        let xfun = ()=>{
            let house = this.housesArr[arr[index]];
            let point = house.sprite.parent.localToGlobal(house.sprite.x,house.sprite.y);
            this.eatText.x = point.x;
            this.eatText.y = point.y;
            this.eatText.visible = true;
            let idx = egret.setTimeout(()=>{
                egret.clearTimeout(idx);
                this.eatText.visible = false;
                while(house.sprite.numChildren > 1){
                    house.sprite.removeChildAt(house.sprite.numChildren - 1);
                }
                house.count = 0;
                let text = house.sprite.getChildAt(0);
                text.text = house.count;
                text.anchorOffsetX = text.width/2;
                index++;
                if(this.timeItem.leftTime < 0) return;
                if(index >= arr.length){
                    if(this.isCanPass()){
                        this.timeItem.stop();
                        EffectUtil.showResultEffect(EffectUtil.PERFECT);
                        return;
                    }
                    if(this.isFail()){
                        this.timeItem.stop();
                        EffectUtil.showResultEffect();
                        return;
                    }
                    this.isCanOperate = true;
                    return;
                }
                xfun();
            },this,800);
        }
        xfun();
    }

    private isCanPass(){
        for(let house of this.housesArr){
            if(house.count != 0) return false;
        }
        return true;
    }

    private isFail(){
        let cnt = 0;
        for(let house of this.housesArr){
            cnt += house.count;
        }
        if(cnt < this.dataVo.sData.length/2){
            return true;
        }
        return false;
    }

    private getPools(){
        let xx = -40 + 80*Math.random();
        let yy = -40 + 80*Math.random();
        let rotation = 180*Math.random();
        for(let img of this.stonesArr){
            if(!img.visible || img.parent == null){
                img.visible = true;
                img.x = xx;
                img.y = yy;
                img.rotation = rotation;
                return img;
            }
        }
        let img = SpriteUtil.createImage('stone');
        img.scaleX = 0.4;
        img.scaleY = 0.4;
        img.x = xx;
        img.y = yy;
        img.rotation = rotation;
        img.touchEnabled = false;
        this.stonesArr.push(img);
        return img;
    }

    private createJoyHouse(){
        let sprite = new egret.Sprite();
        let rotation = 0;
        if(this.dataVo.level == 3){
            rotation = Math.random() > 0.5 ? -90 : 90;
        }
        else if(this.dataVo.level == 5){
            rotation = Math.random() > 0.5 ? 45 : -45;
        }
        let len = this.dataVo.sData.length;
        for(let i = 0;i < len;i++){
            let spr = new egret.Sprite();
            spr.graphics.beginFill(0x000000,0.01);
            spr.graphics.lineStyle(5,0x000000);
            spr.graphics.drawCircle(0,0,60);
            spr.graphics.endFill();
            sprite.addChild(spr);
            let point = this.getPoint(i,spr.width);
            spr.x = point.x;
            spr.y = point.y;
            spr.touchEnabled = true;
            spr.name = 'house_' + i;
            let text = SpriteUtil.createText(this.dataVo.sData[i],100);
            text.alpha = 0.5;
            spr.addChild(text);
            text.rotation = -rotation;
            spr.addEventListener(egret.TouchEvent.TOUCH_TAP,this.touchHandler,this);
            for(let a = 0;a < this.dataVo.sData[i];a++){
                let img = this.getPools();
                spr.addChild(img);
            }
            this.housesArr.push({sprite:spr,count:this.dataVo.sData[i]});
        }
        this.addChild(sprite);
        sprite.anchorOffsetX = sprite.width/2;
        sprite.anchorOffsetY = sprite.height/2;
        sprite.rotation = rotation;
        sprite.x = SpriteUtil.stageCenterX;
        sprite.y = SpriteUtil.stageCenterY;
    }
    //布局模式
    private getPoint(index,width){
        let cols = 4;
        let temp = 0;
        let xx = 0;
        let yy = 0;
        if(this.dataVo.level == 4){
            cols = 3;
        }
        if(this.dataVo.level == 6){
            if(index <= 12){
                let x0 = 2*(width+10),y0 = 2*(width+10);
                let x1 = 0,y1 = 2*(width+10);
                let angle = 2*index*Math.asin((width/2+2.5)/(2*width + 20));
                xx = width/2 + (x1-x0)*Math.cos(angle) - (y1-y0)*Math.sin(angle) + x0;
                yy = width/2 + (y1-y0)*Math.cos(angle) + (x1-x0)*Math.sin(angle) + y0;
            }
            else{
                index = index - 12;
                temp = 4-index%cols;
                xx = width/2 + temp*(width+10);
                yy = width/2 + 2*width + 20 +Math.floor(index/cols)*(width + 10);
            }
        }
        else if(this.dataVo.level == 7 || this.dataVo.level == 8){
            //随机
            if(this.randomArr.length == 0){
                let arr = [];
                for(let i = 0;i < 24;i++){
                    arr.push({x:(i%4)*(width+10),y:Math.floor(i/4)*(width+10)});
                }
                this.randomArr = arr;
            }
            let pt = this.randomArr.splice(Math.floor(this.randomArr.length*Math.random()),1);
            xx = width/2 + pt[0].x;
            yy = width/2 + pt[0].y;
        }
        else{
            temp = Math.floor(index/cols)%2 == 0 ? index%cols : 3-index%cols;
            xx = width/2 + temp*(width+10);
            yy = width/2 + Math.floor(index/cols)*(width + 10);
        }

        return new egret.Point(xx,yy);
    } 

    private touchHandler(evt){
        if(!this.isCanOperate || this.timeItem.leftTime <= 0) return;
        this.curIndex = evt.target.name.split("_")[1];
        this.isCanOperate = false;
        this.playGetAnim().catch((err)=>{
            // console.log(err);
        });
    }

    private async playGetAnim(){
        let house = this.housesArr[this.curIndex];
        if(house.count == 0){
            this.isCanOperate = true;
            return;
        }
        let point = house.sprite.parent.localToGlobal(house.sprite.x,house.sprite.y);
        this.handSpr["texture"] = RES.getRes("images_json#paper");
        this.handSpr.visible = true;
        this.handSpr.rotation = -60;
        this.handSpr.x = point.x;
        this.handSpr.y = point.y;

        await this.timeOutEff();
        this.handSpr["texture"] = RES.getRes("images_json#rock");
        if(this.timeItem.leftTime < 0) return;
        await this.timeOutEff();
        this.handSpr.visible = false;
        while(house.sprite.numChildren > 1){
            house.sprite.removeChildAt(house.sprite.numChildren - 1);
        }
        this.curCount = house.count;
        house.count = 0;
        let text = house.sprite.getChildAt(0);
        text.text = house.count;
        text.anchorOffsetX = text.width/2;
        if(this.timeItem.leftTime < 0) return;
        this.next();
    }

    private timeOutEff(time = 200){
        let p = new Promise((resolve,reject)=>{
            let idx = egret.setTimeout(()=>{
                egret.clearTimeout(idx);
                resolve();
            },this,time);
        });
        return p;
    }

    enter(){
        super.enter();
        this.timeItem.start();
    }

}




