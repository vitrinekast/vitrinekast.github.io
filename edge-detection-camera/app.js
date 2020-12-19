var sketchCount = 0;

const s = (sketch) => {
    var capture;
    var max_corners = 100;
    let w, h;
    let img, buffer, result;
    var corners = [];
    let loaded = false;

    jsfeatToP5 = (src, dst) => {
        if (!dst || dst.width != src.cols || dst.height != src.rows) {
            dst = sketch.createImage(src.cols, src.rows);
        }

        var n = src.data.length;
        dst.loadPixels();
        var srcData = src.data;
        var dstData = dst.pixels;
        for (var i = 0, j = 0; i < n; i++) {
            var cur = srcData[i];
            dstData[j++] = cur;
            dstData[j++] = cur;
            dstData[j++] = cur;
            dstData[j++] = 255;
        }
        dst.updatePixels();
        return dst;
    }


    filter_corners = (corners) => {
        corners.filter(corner => corner.score > 0 && corner.x + corner.y > 0);
        
        corners.sort((a, b) => (a.score < b.score) ? 1 : -1);
        return corners.length > max_corners ? corners.slice(0, max_corners) : corners;
    }

    get_dominant_colors = (src_image) => {
        let count = r = g = b = 0;
        var i = -4;

        while ((i += (src_image.width * 1 * 4)) < src_image.pixels.length) {
            ++count;
            r += src_image.pixels[i];
            g += src_image.pixels[i + 1];
            b += src_image.pixels[i + 2];
        }

        // ~~ used to floor values
        r = ~~(r / count);
        g = ~~(g / count);
        b = ~~(b / count);

        return sketch.color(r, g, b);
    }

    sketch.setup = () => {

        w = 640;
        h = 480;

        capture = sketch.createCapture({
            audio: false,
            video: {
                width: w,
                height: h
            }

        }, function (e) {
            loaded = true;
            sketch.createCanvas(w, h);

            capture.hide();
            buffer = new jsfeat.matrix_t(w, h, jsfeat.U8C1_t);

            jsfeat.fast_corners.set_threshold(20);

        });
    };

    sketch.draw = () => {
        if (!loaded) return false;

        var pixel_count = w * h;
        while (--pixel_count >= 0) {
            corners[pixel_count] = new jsfeat.keypoint_t(0, 0, 0, 0);
        }

        sketch.clear();
        sketch.background(51);
        // sketch.image(capture, 0, 0, 320, 240);

        capture.loadPixels();
        // sketch.tint(255, 80);
        // sketch.image(img, 0, 0, img.width, img.height);
        // sketch.tint(255, 250);
        // get the corners 
        if (capture.pixels.length > 0) { // don't forget this!
            var lowThreshold = sketch.map(15, 0, 100, 0, 255);
            var highThreshold = sketch.map(25, 0, 100, 0, 255)
            blurSize = sketch.map(40, 0, 100, 1, 12);
            jsfeat.imgproc.grayscale(capture.pixels, w, h, buffer);
            jsfeat.imgproc.gaussian_blur(buffer, buffer, blurSize, 0);

            jsfeat.fast_corners.detect(buffer, corners, 5);
            corners = filter_corners(corners);
            result = jsfeatToP5(buffer, result);
            // sketch.tint(255, 80);
            // sketch.image(result, 0, 0, w, h);
            // sketch.tint(255, 250);

        }

        // get dominant color

        // let dominant_color = get_dominant_colors(img);
        let dominant_color = sketch.color('red');

        // draw the shape
        var cx = w / 2;
        var cy = h / 2;

        dominant_color.setAlpha(90)

        sketchCount++;

        for (var i = 0; i < corners.length; ++i) {
            var x = corners[i].x;
            var y = corners[i].y;

            sketch.fill(dominant_color);
            sketch.noStroke();
            sketch.circle(x, y, 8)

            if (i > 1) {
                sketch.line(x, y, corners[i - 1].x, corners[i - 1].y);
                sketch.triangle(x, y, corners[i - 1].x, corners[i - 1].y, corners[i - 2].x, corners[i - 2].y);
            }

        }
    };
};


var sketches = [];
document.querySelectorAll('.fn-sketch').forEach((elem, index) => {
    console.log(elem.id)
    sketches[index] = new p5(s, elem);
})


document.getElementById('store').addEventListener('click', function (e) {
    sketches.forEach((sketch) => {
        var file_name = `export_${document.title}_${sketch._userNode.getAttribute('data-url')}_${new Date().toDateString().replace(' ', '_')}`;
        sketch.saveCanvas(file_name, 'png');
    })
})