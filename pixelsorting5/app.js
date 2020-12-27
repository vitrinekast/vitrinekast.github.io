var window_width = window.innerWidth;
var window_height = window.innerHeight;
var margin = 32;

const s = (sketch) => {

    var img, colors, rectSize, tileCount;
    var xoff = 0;
    var shapes = [];
    var input;

    handleFile = (file) => {
        
        if (file.type === 'image') {
            img = sketch.loadImage(file.data, (img) => {
                console.log(img)
                img.resize(400, (img.height / img.width) * 400);
                createShapes();
            });
        } else {
            img = null;
        }
    }


    createShapes = () => {
        shapes = [];
        var shapePossibilities = ['vert-lines', 'fill', 'hor-lines', 'dots'];
        img.loadPixels();
        sketch.noStroke();
        console.log('oi!')


        for (var y = 10; y < img.height; y += (img.height / 4)) {
            for (var x = 10; x < img.width; x += (img.width / 4)) {

                xoff = xoff + 0.01;
                var yPos = y - sketch.map(sketch.noise(xoff), 0, 1, 0, img.height / 4);
                var xPos = x - sketch.map(sketch.noise(xoff), 0, 1, 0, img.width / 4);

                shapes.push({
                    i: (x + y) / 100,
                    x: xPos + sketch.random(-50, 50),
                    y: yPos + sketch.random(-50, 50),
                    c: img.get(xPos, yPos),
                    h: sketch.map(sketch.random(), 0, 1, 100, 150),
                    w: sketch.map(sketch.random(), 0, 1, 60, 100),
                    shape: sketch.random(shapePossibilities)
                })

            }
        }
    }

    sketch.preload = () => {
        let url = sketch._userNode.getAttribute('data-url');
        console.log(`preloading img: ${url}`);
        img = sketch.loadImage(url);
    }

    sketch.setup = () => {

        input = sketch.createFileInput(handleFile);
        input.position(100, 0);
        sketch.createCanvas(window.innerWidth, window.innerHeight)
        img.resize(400, (img.height / img.width) * 400);
        createShapes();

    }

    sketch.draw = () => {
        sketch.background('black');
        shapes.forEach((shape) => {

            sketch.noFill();
            sketch.strokeWeight(2);
            sketch.noStroke()

            let curX = sketch.map(sketch.mouseX * shape.i, 0, sketch.width, shape.x - 10, shape.x + 10);
            let curY = sketch.map(sketch.mouseY * shape.i, 0, sketch.height, shape.y - 10, shape.y + 10);

            switch (shape.shape) {
                case 'vert-lines':
                    sketch.stroke(shape.c)
                    for (var x = 0; x < shape.w; x += 5) {
                        sketch.line(x + curX, curY, x + curX, curY + shape.h)
                    }
                    break;
                case 'hor-lines':
                    sketch.stroke(shape.c)
                    for (var y = 0; y < shape.h; y += 5) {
                        sketch.line(curX, curY + y, curX + shape.w, curY + y)
                    }
                    break;
                case 'dots':
                    sketch.fill(shape.c)
                    for (var x = 0; x < shape.w; x += 5) {
                        for (var y = 0; y < shape.h; y += 5) {
                            sketch.ellipse(x + curX, y + curY, 2);
                        }

                    }
                    break;
                case 'fill':
                    sketch.noStroke();
                    sketch.fill(shape.c);
                    sketch.rect(curX, curY, shape.w, shape.h);
                    break;
            }
        })

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