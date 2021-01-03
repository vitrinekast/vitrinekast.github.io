var window_width = window.innerWidth;
var window_height = window.innerHeight;
var margin = 5;

const s = (sketch) => {

    var img;
    var size = 400;
    var index = 0;
    var rectIndex = 0;
    var moveInwards = true;
    sketch.preload = () => {
    }


    sketch.setup = () => {
        sketch.createCanvas(800, 800)
        // sketch.noLoop();
        drawGrid();

    };

    drawGrid = () => {
        sketch.clear();
        rectIndex = 0;

        sketch.background('white');
        sketch.push();
        for (let x = 0; x < sketch.width; x += size) {
            for (let y = 0; y < sketch.height; y += size) {

                sketch.push();
                var i = index / (sketch.width / size);
                switch (rectIndex) {
                    case 0:
                        sketch.translate(x + i, y + i)
                        break;
                    case 1:
                        sketch.translate(x + i, y + (i * -1))
                        break;
                    case 2:
                        sketch.translate(x + (i * -1), y + i)
                        break;
                    case 3:
                        sketch.translate(x + (i * -1), y + (i * -1))
                        break;
                    default:
                        sketch.translate(x + i, y + i);
                        break
                }
                sketch.noFill();
                sketch.stroke(51);

                drawSomething();
                sketch.pop();
                rectIndex++;

                if (moveInwards) {
                    index++;
                } else {
                    index--
                }
            }
        }
        sketch.pop();
        if (index > sketch.height || index === 0) {
            moveInwards = !moveInwards
        }
    }

    drawSomething = () => {

        sketch.stroke(['orange', 'green', 'blue', 'red'][rectIndex % 4]);

        var space = size - (margin * 2);
        var step = space / (size / 5);

        var square = space;

        for (let i = 0; i < space / 2; i += step) {
            // sketch.stroke(i*10);
            sketch.rect(i, i, space - i - i);

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