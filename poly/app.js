var margin = 32;
var cols, rows, flowField;
var scale = 40;
var points = [];
var amountOfPoints = 21;
var margin = 20;
var inc = 0.1;
var zoff = 0;

const s = (sketch) => {
    sketch.setup = () => {
        sketch.createCanvas(window.innerWidth, window.innerHeight)

        cols = sketch.floor(sketch.width / scale);
        rows = sketch.floor(sketch.height / scale);

        flowField = new Array(cols * rows);

        for (var i = 0; i < amountOfPoints; i++) {
            var v = sketch.createVector(sketch.random(margin, sketch.width - margin), sketch.random(margin, sketch.height - margin));
            v.cId = i;
            points.push(v);
        }
        sketch.noLoop();
    };

    sketch.draw = () => {
        sketch.textSize(12);
        sketch.text(`blueprint_${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`, 10, 30);

        var yoff = 0;
        for (var y = 0; y < rows; y++) {
            var xoff = 0;
            for (let x = 0; x < cols; x++) {
                var angle = sketch.noise(xoff, yoff, zoff) * sketch.TWO_PI * 4;
                var v = p5.Vector.fromAngle(angle);
                v.setMag(1);
                flowField[x + y * cols] = v;
                xoff += inc;
            }

            yoff += inc;
            zoff += 0.0003;
        }

        points.forEach((point) => {
            sketch.fill('black');
            sketch.circle(point.x, point.y, 10);
            var x = sketch.floor(point.x / scale);
            var y = sketch.floor(point.y / scale);
            var force = flowField[x + y * cols];
            if (!force) force = flowField[0]

            point.x -= force.x;
            point.y -= force.y;

            sketch.stroke('black');
            sketch.push();
            sketch.noFill();
            sketch.strokeJoin(sketch.ROUND);
            sketch.strokeWeight(3);

            if (point.x > sketch.width) { point.x = 0 };
            if (point.x < 0) { point.x = sketch.width };
            if (point.y > sketch.height) { point.y = 0 };
            if (point.y < 0) { point.y = sketch.height };

            points.forEach((p) => {
                p.dist = sketch.int(sketch.dist(point.x, point.y, p.x, p.y));
            })
            var nb1 = points.filter(p => p.cId !== point.cId).reduce((prev, current) => {
                return current.dist < prev.dist ? current : prev
            })
            var nb2 = points.filter(p => p.cId !== point.cId && p.cId !== nb1.cId).reduce((prev, current) => {
                return current.dist < prev.dist ? current : prev
            })

            if ((point.nb1 !== nb1 || point.nb2 !== nb2) && (point.nb1 && point.nb2)) {
                sketch.fill('white')
                nb1.x += sketch.random(-20, 20);
                nb1.y += sketch.random(-20, 20);
            }

            point.nb1 = nb1;
            point.nb2 = nb2;

            sketch.triangle(point.x, point.y, nb1.x, nb1.y, nb2.x, nb2.y);
            sketch.pop();
        })
    };
};


var sketches = [];
document.querySelectorAll('.fn-sketch').forEach((elem, index) => {
    sketches[index] = new p5(s, elem);
})


document.getElementById('store').addEventListener('click', function (e) {
    sketches.forEach((sketch) => {
        var file_name = `export_${document.title} _${sketch._userNode.getAttribute('data-url')} _${new Date().toDateString().replace(' ', '_')} `;
        sketch.saveCanvas(file_name, 'png');
    })
})