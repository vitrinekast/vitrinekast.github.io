const s = (sketch) => {

    var img, timestamp;
    var timeAgo = 20;
    var filename, username, timestamp;
    var size = 400;
    sketch.preload = () => {
        let url = sketch._userNode.getAttribute('data-url');
        console.log(`preloading img: ${url}`);
        img = sketch.loadImage(url);
        filename = url.substring(url.lastIndexOf("/") + 1, url.lastIndexOf(".")).split("_");
        username = '@' + filename[0];
        timestamp = new Date(`${filename[1].substring(0, 4)}-${filename[1].substring(4, 6)}-${filename[1].substring(6, 8)}`);
        timestamp.setHours(filename[2].substring(0, filename[2].indexOf('h')))
        timestamp.setMinutes(filename[2].substring(filename[2].indexOf('h') + 2, filename[2].indexOf('m')))
        timestamp.setSeconds(filename[2].substring(filename[2].indexOf('m') + 2, filename[2].indexOf('s')))
        timeAgo = Math.round((new Date() - timestamp) / (1000 * 60 * 60 * 24));
        console.log(timeAgo);
        document.title += username;
    }

    sketch.setup = () => {

        sketch.createCanvas(size, size);
        if (img.width > img.height) {
            img.resize(sketch.width, (img.height / img.width) * sketch.width);
        } else {
            img.resize(sketch.width * (img.width / img.height), sketch.width);

        }

        sketch.image(img, 0, 0);

        img.loadPixels();
        sketch.noStroke();
        sketch.clear();
        var nothing = 0;
        var dif = sketch.max(0, 20 - timeAgo);
        var rgbDif = sketch.round(timeAgo / 2);

        for (let x = 0; x < img.width; x++) {
            for (let y = 0; y < img.height; y++) {
                var index = ((y * img.width) + x) * 4;

                if (typeof img.pixels[index + (img.width * 4)] === 'number') {

                    if (timeAgo > 5) {
                        // img.pixels[index + 1] = img.pixels[index + 1 + (sketch.max(1, sketch.min(rgbDif, 2)) * 4)];
                        // img.pixels[index + 2] = img.pixels[index + 2 + (sketch.max(1, sketch.min(rgbDif, 2)) * 4)];
                        // calculate brightness of the image
                        hsp1 = Math.sqrt(
                            0.299 * (img.pixels[index] * img.pixels[index]) +
                            0.587 * (img.pixels[index + 1] * img.pixels[index + 1]) +
                            0.114 * (img.pixels[index + 2] * img.pixels[index + 2])
                        );

                        hsp2 = Math.sqrt(
                            0.299 * (img.pixels[index + (img.width * 4)] * img.pixels[index + (img.width * 4)]) +
                            0.587 * (img.pixels[index + (img.width * 4) + 1] * img.pixels[index + (img.width * 4) + 1]) +
                            0.114 * (img.pixels[index + (img.width * 4) + 2] * img.pixels[index + (img.width * 4) + 2])
                        );
                        if (hsp1 > hsp2) {
                            var store = [img.pixels[index], img.pixels[index + 1], img.pixels[index + 2], img.pixels[index + 3]];

                            img.pixels[index + (img.width * 4)] = store[0] - dif;
                            img.pixels[index + 1 + (img.width * 4)] = store[1] - dif;
                            img.pixels[index + 2 + (img.width * 4)] = store[2] - dif;
                            img.pixels[index + 3 + (img.width * 4)] = store[3] - dif;
                        } else {
                            nothing++;
                            if (typeof img.pixels[index + (img.height * 4)] === 'number') {
                                img.pixels[index + (img.height * 4)] = img.pixels[index] + dif;
                                img.pixels[index + (img.height * 4) + 1] = img.pixels[index + 1] + dif;
                                img.pixels[index + (img.height * 4) + 2] = img.pixels[index + 2] + dif;
                                img.pixels[index + (img.height * 4) + 3] = img.pixels[index + 3] + dif;
                            }
                            img.pixels[index ] = img.pixels[index  + (sketch.max(1, sketch.min(10, rgbDif)) * 4)];
                            img.pixels[index + 1] = img.pixels[index + 1 + (sketch.max(1, sketch.min(10, rgbDif)) * 4)];
                            img.pixels[index + 2] = img.pixels[index + 2 + (sketch.max(1, sketch.min(10, rgbDif)) * 4)];
                        }
                    } else {
                        
                    }



                    // img.pixels[index ] = img.pixels[index + 2 + (1 * 4)];
                    // if (rgbDif > 1 && x > (timeAgo * 10) < x < (timeAgo * 15)) {
                    //     img.pixels[index] = img.pixels[index + (rgbDif * 4)];
                    // }
                    // if (rgbDif > 1 && x > (timeAgo * 6) < x < (timeAgo * 8) && y > (timeAgo*8 - x)) {
                    

                    // }







                };

            }
        }
        console.log(`${nothing / (img.width * img.height) * 100}%  ${dif} ${timeAgo}`);
        img.updatePixels();
        sketch.image(img, 0, 0);
        sketch.text(username, 10, 30);
        sketch.text(filename, 10, 45);
        sketch.text(`${timeAgo}/ ${dif} / ${rgbDif}`, 10, 60);
    };

    sketch.draw = () => {

    };
};


var sketches = [];
document.querySelectorAll('.fn-sketch').forEach((elem, index) => {
    sketches[index] = new p5(s, elem);
})


document.getElementById('store').addEventListener('click', function (e) {
    console.log(sketches);
    // sketches.forEach((sketch) => {
    //     var file_name = `export_${document.title}_${sketch._userNode.getAttribute('data-url')}_${new Date().toDateString().replace(' ', '_')}`;
    //     sketch.saveCanvas(file_name, 'png');
    // })
})