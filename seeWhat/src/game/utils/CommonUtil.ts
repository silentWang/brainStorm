class CommonUtil{
    constructor(){}
    public static allEmoji = ['😑','😶','😏','😣','😥','😮','😯','😪','😫','😴','😌','😛','😜','😝','😒','😓','😔','😕','😲','😷','😖','😞','😟','😤','😢','😭','😦','😧','😨','😬','😰','😱','😳','😵','😡','😠'];
    public static allAnimals = ['🐒','🐕','🐈','🐅','🐆','🐎','🐂','🐄','🐖','🐏','🐪','🐘','🐀','🐇','🐓','🐦','🐧','🐢','🐍','🐉','🐳','🐬','🐟','🐤','🐊'];
    //单位是秒
    static getMSTimeBySeconds(time:number = 0){
        let str = '';
        let minute = Math.floor(time/60) < 10 ? "0"+Math.floor(time/60):Math.floor(time/60);
        let second = time%60 < 10 ? '0'+time%60 : time%60;
        return `${minute}:${second}`;
    }

    //获取指定数量指定范围的随机整数数字 isRepeat是否允许重复的数字
    static getRandomNumFromARange(count:number,start:number = 0,end:number = 0,isRepeat:boolean = false){
        if(!count || start >= end) return null;
        let mid = end - start;
        let arr = [];
        for(let i = 0;i < mid;i++){
            arr.push(start + i);
        }
        if(count >= mid) return arr;
        let rarr = [];
        for(let i = 0;i < count;i++){
            let rn = Math.floor(arr.length * Math.random());
            rarr.push(arr[rn]);
            arr.splice(rn,1);
        }
        return rarr;
    }

}