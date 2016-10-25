// imports
import "imports?this=>window!../vendor/tinymce/tinymce.min.js";
import FormValidator from './com.coderwelsch.FormValidator.js';

class MailComposer {
	constructor ( settings ) {
		this.settings = {
			selectors: {},
			phpSendMailPath: './files/php/modules/send-mail.php',
			tinyMCECSSPath: './files/css/mail.css'
		};

		// extend settings
		window.$.extend( true, this.settings, settings );

		// public variables
		this.selectors = this.settings.selectors;
		this.classes = this.settings.classes;
		this.callbacks = this.settings.callbacks;

		// plugin variables
		this.message = "";
		this.formValidatorInstance = null;
		this.tinyMCEInstance = null;

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

		this.tinyMCEInstance = window.tinymce.init( {
			selector: 'textarea',
			skin: false,
			min_height: 250,
			menubar: false,
			content_css: this.settings.tinyMCECSSPath,

			setup: function ( editor ) {
				editor.on( 'keyup cut paste', function () {
					let newMessage = editor.getContent();

					if ( self.message !== newMessage ) {
						self.message = newMessage;

						self.checkContactFormValidation();
					}
				} );
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
		formData[ 'user-message' ] = this.message;

		$.post( {
			url: this.settings.phpSendMailPath,
			data: formData,
			dataType: 'json',
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