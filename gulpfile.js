// Fedor Merculov | Фёдор Меркулов  fedor.merculov@gmail.com

/* Gulp plugins | Плагины Gulp */
const gulp = require ('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const terser = require('gulp-terser');
const browserSync = require('browser-sync').create();

/* Paths to dev-files. Use for gulp.src | Пути до файлов разработки. Использовать для gulp.src */
const userStyleDevPath = './dev/style/user/main.scss';
const vendorStyleDevPath = './dev/style/vendor/*.css';
const userScriptDevPath = './dev/script/user/main.js';
const vendorScriptDevPath = './dev/script/vendor/*.js';

/* Paths to dist-files. Use for gulp.dest | Пути до файлов сборки. Использовать для gulp.dest */
const userStyleDistPath = './dist/style/user/';
const vendorStyleDistPath = './dist/style/vendor/';
const userScriptDistPath = './dist/script/user/';
const vendorScriptDistPath = './dist/script/vendor/';
 
/* Task functions | Функции задач*/

//Takes main.sass from dev, compiles sass to css, writes autoprefixes, minifies, puts main.css and main.min.css to dist
//Берёт main.scss из dev, компилирует, добавляет префиксы, минифицирует, кладёт main.css и main.min.css в dist
function userStyle(cb){
    gulp.src(userStyleDevPath)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
        overrideBrowserslist:  ['last 2 versions'],
        cascade: false
    }))
    .pipe(gulp.dest(userStyleDistPath))
    .pipe(cleanCSS({
        level: 2
    }))
    .pipe(rename({suffix: ".min"}))
    .pipe(gulp.dest(userStyleDistPath));
    cb();
};

//Takes vendor css files from dev, puts to dev
//Берёт вендорные файлы стилей из dev, кладёт в dist
function vendorStyle(cb){
    gulp.src(vendorStyleDevPath)
    .pipe(gulp.dest(vendorStyleDistPath));
    cb();
};

//Takes user main.js from dev, minifies, puts main.js and main.min.js to dist
//Берёт main.js из dev, минифицирует, кладёт main.js и main.min.js в dist
function userScript(cb){
    gulp.src(userScriptDevPath)
    .pipe(gulp.dest(userScriptDistPath))
    .pipe(terser())
    .pipe(rename({suffix: ".min"}))
    .pipe(gulp.dest(userScriptDistPath));
    cb();
};

//Takes vendor js files from dev, puts to dev
//Берёт вендорные скрипты из dev, кладёт в dist
function vendorScript(cb){
    gulp.src(vendorScriptDevPath)
    .pipe(gulp.dest(vendorScriptDistPath));
    cb();
};

//Monitors changes in files
//Мониторит изменения в файлах
function watch(){
    gulp.watch(userStyleDevPath+'*', userStyle);
    gulp.watch(userScriptDevPath+'*', userScript);
    gulp.watch('./**/*.html', reload);
    gulp.watch('./**/*.css', reload);
    gulp.watch('./**/*.js', reload);
};

//Browser sync
//Синхронизация браузера
function sync(cb) {
    browserSync.init({
        server: {
            baseDir: "./"
        },
        port: 3000
    });
    cb();
};

//Browser reload
//Перезагрузка страницы браузера
function reload(cb){
    browserSync.reload();
    cb();
};

/* Tasks | Задачи*/
gulp.task('default', gulp.parallel(sync,watch,userStyle, vendorStyle, userScript, vendorScript));
// gulp.task('build', gulp.series(userStyle, vendorStyle, userScript, vendorScript));
gulp.task(sync);
gulp.task(userStyle);
gulp.task(vendorStyle);
gulp.task(userScript);
gulp.task(vendorScript);
gulp.task(watch);
gulp.task(sync);
gulp.task(reload);


