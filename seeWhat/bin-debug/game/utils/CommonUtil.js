var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var CommonUtil = (function () {
    function CommonUtil() {
    }
    //单位是秒
    CommonUtil.getMSTimeBySeconds = function (time) {
        if (time === void 0) { time = 0; }
        var str = '';
        var minute = Math.floor(time / 60) < 10 ? "0" + Math.floor(time / 60) : Math.floor(time / 60);
        var second = time % 60 < 10 ? '0' + time % 60 : time % 60;
        return minute + ":" + second;
    };
    //获取指定数量指定范围的随机整数数字 isRepeat是否允许重复的数字
    CommonUtil.getRandomNumFromARange = function (count, start, end, isRepeat) {
        if (start === void 0) { start = 0; }
        if (end === void 0) { end = 0; }
        if (isRepeat === void 0) { isRepeat = false; }
        if (!count || start >= end)
            return null;
        var mid = end - start;
        var arr = [];
        for (var i = 0; i < mid; i++) {
            arr.push(start + i);
        }
        if (count >= mid)
            return arr;
        var rarr = [];
        for (var i = 0; i < count; i++) {
            var rn = Math.floor(arr.length * Math.random());
            rarr.push(arr[rn]);
            arr.splice(rn, 1);
        }
        return rarr;
    };
    CommonUtil.allEmoji = ['emoji01', 'emoji02', 'emoji03', 'emoji04', 'emoji05', 'emoji06', 'emoji07', 'emoji08', 'emoji09', 'emoji10', 'emoji11', 'emoji12', 'emoji13', 'emoji14', 'emoji15', 'emoji16', 'emoji17', 'emoji18', 'emoji19', 'emoji20', 'equal', 'female', 'male', 'sigh', 'rock', 'paper', 'scissors', 'welldone'];
    CommonUtil.allAnimals = ['ant', 'butterfly', 'cat', 'chicken', 'cow', 'dog', 'dragon', 'dragonfly', 'duck', 'eagle', 'elephant', 'frog', 'goat', 'horse', 'lizard', 'monkey', 'panda', 'penguin', 'pork', 'rabbit', 'rat', 'snake', 'squab', 'tiger', 'tortoise'];
    return CommonUtil;
}());
__reflect(CommonUtil.prototype, "CommonUtil");
//# sourceMappingURL=CommonUtil.js.map