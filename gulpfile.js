/**
 * Gulpfile for shopify
 */

 const gulp = require('gulp');
 const concat = require('gulp-concat');
 const rename = require('gulp-rename');
 const sass = require('gulp-sass')(require('sass'));
 const autoprefixer = require('gulp-autoprefixer'); // Import gulp-autoprefixer
 const terser = require('gulp-terser'); // Import terser plugin
 const cleanCSS = require('gulp-clean-css'); // Import gulp-clean-css
 
 const { src, dest, watch, series, parallel } = require('gulp');
 
 // Task to compile SASS to CSS
 function criticalStyles() {
   return src('src/critical/*.scss')  // Source files
     .pipe(sass().on('error', sass.logError))  // Compile SASS to CSS
     .pipe(autoprefixer()) // Add vendor prefixes
     .pipe(cleanCSS())
     .pipe(
       rename(function (path) {
         path.extname = path.extname.replace('.css', '.liquid');
         path.basename += '.css';
       })
     )
     .pipe(dest('snippets/'));    // Destination folder for the compiled CSS
 }
 
 // Task to compile SASS to CSS
 function styles() {
   return src('src/scss/*.scss')  // Source files
     .pipe(sass().on('error', sass.logError))  // Compile SASS to CSS
     .pipe(autoprefixer())  // Add vendor prefixes
     .pipe(cleanCSS())
     .pipe(
       rename(function (path) {
         path.basename += '.min';
       })
     )
     .pipe(dest('assets/'));    // Destination folder for the compiled CSS
 }
 
 // Task to minify and concatenate JavaScript files
 function scripts() {
   return src('src/js/*.js')    // Source files
     .pipe(concat('global.js'))    // Concatenate into a single file (all.js)
     .pipe(terser())            // Minify the JavaScript using terser
     .pipe(
       rename(function (path) {
         path.basename += '.min';
       })
     )
     .pipe(dest('assets/'));    // Destination folder for the minified file
 }
 
 // Watch task to automatically run tasks when files change
 function watchFiles() {
   watch('src/js/*.js', scripts); // Watch JavaScript files
   watch('src/scss/**/*.scss', styles); // Watch SASS files
   watch('src/scss/**/*.scss', criticalStyles); // Watch SASS files
   watch('src/critical/*.scss', criticalStyles); // Watch critical SASS files
 }
 
 
 // Default task (run using "gulp" command)
 const defaultTask = series(parallel(scripts, criticalStyles, styles), watchFiles);
 
 // Define what's runs when calling 'gulp' from the terminal
 exports.default = defaultTask;