//点击次数
class Scene_020 extends BaseScene{
    constructor(){
        super();
        this.init();
    }
    //幼少壮青中老
    private leftPlayer;
    private rightPlayer;
    private ownPlayer;
    //二维数组 存储三个palyer的路径
    private roadAllArr = [];
    //三个player 对应的阶段
    private leftIndex = 0;
    private rightIndex = 0;
    private ownIndex = 0;

    private diceArr = [];
    private isRunning = false;
    private intervalId = 0;
    private isCanOperate = true;
    private init(){
        let shape = new egret.Shape();
        shape.graphics.beginFill(0x000000,0.1);
        shape.graphics.lineStyle(30,0x8B7765);
        shape.graphics.drawRect(0,0,250,250);
        shape.anchorOffsetX = shape.width/2;
        shape.anchorOffsetY = shape.height/2;
        shape.x = SpriteUtil.stageCenterX + 15;
        shape.y = SpriteUtil.stageCenterY - 100;
        this.addChild(shape);

        let lspr = this.createLeftCastle();
        lspr.x = 115;
        lspr.y = SpriteUtil.stageCenterY - 110;
        this.addChild(lspr);

        let rspr = this.createRightCastle();
        rspr.x = SpriteUtil.stageCenterX + 130;
        rspr.y = lspr.y;
        this.addChild(rspr);

        let mspr = this.createMiddleCastle();
        mspr.x = SpriteUtil.stageCenterX;
        mspr.y = lspr.y + 120;
        this.addChild(mspr);

        let kp1 = SpriteUtil.createText(this.dataVo.sData[4],60,0x00ff00,true);
        kp1.x = shape.x - shape.width/2;
        kp1.y = shape.y - shape.height/2;
        this.addChild(kp1);

        let kp2 = SpriteUtil.createText(this.dataVo.sData[5],60,0x00ff00,true);
        kp2.x = shape.x - 15;
        kp2.y = shape.y - shape.height/2;
        this.addChild(kp2);

        let kp3 = SpriteUtil.createText(this.dataVo.sData[6],60,0x00ff00,true);
        kp3.x = shape.x + shape.width/2 - 30;
        kp3.y = shape.y - shape.height/2;
        this.addChild(kp3);

        let kp4 = SpriteUtil.createText(this.dataVo.sData[7],60,0x00ff00,true);
        kp4.x = shape.x + shape.width/2 - 30;
        kp4.y = shape.y + shape.height/2 - 30;
        this.addChild(kp4);
        
        let kp5 = SpriteUtil.createText(this.dataVo.sData[8],60,0x00ff00,true);
        kp5.x = shape.x - shape.width/2;
        kp5.y = shape.y + shape.height/2 - 30;
        this.addChild(kp5);
        
        let kp6 = SpriteUtil.createText(this.dataVo.sData[9],60,0x00ff00,true);
        kp6.x = shape.x - 15;
        kp6.y = shape.y - 10;
        this.addChild(kp6);
        
        let kp7 = SpriteUtil.createText(this.dataVo.sData[10],60,0x00ff00,true);
        kp7.x = shape.x - 15;
        kp7.y = SpriteUtil.stageCenterY - shape.height/2 - 200;
        this.addChild(kp7);
        
        let kp8 = SpriteUtil.createText(this.dataVo.sData[11],60,0x00ff00,true);
        kp8.x = shape.x - 15;
        kp8.y = SpriteUtil.stageCenterY - shape.height/2 - 300;
        this.addChild(kp8);
        
        let pyramid = SpriteUtil.createImage('pyramid');
        pyramid.x = SpriteUtil.stageCenterX;
        pyramid.y = SpriteUtil.stageCenterY - shape.height/2 - 400;
        this.addChild(pyramid);

        let pshp = SpriteUtil.createRect(30,400,0xFFD7000);
        pshp.anchorOffsetY = 0;
        pshp.x = shape.x - 15;
        pshp.y = pyramid.y + 20;
        this.addChildAt(pshp,1);

        this.roadAllArr[0] = this.storagePoint(lspr);
        this.roadAllArr[1] = this.storagePoint(mspr);
        this.roadAllArr[2] = this.storagePoint(rspr);
        this.roadAllArr[0] = this.roadAllArr[0].concat([{x:kp5.x,y:kp5.y},{x:kp4.x,y:kp4.y},{x:kp3.x,y:kp3.y},{x:kp2.x,y:kp2.y},{x:kp1.x,y:kp1.y}]);
        this.roadAllArr[1] = this.roadAllArr[1].concat([{x:kp4.x,y:kp4.y},{x:kp3.x,y:kp3.y},{x:kp2.x,y:kp2.y},{x:kp1.x,y:kp1.y},{x:kp5.x,y:kp5.y}]);
        this.roadAllArr[2] = this.roadAllArr[2].concat([{x:kp3.x,y:kp3.y},{x:kp2.x,y:kp2.y},{x:kp1.x,y:kp1.y},{x:kp5.x,y:kp5.y},{x:kp4.x,y:kp4.y}]);
        for(let i = 0;i < 3;i++){
            this.roadAllArr[i] = this.roadAllArr[i].concat([{x:kp6.x,y:kp6.y},{x:kp7.x,y:kp7.y},{x:kp8.x,y:kp8.y},{x:pyramid.x,y:pyramid.y}]);
        }

        this.leftPlayer = SpriteUtil.createImage('emoji11');
        this.leftPlayer.x = this.roadAllArr[0][0].x;
        this.leftPlayer.y = this.roadAllArr[0][0].y;
        this.addChild(this.leftPlayer);
        EffectUtil.breath(this.leftPlayer,0.2);

        this.ownPlayer = SpriteUtil.createImage('emoji16');
        this.ownPlayer.x = this.roadAllArr[1][0].x;
        this.ownPlayer.y = this.roadAllArr[1][0].y;
        this.addChild(this.ownPlayer);
        EffectUtil.breath(this.ownPlayer,0.2);

        this.rightPlayer = SpriteUtil.createImage('emoji19');
        this.rightPlayer.x = this.roadAllArr[2][0].x;
        this.rightPlayer.y = this.roadAllArr[2][0].y;
        this.addChild(this.rightPlayer);
        EffectUtil.breath(this.rightPlayer,0.2);

        let dice1 = SpriteUtil.createImage('dice1');
        dice1.x = SpriteUtil.stageCenterX - 100;
        dice1.y = SpriteUtil.stageCenterY + 500;
        this.addChild(dice1);
        let dice2 = SpriteUtil.createImage('dice2');
        dice2.x = SpriteUtil.stageCenterX;
        dice2.y = SpriteUtil.stageCenterY + 500;
        this.addChild(dice2);
        let dice3 = SpriteUtil.createImage('dice3');
        dice3.x = SpriteUtil.stageCenterX + 100;
        dice3.y = SpriteUtil.stageCenterY + 500;
        this.addChild(dice3);

        this.diceArr = [dice1,dice2,dice3];
        dice1.addEventListener(egret.TouchEvent.TOUCH_TAP,this.diceTap,this);
        dice2.addEventListener(egret.TouchEvent.TOUCH_TAP,this.diceTap,this);
        dice3.addEventListener(egret.TouchEvent.TOUCH_TAP,this.diceTap,this);
    }

