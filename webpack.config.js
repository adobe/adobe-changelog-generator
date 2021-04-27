/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const webpack = require('webpack');
const path = require("path");
const glob = require('glob');
const getEntryPointsForFolders = (folders) => {
    let result = {};
    folders.forEach((folder) => {
        result = {
            ...result,
            ...glob.sync(`./src/${folder}/*.js`).reduce((previousValue, currentValue) => {
                return {
                        ...previousValue,
                        [`${folder}/${path.basename(currentValue, path.extname(currentValue))}`]: currentValue
                    }
            }, {})
        }

    })
    return result;
};

module.exports = (async () => {
    return {
        mode: 'development',
        target: 'node',
        entry: {
            index: './src/index.js',
            ...getEntryPointsForFolders([
                'template-directives',
                'template-handlers',
                'release-parsers',
                'writers',
                'groups',
                'loaders',
            ])
        },
        stats: {
            errorDetails: true,
        },
        output: {
            filename: '[name].js',
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
        },
        plugins:[
            new webpack.EnvironmentPlugin({
                'ROOT_DIR': 'vz'
            })
        ],
    };
})();
