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
        colors = [];
        sketch.createCanvas(400, (img.height/img.width)*400)


        var shapes = ['vert-lines', 'fill', 'hor-lines', 'fills'];
        img.loadPixels();
        sketch.noStroke();

        for (var i = 0; i < 4; i++) {
            var x = sketch.floor(sketch.random(0, sketch.width));
            var y = sketch.floor(sketch.random(0, sketch.height));
            colors.push(img.get(x, y));
        }

        for (var i = 0; i < 14; i++) {
            var pos = {
                x: sketch.floor(sketch.random(0, sketch.width)),
                y: sketch.floor(sketch.random(0, sketch.height))
            }
            var w = sketch.map(sketch.random(), 0, 1, 20, sketch.width/3);
            var h = sketch.map(sketch.random(), 0, 1, 20, sketch.width/3);
            var c = sketch.random(colors);



            switch (sketch.random(shapes)) {
                case 'vert-lines':
                    sketch.stroke(c)
                    for (var x = 0; x < w; x += 10) {
                        sketch.line(x + pos.x, pos.y, x + pos.x, pos.y + h)
                    }
                    break;
                case 'hor-lines':
                    sketch.stroke(c)
                    for (var y = 0; y < h; y += 10) {
                        sketch.line(pos.x, pos.y + y, pos.x + w, pos.y + y)
                    }
                    break;
                case 'fill':
                    sketch.noStroke();
                    sketch.fill(sketch.random(colors));
                    sketch.rect(pos.x, pos.y, w, h);
                    break;
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