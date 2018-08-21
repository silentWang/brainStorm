class GameScene{
    constructor(){
        this.init();
    }

    private _menuScene:MenuScene;
    private _currentScene;

    private init(){
        this._menuScene = new MenuScene();
    }

    get menuScene(){
        return this._menuScene;
    }

    enterScene(){
        this._menuScene.exit();
        if(this._currentScene){
            this._currentScene.exit();
        }
        let scene = new Scene_1();
        scene.enter();
        this._currentScene = scene;
    }

}