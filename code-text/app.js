
var margin = 5;

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const s = (sketch) => {
    var font, font2;
    var textTyped = 'Charles Mingus';
    sketch.preload = () => {
        opentype.load('../assets/fonts/FreeSans.otf').then((f) => {
            font = f;
        });

        font2 = sketch.loadFont('../assets/fonts/FreeSans.otf');

    }


    sketch.setup = () => {


        sketch.createCanvas(800, 800)

    };

    sketch.draw = () => {
        if (!font) return;
        sketch.noFill();
        sketch.stroke(0);
        sketch.strokeWeight(2);

        sketch.translate(20, 260);
        var fontPath = font.getPath(textTyped, 0, 0, 200);
        var path = new g.Path(fontPath.commands);
        path = g.resampleByLength(path, 11);

        points = font2.textToPoints('p5', 0, 0, 10, {
            sampleFactor: 5,
            simplifyThreshold: 0
        });

        var addToAngle = sketch.map(sketch.mouseX, 0, sketch.width, -sketch.PI, sketch.PI);
        var curveHeight = sketch.map(sketch.mouseY, 0, sketch.height, 0.1, 2);

        for (var i = 0; i < path.commands.length - 2; i++) {
            var pnt0 = path.commands[i];
            var pnt1 = path.commands[i + 1];
            
            var d = sketch.dist(pnt0.x, pnt0.y, pnt1.x, pnt1.y);

            // create a gap between each letter
            if (d > 20) continue;

            // alternate in every step from -1 to 1
            var stepper = sketch.map(i % 2, 0, 1, -1, 1);
            var angle = sketch.atan2(pnt1.y - pnt0.y, pnt1.x - pnt0.x);
            angle = angle + addToAngle;

            var cx = pnt0.x + sketch.cos(angle * stepper) * d * 4 * curveHeight;
            var cy = pnt0.y + sketch.sin(angle * stepper) * d * 3 * curveHeight;

            sketch.bezier(pnt0.x, pnt0.y, cx, cy, cx, cy, pnt1.x, pnt1.y);
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