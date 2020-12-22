
var window_width = window.innerWidth;
var window_height = window.innerHeight;
var margin = 32;

const s = (sketch) => {

    var img, tileCount, part;

    sketch.preload = () => {
        let url = sketch._userNode.getAttribute('data-url');
        console.log(`preloading img: ${url}`);
        img = sketch.loadImage(url);
    }

    sketch.setup = () => {
        sketch.createCanvas(500, 500);
        // sketch.createCanvas(img.width, img.height)

        sketch.image(img, margin, margin);

        tileCount = 20;


        part = sketch.width / tileCount;


    };

    sketch.draw = () => {
        sketch.clear();

        sketch.strokeCap(sketch.PROJECT);
        sketch.strokeWeight(3);
        var c = sketch.color('white');


        for (let gridY = 0; gridY < tileCount; gridY++) {
            for (let gridX = 0; gridX < tileCount; gridX++) {
                var posX = sketch.width / tileCount * gridX;
                var posY = sketch.height / tileCount * gridY;

                var angle = sketch.atan2(sketch.mouseY - posY, sketch.mouseX - posX);
                let d = sketch.int(sketch.dist(posX, posY, sketch.mouseX, sketch.mouseY));

                var imgPixels = img.get(posX, posY);
                var c = sketch.color(imgPixels[0], imgPixels[1], imgPixels[2], imgPixels[3])
                c.setAlpha(255 - d - sketch.random(0, 10));
                sketch.stroke(c);


                sketch.push();
                sketch.translate(posX, posY);
                sketch.rotate(angle);

                sketch.line(0, 0, part, part)
                sketch.pop();

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