class MenuScene extends BaseScene{
    constructor(){
        super();
        this.init();
    }

    private init(){
        let btn = SpriteUtil.createButton('开始');
        btn.x = SpriteUtil.stageCenterX - btn.width/2;
        btn.y = SpriteUtil.stageCenterY;
        this.addChild(btn);
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            EventCenter.instance().dispatchEvent(new GameEvent(GameEvent.GOTO_NEXT));
        },this);
    }

}