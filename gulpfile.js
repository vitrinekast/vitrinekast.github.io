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
    main: "./index.html",
    title: "<title>(.*?)</title>"
  },
  js: {
    src: ['*/*.js'],
    dest: './'
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
      const r = new RegExp("<\s*title[^>]*>(.*?)<\s*/\s*title>", 'g');
      file.contents = new Buffer.from(String(file.contents)
        .replace(r, `<title>${path.basename(file.dirname)}</title>`)
      );
    }))
    .pipe(gulp.dest(config.html.dest));
}

const setNav = () => {
  let list;
  let html;

  const regex = /<ul>(.*?)<\/ul>/gs;
  return gulp.src(config.html.main)
    .pipe(tap((file) => {
      list = [];
      html = '';
      fs.readdirSync("./").filter(function (file) {
        return fs.existsSync("./" + file + "/index.html")
      })
        .forEach((item) => {
          if (item) {
            html += `<li><a href="/${item}/">${item}</a></li>`
            list.push(item)
          }
        })

      file.contents = new Buffer.from(String(file.contents)
        .replace(regex, `<ul>${html}</ul>`)
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
        await page.setViewport({ width: 1024, height: 800 });

        await page.screenshot({
          path: `${path.basename(file.dirname, ".html")}/_exports/${new Date()}.png`,
          fullPage: true,
          omitBackground: true
        });


        await browser.close();
      }))
  });
}

exports.default = gulp.series(setTitle, watchFiles);
exports.clean = gulp.series(setNav);
