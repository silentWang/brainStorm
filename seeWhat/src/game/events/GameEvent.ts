//所有游戏事件类型都放这里
class GameEvent extends egret.Event{
    public static START_GAME = 'game_start';
    public static GOTO_NEXT = 'goto_next';
    public data = null;
    constructor(type: string, bubbles?: boolean, cancelable?: boolean, data?: any){
        super(type, bubbles, cancelable, data);
    }
}