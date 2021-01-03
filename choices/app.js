var window_width = window.innerWidth;
var window_height = window.innerHeight;
var margin = 32;

const s = (sketch) => {

    var size = 400;
    var easing = 0.5;
    var index = 0;

    var directions = [0 * 45, 1 * 45, 2 * 45, 3 * 45, 4 * 45, 5 * 45, 6 * 45, 7 * 45, 360];
    var lines = [];
    sketch.preload = () => {

    }

    getColor = () => {
        r = sketch.random(100, 255); // r is a random number between 0 - 255
        g = sketch.random(255); // g is a random number betwen 100 - 200
        b = sketch.random(255); // b is a random number between 0 - 100
        return sketch.color(sketch.random(['red', 'yellow', 'blue']));
    }

    sketch.setup = () => {
        sketch.createCanvas(size, size)

        sketch.stroke('white');


        // set a point at a random location to start

        // draw a line towards another location in a random angle of a random length

        // at the end of the line, calculate a new point to draw towards
        // set a random lineweight
        // fill in a rectangle somewhere?
        sketch.blendMode(sketch.SCREEN)
        createNewLine(0, { x: sketch.width / 2, y: sketch.width / 2 });

        for (var i = 0; i < 500; i++) {

            if (i > 0 && i % 50 === 0) {
                createNewLine(Math.floor(i / 50), lines[Math.floor(i / 50) - 1].lastPosition);
            }

            for (var line = 0; line < lines.length; line++) {
                drawThem(line, i)
            }

        }

    };

    createNewLine = (lineIndex, pos) => {

        lines[lineIndex] = {
            color: getColor(),
            tsw: 1,
            csw: 1,
            direction: 0,
            newPosition: {
                x: pos.x,
                y: pos.y
            },
            lastPosition: {
                x: pos.x,
                y: pos.y
            },

        };

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

        // if(lines[lineIndex].lastPosition.x < 0) {
        //     lines[lineIndex].direction = 0;
        //     console.log('x < 0', lines[lineIndex].lastPosition.x)

        // }

        // if(lines[lineIndex].lastPosition.x > sketch.width) {
        //     lines[lineIndex].direction = 180;
        //     console.log('x < w')
        // }

        // if(lines[lineIndex].lastPosition.y < 0) {
        //     lines[lineIndex].direction = 90;
        //     console.log('y < 0')
        // }

        // if(lines[lineIndex].lastPosition.y > sketch.height) {
        //     debugger;
        //     lines[lineIndex].direction = 270;
        //     console.log('y < w')
        // }

        index++;
        sketch.pop();
    }

    sketch.draw = () => {
        // sketch.translate(lastPosition.x, lastPosition.y);

        // if(index%70 === 0) {
        //     direction = sketch.random([0*45, 1*45, 2*45, 3*45, 4*45, 6*45, 7*45, 8*45])
        //     tsw = sketch.random(0, 10);
        // }
        // csw += (tsw - csw) * easing;
        // sketch.strokeWeight(csw);
        // newPosition = p5.Vector.fromAngle(sketch.radians(direction), 1);
        // sketch.line(0, 0, newPosition.x, newPosition.y);
        // lastPosition.x += newPosition.x;
        // lastPosition.y += newPosition.y;

        // if((newPosition.x < 0 || newPosition.x > sketch.width ) && (newPosition.y < 0 || newPosition.y > sketch.height )) {
        //     console.log('set random position!')
        //     newPosition.x = sketch.random(0, sketch.width);
        //     newPosition.y = sketch.random(0, sketch.height);
        // }

        // index++;
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