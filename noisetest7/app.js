const s = (sketch) => {
  var flowfield = [];
  var particles = [];
  var zoff = 0;
  var scale = 50;
  var inc = 4;
  var cols, rows;
  var amountOfParticles = 10;
  var maxSpeed = 2;
  var mag = 0.5;
  var img;
  var capture;

  class Particle {
    constructor() {
      this.pos = sketch.createVector(
        sketch.random(sketch.width),
        sketch.random(sketch.height)
      );
      this.vel = new p5.Vector(0, 0, 0);
      this.acc = sketch.createVector(0, 0);
      this.maxSpeed = maxSpeed;
      this.prevPos = this.pos.copy();
    }

    update() {
      this.vel.add(this.acc);
      this.vel.limit(this.maxSpeed);
      this.pos.add(this.vel);
      this.acc.mult(0);
    }

    follow(vectors) {
      var x = sketch.floor(this.pos.x / scale);
      var y = sketch.floor(this.pos.y / scale);

      var index = x + y * cols;
      var force = vectors[index];
      
      this.applyForce(force);
    }

    applyForce(force) {
      this.acc.add(force);
    }

    show() {
      sketch.stroke(100, 50);
      
      sketch.strokeWeight(4);
      sketch.line(
        this.pos.x,
        this.pos.y,
        this.prevPos.x,
        this.prevPos.y
      );
      this.updatePrev();
    }

    updatePrev() {
      this.prevPos.x = this.pos.x;
      this.prevPos.y = this.pos.y;
    }

    edges() {
      if (this.pos.x > sketch.width) {
        this.pos.x = 0;
        this.updatePrev();
      }
      if (this.pos.x < 0) {
        this.pos.x = sketch.width;
        this.updatePrev();
      }
      if (this.pos.y > sketch.height) {
        this.pos.y = 0;
        this.updatePrev();
      }
      if (this.pos.y < 0) {
        this.pos.y = sketch.height;
        this.updatePrev();
      }
    }
  }

  sketch.preload = () => {
    let url = sketch._userNode.getAttribute("data-url");
    img = sketch.loadImage(url);
  };

  getFlowField = () => {
    var yoff = 0;
    
    
    for (var y = 0; y < rows; y++) {
      var xoff = 0;

      for (let x = 0; x < cols; x++) {
        var index = x + y * cols;
        var value = sketch.brightness(
          sketch.color(capture.get(x * scale, y * scale))
        );

        var v = p5.Vector.fromAngle(
          sketch.map(value, 0, 100, 0, sketch.TWO_PI)
        );

        v.setMag(mag);
        flowfield[index] = v;
        xoff += inc;
      }

      yoff += inc;
      zoff += 0.00003;
    }
  };

  sketch.setup = () => {
    sketch.createCanvas(400, 400);
    capture = sketch.createCapture(sketch.VIDEO);
    capture.size(320, 240);

    capture.hide();
    capture.loadPixels();


    cols = sketch.floor(sketch.width / scale);
    rows = sketch.floor(sketch.height / scale);

    flowfield = new Array(cols * rows);

    for (var i = 0; i < amountOfParticles; i++) {
      particles[i] = new Particle(sketch);
    }
  };

  sketch.draw = () => {
    sketch.image(capture, 0, 0, 320, 240);

    console.log(capture.loadedmetadata)
    if(capture.loadedmetadata) {
      getFlowField();

      for (var i = 0; i < particles.length; i++) {
        particles[i].follow(flowfield);
        particles[i].update();
        particles[i].edges();
        particles[i].show();
      }
    }
  };
};

var sketches = [];
var elems = document.querySelectorAll(".fn-sketch");

elems.forEach((elem, index) => {
  sketches[index] = new p5(s, elem);
});

document.getElementById("store").addEventListener("click", function (e) {
  sketches.forEach((sketch) => {
    var file_name = `export_${document.title}_${sketch._userNode.getAttribute(
      "data-url"
    )}_${new Date().toDateString().replace(" ", "_")}`;
    sketch.saveCanvas(file_name, "png");
  });
});
