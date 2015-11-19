function $(id) {
    return document.getElementById(id);
}

(function() {
    var current_scale = 1.0;
    var current_dx = 0;
    var current_dy = 0;
    
    var draw_area = $("draw_area");
    var photo = $("photo");
    var points = $("points");

    var width = draw_area.offsetWidth;
    var height = draw_area.offsetHeight;
    console.log("photo width and height: " + photo.width + " " + photo.height);
    photo.width = width;
    photo.height = height;
    points.width = width;
    points.height = height;
    console.log("photo offsetWidth and offsetHeight: " + width + " " + height);
    
    var ctx = photo.getContext("2d");
    var ctx2 = points.getContext("2d");

    var img = new Image();
    img.addEventListener("load", imgLoaded, false);
    img.src = "aaa.png";

    $("reset").addEventListener("touchend", reset);
    $("zoomin").addEventListener("touchend", zoomIn);
    $("zoomout").addEventListener("touchend", zoomOut);
    $("clear").addEventListener("touchend", clear);
    $("reset").addEventListener("mouseup", reset);
    $("zoomin").addEventListener("mouseup", zoomIn);
    $("zoomout").addEventListener("mouseup", zoomOut);
    $("clear").addEventListener("mouseup", clear);
    points.addEventListener("mousedown", mousedown);
    points.addEventListener("mouseup", mouseup);
    points.addEventListener("mousemove", mousemove);
    points.addEventListener("mouseout", mouseout);
    points.addEventListener("touchstart", touchstart);
    points.addEventListener("touchend", touchend);
    points.addEventListener("touchmove", touchmove);
    points.addEventListener("touchcancel", mouseout);

    var x, y, scale;
    var pointData = [];
    var dragging = false;
    var lastX, lastY;
    var startX, startY;
    function mousedown(event) {
        lastX = startX = event.clientX;
        lastY = startY = event.clientY;
        dragging = true;
    }

    function mouseup(event) {
        dragging = false;
        if (Math.abs(event.clientX - startX) < 2 && Math.abs(event.clientY - startY) < 2) {
            mouseclick(event);
        }
    }

    function mouseout() {
        dragging = false;
    }

    function mousemove(event) {
        if (!dragging) {
            return;
        }
        x = x + event.clientX - lastX;
        y = y + event.clientY - lastY;
        console.log("x y: " + x + " " + y);
        loop();

        lastX = event.clientX;
        lastY = event.clientY;
    }

    function calcXY(cx, cy) {
        var coord = {};
        coord.x = (cx - x)/scale;
        coord.y = (cy - y)/scale;
        return coord;
    }
    
    function mouseclick(event) {
        var coord = calcXY(event.clientX, event.clientY);
        pointData.push(coord);
        loop();
    }
    
    function imgLoaded() {
        console.log("image width and height: " + img.width + " " + img.height);

        x = 0;
        y = 0;
        scale = 1.0;
        reset(event);
    }


    function loop() {
        ctx2.fillRect(0, 0, width, height);
        ctx2.drawImage(img, 0, 0, img.width, img.height, x, y, img.width*scale, img.height*scale);
        ctx2.fillStyle="#FF0000";
        var i;
        for (i=0;i<pointData.length;i++) {
            var point = pointData[i];
            ctx2.fillRect( (point.x-10)*scale + x, (point.y-10)*scale+y, 20*scale, 20*scale);
        }
        ctx2.fillStyle="#000000";
    }

    function zoomIn(event) {
        event.preventDefault();
        scale *= 1.2;
        loop();
    }

    function zoomOut(event) {
        event.preventDefault();
        scale *= 0.833333;
        loop();
    }

    function reset(event) {
        event.preventDefault();
        x = 0;
        y = 0;
        var xscale = width / img.width;
        var yscale = height / img.height;
        if (xscale < yscale) {
            scale = xscale;
        } else {
            scale = yscale;
        }
        console.log("scale: " + scale);
        loop();
    }

    function clear(event) {
        event.preventDefault();
        pointData = [];
        loop();
    }

    function touchstart(event) {
        if (event.targetTouches.length == 1) {
            event.preventDefault(); // 阻止浏览器默认事件，重要
            var touch = event.targetTouches[0];
            mousedown(touch);
        }
    }

    function touchend(event) {
        if (event.changedTouches.length == 1) {
            event.preventDefault(); // 阻止浏览器默认事件，重要
            var touch = event.changedTouches[0];
            mouseup(touch);
        }
    }

    function touchmove(event) {
        if (event.targetTouches.length == 1) {
            event.preventDefault(); // 阻止浏览器默认事件，重要
            var touch = event.targetTouches[0];
            mousemove(touch);
        }
    }
})();
