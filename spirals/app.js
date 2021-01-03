var window_width = window.innerWidth;
var window_height = window.innerHeight;
var margin = 32;

const s = (sketch) => {

    var size = 800;
    var easing = 0.5;
    var index = 360;
    var c;
    var xoff = 0;

    var directions = [0 * 45, 1 * 45, 2 * 45, 3 * 45, 4 * 45, 5 * 45, 6 * 45, 7 * 45, 360];
    var lines = [];
    sketch.preload = () => {

    }

    getColor = () => {
        r = sketch.random(100, 255); // r is a random number between 0 - 255
        g = sketch.random(255); // g is a random number betwen 100 - 200
        b = sketch.random(255); // b is a random number between 0 - 100
        return sketch.color(sketch.random(['red', 'yellow', 'blue']));
        // return sketch.color(sketch.random(50, 250))
    }

    sketch.setup = () => {
        sketch.createCanvas(size, size)

        sketch.stroke('white');


        // set a point at a random location to start

        // draw a line towards another location in a random angle of a random length

        // at the end of the line, calculate a new point to draw towards
        // set a random lineweight
        // fill in a rectangle somewhere?
        sketch.blendMode(sketch.DIFFERENCE)
        // sketch.blendMode(sketch.SCREEN);

        c = sketch.color(getColor());
        

        sketch.translate(sketch.width / 2, sketch.width / 2);
        for (index = 0; index < 4000; index++) {
            drawSomething();
        }

    };

    drawSomething = () => {
        
        xoff = xoff + 0.01;
        var distance = sketch.floor(index / 360) *20;
        let n = sketch.noise(xoff) * (distance/4);
        
        if (index % 360 === 0) {
            c = sketch.color(getColor());
        }
        sketch.stroke(c);

        var p = p5.Vector.fromAngle(sketch.radians(index % 360), distance);
        sketch.line(0, 0, p.x + n, p.y + n);

    }


    drawThem = (lineIndex, i) => {

        sketch.push();
        sketch.stroke(lines[lineIndex].color);
        sketch.translate(lines[lineIndex].lastPosition.x, lines[lineIndex].lastPosition.y);

        if (i % 15 === 0) {
            lines[lineIndex].direction = sketch.random(directions)
            lines[lineIndex].tsw = sketch.random(2, 10);
        }
        lines[lineIndex].csw += (lines[lineIndex].tsw - lines[lineIndex].csw) * easing;
        sketch.strokeWeight(lines[lineIndex].csw);
        lines[lineIndex].newPosition = p5.Vector.fromAngle(sketch.radians(lines[lineIndex].direction), 3);
        sketch.line(0, 0, lines[lineIndex].newPosition.x, lines[lineIndex].newPosition.y);
        lines[lineIndex].lastPosition.x += lines[lineIndex].newPosition.x;
        lines[lineIndex].lastPosition.y += lines[lineIndex].newPosition.y;

        sketch.pop();
    }

    sketch.draw = () => {
        // sketch.clear();
        sketch.translate(sketch.width / 2, sketch.width / 2);
        // drawSomething();
        index++;
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