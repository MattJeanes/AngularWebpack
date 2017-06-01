const path = require('path');
const webpack = require('webpack');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (env) => {
    // Configuration in common to both client-side and server-side bundles
    const extractCSS = new ExtractTextPlugin('main.css');
    const prod = env && env.prod;
    console.log(prod ? "Production build" : "Dev build")
    const analyse = env && env.analyse;
    if (analyse) console.log("Analysing build");
    const cssLoader = prod ? 'css-loader?minimize' : 'css-loader';
    const clientBundleOutputDir = './wwwroot/dist';
    const bundleConfig = {
        entry: { 'main': './ClientApp/main.ts', 'styles': './Styles/main.scss' },
        stats: { modules: false },
        context: __dirname,
        resolve: { extensions: ['.js', '.ts'] },
        output: {
            filename: '[name].js',
            publicPath: '/dist/', // Webpack dev middleware, if enabled, handles requests for this URL prefix
            path: path.join(__dirname, clientBundleOutputDir)
        },
        module: {
            rules: [
                { test: /\.ts$/, include: /ClientApp/, use: ['awesome-typescript-loader?silent=true', 'angular2-template-loader'] },
                { test: /\.html$/, use: 'html-loader?minimize=false' },
                { test: /\.css$/, use: ['to-string-loader', cssLoader] },
                { test: /\.scss$/, include: /ClientApp/, use: ['to-string-loader', cssLoader, 'sass-loader'] },
                { test: /\.scss$/, include: /Styles/, use: extractCSS.extract({ use: [cssLoader, 'sass-loader'] }) },
                { test: /\.(png|jpg|jpeg|gif|svg)$/, use: 'url-loader?limit=25000' }
            ]
        },
        plugins: [
            new CheckerPlugin(),
            extractCSS,
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require('./wwwroot/dist/vendor-manifest.json')
            })
        ].concat(prod ? [
            // Plugins that apply in production builds only
            new webpack.optimize.UglifyJsPlugin()
        ] : [
            // Plugins that apply in development builds only
            new webpack.SourceMapDevToolPlugin({
                filename: '[file].map', // Remove this line if you prefer inline source maps
                moduleFilenameTemplate: path.relative(clientBundleOutputDir, '[resourcePath]') // Point sourcemap entries to the original file locations on disk
            })
        ]).concat(analyse ? [
            new BundleAnalyzerPlugin({
                analyzerMode: 'static',
                reportFilename: 'main.html',
                openAnalyzer: false
            })
        ] : [])
    };

    return bundleConfig;
};
