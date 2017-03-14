var gulp = require('gulp')
var sass = require('gulp-sass')
var sourcemaps = require('gulp-sourcemaps')
var autoprefixer = require('gulp-autoprefixer')
var livereload = require('gulp-livereload')
var replace = require('gulp-replace-task')
var concat = require('gulp-concat')
var fs = require('fs')

var package = JSON.parse(fs.readFileSync('./package.json'));

var sassOptions = {
	errLogToConsole: true,
	outputStyle: 'expaned'
}

var autoprefixerOptions = {
  browsers: ['last 2 versions', 'ie 9', 'android 2.3', 'android 4', 'opera 12']
}

var jsFiles = [
	'assets/vendors/bootstrap-sass/assets/javascripts/bootstrap.js',
	'assets/js/_*.js'
]

gulp.task('sass', function() {
	return gulp.src('./assets/scss/main.scss')
		.pipe(sourcemaps.init())
		.pipe(sass(sassOptions).on('error', sass.logError))
		.pipe(sourcemaps.write())
		.pipe(autoprefixer(autoprefixerOptions))
		.pipe(gulp.dest('./assets/css'))
		.pipe(livereload())
})

gulp.task('copy-font',function() {
	return gulp.src('./assets/vendors/font-awesome/fonts/**/*')
		.pipe(gulp.dest('./assets/fonts/'))
})

gulp.task('concat', function(cb) {
	return gulp.src(jsFiles)
		.pipe(concat('scripts.js'))
		.pipe(gulp.dest('./assets/js/'))
})

gulp.task('replace-prefix', function(){
	return gulp.src(['./*.php', './**/*.php', './assets/css/main.css'])
		.pipe(replace({
			patterns: [
				{
					match: /starter/g,
					replacement: package.func_prefix
				}
			]
		}))
})

gulp.task('watch', function(){
	livereload.listen()
	gulp.watch('./assets/scss/**.scss', ['sass']).on('change', function(e){
		console.log('File ' + e.path + ' was ' + e.type + ', running tasks...')
	})
	gulp.watch('./assets/js/_*.js', ['concat']).on('change', function(e){
		console.log('File ' + e.path + ' was ' + e.type + ', running tasks...')
	})
})

gulp.task('default', ['sass', 'copy-font', 'replace-prefix', 'replace-prefix', 'concat'])