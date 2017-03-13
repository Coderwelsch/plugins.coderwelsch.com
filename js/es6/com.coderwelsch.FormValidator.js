// imports
import $ from "./com.coderwelsch.Query.js";
import Utils from "./com.coderwelsch.Utils.js";


export default class FormValidator {
	constructor ( settings ) {
		this.settings = {
			showSuccessTime: 3000,
			autoCheckInputs: true,
			autoResetOnSuccess: true,
			emailRegex: /^[a-zA-Z]([a-zA-Z0-9_\-])+([\.][a-zA-Z0-9_]+)*\@((([a-zA-Z0-9\-])+\.){1,2})([a-zA-Z0-9]{2,40})$/,

			selectors: {
				container: "form",
				field: ".field",
				input: "input, textarea",
				sendButton: "#send-mail",
				sendButtonClickable: ".active:not(.waiting, .disabled)",
				isWaiting: ".waiting"
			},

			classes: {
				active: "active",
				error: "error",
				disabled: "disabled",
				success: "success",
				waiting: "waiting"
			},

			callbacks: {
				onInput: function ( $element ) {
					//
				},
				onValidationCheck: function ( isValid ) {
					//
				},
				onSendRequest: function ( data ) {
					// required to set the send btn state to waiting
					return true;
				}
			}
		};

		// extend settings
		this.settings = Utils.extend( true, this.settings, settings );

		// public variables
		this.selectors = this.settings.selectors;
		this.classes = this.settings.classes;
		this.callbacks = this.settings.callbacks;

		// plugin variables
		this.emailRegex = this.settings.emailRegex;

		this.$container = new $( this.selectors.container );
		this.$sendButton = this.$container.find( this.selectors.sendButton );
		this.$fields = this.$container.find( this.selectors.field );
		this.$inputs = this.$container.find( this.selectors.input );

		this.bindEvents();
	}

	bindEvents () {
		this.$inputs.on( "input", this, this.fieldInput );
		this.$sendButton.on( "click", this, this.sendBtnClicked );
	}

	sendBtnClicked ( event ) {
		let self = event.data || this,
			$this = new $( this );

		if ( $this.hasClass( self.classes.active ) && !$this.hasClass( self.classes.disabled ) && !$this.hasClass( self.classes.waiting ) && typeof self.callbacks.onSendRequest === "function" ) {
			let formData = {},
				sendReturnValue = "";

			self.$inputs.each( ( elem ) =>  {
				formData[ elem.name ] = elem.value;
			} );

			// if send btn state should go to waiting state
			sendReturnValue = self.callbacks.onSendRequest( formData, ( success ) => {
				self.updateSendBtn( true, false, success );
			} );

			if ( sendReturnValue === true ) {
				self.updateSendBtn( self.checkValidForm(), true );
			}
		}
	}

	resetForm () {
		this.$sendButton
			.removeClass( this.classes.active )
			.removeClass( this.classes.error )
			.removeClass( this.classes.waiting )
			.removeClass( this.classes.success )
			.addClass( this.classes.disabled );

		this.checkValidForm();
	}

	updateSendBtn ( isValid, isWaiting, isSuccess ) {
		let self = this,
			btnIsInWaitingState = this.$sendButton.hasClass( this.classes.waiting );

		if ( isSuccess === true ) {
			this.$sendButton
				.removeClass( this.classes.error )
				.addClass( this.classes.success );

			if ( this.settings.autoResetOnSuccess ) {
				setTimeout( function () {
					self.resetForm();
				}, this.settings.showSuccessTime );
			}
		} else if ( isSuccess === false ) {
			this.$sendButton
				.addClass( this.classes.error )
				.removeClass( this.classes.success );
		} else if ( isValid && isWaiting ) {
			this.$sendButton
				.removeClass( this.classes.disabled )
				.removeClass( this.classes.error )
				.removeClass( this.classes.success )
				.addClass( this.classes.waiting );

			btnIsInWaitingState = true;
		}

		if ( !isWaiting ) {
			this.$sendButton.removeClass( this.classes.waiting );
		}

		if ( isValid && !btnIsInWaitingState ) { // if valid
			this.$sendButton
				.removeClass( this.classes.disabled )
				.removeClass( this.classes.error )
				.removeClass( this.classes.success )
				.addClass( this.classes.active );
		} else if ( !isValid && !btnIsInWaitingState ) { // if not valid
			this.$sendButton
				.removeClass( this.classes.error )
				.removeClass( this.classes.success )
				.removeClass( this.classes.active )
				.addClass( this.classes.disabled );
		}
	}

	checkValidForm () {
		let isValid = true;

		this.$inputs.each( ( $elem ) => {
			if ( !this.validateInputField( $elem ) ) {
				isValid = false;
			}
		}, true );

		// final validation check callback for the user
		// so he can perform custom checks to return a final validation value
		// for custom inputs i can not handle etc...
		if ( typeof this.callbacks.onValidationCheck === "function" ) {
			let cbReturn = this.callbacks.onValidationCheck( isValid );

			isValid = cbReturn === undefined ? isValid : cbReturn;
		}

		this.updateSendBtn( isValid );

		return isValid;
	}

	fieldInput ( event, $element ) {
		let self = event ? event.data : this,
			$this = $element || new $( this ),
			$parent = $this.closest( self.selectors.field );

		// mark input as modified
		// this is used for preventing wrong usx for targeting elements
		if ( !$element ) {
			$this.data( "user-modified", true );
		}

		// targeting elements
		if ( $this.data( "target" ) ) {
			let $target = new $( $this.data( "target" ) );

			if ( !$target.data( "user-modified" ) ) {
				$target.val( $this.val() );
				self.fieldInput( undefined, $target );
			}
		}

		// required inputs
		if ( !self.validateInputField( $this ) ) {
			$parent
				.removeClass( self.classes.success )
				.addClass( self.classes.error );
		} else {
			$parent
				.removeClass( self.classes.error )
				.addClass( self.classes.success );
		}

		// callback
		if ( typeof self.callbacks.onInput === "function" ) {
			self.callbacks.onInput( $this );
		}

		// check validation
		self.checkValidForm();
	}

	validateInputByString ( string, type, isRequired = true ) {
		if ( type === "email" ) {
			if ( isRequired ) {
				return this.emailRegex.test( string );
			} else {
				return !string.length || this.emailRegex.test( string );
			}
		} else {
			if ( isRequired ) {
				return Boolean( string.trim().length );
			} else {
				return !string.length;
			}
		}
	}

	validateInputField ( $element ) {
		let type = $element.attr( "type" ),
			val = $element.val(),
			isRequired = Boolean( $element.attr( "required" ) );

		return this.validateInputByString( val, type, Boolean( isRequired ) );
	}
}