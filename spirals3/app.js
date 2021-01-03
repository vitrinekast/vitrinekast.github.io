var window_width = window.innerWidth;
var window_height = window.innerHeight;
var margin = 32;

const s = (sketch) => {

    var size = 800;
    var easing = 0.5;
    var index = 360;
    var c;
    var xoff = 0;
    
    var lastP = {
        x: -10, y: -10
    };

    var directions = [0 * 45, 1 * 45, 2 * 45, 3 * 45, 4 * 45, 5 * 45, 6 * 45, 7 * 45, 360];
    var lines = [];
    sketch.preload = () => {

    }

    getColor = () => {
        r = sketch.random(100, 255); // r is a random number between 0 - 255
        g = sketch.random(255); // g is a random number betwen 100 - 200
        b = sketch.random(255); // b is a random number between 0 - 100
        // return sketch.color(sketch.random(['red', 'yellow', 'blue']));
        return sketch.color(sketch.random(100, 250))
    }

    sketch.setup = () => {
        sketch.createCanvas(size + 20, size + 20)


        // set a point at a random location to start

        // draw a line towards another location in a random angle of a random length

        // at the end of the line, calculate a new point to draw towards
        // set a random lineweight
        // fill in a rectangle somewhere?
        sketch.blendMode(sketch.DIFFERENCE)
        // sketch.blendMode(sketch.SCREEN);

        c = sketch.color(getColor());
        sketch.stroke('white');

        // sketch.translate(sketch.width / 2, sketch.width / 2);
        

        var gridSize = 200;
        sketch.translate(20 + 20);
        for(var x = 0; x < sketch.width - 20; x+=gridSize) {
            for(var y = 0; y < sketch.width - 20; y+=gridSize) {
                sketch.push();
                console.log(x, y);
                console.group('block')
                lastP = {
                    x: 0, y: 0
                };
                sketch.translate(x + gridSize/2, y + gridSize/2);
                for (index = 0; index < (4*10); index++) {
                    drawSomething();
                }
                console.groupEnd();
                sketch.pop();
            }
        }

    };

    drawSomething = () => {
        xoff = xoff + 0.03;
        var d = sketch.floor(index/4)*10;
        console.log(index, lastP);
        if(index === 0) {
            sketch.stroke('red')
        } else {
            sketch.stroke('white');
        }
        
        // var distance = sketch.floor(index / 360)*8;
        let n = sketch.map(sketch.noise(xoff), 0, 1, -10, 10);
        

        if (index % 360 === 0) {
            c = sketch.color(getColor());
        }
        
        var p = {
            x: [-d, d, d, -d][index%4] + sketch.random(5, 20),
            y: [-d, -d, d, d][index%4] + sketch.random(5, 20)
        }
        sketch.strokeWeight(sketch.random(1, 3));
        
        if(lastP) {
            sketch.line(lastP.x, lastP.y, p.x, p.y);
        }
        
        lastP = p;
        

    }


    sketch.draw = () => {
        // sketch.clear();
        sketch.translate(sketch.width / 2, sketch.width / 2);
        // drawSomething();
        index++;
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