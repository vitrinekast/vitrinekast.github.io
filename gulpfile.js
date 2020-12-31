const gulp = require("gulp");
const puppeteer = require("puppeteer");
const tap = require("gulp-tap");
const path = require("path");
const fs = require('fs');
const browserSync = require('browser-sync').create();

const config = {
  html: {
    src: ['**/*.html', '!node_modules/**/*.html', '!boilerplate/*.html'],
    dest: './',
    title: /{{PAGE_TITLE}}/
  },
  js: {
    src: ['*/*.js'],
    dest: './',
    title: /{{PAGE_TITLE}}/
  },
  exports: {
    dest: '_exports'
  },
  puppeteer: {
    headless: true,
    args: [
      '--disable-web-security'
    ]
  },
  browsersync: {
    port: 3000,
    server: {
      baseDir: './'
    },

    notify: false
  }
}

const setTitle = () => {
  return gulp.src(config.html.src)
    .pipe(tap((file) => {
      file.contents = new Buffer.from(String(file.contents)
        .replace(config.html.title, path.basename(file.dirname))
      );
    }))
    .pipe(gulp.dest(config.html.dest));
}

function watchFiles() {
  browserSync.init(config.browsersync);

  gulp.watch(config.js.src).on("change", function (file) {
    gulp.src(file)
      .pipe(tap(async (file) => {
        var dir = `./${path.basename(file.dirname)}/${config.exports.dest}`;
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
          console.log('📁  folder created:', dir);
        }
      }))

      .pipe(tap(async (file) => {
        const browser = await puppeteer.launch(config.puppeteer);
        const page = await browser.newPage();

        await page.goto(`http://localhost:${config.browsersync.port}/${path.basename(file.dirname)}`, { timeout: 3000 });
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

exports.watch = gulp.series(setTitle, watchFiles);
exports.clean = gulp.series(setTitle);
