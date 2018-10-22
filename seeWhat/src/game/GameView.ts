class GameView{
    constructor(){
        this.init();
    }

    private _guideView:GuideView;
    private _rankView:RankView;
    private _tipsView:TipsView;
    private init(){
        this._guideView = new GuideView();
        this._rankView = new RankView();
        this._tipsView = new TipsView();
    }

    public get guideView(){
        return this._guideView;
    }

    public get rankView(){
        return this._rankView;
    }

    public get tipsView(){
        return this._tipsView;
    }
}