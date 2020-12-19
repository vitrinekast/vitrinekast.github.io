var sketchCount = 0;

const s = (sketch) => {

    var max_corners = 24;

    let img, buffer, result;
    var corners = [];

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

    sketch.preload = () => {
        let url = sketch._userNode.getAttribute('data-url');
        console.log(`preloading img: ${url}`);
        img = sketch.loadImage(url);
    }

    sketch.setup = () => {
        buffer = new jsfeat.matrix_t(img.width, img.height, jsfeat.U8C1_t);
        sketch.pixelDensity(3);
        sketch.createCanvas(img.width, img.height);
        var pixel_count = img.width * img.height;
        while (--pixel_count >= 0) {
            corners[pixel_count] = new jsfeat.keypoint_t(0, 0, 0, 0);
        }

        jsfeat.fast_corners.set_threshold(0);
        sketch.noLoop();
    };

    sketch.draw = () => {
        // sketch.background(0);
        img.loadPixels();
        sketch.tint(255, 80);
        sketch.image(img, 0, 0, img.width, img.height);
        sketch.tint(255, 250);
        // get the corners 
        if (img.pixels.length > 0) { // don't forget this!

            blurSize = sketch.map(90, 0, 100, 1, 12);
            jsfeat.imgproc.grayscale(img.pixels, img.width, img.height, buffer);
            jsfeat.imgproc.gaussian_blur(buffer, buffer, blurSize, 0);

            jsfeat.fast_corners.detect(buffer, corners, 5);


            corners = filter_corners(corners);
            result = jsfeatToP5(buffer, result);

        }

        // get dominant color

        let dominant_color = get_dominant_colors(img);


        // draw the shape
        var cx = img.width / 2;
        var cy = img.height / 2;

        dominant_color.setAlpha(50)
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
    sketches[index] = new p5(s, elem);
})


document.getElementById('store').addEventListener('click', function (e) {
    sketches.forEach((sketch) => {
        var file_name = `export_${document.title}_${sketch._userNode.getAttribute('data-url')}_${new Date().toDateString().replace(' ', '_')}`;
        sketch.saveCanvas(file_name, 'png');
    })
})