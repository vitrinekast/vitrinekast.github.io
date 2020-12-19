var window_width = window.innerWidth;
var window_height = window.innerHeight;

var image_url = '../assets/image_1_md.png';

var image_ratio;
var image_size;
var margin = 32;
var colors = [];
var multiplier = 4;
function preload() {
    img = loadImage(image_url);
}

function setup() {
    createCanvas(window_width, window_height);
    image_ratio = img.height / img.width;
    image_size = window_width / 4;
    img.loadPixels();

    // colorMode(HSB, 255);
noStroke();
    console.log(img.pixels)


    for(var x = 0; x < img.width; x++) {
        for(var y = 0; y < img.height; y++) {

            let loc = (x + y * img.width) * 4;
            let pixloc = (y * width + x) * 4;
            var c = color(img.pixels[loc], img.pixels[loc + 1], img.pixels[loc + 2]);
            // multiplier = hue(c)/2;
            fill(c) ;
            circle(x * multiplier, y * multiplier, saturation(c));
        }
    }

    



    // updatePixels();
}


document.getElementById('store').addEventListener('click', function (e) {
    var file_name = `export_${document.title}_${new Date().toDateString().replace(' ', '_')}`;

    saveCanvas(file_name, 'png');

})