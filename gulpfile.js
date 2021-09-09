// Metoder
const { src, dest, parallel, series, watch } = require("gulp");
// slå ihop filer
const concat = require("gulp-concat");
// minimera js
const terser = require("gulp-terser");
// minimera css
const cssnano = require("gulp-cssnano");
// minimera bilder
const imagemin = require("gulp-imagemin");
// browsersync
const browserSync = require("browser-sync").create();
// sourceMaps
const sourcemaps = require("gulp-sourcemaps");

// objekt för att lagra sökvägar
const files = {
  htmlPath: "src/**/*.html",
  cssPath: "src/**/*.css",
  jsPath: "src/**/*.js",
  picPath: "src/pics/*",
};

// htmlTask
function htmlTask() {
  return (
    // Hämta filerna
    src(files.htmlPath)
      // skicka till pub
      .pipe(dest("pub"))
  );
}
// cssTask
function cssTask() {
  return (
    // slå ihop filer
    src(files.cssPath)
      // sourcemaps
      .pipe(sourcemaps.init())
      .pipe(concat("main.css"))
      // minimera filer
      .pipe(cssnano())
      // sourcemaps
      .pipe(sourcemaps.write())
      // skicka till pub
      .pipe(dest("pub/css"))
  );
}
// jsTask
function jsTask() {
  return (
    src(files.jsPath)
      // sourcemap
      .pipe(sourcemaps.init())
      // slå ihop
      .pipe(concat("main.js"))
      // minimera filer
      .pipe(terser())
      // sourcemaps
      .pipe(sourcemaps.write())
      // skicka till pub
      .pipe(dest("pub/js"))
  );
}

// picTask
function picTask() {
  return (
    src(files.picPath)
      // minimera bilder
      .pipe(imagemin())
      // skicka till pub
      .pipe(dest("pub/pics"))
  );
}

// en watchtask för att automatisera metoderna.
function watchTask() {
  // browsersync, ändra från app till pub
  browserSync.init({
    server: "./pub",
  });

  // metoden watch som tar en array och ett argument.
  // Ladda om webbläsaren vid förändring, browsersync
  watch(
    [files.htmlPath, files.cssPath, files.jsPath, files.picPath],
    parallel(htmlTask, cssTask, jsTask, picTask)
  ).on("change", browserSync.reload);
}

// Dags att exportera, först körs alla task parallelt,
//  sedan watchTask med browserSync.
exports.default = series(
  parallel(htmlTask, cssTask, jsTask, picTask),
  watchTask
);
