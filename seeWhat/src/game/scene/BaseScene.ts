class BaseScene extends egret.DisplayObjectContainer{
    constructor(){
        super();
        this.dataVo = GameData.getCurrentSceneData();
    }
    public dataVo:DataVO;
    private isShow:boolean = false;
    //倒计时 子类实现
    public timeItem:TimeItem = null;
    //分数 子类实现
    public scoreItem:ScoreItem = null;

    enter(){
        if(this.isShow) return;
        this.isShow = true;
        Game.instance().addBottom(this);
    }

    exit(){
        this.isShow = false;
        if(this.parent){
            this.parent.removeChild(this);
        }
    }

}