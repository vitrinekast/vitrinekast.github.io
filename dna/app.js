var window_width = window.innerWidth;
var window_height = window.innerHeight;
var margin = 32;

const s = (sketch) => {

    var img;
    var joints = 2;
    var lineLength = 100;
    var speedRelation = 2;
    var center;
    var pendulumPath;
    var angle = 0;
    var maxAngle = 360;
    var speed;

    createDrawing = () => {
        pendulumPath = [];
        // new empty array for each joint
        angle = 0;
        speed = (8 / sketch.pow(1.75, joints - 1) / sketch.pow(2, speedRelation - 1));
    }

    sketch.preload = () => {
        let url = sketch._userNode.getAttribute('data-url');
        console.log(`preloading img: ${url}`);
        img = sketch.loadImage(url);
    }

    sketch.setup = () => {
        sketch.createCanvas(window.innerWidth, window.innerHeight)
        sketch.colorMode(sketch.HSB, 360, 100, 100, 100);
        sketch.noFill();
        sketch.strokeWeight(1);
        sketch.stroke('orange');
        center = sketch.createVector(sketch.width / 2, sketch.height / 2);
        createDrawing();
        sketch.background(0, 0, 100);
        // sketch.image(img, margin, margin);
    };

    sketch.draw = () => {


        angle += speed;

        // each frame, create new positions for each joint
        if (angle <= maxAngle + speed) {
            console.log('jah');
            // start at the center position
            var pos = center.copy();

            for (var i = 0; i < joints; i++) {
                var a = angle * sketch.pow(speedRelation, i);
                if (i % 2 == 1) a = -a;
                var nextPos = p5.Vector.fromAngle(sketch.radians(a));
                nextPos.setMag((joints - i) / joints * lineLength);
                nextPos.add(pos);

                sketch.noStroke();
                sketch.fill(0, 10);
                sketch.ellipse(pos.x, pos.y, 4, 4);
                sketch.noFill();
                sketch.stroke(0, 10);
                sketch.line(pos.x, pos.y, nextPos.x, nextPos.y);
                pos = nextPos;
            }
        } else {
            console.log('nah');

            joints++;
            createDrawing();
        }

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