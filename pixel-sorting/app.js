var window_width = window.innerWidth;
var window_height = window.innerHeight;

var image_url = '../assets/image_1_md.png';

var image_ratio;
var image_size;
var margin = 32;

function preload() {
    img = loadImage(image_url);
}

function setup() {
    createCanvas(window_width, window_height);
    image_ratio = img.height / img.width;
    image_size = window_width / 4;
    pixelDensity(1);
    // image(img, margin, margin, image_size, image_size * image_ratio);
    img.loadPixels();
    loadPixels();

}

var sortPixels = function () {

    for (var i = 4; i < img.pixels.length - 4; i += 4) {
        // if(Math.random() > .8) { return false; }

        let cc = color(img.pixels[i], img.pixels[i + 1], img.pixels[i + 2]);
        var nc = color(img.pixels[i + 4], img.pixels[i + 5], img.pixels[i + 6]);

        if (lightness(cc) < lightness(nc)) {

            var storedValue = {};
            ['r', 'g', 'b', 'a'].forEach((elem, index) => {
                storedValue[elem] = img.pixels[i + index];
                img.pixels[i + index] = img.pixels[i + index + 4];
                img.pixels[i + index + 4] = storedValue[elem];
            })
        } else {

            var storedValue = {};
            ['r', 'g', 'b', 'a'].forEach((elem, index) => {
                storedValue[elem] = img.pixels[i + index];
                img.pixels[i + index] = img.pixels[i + index - 4];
                img.pixels[i + index - 4] = storedValue[elem];
            })
        }

    }

    for (let x = 0; x < img.width; x++) {
        for (let y = 0; y < img.height; y++) {
            // // Calculate the 1D location from a 2D grid
            let loc = (x + y * img.width) * 4;
            let pixloc = (y * width + x) * 4;



            // let cc = color(img.pixels[loc], img.pixels[loc + 1], img.pixels[loc + 2]);
            // var nc = color(img.pixels[loc + 4], img.pixels[loc + 5], img.pixels[loc + 6]);

            // if (lightness(cc) < lightness(nc)) {

            //     var storedValue = {};
            //     ['r', 'g', 'b', 'a'].forEach((elem, index) => {
            //         storedValue[elem] = img.pixels[loc + index];
            //         img.pixels[loc + index] = img.pixels[loc + index + 4];
            //         img.pixels[loc + index + 4] = storedValue[elem];

            //     })
            // }

            pixels[pixloc] = img.pixels[loc];
            pixels[pixloc + 1] = img.pixels[loc + 1];
            pixels[pixloc + 2] = img.pixels[loc + 2];
            pixels[pixloc + 3] = img.pixels[loc + 3];
        }
    }

}
function draw() {
    colorMode(HSL);

    loadPixels();
    sortPixels();
    sortPixels();
    sortPixels();

    updatePixels();


    // let d = pixelDensity();




    // updatePixels();

    //image(img, margin + image_size + margin, margin, image_size, image_size * image_ratio);

}

document.getElementById('store').addEventListener('click', function (e) {
    var file_name = `export_${document.title}_${new Date().toDateString().replace(' ', '_')}`;

    saveCanvas(file_name, 'png');

})