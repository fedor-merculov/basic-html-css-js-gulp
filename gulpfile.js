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
const userStyleDevPath = './dev/style/user/'; // path to user sass/css files | путь к пользовательским файлам стилей
const vendorStyleDevPath = './dev/style/vendor/'; // path to vendor sass/css files | путь к вендорным файлам стилей
const userScriptDevPath = './dev/script/user/'; // path to user js files | путь к пользовательским скриптам
const vendorScriptDevPath = './dev/script/vendor/'; // path to vendor js files | путь к вендорным скриптам

/* Paths to dist-files. Use for gulp.dest | Пути до файлов сборки. Использовать для gulp.dest */ 
const userStyleDistPath = './dist/style/user/'; // path to user sass/css files | путь к пользовательским файлам стилей
const vendorStyleDistPath = './dist/style/vendor/'; // path to vendor sass/css files | путь к вендорным файлам стилей
const userScriptDistPath = './dist/script/user/'; // path to user js files | путь к пользовательским скриптам
const vendorScriptDistPath = './dist/script/vendor/'; // path to vendor js files | путь к вендорным скриптам

/* This function concatenates the selected path from the first parameter to all files declared in the array from the second parameter | 
   Данна функция конкатенирует путь из первого параметра со всеми объявленными в массиве именами файлов из второго параметра*/
function srcArr(path,name){
    return name.map(function(item){
        return path + item;
    });
};
/*  if you need to define a file processing order | Если Вам нужно определить порядок обработки файлов:
        1. create an unique array to declare files | создайте уникальный массив с объявлением файлов
        2. create unique array with function srcArr('path to dev-files' , 'array of declared files') | создайте уникальный массив используя функцию srcArr('путь до файлов разработки','массив объявленных файлов')
        3. use this array for gulp.src | используйте полученный массив для gulp.src

        Example | Пример:

        Create array sass/css files | Создаём массив файлов стилей

            const styleArr = [
                'first.scss',
                'second.css',
                'third.scss'
            ];

        Create array with srcArr() | Создаём массив используя функцию srcArr()

            const styleSrc = srcArr('./dev/styles/user/',styleArr)

        Use this array | Используем полученный массив

            gulp.src(styleSrc)
*/
 
/* Task functions | Функции задач*/

//Takes user sass/css files, compiles sass to css, writes autoprefixes, minifies, puts main.css and main.min.css
//Берёт пользовательские файлы стилей, компилирует, добавляет префиксы, минифицирует, кладёт main.css и main.min.css
function userStyle(cb){
    gulp.src(userStyleDevPath+"main.scss")
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

//Takes vendor sass/css files, compiles sass to css, minifies, puts *.css files and *.min.css files
//Берёт вендорные файлы стилей, компилирует, минифицирует, кладёт main.css и main.min.css файлы
function vendorStyle(cb){
    gulp.src(vendorStyleDevPath+"*")
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(vendorStyleDistPath))
    .pipe(cleanCSS({
        level: 2
    }))
    .pipe(rename({suffix: ".min"}))
    .pipe(gulp.dest(vendorStyleDistPath));
    cb();
};

//Takes user js files, minifies, puts main.js and main.min.js
//Берёт пользовательские скрипты, минифицирует, кладёт main.js и main.min.js
function userScript(cb){
    gulp.src(userScriptDevPath+"main.js")
    .pipe(gulp.dest(userScriptDistPath))
    .pipe(terser())
    .pipe(rename({suffix: ".min"}))
    .pipe(gulp.dest(userScriptDistPath));
    cb();
};

//Takes vendor js files, minifies, puts main.js files and main.min.js files
//Берёт вендорные скрипты, минифицирует, кладёт main.js и main.min.js файлы
function vendorScript(cb){
    gulp.src(vendorScriptDevPath+'*.js')
    .pipe(gulp.dest(vendorScriptDistPath))
    .pipe(terser())
    .pipe(rename({suffix: ".min"}))
    .pipe(gulp.dest(vendorScriptDistPath));
    cb();
};

//Monitors changes in files
//Мониторит изменения в файлах
function watch(){
    gulp.watch(userStyleDevPath+'*', userStyle);
    gulp.watch(vendorStyleDevPath+'*', vendorStyle);
    gulp.watch(userScriptDevPath+'*', userScript);
    gulp.watch(vendorScriptDevPath+'*', vendorScript);
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
gulp.task('default', gulp.parallel(sync,watch));
gulp.task('build', gulp.series(userStyle, vendorStyle, userScript, vendorScript));
gulp.task(sync);
gulp.task(userStyle);
gulp.task(vendorStyle);
gulp.task(userScript);
gulp.task(vendorScript);
gulp.task(watch);
gulp.task(sync);
gulp.task(reload);


