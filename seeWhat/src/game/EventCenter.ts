//事件中心 派发和接收都在这里
class EventCenter extends egret.EventDispatcher{
    constructor(){
        super();
    }

    private static _instance:EventCenter;
    public static instance(){
        if(this._instance == null){
            this._instance = new EventCenter();
        }
        return this._instance;
    }

}