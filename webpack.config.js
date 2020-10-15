const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: "development",
    entry: "./src/scripts/Calendar.js",
    output: {
        path: path.resolve(__dirname, "./build"),
        filename: "bundle.js" 
    },
    devServer: {
        port: 5000
    },
    module :{
        rules: [
            {
                test: /\.css$/,
                use: [
                    { loader: MiniCssExtractPlugin.loader },
                    { loader: "css-loader" }
                ]
            }, 
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                            context: path.resolve(__dirname, "images/"),
                            outputPath: 'images/',
                            publicPath: 'images/',
                            useRelativePaths: true
                        }
                    }
                ] 
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html"
        }),
        new MiniCssExtractPlugin({
            filename: "bundle.css"
        })
    ]
}