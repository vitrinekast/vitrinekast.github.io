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

    var img;
    var size = 50;
    var index = 0;
    var xoff = 0;
    var moveInwards = true;
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
        diameter = space / 8;
        var xPositions = []

        positions = [];


        for (var i = (diameter / 2); i < space; i += diameter) {
            xPositions.push(i);
        }

        for (let i = 0; i < xPositions.length; i++) {

            positions.push({ x: xPositions[i], y: xPositions[i] });
            for (let j = i + 1; j < xPositions.length; j++) {
                positions.push({ x: xPositions[i], y: xPositions[j] });
                positions.push({ x: xPositions[j], y: xPositions[i] });
            }
        }

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
        

        console.group('one rect')
        for (let index = 0; index < elemPerRect; index++) {
            if (positions[0]) {
                sketch.ellipse(positions[0].x, positions[0].y, diameter);
                console.log('drew one!', positions)
                positions.splice(0, 1);
            } else {
                console.log('op!')
            }
        }
        console.groupEnd();

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