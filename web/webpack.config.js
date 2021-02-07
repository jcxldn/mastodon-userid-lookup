const path = require("path")

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: ["./web.js"],
    output: {
        path: path.resolve(__dirname, "build/dist")
    },
    plugins: [new MiniCssExtractPlugin()],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            }
        ]
    }
};