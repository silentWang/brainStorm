/**
 * view 基类
 */
class BaseView extends egret.Sprite{
    constructor(){
        super();
    }
    private isOpen:boolean = false;
    open(){
        if(this.isOpen) return;
        this.isOpen = true;
        Game.instance().addTop(this);
    }

    close(){
        this.isOpen = false;
        if(this.parent){
            this.parent.removeChild(this);
        }
    }
}