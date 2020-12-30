const fs = require('fs');
const srcFolder = "./_scraper";
let allDataFile = require(srcFolder + '/all.json');
allDataFile.users = [];

fs.readdirSync(srcFolder).forEach(folder => {

    if (fs.existsSync(srcFolder + "/" + folder + "/")) {
        console.log('Directory exists!');
        
        if (folder.indexOf('__') !== -1) return false
        allDataFile.users.push(folder);
        const fileName = `${srcFolder}/${folder}/${folder}.json`
        let dataFile = require(fileName);
        dataFile.posts = [];

        fs.readdirSync(srcFolder + "/" + folder + "/").forEach(file => {
            if (file.indexOf('jpg') != -1 && file.indexOf(folder) != -1) {
                dataFile.posts.push(file);
            }
        });
        console.log(dataFile.posts.length);

        fs.writeFile(fileName, JSON.stringify(dataFile), function writeJSON(err) {
            if (err) return console.log(err);
            console.log('writing to ' + fileName);
        });
    } else {
        console.log('Directory not found.');
    }

});

fs.writeFile(srcFolder + '/all.json', JSON.stringify(allDataFile), function writeJSON(err) {
    if (err) return console.log(err);
    console.log('writing to ' + srcFolder + '/all.json');
});