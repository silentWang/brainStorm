class EffectUtil{
    constructor(){}

    public static GOOD = 1;
    public static EXCELLENT = 2;
    public static PERFECT = 3;
    
    public static showResultEffect(type = 0){
        let str = 'oh shit!';
        if(type == 1){
            str = 'good';
        }
        else if(type == 2){
            str = 'excellent';
        }
        else if(type == 3){
            str = 'perfect';
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

    //呼吸
    public static breath(spr?:egret.DisplayObject,scale = 0.8){
        egret.Tween.get(spr,{loop:true}).to({scaleX:scale,scaleY:scale},500).to({scaleX:1,scaleY:1},500);
    }

}