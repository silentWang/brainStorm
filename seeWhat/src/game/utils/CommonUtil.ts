class CommonUtil{
    constructor(){}
    //单位是秒
    static getMSTimeBySeconds(time:number = 0){
        let str = '';
        let minute = Math.floor(time/60) < 10 ? "0"+Math.floor(time/60):Math.floor(time/60);
        let second = time%60 < 10 ? '0'+time%60 : time%60;
        return `${minute}:${second}`;
    }

}