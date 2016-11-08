// imports
import FormValidator from "./com.coderwelsch.FormValidator.js";

class MailComposer {
	constructor ( settings ) {
		this.settings = {
			selectors: {},
			phpSendMailPath: "./files/php/modules/send-mail.php",
			tinyMCESettings: {
				selector: "#mail-composer",
				min_height: 250,
				menubar: false,
				content_css: "./files/css/mail.css"
			}
		};

		// extend settings
		window.$.extend( true, this.settings, settings );

		if ( window.tinymce === undefined ) {
			throw Error( "No tinymce instance set in settings!" );
		}

		// public variables
		this.selectors = this.settings.selectors;
		this.classes = this.settings.classes;
		this.callbacks = this.settings.callbacks;

		// plugin variables
		this.message = "";
		this.formValidatorInstance = null;

		// inits
		this.initFormValidator();
		this.initTinyMCE();
	}

	initFormValidator () {
		let self = this;

		this.formValidatorInstance = new FormValidator( {
			selectors: this.selectors,

			callbacks: {
				onValidationCheck: function ( isValid ) {
					return self.checkContactFormValidation( isValid );
				},
				onSendRequest: function ( formData, callback ) {
					return self.sendMail( formData, callback );
				}
			}
		} );
	}

	initTinyMCE () {
		let self = this;

		// reset setuo function
		this.settings.tinyMCESettings.setup = function ( editor ) {
			self.tinyMCEInitialized( editor );
		};

		this.tinyMCEInstance = window.tinymce.init( this.settings.tinyMCESettings );
	}

	tinyMCEInitialized ( editor ) {
		let self = this;

		editor.on( "keyup cut paste", function () {
			let newMessage = editor.getContent();

			if ( self.message !== newMessage ) {
				self.message = newMessage;

				self.checkContactFormValidation();
			}
		} );
	}

	checkContactFormValidation ( isValid ) {
		if ( isValid !== undefined ) {
			return isValid && this.formValidatorInstance.validateInputByString( this.message );
		}

		return this.formValidatorInstance.checkValidForm() && this.formValidatorInstance.validateInputByString( this.message );
	}

	sendMail ( formData, callback ) {
		formData[ "user-message" ] = this.message;

		window.$.post( {
			url: this.settings.phpSendMailPath,
			data: formData,
			dataType: "json",
			success: function ( data ) {
				if ( data.success ) {
					callback( true );
				} else {
					callback( false );
				}
			},
			error: function () {
				callback( false );
			}
		} );

		// required to set the send btn state to waiting
		return true;
	}
}

module.exports = MailComposer;
