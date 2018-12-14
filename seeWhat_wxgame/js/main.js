var egret = window.egret;var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var BaseScene = (function (_super) {
    __extends(BaseScene, _super);
    function BaseScene() {
        var _this = _super.call(this) || this;
        _this.isShow = false;
        //倒计时 子类实现
        _this.timeItem = null;
        //分数 子类实现
        _this.scoreItem = null;
        _this.dataVo = GameData.getLevelConfig();
        return _this;
    }
    BaseScene.prototype.enter = function () {
        if (this.isShow)
            return;
        this.isShow = true;
        Game.instance().addBottom(this);
    };
    BaseScene.prototype.exit = function () {
        this.isShow = false;
        if (this.parent) {
            this.parent.removeChild(this);
        }
    };
    return BaseScene;
}(egret.DisplayObjectContainer));
__reflect(BaseScene.prototype, "BaseScene");
/**
 * view 基类
 */
var BaseView = (function (_super) {
    __extends(BaseView, _super);
    function BaseView() {
        var _this = _super.call(this) || this;
        _this.isOpen = false;
        return _this;
    }
    BaseView.prototype.open = function () {
        if (this.isOpen)
            return;
        this.isOpen = true;
        Game.instance().addTop(this);
    };
    BaseView.prototype.close = function () {
        this.isOpen = false;
        if (this.parent) {
            this.parent.removeChild(this);
        }
    };
    return BaseView;
}(egret.Sprite));
__reflect(BaseView.prototype, "BaseView");
//一笔画
var Scene_012 = (function (_super) {
    __extends(Scene_012, _super);
    function Scene_012() {
        var _this = _super.call(this) || this;
        _this.isTouching = false;
        //
        _this.vsArr = [];
        _this.lineCount = 0;
        _this.init();
        return _this;
    }
    Scene_012.prototype.init = function () {
        var _this = this;
        this.lineVs = this.dataVo.sData;
        var lines = this.dataVo.tData;
        var len = lines.length;
        this.lineEs = [];
        for (var i = 0; i < len; i++) {
            var line = lines[i];
            this.lineEs.push({ start: this.lineVs[line[0]], end: this.lineVs[line[1]] });
        }
        this.drawLines();
        this.pathShape = new egret.Shape();
        this.addChild(this.pathShape);
        this.drawCircles();
        this.paths = [];
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
        var btn = SpriteUtil.createButton("重来", 140, 60, 0x0000ff, 28);
        btn.x = SpriteUtil.stageCenterX - btn.width / 2;
        btn.y = SpriteUtil.stageHeight - 300;
        this.addChild(btn);
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            _this.pathShape.graphics.clear();
            _this.paths = [];
            _this.lineEs = [];
            for (var i = 0; i < len; i++) {
                var line = lines[i];
                _this.lineEs.push({ start: _this.lineVs[line[0]], end: _this.lineVs[line[1]] });
            }
            for (var _i = 0, _a = _this.vsArr; _i < _a.length; _i++) {
                var shape = _a[_i];
                shape.alpha = 0.5;
            }
        }, this);
        //only for looking for point
        // this.touchEnabled = true;
        // let rect = SpriteUtil.createRect(SpriteUtil.stageWidth,SpriteUtil.stageHeight);
        // rect.alpha = 0.01;
        // rect.anchorOffsetX = 0;
        // rect.anchorOffsetY = 0;
        // this.addChild(rect);
        // this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.touchHandler,this);
    };
    Scene_012.prototype.touchHandler = function (evt) {
        var point = { x: evt['stageX'], y: evt['stageY'] };
        this.paths.push(point);
        this.drawPath();
    };
    //点击开始连线
    Scene_012.prototype.clkStart = function (evt) {
        if (this.timeItem.leftTime <= 0)
            return;
        GameSound.instance().playSound('click');
        var ptshape = evt.target;
        var name = ptshape.name;
        var index = name.split('_')[1];
        var point = this.lineVs[index];
        if (this.isCanDraw(point)) {
            ptshape.alpha = 1;
            this.drawPath();
            if (this.lineEs.length == 0) {
                var leftTime_1 = this.timeItem.leftTime;
                this.timeItem.stop();
                var idx_1 = egret.setTimeout(function () {
                    egret.clearTimeout(idx_1);
                    if (leftTime_1 >= 60) {
                        EffectUtil.showResultEffect(EffectUtil.PERFECT);
                    }
                    else if (leftTime_1 >= 45) {
                        EffectUtil.showResultEffect(EffectUtil.GREAT);
                    }
                    else {
                        EffectUtil.showResultEffect(EffectUtil.GOOD);
                    }
                }, this, 200);
            }
        }
        else {
            var alpha = ptshape.alpha == 1 ? 0.5 : 1;
            egret.Tween.get(ptshape).to({ alpha: alpha }, 300).to({ alpha: ptshape.alpha }, 300).call(function () {
                egret.Tween.removeTweens(ptshape);
            });
        }
    };
    //当前划线是否在原线数组重
    Scene_012.prototype.isCanDraw = function (point) {
        var plen = this.paths.length;
        if (plen == 0) {
            this.paths.push(point);
            return true;
        }
        var start1 = this.paths[plen - 1];
        var end1 = point;
        var len = this.lineEs.length;
        for (var i = len - 1; i >= 0; i--) {
            var start2 = this.lineEs[i].start;
            var end2 = this.lineEs[i].end;
            if (start1.x == start2.x && end1.x == end2.x && start1.y == start2.y && end1.y == end2.y) {
                this.lineEs.splice(i, 1);
                this.paths.push(point);
                return true;
            }
            else if (start1.x == end2.x && start1.y == end2.y && start2.x == end1.x && start2.y == end1.y) {
                this.lineEs.splice(i, 1);
                this.paths.push(point);
                return true;
            }
        }
        return false;
    };
    //
    Scene_012.prototype.drawPath = function () {
        this.pathShape.graphics.clear();
        if (this.paths.length == 0)
            return;
        this.pathShape.graphics.lineStyle(10, 0xff0000);
        this.pathShape.graphics.moveTo(this.paths[0].x, this.paths[0].y);
        for (var i = 1; i < this.paths.length; i++) {
            var pt = this.paths[i];
            this.pathShape.graphics.lineTo(pt.x, pt.y);
        }
        // console.clear();
        // console.table(this.paths);
    };
    //画线
    Scene_012.prototype.drawLines = function () {
        var line = new egret.Shape();
        line.graphics.clear();
        line.graphics.lineStyle(10, 0x7AC5CD, 0.8);
        for (var i = 0; i < this.lineEs.length; i++) {
            var start = this.lineEs[i].start;
            var end = this.lineEs[i].end;
            line.graphics.moveTo(start.x, start.y);
            line.graphics.lineTo(end.x, end.y);
        }
        this.addChild(line);
    };
    //画点
    Scene_012.prototype.drawCircles = function () {
        this.vsArr = [];
        for (var i = 0; i < this.lineVs.length; i++) {
            var shape = new egret.Shape();
            var point = this.lineVs[i];
            shape.graphics.lineStyle(1, 0x000000);
            shape.graphics.beginFill(0xffffff);
            shape.graphics.drawCircle(point.x, point.y, 20);
            shape.graphics.endFill();
            shape.alpha = 0.5;
            this.addChild(shape);
            shape.name = 'vertex_' + i;
            shape.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clkStart, this);
            shape.touchEnabled = true;
            this.vsArr.push(shape);
        }
    };
    Scene_012.prototype.enter = function () {
        _super.prototype.enter.call(this);
        this.timeItem.start();
    };
    Scene_012.prototype.exit = function () {
        _super.prototype.exit.call(this);
        for (var _i = 0, _a = this.vsArr; _i < _a.length; _i++) {
            var shape = _a[_i];
            shape.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.clkStart, this);
            if (shape.parent) {
                shape.parent.removeChild(shape);
            }
        }
    };
    return Scene_012;
}(BaseScene));
__reflect(Scene_012.prototype, "Scene_012");
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super.call(this) || this;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Main.prototype.onAddToStage = function (event) {
        egret.lifecycle.addLifecycleListener(function (context) {
            // custom lifecycle plugin
            context.onUpdate = function () {
            };
        });
        egret.lifecycle.onPause = function () {
            egret.ticker.pause();
        };
        egret.lifecycle.onResume = function () {
            egret.ticker.resume();
        };
        this.runGame().catch(function (e) {
            // console.log(e);
        });
    };
    Main.prototype.runGame = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadResource()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, RES.getResAsync("config_json")];
                    case 2:
                        result = _a.sent();
                        GameData.gameConfig = result;
                        // console.log("游戏配置o%",result);
                        return [4 /*yield*/, platform.login()];
                    case 3:
                        // console.log("游戏配置o%",result);
                        _a.sent();
                        this.createGameScene();
                        return [2 /*return*/];
                }
            });
        });
    };
    Main.prototype.loadResource = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loadingView, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        loadingView = new LoadingUI();
                        this.stage.addChild(loadingView);
                        return [4 /*yield*/, RES.loadConfig("resource/default.res.json", "resource/")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, RES.loadGroup("preload", 0, loadingView)];
                    case 2:
                        _a.sent();
                        this.stage.removeChild(loadingView);
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 创建游戏场景
     * Create a game scene
     */
    Main.prototype.createGameScene = function () {
        var bg = new egret.Bitmap(RES.getRes('bg_png'));
        this.stage.addChild(bg);
        Game.instance().setStage(this.stage);
        //iphoneX 的适配
        bg.height = this.stage.stageHeight;
    };
    return Main;
}(egret.DisplayObjectContainer));
__reflect(Main.prototype, "Main");
var DebugPlatform = (function () {
    function DebugPlatform() {
    }
    DebugPlatform.prototype.getUserInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, { nickName: "username" }];
            });
        });
    };
    DebugPlatform.prototype.login = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    return DebugPlatform;
}());
__reflect(DebugPlatform.prototype, "DebugPlatform", ["Platform"]);
if (!window.platform) {
    window.platform = new DebugPlatform();
}
//事件中心 派发和接收都在这里
var EventCenter = (function (_super) {
    __extends(EventCenter, _super);
    function EventCenter() {
        return _super.call(this) || this;
    }
    EventCenter.instance = function () {
        if (this._instance == null) {
            this._instance = new EventCenter();
        }
        return this._instance;
    };
    return EventCenter;
}(egret.EventDispatcher));
__reflect(EventCenter.prototype, "EventCenter");
var GameData = (function () {
    function GameData() {
    }
    //当前关卡参数
    GameData.getLevelConfig = function () {
        var vo = new DataVO();
        if (this.currentChapter == 0)
            return vo;
        var key = this.currentChapter >= 10 ? "chapter0" + this.currentChapter : "chapter00" + this.currentChapter;
        vo.setData(this.gameConfig["levels"][key][this.currentLevel]);
        return vo;
    };
    //config
    GameData.getConfig = function (key) {
        if (!key)
            return;
        return this.gameConfig['config'][key];
    };
    //是否通关当前游戏
    GameData.isChapterPassed = function () {
        var key = this.currentChapter >= 10 ? "chapter0" + this.currentChapter : "chapter00" + this.currentChapter;
        var arr = this.gameConfig["levels"][key];
        var len = arr.length;
        if (this.currentLevel >= len)
            return true;
        return false;
    };
    //主要用来测试和区分 微信小游戏 必须为true
    GameData.isWxGame = true;
    //当前游戏
    GameData.currentChapter = 0;
    //当前关卡
    GameData.currentLevel = 0;
    GameData.reviveCard = 1;
    return GameData;
}());
__reflect(GameData.prototype, "GameData");
var GameScene = (function () {
    function GameScene() {
        this.init();
    }
    GameScene.prototype.init = function () {
        this._menuScene = new MenuScene();
        this._overScene = new OverScene();
        this._chapterScene = new ChapterScene();
        /**
         * --------关卡------------
         * -------------不分顺序----------
         * 文字游戏
         * 连连看
         * 营救女友
         * 交换记忆
         * 不碰敌人
         * 图像记忆
         * 打地鼠
         * 表情记忆
         * 篮球实验
         * 文字查找
         * 颜色识别
         * 欧拉回路
         * 石头剪刀布
         * 拼图
         * 植树造林
         * 另类flappy bird
         * 技巧堆箱子
         * 爱消除
         * 逆向运动
         * 瞬间记忆
         * 方向感
         * 一心多用
         * 匀窑
         * 解锁
         **/
        //一笔画  
        this.allScenes = {};
        this.allScenes['000'] = Scene_000;
        this.allScenes['001'] = Scene_001;
        this.allScenes['002'] = Scene_002;
        this.allScenes['003'] = Scene_003;
        this.allScenes['004'] = Scene_004;
        this.allScenes['005'] = Scene_005;
        this.allScenes['006'] = Scene_006;
        this.allScenes['007'] = Scene_007;
        this.allScenes['008'] = Scene_008;
        this.allScenes['009'] = Scene_009;
        this.allScenes['010'] = Scene_010;
        this.allScenes['011'] = Scene_011;
        this.allScenes['012'] = Scene_012;
        this.allScenes['013'] = Scene_013;
        this.allScenes['014'] = Scene_014;
        this.allScenes['015'] = Scene_015;
        this.allScenes['016'] = Scene_016;
        this.allScenes['017'] = Scene_017;
        this.allScenes['018'] = Scene_018;
        this.allScenes['019'] = Scene_019;
        this.allScenes['020'] = Scene_020;
        this.allScenes['021'] = Scene_021;
        this.allScenes['022'] = Scene_022;
        this.allScenes['023'] = Scene_023;
        this.allScenes['024'] = Scene_024;
        this.allScenes['025'] = Scene_025;
        this.allScenes['026'] = Scene_026;
        this.allScenes['027'] = Scene_027;
        this.allScenes['028'] = Scene_028;
        this.allScenes['029'] = Scene_029;
        this.allScenes['030'] = Scene_030;
        this.allScenes['031'] = Scene_031;
        this.allScenes['032'] = Scene_032;
        //添加事件
        this.addEvent();
    };
    //添加事件
    GameScene.prototype.addEvent = function () {
        EventCenter.instance().addEventListener(GameEvent.START_GAME, this.startGame, this);
        EventCenter.instance().addEventListener(GameEvent.GOT0_CHAPTER, this.nextChapter, this);
        EventCenter.instance().addEventListener(GameEvent.GOTO_NEXT_LEVEL, this.gotoNext, this);
    };
    //回菜单
    GameScene.prototype.enterMenu = function () {
        if (this._currentScene) {
            this._currentScene.exit();
        }
        this._menuScene.enter();
        this._currentScene = this._menuScene;
        GameSound.instance().stopMusic();
        WXApi.showBannerAd();
    };
    //game over
    GameScene.prototype.enterOver = function () {
        if (this._currentScene) {
            this._currentScene.exit();
        }
        this._overScene.enter();
        this._currentScene = this._overScene;
        GameData.currentChapter = 0;
        GameSound.instance().stopMusic();
        WXApi.showBannerAd();
    };
    //关卡选项
    GameScene.prototype.enterChapter = function () {
        if (this._currentScene) {
            this._currentScene.exit();
        }
        this._chapterScene.enter();
        this._currentScene = this._chapterScene;
        GameSound.instance().stopMusic();
        WXApi.showBannerAd();
    };
    //
    GameScene.prototype.nextChapter = function () {
        var chapter = GameData.currentChapter;
        GameData.currentLevel = -1;
        this.gotoNext();
        if (chapter == 3 || chapter == 6 || chapter == 7 || chapter == 19 || chapter == 22) {
            WXApi.showBannerAd(false);
        }
        else {
            WXApi.showBannerAd(true);
        }
    };
    //下一关
    GameScene.prototype.gotoNext = function (evt) {
        if (evt === void 0) { evt = null; }
        GameData.currentLevel++;
        if (GameData.isChapterPassed()) {
            var lvl = GameData.currentChapter;
            lvl++;
            WXApi.updateRankLvl(lvl);
            this.enterChapter();
            return;
        }
        //only test
        // GameData.currentLevel = 3;
        Game.instance().gameView.guideView.show();
        if (this._currentScene) {
            this._currentScene.exit();
            GameSound.instance().stopMusic();
        }
    };
    //开始当前关卡
    GameScene.prototype.startGame = function (evt) {
        if (evt === void 0) { evt = null; }
        GameSound.instance().playMusic();
        var config = GameData.getLevelConfig();
        if (!config.levelType) {
            config.levelType = "000";
        }
        this._currentScene = new this.allScenes[config.levelType]();
        this._currentScene.enter();
    };
    return GameScene;
}());
__reflect(GameScene.prototype, "GameScene");
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
        this._sound = WXApi.createInnerAudioContext(this.soundsVec[type]);
        this._sound.play();
        this._sound.loop = false;
    };
    GameSound._instance = null;
    return GameSound;
}());
__reflect(GameSound.prototype, "GameSound");
var GameView = (function () {
    function GameView() {
        this.init();
    }
    GameView.prototype.init = function () {
        this._guideView = new GuideView();
        this._rankView = new RankView();
        this._tipsView = new TipsView();
    };
    Object.defineProperty(GameView.prototype, "guideView", {
        get: function () {
            return this._guideView;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameView.prototype, "rankView", {
        get: function () {
            return this._rankView;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameView.prototype, "tipsView", {
        get: function () {
            return this._tipsView;
        },
        enumerable: true,
        configurable: true
    });
    return GameView;
}());
__reflect(GameView.prototype, "GameView");
//所有游戏事件类型都放这里
var GameEvent = (function (_super) {
    __extends(GameEvent, _super);
    function GameEvent(type, bubbles, cancelable, data) {
        var _this = _super.call(this, type, bubbles, cancelable, data) || this;
        _this.data = null;
        return _this;
    }
    GameEvent.START_GAME = 'game_start';
    //下一个游戏
    GameEvent.GOT0_CHAPTER = 'goto_next_chapter';
    //当前游戏的下一个关卡
    GameEvent.GOTO_NEXT_LEVEL = 'goto_next_level';
    //授权后刷新
    GameEvent.AUTHORIZE_REFRESH = "authorize_refresh";
    return GameEvent;
}(egret.Event));
__reflect(GameEvent.prototype, "GameEvent");
var ScoreItem = (function (_super) {
    __extends(ScoreItem, _super);
    function ScoreItem() {
        var _this = _super.call(this) || this;
        _this.score = 0;
        _this.tarScore = 0;
        _this.tarLose = 0;
        _this.init();
        return _this;
    }
    ScoreItem.prototype.init = function () {
        this.scoreTxt = new egret.TextField();
        this.scoreTxt.size = 32;
        this.scoreTxt.text = '0';
        this.scoreTxt.textColor = 0x00ff00;
        this.scoreTxt.width = 300;
        this.scoreTxt.stroke = 1;
        this.scoreTxt.strokeColor = 0x000000;
        // this.scoreTxt.bold = true;
        this.addChild(this.scoreTxt);
        this.y = 30;
        this.x = 30;
    };
    //目标分和当前分
    ScoreItem.prototype.setSTScore = function (score, tarScore) {
        this.score = score;
        if (tarScore) {
            this.tarScore = tarScore;
        }
        this.scoreTxt.text = "\u5206\u6570 " + this.score + "  \u76EE\u6807 " + this.tarScore;
    };
    //目标损失和当前损失
    ScoreItem.prototype.setSTLose = function (score, tarLose) {
        this.score = score;
        if (tarLose) {
            this.tarLose = tarLose;
        }
        this.scoreTxt.text = "\u5DF2\u7528 " + this.score + "  \u603B\u6570 " + this.tarLose;
    };
    //自定义模式
    ScoreItem.prototype.setCustomText = function (str) {
        if (str === void 0) { str = ''; }
        this.scoreTxt.text = str;
    };
    //是否达成目标分
    ScoreItem.prototype.isCanPass = function () {
        if (this.score >= this.tarScore) {
            return true;
        }
        return false;
    };
    return ScoreItem;
}(egret.Sprite));
__reflect(ScoreItem.prototype, "ScoreItem");
var TimeItem = (function (_super) {
    __extends(TimeItem, _super);
    function TimeItem(time) {
        if (time === void 0) { time = 0; }
        var _this = _super.call(this) || this;
        _this._leftTime = 0;
        _this.callBackContext = null;
        _this._leftTime = time;
        _this.init();
        return _this;
    }
    TimeItem.prototype.init = function () {
        this.timeTxt = new egret.TextField();
        this.timeTxt.width = 240;
        this.timeTxt.size = 32;
        this.timeTxt.textColor = 0xff0000;
        this.timeTxt.stroke = 1;
        this.timeTxt.strokeColor = 0x000000;
        this.timeTxt.text = "\u5269\u4F59\u65F6\u95F4  " + CommonUtil.getMSTimeBySeconds(this._leftTime);
        this.y = 30;
        this.x = (SpriteUtil.stageWidth - 200) / 2;
        this.addChild(this.timeTxt);
    };
    //开始
    TimeItem.prototype.start = function (loop, thisObj) {
        if (thisObj === void 0) { thisObj = null; }
        this.timer = new egret.Timer(1000);
        this.loop = loop;
        this.callBackContext = thisObj;
        this.timer.addEventListener(egret.TimerEvent.TIMER, this.timerTick, this);
        this.timer.start();
    };
    //restart
    TimeItem.prototype.restart = function (time, loop, thisObj) {
        if (time === void 0) { time = 0; }
        if (thisObj === void 0) { thisObj = null; }
        this._leftTime = time;
        this.timeTxt.text = "\u5269\u4F59\u65F6\u95F4  " + CommonUtil.getMSTimeBySeconds(this._leftTime);
        this.timer = new egret.Timer(1000);
        this.loop = loop;
        this.callBackContext = thisObj;
        this.timer.addEventListener(egret.TimerEvent.TIMER, this.timerTick, this);
        this.timer.start();
    };
    Object.defineProperty(TimeItem.prototype, "leftTime", {
        get: function () {
            return this._leftTime;
        },
        enumerable: true,
        configurable: true
    });
    TimeItem.prototype.timerTick = function () {
        this._leftTime--;
        this.timeTxt.text = "\u5269\u4F59\u65F6\u95F4  " + CommonUtil.getMSTimeBySeconds(this._leftTime);
        if (this.loop) {
            this.loop.call(this.callBackContext, this._leftTime);
            return;
        }
        if (this._leftTime <= 0) {
            if (!this.loop) {
                EffectUtil.showResultEffect();
            }
            this.stop();
        }
    };
    TimeItem.prototype.stop = function () {
        if (this.timer) {
            this.timer.stop();
            this.timer.removeEventListener(egret.TimerEvent.TIMER, this.timerTick, this);
            this.timer = null;
        }
        this._leftTime = 0;
        this.loop = null;
        this.callBackContext = null;
    };
    return TimeItem;
}(egret.Sprite));
__reflect(TimeItem.prototype, "TimeItem");
// TypeScript file
var EgretRender = (function () {
    function EgretRender() {
    }
    EgretRender.create = function (options) {
        var defaults = {
            controller: EgretRender,
            engine: null,
            element: null,
            canvas: null,
            mouse: null,
            frameRequestId: null,
            options: {
                width: 800,
                height: 600,
                pixelRatio: 1,
                background: '#fafafa',
                wireframeBackground: '#222222',
                hasBounds: !!options['bounds'],
                enabled: true,
                wireframes: true,
                showSleeping: true,
                showDebug: false,
                showBroadphase: false,
                showBounds: false,
                showVelocity: false,
                showCollisions: false,
                showSeparations: false,
                showAxes: false,
                showPositions: false,
                showAngleIndicator: false,
                showIds: false,
                showShadows: false,
                showVertexNumbers: false,
                showConvexHulls: false,
                showInternalEdges: false,
                showMousePosition: false
            }
        };
        var render = Matter.Common.extend(defaults, options);
        render.mouse = options['mouse'];
        render.engine = options['engine'];
        render.container = render.container || egret.MainContext.instance.stage;
        render.bounds = render.bounds ||
            {
                min: {
                    x: 0,
                    y: 0
                },
                max: {
                    x: render.width,
                    y: render.height
                }
            };
        return render;
    };
    EgretRender.run = function (render) {
        this.render = render;
        egret.startTick(this.loop, EgretRender);
    };
    EgretRender.loop = function (timeStamp) {
        EgretRender.world(this.render);
        return false;
    };
    EgretRender.stop = function (cb) {
        if (cb === void 0) { cb = null; }
        egret.stopTick(this.loop, EgretRender);
        this.render = null;
    };
    EgretRender.world = function (render) {
        var engine = render.engine;
        var world = engine.world;
        var renderer = render.renderer;
        var container = render.container;
        var options = render.options;
        var bodies = Matter.Composite.allBodies(world);
        var allConstraints = Matter.Composite.allConstraints(world);
        var constraints = [];
        var boundsWidth = render.bounds.max.x - render.bounds.min.x;
        var boundsHeight = render.bounds.max.y - render.bounds.min.y;
        var boundsScaleX = boundsWidth / render.options.width;
        var boundsScaleY = boundsHeight / render.options.height;
        if (options.hasBounds) {
            for (var i = 0; i < bodies.length; i++) {
                var body = bodies[i];
                body.render.sprite.visible = Matter.Bounds.overlaps(body.bounds, render.bounds);
            }
            for (var j = 0; j < allConstraints.length; j++) {
                var constraint = allConstraints[j];
                var bodyA = constraint.bodyA;
                var bodyB = constraint.bodyB;
                var pointAWorld = constraint.pointA;
                var pointBWorld = constraint.pointB;
                if (bodyA)
                    pointAWorld = Matter.Vector.add(bodyA.position, constraint.pointA, null);
                if (bodyB)
                    pointBWorld = Matter.Vector.add(bodyB.position, constraint.pointB, null);
                if (!pointAWorld || !pointBWorld) {
                    continue;
                }
                if (Matter.Bounds.contains(render.bounds, pointAWorld) || Matter.Bounds.contains(render.bounds, pointBWorld))
                    constraints.push(constraint);
            }
            container.scaleX = 1 / boundsScaleX;
            container.scaleY = 1 / boundsScaleY;
            container.x = -render.bounds.min.x * (1 / boundsScaleX);
            container.y = -render.bounds.min.y * (1 / boundsScaleY);
        }
        else {
            constraints = allConstraints;
        }
        for (i = 0; i < bodies.length; i++) {
            EgretRender.body(render, bodies[i]);
        }
        for (i = 0; i < constraints.length; i++) {
            EgretRender.constraint(render, constraints[i]);
        }
    };
    EgretRender.body = function (render, body) {
        var engine = render.engine;
        var bodyRender = body.render;
        if (!bodyRender.visible)
            return;
        if (bodyRender.sprite instanceof egret.DisplayObject) {
            var spriteId = 'b-' + body.id;
            var sprite = body.egretSprite;
            var container = render.container;
            if (!sprite) {
                sprite = body.egretSprite = body.render.sprite;
            }
            if (!container.contains(sprite)) {
                container.addChild(sprite);
            }
            sprite.x = body.position.x;
            sprite.y = body.position.y;
            sprite.rotation = body.angle * 180 / Math.PI;
        }
        else {
            var primitiveId = 'b-' + body.id;
            var sprite = body.egretSprite;
            var container = render.container;
            if (sprite) {
                container.removeChild(sprite);
            }
            sprite = body.egretSprite = EgretRender._createBodyPrimitive(render, body);
            sprite.initAngle = body.angle;
            if (!container.contains(sprite)) {
                container.addChild(sprite);
            }
            sprite.x = body.position.x;
            sprite.y = body.position.y;
            sprite.rotation = (body.angle - sprite.initAngle) * 180 / Math.PI;
        }
    };
    EgretRender._createBodyPrimitive = function (render, body) {
        var bodyRender = body.render;
        var options = render.options;
        var sprite = new MatterSprite;
        var fillStyle;
        var strokeStyle;
        var lineWidth;
        var part;
        var points = [];
        var primitive = sprite.graphics;
        primitive.clear();
        for (var k = body.parts.length > 1 ? 1 : 0; k < body.parts.length; k++) {
            part = body.parts[k];
            if (!options.wireframes) {
                fillStyle = bodyRender.fillStyle;
                strokeStyle = bodyRender.strokeStyle;
                lineWidth = bodyRender.lineWidth;
            }
            else {
                fillStyle = 'transparent';
                strokeStyle = 0xFF0000;
                lineWidth = 1;
            }
            for (var j = 0; j < part.vertices.length; j++) {
                points.push([part.vertices[j].x - body.position.x, part.vertices[j].y - body.position.y]);
            }
            primitive.beginFill(fillStyle);
            primitive.lineStyle(lineWidth, strokeStyle);
            primitive.moveTo(points[0][0], points[0][1]);
            for (var m = 1; m < points.length; m++) {
                primitive.lineTo(points[m][0], points[m][1]);
            }
            primitive.lineTo(points[0][0], points[0][1]);
            primitive.endFill();
        }
        return sprite;
    };
    EgretRender.constraint = function (render, constraint) {
        var engine = render.engine;
        var bodyA = constraint.bodyA;
        var bodyB = constraint.bodyB;
        var pointA = constraint.pointA;
        var pointB = constraint.pointB;
        var container = render.container;
        var constraintRender = constraint.render;
        var primitiveId = 'c-' + constraint.id;
        var sprite = constraint.egretSprite;
        if (!sprite) {
            sprite = constraint.egretSprite = new MatterSprite();
        }
        var primitive = sprite.graphics;
        // constraint 没有两个终点时不渲染
        if (!constraintRender.visible || !constraint.pointA || !constraint.pointB) {
            primitive.clear();
            return;
        }
        // 如果sprite未在显示列表，则添加至显示列表
        if (!container.contains(sprite))
            container.addChild(sprite);
        // 渲染 constraint
        primitive.clear();
        var fromX;
        var fromY;
        var toX;
        var toY;
        if (bodyA) {
            fromX = bodyA.position.x + pointA.x;
            fromY = bodyA.position.y + pointA.y;
        }
        else {
            fromX = pointA.x;
            fromY = pointA.y;
        }
        if (bodyB) {
            toX = bodyB.position.x + pointB.x;
            toY = bodyB.position.y + pointB.y;
        }
        else {
            toX = pointB.x;
            toY = pointB.y;
        }
        var strokeStyle = 0x00ff00;
        primitive.lineStyle(1, strokeStyle);
        primitive.moveTo(fromX, fromY);
        primitive.lineTo(toX, toY);
        primitive.endFill();
    };
    EgretRender.render = null;
    return EgretRender;
}());
__reflect(EgretRender.prototype, "EgretRender");
var MatterSprite = (function (_super) {
    __extends(MatterSprite, _super);
    function MatterSprite() {
        return _super.call(this) || this;
    }
    return MatterSprite;
}(egret.Sprite));
__reflect(MatterSprite.prototype, "MatterSprite");
var ChapterScene = (function (_super) {
    __extends(ChapterScene, _super);
    function ChapterScene() {
        var _this = _super.call(this) || this;
        _this.listArr = [];
        _this.chaptersArr = [];
        _this.distance = new egret.Point(0, 0);
        _this.currentListIndex = 0;
        _this.isTouching = false;
        _this.isCanOperate = true;
        _this.maxPage = 2;
        _this.init();
        return _this;
    }
    ChapterScene.prototype.init = function () {
        var _this = this;
        var levels = GameData.gameConfig.levels;
        for (var i = 0; i < this.maxPage; i++) {
            this.listArr.push(this.createList(i));
        }
        this.addChild(this.listArr[0]);
        this.leftBtn = SpriteUtil.createImage('arrow');
        this.leftBtn.x = SpriteUtil.stageCenterX - 180;
        this.leftBtn.y = this.listArr[0].y + this.listArr[0].height + 100;
        this.leftBtn.scaleX = 3.2;
        this.leftBtn.scaleY = 2.2;
        this.addChild(this.leftBtn);
        this.leftBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (!_this.isCanOperate)
                return;
            _this.nextPage(-1);
        }, this);
        this.leftBtn.visible = false;
        this.rightBtn = SpriteUtil.createImage('arrow');
        this.rightBtn.x = SpriteUtil.stageCenterX + 180;
        this.rightBtn.y = this.leftBtn.y;
        this.rightBtn.scaleX = -3.2;
        this.rightBtn.scaleY = 2.2;
        this.addChild(this.rightBtn);
        this.rightBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (!_this.isCanOperate)
                return;
            _this.nextPage(1);
        }, this);
        var home = SpriteUtil.createImage('home');
        home.x = 80;
        home.y = 80;
        home.scaleX = 1.4;
        home.scaleY = 1.5;
        this.addChild(home);
        home.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            Game.instance().gameScene.enterMenu();
        }, this);
    };
    //
    ChapterScene.prototype.nextPage = function (direction) {
        var _this = this;
        if (direction === void 0) { direction = 0; }
        var lastList = this.listArr[this.currentListIndex];
        GameSound.instance().playSound("click");
        //相当于重置
        if (direction == 0) {
            if (lastList && lastList.parent) {
                lastList.parent.removeChild(lastList);
            }
            this.currentListIndex = 0;
            this.listArr[0].alpha = 1;
            this.listArr[0].x = SpriteUtil.stageCenterX - this.listArr[0].width / 2;
            this.addChild(this.listArr[0]);
            this.leftBtn.visible = false;
            this.rightBtn.visible = true;
            return;
        }
        this.currentListIndex += direction;
        if (this.currentListIndex < 0) {
            this.currentListIndex = 0;
            return;
        }
        if (this.currentListIndex >= this.maxPage) {
            this.currentListIndex = this.maxPage - 1;
            return;
        }
        //
        if (this.currentListIndex == 0) {
            this.leftBtn.visible = false;
        }
        else {
            this.leftBtn.visible = true;
        }
        if (this.currentListIndex == this.maxPage - 1) {
            this.rightBtn.visible = false;
        }
        else {
            this.rightBtn.visible = true;
        }
        var sprite = this.listArr[this.currentListIndex];
        var xx = lastList.x;
        var tx = lastList.x;
        if (direction < 0) {
            sprite.x = -lastList.width;
            tx = SpriteUtil.stageWidth;
        }
        else if (direction > 0) {
            sprite.x = SpriteUtil.stageWidth;
            tx = -lastList.width;
        }
        sprite.alpha = 0;
        this.addChild(sprite);
        if (direction != 0) {
            this.isCanOperate = false;
            egret.Tween.get(lastList).to({ x: tx, alpha: 0 }, 500).call(function () {
                egret.Tween.removeTweens(lastList);
                if (lastList.parent) {
                    lastList.parent.removeChild(lastList);
                }
            });
            egret.Tween.get(sprite).to({ x: xx, alpha: 1 }, 500).call(function () {
                egret.Tween.removeTweens(sprite);
                _this.isCanOperate = true;
            });
        }
    };
    ChapterScene.prototype.createList = function (startIndex) {
        if (startIndex === void 0) { startIndex = 0; }
        var listSpr = new egret.Sprite();
        var shape = SpriteUtil.createRect(160 * 4, 160 * 4, 0x000000);
        shape.alpha = 0.5;
        shape.anchorOffsetX = 0;
        shape.anchorOffsetY = 0;
        listSpr.addChild(shape);
        for (var i = 0; i < 16; i++) {
            var sprite = this.createBtns(i + 1 + startIndex * 16);
            sprite.x = 80 + 160 * (i % 4);
            sprite.y = 80 + 160 * Math.floor(i / 4);
            sprite.scaleX = 1.5;
            sprite.scaleY = 1.5;
            listSpr.addChild(sprite);
            this.chaptersArr.push(sprite);
        }
        listSpr.x = SpriteUtil.stageCenterX - listSpr.width / 2;
        listSpr.y = 200;
        listSpr.touchEnabled = true;
        return listSpr;
    };
    ChapterScene.prototype.createBtns = function (index) {
        var sprite = new egret.Sprite();
        var btn = SpriteUtil.createImage('circle');
        btn.touchEnabled = false;
        btn.visible = false;
        this.addChild(btn);
        var text = SpriteUtil.createText('' + index, 48, 0xffff00);
        text.touchEnabled = false;
        text.visible = false;
        sprite.addChild(btn);
        sprite.addChild(text);
        sprite.name = "btn_" + index;
        var lock = SpriteUtil.createImage('lock');
        lock.touchEnabled = false;
        sprite.addChild(lock);
        sprite.touchEnabled = false;
        sprite.addEventListener(egret.TouchEvent.TOUCH_TAP, this.selectChapter, this);
        return sprite;
    };
    ChapterScene.prototype.selectChapter = function (evt) {
        GameSound.instance().playSound("click");
        var name = evt.target.name;
        var level = name.split('_')[1];
        GameData.currentChapter = parseInt(level);
        EventCenter.instance().dispatchEvent(new GameEvent(GameEvent.GOT0_CHAPTER));
    };
    ChapterScene.prototype.refresh = function () {
        var len = this.chaptersArr.length;
        var mychap = egret.localStorage.getItem("very_funny_small_game_chapter");
        if (!mychap) {
            mychap = "1";
            WXApi.updateRankLvl(parseInt(mychap));
        }
        //only test
        if (parseInt(mychap) > 32) {
            mychap = "32";
        }
        // mychap = "32";
        for (var i = 0; i < parseInt(mychap); i++) {
            var sprite = this.chaptersArr[i];
            sprite.getChildAt(0).visible = true;
            sprite.getChildAt(1).visible = true;
            sprite.getChildAt(2).visible = false;
            sprite.touchEnabled = true;
        }
    };
    ChapterScene.prototype.enter = function () {
        this.refresh();
        this.nextPage(0);
        _super.prototype.enter.call(this);
    };
    return ChapterScene;
}(BaseScene));
__reflect(ChapterScene.prototype, "ChapterScene");
var MenuScene = (function (_super) {
    __extends(MenuScene, _super);
    function MenuScene() {
        var _this = _super.call(this) || this;
        _this.isInitOpenDataCtx = false;
        _this.init();
        return _this;
    }
    MenuScene.prototype.init = function () {
        var logo = new egret.Bitmap(RES.getRes("logo_png"));
        logo.anchorOffsetX = logo.width / 2;
        logo.x = SpriteUtil.stageCenterX;
        logo.y = 120;
        this.addChild(logo);
        var btn = SpriteUtil.createImage('social');
        btn.x = SpriteUtil.stageCenterX;
        btn.y = SpriteUtil.stageCenterY;
        btn.scaleX = 2.2;
        btn.scaleY = 2.2;
        this.addChild(btn);
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            GameSound.instance().playSound('click');
            Game.instance().gameScene.enterChapter();
            // EventCenter.instance().dispatchEvent(new GameEvent(GameEvent.GOTO_NEXT));
        }, this);
        this.startBtn = btn;
        var rankbtn = SpriteUtil.createImage('rank');
        rankbtn.x = SpriteUtil.stageCenterX - 100;
        rankbtn.y = btn.y + 250;
        rankbtn.scaleX = 1.5;
        rankbtn.scaleY = 1.5;
        this.addChild(rankbtn);
        rankbtn.touchEnabled = true;
        rankbtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (!GameData.isWxGame)
                return;
            GameSound.instance().playSound('click');
            Game.instance().gameView.rankView.open();
        }, this);
        var sharebtn = SpriteUtil.createImage('share');
        sharebtn.x = SpriteUtil.stageCenterX + 100;
        sharebtn.y = btn.y + 250;
        sharebtn.scaleX = 1.5;
        sharebtn.scaleY = 1.5;
        this.addChild(sharebtn);
        sharebtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (!GameData.isWxGame)
                return;
            WXApi.shareAppMessage();
        }, this);
        var jumpbtn = SpriteUtil.createImage('game_more_1');
        jumpbtn.x = SpriteUtil.stageWidth - jumpbtn.width + 10;
        jumpbtn.y = 150;
        jumpbtn.scaleX = 1.2;
        jumpbtn.scaleY = 1.2;
        this.addChild(jumpbtn);
        jumpbtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (!GameData.isWxGame)
                return;
            //逻辑迷宫
            WXApi.navigateToMiniProgram("wx8bc01658647ef87a");
        }, this);
        this.gameClubBtn = WXApi.createGameClubButton();
        //
        EventCenter.instance().addEventListener(GameEvent.AUTHORIZE_REFRESH, this.initOpenData, this);
        WXApi.getSetting();
    };
    MenuScene.prototype.initOpenData = function () {
        EventCenter.instance().removeEventListener(GameEvent.AUTHORIZE_REFRESH, this.initOpenData, this);
        if (!this.isInitOpenDataCtx) {
            this.isInitOpenDataCtx = true;
            var openDatactx = platform['openDataContext'];
            //由于没有服务器 暂时使用avatarUrl 标识用户
            openDatactx.postMessage({ command: 'cmd_openId', openId: GameData.wxUserInfo.avatarUrl });
        }
    };
    MenuScene.prototype.enter = function () {
        _super.prototype.enter.call(this);
        egret.Tween.get(this.startBtn, { loop: true }).to({ scaleX: 2.4, scaleY: 2.4 }, 1500).to({ scaleX: 2.2, scaleY: 2.2 }, 1500);
        this.gameClubBtn.show();
    };
    MenuScene.prototype.exit = function () {
        _super.prototype.exit.call(this);
        this.gameClubBtn.hide();
        egret.Tween.removeTweens(this.startBtn);
        this.startBtn.scaleX = 2.2;
        this.startBtn.scaleY = 2.2;
    };
    return MenuScene;
}(BaseScene));
__reflect(MenuScene.prototype, "MenuScene");
var OverScene = (function (_super) {
    __extends(OverScene, _super);
    function OverScene() {
        var _this = _super.call(this) || this;
        _this.init();
        return _this;
    }
    OverScene.prototype.init = function () {
        var img = SpriteUtil.createImage("lose");
        img.scaleX = 1.5;
        img.scaleY = 3;
        img.x = SpriteUtil.stageCenterX;
        img.y = SpriteUtil.stageCenterY - 300;
        this.addChild(img);
        var btn = SpriteUtil.createText(">> 继 续 <<", 60, 0xff00ff);
        btn.x = SpriteUtil.stageCenterX;
        btn.y = SpriteUtil.stageCenterY - 80;
        btn.touchEnabled = true;
        this.addChild(btn);
        EffectUtil.breath(btn, 0.05);
        var btn1 = SpriteUtil.createText(">> 菜 单 <<", 60, 0xff00ff);
        btn1.x = SpriteUtil.stageCenterX;
        btn1.y = SpriteUtil.stageCenterY + 20;
        btn1.touchEnabled = true;
        this.addChild(btn1);
        EffectUtil.breath(btn1, 0.05);
        var btn2 = SpriteUtil.createText(">> 分 享 <<", 60, 0xff00ff);
        btn2.x = SpriteUtil.stageCenterX;
        btn2.y = SpriteUtil.stageCenterY + 120;
        btn2.touchEnabled = true;
        this.addChild(btn2);
        EffectUtil.breath(btn2, 0.05);
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            GameSound.instance().playSound('click');
            Game.instance().gameScene.enterChapter();
        }, this);
        btn1.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            GameSound.instance().playSound('click');
            Game.instance().gameScene.enterMenu();
        }, this);
        btn2.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            GameSound.instance().playSound('click');
            WXApi.shareAppMessage();
        }, this);
    };
    return OverScene;
}(BaseScene));
__reflect(OverScene.prototype, "OverScene");
var Scene_000 = (function (_super) {
    __extends(Scene_000, _super);
    function Scene_000() {
        var _this = _super.call(this) || this;
        _this.init();
        return _this;
    }
    Scene_000.prototype.init = function () {
        var text = SpriteUtil.createText('你是怎么来到这个关卡的\n真是难以置信');
        text.x = SpriteUtil.stageCenterX;
        text.y = SpriteUtil.stageCenterY;
        this.addChild(text);
    };
    return Scene_000;
}(BaseScene));
__reflect(Scene_000.prototype, "Scene_000");
//十二生肖
var Scene_001 = (function (_super) {
    __extends(Scene_001, _super);
    function Scene_001() {
        var _this = _super.call(this) || this;
        _this.init();
        return _this;
    }
    Scene_001.prototype.init = function () {
        this.selectedArr = [];
        var rect = SpriteUtil.createRect(SpriteUtil.stageWidth, SpriteUtil.stageHeight / 8, 0xCDCDC1);
        rect.x = SpriteUtil.stageWidth / 2;
        rect.y = SpriteUtil.stageHeight - rect.height / 2;
        rect.touchEnabled = true;
        this.bounds = { width: SpriteUtil.stageWidth - 60, height: SpriteUtil.stageHeight - SpriteUtil.stageHeight / 8 - 60 };
        for (var i = 0; i < this.dataVo.sData.length; i++) {
            this.createText(this.dataVo.sData.charAt(i));
        }
        this.addChild(rect);
        this.tarText = new egret.TextField();
        this.tarText.name = 'target_text';
        this.tarText.textAlign = 'center';
        this.tarText.text = '';
        this.tarText.size = 36;
        this.tarText.textColor = 0x0000ff;
        this.tarText.stroke = 1;
        this.tarText.strokeColor = 0xffff00;
        this.tarText.bold = true;
        this.tarText.width = SpriteUtil.stageWidth;
        this.tarText.y = rect.y - 30;
        this.addChild(this.tarText);
        this.tarText.touchEnabled = true;
        this.tarText.addEventListener(egret.TouchEvent.TOUCH_TAP, this.textClk, this);
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
    };
    //事件处理
    Scene_001.prototype.textClk = function (evt) {
        var _this = this;
        if (this.timeItem.leftTime <= 0)
            return;
        var text = evt.target;
        GameSound.instance().playSound('click');
        if (this.tarText == text) {
            text = this.selectedArr.pop();
            var xx = 200 + 320 * Math.random();
            var yy = SpriteUtil.stageHeight / 2 - 100;
            var tstr = this.tarText.text;
            this.tarText.text = tstr.substr(0, tstr.length - 1);
            egret.Tween.get(text).to({ x: xx, y: yy }, 500, egret.Ease.quadOut).call(function () {
                egret.Tween.removeTweens(text);
                _this.back(text);
            });
        }
        else {
            text.touchEnabled = false;
            this.tarText.touchEnabled = false;
            egret.Tween.removeTweens(text);
            egret.Tween.get(text).to({ x: this.tarText.x + this.tarText.width / 2, y: this.tarText.y, rotation: 0 }, 500).call(function () {
                egret.Tween.removeTweens(text);
                var str = "" + _this.tarText.text + text.text;
                _this.tarText.text = str;
                text.touchEnabled = true;
                _this.tarText.touchEnabled = true;
                _this.selectedArr.push(text);
                if (_this.dataVo.tData.indexOf(str) >= 0) {
                    var leftTime = _this.timeItem.leftTime;
                    _this.timeItem.stop();
                    if (leftTime >= 30) {
                        EffectUtil.showResultEffect(EffectUtil.PERFECT);
                    }
                    else if (leftTime >= 15) {
                        EffectUtil.showResultEffect(EffectUtil.GREAT);
                    }
                    else {
                        EffectUtil.showResultEffect(EffectUtil.GOOD);
                    }
                }
            });
        }
    };
    Scene_001.prototype.createText = function (name) {
        var text = new egret.TextField();
        text.size = 48;
        text.text = name;
        text.textColor = 0xffffff * (8 * Math.random() + 2) / 10;
        text.stroke = 0.5;
        text.strokeColor = 0xffff00;
        text.bold = true;
        text.x = this.bounds.width * Math.random();
        text.y = this.bounds.height * Math.random();
        this.addChild(text);
        text.touchEnabled = true;
        text.addEventListener(egret.TouchEvent.TOUCH_TAP, this.textClk, this);
        this.back(text);
    };
    Scene_001.prototype.back = function (target) {
        var _this = this;
        egret.Tween.get(target).to({
            x: this.bounds.width * Math.random(),
            y: this.bounds.height * Math.random(),
            rotation: 360 * Math.random()
        }, 5000 + 2000 * Math.random()).call(function () {
            _this.back(target);
        });
    };
    Scene_001.prototype.enter = function () {
        _super.prototype.enter.call(this);
        this.timeItem.start();
    };
    //清内存
    Scene_001.prototype.exit = function () {
        while (this.numChildren > 1) {
            var child = this.getChildAt(this.numChildren - 1);
            if (child instanceof egret.TextField) {
                child.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.textClk, this);
            }
            egret.Tween.removeTweens(child);
            this.removeChild(child);
        }
        this.timeItem.stop();
        _super.prototype.exit.call(this);
    };
    return Scene_001;
}(BaseScene));
__reflect(Scene_001.prototype, "Scene_001");
//连连看 字符版
var Scene_002 = (function (_super) {
    __extends(Scene_002, _super);
    function Scene_002() {
        var _this = _super.call(this) || this;
        _this.init();
        return _this;
    }
    Scene_002.prototype.init = function () {
        //无序化
        var arr1 = this.dataVo.sData;
        var arr = arr1.concat(arr1);
        var num = arr.length;
        //多少列
        var columns = Math.round(Math.sqrt(num));
        //每个格子宽度
        var wid = Math.round(SpriteUtil.stageWidth - 50) / columns;
        //乱序
        arr.sort(function (a, b) {
            if (Math.random() > 0.5)
                return 1;
            if (Math.random() < 0.5)
                return -1;
            return 0;
        });
        this.group = new egret.Sprite();
        var len = arr.length;
        for (var i = 0; i < len; i++) {
            var img = SpriteUtil.createImage(arr[i], true);
            img.anchorOffsetX = 0;
            img.anchorOffsetY = 0;
            img.scaleX = wid / img.width;
            img.scaleY = wid / img.height;
            img.name = arr[i];
            img.x = (wid + 2) * (i % columns);
            img.y = (wid + 2) * Math.floor(i / columns);
            this.group.addChild(img);
            img.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clkHandler, this);
        }
        this.addChild(this.group);
        this.group.x = SpriteUtil.stageCenterX - this.group.width / 2;
        this.group.y = 200;
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
    };
    Scene_002.prototype.clkHandler = function (evt) {
        if (this.timeItem && this.timeItem.leftTime <= 0)
            return;
        GameSound.instance().playSound('click');
        if (!this.currentSelect) {
            this.currentSelect = evt.target;
            this.currentSelect.alpha = 0.5;
        }
        else if (this.currentSelect == evt.target) {
            this.currentSelect.alpha = 1;
            this.currentSelect = null;
        }
        else {
            if (this.currentSelect.name == evt.target.name) {
                this.group.removeChild(this.currentSelect);
                this.group.removeChild(evt.target);
                this.currentSelect = null;
            }
            else {
                this.currentSelect.alpha = 1;
                this.currentSelect = evt.target;
                this.currentSelect.alpha = 0.5;
            }
        }
        if (this.group.numChildren <= 0) {
            var leftTime = this.timeItem.leftTime;
            this.timeItem.stop();
            if (leftTime >= 60) {
                EffectUtil.showResultEffect(EffectUtil.PERFECT);
            }
            else if (leftTime >= 30) {
                EffectUtil.showResultEffect(EffectUtil.GREAT);
            }
            else {
                EffectUtil.showResultEffect(EffectUtil.GOOD);
            }
        }
    };
    Scene_002.prototype.enter = function () {
        _super.prototype.enter.call(this);
        this.timeItem.start();
    };
    Scene_002.prototype.exit = function () {
        _super.prototype.exit.call(this);
        while (this.numChildren > 1) {
            var child = this.getChildAt(this.numChildren - 1);
            if (child.hasEventListener(egret.TouchEvent.TOUCH_TAP)) {
                child.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.clkHandler, this);
            }
            this.removeChild(child);
        }
    };
    return Scene_002;
}(BaseScene));
__reflect(Scene_002.prototype, "Scene_002");
//营救公主
var Scene_003 = (function (_super) {
    __extends(Scene_003, _super);
    function Scene_003() {
        var _this = _super.call(this) || this;
        //数值部分
        _this.angleSpeed1 = 0.06;
        _this.angleSpeed2 = 0.06;
        _this.angleSpeed3 = 0.07;
        _this.angleSpeed4 = 0.075;
        _this.isTouching = false;
        _this.categories = [0x0001, 0x0002, 0x0004, 0x0008, 0x0010, 0x0020, 0x0040, 0x0080];
        _this.playerCategory = 0x0100;
        _this.isRunning = true;
        _this.init();
        return _this;
    }
    Scene_003.prototype.init = function () {
        var _this = this;
        //sdata 代表移动敌人的速度
        this.timeItem = new TimeItem(this.dataVo.time);
        this.timeItem.x = SpriteUtil.stageWidth - 250;
        this.addChild(this.timeItem);
        this.engine = Matter.Engine.create({ enableSleeping: false }, null);
        var world = this.engine.world;
        this.runner = Matter.Runner.create(null);
        this.runner.isFixed = true;
        var render = EgretRender.create({
            engine: this.engine,
            container: this,
            options: {
                width: SpriteUtil.stageWidth,
                height: SpriteUtil.stageHeight,
                wireframes: true
            }
        });
        //取消重力
        world.gravity.y = 0;
        Matter.Runner.run(this.runner, this.engine);
        EgretRender.run(render);
        //player
        var playerSpr = SpriteUtil.createImage("boy");
        this.player = Matter.Bodies.rectangle(50, 1250, playerSpr.width - 20, playerSpr.height - 6, {
            stiffness: 1,
            collisionFilter: {
                category: this.playerCategory
            },
            render: {
                sprite: playerSpr
            }
        });
        //target
        var girl = SpriteUtil.createImage("girl");
        this.girlbdy = Matter.Bodies.circle(SpriteUtil.stageCenterX, girl.height / 2 + 60, girl.width / 2, {
            stiffness: 1,
            collisionFilter: {
                category: this.categories[0],
                mask: this.playerCategory | this.categories[0]
            },
            render: {
                sprite: girl
            }
        }, 0);
        Matter.World.add(world, [this.player, this.girlbdy]);
        playerSpr.touchEnabled = true;
        playerSpr.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function (evt) {
            _this.isTouching = true;
        }, this);
        playerSpr.addEventListener(egret.TouchEvent.TOUCH_MOVE, function (evt) {
            if (_this.isTouching) {
                var xx = evt['stageX'];
                var yy = evt['stageY'];
                if (xx < 0) {
                    xx = 0;
                }
                else if (xx > SpriteUtil.stageWidth) {
                    xx = SpriteUtil.stageWidth;
                }
                if (yy > SpriteUtil.stageHeight) {
                    yy = SpriteUtil.stageHeight;
                }
                else if (yy < 0) {
                    yy = 0;
                }
                Matter.Body.setPosition(_this.player, { x: xx, y: yy });
            }
        }, this);
        playerSpr.addEventListener(egret.TouchEvent.TOUCH_END, function (evt) {
            _this.isTouching = false;
        }, this);
        if (this.dataVo.level == 1) {
            this.initL1();
        }
        else if (this.dataVo.level == 2) {
            this.initL2();
        }
        else if (this.dataVo.level == 3) {
            this.initL3();
        }
        //更新
        Matter.Events.on(this.engine, 'beforeUpdate', this.beforeUpdateHandle.bind(this));
        //碰撞检测
        Matter.Events.on(this.engine, 'collisionStart', this.collisionHandle.bind(this));
    };
    Scene_003.prototype.initL1 = function () {
        var world = this.engine.world;
        var enemy1 = this.createEnemy(SpriteUtil.stageCenterX - 360, SpriteUtil.stageCenterY, this.categories[1], 36);
        Matter.World.add(this.engine.world, enemy1);
        this.enemies = [enemy1];
        Matter.Body.setAngularVelocity(this.enemies[0][0], this.angleSpeed1 * 1.2);
        //飞镖
        var arrowspr1 = SpriteUtil.createImage('insect');
        var scale = 50 / arrowspr1.width;
        arrowspr1.scaleX = scale;
        arrowspr1.scaleY = scale;
        var arrow1 = Matter.Bodies.circle(100, 200, scale * arrowspr1.width / 2, {
            label: 'Body_enemy',
            friction: 0,
            frictionAir: 0,
            render: {
                sprite: arrowspr1
            }
        }, 0);
        var arrowspr2 = SpriteUtil.createImage('insect');
        arrowspr2.scaleX = scale;
        arrowspr2.scaleY = scale;
        var arrow2 = Matter.Bodies.circle(SpriteUtil.stageWidth - 100, SpriteUtil.stageHeight - 200, scale * arrowspr2.width / 2, {
            label: 'Body_enemy',
            friction: 0,
            frictionAir: 0,
            render: {
                sprite: arrowspr2
            }
        }, 0);
        Matter.World.add(world, [arrow1, arrow2]);
        this.enemies.push(arrow1);
        this.enemies.push(arrow2);
        Matter.Body.setVelocity(arrow1, { x: this.dataVo.sData, y: 0 });
        Matter.Body.setVelocity(arrow2, { x: -1 * this.dataVo.sData, y: 0 });
    };
    Scene_003.prototype.initL2 = function () {
        var _this = this;
        var world = this.engine.world;
        //飞镖
        var func = function (i) {
            var arrowspr1 = SpriteUtil.createImage('insect');
            var scale = 50 / arrowspr1.width;
            arrowspr1.scaleX = scale;
            arrowspr1.scaleY = scale;
            var xx = i % 2 == 0 ? SpriteUtil.stageWidth - 250 : 250;
            var arrow1 = Matter.Bodies.circle(xx, 200 + i * 100, scale * arrowspr1.width / 2, {
                label: 'Body_enemy',
                friction: 0,
                frictionAir: 0,
                render: {
                    sprite: arrowspr1
                }
            }, 0);
            var dir = i % 2 == 0 ? -1 : 1;
            Matter.Body.setVelocity(arrow1, { x: dir * _this.dataVo.sData * 10, y: 0 });
            return arrow1;
        };
        this.enemies = [];
        for (var i = 0; i < 8; i++) {
            this.enemies.push(func(i));
        }
        Matter.World.add(world, this.enemies);
    };
    Scene_003.prototype.initL3 = function () {
        var world = this.engine.world;
        var enemy1 = this.createEnemy(0, 560, this.categories[1]);
        Matter.World.add(world, enemy1);
        var enemy2 = this.createEnemy(200, 560, this.categories[2]);
        Matter.World.add(world, enemy2);
        var enemy3 = this.createEnemy(400, 560, this.categories[3]);
        Matter.World.add(world, enemy3);
        var enemy4 = this.createEnemy(580, 560, this.categories[4]);
        Matter.World.add(world, enemy4);
        //大环两个一组
        var enemy5 = this.createEnemy(0, 860, this.categories[5], 15);
        Matter.World.add(world, enemy5);
        var enemy6 = this.createEnemy(400, 860, this.categories[5], 15);
        Matter.World.add(world, enemy6);
        //大环一个
        var enemy7 = this.createEnemy(210, 1100, this.categories[5], 15);
        Matter.World.add(world, enemy7);
        //包围机器人
        var enemy8 = this.createEnemy(160, 160, this.categories[5]);
        Matter.World.add(world, enemy8);
        var enemy9 = this.createEnemy(310, 260, this.categories[5]);
        Matter.World.add(world, enemy9);
        var enemy10 = this.createEnemy(460, 160, this.categories[5]);
        Matter.World.add(world, enemy10);
        this.enemies = [enemy1, enemy2, enemy3, enemy4, enemy5, enemy6, enemy7, enemy8, enemy9, enemy10];
        //飞镖
        var arrowspr1 = SpriteUtil.createImage('insect');
        var scale = 50 / arrowspr1.width;
        arrowspr1.scaleX = scale;
        arrowspr1.scaleY = scale;
        var arrow1 = Matter.Bodies.circle(100, 360, scale * arrowspr1.width / 2, {
            label: 'Body_enemy',
            friction: 0,
            frictionAir: 0,
            render: {
                sprite: arrowspr1
            }
        }, 0);
        var arrowspr2 = SpriteUtil.createImage('insect');
        arrowspr2.scaleX = scale;
        arrowspr2.scaleY = scale;
        var arrow2 = Matter.Bodies.circle(SpriteUtil.stageWidth - 100, 460, scale * arrowspr2.width / 2, {
            label: 'Body_enemy',
            friction: 0,
            frictionAir: 0,
            render: {
                sprite: arrowspr2
            }
        }, 0);
        Matter.World.add(world, [arrow1, arrow2]);
        this.enemies.push(arrow1);
        this.enemies.push(arrow2);
        //运动起来 旋转起来
        Matter.Body.setAngularVelocity(this.enemies[0][0], 0.1);
        Matter.Body.setAngularVelocity(this.enemies[0][0], this.angleSpeed1);
        Matter.Body.setAngularVelocity(this.enemies[1][0], -this.angleSpeed1);
        Matter.Body.setAngularVelocity(this.enemies[2][0], -this.angleSpeed1);
        Matter.Body.setAngularVelocity(this.enemies[3][0], this.angleSpeed1);
        Matter.Body.setAngularVelocity(this.enemies[4][0], -this.angleSpeed2);
        Matter.Body.setAngularVelocity(this.enemies[5][0], this.angleSpeed2);
        Matter.Body.setAngularVelocity(this.enemies[6][0], -this.angleSpeed3);
        Matter.Body.setAngularVelocity(this.enemies[7][0], this.angleSpeed4);
        Matter.Body.setAngularVelocity(this.enemies[8][0], -this.angleSpeed4);
        Matter.Body.setAngularVelocity(this.enemies[9][0], this.angleSpeed4);
        Matter.Body.setVelocity(this.enemies[10], { x: this.dataVo.sData, y: 0 });
        Matter.Body.setVelocity(this.enemies[11], { x: -1 * this.dataVo.sData, y: 0 });
    };
    //bdfore update
    Scene_003.prototype.beforeUpdateHandle = function (evt) {
        if (!this.isRunning)
            return;
        var len = this.enemies.length;
        var num = 0;
        if (this.dataVo.level == 1 || this.dataVo.level == 3) {
            num = len - 2;
        }
        for (var i = len - 1; i >= num; i--) {
            if (this.enemies[i].position.x < 0) {
                Matter.Body.setVelocity(this.enemies[i], { x: this.dataVo.sData, y: 0 });
            }
            else if (this.enemies[i].position.x > SpriteUtil.stageWidth) {
                Matter.Body.setVelocity(this.enemies[i], { x: -1 * this.dataVo.sData, y: 0 });
            }
        }
    };
    //collisionStart
    Scene_003.prototype.collisionHandle = function (evt) {
        var pairs = evt.pairs;
        for (var _i = 0, pairs_1 = pairs; _i < pairs_1.length; _i++) {
            var pair = pairs_1[_i];
            if (pair.bodyA == this.player || pair.bodyB == this.player) {
                if (pair.bodyA.label == 'Body_enemy' || pair.bodyB.label == 'Body_enemy') {
                    this.isRunning = false;
                    this.timeItem.stop();
                    this.player.render.sprite.touchEnabled = false;
                    Matter.Runner.stop(this.runner);
                    EgretRender.stop();
                    Matter.Engine.clear(this.engine);
                    Matter.Sleeping.afterCollisions(pairs, 0.01);
                    Matter.Events.off(this.engine, 'beforeUpdate', this.beforeUpdateHandle);
                    Matter.Events.off(this.engine, 'collisionStart', this.collisionHandle);
                    EffectUtil.showResultEffect();
                }
                else if (pair.bodyA == this.girlbdy || pair.bodyB == this.girlbdy) {
                    this.isRunning = false;
                    this.player.render.sprite.touchEnabled = false;
                    Matter.Runner.stop(this.runner);
                    EgretRender.stop();
                    Matter.Engine.clear(this.engine);
                    Matter.Sleeping.afterCollisions(pairs, 0.01);
                    Matter.Events.off(this.engine, 'collisionStart', this.collisionHandle);
                    if (this.timeItem.leftTime >= 30) {
                        EffectUtil.showResultEffect(EffectUtil.PERFECT);
                    }
                    else if (this.timeItem.leftTime >= 15) {
                        EffectUtil.showResultEffect(EffectUtil.GREAT);
                    }
                    else {
                        EffectUtil.showResultEffect(EffectUtil.GOOD);
                    }
                    this.timeItem.stop();
                }
            }
        }
    };
    //创建敌人加碰撞过滤
    Scene_003.prototype.createEnemy = function (xx, yy, category, num) {
        if (category === void 0) { category = 0x0001; }
        if (num === void 0) { num = 7; }
        var radius = 10;
        var stack1 = Matter.Composites.stack(xx, yy, num, 1, 0, 0, function (x, y) {
            return Matter.Bodies.circle(x, y, radius, {
                label: 'Body_enemy'
            }, 0);
        });
        var spr = new egret.Sprite();
        var scale = radius * 2 / 64;
        for (var i = 0; i < num; i++) {
            var t1 = SpriteUtil.createImage("fireball");
            t1.scaleX = scale;
            t1.scaleY = scale;
            t1.x = i * radius * 2;
            spr.addChild(t1);
        }
        spr.anchorOffsetX = spr.width / 2 - radius - radius / 2;
        var enemy = Matter.Body.create({
            parts: stack1.bodies,
            friction: 0,
            frictionAir: 0,
            render: {
                sprite: spr
            },
            collisionFilter: {
                category: category,
                mask: this.playerCategory | category
            }
        });
        var constaint1 = Matter.Constraint.create({
            pointB: { x: enemy.position.x, y: enemy.position.y },
            bodyA: enemy,
            stiffness: 1,
            friction: 0,
            length: 0
        });
        return [enemy, constaint1];
    };
    Scene_003.prototype.enter = function () {
        _super.prototype.enter.call(this);
        this.timeItem.start();
    };
    Scene_003.prototype.exit = function () {
        Matter.World.remove(this.engine.world, this.engine.world.bodies, 0);
        Matter.World.remove(this.engine.world, this.engine.world.constraints, 0);
        Matter.Runner.stop(this.runner);
        EgretRender.stop();
        Matter.Engine.clear(this.engine);
        Matter.Events.off(this.engine, 'collisionStart', this.collisionHandle);
        while (this.numChildren > 1) {
            var child = this.getChildAt(this.numChildren - 1);
            this.removeChild(child);
        }
        _super.prototype.exit.call(this);
    };
    return Scene_003;
}(BaseScene));
__reflect(Scene_003.prototype, "Scene_003");
//考验观察力
var Scene_004 = (function (_super) {
    __extends(Scene_004, _super);
    function Scene_004() {
        var _this = _super.call(this) || this;
        _this.rotateAngle = 0;
        //目标箱子索引
        _this.targetIndex = 0;
        //交换间隔时间
        _this.intervalTime = 0;
        //交换次数
        _this.exchangeTimes = 0;
        //最大交换次数
        _this.maxTimes = 0;
        _this.isGameStart = false;
        _this.init();
        return _this;
    }
    Scene_004.prototype.init = function () {
        this.giftBoxArr = [];
        this.giftGroup = new egret.Sprite();
        this.addChild(this.giftGroup);
        var box = this.dataVo.sData[0];
        var num = this.dataVo.sData[1];
        var cols = Math.sqrt(num);
        var wid = (SpriteUtil.stageWidth - 100) / cols;
        for (var i = 0; i < num; i++) {
            var bag = SpriteUtil.createImage(box);
            var scale = wid / bag.width;
            bag.scaleX = scale;
            bag.scaleY = scale;
            bag.x = wid / 2 + (i % cols) * (wid + 10);
            bag.y = wid / 2 + (wid + 10) * Math.floor(i / cols);
            bag.name = "giftBag_" + i;
            this.giftGroup.addChild(bag);
            bag.touchEnabled = true;
            bag.addEventListener(egret.TouchEvent.TOUCH_TAP, this.giftTap, this);
            this.giftBoxArr.push(bag);
        }
        this.giftGroup.x = SpriteUtil.stageCenterX - this.giftGroup.width / 2;
        this.giftGroup.y = SpriteUtil.stageCenterY - this.giftGroup.height / 2 - 200;
        this.rotatePoint = new egret.Point(SpriteUtil.stageCenterX, SpriteUtil.stageCenterY - 200);
        this.startPoint = new egret.Point(SpriteUtil.stageCenterX, 100);
        this.giftDisplay = SpriteUtil.createImage(this.dataVo.tData);
        this.giftDisplay.scaleX = wid / this.giftDisplay.width / 1.5;
        this.giftDisplay.scaleY = wid / this.giftDisplay.width / 1.5;
        this.giftDisplay.x = SpriteUtil.stageCenterX;
        this.giftDisplay.y = 50;
        this.addChild(this.giftDisplay);
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
        //确定交换时间 写死
        if (num == 9) {
            this.intervalTime = 300;
            this.maxTimes = 25;
        }
        else if (num == 16) {
            this.intervalTime = 200;
            this.maxTimes = 30;
        }
        else {
            this.intervalTime = 180;
            this.maxTimes = 60;
        }
        this.playDrop();
    };
    //放礼物
    Scene_004.prototype.playDrop = function () {
        var _this = this;
        egret.Tween.get(this.giftDisplay).to({ x: this.giftDisplay.x, y: this.startPoint.y }, 500).call(function () {
            egret.startTick(_this.loop, _this);
        }).wait(500);
    };
    Scene_004.prototype.loop = function (timeStamp) {
        var _this = this;
        this.rotateAngle += 0.1;
        var xx = this.startPoint.x - this.rotatePoint.x;
        var yy = this.startPoint.y - this.rotatePoint.y;
        this.giftDisplay.x = xx * Math.cos(this.rotateAngle) - yy * Math.sin(this.rotateAngle) + this.rotatePoint.x;
        this.giftDisplay.y = yy * Math.cos(this.rotateAngle) - xx * Math.sin(this.rotateAngle) + this.rotatePoint.y;
        if (this.rotateAngle > 2 * Math.PI + 2 * Math.PI * Math.random()) {
            egret.stopTick(this.loop, this);
            var point = this.giftGroup.localToGlobal(this.giftBoxArr[this.targetIndex].x, this.giftBoxArr[this.targetIndex].y);
            egret.Tween.get(this.giftDisplay).to({ x: point.x, y: point.y }, 500, egret.Ease.cubicIn).to({ alpha: 0 }, 1000).call(function () {
                egret.Tween.removeTweens(_this.giftDisplay);
                _this.giftDisplay.visible = false;
                _this.randomBox(true);
            });
        }
        return false;
    };
    //随机移动箱子
    Scene_004.prototype.randomBox = function (isbool) {
        var _this = this;
        if (isbool === void 0) { isbool = false; }
        var index1 = Math.random() < 0.2 || isbool ? this.targetIndex : Math.floor(this.giftBoxArr.length * Math.random());
        var index2 = Math.floor(this.giftBoxArr.length * Math.random());
        if (index1 == index2) {
            this.randomBox();
            return;
        }
        this.exchangeTimes++;
        if (this.exchangeTimes >= this.maxTimes) {
            this.isGameStart = true;
            this.timeItem.start();
            return;
        }
        var box1 = this.giftBoxArr[index1];
        var box2 = this.giftBoxArr[index2];
        var point1 = new egret.Point(box1.x, box1.y);
        var point2 = new egret.Point(box2.x, box2.y);
        egret.Tween.get(box1).to({ x: point2.x, y: point2.y }, this.intervalTime);
        egret.Tween.get(box2).to({ x: point1.x, y: point1.y }, this.intervalTime).call(function () {
            var sid = egret.setTimeout(function () {
                egret.clearTimeout(sid);
                _this.randomBox();
            }, _this, 50);
        });
    };
    Scene_004.prototype.giftTap = function (evt) {
        var _this = this;
        if (!this.isGameStart)
            return;
        GameSound.instance().playSound('click');
        var name = evt.target.name;
        if (name.search('giftBag') < 0)
            return;
        this.isGameStart = false;
        var index = evt.target.name.split('_')[1];
        var point = this.giftGroup.localToGlobal(this.giftBoxArr[this.targetIndex].x, this.giftBoxArr[this.targetIndex].y);
        this.giftDisplay.x = point.x;
        this.giftDisplay.y = point.y;
        this.giftDisplay.alpha = 0;
        this.giftDisplay.visible = true;
        if (index == this.targetIndex) {
            var leftTime_2 = this.timeItem.leftTime;
            this.timeItem.stop();
            egret.Tween.get(this.giftDisplay).to({ alpha: 1 }, 300).call(function () {
                egret.Tween.removeTweens(_this.giftDisplay);
                if (leftTime_2 >= 10) {
                    EffectUtil.showResultEffect(EffectUtil.PERFECT);
                }
                else if (leftTime_2 >= 5) {
                    EffectUtil.showResultEffect(EffectUtil.GREAT);
                }
                else {
                    EffectUtil.showResultEffect(EffectUtil.GOOD);
                }
            });
        }
        else {
            this.timeItem.stop();
            egret.Tween.get(this.giftDisplay).to({ alpha: 1 }, 300).call(function () {
                egret.Tween.removeTweens(_this.giftDisplay);
                EffectUtil.showResultEffect();
            });
        }
    };
    Scene_004.prototype.enter = function () {
        _super.prototype.enter.call(this);
        this.targetIndex = Math.floor(this.giftBoxArr.length * Math.random());
        // console.log('targetIndex:'+this.targetIndex);
        this.playDrop();
    };
    Scene_004.prototype.exit = function () {
        egret.Tween.removeAllTweens();
        _super.prototype.exit.call(this);
    };
    return Scene_004;
}(BaseScene));
__reflect(Scene_004.prototype, "Scene_004");
//只能吃水果
var Scene_005 = (function (_super) {
    __extends(Scene_005, _super);
    function Scene_005() {
        var _this = _super.call(this) || this;
        _this.itemCategory = 0x0002;
        _this.playerCategory = 0x0100;
        _this.score = 0;
        _this.isTouching = false;
        _this.init();
        return _this;
    }
    Scene_005.prototype.init = function () {
        var _this = this;
        //sdata 水果  tdata 物品  time 总数
        this.engine = Matter.Engine.create({ enableSleeping: false }, null);
        this.runner = Matter.Runner.create(null);
        this.render = EgretRender.create({
            engine: this.engine,
            container: this,
            options: {
                width: SpriteUtil.stageWidth,
                height: SpriteUtil.stageHeight,
                wireframes: true
            }
        });
        Matter.Runner.run(this.runner, this.engine);
        EgretRender.run(this.render);
        this.engine.world.gravity.y = 0;
        this.recycleArr = [];
        this.initAllItem();
        var plySpr = SpriteUtil.createImage(this.dataVo.extData);
        var scale = 100 / plySpr.width;
        plySpr.scaleX = scale;
        plySpr.scaleY = scale;
        this.player = Matter.Bodies.circle(SpriteUtil.stageCenterX, SpriteUtil.stageCenterY, scale * (plySpr.height - 10) / 2, {
            isStatic: true,
            collisionFilter: {
                category: this.playerCategory
            },
            render: {
                sprite: plySpr
            }
        }, 0);
        Matter.World.add(this.engine.world, this.player);
        plySpr.touchEnabled = true;
        plySpr.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function () {
            _this.isTouching = true;
        }, this);
        plySpr.addEventListener(egret.TouchEvent.TOUCH_MOVE, function (evt) {
            if (_this.isTouching) {
                Matter.Body.setPosition(_this.player, { x: evt['stageX'], y: evt['stageY'] });
            }
        }, this);
        plySpr.addEventListener(egret.TouchEvent.TOUCH_END, function () {
            _this.isTouching = false;
        }, this);
        Matter.Events.on(this.engine, 'beforeUpdate', this.beforeUpdate.bind(this));
        Matter.Events.on(this.engine, 'collisionStart', this.collisionStart.bind(this));
        var ids = egret.setInterval(function () {
            if (!_this.playAttack()) {
                egret.clearInterval(ids);
            }
        }, this, 500);
        this.scoreItem = new ScoreItem();
        this.scoreItem.setSTScore(0, this.dataVo.score);
        this.scoreItem.x = 50;
        this.addChild(this.scoreItem);
    };
    //创建items
    Scene_005.prototype.initAllItem = function () {
        this.recycleArr = [];
        this.fruitArr = [];
        var arr1 = this.dataVo.sData;
        var arr2 = this.dataVo.tData;
        var len1 = arr1.length;
        var len2 = arr2.length;
        var index = 0;
        var num = this.dataVo.time;
        var mids1 = Math.ceil(num / 4);
        var mids2 = Math.ceil(num / 2);
        var mids3 = Math.ceil(num * 3 / 4);
        for (var i = 0; i < num; i++) {
            var xx = 0;
            var yy = 0;
            if (i < mids1) {
                xx = -50;
                yy = (i % mids1) * (SpriteUtil.stageHeight / mids1);
            }
            else if (i < mids2) {
                xx = ((i - mids1) % mids2) * (SpriteUtil.stageWidth / mids2);
                yy = SpriteUtil.stageHeight + 50;
            }
            else if (i < mids3) {
                xx = SpriteUtil.stageWidth + 50;
                yy = ((i - mids2) % mids3) * (SpriteUtil.stageHeight / mids3);
            }
            else {
                xx = ((i - mids3) % mids3) * (SpriteUtil.stageWidth / mids3);
                yy = -50;
            }
            var fruit = void 0;
            if (Math.random() > 0.5) {
                index = Math.floor(len1 * Math.random());
                fruit = this.createItem(arr1[index], 'fruit', xx, yy);
            }
            else {
                index = Math.floor(len2 * Math.random());
                fruit = this.createItem(arr2[index], 'enemy', xx, yy);
            }
            this.fruitArr.push(fruit);
        }
        Matter.World.add(this.engine.world, this.fruitArr);
    };
    Scene_005.prototype.beforeUpdate = function () {
        if (!this.recycleArr || this.recycleArr.length == 0)
            return;
        this.removeBody();
    };
    Scene_005.prototype.collisionStart = function (evt) {
        var pairs = evt.pairs;
        for (var _i = 0, pairs_2 = pairs; _i < pairs_2.length; _i++) {
            var pair = pairs_2[_i];
            if (pair.bodyA == this.player) {
                if (pair.bodyB.name == 'fruit') {
                    this.removeBody(pair.bodyB);
                    this.score++;
                    this.scoreItem.setSTScore(this.score);
                    if (this.scoreItem.isCanPass()) {
                        this.destroy();
                        EffectUtil.showResultEffect(EffectUtil.PERFECT);
                    }
                }
                else if (pair.bodyB.name == 'enemy') {
                    this.destroy();
                    EffectUtil.showResultEffect();
                }
            }
            else if (pair.bodyB == this.player) {
                if (pair.bodyA.name == 'fruit') {
                    this.removeBody(pair.bodyA);
                    this.score++;
                    this.scoreItem.setSTScore(this.score);
                    if (this.scoreItem.isCanPass()) {
                        this.destroy();
                        EffectUtil.showResultEffect(EffectUtil.PERFECT);
                    }
                }
                else if (pair.bodyA.name == 'enemy') {
                    this.destroy();
                    EffectUtil.showResultEffect();
                }
            }
        }
    };
    //回收
    Scene_005.prototype.removeBody = function (tbody) {
        if (tbody === void 0) { tbody = null; }
        if (tbody) {
            var index = this.recycleArr.indexOf(tbody);
            if (index >= 0) {
                this.recycleArr.splice(index, 1);
                Matter.World.remove(this.engine.world, tbody, 0);
                this.removeChild(tbody.render.sprite);
            }
        }
        else {
            var len = this.recycleArr.length;
            for (var i = len - 1; i >= 0; i--) {
                var body = this.recycleArr[i];
                if (body.position.x < -100
                    || body.position.x > SpriteUtil.stageWidth + 100
                    || body.position.y < -100
                    || body.position.y > SpriteUtil.stageHeight + 100) {
                    Matter.World.remove(this.engine.world, body, 0);
                    this.recycleArr.splice(i, 1);
                    this.removeChild(body.render.sprite);
                }
            }
        }
    };
    //item开始下落
    Scene_005.prototype.playAttack = function () {
        var len = this.fruitArr.length;
        if (len <= 0) {
            if (this.recycleArr.length == 0) {
                this.destroy();
                if (this.scoreItem.isCanPass()) {
                    this.destroy();
                    EffectUtil.showResultEffect(EffectUtil.PERFECT);
                }
                else {
                    EffectUtil.showResultEffect();
                }
                return false;
            }
            return true;
        }
        var num1 = Math.floor(len * Math.random());
        var body = this.fruitArr.splice(num1, 1)[0];
        this.recycleArr.push(body);
        var dx = this.player.position.x - body.position.x;
        var dy = this.player.position.y - body.position.y;
        var rate = dy / dx;
        if (rate > 10) {
            rate = 10;
        }
        if (rate < -10) {
            rate = -10;
        }
        var fx = 2.5 * dx / Math.abs(dx);
        var fy = 2.5 * fx * rate;
        fx = Math.abs(fx) > 4 ? 4 * fx / Math.abs(fx) : fx;
        fy = Math.abs(fy) > 5 ? 5 * fy / Math.abs(fy) : fy;
        Matter.Body.setVelocity(body, { x: fx, y: fy });
        Matter.Body.setAngularVelocity(body, 0.01 * fx);
        return true;
    };
    //create fruit
    Scene_005.prototype.createItem = function (srs, name, sx, sy) {
        if (sx === void 0) { sx = 0; }
        if (sy === void 0) { sy = 0; }
        var item = SpriteUtil.createImage(srs);
        var itemBody = Matter.Bodies.circle(sx, sy, (item.height - 20) / 2, {
            name: name,
            frictionAir: 0,
            collisionFilter: {
                category: this.itemCategory,
                mask: this.playerCategory | 0x0001
            },
            render: {
                sprite: item
            }
        }, 0);
        return itemBody;
    };
    //destroy
    Scene_005.prototype.destroy = function () {
        Matter.Runner.stop(this.runner);
        EgretRender.stop();
        Matter.Engine.clear(this.engine);
        Matter.Events.off(this.engine, 'beforeUpdate', this.beforeUpdate);
        Matter.Events.off(this.engine, 'collisionStart', this.collisionStart);
        Matter.World.remove(this.engine.world, this.engine.world.bodies, 0);
        Matter.World.remove(this.engine.world, this.engine.world.constraints, 0);
    };
    Scene_005.prototype.exit = function () {
        this.destroy();
        while (this.numChildren > 1) {
            var child = this.getChildAt(this.numChildren - 1);
            this.removeChild(child);
        }
        _super.prototype.exit.call(this);
    };
    return Scene_005;
}(BaseScene));
__reflect(Scene_005.prototype, "Scene_005");
//看图 然后从图中找到这几张图
var Scene_006 = (function (_super) {
    __extends(Scene_006, _super);
    function Scene_006() {
        var _this = _super.call(this) || this;
        _this.isOperating = false;
        _this.init();
        return _this;
    }
    Scene_006.prototype.init = function () {
        this.timeItem = new TimeItem(30);
        this.addChild(this.timeItem);
        //修身 齐家 治国 平天下
        var arr = this.dataVo.sData;
        this.tarSprite = this.createPic(arr);
        this.tarSprite.x = SpriteUtil.stageCenterX - this.tarSprite.width / 2;
        this.tarSprite.y = SpriteUtil.stageCenterY - this.tarSprite.height / 2 - 100;
        this.tarSprite.name = 'target_1';
        this.addChild(this.tarSprite);
        this.picSprs = [];
        //创建其他图形
        this.createRandomPic(arr, 2, 3);
        this.createRandomPic(arr, 3, 4);
        this.createRandomPic(arr, 2, 4);
        this.createRandomPic(arr, 3, 5);
        this.createRandomPic(arr, 5, 6);
        this.createRandomPic(arr, 4, 7);
        this.createRandomPic(arr, 5, 8);
        this.createRandomPic(arr, 6, 7);
        //这里的tdata代表展示图片的数量
        var num = this.dataVo.tData;
        if (num == 12) {
            this.createRandomPic(arr, 3, 8);
            this.createRandomPic(arr, 7, 9);
            this.createRandomPic(arr, 5, 11);
        }
    };
    Scene_006.prototype.startGame = function () {
        this.picSprs.push(this.tarSprite);
        this.tarSprite.touchEnabled = true;
        this.tarSprite.addEventListener(egret.TouchEvent.TOUCH_TAP, this.selectClk, this);
        this.picSprs.sort(function (a, b) { return Math.random() > 0.5 ? 1 : -1; });
        var num = this.dataVo.tData;
        var cols = 3;
        var scale = (SpriteUtil.stageWidth - 100) / (this.tarSprite.width * cols);
        var wid = scale * this.tarSprite.width;
        var hgt = scale * this.tarSprite.height;
        var sprite = new egret.Sprite();
        for (var i = 0; i < this.picSprs.length; i++) {
            var xx = (i % cols) * (wid + 10);
            var yy = (hgt + 5) * Math.floor(i / cols);
            this.picSprs[i].x = xx;
            this.picSprs[i].y = yy;
            sprite.addChild(this.picSprs[i]);
            this.picSprs[i].scaleX = scale;
            this.picSprs[i].scaleY = scale;
        }
        this.addChild(sprite);
        sprite.x = SpriteUtil.stageCenterX - sprite.width / 2;
        sprite.y = SpriteUtil.stageCenterY - sprite.height / 2;
    };
    Scene_006.prototype.createRandomPic = function (sarr, index1, index2) {
        if (sarr === void 0) { sarr = []; }
        if (index1 === void 0) { index1 = 0; }
        if (index2 === void 0) { index2 = 0; }
        var arr = sarr.concat();
        var temp = arr[index1];
        arr[index1] = arr[index2];
        arr[index2] = temp;
        var spr = this.createPic(arr);
        spr.addEventListener(egret.TouchEvent.TOUCH_TAP, this.selectClk, this);
        spr.name = 'mistake';
        spr.touchEnabled = true;
        this.picSprs.push(spr);
    };
    Scene_006.prototype.selectClk = function (evt) {
        if (this.isOperating)
            return;
        this.isOperating = true;
        GameSound.instance().playSound('click');
        var name = evt.target.name;
        if (name == 'mistake') {
            this.timeItem.stop();
            EffectUtil.showResultEffect();
            return;
        }
        if (!name || name.search('target_') < 0)
            return;
        var idx = parseInt(name.split('_')[1]);
        var spr = evt.target;
        spr.touchEnabled = false;
        spr.parent.setChildIndex(spr, spr.parent.numChildren - 1);
        var leftTime = this.timeItem.leftTime;
        this.timeItem.stop();
        egret.Tween.get(spr).to({ x: SpriteUtil.stageCenterX - spr.width * 0.5 / 2, y: 200, scaleX: 0.5, scaleY: 0.5 }, 800).call(function () {
            if (leftTime >= 30) {
                EffectUtil.showResultEffect(EffectUtil.PERFECT);
            }
            else if (leftTime >= 15) {
                EffectUtil.showResultEffect(EffectUtil.GREAT);
            }
            else {
                EffectUtil.showResultEffect(EffectUtil.GOOD);
            }
        });
    };
    //创建图片
    Scene_006.prototype.createPic = function (arr) {
        var len = arr.length;
        var cols = 3;
        var wid = (SpriteUtil.stageWidth - 120) / cols;
        var sprite = new egret.Sprite();
        for (var i = 0; i < len; i++) {
            var item = SpriteUtil.createImage(arr[i]);
            var scale = wid / item.width;
            item.scaleX = scale;
            item.scaleY = scale;
            item.x = 10 + wid / 2 + (i % cols) * (wid + 10);
            item.y = 10 + wid / 2 + (wid + 10) * Math.floor(i / cols);
            item.touchEnabled = false;
            sprite.addChild(item);
        }
        sprite.graphics.beginFill(0x707070);
        sprite.graphics.drawRect(0, 0, sprite.width + 20, sprite.height + 20);
        sprite.graphics.endFill();
        return sprite;
    };
    Scene_006.prototype.enter = function () {
        _super.prototype.enter.call(this);
        this.timeItem.start(this.loop, this);
    };
    Scene_006.prototype.exit = function () {
        _super.prototype.exit.call(this);
        this.timeItem.stop();
        for (var _i = 0, _a = this.picSprs; _i < _a.length; _i++) {
            var pic = _a[_i];
            pic.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.selectClk, this);
        }
    };
    Scene_006.prototype.loop = function (time) {
        if (time <= 0) {
            this.startGame();
            this.timeItem.stop();
            this.timeItem.restart(this.dataVo.time);
        }
    };
    return Scene_006;
}(BaseScene));
__reflect(Scene_006.prototype, "Scene_006");
//打小白鼠
var Scene_007 = (function (_super) {
    __extends(Scene_007, _super);
    function Scene_007() {
        var _this = _super.call(this) || this;
        _this.needNums = 0;
        _this.score = 0;
        _this.isOperating = false;
        _this.init();
        return _this;
    }
    Scene_007.prototype.init = function () {
        //时间和分数
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
        this.scoreItem = new ScoreItem();
        this.scoreItem.x = 50;
        this.scoreItem.setSTScore(this.score, this.dataVo.score);
        this.addChild(this.scoreItem);
        this.timeItem.x = SpriteUtil.stageWidth - 300;
        this.needNums = 1;
        this.pointsArr = [];
        for (var i = 0; i < 40; i++) {
            var point = new egret.Point();
            point.x = 90 + 140 * (i % 5);
            point.y = 120 + 100 * Math.floor(i / 5);
            this.pointsArr.push(point);
        }
    };
    Scene_007.prototype.loop = function (time) {
        if (time <= 0) {
            this.isOperating = true;
            this.timeItem.stop();
            if (this.scoreItem.isCanPass()) {
                var score = this.score - this.dataVo.score;
                if (score >= 10) {
                    EffectUtil.showResultEffect(EffectUtil.PERFECT);
                }
                else if (score >= 5) {
                    EffectUtil.showResultEffect(EffectUtil.GREAT);
                }
                else {
                    EffectUtil.showResultEffect(EffectUtil.GOOD);
                }
            }
            else {
                EffectUtil.showResultEffect();
            }
            return;
        }
        if (time <= 8) {
            this.needNums = 30;
        }
        else if (time <= 10) {
            this.needNums = 20;
        }
        else if (time <= 20) {
            this.needNums = 15;
        }
        else if (time <= 25) {
            this.needNums = 10;
        }
        else {
            this.needNums = 5;
        }
    };
    Scene_007.prototype.showSprites = function (nums) {
        var _this = this;
        var num = 0;
        var randnum = Math.floor(nums * Math.random());
        var arr = this.getRandomPoints(nums);
        var idx = egret.setInterval(function () {
            if (_this.isOperating) {
                egret.clearInterval(idx);
                return;
            }
            var index = Math.floor(_this.dataVo.sData.length * Math.random());
            if (num == randnum) {
                index = 0;
            }
            var spr = _this.getPools(index);
            spr.x = _this.pointsArr[arr[num]].x;
            spr.y = _this.pointsArr[arr[num]].y;
            num++;
            if (num >= nums) {
                egret.clearInterval(idx);
                var xid_1 = egret.setTimeout(function () {
                    egret.clearTimeout(xid_1);
                    if (_this.isOperating)
                        return;
                    for (var _i = 0, _a = _this.pools; _i < _a.length; _i++) {
                        var spr_1 = _a[_i];
                        spr_1.visible = false;
                    }
                    _this.showSprites(_this.needNums);
                }, _this, 1000);
            }
        }, this, 100);
    };
    //这个随机不同的逻辑写的不太好
    Scene_007.prototype.getRandomPoints = function (nums) {
        var arr = [];
        while (arr.length < nums) {
            var index = Math.floor(40 * Math.random());
            if (arr.indexOf(index) < 0) {
                arr.push(index);
            }
        }
        return arr;
    };
    Scene_007.prototype.getPools = function (index) {
        var _this = this;
        if (index === void 0) { index = 0; }
        var char = this.dataVo.sData[index];
        var spr;
        if (!this.pools) {
            this.pools = [];
        }
        else {
            for (var _i = 0, _a = this.pools; _i < _a.length; _i++) {
                var item = _a[_i];
                if (!item.visible) {
                    spr = item;
                    break;
                }
            }
        }
        if (!spr) {
            spr = SpriteUtil.createImage(char);
            this.pools.push(spr);
            var scale = 100 / spr.width;
            spr.scaleX = scale;
            spr.scaleY = scale;
            spr.addEventListener(egret.TouchEvent.TOUCH_TAP, function (evt) {
                if (_this.isOperating)
                    return;
                GameSound.instance().playSound('click');
                var spr = evt.target;
                if (spr.name == _this.dataVo.tData) {
                    spr.visible = false;
                    _this.score++;
                    _this.scoreItem.setSTScore(_this.score);
                }
                else {
                    _this.timeItem.stop();
                    _this.isOperating = true;
                    EffectUtil.showResultEffect();
                }
            }, this);
        }
        else {
            spr.texture = RES.getRes(char + "_png");
            spr.visible = true;
        }
        spr.touchEnabled = true;
        spr.name = char;
        this.addChild(spr);
        return spr;
    };
    Scene_007.prototype.enter = function () {
        _super.prototype.enter.call(this);
        this.timeItem.start(this.loop, this);
        this.showSprites(this.needNums);
    };
    Scene_007.prototype.exit = function () {
        _super.prototype.exit.call(this);
        this.timeItem.stop();
    };
    return Scene_007;
}(BaseScene));
__reflect(Scene_007.prototype, "Scene_007");
//摸瞎 指星星的 
var Scene_008 = (function (_super) {
    __extends(Scene_008, _super);
    function Scene_008() {
        var _this = _super.call(this) || this;
        _this.animalsArr = CommonUtil.allAnimals.concat();
        _this.needCount = 0;
        _this.isOperating = false;
        _this.init();
        return _this;
    }
    Scene_008.prototype.init = function () {
        this.listSpr = new egret.Sprite();
        this.listSpr.x = 100;
        this.listSpr.y = 250;
        this.listSpr.visible = false;
        this.addChild(this.listSpr);
        for (var i = 0; i < this.animalsArr.length; i++) {
            var spr = SpriteUtil.createImage(this.animalsArr[i]);
            spr.x = (i % 5) * 125;
            spr.y = 125 * Math.floor(i / 5);
            spr.touchEnabled = true;
            spr.name = this.animalsArr[i];
            spr.addEventListener(egret.TouchEvent.TOUCH_TAP, this.selectClk, this);
            this.listSpr.addChild(spr);
        }
        this.animalsArr.sort(function (a, b) {
            if (Math.random() > 0.5)
                return 1;
            if (Math.random() < 0.5)
                return -1;
            return 0;
        });
        this.passArr = [];
        this.animalSpr = SpriteUtil.createImage(this.animalsArr[this.needCount]);
        this.animalSpr.y = SpriteUtil.stageCenterY - 100;
        this.animalSpr.scaleX = 3;
        this.animalSpr.scaleY = 3;
        this.addChild(this.animalSpr);
        this.emojiSpr = SpriteUtil.createImage('emoji01');
        this.emojiSpr.scaleX = 4;
        this.emojiSpr.scaleY = 4;
        this.emojiSpr.visible = false;
        this.addChild(this.emojiSpr);
        EffectUtil.breath(this.emojiSpr);
        this.playShow();
    };
    //播放前动画
    Scene_008.prototype.playShow = function () {
        var _this = this;
        var animal = this.animalsArr[this.needCount];
        var emoji = this.dataVo.sData[Math.floor(this.dataVo.sData.length * Math.random())];
        this.passArr.push({ animal: animal, emoji: emoji });
        this.animalSpr.texture = RES.getRes(animal + "_png");
        this.animalSpr.name = animal;
        var pos = this.getRandomPos();
        this.animalSpr.x = pos[0];
        this.animalSpr.y = pos[1];
        this.animalSpr.visible = true;
        egret.Tween.get(this.animalSpr).to({ x: SpriteUtil.stageCenterX, y: SpriteUtil.stageCenterY }, 500).call(function () {
            var idx = egret.setTimeout(function () {
                egret.clearTimeout(idx);
                egret.Tween.removeTweens(_this.animalSpr);
                _this.emojiSpr.x = _this.animalSpr.x;
                _this.emojiSpr.y = _this.animalSpr.y;
                _this.emojiSpr.texture = RES.getRes(emoji + "_png");
                _this.emojiSpr.visible = true;
                var xid = egret.setTimeout(function () {
                    egret.clearTimeout(xid);
                    _this.emojiSpr.visible = false;
                    _this.animalSpr.visible = false;
                    _this.needCount++;
                    if (_this.needCount >= _this.dataVo.tData) {
                        _this.startLook();
                        return;
                    }
                    _this.playShow();
                }, _this, 1500);
            }, _this, 1000);
        });
    };
    //random  position
    Scene_008.prototype.getRandomPos = function () {
        var arr = [
            [0, 0],
            [SpriteUtil.stageCenterX, 0],
            [SpriteUtil.stageWidth, 0],
            [0, SpriteUtil.stageCenterY],
            [SpriteUtil.stageWidth, SpriteUtil.stageCenterY],
            [0, SpriteUtil.stageHeight],
            [SpriteUtil.stageCenterX, SpriteUtil.stageHeight],
            [SpriteUtil.stageWidth, SpriteUtil.stageHeight]
        ];
        var index = Math.floor(arr.length * Math.random());
        return arr[index];
    };
    Scene_008.prototype.startLook = function () {
        egret.Tween.removeAllTweens();
        this.removeChild(this.animalSpr);
        this.removeChild(this.emojiSpr);
        this.dataVo.tData = this.passArr[Math.floor(this.passArr.length * Math.random())].emoji;
        var emoji = SpriteUtil.createImage(this.dataVo.tData);
        var askstr = "\u8C1C\u9898:\u627E\u51FA\u6240\u6709\u53D1\u51FA\u8868\u60C5       \u7684\u52A8\u7269";
        var text = SpriteUtil.createText(askstr, 36, 0x0000FF);
        text.x = SpriteUtil.stageCenterX;
        text.y = 150;
        emoji.x = text.x + text.measuredWidth - text.width / 2 - text.measuredWidth * 4 / 15;
        emoji.y = text.y;
        this.addChild(emoji);
        this.addChild(text);
        this.listSpr.visible = true;
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
        this.timeItem.start();
    };
    Scene_008.prototype.selectClk = function (evt) {
        if (this.isOperating)
            return;
        GameSound.instance().playSound('click');
        var sprite = evt.target;
        var isFind = false;
        var len = this.passArr.length;
        for (var i = len - 1; i >= 0; i--) {
            var obj = this.passArr[i];
            if (obj.emoji == this.dataVo.tData && obj.animal == sprite.name) {
                sprite.alpha = 0.5;
                sprite.touchEnabled = false;
                isFind = true;
                this.passArr.splice(i, 1);
            }
        }
        if (!isFind) {
            this.isOperating = true;
            EffectUtil.showResultEffect();
        }
        else {
            if (this.isCanPass()) {
                if (this.timeItem.leftTime >= 25) {
                    EffectUtil.showResultEffect(EffectUtil.PERFECT);
                }
                else if (this.timeItem.leftTime >= 15) {
                    EffectUtil.showResultEffect(EffectUtil.GREAT);
                }
                else {
                    EffectUtil.showResultEffect(EffectUtil.GOOD);
                }
                this.timeItem.stop();
            }
        }
    };
    //是否已经找完了
    Scene_008.prototype.isCanPass = function () {
        for (var _i = 0, _a = this.passArr; _i < _a.length; _i++) {
            var obj = _a[_i];
            if (obj.emoji == this.dataVo.tData) {
                return false;
            }
        }
        return true;
    };
    //exit
    Scene_008.prototype.exit = function () {
        _super.prototype.exit.call(this);
        this.timeItem.stop();
        egret.Tween.removeAllTweens();
    };
    return Scene_008;
}(BaseScene));
__reflect(Scene_008.prototype, "Scene_008");
//找出质量不一样的篮球
var Scene_009 = (function (_super) {
    __extends(Scene_009, _super);
    function Scene_009() {
        var _this = _super.call(this) || this;
        _this.isTouching = false;
        _this.init();
        return _this;
    }
    Scene_009.prototype.init = function () {
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
        this.engine = Matter.Engine.create({ enableSleeping: false }, null);
        this.runner = Matter.Runner.create(null);
        this.render = EgretRender.create({
            engine: this.engine,
            container: this,
            options: {
                width: SpriteUtil.stageWidth,
                height: SpriteUtil.stageHeight,
                wireframes: true,
            }
        });
        Matter.Runner.run(this.runner, this.engine);
        EgretRender.run(this.render);
        this.engine.world.gravity.y = 1;
        this.createWall();
        this.createBall();
        //平衡棒
        var aspr = SpriteUtil.createRect(200, 10, 0xff0000);
        var auncel = Matter.Bodies.rectangle(SpriteUtil.stageCenterX, 450, aspr.width, aspr.height, {
            frictionAir: 0.05,
            friction: 0,
            render: {
                sprite: aspr
            }
        });
        var constraint = Matter.Constraint.create({
            bodyA: auncel,
            pointB: { x: auncel.position.x, y: auncel.position.y },
            stiffness: 1
        });
        Matter.World.add(this.engine.world, [auncel, constraint]);
        aspr.touchEnabled = true;
        aspr.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            Matter.Body.setAngularVelocity(auncel, 0);
            var angle = auncel.angle == 0 ? Math.PI / 2 : 0;
            Matter.Body.setAngle(auncel, angle);
        }, this);
        this.createVc(60, 500, 0x000000);
        this.createVc(SpriteUtil.stageWidth - 100, 500, 0x000000);
        var lspr = SpriteUtil.createRect(200, 10, 0x0000ff);
        var leftBoard = Matter.Bodies.rectangle(80, SpriteUtil.stageCenterY, 200, 10, {
            isStatic: true,
            angle: Math.PI / 4,
            friction: 1,
            render: {
                sprite: lspr
            }
        });
        var rspr = SpriteUtil.createRect(200, 10, 0x0000ff);
        var rightBoard = Matter.Bodies.rectangle(SpriteUtil.stageWidth - 80, SpriteUtil.stageCenterY, 200, 10, {
            isStatic: true,
            angle: -Math.PI / 4,
            friction: 1,
            render: {
                sprite: rspr
            }
        });
        var lspr1 = SpriteUtil.createRect(200, 10, 0x0000ff);
        var leftBoard1 = Matter.Bodies.rectangle(80, 250, 200, 10, {
            isStatic: true,
            angle: Math.PI / 4,
            friction: 1,
            render: {
                sprite: lspr1
            }
        });
        var rspr1 = SpriteUtil.createRect(200, 10, 0x0000ff);
        var rightBoard1 = Matter.Bodies.rectangle(SpriteUtil.stageWidth - 80, 250, 200, 10, {
            isStatic: true,
            angle: -Math.PI / 4,
            friction: 1,
            render: {
                sprite: rspr1
            }
        });
        Matter.World.add(this.engine.world, [leftBoard, rightBoard, leftBoard1, rightBoard1]);
        Matter.Events.on(this.engine, 'collisionActive', this.collision.bind(this));
        this.createCatapult();
        this.createBoard();
    };
    //碰撞检测
    Scene_009.prototype.collision = function (evt) {
        var pairs = evt.pairs;
        var isHeavy = 0;
        var isLight = 0;
        var wrongNum = 0;
        var defmass = 50;
        for (var _i = 0, pairs_3 = pairs; _i < pairs_3.length; _i++) {
            var pair = pairs_3[_i];
            var body1 = pair.bodyA.label == 'basketBoard' ? pair.bodyA : null;
            var body2 = pair.bodyB;
            if (body1 == null) {
                body1 = pair.bodyB.label == 'basketBoard' ? pair.bodyB : null;
                body2 = pair.bodyA;
            }
            if (body1 == null)
                continue;
            if (body2.mass == defmass / 2) {
                isLight++;
            }
            else if (body2.mass == defmass * 2) {
                isHeavy++;
            }
            else if (body2.mass == defmass) {
                wrongNum++;
            }
        }
        if (isLight + isHeavy >= 2) {
            Matter.Events.off(this.engine, 'collisionActive', this.collision);
            Matter.Runner.stop(this.runner);
            EgretRender.stop();
            var time = this.timeItem.leftTime;
            this.timeItem.stop();
            if (time >= 30) {
                EffectUtil.showResultEffect(EffectUtil.PERFECT);
            }
            else if (time >= 15) {
                EffectUtil.showResultEffect(EffectUtil.GREAT);
            }
            else {
                EffectUtil.showResultEffect(EffectUtil.GOOD);
            }
        }
        else if ((isLight + isHeavy == 1) && wrongNum == 1) {
            Matter.Events.off(this.engine, 'collisionActive', this.collision);
            Matter.Runner.stop(this.runner);
            this.timeItem.stop();
            EgretRender.stop();
            EffectUtil.showResultEffect();
        }
        else if (wrongNum == 2) {
            Matter.Events.off(this.engine, 'collisionActive', this.collision);
            Matter.Runner.stop(this.runner);
            EgretRender.stop();
            this.timeItem.stop();
            EffectUtil.showResultEffect();
        }
    };
    Scene_009.prototype.touchBegin = function (evt) {
        var name = evt.target.name;
        if (!name || name.search('ball_') == -1)
            return;
        var index = name.split('_')[1];
        this.currDragBall = this.ballsArr[index];
        this.isTouching = true;
    };
    Scene_009.prototype.touchMove = function (evt) {
        if (this.isTouching && this.currDragBall) {
            //拖拽期间取消重力
            Matter.Body.setVelocity(this.currDragBall, { x: 0, y: -1 });
            Matter.Sleeping.set(this.currDragBall, false);
            Matter.Body.setPosition(this.currDragBall, { x: evt['stageX'], y: evt['stageY'] });
        }
    };
    Scene_009.prototype.touchEnd = function () {
        this.isTouching = false;
        Matter.Body.setVelocity(this.currDragBall, { x: 0, y: 0 });
        this.currDragBall = null;
    };
    //创建篮球
    Scene_009.prototype.createBall = function () {
        var _this = this;
        this.ballsArr = [];
        var nums = 0;
        var count = this.dataVo.sData;
        var rans = CommonUtil.getRandomNumFromARange(2, 0, count);
        rans.sort(function (a, b) {
            return a - b;
        });
        // console.log(rans);
        var xname = 'basketball';
        if (this.dataVo.level == 3) {
            xname = 'football';
        }
        var defmass = 50;
        var idx = egret.setInterval(function () {
            var spr = SpriteUtil.createImage(xname);
            var scale = 60 / spr.width;
            spr.scaleX = scale;
            spr.scaleY = scale;
            var xx = (SpriteUtil.stageWidth - 100) * Math.random();
            if (_this.dataVo.level != 1 && nums < _this.dataVo.sData - 2) {
                xx = nums % 2 == 0 ? 20 : SpriteUtil.stageWidth - 20;
            }
            var mass = defmass;
            if (_this.dataVo.level == 1) {
                mass = rans[0] == nums ? defmass * 2 : defmass;
                if (mass != defmass * 2) {
                    mass = rans[1] == nums ? defmass * 2 : defmass;
                }
            }
            else if (_this.dataVo.level == 2) {
                mass = rans[0] == nums ? defmass / 2 : defmass;
                if (mass != defmass / 2) {
                    mass = rans[1] == nums ? defmass / 2 : defmass;
                }
            }
            else if (_this.dataVo.level == 3) {
                mass = rans[0] == nums ? defmass * 2 : defmass;
                if (mass != defmass * 2) {
                    mass = rans[1] == nums ? defmass / 2 : defmass;
                }
            }
            spr.name = "ball_" + nums;
            var ball = Matter.Bodies.circle(xx, 0, scale * spr.height / 2, {
                restitution: 0.5,
                friction: 1,
                label: 'ball',
                render: {
                    sprite: spr
                }
            }, 0);
            Matter.World.add(_this.engine.world, ball);
            // Matter.Body.setInertia(ball,10000);
            Matter.Body.setMass(ball, mass);
            _this.ballsArr.push(ball);
            spr.touchEnabled = true;
            spr.addEventListener(egret.TouchEvent.TOUCH_BEGIN, _this.touchBegin, _this);
            spr.addEventListener(egret.TouchEvent.TOUCH_MOVE, _this.touchMove, _this);
            spr.addEventListener(egret.TouchEvent.TOUCH_END, _this.touchEnd, _this);
            spr.addEventListener(egret.TouchEvent.TOUCH_CANCEL, _this.touchEnd, _this);
            spr.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, _this.touchEnd, _this);
            nums++;
            if (nums >= count) {
                egret.clearInterval(idx);
            }
        }, this, 500);
        Matter.World.add(this.engine.world, this.ballsArr);
    };
    //创建装球的容器
    Scene_009.prototype.createVc = function (xx, yy, color) {
        if (color === void 0) { color = 0x00ff00; }
        var lspr = SpriteUtil.createRect(50, 10, color);
        var lbdy = Matter.Bodies.rectangle(xx, yy, 50, 10, {
            isStatic: true,
            angle: Math.PI / 3,
            render: {
                sprite: lspr
            }
        });
        var rspr = SpriteUtil.createRect(50, 10, color);
        var rbdy = Matter.Bodies.rectangle(xx + 40, yy, 50, 10, {
            isStatic: true,
            angle: -Math.PI / 3,
            render: {
                sprite: rspr
            }
        });
        //center  主要用来检测篮球是否放进篮子里了
        var cspr = SpriteUtil.createRect(30, 10, color);
        var cbdy = Matter.Bodies.rectangle(xx + 20, yy, 30, 10, {
            isStatic: true,
            label: 'basketBoard',
            render: {
                sprite: cspr
            }
        });
        var text = new egret.TextField();
        text.text = '实验结果';
        text.x = xx + 20;
        text.y = yy - 60;
        text.textAlign = 'center';
        text.textColor = 0x0000ff;
        text.size = 22;
        text.width = 100;
        text.anchorOffsetX = 50;
        this.addChild(text);
        Matter.World.add(this.engine.world, [lbdy, rbdy, cbdy]);
    };
    //创建墙壁
    Scene_009.prototype.createWall = function () {
        var left = Matter.Bodies.rectangle(-5, SpriteUtil.stageCenterY, 10, SpriteUtil.stageHeight, { isStatic: true });
        var right = Matter.Bodies.rectangle(SpriteUtil.stageWidth + 5, SpriteUtil.stageCenterY, 10, SpriteUtil.stageHeight, { isStatic: true });
        var top = Matter.Bodies.rectangle(SpriteUtil.stageCenterX, -5, SpriteUtil.stageWidth, 10, { isStatic: true });
        var bottom = Matter.Bodies.rectangle(SpriteUtil.stageCenterX, SpriteUtil.stageHeight - 100, SpriteUtil.stageWidth, 250, { isStatic: true });
        Matter.World.add(this.engine.world, [left, right, top, bottom]);
    };
    //创建竖直隔板
    Scene_009.prototype.createBoard = function () {
        var bodies = [];
        for (var i = 0; i < 6; i++) {
            var spr = SpriteUtil.createRect(10, 50, Math.ceil(0xffff00 * Math.random()) + 32);
            var board = Matter.Bodies.rectangle(10 + 100 * (i + 1), SpriteUtil.stageCenterY + 200, 10, 50, {
                isStatic: true,
                render: {
                    sprite: spr
                }
            });
            bodies.push(board);
        }
        Matter.World.add(this.engine.world, bodies);
    };
    //创建跷跷板
    Scene_009.prototype.createCatapult = function () {
        var rect = SpriteUtil.createRect(200, 16, 0xCD00CD);
        var catapult = Matter.Bodies.rectangle(SpriteUtil.stageWidth - 100, SpriteUtil.stageHeight - 290, rect.width, rect.height, {
            render: {
                sprite: rect
            }
        });
        var prect = SpriteUtil.createRect(20, 40, 0xff00ff);
        var pbody = Matter.Bodies.rectangle(SpriteUtil.stageWidth - 100, SpriteUtil.stageHeight - 270, prect.width, prect.height, {
            isStatic: true,
            render: {
                sprite: prect
            }
        });
        var srect = SpriteUtil.createRect(30, 30, 0x0f0f0f);
        var sbody = Matter.Bodies.rectangle(SpriteUtil.stageWidth - 15, SpriteUtil.stageHeight - 266, srect.width, srect.height, {
            isStatic: true,
            render: {
                sprite: srect
            }
        });
        var constraint = Matter.Constraint.create({
            bodyA: catapult,
            pointB: Matter.Vector.clone(catapult.position),
            stiffness: 1,
            length: 0
        });
        Matter.World.add(this.engine.world, [pbody, sbody, catapult, constraint]);
    };
    Scene_009.prototype.enter = function () {
        _super.prototype.enter.call(this);
        this.timeItem.start();
    };
    Scene_009.prototype.exit = function () {
        _super.prototype.exit.call(this);
        this.timeItem.stop();
        for (var _i = 0, _a = this.engine.world.bodies; _i < _a.length; _i++) {
            var body = _a[_i];
            if (body.label == 'ball') {
                body.render.sprite.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this);
                body.render.sprite.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMove, this);
                body.render.sprite.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEnd, this);
                body.render.sprite.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.touchEnd, this);
                body.render.sprite.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.touchEnd, this);
            }
        }
        Matter.World.remove(this.engine.world, this.engine.world.bodies, 0);
        Matter.World.remove(this.engine.world, this.engine.world.constraints, 0);
    };
    return Scene_009;
}(BaseScene));
__reflect(Scene_009.prototype, "Scene_009");
//色子游戏
var Scene_010 = (function (_super) {
    __extends(Scene_010, _super);
    function Scene_010() {
        var _this = _super.call(this) || this;
        //items 列条目
        _this.items = [];
        _this.curIndex = 0;
        _this.isCanOperate = true;
        _this.init();
        return _this;
    }
    Scene_010.prototype.init = function () {
        var config = GameData.getConfig("scene" + this.dataVo.levelType);
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
        this.questionTxt.anchorOffsetX = this.questionTxt.width / 2;
        this.questionTxt.anchorOffsetY = this.questionTxt.height / 2;
        this.questionTxt.x = SpriteUtil.stageCenterX;
        this.questionTxt.y = 120;
        this.questionTxt.text = "麻烦透露下您的性别";
        this.addChild(this.questionTxt);
        this.btnsArr = [];
        var sprite = new egret.Sprite();
        for (var i = 0; i < 10; i++) {
            var btn = this.createText('');
            btn.x = 280 * (i % 2);
            btn.y = Math.floor(i / 2) * 80;
            sprite.addChild(btn);
            this.btnsArr.push(btn);
            btn.name = "btn_" + i;
            btn.touchEnabled = true;
            btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clkSwitch, this);
        }
        sprite.x = SpriteUtil.stageCenterX - sprite.width / 2;
        sprite.y = 480;
        this.addChild(sprite);
        this.optionSpr = sprite;
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
    };
    Scene_010.prototype.clkSwitch = function (evt) {
        var _this = this;
        if (!this.isCanOperate)
            return;
        if (this.curIndex >= this.items.length - 1) {
            Game.instance().gameScene.enterMenu();
            return;
        }
        var target = evt.target;
        var name = target.name;
        if (!name || name.search('btn_') < 0)
            return;
        var idx = name.split('_')[1];
        var answer = this.items[this.curIndex].answer;
        this.isCanOperate = false;
        if (idx == answer) {
            EffectUtil.showTextAndBack('✓', function () {
                _this.curIndex++;
                _this.nextItem();
                _this.isCanOperate = true;
            });
        }
        else {
            this.timeItem.stop();
            EffectUtil.showResultEffect();
        }
    };
    Scene_010.prototype.nextItem = function () {
        var item = this.items[this.curIndex];
        var ops = item.options;
        this.questionTxt.text = "\u261B " + item.question;
        var len = this.btnsArr.length;
        for (var i = 0; i < len; i++) {
            if (ops[i]) {
                this.btnsArr[i].text = ops[i];
                this.btnsArr[i].visible = true;
            }
            else {
                this.btnsArr[i].visible = false;
            }
        }
        this.optionSpr.y = this.questionTxt.y + this.questionTxt.height + 40;
    };
    Scene_010.prototype.createText = function (str) {
        if (str === void 0) { str = ""; }
        var text = new egret.TextField();
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
    };
    Scene_010.prototype.enter = function () {
        _super.prototype.enter.call(this);
        this.nextItem();
        this.timeItem.start();
    };
    Scene_010.prototype.exit = function () {
        _super.prototype.exit.call(this);
        this.timeItem.stop();
    };
    return Scene_010;
}(BaseScene));
__reflect(Scene_010.prototype, "Scene_010");
//大海捞针 找文字
var Scene_011 = (function (_super) {
    __extends(Scene_011, _super);
    function Scene_011() {
        var _this = _super.call(this) || this;
        _this.isOperating = false;
        _this.init();
        return _this;
    }
    Scene_011.prototype.init = function () {
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
        var sprite = new egret.Sprite();
        var str = this.dataVo.sData[0];
        var num = this.dataVo.sData[1];
        var rand = Math.floor((num - 10) * Math.random() + 10);
        // console.log(rand);
        for (var i = 0; i < num; i++) {
            var text = void 0;
            if (i == rand) {
                text = this.createText(this.dataVo.tData);
                this.tarTxt = text;
            }
            else {
                text = this.createText(str);
            }
            text.x = (i % 10) * 66;
            text.y = 66 * Math.floor(i / 10);
            sprite.addChild(text);
        }
        sprite.anchorOffsetX = sprite.width / 2;
        sprite.x = SpriteUtil.stageCenterX;
        sprite.y = 100;
        this.addChild(sprite);
    };
    Scene_011.prototype.textClk = function (evt) {
        if (this.isOperating)
            return;
        GameSound.instance().playSound('click');
        this.isOperating = true;
        var name = evt.target.text;
        if (name == this.dataVo.tData) {
            var time = this.timeItem.leftTime;
            this.timeItem.stop();
            if (time >= 25) {
                EffectUtil.showResultEffect(EffectUtil.PERFECT);
            }
            else if (time >= 15) {
                EffectUtil.showResultEffect(EffectUtil.GREAT);
            }
            else {
                EffectUtil.showResultEffect(EffectUtil.GOOD);
            }
        }
        else {
            this.timeItem.stop();
            this.tarTxt.textColor = 0xff0000;
            EffectUtil.showResultEffect();
        }
    };
    Scene_011.prototype.createText = function (name) {
        var text = new egret.TextField();
        text.size = 54;
        text.text = name;
        text.textColor = 0x0000ff; //0xffffff*(8*Math.random() + 2)/10;
        text.stroke = 0.5;
        text.strokeColor = 0xffff00;
        text.bold = true;
        this.addChild(text);
        text.touchEnabled = true;
        text.addEventListener(egret.TouchEvent.TOUCH_TAP, this.textClk, this);
        return text;
    };
    Scene_011.prototype.enter = function () {
        _super.prototype.enter.call(this);
        this.timeItem.start();
    };
    return Scene_011;
}(BaseScene));
__reflect(Scene_011.prototype, "Scene_011");
/**
 * 框架分三层 bottom,middle,top
 * 可直接通过gamestage添加新层
 * bottom游戏舞台层
 * middle中间处理层
 * top 视图层
 */
