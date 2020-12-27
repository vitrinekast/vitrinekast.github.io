const s = (sketch) => {
    var cellSize = 200;
    var points;
    var radius = 150;
    var angle = 2.0;
    var offset = 300;
    var scalar = 3.5;
    var speed = 0.1;

    createGrid = (startX, startY, w, h, s, level) => {
        console.group(level)
        console.log('creating a grid', startX, startY, w, h, s, level)
        for (var x = startX; x <= w; x += s) {
            for (var y = startY; y <= h; y += s) {
                console.log(x, y, w, h)
                points.push({ x: x, y: y, size: s, level: level })
                console.log(sketch.random(5) < 5, level)
                // if (sketch.random(5) < 5) {
                const hs = s / 2;
                if (level > 1) {
                    createGrid(x, y, w / 2, h / 2, s / 2, level - 1)
                    createGrid(x, y + (w / 4), w / 2, h / 2, s / 2, level - 1)
                    createGrid(x + (w / 4), y + (w / 4), w / 2, h / 2, s / 2, level - 1)
                    createGrid(x + (w / 4), y, w / 2, h / 2, s / 2, level - 1)
                }
                // }

            }
        }
        console.groupEnd();



    }

    sketch.setup = () => {

        // tekenen een grid
        // teken noise circle
        // if gridcell buiten de noise cirkel, niet renderen
        // is dat wel zo, dan good to go
        // voor elke gerenderde gricdell, deze kan weer verdeeld worden in meer en meer gridcells


        sketch.createCanvas(800, 800);

        sketch.fill('white');
        sketch.noStroke();
        var step = 10;
        // sketch.translate(400, 400);

        // for (var x = 0; x <= 400; x += step) {
        //     for (var y = 9; y <= 400; y += step) {
        //         sketch.rect(sketch.cos(x)*y, sketch.sin(x)*y, step)
        //         // sketch.ellipse(sketch.cos(x) * y, sketch.sin(x) * y, step, step);
        //     }
        // }





        // // Initialize
        // points = new Array();

        // createGrid(0, 0, sketch.width, sketch.height, cellSize, 3)


        // console.log(points);

        // points.sort(function (a, b) {
        //     return a.level > b.level;
        // });


        // points.forEach((p) => {
        //     let d = sketch.dist(p.x + (p.size / 2), p.y + (p.size / 2), sketch.width / 2, sketch.height / 2);
        //     console.log(d, radius, d < radius)
        //     if (d < radius) {
        //         sketch.fill('green')
        //     } else {
        //         sketch.noFill();
        //     };

        //     sketch.rect(p.x, p.y, p.size, p.size)
        //     sketch.stroke(p.level * 30);
        //     sketch.text(`${p.x}, ${p.y}, ${p.level}`, p.x + (p.size / 2), p.y + (p.size / 2))
        // })



        // sketch.noFill();
        // sketch.stroke('orange');

        // sketch.circle(sketch.width / 2, sketch.height / 2, radius * 2);



        // I
    };

    sketch.draw = () => {

        sketch.background(0);
        var rows = 8;
        
        var cols = 8;
        var factor = 19;
        var step = 100;
        var n, cx, cy;
        var c = sketch.color('white');
        for (var y = 0; y < rows; y++) {
            for (var x = 0; x < cols; x++) {
                n = sketch.noise(x * factor, y * factor, sketch.frameCount * 0.005) * 3;
                n = (n - sketch.int(n)) * 3;
                cx = sketch.cos(n);
                cy = sketch.sin(n);
                val = sketch.floor(sketch.map(cx * cy, -0.5, 0.45, 0, 9));;
                
                c.setAlpha(cx*190);
                sketch.fill(c);
                sketch.rect( x * step + 3 + cx, y * step + cy, step, step)
            }
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