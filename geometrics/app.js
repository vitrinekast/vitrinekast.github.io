var window_width = window.innerWidth;
var window_height = window.innerHeight;
var margin = 32;
var colors = [
    {
        bg: 'black',
        fg: 'orange'
    },
    {
        bg: 'yellow',
        fg: 'black'
    },
    {
        bg: 'green',
        fg: 'red'
    }, {
        bg: 'black',
        fg: 'white'
    },
]

const s = (sketch) => {
    var iteration = 0;
    var colorIndex = 0;
    var cx, cy;


    sketch.setup = () => {
        sketch.createCanvas(720, 720);
        sketch.noFill();
        sketch.background(colors[colorIndex % colors.length].bg);
        sketch.strokeWeight(2);
        sketch.stroke(0, 25);

        cx = sketch.width / 2;
        cy = sketch.height / 2;


    };

    sketch.draw = () => {
        iteration++;

        if (iteration % 3 === 0) {
            sketch.clear();
            sketch.background(colors[colorIndex % colors.length].bg);
        }

        if (sketch.mouseIsPressed) {
            colorIndex++;
        }

        sketch.push();
        var c = sketch.color('white');
        c.setAlpha(50);
        sketch.stroke(c);
        sketch.translate(sketch.width / 2, sketch.height / 2);
        let time = sketch.mouseX;
        var corners = 3;

        var radius = time - sketch.width / 2;
        var angle = sketch.TAU / corners;

        sketch.fill(colors[colorIndex % colors.length].fg);
        sketch.blendMode(sketch.SCREEN);


        sketch.beginShape();
        sketch.vertex(0, 0);

        for (var i = 0; i <= corners; i++) {
            var x = sketch.cos(angle * i) * radius;
            var y = sketch.sin(angle * i) * radius;

            sketch.bezierVertex(x, y, sketch.mouseX, sketch.mouseY, x, y);
        }
        sketch.endShape();

        sketch.pop();
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