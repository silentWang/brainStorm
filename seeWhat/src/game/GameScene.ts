class GameScene{
    constructor(){
        this.init();
    }

    private allScenes;
    private _menuScene:MenuScene;
    private _overScene:OverScene;
    private _chapterScene:ChapterScene;
    private _currentScene;

    private init(){
        this._menuScene = new MenuScene();
        this._overScene = new OverScene();
        this._chapterScene = new ChapterScene();
        /**
         * --------关卡------------
         * -------------不分顺序----------
         * 文字游戏  
         * 连连看  
         * 营救女友
         * 交换记忆
         * 不碰敌人
         * 图像记忆
         * 打地鼠
         * 表情记忆
         * 篮球实验
         * 文字查找
         * 颜色识别
         * 欧拉回路
         * 石头剪刀布
         * 拼图
         * 植树造林
         * 另类flappy bird
         * 技巧堆箱子
         * 爱消除
         * 逆向运动
         * 瞬间记忆
         * 方向感
         * 一心多用
         * 匀窑
         * 解锁
         **/  
        //一笔画  
        this.allScenes = {};
        this.allScenes['000'] = Scene_000;
        this.allScenes['001'] = Scene_001;
        this.allScenes['002'] = Scene_002;
        this.allScenes['003'] = Scene_003;
        this.allScenes['004'] = Scene_004;
        this.allScenes['005'] = Scene_005;
        this.allScenes['006'] = Scene_006;
        this.allScenes['007'] = Scene_007;
        this.allScenes['008'] = Scene_008;
        this.allScenes['009'] = Scene_009; 
        this.allScenes['010'] = Scene_010;
        this.allScenes['011'] = Scene_011;
        this.allScenes['012'] = Scene_012;
        this.allScenes['013'] = Scene_013;
        this.allScenes['014'] = Scene_014;
        this.allScenes['015'] = Scene_015;  
        this.allScenes['016'] = Scene_016;
        this.allScenes['017'] = Scene_017;
        this.allScenes['018'] = Scene_018;
        this.allScenes['019'] = Scene_019;
        this.allScenes['020'] = Scene_020;
        this.allScenes['021'] = Scene_021;
        this.allScenes['022'] = Scene_022;
        this.allScenes['023'] = Scene_023;
        this.allScenes['024'] = Scene_024;
        this.allScenes['025'] = Scene_025;
        this.allScenes['026'] = Scene_026;
        this.allScenes['027'] = Scene_027;
        this.allScenes['028'] = Scene_028;
        //添加事件
        this.addEvent();
    }

    //添加事件
    private addEvent(){
        EventCenter.instance().addEventListener(GameEvent.START_GAME,this.startGame,this);
        EventCenter.instance().addEventListener(GameEvent.GOT0_CHAPTER,this.nextChapter,this);
        EventCenter.instance().addEventListener(GameEvent.GOTO_NEXT_LEVEL,this.gotoNext,this);
    }

    //回菜单
    enterMenu(){
        if(this._currentScene){
            this._currentScene.exit();
        }
        this._menuScene.enter();
        this._currentScene = this._menuScene;
        GameSound.instance().stopMusic();
    }
    //game over
    enterOver(){
        if(this._currentScene){
            this._currentScene.exit();
        }
        this._overScene.enter();
        this._currentScene = this._overScene;
        GameData.currentChapter = 0;
        GameSound.instance().stopMusic();
    }
    //关卡选项
    enterChapter(){
        if(this._currentScene){
            this._currentScene.exit();
        }
        this._chapterScene.enter();
        this._currentScene = this._chapterScene;
        GameSound.instance().stopMusic();
    }
    //
    private nextChapter(){
        let chapter = GameData.currentChapter;
        GameData.currentLevel = -1;
        this.gotoNext();
    }
    //下一关
    private gotoNext(evt:GameEvent = null){
        GameData.currentLevel++;
        if(GameData.isChapterPassed()){
            let lvl = GameData.currentChapter;
            lvl++;
            WXApi.updateRankLvl(lvl);
            this.enterChapter();
            return;
        }
        //only test
        // GameData.currentLevel = 5;
        Game.instance().gameView.guideView.show();
        if(this._currentScene){
            this._currentScene.exit();
            GameSound.instance().stopMusic();
        }
    }
    //开始当前关卡
    private startGame(evt:GameEvent = null){
        GameSound.instance().playMusic();
        let config = GameData.getLevelConfig();
        if(!config.levelType){
            config.levelType = "000";
        }
        this._currentScene = new this.allScenes[config.levelType]();
        this._currentScene.enter();
    }

}