var window_width = window.innerWidth;
var window_height = window.innerHeight;
var margin = 32;

const s = (sketch) => {
    var size = 600;
    var img;
    var x = 0;
    var xoff = 0;


    var buildings = [];

    createBuildings = (amount) => {
        for (var i = 0; i < (amount + 1); i++) {
            var h = sketch.random(30, 250);
            buildings.push({
                h: h,
                pCurrent: sketch.createVector(sketch.random(100, sketch.width - 100), sketch.random(100, sketch.height - h - 100), 0),
                dirL: sketch.random(-20, -40),
                dirR: sketch.random(230, 180),
                sizeL: sketch.random(30, 80),
                sizeR: sketch.random(30, 80),
            })
        }
    }

    sketch.preload = () => {

    }

    sketch.setup = () => {
        sketch.createCanvas(size, size)
        sketch.angleMode(sketch.DEGREES);
        // sketch.noLoop()

        createBuildings(5);
    };

    sketch.draw = () => {
        sketch.background(sketch.color(51, 51, 51, 51));
        sketch.noStroke();

        sketch.push();

        buildings.forEach((building) => {
            // xoff = sketch.random(0, .21);
            drawBuilding(building, sketch.color(255, 255, 255, 40))
        });

        sketch.pop();

    };


    drawLine = (angle, c, l) => {
        let v = p5.Vector.fromAngle(sketch.radians(angle), l);
        sketch.stroke(c);
        xoff = xoff + 0.8;
        let n = sketch.noise(xoff) * 30;
        sketch.line(0, n, v.x + n, v.y + n);
    }

    drawBuilding = (info, c) => {
        sketch.push();
        sketch.translate(info.pCurrent);

        for (var y = 0; y < info.h; y += 10) {
            sketch.push();
            sketch.translate(0, y);
            drawLine(info.dirL, c, info.sizeL);
            drawLine(info.dirR, c, info.sizeR);
            sketch.pop();
        }
        sketch.pop();
    }
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