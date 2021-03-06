const mix = require('laravel-mix');

mix.webpackConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources', 'js'),
            '%': path.resolve(__dirname, 'resources', 'sass'),
            '@@': path.resolve(__dirname, 'resources', 'images'),
            '@@@': path.resolve(__dirname),
            '#': path.resolve(__dirname)
        }
    }
});

mix.js('resources/js/app.js', 'src/public/js')
   .sass('resources/sass/app.scss', 'src/public/css')
//    .version();
