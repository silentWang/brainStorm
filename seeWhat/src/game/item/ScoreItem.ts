class ScoreItem extends egret.Sprite{
    constructor(){
        super();
        this.init();
    }

    private score = 0;
    private tarScore = 0;
    private tarLose = 0;
    private scoreTxt:egret.TextField;
    private init(){
        this.scoreTxt = new egret.TextField();
        this.scoreTxt.size = 32;
        this.scoreTxt.text = '0';
        this.scoreTxt.textColor = 0x00ff00;
        this.scoreTxt.width = 300;
        this.scoreTxt.stroke = 0.5;
        this.scoreTxt.bold = true;
        this.scoreTxt.strokeColor = 0x000000;
        // this.scoreTxt.bold = true;
        this.addChild(this.scoreTxt);
        this.y = 30;
        this.x = 30;
    }
    //目标分和当前分
    public setSTScore(score,tarScore?){
        this.score = score;
        if(tarScore){
            this.tarScore = tarScore;
        }
        this.scoreTxt.text = `分数 ${this.score}  目标 ${this.tarScore}`;
    }
    //目标损失和当前损失
    public setSTLose(score,tarLose?){
        this.score = score;
        if(tarLose){
            this.tarLose = tarLose;
        }
        this.scoreTxt.text = `已用 ${this.score}  总数 ${this.tarLose}`;
    }
    //自定义模式
    public setCustomText(str = ''){
        this.scoreTxt.text = str;
    }
    //是否达成目标分
    public isCanPass(){
        if(this.score >= this.tarScore){
            return true;
        }
        return false;
    }

}