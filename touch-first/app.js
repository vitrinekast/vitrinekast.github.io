var window_width = window.innerWidth;
var window_height = window.innerHeight;
var margin = 32;
var multiplier = 4;
const allPositions = {
    notification: [[{ x: 440 * 4, y: 126 * 4, em: 0 },
    { x: 400 * 4, y: 80 * 4, em: 0 },
    { x: 410 * 4, y: 600 * 4, em: 0 }]
    ],
    netflix: [
        [
            { x: 254 * multiplier, y: 123 * multiplier, em: 0 },
            { x: 260 * multiplier, y: 130 * multiplier, em: 0 }

        ],
        [
            { x: 400 * multiplier, y: 603 * multiplier, em: 0 },
            { x: 330 * multiplier, y: 560 * multiplier, em: 0 },
            { x: 370 * multiplier, y: 213 * multiplier, em: 0 }
        ],
        [
            { x: 477 * multiplier, y: 380 * multiplier, em: 0 },
            { x: 374 * multiplier, y: 385 * multiplier, em: 0 },
            { x: 319 * multiplier, y: 417 * multiplier, em: 0 }
        ],
        [
            { x: 319 * multiplier, y: 417 * multiplier, em: 0 },
            { x: 461 * multiplier, y: 490 * multiplier, em: 0 },
            { x: 350 * multiplier, y: 508 * multiplier, em: 0 },
        ]
    ]
}


const s = (sketch) => {
    var size = 800 * multiplier;
    var c;
    var xoff = 0;
    var lineModule = [];
    var bezierObjects;

    var img;
    var positions = [];
    var positionsPath = [];
    sketch.preload = () => {
        let url = sketch._userNode.getAttribute('data-url');
        console.log(`preloading img: ${url}`);
        img = sketch.loadImage(url);

    }

    sketch.setup = () => {
        var c = sketch.createCanvas(size, size);
        p5bezier.initBezier(c);
        sketch.background(255);
        sketch.cursor(sketch.CROSS);
        sketch.strokeWeight(0.75);

        var ratio = img.height / img.width;
        img.resize(size, size * ratio);
        positions = allPositions.netflix;
        drawOnce();

    };

    sketch.draw = () => {
        sketch.clear();
        // sketch.background('white');

        // sketch.image(img, 0, 0);
        // var array = bewzo

        if (bezierObjects && bezierObjects.length > 0) {
            bezierObjects.forEach((bezierObject) => {
                bezierObject.vertexList.forEach((elem, index) => {
                    var prevElem = bezierObject.vertexList[index - 1];

                    if (prevElem) {
                        xoff = xoff + 0.01;
                        var prevV = sketch.createVector(prevElem[0], prevElem[1])
                        var curV = sketch.createVector(elem[0], elem[1]);
                        let angleBetween = Math.atan2(curV.y - prevV.y, curV.x - prevV.x);

                        var len = sketch.map(sketch.noise(xoff), 0, 1, 60 * multiplier, 80 * multiplier);
                        let endV = p5.Vector.fromAngle(angleBetween * 1.1, len);
                        endV.x = endV.x + prevV.x;
                        endV.y = endV.y + prevV.y;
                        sketch.line(prevElem[0], prevElem[1], endV.x, endV.y)
                        endV = p5.Vector.fromAngle(angleBetween * -1.1, len);
                        endV.x = endV.x + prevV.x;
                        endV.y = endV.y + prevV.y;
                        sketch.line(prevElem[0], prevElem[1], endV.x, endV.y)
                    }
                })
            })

        }
    }

    drawOnce = () => {
        sketch.clear();



        var path = [];
        positionsPath = [];
        positions.forEach((posArray, i) => {
            var arr = [];
            posArray.forEach((pos, index) => {
                arr.push([pos.x, pos.y]);

                // if (index > 1) {
                //     var lPos = positions[index - 1];
                //     let angleBetween = Math.atan2(pos.y - lPos.y, pos.x - lPos.x);
                //     var dist = sketch.floor(sketch.int(sketch.dist(lPos.x, lPos.y, pos.x, pos.y)));
                //     var step = 2;

                //     for (var i = 0; i < dist; i += step) {
                //         let endV = p5.Vector.fromAngle(angleBetween * 1.1, i);
                //         endV.x = endV.x + lPos.x;
                //         endV.y = endV.y + lPos.y;
                //         endV.em = pos.em;
                //         positionsPath.push(endV)
                //     }
                //     // 
                // }
            })
            path.push(arr);
        })


        window.positions = positions;



        // if(!path.length) return false
        sketch.noFill();
        bezierObjects = [];
        path.forEach((p) => {
            bezierObjects.push(p5bezier.newBezierObj(p, 'OPEN', 7))
        })


    }



    getPercentage = (value, max) => {
        return (value * 100) / max
    }

    getValue = (perc, max) => {
        return (perc * max) / 100;
    }

    getEm = () => {
        if (sketch.keyIsDown(51)) {
            return 3
        }
        if (sketch.keyIsDown(50)) {
            return 2
        }
        if (sketch.keyIsDown(49)) {
            return 1
        } else {
            return 0
        }
    }

    sketch.mousePressed = () => {
        let position = {
            x: sketch.mouseX,
            y: sketch.mouseY,
            em: getEm()
        }
        console.log(position);
        // positions.push(position);
        drawOnce();
    }
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