//连连看 字符版
class Scene_2 extends BaseScene{
    constructor(){
        super();
        this.init();
    }

    private currentSelect:egret.TextField;
    private group:egret.Sprite;
    private init(){
        this.dataVo.sData = '✍✉☎☀☻✌♈✿✪❈❦㊣☝☯➽❤▦卐❂☬☣※☂⊗◍✠♝♞㉿➽♬☑웃유❖☃☊큐☠Ю✍✉☎☀☻✌♈✿✪❈❦㊣☝☯➽❤▦卐❂☬☣※☂⊗◍✠♝♞㉿➽♬☑웃유❖☃☊큐☠Ю';
        this.dataVo.time = 120;
        //无序化
        let arr = this.dataVo.sData.split('');
        arr.sort((a,b)=>{
            if(Math.random() > 0.5) return 1;
            if(Math.random() < 0.5) return -1;
            return 0;
        });
        
        this.group = new egret.Sprite();
        this.group.x = 5;
        this.group.y = 200;
        let len = arr.length;
        for(let i = 0;i < len;i++){
            let text = this.createText(arr[i]);
            text.x = 90*(i%8);
            text.y = 86*Math.floor(i/8);
            this.group.addChild(text);
        }
        this.addChild(this.group);

        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
    }

    private textClk(evt){
        if(!this.currentSelect){
            this.currentSelect = evt.target;
            this.currentSelect.alpha = 0.5;
        }
        else if(this.currentSelect == evt.target){
            this.currentSelect.alpha = 1;
            this.currentSelect = null;
        }
        else{
            if(this.currentSelect.text == evt.target.text){
                this.group.removeChild(this.currentSelect);
                this.group.removeChild(evt.target);
                this.currentSelect = null;
            }
            else{
                this.currentSelect.alpha = 1;
                this.currentSelect = evt.target;
                this.currentSelect.alpha = 0.5;
            }
        }

        if(this.group.numChildren <= 0){
            this.timeItem.stop();
            EventCenter.instance().dispatchEvent(new GameEvent(GameEvent.GOTO_NEXT));
        }
    }

    private createText(name:string){
        let text = new egret.TextField();
        text.size = 60;
        text.text = name;
        text.textColor = 0x0000ff;
        text.stroke = 0.5;
        text.strokeColor = 0x000000;
        text.width = 80;
        text.height = 80;
        text.background = true;
        text.backgroundColor = 0xffff00;
        text.textAlign = 'center';
        text.verticalAlign = 'middle';
        text.bold = true;
        text.touchEnabled = true;
        text.addEventListener(egret.TouchEvent.TOUCH_TAP,this.textClk,this);
        return text;
    }

    enter(){
        super.enter();
        this.timeItem.start();
    }

    exit(){
        super.exit();
        while(this.numChildren > 1){
            let child = this.getChildAt(this.numChildren - 1);
            if(child instanceof egret.TextField){
                child.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.textClk,this);
            }
            this.removeChild(child);
        }
    }

}