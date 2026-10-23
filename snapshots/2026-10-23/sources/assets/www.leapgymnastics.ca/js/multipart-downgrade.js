/*
 * Interim mitigation for CVE-2026-109618 / CVE-2026-109619 ("php2shell").
 *
 * PHP 7.4 gets no fix, and the leaked details point at PHP's multipart/form-data
 * parser. While the ingress refuses multipart requests, anything that carries no
 * file is sent as application/x-www-form-urlencoded instead. PHP builds the same
 * $_POST from either encoding. Requests with a real file stay multipart.
 *
 * Covers:
 *  - native submissions of forms declared enctype="multipart/form-data"
 *    (user submit, requestSubmit() and form.submit());
 *  - jQuery $.ajax calls with a FormData body (UP.Services.AjaxPostMultipartForm
 *    and direct callers), through an ajaxPrefilter.
 *
 * A submit handler that calls stopPropagation() without preventDefault() keeps
 * the event from reaching the window listener, so that form stays multipart.
 * None exist today.
 *
 * Empty file inputs are left out of the request. Under multipart PHP reported
 * them in $_FILES as UPLOAD_ERR_NO_FILE; now they are absent.
 *
 * Remove once the image runs a patched PHP.
 */
(function (window, document) {
	'use strict';

	var MULTIPART = 'multipart/form-data';
	// Prototype accessors, so form fields named "elements", "getAttribute" etc. cannot shadow them.
	var elementsGetter = (Object.getOwnPropertyDescriptor(HTMLFormElement.prototype, 'elements') || {}).get;
	var getAttr = Element.prototype.getAttribute;
	var setAttr = Element.prototype.setAttribute;
	var URLENCODED = 'application/x-www-form-urlencoded';

	// multipart/form-data turns every line break into CRLF; do the same so $_POST is unchanged.
	function crlf(text) {
		return String(text).replace(/\r\n|\r|\n/g, '\r\n');
	}

	// Urlencoded body for a FormData without real files, or null when it holds a
	// file or the browser lacks the needed APIs.
	function formDataToUrlEncoded(formData) {
		if (typeof URLSearchParams === 'undefined' || !formData || typeof formData.forEach !== 'function') {
			return null;
		}
		var params = new URLSearchParams();
		var hasFile = false;
		formData.forEach(function (value, key) {
			// FormData values are strings or Files; a File from another frame fails instanceof.
			if (typeof value !== 'string') {
				hasFile = hasFile || value.size > 0 || !!value.name;
				return;
			}
			params.append(crlf(key), crlf(value));
		});
		return hasFile ? null : params.toString();
	}

	function fileInputs(form) {
		var inputs = [];
		var elements = (elementsGetter ? elementsGetter.call(form) : form.elements) || [];
		for (var i = 0; i < elements.length; i++) {
			// Unnamed file inputs are never submitted, so they cannot keep a form multipart.
			if (elements[i].type === 'file' && elements[i].name && !elements[i].disabled) {
				inputs.push(elements[i]);
			}
		}
		return inputs;
	}

	// Sends this one submission urlencoded, then restores the form in case the page stays.
	function downgradeForm(form) {
		var enctype = form instanceof HTMLFormElement ? (getAttr.call(form, 'enctype') || '') : '';
		if (enctype.trim().toLowerCase() !== MULTIPART) {
			return;
		}
		var inputs = fileInputs(form);
		for (var i = 0; i < inputs.length; i++) {
			if (inputs[i].files && inputs[i].files.length) {
				return;
			}
		}
		for (var j = 0; j < inputs.length; j++) {
			inputs[j].disabled = true;
		}
		setAttr.call(form, 'enctype', URLENCODED);
		window.setTimeout(function () {
			setAttr.call(form, 'enctype', enctype);
			for (var k = 0; k < inputs.length; k++) {
				inputs[k].disabled = false;
			}
		}, 0);
	}

	if (typeof HTMLFormElement !== 'undefined') {
		// Bubble phase on window runs after the page's own submit handlers.
		window.addEventListener('submit', function (event) {
			if (!event.defaultPrevented && event.target instanceof HTMLFormElement) {
				downgradeForm(event.target);
			}
		}, false);

		// form.submit() fires no submit event.
		var nativeSubmit = HTMLFormElement.prototype.submit;
		HTMLFormElement.prototype.submit = function () {
			try {
				downgradeForm(this);
			} catch (e) {
				// Never block the submission itself.
			}
			return nativeSubmit.apply(this, arguments);
		};
	}

	function installAjaxPrefilter(jq) {
		if (!jq || typeof jq.ajaxPrefilter !== 'function' || jq.multipartDowngradeInstalled) {
			return;
		}
		jq.multipartDowngradeInstalled = true;
		jq.ajaxPrefilter(function (options) {
			if (typeof FormData === 'undefined' || !(options.data instanceof FormData)) {
				return;
			}
			var body = formDataToUrlEncoded(options.data);
			if (body !== null) {
				options.data = body;
				options.processData = false;
				options.contentType = URLENCODED + '; charset=UTF-8';
			}
		});
	}

	installAjaxPrefilter(window.jQuery);
	document.addEventListener('DOMContentLoaded', function () {
		installAjaxPrefilter(window.jQuery);
	});
})(window, document);
