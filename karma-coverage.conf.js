/* global module */
module.exports = function ( config ) {
	config.set( {
		autoWatch: true,
		singleRun: true,

		frameworks: [ "jspm", "jasmine" ],

		files: [
			"node_modules/babel-polyfill/dist/polyfill.js"
		],

		jspm: {
			config: "system.config.js",
			loadFiles: [
				"js/es6/*-spec.js"
			],
			serveFiles: [
				"js/es6/!(*spec).js"
			]
		},

		proxies: {
			"/js/": "/base/js/",
			"/jspm_packages/": "/js/es6/jspm_packages/"
		},

		browsers: [ "PhantomJS" ],

		preprocessors: {
			"js/es6/!(*spec).js": [ "babel", "sourcemap", "coverage" ]
		},

		babelPreprocessor: {
			options: {
				sourceMap: "inline"
			},
			sourceFileName: function ( file ) {
				return file.originalPath;
			}
		},

		reporters: [ "coverage", "progress" ],

		coverageReporter: {
			instrumenters: { isparta: require( "isparta" ) },
			instrumenter: {
				"js/es6/*.js": "isparta"
			},

			reporters: [
				{
					type: "text-summary",
					subdir: normalizationBrowserName
				},
				{
					type: "html",
					dir: "coverage/",
					subdir: normalizationBrowserName
				}
			]
		}
	} );

	function normalizationBrowserName ( browser ) {
		return browser.toLowerCase().split( /[ /-]/ )[0];
	}
};
