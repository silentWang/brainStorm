var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
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
//# sourceMappingURL=SpriteUtil.js.map