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
    $("zoomin").addEventListener("click", zoomIn);
    $("zoomout").addEventListener("click", zoomOut);
    $("clear").addEventListener("click", clear);
    points.addEventListener("mousedown", mousedown);
    points.addEventListener("mouseup", mouseup);
    points.addEventListener("mousemove", mousemove);
    points.addEventListener("mouseout", mouseout);
    
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
        console.log("x, y, dx, dy: " + event.clientX + " " + event.clientY + " " + dx + " " + dy);
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

        photo.width = img.width;
        photo.height = img.height;
        points.width = img.width;
        points.height = img.height;
        
        ctx.drawImage(img, 0, 0);
        reset();
    }

    function zoomIn() {
        current_scale *= 1.2;
        console.log("scale: " + current_scale);
        photo.style.transform =  "translate(" + current_dx + "px," + current_dy + "px) scale(" + current_scale + "," + current_scale + ")";
        points.style.transform =  "translate(" + current_dx + "px," + current_dy + "px) scale(" + current_scale + "," + current_scale + ")";
    }

    function zoomOut() {
        current_scale *= 0.83333;
        console.log("scale: " + current_scale);
        photo.style.transform =  "translate(" + current_dx + "px," + current_dy + "px) scale(" + current_scale + "," + current_scale + ")";
        points.style.transform =  "translate(" + current_dx + "px," + current_dy + "px) scale(" + current_scale + "," + current_scale + ")";
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
})();
