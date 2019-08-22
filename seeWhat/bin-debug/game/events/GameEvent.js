var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
//所有游戏事件类型都放这里
var GameEvent = (function (_super) {
    __extends(GameEvent, _super);
    function GameEvent(type, bubbles, cancelable, data) {
        var _this = _super.call(this, type, bubbles, cancelable, data) || this;
        _this.data = null;
        return _this;
    }
    GameEvent.START_GAME = 'game_start';
    //下一个游戏
    GameEvent.GOT0_CHAPTER = 'goto_next_chapter';
    //当前游戏的下一个关卡
    GameEvent.GOTO_NEXT_LEVEL = 'goto_next_level';
    //授权后刷新
    GameEvent.AUTHORIZE_REFRESH = "authorize_refresh";
    return GameEvent;
}(egret.Event));
__reflect(GameEvent.prototype, "GameEvent");
