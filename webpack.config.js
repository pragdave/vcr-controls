var expose = require("expose-loader");

module.exports = {

    module: {
        loaders: [
            {
                test: require.resolve("jquery"),
                loader: "expose?$!expose?jQuery"
            },
            {
                test: /\.js6$/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
        ]
    },

    entry: "./assets/js/vcr.js6",

    output: {
        path: __dirname + "/dist",
        filename: "vcr-controls.js"
    },

    externals: {
        // require("jquery") is external and available
        //  on the global var jQuery
        "jquery": "jQuery"
    }    
};
