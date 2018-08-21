class BaseScene extends egret.DisplayObjectContainer{
    constructor(){
        super();    
    }
    private isShow:boolean = false;

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