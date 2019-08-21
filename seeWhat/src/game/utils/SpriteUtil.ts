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
    static createRect(width:number,height:number,color:number = 0x00ff00,isLine:boolean = false){
        let rect = new egret.Shape();
        rect.graphics.beginFill(color);
        if(isLine){
            rect.graphics.lineStyle(1,0x000000);
        }
        rect.graphics.drawRect(0,0,width,height);
        rect.graphics.endFill();
        rect.anchorOffsetX = width/2;
        rect.anchorOffsetY = height/2;
        return rect;
    }
    //多边形
    static createPolygon(points:Array<number>,color:number = 0x0000ff){
        if(!points || !points.length){
            return;
        }
        let polygon = new egret.Shape();
        let len = points.length;
        polygon.graphics.lineStyle(1,color);
        polygon.graphics.beginFill(color);
        polygon.graphics.moveTo(points[0],points[1]);
        for(let i = 0;i < len;i+=2){
            polygon.graphics.lineTo(points[i],points[i+1]);
            // polygon.graphics.moveTo(points[i],points[i+1]);
        }
        polygon.graphics.lineTo(points[0],points[1]);
        polygon.graphics.endFill();
        polygon.anchorOffsetX = polygon.width/2;
        polygon.anchorOffsetY = polygon.height/2;
        return polygon;
    }
    //text 图
    static createText(str:string,size:number = 40,color = 0xff0000,isBackground:boolean = false,backgroundColor = 0x0000ff){
        let text = new egret.TextField();
        text.size = size;
        text.text = str;
        text.textColor = color;
        text.background = isBackground;
        text.backgroundColor = backgroundColor;
        text.stroke = 1;
        text.strokeColor = 0xCDAD00;
        text.textAlign = 'center';
        text.verticalAlign = 'middle';
        text.bold = true;
        text.anchorOffsetX = text.width/2;
        text.anchorOffsetY = text.height/2;
        return text;
    }
    //创建bitmap
    static createImage(name:string,isBackground = false,backgroundColor = 0x9FB6CD){
        let bitmap = new egret.Bitmap(RES.getRes(`images_json#${name}`));
        if(isBackground){
            let sprite = new egret.Sprite();
            sprite.graphics.beginFill(backgroundColor);
            sprite.graphics.drawRect(0,0,bitmap.width,bitmap.height);
            sprite.graphics.endFill();
            sprite.addChild(bitmap);
            sprite.anchorOffsetX = sprite.width/2;
            sprite.anchorOffsetY = sprite.height/2;
            sprite.touchEnabled = true;
            return sprite;
        }
        bitmap.anchorOffsetX = bitmap.width/2;
        bitmap.anchorOffsetY = bitmap.height/2;
        bitmap.touchEnabled = true;
        return bitmap;
    }
    //create a button
    static createButton(label:string,width = 200,height = 80,backgroundColor = 0x00FF00,size = 40,lineWidth = 0,lineColor = 0x666666){
        let btn = new egret.Sprite();
        let rect = new egret.Shape();
        rect.graphics.lineStyle(lineWidth,lineColor);
        rect.graphics.beginFill(backgroundColor);
        rect.graphics.drawRoundRect(0,0,width,height,height);
        rect.graphics.endFill();

        let text = new egret.TextField();
        text.text = label;
        text.size = size;
        text.textAlign = 'center';
        text.width = width;
        text.y = 25;
        text.stroke = 1;
        text.strokeColor = 0x333333;
        text.bold = true;
        text.touchEnabled = false;

        btn.addChild(rect);
        btn.addChild(text);
        btn.touchEnabled = true;
        return btn;
    }

}