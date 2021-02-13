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
    ],
    tinder: [
        [
            { x: 285 * multiplier, y: 181 * multiplier, em: 0 },
            { x: 280 * multiplier, y: 189 * multiplier, em: 0 }
        ],
        [
            { x: 438 * multiplier, y: 493 * multiplier, em: 0 },
            { x: 352 * multiplier, y: 520 * multiplier, em: 0 },
            { x: 285 * multiplier, y: 650 * multiplier, em: 0 },
        ],
        [
            { x: 416 * multiplier, y: 502 * multiplier, em: 0 },
            { x: 352 * multiplier, y: 530 * multiplier, em: 0 },
            { x: 380 * multiplier, y: 590 * multiplier, em: 0 },
        ]
    ]
}


const s = (sketch) => {
    var size = 800 * multiplier;
    var xoff = 0;
    var bezierObjects;
    var img;
    var positions = [];

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
        positions = allPositions.tinder;
        drawOnce();

    };

    sketch.draw = () => {
        sketch.clear();
        // sketch.image(img, 0, 0);

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
            posArray.forEach(pos => arr.push([pos.x, pos.y]))
            path.push(arr);
        })

        window.positions = positions;
        bezierObjects = [];

        path.forEach((p) => {
            bezierObjects.push(p5bezier.newBezierObj(p, 'OPEN', 7))
        })
    }

    sketch.mousePressed = () => {
        let position = {
            x: sketch.mouseX,
            y: sketch.mouseY,
            em: getEm()
        }
        console.log(position);
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