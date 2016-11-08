import $ from "./com.coderwelsch.Query.js";


export default class Progressbar {
	constructor ( settings ) {
		this.settings = {
			selectors: {
				progressbarContainer: ".progressbar",
				currentProgressBar: ".current"
			}
		};

		// extend settings
		window.$.extend( true, this.settings, settings );

		// class variables
		this.selectors = this.settings.selectors;

		this.init();
	}

	init () {
		this.initVariables();
	}

	initVariables () {
		this.$progressbarContainer = new $( this.selectors.progressbarContainer );
		this.$currentProgress = this.$progressbarContainer.find( this.selectors.currentProgressBar );
	}

	setProgress ( progress = 0.0 ) {
		this.$currentProgress.css( {
			width: progress * 100 + "%"
		} );
	}
}
