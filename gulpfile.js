const { src, dest, watch, series, parallel } = require('gulp');

//CSS y SASS
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');

//Imágenes
const imagemin = require('gulp-imagemin'); //Librería para aligerar imágenes
const webp = require('gulp-webp'); //Librería convertir img en imagénes web
const avif = require('gulp-avif'); //Librería crea versión avif para chrome

function css( done ) {
    //compilar sass
    //pasos: 1-identificar archivo, 2-compilarla, 3-guardar el .css
    
    src('src/scss/app.scss')
        //.pipe( sass({ outputStyle: 'nested'}) )
        .pipe( sass() )
        .pipe( postcss( [ autoprefixer()]))
        .pipe( dest('build/css') )
    done();
}

function imagenes () {
    return src('src/img/**/*')
        .pipe(imagemin({optimizationLevel: 3})) //Lo ponemos antes para que las convierta
        .pipe(dest('build/img'));
}

function versionWebp() {
    return src('src/img/**/*.{png,jpg}') //No convertimos las svg porque son muy ligéras
        .pipe(webp())
        .pipe(dest('build/img'))
}

function versionAvif() {
    const opciones = {
        quality: 50
    }
    return src('src/img/**/*.{png,jpg}') //No convertimos las svg porque son muy ligéras
        .pipe(avif(opciones))
        .pipe(dest('build/img'))
}

function dev() { //Cuando se agregan nuevas o hay algún cambio se manda llamar para que actualice
    watch('src/scss/**/*.scss', css)
    watch('src/img/**/*', imagenes)
}

exports.css = css;
exports.dev = dev;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.default = series(imagenes, versionWebp, versionAvif, css, dev);

//series - Se inicia una tarea, hasta que finaliza, e inicia la siguiente.
//parallel - Todas las tareas se inician al mismo tiempo