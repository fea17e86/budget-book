/* eslint-disable no-mixed-requires */
/* eslint-disable no-console */
var assets = require('./package-assets.json'),
    gulp = require('gulp'),

    // css/less
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    minifyCss = require('gulp-minify-css'),
    // concatCss = require('gulp-concat-css'),
    // -> does not support sourcemaps (https://github.com/mariocasciaro/gulp-concat-css/issues/5)
    // -> we use gulp-concat instead + inlining non-web-resources is performed by less

    // js/jsx/babel
    browserify = require('browserify'),
    watchify = require('watchify'),
    //babelify = require('babelify'), specified in package.json
    uglify = require('gulp-uglify'),
    eslint = require('gulp-eslint'),
    flow = require('gulp-flowtype'),

    // png/jpg
    imagemin = require('gulp-imagemin'),

    // utils
    sourcemaps = require('gulp-sourcemaps'),
    // compatibility table for sourcemaps
    // -> https://github.com/floridoo/gulp-sourcemaps/wiki/Plugins-with-gulp-sourcemaps-support
    concat = require('gulp-concat'),
    replace = require('gulp-replace'),
    size = require('gulp-size'),
    rename = require('gulp-rename'),
    rev = require('gulp-rev'),
    revReplace = require('gulp-rev-replace'),

    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    del = require('del'),
    notify = require('gulp-notify'),
    sync = require('gulp-sync')(gulp).sync,
    es = require('event-stream'),
    cache = require('gulp-cache'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    gulpif = require('gulp-if'),
    liveReactload = require('livereactload'),
    gexpress = require('gulp-express');

var config = {
  path: {
    src: './src',
    client: './src/client',
    server: './src/server',
    dist: './dist',
    pub: './dist/public'
  }
};

require('harmonize')();

//
// Webserver with live-reload.
//
/*gulp.task('serve', function() {

  var serverConfig = config.server || {};

  browserSync({
    server: {
      baseDir: config.path.dist,
      port: serverConfig.port,
      middleware: []
    }
  });
});*/

gulp.task('serve', function () {
    // Start the server at the beginning of the task
    gexpress.run([config.path.dist + '/server.js']);
});

//
// Bundling (scripts, styles, fonts, html, images, +).
//
var bundler = {
  useReactHotDeploy: false,
  w: null,
  init: function() {
    this.w = watchify(browserify({
      entries: [config.path.client + '/app/index.jsx'],
      debug: true, // enable inline sourcemaps
      cache: {},
      packageCache: {},
      // Hot Reloading of React Components can be enabled via build.cfg.json
      // More info on its usage and how it works can be found at
      // > https://github.com/milankinen/livereactload#when-does-it-not-work
      plugin: []
      // Mandatory transforms (e.g. babelify) are specified in package.json
      // Options for babel(ify) are specified in .babelrc
    }));
  },
  bundle: function() {
    return this.w && this.w.bundle()
        .on('error', notify.onError())
      .pipe(source('scripts/app.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(config.path.pub))
      .pipe(size({title: 'scripts', showFiles: true}));
  },
  watch: function() {
    if (this.w) {
      this.w.on('update', this.bundle.bind(this));
    }
  },
  stop: function() {
    if (this.w) { this.w.close(); }
  }
};

gulp.task('scripts:watch', function() {
  bundler.init();
  return bundler.bundle();
});

gulp.task('scripts', ['scripts:watch'], bundler.stop.bind(bundler));

gulp.task('server-scripts', function () {
  return gulp.src(config.path.server + '/**/*.js')
    .pipe(gulp.dest(config.path.dist))
    .pipe(size({title: 'server-scripts', showFiles: true}));
});

gulp.task('styles', function() {

  function lessify(name, glob, options) {
    var lessOptions = Object.assign({}, {
      paths: [ config.path.client + '/styles', './node_modules/' ]
    }, options);
    return gulp.src(glob)
        .pipe(sourcemaps.init())
        .pipe(less(lessOptions)).on('error', notify.onError())
        .pipe(autoprefixer('last 2 version'))
        .pipe(size({title: 'styles:' + name, showFiles: true}));
  }

  var lessApp = lessify(
    'app',
    [config.path.client + '/**/main.less'],
    { strictMath: true, strictUnits: true }
  );

  return es.merge(lessApp)
    //.pipe(concatCss('styles/main.css'), {rebaseUrls: false}) // no sourcemap support
    .pipe(concat('styles/main.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.path.pub))
    .pipe(size({title: 'styles:concat', showFiles: true}));
});

gulp.task('html', function() {
  return gulp.src(config.path.client + '/**/*.html')
    .pipe(gulp.dest(config.path.pub))
    .pipe(size({title: 'html', showFiles: true}));
});

gulp.task('images', function() {
  return gulp.src([config.path.client + '/**/*.*(png|jpg|gif|svg)'])
    .pipe(cache(imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest(config.path.pub))
    .pipe(size({title: 'images', showFiles: true}));
});

gulp.task('fonts', function() {
  return gulp.src([config.path.client + '/fonts/**/*.*(eot|ttf|woff|woff2|svg|otf)'])
    .pipe(gulp.dest(config.path.pub + '/fonts'))
    .pipe(size({title: 'fonts', showFiles: true}));
});

gulp.task('extras', function() {

  function copyTask(from, to) {
    return gulp.src(from)
      .pipe(gulp.dest(to))
      .pipe(size({title: 'extras:' + from, showFiles: true}));
  }

  var streams = [
    copyTask(config.path.client + '/*.txt', config.path.pub),
    copyTask(config.path.client + '/*.ico', config.path.pub)
  ];
  for (var glob in assets) {
    var destination = config.path.pub + assets[glob];
    var stream = copyTask(glob, destination);
    streams.push(stream);
  }

  return es.merge(streams);
});

//
// Linting. Typechecking. Testing.
//
gulp.task('lint', function() {
  return gulp.src([config.path.src + '/**/*.*(jsx|js)', './gulpfile.js'])
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('typecheck', function() {
  var onWindows = process.env.OS === 'Windows_NT';

  if (onWindows) {
    console.warn('Typechecking is not yet supported on Windows (and therefore skipped). Please check https://github.com/facebook/flow/issues/6 for more information.');
    return null;
  } else {
    return gulp.src(config.path.src + '/**/*.*(jsx|js)')
      .pipe(flow({
        all: false,
        weak: false,
        declarations: './declarations',
        killFlow: false,
        beep: true,
        abort: false
      }))
      // we do not need to remove any flow annotations here
      // because this will be done by babel(ify)
      //.pipe(...)
      ;
  }
});

gulp.task('test', function() {
  // TODO this part is totally blank :(
  // JEST would be cool, but has issues on Windows (Visual Studio 7gb needed for installation o.O).
  // Best alternative is probably Jasmin.
  console.log('TODO TEST');
});

//
// Remove development banner.
// Reference minified CSS/JS (src="app.js" -> src="app.min.js").
//
gulp.task('html:production', function() {
  return gulp.src(config.path.dist + '/*.html')
    .pipe(replace('<div class="development"></div>', ''))
    .pipe(replace(/<script src="(.*)\.js"><\/script>/g, '<script src="$1.min.js"></script>'))
    .pipe(replace(/<link rel="stylesheet" href="(.*)\.css"\/?>/g, '<link rel="stylesheet" href="$1.min.css">'))
    .pipe(gulp.dest(config.path.dist))
    .pipe(size({title: 'html:production', showFiles: true}));
});

//
// Minification / Uglification.
//
gulp.task('minify:js', function() {
  return gulp.src(config.path.dist + '/**/*.js')
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.path.dist))
    .pipe(size({title: 'minify:js', showFiles: true}));
});

gulp.task('minify:css', function() {
  return gulp.src(config.path.dist + '/**/*.css')
    .pipe(sourcemaps.init({loadMaps: true}))
    // TODO this step does not currently work
    //      https://github.com/murphydanger/gulp-minify-css/issues/80
    //.pipe(minifyCss())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.path.dist))
    .pipe(size({title: 'minify:css', showFiles: true}));
});

gulp.task('minify', ['minify:js', 'minify:css']);

//
// Hash-Revisioning (app.js -> app-7bb3d683cd.js).
//
gulp.task('revision:rename', function() {
  return gulp.src([config.path.dist + '/**/*.*(css|js)'])
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(rev())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.path.dist))
    .pipe(size({title: 'revision:rename', showFiles: true}))
    .pipe(rev.manifest())
    .pipe(gulp.dest(config.path.dist));
});

gulp.task('revision:replace', function() {
  var manifest = gulp.src(config.path.dist + '/rev-manifest.json');

  return gulp.src([config.path.dist + '/**/*.*(css|js|html)'])
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(revReplace({manifest: manifest}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.path.dist))
    .pipe(size({title: 'revision:replace', showFiles: true}));
});

gulp.task('revision', sync(['revision:rename', 'revision:replace']));

//
// Utils. Cleanup.
//
gulp.task('clean', function() {
  return del(config.path.dist);
});

gulp.task('clear-cache', function() {
  cache.clearAll();
});

gulp.task('set-production', function() {
  process.env.NODE_ENV = 'production';
});

gulp.task('bundle:watch', sync([['images', 'fonts', 'extras'], ['styles', 'server-scripts', 'scripts:watch'], 'html']));
gulp.task('clean-bundle:watch', sync([['clean', 'clear-cache'], 'lint', 'typecheck', 'test', 'bundle:watch']));





//
// Exported tasks.
// In most cases those tasks are the ones used from command line.
//
gulp.task('build', ['clean-bundle:watch'], bundler.stop.bind(bundler));
gulp.task('build:production', sync(['set-production', 'build', 'minify', 'html:production', 'revision']));
//or gulp.task('build:production', sync(['set-production', 'build', 'revision', 'minify', 'html:production']));

gulp.task('serve:production', sync(['build:production', 'server']));

gulp.task('watch', sync(['clean-bundle:watch', 'serve']), function() {
  bundler.watch();
  gulp.watch([config.path.client + '/**/*.*(jsx|js)', './.eslintrc', './gulpfile.js'], ['lint']);
  gulp.watch([config.path.server + '/**/*.js'], ['lint', 'server-scripts', gexpress.notify]);
  gulp.watch([config.path.client + '/**/*.html'], ['html', gexpress.notify]);
  gulp.watch(Object.keys(assets), ['extras', gexpress.notify]);
  gulp.watch([config.path.src + '/**/*.*(less|css|overrides|variables)'], ['styles', gexpress.notify]);
  gulp.watch([config.path.src + '**/*.*(png|jpg|gif|svg)'], ['images', gexpress.notify]);
  gulp.watch([config.path.src + '/fonts/**/*'], ['fonts', gexpress.notify]);
});

gulp.task('default', ['build']);
