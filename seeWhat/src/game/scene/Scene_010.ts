//问答 奇趣
class Scene_010 extends BaseScene{
    constructor(){
        super();
        this.init();
    }

    private questions:Array<any>;
    private questionTxt:egret.TextField;
    private curIndex = 0;
    private isOperating:boolean = false;
    private init(){
        this.questions = GameData.questions;
        this.questions.sort((a,b)=>{
            if(Math.random() > 0.5) return 1;
            if(Math.random() < 0.5) return -1;
            return 0;
        });
        this.questionTxt = new egret.TextField();
        this.questionTxt.size = 32;
        this.questionTxt.width = SpriteUtil.stageWidth - 120;
        this.questionTxt.textColor = 0x0000ff;
        this.questionTxt.stroke = 2;
        this.questionTxt.strokeColor = 0xffffff;
        this.questionTxt.bold = true;
        this.questionTxt.lineSpacing = 20;
        this.questionTxt.textAlign = 'center';
        this.questionTxt.verticalAlign = 'middle';
        this.questionTxt.anchorOffsetX = this.questionTxt.width/2;
        this.questionTxt.anchorOffsetY = this.questionTxt.height/2;
        this.questionTxt.x = SpriteUtil.stageCenterX;
        this.questionTxt.y = 200;
        this.addChild(this.questionTxt);

        let btn1 = this.createAnswerButton('✅');
        btn1.x = SpriteUtil.stageCenterX - btn1.width;
        btn1.name = 'btn_1';
        let btn2 = this.createAnswerButton('🅾');
        btn2.x = SpriteUtil.stageCenterX;
        btn2.name = 'btn_0';
        let btn3 = this.createAnswerButton('❎');
        btn3.x = SpriteUtil.stageCenterX + btn3.width;
        btn3.name = 'btn_2';

        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
    }

    private clkSwitch(evt){
        if(this.isOperating) return;
        let target = evt.target;
        let name = target.name;
        if(!name || name.search('btn_') < 0) return;
        let idx = name.split('_')[1];
        if(idx == this.questions[this.curIndex].answer){
            this.curIndex++;
            this.askQuestion();
        }
        else{
            this.isOperating = true;
            this.timeItem.stop();
            EffectUtil.showResultEffect();
        }

    }

    private createAnswerButton(str:string){
        let text = SpriteUtil.createText(str,160);
        text.y = SpriteUtil.stageCenterY + 100;
        this.addChild(text);
        text.touchEnabled = true;
        text.addEventListener(egret.TouchEvent.TOUCH_TAP,this.clkSwitch,this);
        return text;
    }

    private askQuestion(){
        let question = this.questions[this.curIndex];
        this.questionTxt.text = `疑惑：${question.question}`;
    }

    enter(){
        super.enter();
        this.askQuestion();
        this.timeItem.start();
    }
    exit(){
        super.exit();
        this.timeItem.stop();
    }

}