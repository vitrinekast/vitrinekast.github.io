const s = (sketch) => {
  var flowfield = [];
  var particles = [];
  var zoff = 0;
  var scale = 10;
  var inc = 0.1;
  var cols, rows, fr;
  var amountOfParticles = 300;
  var maxSpeed = 4;
  var sliders = [];
  var mag = 1;

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
      var margin = sketch.width / scale / 4;

      var x = sketch.floor(
        sketch.map(
          this.pos.x / scale,
          0,
          sketch.width / scale,
          margin,
          sketch.width / scale - margin
        )
      );
      var y = sketch.floor(
        sketch.map(
          this.pos.y / scale,
          0,
          sketch.height / scale,
          margin,
          sketch.height / scale - margin
        )
      );
      var index = x + y * cols;
      var force = vectors[index];

      this.applyForce(force);
    }

    applyForce(force) {
      this.acc.add(force);
    }

    show() {
      var r = sketch.map(this.pos.x, 0, sketch.width, 0, 255);
      var g = sketch.map(this.pos.y, 0, sketch.height, 100, 255);
      var c = sketch.color(r, g, 255);
      c.setAlpha(40);
      sketch.stroke(c);

      sketch.strokeWeight(2);
      sketch.line(
        this.pos.x,
        this.pos.y,
        this.prevPos.x,
        sketch.random(this.prevPos.y - 1, this.prevPos.y + 1)
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

  sketch.setup = () => {
    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
    cols = sketch.floor(sketch.width / scale);
    rows = sketch.floor(sketch.height / scale);
    fr = sketch.createP("");
    flowfield = new Array(cols * rows);

    for (var i = 0; i < amountOfParticles; i++) {
      particles[i] = new Particle(sketch);
    }

    sketch.background(0);

    // sketch.noLoop();
  };

  sketch.draw = () => {
    var yoff = 0;

    for (var y = 0; y < rows; y++) {
      var xoff = 0;

      for (let x = 0; x < cols; x++) {
        var index = x + y * cols;
        var angle = sketch.noise(xoff, yoff, zoff) * sketch.TWO_PI * 4;
        var v = p5.Vector.fromAngle(angle);
        v.setMag(mag);
        flowfield[index] = v;
        xoff += inc;
        sketch.stroke(0, 50);
      }

      yoff += inc;

      zoff += 0.00003;
      //   sketch.pixelDensity(zoff*10);
    }

    for (var i = 0; i < particles.length; i++) {
      particles[i].follow(flowfield);
      particles[i].update();
      particles[i].edges();
      particles[i].show();
    }

    fr.html(sketch.floor(sketch.frameRate()));
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
