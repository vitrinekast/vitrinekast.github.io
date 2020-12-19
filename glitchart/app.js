var sketchCount = 0;

const s = (sketch) => {

    var img;

    sketch.preload = () => {
        let url = sketch._userNode.getAttribute('data-url');
        console.log(`preloading img: ${url}`);
        img = sketch.loadImage(url);
    }

    sketch.setup = () => {
        sketch.createCanvas(img.width, img.height);
        img.loadPixels();

        // colorMode(HSB, 255);
        sketch.noStroke();

        // sketch.image(img, 0, 0);

        var steps = 10;
        var step = 10;
        sketch.strokeWeight(step);
        for (let i = step / 2; i < img.width; i += step) {
            // if (i % 1 === 0) {
            let c = img.get(i, 0);
            sketch.stroke(c);
            sketch.line(i, 0, i * step, img.height);
            // }
        }

        for (let i = step / 2; i < img.height; i += step) {
            // if (i % 1 === 0) {
            let c = img.get(0, i);
            sketch.stroke(c);
            sketch.line(0, i * step, img.width, i);
            // }
        }

        for (let i = step / 2; i < img.width; i += step) {
            // if (i % 1 === 0) {
            let c = img.get(img.width - i, 0);
            sketch.stroke(c);
            sketch.line(img.width - i, img.height, img.width - (i * step), 0);
            // }
        }

        for (let i = step / 2; i < img.height; i += step) {
            // if (i % 1 === 0) {
            let c = img.get(0, img.height - i);
            sketch.stroke(c);
            sketch.line(img.width, img.width - (i * step), 0, img.width - i);
            // }
        }

        // for (let i = 0; i < img.height; i++) {
        //     if (i % 1 === 0) {
        //         let c = img.get(0, i);
        //         sketch.stroke(c);
        //         sketch.line(0, i, img.width, i);
        //     }
        // }
    };

    sketch.draw = () => {

    };
};


var sketches = [];
document.querySelectorAll('.fn-sketch').forEach((elem, index) => {
    console.log(elem.id)
    sketches[index] = new p5(s, elem);
})


document.getElementById('store').addEventListener('click', function (e) {
    sketches.forEach((sketch) => {
        console.log('oi!')
        var file_name = `export_${document.title}_${sketch._userNode.getAttribute('data-url')}_${new Date().toDateString().replace(' ', '_')}`;
        sketch.saveCanvas(file_name, 'png');
    })
})