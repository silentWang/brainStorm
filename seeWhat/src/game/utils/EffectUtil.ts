class EffectUtil{
    constructor(){}

    public static GOOD = 1;
    public static GREAT = 2;
    public static PERFECT = 3;
    
    public static showResultEffect(type = 0){
        let str = 'you lose';
        if(type == 1){
            str = 'good';
        }
        else if(type == 2){
            str = 'great';
        }
        else if(type == 3){
            str = 'perfect';
        }
        if(type == 0){
            GameSound.instance().playSound("fail");
        }
        else{
            GameSound.instance().playSound(str);
        }
        
        let text = SpriteUtil.createText(str,100,0xFFD700);
        text.stroke = 5;
        text.strokeColor = 0xFF0000;
        text.bold = true;
        text.x = SpriteUtil.stageCenterX;
        text.y = SpriteUtil.stageCenterY - 200;
        text.scaleX = 5;
        text.scaleY = 5;
        text.alpha = 0.1;
        Game.instance().addMiddle(text);
        egret.Tween.get(text).to({scaleX:1,scaleY:1,alpha:1},500,egret.Ease.cubicIn).call(()=>{
            let ids = egret.setTimeout(()=>{
                egret.clearTimeout(ids);
                if(text.parent){
                    text.parent.removeChild(text);
                }
                if(type == 0){
                    Game.instance().gameScene.gotoOver();
                }
                else{
                    EventCenter.instance().dispatchEvent(new GameEvent(GameEvent.GOTO_NEXT));
                }
            },this,800);
        });
    }
    //ready go
    public static playReadyGo(){
        let text1 = SpriteUtil.createText("Ready",100,0xFF00FF);
        text1.stroke = 5;
        text1.strokeColor = 0x0000ff;
        text1.bold = true;
        text1.x = SpriteUtil.stageCenterX;
        text1.y = SpriteUtil.stageCenterY - 200;
        text1.scaleX = 5;
        text1.scaleY = 5;
        text1.alpha = 0.1;
        Game.instance().addMiddle(text1);
        GameSound.instance().playSound('ready');
        egret.Tween.get(text1).to({scaleX:1,scaleY:1,alpha:1},300,egret.Ease.cubicIn).call(()=>{
            let idx = egret.setTimeout(()=>{
                egret.clearTimeout(idx);
                text1.alpha = 0.01;
                text1.text = 'Go';
                text1.scaleX = 5;
                text1.scaleY = 5;
                text1.anchorOffsetX = text1.width/2;
                text1.anchorOffsetY = text1.height/2;
                egret.Tween.get(text1).to({scaleX:1,scaleY:1,alpha:1},300,egret.Ease.cubicIn).call(()=>{
                    let sid = egret.setTimeout(()=>{
                        egret.clearTimeout(sid);
                        if(text1.parent){
                            text1.parent.removeChild(text1);
                        }
                        egret.Tween.removeTweens(text1);
                        EventCenter.instance().dispatchEvent(new GameEvent(GameEvent.START_GAME));
                    },this,200);
                });
            },this, 400);
        });
    }
    //呼吸
    public static breath(spr?:egret.DisplayObject,scale = 0.8){
        let sx = spr.scaleX;
        let sy = spr.scaleY;
        egret.Tween.get(spr,{loop:true}).to({scaleX:sx+scale,scaleY:sy+scale},500).to({scaleX:sx,scaleY:sy},500);
    }

}