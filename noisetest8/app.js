
var colors = [];

const s = (sketch) => {

    let zoff = 0;
    let positions;

    var img;
    var step = 10;

    sketch.preload = () => {
        let url = sketch._userNode.getAttribute('data-url');
        console.log(`preloading img: ${url}`);
        img = sketch.loadImage(url);
    }


    sketch.setup = () => {
        zoff += sketch.random(0, 10);

        // sketch.createCanvas(300, 500);
        // sketch.background(0);

        sketch.createCanvas(img.width, img.height);
        img.loadPixels();
        // sketch.noStroke();
        // var step = 10;
        sketch.strokeWeight(step);

        if (!colors.length) {
            var baseColor = sketch.color(sketch.random(0, 255), sketch.random(0, 255), sketch.random(0, 255), 255);
            var acc1 = sketch.color((sketch.hue(baseColor) + 150) % 360, sketch.saturation(baseColor), sketch.brightness(baseColor), 40);
            var acc2 = sketch.color((sketch.hue(baseColor) + 210) % 360, sketch.saturation(baseColor), sketch.brightness(baseColor), 40);
            var acc3 = sketch.color((sketch.hue(baseColor) + 100) % 360, sketch.saturation(baseColor), sketch.brightness(baseColor), 40);
            var acc4 = sketch.color((sketch.hue(baseColor) + 10) % 360, sketch.saturation(baseColor), sketch.brightness(baseColor), 40);
            var acc5 = sketch.color((sketch.hue(baseColor) + 40) % 360, sketch.saturation(baseColor), sketch.brightness(baseColor), 40);

            colors = [baseColor, acc1];
        }


        // positions = [];
        // for (var i = 0; i < sketch.floor(sketch.random(3, 10)); i++) {
        //     let x = sketch.random([0, sketch.width, sketch.floor(sketch.random(0, sketch.width))]);
        //     positions.push({
        //         x: x,
        //         y: x === 0 || x === sketch.width ? sketch.floor(sketch.random(0, sketch.width)) : sketch.random([0, sketch.height])
        //     })
        // }
    };

    sketch.draw = () => {

        if (sketch.mouseIsPressed) {
            sketch.clear();
        }
        sketch.strokeWeight(2);
        sketch.noFill();
        sketch.stroke(255, 255, 255, 10);

        let xoff = sketch.map(sketch.cos(zoff), -1, 1, 0, 1);
        let yoff = sketch.map(sketch.sin(zoff), -1, 1, 0, 1);

        let xPos = sketch.map(sketch.noise(xoff, yoff, zoff), 0, 1, 0, sketch.width);
        let yPos = sketch.map(sketch.noise(xoff, yoff, zoff), 0, 1, 0, sketch.width);

        let steps = 40;

        sketch.strokeWeight(step);
        for (let i = step / 2; i < img.width; i += step) {

            let c = img.get(i, 0);
            sketch.stroke(c);
            sketch.line(i, 0, i * step, img.height);
            c = img.get(img.width - i, 0);
            sketch.stroke(c);
            // sketch.line(img.width - i, img.height, img.width - (i * step), 0);
            sketch.line(img.width - i, img.height, xPos, yPos)

        }

        for (let i = step / 2; i < img.height; i += step) {
            let c = img.get(0, i);
            sketch.stroke(c);
            sketch.line(0, i * step, xPos, yPos);
            c = img.get(0, img.height - i);
            sketch.stroke(c);
            sketch.line(img.width, img.width - (i * step), xPos, yPos);
            
         
        }

        // positions.forEach((pos, index) => {
        //     // let c = colors[index % colors.length];
        //     let c = img.get(index * 40, 0);
        //     console.log(index);
        //     // c.setAlpha(40);
        //     sketch.stroke(c);

        //     for (var i = 0; i < sketch.width; i += steps) {

        //         if (pos.x === 0) {
        //             sketch.line(pos.x, pos.y + i, xPos, yPos)
        //         } else {
        //             sketch.line(pos.x + i, pos.y, xPos, yPos)
        //         }
        //     }
        // })


        sketch.noStroke()
        colors[0].setAlpha(0);

        var size = sketch.map(sketch.cos(zoff), 0, 1, 10, 50);
        sketch.fill(colors[0]);
        sketch.ellipse(xPos, yPos, size, size);

        sketch.endShape(sketch.CLOSE);

        zoff += 0.01;



    };
};

var sketches = [];
var elems = document.querySelectorAll('.fn-sketch');


elems.forEach((elem, index) => {
    sketches[index] = new p5(s, elem);
})


document.getElementById('store').addEventListener('click', function (e) {
    sketches.forEach((sketch) => {
        var file_name = `export_${document.title}_${sketch._userNode.getAttribute('data-url')}_${new Date().toDateString().replace(' ', '_')}`;
        sketch.saveCanvas(file_name, 'png');
    })
})