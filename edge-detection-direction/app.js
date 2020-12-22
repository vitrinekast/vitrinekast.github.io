var sketchCount = 0;
const s = (sketch) => {

    var max_corners = 24;
    var tile_count = 50;
    var corners = [];

    let img, buffer, result, noiseImg, pixel_count, part;

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
        // sketch.colorMode(sketch.HSB);
        sketch.pixelDensity(3);
        sketch.createCanvas(img.width, img.height);
        sketch.noLoop();

        part = sketch.width / tile_count;
        buffer = new jsfeat.matrix_t(img.width, img.height, jsfeat.U8C1_t);
        pixel_count = img.width * img.height;

        while (--pixel_count >= 0) {
            corners[pixel_count] = new jsfeat.keypoint_t(0, 0, 0, 0);
        }

        jsfeat.fast_corners.set_threshold(0);

        img.loadPixels();

        // get the corners 
        if (img.pixels.length > 0) {

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
        dominant_color.setAlpha(.3)
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

        noiseImg = sketch.createImage(img.width, img.width);
        noiseImg.loadPixels();

        var value;
        var patternPixelDataLength = img.width * img.width * 4;

        for (var i = 0; i < patternPixelDataLength; i += 4) {
            value = (Math.random() * 255) | 0;

            noiseImg.pixels[i] = value;
            noiseImg.pixels[i + 1] = value;
            noiseImg.pixels[i + 2] = value;
            noiseImg.pixels[i + 3] = 10;
        }

        noiseImg.updatePixels();

        console.log('setup: done')
    };

    sketch.draw = () => {
        sketch.clear();
        console.log(corners);
        sketch.image(noiseImg, 0, 0, img.width, img.height);

        var dominant_corners = corners.slice(0, 2);

        for (let gridY = 0; gridY < tile_count; gridY++) {
            for (let gridX = 0; gridX < tile_count; gridX++) {
                var posX = sketch.width / tile_count * gridX;
                var posY = sketch.height / tile_count * gridY;
                let point = {};
                
                dominant_corners.forEach((corner) => {
                    corner.distance = sketch.int(sketch.dist(posX, posY, corner.x, corner.y));
                    if (!point.distance || corner.distance < point.distance) point = corner;
                })

                var angle = sketch.atan2(point.y - posY, point.x - posX);
                var imgPixels = img.get(posX, posY);
                var c = sketch.color(imgPixels[0], imgPixels[1], imgPixels[2], imgPixels[3])
                c = sketch.saturation(c)*2;
                // c.setAlpha(255 - point.distance - sketch.random(0, 10));
                sketch.stroke(c);


                sketch.push();
                sketch.translate(posX, posY);
                sketch.rotate(angle);

                sketch.line(0, 0, part, part)
                sketch.pop();

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