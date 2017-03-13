// imports
import FormValidator from "./com.coderwelsch.FormValidator.js";
import $ from "./com.coderwelsch.Query.js";
import Utils from "./com.coderwelsch.Utils.js";

export default class MailComposer {
	constructor ( settings ) {
		this.settings = {
			selectors: {
				container: "form",
				field: ".field",
				input: "input, textarea",
				sendButton: "#send-mail",
				sendButtonClickable: ".active:not(.waiting, .disabled)",
				isWaiting: ".waiting"
			},
			phpSendMailPath: "./files/php/modules/send-mail.php",
			tinyMCESettings: {
				selector: "#mail-composer",
				min_height: 250,
				menubar: false,
				content_css: "./files/css/mail.css"
			},
			callbacks: {
				emailSend: () => {},
				emailError: () => {}
			}
		};

		// extend settings
		this.settings = Utils.extend( true, this.settings, settings );

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

	resetInput () {
		let $container = new $( this.selectors.container );

		if ( window.tinyMCE ) {
			window.tinyMCE.activeEditor.setContent( "" );
		}

		$container.find( this.selectors.input ).each( ( elem ) => {
			elem.value = "";
		} );
	}

	sendMail ( formData, callback ) {
		formData[ "user-message" ] = this.message;

		$.ajax( {
			type: "POST",
			url: this.settings.phpSendMailPath,
			data: formData,

			callbacks: {
				done: ( data ) => {
					try {
						data = JSON.parse( data.responseText );

						if ( data.success ) {
							callback( true );

							if ( typeof this.settings.callbacks.emailSend === "function" ) {
								this.settings.callbacks.emailSend();
							}
						} else {
							callback( false );

							if ( typeof this.settings.callbacks.emailError === "function" ) {
								this.settings.callbacks.emailError();
							}
						}
					} catch ( error ) {
						callback( false );
					}
				},
				fail: () => {
					callback( false );
				}
			}
		} );

		// required to set the send btn state to waiting
		return true;
	}
}
