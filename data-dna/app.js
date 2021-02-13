var window_width = window.innerWidth;
var window_height = window.innerHeight;
var margin = 32;

const s = (sketch) => {
    var history;
    var size = 800;

    sketch.preload = () => {
        let url = '../assets/data/StreamingHistory.json';
        history = sketch.loadJSON(url);
    }

    sketch.setup = () => {
        sketch.createCanvas(size, size)
        history = history.list.slice(0, 50);
        console.log(history);
        parseHistory();
        sketch.noLoop();
        // history  = history.slice(0, 50)
    };

    parseHistory = () => {
        history.forEach((item) => {
            var date = item.endTime.split(' ')[0].split('-');
            item.dayOfTheYear = Math.round(Number(date[1]) * 30.5) + Number(date[2]);
        })
    }

    sketch.draw = () => {
        sketch.fill('blue');
        var width = size/12;
        var height = size/31;

        for(var month = 0; month < 13; month++) {
            sketch.text('word', month*width, 30);
            var days = month % 2 ? 30 : 31;
            // for(var day = 0; day < month % 2 ? 30 : 31; day++) {
            //     sketch.rect(month*width, day*height, width, height);
            //     console.log(month*width, day*height, width, height)
            // }
        }

    };

}

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