class DataVO{
    constructor(){
    }
    //关卡
    public level = 0;
    //关卡类型
    public levelType = "";
    //关卡名称
    public title = '神秘的关卡';
    //关卡描述
    public desc = '能告诉我你是怎么来到这里的吗？';
    //关卡源数据
    public sData;
    //关卡目标数据
    public tData;
    //关卡限制时间
    public time:number = 0;
    //关卡target分数
    public score:number = 0;

    setData(data){
        this.reset();
        if(!data) return;
        this.level = data.level ? data.level : this.level;
        this.levelType = data.levelType ? data.levelType : this.levelType;
        this.title = data.title ? data.title : this.title;
        this.desc = data.desc ? data.desc : this.desc;
        this.sData = data.sData ? data.sData : this.sData;
        this.tData = data.tData ? data.tData : this.tData;
        this.time = data.time ? data.time : this.time;
        this.score = data.score ? data.score : this.score;
    }

    reset(){
        this.level = 0;
        this.levelType = "";
        this.title = "神秘的关卡";
        this.desc = "能告诉我你是怎么来到这里的吗？";
        this.sData = null;
        this.tData = null;
        this.time = 0;
        this.score = 0;
    }

}