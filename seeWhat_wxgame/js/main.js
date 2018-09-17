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
        _this.dataVo = GameData.getCurrentSceneData();
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
        var plySpr = SpriteUtil.createText('🙉', 100);
        this.player = Matter.Bodies.circle(SpriteUtil.stageCenterX, SpriteUtil.stageCenterY, plySpr.height / 2, {
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
        var arr1 = ['🍏', '🍐', '🍑', '🍒', '🍓', '🍅', '🍇', '🍈', '🍉', '🍊', '🍋', '🍌', '🍍'];
        var arr2 = ['💩', '🍖', '🍗', '🍬', '🍔', '🍕', '🍩', '🍡', '⚽', '🍭', '🍟', '💣', '🔋'];
        var len1 = arr1.length;
        var len2 = arr2.length;
        var index = 0;
        for (var i = 0; i < 80; i++) {
            var xx = 0;
            var yy = 0;
            if (i < 25) {
                xx = -50;
                yy = (i % 25) * (SpriteUtil.stageHeight / 25);
            }
            else if (i < 40) {
                xx = ((i - 25) % 15) * (SpriteUtil.stageWidth / 15);
                yy = SpriteUtil.stageHeight + 50;
            }
            else if (i < 65) {
                xx = SpriteUtil.stageWidth + 50;
                yy = ((i - 40) % 25) * (SpriteUtil.stageHeight / 25);
            }
            else {
                xx = ((i - 65) % 15) * (SpriteUtil.stageWidth / 15);
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
        for (var _i = 0, pairs_1 = pairs; _i < pairs_1.length; _i++) {
            var pair = pairs_1[_i];
            if (pair.bodyA == this.player) {
                if (pair.bodyB.name == 'fruit') {
                    this.removeBody(pair.bodyB);
                    this.score++;
                    this.scoreItem.setSTScore(this.score);
                    if (this.scoreItem.isCanPass()) {
                        this.destroy();
                        EffectUtil.showResultEffect(EffectUtil.GOOD);
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
                        EffectUtil.showResultEffect(EffectUtil.GOOD);
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
                EventCenter.instance().dispatchEvent(new GameEvent(GameEvent.GOTO_NEXT));
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
        var fx = dx / Math.abs(dx);
        var fy = fx * rate;
        Matter.Body.setVelocity(body, { x: fx * 3, y: fy * 3 });
        Matter.Body.setAngularVelocity(body, 0.01 * fx);
        return true;
    };
    //create fruit
    Scene_005.prototype.createItem = function (cstr, name, sx, sy) {
        if (sx === void 0) { sx = 0; }
        if (sy === void 0) { sy = 0; }
        var item = SpriteUtil.createText(cstr, 50);
        var itemBody = Matter.Bodies.circle(sx, sy, item.height / 2, {
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
            console.log(e);
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
                        GameData.config = result;
                        return [4 /*yield*/, platform.login()];
                    case 3:
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
    GameData.getCurrentSceneData = function () {
        var vo = new DataVO();
        vo.setData(this.config[this.currentLevel]);
        return vo;
    };
    //主要用来测试和区分 微信小游戏 必须为true
    GameData.isWxGame = true;
    GameData.currentLevel = 0;
    GameData.config = [];
    GameData.questions = [
        { question: '世界三大宗教是基督教、佛教、和伊斯兰教？', answer: 1 },
        { question: '世界上最冷的地方是北极？', answer: 0 },
        { question: '人的正常体温是36.5摄氏度？', answer: 1 },
        { question: '爱因斯坦发明了伟大的相对论，牛顿发现了万有引力？', answer: 2 },
        { question: '小明今天从家到学校要20分钟，从学校到家只需要10分钟，所以小明的自行车忘学校了', answer: 0 },
        { question: '爸爸的儿子的妈妈是爸爸的爸爸的儿媳妇？', answer: 1 },
        { question: '道德经是李耳所著，其生于山东与河南交接一带？', answer: 2 },
        { question: '中医讲百病生于气，所以经常生气就容易得病？', answer: 1 },
        { question: '通常所说的程序猿是指写程序的一类人，由于整天加班见不到太阳，类似猿猴的生活，故而得名，另有一说是经常对着电脑，导致皮肤变差，奇丑无比，故长得像猿猴而得名？', answer: 1 },
        { question: '如果地球是圆的，那么你在玩的这款小游戏是一个地球人做的，如果你是女的，那么地球还在自转，多么完美？', answer: 1 },
        { question: '那个，你知道如何去除周围的邪气吗，奥！我知道，正气内存，邪不可干，所以养足正气即可，我说的是你放屁了，奥！我消化比较好，对不对？', answer: 1 },
        { question: '那天看到一个美女在雨中奔波，你很伤心，上去就把它撕了，然后旁边来了几个人揍了你一顿，你无故撕人家广告牌，所以你是活该？', answer: 1 },
        { question: '观自在菩萨，阿弥陀佛，救救我，好！谢啦！一个祈祷者的自述，然后1+1=2了？', answer: 1 },
        { question: '有一条狗后面跟个主人，它就横行霸道，主人不在了，它更横行霸道，小八！不说说你，怀念忠犬八公？', answer: 1 },
        { question: '皮特和诺顿配合的第一部电影是搏击俱乐部？', answer: 1 },
        { question: '美国丽人里凯文史派西最后是被他女儿的男朋友的爸爸杀的，也就是他邻居的儿子的爸爸？', answer: 1 },
        { question: '1945年日本宣布无条件投降，是因为打过不了，差点灭族了？', answer: 1 },
        { question: '牛牛有13块钱，阳阳给了他4块，结果他们两个钱一样多，那么阳阳原来有17块？', answer: 2 },
        { question: '1元钱一瓶汽水，喝完后两个空瓶换一瓶汽水，你有20元钱，那么你最多可以喝45瓶水？', answer: 2 },
        { question: '山上还有山，打一字是出？', answer: 1 },
        { question: '积善之家必有余庆，积不善之家必有余殃，这句话出自伟大的《易经》？', answer: 1 },
        { question: '《大学》的宗旨是修身齐家治国平天下，现在很多家庭矛盾都是这个原因？', answer: 1 },
        { question: '抱歉！有钱真的可以无所欲为！这句话鲜明解释了现代人的观念？', answer: 1 },
        { question: '做程序压力也没那么大吧！一个25十三岁长相却看起来像52岁的程序员的自述？', answer: 1 },
        { question: '你可能会问了，这都是什么破疑问，还没有我的游戏好玩呢，错！你的想法揭穿了你的冲动？', answer: 1 },
        { question: '为什么叫单身狗，因为有钱真的可以为所欲为？', answer: 1 },
        { question: '或许来自深山上的隐者才知道，大自然被污染成什么样子了，而我们还在这享乐，所以要爱护大自然？', answer: 1 },
        { question: '为什么现在新奇百怪的病那么多，千奇百怪的事也那么多，因为我们的方向都是错的？', answer: 1 },
        { question: '小强的爸爸被人给杀了，却没人报警，小强躲在角落里很害怕，看着爸爸的尸体被人碾塌并被扔到垃圾桶，小强发誓下辈子再也不做蟑螂了，所以杀蟑螂不犯法？', answer: 1 },
        { question: '老家隔壁老王写信说你都好多天没去他那了，他很想你，要不你明天就去吧，毕竟他一直对你很好，去了别忘记帮我问好，至少让他知道我还在，第二天老王死了，根据字面所述，老王是气死的？', answer: 0 },
    ];
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
        //十二生肖  连连看  营救女友  
        //一笔画  
        this.allScenes = {};
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
        //添加事件
        this.addEvent();
    };
    //添加事件
    GameScene.prototype.addEvent = function () {
        EventCenter.instance().addEventListener(GameEvent.START_GAME, this.startGame, this);
        EventCenter.instance().addEventListener(GameEvent.GOTO_NEXT, this.gotoNext, this);
    };
    //回菜单
    GameScene.prototype.gotoMenu = function () {
        if (this._currentScene) {
            this._currentScene.exit();
        }
        this._overScene.exit();
        this._menuScene.enter();
        GameSound.instance().stopMusic();
    };
    //game over
    GameScene.prototype.gotoOver = function () {
        if (this._currentScene) {
            this._currentScene.exit();
        }
        if (GameData.isWxGame) {
            WXApi.updateRankLvl();
        }
        this._menuScene.exit();
        this._overScene.enter();
        GameData.currentLevel = 0;
        GameSound.instance().stopMusic();
    };
    //下一关
    GameScene.prototype.gotoNext = function (evt) {
        if (evt === void 0) { evt = null; }
        var lvl = GameData.currentLevel;
        lvl++;
        GameData.currentLevel = lvl;
        // GameData.currentLevel = 32;
        Game.instance().gameView.guideView.show();
        this._menuScene.exit();
        this._overScene.exit();
        if (this._currentScene) {
            this._currentScene.exit();
        }
    };
    //开始当前关卡
    GameScene.prototype.startGame = function (evt) {
        if (evt === void 0) { evt = null; }
        GameSound.instance().playMusic();
        var config = GameData.getCurrentSceneData();
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
        this.stopMusic();
        if (this._music == null) {
            this._music = WXApi.createInnerAudioContext(this.audio_url + "bg.mp3");
            this._music.loop = true;
        }
        this._music.play();
    };
    GameSound.prototype.stopMusic = function () {
        if (this._music) {
            this._music.stop();
        }
    };
    GameSound.prototype.playSound = function (type) {
        if (this._sound) {
            this._sound.destroy();
        }
        this._sound = WXApi.createInnerAudioContext(this.soundsVec[type]);
        this._sound.play();
        this.soundsVec.loop = false;
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
    GameEvent.GOTO_NEXT = 'goto_next';
    return GameEvent;
}(egret.Event));
__reflect(GameEvent.prototype, "GameEvent");
var ScoreItem = (function (_super) {
    __extends(ScoreItem, _super);
    function ScoreItem() {
        var _this = _super.call(this) || this;
        _this.score = 0;
        _this.tarScore = 0;
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
    };
    //目标分和当前分
    ScoreItem.prototype.setSTScore = function (score, tarScore) {
        this.score = score;
        if (tarScore) {
            this.tarScore = tarScore;
        }
        this.scoreTxt.text = "\u5206\u6570 " + this.score + "  \u76EE\u6807 " + this.tarScore;
    };
    //分数
    ScoreItem.prototype.setScore = function (score) {
        this.score = score;
        this.scoreTxt.text = "\u5206\u6570 " + score;
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
        egret.startTick(function (timeStamp) {
            EgretRender.world(render);
            return false;
        }, EgretRender);
    };
    EgretRender.stop = function (cb) {
        if (cb === void 0) { cb = null; }
        egret.stopTick(function (timeStamp) {
            if (cb)
                cb();
            return false;
        }, EgretRender);
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
        var btn = SpriteUtil.createButton('开始');
        btn.x = SpriteUtil.stageCenterX - btn.width / 2;
        btn.y = SpriteUtil.stageCenterY;
        this.addChild(btn);
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            GameSound.instance().playSound('click');
            EventCenter.instance().dispatchEvent(new GameEvent(GameEvent.GOTO_NEXT));
        }, this);
        var rankbtn = SpriteUtil.createText('排行榜', 40, 0xEEB422);
        rankbtn.x = SpriteUtil.stageCenterX;
        rankbtn.y = btn.y + 200;
        this.addChild(rankbtn);
        rankbtn.touchEnabled = true;
        rankbtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (!GameData.isWxGame)
                return;
            GameSound.instance().playSound('click');
            Game.instance().gameView.rankView.open();
        }, this);
    };
    MenuScene.prototype.enter = function () {
        _super.prototype.enter.call(this);
        if (!this.isInitOpenDataCtx) {
            this.isInitOpenDataCtx = true;
            var openDatactx = platform['openDataContext'];
            //由于没有服务器 暂时使用avatarUrl 标识用户
            openDatactx.postMessage({ command: 'cmd_openId', openId: GameData.wxUserInfo.avatarUrl });
        }
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
        var text = new egret.TextField();
        text.name = 'target_text';
        text.textAlign = 'center';
        text.text = 'Game\nOver';
        text.size = 120;
        text.textColor = 0xFF0000;
        text.stroke = 1;
        text.strokeColor = 0xffffff;
        text.bold = true;
        text.width = SpriteUtil.stageWidth;
        text.y = SpriteUtil.stageHeight / 2 - 200;
        this.addChild(text);
        var btn = SpriteUtil.createButton('回主页');
        btn.x = SpriteUtil.stageCenterX - btn.width / 2;
        btn.y = SpriteUtil.stageCenterY + 100;
        this.addChild(btn);
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            GameSound.instance().playSound('click');
            Game.instance().gameScene.gotoMenu();
        }, this);
    };
    return OverScene;
}(BaseScene));
__reflect(OverScene.prototype, "OverScene");
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
                if (str == _this.dataVo.tData) {
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
        this.group.x = 5;
        this.group.y = 200;
        var len = arr.length;
        var size = columns == 10 ? wid - 20 : wid - 40;
        for (var i = 0; i < len; i++) {
            var text = this.createText(arr[i], size, wid);
            text.x = (wid + 5) * (i % columns);
            text.y = (wid + 5) * Math.floor(i / columns);
            this.group.addChild(text);
        }
        this.addChild(this.group);
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
    };
    Scene_002.prototype.textClk = function (evt) {
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
            if (this.currentSelect.text == evt.target.text) {
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
    Scene_002.prototype.createText = function (name, size, width) {
        if (size === void 0) { size = 60; }
        if (width === void 0) { width = 0; }
        var text = new egret.TextField();
        text.size = size;
        text.text = name;
        text.textColor = 0x0000ff;
        text.stroke = 0.5;
        text.strokeColor = 0x000000;
        text.width = width;
        text.height = width;
        text.background = true;
        text.backgroundColor = 0x00C5CD;
        text.textAlign = 'center';
        text.verticalAlign = 'middle';
        text.bold = true;
        text.touchEnabled = true;
        text.addEventListener(egret.TouchEvent.TOUCH_TAP, this.textClk, this);
        return text;
    };
    Scene_002.prototype.enter = function () {
        _super.prototype.enter.call(this);
        this.timeItem.start();
    };
    Scene_002.prototype.exit = function () {
        _super.prototype.exit.call(this);
        while (this.numChildren > 1) {
            var child = this.getChildAt(this.numChildren - 1);
            if (child instanceof egret.TextField) {
                child.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.textClk, this);
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
        _this.angleSpeed4 = 0.08;
        _this.speedDir = 1;
        _this.isTouching = false;
        _this.categories = [0x0001, 0x0002, 0x0004, 0x0008, 0x0010, 0x0020, 0x0040, 0x0080];
        _this.playerCategory = 0x0100;
        _this.isRunning = true;
        _this.init();
        return _this;
    }
    Scene_003.prototype.init = function () {
        var _this = this;
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
        var enemy8 = this.createEnemy(160, 100, this.categories[5]);
        Matter.World.add(world, enemy8);
        var enemy9 = this.createEnemy(310, 200, this.categories[5]);
        Matter.World.add(world, enemy9);
        var enemy10 = this.createEnemy(460, 100, this.categories[5]);
        Matter.World.add(world, enemy10);
        this.enemies = [enemy1, enemy2, enemy3, enemy4, enemy5, enemy6, enemy7, enemy8, enemy9, enemy10];
        //飞镖
        var arrowspr1 = SpriteUtil.createText('🐙', 50, 0xff0000);
        var arrow1 = Matter.Bodies.circle(100, 300, arrowspr1.width / 2, {
            label: 'Body_enemy',
            friction: 0,
            frictionAir: 0,
            render: {
                sprite: arrowspr1
            }
        }, 0);
        var arrowspr2 = SpriteUtil.createText('🐙', 50, 0xff0000);
        var arrow2 = Matter.Bodies.circle(SpriteUtil.stageWidth - 100, 400, arrowspr2.width / 2, {
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
        //player
        var playerSpr = SpriteUtil.createText('👦', 80);
        this.player = Matter.Bodies.circle(50, 1250, playerSpr.width / 2, {
            stiffness: 1,
            collisionFilter: {
                category: this.playerCategory
            },
            render: {
                sprite: playerSpr
            }
        }, 0);
        //target
        var girl = SpriteUtil.createText('👧', 80);
        this.girlbdy = Matter.Bodies.circle(SpriteUtil.stageCenterX, girl.height / 2 + 10, girl.width / 2, {
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
        //更新
        Matter.Events.on(this.engine, 'beforeUpdate', this.beforeUpdateHandle.bind(this));
        //碰撞检测
        Matter.Events.on(this.engine, 'collisionStart', this.collisionHandle.bind(this));
        playerSpr.touchEnabled = true;
        playerSpr.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function (evt) {
            _this.isTouching = true;
        }, this);
        playerSpr.addEventListener(egret.TouchEvent.TOUCH_MOVE, function (evt) {
            if (_this.isTouching) {
                Matter.Body.setPosition(_this.player, { x: evt['stageX'], y: evt['stageY'] });
            }
        }, this);
        playerSpr.addEventListener(egret.TouchEvent.TOUCH_END, function (evt) {
            _this.isTouching = false;
        }, this);
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
        Matter.Body.setVelocity(this.enemies[10], { x: this.speedDir * 5, y: 0 });
        Matter.Body.setVelocity(this.enemies[11], { x: -this.speedDir * 5, y: 0 });
    };
    //bdfore update
    Scene_003.prototype.beforeUpdateHandle = function (evt) {
        if (!this.isRunning)
            return;
        if (this.enemies[10].position.x > SpriteUtil.stageWidth) {
            this.speedDir = -1;
            Matter.Body.setVelocity(this.enemies[10], { x: this.speedDir * 5, y: 0 });
            Matter.Body.setVelocity(this.enemies[11], { x: -this.speedDir * 5, y: 0 });
        }
        if (this.enemies[10].position.x < 0) {
            this.speedDir = 1;
            Matter.Body.setVelocity(this.enemies[10], { x: this.speedDir * 5, y: 0 });
            Matter.Body.setVelocity(this.enemies[11], { x: -this.speedDir * 5, y: 0 });
        }
    };
    //collisionStart
    Scene_003.prototype.collisionHandle = function (evt) {
        var pairs = evt.pairs;
        for (var _i = 0, pairs_2 = pairs; _i < pairs_2.length; _i++) {
            var pair = pairs_2[_i];
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
        for (var i = 0; i < num; i++) {
            var t1 = SpriteUtil.createText('🔥', radius * 2, 0xff0000, false);
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
            var bag = SpriteUtil.createText(box, 100);
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
        this.giftDisplay = SpriteUtil.createText(this.dataVo.tData, 100);
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
            this.intervalTime = 150;
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
            var leftTime_1 = this.timeItem.leftTime;
            this.timeItem.stop();
            egret.Tween.get(this.giftDisplay).to({ alpha: 1 }, 300).call(function () {
                egret.Tween.removeTweens(_this.giftDisplay);
                if (leftTime_1 >= 10) {
                    EffectUtil.showResultEffect(EffectUtil.PERFECT);
                }
                else if (leftTime_1 >= 5) {
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
        console.log('targetIndex:' + this.targetIndex);
        this.playDrop();
    };
    Scene_004.prototype.exit = function () {
        egret.Tween.removeAllTweens();
        _super.prototype.exit.call(this);
    };
    return Scene_004;
}(BaseScene));
__reflect(Scene_004.prototype, "Scene_004");
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
            this._gameScene.gotoMenu();
        }
        else {
            WXApi.getSetting();
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
        var snum = this.dataVo.sData.length;
        if (num == 16 && snum == 9) {
            this.createRandomPic(arr, 1, 4);
            this.createRandomPic(arr, 2, 6);
            this.createRandomPic(arr, 0, 6);
            this.createRandomPic(arr, 7, 3);
            this.createRandomPic(arr, 5, 2);
            this.createRandomPic(arr, 7, 4);
            this.createRandomPic(arr, 0, 7);
        }
        else if (num == 16 && snum == 16) {
            this.createRandomPic(arr, 9, 12);
            this.createRandomPic(arr, 10, 14);
            this.createRandomPic(arr, 8, 15);
            this.createRandomPic(arr, 6, 11);
            this.createRandomPic(arr, 7, 13);
            this.createRandomPic(arr, 3, 12);
            this.createRandomPic(arr, 4, 10);
        }
    };
    Scene_006.prototype.startGame = function () {
        this.picSprs.push(this.tarSprite);
        this.tarSprite.touchEnabled = true;
        this.tarSprite.addEventListener(egret.TouchEvent.TOUCH_TAP, this.selectClk, this);
        this.picSprs.sort(function (a, b) { return Math.random() > 0.5 ? 1 : -1; });
        var num = this.dataVo.tData;
        var cols = Math.sqrt(num);
        var scale = (SpriteUtil.stageWidth - 50) / (this.tarSprite.width * cols);
        var wid = scale * this.tarSprite.width;
        var sprite = new egret.Sprite();
        for (var i = 0; i < this.picSprs.length; i++) {
            var xx = (i % cols) * (wid + 10);
            var yy = 100 + (wid + 20) * Math.floor(i / cols);
            this.picSprs[i].x = xx;
            this.picSprs[i].y = yy;
            sprite.addChild(this.picSprs[i]);
            this.picSprs[i].scaleX = scale;
            this.picSprs[i].scaleY = scale;
        }
        this.addChild(sprite);
        sprite.x = SpriteUtil.stageCenterX - sprite.width / 2;
        sprite.y = 100;
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
        var cols = Math.sqrt(len);
        var wid = (SpriteUtil.stageWidth - 120) / cols;
        var sprite = new egret.Sprite();
        for (var i = 0; i < len; i++) {
            var item = SpriteUtil.createText(arr[i], 100);
            var scale = wid / item.width;
            item.scaleX = scale;
            item.scaleY = scale;
            item.x = wid / 2 + (i % cols) * (wid + 10);
            item.y = wid / 2 + (wid + 10) * Math.floor(i / cols);
            sprite.addChild(item);
        }
        sprite.graphics.beginFill(0x707070);
        sprite.graphics.drawRect(0, 0, (wid + 10) * cols, (wid + 20) * cols);
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
            point.y = 120 + 120 * Math.floor(i / 5);
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
                        spr_1.text = '';
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
                if (!item.visible && item.text == '') {
                    spr = item;
                    break;
                }
            }
        }
        if (!spr) {
            spr = SpriteUtil.createText(char, 100);
            this.pools.push(spr);
            spr.addEventListener(egret.TouchEvent.TOUCH_TAP, function (evt) {
                if (_this.isOperating)
                    return;
                GameSound.instance().playSound('click');
                var spr = evt.target;
                if (spr.name == _this.dataVo.sData[0]) {
                    spr.visible = false;
                    spr.text = '';
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
            spr.text = char;
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
        this.passArr = [];
        this.animalsArr.sort(function (a, b) {
            if (Math.random() > 0.5)
                return 1;
            if (Math.random() < 0.5)
                return -1;
            return 0;
        });
        this.animalSpr = SpriteUtil.createText(this.animalsArr[this.needCount], 100);
        this.animalSpr.y = SpriteUtil.stageCenterY - 100;
        this.animalSpr.scaleX = 2;
        this.animalSpr.scaleY = 2;
        this.addChild(this.animalSpr);
        this.emojiSpr = SpriteUtil.createText('😭', 100);
        this.emojiSpr.scaleX = 3;
        this.emojiSpr.scaleY = 3;
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
        this.animalSpr.text = animal;
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
                _this.emojiSpr.text = emoji;
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
        console.log(this.passArr);
        var askstr = "\u8C1C\u9898:\u627E\u51FA\u6240\u6709\u53D1\u51FA\u8868\u60C5" + this.dataVo.tData + "\u7684\u52A8\u7269";
        var text = SpriteUtil.createText(askstr, 36, 0x0000FF);
        text.x = SpriteUtil.stageCenterX;
        text.y = 150;
        this.addChild(text);
        for (var i = 0; i < this.animalsArr.length; i++) {
            var spr = SpriteUtil.createText(this.animalsArr[i], 100);
            spr.x = 100 + (i % 5) * 125;
            spr.y = 250 + 125 * Math.floor(i / 5);
            spr.touchEnabled = true;
            spr.addEventListener(egret.TouchEvent.TOUCH_TAP, this.selectClk, this);
            this.addChild(spr);
        }
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
        this.timeItem.start();
    };
    Scene_008.prototype.selectClk = function (evt) {
        if (this.isOperating)
            return;
        GameSound.instance().playSound('click');
        var text = evt.target;
        var isFind = false;
        var len = this.passArr.length;
        for (var i = len - 1; i >= 0; i--) {
            var obj = this.passArr[i];
            if (obj.emoji == this.dataVo.tData && obj.animal == text.text) {
                text.alpha = 0.5;
                text.touchEnabled = false;
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
        var auncel = Matter.Bodies.rectangle(SpriteUtil.stageCenterX, 300, aspr.width, aspr.height, {
            frictionAir: 0.01,
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
        this.createVc(60, 400, 0x000000);
        this.createVc(SpriteUtil.stageWidth - 100, 400, 0x000000);
        var lspr = SpriteUtil.createRect(200, 10, 0x0000ff);
        var leftBoard = Matter.Bodies.rectangle(80, 120, 200, 10, {
            isStatic: true,
            angle: Math.PI / 4,
            render: {
                sprite: lspr
            }
        });
        var rspr = SpriteUtil.createRect(200, 10, 0x0000ff);
        var rightBoard = Matter.Bodies.rectangle(SpriteUtil.stageWidth - 80, 120, 200, 10, {
            isStatic: true,
            angle: -Math.PI / 4,
            render: {
                sprite: rspr
            }
        });
        Matter.World.add(this.engine.world, [leftBoard, rightBoard]);
        Matter.Events.on(this.engine, 'collisionActive', this.collision.bind(this));
        this.createBoard();
    };
    //碰撞检测
    Scene_009.prototype.collision = function (evt) {
        var pairs = evt.pairs;
        var isHeavy = false;
        var isLight = false;
        var wrongNum = 0;
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
            if (body2.mass == 1) {
                isLight = true;
            }
            else if (body2.mass == 3) {
                isHeavy = true;
            }
            else if (body2.mass == 2) {
                wrongNum++;
            }
        }
        if (isLight && isHeavy) {
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
        else if ((isLight || isHeavy) && wrongNum == 1) {
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
        var count = 10;
        var rans = CommonUtil.getRandomNumFromARange(2, 0, count);
        rans.sort(function (a, b) {
            return a - b;
        });
        console.log(rans);
        var idx = egret.setInterval(function () {
            var spr = SpriteUtil.createText('🏀', 60);
            var xx = nums % 2 == 0 ? 20 : SpriteUtil.stageWidth - 20;
            var mass = rans[0] == nums ? 1 : 2;
            if (mass != 1) {
                mass = rans[1] == nums ? 3 : 2;
            }
            spr.name = "ball_" + nums;
            var ball = Matter.Bodies.circle(xx, 0, spr.height / 2, {
                restitution: 0.5,
                mass: mass,
                label: 'ball',
                render: {
                    sprite: spr
                }
            }, 0);
            Matter.World.add(_this.engine.world, ball);
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
        var bottom = Matter.Bodies.rectangle(SpriteUtil.stageCenterX, SpriteUtil.stageHeight - 200, SpriteUtil.stageWidth, 10, { isStatic: true });
        Matter.World.add(this.engine.world, [left, right, top, bottom]);
    };
    //创建竖直隔板
    Scene_009.prototype.createBoard = function () {
        var bodies = [];
        for (var i = 0; i < 6; i++) {
            var spr = SpriteUtil.createRect(10, 100, Math.ceil(0xffff00 * Math.random()) + 32);
            var board = Matter.Bodies.rectangle(10 + 100 * (i + 1), SpriteUtil.stageCenterY + 100, 10, 100, {
                isStatic: true,
                render: {
                    sprite: spr
                }
            });
            bodies.push(board);
        }
        Matter.World.add(this.engine.world, bodies);
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
//问答 奇趣
var Scene_010 = (function (_super) {
    __extends(Scene_010, _super);
    function Scene_010() {
        var _this = _super.call(this) || this;
        _this.curIndex = 0;
        _this.isOperating = false;
        _this.init();
        return _this;
    }
    Scene_010.prototype.init = function () {
        this.questions = GameData.questions;
        this.questions.sort(function (a, b) {
            if (Math.random() > 0.5)
                return 1;
            if (Math.random() < 0.5)
                return -1;
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
        this.questionTxt.anchorOffsetX = this.questionTxt.width / 2;
        this.questionTxt.anchorOffsetY = this.questionTxt.height / 2;
        this.questionTxt.x = SpriteUtil.stageCenterX;
        this.questionTxt.y = 200;
        this.addChild(this.questionTxt);
        var btn1 = this.createAnswerButton('✅');
        btn1.x = SpriteUtil.stageCenterX - btn1.width;
        btn1.name = 'btn_1';
        var btn2 = this.createAnswerButton('🅾');
        btn2.x = SpriteUtil.stageCenterX;
        btn2.name = 'btn_0';
        var btn3 = this.createAnswerButton('❎');
        btn3.x = SpriteUtil.stageCenterX + btn3.width;
        btn3.name = 'btn_2';
        this.timeItem = new TimeItem(this.dataVo.time);
        this.addChild(this.timeItem);
    };
    Scene_010.prototype.clkSwitch = function (evt) {
        if (this.isOperating)
            return;
        var target = evt.target;
        var name = target.name;
        if (!name || name.search('btn_') < 0)
            return;
        var idx = name.split('_')[1];
        if (idx == this.questions[this.curIndex].answer) {
            this.curIndex++;
            this.askQuestion();
        }
        else {
            this.isOperating = true;
            this.timeItem.stop();
            EffectUtil.showResultEffect();
        }
    };
    Scene_010.prototype.createAnswerButton = function (str) {
        var text = SpriteUtil.createText(str, 160);
        text.y = SpriteUtil.stageCenterY + 100;
        this.addChild(text);
        text.touchEnabled = true;
        text.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clkSwitch, this);
        return text;
    };
    Scene_010.prototype.askQuestion = function () {
        var question = this.questions[this.curIndex];
        this.questionTxt.text = "\u7591\u60D1\uFF1A" + question.question;
    };
    Scene_010.prototype.enter = function () {
        _super.prototype.enter.call(this);
        this.askQuestion();
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
        console.log(rand);
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
        btn.y = SpriteUtil.stageHeight - 260;
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
                var leftTime_2 = this.timeItem.leftTime;
                this.timeItem.stop();
                var idx_1 = egret.setTimeout(function () {
                    egret.clearTimeout(idx_1);
                    if (leftTime_2 >= 60) {
                        EffectUtil.showResultEffect(EffectUtil.PERFECT);
                    }
                    else if (leftTime_2 >= 45) {
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
        console.clear();
        console.table(this.paths);
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
        // this.timeItem.start();
    };
    Scene_012.prototype.exit = function () {
        _super.prototype.exit.call(this);
        for (var _i = 0, _a = this.vsArr; _i < _a.length; _i++) {
            var shape = _a[_i];
            shape.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.clkStart, this);
            this.removeChild(shape);
        }
    };
    return Scene_012;
}(BaseScene));
__reflect(Scene_012.prototype, "Scene_012");
//石头剪刀布
var Scene_013 = (function (_super) {
    __extends(Scene_013, _super);
    function Scene_013() {
        var _this = _super.call(this) || this;
        _this.nameArr = ["阿诺", "爱因斯坦", "牛顿", "作者", "憨豆", "贝克汉姆", "范冰冰", "成龙", "吴京"];
        _this.currWinIndex = 0;
        _this.isOperating = false;
        _this.score = 0;
        _this.init();
        return _this;
    }
    Scene_013.prototype.init = function () {
        var len = this.dataVo.sData.length;
        var wid = (SpriteUtil.stageWidth - 100) / len;
        var scale = wid / 100;
        for (var i = 0; i < len; i++) {
            var btn = SpriteUtil.createButton(this.dataVo.sData[i], 100, 100, 0x000fff, 64);
            btn.x = 30 + i * (wid + 10);
            btn.y = SpriteUtil.stageCenterY + 100;
            btn.scaleX = scale;
            btn.scaleY = scale;
            this.addChild(btn);
            btn.name = 'index_' + i;
            btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.playDoing, this);
        }
        this.enemySpr = SpriteUtil.createText(this.dataVo.sData[0], 100);
        this.enemySpr.scaleX = 3;
        this.enemySpr.scaleY = 3;
        this.enemySpr.x = SpriteUtil.stageCenterX;
        this.enemySpr.y = SpriteUtil.stageCenterY - 200;
        this.addChild(this.enemySpr);
        //
        this.nameTxt = SpriteUtil.createText("", 48);
        this.addChild(this.nameTxt);
        this.nameTxt.y = this.enemySpr.y - 250;
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
        var index = Math.floor(len * Math.random());
        var str = this.nameArr[Math.floor(this.nameArr.length * Math.random())];
        this.nameTxt.text = str;
        this.nameTxt.x = SpriteUtil.stageCenterX - this.nameTxt.width;
        this.enemySpr.text = this.dataVo.sData[index];
        this.currWinIndex = index > 0 ? (index - 1) % len : len - 1;
    };
    Scene_013.prototype.playDoing = function (evt) {
        if (this.isOperating)
            return;
        GameSound.instance().playSound('click');
        var name = evt.target.name;
        var index = name.split('_')[1];
        if (index == this.currWinIndex) {
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
    //选择水果
    Scene_014.prototype.createFruit = function () {
        var arr = ['apple_jpg', 'banana_jpg', 'cherry_jpg', 'grape_jpg', 'melon_jpg', 'orange_jpg', 'peach_jpg', 'pear_jpg', 'pineapple_jpg', 'pomegranate_jpg', 'strawberry_jpg', 'watermelon_jpg'];
        var len = arr.length;
        this.beforeContainer = new egret.Sprite();
        this.addChild(this.beforeContainer);
        for (var i = 0; i < len; i++) {
            var xx = 25 + 225 * (i % 3);
            var yy = 150 + 225 * Math.floor(i / 3);
            var bit = new egret.Bitmap(RES.getRes(arr[i]));
            bit.width = 220;
            bit.height = 220;
            bit.x = xx;
            bit.y = yy;
            bit.name = arr[i];
            bit.touchEnabled = true;
            bit.addEventListener(egret.TouchEvent.TOUCH_TAP, this.selectPic, this);
            this.beforeContainer.addChild(bit);
        }
        this.titleTxt = SpriteUtil.createText('那么你最喜欢下面哪种水果？', 32, 0x0000ff);
        this.titleTxt.x = SpriteUtil.stageCenterX;
        this.titleTxt.y = 100;
        this.addChild(this.titleTxt);
    };
    Scene_014.prototype.selectPic = function (evt) {
        GameSound.instance().playSound('click');
        var name = evt.target.name;
        this.createSeparate(name);
        this.beforeContainer.visible = false;
        this.removeChild(this.beforeContainer);
        this.titleTxt.text = '没错！还原这个你最爱的水果吧！';
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
                _this.checkOver();
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
var Scene_016 = (function (_super) {
    __extends(Scene_016, _super);
    function Scene_016() {
        var _this = _super.call(this) || this;
        _this.pointArr = [];
        _this.isBegin = false;
        _this.init();
        return _this;
    }
    Scene_016.prototype.init = function () {
        this.shape = new egret.Shape();
        this.addChild(this.shape);
        var shape = new egret.Shape();
        shape.graphics.beginFill(0xff0000, 0.001);
        shape.graphics.drawRect(0, 0, SpriteUtil.stageWidth, SpriteUtil.stageHeight);
        shape.graphics.endFill();
        this.addChild(shape);
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchHandler, this);
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchHandler, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.touchHandler, this);
        this.player = SpriteUtil.createText(this.dataVo.sData, 48);
        this.addChild(this.player);
        this.player.visible = false;
    };
    Scene_016.prototype.touchHandler = function (evt) {
        if (evt.type == egret.TouchEvent.TOUCH_BEGIN) {
            this.isBegin = true;
        }
        else if (evt.type == egret.TouchEvent.TOUCH_MOVE) {
            if (this.isBegin) {
                var point = { x: evt['stageX'], y: evt['stageY'] };
                this.shape.graphics.lineStyle(10, 0xff0000, 1);
                this.shape.graphics.lineTo(point.x, point.y);
                if (!this.lastPoint) {
                    this.pointArr.push(point);
                }
                else {
                    var mx = this.lastPoint.x - point.x;
                    var my = this.lastPoint.y - point.y;
                    var mid = Math.sqrt(mx * mx + my * my);
                    if (mid > 10) {
                        this.pointArr.push(point);
                    }
                }
                this.lastPoint = point;
            }
        }
        else if (evt.type == egret.TouchEvent.TOUCH_END) {
            this.isBegin = false;
            console.log(this.pointArr);
            this.player.x = this.pointArr[0].x;
            this.player.y = this.pointArr[0].y;
            this.player.visible = true;
            this.startFly();
        }
    };
    Scene_016.prototype.startFly = function () {
        var _this = this;
        var index = 1;
        var len = this.pointArr.length;
        var idx = egret.setInterval(function () {
            if (index >= len) {
                egret.clearInterval(idx);
                return;
            }
            var point = _this.pointArr[index];
            _this.player.x = point.x;
            _this.player.y = point.y;
            index++;
        }, this, 40);
    };
    return Scene_016;
}(BaseScene));
__reflect(Scene_016.prototype, "Scene_016");
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
    CommonUtil.allEmoji = ['😑', '😶', '😏', '😣', '😥', '😮', '😯', '😪', '😫', '😴', '😌', '😛', '😜', '😝', '😒', '😓', '😔', '😕', '😲', '😷', '😖', '😞', '😟', '😤', '😢', '😭', '😦', '😧', '😨', '😬', '😰', '😱', '😳', '😵', '😡', '😠'];
    CommonUtil.allAnimals = ['🐒', '🐕', '🐈', '🐅', '🐆', '🐎', '🐂', '🐄', '🐖', '🐏', '🐪', '🐘', '🐀', '🐇', '🐓', '🐦', '🐧', '🐢', '🐍', '🐉', '🐳', '🐬', '🐟', '🐤', '🐊'];
    return CommonUtil;
}());
__reflect(CommonUtil.prototype, "CommonUtil");
var EffectUtil = (function () {
    function EffectUtil() {
    }
    EffectUtil.showResultEffect = function (type) {
        var _this = this;
        if (type === void 0) { type = 0; }
        var str = '不可能!';
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
                    Game.instance().gameScene.gotoOver();
                }
                else {
                    EventCenter.instance().dispatchEvent(new GameEvent(GameEvent.GOTO_NEXT));
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
    SpriteUtil.createRect = function (width, height, color) {
        if (color === void 0) { color = 0x00ff00; }
        var rect = new egret.Shape();
        rect.graphics.beginFill(color);
        rect.graphics.drawRect(0, 0, width, height);
        rect.graphics.endFill();
        rect.anchorOffsetX = width / 2;
        rect.anchorOffsetY = height / 2;
        return rect;
    };
    //多边形
    SpriteUtil.createPolygon = function (points, color) {
        if (color === void 0) { color = 0x00ff00; }
        if (!points || !points.length) {
            return;
        }
        var polygon = new egret.Shape();
        var len = points.length;
        polygon.graphics.beginFill(color);
        polygon.graphics.lineStyle(1, color);
        polygon.graphics.moveTo(points[0], points[1]);
        for (var i = 0; i < len; i += 2) {
            polygon.graphics.lineTo(points[i], points[i + 1]);
            polygon.graphics.moveTo(points[i], points[i + 1]);
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
    SpriteUtil.createImage = function (src) {
        var bitmap = new egret.Bitmap(RES.getRes(src));
        bitmap.anchorOffsetX = bitmap.width / 2;
        bitmap.anchorOffsetY = bitmap.height / 2;
        return bitmap;
    };
    //create a button
    SpriteUtil.createButton = function (label, width, height, backgroundColor, size) {
        if (width === void 0) { width = 200; }
        if (height === void 0) { height = 80; }
        if (backgroundColor === void 0) { backgroundColor = 0x0000ff; }
        if (size === void 0) { size = 40; }
        var btn = new egret.Sprite();
        var rect = new egret.Shape();
        rect.graphics.lineStyle(5, 0xB03060);
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
                                Game.instance().gameScene.gotoMenu();
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
            Game.instance().gameScene.gotoMenu();
            return;
        }
        var sysInfo = wx.getSystemInfoSync();
        console.log(sysInfo);
        var button = wx.createUserInfoButton({
            type: 'text',
            text: '登陆',
            style: {
                left: sysInfo.windowWidth / 2 - 60,
                top: sysInfo.windowHeight / 2 - 25,
                width: 120,
                height: 50,
                backgroundColor: '#0000ff',
                color: '#00ff00',
                textAlign: 'center',
                fontSize: 40,
                opacity: 1,
                borderRadius: 10,
            }
        });
        button.onTap(function (res) {
            if (res.errMsg == 'getUserInfo:ok') {
                button.hide();
                button.destroy();
                WXApi.showShareMenu();
                GameData.wxUserInfo = res.userInfo;
                Game.instance().gameScene.gotoMenu();
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
    //创建音频
    WXApi.createInnerAudioContext = function (url) {
        var audio = wx.createInnerAudioContext();
        audio.src = url;
        return audio;
    };
    //set user level
    //排行榜数据更新
    WXApi.updateRankLvl = function () {
        var openDataContext = platform['openDataContext'];
        openDataContext.postMessage({
            command: 'cmd_user',
            level: GameData.currentLevel
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
    };
    LoadingUI.prototype.onProgress = function (current, total) {
        this.textField.text = "Loading..." + current + "/" + total;
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
        this.tipsTxt.y = SpriteUtil.stageHeight / 2 - 200;
        this.addChild(this.tipsTxt);
        var btn = SpriteUtil.createButton('我知道了');
        btn.x = SpriteUtil.stageCenterX - btn.width / 2;
        btn.y = SpriteUtil.stageCenterY + 100;
        this.addChild(btn);
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            GameSound.instance().playSound('click');
            _this.close();
            EffectUtil.playReadyGo();
        }, this);
    };
    GuideView.prototype.show = function () {
        this.tipsTxt.textFlow = this.getDesc();
        this.tipsTxt.y = SpriteUtil.stageCenterY - this.tipsTxt.height;
        _super.prototype.open.call(this);
    };
    GuideView.prototype.getDesc = function () {
        var config = GameData.config[GameData.currentLevel];
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
var DataVO = (function () {
    function DataVO() {
        //关卡
        this.level = 0;
        //关卡类型
        this.levelType = 0;
        //关卡名称
        this.title = '神秘的关卡';
        //关卡描述
        this.desc = '能告诉我你是怎么来到这里的吗？';
        //关卡限制时间
        this.time = 0;
        //关卡target分数
        this.score = 0;
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
    };
    DataVO.prototype.reset = function () {
        this.level = 0;
        this.levelType = 0;
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