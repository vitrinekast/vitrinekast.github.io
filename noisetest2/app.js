
const s = (sketch) => {
    let phase = 0;
    let zoff = 0;
    let step = 0.05;
    let radius = 200;
    let radiusOffset = 40;

    let pointsInCircle = [];
    var shapes = 5;
    var points;
    sketch.setup = () => {
        sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
        sketch.background(255);
        sketch.noLoop();

        for (var i = 0; i < shapes * 3; i++) {
            var r = radius * sketch.sqrt(sketch.random())
            let a = sketch.random(sketch.TWO_PI);
            pointsInCircle.push({
                x: r * sketch.cos(a), y: r * sketch.sin(a)
            })

        }




    };

    sketch.draw = () => {
        sketch.translate(sketch.width / 2, sketch.height / 2);
        sketch.stroke(51, 51, 51, 100);
        sketch.noFill();
        phase += 0.01;
        points = [];

        sketch.beginShape();


        for (let a = 0; a < sketch.TWO_PI; a += step) {

            let xoff = sketch.map(sketch.cos(a), -1, 1, 0, 20);
            let yoff = sketch.map(sketch.sin(a), -1, 1, 0, 20);
            const r = sketch.map(sketch.noise(xoff, yoff, zoff), 0, 1, radius - radiusOffset, radius + radiusOffset);

            let x = r * sketch.cos(a);
            let y = r * sketch.sin(a);

            sketch.vertex(x, y);
            points.push({
                x: x, y: y
            })

            if (sketch.random() > 0.99 && points.length > 2) {
                sketch.push();
                sketch.fill(255, 40, 89, 20);
                sketch.beginShape();
                let p2 = sketch.random(points);
                let p3 = sketch.random(points);
                sketch.vertex(x, y);
                sketch.vertex(p2.x, p2.y);
                sketch.vertex(p3.x, p3.y);
                sketch.endShape(sketch.CLOSE);
                sketch.pop();
            } 

        }

        sketch.endShape(sketch.CLOSE);

        zoff += 0.01;

    

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