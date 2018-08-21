class SpriteUtil{
    constructor(){

    }
    static stageWidth = 0;
    static stageHeight = 0;
    static stageCenterX = 0;
    static stageCenterY = 0;

    //创建圆形
    static createCircle(radius:number,color:number = 0x00ff00){
        let circle = new egret.Shape();
        circle.graphics.beginFill(color);
        circle.graphics.drawCircle(0,0,radius);
        circle.graphics.endFill();
        return circle;
    }
    //创建矩形
    static createRect(width:number,height:number,color:number = 0x00ff00){
        let rect = new egret.Shape();
        rect.graphics.beginFill(color);
        rect.graphics.drawRect(0,0,width,height);
        rect.graphics.endFill();
        rect.anchorOffsetX = width/2;
        rect.anchorOffsetY = height/2;
        return rect;
    }
    //多边形
    static createPolygon(vertices,color:number = 0x00ff00){
        // if(!vertices || !vertices.length){
        //     vertices = [0,0]
        // }
        // let polygon = new egret.Shape();
        // polygon.graphics.beginFill(color);
        // polygon.graphics.lineStyle(1,color);
        // polygon.graphics.moveTo()
    }
    //创建bitmap
    static createImage(src:string){
        let bitmap = new egret.Bitmap(RES.getRes(src));
        bitmap.anchorOffsetX = bitmap.width/2;
        bitmap.anchorOffsetY = bitmap.height/2;
        return bitmap;
    }
    //create a button
    static createButton(label:string,width = 200,height = 80){
        let btn = new egret.Sprite();
        let rect = new egret.Shape();
        rect.graphics.beginFill(0x00ff00);
        rect.graphics.drawRect(0,0,width,height);
        rect.graphics.endFill();

        let text = new egret.TextField();
        text.text = label;
        text.size = 40;
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
    }

}