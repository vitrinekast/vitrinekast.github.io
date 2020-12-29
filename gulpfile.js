const gulp = require("gulp");
const puppeteer = require("puppeteer");
const tap = require("gulp-tap");
const path = require("path");
const fs = require('fs');
const browserSync = require('browser-sync').create();

const doSomething = () => {

}



function watchFiles() {
  browserSync.init({
    server: {
      baseDir: './'
    },
    notify: false
  });

  gulp.watch('*/*.js', doSomething).on("change", function (file) {
    console.log(file);
    gulp
      .src(file)
      .pipe(tap(async (file) => {
        var dir = "./" + path.basename(file.dirname) + "/_exports";
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
          console.log('📁  folder created:', dir);
        }
      }))

      .pipe(tap(async (file) => {
        const browser = await puppeteer.launch({
          headless: true, args: [
            '--disable-web-security',
          ]
        });

        const page = await browser.newPage();
        // await page.setViewport({ width: 1200, height: 6000 });
        await page.goto("http://localhost:3000/" + path.basename(file.dirname), { timeout: 3000 });
        await page.evaluate(() => {

          document.querySelectorAll('button').forEach(element => {
            element.style.visibility = "hidden";
          })

        })

        await page.screenshot({
          path: `${path.basename(file.dirname, ".html")}/_exports/${new Date()}.png`,
          fullPage: true,
          omitBackground: true
        });
        await browser.close();
      }))
  });
}



const watch = gulp.series(watchFiles);
// const build = gulp.series(screens);

exports.watch = watch;
// exports.default = build;
