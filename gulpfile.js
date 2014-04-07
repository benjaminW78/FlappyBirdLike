// Include gulp
var gulp = require('gulp'); 

// Include Our Plugins
var jshint       = require('gulp-jshint');
var sass         = require('gulp-sass');
var concat       = require('gulp-concat');
var uglify       = require('gulp-uglify');
var rename       = require('gulp-rename');
var browserify   = require('gulp-browserify');
var watch        = require('gulp-watch');
var header       = require('gulp-header');
var open         = require("gulp-open");
var tinylr       = require('tiny-lr');
var express      = require('express');
var livereload   = require('gulp-livereload');
// var de path pour les task sur les watch etc
var pathFromHtml = "views";
var pathFromJs   = "public";
var pathTo       = "build";

var server = tinylr();

 var app = express();
    app.use(express.static('./build/'));
    app.listen(8080, function() {
      console.log('Listening on', 8080);
    });

server.listen(35729, function (err) {
      if (err) return console.log(err);

gulp.task("Rewatch",function(){

    gulp.watch(["./"+pathFromJs+'/js/**/*.js'],
        function(){
                    gulp.start('insertVar');
                    gulp.start('lint');
                    gulp.start('browserify');
                })      
    
    gulp.watch(['./views/**/*.html'],
        function(){
                    gulp.start("ConstructHtml");
                })     
    
    gulp.watch(["./"+pathFromJs+'/css/**/*.css'],
        function(){
                    gulp.start("ConstructCss");
                  })      

  }); 
});
// Lint Task
gulp.task('lint', function() {
    return gulp.src(pathFromJs+'/js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Concatenate & Minify JS
gulp.task('browserify', function() {
    return gulp.src(pathFromJs+'/js/main.js')
        .pipe(browserify({
          insertGlobals : false,debug : !gulp.env.production}))
        .pipe(gulp.dest('./build/sources/js'))
        .pipe(livereload(server));
        gulp.start('Rewatch');
});

// Watch Files For Changes


gulp.task('insertVar', function() {
    return gulp.src(pathFromJs+'/js/main.js')
    .pipe(header("use strict ;"));
});

gulp.task('ConstructHtml',function(){
   return gulp.src(pathFromHtml+"/**/*.html")
    .pipe(gulp.dest('./build/'))
    .pipe(livereload(server));
});

gulp.task('ConstructCss',function(){
   return gulp.src(pathFromJs+"/css/**/*.css")
    .pipe(gulp.dest('./build/sources/css/'))
    .pipe(livereload(server));
});

// Default Task
gulp.task('default', ['Rewatch','insertVar', 'lint','browserify',"ConstructHtml","ConstructCss"],function(){
  // Open Google Chrome @ localhost:8080
  gulp.src('build/index.html')
    .pipe(open("",{
      app:"google-chrome",
      // app:"/usr/lib/chromium-browser/chromium-browser",
      url: "http://localhost:8080/"
}))});