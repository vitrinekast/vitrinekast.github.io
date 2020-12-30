var window_width = window.innerWidth;
var window_height = window.innerHeight;
var margin = 32;

const s = (sketch) => {

    var img, timestamp;


    sketch.preload = () => {
        let url = sketch._userNode.getAttribute('data-url');
        console.log(`preloading img: ${url}`);
        img = sketch.loadImage(url);
    }



    sketch.setup = () => {
        timestamp = sketch._userNode.getAttribute('data-timestamp');
        var timeAgo = Math.round((new Date() - new Date(timestamp)) / (1000 * 60 * 60 * 24));
        console.log(timeAgo);
        sketch.createCanvas(window.innerWidth, window.innerWidth)
        if (img.width > img.height) {
            img.resize(sketch.width, (img.height / img.width) * sketch.width);
        } else {
            img.resize(sketch.width * (img.width / img.height), sketch.width);

        }
        img.loadPixels();
        sketch.noStroke();

        sketch.clear();
        var nothing = 0;

        for (let x = 0; x < img.width; x++) {
            for (let y = 0; y < img.height; y++) {
                var index = ((y * img.width) + x) * 4;

                if (typeof img.pixels[index + (img.width * 4)] === 'number') {

                    // calculate brightness of the image
                    hsp1 = Math.sqrt(
                        0.299 * (img.pixels[index] * img.pixels[index]) +
                        0.587 * (img.pixels[index + 1] * img.pixels[index + 1]) +
                        0.114 * (img.pixels[index + 2] * img.pixels[index + 2])
                    );

                    hsp2 = Math.sqrt(
                        0.299 * (img.pixels[index + (img.width * 4)] * img.pixels[index + (img.width * 4)]) +
                        0.587 * (img.pixels[index + (img.width * 4) + 1] * img.pixels[index + (img.width * 4) + 1]) +
                        0.114 * (img.pixels[index + (img.width * 4) + 2] * img.pixels[index + (img.width * 4) + 2])
                    );
                        

                    if (hsp1 > hsp2) {
                        var store = [img.pixels[index], img.pixels[index + 1], img.pixels[index + 2], img.pixels[index + 3]];
                        img.pixels[index + (img.width * 4)] = store[0] - 200 - timeAgo;
                        img.pixels[index + 1 + (img.width * 4)] = store[1] - 200 - timeAgo;
                        img.pixels[index + 2 + (img.width * 4)] = store[2] - 200 - timeAgo;
                        img.pixels[index + 3 + (img.width * 4)] = timeAgo/2
                    } else {
                        nothing++;
                    }

                    img.pixels[index + 3 + (img.width * 4)] = (200-timeAgo)*2
                };

            }
        }
        console.log(`${nothing / (img.width * img.height) * 100}%`, 200 - timeAgo);
        img.updatePixels();
        sketch.image(img, 0, 0);

    }

    sketch.draw = () => {
        // createImage();


    };
};


let token;
var sketches = [];
const getFeed = (token) => {
    const URL = `https://graph.instagram.com/5894424129?fields=id,username,timestamp&access_token=${token}`;
    // const URL = `https://graph.instagram.com/17873440459141021/recent_media?fields=id,username,media,media_url,timestamp?user_id=17841439288406336&access_token=${token}`;
    
    fetch(URL, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            var list = data.data;

            list.forEach((item, index) => {
                var div = document.createElement('div');
                div.setAttribute('data-url', item.media_url);
                div.setAttribute('data-timestamp', item.timestamp);
                div.classList.add('fn-sketch');
                div.id = `aaa-${index}`;
                document.body.appendChild(div);
            })

            sketches = [];
            document.querySelectorAll('.fn-sketch').forEach((elem, index) => {
                sketches[index] = new p5(s, elem);
            })

        })
        .catch((error) => {
            console.error('Error:', error);
        });

}
window.addEventListener('load', (e) => {
    const APP_ID = 2698673407129647;
    const APP_SECRET = 'eedeec98bb015d29d5bacb7df5a31275';
    const href = window.location.href.replace('http', 'https');
    const authURL = `https://api.instagram.com/oauth/authorize?client_id=${APP_ID}&redirect_uri=${href}&scope=user_profile,user_media&response_type=code`;
    const codeIndex = href.indexOf("?code=");
    const ACCESS_TOKEN = 'IGQVJWeVhFeWZAwVTR6MHZAWNWpjWEwzb3ZAwVTM5bkNVMlVDOWZARR095bnBGOVpjYjFjakViOFpUTzMzbUNHaHIzSUIyTjZASUXB5ZAFJfVTBWbEx1RnRUZAmp5bUJEbHRQRVp5ZA0VQcXVoNG9SQzNjZA1d3ekFYek9CRkRXNTdJ';
    
    if (codeIndex !== -1) {
        document.querySelector('.fn-auth-link').textContent = ""
        const AUTH_CODE = href.substr(codeIndex + 6, href.length).replace('#_', '');
        const postdata = {
            'client_id': APP_ID,
            'client_secret': APP_SECRET,
            'code': AUTH_CODE,
            'grant_type': 'authorization_code',
            'redirect_uri': "https://localhost:3000/lostinpixels-embed"
        };
        console.log(postdata)

        // {"access_token": "IGQVJWeVhFeWZAwVTR6MHZAWNWpjWEwzb3ZAwVTM5bkNVMlVDOWZARR095bnBGOVpjYjFjakViOFpUTzMzbUNHaHIzSUIyTjZASUXB5ZAFJfVTBWbEx1RnRUZAmp5bUJEbHRQRVp5ZA0VQcXVoNG9SQzNjZA1d3ekFYek9CRkRXNTdJ", "user_id": 17841439288406336}Rosa-private:vitrinekast.github.io rschuurmans$ 
        const URL = `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${APP_SECRET}&access_token=${ACCESS_TOKEN}`;

        fetch(URL, {
            method: 'GET'
        })
            .then(response => response.json())
            .then(data => {
                token = data.access_token;

                getFeed(token);
            })
            .catch((error) => {
                console.error('Error:', error);
            });


    } else {

        document.querySelector('.fn-auth-link').href = authURL;
    }
})

document.getElementById('store').addEventListener('click', function (e) {
    sketches.forEach((sketch) => {
        var file_name = `export_${document.title}_${sketch._userNode.getAttribute('data-url')}_${new Date().toDateString().replace(' ', '_')}`;
        sketch.saveCanvas(file_name, 'png');
    })
})