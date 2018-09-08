var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var DataVO = (function () {
    function DataVO() {
        //关卡
        this.level = 0;
        //关卡类型
        this.levelType = 0;
        //关卡名称
        this.title = '神秘的关卡';
        //关卡描述
        this.desc = '能告诉我你是怎么来到这里的吗？';
        //关卡限制时间
        this.time = 0;
        //关卡target分数
        this.score = 0;
    }
    DataVO.prototype.setData = function (data) {
        this.reset();
        if (!data)
            return;
        this.level = data.level ? data.level : this.level;
        this.levelType = data.levelType ? data.levelType : this.levelType;
        this.title = data.title ? data.title : this.title;
        this.desc = data.desc ? data.desc : this.desc;
        this.sData = data.sData ? data.sData : this.sData;
        this.tData = data.tData ? data.tData : this.tData;
        this.time = data.time ? data.time : this.time;
        this.score = data.score ? data.score : this.score;
    };
    DataVO.prototype.reset = function () {
        this.level = 0;
        this.levelType = 0;
        this.title = "神秘的关卡";
        this.desc = "能告诉我你是怎么来到这里的吗？";
        this.sData = null;
        this.tData = null;
        this.time = 0;
        this.score = 0;
    };
    return DataVO;
}());
__reflect(DataVO.prototype, "DataVO");
//# sourceMappingURL=DataVO.js.map