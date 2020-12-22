var window_width = window.innerWidth;
var window_height = window.innerHeight;
var margin = 32;

const s = (sketch) => {

    var img, colors, rectSize, tileCount;

    sketch.preload = () => {
        let url = sketch._userNode.getAttribute('data-url');
        console.log(`preloading img: ${url}`);
        img = sketch.loadImage(url);
    }

    sketch.setup = () => {
        sketch.createCanvas(img.width, img.height)
        tileCount = 100;
        rectSize = sketch.width / tileCount;
        colors = [];
        console.log(sketch.red);

        img.loadPixels();

        for (let gridY = 0; gridY < tileCount; gridY++) {
            for (let gridX = 0; gridX < tileCount; gridX++) {
                var px = sketch.int(gridX * rectSize);
                var py = sketch.int(gridY * rectSize);

                var i = (py * img.width + px) * 4;
                var c = sketch.color(img.pixels[i], img.pixels[i + 1], img.pixels[i + 2], img.pixels[i + 3])
                colors.push(c);
            }
        }

    };

    sketch.draw = () => {

        sortColorsSlow(sketch, colors, 'red');
        sortColorsSlow(sketch, colors, 'red');
        sortColorsSlow(sketch, colors, 'red');
        sortColorsSlow(sketch, colors, 'red');
        var i = 0;
        sketch.noStroke();

        for (let gridY = 0; gridY < tileCount; gridY++) {
            for (let gridX = 0; gridX < tileCount; gridX++) {
                sketch.fill(colors[i])
                sketch.rect(gridX * rectSize, gridY * rectSize, rectSize, rectSize);
                i++;

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