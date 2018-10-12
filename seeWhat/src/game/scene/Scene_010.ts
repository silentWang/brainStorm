//色子游戏
class Scene_010 extends BaseScene{
    constructor(){
        super();
        this.init();
    }

    //items 列条目
    private items = [];
    private btnsArr:Array<egret.TextField>;
    private toolsArr;
    private questionTxt:egret.TextField;
    private curIndex = 0;
    private summingUpData;
    private isOperating:boolean = false;
    private init(){
        let config = GameData.getConfig(`scene${this.dataVo.levelType}`);
        this.items = config['items'];
        this.toolsArr = this.dataVo.sData.split('、');
        this.summingUpData = [];

        this.questionTxt = new egret.TextField();
        this.questionTxt.size = 36;
        this.questionTxt.width = SpriteUtil.stageWidth - 120;
        this.questionTxt.textColor = 0xEE00EE;
        this.questionTxt.stroke = 2;
        this.questionTxt.strokeColor = 0xffffff;
        this.questionTxt.bold = true;
        this.questionTxt.lineSpacing = 20;
        this.questionTxt.textAlign = 'left';
        this.questionTxt.verticalAlign = 'middle';
        this.questionTxt.anchorOffsetX = this.questionTxt.width/2;
        this.questionTxt.anchorOffsetY = this.questionTxt.height/2;
        this.questionTxt.x = SpriteUtil.stageCenterX;
        this.questionTxt.y = 200;
        this.questionTxt.text = "麻烦透露下您的性别";
        this.addChild(this.questionTxt);

        this.btnsArr = [];
        let len = this.toolsArr.length;
        let sprite = new egret.Sprite();
        for(let i = 0;i < len;i++){
            let btn = this.createText('选项');
            btn.x = 150*(i%4);
            btn.y = Math.floor(i/4)*120;
            sprite.addChild(btn);
            this.btnsArr.push(btn);
            btn.name = "btn_"+i;
            btn.touchEnabled = true;
            btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.clkSwitch,this);
        }
        sprite.x = SpriteUtil.stageCenterX - sprite.width/2;
        sprite.y = 480;
        this.addChild(sprite);

        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
    }

    private clkSwitch(evt){
        if(this.isOperating) return;
        let target = evt.target;
        let name = target.name;
        if(!name || name.search('btn_') < 0) return;
        let idx = name.split('_')[1];
        this.curIndex++;
        if(this.curIndex >= this.items.length){
            console.log('结论');
        }
        else{
            this.nextItem();
        }
    }

    private nextItem(){
        let question = this.items[this.curIndex];
        this.questionTxt.text = `☛ ${question}`;

        let ops = this.toolsArr;
        let len = this.btnsArr.length;
        for(let i = 0;i < len;i++){
            if(ops[i]){
                this.btnsArr[i].text = ops[i];
                this.btnsArr[i].visible = true;
            }
            else{
                this.btnsArr[i].visible = false;
            }
        }
    }

    private createText(str = ""){
        let text = new egret.TextField();
        text.size = 36;
        text.text = str;
        text.textColor = 0x551A8B;
        text.textAlign = 'center';
        text.verticalAlign = 'middle';
        text.width = 120;
        text.height = 80;
        text.bold = true;
        text.background = true;
        text.backgroundColor = 0x00ffff;
        return text;
    }

    enter(){
        super.enter();
        this.nextItem();
        this.timeItem.start();
    }
    exit(){
        super.exit();
        this.timeItem.stop();
    }

}