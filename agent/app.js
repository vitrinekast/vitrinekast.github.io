const s = (sketch) => {
    var direction;
    var img;
    var stepSize = 1;

    var posX;
    var posY;


    sketch.preload = () => {
        let url = sketch._userNode.getAttribute('data-url');
        console.log(`preloading img: ${url}`);
        img = sketch.loadImage(url);
    }

    sketch.setup = () => {

        posX = sketch.width / 2;
        posY = sketch.width / 2;

        sketch.createCanvas(img.width, img.height)

        img.loadPixels();

    };

    sketch.draw = () => {
        for (var i = 0; i <= 20; i++) {
            direction = sketch.int(sketch.random(0, 8));

            posY = (direction == 0 || direction === 1 || direction === 7) ? posY -= stepSize : posY;
            posY = (direction == 3 || direction === 4 || direction === 5) ? posY += stepSize : posY;

            posX = (direction == 1 || direction === 3 || direction === 4) ? posX -= stepSize : posX;
            posX = (direction == 5 || direction === 6 || direction === 7) ? posX += stepSize : posX;

            if (posX > sketch.width) posX = 0;
            if (posX < 0) posX = sketch.width;
            if (posY < 0) posY = sketch.height;
            if (posY > sketch.height) posY = 0;

            var imgPixels = img.get(posX, posY);
            var c = sketch.color(imgPixels[0],imgPixels[1],imgPixels[2], 20)

            var angle = sketch.atan2(posY, posX);
            var leng = sketch.random(15, 25);
            sketch.push();
            sketch.translate(posX, posY);
            sketch.rotate(angle);
            sketch.strokeWeight(direction);
            sketch.stroke(c);
            sketch.fill(c);
            sketch.line(0, 0, leng, leng)
            sketch.pop();
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