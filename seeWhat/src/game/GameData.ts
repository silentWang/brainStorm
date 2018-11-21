class GameData{
    constructor(){}

    //主要用来测试和区分 微信小游戏 必须为true
    public static isWxGame:boolean = true;
    public static wxUserInfo:any;
    //当前游戏
    public static currentChapter:number = 0;
    //当前关卡
    public static currentLevel:number = 0;
    public static reviveCard:number = 3;
    public static gameConfig;
    //当前关卡参数
    public static getLevelConfig(){
        let vo:DataVO = new DataVO();
        if(this.currentChapter == 0) return vo;
        let key = this.currentChapter >= 10 ? "chapter0"+this.currentChapter : "chapter00"+this.currentChapter;
        vo.setData(this.gameConfig["levels"][key][this.currentLevel]);
        return vo;
    }
    //config
    public static getConfig(key:string){
        if(!key) return;
        return this.gameConfig['config'][key];
    }
    //是否通关当前游戏
    public static isChapterPassed(){
        let key = this.currentChapter >= 10 ? "chapter0"+this.currentChapter : "chapter00"+this.currentChapter;
        let arr = this.gameConfig["levels"][key];
        let len = arr.length;
        if(this.currentLevel >= len) return true;
        return false;
    }

}