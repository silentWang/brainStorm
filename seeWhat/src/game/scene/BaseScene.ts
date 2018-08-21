class BaseScene extends egret.DisplayObjectContainer{
    constructor(){
        super();    
    }
    public dataVo:DataVO = new DataVO;
    private isShow:boolean = false;
    //倒计时 子类实现
    public timeItem:TimeItem = null;

    enter(){
        if(this.isShow) return;
        this.isShow = true;
        Game.instance().addBottom(this);
        if(this.timeItem){
            this.timeItem.start();
        }
    }

    exit(){
        this.isShow = false;
        if(this.parent){
            this.parent.removeChild(this);
        }
    }

}