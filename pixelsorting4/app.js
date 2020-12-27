var window_width = window.innerWidth;
var window_height = window.innerHeight;
var margin = 32;

const s = (sketch) => {

    var img, colors, rectSize, tileCount;

    var step = 1;
    var index = 0;
    var goRight = true;
    
    sketch.preload = () => {
        let url = sketch._userNode.getAttribute('data-url');
        let url2 = sketch._userNode.getAttribute('data-url2');
        console.log(`preloading img: ${url}`);
        console.log(`preloading img: ${url2}`);
        img = sketch.loadImage(url);
        img2 = sketch.loadImage(url2);

        
    }

    sketch.setup = () => {
        sketch.createCanvas(400, (img.height / img.width) * 400);
        img.resize(sketch.width, (img.height / img.width)*sketch.width )
        img2.resize(sketch.width, (img2.height / img2.width)*sketch.width )
        img.loadPixels();
        img2.loadPixels();
        sketch.noStroke();
    };

    sketch.draw = () => {
        index = goRight ? index += 1 : index -= 1;
        
        if (index > sketch.width && goRight) {
            goRight = false;
        }

        if (index < 0 && !goRight) {
            goRight = true;
        }

        for (var y = 0; y < sketch.height; y += step) {
            var pos = sketch.map(sketch.width - index, 0, sketch.width, 0, 1.1);
            var grabCurrent = sketch.random() + pos > 0.9;
            // grabCurrent = true;
            if (grabCurrent) {
                var c = img2.get(index, y);
            } else {
                var c = img.get(index, y);
            }

            sketch.fill(c);
            sketch.ellipse(index, y, step);
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