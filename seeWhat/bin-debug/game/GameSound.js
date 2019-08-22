var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GameSound = (function () {
    function GameSound() {
        this.audio_url = 'resource/assets/sound/';
        this._sound = null;
        this._music = null;
        this.soundsVec = {
            good: this.audio_url + "good.mp3",
            great: this.audio_url + "great.mp3",
            perfect: this.audio_url + "perfect.mp3",
            fail: this.audio_url + "fail.mp3",
            ready: this.audio_url + "readyGo.mp3",
            wrong: this.audio_url + "wrong.mp3",
            click: this.audio_url + "click.mp3"
        };
    }
    GameSound.instance = function () {
        if (this._instance == null) {
            this._instance = new GameSound();
        }
        return this._instance;
    };
    GameSound.prototype.playMusic = function () {
        var _this = this;
        if (GameData.isWxGame) {
            if (this._music == null) {
                this._music = WXApi.createInnerAudioContext(this.audio_url + "bg.mp3");
                this._music.loop = true;
                this._music.onCanplay(function () {
                    _this._music.play();
                    _this._music.offCanplay();
                });
                return;
            }
            this.stopMusic();
            this._music.play();
        }
        else {
            this.playWebSound(this.audio_url + "bg.mp3", -1);
        }
    };
    GameSound.prototype.stopMusic = function () {
        if (this._music) {
            this._music.stop();
        }
    };
    GameSound.prototype.playSound = function (type) {
        if (this._sound) {
            this._sound.stop();
            this._sound.destroy();
        }
        if (GameData.isWxGame) {
            this.playWxSound(this.soundsVec[type]);
        }
        else {
            this.playWebSound(this.soundsVec[type]);
        }
    };
    GameSound.prototype.playWxSound = function (url) {
        this._sound = WXApi.createInnerAudioContext(url);
        this._sound.play();
        this._sound.loop = false;
    };
    GameSound.prototype.playWebSound = function (url, loop) {
        if (loop === void 0) { loop = 1; }
        try {
            var sound_1 = new egret.Sound();
            sound_1.addEventListener(egret.Event.COMPLETE, function (event) {
                try {
                    sound_1.play(0, loop);
                }
                catch (e) {
                    console.log(e);
                }
            }, this);
            sound_1.addEventListener(egret.IOErrorEvent.IO_ERROR, function loadError(event) {
                console.log("loaded error!");
            }, this);
            sound_1.load(url);
        }
        catch (e) {
            console.log(e);
        }
    };
    GameSound._instance = null;
    return GameSound;
}());
__reflect(GameSound.prototype, "GameSound");
