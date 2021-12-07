var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GameData = (function () {
    function GameData() {
    }
    //当前关卡参数
    GameData.getLevelConfig = function () {
        var vo = new DataVO();
        if (this.currentChapter == 0)
            return vo;
        var key = this.currentChapter >= 10 ? "chapter0" + this.currentChapter : "chapter00" + this.currentChapter;
        vo.setData(this.gameConfig["levels"][key][this.currentLevel]);
        return vo;
    };
    //config
    GameData.getConfig = function (key) {
        if (!key)
            return;
        return this.gameConfig['config'][key];
    };
    //是否通关当前游戏
    GameData.isChapterPassed = function () {
        var key = this.currentChapter >= 10 ? "chapter0" + this.currentChapter : "chapter00" + this.currentChapter;
        var arr = this.gameConfig["levels"][key];
        var len = arr.length;
        if (this.currentLevel >= len)
            return true;
        return false;
    };
    //是否已经执行
    GameData.isRunGame = false;
    //主要用来测试和区分 微信小游戏 必须为true
    GameData.isWxGame = false;
    //当前游戏
    GameData.currentChapter = 32;
    //当前关卡
    GameData.currentLevel = 32;
    GameData.reviveCard = 1;
    //share 文案
    GameData.shareConf = [
        { title: "有人@你！这个挑战有点意思！", head: "resource/assets/head0.png" },
        { title: "有人@你！你能找到这顶帽子吗？", head: "resource/assets/head1.png" },
        { title: "有人@你！猴子能吃到多少水果？", head: "resource/assets/head2.png" },
        { title: "有人@你！你能微控小球旋转几圈？", head: "resource/assets/head3.png" },
    ];
    return GameData;
}());
__reflect(GameData.prototype, "GameData");
//# sourceMappingURL=GameData.js.map