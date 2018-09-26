class GameSound{
    constructor(){
        this.soundsVec = {
            good:`${this.audio_url}good.mp3`,
            great:`${this.audio_url}great.mp3`,
            perfect:`${this.audio_url}perfect.mp3`,
            fail:`${this.audio_url}fail.mp3`,
            ready:`${this.audio_url}readyGo.mp3`,
            wrong:`${this.audio_url}wrong.mp3`,
            click:`${this.audio_url}click.mp3`
        }
    }

    private static _instance:GameSound = null;
    public static instance(){
        if(this._instance == null){
            this._instance = new GameSound();
        }
        return this._instance;
    }

    private audio_url = 'resource/assets/sound/';
    private soundsVec;
    private _sound = null;
    private _music = null;
    playMusic(){
        if(this._music == null){
            this._music = WXApi.createInnerAudioContext(this.audio_url+"bg.mp3");
            this._music.loop = true;
            this._music.onCanplay(()=>{
                this._music.play();
                this._music.offCanplay();
            });
            return;
        }
        this.stopMusic();
        this._music.play();
    }

    stopMusic(){
        if(this._music){
            this._music.stop();
        }
    }

    playSound(type){
        if(this._sound){
            this._sound.stop();
            this._sound.destroy();
        }
        this._sound = WXApi.createInnerAudioContext(this.soundsVec[type]);
        this._sound.play();
        this._sound.loop = false;
    }


}