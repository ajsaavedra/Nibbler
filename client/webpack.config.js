const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');

const NODE_ENV = process.env.NODE_ENV;
const isProduction = NODE_ENV === 'production';
console.log(`node env: ${NODE_ENV}`);

const ExtractText = new ExtractTextPlugin('css/[name]-[contenthash].min.css');

const config = {
    resolve: {
        extensions: ['.js', '.ts']
    },
    entry: {
        polyfills: './polyfills.ts',
        main: './app/main.ts'
    },
    output: {
        path: path.resolve(__dirname, 'dist'), // output directory
        publicPath: '/',
        filename: '[name].js' // name of the generated bundle
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                loader: ['style-loader', 'css-loader']
            },
            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader'
            },
            // {
            //     test: /\.ts$/,
            //     enforce: 'pre',
            //     loader: 'tslint-loader'
            // },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.scss$/,
                use: isProduction
                    ? ExtractText.extract({
                        fallback: 'style-loader',
                        use: ['css-loader', 'sass-loader']
                    })
                    : ['style-loader', 'css-loader', 'sass-loader']
            },
            // raw-loader needed when requiring styles from @component decorator like "css modules"
            // {
            //     test: /\.scss$/,
            //     loader: ['raw-loader', 'sass-loader?sourceMap']
            // }
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    'file-loader?hash=sha512&digest=hex&name=images/[name]-[hash].[ext]'
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            inject: 'body'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'polyfills'
        })
    ],
    devtool: 'source-map',
    devServer: {
        historyApiFallback: true
    }
};

if (isProduction) {
    const uglify = new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        },
        comments: false
    });

    const definePlugin = new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify(NODE_ENV)
        }
    });

    config.plugins = [
        ...config.plugins,
        ExtractText,
        uglify,
        definePlugin
    ];
}

module.exports = config;
