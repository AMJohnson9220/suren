/**
 * Gulpfile for Shopify
 */

const gulp = require("gulp")
const concat = require("gulp-concat")
const rename = require("gulp-rename")
const sass = require("gulp-sass")(require("sass"))
const terser = require("gulp-terser")
const cleanCSS = require("gulp-clean-css")

const { src, dest, watch, series, parallel } = require("gulp")

// Dynamic import for ESM module (gulp-autoprefixer)
async function getAutoprefixer() {
  const { default: autoprefixer } = await import("gulp-autoprefixer")
  return autoprefixer
}

// Task to compile critical SASS to CSS
async function criticalStyles() {
  const autoprefixer = await getAutoprefixer()

  return src("src/critical/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(
      rename(function (path) {
        path.extname = path.extname.replace(".css", ".liquid")
        path.basename += ".css"
      })
    )
    .pipe(dest("snippets/"))
}

// Task to compile general SASS to CSS
async function styles() {
  const autoprefixer = await getAutoprefixer()

  return src("src/scss/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(
      rename(function (path) {
        path.basename += ".min"
      })
    )
    .pipe(dest("assets/"))
}

// Task to minify and concatenate JavaScript files
function scripts() {
  return src("src/js/*.js")
    .pipe(concat("global.js"))
    .pipe(terser())
    .pipe(
      rename(function (path) {
        path.basename += ".min"
      })
    )
    .pipe(dest("assets/"))
}

// Watch task to automatically run tasks when files change
function watchFiles() {
  watch("src/js/*.js", scripts)
  watch("src/scss/**/*.scss", series(styles, criticalStyles))
  watch("src/critical/*.scss", criticalStyles)
}

// Default task (run using "gulp" command)
const defaultTask = series(parallel(scripts, criticalStyles, styles), watchFiles)

// Export tasks
exports.default = defaultTask
exports.styles = styles
exports.criticalStyles = criticalStyles
exports.scripts = scripts
exports.watch = watchFiles
