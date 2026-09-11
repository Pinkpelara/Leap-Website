/**
 * Load this file with your form.
 * Add to any form input you want to disable browser autocomplete for: rel="disableAutoFill" readonly
 * Or on a kojs input, add: data-bind="disableAutoFill:true" readonly

 */

$.fn.disableAutoFill = function () {
	this.each(function () {
		var el = $(this);
		if (!el.data('disableAutofill')) {
			el.data('disableAutofill', true);
			// autocomplete="randomString" disables autocomplete on some browser versions
			el.prop('autocomplete', 'randomString');
			el.data('disableAutofill-focusing', false);

			// readonly should disable autocomplete on the rest
			el.on('focus touchstart', function () {
				if (!el.data('disableAutofill-focusing')) {
					el.data('disableAutofill-focusing', true);
					//timeout fixes firefox needing double click on inputs
					setTimeout(function () {
						if (el.prop('readonly')) {
							el.prop('readonly', false);

							//blur and refocus fixes mobile keyboard, makes it appear on safari
							el.blur();
							el.focus();
							el.data('disableAutofill-focusing', false);
						}
					});
				}
			});
			el.on('blur', function () {
				if (!el.data('disableAutofill-focusing')) {
					el.prop('readonly', true);
				}
			});
		}
	});
};
$('input[rel="disableAutoFill"]').disableAutoFill();