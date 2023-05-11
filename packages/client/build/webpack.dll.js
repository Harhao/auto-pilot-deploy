const path = require("path");
const DllPlugin = require("webpack/lib/DllPlugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { dllName } = require("../config");
module.exports = {
    name: "production",
    devtool: "source-map",
    entry: {
        [dllName]: [
            "react", 
            "react-dom",
            "react-router-dom",
        ]
    },
    output: {
        filename: "[name].dll.js",
        path: path.resolve(__dirname, "../dll"),
        library: "_dll_[name]"
    },
    plugins: [
        new CleanWebpackPlugin(),
        new DllPlugin({
            name: "_dll_[name]",
            path: path.resolve(__dirname, "../dll", "[name].manifest.json")
        })

    ]
};