class GameView{
    constructor(){
        this.init();
    }

    private _guideView:GuideView;
    private init(){
        this._guideView = new GuideView();
    }

    public get guideView(){
        return this._guideView;
    }

}