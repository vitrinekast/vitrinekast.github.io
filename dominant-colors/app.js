var window_width = window.innerWidth;
var window_height = window.innerHeight;
var margin = 32;
var colors = [];
var multiplier = 4;

const s = (sketch) => {

    var img;

    sketch.preload = () => {
        let url = sketch._userNode.getAttribute('data-url');
        console.log(`preloading img: ${url}`);
        img = sketch.loadImage(url);
    }

    sketch.setup = () => {
        sketch.createCanvas(img.width, img.height)
        img.loadPixels();
        sketch.noStroke();
        for (var x = 0; x < img.width; x++) {
            for (var y = 0; y < img.height; y++) {

                let loc = (x + y * img.width) * 4;
                let pixloc = (y * sketch.width + x) * 4;
                var c = sketch.color(img.pixels[loc], img.pixels[loc + 1], img.pixels[loc + 2]);
                sketch.fill(c);
                sketch.circle(x * multiplier, y * multiplier, sketch.saturation(c));
            }
        }
    };

    sketch.draw = () => {

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
