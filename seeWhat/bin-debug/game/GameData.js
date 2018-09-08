var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GameData = (function () {
    function GameData() {
    }
    GameData.getCurrentSceneData = function () {
        var vo = new DataVO();
        vo.setData(this.config[this.currentLevel]);
        return vo;
    };
    GameData.currentLevel = 0;
    GameData.config = [];
    GameData.questions = [
        { question: '世界三大宗教是基督教、佛教、和伊斯兰教？', answer: 1 },
        { question: '世界上最冷的地方是北极？', answer: 0 },
        { question: '人的正常体温是36.5摄氏度？', answer: 1 },
        { question: '爱因斯坦发明了伟大的相对论，牛顿发现了万有引力？', answer: 2 },
        { question: '小明今天从家到学校要20分钟，从学校到家只需要10分钟，所以小明的自行车忘学校了', answer: 0 },
        { question: '爸爸的儿子的妈妈是爸爸的爸爸的儿媳妇？', answer: 1 },
        { question: '道德经是李耳所著，其生于山东与河南交接一带？', answer: 2 },
        { question: '中医讲百病生于气，所以经常生气就容易得病？', answer: 1 },
        { question: '通常所说的程序猿是指写程序的一类人，由于整天加班见不到太阳，类似猿猴的生活，故而得名，另有一说是经常对着电脑，导致皮肤变差，奇丑无比，故长得像猿猴而得名？', answer: 1 },
        { question: '如果地球是圆的，那么你在玩的这款小游戏是一个地球人做的，如果你是女的，那么地球还在自转，多么完美？', answer: 1 },
        { question: '那个，你知道如何去除周围的邪气吗，奥！我知道，正气内存，邪不可干，所以养足正气即可，我说的是你放屁了，奥！我消化比较好，对不对？', answer: 1 },
        { question: '那天看到一个美女在雨中奔波，你很伤心，上去就把它撕了，然后旁边来了几个人揍了你一顿，你无故撕人家广告牌，所以你是活该？', answer: 1 },
        { question: '观自在菩萨，阿弥陀佛，救救我，好！谢啦！一个祈祷者的自述，然后1+1=2了？', answer: 1 },
        { question: '有一条狗后面跟个主人，它就横行霸道，主人不在了，它更横行霸道，小八！不说说你，怀念忠犬八公？', answer: 1 },
        { question: '皮特和诺顿配合的第一部电影是搏击俱乐部？', answer: 1 },
        { question: '美国丽人里凯文史派西最后是被他女儿的男朋友的爸爸杀的，也就是他邻居的儿子的爸爸？', answer: 1 },
        { question: '1945年日本宣布无条件投降，是因为打过不了，差点灭族了？', answer: 1 },
        { question: '牛牛有13块钱，阳阳给了他4块，结果他们两个钱一样多，那么阳阳原来有17块？', answer: 2 },
        { question: '1元钱一瓶汽水，喝完后两个空瓶换一瓶汽水，你有20元钱，那么你最多可以喝45瓶水？', answer: 2 },
        { question: '山上还有山，打一字是出？', answer: 1 },
        { question: '积善之家必有余庆，积不善之家必有余殃，这句话出自伟大的《易经》？', answer: 1 },
        { question: '《大学》的宗旨是修身齐家治国平天下，现在很多家庭矛盾都是这个原因？', answer: 1 },
        { question: '抱歉！有钱真的可以无所欲为！这句话鲜明解释了现代人的观念？', answer: 1 },
        { question: '做程序压力也没那么大吧！一个25十三岁长相却看起来像52岁的程序员的自述？', answer: 1 },
        { question: '你可能会问了，这都是什么破疑问，还没有我的游戏好玩呢，错！你的想法揭穿了你的冲动？', answer: 1 },
        { question: '为什么叫单身狗，因为有钱真的可以为所欲为？', answer: 1 },
        { question: '或许来自深山上的隐者才知道，大自然被污染成什么样子了，而我们还在这享乐，所以要爱护大自然？', answer: 1 },
        { question: '为什么现在新奇百怪的病那么多，千奇百怪的事也那么多，因为我们的方向都是错的？', answer: 1 },
        { question: '小强的爸爸被人给杀了，却没人报警，小强躲在角落里很害怕，看着爸爸的尸体被人碾塌并被扔到垃圾桶，小强发誓下辈子再也不做蟑螂了，所以杀蟑螂不犯法？', answer: 1 },
        { question: '老家隔壁老王写信说你都好多天没去他那了，他很想你，要不你明天就去吧，毕竟他一直对你很好，去了别忘记帮我问好，至少让他知道我还在，第二天老王死了，根据字面所述，老王是气死的？', answer: 0 },
    ];
    return GameData;
}());
__reflect(GameData.prototype, "GameData");
//# sourceMappingURL=GameData.js.map