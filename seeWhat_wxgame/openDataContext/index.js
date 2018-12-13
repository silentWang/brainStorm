/**
 * 微信开放数据域
 * 使用 Canvas2DAPI 在 SharedCanvas 渲染一个排行榜，
 * 并在主域中渲染此 SharedCanvas
 */
//间隔多少秒重新刷新
const MID_TIME = 30;

class openDataContextMain{
  constructor(){
    this.init();
  }
  init(){
    this.context = sharedCanvas.getContext('2d');
    this.context.globalCompositeOperation = 'source-over';
    this.sWidth = sharedCanvas.width;
    this.sHeight = this.sWidth* 1280/720;
    this.openId = "";
    this.userData = null;
    this.listData = null;
    this.lastTime = 0;  
  }

  addOpenDataContextListener(){
    console.log('开放作用域添加onMessage');
    wx.onMessage(data=>{
      if (data.command == 'cmd_openId'){
        this.openId = data.openId;
      }
      else if(data.command == 'cmd_user'){
        wx.getUserCloudStorage({
          keyList:['level'],
          complete:res=>{
            // console.log('我的level');
            // console.log(res);
            let kv = res.KVDataList;
            if (!kv || kv.length == 0){
              //注意key value 都必须是string 否则报错
              kv[0] = {key:'level',value:''+data.level};
              wx.setUserCloudStorage({
                KVDataList:kv,
                complete:res=>{
                  // console.log(res);
                }
              });
            }
            else{
              let nlvl = parseInt(data.level);
              let slvl = parseInt(kv[0].value);
              // console.log(nlvl +'----' + slvl);
              if(nlvl > slvl){
                kv[0].value = ''+nlvl;
                wx.setUserCloudStorage({
                  KVDataList: kv,
                  complete: res => {
                    // console.log(res);
                  }
                });
              }
            }
          }
        })
      }
      else if(data.command == 'cmd_rank'){
        let nowTime = (new Date()).getTime();
        let mid = Math.round(nowTime - this.lastTime)/1000;
        if (mid >= MID_TIME){
          this.lastTime = nowTime;
          wx.getFriendCloudStorage({
            keyList:['level'],
            complete:res=>{
              if (res.errMsg == 'getFriendCloudStorage:ok'){
                this.listData = this.sortListData(res.data);
                this.drawRankList(data.page);
              }
            }
          });
        }
        else{
          this.drawRankList(data.page);
        }
      }
    });
  }
  //获取自己的排名信息
  getOwnRank() {
    let len = this.listData.length;
    for (let i = 0; i < len; i++) {
      if (this.listData[i].avatarUrl == this.openId) {
        return [i + 1, this.listData[i]];
      }
    }
    return null;
  }
  //排序
  sortListData(arr){
    if(!arr || arr.length == 0) return;
    let len = arr.length;
    for (let i = 0; i < len; i++) {
      let data = arr[i];
      let klist = data.KVDataList;
      for (let j = 0; j < klist.length; j++) {
        let obj = klist[j];
        if (obj.key == 'level') {
          data[obj.key] = obj.value;
          break;
        }
      }
    }
    //排序
    arr.sort((a, b) => {
      if (parseInt(a.level) > parseInt(b.level)) return -1;
      if (parseInt(a.level) < parseInt(b.level)) return 1;
      return 0;
    });
    // console.log(arr);
    return arr;
  }
  //绘画
  drawRankList(page){
    if(!page){
      page = 1;
    }
    if(!this.listData || this.listData.length == 0) return;
    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    let len = this.listData.length;
    if (page > Math.ceil(len / 10)) {
      page = Math.ceil(len/10);
    }

    let itemWidth = this.sWidth * 3/4;
    let itemHeight = this.sHeight * 4/5;
    let lx = itemWidth / 100;
    let ly = itemHeight / 100;
    let fontSize = this.sWidth / 25;
    let i = (page - 1) * 8;
    let max = page * 8;
    let xx = this.sWidth / 8;
    for (; i < max; i++) {
      let obj = this.listData[i];
      if (!obj) break;
      let yy = (i % 8) * ly * 10;
      this.context.fillStyle = '#65b5f7';
      this.context.font = fontSize + 'px Arial bold';
      this.context.textAlign = 'center';
      this.context.fillText('' + (i + 1), xx , yy + ly*10);
      let image = wx.createImage();
      image.src = obj.avatarUrl;
      this.drawImage(image, xx + 10 * lx, yy + ly * 5, 14 * lx, 14 * lx);
      this.context.fillStyle = '#a1a1a1';
      this.context.fillText(obj.nickname, xx + 50 * lx, yy + 10 * ly);
      this.context.fillText(obj.KVDataList[0].value, xx + 94 * lx, yy + 10 * ly);
      this.context.fillStyle = '#00ffff';
      this.context.fillRect(xx, yy + ly * 13, itemWidth,ly/10);
    }

    //绘制自己的排名
    let rank = this.getOwnRank();
    if (!rank) return;
    let robj = rank[1];
    let myy = 90 * ly;
    this.context.fillStyle = '#ffff00';
    this.context.fillText('' + rank[0], xx, myy + ly * 10);
    let image = wx.createImage();
    image.src = robj.avatarUrl;
    this.drawImage(image, xx + 10 * lx, myy + ly * 5, 14 * lx, 14 * lx);
    this.context.fillText(robj.nickname, xx + 50 * lx, myy + 10 * ly);
    this.context.fillText(robj.KVDataList[0].value, xx + 94 * lx, myy + 10 * ly);
    this.context.fillStyle = '#ffff00';
    this.context.fillRect(xx, myy + ly * 13, itemWidth, ly / 10);
  }

  /**
 * 图片绘制函数
 */
  drawImage(image, x, y, width, height) {
    if (image.width != 0 && image.height != 0 && this.context) {
      if (width && height) {
        this.context.drawImage(image, x, y, width, height);
      } else {
        this.context.drawImage(image, x, y);
      }
    }
  }

}



let openMain = new openDataContextMain();
openMain.addOpenDataContextListener();