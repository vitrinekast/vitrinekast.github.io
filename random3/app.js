var window_width = window.innerWidth;
var window_height = window.innerHeight;
var margin = 5;

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const s = (sketch) => {
    var size = 100;
    var index = 0;
    var positions = [];
    var diameter;
    var space;
    var elemPerRect = 2;
    sketch.preload = () => {
    }


    sketch.setup = () => {
        sketch.createCanvas(800, 800)
        sketch.noLoop();
        drawGrid();

    };

    drawGrid = () => {
        sketch.clear();

        sketch.background('white');
        space = size - (margin * 2);

        // positions = shuffle(positions);

        for (let x = 0; x < sketch.width; x += size) {
            for (let y = 0; y < sketch.height; y += size) {

                sketch.push();
                var i = index / (sketch.width / size);
                sketch.translate(x + margin, y + margin)
                sketch.noFill();
                sketch.stroke(51);
                sketch.strokeWeight(2);

                drawSomething();
                sketch.pop();
                index++;
            }
        }

    }

    getPosition = (size, diameter) => {
        return (sketch.round(sketch.random(diameter, size - diameter) / diameter) * diameter) - (diameter / 2);
    }

    drawSomething = () => {
        sketch.rect(0, 0, space);
        var offset = margin*2;

        for(var i = 0; i < elemPerRect; i++) {
            var x1  = sketch.random(offset*-1, offset);
            var y1  = sketch.random(0, space);
            var x2  = sketch.random(space - offset, space + offset);
            var y2  = sketch.random(0, space);
            sketch.line(x1, y1, x2, y2)
        }

    }

    sketch.draw = () => {
        drawGrid();
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