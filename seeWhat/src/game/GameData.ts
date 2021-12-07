class GameData{
    constructor(){}
    //是否已经执行
    public static isRunGame:boolean = false;
    //主要用来测试和区分 微信小游戏 必须为true
    public static isWxGame:boolean = false;
    public static wxUserInfo:any;
    //当前游戏
    public static currentChapter:number = 32;
    //当前关卡
    public static currentLevel:number = 32;
    public static reviveCard:number = 1;
    public static gameConfig;
    //share 文案
    public static shareConf = [
            {title:"有人@你！这个挑战有点意思！",head:"resource/assets/head0.png"},
            {title:"有人@你！你能找到这顶帽子吗？",head:"resource/assets/head1.png"},
            {title:"有人@你！猴子能吃到多少水果？",head:"resource/assets/head2.png"},
            {title:"有人@你！你能微控小球旋转几圈？",head:"resource/assets/head3.png"},
        ];
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