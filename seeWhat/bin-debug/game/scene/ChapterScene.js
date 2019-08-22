var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var ChapterScene = (function (_super) {
    __extends(ChapterScene, _super);
    function ChapterScene() {
        var _this = _super.call(this) || this;
        _this.listArr = [];
        _this.chaptersArr = [];
        _this.distance = new egret.Point(0, 0);
        _this.currentListIndex = 0;
        _this.isTouching = false;
        _this.isCanOperate = true;
        _this.maxPage = 2;
        _this.init();
        return _this;
    }
    ChapterScene.prototype.init = function () {
        var _this = this;
        var levels = GameData.gameConfig.levels;
        for (var i = 0; i < this.maxPage; i++) {
            this.listArr.push(this.createList(i));
        }
        this.addChild(this.listArr[0]);
        this.leftBtn = SpriteUtil.createImage('arrow');
        this.leftBtn.x = SpriteUtil.stageCenterX - 180;
        this.leftBtn.y = this.listArr[0].y + this.listArr[0].height + 100;
        this.leftBtn.scaleX = 3.2;
        this.leftBtn.scaleY = 2.2;
        this.addChild(this.leftBtn);
        this.leftBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (!_this.isCanOperate)
                return;
            _this.nextPage(-1);
        }, this);
        this.leftBtn.visible = false;
        this.rightBtn = SpriteUtil.createImage('arrow');
        this.rightBtn.x = SpriteUtil.stageCenterX + 180;
        this.rightBtn.y = this.leftBtn.y;
        this.rightBtn.scaleX = -3.2;
        this.rightBtn.scaleY = 2.2;
        this.addChild(this.rightBtn);
        this.rightBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (!_this.isCanOperate)
                return;
            _this.nextPage(1);
        }, this);
        var home = SpriteUtil.createImage('home');
        home.x = 80;
        home.y = 80;
        home.scaleX = 1.4;
        home.scaleY = 1.5;
        this.addChild(home);
        home.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            Game.instance().gameScene.enterMenu();
        }, this);
    };
    //
    ChapterScene.prototype.nextPage = function (direction) {
        var _this = this;
        if (direction === void 0) { direction = 0; }
        var lastList = this.listArr[this.currentListIndex];
        GameSound.instance().playSound("click");
        //相当于重置
        if (direction == 0) {
            if (lastList && lastList.parent) {
                lastList.parent.removeChild(lastList);
            }
            this.currentListIndex = 0;
            this.listArr[0].alpha = 1;
            this.listArr[0].x = SpriteUtil.stageCenterX - this.listArr[0].width / 2;
            this.addChild(this.listArr[0]);
            this.leftBtn.visible = false;
            this.rightBtn.visible = true;
            return;
        }
        this.currentListIndex += direction;
        if (this.currentListIndex < 0) {
            this.currentListIndex = 0;
            return;
        }
        if (this.currentListIndex >= this.maxPage) {
            this.currentListIndex = this.maxPage - 1;
            return;
        }
        //
        if (this.currentListIndex == 0) {
            this.leftBtn.visible = false;
        }
        else {
            this.leftBtn.visible = true;
        }
        if (this.currentListIndex == this.maxPage - 1) {
            this.rightBtn.visible = false;
        }
        else {
            this.rightBtn.visible = true;
        }
        var sprite = this.listArr[this.currentListIndex];
        var xx = lastList.x;
        var tx = lastList.x;
        if (direction < 0) {
            sprite.x = -lastList.width;
            tx = SpriteUtil.stageWidth;
        }
        else if (direction > 0) {
            sprite.x = SpriteUtil.stageWidth;
            tx = -lastList.width;
        }
        sprite.alpha = 0;
        this.addChild(sprite);
        if (direction != 0) {
            this.isCanOperate = false;
            egret.Tween.get(lastList).to({ x: tx, alpha: 0 }, 500).call(function () {
                egret.Tween.removeTweens(lastList);
                if (lastList.parent) {
                    lastList.parent.removeChild(lastList);
                }
            });
            egret.Tween.get(sprite).to({ x: xx, alpha: 1 }, 500).call(function () {
                egret.Tween.removeTweens(sprite);
                _this.isCanOperate = true;
            });
        }
    };
    ChapterScene.prototype.createList = function (startIndex) {
        if (startIndex === void 0) { startIndex = 0; }
        var listSpr = new egret.Sprite();
        var shape = SpriteUtil.createRect(160 * 4, 160 * 4, 0x000000);
        shape.alpha = 0.5;
        shape.anchorOffsetX = 0;
        shape.anchorOffsetY = 0;
        listSpr.addChild(shape);
        for (var i = 0; i < 16; i++) {
            var sprite = this.createBtns(i + 1 + startIndex * 16);
            sprite.x = 80 + 160 * (i % 4);
            sprite.y = 80 + 160 * Math.floor(i / 4);
            sprite.scaleX = 1.5;
            sprite.scaleY = 1.5;
            listSpr.addChild(sprite);
            this.chaptersArr.push(sprite);
        }
        listSpr.x = SpriteUtil.stageCenterX - listSpr.width / 2;
        listSpr.y = 200;
        listSpr.touchEnabled = true;
        return listSpr;
    };
    ChapterScene.prototype.createBtns = function (index) {
        var sprite = new egret.Sprite();
        var btn = SpriteUtil.createImage('circle');
        btn.touchEnabled = false;
        btn.visible = false;
        this.addChild(btn);
        var text = SpriteUtil.createText('' + index, 48, 0xffff00);
        text.touchEnabled = false;
        text.visible = false;
        sprite.addChild(btn);
        sprite.addChild(text);
        sprite.name = "btn_" + index;
        var lock = SpriteUtil.createImage('lock');
        lock.touchEnabled = false;
        sprite.addChild(lock);
        sprite.touchEnabled = false;
        sprite.addEventListener(egret.TouchEvent.TOUCH_TAP, this.selectChapter, this);
        return sprite;
    };
    ChapterScene.prototype.selectChapter = function (evt) {
        GameSound.instance().playSound("click");
        var name = evt.target.name;
        var level = name.split('_')[1];
        GameData.currentChapter = parseInt(level);
        EventCenter.instance().dispatchEvent(new GameEvent(GameEvent.GOT0_CHAPTER));
    };
    ChapterScene.prototype.refresh = function () {
        var len = this.chaptersArr.length;
        var mychap = egret.localStorage.getItem("very_funny_small_game_chapter");
        if (!mychap) {
            mychap = "1";
            WXApi.updateRankLvl(parseInt(mychap));
        }
        //only test
        if (parseInt(mychap) > 32) {
            mychap = "32";
        }
        // mychap = "32";
        for (var i = 0; i < parseInt(mychap); i++) {
            var sprite = this.chaptersArr[i];
            sprite.getChildAt(0).visible = true;
            sprite.getChildAt(1).visible = true;
            sprite.getChildAt(2).visible = false;
            sprite.touchEnabled = true;
        }
    };
    ChapterScene.prototype.enter = function () {
        this.refresh();
        this.nextPage(0);
        _super.prototype.enter.call(this);
    };
    return ChapterScene;
}(BaseScene));
__reflect(ChapterScene.prototype, "ChapterScene");
