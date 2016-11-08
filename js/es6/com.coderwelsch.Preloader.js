class Preloader {
	constructor ( settings ) {
		this.settings = {
			autoFindImgs: true,
			autoProgressHandling: false,
			autoSetImageSrc: true,

			selectors: {
				container: "body",
				validImg: "img[src]",
				progressContainer: ".progress",
				progressLabel: ".label",
				currentProgressBar: ".current"
			},

			progressLabelOptions: {
				textPattern: "{{PERCENTAGE}}%",
				round: true
			},

			callbacks: {
				progress: function ( current, total, item, status ) {
					//
				},

				finish: function () {
					//
				}
			}
		};

		// extend settings
		$.extend( true, this.settings, settings );

		// public variables
		this.selectors = this.settings.selectors;
		this.callbacks = this.settings.callbacks;

		// plugin variables
		this.queueRunning = false;
		this.preloadQueue = [];
		this.progress = 0;
		this.images = [];

		this.$container = $( this.selectors.container );

		if ( this.settings.autoProgressHandling ) {
			this.$progressContainer = $( this.selectors.progressContainer );
			this.$currentProgressBar = this.$progressContainer.find( this.selectors.currentProgressBar );
			this.$progressLabel = this.$progressContainer.find( this.selectors.progressLabel );
		}

		// auto preload
		if ( this.settings.autoFindImgs ) {
			this.preload();
		}
	}

	preload () {
		this.searchImgs();
		this.startQueue();
	}

	startQueue () {
		if ( this.queueRunning ) {
			return false;
		}

		this.queueRunning = true;

		// clone images array
		this.preloadQueue = this.images.slice( 0 );

		// start main preloading
		this.processQueue();
	}

	processQueue () {
		let self = this;

		if ( this.preloadQueue.length ) {
			let domImg = this.preloadQueue.pop(),
				img = new Image();

			img.onload = function () {
				self.imgLoaded( domImg, this );
			};

			img.onerror = function () {
				self.imgLoaded( domImg, this, true );
			};

			img.src = domImg.src;
		} else {
			this.endQueue();
		}
	}

	imgLoaded ( domImg, preloadInstance, isFailed ) {
		let total = this.images.length,
			current = total - this.preloadQueue.length;

		this.progress = current / total;

		if ( this.settings.autoSetImageSrc ) {
			domImg.src = preloadInstance.src;
		}

		if ( this.settings.autoProgressHandling ) {
			this.updateProgress();

			if ( typeof this.callbacks.progress === "function" ) {
				this.callbacks.progress( current, total, domImg, isFailed );
			}
		}

		this.processQueue();
	}

	updateProgress () {
		let self = this,
			text = "",
			percentage = this.progress * 100;

		if ( this.settings.progressLabelOptions.round ) {
			percentage = Math.round( percentage );
		}

		text = this.settings.progressLabelOptions.textPattern.replace( "{{PERCENTAGE}}", percentage );

		this.$currentProgressBar.css( "width", percentage + "%" );
		this.$progressLabel.text( text );
	}

	endQueue () {
		this.queueRunning = false;
		this.preloadQueue = [];
		this.progress = 0;

		if ( typeof this.callbacks.finish === "function" ) {
			this.callbacks.finish();
		}
	}

	searchImgs () {
		if ( !this.$container.length ) {
			throw ( "Container with selector \"" + this.selectors.container + "\" not found" );
		}

		this.images = this.$container.find( this.selectors.validImg ).toArray();
	}
}

module.exports = Preloader;