    private diceTap(){
        if(!this.isCanOperate) return;
        this.isRunning = !this.isRunning;
        if(this.isRunning){
            this.startDices();
        }
        else{
            egret.clearInterval(this.intervalId);
            this.isCanOperate = false;
            let cnt = 0;
            for(let dice of this.diceArr){
                cnt += parseInt(dice.name);
            }
            if(cnt%3 == 1){
                this.leftIndex++;
                this.movePlayer(0,this.leftIndex);
            }
            else if(cnt%3 == 2){
                this.ownIndex++;
                this.movePlayer(1,this.ownIndex);
            }
            else if(cnt%3 == 0){
                this.rightIndex++;
                this.movePlayer(2,this.rightIndex);
            }
        }
    }

    private startDices(){
        this.intervalId = egret.setInterval(()=>{
            for(let dice of this.diceArr){
                let index = Math.ceil(6*Math.random());
                dice['texture'] = RES.getRes(`dice${index}_png`);
                dice.name = ''+index;
            }
        },this,40);
    }

    private movePlayer(playerIndex,posIndex){
        let player;
        if(playerIndex == 0){
            player = this.leftPlayer;
        }
        else if(playerIndex == 1){
            player = this.ownPlayer;
        }
        else if(playerIndex == 2){
            player = this.rightPlayer;
        }

        let tween = egret.Tween.get(player);
        tween.wait(500);
        tween.to({x:this.roadAllArr[playerIndex][posIndex].x,y:this.roadAllArr[playerIndex][posIndex].y},500).call(()=>{
            this.isCanOperate = true;
            this.checkResult();
        },this);

    }

