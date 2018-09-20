class GameData{
    constructor(){}

    //主要用来测试和区分 微信小游戏 必须为true
    public static isWxGame:boolean = true;
    public static wxUserInfo:any;
    public static currentLevel:number = 0;
    public static gameConfig;
    //关卡参数
    public static getLevelConfig(){
        let vo:DataVO = new DataVO();
        vo.setData(this.gameConfig["levels"][this.currentLevel]);
        return vo;
    }
    //config
    public static getConfig(key:string){
        if(!key) return;
        return this.gameConfig['config'][key];
    }

}