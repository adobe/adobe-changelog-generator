/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
const webpack = require('webpack');
const path = require("path");

module.exports = (async () => {
    return {
        mode: 'development',
        target: 'node',
        entry: {
            app: './src/index.js',
        },
        stats: {
            errorDetails: true,
        },
        output: {
            filename: "index.js",
            path: path.resolve(__dirname + "/dist"),
            libraryTarget: 'umd'
        },
        module: {
            rules: [
                {
                    test: /\.m?js$/,
                    exclude: /(node_modules)/,
                    use: {
                        loader: 'babel-loader'
                    }
                }
            ]
        }
    };
})();
