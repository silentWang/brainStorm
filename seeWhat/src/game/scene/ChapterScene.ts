class ChapterScene extends BaseScene{
    constructor(){
        super();
        this.init();
    }

    private listArr = [];
    private chaptersArr = [];
    private distance:egret.Point = new egret.Point(0,0);
    private leftBtn;
    private rightBtn;
    private currentListIndex = 0;
    private isTouching = false;
    private isCanOperate = true;
    private maxPage = 2;
    private init(){
        let levels = GameData.gameConfig.levels;
        for(let i = 0;i < this.maxPage;i++){
            this.listArr.push(this.createList(i));
        }
        this.addChild(this.listArr[0]);

        this.leftBtn = SpriteUtil.createImage('arrow');
        this.leftBtn.x = SpriteUtil.stageCenterX - 180;
        this.leftBtn.y = this.listArr[0].y + this.listArr[0].height + 100;
        this.leftBtn.scaleX = 3.2;
        this.leftBtn.scaleY = 2.2;
        this.addChild(this.leftBtn);
        this.leftBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            if(!this.isCanOperate) return;
            this.nextPage(-1);
        },this);
        this.leftBtn.visible = false;

        this.rightBtn = SpriteUtil.createImage('arrow');
        this.rightBtn.x = SpriteUtil.stageCenterX + 180;
        this.rightBtn.y = this.leftBtn.y;
        this.rightBtn.scaleX = -3.2;
        this.rightBtn.scaleY = 2.2;
        this.addChild(this.rightBtn);
        this.rightBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            if(!this.isCanOperate) return;
            this.nextPage(1);
        },this);

        let home = SpriteUtil.createImage('home');
        home.x = 80;
        home.y = 80;
        home.scaleX = 1.4;
        home.scaleY = 1.5;
        this.addChild(home);
        home.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            Game.instance().gameScene.enterMenu();
        },this);
    }
    //
    private nextPage(direction = 0){
        let lastList = this.listArr[this.currentListIndex];
        GameSound.instance().playSound("click");
        //相当于重置
        if(direction == 0){
            if(lastList && lastList.parent){
                lastList.parent.removeChild(lastList);
            }
            this.currentListIndex = 0;
            this.listArr[0].alpha = 1;
            this.listArr[0].x = SpriteUtil.stageCenterX - this.listArr[0].width/2;
            this.addChild(this.listArr[0]);
            this.leftBtn.visible = false;
            this.rightBtn.visible = true;
            return;
        }
        this.currentListIndex += direction;
        if(this.currentListIndex < 0){
            this.currentListIndex = 0;
            return;
        }
        if(this.currentListIndex >= this.maxPage){
            this.currentListIndex = this.maxPage-1;
            return;
        }
        //
        if(this.currentListIndex == 0){
            this.leftBtn.visible = false;
        }
        else{
            this.leftBtn.visible = true;
        }
        if(this.currentListIndex == this.maxPage - 1){
            this.rightBtn.visible = false;
        }
        else{
            this.rightBtn.visible = true;
        }

        let sprite = this.listArr[this.currentListIndex];
        let xx = lastList.x;
        let tx = lastList.x;
        if(direction < 0){
            sprite.x = -lastList.width;
            tx = SpriteUtil.stageWidth;
        }
        else if(direction > 0){
            sprite.x = SpriteUtil.stageWidth;
            tx = -lastList.width;
        }
        sprite.alpha = 0;
        this.addChild(sprite);
        if(direction != 0){
            this.isCanOperate = false;
            egret.Tween.get(lastList).to({x:tx,alpha:0},500).call(()=>{
                egret.Tween.removeTweens(lastList);
                if(lastList.parent){
                    lastList.parent.removeChild(lastList);
                }
            });
            egret.Tween.get(sprite).to({x:xx,alpha:1},500).call(()=>{
                egret.Tween.removeTweens(sprite);
                this.isCanOperate = true;
            });
        }
    }

    private createList(startIndex = 0){
        let listSpr = new egret.Sprite();
        let shape = SpriteUtil.createRect(160*4,160*4,0x000000);
        shape.alpha = 0.5;
        shape.anchorOffsetX = 0;
        shape.anchorOffsetY = 0;
        listSpr.addChild(shape);
        for(let i = 0;i < 16;i++){
            let sprite = this.createBtns(i + 1 + startIndex*16);
            sprite.x = 80+160*(i%4);
            sprite.y = 80+160*Math.floor(i/4);
            sprite.scaleX = 1.5;
            sprite.scaleY = 1.5;
            listSpr.addChild(sprite);
            this.chaptersArr.push(sprite);
        }
        listSpr.x = SpriteUtil.stageCenterX - listSpr.width/2;
        listSpr.y = 200;
        listSpr.touchEnabled = true;
        return listSpr;
    }

    private createBtns(index){
        let sprite = new egret.Sprite();
        let btn = SpriteUtil.createImage('circle');
        btn.touchEnabled = false;
        btn.visible = false;
        this.addChild(btn);
        let text = SpriteUtil.createText(''+index,48,0xffff00);
        text.touchEnabled = false;
        text.visible = false;
        sprite.addChild(btn);
        sprite.addChild(text);
        sprite.name = "btn_"+index;
        let lock = SpriteUtil.createImage('lock');
        lock.touchEnabled = false;
        sprite.addChild(lock);
        sprite.touchEnabled = false;
        sprite.addEventListener(egret.TouchEvent.TOUCH_TAP,this.selectChapter,this);
        return sprite;
    }

    private selectChapter(evt){
        GameSound.instance().playSound("click");
        let name = evt.target.name;
        let level = name.split('_')[1];
        GameData.currentChapter = parseInt(level);
        EventCenter.instance().dispatchEvent(new GameEvent(GameEvent.GOT0_CHAPTER));
    }

    private refresh(){
        let len = this.chaptersArr.length;
        let mychap = egret.localStorage.getItem("very_funny_small_game_chapter");
        if(!mychap){
            mychap = "1";
            WXApi.updateRankLvl(parseInt(mychap));
        }
        //only test
        if(parseInt(mychap) > 32){
            mychap = "32";
        }
        // mychap = "32";
        for(let i = 0;i < parseInt(mychap);i++){
            let sprite = this.chaptersArr[i];
            sprite.getChildAt(0).visible = true;
            sprite.getChildAt(1).visible = true;
            sprite.getChildAt(2).visible = false;
            sprite.touchEnabled = true;
        }
    }

    enter(){
        this.refresh();
        this.nextPage(0);
        super.enter();
    }

}