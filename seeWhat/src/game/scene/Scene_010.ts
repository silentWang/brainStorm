//色子游戏
class Scene_010 extends BaseScene{
    constructor(){
        super();
        this.init();
    }

    //items 列条目
    private items = [];
    private btnsArr:Array<egret.TextField>;
    private questionTxt:egret.TextField;
    private optionSpr:egret.Sprite;
    private curIndex = 0;
    private isCanOperate:boolean = true;
    private init(){
        let config = GameData.getConfig(`scene${this.dataVo.levelType}`);
        this.items = config['items'];

        this.questionTxt = new egret.TextField();
        this.questionTxt.size = 30;
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
        this.questionTxt.y = 120;
        this.questionTxt.text = "麻烦透露下您的性别";
        this.addChild(this.questionTxt);

        this.btnsArr = [];
        let sprite = new egret.Sprite();
        for(let i = 0;i < 10;i++){
            let btn = this.createText('');
            btn.x = 280*(i%2);
            btn.y = Math.floor(i/2)*80;
            sprite.addChild(btn);
            this.btnsArr.push(btn);
            btn.name = "btn_"+i;
            btn.touchEnabled = true;
            btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.clkSwitch,this);
        }
        sprite.x = SpriteUtil.stageCenterX - sprite.width/2;
        sprite.y = 480;
        this.addChild(sprite);
        this.optionSpr = sprite;

        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
    }

    private clkSwitch(evt){
        if(!this.isCanOperate) return;
        if(this.curIndex >= this.items.length - 1){
            Game.instance().gameScene.gotoMenu();
            return;
        }
        let target = evt.target;
        let name = target.name;
        if(!name || name.search('btn_') < 0) return;
        let idx = name.split('_')[1];
        let answer = this.items[this.curIndex].answer;
        this.isCanOperate = false;
        if(idx == answer){
            EffectUtil.showTextAndBack('✓',()=>{
                this.curIndex++;
                this.nextItem();
                this.isCanOperate = true;
            });
        }
        else{
            this.timeItem.stop();
            EffectUtil.showResultEffect();
        }
    }

    private nextItem(){
        let item = this.items[this.curIndex];
        let ops = item.options;
        this.questionTxt.text = `☛ ${item.question}`;
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
        this.optionSpr.y = this.questionTxt.y + this.questionTxt.height + 40;
    }

    private createText(str = ""){
        let text = new egret.TextField();
        text.size = 32;
        text.text = str;
        text.textColor = 0x551A8B;
        text.textAlign = 'center';
        text.verticalAlign = 'middle';
        text.width = 200;
        text.height = 60;
        text.bold = true;
        text.background = true;
        text.backgroundColor = 0x00E5EE;
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