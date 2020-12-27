
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





    };

    sketch.draw = () => {
        // sketch.translate(sketch.width / 2 + sketch.sin(phase)*100, sketch.height / 2 + sketch.cos(phase)*100);
        // sketch.translate(sketch.width / 2, sketch.height / 2 );
        sketch.translate(0, sketch.height / 2)
        sketch.background(255, 255, 255, 20);

        sketch.stroke(51 * sketch.cos(phase), 51 * sketch.cos(phase), 51, 51);
        sketch.noFill();
        phase += 0.01;
        points = [];

        sketch.beginShape();
        

        sketch.stroke(1 * sketch.cos(phase), 51 * sketch.cos(phase), sketch.tan(phase), 51);
        for (var i = 0; i < sketch.width; i += 20) {
            
            let xoff = sketch.map(sketch.cos(i), -1, 1, 0, 5);
            let yoff = sketch.map(sketch.sin(i), -1, 1, 0, 5);
            const r = sketch.map(sketch.noise(xoff, yoff, zoff), 0, 1, 0, sketch.height/8 );

            let x = r * sketch.cos(i);
            let y = r * sketch.sin(i);
            
            sketch.vertex(i, y);

        }

        sketch.endShape();


        sketch.stroke(51 * sketch.cos(phase), 51 * sketch.cos(phase), 51, 80);



        sketch.beginShape();
        // for (let a = 0; a < sketch.TWO_PI; a += step) {

        //     let xoff = sketch.map(sketch.cos(a), -1, 1, 0, 20);
        //     let yoff = sketch.map(sketch.sin(a), -1, 1, 0, 20);
        //     const r = sketch.map(sketch.noise(xoff, yoff, zoff), 0, 1, radius - radiusOffset, radius + radiusOffset);

        //     let x = r * sketch.cos(a);
        //     let y = r * sketch.sin(a);

        //     sketch.vertex(x, y);


        // }

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