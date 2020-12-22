
var RED = "red";
var GREEN = "green";
var BLUE = "blue";
var HUE = "hue";
var SATURATION = "saturation";
var BRIGHTNESS = "brightness";
var GRAYSCALE = "grayscale";
var ALPHA = "alpha";

var sortColorsSlow = function (sketch, colors) {

    for (let i = 0; i < colors.length; i++) {
        var a = colors[i];
        var b = i > 0 ? colors[i - 1] : colors[i];
        if (sketch.saturation(a) < sketch.saturation(b)) {
            [colors[i - 1], colors[i]] = [colors[i], colors[i - 1]];
        }
    }

    for (let i = colors.length - 1; i > 0; i--) {
        var a = colors[i];
        var b = i > 0 ? colors[i - 1] : colors[i];
        if (sketch.saturation(a) < sketch.saturation(b)) {
            [colors[i - 1], colors[i]] = [colors[i], colors[i - 1]];
        }
    }

    return colors;
}

var sortColors = function (sketch, colors, method) {

    // sort red
    if (method == RED) colors.sort(function (a, b) {
        if (sketch.red(a) < sketch.red(b)) return -1;
        if (sketch.red(a) > sketch.red(b)) return 1;
        return 0;
    });

    // sort green
    if (method == GREEN) colors.sort(function (a, b) {
        if (sketch.green(a) < sketch.green(b)) return -1;
        if (sketch.green(a) > sketch.green(b)) return 1;
        return 0;
    });

    // sort blue
    if (method == BLUE) colors.sort(function (a, b) {
        if (sketch.blue(a) < sketch.blue(b)) return -1;
        if (sketch.blue(a) > sketch.blue(b)) return 1;
        return 0;
    });

    // sort hue
    if (method == HUE) colors.sort(function (a, b) {
        //convert a and b from RGB to HSV
        var aHue = chroma(sketch.red(a), sketch.green(a), sketch.blue(a)).get('hsv.h');
        var bHue = chroma(sketch.red(b), sketch.green(b), sketch.blue(b)).get('hsv.h');

        if (aHue < bHue) return -1;
        if (aHue > bHue) return 1;
        return 0;
    });

    // sort saturation
    if (method == SATURATION) colors.sort(function (a, b) {
        //convert a and b from RGB to HSV
        var aSat = chroma(sketch.red(a), sketch.green(a), sketch.blue(a)).get('hsv.s');
        var bSat = chroma(sketch.red(b), sketch.green(b), sketch.blue(b)).get('hsv.s');

        if (aSat < bSat) return -1;
        if (aSat > bSat) return 1;
        return 0;
    });

    // sort brightness
    if (method == BRIGHTNESS) colors.sort(function (a, b) {
        //convert a and b from RGB to HSV
        var aBright = chroma(sketch.red(a), sketch.green(a), sketch.blue(a)).get('hsv.v');
        var bBright = chroma(sketch.red(b), sketch.green(b), sketch.blue(b)).get('hsv.v');

        if (aBright < bBright) return -1;
        if (aBright > bBright) return 1;
        return 0;
    });

    // sort grayscale
    if (method == GRAYSCALE) colors.sort(function (a, b) {
        var aGrey = (sketch.red(a) * 0.222 + sketch.green(a) * 0.707 + sketch.blue(a) * 0.071);
        var bGrey = (sketch.red(b) * 0.222 + sketch.green(b) * 0.707 + sketch.blue(b) * 0.071);

        if (aGrey < bGrey) return -1;
        if (aGrey > bGrey) return 1;
        return 0;
    });

    // sort alpha
    if (method == ALPHA) colors.sort(function (a, b) {
        if (alpha(a) < alpha(b)) return -1;
        if (alpha(a) > alpha(b)) return 1;
        return 0;
    });

    return colors;
};
