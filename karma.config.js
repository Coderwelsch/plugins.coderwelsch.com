const Path = require( "path" );

module.exports = function ( config ) {
	config.set( {
		browsers: [ "PhantomJS" ],
		reporters: [ "spec", "progress" ],
		files: [
			"node_modules/babel-polyfill/dist/polyfill.js",
			"./karma-test-context.js"
		],
		frameworks: [ "jasmine" ],
		preprocessors: {
			"./karma-test-context.js": [ "webpack" ]
		},
		webpack: {
			module: {
				loaders: [
					{
						test: /\.js/,
						include: [ Path.resolve( __dirname, "./js/es6/" ) ],
						exclude: /node_modules/,
						loader: "babel-loader"
					}
				]
			},
			watch: true
		},
		webpackServer: {
			noInfo: true
		}
	} );
};