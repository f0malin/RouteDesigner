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

    $("reset").addEventListener("click", reset);
    $("zoomin").addEventListener("touchend", zoomIn);
    $("zoomout").addEventListener("touchend", zoomOut);
    $("clear").addEventListener("click", clear);
    points.addEventListener("mousedown", mousedown);
    points.addEventListener("mouseup", mouseup);
    points.addEventListener("mousemove", mousemove);
    points.addEventListener("mouseout", mouseout);
    points.addEventListener("touchstart", touchstart);
    points.addEventListener("touchend", touchend);
    points.addEventListener("touchmove", touchmove);
    points.addEventListener("touchcancel", mouseout);
    
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
        var dx = current_dx + event.clientX - lastX;
        var dy = current_dy + event.clientY - lastY;
        lastX = event.clientX;
        lastY = event.clientY;
        current_dx = dx;
        current_dy = dy;
        photo.style.transform = "translate(" + dx + "px," + dy + "px) scale(" + current_scale + ")";
        points.style.transform = "translate(" + dx + "px," + dy + "px) scale(" + current_scale + ")";
    }

    function calcXY(x, y) {
        var coord = {};
        coord.x = (x - current_dx) / current_scale;
        coord.y = (y - current_dy) / current_scale;
        return coord;
    }
    
    function mouseclick(event) {
        ctx2.fillStyle="#FF0000";
        var coord = calcXY(event.clientX, event.clientY);
        ctx2.fillRect(coord.x-10, coord.y-10, 20, 20);
    }
    
    function imgLoaded() {
        console.log("image width and height: " + img.width + " " + img.height);

        //photo.width = img.width;
        //photo.height = img.height;
        //points.width = width;
        //points.height = width;
        
        //reset();
        x = 0;
        y = 0;
        scale = 1.0;
        loop();
    }

    var x, y, scale;
    function loop() {
        ctx2.fillRect(0, 0, width, height);
        ctx2.drawImage(img, x, y, img.width, img.height, 0, 0, img.width*scale, img.height*scale);
    }

    function zoomIn() {
        scale *= 1.2;
        loop();
        //current_scale *= 1.2;
        //photo.style.transform =  "translate(" + current_dx + "px," + current_dy + "px) scale(" + current_scale + "," + current_scale + ")";
        //points.style.transform =  "translate(" + current_dx + "px," + current_dy + "px) scale(" + current_scale + "," + current_scale + ")";
    }

    function zoomOut() {
        scale *= 0.833333;
        loop();
        /*current_scale *= 0.83333;
        photo.style.transform =  "translate(" + current_dx + "px," + current_dy + "px) scale(" + current_scale + "," + current_scale + ")";
        points.style.transform =  "translate(" + current_dx + "px," + current_dy + "px) scale(" + current_scale + "," + current_scale + ")";*/
    }

    function reset() {
        var xscale = width / img.width;
        var yscale = height / img.height;
        var scale;
        if (xscale < yscale) {
            scale = xscale;
        } else {
            scale = yscale;
        }
        console.log("scale: " + scale);
        current_scale = scale;
        current_dx = 0;
        current_dy = 0;
        photo.style.transform = "scale(" + scale + "," + scale + ")";
        points.style.transform = "scale(" + scale + "," + scale + ")";
    }

    function clear() {
        ctx2.clearRect(0, 0, img.width, img.height);
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
