const s = (sketch) => {

    var username, sel, allUserData, timeInput;
    var size = 800;
    var images = [];
    var margin = 32;
    var docTitle = '';

    getTimeAgo = (url) => {
        url = url.replace(' ', '_');
        var filename = url.substring(url.lastIndexOf("/") + 1, url.lastIndexOf(".")).split("_");
        var timestamp = new Date(`${filename[1].substring(0, 4)}-${filename[1].substring(4, 6)}-${filename[1].substring(6, 8)}`);

        timestamp.setHours(filename[2].substring(0, filename[2].indexOf('h')))
        timestamp.setMinutes(filename[2].substring(filename[2].indexOf('h') + 2, filename[2].indexOf('m')))
        timestamp.setSeconds(filename[2].substring(filename[2].indexOf('m') + 2, filename[2].indexOf('s')))
        timeAgo = Math.round((new Date() - timestamp) / (1000 * 60 * 60 * 24));

        // return Math.round((new Date() - timestamp) / (1000 * 60 * 60 * 24));
        return 0
    }

   
    updateFeed = () => {
        username = sel.selected();
        document.title = `${docTitle}: ${username}`
        images = [];

        return new Promise(function (resolve, reject) {

            sketch.loadJSON(`../_scraper/${username}/${username}.json`, (data) => {
                
                data.posts = data.posts.reverse().slice(0, 1);
                
                data.posts.forEach((post, index) => {
                    sketch.loadImage(`../_scraper/${username}/${post}`, (result) => {
                        images.push({
                            img: result,
                            timeAgo: getTimeAgo(post)
                        });
                        if (images.length === data.posts.length ) {
                            resolve(images);
                        }

                        if(!result) {
                            reject(Error('no!'))
                        }
                    });
                });
            })
        });
    }

    onSelectChange = () => {
        updateFeed().then(function (val) {
            drawFeed();
        })
    }



    function drawFeed() {
        sketch.clear();
        sel.position(0, 10);
        timeInput.position(0, 30)
        sketch.resizeCanvas(size, (size + margin) * images.length)

        images.forEach((imageData, imageIndex) => {
            console.log('drawFeed item', imageData.img.width, imageData.img.height, sketch.width, sketch.height)
            sketch.push();
            // imageData.timeAgo += 1;

            if (imageData.img.width > imageData.img.height) {
                imageData.img.resize(size, (imageData.img.height / imageData.img.width) * size);
            } else {
                imageData.img.resize(size * (imageData.img.width / imageData.img.height), size);
            }

            imageData.img.loadPixels();

            sketch.noStroke();
            var nothing = 0;
            var removeBrightness = imageData.timeAgo < 10 ? 10 - imageData.timeAgo : sketch.round(imageData.timeAgo / 10);
            for (let x = 0; x < imageData.img.width; x++) {
                for (let y = 0; y < imageData.img.height; y++) {
                    var index = ((y * imageData.img.width) + x) * 4;

                    if (typeof imageData.img.pixels[index + (imageData.img.width * 4)] === 'number') {

                        if (imageData.timeAgo > 2) {

                            // calculate brightness of the image
                            hsp1 = Math.sqrt(
                                0.299 * (imageData.img.pixels[index] * imageData.img.pixels[index]) +
                                0.587 * (imageData.img.pixels[index + 1] * imageData.img.pixels[index + 1]) +
                                0.114 * (imageData.img.pixels[index + 2] * imageData.img.pixels[index + 2])
                            );

                            hsp2 = Math.sqrt(
                                0.299 * (imageData.img.pixels[index + (imageData.img.width * 4)] * imageData.img.pixels[index + (imageData.img.width * 4)]) +
                                0.587 * (imageData.img.pixels[index + (imageData.img.width * 4) + 1] * imageData.img.pixels[index + (imageData.img.width * 4) + 1]) +
                                0.114 * (imageData.img.pixels[index + (imageData.img.width * 4) + 2] * imageData.img.pixels[index + (imageData.img.width * 4) + 2])
                            );
                            if (hsp1 > hsp2) {
                                var store = [imageData.img.pixels[index], imageData.img.pixels[index + 1], imageData.img.pixels[index + 2], imageData.img.pixels[index + 3]];
                                imageData.img.pixels[index + (imageData.img.width * 4)] = store[0] - removeBrightness;
                                imageData.img.pixels[index + 1 + (imageData.img.width * 4)] = store[1] - removeBrightness;
                                imageData.img.pixels[index + 2 + (imageData.img.width * 4)] = store[2] - removeBrightness;
                            } else {
                                nothing++;
                                if (typeof imageData.img.pixels[index + (imageData.img.height * 4)] === 'number') {
                                    imageData.img.pixels[index + (imageData.img.height * 4)] = sketch.max(imageData.img.pixels[index + (imageData.img.height * 4)], imageData.img.pixels[index] + imageData.timeAgo);
                                    imageData.img.pixels[index + (imageData.img.height * 4) + 1] = sketch.max(imageData.img.pixels[index + (imageData.img.height * 4) + 1], imageData.img.pixels[index + 1] + imageData.timeAgo);
                                    imageData.img.pixels[index + (imageData.img.height * 4) + 2] = sketch.max(imageData.img.pixels[index + (imageData.img.height * 4) + 2], imageData.img.pixels[index + 2] + imageData.timeAgo);
                                    imageData.img.pixels[index + (imageData.img.height * 4) + 3] = sketch.max(imageData.img.pixels[index + (imageData.img.height * 4) + 3], imageData.img.pixels[index + 3] + imageData.timeAgo);
                                }

                            }
                        } else {

                        }
                    };

                }
            }

            imageData.img.updatePixels();

            sketch.translate(0, imageIndex * (size + margin))

            sketch.image(imageData.img, 0, 0);
            sketch.fill('white');
            sketch.text(username, 5, 15);
            sketch.text(`${imageData.timeAgo}`, 5, 30);
            sketch.pop();

        })
    }

    sketch.preload = () => {
        docTitle = document.title;
        allUserData = sketch.loadJSON(`../_scraper/all.json`);
    }

    sketch.setup = () => {
        sel = sketch.createSelect();
        allUserData.users.forEach(user => sel.option(user));
        sel.changed(onSelectChange);
        sel.selected(allUserData.users[0]);

        updateFeed().then(function (val) {
            drawFeed();
        })
    };

    sketch.draw = () => {
        // drawFeed();
    };
};


var sketches = [];
document.querySelectorAll('.fn-sketch').forEach((elem, index) => {
    sketches[index] = new p5(s, elem);
})


document.getElementById('store').addEventListener('click', function (e) {
    console.log(sketches);
    sketches.forEach((sketch) => {
        var file_name = `export_${document.title}_${sketch._userNode.getAttribute('data-url')}_${new Date().toDateString().replace(' ', '_')}`;
        sketch.saveCanvas(file_name, 'png');
    })
})