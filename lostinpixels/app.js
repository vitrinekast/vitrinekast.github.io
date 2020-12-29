var window_width = window.innerWidth;
var window_height = window.innerHeight;
var margin = 32;

const s = (sketch) => {

    var img, colors, rectSize, tileCount;
    var xoff = 0;
    var shapes = [];
    var input;

    handleFile = (file) => {

        if (file.type === 'image') {
            img = sketch.loadImage(file.data, (img) => {
                console.log(img)
                resizeImage();
                img.loadPixels();
                sketch.noStroke();
                createImage();

            });
        } else {
            img = null;
        }
    }

    resizeImage = () => {
        if (img.width > img.height) {
            img.resize(sketch.width, (img.height / img.width) * sketch.width);
        } else {
            img.resize(sketch.width * (img.width / img.height), sketch.width);
            
        }
        img.loadPixels();
    }

    createImage = () => {
        
        sketch.clear();
        var nothing = 0;

        for (let x = 0; x < img.width; x++) {
            for (let y = 0; y < img.height; y++) {
                var index = ((y * img.width) + x) * 4;

                if (typeof img.pixels[index + (img.width * 4)] === 'number') {

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
                        img.pixels[index + (img.width * 4)] = store[0] - 1;
                        img.pixels[index + 1 + (img.width * 4)] = store[1] -1;
                        img.pixels[index + 2 + (img.width * 4)] = store[2] -1;
                        img.pixels[index + 3 + (img.width * 4)] = store[3] -1;
                    } else {
                        nothing++;
                    }
                };

            }
        }
        // console.log(`${nothing / (img.width * img.height) * 100}%`);
        img.updatePixels();
        sketch.image(img, 0, 0);
    }

    sketch.preload = () => {
        let url = sketch._userNode.getAttribute('data-url');
        console.log(`preloading img: ${url}`);
        img = sketch.loadImage(url);
    }



    sketch.setup = () => {

        input = sketch.createFileInput(handleFile);
        input.position(100, 0);
        sketch.createCanvas(window.innerWidth, window.innerWidth)
        resizeImage();
        sketch.noStroke();

        createImage();

    }

    sketch.draw = () => {
        createImage();
        

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