    private checkResult(){
        if(this.leftIndex >= this.roadAllArr[0].length - 1 || this.rightIndex >= this.roadAllArr[2].length - 1){
            this.isCanOperate = false;
            EffectUtil.showResultEffect();
        }
        else if(this.ownIndex >= this.roadAllArr[1].length - 1){
            EffectUtil.showResultEffect(EffectUtil.PERFECT);
            this.isCanOperate = false;
        }
    }

    private createLeftCastle(){
        let sprite = new egret.Sprite();
        let house = SpriteUtil.createImage('house');
        house.y = 300;
        sprite.addChild(house);
        let kp1 = SpriteUtil.createText(this.dataVo.sData[0],60,0x00ff00,true);
        kp1.y = 200;
        sprite.addChild(kp1);
        let kp2 = SpriteUtil.createText(this.dataVo.sData[1],60,0x00ff00,true);
        kp2.y = 100;
        sprite.addChild(kp2);
        let kp3 = SpriteUtil.createText(this.dataVo.sData[2],60,0x00ff00,true);
        sprite.addChild(kp3);
        let mountain = SpriteUtil.createText(this.dataVo.sData[3],60,0x00ff00,true);
        mountain.x = 120;
        sprite.addChild(mountain);
        let shape = SpriteUtil.createRect(30,house.y,0x8B7765);
        shape.anchorOffsetY = 0;
        sprite.addChildAt(shape,0);
        let lshape = SpriteUtil.createRect(mountain.x,30,0x8B7765);
        lshape.anchorOffsetX = 0;
        sprite.addChildAt(lshape,0);
        return sprite;
    }

    private createRightCastle(){
        let sprite = new egret.Sprite();
        let xx = 120;
        let house = SpriteUtil.createImage('house');
        house.x = xx;
        house.y = 300;
        sprite.addChild(house);
        let kp1 = SpriteUtil.createText(this.dataVo.sData[0],60,0x00ff00,true);
        kp1.x = xx;
        kp1.y = 200;
        sprite.addChild(kp1);
        let kp2 = SpriteUtil.createText(this.dataVo.sData[1],60,0x00ff00,true);
        kp2.x = xx;
        kp2.y = 100;
        sprite.addChild(kp2);
        let kp3 = SpriteUtil.createText(this.dataVo.sData[2],60,0x00ff00,true);
        kp3.x = xx;
        sprite.addChild(kp3);
        let mountain = SpriteUtil.createText(this.dataVo.sData[3],60,0x00ff00,true);
        sprite.addChild(mountain);
        let shape = SpriteUtil.createRect(30,house.y,0x8B7765);
        shape.anchorOffsetY = 0;
        shape.x = xx;
        sprite.addChildAt(shape,0);
        let lshape = SpriteUtil.createRect(xx,30,0x8B7765);
        lshape.anchorOffsetX = 0;
        sprite.addChildAt(lshape,0);
        return sprite;
    }

    private createMiddleCastle(){
        let sprite = new egret.Sprite();
        let house = SpriteUtil.createImage('house');
        house.y = 400;
        sprite.addChild(house);
        let kp1 = SpriteUtil.createText(this.dataVo.sData[0],60,0x00ff00,true);
        kp1.y = 300;
        sprite.addChild(kp1);
        let kp2 = SpriteUtil.createText(this.dataVo.sData[1],60,0x00ff00,true);
        kp2.y = 200;
        sprite.addChild(kp2);
        let kp3 = SpriteUtil.createText(this.dataVo.sData[2],60,0x00ff00,true);
        kp3.y = 100;
        sprite.addChild(kp3);
        let mountain = SpriteUtil.createText(this.dataVo.sData[3],60,0x00ff00,true);
        sprite.addChild(mountain);
        let shape = SpriteUtil.createRect(30,house.y,0x8B7765);
        shape.anchorOffsetY = 0;
        sprite.addChildAt(shape,0);
        return sprite;
    }

    private storagePoint(sprite){
        let arr = [];
        for(let i = sprite.numChildren - 1,j = 0;j < 5;i--,j++){
            let spr = sprite.getChildAt(i);
            let point = sprite.localToGlobal(spr.x,spr.y);
            arr.push({x:point.x,y:point.y});
        }
        arr.reverse();
        return arr;
    }

    exit(){
        super.exit();
        for(let dice of this.diceArr){
            egret.Tween.removeTweens(dice);
        }
        egret.Tween.removeTweens(this.leftPlayer);
        egret.Tween.removeTweens(this.ownPlayer);
        egret.Tween.removeTweens(this.rightPlayer);
        egret.clearInterval(this.intervalId);
    }

}