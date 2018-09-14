class GameView{
    constructor(){
        this.init();
    }

    private _guideView:GuideView;
    private _rankView:RankView;
    private init(){
        this._guideView = new GuideView();
        this._rankView = new RankView();
    }

    public get guideView(){
        return this._guideView;
    }

    public get rankView(){
        return this._rankView;
    }

}