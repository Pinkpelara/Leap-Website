/**
 * Include this file wherever you might have localized string fields in a form.
 */
$(document).ready(function () {
	// validate fields on form submit
	$(document).find('form').submit(function (e) {
		validateLocalizedFields(e, $(this));
	});

	//validate fields on button click
	$(document).on('click', 'input[type="submit"]', function (e) {
		var form = $(this).closest('form');
		form.attr('formnovalidate', 'formnovalidate');
		validateLocalizedFields(e, form);
	});

	// clear errors when user types in field
	$(document).on('keyup change', '.requiredLocalizedField', function () {
		var $input = $(this);


		var lang = $input.data('lang');
		let $langSelector = $input.parent().siblings('.language-selector--container');

		if ($input.hasClass('error')) {
			var hasVal = fieldNotEmpty($input);
			if (hasVal) {
				$input.removeClass('error');
				let iframe = this.parentNode.querySelector('.tox-edit-area__iframe')
				if (iframe && iframe.classList.contains('error')) {
					iframe.classList.remove('error')
				}
				$langSelector.find('span[data-lang="' + lang + '"]').removeClass('error');
			}
		}
	});

	// mark fields as empty or not
	$(document).on('keyup change', '.localizedField', function () {
		initializeLocalizedFields();
	});

	//ensure tinymce is initialized to avoid js errors - if not retry every 20ms.
	let initializeLocalizedFields = function() {
		if (typeof tinymce !== 'undefined' && Array.isArray(tinymce.editors) && tinymce.editors.length > 0) {
			markEmptyLocalizedFields();
		} else {
			setTimeout(initializeLocalizedFields, 20);
		}
	};
	setTimeout(initializeLocalizedFields, 20);
});

/**
 * Prevent form submission & add error if required localized fields are empty
 * @param event
 * @param element Optionally indicate a specific div/form to validate, useful for fancybox popups / pages with multiple forms.
 * @returns {boolean}
 */
function validateLocalizedFields(event, element) {
	if(event && event.currentTarget && event.currentTarget.hasAttribute('formnovalidate')) {
		if(event.currentTarget.tag !== 'FORM') {
			var parentForm = $(event.currentTarget).closest('form');
			if(parentForm.size() && !parentForm[0].hasAttribute('formnovalidate')) {

			}
		}
		return true;
	}
	var scrollTo = null;
	var hasError = false;
	var parent = element && element.length ? element : $(document);

	parent.find('.requiredLocalizedField').each(function (i, input) {
		var $input = $(input);

		var lang = $input.data('lang');
		let $langSelector = $input.parent().siblings('.language-selector--container');

		var hasVal = fieldNotEmpty($input);
		let isTinyEMC = ($input.prop('tagName') === 'TEXTAREA' && $input.hasClass('localizedField'));
		if (!hasVal && !$input.prop('disabled')) {
			hasError = true;
			$input.addClass('error');
			if (isTinyEMC) {
				let iframe = input.parentNode.querySelector('.tox-edit-area__iframe');
				if (iframe) {
					iframe.classList.add('error')
				}
			}
			if($langSelector.size()) {
				$langSelector.find('span[data-lang="' + lang + '"]').addClass('error');
				scrollTo = $langSelector;
			} else {
				scrollTo = $input;
				if (isTinyEMC) {
					scrollTo = $input.prev();
				}
			}
		} else {
			$input.removeClass('error');
			if (isTinyEMC) {
				let iframe = input.parentNode.querySelector('.tox-edit-area__iframe')
				if(iframe) {
					iframe.classList.remove('error')
				}
			}
			$langSelector.find('span[data-lang="' + lang + '"]').removeClass('error');		}
	});

	if (hasError) {
		event.preventDefault();
		event.stopImmediatePropagation();
		if (scrollTo && scrollTo.size()) {
			if(typeof scrollTo[0]['scrollIntoView'] === 'function') {
				scrollTo[0].scrollIntoView({
					behavior: "smooth",
					block: "start"
				});
			}
		}
		return false;
	}

	return true;
}

// mark localized field tabs as empty or not
function markEmptyLocalizedFields() {
	$(document).find('.localizedField').each(function (i, input) {
		var $input = $(input);
		var hasVal = fieldNotEmpty($input);
		let $langSelector = $input.parent().siblings('.language-selector--container');
		if (!hasVal && !$input.prop('disabled')) {
			$langSelector.find('span[data-lang="' + $input.data('lang') + '"]').addClass('empty');
		} else {
			$langSelector.find('span[data-lang="' + $input.data('lang') + '"]').removeClass('empty');
		}
	});
}
function fieldNotEmpty(input) {
	if (window.tinymce) {
		if(tinymce.get(input.attr('id'))){
			var content = tinymce.get(input.attr('id')).getContent().replaceAll('&nbsp;', '');
			var div = document.createElement("div");
			div.innerHTML = content;
			return $.trim((div.innerText || div.textContent)).length > 0 || $('img',div).length;
		} else {
			return !!$.trim(input.val()).length && $.trim(input.val()) !== '<p><br data-mce-bogus="1"></p>';
		}
	}
}

/**
 For sites with > 1 lang & fields not required.
 check if all fields are required ( at least 1 lang has content) or none required (no content).
 */
function checkRequiredNoneOrAll(element) {
	var required_message = false;
	$(element.find('.localizedField')).each(function (i, input) {
		var $input = $(input);
		if (fieldNotEmpty($input)) {
			required_message = true;
		}
	});
	return required_message;
}

function clearAllErrors(element){
	$(element.find('.language-selector span')).removeClass('error');
	$(element.find('.tox-edit-area__iframe')).removeClass('error');
}
