
const s = (sketch) => {
    let phase = 0;
    let zoff = 0;
    let step = 0.05;
    let minRadius = 220;
    let maxRadius = 250;
    let circlesArray = [];
    const maxArrayLength = 25;
    let linesArray = [];

    sketch.setup = () => {
        sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
        sketch.background(255);
    };

    sketch.draw = () => {
        sketch.translate(sketch.width / 2, sketch.height / 2);
        sketch.stroke(51, 51, 51, 50);
        sketch.noFill();
        phase += 0.01;

        let circleArray = [];
        let lineArray = [];
        let lastP = {};


        for (let a = 0; a < sketch.TWO_PI; a += step) {

            let xoff = sketch.map(sketch.cos(a), -1, 1, 0, 20);
            let yoff = sketch.map(sketch.sin(a), -1, 1, 0, 20);
            const r = sketch.map(sketch.noise(xoff, yoff, zoff), 0, 1, minRadius, maxRadius);

            let x = r * sketch.cos(a);
            let y = r * sketch.sin(a);

            circleArray.push({ x: x, y: y });
            if (sketch.random() > 0.8) {
                if (lastP.x) {
                    lineArray.push({
                        x1: x,
                        y1: y,
                        x2: lastP.x,
                        y2: lastP.y
                    })
                }

                lastP = { x: x, y: y }
            }
        }

        sketch.background(255);
        circlesArray.push(circleArray);
        linesArray.push(lineArray);

        if (circlesArray.length > maxArrayLength) {
            circlesArray.shift();
            linesArray.shift();
        }

        circlesArray.forEach((circle) => {
            sketch.beginShape();
            circle.forEach((p) => {
                sketch.vertex(p.x, p.y);
            })
            sketch.endShape(sketch.CLOSE);
        })

        linesArray.forEach((lines) => {
            lines.forEach((line) => {
                sketch.line(line.x1, line.y1, line.x2, line.y2);
            })
        })

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