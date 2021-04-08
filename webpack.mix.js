/* eslint-disable */
let mix = require('laravel-mix');
let ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
let ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin');
/**
 * The following can be set to true to improve build speed.
 * This will run typescript checking on a separate process
 */
const TYPESCRIPT_SEPARATE_PROCESS = true;

/**
 * Enable hot reloading during `npm run watch`
 */
const ENABLE_HOT_RELOAD = true;
/**
 * Local development URL for hot reloading
 */
const LOCAL_URL = 'http://hawkeye-ems.test';
/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for your application, as well as bundling up your JS files.
 |
 */
mix.setPublicPath('public');
mix.version();
mix
    .ts('src/js/main.ts', 'js/')
   .ts('src/js/login.ts', 'js/')
   .ts('src/js/create-account.ts', 'js/')
   .ts('src/js/competition-registration.ts', 'js/')
   .ts('src/js/competition-registration-teams.ts', 'js/')
   .ts('src/js/admin-portal.ts', 'js/')
   .ts('src/js/series-registration.ts', 'js/')
   .ts('src/js/style-guide.ts', 'js/')
   .ts('src/js/component-guide.ts', 'js/')
   .extract(['vue', 'vuex', 'axios', 'es6-promise/auto'])
   .sass('src/sass/main.scss', 'css/')
   .sass('src/sass/style-guide.scss', 'css/');

if (ENABLE_HOT_RELOAD) {
    mix.browserSync({
        proxy: LOCAL_URL,
        files: ['public/js/**/*.js', 'public/css/**/*.css']
    });
}

if (TYPESCRIPT_SEPARATE_PROCESS) {
    mix.webpackConfig({
        context: __dirname, // to automatically find tsconfig.json
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader',
                    exclude: /node_modules/,
                    options: {
                        appendTsSuffixTo: [/\.vue$/],
                        transpileOnly: true
                    }
                }
            ]
        },
        plugins: [
            new ForkTsCheckerWebpackPlugin({
                vue: true
            }),
            new ForkTsCheckerNotifierWebpackPlugin()
        ]
    });
}

// Full API
// mix.js(src, output);
// mix.react(src, output); <-- Identical to mix.js(), but registers React Babel compilation.
// mix.preact(src, output); <-- Identical to mix.js(), but registers Preact compilation.
// mix.coffee(src, output); <-- Identical to mix.js(), but registers CoffeeScript compilation.
// mix.ts(src, output); <-- TypeScript support. Requires tsconfig.json to exist in the same folder as webpack.mix.js
// mix.extract(vendorLibs);
// mix.sass(src, output);
// mix.standaloneSass('src', output); <-- Faster, but isolated from Webpack.
// mix.fastSass('src', output); <-- Alias for mix.standaloneSass().
// mix.less(src, output);
// mix.stylus(src, output);
// mix.postCss(src, output, [require('postcss-some-plugin')()]);
// mix.combine(files, destination);
// mix.babel(files, destination); <-- Identical to mix.combine(), but also includes Babel compilation.
// mix.copy(from, to);
// mix.copyDirectory(fromDir, toDir);
// mix.minify(file);
// mix.sourceMaps(); // Enable sourcemaps
// mix.version(); // Enable versioning.
// mix.disableNotifications();
// mix.setPublicPath('path/to/public');
// mix.setResourceRoot('prefix/for/resource/locators');
// mix.autoload({}); <-- Will be passed to Webpack's ProvidePlugin.
// mix.babelConfig({}); <-- Merge extra Babel configuration (plugins, etc.) with Mix's default.
// mix.then(function () {}) <-- Will be triggered each time Webpack finishes building.
// mix.extend(name, handler) <-- Extend Mix's API with your own components.
// mix.options({
//   extractVueStyles: false, // Extract .vue component styling to file, rather than inline.
//   globalVueStyles: file, // Variables file to be imported in every component.
//   processCssUrls: true, // Process/optimize relative stylesheet url()'s. Set to false, if you don't want them touched.
//   purifyCss: false, // Remove unused CSS selectors.
//   uglify: {}, // Uglify-specific options. https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
//   postCss: [] // Post-CSS options: https://github.com/postcss/postcss/blob/master/docs/plugins.md
// });
