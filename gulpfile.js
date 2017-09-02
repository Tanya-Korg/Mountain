var gulp       = require('gulp'), // Подключаем Gulp
    sass         = require('gulp-sass'), //Подключаем Sass пакет,
    browserSync  = require('browser-sync'), // Подключаем Browser Sync
    concat       = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
//    uglify       = require('gulp-uglifyjs'), // Подключаем gulp-uglifyjs (для сжатия JS)
    cssnano      = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
    rename       = require('gulp-rename'), // Подключаем библиотеку для переименования файлов
    del          = require('del'), // Подключаем библиотеку для удаления файлов и папок
    imagemin     = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
    pngquant     = require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
    cache        = require('gulp-cache'), // Подключаем библиотеку кеширования
    autoprefixer = require('gulp-autoprefixer'),// Подключаем библиотеку для автоматического добавления префиксов
	debug        = require('gulp-debug'),
    rigger       = require('gulp-rigger'),
    changed      = require('gulp-changed'),
    sourcemaps   = require('gulp-sourcemaps'),
	svgSprite	 = require('gulp-svg-sprite'),
	gulpIf       = require('gulp-if'),
	newer        = require('gulp-newer');
	

// Пути к файлам
var path = {
    dist3: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'dist3/',
        // js: 'build/js/',
        css: 'dist3/css/',
        img: 'dist3/img/',
        fonts: 'dist3/fonts/'
    },
    app: { //Пути откуда брать исходники
        html: 'app/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        // js: 'src/js/main.js',//В стилях и скриптах нам понадобятся только main файлы
        sass: 'app/sass/main.sass',
        css: 'app/css/**/*.css',
        img: 'app/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'app/fonts/**/*.*'
    }
  };

gulp.task('svg', ['clear'], function(){
	return gulp.src('app/img/svg/parts/**/*.svg')
	 .pipe(debug({title: 'svg:'}))
	.pipe(svgSprite({
		mode:{
			css:{
				dest: '.',
				bust: false,
				sprite: 'sprite.svg',
				layout: 'vertical',
				prefix: '%',
				render:{
					scss:{
						dest: '_sprite.scss'
					}
				}
			}
		}
	}))
	.pipe(gulpIf('*.scss', gulp.dest('app/sass'), gulp.dest('app/img/svg')));
});

gulp.task('browser-sync', function() { // Создаем таск browser-sync
    browserSync({ // Выполняем browserSync
        server: { // Определяем параметры сервера
            baseDir: 'app' // Директория для сервера - app
        },
        notify: false // Отключаем уведомления
    });
});

gulp.task('sass', function(){ // Создаем таск Sass
    return gulp.src('app/sass/**/*.scss') // Берем источник
	.pipe(newer('app/css'))
        .pipe(debug({title: 'sass:'}))
        .pipe(sourcemaps.init())
        .pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('app/css')) // Выгружаем результата в папку app/css
        .pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});

//gulp.task('scripts', function() {
//    return gulp.src([ // Берем все необходимые библиотеки
//        'app/libs/jquery/dist3/jquery.min.js', // Берем jQuery
//        'app/libs/magnific-popup/dist3/jquery.magnific-popup.min.js' // Берем Magnific Popup
//        ])
//        .pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
//        .pipe(uglify()) // Сжимаем JS файл
//        .pipe(gulp.dest('app/js')); // Выгружаем в папку app/js
//});
gulp.task('css:clean', function() {
    return del.sync('app/css/*.min.css');
});

gulp.task('css-min', ['css:clean', 'sass'], function() {
      return gulp.src(['!app/css/main.css', 'app/css/*.css'])
        .pipe(cssnano()) // Сжимаем
        .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
        .pipe(gulp.dest('app/css')); // Выгружаем в папку app/css
});

gulp.task('watch', ['browser-sync', 'css-min'], function() {
    gulp.watch('app/sass/**/*.scss', ['sass']); // Наблюдение за sass файлами в папке sass
    gulp.watch('app/*.html', ['html:build']); // Наблюдение за HTML файлами в корне проекта 
	gulp.watch('app/img/*.svg', ['svg']); // Наблюдение за HTML файлами в корне проекта
    gulp.watch('app/js/**/*.js', browserSync.reload);   // Наблюдение за JS файлами в папке js
});

gulp.task('clean', function() {
    return del.sync('dist3'); // Удаляем папку dist3 перед сборкой
});

gulp.task('img', function() {
    return gulp.src(path.app.img) // Берем все изображения из app
	.pipe(newer(path.dist3.img))
	.pipe(debug({title: 'imagemin:'}))
        .pipe(cache(imagemin({  // Сжимаем их с наилучшими настройками с учетом кеширования
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest(path.dist3.img)); // Выгружаем на продакшен
});
// Сборка HTML
gulp.task('html:build', function () {
    gulp.src(path.app.html) //Выберем файлы по нужному пути
    // .pipe(debug({title: 'rigger:'}))
        .pipe(rigger()) //Прогоним через rigger
        .pipe(gulp.dest('app')) 
        .pipe(browserSync.reload({stream: true})); //И перезагрузим наш сервер для обновлений
});

gulp.task('build', ['clean', 'svg', 'img', 'css-min', 'html:build'], function() {

    var buildCss = gulp.src([ // Переносим библиотеки в продакшен
        'app/css/*.css'
        ])
    .pipe(gulp.dest('dist3/css'))

    var buildFonts = gulp.src('app/fonts/**/*') // Переносим шрифты в продакшен
    .pipe(gulp.dest('dist3/fonts'))

     var buildJs = gulp.src('app/js/**/*') // Переносим скрипты в продакшен
     .pipe(gulp.dest('dist3/js'))
    //
     var buildHtml = gulp.src('app/*.html') // Переносим HTML в продакшен
     .pipe(gulp.dest('dist3'));

});
gulp.task('clear', function () {
    return cache.clearAll();
})

gulp.task('start', ['build', 'watch']);
