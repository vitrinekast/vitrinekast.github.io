var myDate = new Date('12/30/2020') ;
var u;
const s = (sketch) => {

    var username, sel, allUserData;
    var size = 800;
    var images = [];
    var margin = 32;
    var docTitle = '';
    

    getTimeAgo = (url) => {
        var timestamp = getDate(url);
        //11/20/2020 (beyonce)
        return Math.round((myDate - timestamp) / (1000 * 60 * 60 * 24));
    }

    getDate = (url) => {
        url = url.replace(' ', '_');
        var filename = url.substring(url.lastIndexOf("/") + 1, url.lastIndexOf(".")).split("_");
        var timestamp = new Date(`${filename[1].substring(0, 4)}-${filename[1].substring(4, 6)}-${filename[1].substring(6, 8)}`);

        timestamp.setHours(filename[2].substring(0, filename[2].indexOf('h')))
        timestamp.setMinutes(filename[2].substring(filename[2].indexOf('h') + 2, filename[2].indexOf('m')))
        timestamp.setSeconds(filename[2].substring(filename[2].indexOf('m') + 2, filename[2].indexOf('s')))

        return timestamp
    }

    updateFeed = () => {
        username = sel.selected();
        document.title = `${docTitle}: ${username}`
        images = [];

        return new Promise(function (resolve, reject) {

            sketch.loadJSON(`../_scraper/${username}/${username}.json`, (data) => {
                var results = [];

                data.posts.forEach((item) => {
                    results.push({
                        url: item,
                        timeAgo: getTimeAgo(item)
                    })
                })

                results.sort(function (a, b) {
                    return a.timeAgo > b.timeAgo
                });

                results.forEach((post, index) => {
                    sketch.loadImage(`../_scraper/${username}/${post.url}`, (result) => {
                        images.push({
                            img: result,
                            url: post.url.substring(post.url.lastIndexOf("/") + 1, post.url.lastIndexOf(".")).split("_"),
                            og: post.url,
                            timeAgo: post.timeAgo
                        });
                        if (images.length === data.posts.length) {
                            resolve(images);
                        }

                        if (!result) {
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
        sketch.resizeCanvas(size, (size + margin) * images.length)
        
        images = images.sort((a, b) => (a.timeAgo > b.timeAgo) ? 1 : ((b.timeAgo > a.timeAgo) ? -1 : 0));

        

        images.forEach((imageData, imageIndex) => {
            
            sketch.push();

            if (imageData.img.width > imageData.img.height) {
                imageData.img.resize(size, (imageData.img.height / imageData.img.width) * size);
            } else {
                imageData.img.resize(size * (imageData.img.width / imageData.img.height), size);
            }

            imageData.img.loadPixels();

            sketch.noStroke();
            var nothing = 0;

            var dif = sketch.map(imageData.timeAgo, 35, 0, -2, 4);
            var dif1 =sketch.map(imageData.timeAgo, 30, 0, 0, 4);
            
            var rgbDif = sketch.round(imageData.timeAgo / 2);

            
            for (let x = 0; x < imageData.img.width; x++) {
                for (let y = 0; y < imageData.img.height; y++) {
                    var index = ((y * imageData.img.width) + x) * 4;

                    if (typeof imageData.img.pixels[index + (imageData.img.width * 4)] === 'number') {

                        if (imageData.timeAgo > 3) {
                            // imageData.img.pixels[index + 1] = imageData.img.pixels[index + 1 + (sketch.max(1, sketch.min(rgbDif, 2)) * 4)];
                            // imageData.img.pixels[index + 2] = imageData.img.pixels[index + 2 + (sketch.max(1, sketch.min(rgbDif, 2)) * 4)];
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

                                imageData.img.pixels[index + (imageData.img.width * 4)] = store[0] - dif;
                                imageData.img.pixels[index + 1 + (imageData.img.width * 4)] = store[1] - dif;
                                imageData.img.pixels[index + 2 + (imageData.img.width * 4)] = store[2] - dif;
                                imageData.img.pixels[index + 3 + (imageData.img.width * 4)] = store[3] - dif;
                            } else {
                                nothing++;
                                if (typeof imageData.img.pixels[index + (imageData.img.height * 4)] === 'number') {
                                    var store = [imageData.img.pixels[index], imageData.img.pixels[index + 1], imageData.img.pixels[index + 2], imageData.img.pixels[index + 3]];
                                    // imageData.img.pixels[index + (imageData.img.width * 4)] -=dif1;
                                    // imageData.img.pixels[index + 1 + (imageData.img.width * 4)] -=dif1;
                                    // imageData.img.pixels[index + 2 + (imageData.img.width * 4)] -=dif1;
                                    // imageData.img.pixels[index + 3 + (imageData.img.width * 4)] -=dif1;
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
            // sketch.text(username, 5, 15);
            // sketch.text(`${imageData.og} `, 5, 30);
            // sketch.text(`${imageData.timeAgo} `, 5, 50);
            sketch.pop();
            u = [];
            images.forEach((img) => u.push(img.og))
            

        })
    }

    sketch.preload = () => {
        docTitle = document.title;
        allUserData = sketch.loadJSON(`../_scraper/all.json`);
    }

    sketch.setup = () => {
        sketch.createCanvas(60, 60);
        sel = sketch.createSelect();
        allUserData.users.forEach(user => sel.option(user));
        sel.changed(onSelectChange);
        sel.selected(allUserData.users[0]);


        updateFeed().then(function (val) {
            console.log('got all')
            drawFeed();
        })
    };

    sketch.draw = () => {

    };
};


var sketches = [];
document.querySelectorAll('.fn-sketch').forEach((elem, index) => {
    sketches[index] = new p5(s, elem);
})


document.getElementById('store').addEventListener('click', function (e) {
    console.log(sketches);
    sketches.forEach((sketch) => {
        var file_name = `export_${document.title}_${sketch._userNode.getAttribute('data-url')}_${myDate.toDateString().replace(' ', '_')}`;
        sketch.saveCanvas(file_name, 'png');
    })
})