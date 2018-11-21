class Scene_000 extends BaseScene{
    constructor(){
        super();
        this.init();
    }

    private init(){
        let text = SpriteUtil.createText('你是怎么来到这个关卡的\n真是难以置信');
        text.x = SpriteUtil.stageCenterX;
        text.y = SpriteUtil.stageCenterY;
        this.addChild(text);
    }

}