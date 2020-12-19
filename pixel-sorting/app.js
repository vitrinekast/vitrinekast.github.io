var window_width = window.innerWidth;
var window_height = window.innerHeight;
var margin = 32;

const s = (sketch) => {

    var img;

    sortPixels = (canvasPixels, imagePixels) => {

        for (var i = 4; i < imagePixels.length - 4; i += 4) {

            let cc = color(imagePixels[i], imagePixels[i + 1], imagePixels[i + 2]);
            var nc = color(imagePixels[i + 4], imagePixels[i + 5], imagePixels[i + 6]);

            if (lightness(cc) < lightness(nc)) {

                var storedValue = {};
                ['r', 'g', 'b', 'a'].forEach((elem, index) => {
                    storedValue[elem] = imagePixels[i + index];
                    imagePixels[i + index] = imagePixels[i + index + 4];
                    imagePixels[i + index + 4] = storedValue[elem];
                })
            } else {

                var storedValue = {};
                ['r', 'g', 'b', 'a'].forEach((elem, index) => {
                    storedValue[elem] = imagePixels[i + index];
                    imagePixels[i + index] = imagePixels[i + index - 4];
                    imagePixels[i + index - 4] = storedValue[elem];
                })
            }

        }

        for (let x = 0; x < img.width; x++) {
            for (let y = 0; y < img.height; y++) {
                // // Calculate the 1D location from a 2D grid
                let loc = (x + y * img.width) * 4;
                let pixloc = (y * width + x) * 4;
                canvasPixels[pixloc] = imagePixels[loc];
                canvasPixels[pixloc + 1] = imagePixels[loc + 1];
                canvasPixels[pixloc + 2] = imagePixels[loc + 2];
                canvasPixels[pixloc + 3] = imagePixels[loc + 3];
            }
        }

    }

    sketch.preload = () => {
        let url = sketch._userNode.getAttribute('data-url');
        console.log(`preloading img: ${url}`);
        img = sketch.loadImage(url);
    }

    sketch.setup = () => {
        sketch.createCanvas(img.width, img.height)
        sketch.pixelDensity(.5);
        sketch.img.loadPixels();
        sketch.loadPixels();
    };

    sketch.draw = () => {
        sketch.colorMode(HSL);

        sketch.loadPixels();
        pixels = sortPixels(pixels, img.pixels);
        pixels = sortPixels(pixels, img.pixels);
        pixels = sortPixels(pixels, img.pixels);

        sketch.updatePixels();
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


function draw() {
    colorMode(HSL);

    loadPixels();
    sortPixels();
    sortPixels();
    sortPixels();

    updatePixels();


}

document.getElementById('store').addEventListener('click', function (e) {
    var file_name = `export_${document.title}_${new Date().toDateString().replace(' ', '_')}`;

    saveCanvas(file_name, 'png');

})