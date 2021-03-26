// Gulp packages
import {src, dest, watch, parallel, series} from 'gulp';

// CSS related packages
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'gulp-autoprefixer';
import minifycss from 'gulp-uglifycss';

// Image packages
import imagemin from 'gulp-imagemin';

// JS related packages
import webpack from 'webpack-stream';

// Utilities packages
import browserSync from "browser-sync";
import del from "del";
import gulpif from 'gulp-if';
import filter from 'gulp-filter';
import lineec from 'gulp-line-ending-corrector';
import named from "vinyl-named";
import replace from 'gulp-replace';
import yargs from 'yargs';
import zip from 'gulp-zip';

import config from './gulp.config.js';
import info from './package.json';

const PRODUCTION = yargs.argv.prod;
const server = browserSync.create();

export const serve = (done) => {
  server.init({
    proxy: config.projectURL
  });
  done();
};

export const reload = (done) => {
  server.reload();
  done();
};

export const clean = () => del(["dist"]);

export const styles = () => {
  return src(config.styleSRC, {allowEmpty: true})
    .pipe(gulpif(!PRODUCTION, sourcemaps.init()))
    .pipe(sass({
        errLogToConsole: true,
        outputStyle: "expanded",
        sourceComments: true
      })
    )
    .on("error", sass.logError)
    .pipe(sourcemaps.write({includeContent: false}))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(lineec())
    .pipe(dest(config.styleDEST))
    .pipe(filter('**/*.css'))
    .pipe(server.stream())
    .pipe(gulpif(PRODUCTION, minifycss()))
    .pipe(gulpif(PRODUCTION, lineec()))
    .pipe(dest(config.styleDEST))
    .pipe(filter('**/*.css'))
    .pipe(server.stream());

};

export const scripts = () => {
  return src(config.scriptSRC, {allowEmpty: true})
    .pipe(named())
    .pipe(webpack({
      module: {
        rules: [
          {
            test: /\.js$/,
            use: {
              loader: "babel-loader",
              options: {presets: ["@babel/preset-env"]}
            }
          }
        ]
      },
      output: {filename: "[name].js"},
      externals: {jquery: "jQuery"},
      devtool: !PRODUCTION ? "inline-source-map" : false,
      mode: PRODUCTION ? 'production' : 'development'
    }))
    .pipe(lineec())
    .pipe(dest(config.scriptDEST));
};

export const images = () => {
  return src(config.imagesSRC, {allowEmpty: true})
    .pipe(gulpif(PRODUCTION, imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.mozjpeg({quality: 90, progressive: true}),
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.svgo({
        plugins: [{removeViewBox: true}, {cleanupIDs: false}]
      })
    ])))
    .pipe(dest(config.imagesDEST));
};

export const watchSource = () => {
  watch('src/assets/scss/**/*.scss', styles);
  watch(config.scriptSRC, series(scripts, reload));
  watch("**/*.php", reload);
  watch(config.imagesSRC, series(images, reload));
  watch(config.copySRC, series(copyFiles, reload));
};

export const copyFiles = () => {
  return src(config.copySRC)
    .pipe(dest(config.copyDEST));
};

export const copyPlugins = () => {
  return src(config.plugins.src)
    .pipe(dest(config.plugins.dest));
};

export const compress = () => {
  return src(config.package.src)
    .pipe(
      gulpif(
        file => file.relative.split(".").pop() !== "zip",
        replace("_themename", info.name)
      )
    )
    .pipe(zip(`${info.name}.zip`))
    .pipe(dest(config.package.dest));
};

export const dev = series(
  clean,
  parallel(styles, scripts, images, copyFiles),
  serve,
  watchSource
);

export const build = series(
  clean,
  parallel(styles, scripts, images, copyFiles),
  copyPlugins
);

export const bundle = series(
  build,
  compress,
  copyPlugins
);

export default dev;