var Game = (function () {
    function Game() {
    }
    Game.instance = function () {
        if (this._instance == null) {
            this._instance = new Game();
        }
        return this._instance;
    };
    Game.prototype.setStage = function (stage) {
        this._gameStage = stage;
        SpriteUtil.stageWidth = stage.stageWidth;
        SpriteUtil.stageHeight = stage.stageHeight;
        SpriteUtil.stageCenterX = stage.stageWidth / 2;
        SpriteUtil.stageCenterY = stage.stageHeight / 2;
        this._bottom = new egret.DisplayObjectContainer();
        this._middle = new egret.DisplayObjectContainer();
        this._top = new egret.DisplayObjectContainer();
        this._gameStage.addChild(this._bottom);
        this._gameStage.addChild(this._middle);
        this._gameStage.addChild(this._top);
        this._gameScene = new GameScene();
        this._gameView = new GameView();
        //进入菜单
        if (!GameData.isWxGame) {
            this._gameScene.enterMenu();
        }
        else {
            Game.instance().gameScene.enterMenu();
        }
    };
    Game.prototype.addBottom = function (display) {
        this._bottom.addChild(display);
    };
    Game.prototype.addMiddle = function (display) {
        this._middle.addChild(display);
    };
    Game.prototype.addTop = function (display) {
        this._top.addChild(display);
    };
    Object.defineProperty(Game.prototype, "gameStage", {
        get: function () {
            return this._gameStage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "gameScene", {
        get: function () {
            return this._gameScene;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "gameView", {
        get: function () {
            return this._gameView;
        },
        enumerable: true,
        configurable: true
    });
    Game._instance = null;
    return Game;
}());
__reflect(Game.prototype, "Game");
//石头剪刀布
var Scene_013 = (function (_super) {
    __extends(Scene_013, _super);
    function Scene_013() {
        var _this = _super.call(this) || this;
        _this.leftIndex = 0;
        _this.rightIndex = 0;
        _this.xScale = 3.2;
        _this.isOperating = false;
        _this.score = 0;
        _this.init();
        return _this;
    }
    Scene_013.prototype.init = function () {
        //sdata 规则物品  tdata 相应规则
        var arr = ["赢", "和", "赢"];
        var len = arr.length;
        var wid = (SpriteUtil.stageWidth - 100) / len;
        var sprite = new egret.Sprite;
        for (var i = 0; i < len; i++) {
            var btn = SpriteUtil.createText(arr[i], 100, 0xff0000, true);
            var scale = wid / btn.width;
            btn.x = i * (wid + 10) + scale * btn.width / 2;
            btn.scaleX = scale;
            btn.scaleY = scale;
            this.addChild(btn);
            btn.name = 'index_' + i;
            btn.touchEnabled = true;
            btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.playDoing, this);
            sprite.addChild(btn);
        }
        this.addChild(sprite);
        sprite.anchorOffsetX = sprite.width / 2;
        sprite.anchorOffsetY = sprite.height / 2;
        sprite.x = SpriteUtil.stageCenterX;
        sprite.y = SpriteUtil.stageCenterY + 280;
        this.leftSpr = SpriteUtil.createImage(this.dataVo.sData[0]);
        this.leftSpr.scaleY = this.xScale;
        this.leftSpr.x = SpriteUtil.stageCenterX - 160;
        this.leftSpr.y = SpriteUtil.stageCenterY - 160;
        this.addChild(this.leftSpr);
        this.rightSpr = SpriteUtil.createImage(this.dataVo.sData[0]);
        this.rightSpr.scaleY = this.xScale;
        this.rightSpr.x = SpriteUtil.stageCenterX + 160;
        this.rightSpr.y = SpriteUtil.stageCenterY - 160;
        this.addChild(this.rightSpr);
        //
        this.enemyDoing();
        if (this.dataVo.time > 0) {
            this.timeItem = new TimeItem(this.dataVo.time);
            this.addChild(this.timeItem);
        }
        if (this.dataVo.score > 0) {
            this.scoreItem = new ScoreItem();
            this.scoreItem.setSTScore(0, this.dataVo.score);
            this.scoreItem.x = 50;
            this.addChild(this.scoreItem);
            this.timeItem.x = SpriteUtil.stageWidth - 300;
        }
    };
    Scene_013.prototype.enemyDoing = function () {
        var len = this.dataVo.sData.length;
        this.leftIndex = Math.floor(len * Math.random());
        this.leftSpr.texture = RES.getRes(this.dataVo.sData[this.leftIndex] + "_png");
        this.rightIndex = Math.floor(len * Math.random());
        this.rightSpr.texture = RES.getRes(this.dataVo.sData[this.rightIndex] + "_png");
        if (this.dataVo.level <= 2) {
            if (this.leftIndex == 2) {
                this.leftSpr.scaleX = this.xScale;
            }
            else {
                this.leftSpr.scaleX = -this.xScale;
            }
            if (this.rightIndex == 2) {
                this.rightSpr.scaleX = -this.xScale;
            }
            else {
                this.rightSpr.scaleX = this.xScale;
            }
        }
        else if (this.dataVo.level <= 4) {
            if (this.leftIndex == 2) {
                this.leftSpr.scaleX = -this.xScale;
            }
            else {
                this.leftSpr.scaleX = this.xScale;
            }
            if (this.rightIndex == 1 || this.rightIndex == 3) {
                this.rightSpr.scaleX = -this.xScale;
            }
            else {
                this.rightSpr.scaleX = this.xScale;
            }
        }
        else {
            this.leftSpr.scaleX = this.xScale;
            this.rightSpr.scaleX = this.xScale;
        }
    };
    Scene_013.prototype.playDoing = function (evt) {
        if (this.isOperating)
            return;
        GameSound.instance().playSound('click');
        var name = evt.target.name;
        var index = name.split('_')[1];
        if (index == this.getResult()) {
            this.enemyDoing();
            this.score++;
            this.scoreItem.setSTScore(this.score);
        }
        else {
            this.timeItem.stop();
            this.isOperating = true;
            EffectUtil.showResultEffect();
        }
    };
    Scene_013.prototype.getResult = function () {
        var len = this.dataVo.sData.length;
        var index = 0;
        if (this.dataVo.level == 5) {
            var temp = this.leftIndex - this.rightIndex;
            if (temp == 2 || temp == -3) {
                index = 2;
            }
            else if (temp == -1 || temp == 3) {
                index == 0;
            }
            else {
                index = 1;
            }
            return index;
        }
        if (this.leftIndex == len - 1) {
            if (this.rightIndex == this.leftIndex - 1) {
                index = 2;
            }
            else if (this.rightIndex == 0) {
                index = 0;
            }
            else {
                index = 1;
            }
        }
        else if (this.rightIndex == len - 1) {
            if (this.leftIndex == this.rightIndex - 1) {
                index = 0;
            }
            else if (this.leftIndex == 0) {
                index = 2;
            }
            else {
                index = 1;
            }
        }
        else if (this.leftIndex - this.rightIndex == 1) {
            index = 2;
        }
        else if (this.leftIndex - this.rightIndex == -1) {
            index = 0;
        }
        else {
            index = 1;
        }
        return index;
    };
    Scene_013.prototype.enter = function () {
        _super.prototype.enter.call(this);
        this.timeItem.start(this.resultBack, this);
    };
    Scene_013.prototype.resultBack = function (time) {
        if (time <= 0) {
            this.isOperating = true;
            this.timeItem.stop();
            if (this.score >= this.dataVo.score + 10) {
                EffectUtil.showResultEffect(EffectUtil.PERFECT);
            }
            else if (this.score >= this.dataVo.score + 5) {
                EffectUtil.showResultEffect(EffectUtil.GREAT);
            }
            else if (this.score >= this.dataVo.score) {
                EffectUtil.showResultEffect(EffectUtil.GOOD);
            }
            else {
                EffectUtil.showResultEffect();
            }
        }
    };
    return Scene_013;
}(BaseScene));
__reflect(Scene_013.prototype, "Scene_013");
//拼图游戏 先选图片再拼图
var Scene_014 = (function (_super) {
    __extends(Scene_014, _super);
    function Scene_014() {
        var _this = _super.call(this) || this;
        _this.currTarget = null;
        _this.isOperating = false;
        _this.init();
        return _this;
    }
    Scene_014.prototype.init = function () {
        this.cropPoints = [];
        this.cropPics = [];
        this.createFruit();
    };
    //选择水果  sData 各种图像  tdata 标题
    Scene_014.prototype.createFruit = function () {
        var arr = this.dataVo.sData;
        var len = arr.length;
        this.beforeContainer = new egret.Sprite();
        this.addChild(this.beforeContainer);
        for (var i = 0; i < len; i++) {
            var xx = 25 + 225 * (i % 3);
            var yy = 150 + 225 * Math.floor(i / 3);
            var bit = SpriteUtil.createImage(arr[i]);
            bit.anchorOffsetX = 0;
            bit.anchorOffsetY = 0;
            bit.width = 200;
            bit.height = 200;
            bit.x = xx;
            bit.y = yy;
            bit.name = arr[i];
            bit.touchEnabled = true;
            bit.addEventListener(egret.TouchEvent.TOUCH_TAP, this.selectPic, this);
            this.beforeContainer.addChild(bit);
        }
        this.titleTxt = SpriteUtil.createText(this.dataVo.tData, 32, 0x0000ff);
        this.titleTxt.x = SpriteUtil.stageCenterX;
        this.titleTxt.y = 100;
        this.addChild(this.titleTxt);
    };
    Scene_014.prototype.selectPic = function (evt) {
        GameSound.instance().playSound('click');
        var name = evt.target.name;
        this.createSeparate(name + "_png");
        this.beforeContainer.visible = false;
        this.removeChild(this.beforeContainer);
        this.titleTxt.text = '来吧！还原这个图像！';
        this.titleTxt.anchorOffsetX = this.titleTxt.width / 2;
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
        this.timeItem.start();
    };
    //裁剪纹理
    Scene_014.prototype.createSeparate = function (res) {
        this.picContainer = new egret.Sprite();
        var rect = new egret.Shape();
        rect.graphics.beginFill(0x00000f);
        rect.graphics.drawRect(0, 0, 660, 660);
        rect.graphics.endFill();
        this.picContainer.addChild(rect);
        this.picContainer.x = 30;
        this.picContainer.y = 200;
        this.addChild(this.picContainer);
        var bitmap = new egret.Bitmap(RES.getRes(res));
        bitmap.width = 640;
        bitmap.height = 640;
        var arr = [];
        for (var i = 0; i < 16; i++) {
            arr.push(i);
            var xx = 2 + 165 * (i % 4);
            var yy = 2 + 165 * Math.floor(i / 4);
            this.cropPoints.push({ x: xx, y: yy });
            //裁剪纹理
            var renderTexture = new egret.RenderTexture();
            renderTexture.drawToTexture(bitmap, new egret.Rectangle(160 * (i % 4), 160 * Math.floor(i / 4), 160, 160));
            var bit = new egret.Bitmap();
            bit.texture = renderTexture;
            bit.x = xx;
            bit.y = yy;
            bit['sIndex'] = i;
            bit['tIndex'] = i;
            bit.touchEnabled = true;
            bit.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clkCrop, this);
            this.picContainer.addChild(bit);
            this.cropPics.push(bit);
        }
        arr.sort(function (a, b) {
            return Math.random() > 0.5 ? 1 : -1;
        });
        for (var i = 0; i < arr.length; i++) {
            var index = arr[i];
            this.cropPics[i]['tIndex'] = index;
            this.cropPics[i].x = this.cropPoints[index].x;
            this.cropPics[i].y = this.cropPoints[index].y;
        }
    };
    //事件处理
    Scene_014.prototype.clkCrop = function (evt) {
        var _this = this;
        if (this.isOperating || this.timeItem.leftTime <= 0)
            return;
        GameSound.instance().playSound('click');
        var pic = evt.target;
        if (this.currTarget == null) {
            this.currTarget = pic;
            pic.alpha = 0.5;
        }
        else if (this.currTarget == pic) {
            this.currTarget = null;
            pic.alpha = 1;
        }
        else {
            var index1 = pic['tIndex'];
            var index2 = this.currTarget['tIndex'];
            //交换tindex
            pic['tIndex'] = index2;
            this.currTarget['tIndex'] = index1;
            //互换位置
            pic.alpha = 1;
            this.currTarget.alpha = 1;
            egret.Tween.get(this.currTarget).to({ x: this.cropPoints[index1].x, y: this.cropPoints[index1].y }, 200).call(function () {
                egret.Tween.removeTweens(_this.currTarget);
                _this.currTarget = null;
            });
            egret.Tween.get(pic).to({ x: this.cropPoints[index2].x, y: this.cropPoints[index2].y }, 200).call(function () {
                egret.Tween.removeTweens(pic);
                _this.checkOver();
            });
        }
    };
    Scene_014.prototype.checkOver = function () {
        if (this.isCanPass()) {
            var leftTime = this.timeItem.leftTime;
            this.timeItem.stop();
            if (leftTime >= 90) {
                EffectUtil.showResultEffect(EffectUtil.PERFECT);
            }
            else if (leftTime >= 60) {
                EffectUtil.showResultEffect(EffectUtil.GREAT);
            }
            else {
                EffectUtil.showResultEffect(EffectUtil.GOOD);
            }
        }
    };
    Scene_014.prototype.isCanPass = function () {
        for (var _i = 0, _a = this.cropPics; _i < _a.length; _i++) {
            var pic = _a[_i];
            if (pic['sIndex'] != pic['tIndex'])
                return false;
        }
        return true;
    };
    return Scene_014;
}(BaseScene));
__reflect(Scene_014.prototype, "Scene_014");
//找出不一样的颜色块
var Scene_015 = (function (_super) {
    __extends(Scene_015, _super);
    function Scene_015() {
        var _this = _super.call(this) || this;
        _this.init();
        return _this;
    }
    Scene_015.prototype.init = function () {
        var color = this.dataVo.sData[0];
        var num = this.dataVo.sData[1];
        //多少列
        var columns = Math.round(Math.sqrt(num));
        //每个格子宽度
        var wid = Math.round(SpriteUtil.stageWidth - 120) / columns;
        var sprite = new egret.Sprite();
        var tindex = Math.floor(parseInt(num) * Math.random());
        for (var i = 0; i < num; i++) {
            var shape = void 0;
            if (i == tindex) {
                shape = this.createShape(this.dataVo.tData, wid);
                shape.name = this.dataVo.tData;
            }
            else {
                shape = this.createShape(color, wid);
                shape.name = color;
            }
            shape.x = (i % columns) * (wid + 5);
            shape.y = Math.floor(i / columns) * (wid + 5);
            sprite.addChild(shape);
            shape.touchEnabled = true;
            shape.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clkShape, this);
        }
        sprite.x = SpriteUtil.stageCenterX - sprite.width / 2;
        sprite.y = 120;
        this.addChild(sprite);
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
    };
    Scene_015.prototype.clkShape = function (evt) {
        if (this.timeItem.leftTime <= 0)
            return;
        GameSound.instance().playSound('click');
        var name = evt.target.name;
        if (name == this.dataVo.tData) {
            var leftTime = this.timeItem.leftTime;
            this.timeItem.stop();
            if (leftTime >= 2 * this.dataVo.time / 3) {
                EffectUtil.showResultEffect(EffectUtil.PERFECT);
            }
            else if (leftTime >= this.dataVo.time / 2) {
                EffectUtil.showResultEffect(EffectUtil.GREAT);
            }
            else {
                EffectUtil.showResultEffect(EffectUtil.GOOD);
            }
        }
        else {
            this.timeItem.stop();
            EffectUtil.showResultEffect();
        }
    };
    Scene_015.prototype.createShape = function (color, wid, type) {
        if (type === void 0) { type = 0; }
        var shape = new egret.Shape();
        shape.graphics.beginFill(color);
        shape.graphics.drawRect(0, 0, wid, wid);
        shape.graphics.endFill();
        return shape;
    };
    Scene_015.prototype.enter = function () {
        _super.prototype.enter.call(this);
        this.timeItem.start();
    };
    return Scene_015;
}(BaseScene));
__reflect(Scene_015.prototype, "Scene_015");
//flappy bird
var Scene_016 = (function (_super) {
    __extends(Scene_016, _super);
    function Scene_016() {
        var _this = _super.call(this) || this;
        _this.isCanOperate = true;
        _this.score = 0;
        _this.intervalId = 0;
        _this.init();
        return _this;
    }
    Scene_016.prototype.init = function () {
        var _this = this;
        //datavo time代表出现墙的频率 单位毫秒   sdata表示player皮肤  tdata 速度
        var shape = new egret.Shape();
        shape.graphics.beginFill(0x00ff00, 0.01);
        shape.graphics.drawRect(0, 0, SpriteUtil.stageWidth, SpriteUtil.stageHeight);
        shape.graphics.endFill();
        this.addChild(shape);
        //初始画引擎部分
        this.engine = Matter.Engine.create({ enableSleeping: false }, null);
        this.runner = Matter.Runner.create(null);
        this.runner.isFixed = true;
        var render = EgretRender.create({
            engine: this.engine,
            container: this,
            options: {
                width: SpriteUtil.stageWidth,
                height: SpriteUtil.stageHeight,
                wireframes: true
            }
        });
        Matter.Runner.run(this.runner, this.engine);
        EgretRender.run(render);
        this.engine.world.gravity.y = 1;
        var bspr = SpriteUtil.createImage(this.dataVo.sData);
        var body = Matter.Bodies.rectangle(SpriteUtil.stageCenterX, 500, bspr.width - 20, bspr.height - 20, {
            label: 'bird',
            render: {
                sprite: bspr
            }
        });
        this.birdBody = body;
        Matter.World.add(this.engine.world, body);
        Matter.Events.on(this.engine, "collisionStart", this.collisionStart.bind(this));
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.tapMakeBirdFly, this);
        this.intervalId = egret.setInterval(function () {
            _this.createAWall();
        }, this, this.dataVo.time);
        this.beforeUpdateFun = function () {
            if (_this.birdBody.position.y >= SpriteUtil.stageHeight) {
                _this.birdBody.isStatic = true;
                _this.destroy();
                _this.checkResult();
                return;
            }
            if (!_this.isCanOperate)
                return;
            if (!_this.wallArr || _this.wallArr.length == 0)
                return;
            for (var _i = 0, _a = _this.wallArr; _i < _a.length; _i++) {
                var body_1 = _a[_i];
                var body1 = body_1.body1;
                var body2 = body_1.body2;
                var xx = body1.position.x;
                xx -= _this.dataVo.tData;
                Matter.Body.setPosition(body1, { x: xx, y: body1.position.y });
                Matter.Body.setPosition(body2, { x: xx, y: body2.position.y });
            }
        };
        Matter.Events.on(this.engine, 'beforeUpdate', this.beforeUpdateFun);
        this.scoreItem = new ScoreItem();
        this.addChild(this.scoreItem);
        this.scoreItem.setSTScore(this.score, this.dataVo.score);
        this.createAWall();
    };
    Scene_016.prototype.collisionStart = function (evt) {
        var pairs = evt.pairs;
        for (var _i = 0, pairs_4 = pairs; _i < pairs_4.length; _i++) {
            var pair = pairs_4[_i];
            if (pair.bodyA.label == "bird" || pair.bodyB.label == "bird") {
                this.isCanOperate = false;
                this.checkResult();
            }
        }
    };
    Scene_016.prototype.tapMakeBirdFly = function (evt) {
        if (!this.isCanOperate)
            return;
        GameSound.instance().playSound('click');
        Matter.Body.setVelocity(this.birdBody, { x: 0, y: -8 });
    };
    //创建墙壁
    Scene_016.prototype.createAWall = function () {
        if (!this.wallArr) {
            this.wallArr = [];
        }
        var rand = this.score % 2 == 0 ? true : false;
        var xx = SpriteUtil.stageWidth + 200;
        var len = this.wallArr.length;
        for (var i = len - 1; i >= 0; i--) {
            var body1_1 = this.wallArr[i].body1;
            var body2_1 = this.wallArr[i].body2;
            if (body1_1.position.x <= -body1_1.render.sprite.width) {
                Matter.World.remove(this.engine.world, [body1_1, body2_1], 0);
                this.removeChild(body1_1.render.sprite);
                this.removeChild(body2_1.render.sprite);
                this.wallArr.splice(i, 1);
                this.score++;
                this.scoreItem.setSTScore(this.score);
            }
        }
        var swid = 80 + 120 * Math.random();
        var kspr1 = SpriteUtil.createRect(swid, 550, 0xffffff * Math.random());
        var body1 = Matter.Bodies.rectangle(xx, 75 + 200 * Math.random(), kspr1.width, kspr1.height, {
            label: 'wall',
            isStatic: true,
            render: {
                sprite: kspr1
            }
        });
        var kspr2 = SpriteUtil.createRect(swid, 550, 0xffffff * Math.random());
        var body2 = Matter.Bodies.rectangle(xx, SpriteUtil.stageHeight - 75 - 200 * Math.random(), kspr2.width, kspr2.height, {
            label: 'wall',
            isStatic: true,
            render: {
                sprite: kspr2
            }
        });
        this.wallArr.push({ body1: body1, body2: body2 });
        Matter.World.add(this.engine.world, [body1, body2]);
    };
    Scene_016.prototype.checkResult = function () {
        this.birdBody.isStatic = true;
        this.destroy();
        if (this.scoreItem.isCanPass()) {
            var mid = this.score - this.dataVo.score;
            if (mid >= 15) {
                EffectUtil.showResultEffect(EffectUtil.PERFECT);
            }
            else if (mid >= 10) {
                EffectUtil.showResultEffect(EffectUtil.GREAT);
            }
            else {
                EffectUtil.showResultEffect(EffectUtil.GOOD);
            }
        }
        else {
            EffectUtil.showResultEffect();
        }
    };
    Scene_016.prototype.destroy = function () {
        this.isCanOperate = false;
        egret.clearInterval(this.intervalId);
        Matter.Runner.stop(this.runner);
        EgretRender.stop();
        Matter.Engine.clear(this.engine);
        Matter.Events.off(this.engine, "collisionStart", this.collisionStart);
        Matter.Events.off(this.engine, "beforeUpdate", this.beforeUpdateFun);
        Matter.World.remove(this.engine.world, this.engine.world.bodies, 0);
    };
    Scene_016.prototype.exit = function () {
        this.destroy();
        _super.prototype.exit.call(this);
    };
    return Scene_016;
}(BaseScene));
__reflect(Scene_016.prototype, "Scene_016");
//堆箱子
var Scene_017 = (function (_super) {
    __extends(Scene_017, _super);
    function Scene_017() {
        var _this = _super.call(this) || this;
        _this.isCanOperate = true;
        //丢掉的箱子
        _this.loseCnt = 0;
        //已使用的箱子
        _this.usedCnt = 0;
        _this.intervalId = 0;
        _this.init();
        return _this;
    }
    Scene_017.prototype.init = function () {
        var _this = this;
        //sdata最多丢弃箱子的数目  tdata目标堆积的箱子数目 score:箱子总数 time:单位毫秒代表箱子移动周期时间
        var shape = new egret.Shape();
        shape.graphics.beginFill(0x00ff00, 0.01);
        shape.graphics.drawRect(0, 0, SpriteUtil.stageWidth, SpriteUtil.stageHeight);
        shape.graphics.endFill();
        this.addChild(shape);
        this.boxArr = [];
        //初始画引擎部分
        this.engine = Matter.Engine.create({ enableSleeping: true }, null);
        this.runner = Matter.Runner.create(null);
        this.runner.isFixed = true;
        var render = EgretRender.create({
            engine: this.engine,
            container: this,
            options: {
                width: SpriteUtil.stageWidth,
                height: SpriteUtil.stageHeight,
                wireframes: true
            }
        });
        Matter.Runner.run(this.runner, this.engine);
        EgretRender.run(render);
        this.engine.world.gravity.y = 1;
        var box = SpriteUtil.createImage(this.dataVo.sData);
        box.x = box.width / 2;
        box.y = 120;
        this.addChild(box);
        this.skyBox = box;
        var brbc = '以热爱祖国为荣  以危害祖国为耻\n以服务人民为荣  以背离人民为耻\n以崇尚科学为荣  以愚昧无知为耻\n以辛勤劳动为荣  以好逸恶劳为耻\n以团结互助为荣  以损人利己为耻\n以诚实守信为荣  以见利忘义为耻\n以遵纪守法为荣  以违法乱纪为耻\n以艰苦奋斗为荣  以骄奢淫逸为耻';
        // let bspr = SpriteUtil.createRect(360,200,0x000000);
        var bspr = SpriteUtil.createText(brbc, 30, 0xff0000, true);
        var body = Matter.Bodies.rectangle(SpriteUtil.stageCenterX, SpriteUtil.stageHeight - bspr.height / 2, bspr.width, bspr.height, {
            isStatic: true,
            friction: 5,
            frictionStatic: 5,
            render: {
                sprite: bspr
            }
        });
        Matter.World.add(this.engine.world, body);
        this.scoreItem = new ScoreItem();
        this.addChild(this.scoreItem);
        this.refreshCnt();
        this.timeItem = new TimeItem(5 * 60);
        this.addChild(this.timeItem);
        this.timeItem.x = SpriteUtil.stageWidth - 300;
        //循环运动box
        egret.Tween.get(this.skyBox, { loop: true }).to({ x: SpriteUtil.stageWidth - this.skyBox.width / 2 }, this.dataVo.time).to({ x: this.skyBox.width / 2 }, this.dataVo.time);
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.tapAddBox, this);
        this.intervalId = egret.setInterval(function () {
            var len = _this.boxArr.length;
            for (var i = 0; i < len; i++) {
                var bdy = _this.boxArr[i];
                if (bdy.position.y > SpriteUtil.stageHeight + 2 * bdy.render.sprite.width && !bdy.isStatic) {
                    _this.loseCnt++;
                    Matter.Body.setStatic(bdy, true);
                    Matter.Body.setPosition(bdy, { x: -(200 + 800 * Math.random()), y: bdy.position.y });
                }
            }
            _this.checkResult();
        }, this, 100);
    };
    Scene_017.prototype.tapAddBox = function (evt) {
        var _this = this;
        if (!this.isCanOperate)
            return;
        GameSound.instance().playSound('click');
        this.usedCnt++;
        this.isCanOperate = false;
        if (this.usedCnt > this.dataVo.score) {
            EffectUtil.showResultEffect();
            return;
        }
        GameSound.instance().playSound('click');
        var idx = egret.setTimeout(function () {
            egret.clearTimeout(idx);
            _this.isCanOperate = true;
        }, this, 500);
        this.refreshCnt();
        this.createBox();
    };
    //创建墙壁
    Scene_017.prototype.createBox = function () {
        var xx = this.skyBox.x;
        var yy = this.skyBox.y;
        var len = this.boxArr.length;
        for (var i = 0; i < len; i++) {
            var bdy = this.boxArr[i];
            if (bdy.position.y > SpriteUtil.stageHeight + bdy.render.sprite.width / 2 && bdy.position.x < -200) {
                Matter.Body.setStatic(bdy, false);
                Matter.Body.setAngle(bdy, 0);
                Matter.Body.setAngularVelocity(bdy, 0);
                Matter.Body.setVelocity(bdy, { x: 0, y: 0 });
                Matter.Body.setPosition(bdy, { x: xx, y: yy });
                Matter.Body.set(bdy, "restitution", 0);
                Matter.Body.set(bdy, "friction", 1);
                Matter.Body.set(bdy, 'isSleeping', false);
                return;
            }
        }
        var sprite = SpriteUtil.createImage(this.dataVo.sData);
        var body = Matter.Bodies.rectangle(xx, yy, sprite.width, sprite.height, {
            frictionAir: 0.005,
            friction: 0.5,
            mass: 10,
            render: {
                sprite: sprite
            }
        });
        Matter.World.add(this.engine.world, body);
        this.boxArr.push(body);
    };
    Scene_017.prototype.checkResult = function () {
        this.refreshCnt();
        if (this.usedCnt < this.dataVo.tData)
            return;
        var cnt = 0;
        for (var _i = 0, _a = this.boxArr; _i < _a.length; _i++) {
            var bdy = _a[_i];
            if (!bdy.isStatic && bdy.position.y <= SpriteUtil.stageHeight - 80 && bdy.isSleeping) {
                cnt++;
            }
        }
        if (cnt >= this.dataVo.tData) {
            this.isCanOperate = false;
            var time = this.timeItem.leftTime;
            this.destroy();
            if (time >= 1.5 * 60) {
                EffectUtil.showResultEffect(EffectUtil.PERFECT);
            }
            else if (time >= 2.5 * 60) {
                EffectUtil.showResultEffect(EffectUtil.GREAT);
            }
            else {
                EffectUtil.showResultEffect(EffectUtil.GOOD);
            }
        }
        else {
            var leftcnt = this.dataVo.score - this.usedCnt;
            if (leftcnt + this.usedCnt - this.loseCnt < this.dataVo.tData) {
                this.isCanOperate = false;
                this.destroy();
                EffectUtil.showResultEffect();
            }
        }
    };
    Scene_017.prototype.refreshCnt = function () {
        var str = "\u5269\u4F59 " + (this.dataVo.score - this.usedCnt) + "  \u76EE\u6807 " + this.dataVo.tData;
        this.scoreItem.setCustomText(str);
    };
    Scene_017.prototype.destroy = function () {
        this.timeItem.stop();
        egret.clearInterval(this.intervalId);
        egret.Tween.removeTweens(this.skyBox);
        this.isCanOperate = false;
        Matter.Runner.stop(this.runner);
        EgretRender.stop();
        Matter.Engine.clear(this.engine);
        Matter.World.remove(this.engine.world, this.engine.world.bodies, 0);
    };
    Scene_017.prototype.enter = function () {
        var _this = this;
        _super.prototype.enter.call(this);
        this.timeItem.start(function (time) {
            if (time < 0) {
                _this.destroy();
                _this.timeItem.stop();
                EffectUtil.showResultEffect();
            }
        }, this);
    };
    Scene_017.prototype.exit = function () {
        this.destroy();
        _super.prototype.exit.call(this);
    };
    return Scene_017;
}(BaseScene));
__reflect(Scene_017.prototype, "Scene_017");
//飞刀射木板
var Scene_018 = (function (_super) {
    __extends(Scene_018, _super);
    function Scene_018() {
        var _this = _super.call(this) || this;
        //源飞刀数组
        _this.knifeArr = [];
        //已经插上去的飞刀数组
        _this.hadKnifesArr = [];
        _this.rotateAngle = 0.6;
        _this.currCount = 0;
        _this.init();
        return _this;
    }
    Scene_018.prototype.init = function () {
        //创建刀列  tdata 旋转速度  sdata 数量
        this.rotateAngle = this.dataVo.tData;
        this.currCount = this.dataVo.sData;
        var len = this.dataVo.sData;
        for (var i = 0; i < len; i++) {
            var sprite = this.createKnifes();
            this.knifeArr.push({ sprite: sprite, angle: 0 });
        }
        //木头
        this.rotatePoint = new egret.Point(SpriteUtil.stageCenterX, 400);
        this.startPoint = new egret.Point(SpriteUtil.stageCenterX, 640);
        var image = SpriteUtil.createImage('earth');
        image.x = this.rotatePoint.x;
        image.y = this.rotatePoint.y;
        image.scaleX = 450 / 80;
        image.scaleY = 450 / 80;
        this.addChild(image);
        this.dartSprite = image;
        //
        this.createLeftTxt();
        this.showNext();
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
        egret.startTick(this.loop, this);
    };
    Scene_018.prototype.loop = function (timestamp) {
        if (timestamp === void 0) { timestamp = 0; }
        this.dartSprite.rotation += this.rotateAngle;
        for (var _i = 0, _a = this.hadKnifesArr; _i < _a.length; _i++) {
            var knife = _a[_i];
            knife.sprite.rotation += this.rotateAngle;
            var angle = knife.sprite.rotation * Math.PI / 180;
            var xx = this.startPoint.x - this.rotatePoint.x;
            var yy = this.startPoint.y - this.rotatePoint.y;
            var nx = xx * Math.cos(angle) - yy * Math.sin(angle) + this.rotatePoint.x;
            var ny = yy * Math.cos(angle) - xx * Math.sin(angle) + this.rotatePoint.y;
            knife.sprite.x = nx;
            knife.sprite.y = ny;
        }
        return true;
    };
    Scene_018.prototype.fireKnife = function (evt) {
        var _this = this;
        GameSound.instance().playSound('click');
        this.curKnife.sprite.touchEnabled = false;
        egret.Tween.get(this.curKnife.sprite).to({ y: this.startPoint.y }, 200, egret.Ease.cubicIn).call(function () {
            egret.Tween.removeTweens(_this.curKnife.sprite);
            var rotation = _this.dartSprite.rotation % 360;
            for (var _i = 0, _a = _this.hadKnifesArr; _i < _a.length; _i++) {
                var knife = _a[_i];
                //如果度数差小于12 就说明插不进去
                if (Math.abs(knife.angle - rotation) <= 12) {
                    egret.Tween.get(_this.curKnife.sprite).to({ y: SpriteUtil.stageHeight, rotation: 360 * (2 * Math.random() + 2) }, 3000).call(function () {
                        egret.Tween.removeTweens(_this.curKnife);
                        _this.leftKnifesTxt.text = "";
                        _this.timeItem.stop();
                        EffectUtil.showResultEffect();
                    });
                    return;
                }
            }
            _this.curKnife.angle = rotation;
            _this.hadKnifesArr.push(_this.curKnife);
            _this.showNext();
        }, this);
    };
    Scene_018.prototype.showNext = function () {
        if (this.currCount <= 0) {
            this.leftKnifesTxt.text = "";
            var leftTime = this.timeItem.leftTime;
            this.timeItem.stop();
            if (leftTime >= 2 * this.dataVo.time / 3) {
                EffectUtil.showResultEffect(EffectUtil.PERFECT);
            }
            else if (leftTime >= this.dataVo.time / 3) {
                EffectUtil.showResultEffect(EffectUtil.GREAT);
            }
            else {
                EffectUtil.showResultEffect(EffectUtil.GOOD);
            }
        }
        else {
            this.curKnife = this.knifeArr.pop();
            this.addChildAt(this.curKnife.sprite, 0);
            this.leftKnifesTxt.text = "x" + this.currCount;
            this.currCount--;
        }
    };
    Scene_018.prototype.createLeftTxt = function () {
        this.leftKnifesTxt = new egret.TextField();
        this.leftKnifesTxt.size = 48;
        this.leftKnifesTxt.bold = true;
        this.leftKnifesTxt.textColor = 0x0000ff;
        this.leftKnifesTxt.x = SpriteUtil.stageCenterX + 50;
        this.leftKnifesTxt.y = SpriteUtil.stageCenterY + 270;
        this.addChild(this.leftKnifesTxt);
    };
    //创建刀
    Scene_018.prototype.createKnifes = function () {
        var kspr = SpriteUtil.createImage('tree');
        kspr.x = SpriteUtil.stageCenterX;
        kspr.y = SpriteUtil.stageCenterY + 300;
        kspr.scaleX = 0.8;
        kspr.scaleY = -1;
        kspr.touchEnabled = true;
        kspr.addEventListener(egret.TouchEvent.TOUCH_TAP, this.fireKnife, this);
        return kspr;
    };
    Scene_018.prototype.enter = function () {
        _super.prototype.enter.call(this);
        this.timeItem.start();
    };
    Scene_018.prototype.exit = function () {
        _super.prototype.exit.call(this);
        this.timeItem.stop();
        egret.stopTick(this.loop, this);
    };
    return Scene_018;
}(BaseScene));
__reflect(Scene_018.prototype, "Scene_018");
//移动箱子消除
var Scene_019 = (function (_super) {
    __extends(Scene_019, _super);
    function Scene_019() {
        var _this = _super.call(this) || this;
        _this.allBoxDataArr = [];
        _this.curSelectIndex = -1;
        _this.isCanOperate = true;
        _this.stepNums = 0;
        //列 行
        _this.ROWS = 10;
        _this.COLUMNS = 8;
        _this.init();
        return _this;
    }
    Scene_019.prototype.init = function () {
        var _this = this;
        //游戏共8*10个格子  
        //算法思想 a、首先记录交换的两个箱子的index ->> b、交换index ->> c、对每一个index查找与其相邻的横竖格子是否有相同类型的箱子 
        // ->> d、有则保存到一个临时数组 ->> e、如果临时数组长度大于3则可消除 ->> f、记录消除后这些箱子上方需要下落的箱子的索引 ->> 回到c直到查找的数组为空 则停止
        var arr = [];
        var sprite = new egret.Sprite();
        for (var i = 0; i < this.COLUMNS * this.ROWS; i++) {
            var img = SpriteUtil.createImage('box');
            img.anchorOffsetX = 0;
            img.anchorOffsetY = 0;
            img.touchEnabled = false;
            var shape = new egret.Shape();
            shape.graphics.lineStyle(2, 0x0000ff, 1);
            shape.graphics.moveTo(0, 0);
            shape.graphics.lineTo(img.width, 0);
            shape.graphics.lineTo(img.width, img.height);
            shape.graphics.lineTo(0, img.height);
            shape.graphics.lineTo(0, 0);
            shape.visible = false;
            var spr = new egret.Sprite();
            spr.name = this.dataVo.sData[0] + '_' + i;
            spr.x = (img.width + 2) * (i % this.COLUMNS);
            spr.y = (img.width + 2) * Math.floor(i / this.COLUMNS);
            spr.addChild(img);
            spr.addChild(shape);
            sprite.addChild(spr);
            spr.touchEnabled = true;
            spr.addEventListener(egret.TouchEvent.TOUCH_TAP, this.tapExchange, this);
            arr.push({ index: i, box: spr });
        }
        sprite.x = SpriteUtil.stageCenterX - sprite.width / 2;
        sprite.y = 200;
        this.addChild(sprite);
        this.allBoxDataArr = arr;
        var rect = SpriteUtil.createRect(SpriteUtil.stageWidth, SpriteUtil.stageHeight - sprite.height - sprite.y, 0x000000);
        rect.anchorOffsetX = 0;
        rect.anchorOffsetY = 0;
        rect.y = sprite.y + sprite.height;
        this.addChild(rect);
        var btn = SpriteUtil.createButton("重置", 160, 80, 0x0000ff, 36);
        btn.x = SpriteUtil.stageCenterX - btn.width / 2;
        btn.y = 200;
        this.addChild(btn);
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (!_this.isCanOperate)
                return;
            _this.createList();
        }, this);
        this.scoreItem = new ScoreItem();
        this.addChild(this.scoreItem);
        this.createList();
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
    };
    Scene_019.prototype.createList = function () {
        for (var _i = 0, _a = this.allBoxDataArr; _i < _a.length; _i++) {
            var bda = _a[_i];
            bda.box.visible = false;
        }
        for (var i = 0; i < this.dataVo.sData.length; i++) {
            var config = this.dataVo.sData[i];
            var box = this.allBoxDataArr[config.index].box;
            box.getChildAt(0).texture = RES.getRes(config.box + "_png");
            box.visible = true;
            box.name = config.box + "_" + config.index;
        }
        this.stepNums = this.dataVo.tData;
        this.scoreItem.setCustomText("\u5269\u4F59\u6B65\u6570  " + this.stepNums);
    };
    Scene_019.prototype.tapExchange = function (evt) {
        if (!this.isCanOperate)
            return;
        if (this.timeItem.leftTime <= 0)
            return;
        GameSound.instance().playSound('click');
        var spr = evt.target;
        var index = spr.name.split('_')[1];
        spr.getChildAt(1).visible = true;
        if (this.curSelectIndex == -1) {
            this.curSelectIndex = index;
            return;
        }
        if (this.curSelectIndex == index) {
            return;
        }
        if (this.isNextTo(this.curSelectIndex, index)) {
            this.isCanOperate = false;
            this.stepNums--;
            this.scoreItem.setCustomText("\u5269\u4F59\u6B65\u6570  " + this.stepNums);
            this.exchangeBox(this.curSelectIndex, index);
            this.refreshPos([this.curSelectIndex, index]);
        }
        else {
            var box = this.allBoxDataArr[this.curSelectIndex].box;
            box.getChildAt(1).visible = false;
            this.curSelectIndex = index;
        }
    };
    //消除需要横向和纵向
    Scene_019.prototype.checkResult = function (indexArr) {
        // this.isCanOperate = true;
        // this.curSelectIndex = -1;
        // return;
        var arr = [];
        for (var i = 0; i < indexArr.length; i++) {
            var arr1 = this.getClearRowNums(indexArr[i]);
            var arr2 = this.getClearColNums(indexArr[i]);
            if (arr1.length >= 3) {
                arr = arr.concat(arr1);
            }
            if (arr2.length >= 3) {
                arr = arr.concat(arr2);
            }
        }
        if (arr.length == 0) {
            if (this.isCanPass()) {
                var time = this.timeItem.leftTime;
                this.timeItem.stop();
                if (time >= this.dataVo.time * 1 / 3) {
                    EffectUtil.showResultEffect(EffectUtil.PERFECT);
                }
                else if (time >= this.dataVo.time * 2 / 3) {
                    EffectUtil.showResultEffect(EffectUtil.GREAT);
                }
                else {
                    EffectUtil.showResultEffect(EffectUtil.GOOD);
                }
            }
            else if (this.stepNums <= 0) {
                this.isCanOperate = false;
                EffectUtil.showResultEffect();
                this.timeItem.stop();
            }
            else {
                this.isCanOperate = true;
                this.curSelectIndex = -1;
            }
            return;
        }
        //同时移除
        for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
            var index = arr_1[_i];
            this.allBoxDataArr[index].box.visible = false;
        }
        //刷新所有位置
        this.refreshAll(arr);
    };
    //行
    Scene_019.prototype.getClearRowNums = function (index) {
        var row = Math.floor(index / this.COLUMNS);
        var tindex = index % this.COLUMNS;
        var box = this.allBoxDataArr[index].box;
        var type = box.name.split('_')[0];
        var arr = [];
        for (var i = tindex; i >= 0; i--) {
            var sindex = i + row * this.COLUMNS;
            var sbox = this.allBoxDataArr[sindex].box;
            if (sbox.name.split('_')[0] == type && sbox.visible) {
                arr.push(sindex);
            }
            else {
                break;
            }
        }
        for (var i = tindex + 1; i < this.COLUMNS; i++) {
            var sindex = i + row * this.COLUMNS;
            var tbox = this.allBoxDataArr[sindex].box;
            if (tbox.name.split('_')[0] == type && tbox.visible) {
                arr.push(sindex);
            }
            else {
                break;
            }
        }
        return arr;
    };
    //列
    Scene_019.prototype.getClearColNums = function (index) {
        var rows = Math.floor(index / this.COLUMNS);
        var cols = index % this.COLUMNS;
        var box = this.allBoxDataArr[index].box;
        var type = box.name.split('_')[0];
        var arr = [];
        for (var i = rows; i >= 0; i--) {
            var sindex = i * this.COLUMNS + cols;
            var sbox = this.allBoxDataArr[sindex].box;
            if (sbox.name.split('_')[0] == type && sbox.visible) {
                arr.push(sindex);
            }
            else {
                break;
            }
        }
        for (var i = rows + 1; i < 10; i++) {
            var sindex = i * this.COLUMNS + cols;
            var tbox = this.allBoxDataArr[sindex].box;
            if (tbox.name.split('_')[0] == type && tbox.visible) {
                arr.push(sindex);
            }
            else {
                break;
            }
        }
        return arr;
    };
    //判断两个index是否是左右上下相邻的
    Scene_019.prototype.isNextTo = function (index1, index2) {
        if (Math.abs(index1 - index2) == 1)
            return true;
        if (Math.abs(index1 - index2) == this.COLUMNS)
            return true;
        return false;
    };
    //是否全部消除
    Scene_019.prototype.isCanPass = function () {
        for (var _i = 0, _a = this.allBoxDataArr; _i < _a.length; _i++) {
            var boxData = _a[_i];
            if (boxData.box.visible) {
                return false;
            }
        }
        return true;
    };
    //交换两个箱子  注意index也要交换
    Scene_019.prototype.exchangeBox = function (index1, index2) {
        var index = this.allBoxDataArr[index1].index;
        this.allBoxDataArr[index1].index = this.allBoxDataArr[index2].index;
        this.allBoxDataArr[index2].index = index;
        var boxData = this.allBoxDataArr[index1];
        this.allBoxDataArr[index1] = this.allBoxDataArr[index2];
        this.allBoxDataArr[index2] = boxData;
    };
    //刷新位置
    Scene_019.prototype.refreshPos = function (arr) {
        var _this = this;
        var _loop_1 = function (i) {
            var box = this_1.allBoxDataArr[arr[i]].box;
            var index = this_1.allBoxDataArr[arr[i]].index;
            var name_1 = box.name;
            box.name = name_1.split('_')[0] + '_' + index;
            box.getChildAt(1).visible = false;
            egret.Tween.get(box).to({ x: (box.getChildAt(0).width + 2) * (index % this_1.COLUMNS), y: (box.getChildAt(0).width + 2) * Math.floor(index / this_1.COLUMNS) }, 250).call(function () {
                egret.Tween.removeTweens(box);
                if (i == arr.length - 1) {
                    var idx_2 = egret.setTimeout(function () {
                        egret.clearTimeout(idx_2);
                        _this.checkResult(arr);
                    }, _this, 500);
                }
            }, this_1);
        };
        var this_1 = this;
        for (var i = 0; i < arr.length; i++) {
            _loop_1(i);
        }
    };
    //更新所有位置 visible=false的直接删除  从下向上排列
    Scene_019.prototype.refreshAll = function (arr) {
        var _this = this;
        var len = this.allBoxDataArr.length;
        for (var i = len - 1; i >= 0; i--) {
            var box = this.allBoxDataArr[i].box;
            if (!box.visible) {
                var rows = Math.floor(i / this.COLUMNS);
                var cols = i % this.COLUMNS;
                for (var j = rows - 1; j >= 0; j--) {
                    if (this.allBoxDataArr[j * this.COLUMNS + cols].box.visible) {
                        this.exchangeBox(j * this.COLUMNS + cols, i);
                        arr.push(j * this.COLUMNS + cols);
                        break;
                    }
                }
            }
        }
        len = this.allBoxDataArr.length;
        var _loop_2 = function (i) {
            var box = this_2.allBoxDataArr[i].box;
            var index = this_2.allBoxDataArr[i].index;
            var name_2 = box.name;
            box.name = name_2.split('_')[0] + '_' + index;
            egret.Tween.get(box).to({ x: (box.getChildAt(0).width + 2) * (index % this_2.COLUMNS), y: (box.getChildAt(0).width + 2) * Math.floor(index / this_2.COLUMNS) }, 250).call(function () {
                egret.Tween.removeTweens(box);
                if (i == 0 && arr.length > 0) {
                    var idx_3 = egret.setTimeout(function () {
                        egret.clearTimeout(idx_3);
                        _this.checkResult(arr);
                    }, _this, 300);
                }
            }, this_2);
        };
        var this_2 = this;
        for (var i = len - 1; i >= 0; i--) {
            _loop_2(i);
        }
    };
    Scene_019.prototype.enter = function () {
        _super.prototype.enter.call(this);
        this.timeItem.start();
    };
    return Scene_019;
}(BaseScene));
__reflect(Scene_019.prototype, "Scene_019");
//点击次数
var Scene_020 = (function (_super) {
    __extends(Scene_020, _super);
    function Scene_020() {
        var _this = _super.call(this) || this;
        //二维数组 存储三个palyer的路径
        _this.roadAllArr = [];
        //三个player 对应的阶段
        _this.leftIndex = 0;
        _this.rightIndex = 0;
        _this.ownIndex = 0;
        _this.diceArr = [];
        _this.isRunning = false;
        _this.intervalId = 0;
        _this.isCanOperate = true;
        _this.init();
        return _this;
    }
    Scene_020.prototype.init = function () {
        var sprite = new egret.Sprite();
        this.addChild(sprite);
        this.container = sprite;
        var shape = new egret.Shape();
        shape.graphics.beginFill(0x000000, 0.1);
        shape.graphics.lineStyle(30, 0x8B7765);
        shape.graphics.drawRect(0, 0, 250, 250);
        shape.anchorOffsetX = shape.width / 2;
        shape.anchorOffsetY = shape.height / 2;
        shape.x = SpriteUtil.stageCenterX + 15;
        shape.y = SpriteUtil.stageCenterY - 100;
        this.container.addChild(shape);
        var lspr = this.createLeftCastle();
        lspr.x = 115;
        lspr.y = SpriteUtil.stageCenterY - 110;
        this.container.addChild(lspr);
        var rspr = this.createRightCastle();
        rspr.x = SpriteUtil.stageCenterX + 130;
        rspr.y = lspr.y;
        this.container.addChild(rspr);
        var mspr = this.createMiddleCastle();
        mspr.x = SpriteUtil.stageCenterX;
        mspr.y = lspr.y + 120;
        this.container.addChild(mspr);
        var kp1 = SpriteUtil.createText(this.dataVo.sData[4], 60, 0x00ff00, true);
        kp1.x = shape.x - shape.width / 2;
        kp1.y = shape.y - shape.height / 2;
        this.container.addChild(kp1);
        var kp2 = SpriteUtil.createText(this.dataVo.sData[5], 60, 0x00ff00, true);
        kp2.x = shape.x - 15;
        kp2.y = shape.y - shape.height / 2;
        this.container.addChild(kp2);
        var kp3 = SpriteUtil.createText(this.dataVo.sData[6], 60, 0x00ff00, true);
        kp3.x = shape.x + shape.width / 2 - 30;
        kp3.y = shape.y - shape.height / 2;
        this.container.addChild(kp3);
        var kp4 = SpriteUtil.createText(this.dataVo.sData[7], 60, 0x00ff00, true);
        kp4.x = shape.x + shape.width / 2 - 30;
        kp4.y = shape.y + shape.height / 2 - 30;
        this.container.addChild(kp4);
        var kp5 = SpriteUtil.createText(this.dataVo.sData[8], 60, 0x00ff00, true);
        kp5.x = shape.x - shape.width / 2;
        kp5.y = shape.y + shape.height / 2 - 30;
        this.container.addChild(kp5);
        var kp6 = SpriteUtil.createText(this.dataVo.sData[9], 60, 0x00ff00, true);
        kp6.x = shape.x - 15;
        kp6.y = shape.y - 10;
        this.container.addChild(kp6);
        var kp7 = SpriteUtil.createText(this.dataVo.sData[10], 60, 0x00ff00, true);
        kp7.x = shape.x - 15;
        kp7.y = SpriteUtil.stageCenterY - shape.height / 2 - 200;
        this.container.addChild(kp7);
        var kp8 = SpriteUtil.createText(this.dataVo.sData[11], 60, 0x00ff00, true);
        kp8.x = shape.x - 15;
        kp8.y = SpriteUtil.stageCenterY - shape.height / 2 - 300;
        this.container.addChild(kp8);
        var pyramid = SpriteUtil.createImage('pyramid');
        pyramid.x = SpriteUtil.stageCenterX;
        pyramid.y = SpriteUtil.stageCenterY - shape.height / 2 - 400;
        this.container.addChild(pyramid);
        var pshp = SpriteUtil.createRect(30, 400, 0xFFD7000);
        pshp.anchorOffsetY = 0;
        pshp.x = shape.x - 15;
        pshp.y = pyramid.y + 20;
        this.container.addChildAt(pshp, 1);
        this.roadAllArr[0] = this.storagePoint(lspr);
        this.roadAllArr[1] = this.storagePoint(mspr);
        this.roadAllArr[2] = this.storagePoint(rspr);
        this.roadAllArr[0] = this.roadAllArr[0].concat([{ x: kp5.x, y: kp5.y }, { x: kp4.x, y: kp4.y }, { x: kp3.x, y: kp3.y }, { x: kp2.x, y: kp2.y }, { x: kp1.x, y: kp1.y }]);
        this.roadAllArr[1] = this.roadAllArr[1].concat([{ x: kp4.x, y: kp4.y }, { x: kp3.x, y: kp3.y }, { x: kp2.x, y: kp2.y }, { x: kp1.x, y: kp1.y }, { x: kp5.x, y: kp5.y }]);
        this.roadAllArr[2] = this.roadAllArr[2].concat([{ x: kp3.x, y: kp3.y }, { x: kp2.x, y: kp2.y }, { x: kp1.x, y: kp1.y }, { x: kp5.x, y: kp5.y }, { x: kp4.x, y: kp4.y }]);
        for (var i = 0; i < 3; i++) {
            this.roadAllArr[i] = this.roadAllArr[i].concat([{ x: kp6.x, y: kp6.y }, { x: kp7.x, y: kp7.y }, { x: kp8.x, y: kp8.y }, { x: pyramid.x, y: pyramid.y }]);
        }
        this.leftPlayer = SpriteUtil.createImage('emoji11');
        this.leftPlayer.x = this.roadAllArr[0][0].x;
        this.leftPlayer.y = this.roadAllArr[0][0].y;
        this.container.addChild(this.leftPlayer);
        EffectUtil.breath(this.leftPlayer, 0.2);
        this.ownPlayer = SpriteUtil.createImage('emoji16');
        this.ownPlayer.x = this.roadAllArr[1][0].x;
        this.ownPlayer.y = this.roadAllArr[1][0].y;
        this.container.addChild(this.ownPlayer);
        EffectUtil.breath(this.ownPlayer, 0.2);
        this.rightPlayer = SpriteUtil.createImage('emoji19');
        this.rightPlayer.x = this.roadAllArr[2][0].x;
        this.rightPlayer.y = this.roadAllArr[2][0].y;
        this.container.addChild(this.rightPlayer);
        EffectUtil.breath(this.rightPlayer, 0.2);
        var dice1 = SpriteUtil.createImage('dice1');
        dice1.x = SpriteUtil.stageCenterX - 100;
        dice1.y = SpriteUtil.stageCenterY + 500;
        this.container.addChild(dice1);
        var dice2 = SpriteUtil.createImage('dice2');
        dice2.x = SpriteUtil.stageCenterX;
        dice2.y = SpriteUtil.stageCenterY + 500;
        this.container.addChild(dice2);
        var dice3 = SpriteUtil.createImage('dice3');
        dice3.x = SpriteUtil.stageCenterX + 100;
        dice3.y = SpriteUtil.stageCenterY + 500;
        this.container.addChild(dice3);
        this.container.scaleX = 0.8;
        this.container.scaleY = 0.8;
        this.container.x = this.container.width * 0.2 / 2;
        this.diceArr = [dice1, dice2, dice3];
        dice1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.diceTap, this);
        dice2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.diceTap, this);
        dice3.addEventListener(egret.TouchEvent.TOUCH_TAP, this.diceTap, this);
    };
    Scene_020.prototype.diceTap = function () {
        if (!this.isCanOperate)
            return;
        this.isRunning = !this.isRunning;
        if (this.isRunning) {
            this.startDices();
        }
        else {
            egret.clearInterval(this.intervalId);
            this.isCanOperate = false;
            var cnt = 0;
            for (var _i = 0, _a = this.diceArr; _i < _a.length; _i++) {
                var dice = _a[_i];
                cnt += parseInt(dice.name);
            }
            if (cnt % 3 == 1) {
                this.leftIndex++;
                this.movePlayer(0, this.leftIndex);
            }
            else if (cnt % 3 == 2) {
                this.ownIndex++;
                this.movePlayer(1, this.ownIndex);
            }
            else if (cnt % 3 == 0) {
                this.rightIndex++;
                this.movePlayer(2, this.rightIndex);
            }
        }
    };
    Scene_020.prototype.startDices = function () {
        var _this = this;
        this.intervalId = egret.setInterval(function () {
            for (var _i = 0, _a = _this.diceArr; _i < _a.length; _i++) {
                var dice = _a[_i];
                var index = Math.ceil(6 * Math.random());
                dice['texture'] = RES.getRes("dice" + index + "_png");
                dice.name = '' + index;
            }
        }, this, 40);
    };
    Scene_020.prototype.movePlayer = function (playerIndex, posIndex) {
        var _this = this;
        var player;
        if (playerIndex == 0) {
            player = this.leftPlayer;
        }
        else if (playerIndex == 1) {
            player = this.ownPlayer;
        }
        else if (playerIndex == 2) {
            player = this.rightPlayer;
        }
        var tween = egret.Tween.get(player);
        tween.wait(500);
        tween.to({ x: this.roadAllArr[playerIndex][posIndex].x, y: this.roadAllArr[playerIndex][posIndex].y }, 500).call(function () {
            _this.isCanOperate = true;
            _this.checkResult();
        }, this);
    };
    Scene_020.prototype.checkResult = function () {
        if (this.leftIndex >= this.roadAllArr[0].length - 1 || this.rightIndex >= this.roadAllArr[2].length - 1) {
            this.isCanOperate = false;
            EffectUtil.showResultEffect();
        }
        else if (this.ownIndex >= this.roadAllArr[1].length - 1) {
            EffectUtil.showResultEffect(EffectUtil.PERFECT);
            this.isCanOperate = false;
        }
    };
    Scene_020.prototype.createLeftCastle = function () {
        var sprite = new egret.Sprite();
        var house = SpriteUtil.createImage('house');
        house.y = 300;
        sprite.addChild(house);
        var kp1 = SpriteUtil.createText(this.dataVo.sData[0], 60, 0x00ff00, true);
        kp1.y = 200;
        sprite.addChild(kp1);
        var kp2 = SpriteUtil.createText(this.dataVo.sData[1], 60, 0x00ff00, true);
        kp2.y = 100;
        sprite.addChild(kp2);
        var kp3 = SpriteUtil.createText(this.dataVo.sData[2], 60, 0x00ff00, true);
        sprite.addChild(kp3);
        var mountain = SpriteUtil.createText(this.dataVo.sData[3], 60, 0x00ff00, true);
        mountain.x = 120;
        sprite.addChild(mountain);
        var shape = SpriteUtil.createRect(30, house.y, 0x8B7765);
        shape.anchorOffsetY = 0;
        sprite.addChildAt(shape, 0);
        var lshape = SpriteUtil.createRect(mountain.x, 30, 0x8B7765);
        lshape.anchorOffsetX = 0;
        sprite.addChildAt(lshape, 0);
        return sprite;
    };
    Scene_020.prototype.createRightCastle = function () {
        var sprite = new egret.Sprite();
        var xx = 120;
        var house = SpriteUtil.createImage('house');
        house.x = xx;
        house.y = 300;
        sprite.addChild(house);
        var kp1 = SpriteUtil.createText(this.dataVo.sData[0], 60, 0x00ff00, true);
        kp1.x = xx;
        kp1.y = 200;
        sprite.addChild(kp1);
        var kp2 = SpriteUtil.createText(this.dataVo.sData[1], 60, 0x00ff00, true);
        kp2.x = xx;
        kp2.y = 100;
        sprite.addChild(kp2);
        var kp3 = SpriteUtil.createText(this.dataVo.sData[2], 60, 0x00ff00, true);
        kp3.x = xx;
        sprite.addChild(kp3);
        var mountain = SpriteUtil.createText(this.dataVo.sData[3], 60, 0x00ff00, true);
        sprite.addChild(mountain);
        var shape = SpriteUtil.createRect(30, house.y, 0x8B7765);
        shape.anchorOffsetY = 0;
        shape.x = xx;
        sprite.addChildAt(shape, 0);
        var lshape = SpriteUtil.createRect(xx, 30, 0x8B7765);
        lshape.anchorOffsetX = 0;
        sprite.addChildAt(lshape, 0);
        return sprite;
    };
    Scene_020.prototype.createMiddleCastle = function () {
        var sprite = new egret.Sprite();
        var house = SpriteUtil.createImage('house');
        house.y = 400;
        sprite.addChild(house);
        var kp1 = SpriteUtil.createText(this.dataVo.sData[0], 60, 0x00ff00, true);
        kp1.y = 300;
        sprite.addChild(kp1);
        var kp2 = SpriteUtil.createText(this.dataVo.sData[1], 60, 0x00ff00, true);
        kp2.y = 200;
        sprite.addChild(kp2);
        var kp3 = SpriteUtil.createText(this.dataVo.sData[2], 60, 0x00ff00, true);
        kp3.y = 100;
        sprite.addChild(kp3);
        var mountain = SpriteUtil.createText(this.dataVo.sData[3], 60, 0x00ff00, true);
        sprite.addChild(mountain);
        var shape = SpriteUtil.createRect(30, house.y, 0x8B7765);
        shape.anchorOffsetY = 0;
        sprite.addChildAt(shape, 0);
        return sprite;
    };
    Scene_020.prototype.storagePoint = function (sprite) {
        var arr = [];
        for (var i = sprite.numChildren - 1, j = 0; j < 5; i--, j++) {
            var spr = sprite.getChildAt(i);
            var point = sprite.localToGlobal(spr.x, spr.y);
            arr.push({ x: point.x, y: point.y });
        }
        arr.reverse();
        return arr;
    };
    Scene_020.prototype.exit = function () {
        _super.prototype.exit.call(this);
        for (var _i = 0, _a = this.diceArr; _i < _a.length; _i++) {
            var dice = _a[_i];
            egret.Tween.removeTweens(dice);
        }
        egret.Tween.removeTweens(this.leftPlayer);
        egret.Tween.removeTweens(this.ownPlayer);
        egret.Tween.removeTweens(this.rightPlayer);
        egret.clearInterval(this.intervalId);
    };
    return Scene_020;
}(BaseScene));
__reflect(Scene_020.prototype, "Scene_020");
var Scene_021 = (function (_super) {
    __extends(Scene_021, _super);
    function Scene_021() {
        var _this = _super.call(this) || this;
        _this.init();
        return _this;
    }
    Scene_021.prototype.init = function () {
        var bg = SpriteUtil.createRect(SpriteUtil.stageWidth, SpriteUtil.stageHeight, 0xffffff);
        bg.alpha = 0.01;
        bg.anchorOffsetX = 0;
        bg.anchorOffsetY = 0;
        this.addChild(bg);
        this.engine = Matter.Engine.create({ enableSleeping: false }, null);
        this.runner = Matter.Runner.create(null);
        this.runner.isFixed = true;
        this.render = EgretRender.create({
            engine: this.engine,
            container: this,
            options: {
                width: SpriteUtil.stageWidth,
                height: SpriteUtil.stageHeight,
                wireframes: true
            }
        });
        Matter.Runner.run(this.runner, this.engine);
        EgretRender.run(this.render);
        this.engine.world.gravity.y = 0;
        var circle = SpriteUtil.createImage(this.dataVo.sData);
        var scale = 64 / circle.width;
        circle.scaleX = scale;
        circle.scaleY = scale;
        this.player = Matter.Bodies.circle(50, 50, scale * circle.width / 2, {
            label: 'player',
            render: {
                sprite: circle
            }
        }, 0);
        Matter.World.add(this.engine.world, this.player);
        var tcircle = SpriteUtil.createImage(this.dataVo.tData);
        var target = Matter.Bodies.circle(SpriteUtil.stageWidth - tcircle.width / 2 - 10, SpriteUtil.stageHeight - tcircle.height / 2 - 10, tcircle.width / 2, {
            label: 'target',
            isStatic: true,
            render: {
                sprite: tcircle
            }
        }, 0);
        Matter.World.add(this.engine.world, target);
        this.target = target;
        this.createWall();
        if (this.dataVo.level == 1) {
            this.createEnemy0();
        }
        else if (this.dataVo.level == 2) {
            this.createEnemy1();
        }
        else if (this.dataVo.level == 3) {
            this.createEnemy2();
        }
        else if (this.dataVo.level == 4) {
            this.createEnemy3();
        }
        else if (this.dataVo.level == 5) {
            this.createEnemy4();
        }
        else if (this.dataVo.level == 6) {
            this.createEnemy5();
        }
        else if (this.dataVo.level == 7) {
            this.createEnemy6();
        }
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
        Matter.Events.on(this.engine, "collisionStart", this.collisionHandle.bind(this));
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchHandler, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.touchHandler, this);
    };
    Scene_021.prototype.touchHandler = function (evt) {
        if (evt.type == egret.TouchEvent.TOUCH_BEGIN) {
            this.startPt = new egret.Point(evt["stageX"], evt["stageY"]);
            this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchHandler, this);
        }
        else if (evt.type == egret.TouchEvent.TOUCH_MOVE) {
            if (this.startPt == null) {
                this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchHandler, this);
                return;
            }
            var nowPt = new egret.Point(evt["stageX"], evt["stageY"]);
            this.movePlayer(this.startPt, nowPt);
            this.startPt = nowPt;
        }
        else if (evt.type == egret.TouchEvent.TOUCH_END) {
            this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchHandler, this);
            this.startPt = null;
        }
    };
    Scene_021.prototype.movePlayer = function (start, end) {
        var xx = start.x - end.x;
        var yy = start.y - end.y;
        Matter.Body.setPosition(this.player, { x: this.player.position.x + xx, y: this.player.position.y + yy });
    };
    Scene_021.prototype.collisionHandle = function (evt) {
        // console.log("碰撞o%",evt);
        var pairs = evt.pairs;
        for (var _i = 0, pairs_5 = pairs; _i < pairs_5.length; _i++) {
            var pair = pairs_5[_i];
            if (pair.bodyA.label == "target" && pair.bodyB.label == "player") {
                this.destroy();
                var time = this.timeItem.leftTime;
                this.timeItem.stop();
                if (time >= this.dataVo.time / 3) {
                    EffectUtil.showResultEffect(EffectUtil.PERFECT);
                }
                else if (time >= this.dataVo.time * 2 / 3) {
                    EffectUtil.showResultEffect(EffectUtil.GREAT);
                }
                else {
                    EffectUtil.showResultEffect(EffectUtil.GOOD);
                }
            }
            else if (pair.bodyA.label == "player" && pair.bodyB.label == "target") {
                this.destroy();
                var time = this.timeItem.leftTime;
                this.timeItem.stop();
                if (time >= this.dataVo.time / 3) {
                    EffectUtil.showResultEffect(EffectUtil.PERFECT);
                }
                else if (time >= this.dataVo.time * 2 / 3) {
                    EffectUtil.showResultEffect(EffectUtil.GREAT);
                }
                else {
                    EffectUtil.showResultEffect(EffectUtil.GOOD);
                }
            }
            else if (pair.bodyA.label == "player" || pair.bodyB.label == "player") {
                this.destroy();
                this.timeItem.stop();
                EffectUtil.showResultEffect();
            }
        }
    };
    Scene_021.prototype.createEnemy0 = function () {
        var rect = SpriteUtil.createRect(SpriteUtil.stageWidth / 3, SpriteUtil.stageHeight / 2, this.getSevenColor(), true);
        var wall = Matter.Bodies.rectangle(SpriteUtil.stageWidth - rect.width / 2, SpriteUtil.stageCenterY, rect.width, rect.height, {
            isStatic: true,
            render: {
                sprite: rect
            }
        });
        Matter.World.add(this.engine.world, wall);
        var rect1 = SpriteUtil.createRect(SpriteUtil.stageWidth / 3, SpriteUtil.stageHeight / 2, this.getSevenColor(), true);
        var left = Matter.Bodies.rectangle(rect1.width / 2, SpriteUtil.stageCenterY, rect1.width, rect1.height, {
            isStatic: true,
            render: {
                sprite: rect1
            }
        });
        Matter.World.add(this.engine.world, left);
    };
    Scene_021.prototype.createEnemy1 = function () {
        var rect = SpriteUtil.createRect(SpriteUtil.stageWidth / 3, SpriteUtil.stageHeight / 2, this.getSevenColor(), true);
        var right = Matter.Bodies.rectangle(SpriteUtil.stageWidth - rect.width / 2, SpriteUtil.stageCenterY, rect.width, rect.height, {
            isStatic: true,
            render: {
                sprite: rect
            }
        });
        Matter.World.add(this.engine.world, right);
        var rect1 = SpriteUtil.createRect(SpriteUtil.stageWidth / 3, SpriteUtil.stageHeight / 2, this.getSevenColor(), true);
        var left = Matter.Bodies.rectangle(rect1.width / 2, SpriteUtil.stageCenterY, rect1.width, rect1.height, {
            isStatic: true,
            render: {
                sprite: rect1
            }
        });
        Matter.World.add(this.engine.world, left);
        //top
        var rect2 = SpriteUtil.createRect(SpriteUtil.stageWidth / 2, SpriteUtil.stageWidth / 3.5, this.getSevenColor(), true);
        var top = Matter.Bodies.rectangle(SpriteUtil.stageCenterX, rect2.height / 2, rect2.width, rect2.height, {
            isStatic: true,
            render: {
                sprite: rect2
            }
        });
        Matter.World.add(this.engine.world, top);
        //bottom
        var rect3 = SpriteUtil.createRect(SpriteUtil.stageWidth / 2, SpriteUtil.stageWidth / 3.5, this.getSevenColor(), true);
        var bottom = Matter.Bodies.rectangle(SpriteUtil.stageCenterX, SpriteUtil.stageHeight - rect2.height / 2, rect2.width, rect3.height, {
            isStatic: true,
            render: {
                sprite: rect3
            }
        });
        Matter.World.add(this.engine.world, bottom);
    };
    Scene_021.prototype.createEnemy2 = function () {
        var rect = SpriteUtil.createRect(SpriteUtil.stageWidth / 1.4, SpriteUtil.stageHeight / 1.3, this.getSevenColor(), true);
        var wall = Matter.Bodies.rectangle(SpriteUtil.stageCenterX, SpriteUtil.stageCenterY, rect.width, rect.height, {
            isStatic: true,
            render: {
                sprite: rect
            }
        });
        Matter.World.add(this.engine.world, wall);
    };
    Scene_021.prototype.createEnemy3 = function () {
        var rect = SpriteUtil.createRect(SpriteUtil.stageWidth - 100, SpriteUtil.stageHeight / 8, this.getSevenColor(), true);
        var wall = Matter.Bodies.rectangle(rect.width / 2, 200, rect.width, rect.height, {
            isStatic: true,
            render: {
                sprite: rect
            }
        });
        Matter.World.add(this.engine.world, wall);
        var recta = SpriteUtil.createRect(SpriteUtil.stageWidth - 100, SpriteUtil.stageHeight / 8, this.getSevenColor(), true);
        var walla = Matter.Bodies.rectangle(SpriteUtil.stageWidth - recta.width / 2, SpriteUtil.stageHeight - 200, recta.width, recta.height, {
            isStatic: true,
            render: {
                sprite: recta
            }
        });
        Matter.World.add(this.engine.world, walla);
        var rect1 = SpriteUtil.createRect(SpriteUtil.stageWidth / 6, SpriteUtil.stageHeight / 2.4, this.getSevenColor(), true);
        var wall1 = Matter.Bodies.rectangle(SpriteUtil.stageCenterX, SpriteUtil.stageCenterY, rect1.width, rect1.height, {
            isStatic: true,
            render: {
                sprite: rect1
            }
        });
        Matter.World.add(this.engine.world, wall1);
        var rect2 = SpriteUtil.createRect(SpriteUtil.stageWidth - 200, SpriteUtil.stageWidth / 5, this.getSevenColor(), true);
        var wall2 = Matter.Bodies.rectangle(SpriteUtil.stageCenterX, SpriteUtil.stageCenterY, rect2.width, rect2.height, {
            isStatic: true,
            render: {
                sprite: rect2
            }
        });
        Matter.World.add(this.engine.world, wall2);
    };
    Scene_021.prototype.createEnemy4 = function () {
        var rect = SpriteUtil.createRect(SpriteUtil.stageWidth - 100, SpriteUtil.stageHeight / 5, this.getSevenColor(), true);
        var wall = Matter.Bodies.rectangle(SpriteUtil.stageCenterX - 50, SpriteUtil.stageHeight / 4, rect.width, rect.height, {
            isStatic: true,
            render: {
                sprite: rect
            }
        });
        Matter.World.add(this.engine.world, wall);
        var rect1 = SpriteUtil.createRect(SpriteUtil.stageWidth - 100, SpriteUtil.stageHeight / 8, this.getSevenColor(), true);
        var wall1 = Matter.Bodies.rectangle(SpriteUtil.stageCenterX + 50, SpriteUtil.stageHeight / 2, rect1.width, rect1.height, {
            isStatic: true,
            render: {
                sprite: rect1
            }
        });
        Matter.World.add(this.engine.world, wall1);
        var rect2 = SpriteUtil.createRect(SpriteUtil.stageWidth - 100, SpriteUtil.stageHeight / 5, this.getSevenColor(), true);
        var wall2 = Matter.Bodies.rectangle(SpriteUtil.stageCenterX - 50, SpriteUtil.stageHeight * 3 / 4, rect2.width, rect2.height, {
            isStatic: true,
            render: {
                sprite: rect2
            }
        });
        Matter.World.add(this.engine.world, wall2);
    };
    Scene_021.prototype.createEnemy5 = function () {
        var rect = SpriteUtil.createRect(SpriteUtil.stageWidth / 6, SpriteUtil.stageHeight / 1.2, this.getSevenColor(), true);
        var wall = Matter.Bodies.rectangle(180, rect.height / 2, rect.width, rect.height, {
            isStatic: true,
            render: {
                sprite: rect
            }
        });
        Matter.World.add(this.engine.world, wall);
        var rect1 = SpriteUtil.createRect(SpriteUtil.stageWidth / 6, SpriteUtil.stageHeight / 1.2, this.getSevenColor(), true);
        var wall1 = Matter.Bodies.rectangle(wall.position.x + 220, SpriteUtil.stageHeight - rect1.height / 2, rect1.width, rect1.height, {
            isStatic: true,
            render: {
                sprite: rect1
            }
        });
        Matter.World.add(this.engine.world, wall1);
        var rect2 = SpriteUtil.createRect(SpriteUtil.stageWidth / 6, SpriteUtil.stageHeight / 1.2, this.getSevenColor(), true);
        var wall2 = Matter.Bodies.rectangle(wall1.position.x + 220, rect2.height / 2, rect2.width, rect2.height, {
            isStatic: true,
            render: {
                sprite: rect2
            }
        });
        Matter.World.add(this.engine.world, wall2);
    };
    Scene_021.prototype.createEnemy6 = function () {
        var tlen = SpriteUtil.stageHeight / 16;
        var recth1 = SpriteUtil.createRect(SpriteUtil.stageWidth / 1.2, tlen, this.getSevenColor(), true);
        var wallh1 = Matter.Bodies.rectangle(recth1.width / 2, 160, recth1.width, recth1.height, {
            isStatic: true,
            render: {
                sprite: recth1
            }
        });
        Matter.World.add(this.engine.world, wallh1);
        var rect1 = SpriteUtil.createRect(tlen, SpriteUtil.stageHeight / 8, this.getSevenColor(), true);
        var wall1 = Matter.Bodies.rectangle(recth1.width - rect1.width / 2, wallh1.position.y + recth1.height / 2 + rect1.height / 2, rect1.width, rect1.height, {
            isStatic: true,
            render: {
                sprite: rect1
            }
        });
        Matter.World.add(this.engine.world, wall1);
        var rect1x = SpriteUtil.createRect(tlen, SpriteUtil.stageHeight / 8, this.getSevenColor(), true);
        var wall1x = Matter.Bodies.rectangle(200, wallh1.position.y + recth1.height / 2 + rect1x.height / 2, rect1x.width, rect1x.height, {
            isStatic: true,
            render: {
                sprite: rect1x
            }
        });
        Matter.World.add(this.engine.world, wall1x);
        var recth2 = SpriteUtil.createRect(SpriteUtil.stageWidth / 1.2 + 30, tlen, this.getSevenColor(), true);
        var wallh2 = Matter.Bodies.rectangle(SpriteUtil.stageWidth - recth2.width / 2, wall1.position.y + rect1.height / 2 + 120, recth2.width, recth2.height, {
            isStatic: true,
            render: {
                sprite: recth2
            }
        });
        Matter.World.add(this.engine.world, wallh2);
        var rect2 = SpriteUtil.createRect(tlen, rect1.height, this.getSevenColor(), true);
        var wall2 = Matter.Bodies.rectangle(wall1.position.x - 180, wallh2.position.y - recth2.height / 2 - rect2.height / 2, rect2.width, rect2.height, {
            isStatic: true,
            render: {
                sprite: rect2
            }
        });
        Matter.World.add(this.engine.world, wall2);
        var rect2x = SpriteUtil.createRect(tlen, rect1.height, this.getSevenColor(), true);
        var wall2x = Matter.Bodies.rectangle(wallh2.position.x - recth2.width / 2 + rect2x.width / 2, wallh2.position.y + recth2.height / 2 + rect2x.height / 2, rect2x.width, rect2x.height, {
            isStatic: true,
            render: {
                sprite: rect2x
            }
        });
        Matter.World.add(this.engine.world, wall2x);
        var recth3 = SpriteUtil.createRect(rect1.height * 2 + 20, tlen, this.getSevenColor(), true);
        var wallh3 = Matter.Bodies.rectangle(recth3.width / 2, wall2x.position.y + rect2x.height / 2 + 120, recth3.width, recth3.height, {
            isStatic: true,
            render: {
                sprite: recth3
            }
        });
        Matter.World.add(this.engine.world, wallh3);
        var rect3x = SpriteUtil.createRect(tlen, rect1.height, this.getSevenColor(), true);
        var wall3x = Matter.Bodies.rectangle(recth3.width - rect3x.width / 2, wallh3.position.y - recth3.height / 2 - rect3x.height / 2, rect3x.width, rect3x.height, {
            isStatic: true,
            render: {
                sprite: rect3x
            }
        });
        Matter.World.add(this.engine.world, wall3x);
        var rect3y = SpriteUtil.createRect(tlen - 30, rect1.height * 2, this.getSevenColor(), true);
        var wall3y = Matter.Bodies.rectangle(wall3x.position.x + 160, wall3x.position.y + recth3.height + 50, rect3y.width, rect3y.height, {
            isStatic: true,
            render: {
                sprite: rect3y
            }
        });
        Matter.World.add(this.engine.world, wall3y);
        var rect3z = SpriteUtil.createRect(tlen - 30, rect1.height * 2.5, this.getSevenColor(), true);
        var wall3z = Matter.Bodies.rectangle(wall3y.position.x + 140, wall3x.position.y + recth3.height + 0.5 * rect1.height / 2 + 50, rect3z.width, rect3z.height, {
            isStatic: true,
            render: {
                sprite: rect3z
            }
        });
        Matter.World.add(this.engine.world, wall3z);
        var recth4 = SpriteUtil.createRect(rect1.height * 2 + 20, tlen - 30, this.getSevenColor(), true);
        var wallh4 = Matter.Bodies.rectangle(wall3y.position.x - rect3y.width / 2 - recth4.width / 2, wall3y.position.y + rect3y.height / 2 - recth4.height / 2, recth4.width, recth4.height, {
            isStatic: true,
            render: {
                sprite: recth4
            }
        });
        Matter.World.add(this.engine.world, wallh4);
        var rect4x = SpriteUtil.createRect(tlen - 30, rect1.height, this.getSevenColor(), true);
        var wall4x = Matter.Bodies.rectangle(wallh4.position.x - recth4.width / 2 + rect4x.width / 2, wallh4.position.y + recth4.height / 2 + rect4x.height / 2, rect4x.width, rect4x.height, {
            isStatic: true,
            render: {
                sprite: rect4x
            }
        });
        Matter.World.add(this.engine.world, wall4x);
        var recth5 = SpriteUtil.createRect(rect1.height * 2 + rect3z.width + 20, tlen - 30, this.getSevenColor(), true);
        var wallh5 = Matter.Bodies.rectangle(wall3z.position.x + rect3z.width / 2 - recth5.width / 2, wall3z.position.y + rect3z.height / 2 + recth5.height / 2, recth5.width, recth5.height, {
            isStatic: true,
            render: {
                sprite: recth5
            }
        });
        Matter.World.add(this.engine.world, wallh5);
        var recth6 = SpriteUtil.createRect(rect1.height * 2 + rect3z.width + 40, tlen - 40, this.getSevenColor(), true);
        var wallh6 = Matter.Bodies.rectangle(SpriteUtil.stageWidth - recth6.width / 2, wallh5.position.y + recth5.height / 2 + 100, recth6.width, recth6.height, {
            isStatic: true,
            render: {
                sprite: recth6
            }
        });
        Matter.World.add(this.engine.world, wallh6);
        Matter.Body.setPosition(this.target, { x: wallh6.position.x - recth6.width / 2 - 80, y: this.target.position.y });
    };
    Scene_021.prototype.getSevenColor = function () {
        var random = Math.floor(7 * Math.random());
        var arr = [0xFF0000, 0xFF7F00, 0xFFFF00, 0x00FF00, 0x00FFFF, 0x0000FF, 0x8B00FF];
        return arr[random];
    };
    //创建墙壁
    Scene_021.prototype.createWall = function () {
        var left = Matter.Bodies.rectangle(0, SpriteUtil.stageCenterY, 10, SpriteUtil.stageHeight, { isStatic: true });
        var right = Matter.Bodies.rectangle(SpriteUtil.stageWidth, SpriteUtil.stageCenterY, 10, SpriteUtil.stageHeight, { isStatic: true });
        var top = Matter.Bodies.rectangle(SpriteUtil.stageCenterX, 0, SpriteUtil.stageWidth, 10, { isStatic: true });
        var bottom = Matter.Bodies.rectangle(SpriteUtil.stageCenterX, SpriteUtil.stageHeight, SpriteUtil.stageWidth, 10, { isStatic: true });
        Matter.World.add(this.engine.world, [left, right, top, bottom]);
    };
    Scene_021.prototype.destroy = function () {
        this.touchEnabled = false;
        Matter.Events.off(this.engine, "collisionStart", this.collisionHandle);
        Matter.Runner.stop(this.runner);
        EgretRender.stop();
        Matter.Engine.clear(this.engine);
    };
    Scene_021.prototype.enter = function () {
        _super.prototype.enter.call(this);
        this.timeItem.start();
    };
    Scene_021.prototype.exit = function () {
        _super.prototype.exit.call(this);
        this.destroy();
    };
    return Scene_021;
}(BaseScene));
__reflect(Scene_021.prototype, "Scene_021");
//记忆力能力 首先出现一个球 然后出现第二个 以此类推
var Scene_022 = (function (_super) {
    __extends(Scene_022, _super);
    function Scene_022() {
        var _this = _super.call(this) || this;
        _this.pointsArr = [];
        _this.score = 0;
        _this.curCnt = 0;
        _this.init();
        return _this;
    }
    Scene_022.prototype.init = function () {
        //sdata 代表一次出现的数量  tdata代表目标分数
        this.sContainer = new egret.Sprite();
        this.addChild(this.sContainer);
        var rect = SpriteUtil.createRect(SpriteUtil.stageWidth, SpriteUtil.stageHeight, 0x000000);
        rect.x = SpriteUtil.stageCenterX;
        rect.y = SpriteUtil.stageCenterY;
        this.addChild(rect);
        rect.alpha = 0;
        this.blackBg = rect;
        this.scoreItem = new ScoreItem();
        this.scoreItem.setSTScore(this.score, this.dataVo.tData);
        this.addChild(this.scoreItem);
        this.timeItem = new TimeItem(this.dataVo.time);
        this.timeItem.x = SpriteUtil.stageWidth - 300;
        this.addChild(this.timeItem);
        var h = Math.floor(SpriteUtil.stageWidth - 100) / 100;
        var v = Math.floor(SpriteUtil.stageHeight - 480) / 100;
        for (var i = 0; i < h * v; i++) {
            var point = new egret.Point(50 + (i % h) * 100, 180 + Math.floor(i / h) * 100);
            this.pointsArr.push(point);
        }
        this.next();
    };
    Scene_022.prototype.next = function () {
        var _this = this;
        egret.Tween.get(this.blackBg).to({ alpha: 1 }, 250).call(function () {
            _this.nextHandler();
            egret.Tween.get(_this.blackBg).to({ alpha: 0 }, 250).call(function () {
                egret.Tween.removeTweens(_this.blackBg);
            });
        });
    };
    Scene_022.prototype.nextHandler = function () {
        var len = this.dataVo.sData;
        for (var i = 0; i < len; i++) {
            this.createShape();
        }
    };
    Scene_022.prototype.createShape = function () {
        var num = Math.floor(3 * Math.random());
        var shape;
        var w = 30 + 20 * Math.random();
        if (this.dataVo.level == 5) {
            num = 1;
        }
        else if (this.dataVo.level == 6) {
            num = 0;
        }
        else if (this.dataVo.level >= 3) {
            num = Math.floor(2 * Math.random());
        }
        if (num == 0) {
            shape = SpriteUtil.createCircle(w, this.getSevenColor());
        }
        else if (num == 1) {
            shape = SpriteUtil.createRect(w * 2, w * 2, this.getSevenColor());
        }
        else if (num == 2) {
            shape = SpriteUtil.createPolygon([0, 0, w, w, w, -w], this.getSevenColor());
        }
        shape.rotation = 360 * Math.random();
        var index = Math.floor(this.pointsArr.length * Math.random());
        var point = this.pointsArr.splice(index, 1)[0];
        shape.x = point.x;
        shape.y = point.y;
        this.sContainer.addChild(shape);
        shape.name = "target";
        shape.touchEnabled = true;
        shape.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandler, this);
    };
    Scene_022.prototype.touchHandler = function (e) {
        if (this.timeItem.leftTime <= 0)
            return;
        GameSound.instance().playSound("click");
        var target = e.target;
        if (target.name == "target") {
            target.name = "passed";
            this.score++;
            this.scoreItem.setSTScore(this.score);
            if (this.score >= this.dataVo.tData) {
                var time = this.timeItem.leftTime;
                this.timeItem.stop();
                if (time >= this.dataVo.time * 2 / 3) {
                    EffectUtil.showResultEffect(EffectUtil.PERFECT);
                }
                else if (time >= this.dataVo.time / 3) {
                    EffectUtil.showResultEffect(EffectUtil.GREAT);
                }
                else {
                    EffectUtil.showResultEffect(EffectUtil.GOOD);
                }
            }
            else {
                this.curCnt++;
                if (this.curCnt >= this.dataVo.sData) {
                    this.curCnt = 0;
                    this.next();
                }
            }
        }
        else if (target.name == "passed") {
            this.timeItem.stop();
            EffectUtil.showResultEffect();
        }
    };
    Scene_022.prototype.getSevenColor = function () {
        var random = 0;
        var arr = [0xFF0000, 0xFF7F00, 0xFFFF00, 0x0000FF, 0x8B00FF, 0xFF00FF, 0xEED2EE];
        if (this.dataVo.level == 1) {
            random = Math.floor(7 * Math.random());
        }
        else if (this.dataVo.level == 2) {
            random = Math.floor(5 * Math.random());
        }
        else if (this.dataVo.level == 3) {
            random = Math.floor(3 * Math.random());
        }
        else if (this.dataVo.level == 4) {
            random = 5;
        }
        else if (this.dataVo.level == 5) {
            random = 6;
        }
        return arr[random];
    };
    Scene_022.prototype.enter = function () {
        _super.prototype.enter.call(this);
        this.timeItem.start();
    };
    return Scene_022;
}(BaseScene));
__reflect(Scene_022.prototype, "Scene_022");
//方向敏感度测试 依次出现不同方向的形状 来判断方向
var Scene_023 = (function (_super) {
    __extends(Scene_023, _super);
    function Scene_023() {
        var _this = _super.call(this) || this;
        _this.pools = [];
        _this.deaths = [];
        _this.score = 0;
        _this.isCanOperate = true;
        _this.init();
        return _this;
    }
    Scene_023.prototype.init = function () {
        var up = this.createDirBtn("up");
        var down = this.createDirBtn("down");
        var left = this.createDirBtn("left");
        var right = this.createDirBtn("right");
        up.x = SpriteUtil.stageCenterX;
        up.y = SpriteUtil.stageHeight - up.height * 2.5 - 300;
        down.x = up.x;
        down.y = SpriteUtil.stageHeight - down.height / 2 - 300;
        left.x = SpriteUtil.stageCenterX - left.height;
        left.y = SpriteUtil.stageHeight - left.height * 1.5 - 300;
        right.x = SpriteUtil.stageCenterX + left.height;
        right.y = left.y;
        var bg = SpriteUtil.createImage('together');
        bg.x = SpriteUtil.stageCenterX;
        bg.y = SpriteUtil.stageHeight - left.height * 1.5 - 300;
        bg.scaleX = 1.8;
        bg.scaleY = 1.8;
        bg.alpha = 0.8;
        this.addChild(bg);
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
        this.timeItem.x = SpriteUtil.stageWidth - 300;
        this.scoreItem = new ScoreItem();
        this.addChild(this.scoreItem);
        this.scoreItem.setSTScore(this.score, this.dataVo.tData);
        // this.flyDirection();
        egret.startTick(this.loop, this);
    };
    Scene_023.prototype.loop = function () {
        for (var _i = 0, _a = this.pools; _i < _a.length; _i++) {
            var spr = _a[_i];
            spr.x += this.dataVo.sData;
            if (spr.x > SpriteUtil.stageWidth) {
                egret.stopTick(this.loop, this);
                this.timeItem.stop();
                this.isCanOperate = false;
                EffectUtil.showResultEffect();
                break;
            }
        }
        if (this.pools.length > 0) {
            var lastspr = this.pools[this.pools.length - 1];
            if (lastspr.x >= lastspr.width * 2) {
                this.flyDirection();
            }
        }
        else {
            this.flyDirection();
        }
        return true;
    };
    Scene_023.prototype.flyDirection = function () {
        var fly = this.getPools();
    };
    Scene_023.prototype.getPools = function () {
        var obj = this.getRandomDir();
        if (this.deaths.length > 0) {
            var sprite = this.deaths.shift();
            sprite.rotation = obj.rotation;
            sprite.name = obj.name;
            sprite.x = -sprite.width / 2;
            sprite.visible = true;
            this.pools.push(sprite);
            return sprite;
        }
        var fly = SpriteUtil.createImage("left");
        fly.scaleX = 1.8;
        fly.scaleY = 1.8;
        fly.rotation = obj.rotation;
        fly.name = obj.name;
        fly.y = SpriteUtil.stageCenterY - 200;
        fly.x = -fly.width / 2;
        this.addChild(fly);
        fly.visible = true;
        this.pools.push(fly);
        return fly;
    };
    Scene_023.prototype.getRandomDir = function () {
        var rd = Math.floor(4 * Math.random());
        if (rd == 0) {
            return { rotation: 0, name: "left" };
        }
        else if (rd == 1) {
            return { rotation: 90, name: "up" };
        }
        else if (rd == 2) {
            return { rotation: 180, name: "right" };
        }
        return { rotation: -90, name: "down" };
    };
    Scene_023.prototype.touchHandler = function (evt) {
        if (!this.isCanOperate)
            return;
        GameSound.instance().playSound('click');
        var name = evt.target.name;
        var nowSpr = this.pools.shift();
        if (name == nowSpr.name) {
            this.deaths.push(nowSpr);
            nowSpr.visible = false;
            this.score++;
            this.scoreItem.setSTScore(this.score);
            if (this.score >= this.dataVo.tData) {
                egret.stopTick(this.loop, this);
                this.isCanOperate = false;
                var time = this.timeItem.leftTime;
                this.timeItem.stop();
                if (time >= this.dataVo.time * 2 / 3) {
                    EffectUtil.showResultEffect(EffectUtil.PERFECT);
                }
                else if (time >= this.dataVo.time / 3) {
                    EffectUtil.showResultEffect(EffectUtil.GREAT);
                }
                else {
                    EffectUtil.showResultEffect(EffectUtil.GOOD);
                }
            }
        }
        else {
            this.isCanOperate = false;
            egret.stopTick(this.loop, this);
            EffectUtil.showResultEffect();
        }
    };
    Scene_023.prototype.createDirBtn = function (name) {
        if (name === void 0) { name = ""; }
        var direction = SpriteUtil.createImage('circle');
        direction.scaleX = 1.8;
        direction.scaleY = 1.8;
        direction.touchEnabled = false;
        var text = new egret.TextField();
        text.size = 80;
        text.bold = true;
        text.textColor = 0xffffff;
        text.stroke = 1;
        text.strokeColor = 0x0000ff;
        if (name == "up") {
            text.text = "上";
        }
        else if (name == "down") {
            text.text = "下";
        }
        else if (name == "left") {
            text.text = "左";
        }
        else if (name == "right") {
            text.text = "右";
        }
        text.anchorOffsetX = text.width / 2;
        text.anchorOffsetY = text.height / 2;
        var sprite = new egret.Sprite();
        sprite.addChild(direction);
        sprite.addChild(text);
        this.addChild(sprite);
        sprite.touchEnabled = true;
        sprite.name = name;
        sprite.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandler, this);
        return sprite;
    };
    Scene_023.prototype.enter = function () {
        _super.prototype.enter.call(this);
        this.timeItem.start();
    };
    return Scene_023;
}(BaseScene));
__reflect(Scene_023.prototype, "Scene_023");
//一心二用  两个方块
var Scene_024 = (function (_super) {
    __extends(Scene_024, _super);
    function Scene_024() {
        var _this = _super.call(this) || this;
        _this.startPt = null;
        _this.pools = [];
        _this.score = 0;
        _this.intervalId = 0;
        _this.init();
        return _this;
    }
    Scene_024.prototype.init = function () {
        var bg = SpriteUtil.createRect(SpriteUtil.stageWidth, SpriteUtil.stageHeight, 0xffffff);
        bg.alpha = 0.01;
        bg.anchorOffsetX = 0;
        bg.anchorOffsetY = 0;
        this.addChild(bg);
        this.engine = Matter.Engine.create({ enableSleeping: false }, null);
        this.runner = Matter.Runner.create(null);
        this.runner.isFixed = true;
        this.render = EgretRender.create({
            engine: this.engine,
            container: this,
            options: {
                width: SpriteUtil.stageWidth,
                height: SpriteUtil.stageHeight,
                wireframes: true
            }
        });
        Matter.Runner.run(this.runner, this.engine);
        EgretRender.run(this.render);
        this.engine.world.gravity.y = 0;
        var img1 = SpriteUtil.createImage('basketball');
        var ply1 = Matter.Bodies.circle(SpriteUtil.stageCenterX - 100, SpriteUtil.stageCenterY, img1.width / 2, {
            label: "player",
            collisionFilter: {
                category: 0x0002,
                mask: 0x0002 | 0x0008
            },
            render: {
                sprite: img1
            }
        }, 0);
        var img2 = SpriteUtil.createImage('football');
        var ply2 = Matter.Bodies.circle(SpriteUtil.stageCenterX + 100, SpriteUtil.stageCenterY, img2.width / 2, {
            label: "player",
            collisionFilter: {
                category: 0x0004,
                mask: 0x0004 | 0x0008
            },
            render: {
                sprite: img2
            }
        }, 0);
        Matter.World.add(this.engine.world, [ply1, ply2]);
        this.player1 = ply1;
        this.player2 = ply2;
        Matter.Events.on(this.engine, "collisionStart", this.collision.bind(this));
        this.scoreItem = new ScoreItem();
        this.addChild(this.scoreItem);
        this.scoreItem.setSTScore(this.score, this.dataVo.tData);
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchHandler, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.touchHandler, this);
        this.next();
    };
    Scene_024.prototype.next = function () {
        var _this = this;
        this.intervalId = egret.setInterval(function () {
            for (var i = 0; i < _this.dataVo.sData.length; i++) {
                _this.getPools(_this.dataVo.sData[i]);
            }
        }, this, this.dataVo.time);
    };
    Scene_024.prototype.getPools = function (type) {
        var isNeed = false;
        var xx = 0;
        var yy = 0;
        var velocity = { x: 0, y: 0 };
        var speed = 1 + Math.floor(3 * Math.random());
        if (type == 1) {
            xx = 40 + (SpriteUtil.stageWidth - 80) * Math.random();
            yy = -64;
            velocity.y = speed;
        }
        else if (type == 2) {
            xx = 40 + (SpriteUtil.stageWidth - 80) * Math.random();
            yy = SpriteUtil.stageHeight + 64;
            velocity.y = -speed;
        }
        else if (type == 3) {
            xx = -64;
            yy = 40 + (SpriteUtil.stageHeight - 80) * Math.random();
            velocity.x = speed;
        }
        else if (type == 4) {
            xx = SpriteUtil.stageWidth + 64;
            yy = 40 + (SpriteUtil.stageHeight - 80) * Math.random();
            velocity.x = -speed;
        }
        for (var _i = 0, _a = this.pools; _i < _a.length; _i++) {
            var body = _a[_i];
            var judgeBool = false;
            if (body.velocity.x > 0) {
                if (body.position.x >= SpriteUtil.stageWidth + body.render.sprite.width) {
                    judgeBool = true;
                }
            }
            else if (body.velocity.x < 0) {
                if (body.position.x <= -body.render.sprite.width) {
                    judgeBool = true;
                }
            }
            else if (body.velocity.y > 0) {
                if (body.position.y >= SpriteUtil.stageHeight + body.render.sprite.width) {
                    judgeBool = true;
                }
            }
            else if (body.velocity.y < 0) {
                if (body.position.y <= -body.render.sprite.width) {
                    judgeBool = true;
                }
            }
            //
            if (judgeBool) {
                this.score++;
                this.scoreItem.setSTScore(this.score);
                if (this.score >= this.dataVo.tData) {
                    this.destroy();
                    EffectUtil.showResultEffect(EffectUtil.PERFECT);
                    return null;
                }
                Matter.Body.setPosition(body, { x: xx, y: yy });
                isNeed = true;
            }
        }
        if (isNeed)
            return null;
        var sprite = SpriteUtil.createImage(CommonUtil.allEmoji[Math.floor(20 * Math.random())]);
        var enemy = Matter.Bodies.circle(xx, yy, sprite.width / 2, {
            frictionAir: 0,
            friction: 0,
            label: "enemy",
            collisionFilter: {
                category: 0x0008,
                mask: 0x0002 | 0x0004
            },
            render: {
                sprite: sprite
            }
        }, 0);
        Matter.World.add(this.engine.world, enemy);
        Matter.Body.setVelocity(enemy, velocity);
        this.pools.push(enemy);
        return enemy;
    };
    Scene_024.prototype.collision = function (evt) {
        var pairs = evt.pairs;
        for (var _i = 0, pairs_6 = pairs; _i < pairs_6.length; _i++) {
            var pair = pairs_6[_i];
            if (pair.bodyA.label == "player" || pair.bodyB.label == "player") {
                this.destroy();
                EffectUtil.showResultEffect();
            }
        }
    };
    Scene_024.prototype.touchHandler = function (evt) {
        if (evt.type == egret.TouchEvent.TOUCH_BEGIN) {
            this.startPt = new egret.Point(evt["stageX"], evt["stageY"]);
            this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchHandler, this);
        }
        else if (evt.type == egret.TouchEvent.TOUCH_MOVE) {
            if (this.startPt == null) {
                this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchHandler, this);
                return;
            }
            var nowPt = new egret.Point(evt["stageX"], evt["stageY"]);
            this.movePlayer(this.startPt, nowPt);
            this.startPt = nowPt;
        }
        else if (evt.type == egret.TouchEvent.TOUCH_END) {
            this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchHandler, this);
            this.startPt = null;
        }
    };
    Scene_024.prototype.movePlayer = function (start, end) {
        var xx = start.x - end.x;
        var yy = start.y - end.y;
        var x1 = this.player1.position.x + xx;
        var y1 = this.player1.position.y + yy;
        var x2 = this.player2.position.x - xx;
        var y2 = this.player2.position.y - yy;
        if (x1 < this.player1.render.sprite.width / 2) {
            x1 = this.player1.render.sprite.width / 2;
        }
        else if (x1 > SpriteUtil.stageWidth - this.player1.render.sprite.width / 2) {
            x1 = SpriteUtil.stageWidth - this.player1.render.sprite.width / 2;
        }
        if (y1 < this.player1.render.sprite.width / 2) {
            y1 = this.player1.render.sprite.width / 2;
        }
        else if (y1 > SpriteUtil.stageHeight - this.player1.render.sprite.width / 2) {
            y1 = SpriteUtil.stageHeight - this.player1.render.sprite.width / 2;
        }
        //
        if (x2 < this.player2.render.sprite.width / 2) {
            x2 = this.player2.render.sprite.width / 2;
        }
        else if (x2 > SpriteUtil.stageWidth - this.player2.render.sprite.width / 2) {
            x2 = SpriteUtil.stageWidth - this.player2.render.sprite.width / 2;
        }
        if (y2 < this.player2.render.sprite.width / 2) {
            y2 = this.player2.render.sprite.width / 2;
        }
        else if (y2 > SpriteUtil.stageHeight - this.player2.render.sprite.width / 2) {
            y2 = SpriteUtil.stageHeight - this.player2.render.sprite.width / 2;
        }
        Matter.Body.setPosition(this.player1, { x: x1, y: y1 });
        Matter.Body.setPosition(this.player2, { x: x2, y: y2 });
    };
    Scene_024.prototype.destroy = function () {
        egret.clearInterval(this.intervalId);
        Matter.Runner.stop(this.runner);
        EgretRender.stop();
        Matter.Engine.clear(this.engine);
        Matter.Events.off(this.engine, "collisionStart", this.collision);
    };
    return Scene_024;
}(BaseScene));
__reflect(Scene_024.prototype, "Scene_024");
//匀摇
var Scene_025 = (function (_super) {
    __extends(Scene_025, _super);
    function Scene_025() {
        var _this = _super.call(this) || this;
        _this.stonesArr = [];
        _this.housesArr = [];
        _this.curIndex = 0;
        _this.curCount = 0;
        _this.isCanOperate = true;
        _this.randomArr = [];
        _this.init();
        return _this;
    }
    Scene_025.prototype.init = function () {
        this.createJoyHouse();
        this.handSpr = SpriteUtil.createImage("paper");
        this.handSpr.visible = false;
        this.handSpr.scaleX = 2;
        this.handSpr.scaleY = 2;
        this.addChild(this.handSpr);
        this.next();
        this.eatText = SpriteUtil.createText("吃", 128);
        this.addChild(this.eatText);
        this.eatText.visible = false;
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
    };
    Scene_025.prototype.next = function () {
        return __awaiter(this, void 0, void 0, function () {
            var len, img, house, point, text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.curCount <= 0) {
                            this.checkResult();
                            this.isCanOperate = true;
                            return [2 /*return*/];
                        }
                        this.curIndex++;
                        len = this.housesArr.length;
                        if (this.curIndex >= len) {
                            this.curIndex = 0;
                        }
                        img = this.getPools();
                        house = this.housesArr[this.curIndex];
                        point = house.sprite.parent.localToGlobal(house.sprite.x, house.sprite.y);
                        this.handSpr["texture"] = RES.getRes("point_png");
                        this.handSpr.visible = true;
                        this.handSpr.rotation = 0;
                        this.handSpr.x = point.x;
                        this.handSpr.y = point.y;
                        return [4 /*yield*/, this.timeOutEff(500)];
                    case 1:
                        _a.sent();
                        house.sprite.addChild(img);
                        house.count++;
                        text = house.sprite.getChildAt(0);
                        text.text = house.count;
                        text.anchorOffsetX = text.width / 2;
                        this.curCount--;
                        this.handSpr.visible = false;
                        this.next();
                        return [2 /*return*/];
                }
            });
        });
    };
    Scene_025.prototype.checkResult = function () {
        var _this = this;
        var len = this.housesArr.length;
        if (this.curIndex >= len) {
            this.curIndex = 0;
        }
        var arr = [];
        for (var i = this.curIndex;; i += 2) {
            var n1 = i + 1;
            var n2 = i + 2;
            n1 = n1 % len;
            n2 = n2 % len;
            var house1 = this.housesArr[n1];
            var house2 = this.housesArr[n2];
            if (house1.count == 0 && house2.count > 0) {
                arr.push(n2);
                if (n2 == this.curIndex) {
                    break;
                }
            }
            else {
                break;
            }
        }
        if (arr.length == 0) {
            this.isCanOperate = true;
            return;
        }
        var index = 0;
        var xfun = function () {
            var house = _this.housesArr[arr[index]];
            var point = house.sprite.parent.localToGlobal(house.sprite.x, house.sprite.y);
            _this.eatText.x = point.x;
            _this.eatText.y = point.y;
            _this.eatText.visible = true;
            var idx = egret.setTimeout(function () {
                egret.clearTimeout(idx);
                _this.eatText.visible = false;
                while (house.sprite.numChildren > 1) {
                    house.sprite.removeChildAt(house.sprite.numChildren - 1);
                }
                house.count = 0;
                var text = house.sprite.getChildAt(0);
                text.text = house.count;
                text.anchorOffsetX = text.width / 2;
                index++;
                if (_this.timeItem.leftTime < 0)
                    return;
                if (index >= arr.length) {
                    if (_this.isCanPass()) {
                        _this.timeItem.stop();
                        EffectUtil.showResultEffect(EffectUtil.PERFECT);
                        return;
                    }
                    if (_this.isFail()) {
                        _this.timeItem.stop();
                        EffectUtil.showResultEffect();
                        return;
                    }
                    _this.isCanOperate = true;
                    return;
                }
                xfun();
            }, _this, 800);
        };
        xfun();
    };
    Scene_025.prototype.isCanPass = function () {
        for (var _i = 0, _a = this.housesArr; _i < _a.length; _i++) {
            var house = _a[_i];
            if (house.count != 0)
                return false;
        }
        return true;
    };
    Scene_025.prototype.isFail = function () {
        var cnt = 0;
        for (var _i = 0, _a = this.housesArr; _i < _a.length; _i++) {
            var house = _a[_i];
            cnt += house.count;
        }
        if (cnt < this.dataVo.sData.length / 2) {
            return true;
        }
        return false;
    };
    Scene_025.prototype.getPools = function () {
        var xx = -40 + 80 * Math.random();
        var yy = -40 + 80 * Math.random();
        var rotation = 180 * Math.random();
        for (var _i = 0, _a = this.stonesArr; _i < _a.length; _i++) {
            var img_1 = _a[_i];
            if (!img_1.visible || img_1.parent == null) {
                img_1.visible = true;
                img_1.x = xx;
                img_1.y = yy;
                img_1.rotation = rotation;
                return img_1;
            }
        }
        var img = SpriteUtil.createImage('stone');
        img.scaleX = 0.4;
        img.scaleY = 0.4;
        img.x = xx;
        img.y = yy;
        img.rotation = rotation;
        img.touchEnabled = false;
        this.stonesArr.push(img);
        return img;
    };
    Scene_025.prototype.createJoyHouse = function () {
        var sprite = new egret.Sprite();
        var rotation = 0;
        if (this.dataVo.level == 3) {
            rotation = Math.random() > 0.5 ? -90 : 90;
        }
        else if (this.dataVo.level == 5) {
            rotation = Math.random() > 0.5 ? 45 : -45;
        }
        var len = this.dataVo.sData.length;
        for (var i = 0; i < len; i++) {
            var spr = new egret.Sprite();
            spr.graphics.beginFill(0x000000, 0.01);
            spr.graphics.lineStyle(5, 0x000000);
            spr.graphics.drawCircle(0, 0, 60);
            spr.graphics.endFill();
            sprite.addChild(spr);
            var point = this.getPoint(i, spr.width);
            spr.x = point.x;
            spr.y = point.y;
            spr.touchEnabled = true;
            spr.name = 'house_' + i;
            var text = SpriteUtil.createText(this.dataVo.sData[i], 100);
            text.alpha = 0.5;
            spr.addChild(text);
            text.rotation = -rotation;
            spr.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandler, this);
            for (var a = 0; a < this.dataVo.sData[i]; a++) {
                var img = this.getPools();
                spr.addChild(img);
            }
            this.housesArr.push({ sprite: spr, count: this.dataVo.sData[i] });
        }
        this.addChild(sprite);
        sprite.anchorOffsetX = sprite.width / 2;
        sprite.anchorOffsetY = sprite.height / 2;
        sprite.rotation = rotation;
        sprite.x = SpriteUtil.stageCenterX;
        sprite.y = SpriteUtil.stageCenterY;
    };
    //布局模式
    Scene_025.prototype.getPoint = function (index, width) {
        var cols = 4;
        var temp = 0;
        var xx = 0;
        var yy = 0;
        if (this.dataVo.level == 4) {
            cols = 3;
        }
        if (this.dataVo.level == 6) {
            if (index <= 12) {
                var x0 = 2 * (width + 10), y0 = 2 * (width + 10);
                var x1 = 0, y1 = 2 * (width + 10);
                var angle = 2 * index * Math.asin((width / 2 + 2.5) / (2 * width + 20));
                xx = width / 2 + (x1 - x0) * Math.cos(angle) - (y1 - y0) * Math.sin(angle) + x0;
                yy = width / 2 + (y1 - y0) * Math.cos(angle) + (x1 - x0) * Math.sin(angle) + y0;
            }
            else {
                index = index - 12;
                temp = 4 - index % cols;
                xx = width / 2 + temp * (width + 10);
                yy = width / 2 + 2 * width + 20 + Math.floor(index / cols) * (width + 10);
            }
        }
        else if (this.dataVo.level == 7 || this.dataVo.level == 8) {
            //随机
            if (this.randomArr.length == 0) {
                var arr = [];
                for (var i = 0; i < 24; i++) {
                    arr.push({ x: (i % 4) * (width + 10), y: Math.floor(i / 4) * (width + 10) });
                }
                this.randomArr = arr;
            }
            var pt = this.randomArr.splice(Math.floor(this.randomArr.length * Math.random()), 1);
            xx = width / 2 + pt[0].x;
            yy = width / 2 + pt[0].y;
        }
        else {
            temp = Math.floor(index / cols) % 2 == 0 ? index % cols : 3 - index % cols;
            xx = width / 2 + temp * (width + 10);
            yy = width / 2 + Math.floor(index / cols) * (width + 10);
        }
        return new egret.Point(xx, yy);
    };
    Scene_025.prototype.touchHandler = function (evt) {
        if (!this.isCanOperate || this.timeItem.leftTime <= 0)
            return;
        this.curIndex = evt.target.name.split("_")[1];
        this.isCanOperate = false;
        this.playGetAnim().catch(function (err) {
            // console.log(err);
        });
    };
    Scene_025.prototype.playGetAnim = function () {
        return __awaiter(this, void 0, void 0, function () {
            var house, point, text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        house = this.housesArr[this.curIndex];
                        if (house.count == 0) {
                            this.isCanOperate = true;
                            return [2 /*return*/];
                        }
                        point = house.sprite.parent.localToGlobal(house.sprite.x, house.sprite.y);
                        this.handSpr["texture"] = RES.getRes("paper_png");
                        this.handSpr.visible = true;
                        this.handSpr.rotation = -60;
                        this.handSpr.x = point.x;
                        this.handSpr.y = point.y;
                        return [4 /*yield*/, this.timeOutEff()];
                    case 1:
                        _a.sent();
                        this.handSpr["texture"] = RES.getRes("rock_png");
                        if (this.timeItem.leftTime < 0)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.timeOutEff()];
                    case 2:
                        _a.sent();
                        this.handSpr.visible = false;
                        while (house.sprite.numChildren > 1) {
                            house.sprite.removeChildAt(house.sprite.numChildren - 1);
                        }
                        this.curCount = house.count;
                        house.count = 0;
                        text = house.sprite.getChildAt(0);
                        text.text = house.count;
                        text.anchorOffsetX = text.width / 2;
                        if (this.timeItem.leftTime < 0)
                            return [2 /*return*/];
                        this.next();
                        return [2 /*return*/];
                }
            });
        });
    };
    Scene_025.prototype.timeOutEff = function (time) {
        var _this = this;
        if (time === void 0) { time = 200; }
        var p = new Promise(function (resolve, reject) {
            var idx = egret.setTimeout(function () {
                egret.clearTimeout(idx);
                resolve();
            }, _this, time);
        });
        return p;
    };
    Scene_025.prototype.enter = function () {
        _super.prototype.enter.call(this);
        this.timeItem.start();
    };
    return Scene_025;
}(BaseScene));
__reflect(Scene_025.prototype, "Scene_025");
//九宫格解锁
var Scene_026 = (function (_super) {
    __extends(Scene_026, _super);
    function Scene_026() {
        var _this = _super.call(this) || this;
        _this.pointsArr = [];
        _this.passedArr = [];
        _this.isCanOperate = true;
        _this.init();
        return _this;
    }
    Scene_026.prototype.init = function () {
        var bg = SpriteUtil.createRect(SpriteUtil.stageWidth, SpriteUtil.stageHeight, 0xffffff);
        bg.alpha = 0.01;
        bg.anchorOffsetX = 0;
        bg.anchorOffsetY = 0;
        bg.touchEnabled = true;
        this.addChild(bg);
        this.createJoyHouse();
        this.lineShape = new egret.Shape();
        this.addChild(this.lineShape);
        var text = new egret.TextField();
        text.textColor = 0x0000ff;
        text.size = 36;
        text.text = this.dataVo.extData;
        text.x = SpriteUtil.stageCenterX - text.width / 2;
        text.y = 160;
        this.addChild(text);
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchHandler, this);
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchHandler, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.touchHandler, this);
    };
    Scene_026.prototype.createJoyHouse = function () {
        var sprite = new egret.Sprite();
        var len = this.dataVo.sData;
        var cols = Math.floor(Math.sqrt(len));
        for (var i = 0; i < len; i++) {
            var spr = new egret.Sprite();
            spr.graphics.beginFill(0x000000, 0.01);
            spr.graphics.lineStyle(5, 0x000000);
            spr.graphics.drawCircle(0, 0, 60);
            spr.graphics.endFill();
            spr.graphics.beginFill(0x0000ff);
            spr.graphics.drawCircle(0, 0, 10);
            spr.graphics.endFill();
            sprite.addChild(spr);
            spr.x = spr.width / 2 + i % cols * (60 * 2 + 40);
            spr.y = spr.width / 2 + Math.floor(i / cols) * (60 * 2 + 40);
            spr.touchEnabled = true;
            spr.name = 'house_' + i;
        }
        this.addChild(sprite);
        sprite.anchorOffsetX = sprite.width / 2;
        sprite.anchorOffsetY = sprite.height / 2;
        sprite.x = SpriteUtil.stageCenterX;
        sprite.y = SpriteUtil.stageCenterY;
    };
    Scene_026.prototype.checkResult = function () {
        var len1 = this.dataVo.tData.length;
        var len2 = this.pointsArr.length;
        if (len1 != len2)
            return false;
        for (var i = 0; i < len1; i++) {
            if (this.dataVo.tData[i] != this.passedArr[i])
                return false;
        }
        return true;
    };
    Scene_026.prototype.touchHandler = function (evt) {
        if (!this.isCanOperate || this.timeItem.leftTime <= 0)
            return;
        var target = evt.target;
        var name = target.name;
        var type = evt.type;
        var px = evt["stageX"];
        var py = evt["stageY"];
        if (type == egret.TouchEvent.TOUCH_BEGIN) {
            if (name.search("house") < 0)
                return;
            this.passedArr.push(name.split("_")[1]);
            this.pointsArr.push(target.parent.localToGlobal(target.x, target.y));
        }
        else if (type == egret.TouchEvent.TOUCH_MOVE) {
            if (this.passedArr.length == 0)
                return;
            this.handleMove({ x: px, y: py });
            if (name.search("house") >= 0 && this.passedArr.indexOf(name.split("_")[1]) < 0) {
                this.pointsArr.push(target.parent.localToGlobal(target.x, target.y));
                this.passedArr.push(name.split("_")[1]);
            }
        }
        else if (type == egret.TouchEvent.TOUCH_END) {
            this.handleMove(null);
        }
    };
    Scene_026.prototype.handleMove = function (point) {
        var _this = this;
        var len = this.pointsArr.length;
        if (len <= 0)
            return;
        if (point == null) {
            if (this.checkResult()) {
                this.drawPath(null, 0xFFA500);
                this.isCanOperate = false;
                var time = this.timeItem.leftTime;
                this.timeItem.stop();
                if (time >= this.dataVo.time * 2 / 3) {
                    EffectUtil.showResultEffect(EffectUtil.PERFECT);
                }
                else if (time >= this.dataVo.time / 3) {
                    EffectUtil.showResultEffect(EffectUtil.GREAT);
                }
                else {
                    EffectUtil.showResultEffect(EffectUtil.GOOD);
                }
            }
            else {
                this.isCanOperate = false;
                this.drawPath(null, 0xff0000);
                egret.Tween.get(this.lineShape).to({ alpha: 0.5 }, 300).to({ alpha: 1 }, 300).to({ alpha: 0.5 }, 300).call(function () {
                    egret.Tween.removeTweens(_this.lineShape);
                    _this.lineShape.graphics.clear();
                    _this.lineShape.alpha = 1;
                    _this.pointsArr = [];
                    _this.passedArr = [];
                    _this.isCanOperate = true;
                }, this);
            }
        }
        else {
            this.drawPath(point, 0x0000ff);
        }
    };
    Scene_026.prototype.drawPath = function (point, color) {
        var len = this.pointsArr.length;
        var pt = this.pointsArr[0];
        this.lineShape.graphics.clear();
        this.lineShape.graphics.lineStyle(36, color, 0.8);
        this.lineShape.graphics.beginFill(color, 0.01);
        this.lineShape.graphics.moveTo(pt.x, pt.y);
        for (var i = 1; i < len; i++) {
            this.lineShape.graphics.lineTo(this.pointsArr[i].x, this.pointsArr[i].y);
        }
        if (point) {
            this.lineShape.graphics.lineTo(point.x, point.y);
        }
        this.lineShape.graphics.endFill();
    };
    Scene_026.prototype.enter = function () {
        _super.prototype.enter.call(this);
        this.timeItem.start();
    };
    return Scene_026;
}(BaseScene));
__reflect(Scene_026.prototype, "Scene_026");
//横向踩白块
var Scene_027 = (function (_super) {
    __extends(Scene_027, _super);
    function Scene_027() {
        var _this = _super.call(this) || this;
        _this.pools1 = [];
        _this.pools2 = [];
        _this.isCanOperate = true;
        _this.count = 0;
        _this.init();
        return _this;
    }
    Scene_027.prototype.init = function () {
        //sdata 总数  tdata 最大可遗漏的数  extData.direction 方向 分两个sprite  左上 和 右下
        this.direction = this.dataVo.extData.direction;
        if (this.direction[0] != 0 && this.direction[1] != 0) {
            this.createJustRect(this.dataVo.sData / 2);
            this.createOppRect(this.dataVo.sData / 2);
        }
        else if (this.direction[0] != 0) {
            this.createJustRect(this.dataVo.sData);
        }
        else if (this.direction[1] != 0) {
            this.createOppRect(this.dataVo.sData);
        }
        this.scoreItem = new ScoreItem();
        this.scoreItem.setSTLose(0, this.dataVo.tData);
        this.addChild(this.scoreItem);
        egret.startTick(this.loop, this);
    };
    Scene_027.prototype.loop = function () {
        if (this.direction[0] == 1) {
            this.container1.x += 5;
        }
        else if (this.direction[0] == 2) {
            this.container1.y += 5;
        }
        if (this.direction[1] == 3) {
            this.container2.x -= 5;
        }
        else if (this.direction[1] == 4) {
            this.container2.y -= 5;
        }
        if (this.handleContainer())
            return;
        this.checkResult();
        return false;
    };
    Scene_027.prototype.handleContainer = function () {
        for (var _i = 0, _a = this.pools1; _i < _a.length; _i++) {
            var spr = _a[_i];
            if (this.isMiss(spr, this.direction[0])) {
                var index = spr.name.split("_")[1];
                this.pools1.splice(parseInt(index), 1);
                this.container1.removeChild(spr);
                spr.name = "";
                spr.touchEnabled = false;
                spr.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandler);
                this.count++;
                this.scoreItem.setSTLose(this.count);
                if (this.count >= this.dataVo.tData) {
                    this.isCanOperate = false;
                    egret.stopTick(this.loop, this);
                    EffectUtil.showResultEffect();
                    return true;
                }
            }
        }
        for (var _b = 0, _c = this.pools2; _b < _c.length; _b++) {
            var spr = _c[_b];
            if (this.isMiss(spr, this.direction[1])) {
                var index = spr.name.split("_")[1];
                this.pools2.splice(parseInt(index), 1);
                this.container2.removeChild(spr);
                spr.name = "";
                spr.touchEnabled = false;
                spr.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandler);
                this.count++;
                this.scoreItem.setSTLose(this.count);
                if (this.count >= this.dataVo.tData) {
                    this.isCanOperate = false;
                    egret.stopTick(this.loop, this);
                    EffectUtil.showResultEffect();
                    return true;
                }
            }
        }
        return false;
    };
    //正面的
    Scene_027.prototype.createJustRect = function (total) {
        this.container1 = new egret.Sprite();
        for (var i = 0; i < total; i++) {
            var ptd = this.getPoint(i, this.direction[0]);
            var color = Math.random() > 0.5 ? 0x000000 : 0xffffff;
            var spr = SpriteUtil.createRect(ptd.sdt, ptd.sdt, color, true);
            spr.name = color == 0x000000 ? "black_" + i : "white_" + i;
            spr.touchEnabled = true;
            spr.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandler, this);
            spr.x = ptd.xx;
            spr.y = ptd.yy;
            this.container1.addChild(spr);
            this.pools1.push(spr);
        }
        if (this.direction[0] == 1) {
            this.container1.x = -this.container1.width;
            this.container1.y = 250;
        }
        else if (this.direction[0] == 2) {
            this.container1.x = this.isOnlyOne() ? SpriteUtil.stageCenterX - this.container1.width / 2 : SpriteUtil.stageCenterX - this.container1.width;
            this.container1.y = -this.container1.height;
        }
        this.addChild(this.container1);
    };
    //反面的
    Scene_027.prototype.createOppRect = function (total) {
        this.container2 = new egret.Sprite();
        for (var i = 0; i < total; i++) {
            var ptd = this.getPoint(i, this.direction[1]);
            var color = Math.random() > 0.5 ? 0x000000 : 0xffffff;
            var spr = SpriteUtil.createRect(ptd.sdt, ptd.sdt, color, true);
            spr.name = color == 0x000000 ? "black_" + i : "white_" + i;
            spr.touchEnabled = true;
            spr.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandler, this);
            spr.x = ptd.xx;
            spr.y = ptd.yy;
            this.container2.addChild(spr);
            this.pools2.push(spr);
        }
        if (this.direction[1] == 3) {
            this.container2.x = SpriteUtil.stageWidth;
            this.container2.y = this.isOnlyOne() ? 250 : this.container1.y + this.container1.height;
        }
        else {
            this.container2.x = this.isOnlyOne() ? SpriteUtil.stageCenterX - this.container2.width / 2 : SpriteUtil.stageCenterX;
            this.container2.y = SpriteUtil.stageHeight;
        }
        this.addChild(this.container2);
    };
    Scene_027.prototype.getPoint = function (index, direction) {
        var sdt = 0, num = 3, xnum = 3;
        var xx = 0, yy = 0;
        if (this.isOnlyOne()) {
            if (this.dataVo.level <= 2) {
                num = 3;
                xnum = 3;
            }
            else {
                num = 4;
                xnum = 4;
            }
        }
        else {
            num = 4;
            xnum = 2;
        }
        if (direction == 1 || direction == 3) {
            sdt = (SpriteUtil.stageHeight - 400) / num;
            xx = Math.floor(index / xnum) * sdt + sdt / 2;
            yy = (index % xnum) * sdt + sdt / 2;
        }
        else {
            sdt = (SpriteUtil.stageWidth - 8) / num;
            xx = (index % xnum) * sdt + sdt / 2;
            yy = Math.floor(index / xnum) * sdt + sdt / 2;
        }
        return { xx: xx, yy: yy, sdt: sdt };
    };
    //是否只有一个方向
    Scene_027.prototype.isOnlyOne = function () {
        if (this.direction[0] != 0 && this.direction[1] != 0)
            return false;
        return true;
    };
    //是否错过黑块
    Scene_027.prototype.isMiss = function (sprite, direction) {
        var name = sprite.name;
        if (name.search("black") < 0)
            return false;
        if (this.direction[0] != 0) {
            var pt = this.container1.localToGlobal(sprite.x, sprite.y);
            if (direction == 1) {
                if (pt.x > SpriteUtil.stageWidth + sprite.width / 2)
                    return true;
            }
            else if (direction == 2) {
                if (pt.y > SpriteUtil.stageHeight + sprite.height / 2)
                    return true;
            }
        }
        if (this.direction[1] != 0) {
            var pt = this.container2.localToGlobal(sprite.x, sprite.y);
            if (direction == 3) {
                if (pt.x < -sprite.width / 2)
                    return true;
            }
            else if (direction == 4) {
                if (pt.y < -sprite.height / 2)
                    return true;
            }
        }
        return false;
    };
    Scene_027.prototype.checkResult = function () {
        var success = false;
        if (this.direction[0] == 1) {
            if (this.container1.x > SpriteUtil.stageWidth) {
                success = true;
            }
        }
        else if (this.direction[0] == 2) {
            if (this.container1.y > SpriteUtil.stageHeight) {
                success = true;
            }
        }
        if (this.direction[1] == 3) {
            if (this.container2.x < -this.container2.width) {
                success = true;
            }
        }
        else if (this.direction[1] == 4) {
            if (this.container2.y < -this.container2.height) {
                success = true;
            }
        }
        if (success) {
            egret.stopTick(this.loop, this);
            this.isCanOperate = false;
            if (this.count < this.dataVo.tData / 3) {
                EffectUtil.showResultEffect(EffectUtil.PERFECT);
            }
            else if (this.count < this.dataVo.tData * 2 / 3) {
                EffectUtil.showResultEffect(EffectUtil.GREAT);
            }
            else {
                EffectUtil.showResultEffect(EffectUtil.GOOD);
            }
        }
    };
    Scene_027.prototype.touchHandler = function (evt) {
        if (!this.isCanOperate)
            return;
        var spr = evt.target;
        if (spr.name.search("black") >= 0) {
            var index = this.pools1.indexOf(spr);
            if (index >= 0) {
                this.pools1.splice(index, 1);
                this.container1.removeChild(spr);
            }
            else {
                index = this.pools2.indexOf(spr);
                this.pools2.splice(index, 1);
                this.container2.removeChild(spr);
            }
            spr.name = "";
            spr.touchEnabled = false;
            spr.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandler);
        }
        else if (spr.name.search("white") >= 0) {
            this.isCanOperate = false;
            EffectUtil.showResultEffect();
            egret.stopTick(this.loop, this);
        }
    };
    return Scene_027;
}(BaseScene));
__reflect(Scene_027.prototype, "Scene_027");
//吃掉同颜色的方块
var Scene_028 = (function (_super) {
    __extends(Scene_028, _super);
    function Scene_028() {
        var _this = _super.call(this) || this;
        _this.btnArr = [];
        _this.numsVec = {};
        _this.isCanOperate = true;
        _this.init();
        return _this;
    }
    Scene_028.prototype.init = function () {
        //tdata 数组0是总共出现的次数  1是duration
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
        var len = this.dataVo.sData.length;
        for (var i = 0; i < len; i++) {
            this.numsVec[i] = 0;
        }
        this.playAnim();
    };
    Scene_028.prototype.touchHandler = function (evt) {
        if (!this.isCanOperate)
            return;
        var name = evt.target.name;
        var index = name.split("_")[1];
        var text = this.btnArr[index].getChildAt(0);
        var num = parseInt(text.text.split("x")[1]);
        num++;
        text.text = "x" + num;
        if (this.numsVec[index] < num) {
            this.isCanOperate = false;
            this.timeItem.stop();
            EffectUtil.showResultEffect();
        }
        else if (this.isCanPass()) {
            this.isCanOperate = false;
            var time = this.timeItem.leftTime;
            this.timeItem.stop();
            if (time >= this.dataVo.time * 2 / 3) {
                EffectUtil.showResultEffect(EffectUtil.PERFECT);
            }
            else if (time >= this.dataVo.time / 3) {
                EffectUtil.showResultEffect(EffectUtil.GREAT);
            }
            else {
                EffectUtil.showResultEffect(EffectUtil.GOOD);
            }
        }
    };
    Scene_028.prototype.isCanPass = function () {
        var len = this.btnArr.length;
        for (var i = 0; i < len; i++) {
            var text = this.btnArr[i].getChildAt(0);
            var num = parseInt(text.text.split("x")[1]);
            if (num != this.numsVec[i])
                return false;
        }
        return true;
    };
    Scene_028.prototype.playAnim = function () {
        var _this = this;
        var len = this.dataVo.sData.length;
        var num = this.dataVo.tData[0];
        var xnum = num;
        var duration = this.dataVo.tData[1];
        var idx = egret.setInterval(function () {
            var index = Math.floor(len * Math.random());
            var img = SpriteUtil.createImage(_this.dataVo.sData[index]);
            _this.numsVec[index]++;
            img.x = -img.width / 2;
            img.y = SpriteUtil.stageCenterY - 150;
            _this.addChild(img);
            egret.Tween.get(img).to({
                x: SpriteUtil.stageCenterX - 250
            }, duration).to({
                x: SpriteUtil.stageCenterX,
                y: SpriteUtil.stageCenterY - 300
            }, duration).to({
                x: SpriteUtil.stageCenterX + 250,
                y: SpriteUtil.stageCenterY - 160
            }, duration).to({
                x: SpriteUtil.stageWidth + img.width
            }, duration).call(function () {
                egret.Tween.removeTweens(img);
                _this.removeChild(img);
                xnum--;
                if (num <= 0 && xnum <= 0) {
                    _this.createBtnList();
                    _this.timeItem.start();
                }
            });
            num--;
            if (num <= 0) {
                egret.clearInterval(idx);
            }
        }, this, 250);
    };
    Scene_028.prototype.createBtnList = function () {
        var len = this.dataVo.sData.length;
        var title = SpriteUtil.createText("你能确定各自出现次数吗？", 48, 0x0000ff);
        title.x = SpriteUtil.stageCenterX;
        title.y = SpriteUtil.stageCenterY - 200;
        this.addChild(title);
        var container = new egret.Sprite();
        for (var i = 0; i < len; i++) {
            var sprite = this.createBtn(this.dataVo.sData[i], i);
            sprite.x = sprite.width / 2 + i * 200;
            sprite.y = sprite.height / 2;
            container.addChild(sprite);
            this.btnArr.push(sprite);
        }
        container.x = SpriteUtil.stageCenterX - container.width / 2;
        container.y = title.y + title.height - 40;
        this.addChild(container);
    };
    Scene_028.prototype.createBtn = function (str, index) {
        var sprite = new egret.Sprite();
        var img = SpriteUtil.createImage(str, true);
        img.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandler, this);
        img.scaleX = 2;
        img.scaleY = 2;
        img.name = str + "_" + index;
        var text = SpriteUtil.createText("x0", 48, 0xFF34B3);
        text.touchEnabled = false;
        img.y = text.height + 80;
        sprite.addChild(text);
        sprite.addChild(img);
        return sprite;
    };
    return Scene_028;
}(BaseScene));
__reflect(Scene_028.prototype, "Scene_028");
//记忆连连看
var Scene_029 = (function (_super) {
    __extends(Scene_029, _super);
    function Scene_029() {
        var _this = _super.call(this) || this;
        _this.isCanOperate = true;
        _this.init();
        return _this;
    }
    Scene_029.prototype.init = function () {
        this.createItems();
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
    };
    Scene_029.prototype.clkHandler = function (evt) {
        var _this = this;
        if (this.timeItem && this.timeItem.leftTime <= 0)
            return;
        if (!this.isCanOperate)
            return;
        GameSound.instance().playSound('click');
        this.isCanOperate = false;
        if (!this.currentSelect) {
            this.currentSelect = evt.target;
            this.playAnim(this.currentSelect, true).then(function () {
                _this.isCanOperate = true;
            });
        }
        else if (this.currentSelect == evt.target) {
            this.isCanOperate = true;
        }
        else {
            var target_1 = evt.target;
            this.playAnim(target_1, true).then(function () {
                if (_this.currentSelect.name == target_1.name) {
                    _this.currentSelect.alpha = 0.5;
                    _this.currentSelect.touchEnabled = false;
                    target_1.alpha = 0.5;
                    target_1.touchEnabled = false;
                    _this.isCanOperate = true;
                    _this.currentSelect = null;
                    _this.checkResult();
                }
                else {
                    Promise.all([_this.playAnim(target_1, false), _this.playAnim(_this.currentSelect, false)]).then(function () {
                        _this.currentSelect = null;
                        _this.isCanOperate = true;
                    });
                }
            });
        }
    };
    Scene_029.prototype.checkResult = function () {
        if (this.isCanPass()) {
            var leftTime = this.timeItem.leftTime;
            this.timeItem.stop();
            if (leftTime >= this.dataVo.time * 2 / 3) {
                EffectUtil.showResultEffect(EffectUtil.PERFECT);
            }
            else if (leftTime >= this.dataVo.time / 3) {
                EffectUtil.showResultEffect(EffectUtil.GREAT);
            }
            else {
                EffectUtil.showResultEffect(EffectUtil.GOOD);
            }
        }
    };
    Scene_029.prototype.isCanPass = function () {
        for (var _i = 0, _a = this.group.$children; _i < _a.length; _i++) {
            var child = _a[_i];
            if (child.alpha != 0.5)
                return false;
        }
        return true;
    };
    Scene_029.prototype.playAnim = function (target, isbool) {
        var p = new Promise(function (resolve, reject) {
            egret.Tween.get(target).to({ scaleX: 0 }, 100).call(function () {
                target.getChildAt(0).visible = isbool;
            }).to({ scaleX: 1 }, 100).wait(300).call(function () {
                egret.Tween.removeTweens(target);
                resolve();
            });
        });
        return p;
    };
    Scene_029.prototype.createItems = function () {
        //无序化
        var arr1 = this.dataVo.sData;
        var arr = arr1.concat(arr1);
        var num = arr.length;
        //多少列
        var columns = Math.round(Math.sqrt(num));
        //每个格子宽度
        var wid = Math.round(SpriteUtil.stageWidth - 50) / columns;
        //乱序
        arr.sort(function (a, b) {
            if (Math.random() > 0.5)
                return 1;
            if (Math.random() < 0.5)
                return -1;
            return 0;
        });
        this.group = new egret.Sprite();
        var len = arr.length;
        for (var i = 0; i < len; i++) {
            var img = SpriteUtil.createImage(arr[i], true);
            img.scaleX = wid / img.width;
            img.scaleY = wid / img.height;
            img.touchEnabled = false;
            img.visible = false;
            var w = img.width * img.scaleX;
            var sprite = new egret.Sprite();
            sprite.graphics.beginFill(0xFF6A6A);
            sprite.graphics.drawRect(-w / 2, -w / 2, w, w);
            sprite.graphics.endFill();
            sprite.addChild(img);
            sprite.touchEnabled = true;
            sprite.name = arr[i];
            sprite.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clkHandler, this);
            sprite.x = sprite.width / 2 + (wid + 2) * (i % columns);
            sprite.y = sprite.width / 2 + (wid + 2) * Math.floor(i / columns);
            this.group.addChild(sprite);
        }
        this.addChild(this.group);
        this.group.x = SpriteUtil.stageCenterX - this.group.width / 2;
        this.group.y = 200;
    };
    Scene_029.prototype.enter = function () {
        _super.prototype.enter.call(this);
        this.timeItem.start();
    };
    Scene_029.prototype.exit = function () {
        _super.prototype.exit.call(this);
        while (this.numChildren > 1) {
            var child = this.getChildAt(this.numChildren - 1);
            if (child.hasEventListener(egret.TouchEvent.TOUCH_TAP)) {
                child.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.clkHandler, this);
            }
            this.removeChild(child);
        }
    };
    return Scene_029;
}(BaseScene));
__reflect(Scene_029.prototype, "Scene_029");
//点破小球
var Scene_030 = (function (_super) {
    __extends(Scene_030, _super);
    function Scene_030() {
        var _this = _super.call(this) || this;
        _this.pointsArr = [];
        _this.init();
        return _this;
    }
    Scene_030.prototype.init = function () {
        //sData 0 初始球的数量 1 每次分裂个数 tData 爆破次数
        this.createBalls();
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
    };
    Scene_030.prototype.createBalls = function () {
        for (var i = 0; i < this.dataVo.sData[0]; i++) {
            var ball = SpriteUtil.createCircle(80, this.getColor());
            ball.x = SpriteUtil.stageCenterX;
            ball.y = SpriteUtil.stageCenterY;
            this.addChild(ball);
            ball.name = "first_" + this.dataVo.tData;
            ball.touchEnabled = true;
            ball.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandler, this);
            this.playAnim(ball);
        }
    };
    Scene_030.prototype.touchHandler = function (evt) {
        var _this = this;
        if (this.timeItem.leftTime <= 0)
            return;
        var ball = evt.target;
        var name = ball.name.split("_")[0];
        var index = ball.name.split("_")[1];
        if (name == "first") {
            var x = ball.x;
            var y = ball.y;
            var wid = ball.width;
            this.removeChild(ball);
            egret.Tween.removeTweens(ball);
            if (index > 0) {
                var points = this.calculateAngle(wid, x, y, this.dataVo.sData[1]);
                var obj = {
                    x: x,
                    y: y,
                    radius: wid / 3,
                    points: points
                };
                index--;
                this.playExplosion(obj, name + "_" + index);
            }
            else {
                var points = this.calculateAngle(wid, x, y, 50);
                var obj = {
                    x: x,
                    y: y,
                    radius: wid / 50,
                    points: points,
                    num: 50
                };
                this.playDestroy(obj).then(function () {
                    _this.checkResult();
                });
            }
        }
    };
    Scene_030.prototype.checkResult = function () {
        if (this.numChildren == 1) {
            var leftTime = this.timeItem.leftTime;
            this.timeItem.stop();
            if (leftTime >= this.dataVo.time * 2 / 3) {
                EffectUtil.showResultEffect(EffectUtil.PERFECT);
            }
            else if (leftTime >= this.dataVo.time / 3) {
                EffectUtil.showResultEffect(EffectUtil.GREAT);
            }
            else {
                EffectUtil.showResultEffect(EffectUtil.GOOD);
            }
        }
    };
    Scene_030.prototype.playExplosion = function (obj, name) {
        var _this = this;
        var num = this.dataVo.sData[1];
        var i = 0;
        var points = obj.points;
        var _loop_3 = function () {
            var ball = SpriteUtil.createCircle(obj.radius, this_3.getColor());
            this_3.addChild(ball);
            ball.touchEnabled = true;
            ball.x = obj.x;
            ball.y = obj.y;
            ball.name = name;
            ball.addEventListener(egret.TouchEvent.TOUCH_TAP, this_3.touchHandler, this_3);
            var pt = points[i % num];
            egret.Tween.get(ball).to({ x: pt.x, y: pt.y }, 800, egret.Ease.circOut).call(function () {
                egret.Tween.removeTweens(ball);
                _this.playAnim(ball);
            });
            i++;
        };
        var this_3 = this;
        while (i < num) {
            _loop_3();
        }
    };
    //不可分裂的直接爆掉
    Scene_030.prototype.playDestroy = function (obj) {
        var _this = this;
        var p = new Promise(function (resolve, reject) {
            var num = obj.num;
            var i = 0;
            var points = obj.points;
            var _loop_4 = function () {
                var ball = SpriteUtil.createCircle(obj.radius, _this.getColor());
                _this.addChild(ball);
                ball.x = obj.x;
                ball.y = obj.y;
                var pt = points[i % num];
                egret.Tween.get(ball).to({ x: pt.x, y: pt.y }, 300, egret.Ease.circOut).call(function () {
                    egret.Tween.removeTweens(ball);
                    _this.removeChild(ball);
                    if (i == num) {
                        resolve();
                    }
                });
                i++;
            };
            while (i < num) {
                _loop_4();
            }
        });
        return p;
    };
    Scene_030.prototype.calculateAngle = function (wid, x, y, num) {
        var angle = 360 / num;
        var points = [];
        for (var i = 0; i < num; i++) {
            var xx = x + 2 * wid * Math.cos(i * angle / Math.PI);
            var yy = y - 2 * wid * Math.sin(i * angle / Math.PI);
            points.push({ x: xx, y: yy });
        }
        return points;
    };
    Scene_030.prototype.playAnim = function (ball) {
        var _this = this;
        egret.Tween.get(ball).to({
            x: ball.width / 2 + (SpriteUtil.stageWidth - ball.width) * Math.random(),
            y: ball.width / 2 + (SpriteUtil.stageHeight - 400) * Math.random()
        }, 2000).call(function () {
            egret.Tween.removeTweens(ball);
            _this.playAnim(ball);
        });
    };
    Scene_030.prototype.getColor = function () {
        var colors = [0xff0000, 0xffff00, 0x551A8B, 0x0000ff, 0xff00ff, 0xffffff, 0x000000];
        var index = Math.floor(colors.length * Math.random());
        return colors[index];
    };
    Scene_030.prototype.enter = function () {
        _super.prototype.enter.call(this);
        this.timeItem.start();
    };
    return Scene_030;
}(BaseScene));
__reflect(Scene_030.prototype, "Scene_030");
//绕圈小球
var Scene_031 = (function (_super) {
    __extends(Scene_031, _super);
    function Scene_031() {
        var _this = _super.call(this) || this;
        _this.ballAngle = 0;
        _this.curIndex = 0;
        _this.enemies = [];
        _this.score = 0;
        _this.direction = 1;
        _this.init();
        return _this;
    }
    Scene_031.prototype.init = function () {
        //sData 颜色数量<=7 tData 目标分（转一圈一分）  extData: num 出现球的数量 speed 速度 rate出现回头的概率
        var bg = SpriteUtil.createRect(SpriteUtil.stageWidth, SpriteUtil.stageHeight, 0x000000);
        bg.alpha = 0.01;
        bg.x = SpriteUtil.stageCenterX;
        bg.y = SpriteUtil.stageCenterY;
        this.addChild(bg);
        bg.touchEnabled = true;
        bg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandler, this);
        var sprite = new egret.Sprite();
        sprite.graphics.beginFill(0x000000, 0.01);
        sprite.graphics.lineStyle(2, 0x0000ff);
        sprite.graphics.drawCircle(0, 0, 300);
        sprite.x = SpriteUtil.stageCenterX;
        sprite.y = SpriteUtil.stageCenterY;
        this.addChild(sprite);
        this.startPt = new egret.Point(sprite.x + sprite.width / 2, sprite.y);
        this.createBall();
        this.createEnemy();
        this.scoreItem = new ScoreItem();
        this.addChild(this.scoreItem);
        this.scoreItem.setSTScore(this.score, this.dataVo.tData);
        egret.startTick(this.loop, this);
    };
    Scene_031.prototype.loop = function (timestamp) {
        var xx = this.startPt.x - SpriteUtil.stageCenterX;
        var yy = this.startPt.y - SpriteUtil.stageCenterY;
        this.ball.x = xx * Math.cos(this.ballAngle) - yy * Math.sin(this.ballAngle) + SpriteUtil.stageCenterX;
        this.ball.y = yy * Math.cos(this.ballAngle) + xx * Math.sin(this.ballAngle) + SpriteUtil.stageCenterY;
        this.ballAngle += this.dataVo.extData.speed * this.direction * Math.PI / 180 / 2;
        if (Math.abs(this.ballAngle) >= 2 * Math.PI) {
            this.ballAngle = this.ballAngle % (2 * Math.PI);
        }
        var len = this.enemies.length;
        if (len == 0) {
            this.createEnemy();
            return;
        }
        for (var i = len - 1; i >= 0; i--) {
            var obj = this.enemies[i];
            var abs = Math.abs(this.ballAngle - obj.angle);
            if (obj.index == 10000) {
                obj.shape.rotation += -1 * this.direction;
            }
            if (abs < 5 * Math.PI / 180 || Math.abs(abs - 2 * Math.PI) < 5 * Math.PI / 180) {
                if (this.curIndex == obj.index) {
                    this.removeChild(obj.shape);
                    this.enemies.splice(i, 1);
                    this.score++;
                    this.scoreItem.setSTScore(this.score);
                    if (this.scoreItem.isCanPass()) {
                        egret.stopTick(this.loop, this);
                        EffectUtil.showResultEffect(EffectUtil.PERFECT);
                        break;
                    }
                }
                else if (obj.index == 10000) {
                    this.direction = -1 * this.direction;
                    this.removeChild(obj.shape);
                    this.enemies.splice(i, 1);
                }
                else {
                    egret.stopTick(this.loop, this);
                    this.removeChild(this.ball);
                    var points = this.calculateAngle(40, this.ball.x, this.ball.y, 50);
                    this.playDestroy({ x: this.ball.x, y: this.ball.y, num: 50, radius: 2, points: points }).then(function () {
                        EffectUtil.showResultEffect();
                    });
                }
            }
        }
        return false;
    };
    Scene_031.prototype.createBall = function () {
        var len = this.dataVo.sData;
        var sprite = new egret.Sprite();
        var colors = [0xff0000, 0xffff00, 0xff7d00, 0x0000ff, 0xff00ff, 0x00ffff, 0x000000];
        for (var i = 0; i < len; i++) {
            var shp = new egret.Shape();
            shp.graphics.beginFill(colors[i]);
            shp.graphics.drawCircle(0, 0, 20);
            shp.graphics.endFill();
            shp.visible = (this.curIndex == i);
            sprite.addChild(shp);
        }
        this.ball = sprite;
        this.ball.x = this.startPt.x;
        this.ball.y = this.startPt.y;
        this.addChild(this.ball);
        var btn = new egret.Sprite();
        for (var i = 0; i < len; i++) {
            var shp = new egret.Shape();
            shp.graphics.beginFill(colors[i]);
            shp.graphics.drawCircle(0, 0, 180);
            shp.graphics.endFill();
            btn.addChild(shp);
            shp.visible = (this.curIndex == i);
        }
        btn.x = SpriteUtil.stageCenterX;
        btn.y = SpriteUtil.stageCenterY;
        this.addChild(btn);
        btn.touchEnabled = true;
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchHandler, this);
        this.ballBtn = btn;
    };
    Scene_031.prototype.touchHandler = function (evt) {
        this.curIndex++;
        if (this.curIndex >= this.dataVo.sData) {
            this.curIndex = 0;
        }
        for (var i = 0; i < this.ball.numChildren; i++) {
            this.ball.$children[i].visible = i == this.curIndex;
            this.ballBtn.$children[i].visible = i == this.curIndex;
        }
    };
    Scene_031.prototype.createEnemy = function () {
        var len = this.dataVo.sData;
        var colors = [0xff0000, 0xffff00, 0xff7d00, 0x0000ff, 0xff00ff, 0x00ffff, 0x000000];
        var xx = this.startPt.x - SpriteUtil.stageCenterX;
        var yy = this.startPt.y - SpriteUtil.stageCenterY;
        var num = this.dataVo.extData.num;
        var rate = this.dataVo.extData.rate * 100;
        var rand = Math.ceil(100 * Math.random());
        var bnm = rand < rate ? Math.floor(num * Math.random()) : -1;
        for (var i = 0; i < num; i++) {
            if (i == bnm) {
                var img = SpriteUtil.createImage("refresh");
                var angle = (this.ballAngle + (50 * (i + 1) + 30 * Math.random()) * Math.PI / 180) % (2 * Math.PI);
                var sprite = new egret.Sprite();
                sprite.graphics.beginFill(0x00ff00);
                sprite.graphics.drawCircle(0, 0, img.width / 2 + 5);
                sprite.graphics.endFill();
                sprite.addChild(img);
                var scale = 2 * 20 / sprite.width;
                sprite.scaleX = scale;
                sprite.scaleY = scale;
                sprite.x = xx * Math.cos(angle) - yy * Math.sin(angle) + SpriteUtil.stageCenterX;
                sprite.y = yy * Math.cos(angle) + xx * Math.sin(angle) + SpriteUtil.stageCenterY;
                this.enemies.push({ index: 10000, angle: angle, shape: sprite });
                this.addChild(sprite);
                num++;
            }
            else {
                var shp = new egret.Shape();
                var index = Math.floor(len * Math.random());
                shp.graphics.beginFill(colors[index]);
                shp.graphics.drawCircle(0, 0, 20 + 10 * Math.random());
                shp.graphics.endFill();
                var angle = (this.ballAngle + (60 * (i + 1) + 30 * Math.random()) * Math.PI / 180) % (2 * Math.PI);
                shp.x = xx * Math.cos(angle) - yy * Math.sin(angle) + SpriteUtil.stageCenterX;
                shp.y = yy * Math.cos(angle) + xx * Math.sin(angle) + SpriteUtil.stageCenterY;
                this.enemies.push({ index: index, angle: angle, shape: shp });
                this.addChild(shp);
                this.playAnim(shp).then(function () {
                    console.log("good");
                });
            }
        }
    };
    Scene_031.prototype.playAnim = function (target) {
        var p = new Promise(function (resolve, reject) {
            target.scaleX = 0;
            target.scaleY = 0;
            egret.Tween.get(target).to({ scaleX: 1, scaleY: 1 }, 200).call(function () {
                egret.Tween.removeTweens(target);
            });
        });
        return p;
    };
    Scene_031.prototype.playDestroy = function (obj) {
        var _this = this;
        var p = new Promise(function (resolve, reject) {
            var num = obj.num;
            var i = 0;
            var points = obj.points;
            var _loop_5 = function () {
                var ball = SpriteUtil.createCircle(obj.radius + obj.radius * Math.random(), _this.getColor());
                _this.addChild(ball);
                ball.x = obj.x;
                ball.y = obj.y;
                var pt = points[i % num];
                egret.Tween.get(ball).to({ x: pt.x, y: pt.y }, 300, egret.Ease.circOut).call(function () {
                    egret.Tween.removeTweens(ball);
                    _this.removeChild(ball);
                    if (i == num) {
                        resolve();
                    }
                });
                i++;
            };
            while (i < num) {
                _loop_5();
            }
        });
        return p;
    };
    Scene_031.prototype.calculateAngle = function (wid, x, y, num) {
        var angle = 360 / num;
        var points = [];
        for (var i = 0; i < num; i++) {
            var xx = x + 3 * wid * Math.random() * Math.cos(i * angle / Math.PI);
            var yy = y - 3 * wid * Math.random() * Math.sin(i * angle / Math.PI);
            points.push({ x: xx, y: yy });
        }
        return points;
    };
    Scene_031.prototype.getColor = function () {
        var colors = [0xff0000, 0xffff00, 0xff7d00, 0x0000ff, 0xff00ff, 0x00ffff, 0x000000];
        var index = Math.floor(colors.length * Math.random());
        return colors[index];
    };
    return Scene_031;
}(BaseScene));
__reflect(Scene_031.prototype, "Scene_031");
//颜色 红色 绿色 
var Scene_032 = (function (_super) {
    __extends(Scene_032, _super);
    function Scene_032() {
        var _this = _super.call(this) || this;
        _this.curIndex = -1;
        _this.colors = [];
        _this.balls = [];
        _this.score = 0;
        _this.isCanOperate = true;
        _this.init();
        return _this;
    }
    Scene_032.prototype.init = function () {
        this.colors = [0xff0000, 0xffff00, 0xff7d00, 0x0000ff, 0xff00ff, 0x00ffff, 0x000000];
        var text = SpriteUtil.createText("红", 160);
        text.x = SpriteUtil.stageCenterX;
        text.y = SpriteUtil.stageCenterY;
        this.addChild(text);
        this.titleTxt = text;
        this.next();
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
        this.timeItem.x = SpriteUtil.stageWidth - 250;
        this.scoreItem = new ScoreItem();
        this.scoreItem.setSTScore(this.score, this.dataVo.tData);
        this.addChild(this.scoreItem);
    };
    Scene_032.prototype.touchHandler = function (evt) {
        if (!this.isCanOperate)
            return;
        var ball = evt.target;
        var index = ball.name.split("_")[1];
        if (this.curIndex == index) {
            this.score++;
            this.scoreItem.setSTScore(this.score);
            if (this.scoreItem.isCanPass()) {
                this.timeItem.stop();
                this.clear();
                EffectUtil.showResultEffect(EffectUtil.PERFECT);
                this.isCanOperate = false;
                return;
            }
            this.next();
        }
        else {
            this.timeItem.stop();
            this.isCanOperate = false;
            EffectUtil.showResultEffect();
        }
    };
    Scene_032.prototype.next = function () {
        var obj = this.getTxtColor();
        this.curIndex = obj.index;
        this.titleTxt.textColor = obj.color;
        this.titleTxt.text = obj.name;
        this.createBalls(obj.index);
    };
    Scene_032.prototype.createBalls = function (index) {
        var _this = this;
        this.clear();
        var len = this.dataVo.sData;
        var _loop_6 = function (i) {
            var ball = SpriteUtil.createCircle(30 + 50 * Math.random(), this_4.colors[i]);
            ball.x = ball.width / 2 + (SpriteUtil.stageWidth - ball.width) * Math.random();
            ball.y = ball.width / 2 + (SpriteUtil.stageHeight - 400) * Math.random();
            this_4.addChild(ball);
            ball.alpha = 0.8;
            ball.name = "color_" + i;
            ball.touchEnabled = true;
            ball.addEventListener(egret.TouchEvent.TOUCH_TAP, this_4.touchHandler, this_4);
            ball.scaleX = 0;
            ball.scaleY = 0;
            this_4.balls.push(ball);
            egret.Tween.get(ball).to({ scaleX: 1, scaleY: 1 }, 200).call(function () {
                egret.Tween.removeTweens(ball);
                _this.playAnim(ball);
            });
        };
        var this_4 = this;
        for (var i = 0; i < len; i++) {
            _loop_6(i);
        }
    };
    Scene_032.prototype.clear = function () {
        for (var i = 0; i < this.balls.length; i++) {
            egret.Tween.removeTweens(this.balls[i]);
            this.removeChild(this.balls[i]);
        }
        this.balls.length = 0;
    };
    Scene_032.prototype.playAnim = function (ball) {
        var _this = this;
        egret.Tween.get(ball).to({
            x: ball.width / 2 + (SpriteUtil.stageWidth - ball.width) * Math.random(),
            y: ball.width / 2 + (SpriteUtil.stageHeight - 400) * Math.random()
        }, 2000).call(function () {
            egret.Tween.removeTweens(ball);
            _this.playAnim(ball);
        });
    };
    Scene_032.prototype.enter = function () {
        _super.prototype.enter.call(this);
        this.timeItem.start();
    };
    Scene_032.prototype.getTxtColor = function () {
        var index = Math.floor(this.colors.length * Math.random());
        var names = ["红", "黄", "橙", "蓝", "紫", "青", "黑"];
        var sindex = Math.floor(this.dataVo.sData * Math.random());
        return { index: sindex, color: this.colors[index], name: names[sindex] };
    };
    return Scene_032;
}(BaseScene));
__reflect(Scene_032.prototype, "Scene_032");
var CommonUtil = (function () {
    function CommonUtil() {
    }
    //单位是秒
    CommonUtil.getMSTimeBySeconds = function (time) {
        if (time === void 0) { time = 0; }
        var str = '';
        var minute = Math.floor(time / 60) < 10 ? "0" + Math.floor(time / 60) : Math.floor(time / 60);
        var second = time % 60 < 10 ? '0' + time % 60 : time % 60;
        return minute + ":" + second;
    };
    //获取指定数量指定范围的随机整数数字 isRepeat是否允许重复的数字
    CommonUtil.getRandomNumFromARange = function (count, start, end, isRepeat) {
        if (start === void 0) { start = 0; }
        if (end === void 0) { end = 0; }
        if (isRepeat === void 0) { isRepeat = false; }
        if (!count || start >= end)
            return null;
        var mid = end - start;
        var arr = [];
        for (var i = 0; i < mid; i++) {
            arr.push(start + i);
        }
        if (count >= mid)
            return arr;
        var rarr = [];
        for (var i = 0; i < count; i++) {
            var rn = Math.floor(arr.length * Math.random());
            rarr.push(arr[rn]);
            arr.splice(rn, 1);
        }
        return rarr;
    };
    CommonUtil.allEmoji = ['emoji01', 'emoji02', 'emoji03', 'emoji04', 'emoji05', 'emoji06', 'emoji07', 'emoji08', 'emoji09', 'emoji10', 'emoji11', 'emoji12', 'emoji13', 'emoji14', 'emoji15', 'emoji16', 'emoji17', 'emoji18', 'emoji19', 'emoji20', 'equal', 'female', 'male', 'sigh', 'rock', 'paper', 'scissors', 'welldone'];
    CommonUtil.allAnimals = ['ant', 'butterfly', 'cat', 'chicken', 'cow', 'dog', 'dragon', 'dragonfly', 'duck', 'eagle', 'elephant', 'frog', 'goat', 'horse', 'lizard', 'monkey', 'panda', 'penguin', 'pork', 'rabbit', 'rat', 'snake', 'squab', 'tiger', 'tortoise'];
    return CommonUtil;
}());
__reflect(CommonUtil.prototype, "CommonUtil");
var EffectUtil = (function () {
    function EffectUtil() {
    }
    EffectUtil.showResultEffect = function (type) {
        var _this = this;
        if (type === void 0) { type = 0; }
        var str = 'you lose';
        if (type == 1) {
            str = 'good';
        }
        else if (type == 2) {
            str = 'great';
        }
        else if (type == 3) {
            str = 'perfect';
        }
        if (type == 0) {
            GameSound.instance().playSound("fail");
        }
        else {
            GameSound.instance().playSound(str);
        }
        var text = SpriteUtil.createText(str, 100, 0xFFD700);
        text.stroke = 5;
        text.strokeColor = 0xFF0000;
        text.bold = true;
        text.x = SpriteUtil.stageCenterX;
        text.y = SpriteUtil.stageCenterY - 200;
        text.scaleX = 5;
        text.scaleY = 5;
        text.alpha = 0.1;
        Game.instance().addMiddle(text);
        egret.Tween.get(text).to({ scaleX: 1, scaleY: 1, alpha: 1 }, 500, egret.Ease.cubicIn).call(function () {
            var ids = egret.setTimeout(function () {
                egret.clearTimeout(ids);
                if (text.parent) {
                    text.parent.removeChild(text);
                }
                if (type == 0) {
                    if (GameData.reviveCard <= 0) {
                        GameData.reviveCard = 0;
                        Game.instance().gameView.tipsView.open(false);
                    }
                    else {
                        Game.instance().gameView.tipsView.open();
                    }
                }
                else {
                    EventCenter.instance().dispatchEvent(new GameEvent(GameEvent.GOTO_NEXT_LEVEL));
                }
            }, _this, 800);
        });
    };
    //ready go
    EffectUtil.playReadyGo = function () {
        var _this = this;
        var text1 = SpriteUtil.createText("Ready", 100, 0xFF00FF);
        text1.stroke = 5;
        text1.strokeColor = 0x0000ff;
        text1.bold = true;
        text1.x = SpriteUtil.stageCenterX;
        text1.y = SpriteUtil.stageCenterY - 200;
        text1.scaleX = 5;
        text1.scaleY = 5;
        text1.alpha = 0.1;
        Game.instance().addMiddle(text1);
        GameSound.instance().playSound('ready');
        egret.Tween.get(text1).to({ scaleX: 1, scaleY: 1, alpha: 1 }, 300, egret.Ease.cubicIn).call(function () {
            var idx = egret.setTimeout(function () {
                egret.clearTimeout(idx);
                text1.alpha = 0.01;
                text1.text = 'Go';
                text1.scaleX = 5;
                text1.scaleY = 5;
                text1.anchorOffsetX = text1.width / 2;
                text1.anchorOffsetY = text1.height / 2;
                egret.Tween.get(text1).to({ scaleX: 1, scaleY: 1, alpha: 1 }, 300, egret.Ease.cubicIn).call(function () {
                    var sid = egret.setTimeout(function () {
                        egret.clearTimeout(sid);
                        if (text1.parent) {
                            text1.parent.removeChild(text1);
                        }
                        egret.Tween.removeTweens(text1);
                        EventCenter.instance().dispatchEvent(new GameEvent(GameEvent.START_GAME));
                    }, _this, 200);
                });
            }, _this, 400);
        });
    };
    //特殊
    EffectUtil.showTextAndBack = function (txt, backFun, thisObj) {
        var _this = this;
        if (txt === void 0) { txt = ''; }
        if (backFun === void 0) { backFun = null; }
        if (thisObj === void 0) { thisObj = null; }
        if (!txt)
            return;
        var text = SpriteUtil.createText(txt, 100, 0xffff00);
        text.stroke = 5;
        text.strokeColor = 0x0000ff;
        text.bold = true;
        text.x = SpriteUtil.stageCenterX;
        text.y = SpriteUtil.stageCenterY - 200;
        text.scaleX = 5;
        text.scaleY = 5;
        text.alpha = 0.1;
        Game.instance().addMiddle(text);
        egret.Tween.get(text).to({ scaleX: 1, scaleY: 1, alpha: 1 }, 500, egret.Ease.cubicIn).call(function () {
            var ids = egret.setTimeout(function () {
                egret.clearTimeout(ids);
                if (text.parent) {
                    text.parent.removeChild(text);
                }
                egret.Tween.removeTweens(text);
                if (backFun) {
                    if (thisObj) {
                        backFun.call(thisObj);
                    }
                    else {
                        backFun();
                    }
                }
            }, _this, 800);
        });
    };
    //呼吸
    EffectUtil.breath = function (spr, scale) {
        if (scale === void 0) { scale = 0.8; }
        var sx = spr.scaleX;
        var sy = spr.scaleY;
        egret.Tween.get(spr, { loop: true }).to({ scaleX: sx + scale, scaleY: sy + scale }, 500).to({ scaleX: sx, scaleY: sy }, 500);
    };
    EffectUtil.GOOD = 1;
    EffectUtil.GREAT = 2;
    EffectUtil.PERFECT = 3;
    return EffectUtil;
}());
__reflect(EffectUtil.prototype, "EffectUtil");
var SpriteUtil = (function () {
    function SpriteUtil() {
    }
    //创建圆形
    SpriteUtil.createCircle = function (radius, color) {
        if (color === void 0) { color = 0x00ff00; }
        var circle = new egret.Shape();
        circle.graphics.beginFill(color);
        circle.graphics.drawCircle(0, 0, radius);
        circle.graphics.endFill();
        return circle;
    };
    //创建矩形
    SpriteUtil.createRect = function (width, height, color, isLine) {
        if (color === void 0) { color = 0x00ff00; }
        if (isLine === void 0) { isLine = false; }
        var rect = new egret.Shape();
        rect.graphics.beginFill(color);
        if (isLine) {
            rect.graphics.lineStyle(1, 0x000000);
        }
        rect.graphics.drawRect(0, 0, width, height);
        rect.graphics.endFill();
        rect.anchorOffsetX = width / 2;
        rect.anchorOffsetY = height / 2;
        return rect;
    };
    //多边形
    SpriteUtil.createPolygon = function (points, color) {
        if (color === void 0) { color = 0x0000ff; }
        if (!points || !points.length) {
            return;
        }
        var polygon = new egret.Shape();
        var len = points.length;
        polygon.graphics.lineStyle(1, color);
        polygon.graphics.beginFill(color);
        polygon.graphics.moveTo(points[0], points[1]);
        for (var i = 0; i < len; i += 2) {
            polygon.graphics.lineTo(points[i], points[i + 1]);
            // polygon.graphics.moveTo(points[i],points[i+1]);
        }
        polygon.graphics.lineTo(points[0], points[1]);
        polygon.graphics.endFill();
        polygon.anchorOffsetX = polygon.width / 2;
        polygon.anchorOffsetY = polygon.height / 2;
        return polygon;
    };
    //text 图
    SpriteUtil.createText = function (str, size, color, isBackground, backgroundColor) {
        if (size === void 0) { size = 40; }
        if (color === void 0) { color = 0xff0000; }
        if (isBackground === void 0) { isBackground = false; }
        if (backgroundColor === void 0) { backgroundColor = 0x0000ff; }
        var text = new egret.TextField();
        text.size = size;
        text.text = str;
        text.textColor = color;
        text.background = isBackground;
        text.backgroundColor = backgroundColor;
        text.stroke = 1;
        text.strokeColor = 0x000000;
        text.textAlign = 'center';
        text.verticalAlign = 'middle';
        text.bold = true;
        text.anchorOffsetX = text.width / 2;
        text.anchorOffsetY = text.height / 2;
        return text;
    };
    //创建bitmap
    SpriteUtil.createImage = function (name, isBackground, backgroundColor) {
        if (isBackground === void 0) { isBackground = false; }
        if (backgroundColor === void 0) { backgroundColor = 0x1E90FF; }
        var bitmap = new egret.Bitmap(RES.getRes(name + "_png"));
        if (isBackground) {
            var sprite = new egret.Sprite();
            sprite.graphics.beginFill(backgroundColor);
            sprite.graphics.drawRect(0, 0, bitmap.width, bitmap.height);
            sprite.graphics.endFill();
            sprite.addChild(bitmap);
            sprite.anchorOffsetX = sprite.width / 2;
            sprite.anchorOffsetY = sprite.height / 2;
            sprite.touchEnabled = true;
            return sprite;
        }
        bitmap.anchorOffsetX = bitmap.width / 2;
        bitmap.anchorOffsetY = bitmap.height / 2;
        bitmap.touchEnabled = true;
        return bitmap;
    };
    //create a button
    SpriteUtil.createButton = function (label, width, height, backgroundColor, size) {
        if (width === void 0) { width = 200; }
        if (height === void 0) { height = 80; }
        if (backgroundColor === void 0) { backgroundColor = 0xff00ff; }
        if (size === void 0) { size = 40; }
        var btn = new egret.Sprite();
        var rect = new egret.Shape();
        rect.graphics.lineStyle(5, 0x8F8F8F);
        rect.graphics.beginFill(backgroundColor);
        rect.graphics.drawRect(0, 0, width, height);
        rect.graphics.endFill();
        var text = new egret.TextField();
        text.text = label;
        text.size = size;
        text.textAlign = 'center';
        text.width = width;
        text.y = 20;
        text.stroke = 1;
        text.strokeColor = 0x000000;
        text.bold = true;
        text.touchEnabled = false;
        btn.addChild(rect);
        btn.addChild(text);
        btn.touchEnabled = true;
        return btn;
    };
    SpriteUtil.stageWidth = 0;
    SpriteUtil.stageHeight = 0;
    SpriteUtil.stageCenterX = 0;
    SpriteUtil.stageCenterY = 0;
    return SpriteUtil;
}());
__reflect(SpriteUtil.prototype, "SpriteUtil");
var WXApi = (function () {
    function WXApi() {
    }
    WXApi.getSetting = function () {
        wx.getSetting({
            complete: function (res) {
                if (res.errMsg == 'getSetting:ok') {
                    var settings = res.authSetting;
                    if (settings['scope.userInfo'] == true) {
                        //已经授权
                        wx.getUserInfo({
                            success: function (res) {
                                GameData.wxUserInfo = res.userInfo;
                                EventCenter.instance().dispatchEvent(new GameEvent(GameEvent.AUTHORIZE_REFRESH));
                            }
                        });
                        WXApi.showShareMenu();
                    }
                    else {
                        WXApi.createUserInfoButton();
                    }
                }
            }
        });
    };
    //创建授权按钮
    WXApi.createUserInfoButton = function () {
        if (egret.Capabilities.runtimeType != "wxgame") {
            Game.instance().gameScene.enterMenu();
            return;
        }
        var sysInfo = wx.getSystemInfoSync();
        // console.log(sysInfo);
        var button = wx.createUserInfoButton({
            type: 'text',
            text: '',
            style: {
                left: 0,
                top: 0,
                width: sysInfo.windowWidth,
                height: sysInfo.windowHeight,
                backgroundColor: '#0000ff',
                color: '#ffff00',
                textAlign: 'center',
                fontSize: 48,
                opacity: 0.1,
                borderRadius: 0,
            }
        });
        button.onTap(function (res) {
            if (res.errMsg == 'getUserInfo:ok') {
                button.hide();
                button.destroy();
                WXApi.showShareMenu();
                GameData.wxUserInfo = res.userInfo;
                EventCenter.instance().dispatchEvent(new GameEvent(GameEvent.AUTHORIZE_REFRESH));
            }
        });
    };
    //显示转发菜单
    WXApi.showShareMenu = function () {
        wx.showShareMenu({ "withShareTicket": false, complete: function (res) {
                wx.onShareAppMessage(function () {
                    return {
                        title: '真的！原来我与正常人相差这么大距离！',
                        imageUrl: 'resource/assets/head.png',
                        query: ''
                    };
                });
            } });
    };
    //主动转发
    WXApi.shareAppMessage = function () {
        wx.shareAppMessage({
            title: "有人@你，来尝试下极限挑战！",
            imageUrl: 'resource/assets/head.png',
            query: ''
        });
    };
    //创建音频
    WXApi.createInnerAudioContext = function (url) {
        var audio = wx.createInnerAudioContext();
        audio.src = url;
        return audio;
    };
    //游戏圈
    WXApi.createGameClubButton = function () {
        var btn = wx.createGameClubButton({
            icon: 'green',
            style: {
                left: 10,
                top: 10,
                width: 40,
                height: 40
            }
        });
        return btn;
    };
    //跳转到指定小游戏
    WXApi.navigateToMiniProgram = function (appid) {
        wx.navigateToMiniProgram({
            appId: appid,
            success: function () {
                // console.log("跳转成功！");
            }
        });
    };
    WXApi.showBannerAd = function (b) {
        var _this = this;
        if (b === void 0) { b = true; }
        if (!this.globalBannerAd) {
            var systemInfo_1 = wx.getSystemInfoSync();
            var shgt = SpriteUtil.stageHeight;
            var wid = SpriteUtil.stageWidth;
            if (shgt > systemInfo_1.windowHeight) {
                shgt = systemInfo_1.windowHeight * wid / systemInfo_1.windowWidth;
            }
            var bannerAd_1 = wx.createBannerAd({
                adUnitId: 'adunit-3f56016b3591065a',
                style: {
                    left: 0,
                    top: 0,
                    width: wid
                }
            });
            bannerAd_1.onResize(function (res) {
                bannerAd_1.style.left = 0;
                bannerAd_1.style.top = systemInfo_1.windowHeight - res.height;
                _this.globalBannerAd = bannerAd_1;
                if (b) {
                    bannerAd_1.show();
                }
                else {
                    bannerAd_1.hide();
                }
            });
            bannerAd_1.onError(function (res) {
                console.log(res.errMsg);
            });
        }
        else {
            if (b) {
                this.globalBannerAd.show();
            }
            else {
                this.globalBannerAd.hide();
            }
        }
    };
    //激励视频
    WXApi.showVideoAd = function () {
        var videoAd = wx.createRewardedVideoAd({
            adUnitId: 'adunit-37768ba621106947'
        });
        return videoAd;
    };
    //set user level
    //排行榜数据更新
    WXApi.updateRankLvl = function (chapter) {
        var schapter = egret.localStorage.getItem('very_funny_small_game_chapter');
        if (parseInt(schapter) >= chapter)
            return;
        egret.localStorage.setItem("very_funny_small_game_chapter", "" + chapter);
        var openDataContext = platform['openDataContext'];
        openDataContext.postMessage({
            command: 'cmd_user',
            level: chapter
        });
    };
    return WXApi;
}());
__reflect(WXApi.prototype, "WXApi");
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var LoadingUI = (function (_super) {
    __extends(LoadingUI, _super);
    function LoadingUI() {
        var _this = _super.call(this) || this;
        _this.createView();
        return _this;
    }
    LoadingUI.prototype.createView = function () {
        this.textField = new egret.TextField();
        this.addChild(this.textField);
        this.textField.y = 420;
        this.textField.width = 480;
        this.textField.height = 100;
        this.textField.textAlign = "center";
        this.textField.textColor = 0x00ff00;
        this.textField.size = 48;
        this.textField.stroke = 2;
        this.textField.strokeColor = 0xff0000;
        this.textField.bold = true;
        var text = new egret.TextField();
        text.text = "健康游戏忠告\n抵制不良游戏，拒绝盗版游戏。\n注意自我保护，谨防受骗上当。\n适度游戏益脑，沉迷游戏伤身。\n合理安排时间，享受健康生活。";
        text.textAlign = "center";
        text.textColor = 0xffffff;
        text.lineSpacing = 20;
        text.size = 36;
        text.anchorOffsetX = text.width / 2;
        text.x = 360;
        text.y = 700;
        this.addChild(text);
    };
    LoadingUI.prototype.onProgress = function (current, total) {
        this.textField.text = "Loading..." + Math.floor(100 * current / total) + "%";
        this.textField.x = 120;
    };
    return LoadingUI;
}(egret.Sprite));
__reflect(LoadingUI.prototype, "LoadingUI", ["RES.PromiseTaskReporter"]);
var GuideView = (function (_super) {
    __extends(GuideView, _super);
    function GuideView() {
        var _this = _super.call(this) || this;
        _this.init();
        return _this;
    }
    GuideView.prototype.init = function () {
        var _this = this;
        var sp = new egret.Shape();
        sp.graphics.beginFill(0x000000);
        sp.graphics.drawRect(0, 0, SpriteUtil.stageWidth, SpriteUtil.stageHeight);
        sp.graphics.endFill();
        this.addChild(sp);
        this.tipsTxt = new egret.TextField;
        this.tipsTxt.name = '';
        this.tipsTxt.textAlign = 'center';
        this.tipsTxt.size = 40;
        this.tipsTxt.textColor = 0xffffff;
        this.tipsTxt.stroke = 1;
        this.tipsTxt.strokeColor = 0xff0000;
        this.tipsTxt.bold = true;
        this.tipsTxt.lineSpacing = 20;
        this.tipsTxt.width = SpriteUtil.stageWidth - 200;
        this.tipsTxt.x = (SpriteUtil.stageWidth - this.tipsTxt.width) / 2;
        this.addChild(this.tipsTxt);
        var btn = SpriteUtil.createText(">> 开始挑战 <<", 48, 0xff00ff);
        btn.x = SpriteUtil.stageCenterX;
        btn.y = SpriteUtil.stageCenterY - 80;
        btn.touchEnabled = true;
        this.addChild(btn);
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            GameSound.instance().playSound('click');
            _this.close();
            EffectUtil.playReadyGo();
        }, this);
        this.startBtn = btn;
        EffectUtil.breath(btn, 0.05);
        var home = SpriteUtil.createImage('home');
        home.x = 80;
        home.y = 80;
        home.scaleX = 1.4;
        home.scaleY = 1.5;
        this.addChild(home);
        home.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            _this.close();
            Game.instance().gameScene.enterMenu();
        }, this);
    };
    GuideView.prototype.show = function () {
        this.tipsTxt.textFlow = this.getDesc();
        _super.prototype.open.call(this);
        this.tipsTxt.y = SpriteUtil.stageCenterY - this.tipsTxt.height / 2 - 100;
        this.startBtn.y = this.tipsTxt.y + this.tipsTxt.height + 60;
    };
    GuideView.prototype.getDesc = function () {
        var config = GameData.getLevelConfig();
        var arr = new Array();
        arr.push({ text: config.title, style: { bold: true, size: 40, textColor: 0xFFC125 } });
        arr.push({ text: '\n' });
        arr.push({ text: config['desc'], style: { size: 32, bold: false, textColor: 0xEEEED1, stroke: 0 } });
        return arr;
    };
    return GuideView;
}(BaseView));
__reflect(GuideView.prototype, "GuideView");
var RankView = (function (_super) {
    __extends(RankView, _super);
    function RankView() {
        var _this = _super.call(this) || this;
        _this.intervalId = 0;
        _this.init();
        return _this;
    }
    RankView.prototype.init = function () {
        var _this = this;
        var shape = new egret.Shape();
        shape.graphics.beginFill(0x000000, 0.96);
        shape.graphics.drawRect(0, 0, SpriteUtil.stageWidth, SpriteUtil.stageHeight);
        shape.graphics.endFill();
        this.addChild(shape);
        shape.touchEnabled = true;
        shape.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            _this.close();
        }, this);
        this.listSpr = new egret.Sprite();
        this.listSpr.y = 100;
        this.addChild(this.listSpr);
        var txt = new egret.TextField();
        txt.text = '排行榜';
        txt.x = SpriteUtil.stageCenterX - txt.width / 2;
        txt.y = 80;
        txt.size = 40;
        txt.textColor = 0xffff00;
        txt.bold = true;
        this.addChild(txt);
    };
    RankView.prototype.open = function () {
        var _this = this;
        _super.prototype.open.call(this);
        this.intervalId = egret.setInterval(function () {
            _this.listSpr.removeChildren();
            var openDatactx = platform['openDataContext'];
            openDatactx.postMessage({ command: 'cmd_rank' });
            var rank = openDatactx.createDisplayObject();
            var scale = SpriteUtil.stageWidth / rank.width;
            _this.listSpr.addChild(rank);
            _this.listSpr.scaleX = scale;
            _this.listSpr.scaleY = scale;
        }, this, 40);
    };
    RankView.prototype.close = function () {
        _super.prototype.close.call(this);
        egret.clearInterval(this.intervalId);
    };
    return RankView;
}(BaseView));
__reflect(RankView.prototype, "RankView");
var TipsView = (function (_super) {
    __extends(TipsView, _super);
    function TipsView() {
        var _this = _super.call(this) || this;
        _this.init();
        return _this;
    }
    TipsView.prototype.init = function () {
        var _this = this;
        var sp = new egret.Shape();
        sp.graphics.beginFill(0x000000, 0.5);
        sp.graphics.drawRect(0, 0, SpriteUtil.stageWidth, SpriteUtil.stageHeight);
        sp.graphics.endFill();
        this.addChild(sp);
        sp.touchEnabled = true;
        var sprite = new egret.Sprite();
        this.addChild(sprite);
        var shape = SpriteUtil.createRect(SpriteUtil.stageWidth / 1.2, SpriteUtil.stageWidth / 1.8, 0x8F8F8F);
        shape.anchorOffsetX = 0;
        shape.anchorOffsetY = 0;
        sprite.addChild(shape);
        var title = SpriteUtil.createText('提示', 42, 0x00ff00);
        title.x = shape.width / 2;
        title.y = 50;
        sprite.addChild(title);
        var text = SpriteUtil.createText('你有1次复活机会！', 36, 0xffffff);
        text.anchorOffsetX = 0;
        text.anchorOffsetY = 0;
        text.x = 50;
        text.y = 100;
        text.width = shape.width - 100;
        text.height = 160;
        text.lineSpacing = 20;
        sprite.addChild(text);
        this.tipsTxt = text;
        var closebtn = SpriteUtil.createButton('X', 80, 80, 0x8F8F8F, 50);
        closebtn.x = shape.width - 82;
        closebtn.y = 2;
        sprite.addChild(closebtn);
        closebtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            _this.close();
            Game.instance().gameScene.enterOver();
        }, this);
        var btn1 = SpriteUtil.createButton('立即复活', 200, 80, 0x473C8B, 32);
        btn1.x = shape.width / 2 - btn1.width - 40;
        btn1.y = shape.height - 100;
        sprite.addChild(btn1);
        btn1.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (GameData.reviveCard <= 0)
                return;
            _this.close();
            GameData.reviveCard--;
            GameData.currentLevel--;
            EventCenter.instance().dispatchEvent(new GameEvent(GameEvent.GOTO_NEXT_LEVEL));
        }, this);
        this.reviveBtn = btn1;
        var btn2 = SpriteUtil.createButton('看视频复活', 200, 80, 0x473C8B, 32);
        btn2.x = shape.width / 2 + 40;
        btn2.y = shape.height - 100;
        sprite.addChild(btn2);
        this.lookBtn = btn2;
        var bg = new egret.Shape();
        bg.graphics.beginFill(0x000000);
        bg.graphics.drawRect(0, 0, SpriteUtil.stageWidth, SpriteUtil.stageHeight);
        bg.graphics.endFill();
        bg.touchEnabled = true;
        bg.alpha = 0.6;
        this.background = bg;
        btn2.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            var videoAd = WXApi.showVideoAd();
            Game.instance().addTop(bg);
            videoAd.onError(function (res) {
                if (bg && bg.parent) {
                    bg.parent.removeChild(bg);
                }
                console.log(res.errMsg);
            });
            videoAd.load().then(function () {
                videoAd.show();
                videoAd.onClose(function (res) {
                    if (res.isEnded == true) {
                        _this.close();
                        GameData.currentLevel--;
                        EventCenter.instance().dispatchEvent(new GameEvent(GameEvent.GOTO_NEXT_LEVEL));
                    }
                    if (bg && bg.parent) {
                        bg.parent.removeChild(bg);
                    }
                });
            }).catch(function (err) {
                if (bg && bg.parent) {
                    bg.parent.removeChild(bg);
                }
                console.log(err.errMsg);
            });
        }, this);
        sprite.x = SpriteUtil.stageCenterX - shape.width / 2;
        sprite.y = SpriteUtil.stageCenterY - shape.height / 2;
    };
    TipsView.prototype.open = function (isbool) {
        if (isbool === void 0) { isbool = true; }
        this.reviveBtn.visible = isbool;
        if (isbool) {
            this.tipsTxt.text = "\u4F60\u8FD8\u5269\u4F59" + GameData.reviveCard + "\u6B21\u590D\u6D3B\u673A\u4F1A\uFF01";
            this.lookBtn.x = SpriteUtil.stageWidth / 1.2 / 2 + 40;
        }
        else {
            this.lookBtn.x = SpriteUtil.stageWidth / 1.2 / 2 - this.lookBtn.width / 2;
            this.tipsTxt.text = "\u60A8\u7684\u514D\u8D39\u590D\u6D3B\u6B21\u6570\u5DF2\u7528\u5149\n\u53EF\u4EE5\u770B\u89C6\u9891\u590D\u6D3B\uFF01";
        }
        _super.prototype.open.call(this);
    };
    return TipsView;
}(BaseView));
__reflect(TipsView.prototype, "TipsView");
var DataVO = (function () {
    function DataVO() {
        //关卡
        this.level = 0;
        //关卡类型
        this.levelType = "000";
        //关卡名称
        this.title = '神秘的关卡';
        //关卡描述
        this.desc = '能告诉我你是怎么来到这里的吗？';
        //关卡限制时间
        this.time = 0;
        //关卡target分数
        this.score = 0;
        //其他参数
        this.extData = null;
    }
    DataVO.prototype.setData = function (data) {
        this.reset();
        if (!data)
            return;
        this.level = data.level ? data.level : this.level;
        this.levelType = data.levelType ? data.levelType : this.levelType;
        this.title = data.title ? data.title : this.title;
        this.desc = data.desc ? data.desc : this.desc;
        this.sData = data.sData ? data.sData : this.sData;
        this.tData = data.tData ? data.tData : this.tData;
        this.time = data.time ? data.time : this.time;
        this.score = data.score ? data.score : this.score;
        this.extData = data.extData ? data.extData : this.extData;
    };
    DataVO.prototype.reset = function () {
        this.level = 0;
        this.levelType = "";
        this.title = "神秘的关卡";
        this.desc = "能告诉我你是怎么来到这里的吗？";
        this.sData = null;
        this.tData = null;
        this.time = 0;
        this.score = 0;
    };
    return DataVO;
}());
__reflect(DataVO.prototype, "DataVO");
;window.Main = Main;