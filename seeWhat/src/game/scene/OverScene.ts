class OverScene extends BaseScene{
    constructor(){
        super();
        this.init();
    }

    private init(){
        let text = new egret.TextField();
        text.name = 'target_text';
        text.textAlign = 'center';
        text.text = '游 戏 结 束';
        text.size = 120;
        text.textColor = 0xFF0000;
        text.stroke = 1;
        text.strokeColor = 0xffffff;
        text.bold = true;
        text.width = SpriteUtil.stageWidth;
        text.y = SpriteUtil.stageHeight/2 - 200;
        this.addChild(text);
        text.scaleY = 2;

        let btn = SpriteUtil.createButton('回主页');
        btn.x = SpriteUtil.stageCenterX - btn.width/2;
        btn.y = SpriteUtil.stageCenterY + 100;
        this.addChild(btn);
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            GameSound.instance().playSound('click');
            Game.instance().gameScene.enterMenu();
        },this);
    }

}