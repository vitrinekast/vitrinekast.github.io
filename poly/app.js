var window_width = window.innerWidth;
var window_height = window.innerHeight;
var margin = 32;
var cols, rows;
var scale = 40;
var points = [];
var amountOfPoints = 21;
var margin = 20;
var flowField;
var particles = [];
var inc = 0.1;
var zoff = 0;
var amountOfParticles = 40;
const s = (sketch) => {

    var img;

    sketch.preload = () => {

    }

    sketch.setup = () => {


        sketch.createCanvas(window_width, window_height)

        cols = sketch.floor(sketch.width / scale);
        rows = sketch.floor(sketch.height / scale);

        flowField = new Array(cols * rows);



            
        for (var i = 0; i < amountOfPoints; i++) {
            var x = sketch.random(margin, sketch.width - margin);
            var y = sketch.random(margin, sketch.height - margin);
            var v = sketch.createVector(x, y);

            v.countId = i;
            points.push(v);
        }

        sketch.noLoop();


    };

    sketch.draw = () => {
        var c = sketch.color('white');
        // c.setAlpha(150);
        sketch.background(c);
        sketch.textSize(12 );
        sketch.text(`blueprint_${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`, 10, 30);
        var yoff = 0;
        for (var y = 0; y < rows; y++) {
            var xoff = 0;

            for (let x = 0; x < cols; x++) {
                var index = x + y * cols;
                var angle = sketch.noise(xoff, yoff, zoff) * sketch.TWO_PI * 4;
                var v = p5.Vector.fromAngle(angle);
                v.setMag(1);
                flowField[index] = v;
                xoff += inc;

                // sketch.push();
                // sketch.translate(x * scale, y * scale);
                // sketch.rotate(v.heading());
                // sketch.strokeWeight(1);
                // sketch.line(0, 0, scale, 0);
                // sketch.pop();

            }

            yoff += inc;

            zoff += 0.0003;
        }

        //     particles[i].follow(flowfield);
        // particles[i].update();
        // particles[i].edges();
        // particles[i].show();

        points.forEach((point) => {
            sketch.fill('black');
            sketch.circle(point.x, point.y, 10);

            var x = sketch.floor(point.x / scale);
            var y = sketch.floor(point.y / scale);
            var index = x + y * cols;
            var force = flowField[index];
            if (!force) force = flowField[0]

            point.x -= force.x;
            point.y -= force.y;


            sketch.stroke('black');
            sketch.push();
            sketch.noFill();
            // sketch.noStroke();
            sketch.strokeJoin(sketch.ROUND);
            sketch.strokeWeight(3);

            if (point.x > sketch.width) { console.log(1); point.x = 0 };
            if (point.x < 0) { console.log(2); point.x = sketch.width };
            if (point.y > sketch.height) { console.log(3); point.y = 0 };
            if (point.y < 0) { console.log(4); point.y = sketch.height };

            points.forEach((p) => {
                p.distance = sketch.int(sketch.dist(point.x, point.y, p.x, p.y));
            })
            var nb1 = points.filter(p => p.countId !== point.countId).reduce((prev, current) => {
                return current.distance < prev.distance ? current : prev
            })
            var nb2 = points.filter(p => p.countId !== point.countId && p.countId !== nb1.countId).reduce((prev, current) => {
                return current.distance < prev.distance ? current : prev
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
        var file_name = `export_${ document.title } _${ sketch._userNode.getAttribute('data-url') } _${ new Date().toDateString().replace(' ', '_') } `;
        sketch.saveCanvas(file_name, 'png');
    })
})