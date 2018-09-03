class ScoreItem extends egret.Sprite{
    constructor(){
        super();
        this.init();
    }

    private score = 0;
    private tarScore = 0;
    private scoreTxt:egret.TextField;
    private init(){
        this.scoreTxt = new egret.TextField();
        this.scoreTxt.size = 32;
        this.scoreTxt.text = '0';
        this.scoreTxt.textColor = 0x00ff00;
        this.scoreTxt.width = 300;
        // this.scoreTxt.bold = true;
        this.addChild(this.scoreTxt);
        this.y = 10;
    }
    //目标分和当前分
    public setSTScore(score,tarScore?){
        this.score = score;
        if(tarScore){
            this.tarScore = tarScore;
        }
        this.scoreTxt.text = `分数 ${this.score}  目标 ${this.tarScore}`;
    }
    //分数
    public setScore(score){
        this.score = score;
        this.scoreTxt.text = `分数 ${score}`;
    }
    //是否达成目标分
    public isCanPass(){
        if(this.score >= this.tarScore){
            return true;
        }
        return false;
    }

}