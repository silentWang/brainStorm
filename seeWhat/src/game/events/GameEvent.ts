//所有游戏事件类型都放这里
class GameEvent extends egret.Event{
    public static START_GAME = 'game_start';
    //下一个游戏
    public static GOT0_CHAPTER = 'goto_next_chapter';
    //当前游戏的下一个关卡
    public static GOTO_NEXT_LEVEL = 'goto_next_level';
    public data = null;
    constructor(type: string, bubbles?: boolean, cancelable?: boolean, data?: any){
        super(type, bubbles, cancelable, data);
    }
}