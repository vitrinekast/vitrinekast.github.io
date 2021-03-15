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
        sketch.noStroke();
        var step = 10;
        sketch.strokeWeight(step);

        
        for (let i = step / 2; i < img.width; i += step) {

            let c = img.get(i, 0);
            sketch.stroke(c);
            sketch.line(i, 0, i * step, img.height);
            c = img.get(img.width - i, 0);
            sketch.stroke(c);
            sketch.line(img.width - i, img.height, img.width - (i * step), 0);
        }

        for (let i = step / 2; i < img.height; i += step) {
            let c = img.get(0, i);
            sketch.stroke(c);
            sketch.line(0, i * step, img.width, i);
            c = img.get(0, img.height - i);
            sketch.stroke(c);
            sketch.line(img.width, img.width - (i * step), 0, img.width - i);
         
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