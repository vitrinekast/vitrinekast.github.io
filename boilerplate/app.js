var window_width = window.innerWidth;
var window_height = window.innerHeight;

var image_url = '../assets/image_1.png';

var image_ratio;
var image_size;
var margin = 32;

// image(img, 0, 0, width, height);
// debugger;
// let d = pixelDensity();
// let halfImage = 4 * (width * d) * (height * d / 2);
// loadPixels();
// for (let i = 0; i < halfImage; i++) {
//     pixels[i + halfImage] = pixels[i + 10];
// }
// updatePixels();

function preload() {
    img = loadImage(image_url);
}

function setup() {
    createCanvas(window_width, window_height);
    image_ratio = img.height / img.width;
    image_size = window_width / 4;

    image(img, margin, margin, image_size, image_size * image_ratio);
    fill('white');

    text('"Original" image input', margin, margin * .75);


    image(img, margin + image_size + margin, margin, image_size, image_size * image_ratio);

    text('Fucked up output', margin + image_size + margin, margin * .75);
}

function draw() {

}

document.getElementById('store').addEventListener('click', function(e) {
    var file_name = `export_${document.title}_${new Date().toDateString().replace(' ', '_')}`;
    
    saveCanvas(file_name, 'png');

})