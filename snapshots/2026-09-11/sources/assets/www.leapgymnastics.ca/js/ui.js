(function () {
	if (!Array.prototype.forEach) {
		Array.prototype.forEach = function forEach (callback, thisArg) {
			if (typeof callback !== 'function') {
				throw new TypeError(callback + ' is not a function');
			}
			let array = this;
			thisArg = thisArg || this;
			for (let i = 0, l = array.length; i !== l; ++i) {
				callback.call(thisArg, array[i], i, array);
			}
		};
	}
	Promise.allSettled = Promise.allSettled || ((promises) => Promise.all(promises.map(p => p
		.then(value => ({
			status: 'fulfilled', value
		}))
		.catch(reason => ({
			status: 'rejected', reason
		}))
	)));
	if (NodeList && !NodeList.prototype.forEach) {
		NodeList.prototype.forEach = function forEach (callback, thisArg) {
			if (typeof callback !== 'function') {
				throw new TypeError(callback + ' is not a function');
			}
			let array = this;
			thisArg = thisArg || this;
			for (let i = 0, l = array.length; i !== l; ++i) {
				callback.call(thisArg, array[i], i, array);
			}
		};
	}

	Object.values = Object.values ? Object.values : function(obj) {
		var allowedTypes = ["[object String]", "[object Object]", "[object Array]", "[object Function]"];
		var objType = Object.prototype.toString.call(obj);

		if(obj === null || typeof obj === "undefined") {
			throw new TypeError("Cannot convert undefined or null to object");
		} else if(!~allowedTypes.indexOf(objType)) {
			return [];
		} else {
			// if ES6 is supported
			if (Object.keys) {
				return Object.keys(obj).map(function (key) {
					return obj[key];
				});
			}

			var result = [];
			for (var prop in obj) {
				if (obj.hasOwnProperty(prop)) {
					result.push(obj[prop]);
				}
			}

			return result;
		}
	};
})();

if (typeof mobile_breakpoint === 'undefined') {
	var mobile_breakpoint = 900;
}
if (typeof lang === 'undefined') {
	var lang = 'eng';
}

if (typeof window.instructorSiteFieldLookup === 'undefined') {
	window.instructorSiteFieldLookup = {};
}
window.enableAddToCartButton = null;
var getSiteFieldByIdLoading;
const POLICY_KEY_VALUE_TAGS = window.POLICY_KEY_VALUE_TAGS||{};
const POLICY_TAGS = Object.keys(window.POLICY_KEY_VALUE_TAGS||{});
const POLICY_REG_EXP = new RegExp('\\[(' + POLICY_TAGS.join('|') + ')(:(\\d+))?(\\|(\\"(\\\\.|[^\\"])*\\"|\\\'(\\\\.|[^\\\'])*\\\'|[^\\!\\?\\]]*))?(\\*|\\*?\\!|\\*?\\!\\!|\\!\\*|\\!\\!\\*)?\\]', 'ig');
function quoteattr(s, preserveCR) {
	preserveCR = preserveCR ? '&#13;' : '\n';
	return ('' + s) /* Forces the conversion to string. */
		.replace(/&/g, '&amp;') /* This MUST be the 1st replacement. */
		.replace(/'/g, '&apos;') /* The 4 other predefined entities, required. */
		.replace(/"/g, '&quot;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		/*
		You may add other replacements here for HTML only
		(but it's not necessary).
		Or for XML, only if the named entities are defined in its DTD.
		*/
		.replace(/\r\n/g, preserveCR) /* Must be before the next replacement. */
		.replace(/[\r\n]/g, preserveCR);
}

if (!Math.sign) {
	Math.sign = function(x) {
		return ((x > 0) - (x < 0)) || +x;
	};
}
if (!Array.prototype.find) {
	Object.defineProperty(Array.prototype, 'find', {
		value: function(predicate) {
			if (this == null) throw TypeError('"this" is null or not defined');
			var o = Object(this),
				len = o.length >>> 0;
			if (typeof predicate !== 'function') throw TypeError('predicate must be a function');
			var thisArg = arguments[1],
				k = 0;
			while (k < len) {
				var kValue = o[k];
				if (predicate.call(thisArg, kValue, k, o)) return kValue;
				k++;
			}
			return undefined;
		},
		configurable: true,
		writable: true
	});
}

if (!String.prototype.padStart) {
	String.prototype.padStart = function padStart(targetLength, padString) {
		targetLength = targetLength >> 0; //truncate if number or convert non-number to 0;
		padString = String((typeof padString !== 'undefined' ? padString : ' '));
		if (this.length > targetLength) {
			return String(this);
		} else {
			targetLength = targetLength - this.length;
			if (targetLength > padString.length) {
				padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
			}
			return padString.slice(0, targetLength) + String(this);
		}
	};
}

RegExp.escape = function (s) {
	return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

String.prototype.padStart = String.prototype.padStart ? String.prototype.padStart : function (targetLength, padString) {
	targetLength = Math.floor(targetLength) || 0;
	if (targetLength < this.length) {
		return String(this);
	}

	padString = padString ? String(padString) : " ";

	var pad = "";
	var len = targetLength - this.length;
	var i = 0;
	while (pad.length < len) {
		if (!padString[i]) {
			i = 0;
		}
		pad += padString[i];
		i++;
	}

	return pad + String(this).slice(0);
};

var round = function (value, precision) {
	if (typeof precision === 'undefined') {
		if (typeof _ACCOUNTING_SETTING !== 'undefined' &&
			typeof _ACCOUNTING_SETTING.currency !== 'undefined' &&
			typeof _ACCOUNTING_SETTING.currency.precision !== 'undefined') {
			precision = _ACCOUNTING_SETTING.currency.precision;
		} else {
			precision = 2;
		}
	}
	var multiplier = Math.pow(10, precision);
	return Math.sign(value) * Math.round(parseFloat(Math.abs(value) * multiplier).toPrecision(15)) / multiplier;
};

function updateFB() {
	if (typeof $.fancybox === 'function' && typeof $.fancybox.update === 'function') {
		if ($.fancybox.isOpen) {
			$.fancybox.update();
		}
	}
}

var SLIDERS_LOADED = false;

function initializeSliders() {
	if ($(".uslideContainer").size()) {
		var initSliders = function () {
			SLIDERS_LOADED = true;
			$(".uslideContainer").each(function () {
				let nav = $(this).hasClass('navDisabled') ? false : true;
				if (!$(this).data('responsive-sliders-initialized')) {
					$(this).data('responsive-sliders-initialized', true);
					$(this).find('.rslides_nav').remove();
					let sliderElement = $(this).find('.responsiveSliders');
					var slideOptions = {
						nav: nav,
						auto: sliderElement.attr('data-auto') == "false" ? false : true,
						speed: sliderElement.attr('data-speed') ? sliderElement.attr('data-speed') : 800,
					};
					if (sliderElement.attr('data-timeout')) {
						slideOptions.timeout = sliderElement.attr('data-timeout');
					}
					if(sliderElement.attr('data-pause')) {
						slideOptions.pause = sliderElement.attr('data-pause');
					}
					if(sliderElement.attr('data-pausecontrols')) {
						slideOptions.pauseControls = sliderElement.attr('data-pausecontrols');
					}
					if(sliderElement.attr('data-maxwidth') ) {
						slideOptions.maxwidth = sliderElement.attr('data-maxwidth');
					}
/*					These options are a bit more advanced. Require more testing to allow for implementation
					if( sliderElement.attr('data-pager') ) {
						slideOptions.pager =  sliderElement.attr('data-pager');
					}
					if (sliderElement.attr('data-random')) {
						slideOptions.random =  sliderElement.attr('data-random');
					}
					if(sliderElement.attr('data-navContainer') ) {
						slideOptions.navContainer =  sliderElement.attr('data-navContainer');
					}
					if(sliderElement.attr('data-manualControls')) {
						slideOptions.manualControls = sliderElement.attr('data-manualControls');
					}*/
					$(this).find('.responsiveSliders').responsiveSlides(slideOptions);
				}
			});
		};
		if (!SLIDERS_LOADED) {
			$.getScript(__RESPONSIVE_SLIDERS_URL)
				.done(initSliders);
		} else {
			initSliders();
		}
	}
}

function clipPaths() {
	if ($(".clipPath").length) {
		$(".clipPath").each(function() {
			if ($(this).hasClass("circlePath")) {
				circlePath($("img", this));
			}
			else if ($(this).hasClass("starPath")) {
				starPath($("img", this));
			}
		});
	}
	function circlePath(img) {
		const size = (Math.min(img.width(), img.height())) / 2;
		img.css("clip-path", "circle(" + size + "px at 50% 50%)");
	}
	function starPath(img) {
		const star = [[50, 0],[65, 28],[98, 35],[74, 56],[79, 91],[50, 75],[21, 91],[26, 56],[2, 35],[35, 28]];
		let longSide = null;
		let diff_per = null;
		let path = "";

		if (img.width() != img.height()) {
			let diff_val = Math.abs(img.width() - img.height()) / 2;
			longSide = img.width() > img.height() ? 0 : 1;
			diff_per = longSide ? (diff_val / img.height()) * 2 : (diff_val / img.width()) * 2;
		}

		star.forEach(function(point, i) {
			if (longSide != null) {
				let point_diff_val = Math.abs(point[longSide] - 50);
				let point_diff_per = (point_diff_val * diff_per);
				if (point[longSide] < 50) {
					point[longSide] += point_diff_per;
				}
				else if (point[longSide] > 50) {
					point[longSide] -= point_diff_per;
				}
			}
			if (longSide == 0) {
				point[1] += 4;
			}
			path += `${point[0]}% ${point[1]}%`;
			path += (i < star.length - 1) ? "," : "";
		});
		img.css("clip-path", "polygon(" + path + ")");
	}
}

$('body').on('click', '.uslideContainer a', function (e) {
	var href = $(this).attr('href');
	if (!href || href === '#') {
		e.preventDefault();
	}
});

window.reportSetErrorMessage = function(msg) {
	if(typeof window.reportViewSetErrorMessage === 'function') {
		window.reportViewSetErrorMessage(msg);
	}
	else {
		alert(msg);
	}
}

let downloadsCounter = 0;
window.downloadReport = function(getUrl, filters) {
	$.fancybox.showLoading();
	let iframeId = 'fileDownloaded' + (new Date()).getTime();
	let URL = getUrl + '&iframe=' + iframeId,
		body = $('body'),
		div = $('<div></div>').attr({
			style: "visibility:hidden;display:none"
		}),
		form = $('<form>').attr({
			target: iframeId,
			action: URL,
			method: 'post'
		}),
		submit = $('<input/>').attr({
			type: 'submit'
		}),
		iframe = $("<iframe/>").attr({
			name: iframeId
		});

	if(typeof filters === 'object' && filters !== null) {
		Object.keys(filters).forEach(function(key) {
			form.append($('<input/>').attr({
				type: 'hidden',
				name: 'filters['+key+']',
				value: filters[key]
			}));
		});
	}

	form.append(submit);
	div.append(form);
	div.append(iframe);
	body.append(div);
	submit[0].click();

	downloadsCounter++;
	let timer  = setInterval(function() {
		if(document.cookie.indexOf(iframeId)>-1){
			downloadsCounter--;
			if(downloadsCounter <= 0){
				$.fancybox.hideLoading();
			}
			clearInterval(timer);
			document.cookie = iframeId + '= ; expires = Thu, 01 Jan 1970 00:00:00 GMT';
			div.remove();
		}
	}, 500);

	iframe.load(function() {
		downloadsCounter--;
		if(downloadsCounter <= 0){
			$.fancybox.hideLoading();
		}
		clearInterval(timer);
		div.remove();
	});
}

function formatStringToMomentDateFormat (formatString) {
	let momentDateFormat;
	switch (formatString) {
		case 'short_date':
			momentDateFormat = _DATE_FORMATS[SHORT_DATE];
			break;
		case 'medium_date':
			momentDateFormat = _DATE_FORMATS[MEDIUM_DATE];
			break;
		case 'long_date':
			momentDateFormat = _DATE_FORMATS[LONG_DATE];
			break;
		case 'time':
			momentDateFormat = _DATE_FORMATS[TIME_ONLY];
			break;
		default:
			momentDateFormat = _DATE_FORMATS[SHORT_DATE];
			break;
	}
	return momentDateFormat;
}

$(document).ready(function () {

	if (typeof $['fancybox'] !== 'undefined') {
		if (typeof $['fancybox']['showLoading'] !== 'function' && typeof $['fancybox']['showActivity'] === 'function') {
			$.fancybox.showLoading = $.fancybox.showActivity;
		}
		if (typeof $['fancybox']['hideLoading'] !== 'function' && typeof $['fancybox']['hideActivity'] === 'function') {
			$.fancybox.hideLoading = $.fancybox.hideActivity;
		}
		if (typeof $['fancybox']['update'] !== 'function' && typeof $['fancybox']['resize'] === 'function') {
			$.fancybox.update = $.fancybox.resize;
		}
	}
	$('.fancybox').fancybox({type: 'ajax'});

	initializeSliders();

	//fix IE wrapped buttons
	$('a button').live('click', function () {
		var node = $(this).parent('a')[0];
		if (node.click) {
			node.click();
		} else if (document.createEvent) {
			var oEvent = document.createEvent("MouseEvents");
			if (oEvent.initMouseEvent) { // just to be sure...
				oEvent.initMouseEvent("click", true, true, window, 1, 1, 1, 1, 1, false, false, false, false, 0, node);
				node.dispatchEvent(oEvent);
			}
		}
	});

	$('a.userLogin.ajaxLogin').on('click', function(e) {
		e.preventDefault();
		e.stopPropagation();
		UP.Services.login();
	});

	$('.list-warning-popup').on("click", function() {
		if ($(this).attr('title')) {
			if (!confirm($(this).attr('title'))) {
				$(this).attr("checked", false);
			}
		}
	});

	$('a[href^="/ajax/select-participant.php"], a[href^="/ajax/subscription-select-participant.php"]').unbind('click.fb-start').unbind('click.fb').click(function (e) {
		e.stopPropagation();
		e.preventDefault();
		var href = $(e.target).attr('href')||'';
		var qs = (href).slice(href.indexOf('?'));
		qs = qs.replace(/^\?/, '').split('&');
		var params = {};
		qs.forEach(function (prop) {
			prop = prop.split('=');
			if (typeof prop[0] !== 'undefined' && prop[0] !== '') {
				params[prop[0]] = prop[1];
			}
		});
		var data = {};
		if (params.product_id) {
			data.productId = params.product_id;
		} else if (params.subscription_id) {
			data.subscriptionId = params.subscription_id;
		}
		if (params.product_id || data.subscriptionId) {
			var $elem = $(this);
			$elem.addClass('isDisabled');
			$elem.removeAttr('href');
			window.enableAddToCartButton = (function () {
				return function () {
					$elem.attr('href', href);
					$elem.removeClass('isDisabled');
				}
			})();
			var scope = parent.$('#editOrderItemTemp') !== 'undefined' ? parent : window;
			scope.addToCartAjax(data);
		}
	}).removeClass('fancybox');

	$('.languageFields, .tabContainer').tabs().find('.selected').click();

	$('a[href=#]').click(function (e) {
		e.preventDefault();
	});

	$('.site-field-values select[multiple="multiple"]').each(function () {
		$(this).selectList({
			template: '<li class="m-row"><span class="m-cell-lock sevenEighth">%text%</span><div class="m-cell-lock oneEighth textRight"><span class="icon-delete"></span></div></li>',
		});
	});
	//SelectList is modified to have a help icon. Deletion is triggered by clicking the span (widened to fill up most of the item by the nbsp;s), not by clicking the list item


	$('body').on('focus', 'input.datePicker', function () {
		var placeholder = $(this).attr('placeholder');
		if (!$(this).data('datepickerinit')) {
			var opts = {
				dateFormat: convertFromMoment(_DATE_FORMATS[SHORT_DATE]),
				changeYear: true,
				yearRange: "-100:+10"
			}
			if (placeholder) {
				opts.defaultDate = placeholder;
				$(this).data('last-placeholder', placeholder);
			}
			$(this).datepicker(opts);
		} else if (placeholder && placeholder !== $(this).data('last-placeholder')) {
			$(this).datepicker("option", "defaultDate", placeholder);
			$(this).data('last-placeholder', placeholder);
		}
	});

	$('body').on('focus', 'input[rel="datetime"]', function () {
		if (!$(this).data('datetimepickerinit')) {
			$(this).data('datetimepickerinit', true);
			var datetimeoptions = {
				dateFormat: convertFromMoment(_DATE_FORMATS[SHORT_DATE]),
				timeFormat: convertFromMoment(_DATE_FORMATS[TIME_ONLY]),
				changeYear: true,
				yearRange: "-100:+10"
			};
			if ($(this).attr('minDateTime')) {
				datetimeoptions.minDateTime = new Date($(this).attr('minDateTime') * 1000);
			}
			if ($(this).attr('maxDateTime')) {
				datetimeoptions.maxDateTime = new Date($(this).attr('maxDateTime') * 1000);
			}
			if (typeof server_timezone !== 'undefined') {
				datetimeoptions.timezone = server_timezone;
			}
			$(this).datetimepicker(datetimeoptions);
		}
	});
	$('body').on('focus', 'input[rel="datetimeseconds"]', function () {
		if (!$(this).data('datetimepickerinit')) {
			$(this).data('datetimepickerinit', true);
			var datetimeoptions = {
				dateFormat: convertFromMoment(_DATE_FORMATS[SHORT_DATE]),
				timeFormat: convertFromMoment(_DATE_FORMATS[TIME_WITH_SEC]),
				changeYear: true,
				yearRange: "-100:+10",
				showSecond: true
			};
			if ($(this).attr('minDateTime')) {
				datetimeoptions.minDateTime = new Date($(this).attr('minDateTime') * 1000);
			}
			if ($(this).attr('maxDateTime')) {
				datetimeoptions.maxDateTime = new Date($(this).attr('maxDateTime') * 1000);
			}
			if (typeof server_timezone !== 'undefined') {
				datetimeoptions.timezone = server_timezone;
			}
			$(this).datetimepicker(datetimeoptions);
		}
	});

	$('body').on('focus', 'input[rel="date"]', function () {
		if (!$(this).data('datepickerinit')) {
			$(this).datepicker({
				dateFormat: convertFromMoment(_DATE_FORMATS[SHORT_DATE])
			});
		}
	});

	$('body').on('initializeTimepicker', 'input[rel="timepicker"]', function () {
		if (!$(this).data('timepickerinit')) {
			$(this).data('timepickerinit', true);
			var timepickeroptions = {
				timeFormat: convertFromMoment(_DATE_FORMATS[TIME_ONLY], true)
			};
			$(this).timepicker(timepickeroptions);
		}
	}).on('focus', function () {
		$(this).trigger('initializeTimepicker');
	});

	$('table.add_remove_rows tbody').each(function () {
		if ($(this).find('.removeRow').size() == 1) {
			$(this).find('.removeRow').hide();
		}
	});
	$('table.add_remove_rows tbody').on('click', '.removeRow', function () {
		var tbody = $(this).closest('tbody');
		$(this).closest('tr').remove();
		if (tbody.find('.removeRow').size() == 1) {
			tbody.find('.removeRow').hide();
		}
		return;
	});
	$('table.add_remove_rows tfoot a.addRow').click(function () {
		var tbody = $(this).closest('table').find('tbody');
		var newRow = tbody.find('tr:last').clone();
		newRow.find('select,input,textarea').each(function () {
			$(this).attr('name', $(this).attr('name').replace(/\[([^\]]*)\]/, function (k) {
				var key = k.replace(/\[([^\]]*)\]/, '$1');
				if (!isNaN(parseFloat(key)) && isFinite(key)) {
					return '[' + (parseInt(key) + 1) + ']';
				}
				return k;
			}));
			$(this).val('');
		});
		tbody.append(newRow);
		tbody.find('.removeRow').show();
		return false;
	});

	$('table tbody a.toggleDetails').click(function () {
		var details = $(this).attr('id').replace(/summary_/, '#details_');
		var tbody = $(this).closest('table').find('tbody');
		var detailsElement = tbody.find(details);
		if (detailsElement.hasClass('nodisplay')) {
			detailsElement.hide().removeClass('nodisplay');
			detailsElement.fadeIn();
		} else {
			detailsElement.fadeOut(400, function () {
				$(this).addClass('nodisplay');
			});
		}
	});
	$('tr.detailsItem').addClass('nodisplay');

	$('.toggleDetails').click(function () {
		$(this).toggleClass('active');
		var details = $(this).closest('div').children('.details');
		details.fadeToggle();
		return false;
	});

	$('form.autoSubmit select').change(function () {
		$(this).closest('form')[0].submit();
	});
	$('form.autoSubmit input[type=radio]').change(function () {
		$(this).closest('form')[0].submit();
	});

	$('.nojs').hide();

	if (typeof tinyMCE !== 'undefined') {
		var options = {
			selector: 'textarea:not(.htCommentTextArea):not(.simple):not(.handsontableInput):not(.copyPaste):not(.HandsontableCopyPaste):not(.htCommentTextArea):not(.g-recaptcha-response)',
			removed_menuitems: 'newdocument',
			relative_urls: false,
			remove_script_host: true,
			convert_urls: true,
			promotion: false,
			/* mobile: {
				theme: 'mobile',
				plugins: ['autosave', 'lists', 'autolink'],
				toolbar: ['undo', 'redo', 'fontsizeselect', 'bold', 'italic', 'underline', 'forecolor', 'bullist', 'numlist', 'link', 'unlink', 'image', 'removeformat', 'styleselect', 'searchreplace']
			},*/
			// General options
			plugins: "pagebreak,table,save,insertdatetime,preview,searchreplace,directionality,fullscreen,visualchars,nonbreaking,link,code,anchor,image,lists,template",
			toolbar: ["cut copy paste undo redo | searchreplace | styleselect | fontselect fontsizeselect | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent blockquote | hr link anchor image | table code"],
			fontsize_formats: "8pt 9pt 10pt 11pt 12pt 14pt 16pt 18pt 24pt 36pt 72pt",
			extended_valid_elements: "script[src|async=true|charset|type=application/javascript],img[class|src|border=0|alt|title|hspace|vspace|width|height|align|onmouseover|onmouseout|name|style],style",
			custom_elements: "style",
			browser_spellcheck: true,
			templates: [
				{title: cmsBannerSliderTitle, description: cmsBannerSliderDescription, url: typeof lang !== 'undefined' && lang !== 'eng' ?'/uSimpleCMSTemplates/content-helpers/responsive-slides-' + lang + '.html':'/uSimpleCMSTemplates/content-helpers/responsive-slides.html'},
				{title: cmsCalendarTitle, description: cmsCalendarDescription, url: '/uSimpleCMSTemplates/content-helpers/calendar.html'},
				{title: cmsHeroCentreOverlayTitle, description: cmsHeroCentreOverlayDescription, url: typeof lang !== 'undefined' && lang !== 'eng' ? '/uSimpleCMSTemplates/content-helpers/hero-image-' + lang + '.html' : '/uSimpleCMSTemplates/content-helpers/hero-image.html'},
				{title: cmsHeroLeftOverlayTitle, description: cmsHeroLeftOverlayDescription, url: typeof lang !== 'undefined' && lang !== 'eng' ? '/uSimpleCMSTemplates/content-helpers/hero-image-left-' + lang + '.html' : '/uSimpleCMSTemplates/content-helpers/hero-image-left.html'},
				{title: cmsHeroRightOverlayTitle, description: cmsHeroRightOverlayDescription, url: typeof lang !== 'undefined' && lang !== 'eng' ? '/uSimpleCMSTemplates/content-helpers/hero-image-right-' + lang + '.html' : '/uSimpleCMSTemplates/content-helpers/hero-image-right.html'},
				{title: cmsResponsiveVideoTitle, description: cmsResponsiveVideoDescription, url: '/uSimpleCMSTemplates/content-helpers/responsive-video.html'},
				{title: cmsImageLeftTitle, description: cmsImageLeftDescription, url: typeof lang !== 'undefined' && lang !== 'eng' ? '/uSimpleCMSTemplates/content-helpers/image-align-left-' + lang + '.html' : '/uSimpleCMSTemplates/content-helpers/image-align-left.html'},
				{title: cmsImageRightTitle, description: cmsImageRightDescription, url: typeof lang !== 'undefined' && lang !== 'eng' ? '/uSimpleCMSTemplates/content-helpers/image-align-right-' + lang + '.html' : '/uSimpleCMSTemplates/content-helpers/image-align-right.html'},
				{title: cmsTwoColumnsTitle, description: cmsTwoColumnsDescription, url: typeof lang !== 'undefined' && lang !== 'eng' ? '/uSimpleCMSTemplates/content-helpers/columns-two-' + lang + '.html': '/uSimpleCMSTemplates/content-helpers/columns-two.html'},
				{title: cmsThreeColumnsTitle, description: cmsThreeColumnsDescription, url: typeof lang !== 'undefined' && lang !== 'eng' ? '/uSimpleCMSTemplates/content-helpers/columns-three-' + lang + '.html' : '/uSimpleCMSTemplates/content-helpers/columns-three.html'},
				{title: cmsFourColumnsTitle, description: cmsFourColumnsDescription, url: typeof lang !== 'undefined' && lang !== 'eng' ? '/uSimpleCMSTemplates/content-helpers/columns-four-' + lang + '.html' : '/uSimpleCMSTemplates/content-helpers/columns-four.html'},
				{title: cmsCalloutCentredTitle, description: cmsCalloutCentredDescription, url: typeof lang !== 'undefined' && lang !== 'eng' ? '/uSimpleCMSTemplates/content-helpers/callout-center-' + lang + '.html' : '/uSimpleCMSTemplates/content-helpers/callout-center.html'},
				{title: cmsCalloutHoverTextBottomTitle, description: cmsCalloutHoverTextBottomDescription, url: typeof lang !== 'undefined' && lang !== 'eng' ? '/uSimpleCMSTemplates/content-helpers/callout-hover-text-bottom-' + lang + '.html' : '/uSimpleCMSTemplates/content-helpers/callout-hover-text-bottom.html'},
				{title: cmsStaffImageWithDescTitle, description: cmsStaffImageWithDescDescription, url: typeof lang !== 'undefined' && lang !== 'eng' ? '/uSimpleCMSTemplates/content-helpers/staff-side-description-' + lang + '.html' : '/uSimpleCMSTemplates/content-helpers/staff-side-description.html'},
				{title: cmsSearchFormTitle, description: cmsSearchFormDescription, url: typeof lang !== 'undefined' && lang !== 'eng' ? '/uSimpleCMSTemplates/content-helpers/search-bar-' + lang + '.html' : '/uSimpleCMSTemplates/content-helpers/search-bar.html'},
				{title: cmsColouredContentRowTitle, description: cmsColouredContentRowDescription, url: typeof lang !== 'undefined' && lang !== 'eng' ? '/uSimpleCMSTemplates/content-helpers/fixed-container-' + lang + '.html' : '/uSimpleCMSTemplates/content-helpers/fixed-container.html'},
				{title: cmsTabsHTitle, description: cmsTabsHDescription, url: typeof lang !== 'undefined' && lang !== 'eng' ? '/uSimpleCMSTemplates/content-helpers/tabs-horizontal-' + lang + '.html' : '/uSimpleCMSTemplates/content-helpers/tabs-horizontal.html'},
				{title: cmsToggleContentTitle, description: cmsToggleContentDescription, url: typeof lang !== 'undefined' && lang !== 'eng' ? '/uSimpleCMSTemplates/content-helpers/toggle-content-' + lang + '.html' : '/uSimpleCMSTemplates/content-helpers/toggle-content.html'},
				{title: cmsSocialIconsTitle, description: cmsSocialIconsDescription, url: '/uSimpleCMSTemplates/content-helpers/social-icons.html'},
				{title: cmsClippedImageCircleTitle, description: cmsClippedImageCircleDescription, url: '/uSimpleCMSTemplates/content-helpers/clipped-image-circle.html'},
				{title: cmsClippedImageStarTitle, description: cmsClippedImageStarDescription, url: '/uSimpleCMSTemplates/content-helpers/clipped-image-star.html'},
			]
		};

		if (typeof _FEATURES === 'undefined') {
			//add all optional features
			options['plugins'] += ',usimplecmsmedia';
		} else {
			if ($.inArray('CMS', _FEATURES) > -1) {
				options['plugins'] += ',usimplecmsmedia';
			}
		}

		if(typeof USE_TINYMCE_4 !== 'undefined') {
			options['plugins'] += ',placeholder';
		}
		window.getTinyMCESettings = function () {
			return $.extend(true, {}, options);
		};

		//this code should be kept in sync with usimplecms-0.1.5.js & initTinyMCE-0.1.js
		window.initStandardTinyMCE = function (newSettings) {
			let opts = $.extend(true, {}, options);
			if (typeof newSettings !== 'undefined') {
				opts = $.extend(true, {}, newSettings);
			}
			let updateHtmlElem = function (editor) {
				editor.on("change redo undo keypress", function () {
					let element = $(editor.getElement()),
						lastTimeout = element.data('tinymce_change_timeout');
					if(lastTimeout) {
						clearTimeout(lastTimeout)
					}
					element.data('tinymce_change_timeout', setTimeout(function() {
						let body = editor.getBody();
						if (body) {
							element.val(body.innerHTML).change();
						}
					}));
				});
			}
			if (typeof opts.setup === 'undefined') {
				opts.setup = function (editor) {
					updateHtmlElem(editor);
				}
			} else {
				let _customSetup;
				if (typeof opts.setup === 'function') {
					_customSetup = opts.setup;
				}
				opts.setup = function (editor) {
					updateHtmlElem(editor);
					if (_customSetup) {
						_customSetup(editor);
					}
					editor.on('ObjectResized', function (e) {
						if (e.target.nodeName === 'IMG') {
							var selectedImage = editor.selection.getNode();
							editor.dom.setStyle(selectedImage, 'width', e.width);
							editor.dom.setStyle(selectedImage, 'height', e.height);

							selectedImage.removeAttribute('width');
							selectedImage.removeAttribute('height');
						}
					});
				}
			}
			tinyMCE.init(opts);

			$(document).on('focusin', function (e) {
				if ($(e.target).closest(".mce-window").length) {
					e.stopImmediatePropagation();
				}
			});
		};
		initStandardTinyMCE();

		function _initTinyMCE (element, targetObservable, otherSettings) {

			if (targetObservable.tinyMceEDitor) {
				try {
				targetObservable.tinyMceEDitor.destroy();
				} catch (e) {}
			}

			let setting = $.extend(true, {}, window.getTinyMCESettings(), otherSettings || {});
			delete setting.selector;
			setting.target = element;
			element.setAttribute('placeholder', setting.placeholder || '');
			setting.init_instance_callback = function (editor) {
				if (ko['isObservable'](targetObservable)) {
					editor.fire('blur');

					targetObservable.tinyMceEDitor = editor;
					targetObservable.tinyMceEDitor.reload = function (otherSettings) {
						_initTinyMCE(element, targetObservable, otherSettings);
					};
					let indeterminate = ko['unwrap'](targetObservable.indeterminate);
					if (indeterminate) {
						let _lastValue;
						targetObservable.tinyMceEDitor.on('focus', function () {
							_lastValue = targetObservable();
						});
						targetObservable.tinyMceEDitor.on('blur', function () {
							let value = targetObservable();
							if (_lastValue === undefined && _lastValue !== value) {
								_initTinyMCE(element, targetObservable, {placeholder: ''});
							}
						});
					}
					targetObservable['subscribe'](function (value) {
						if (!value) {
							editor.setContent('');
						}
					});
				}
			};
			setTimeout(function () {
				window.initStandardTinyMCE(setting);
			});
		}

		ko['bindingHandlers'].tinyMCE = {
			init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
				ko['bindingHandlers'].textInput.init.call(this, element, valueAccessor, allBindings, viewModel, bindingContext);
				let targetObservable = valueAccessor();
				let otherSetting = ko.unwrap(allBindings.get('tinyMCESettings')) || {};
				_initTinyMCE(element, targetObservable, otherSetting);
			}
		};
	}

	$("input.master_check").click(function () {
		if ($("input.master_check").attr("checked")) {
			$("input.depend_checks").attr('checked', true);
		} else {
			$("input.depend_checks").attr('checked', false);
		}
	});

	$("input.depend_checks").click(function () {
		if ($("input.master_check").attr("checked")) {
			$("input.master_check").attr("checked", false);
		}
	});

	// confirm deleting for participant achievements
	$('a.confirmDelete, button.confirmDelete').click(function (e) {
		var message = this.rel;
		if (!message) {
			message = $(this).attr('rel');
		}
		if (!window.confirm(message)) {
			e.preventDefault();
			e.stopPropagation();
			return false;
		}
	});
	
	initNavs();
	initUserNav();

	$(window).on('resize', function() {
		setHeaderImage();
		clipPaths();

	}).resize();

	$(window).on("load", function(){
		clipPaths();
	});

	$('body').on('click', '.menuClickTarget', function () {
		$(this).parent().toggleClass('menuOpen');
		$(this).parent('.listDropdown ul').toggleClass('openList');
	});
	$('body').on('click', '.listDropdown li', function () {
		$('.listDropdown ul').removeClass('openList');
		$(this).addClass('selected').siblings().removeClass('selected');
		$('.listDropdown').removeClass('menuOpen');
	});

	$('#shift_checkin a').click(function (e) {
		e.preventDefault();
		$.fancybox.showLoading();
		$.ajax({
			type: 'get',
			url: $(this).attr('href'),
			dataType: 'json',
			success: function (response) {
				if (response.error) {
					alert(response.error);
				} else {
					$('#shift_checkout').find('[data-start-time]').data('start-time', response.start_time);
					//wait 1 second for the interval below to have corrected the displayed time first
					setTimeout(function () {
						$('#shift_checkin').hide();
						$('#shift_checkout').show();
					}, 1000);
				}
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				//don't alert of errors if the request was just cancelled
				if(XMLHttpRequest.status !== 0) {
					alert(jsmsgErrorUnknown);
				}
			},
			complete: function () {
				setTimeout($.fancybox.hideLoading, 1000)
			}
		});
	});
	$('#shift_checkout a').click(function (e) {
		e.preventDefault();
		$.fancybox.showLoading();
		$.ajax({
			type: 'get',
			url: $(this).attr('href'),
			dataType: 'json',
			success: function (response) {
				if (response.error) {
					alert(response.error);
				} else {
					$('#shift_checkin').show();
					$('#shift_checkout').hide().find('[data-start-time]').data('start-time', false).data('start-time-date', false);
				}
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				//don't alert of errors if the request was just cancelled
				if(XMLHttpRequest.status !== 0) {
					alert(jsmsgErrorUnknown);
				}
			},
			complete: $.fancybox.hideLoading
		});
	});
	if ($('#shift_checkout').size()) {
		(function (el) {
			var updateCheckedInTime = function () {
				let _timeOffset = ko.unwrap(window.timeOffset);
				if (el.data('start-time')) {
					if (!el.data('start-time-date')) {
						el.data('start-time-date', new Date(el.data('start-time') * 1000));
						var formattedDate = $.datepicker.formatDate(convertFromMoment(_DATE_FORMATS[SHORT_DATE]) + ' ', el.data('start-time-date')) + $.datepicker.formatTime(convertFromMoment(_DATE_FORMATS[TIME_ONLY]), {
							hour: el.data('start-time-date').getHours(),
							minute: el.data('start-time-date').getMinutes()
						});
						el.find('[data-datetime]').text(formattedDate);
					}
					el.find('[data-duration]').text(timeDifference(el.data('start-time-date'), _timeOffset*1000));
				}
			}
			updateCheckedInTime();
			setInterval(updateCheckedInTime, 1000);
		})($('#shift_checkout [data-start-time]'));
	}
//for dynamic tooltips
	$('body').on('mouseover mouseenter touchstart', '.tooltip', function () {
		if (!$(this).data('tooltip-init')) {
			$(this).data('tooltip-init', true);
			var featureUnavailable = $(this).hasClass('featureUnavailable');
			var width = 300;
			var position = featureUnavailable ? 'bottom' : 'top';
			if ($(this).data('tooltip-position')) {
				position = $(this).data('tooltip-position');
			}
			if ($(this).data('tooltip-width')) {
				width = $(this).data('tooltip-width');
			}
			let trigger = 'hover';
			if ($(this).data('tooltip-trigger')) {
				trigger = $(this).data('tooltip-trigger');
			}
			let settings = {
				animation: 'fade',
				delay: 200,
				theme: featureUnavailable ? 'tooltipster-default' : 'tooltipster-shadow',
				position: position,
				//touchDevices: true,
				trigger: trigger,
				maxWidth: width,
				contentAsHTML: true,
				restoration: 'previous',
				functionBefore: function (origin, helper) {
					if ($(origin._$origin).find('.tooltipContent').size()) {
						origin._$origin.tooltipster('content', $(origin._$origin).find('.tooltipContent').html());
					} else if($(origin._$origin).attr('title')) {
						$(origin._$origin).removeAttr('title');
					}
				}
			};
			if ($(this).data('tooltip-interactive') || $(this).context.classList.contains("tooltip-interactive")) {
				settings.interactive = true;
			}
			trigger === 'hover' ? $(this).tooltipster(settings).tooltipster('open') : $(this).tooltipster(settings);
		}
	});

	/**
	 * Function for printing the info to the screen.
	 * @param json string "message"
	 */
	window.displayMessage = function (message) {
		$('#errors').html('');
		$('#notice').html('');
		if (message.error) {
			var html = '';

			html += '<strong>' + jsmsgErrorEncountered + '</strong>';
			html += '<ul class="error">';
			for (var i in message.error) {
				html += '<li class="errorMsg">' + message.error[i] + '</li>';
			}
			html += '</ul>';

			$('#errors').html(html).show();
			$(window).scrollTop(0);
		}
		if (message.success) {
			$('#notice').html('<ul class="success"><li class="successMsg">' + message.success[0] + '</li></ul>');
			$(window).scrollTop(0);
		}
	};

	var lastY = null;
	$(window).scroll(function () {
		var y = $(this).scrollTop();
		if (lastY !== y) {
			lastY = y;
			if (y > 100) { //display scroll top button
				$('.backToTop').fadeIn();
				$('.backToTopAdmin').addClass('active');
			} else {
				$('.backToTop').fadeOut();
				$('.backToTopAdmin').removeClass('active');
			}
		}
	});
	$('.backToTop, .backToTopAdmin').click(function () {//Click event to scroll to top
		$('html, body').animate({scrollTop: 0}, 400);
		return false;
	});


	//scroll filter buttons
	(function () {
		var $filterForm = $("#filter-form");
		if ($filterForm.length) {
			var $subNav = $filterForm.find('#subNav');
			var $filterButtonBar = $filterForm.find('.filterButtonBar');
			if ($subNav.length && $filterButtonBar.length) {
				if (($subNav.offset().top + $subNav.outerHeight()) < window.innerHeight) {
					$filterButtonBar.removeClass('active');
				}
				var $window = $(window);
				$(window).scroll(function () {
					if (($window['scrollTop']() + window.innerHeight) < ($subNav.offset().top + $subNav.outerHeight())) {
						$filterButtonBar.addClass('active');
					} else {
						$filterButtonBar.removeClass('active');
					}
				});
			}
		}
	})();

	//add active class when on specific page
	$(function () {
		var found = false;
		if (typeof activeMenuItem !== 'undefined') {
			$('#sideMenu').find('a').each(function () {
				if (this.getAttribute('href') === activeMenuItem) {
					$(this).parents("li").addClass('active');
					$(this).addClass('active');
					found = true;
				}
			});
		}
		if (!found) {
			var urlRegExp = new RegExp('^' + window.location.pathname.replace(/\?.+$/, '').replace(/\/$/, ''));
			$('#sideMenu').find('a').each(function () {
				if (urlRegExp.test(this.getAttribute('href'))) {
					$(this).parents("li").addClass('active');
					$(this).addClass('active');
					found = true;
				}
			});
		}

		// finally, allow a page to override the active navigation by setting a custom value
		if (typeof __activeNav !== "undefined" && __activeNav != null) {
			// remove the old active menu item css
			$('#sideMenu .active').removeClass('active');
			$('#sideMenu').find('a').each(function () {
				let menuUrl = this.getAttribute('href').replace(/\?.+$/, '').replace(/\/$/, '');
				if (__activeNav.startsWith(menuUrl)) {
					$(this).parents("li").addClass('active');
					$(this).addClass('active');
					found = true;
				}
			});
		}
	});

	var learnMore = document.getElementById("learnMore");

	//this will trigger the intro to be displayed after any additional $(document).ready() methods
	setTimeout(function () {
		var currentStep = null;
		var setCurrentStep = function (el) {
			currentStep = el;
		};
		var intro = introJs()
			.setOptions({
				overlayOpacity: 0.5,
				scrollToElement: true,
				keyboardNavigation: true,
				showBullets: false,
				showProgress: true,
				hidePrev: true,
				hideNext: true,
				nextLabel: jsmsgIntroNext + ' &rarr;',
				/* Previous button label in tooltip box */
				prevLabel: '&larr; ' + jsmsgIntroPrev,
				/* Skip button label in tooltip box */
				skipLabel: jsmsgIntroSkip,
				/* Done button label in tooltip box */
				doneLabel: jsmsgIntroDone
			})
			.oncomplete(setCurrentStep)
			.onexit(setCurrentStep)
			.onchange(setCurrentStep);
		$(window).bind('refresh-intro', function () {
			intro.refresh()
		});

		$('[data-skip-click]').on('click', function () {
			if (this === currentStep) {
				intro.nextStep();
			}
		});
		var doneForever = $('<a role="button" class="introjs-button introjs-doneforever">' + jsmsgIntroDoneForever + '</a>');
		doneForever.click(function () {
			intro.exit();
			disabledIntros[introPage] = true;
			cookie.set('disabledIntros', disabledIntros, 0);
		});
		startIntro = function () {
			intro.start();
			$('.introjs-tooltipbuttons').append(doneForever);
		}

		if (typeof introPage === 'undefined') {
			var introPage = window.location.pathname;
		}
		var disabledIntros = cookie.get('disabledIntros') || {};
		if (typeof disabledIntros[introPage] === 'undefined' && !learnMore) {
			startIntro();
		}

	}, 0);

	if (learnMore){
		learnMore.addEventListener("click", function() {
			var intro = introJs()
				.setOptions({
					overlayOpacity: 0.5,
					scrollToElement: true,
					keyboardNavigation: true,
					showBullets: false,
					showProgress: true,
					hidePrev: true,
					hideNext: true,
					nextLabel: jsmsgIntroNext + ' &rarr;',
					/* Previous button label in tooltip box */
					prevLabel: '&larr; ' + jsmsgIntroPrev,
					/* Skip button label in tooltip box */
					skipLabel: jsmsgIntroSkip,
					/* Done button label in tooltip box */
					doneLabel: jsmsgIntroDone
				});

			$('[data-skip-click]').on('click', function () {
				if (this === currentStep) {
					intro.nextStep();
				}
			});
			intro.refresh();
			if(typeof window.introJSStepsToAdd === 'function') {
				var introStepsToAdd = window.introJSStepsToAdd();
				var stepsToAdd = [];
				for(var i = 0; i < introStepsToAdd.length; i++) {
					var step = introStepsToAdd[i];
					var obj = {
						intro: step.intro
					};
					if(typeof step['element'] !== 'undefined') {
						var elements = document.querySelectorAll(step.element);
						if(!elements.length) {
							continue;
						}
						obj.element = elements[0];
						obj.position = typeof step.position === 'undefined' ? 'left' : step.position;
					}
					stepsToAdd.push(obj);
				}
				intro.addSteps(stepsToAdd);
			}
			intro.start();
		});
	}


	$('.cascadingProvince').cascadingProvince();

	var decimalInput = function (inputType, data, value, iconClick, otherBindings) {
		let valueObservable = null,
			valueChangedObservable = null;
		if(typeof value === 'object' && value !== null) {
			if(typeof value.value !== 'undefined' && ko.isObservable(value.value)) {
				valueObservable = value.value;
				if(typeof value.change !== 'undefined' && ko.isObservable(value.change)) {
					valueChangedObservable = value.change;
				}
			}
		} else if (ko.isObservable(value)) {
			valueObservable = value;
		}

		var self = this;
		self.settings = _ACCOUNTING_SETTING;
		self.liveValue = ko.observable(data.value);
		self.updateFormat = ko.observable(self.liveValue.localizedNumber()());
		self.liveValue(self.updateFormat());
		self.unFormattedValue = ko.pureComputed(function() {
			return getValidNumberString(self.liveValue());
		});
		self.updateFormat.subscribe(function() {
			setTimeout(function() {
				self.updateFormat(self.updateFormat.localizedNumber()());
				self.liveValue(self.updateFormat.localizedNumber()());
				if(valueChangedObservable) {
					valueChangedObservable(true);
				}
			}, 50);
		});
		let _attrBinding = ko['unwrap'](otherBindings ? otherBindings['attr'] : {})||{};
		self.attributes = ko.observable({});
		self.indeterminateWidget = ko.observable();
		if (valueObservable) {
			let shouldUpdate = true;
			valueObservable.subscribe(function () {
				setTimeout(function() {
					if(shouldUpdate) {
						self.updateFormat(valueObservable.localizedNumber()());
					}
				});
			});
			self.unFormattedValue.subscribe(function() {
				setTimeout(function() {
					shouldUpdate = false;
					valueObservable(self.unFormattedValue());
					setTimeout(function() {
						shouldUpdate = true;
					});
				});
			});
			let indeterminate = ko['unwrap'](valueObservable.indeterminate);
			if (indeterminate) {
				let _indeterminateWidget = new IndeterminateWidget(self.liveValue, self, valueObservable);
				let enable = (otherBindings||{})['enable'],
					disable = (otherBindings||{})['disable'];
				if (ko['isObservable'](enable)) {
					ko.computed(function () {
						_attrBinding.placeholder = enable['peek']() ? window['mixedPlaceholder'] : '';
						self.attributes(_attrBinding);
						self.indeterminateWidget(enable() ? _indeterminateWidget : null);
					});
				} else if (ko['isObservable'](disable)) {
					ko.computed(function () {
						_attrBinding.placeholder = !disable['peek']() ? window['mixedPlaceholder'] : '';
						self.attributes(_attrBinding);
						self.indeterminateWidget(disable() ? null : _indeterminateWidget);
					});
				}
			}
		}
		self.attributes(_attrBinding);
		self.inputName = data.name;
		self.inputId = data.id;
		self.inputClass = data.class;
		self.inputRel = data.rel;
		self.enable = ko.observable(data.enable);
		self.isNegative = ko.observable(data.isNegative);
		self.isClickable = ko.observable(data.isClickable);
		self.iconClick = function () {
			self.isNegative(!self.isNegative());
			if (typeof iconClick === 'function') {
				iconClick();
			}
		};
		self.iconText = ko.pureComputed(function () {
			if(inputType === 'percentInput') {
				return self.isNegative() ? self.settings.symbolWithSign.replace(self.settings.currency.symbol, '%') : '%';
			}
			return self.isNegative() ? self.settings.symbolWithSign : self.settings.currency.symbol;
		});
	};

	window.createDecimalInput = function(inputType, $elem, observable, iconClick, isClickable, isNegative, otherBindings) {
		var temporaryDiv = document.createElement("div");
		$elem.after(temporaryDiv);
		$elem.remove();
		var data = {
			value: parseInt($elem.val()) >= 0 ? $elem.val() : undefined,
			name: $elem.attr('name'),
			id: $elem.attr('id'),
			class: $elem.attr('class'),
			rel: $elem.attr('rel'),
			enable: true,
			isNegative: isNegative,
			isClickable: isClickable
		};
		if (!observable && !data.name) {
			console.error(inputType+": Missing 'name' attribute !!");
		}
		if ($elem.attr('disabled')) {
			data.enable = false;
		}
		ko.renderTemplate(
			'percentOrPriceInput',
			new decimalInput(inputType, data, observable, iconClick, otherBindings),
			{
				afterRender: function (nodes) {
					if (typeof otherBindings !== 'undefined') {
						ko.applyBindingsToNode($(nodes[1]).find('input')[0], otherBindings);
					}
				}
			},
			temporaryDiv,
			'replaceNode'
		);
	};

	window.createPriceInput = function ($elem, observable, iconClick, isClickable, isNegative, otherBindings) {
		window.createDecimalInput('priceInput', $elem, observable, iconClick, isClickable, isNegative, otherBindings);
	};

	$('.priceInput').each(function (index, elem) {
		createPriceInput($(elem), null, null, null, null);
	});
	window.createPercentInput = function ($elem, observable, iconClick, isClickable, isNegative, otherBindings) {
		window.createDecimalInput('percentInput', $elem, observable, iconClick, isClickable, isNegative, otherBindings);
	};

	$('.percentInput').each(function (index, elem) {
		createPercentInput($(elem), null, null, null, null);
	});
	$('.instructorSiteField').each(function (i, elem) {
		$(elem).jQueryInstructorField();
	});

	window.created_site_fields = {};

	window.createSiteFieldValueField = function (element, site_field, context, values) {
		let site_field_id = site_field.site_field_id(),
			context_id = context.context_id();
		if (typeof window.created_site_fields[site_field_id] === 'undefined') {
			window.created_site_fields[site_field_id] = {}
		}
		if(typeof window.created_site_fields[site_field_id][context_id] === 'undefined') {
			window.created_site_fields[site_field_id][context_id] = new SiteFieldValue(site_field, context, values);
		}

		// Empty the element
		while (element.firstChild) {
			ko.removeNode(element.firstChild);
		}
		var divContainer = element.appendChild(document.createElement("DIV"));
		ko.renderTemplate('siteFieldEdit', window.created_site_fields[site_field_id][context_id], {}, divContainer, 'replaceNode');
	};

	window.initSfvDropdownBox = function () {
		$('.sfvDropdownBox').each(function (i, select) {
			var $select = $(select);
			var setting = {
				closeAfterSelect: true,
				hideSelected: true,
				placeholder: ' -- ',
				onItemAdd: function () {
					$('*:focus').blur();
				}
			};
			if ($select.data('allow_free_form')) {
				setting.create = true;
				setting.placeholder = jsmsgSelectAddOptions
			}
			if ($select.attr('multiple')) {
				setting.maxItems = $select.data('max_items') || null;
			}
			$(select).selectize(setting);
		});

		$('.knockoutRenderSiteField').each(function (i, element) {
			var $element = $(element);
			let site_field_data = $element.data('site_field'),
				site_field = new SiteField(site_field_data),
				values = $element.data('field_value'),
				context_class = $element.data('context_class'),
				context_data = $element.data('context'),
				context;
			switch (context_class) {
				case 'participant':
					if(window.sampleParticipant) {
						context = window.sampleParticipant
						break;
					}
					context = new Participant({
						data: context_data,
						parent: null
					});
					break;
				case 'instructor':
					context = new Instructor(context_data);
					break;
				case 'order_item':
					context = new OrderItem({data: context_data}, self);
					break;
				case 'user':
					if(window.sampleUser) {
						context = window.sampleUser;
						break;
					}
					context = new User({
						data: context_data,
						parent: null
					});
					break;
			}
			createSiteFieldValueField(element, site_field, context, values)
		});
	};
	setTimeout(window.initSfvDropdownBox);

	//selectize insrtuctors
	var getInstructorsArray = function () {
		var _instructors = [];
		if (typeof (window.instructors) === 'object') {
			$.map(window.instructors, function (value) {
				var _instructor = {};
				_instructor['instructor'] = value.instructor_id;
				_instructor['name'] = value.first_name + ' ' + value.last_name;
				_instructors.push(_instructor);
			});
		}
		return _instructors;
	}();
	//on KO pages (add-child, order-edit)
	window.getInstructors = ko.pureComputed(function () {
		var _instructor = ko.observable(false);
		if (typeof window.instructors !== 'undefined') {
			_instructor(getInstructorsArray);
		} else {
			var get = {
				action: 'GetFormInfo',
				type: 'instructors',
				user: viewUser.user_id
			};
			var url = window['adminScope'] ? '/admin/users/add-child.php' : '/users/add-child.php';
			UP.Services.AjaxGetCall(url, get, function (response) {
				window.instructors = response.map(function (instructor) {
					return {
						instructor: instructor.instructor_id,
						name: instructor.first_name + ' ' + instructor.last_name
					};
				});
				_instructor(window.instructors);
			});
		}
		return _instructor;
	});
	//on non KO pages(participant,login)
	$('#instructor').selectize({
		options: getInstructorsArray,
		valueField: 'instructor',
		labelField: 'name',
		searchField: 'name',
		maxItems: 1,
		placeholder: jsmsgSelectInstructor
	});

	if (typeof _COOKIE_POLICY !== 'undefined' && _COOKIE_POLICY !== false && typeof _CURRENT_COOKIE_POLICY_VERSIONS !== 'undefined' && _CURRENT_COOKIE_POLICY_VERSIONS !== false) {
		var agreed = false;
		$.each(_CURRENT_COOKIE_POLICY_VERSIONS, function (language, version) {
			if (cookie.get('agreedToCookiePolicyVersion_' + language) == version) {
				agreed = true;
				return false;
			}
		});
		if (!agreed) {
			$('#footerAgreement').show();
		}
	}

	if (typeof validate === 'function') {
		validate.extend(validate.validators.datetime, {
			// The value is guaranteed not to be null or undefined but otherwise it
			// could be anything.
			parse: function (value) {
				return +moment.utc(value);
			},
			// Input is a unix timestamp
			format: function (value, options) {
				var format = options.dateOnly ? "YYYY-MM-DD" : "YYYY-MM-DD hh:mm:ss";
				return moment.utc(value).format(format);
			}
		});
		/** @see https://github.com/ansman/validate.js/issues/117*/
		validate.options = {
			fullMessages: false
		}
	}
	$(document).on('click', '.passwordField .icon-eye-slash-close', function() {
		$(this).removeClass('icon-eye-slash-close').addClass('icon-eye').siblings('input')[0].type = 'text';
	});
	$(document).on('click', '.passwordField .icon-eye', function() {
		$(this).addClass('icon-eye-slash-close').removeClass('icon-eye').siblings('input')[0].type ='password';
	});
	const ELs_inViewport = document.querySelectorAll('[data-animated]');
	ELs_inViewport.forEach(function (EL) {
		let cssClass = EL.dataset.animated;
		let cssClasses = cssClass.split(" ");
		cssClasses.forEach(function(cssClass){
			if (EL.classList.contains(cssClass)) {
				EL.classList.remove(cssClass);
			}
		});

	});
	if (window.IntersectionObserver) {
		const Obs = new IntersectionObserver(function (entries, observer) {
			entries.forEach(function (entry) {
				const cssClass = entry.target.dataset.animated;

				if (!entry.target.classList.contains('animated--repeat')) {
					if(entry.isIntersecting) {
						let cssClasses = cssClass.split(" ");
						cssClasses.forEach(function (cssClass) {
							if (!entry.target.classList.contains(cssClass)) {
								entry.target.classList.add(cssClass);
							}
						});
					}
				} else {
					entry.target.classList.toggle(cssClass, entry.isIntersecting);
				}
			});
		});
		ELs_inViewport.forEach(function (EL) {
			Obs['observe'](EL, {});
		});
	} else {
		function inViewport($el) {
			let elH = $el.outerHeight(),
				H   = $(window).height(),
				r   = $el[0].getBoundingClientRect(), t=r.top, b=r.bottom;
			return Math.max(0, t>0? Math.min(elH, H-t) : Math.min(b, H));
		}
		ELs_inViewport.forEach(function (EL) {
			const isIntersecting = (inViewport($(EL)) > 0);
			let cssClass = EL.dataset.animated;
			let cssClasses = cssClass.split(" ");
			cssClasses.forEach(function (cssClass) {
				EL.classList.toggle(cssClass, isIntersecting);
			});

		});
		$(window).on("scroll resize", function() {
			ELs_inViewport.forEach(function (EL) {
				const isIntersecting = (inViewport($(EL)) > 0);
				const cssClass = EL.dataset.animated;
				if (!EL.classList.contains('animated--repeat')) {
					if(isIntersecting) {
						let cssClasses = cssClass.split(" ");
						cssClasses.forEach(function (cssClass) {
							if (!EL.classList.contains(cssClass)) {
								EL.classList.add(cssClass);
							}
						});
					}
				} else {
					EL.classList.toggle(EL.dataset.animated, isIntersecting);
				}
			});
		});
	}
	getSiteFieldByIdLoading = ko.observable(false);
	$(document).on('click', '.language-selector span', function () {
		let $this = $(this),
			lang = $this.data('lang');
		changeInputLang($this, lang);
	});
});

function fetchPlaceholders() {
	var placeholders = [];
	$(document).find('[data-content-placeholder]').each(function () {
		placeholders.push($(this).data('contentPlaceholder'));
	});

	if (!placeholders.length) {
		return false;
	}

	var data = {};
	data.action = 'fetchPlaceholders';
	data.placeholders = placeholders;

	var theme = getUrlParameter('theme', top);
	if (theme){
		data.themePreview = theme;
	}

	$.ajax({
		url: '/ajax/cms-actions.php',
		data: data,
		type: 'GET', // GET needed for caching
		dataType: 'JSON',
		ifModified: true, // ifModified:true needed for caching
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			//don't alert of errors if the request was just cancelled
			if(XMLHttpRequest.status !== 0) {
				alert(jsmsgErrorUnknown);
			}
		},
		success: function (response) {
			if (response) {
				$.each(response.placeholders, function (key, placeholder) {
					if (placeholder.content) {
						var selector = '[data-content-placeholder="' + placeholder.selector + '"]';
						// some placeholders are replaced with multiple elements. So need to first remove all but 1 element with this selector.
						$(document).find(selector).filter(":gt(0)").remove();
						$(document).find(selector).replaceWith(placeholder.content);
						if(placeholder.selector === 'userNavLis' || placeholder.selector === 'registerNow'){
							initUserNav();
						}
					}
				});
				initNavs();
			}
		}
	});
}

function initNavs() {
	$(document).find('nav#mainNav > ul, nav#siteNav > div > ul').flexNav({buttonSelector: '.menuTarget', breakpoint: mobile_breakpoint});
	$(document).find('nav.dropdown:not(#mainNav) > ul, #adminTopNav').flexNav();
	// button for the addpage shows popup asking what you want to call the page
	// and then sends you there to create it.
	$('a.usimplecms_add_page').click(function (e) {
		e.preventDefault();
		var slug = prompt(jsmsgAddSubpage  + document.domain + $(this).attr('href'));
		if (slug) {
			slug = slug.replace(/[^a-zA-Z0-9]/g, '-').replace(/[\-]+/g, '-').replace(/^-*|-*$/g, '');
			
			window.top.location.href = $(this).attr('href') + encodeURIComponent(slug);
		}
	});
}

let UserNavInitialized = false;
function initUserNav() {
	if (!UserNavInitialized && typeof order_item_count !== 'undefined' && $('#orderItemCountDataBind').length) {
		UserNavInitialized = true;
		OrderItemCount = new function (count) {
			var self = this;

			self.order_item_count = ko.observable(count);

			self.isCheckout = ko.pureComputed(function () {
				return window.location.pathname === '/registration/checkout/' || window.location.pathname === '/registration/checkout.php';
			});
		}(order_item_count);
		ko.applyBindings(OrderItemCount, $('#orderItemCountDataBind')[0]);

		$(window).on('scroll', function (e) {
			if ($(this).scrollTop() > 50) {
				$('#orderItemCountDataBind').addClass('scrolling');
			} else {
				$('#orderItemCountDataBind').removeClass('scrolling');
			}
		});
	}
}


$(document).on('click', '#footerAgree', function () {
	cookie.set('agreedToCookiePolicyVersion_' + lang, _CURRENT_COOKIE_POLICY_VERSIONS[lang], 365);
	$('#footerAgreement').hide();
});

$(document).on('click', '#footerClose', function () {
	$('#footerAgreement').hide();
});

function toggleMenu(e) { //handle the narrow menu style
	var parent = $(this).closest('li');
	if (e.type.toLowerCase() !== 'click' && parent.css('display') === 'block') {
		return false;
	}
	if (parent.hasClass('hover') ||
		e.type.toLowerCase() === 'mouseleave' ||
		e.type.toLowerCase() === 'mouseout') {
		parent
			.removeClass('hover')
			.find('ul')
			.stop(true, true, false).slideUp();
	} else {
		$(this)
			.closest('ul')
			.find('li.hover')
			.removeClass('.hover')
			.find('ul')
			.stop(true, true, false)
			.slideUp();

		parent.find('ul:first').slideDown();
		parent.addClass('hover');
	}
}

/**
 * Function for setting the select options.
 *
 * @param {element} element The element that we are seting the options of
 * @param {array}   options The options that we are assigning to the element
 */
function setOptions(element, options) {
	var html = '';
	var oldValue = element.val();
	if (typeof oldValue !== 'object') {
		html += '<option value="">&mdash;</option>';
	}

	var selected;
	var count = options.length;

	for (var i = 0; i < count; ++i) {
		// check if we can keep our current id
		selected = '';
		if (typeof oldValue === 'object') {
			for (var j in oldValue) {
				if (oldValue[j] === options[i].value) {
					selected = 'selected="selected"';
				}
			}
		} else {
			if (oldValue === options[i].value) {
				selected = 'selected="selected"';
			}
		}

		html += '<option value="' + options[i].value + '" ' + selected + '>' + options[i].title + '</option>';
	}

	element.html(html);
}

jQuery.unparam = function (value) {
	var
		// Object that holds names => values.
		params = {},
		// Get query string pieces (separated by &)
		pieces = value.split('&'),
		// Temporary variables used in loop.
		pair, i, l;

	// Loop through query string pieces and assign params.
	for (i = 0, l = pieces.length; i < l; i++) {
		pair = pieces[i].split('=', 2);
		// Repeated parameters with the same name are overwritten. Parameters
		// with no value get set to boolean true.
		params[decodeURIComponent(pair[0])] = (pair.length == 2 ?
			decodeURIComponent(pair[1].replace(/\+/g, ' ')) : true);
	}

	return params;
};

if (typeof String.prototype.trim !== 'function') {
	String.prototype.trim = function () {
		return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	}
}

function setHeaderImage() {
	var headerImage = document.getElementById('headerImage');

	if (!document.body) {
		return;
	}

	var headerImageSrc = null;
	var screenWidth = window.innerWidth;
	if (typeof screenWidth === 'undefined' || screenWidth > mobile_breakpoint) {
		document.body.className = document.body.className.replace(/largeScreen|smallScreen/g, "").trim() + " largeScreen";
		$('.menuContent').removeAttr('style');
		if (headerImage) {
			headerImageSrc = headerImage.getAttribute('data-src-large');
		}
	} else if (screenWidth <= mobile_breakpoint) {
		document.body.className = document.body.className.replace(/largeScreen|smallScreen/g, "").trim() + " smallScreen";
		if (headerImage) {
			headerImageSrc = headerImage.getAttribute('data-src-small');
		}
	}
	if (headerImage && headerImageSrc && headerImage.getAttribute('src') !== headerImageSrc) {
		headerImage.src = headerImageSrc;
	}
}

$.fn.findIncludingSelf = function (selector, not) {
	return this.filter(selector).add(this.find(selector).not(not));
};

function timeDifference(date, offset) {
	var difference = Math.abs(((new Date()).getTime() + (offset || 0)) - date.getTime());

	var daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
	difference -= daysDifference * 1000 * 60 * 60 * 24

	var hoursDifference = Math.floor(difference / 1000 / 60 / 60);
	difference -= hoursDifference * 1000 * 60 * 60

	var minutesDifference = Math.floor(difference / 1000 / 60);
	difference -= minutesDifference * 1000 * 60

	var secondsDifference = Math.floor(difference / 1000);

	var response = '';
	if (daysDifference > 0) {
		response += daysDifference + ' ' + (daysDifference > 1 ? jsmsgDays : jsmsgDay) + ' ';
	}
	if (hoursDifference > 0) {
		response += hoursDifference + ':'
	}
	response += ('00'.substring(0, 2 - ("" + minutesDifference).length)) + minutesDifference + ':' + ('00'.substring(0, 2 - ("" + secondsDifference).length)) + secondsDifference;
	return response.replace(/^0/,"");
}

function timeDifferenceSimple(secondsDifference) {
	secondsDifference = Math.abs(secondsDifference);
	let daysDifference = Math.floor(secondsDifference / 60 / 60 / 24);
	secondsDifference -= daysDifference * 60 * 60 * 24

	let hoursDifference = Math.floor(secondsDifference / 60 / 60);
	secondsDifference -= hoursDifference * 60 * 60

	let minutesDifference = Math.floor(secondsDifference  / 60);
	secondsDifference -= minutesDifference * 60

	let response = [];
	if (daysDifference > 0) {
		response.push(daysDifference);
		response.push(daysDifference > 1 ? jsmsgDays : jsmsgDay);
	}
	if (hoursDifference > 0) {
		response.push(hoursDifference)
		response.push(hoursDifference > 1 ? jsmsgHours : jsmsgHour);
	}
	if (minutesDifference > 0) {
		response.push(minutesDifference)
		response.push(minutesDifference > 1 ? jsmsgMinutes : jsmsgMinute);
	}
	if(!response.length) {
		response.push(secondsDifference)
		response.push(secondsDifference > 1 ? jsmsgSeconds : jsmsgSecond);
	}

	return response.join(' ');
}

if (typeof $['filterTable'] === 'undefined') {
	$.filterTable = {};
	if (typeof $.filterTable['defaults'] === 'undefined') {
		$.filterTable.defaults = {};
	}
}
$.filterTable.defaults = {
	label: jsFilterTableLabel
};

/* Site Fields */

$(document).on('click', '.site-field-wrap .icon-add', function () {
	if (!$(this).data('bind')) {
		$(this).closest('.site-field-wrap').find('.site-field-values .site-field-value-wrap').append('<div class="m-row site-field-value">\
		<div class="m-cell-lock sevenEighth">\
		<input class="' + $(this).data('site-field-class') + '" type="text"\
	name="' + $(this).data('site-field-name') + '">\
		</div>\
		<div class="m-cell-lock oneEighth">\
		<span class="icon-delete"></span>\
		</div>\
		</div>');
	}
});

$(document).on('click', '.site-field-wrap .icon-delete', function () {
	if (!$(this).data('bind')) {
		var value = $(this).closest('.site-field-value');
		if (value.siblings().size()) {
			value.remove();
		} else {
			var input = value.find('input');
			if ((input.attr('type')) === 'file') {
				$(this).closest('#fileSection').remove();
				var name = value.find('input').attr('name');
				value.append('<input type="hidden" name="' + name + '" value="deleted">');
				input.show();
			} else {
				value.find('input').val('')
			}
		}
	}
});

function getAdminPath() {
	return '/pages/uSimpleCMSAdmin/' + encodeURIComponent(lang) + '/';
}

function displayErrors(errors) {
	clearErrors();
	for (var i in errors) {
		if (errors.hasOwnProperty(i)) {
			addError(errors[i]);
		}
	}
	$(document).scrollTop(0);
}


function clearMessages() {
	clearErrors();
	clearWarnings();
	clearSuccess();
}

function clearErrors() {
	$('.noticeMessage div.error').hide().find('ul').children().remove();
}

function clearWarnings() {
	$('.noticeMessage div.warning').hide().find('ul').children().remove();
}

function clearSuccess() {
	$('.noticeMessage ul.success').hide().children().remove();
}

function addErrors(errors) {
	for (var i in errors) {
		if (errors.hasOwnProperty(i)) {
			addError(errors[i]);
		}
	}
}

function addWarnings(errors) {
	for (var i in errors) {
		if (errors.hasOwnProperty(i)) {
			addWarning(errors[i]);
		}
	}
}

function addError(error) {
	if (error) {
		$('.noticeMessage div.error').show().find('ul').append('<li>' + error + '</li>');
	}
}

function addWarning(warning) {
	if (warning) {
		$('.noticeMessage div.error').show().find('ul').append('<li class="warningMsg">' + warning + '</li>');
	}
}

function addSuccess(success) {
	if (success) {
		$('.noticeMessage ul.success').show().append('<li>' + success + '</li>');
	}
}

cookie = {

	set: function (name, value, days) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + (days * 86400 * 1000));
			var expires = "; expires=" + date.toGMTString();
		} else {
			var expires = "";
		}
		document.cookie = name + "=" + encodeURIComponent(JSON.stringify(value)) + expires + "; path=/";
	},

	get: function (name) {
		var nameEQ = name + "=",
			ca = document.cookie.split(';');

		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1, c.length);
			}
			if (c.indexOf(nameEQ) == 0) {
				try {
					return JSON.parse(decodeURIComponent(c.substring(nameEQ.length, c.length)));
				} catch (e) {
					return null;
				}
			}
		}

		return null;
	}

};

var ObjectMap = function () {
	var keys = [], values = [];

	return {
		put: function (key, value) {
			var index = keys.indexOf(key);
			if (index === -1) {
				keys.push(key);
				values.push(value);
			} else {
				values[index] = value;
			}
		},
		get: function (key) {
			var index = keys.indexOf(key);
			if (index >= 0) {
				return values[index];
			}
		},
		values: function () {
			//clone the array to ensure it doesn't get manipulated (don't deep clone though
			return $.extend([], values);
		},
		keys: function () {
			return $.extend([], keys);
		}
	};
};
(function ($) {
	$.fn.cascadingProvince = function () {
		this.each(function () {
			if (!$(this).data('cascadingProvince') && $(this).data('country-selector')) {
				$(this).data('cascadingProvince', true);
				var provinceEl = $(this);
				var provinceInput = $('<input type="text"/>');
				provinceInput
					.attr('id', provinceEl.attr('id'))
					.attr('class', provinceEl.attr('class'))
					.attr('name', provinceEl.attr('name'))
					.attr('disabled', 'disabled')
					.hide()
					.insertAfter(provinceEl);
				$($(this).data('country-selector')).change(function () {
					if (provinceInput.is(':hidden')) {
						provinceInput.val(provinceEl.val()).removeAttr('disabled').show();
						provinceEl.attr('disabled', 'disabled').hide();
					}
					provinceEl.html('<option value=""> -- </option>');
					getCountryProvinces($(this).val(), function (response) {
						if (response.length) {
							provinceEl.html('<option value=""> -- </option>');
							var hasVal = false, backupVal = '', val = provinceInput.val();
							for (var i = 0; i < response.length; i++) {
								var option = $('<option></option>');
								option.attr('value', response[i].k);
								option.text(response[i].v);
								provinceEl.append(option);
								if (response[i].k === val) {
									hasVal = true;
								} else if (!hasVal && response[i].v.toLowerCase() === $.trim(val).toLowerCase()) {
									backupVal = response[i].k;
								}
							}
							if (hasVal) {
								provinceEl.val(val);
							} else if (backupVal) {
								provinceEl.val(backupVal);
							}
							provinceEl.removeAttr('disabled').show();
							provinceInput.attr('disabled', 'disabled').hide();
						} else {
							provinceInput.removeAttr('disabled').show();
							provinceEl.attr('disabled', 'disabled').hide();
						}
					});
				}).change();
			}
		})
	};
}(jQuery));

/**
 * Merge query strings. qs2 will overwrite any duplicate parameters in qs1.
 */
function mergeQueryStrings(qs1, qs2) {
	//get the original query string
	var qs1Obj = [];
	qs1 = qs1.replace(/^\?/, '').split('&');
	qs1 = qs1.filter(function (item) {
		return !/^filters/.test(item)
	}); //remove all filters currently in the query string (these should be added by qs2)
	qs1.forEach(function (prop) {
		prop = prop.split('=');
		if (typeof prop[0] !== 'undefined' && prop[0] !== '') {
			var newProp = {};
			newProp[prop[0]] = prop[1];
			qs1Obj.push(newProp);
		}
	});

	//get the new query string
	var qs2Obj = [];
	qs2 = qs2.replace(/^\?/, '').split('&');
	qs2.forEach(function (prop) {
		prop = prop.split('=');
		if (typeof prop[0] !== 'undefined' && prop[0] !== '') {
			var newProp = {};
			newProp[prop[0]] = prop[1];
			qs2Obj.push(newProp);
		}
	});

	//compare the 2 and remove duplicates from original
	qs1Obj = qs1Obj.filter(function (item) {
		for (var x = 0, count = qs2Obj.length; x < count; x++) {
			if (Object.keys(item)[0] == Object.keys(qs2Obj[x])[0]) {
				return false;
			}
		}
		return true;
	});

	//combine them
	var combined = '';
	qs1 = $.map(qs1Obj, function (obj) {
		return Object.keys(obj)[0] + '=' + obj[Object.keys(obj)[0]];
	}).join('&');
	qs2 = $.map(qs2Obj, function (obj) {
		return Object.keys(obj)[0] + '=' + obj[Object.keys(obj)[0]];
	}).join('&');
	if (qs2) {
		combined += qs2;
	}
	if (qs1 && qs2) {
		combined += '&'
	}
	if (qs1) {
		combined += qs1;
	}
	if (combined) {
		combined = '?' + combined;
	}

	return combined;
}

var _allCountryProvinces = {};
var getCountryProvinces = (function () {
	var ajaxCalls = {};
	return function (country, callback) {
		if (country) {
			if (typeof _allCountryProvinces[country] === 'undefined') {
				if (ajaxCalls[country]) {
					ajaxCalls[country].then(function () {
						callback(_allCountryProvinces[country]);
					});
				}
				else {
					ajaxCalls[country] = $.getJSON('/lookup/province/' + country, null, function (response) {
						_allCountryProvinces[country] = response;
						callback(_allCountryProvinces[country]);
					});
				}
			} else {
				callback(_allCountryProvinces[country]);
			}
		}
	}
})();
let getCountries = (function () {
	let ajaxCall = null, countries = null;
	return function (callback) {
		if (countries === null) {
			if (ajaxCall !== null) {
				ajaxCall.then(function () {
					callback(countries);
				});
			} else {
				ajaxCall = $.getJSON('/lookup/countries/', null, function (response) {
					countries = response;
					callback(countries);
				});
			}
		} else {
			callback(countries);
		}
	}
})();

let getSiteFieldById = (function () {
	let siteFieldsById = {},
		siteFieldIdsLoaded = {},
		siteFieldIdsToLoad = {},
		timeOut;
	return function (site_field_id, root) {

		if (siteFieldsById[site_field_id]) {
			return siteFieldsById[site_field_id];
		}

		if (typeof root.getSiteFieldById === 'function') {
			let site_field = ko.unwrap(root.getSiteFieldById(site_field_id));
			if (site_field) {
				siteFieldsById[site_field_id] = ko.observable(site_field);
				return siteFieldsById[site_field_id];
			}
		}

		if (!siteFieldsById[site_field_id]) {
			siteFieldsById[site_field_id] = ko.observable();
		}
		clearTimeout(timeOut);
		siteFieldIdsToLoad[site_field_id] = true;
		getSiteFieldByIdLoading(true);
		timeOut = setTimeout(function () {
			let site_field_id = Object.keys(siteFieldIdsToLoad).filter(function (site_field_id) {
				return !siteFieldIdsLoaded[site_field_id];
			});
			if (!site_field_id.length) {
				getSiteFieldByIdLoading(false);
				return;
			}
			let data = {
				site_field_id: site_field_id
			};
			let order = ko.unwrap(root.order);
			if (order) {
				data.order_id = ko.unwrap(order.order_id);
				data.user_id = ko.unwrap(order.user_id);
			}
			if (!data.user_id) {
				let user = ko.unwrap(root.user);
				if (user) {
					data.user_id = ko.unwrap(user.user_id);
				}
			}
			UP.Services.AjaxGetCall('/ajax/site-field-info.php', data,function (response) {
				if (response.site_field_values) {
					if (typeof root.updateSiteFieldValues === 'function') {
						root.updateSiteFieldValues(response.site_field_values);
					}
				}
				if (response.site_fields) {
					for (let site_field_id in response.site_fields) {
						siteFieldIdsLoaded[site_field_id] = true;
						if (response.site_fields.hasOwnProperty(site_field_id)) {
							setTimeout(function () {
								siteFieldsById[site_field_id](new SiteField(response.site_fields[site_field_id], root));
							});
						}
					}
				}
				setTimeout(function () {
					getSiteFieldByIdLoading(false);
				});
			});
		});
		return siteFieldsById[site_field_id];
	};
})();


var EditableContent = function () {
	var self = this;
	self.edit = ko.observable(false);
	self.initialValue = null;
	self.startEdit = function () {
		self.initialValue = ko.mapping.toJS(self);
		self.edit(true);
	};
	self.finishEdit = function () {
		self.edit(false);
	};
	self.cancelEdit = function () {
		if (ko.mapping.toJSON(self) !== JSON.stringify(self.initialValue)) {
			if(typeof self.mappingFromJS === 'function') {
				self.mappingFromJS(self.initialValue);
			} else {
				ko.mapping.fromJS(self.initialValue, self);
			}
		}
		self.initialValue = null;
		self.edit(false);
	};
};

var Address = function (options, root) {
	var self = this;
	ko.mapping.fromJS($.extend(true, {}, Address.DEFAULTS, options.data), {}, self);
	self.order = options.parent;

	self.inline_version = ko.pureComputed(function () {
		var parts = [];
		if (self.address1()) {
			parts.push(self.address1());
		}
		if (self.address2()) {
			parts.push(' ');
			parts.push(self.address2());
		}
		if (self.city()) {
			parts.push(', ');
			parts.push(self.city());
		}
		if (self.prov()) {
			parts.push(' ');
			parts.push(self.prov());
		}
		if (self.postal()) {
			parts.push(', ');
			parts.push(self.postal());
		}
		if (self.country()) {
			parts.push(', ');
			parts.push(self.country());
		}
		return parts.join('');
	});

};

Address.DEFAULTS = {
	company_name: null,
	first_name: null,
	last_name: null,
	address1: null,
	address2: null,
	city: null,
	prov: null,
	prov_code: null,
	country: null,
	country_code: null,
	postal: null,
	phone: null,
	email: null,
	cell: null,
	address_id: null
};

var AccountAddress = function (options, root) {
	var self = this;
	var mapping = {
		address: {
			create: function (options) {
				return new Address(options, root);
			}
		}
	};
	var data = $.extend(true, {}, AccountAddress.DEFAULTS, options.data);
	self.getOriginalData = function () {
		return data;
	};
	ko.mapping.fromJS(data, mapping, self);

	if (typeof EditableContent !== 'undefined') {
		EditableContent.call(self);
	}

	self.countries = ko['pureComputed'](function () {
		let _countries = ko['observableArray']([]);
		getCountries(function (response) {
			_countries(response);
		});
		return _countries;
	});

	self.twoCharCodeByThreeCharCode = ko['pureComputed'](function () {
		return self.countries()().reduce(function (acc, opt) {
			return Object.assign(acc, {
				[opt.k]: opt['2CharCode']
			});
		}, {});
	});

	self.provinces = ko['pureComputed'](function () {
		let _provinces = ko['observableArray']([]);
		let country = self.address['country_code']();
		getCountryProvinces(country, function (response) {
			_provinces(response);
		});
		return _provinces;
	});

	self.address.country_code.subscribe(function (newCode) {
		self.address.country('');
		let countries = self.countries() && self.countries()();
		countries.forEach(function (country) {
			if (ko.unwrap(country.k) === newCode) {
				self.address.country(ko.unwrap(country.v));
			}
		});
	});

	self.address.prov_code.subscribe(function (newCode) {
		self.address.prov('');
		self.provinces()().forEach(function (province) {
			if (ko.unwrap(province.k) === newCode) {
				self.address.prov(ko.unwrap(province.v));
			}
		});
	});

	self.dropdownLabel = ko.pureComputed(function () {
		var address_name = self.address_name();
		var isDefault = self.default_address() ? '(Primary) ' : '';
		return address_name ? isDefault + address_name : jsmsgSelectDifferentAddress;
	});
};

AccountAddress.DEFAULTS = {
	address_name: null,
	address: Address.DEFAULTS,
	default_address: 0
};

AccountAddress.parseErrors = function (errors, $form) {
	var keys = Object.keys(Address.DEFAULTS).concat(Object.keys(AccountAddress.DEFAULTS));
	var errorKeys = Object.keys(errors);
	keys.forEach(function (key) {
		var $input = $form.find('select[name="' + key + '"], input[name="' + key + '"]');
		$.inArray(key, errorKeys) !== -1 ? $input.addClass('error') : $input.removeClass('error');
	});
};

var User = function (options) {
	var self = this;
	self.root = options.parent;
	var mapping = {
		site_field_values: {
			create: function (options) {
				var sfvs = [];
				/** * use on /admin/user-manager.php */
				if (self.root && self.root.hasOwnProperty('getSiteFieldById')) {
					for (var id in options.data) {
						var site_field = self.root.getSiteFieldById(id);
						if (site_field) {
							sfvs.push(new SiteFieldValue(site_field, self, options.data[id]));
						}
					}
				}
				return ko.observableArray(sfvs);
			}
		}
	};
	ko.mapping.fromJS(options.data, mapping, self);
	self.userUrl = {
		href: "users/index.php?user=" + self.id()
	};
	self.emailUrl = {
		href: "mailto:" + self.email()
	};

	if (typeof self.participants === 'function' && typeof self.participants_summary === 'function') {
		self.participant_list = ko.pureComputed(function () {
			if (self.participants_summary() && self.participants() && self.participants_summary().length < self.participants().length + 3) {
				return self.participants_summary();
			}
			return self.participants();
		});
	}

	self.getAge = function (relativeToTimestamp) {
		let birthdate = self.birthdate();
		if (birthdate) {
			birthdate = moment(birthdate, 'YYYY-MM-DD');
			let now = relativeToTimestamp ? moment.unix(relativeToTimestamp) : moment();

			return now.diff(birthdate, 'years');
		}

		return null;
	}
};

var Instructor = function (data) {
	var self = this;
	var _defaults = {
		instructor_id: '',
		first_name: '',
		last_name: '',
		name: '',
		email: ''
	};
	ko.mapping.fromJS($.extend(true, {}, _defaults, data), self.mapping || {}, self);
	self.attr = {
		href: '/admin/instructor-edit.php?instructor=' + self.instructor_id()
	};
	self.errorState = ko.observable(false);
	self.firstNameError = ko['pureComputed'](function () {
		return self.errorState() && !self.first_name();
	});
	self.lastNameError = ko['pureComputed'](function () {
		return self.errorState() && !self.last_name();
	});
};

var Participant = function (options) {
	var self = this;
	self.root = options.parent;

	if(typeof options === 'object' &&
		typeof options['data'] === 'object' && options.data !== null &&
		typeof self.root === 'object' && self.root !== null &&
		typeof self.root['mutate'] === 'function') {
		self.root.mutate('participant', options.data);
	}

	self.yyyy = ko.observable();
	self.dd = ko.observable();
	self.mm = ko.observable();
	let mapping = {
		birthdate: {
			create: function (options) {
				let _obs = ko.observable(),
					_birthdate = options.data;
				let parseBd = function () {
					let yyyy = self.yyyy(),
						mm = (self.mm()||'').padStart(2, '0'),
						dd = (self.dd()||'').padStart(2, '0'),
						bdDate = [yyyy, mm, dd].join('-');
					if (moment(bdDate, 'YYYY-MM-DD', true).isValid()) {
						return bdDate;
					}
					return null
				};
				if (!_birthdate) {
					_birthdate = parseBd();
				}
				_obs(_birthdate);
				return ko['pureComputed']({
					read: function () {
						let value = _obs();
						if (!value) {
							value = parseBd();
						}
						return value;
					},
					write: function (value) {
						if (options.data) {
							_obs(value);
						}
					}
				});
			}
		},
		policies: {
			create: function (options) {
				let policies = ko['observableArray']([]);
				(Object.keys(options.data).forEach(function (club_policy_id) {
					if (self.root && typeof self.root.getClubPolicyById === 'function') {
						policies.push(new OrderClubPolicy(options.data[club_policy_id], self.root));
					}
				}));
				return policies;
			}
		},
		ignore: ['site_field_values', 'site_participant_field_values'],
		copy: ['constraints']
	};
	ko.mapping.fromJS($.extend({}, options.data, {disabled: false}), mapping, self);

	var _site_field_values = ko.observable(options.data['site_field_values'] || {});
	if (!Object.keys(_site_field_values).length && Object.keys(options.data['participant_fields'] || {}).length) {
		_site_field_values = ko.observable(options.data['participant_fields']);
	}

	self.conflicts = ko['observableArray']([]);

	self.site_field_values = (function () {
		var _cache = {};
		return ko['pureComputed'](function () {
			var values = _site_field_values(), sfvs = [];
			Object.keys(values).forEach(function (site_field_id) {
				if (self.root && self.root.hasOwnProperty('getSiteFieldById')) {
					var site_field = ko.unwrap(self.root.getSiteFieldById(site_field_id, self.root));
					if (site_field) {
						if (!_cache[site_field_id]) {
							if(typeof self.lookUp !== 'undefined') {
								var isRequired = site_field.validation.required();
								if (!isRequired) {
									if (typeof site_field._required === 'undefined') {
										site_field._required = isRequired;
										site_field._constraints = $.extend(true, {}, site_field.constraints);
									}
									if (!site_field._required) {
										if (typeof site_field.constraints.entry === 'undefined') {
											site_field.constraints.entry = {};
										}
										if (typeof site_field.constraints.entry.length === 'undefined') {
											site_field.constraints.entry.length = {};
										}
										if (typeof site_field.constraints.entry.presence === 'undefined') {
											site_field.constraints.entry.presence = {};
										}
										var isRequiredStr = jsmsgSiteFieldIsRequired.replace('%s', site_field.name());
										site_field.constraints.entry.presence.allowEmpty = ko.observable(false);
										site_field.constraints.entry.presence.message = ko.observable(isRequiredStr);
										site_field.constraints.entry.length.notValid = ko.observable(isRequiredStr);
										if (typeof site_field.constraints.values === 'undefined') {
											site_field.constraints.values = {
												length: {
													minimum: ko.observable(1),
													message: ko.observable(isRequiredStr)
												}
											}
										}
										site_field.required(true);
									}
								}
							} else if(typeof site_field._required !== 'undefined' && site_field.required()) {
								site_field.required(site_field._required);
								site_field.constraints = $.extend(true, {}, site_field._constraints);
							}
							_cache[site_field_id] = new SiteFieldValue(site_field, self, values[site_field_id]);
						}
						sfvs.push(_cache[site_field_id]);
					}
				}
			});
			sfvs.sort(function (a, b) {
				return a.site_field.sort_order() - b.site_field.sort_order();
			});
			return sfvs;
		});
	})();

	var _site_participant_field_values = options.data.site_participant_field_values || {};
	self.site_participant_field_values = (function () {
		var _cache = {};
		return ko['pureComputed'](function () {
			var values = _site_participant_field_values, spvs = [];
			Object.keys(values).forEach(function (name) {
				if (self.root && self.root.hasOwnProperty('getSiteParticipantFieldByName')) {
					var spv = self.root.getSiteParticipantFieldByName(name);
					if (spv) {
						if (!_cache[name]) {
							_cache[name] = new SiteParticipantFieldValue(spv, self, values[name]);
						}
						spvs.push(_cache[name]);
					}
				}
			});
			return spvs;
		});
	})();

	self.full_gender = ko['pureComputed'](function () {
		if (self['gender_id']) {
			let gender = (window['allGenders']||{})[self['gender_id']()];
			if (gender) {
				return gender.local_string[lang].summary
			}
		} else if (self['gender_code']) {
			let gender = (window['leagueGenders']||{})[self['gender_code']()];
			if (gender) {
				return gender['gender_name']
			}
		}
	});

	var category_level_priorities = ko.observable(null);

	self.category_level_priorities = ko.pureComputed(function () {
		var clp = category_level_priorities();
		if (clp === null) {
			UP.Services.AjaxGetCall('/participants/ajax/get-participant-info.php', {
				action: 'categoryLevelPriorities',
				participant_id: self.participant_id(),
				user_id: window.viewUser.user_id
			}, function (response) {
				if (response.error) {
					addError(response.error);
				} else {
					category_level_priorities(response.category_level_priorities);
				}
			});
			return [];
		}
		return clp
	});

	self.instructors_list = ko.pureComputed(function () {
		if (typeof self['instructors'] !== 'undefined') {
			var instructors = self.instructors();
			if (instructors.length) {
				return (instructors.map(function (instructor) {
					return instructor.name();
				})).join('<br />');
			}
		}
		return null;
	});

	if (!ko['isObservable'](self['age']) || !self['age']()) {
		self.age = ko['pureComputed'](function () {
			let dateFormat = 'D/MM/YYYY',
				dd = self.dd(),
				mm = self.mm(),
				yyyy = self.yyyy(),
				birthdate = [dd, mm, yyyy].join('/');
			if (moment(birthdate, dateFormat, true).isValid() && moment().isAfter(moment(birthdate, dateFormat, true))) {
				return  moment().diff(moment(birthdate, dateFormat, true), 'years');
			}
			return null;
		});
	}

	self.applicablePolicies = ko['pureComputed'](function () {
		return (self.policies ? self.policies() : []).filter(function (policy) {
			const club_policy = policy.club_policy();
			if (!club_policy) {
				return false;
			}
			const acceptance_by = club_policy['acceptance_by']();
			const {adminScope} = window;
			if (
				(adminScope && acceptance_by === 'user') ||
				(!adminScope && acceptance_by === 'admin')
			) {
				return false;
			}
			return club_policy.isValidForParticipant(self);
		});
	});

	self.compareValue = function (key, value) {
		var thisValue = self[key]() || '';
		var thatValue = value() || '';
		return String(thisValue).trim() === String(thatValue).trim();
	};

	self.site_field_values_list = ko.pureComputed(function () {
		return self.site_field_values().filter(function (sfv) {
			return $.inArray('list', sfv.site_field.visibility()) !== -1
		});
	});

	self.avatarFieldSet = ko.pureComputed(function () {
		var set = false;
		self.site_field_values_list().forEach(function (sfv) {
			if ($.inArray('avatar', sfv.site_field.visibility()) !== -1) {
				set = true;
			}
		});
		return set;
	});

	avatarVM = new uploadAvatarWidget(self);
	self.avatarVM = avatarVM;

	self.site_field_values_create = ko.pureComputed(function () {
		return self.site_field_values().filter(function (sfv) {
			return (typeof self.lookUp === 'undefined' && ($.inArray('create', sfv.site_field.visibility()) !== -1) || $.inArray('import', sfv.site_field.visibility()) !== -1);
		});
	});

	self.site_field_values_for_matching_popup = function (matchingModal) {
		return matchingModal.site_fields().map(function(sf) {
			return self.site_field_values().find(function(sfv) {
				return sfv.site_field.site_field_id() === sf.site_field_id();
			});
		}).filter(function (sfv) {
			return sfv;
		});
	};

	self.attr = {
		href: '/' + (window['adminScope'] ? 'admin' : 'participants') + '/participant.php?participant=' + self.participant_id()
	};

	self.addToFormData = function (form) {
		form.append('first_name', emptyIfNull(self['first_name']()));
		form.append('last_name', emptyIfNull(self['last_name']()));
		form.append('gender_id', emptyIfNull(self['gender_id']()));
		form.append('participant_dd', emptyIfNull(self.dd()));
		form.append('participant_mm', emptyIfNull(self.mm()));
		form.append('participant_yyyy', emptyIfNull(self.yyyy()));
		if (typeof self.instructor === 'function') {
			form.append('instructor', emptyIfNull(self.instructor()));
		}
		(self.site_field_values_create() || []).forEach(function (svf) {
			svf.addToFormData(form);
		});
		(self.site_participant_field_values() || []).forEach(function (svf) {
			svf.addToFormData(form);
		});
		(self.applicablePolicies() || []).forEach(function (op) {
			op.addToFormData(form);
		});
	};

	self.getSiteFieldValueBySiteFieldId = function (site_field_id) {
		return self.site_field_values().find(function (svf) {
			return svf.site_field.site_field_id() === site_field_id;
		});
	};

	self.getSiteParticipantFieldByName = function (field_name) {
		return self.site_participant_field_values().find(function (spv) {
			return spv.siteParticipantField['field_name']() === field_name;
		});
	};
	
	if(typeof self.context_id === 'undefined') {
		self.context_id = ko.pureComputed(function () {
			return self.participant_id() ? self.participant_id() : 0;
		});
	}
	self.reMapFromJS = function (data) {
		delete data.age;
		delete data.context_id;
		ko.mapping.fromJS(data, mapping, self);
		if (!self.age() && data.birthdate) {
			let dd = moment(data.birthdate).format('D'),
				mm = moment(data.birthdate).format('MM'),
				yyyy = moment(data.birthdate).format('YYYY');
			self.dd(dd);
			self.mm(mm);
			self.yyyy(yyyy);
		}
	};
};

var SiteGroup = function (options) {
	var self = this;
	ko.mapping.fromJS(options.data, {}, self);
};

var SiteField = function (data, root) {
	var self = this;
	ko.mapping.fromJS(data, {}, self);
	self.validationObject = data.validation;
	self.previousValidator = self.validator();

	let optionsLocalStringByKey = {};
	self.getOptionsLocalStringByKey = function (key) {
		if(typeof optionsLocalStringByKey[key] === 'undefined' && typeof self.validation === 'object' && self.validation.options) {
			let computedUpdateForLocalString = ko.observable(0),
				localStringObject = {
					local_string: {},
					placeholder: {}
				};
			languages.forEach(function(language) {
				localStringObject['local_string'][language] = {
					summary:
						ko.pureComputed({
							read: function () {
								computedUpdateForLocalString();
								if (typeof self.validation.optionValues[key] === 'object' && typeof self.validation.optionValues[key][language] !== 'undefined') {
									return ko.unwrap(self.validation.optionValues[key][language]);
								}
								return '';
							},
							write: function (val) {
								if (typeof self.validation.optionValues[key] === 'undefined') {
									self.validation.optionValues[key] = {};
								}
								if(val === ''){
									delete self.validation.optionValues[key][language];
								}
								else {
									if (typeof self.validation.optionValues[key][language] === 'undefined') {
										self.validation.optionValues[key][language] = ko.observable();
									}
									self.validation.optionValues[key][language](val);
								}
								computedUpdateForLocalString(computedUpdateForLocalString() + 1);
							}
						})
				};
				localStringObject['placeholder'][language] = {
					summary:
						ko.pureComputed(function () {
								computedUpdateForLocalString();
								if (typeof self.validation.optionValues[key] === 'object' && typeof self.validation.optionValues[key][language] !== 'undefined') {
									return ko.unwrap(self.validation.optionValues[key][language]);
								}
								return key;
							}
						)
				}
			});
			optionsLocalStringByKey[key] = localStringObject;
		}
		return optionsLocalStringByKey[key];
	}

	let duplicateOptionComputedByOptionText = {};
	self.hasDuplicateOptionText = function (option) {
		if(typeof duplicateOptionComputedByOptionText[option] === 'undefined') {
			duplicateOptionComputedByOptionText[option] = ko.pureComputed(function() {
				return self.duplicateOptionValues().filter(function(languageDuplicates){
					return languageDuplicates.duplicates.indexOf(self.getOptionText(option, languageDuplicates.language)()) >= 0;
				}).length > 0;
			});
		}
		return duplicateOptionComputedByOptionText[option];
	}

	self.hasErrors = ko.pureComputed(function() {
		return self.duplicateOptionValues().length > 0 ;
	})

	self.duplicateOptionValues = ko.pureComputed(function() {
		let _duplicateOptionValues = [];
		if(typeof self.validation === 'object' && self.validation.options && ko.unwrap(self.validator) === 'uplifter\\siteFields\\SelectField'){
			languages.forEach(function(language) {
				let allOptionTexts = self.validation.options().reduce(function(carry, option) {
						let optionText = self.getOptionText(option, language)();
						if(typeof carry[optionText] === 'undefined') {
							carry[optionText] = 0;
						}
						carry[optionText]++;
						return carry;
					}, {}),
					duplicateOptions = [];
				Object.keys(allOptionTexts).forEach(function(optionText) {
					if(allOptionTexts[optionText] > 1) {
						duplicateOptions.push(optionText);
					}
				});
				if(duplicateOptions.length) {
					_duplicateOptionValues.push({
						language:language,
						duplicates:duplicateOptions}
					);
				}
			});
		}
		return _duplicateOptionValues;
	});

	let optionTextsByLanguage = {};
	self.getOptionText = function(option, language) {
		if(typeof optionTextsByLanguage[language] === 'undefined') {
			optionTextsByLanguage[language] = {};
		}
		if(typeof optionTextsByLanguage[language][option] === 'undefined') {
			optionTextsByLanguage[language][option] = ko.pureComputed(function() {
				let localStringObject = self.getOptionsLocalStringByKey(option);
				let optionText = localStringObject['local_string'][language].summary();
				if(!optionText) {
					optionText = localStringObject['placeholder'][language].summary();
				}
				return optionText;
			}).extend({deferred: true});
		}
		return optionTextsByLanguage[language][option];
	}

	var tags = {
		'+': {},
		'-': {}
	};
	if (self.tags) {
		self.tags.selected().forEach(function (option) {
			var type = option.type(),
				value = option.value(),
				drop_in = ko.unwrap(option.drop_in);
			if(typeof drop_in === 'undefined' || drop_in === null || drop_in === false) {
				if (typeof tags['+'][type] === 'undefined') {
					tags['+'][type] = {};
				}
				tags['+'][type][value] = true;
			}
			if(typeof drop_in === 'undefined' || drop_in === null || drop_in === true) {
				if (typeof tags['-'][type] === 'undefined') {
					tags['-'][type] = {};
				}
				tags['-'][type][value] = true;
			}
		});
	}

	self.mode = ko.pureComputed(function() {
		var type = self.validator();

		if (type === 'uplifter\\siteFields\\SelectField' || type === 'uplifter\\siteFields\\SkateCanadaClub') {
			return 'select';
		} else if (type === 'uplifter\\siteFields\\ImageField') {
			return 'image';
		} else if (type === 'uplifter\\siteFields\\FileField') {
			return 'file';
		} else if (type === 'uplifter\\siteFields\\InstructorField') {
			return 'instructor';
		} else if (type === 'uplifter\\siteFields\\FigureSkatingProgramElementField') {
			return 'figure-skating';
		} else if (type === 'uplifter\\siteFields\\ProductRecurrence') {
			return 'product-recurrence';
		} else {
			return 'simple';
		}
	});

	self.name = ko.pureComputed(function () {
		return self.local_string[lang].summary()
	});

	self.help_text = ko.pureComputed(function () {
		return self.local_string[lang].content()
	});

	self.getValuesFor = function (orderItem) {
		if (self.deleted()) {
			return [];
		}
		if(self.invoice_from_date()) {
			let invoiceFromTime = strtotime(self.invoice_from_date()),
				invoiceTime = Math.floor(Date.now() / 1000);
			if(orderItem && orderItem.order) {
				let completed_time = orderItem.order.completed_time();
				if(completed_time) {
					invoiceTime = completed_time;
				}
			}
			if(invoiceTime < invoiceFromTime) {
				return [];
			}
		}
		let item_tags = ko.unwrap(orderItem.event_id) > 0 ? tags['-'] : tags['+'];
		if (typeof item_tags['category_level'] !== 'undefined' &&
			(
				typeof item_tags['product'] === 'undefined' ||
				typeof item_tags['product'][orderItem.product_id()] === 'undefined'
			) && (
				typeof item_tags['category'] === 'undefined' ||
				typeof item_tags['category'][orderItem.category_id()] === 'undefined'
			) &&
			typeof item_tags['category_level'][orderItem.categoryLevelId()] === 'undefined') {
			var orderItemCategoryLevelIds = orderItem.category_level_ids(),
				existsInAllItemCategoryLevels = orderItem.category_level_ids().length > 0;
			for (var i = 0; i < orderItemCategoryLevelIds.length; i++) {
				if (typeof item_tags['category_level'][orderItemCategoryLevelIds[i]] === 'undefined') {
					existsInAllItemCategoryLevels = false;
					break;
				}
			}
			if (!existsInAllItemCategoryLevels) {
				return [];
			}
			//for some reason the initial instantiation is failing despite the initial value appearing to be correct
		}
		var values = [];
		switch (ko.unwrap(self.context)) {
			case 'participant':
				orderItem.participant_ids().forEach(function (participantId) {
					if (typeof root.getParticipantById(participantId) !== "undefined") {
						values.push(root.getSiteFieldValue(self, root.getParticipantById(participantId)));
					}
				});
				break;
			case 'user':
				values.push(root.getSiteFieldValue(self, root.getUser()));
				break;
			case 'order':
				values.push(root.getSiteFieldValue(self, root.getOrder()));
				break;
			case 'order_item':
				values.push(root.getSiteFieldValue(self, orderItem));
				break;
			case 'instructor':
				if (typeof root.getUser().instructor === 'object') {
					values.push(root.getSiteFieldValue(self, root.getUser().instructor));
				}
				break;
			default:
				alert(jsmsgErrorUnknown)

		}
		return values;
	};

	self.visibility.subscribe(function (value) {
		if (self.validator() === 'uplifter\\siteFields\\SerialNumber') {
			self.validation.population_visibilities(value);
		}
	});

	self.avatarSet = ko.computed(function () {
		return self.visibility().includes("avatar");
	});

	self.contextAvatarSet = ko.pureComputed(function(){
		var allContexts = root.contexts();
		var context;
		allContexts.forEach(function (_context) {
			if (_context.value() === self.context()) {
				context = _context;
				return;
			}
		});
		return context.avatarSet();
	});

	self.getRoot = function () {
		return root;
	};

	self.elementTypes = ko['pureComputed'](function () {
		return (typeof _FIGURE_SKATING_ELEMENT_OPTIONS !== 'undefined' && _FIGURE_SKATING_ELEMENT_OPTIONS['elementTypesByDiscipline'][self.validation['discipline']()]) || [];
	});

	self.validate = function (sfv, customConstraints) {
		var values = sfv.values(), errors = [], constraints = {};
		if (customConstraints) {
			constraints = customConstraints;
		} else if(typeof self['constraints'] === 'object' && self['constraints'] !== null) {
			constraints = ko.mapping.toJS(self['constraints']) || {};
		}
		if (constraints.values) {
			var result = validate.single(values, constraints.values);
			if (result) {
				errors.push(result.pop());
			}
		}
		values.forEach(function (entry) {
			var value = entry.value() || null;
			var result = validate.single(value, constraints.entry);
			if (result) {
				errors.push(result.pop());
			}
		});
		return errors;
	};

	if (self.validator() === 'uplifter\\siteFields\\ProductRecurrence') {
		let _recurrenceValidationLastValues = {};
		let _lastRenewal;
		self.validation['renewal']['subscribe'](function (renewal) {
			if (_lastRenewal) {
				_recurrenceValidationLastValues = self.validation['validationOptions']()||[];
			}
			if (_lastRenewal !== renewal) {
				let validationOptions = _recurrenceValidationLastValues||[];
				if (!validationOptions.length) {
					let entryData = ko.mapping.toJS(self.validation['validationSample']);
					validationOptions.push(ko.mapping.fromJS(entryData));
				}
				self.validation['validationOptions'](validationOptions);
			}
			_lastRenewal = renewal;
		});
		let renewal = self.validation['renewal']();
		if (renewal) {
			_recurrenceValidationLastValues = self.validation['validationOptions']()||[];
		}
	}
	self.removeRecurrenceValidation = function (entry) {
		if (self.validator() === 'uplifter\\siteFields\\ProductRecurrence') {
			self.validation['validationOptions'].remove(entry);
			if (!self.validation['validationOptions']().length) {
				self.addRecurrenceValidation();
			}
		}
	};

	self.addRecurrenceValidation = function () {
		if (self.validator() === 'uplifter\\siteFields\\ProductRecurrence') {
			let entryData = ko.mapping.toJS(self.validation['validationSample']);
			self.validation['validationOptions'].push(ko.mapping.fromJS(entryData));
		}
	};

	self.getDateObservable  = (function () {
		let _cache = new Map();
		return function (obs, val) {
			let result = _cache.get(obs);
			if (!result) {
				result = ko.observable();
				_cache.set(obs, result);
			}
			dateLookupNow(ko.utils.unwrapObservable(val)||'', function(value) {
				result(value);
			});
			return result;
		};
	})();

	SiteField.instructors = ko.pureComputed(function () {
		var _instructors = ko.observable(false);
		if (typeof window.cachedInstructors !== 'undefined') {
			_instructors(window.cachedInstructors);
		} else {
			UP.Services.AjaxGetCall('/participants/ajax/get-participant-info.php', {action: 'instructors'}, function (response) {
				window.cachedInstructors = response.instructors.map(function (data) {
					return new Instructor(data);
				});
				_instructors(window.cachedInstructors);
			});
		}
		return _instructors;
	});

	SiteField.instructorsById = ko.pureComputed(function () {
		var instructorsById = {};
		(SiteField.instructors()() || []).forEach(function (instructor) {
			instructorsById[instructor.instructor_id()] = instructor;
		});
		return instructorsById;
	});
};

var SiteFieldValue = function (site_field, context, values) {
	var self = this;
	var JUMP_COMBINATION = 'C';
	var JUMP_SEQUENCE = 'SEQ';

	self.context = ko.observable(context);
	self.site_field = site_field;
	self.values = ko['observableArray']();
	self.error = ko.observable();
	self.registerUpdateFunction = ko.observable(null);
	self.processing = ko.observable(false);
	self.mode = ko.pureComputed(function() {
		return ko.unwrap(self.site_field).mode();
	})

	var __addValue = function (value) {
		if(value === null && self.mode() === 'product-recurrence') {
			value = self.site_field.validation.validationOptions()[0].val();
		}
		var obs = ko.observable(value);
		obs['subscribe'](function () {
			if (typeof self.registerUpdateFunction() === 'function') {
				self.registerUpdateFunction()(self);
			}
		});
		self.values.push({value: obs});
		updateFB();
	};

	self.addValue = function () {
		__addValue(null);
	};

	self.getKey = function () {
		return self.site_field.site_field_id() + ':' + self.context().context_id();
	};

	self.allowMultiples = ko.pureComputed(function () {
		var validation = self.site_field.validation;
		return validation && ko.unwrap(ko.unwrap(validation).allow_multiples) === true;
	});

	self.allowFreeForm = ko.pureComputed(function () {
		var validation = self.site_field.validation;
		return validation && ko.unwrap(ko.unwrap(validation).allow_free_form) === true;
	});
	//for selectize max items to add for a field
	self.maxSelections = ko.pureComputed(function () {
		var validation = self.site_field.validation;
		let max = ko.unwrap(ko.unwrap(validation).max);
		return max ? max : null;
	});

	self.setValues = function (values) {
		if (values !== null) {
			values = Object.keys(values).map(function (i) {
				return values[i];
			}).filter(function (val) {
				return val;
			});
			self.values([]);
			if (values.length) {
				for (var i = 0; i < values.length; i++) {
					__addValue(values[i]);
				}
			}
			if (self.values().length === 0 && (self.mode() === 'simple' || (['figure-skating', 'file', 'image', 'product-recurrence'].indexOf(self.mode()) !== -1 && !self.allowMultiples()))) {
				self.addValue();
			}
		} else {
			self.values([]);
		}
		updateFB();
	};
	self.setValues(values);

	self.values['subscribe'](function () {
		if (typeof self.registerUpdateFunction() === 'function') {
			self.registerUpdateFunction()(self);
		}
	});

	self.firstValue = ko.pureComputed(function () {
		if (self.values().length > 0) {
			let value = self.values()[0].value;
			if (self.mode() === 'product-recurrence') {
				value = self.selectOptions().find(function (option) {
					return option.id === value();
				})['name'];
			}
			return value;
		}
	});

	self.allowUpdate = (function () {
		var validator = self.site_field.validator();
		if (validator === 'uplifter\\siteFields\\SerialNumber') {
			var root = self.site_field.getRoot();
			var value = ko.unwrap(ko.unwrap(self.firstValue));
			var validation = self.site_field.validation;
			if (root.hasOwnProperty('pageController') && root.pageController() === 'uplifter\\orders\\Checkout' && value && !ko.unwrap(ko.unwrap(validation).allow_update_once_set)) {
				return false;
			}
		}
		return true;
	})();

	self.formatValue = ko.pureComputed(function () {
		var value = ko.unwrap(ko.unwrap(self.firstValue));
		var validation = self.site_field.validation;
		if (self.allowUpdate) {
			return [validation.prefix ? validation.prefix() : '', value, validation.suffix ? validation.suffix() : ''].join('');
		}
		return value;
	});

	self.selectedOptions = ko['pureComputed']({
		read: function () {
			return self.values().map(function (val) {
				return val.value();
			});
		}, write: function (values) {
			var newValues = [];
			for (var i = 0; i < values.length; i++) {
				if (values[i]) {
					newValues.push({value: ko.observable(values[i])});
				}
			}
			self.values(newValues);
		}
	});

	self.getInputClass = ko.pureComputed(function () {
		var type = self.site_field.validator();
		if (type === 'uplifter\\siteFields\\SelectField' || type === 'uplifter\\siteFields\\SkateCanadaClub') {
			return 'select-autocomplete';
		} else if (type === 'uplifter\\siteFields\\DateField') {
			return 'datePicker';
		} else {
			return '';
		}
	});

	self.getInputName = ko.pureComputed(function () {
		return 'site_field_values[' + self.site_field.site_field_id() + '][' + ko.unwrap(self.context().context_id) + '][field_value][]';
	});

	self.removeValue = function (el) {
		if (el === self) {
			el = self.values()[0];
		}
		if (self.mode() === 'image' || self.mode() === 'file') {
			var newValue = 'deleted';
			self.values()[0].value(newValue);
			if(self.inputEl) {
				self.inputEl.value = self.inputEl.defaultValue;
			}
		} else {
			self.values.remove(el);
			if (self.values().length === 0 && self.mode() === 'simple') {
				self.addValue();
			}
		}
	};

	self.selectizePlaceholder = function () {
		if(self.allowFreeForm()) {
			return 'Add or Select';
		}
		return ' -- ';
	}

	self.optionsMaxItems = ko.pureComputed(function () {
		return self.allowMultiples() || self.values().length > 1 ? self.maxSelections() : 1
	});
	self.optionsCreate = function(input) {
		if(self.allowFreeForm()){
			if(typeof input !== 'undefined'){
				self.setValues([input]);
			}
			return  {id: input, name: input};
		}
		return null;
	}

	self.onItemAdd = function () {
		if(self.allowMultiples() && (self.allowMultiples() || self.values().length > 1)){
			updateFB();
			$('*:focus').blur();
		}
	}

	self.getOptionValues = function(values) {
		let optVals = [];
		if(values){
			values.forEach(function(value){
				optVals.push(self.getOptionValue(value));
			});
		}
		return optVals;
	}

	self.getOptionValue = function(value) {
		if (typeof value === 'function') {
			value = value();
		} else if (typeof value === 'undefined') {
			return null;
		}
		let siteField = ko.unwrap(self.site_field);
		if (ko.unwrap(siteField.validator) === 'uplifter\\siteFields\\SelectField') {
			let optionValues = siteField.validationObject.optionValues;
			if (!optionValues[value]) {
				let checkIfFreeform = value.split('|');
				if (checkIfFreeform[0] === 'FREEFORM') {
					return checkIfFreeform[1];
				} else {
					return value;
				}
			} else if (optionValues[value][lang]) {
				return optionValues[value][lang];
			}
		}
		return value;
	}

	self.selectOptions = ko.pureComputed(function () {
		var validation = ko.unwrap(self.site_field).validationObject;
		if (validation) {
			let mode = self.mode();
			if (mode === 'select') {
				let _options = validation.options;
				if (typeof _options !== 'undefined') {
					self.values().forEach(function (entry) {
						var value = entry.value();
						if (value && _options.indexOf(value) === -1) {
							_options.push(value);
						}
					});
					let _selectOptions = [];
					_options.forEach(function (key, index) {
						var _optObj = {};
						_optObj['id'] = index;
						_optObj['name'] = key;
						_optObj['text'] = self.getOptionValue(key);
						_selectOptions.push(_optObj)
					});
					return _selectOptions;
				}
			} else if (mode === 'instructor') {
				return SiteField.instructors()();
			} else if (mode === 'product-recurrence') {
				let _selectOptions = [];
				self.site_field.validation.validationOptions().forEach(function (entry) {
					let _optObj = {};
					_optObj['id'] = entry.val();
					_optObj['name'] = entry.label();
					_selectOptions.push(_optObj)
				});
				return _selectOptions;
			}
		}
		return false;
	});

	self.displaySFV = ko['pureComputed'](function () {
		let validation = self.site_field.validation,
			mode = self.mode();
		return mode !== 'product-recurrence' || (validation && validation['renewal']() !== 'never' && validation['renewal']() !== 'program_end');
	});

	self.getFileName = function (value) {
		return value && value._file_name;
	};

	self.getFileSrc = function (value) {
		if (value) {
			if(typeof value['_file_content_url'] === 'undefined') {
				if (value._file_content) {
					if (self.mode() === 'image') {
						value._file_content_url = 'data:image/' + value._file_type + ';base64,' + value._file_content;
					} else {
						value._file_content_url = 'data:application/octet-stream;base64,' + value._file_content;
					}
				} else if (value.order_id) {
					value._file_content_url = '/restricted/orders/' + value.order_id + '/' + value.site_field_id + '/' + value.context_id + '/' + value._file_name;
				} else {
					value._file_content_url = '/restricted/values/' + ko.unwrap(value.site_field_id) + '/' + ko.unwrap(value.context_id) + '/' + ko.unwrap(value._file_name);
				}
			}
			return value._file_content_url;
		}
		return null;
	};

	self.getThumbnailSrc = function (value) {
		return self.getFileSrc(value);
	};

	self.isForOrderItem = function (context, completed_time) {
		let ctx = self.context(), site_field = self.site_field;
		if(site_field.context() === 'order_item' && context.context_id() === ctx.context_id()) {
			let mode = self.mode();
			if(mode === 'instructor') {
				return typeof ctx.apply_to === 'function' && ctx.apply_to() === 'participant';
			} else if (mode === 'product-recurrence') {
				return !site_field.product_id() || !completed_time || !ctx.order_item_id();
			} else {
				return true;
			}
		}
		return false;
	};

	self.inputEl = null;

	self.selectFile = function (el) {
		self.inputEl = el;
		if (typeof FileReader === 'undefined') {
			alert(jsmsgBrowserOutOfDate);
			return;
		}
		if (el.files.length) {
			var file = el.files[0];
			var reader = new FileReader();
			reader.onload = function (e) {
				var newValue = {
					_file_content_url: reader.result,
					_file_name: file.name,
					_file: file
				};
				if (self.values().length) {
					self.values()[0].value(newValue);
				} else {
					self.values.push({value: ko.observable(newValue)});
				}
				//el.value = el.defaultValue;
			};
			if (file.size <= 5242880 || (typeof LARGE_FILE_UPLOAD !== 'undefined' && file.size <= 15728640) || self.site_field().getRoot() && self.site_field().getRoot().constructor && self.site_field().getRoot().constructor.name !== 'Checkout') {
				reader.readAsDataURL(file);
			} else {
				el.value = el.defaultValue;
				if (typeof LARGE_FILE_UPLOAD !== 'undefined') {
					alert(jsmsgFileTooLarge15M);
				} else {
					alert(jsmsgFileTooLarge5M);
				}
			}
		}
	};

	self.addToFormData = function (formData) {
		var values = self.values(),
			mode = self.mode();
		if (values.length) {
			for (var i = 0; i < values.length; i++) {
				var value = values[i].value();
				if (['image', 'file'].indexOf(mode) !== -1) {
					if (value) {
						if (value._file) {
							formData.append(self.getInputName(), value._file);
						} else if (value === 'deleted') {
							formData.append(self.getInputName(), [value]);
						}
					}
				} else {
					formData.append(self.getInputName(), emptyIfNull(value));
				}
			}
		} else {
			if (['select', 'instructor', 'product-recurrence'].indexOf(mode) !== -1) {
				formData.append(self.getInputName(), []);
			}
		}
	};

	self.visibilityWarning = ko['pureComputed'](function () {
		var visibilityWarning = null;
		if ($.inArray('view', self.site_field.visibility()) === -1 && $.inArray('edit', self.site_field.visibility()) === -1 && $.inArray('list_public', self.site_field.visibility()) === -1) {
			visibilityWarning = 'none';
		} else if ($.inArray('edit', self.site_field.visibility()) === -1) {
			visibilityWarning = 'view';
		}
		return visibilityWarning;
	});

	self.isShared = ko.pureComputed(function() {
		let site_field = self.site_field;
		if(site_field.context() === 'order_item') {
			let ctx = self.context();
			if(typeof ctx === 'object' && (typeof ctx.generated_order_item_id !== 'undefined' || typeof ctx.generated_from_order_item_id !== 'undefined')) {
				return ko.unwrap(ctx.generated_order_item_id) || ko.unwrap(ctx.generated_from_order_item_id);
			}
		}
		return false;
	});

	self.compareValue = function (values) {
		var mode = self.mode();
		if (mode === 'image' || mode === 'file') {
			return false;
		}
		var thisValues = [];
		self.values().forEach(function (obs) {
			thisValues.push(String(obs.value()));
		});
		var thatValues = [];
		values.forEach(function (obs) {
			thatValues.push(String(obs.value()));
		});
		return (!_.difference(thisValues, thatValues).length && !_.difference(thatValues, thisValues).length);
	};

	self.getError = ko.pureComputed(function () {
		var errorsByKey = (self.site_field.getRoot() && typeof self.site_field.getRoot().errorsByKey === 'function') ? self.site_field.getRoot().errorsByKey() : null;
		if (errorsByKey && errorsByKey[self.getKey()]) {
			return errorsByKey[self.getKey()];
		}
		return null;
	});

	self.allowInstructorCreation = ko.pureComputed(function () {
		return (self.mode() === 'instructor' && self.site_field.validation.allow_instructor_creation());
	});

	self.getInstructorName = function (jsonString) {
		if (jsonString && self.mode() === 'instructor') {
			var data = JSON.parse(ko.unwrap(jsonString));

			if (typeof data.instructor_id !== 'undefined' && SiteField.instructorsById()[data.instructor_id]) {
				var instructor = SiteField.instructorsById()[data.instructor_id];
				return instructor.name() + (instructor.email() ? ' (' + instructor.email() + ')' : '');
			} else if (typeof data.email !== 'undefined' && typeof data.first_name !== 'undefined' && typeof data.last_name !== 'undefined' && typeof data.name !== 'undefined') {
				return data.name + ' (' + data.email + ')';
			}
		}
		return null;
	};

	self.instructor = ko.observable();
	self.clearInstructor = function(instructor) {
		self.instructor(null);
	}
	self.createInstructor = function(instructor) {
		createInstructor(instructor, true);
	}
	let createInstructor = function (instructor, save) {
		var values = [];
		instructor.errorState((!instructor.first_name() || !instructor.last_name()));
		if (instructor.errorState()) {
			return;
		}
		if(save) {
			var newValue = JSON.stringify({
				email: instructor.email(),
				first_name: instructor.first_name(),
				last_name: instructor.last_name(),
				name: [instructor.first_name(), instructor.last_name()].join(' ')
			});
			if (!self.allowMultiples()) {
				values = [newValue];
			} else {
				self.values().forEach(function (entry) {
					values.push(entry.value());
				});
				if (values.indexOf(newValue) === -1) {
					values.push(newValue);
				}
			}
			self.instructor(null);
			self.setValues(values);
		}
	};

	self.validate = function (customConstraints, validateWithoutSave) {
		var errors = [], mode = self.mode(), instructor = self.instructor(), ctx = self.context(), constraints = null, result = null;
		if (mode === 'instructor' && instructor) {
			createInstructor(instructor, !validateWithoutSave);
			if (instructor.errorState()) {
				errors = [ko.unwrap(self.site_field['constraints']['message'])];
			}
		} else {
			errors = self.site_field.validate(self, customConstraints);
		}
		if (mode === 'figure-skating') {
			var elementSelectors = self.elementSelectors(), incomplete = false;
			for (var j = 0; j < elementSelectors.length; j++) {
				if (elementSelectors[j].valueError() || elementSelectors[j].revolutionsError()) {
					incomplete = true;
					break;
				}
			}
			if (!errors.length && incomplete) {
				constraints = ko.mapping.toJS(self.site_field['constraints']);
				errors = [constraints['skating'].message];
			}
		} else if (['file', 'image'].indexOf(mode) !== -1) {
			var value = self.values()[0] && self.values()[0].value();
			if (value && value !== 'deleted' && !errors.length) {
				constraints = ko.mapping.toJS(self.site_field['constraints']);
				var ext = value['_file_name'].split('.').pop();
				result = validate.single(("" + ext).toLowerCase(), constraints.format);
				if (result) {
					errors = result;
				}
				if (!errors.length && value['_file']) {
					var size = value['_file']['size'];
					result = validate.single(size, constraints.size);
					if (result) {
						errors = result;
					}
				}
			}
		}
		return errors;
	};

	self.acceptedTypes = function () {
		if (['file', 'image'].indexOf(self.mode()) !== -1) {
			var sf =  self.site_field;
			if(sf && sf.constraints && sf.constraints.format && sf.constraints.format.inclusion, sf.constraints.format.inclusion.within) {
				var within = ko.unwrap(sf.constraints.format.inclusion.within);
				if(within.length) {
					return "." + within.join(",.");
				}
			}
		}
		return "";
	};

	self.errorState = ko['pureComputed'](function () {
		return (self.validate(null, true).length !== 0);
	});

	self.getValues = function () {
		return self.values().map(function (entry) {
			return entry.value();
		}).sort().filter(function (val) {
			return emptyIfNull(val);
		});
	};

	/** Figure Skating related stuff */

	var ElementSelector = function (data) {
		var self = this;
		self.required = ko.observable(data.required);
		self.value = ko.observable();
		self.revolutions = ko.observable();
		self.elementType = ko.observable(data.elementType);
		self.options = ko['observableArray'](data.options);
		self.revOptions = ko['pureComputed'](function () {
			var value = self.value(), revOptions = false;
			if (value) {
				revOptions = _FIGURE_SKATING_ELEMENT_OPTIONS['revOptions'][value] || false;
			}
			if (revOptions === false) {
				self.revolutions(null);
			}
			return revOptions;
		});
		self.valueError = ko['pureComputed'](function () {
			return (self.elementType() && self.required() && !self.value())
		});
		self.revolutionsError = ko['pureComputed'](function () {
			return (self.elementType() && ((self.value() && self.required()) || self.value() && !self.required()) && self.revOptions() !== false && !self.revolutions())
		});
	};
	self.elementType = ko.observable();
	var _elementSelectors = {};
	var _oldElementType = null;
	self.elementSelectors = ko['pureComputed'](function () {
		var options = [];
		var elementType = self.elementType();
		if (elementType) {
			var elementOptions = _FIGURE_SKATING_ELEMENT_OPTIONS['optionsByElementType'][elementType] || [];
			for (var i = 0, len = elementOptions.length; i < len; i++) {
				if (!_elementSelectors[i]) {
					_elementSelectors[i] = new ElementSelector({
						elementType: elementType,
						required: (i <= 1),
						options: _FIGURE_SKATING_ELEMENT_OPTIONS['elementsByElementType'][elementOptions[i]] || []
					});
				}
				if (_oldElementType !== elementType) {
					_elementSelectors[i].value(null);
					_elementSelectors[i].options(_FIGURE_SKATING_ELEMENT_OPTIONS['elementsByElementType'][elementOptions[i]] || []);
					_elementSelectors[i].revolutions(null);
					_elementSelectors[i].elementType(elementType);
				}
				if (_elementSelectors[i].options().length === 1) {
					_elementSelectors[i].value(_elementSelectors[i].options()[0].k);
				}
				options.push(_elementSelectors[i]);
			}
			_oldElementType = elementType;
		}
		return options;
	});
	var _initialValue = ko.unwrap(self.firstValue());
	self.updateInitialValue = function (value) {
		if (self.mode() === 'figure-skating') {
			_initialValue = ko.unwrap(value);
		}
	};

	ko.computed(function () {
		var mode = self.mode();
		var elType = self.elementType();
		if (mode === 'instructor') {
			self.values().forEach(function (entry) {
				if (self.site_field.validation['allow_instructor_creation']()) {
					var value = entry.value();
					if (value) {
						var decode = JSON.parse(value);
						if (decode.email) {
							window.instructorSiteFieldLookup[decode.email] = value;
						}
					}
				}
			});
		} else if (mode === 'figure-skating') {
			function parseInitialValue(parts, isCombination, discipline) {
				var possibleOptions = {};
				for (var type in _FIGURE_SKATING_ELEMENT_OPTIONS['elementTypesByDiscipline'][discipline]) {
					var elementType = _FIGURE_SKATING_ELEMENT_OPTIONS['elementTypesByDiscipline'][discipline][type].k;
					if (
						_FIGURE_SKATING_ELEMENT_OPTIONS['optionsByElementType'].hasOwnProperty(elementType) &&
						_FIGURE_SKATING_ELEMENT_OPTIONS['optionsByElementType'][elementType].length >= parts.length
					) {
						possibleOptions[elementType] = _FIGURE_SKATING_ELEMENT_OPTIONS['optionsByElementType'][elementType];
					}
				}

				var elementType = null;
				for (var option in possibleOptions) {
					if (possibleOptions.hasOwnProperty(option)) {
						var isValidOption = true;
						for (var i = 0; i < possibleOptions[option].length; i++) {
							var elements = _FIGURE_SKATING_ELEMENT_OPTIONS['elementsByElementType'][possibleOptions[option][i]].map(function (element) {
								return element.k;
							});
							var val = parts[i];
							if (isCombination && isCombination !== option) {
								isValidOption = false;
								elementType = isCombination;
								break;
							}
							if (typeof val !== 'undefined' && _FIGURE_SKATING_ELEMENT_OPTIONS['revOptions'][val.slice(1)]) {
								val = val.slice(1);
							}
							if (elements.indexOf(val) === -1) {
								isValidOption = false;
								break;
							}
						}
						if (isValidOption) {
							elementType = option;
							break;
						}
					}
				}
				if (elementType !== null) {
					self.elementType(elementType);
					self.elementSelectors().forEach(function (selector, index) {
						if (parts[index]) {
							if (_FIGURE_SKATING_ELEMENT_OPTIONS['revOptions'][parts[index].slice(1)]) {
								selector.value(parts[index].slice(1));
								selector.revolutions(parseInt(parts[index]));
							} else {
								selector.value(parts[index]);
							}
						}
					});
					_initialValue = null;
				}
			}

			if (_initialValue) {
				parseInitialValue([_initialValue], false, self.site_field.validation['discipline']());
			}
			if (_initialValue) {
				var suffix = (_initialValue.split('+')).pop();
				var parts = _initialValue.split('+');
				if (suffix === JUMP_COMBINATION) {
					parts.pop();
					parseInitialValue(parts, JUMP_COMBINATION, self.site_field.validation['discipline']() );
				} else if (suffix === JUMP_SEQUENCE) {
					parts.pop();
					parseInitialValue(parts, JUMP_SEQUENCE, self.site_field.validation['discipline']());
				} else {
					parseInitialValue(parts, false, self.site_field.validation['discipline']());
				}
			}
			/** If we got here and _initialValue is not null something is wrong :(, let set it to null to avoid falling in all the code above  */
			if (_initialValue) {
				_initialValue = null;
			}
			var stringValues = [], elementType = self.elementType(), selectors = self.elementSelectors();
			selectors.forEach(function (selector) {
				var value = selector.value(), revolutions = selector.revolutions(), revOptions = selector.revOptions();
				if (value && ((revOptions !== false && revolutions) || (revOptions === false && !revolutions))) {
					stringValues.push([revOptions !== false ? revolutions : '', value].join(''));
				}
			});
			if ((stringValues.length === selectors.length || (selectors.length === 3 && stringValues.length === 2)) && [JUMP_COMBINATION, JUMP_SEQUENCE].indexOf(elementType) !== -1) {
				stringValues.push(elementType);
			}
			self.setValues([stringValues.join('+')]);
		}
	});
	self.isReadOnly = ko.pureComputed(function () {
		let site_field = self.site_field,
			context = self.context();
		return site_field &&
			site_field.league_participant_field &&
			ko.unwrap(site_field.league_participant_field.number_field) &&
				context &&
				context.constructor.name === 'Participant' &&
				ko.unwrap(context.league_participant_id);
	});
};

var MatchingParticipantsModal = function () {
	var self = this;
	var root = null;
	self.errors = ko['observableArray']([]);
	self.warnings = ko['observableArray']([]);
	self.createNewValues = ko.observable(null);
	self.matches = ko['observableArray']([]);
	self.findParticipant = ko.observable(false);
	self.site_fields = ko['pureComputed'](function () {
		var site_fields = [], participant = self.createNewValues();
		if (participant) {
			participant.site_field_values().forEach(function (sfv) {
				if (_.intersection(['create', 'edit', 'import', 'view'], sfv.site_field.visibility()).length) {
					site_fields.push(sfv.site_field);
				}
			});
		}
		return site_fields;
	});
	self.site_participant_fields = ko['pureComputed'](function () {
		var site_participant_fields = [], participant = self.createNewValues();
		if (participant) {
			participant.site_participant_field_values().forEach(function (spv) {
				site_participant_fields.push(spv.siteParticipantField);
			});
		}
		return site_participant_fields;
	});
	self.selected_participant_id = ko.observable();
	self.selectMatchingParticipant = function (val) {
		if (typeof val['participant_id'] === 'function') {
			self.selected_participant_id(val.participant_id());
		} else {
			self.selected_participant_id('createNew');
		}
	};
	self.setMatchingParticipantCallback = ko.observable(null);
	self.setMatchingParticipant = function () {
		var callback = self.setMatchingParticipantCallback();
		if (typeof callback === 'function') {
			callback(self.selected_participant_id());
		}
	};

	self.cancelCallback = ko.observable(null);
	self.cancel = function () {
		var callback = self.cancelCallback();
		if (typeof callback === 'function') {
			callback();
		}
	};

	self.isAdminScope = ko.observable(adminScope);
	self.setRoot = function (val) {
		root = val;
	};

	self.getSFV = function (siteFieldValue) {
		var site_field_id = null;
		if (siteFieldValue['site_field'] instanceof SiteField) {
			site_field_id = siteFieldValue.site_field.site_field_id();
		} else {
			site_field_id = siteFieldValue.site_field_id();
		}
		var createNewValues = self.createNewValues();
		if (createNewValues) {
			return createNewValues.site_field_values().find(function (sfv) {
				return site_field_id === sfv.site_field.site_field_id();
			});
		}
		return null;
	};

	self.getSiteFieldValuesData = function (siteFieldValue) {
		var sfv = self.getSFV(siteFieldValue);
		return sfv ? sfv.values() : [];
	};

	self.getSPFV = function (siteParticipantFieldValue) {
		var createNewValues = self.createNewValues();
		if (createNewValues) {
			return createNewValues.site_participant_field_values().find(function (spfv) {
				return siteParticipantFieldValue.siteParticipantField.field_name() === spfv.siteParticipantField.field_name();
			});
		}
		return null;
	};

	self.getSiteParticipantFieldData = function (spfv) {
		var sfv = self.getSPFV(spfv);
		return sfv ? sfv.value() : '';
	};

	self.getSiteFieldClassName = function (site_field) {
		if (site_field['site_field'] instanceof SiteField) {
			site_field = site_field.site_field;
		}
		var ret = {};
		ret['site-field-' + ko.unwrap(site_field.site_field_id)] = true;
		return ret;
	};

	self.createNewOption = ko['pureComputed'](function () {
		var createNewValues = self.createNewValues();
		if (createNewValues && self.selected_participant_id() === 'createNew') {
			return createNewValues;
		}
		return null;
	});
	self.open = function () {
		self.selected_participant_id(null);
		self.errors([]);
		showModal({
			template: 'matchParticipantTemp',
			viewModel: self,
			maxWidth: (window.innerWidth - 20) + 'px',
			minWidth: null
		});
	};
};

var SiteParticipantField = function (options) {
	var self = this;
	ko.mapping.fromJS(options.data, {}, self);
};

var SiteParticipantFieldValue = function (siteParticipantField, participant, values) {
	var self = this;
	self.siteParticipantField = siteParticipantField;
	self.participant = participant;

	self.icon = ko.observable(values.icon || null);
	self.value = ko.observable(values.value || null);
	self.skateCanadaContactId = ko.observable(values.skateCanadaContactId || null);
	self.season_name = ko.observable(values.season_name || null);
	self.registered_club = ko.observable(values.registered_club || null);
	self.expiry_date = ko.observable(values.expiry_date || null);
	self.registered_section = ko.observable(values.registered_section || null);
	self.compareValue = function (val) {
		return ('' + self.value()).trim() === ('' + val).trim();
	};
	self.addToFormData = function (formData) {
		formData.append(self.siteParticipantField['field_name'](), emptyIfNull(self.value()));
	}
};

function generateContextId(length) {
	if (typeof window['___GENERATED_CONTEXT_IDS'] === 'undefined') {
		window.___GENERATED_CONTEXT_IDS = {}
	}
	var mask = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	do {
		var result = '';
		for (var i = length; i > 0; --i) {
			result += mask[Math.floor(Math.random() * mask.length)];
		}
	} while (typeof window.___GENERATED_CONTEXT_IDS[result] !== 'undefined');
	window.___GENERATED_CONTEXT_IDS[result] = true;
	return result;
}

function getPolicyTagIndex (tag, site_field_id, format) {
	tag = ko.unwrap(tag);
	site_field_id = ko.unwrap(site_field_id);
	format = ko.unwrap(format);
	return [ko.unwrap(tag), ko.unwrap(site_field_id), ko.unwrap(format)].filter(function (entry) {
		return entry;
	}).join(site_field_id ? ':' : format ? '|' : '');
}

var OrderClubPolicy = function (
	data,
	root,
	participant
) {
	const ageRangeKeys = ['participant_min', 'participant_max', 'member_min', 'member_max']
	let self = this;
	let mapping = {
		accepted_club_policy : {
			create: function (options) {
				return ko.observable(options.data);
			}
		},
		copy: ['acceptance_data', 'hasAcceptanceData'],
		include: ['getPostData']
	};
	let _initialAcceptanceValues = {},
		_siteFieldsById = {};
	ko.mapping.fromJS(Object.assign({}, {deleted: 0, context_id: generateContextId(5), original_accepted: null, accepted_club_policy:  null}, data), mapping, self);

	let accepted_club_policy = self['accepted_club_policy']();
	if (accepted_club_policy) {
		self.accepted(accepted_club_policy.accepted);
		self['viewed'](accepted_club_policy['viewed']);
		self.acknowledged_by(accepted_club_policy['acknowledged_by']);
		self.acknowledged_age_of_majority(accepted_club_policy['acknowledged_age_of_majority']);
		self.digital_signature(accepted_club_policy['digital_signature']);
		if (accepted_club_policy.acceptance_data) {
			self.acceptance_data = accepted_club_policy.acceptance_data;
		}
	}
	self.errorsByKey = ko.observable({});
	self.hasErrors = ko['pureComputed'](function () {
		return Object.keys(self.errorsByKey()||{}).length;
	});
	self.hasScrollDown = ko.observable(true);
	let _opening = false;
	let _initialValues = ko.observable();
	self.afterShow = function () {
		_opening = false;
		if (typeof _initialValues() === 'undefined') {
			let fieldsData = [];
			self.policyFields().forEach(function (policyField) {
				fieldsData.push(policyField.getFormData());
			});
			_initialValues(JSON.stringify(fieldsData));
		}
		if(!window['adminScope'] || self.club_policy().acceptance_by() !== 'user') {
			self.viewed(1);
		}
		if (self.accepted()) {
			return;
		}
		if (window['policyMandatoryScroll'] || self.displaySetting() || self.displayTransferEmail()) {
			let $modalBody = $(self.modal.BSModal._dialog).find('.modal-body');
			let innerHeight_B = parseInt($modalBody.innerHeight()),
				scrollTop_B = parseInt($modalBody['scrollTop']()),
				scrollHeight_B = parseInt($modalBody[0].scrollHeight);
			const SCROLL_ERROR_TOLERANCE = 5;

			if (scrollHeight_B === innerHeight_B || Math.abs(scrollHeight_B - innerHeight_B) <= SCROLL_ERROR_TOLERANCE) {
				return;
			}
			self.hasScrollDown(false);
			let checkScroll = function () {
				innerHeight_B = parseInt($modalBody.innerHeight());
				scrollTop_B = parseInt($modalBody['scrollTop']());
				scrollHeight_B = parseInt($modalBody[0].scrollHeight);
				if (scrollTop_B + innerHeight_B >= scrollHeight_B || Math.abs((scrollTop_B + innerHeight_B) - scrollHeight_B) <= SCROLL_ERROR_TOLERANCE) {
					self.hasScrollDown(true);
					$modalBody[0].removeEventListener('scroll', checkScroll);
				}
			};
			$modalBody[0].addEventListener('scroll', checkScroll);
		}
	};

	self.digitalSignature = ko.observable();
	if (self.digital_signature()) {
		self.digitalSignature(self.digital_signature());
	}
	self.acknowledgedBy = ko.observable();
	if (self.acknowledged_by()) {
		self.acknowledgedBy(1);
	}
	self.acknowledgedAgeOfMajority = ko.observable();
	if (self.acknowledged_age_of_majority()) {
		self.acknowledgedAgeOfMajority(1);
	}
	if (!self.club_policy) {
		self.club_policy = ko['pureComputed'](function () {
			let clubPolicy = null, club_policy_id = self.club_policy_id();
			if (typeof root['getClubPolicyById'] === 'function' && root['getClubPolicyById'](club_policy_id)) {
				clubPolicy = root['getClubPolicyById'](club_policy_id);
			}
			return clubPolicy;
		});
	}

	self.replacement_club_policy = ko['pureComputed'](function () {
		let clubPolicy = null;
		if (typeof root['getClubPolicyById'] === 'function') {
			clubPolicy = root['getClubPolicyById'](self.replacement_club_policy_id());
		}
		return clubPolicy;
	});

	self.replacementPolicyType = ko.pureComputed(function () {
		let replacement_club_policy = self.replacement_club_policy();
		if (replacement_club_policy) {
			let typeLang = self.viewed_lang() || window.lang;
			return replacement_club_policy.club_policy_type_description[typeLang].summary();
		}
		return '';
	});

	self.invoiceNumber = ko.pureComputed(function () {
		let order_id = self.order_id();
		if (order_id) {
			return ('' + order_id).padStart(8, '0');
		}
	});

	self.user_payment_token_id = (function () {
		let original_user_payment_token_id = self.user_payment_token_id();
		let user_payment_token_id = ko.observable(null);
		if (original_user_payment_token_id) {
			user_payment_token_id(original_user_payment_token_id);
		} else if (self.accepted_club_policy() && self.accepted_club_policy().user_payment_token_id) {
			user_payment_token_id(self.accepted_club_policy().user_payment_token_id);
		}
		return user_payment_token_id;
	})();

	self.user_payment_token = ko.pureComputed(function () {
		let user_payment_token_id = self.user_payment_token_id();
		if (user_payment_token_id && root && root.userPaymentTokens) {
			return root.userPaymentTokens().find(function (user_payment_token) {
				return -user_payment_token.user_payment_token_id() === -user_payment_token_id;
			});
		}
		return null;
	});


	self.participant = ko.pureComputed(function () {
		if (participant !== undefined) return participant;

		const participantId = self.participant_id();
		const getParticipantById = root.getParticipantById;

		if (data.participant) {
			participant = new Participant({ data: data.participant, parent: root });
		} else if (participantId && typeof getParticipantById === 'function') {
			participant = getParticipantById(participantId) || null;
		} else if (root.participant) {
			participant = ko.unwrap(root.participant) || null;
		} else {
			participant = null;
		}

		return participant;
	});

	self.user = ko.pureComputed(function () {
		if (data.user) {
			return new User({data: data.user, parent: root});
		}
		if (root) {
			if (root.user) {
				return ko.unwrap(root.user);
			}
			if (ko.isObservable(root.order) && root.order().user) {
				return root.order().user;
			}
		}
		if (window['viewUser']) {
			return new User({data: window['viewUser'], parent: root  })
		}
		return null;
	});
	self.address = ko.pureComputed(function () {
		let user = self.user();
		if (user && user.address) {
			return user.address;
		}
		return null;
	});

	self.accepted_order_id = ko.pureComputed(function () {
		let accepted_club_policy = self.accepted_club_policy();
		if (accepted_club_policy && ko.isObservable(root.order)) {
			let order = root.order();
			if (order && accepted_club_policy) {
				let order_id = ko.unwrap(order.order_id);
				if (accepted_club_policy.order_id !== order_id) {
					return accepted_club_policy.order_id
				}
			}
		}
	});
	self.accepted_order_number = ko.pureComputed(function () {
		let order_id = self.accepted_order_id();
		if (order_id) {
			return ('' + order_id).padStart(8, '0');
		}
	});
	self.previousAcceptedVersion = ko.observable();
	self.previous_accepted_version_order_number = ko.pureComputed(function () {
		let previousAcceptedVersion = self.previousAcceptedVersion(),
			order = ko.unwrap(root.order);
		if (previousAcceptedVersion && order) {
			let order_id = ko.unwrap(previousAcceptedVersion.order_id);
			if (order_id && order.order_id() && order_id !== order.order_id()) {
				return ('' + order_id).padStart(8, '0');
			}
		}
	});
	self.reloadCheckout = function (msg) {
		if (typeof window.updateCheckout === 'function') {
			self.afterClose = function () {
				setTimeout(function () {
					let callback = function () {
						window.location.reload();
					};
					openConfirm(msg, callback, callback);
				});
			};
			$.fancybox.close();
		}
	};
	self.allowPreview = ko.pureComputed(function () {
		return self.constructor.name === 'OrderClubPolicyPreview';
	});

	self.showFontOptions =  ko.pureComputed(function () {
		let policyFields = self.policyFields();
		for (let i = 0, len = policyFields.length; i < len; i++) {
			if (['signature', 'digital_signature', 'initials'].indexOf(policyFields[i].tag()) !== -1) {
				return true;
			}
		}
		return false;
	});
	self.showFontSelect = ko.observable(false);
	self.toggleFontSelect = function() {
		if (self.showSettings) {
			self.showSettings(false);
		}
		self.showFontSelect(!self.showFontSelect());
	};
	self.policyFontOptions = $.extend(true, [], window.POLICY_FONT_OPTIONS||[]);
	self.policyFont = ko.observable('');

	self.headerClass = ko.pureComputed(function() {
		let icons = 0;
		if(self.showFontOptions()) {
			icons++;
		}
		if(self.allowPreview()) {
			icons++;
			if((ko.unwrap(self.groupedPreviewFields) || []).length || _SITE_LANGUAGES.length) {
				icons++;
			}
		}
		if(icons === 1) {
			return 'iconSpacerOne';
		} else if(icons === 2) {
			return 'iconSpacerTwo';
		} else if(icons === 3) {
			return 'iconSpacerThree';
		}
		return '';
	});

	let _previewFields = [];
	self.addPreviewField = function (field) {
		_previewFields.push(field);
	};
	self.getPreviewField = function () {
		return _previewFields;
	};

	let PolicyField = function (fieldData, orderPolicy, root) {
		let self = this;
		self.font = ko.pureComputed(function () {
			let tag = self.tag();
			if (tag === 'digital_signature' || tag === 'signature' || tag === 'initials') {
				return orderPolicy.policyFont() || fieldData.font;
			}
			return null;
		});
		self.uri = ko.observable();

		switch(fieldData.tag) {
			case 'expiry':
				fieldData.live = 1;
				fieldData.readOnly = 1;
				break;
			case 'current_date':
				fieldData.readOnly = 1;
				break;
			case 'qrcode':
				fieldData.mode = 'image';
				fieldData.live = 1;
				fieldData.readOnly = 1;
				break;
		}
		self.getFieldData = function () {
			return $.extend(true, {}, fieldData);
		};
		self.controls = ko.observable(fieldData.controls);
		self.index = ko.observable(fieldData.index);
		self.tag = ko.observable(fieldData.tag);
		self.placeHolder = ko.pureComputed(function() {
			let site_field = self.site_field();
			if (site_field) {
				return site_field.local_string[lang].summary();
			}
			return fieldData.placeHolder;
		});
		self.site_field_id = ko.observable(fieldData.site_field_id);
		self.format = ko.observable(fieldData.format);
		self.context_id = ko.observable(generateContextId(4));
		self.club_policy_id = ko.observable(orderPolicy.club_policy_id());
		self.required = ko.observable(fieldData.required);
		self.readOnly = ko.observable(fieldData.readOnly);
		self.live = ko.observable(fieldData.live);
		self.hasFocus = ko.observable();
		self.visited = ko.observable();
		self.imageData = ko.observable();
		let subscribe = self.hasFocus.subscribe(function (val) {
			if (val) {
				self.visited(true);
				subscribe.dispose();
			}
		});

		self.isSpecialField = ko.pureComputed(function() {
			return self.isAcknowledgeIdentity() ||
				self.isAcknowledgeAgeOfMajority() ||
				self.isDigitalSignature() ||
				self.isCheckbox() ||
				self.isPlainText() ||
				self.isImage() ||
				self.isSelect();
		});

		self.isPlainText = ko.pureComputed(function() {
			return self.isDate();
		});

		self.tooltip = ko.pureComputed(function() {
			if(self.tag() ==='expiry' && !orderPolicy.original_accepted()) {
				return jsmsgExpiryDateEstimate;
			}
		})

		self.isAcknowledgeIdentity = ko.pureComputed(function() {
			return self.tag() === 'acknowledge_identity';
		});

		self.isAcknowledgeAgeOfMajority = ko.pureComputed(function() {
			return self.tag() === 'acknowledged_age_of_majority';
		});

		self.isDigitalSignature = ko.pureComputed(function() {
			return self.tag() === 'digital_signature';
		});

		self.isCheckbox = ko.pureComputed(function() {
			return self.tag() === 'checkbox';
		});

		self.isImage = ko.pureComputed(function() {
			return self.mode() === 'image';
		});

		self.isReadOnly = ko.pureComputed(function() {
			return self.readOnly() || self.isDisabled();
		})

		self.isDate = ko.pureComputed(function() {
			return ['current_date', 'expiry'].indexOf(self.tag()) >= 0;
		});

		self.isEditable = ko['pureComputed'](function () {
			return !self.readOnly() && self.tag() !== 'controls';
		});

		self.hasFont = ko.pureComputed(function() {
			return ['initials', 'signature', 'digital_signature'].indexOf(self.tag()) >= 0;
		});

		self.isSelect = ko.pureComputed(function() {
			return self.selectOptions();
		})

		self.site_field = ko.pureComputed(function () {
			let site_field_id = self.site_field_id();
			if (site_field_id) {
				if (root && typeof root.getSiteFieldById === 'function') {
					let site_field = root.getSiteFieldById(site_field_id);
					if (site_field) {
						return site_field;
					}
				}
				return _siteFieldsById[site_field_id];
			}
			return null;
		});

		self.mode = ko.pureComputed(function() {
			if(typeof fieldData.mode !== 'undefined') {
				return fieldData.mode;
			}
			let site_field = self.site_field();
			if (site_field) {
				return site_field.mode();
			}
			return null;
		});

		self.getImageWidth = ko.pureComputed(function() {
			if(fieldData.format) {
				if ("" + parseInt(fieldData.format) === fieldData.format) {
					return parseInt(fieldData.format);
				}
				let split = fieldData.format.split('x');
				if(split.length === 2 && "" + parseInt(split[0]) === split[0] && "" + parseInt(split[1]) === split[1]) {
					return parseInt(split[0]);
				}
			}
			//keep synced with PolicyTags::IMAGE_DEFAULT_SIZE / PolicyTags::QRCODE_DEFAULT_SIZE
			return fieldData.tag === 'qrcode' ? 200 : 300;
		});

		self.getImageHeight = ko.pureComputed(function() {
			if(fieldData.format) {
				if ("" + parseInt(fieldData.format) === fieldData.format) {
					return parseInt(fieldData.format);
				}
				let split = fieldData.format.split('x');
				if(split.length === 2 && "" + parseInt(split[0]) === split[0] && "" + parseInt(split[1]) === split[1]) {
					return parseInt(split[1]);
				}
			}
			//keep synced with PolicyTags::IMAGE_DEFAULT_SIZE / PolicyTags::QRCODE_DEFAULT_SIZE
			return fieldData.tag === 'qrcode' ? 200 : 300;
		});

		self.sfvRemoveValue = function() {
			let sfv = self.site_field_value();
			if(sfv) {
				sfv.removeValue(sfv.firstValue());
			}
		}

		function getPolicyFieldControlValue (orderPolicy, control, currentApplicableFieldByTag) {
			if (!_.isObject(control)) {
				return 1;
			}
			let club_policy = orderPolicy.club_policy(),
				user = orderPolicy.user(),
				participant = orderPolicy.participant();

			let age_of_majority = club_policy.age_of_majority();
			if (
				(
					typeof control['member_min'] !== 'undefined' &&
					(
						!user ||
						parseInt(control['member_min'] || age_of_majority) > parseInt(ko.unwrap(user.age))
					)
				) ||
				(
					typeof control['member_max'] !== 'undefined' &&
					(
						!user ||
						parseInt(control['member_max'] || age_of_majority) <= parseInt(ko.unwrap(user.age))
					)
				) ||
				(
					typeof control['participant_min'] !== 'undefined' &&
					(
						!participant ||
						parseInt(control['participant_min'] || age_of_majority) > parseInt(ko.unwrap(participant.age))
					)
				) ||
				(
					typeof control['participant_max'] !== 'undefined' &&
					(
						!participant ||
						parseInt(control['participant_max'] || age_of_majority) <= parseInt(ko.unwrap(participant.age))
					)
				)
			) {
				return  0;
			}

			if (control['tag']) {
				let	tagIndex = getPolicyTagIndex(control.tag, control.site_field_id),
					actualValues = currentApplicableFieldByTag && currentApplicableFieldByTag[tagIndex];
				if (_.isUndefined(actualValues)) {
					return 0;
				}
				let comparison = control['comparison'],
					expected = control['value'];

				return actualValues.some(function (value) {
					if (control.case_sensitive === 0) {
						value = value && value.toLowerCase();
						expected = expected && expected.toLowerCase();
					}
					return (comparison === '=' && value == expected) ||
						(comparison === '!=' && value != expected) ||
						(comparison === '>' && value > expected) ||
						(comparison === '<' && value < expected);
				});
			}
			return 1;
		}

		self.value = (function () {
			let _value = ko.observable();
			return ko['pureComputed']({
				read: function () {
					if (_loaded()) {
						let controls = self.tag() === 'controls' && (self.controls() || []);
						if (controls.length) {
							let isLiveSection = controls[0].live,
								value = 1,
								fieldsBySection = _fieldsBySection(),
								currentApplicableFieldByTag = {},
								tag;

							orderPolicy.getPreviewField().forEach(function (previewField) {
								let value = previewField.value.peek();
								if (value) {
									let tagIndex = previewField.tagIndex();
									if (!currentApplicableFieldByTag[tagIndex]) {
										currentApplicableFieldByTag[tagIndex] = [];
									}
									if (!currentApplicableFieldByTag[tagIndex].includes(value)) {
										currentApplicableFieldByTag[tagIndex].push(value);
									}
								}
							});
							for (tag in _initialAcceptanceValues) {
								if (!currentApplicableFieldByTag[tag]) {
									currentApplicableFieldByTag[tag] = [_initialAcceptanceValues[tag]];
								}
							}

							for (let i = 0, iLen = fieldsBySection.length; i < iLen; i++) {
								let sectionFields = fieldsBySection[i] || [];
								if (sectionFields[0] === self) {
									break;
								}
								if (sectionFields.length) {
									if (sectionFields[0].tag() === 'controls' && !sectionFields[0].value()) {
										continue;
									}
									sectionFields.forEach(function (policyField) {
										let tagIndex = policyField.tagIndex();
										if (!currentApplicableFieldByTag[tagIndex]) {
											currentApplicableFieldByTag[tagIndex] = [];
										}
										currentApplicableFieldByTag[tagIndex].push(policyField.value());
									});
								}
							}
							if (orderPolicy.original_accepted() && !isLiveSection && typeof self.value['peek']() !== 'undefined') {
								value = self.value['peek']();
							} else {
								for (let i = 0, len = controls.length; i < len; i++) {
									if (!getPolicyFieldControlValue(orderPolicy, controls[i], $.extend(true, {}, currentApplicableFieldByTag))) {
										value = 0;
										break;
									}
								}
							}
							_value(value);
						}
					}
					return _value();
				},
				write: function (value) {
					_value(value);
				}
			});
		})();

		let _initialValue;
		if(fieldData.tag === 'current_date' || fieldData.tag === 'expiry') {
			let format = _DATE_FORMATS[SHORT_DATE];
			if(typeof fieldData.format !== 'undefined') {
				format = fieldData.format;
				switch (format) {
					case 'short_date':
						format = _DATE_FORMATS[SHORT_DATE];
						break;
					case 'medium_date':
						format = _DATE_FORMATS[MEDIUM_DATE];
						break;
					case 'long_date':
						format = _DATE_FORMATS[LONG_DATE];
						break;
					case 'time':
						format = _DATE_FORMATS[TIME_ONLY];
						break;

				}
			}
			try {
				_initialValue = (fieldData.tag === 'current_date' ? moment() : moment.unix(orderPolicy.expected_expiry_unix())).format(format);
			} catch(e) {
				console.error(e);
				_initialValue = '';
			}
		} else if(self.tag() === 'qrcode') {
			_initialValue = '/policies/qr/' + self.getImageWidth() + '/' + self.getImageHeight() + '/SAMPLE';
		}

		self.value(_initialValue);
		self.sfvAcceptedTypes = ko.pureComputed(function() {
			if(_site_field_value) {
				return _site_field_value.acceptedTypes();
			}
		});

		self.setImageData = function(site_field_value, setter) {
			let value = site_field_value.firstValue()();
			if(typeof value === 'object' && value !== null && typeof value._file_content_url !== 'undefined') {
				var img = document.createElement('img');
				img.onload = function() {
					// We create a canvas and get its context.
					var canvas = document.createElement('canvas');
					var ctx = canvas.getContext('2d');

					// We set the dimensions at the wanted size.
					canvas.width = self.getImageWidth();
					canvas.height = self.getImageHeight();

					let ratio  = Math.min ( canvas.width / img.width, canvas.height / img.height),
						centerShift_x = (canvas.width - img.width * ratio) / 2,
						centerShift_y = (canvas.height - img.height * ratio) / 2;

					// We resize the image with the canvas method drawImage();
					ctx.drawImage(img, 0, 0, img.width, img.height,
						centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);

					setter(canvas.toDataURL());
				};
				img.src = value._file_content_url;
			} else {
				setter(null);
			}
		};

		let _site_field_value;
		(function () {
			let site_field = self.site_field(),
				context = orderPolicy.applyToContext() || null;
			if(site_field && context) {
				_site_field_value = new SiteFieldValue(site_field, context, []);
				if (site_field.mode() === 'image') {
					_site_field_value.firstValue().subscribe(function () {
						self.setImageData(_site_field_value, self.value);
					});
				}
			}
		})();

		self.sfvRemoveValue = function() {
			if(_site_field_value) {
				_site_field_value.removeValue(_site_field_value.firstValue());
			}
		};

		self.sfvSelectFile = function(element) {
			return function() {
				if(_site_field_value) {
					_site_field_value.selectFile(element);
				}
			}
		};

		self.selectOptions =  ko.pureComputed(function () {
			let site_field = self.site_field();
			if (site_field && site_field.validation && site_field.validation.options) {
				return ko.unwrap(site_field.validation.options) || [];
			}
			return null;
		});
		self.errorKey = ko.pureComputed(function () {
			return ['policy_field', self.index()].join(':');
		});
		self.isDisabled = ko.pureComputed(function () {
			return orderPolicy.isDisabled() || self.readOnly();
		});
		self.isInErrorState = ko.pureComputed(function () {
			return self.required() && self.visited() && !self.value();
		});
		self.isInWarningState = ko.pureComputed(function () {
			return !self.required() && self.visited() && !self.value();
		});
		self.tagIndex = ko['pureComputed'](function () {
			return getPolicyTagIndex(self.tag(), self.site_field_id());
		});
		self.styles = ko.pureComputed(function () {
			let styles = {};
			if(self.hasFont()) {
				let font = self.font();
				if (font) {
					styles.fontFamily = font;
				}
				let tag = self.tag();
				if (tag === 'digital_signature' || tag === 'signature') {
					styles.fontSize = '1.5em';
					styles.width = '100%';
				}
				styles.height = '1.7em';
			}
			return styles;
		});
		self.datePicker = ko.pureComputed(function () {
			return (self.tag() || '').match(/^\w+_birthdate$/g) || (self.site_field() && self.site_field().validator() === "uplifter\\siteFields\\DateField");
		});
		self.getFormData = function () {
			let data = {
				tag: self.tag(),
				value: emptyIfNull(self.value())
			};
			if (self.required()) {
				data.required = 1;
			}
			if (self.font()) {
				data.font = self.font();
			}
			if (self.site_field_id()) {
				data.site_field_id = self.site_field_id();
				if(self.mode() === 'image') {
					data.mode = 'image';
				}
			}
			return data;
		};
	};

	self.policyFields = ko['pureComputed'](function () {
		let policyFields = [],
			fieldsBySection = _fieldsBySection(),
			sections = _sections();
		if (_loaded()) {
			let tagMismatch;
			for (let i = 0, len = fieldsBySection.length; i < len; i++) {
				let sectionFields = fieldsBySection[i],
					section = sections[i];
				if (typeof section.controls !== 'undefined') {
					let controlField = sectionFields[0];
					if (controlField.tag() !== 'controls') {
						tagMismatch = true;
					}
					if (!controlField.value()) {
						policyFields.push(controlField);
						continue;
					}
				}
				policyFields = policyFields.concat(sectionFields)
			}
			let acknowledgeIdentityField = self.acknowledgeIdentityField();
			if (acknowledgeIdentityField) {
				policyFields.push(acknowledgeIdentityField);
			}
			let acknowledgedAgeOfMajorityField = self.acknowledgedAgeOfMajorityField();
			if (acknowledgedAgeOfMajorityField) {
				policyFields.push(acknowledgedAgeOfMajorityField);
			}
			let digitalSignatureField = self.digitalSignatureField();
			if (digitalSignatureField) {
				policyFields.push(digitalSignatureField);
			}

			if (tagMismatch) {
				console.error(window['jsmsgErrorUnexpected'])
				return [];
			}
		}
		return policyFields;
	});
	self.getPolicyField = function (lookData) {
		let fieldsBySection = _fieldsBySection();
		if (
			!_.isObject(lookData) ||
			typeof lookData.sectionIndex === 'undefined' ||
			typeof lookData.fieldIndex === 'undefined' ||
			typeof fieldsBySection[lookData.sectionIndex] === 'undefined' ||
			typeof fieldsBySection[lookData.sectionIndex][lookData.fieldIndex] === 'undefined'
		) {
			console.error(window['jsmsgErrorUnexpected']);
			return null;
		}
		return fieldsBySection[lookData.sectionIndex][lookData.fieldIndex];
	};
	ko['bindingHandlers'].policyDescription = (function () {
		let _cache = new ObjectMap();
		return {
			init: function(element, valueAccessor, allBindings, viewModel) {
				try {
					let context_id = viewModel.context_id();
					if (context_id) {
						if (!_cache.get(context_id)) {
							let scriptTag = document.getElementById(context_id);
							if (!scriptTag) {
								scriptTag = document.createElement('script');
								scriptTag.id = context_id;
								scriptTag.type = 'text/html';
								let scriptTemplate = ko.unwrap(valueAccessor());
								if (scriptTemplate) {
									scriptTag.innerHTML = scriptTemplate;
								}
								document.body.appendChild(scriptTag);
							} else {
								scriptTag.innerHTML = ko.unwrap(valueAccessor());
							}
							let placeHolder = document.createElement('div');
							placeHolder.classList.add('description');
							placeHolder.style.overflowWrap = 'anywhere';
							placeHolder.style.wordBreak = 'normal';
							element.parentNode.insertBefore(placeHolder, element.nextSibling);
							element.parentNode.removeChild(element);
							ko.renderTemplate(context_id, viewModel, {}, placeHolder, 'replaceChildren');
							_cache.put(context_id, {
								scriptTag: scriptTag,
								placeHolder: placeHolder
							});
							return;
						}
						let placeHolder = _cache.get(context_id).placeHolder;
						placeHolder.classList.add('description');
						placeHolder.style.overflowWrap = 'anywhere';
						placeHolder.style.wordBreak = 'normal';
						element.parentNode.insertBefore(placeHolder, element.nextSibling);
						element.parentNode.removeChild(element);
						ko.renderTemplate(context_id, viewModel, {}, placeHolder, 'replaceChildren');
					}
				} catch (error) {
					console.log(error);
				}
			},
			update: function(element, valueAccessor, allBindings, viewModel) {
				try {
					let context_id = viewModel.context_id(),
						cacheData = _cache.get(context_id);
					if (cacheData && cacheData.scriptTag && cacheData.placeHolder) {
						cacheData.scriptTag.innerHTML = ko.unwrap(valueAccessor());
						ko.renderTemplate(context_id, viewModel, {}, cacheData.placeHolder, 'replaceChildren');
					}
				} catch (error) {
					console.log(error);
				}
			}
		};
	})();

	self.clubPolicyTags = ko.pureComputed(function () {
		return self.policyFields().map(function (policyField) {
			return getPolicyTagIndex(policyField.tag(), policyField.site_field_id());
		});
	});

	self.editableFields = ko.pureComputed(function () {
		if (_loaded()) {
			return self.policyFields().filter(function (policyField) {
				return policyField.isEditable();
			});
		}
		return [];
	});

	let _lastFocus;
	self.onFocusOut = function (editableField) {
		_lastFocus = editableField;
	};
	self.onFocusIn = function (editableField) {
		let last = self.editableFields().indexOf(editableField);
		for (let i = 0; i < last; i++) {
			self.editableFields()[i].visited(1);
		}
	};

	self.acknowledgeIdentityField = ko.observable();
	self.acknowledgedAgeOfMajorityField = ko.observable();
	self.digitalSignatureField = ko.observable();
	let _fieldsBySection = ko['observableArray']([]),
		_sections = ko['observableArray']([]),
		_allFields = ko['observableArray']([]),
		_loaded = ko.observable(),
		_isLoading;

	self.fieldsBySection = ko.pureComputed(function () {
		return _fieldsBySection();
	});

	self.description = ko['pureComputed'](function () {
		if (_loaded()) {
			let sections = _sections(),
				__fieldsBySection = _fieldsBySection();
			return __fieldsBySection.reduce(function (acc, sectionFields, sectionIndex) {
				let fieldIndex = 0,
					section = sections[sectionIndex];
				if (!_.isUndefined(section.controls)) {
					let controlField = sectionFields[fieldIndex];
					fieldIndex++;
					if (!controlField.value()) {
						return acc;
					}
				}
				/** (JSON.stringify(section.controls || [])) */
				acc += section.content.replace(POLICY_REG_EXP, function() {
					if (self.allowPreview()) {
						let pf = __fieldsBySection[sectionIndex][fieldIndex];
						if (!pf.isImage() && !pf.readOnly()) {
							fieldIndex++;
							return _.escape(pf.value());
						}
					}
					let fieldData = {
						sectionIndex: sectionIndex,
						fieldIndex: fieldIndex
					};
					fieldIndex++;
					return '<span data-bind="' + quoteattr('template: {name: "policyEditableField", data: getPolicyField(' + JSON.stringify(fieldData) + ')}') + '"></span>';
				});
				return acc;
			}, '');
		}
		return '';
	});

	self.isRejected = ko['pureComputed'](function () {
		return 	(self.viewed() && !self.accepted());
	});
	self.canBeRejected = ko.pureComputed(function () {
		return root && root.constructor.name === 'Checkout' && self.order_club_policy_id() && self.accepted() && !ko.unwrap(self.accepted_club_policy) && !self.missingSignature();
	});
	if (!self.hasExpired) {
		self.hasExpired = ko['pureComputed'](function () {
			let time = Math.floor((new Date()).getTime() / 1000);
			return (self['expiry_time']() && self['expiry_time']() < time);
		});
	}
	self.outstanding = ko['pureComputed'](function () {
		return (self.viewed() === null && !self.accepted()) || self.replacement_club_policy_id() || (self.club_policy().required() && (!self.accepted()) || self.hasExpired());
	});

	self.isDeletable = ko['pureComputed'](function () {
		if (self.deleted()) {
			return false;
		}
		const {club_policy} = self;

		if (
			window['adminScope'] &&
			club_policy() &&
			(club_policy()['acceptance_by']() === 'admin' || club_policy()['acceptance_by']() === 'auto')
		) {
			return true;
		}
		const order = self.getRoot();
		return (!order && order.completed_time()) &&
			(
				!self.accepted() ||
				(self['accepted_club_policy']() && self.order_club_policy_id())
			);
	});
	self.cantAcceptPolicyOnImport = ko['pureComputed'](function () {
		return (!self.accepted() &&
			root.constructor.name === 'importMembers' &&
			!window['adminScope'] &&
			self.club_policy()['acknowledge_identity']() === 'participant')
	});

	self.checkboxIcon = ko['pureComputed'](function() {
		if (self.accepted() && !self.hasExpired()) {
			return 'icon-checked-box';
		} else if (!self.accepted() && self.viewed()) {
			return 'icon-half-filled-box';
		}
		return 'icon-blank-box';
	});

	self.emailTransferPolicy = ko.observable();
	self.emailTransferPolicy.error = ko.observable();
	self.emailTransferPolicy.processing = ko.observable(false);
	
	function checkForThirdPartyAcceptance () {
		if (!self.order_club_policy_id() || !self.transfer_code() || self.accepted()) {
			return;
		}
		let link = '/policies/response-policy/?' + $.param({policy: self.order_club_policy_id(), auth: self.transfer_code()}),
			source;

		if (!!window.EventSource) {
			source = new EventSource(link);
			source.addEventListener('update', function(e) {
				let data = JSON.parse(e.data);
				if (data.close) {
					source.close();
					return;
				}
				if (data.order_club_policy_id && data.accepted) {
					source.close();
					self.reMapFromJS(data);
				}
			}, false);
		}
	}
	checkForThirdPartyAcceptance();

	self.transferPolicy = function (form) {
		if (self.emailTransferPolicy.processing() || self.transfer_code()) {
			return;
		}
		let emailTransferPolicy = self.emailTransferPolicy();
		self.emailTransferPolicy.error(false);
		if (validate.single(emailTransferPolicy, {presence: true, email: true})) {
			self.emailTransferPolicy.error(true);
		}
		if (!self.emailTransferPolicy.error()) {
			let post = {email: emailTransferPolicy},
				order_club_policy_id = self.order_club_policy_id(),
				merchant_payment_method_id = self.merchant_payment_method_id();

			if (order_club_policy_id) {
				post.order_club_policy_id = order_club_policy_id;
			} else {
				post.club_policy_id = self.club_policy_id();
				if (self.participant_id()) {
					post.participant_id = self.participant_id();
				}
				if (merchant_payment_method_id) {
					post.merchant_payment_method_id = merchant_payment_method_id;
				}
			}

			if (root) {
				post.constructor = root.constructor.name;
				if (ko['isObservable'](root.order) && ko['isObservable'](root.order().order_id)) {
					post.order_id = root.order().order_id();
				}
			}
			self.emailTransferPolicy.processing(true);
			$.extend(post, self.getPostData());
			UP.Services.AjaxPostCall(form.action, post, function (response) {
				self.emailTransferPolicy.processing(false);
				if (response.error) {
					alert(response.error);
					return;
				}
				if (response.reload) {
					self.reloadCheckout(response.msg);
					return;
				}
				if (response.success) {
					self.modal.close();
					if (response.order_club_policy) {
						self.reMapFromJS(response.order_club_policy);
					}
					checkForThirdPartyAcceptance();
				}
			});
		}
	};
	self.afterClose = function () {
		_initialValues(undefined);
	};
	self.addToFormData = function (form) {
		let club_policy_id = self.club_policy_id();
		form.append('policies[' + club_policy_id + '][viewed]', emptyIfNull(self.viewed()));
		form.append('policies[' + club_policy_id + '][accepted]', emptyIfNull(self.accepted()));
		form.append('policies[' + club_policy_id + '][acknowledged_by]', emptyIfNull(self.acknowledgeIdentityField() && self.acknowledgeIdentityField().value()));
		form.append('policies[' + club_policy_id + '][acknowledged_age_of_majority]', emptyIfNull(self.acknowledgedAgeOfMajorityField() && self.acknowledgedAgeOfMajorityField().value()));
		form.append('policies[' + club_policy_id + '][digital_signature]', emptyIfNull(self.digitalSignatureField() && self.digitalSignatureField().value()));
		self.policyFields().forEach(function (policyField, i) {
			let policyFieldData = policyField.getFormData();
			for (let key in policyFieldData) {
				form.append('policies[' + club_policy_id + '][policy_fields][' + i + '][' + key + ']', emptyIfNull(policyFieldData[key]));
			}
		});
	};
	self.getPostData = ko.pureComputed(function () {
		let data = {
			club_policy_id: self.club_policy_id(),
			viewed: self.viewed(),
			accepted: self.accepted()
		};
		if (self.order_club_policy_id()) {
			data.order_club_policy_id = self.order_club_policy_id()
		} else {
			data.user_id = self.user_id();
			data.participant_id = self.participant_id();
			data.order_id = self.order_id();
		}
		if (self.club_policy()['acknowledge_identity']()) {
			data.acknowledged_by = self.acknowledgeIdentityField() && self.acknowledgeIdentityField().value();
		}
		if (self.club_policy()['acknowledge_age_of_majority']()) {
			data.acknowledged_age_of_majority = self.acknowledgedAgeOfMajorityField() && self.acknowledgedAgeOfMajorityField().value();
		}
		if (self.club_policy()['digital_signature']()) {
			data.digital_signature = self.digitalSignatureField() && self.digitalSignatureField().value();
		}
		if (self.participant_id()) {
			data.participant_id = self.participant_id()
		}
		if (typeof self['merchant_payment_method_id'] === 'function' && self.merchant_payment_method_id()) {
			data.merchant_payment_method_id = self.merchant_payment_method_id();
		}
		data.policy_fields = [];
		self.policyFields().forEach(function (policyField) {
			data.policy_fields.push(policyField.getFormData());
		});
		return data;
	});
	let _markToReMapAcceptanceData = false;
	self.resetPolicy = function () {
		self.accepted(null);
		if (!self.order_club_policy_id()) {
			_markToReMapAcceptanceData = true;
		}
	};
	self.reMapFromJS = function (data) {
		ko.mapping.fromJS(data, mapping, self);
		_markToReMapAcceptanceData = true;
	};
	self.acceptCallback = ko.observable(null);
	self.markAsAcceptedRejected = function (response) {
		if (response) {
			let acceptedTime = Math.floor((new Date()).getTime() / 1000);
			let accepted = self.accepted(),
				original_accepted = self.original_accepted();
			if (accepted && original_accepted && !self.editableContentHasChange()) {
				acceptedTime = accepted;
			}
			self.accepted(acceptedTime);
		} else {
			self.resetPolicy();
		}
		if (typeof self.acceptCallback() === 'function') {
			self.acceptCallback()();
			return;
		}
		self.modal.close();
	};
	self.closeCallback =  ko.observable();
	self.close = function () {
		if (!self.isDisabled() && !self.allowAcceptance() && self.editableContentHasChange() && ((self.order_club_policy_id() && self.original_accepted()) || (!self.order_club_policy_id() && self.accepted()))) {
			self.accepted(null);
		}
		if (typeof self.closeCallback() === 'function') {
			self.closeCallback()();
			return;
		}
		self.modal.close();
	};

	function reMapAcceptanceData (orderPolicy) {
		let	_acceptance_data = $.extend(true, [], orderPolicy.acceptance_data),
			_hasAcceptanceData = orderPolicy['hasAcceptanceData'],
			fieldsBySection = _fieldsBySection();

		for (let i = 0, len = fieldsBySection.length; i < len; i++) {
			let sectionFields = fieldsBySection[i];
			for (let j = 0, len = sectionFields.length; j < len; j++) {
				let policyField = sectionFields[j],
					tag = policyField.tagIndex();
				if (_hasAcceptanceData) {
					let entry = _acceptance_data.shift();
					if (entry) {
						policyField.value(entry.value);
						policyField.uri(entry.uri);
						if (tag === 'controls' && !entry.value) {
							break;
						}
					}
				} else if (tag !== 'controls' && !_.isUndefined(_initialAcceptanceValues[tag])) {
					policyField.value(_initialAcceptanceValues[tag]);
				}
			}
		}

		let specialFields = {
			acknowledge_identity: self.acknowledgeIdentityField(),
			acknowledged_age_of_majority: self.acknowledgedAgeOfMajorityField(),
			digital_signature: self.digitalSignatureField()
		},
			specialFieldsKey;

		const extraTagData = _acceptance_data.reduce((acc, cur) => {
			acc[cur['tag']] = cur;
			return acc
		}, {});

		for (specialFieldsKey in specialFields) {
			let specialField = specialFields[specialFieldsKey];
			if (specialField) {
				if (_hasAcceptanceData) {
					if(extraTagData[specialFieldsKey]){
						specialField.value(extraTagData[specialFieldsKey].value);
					}
				} else {
					specialField.value(specialFieldsKey !== 'digital_signature' ? 0 : '');
				}
			}
		}
	}
	
	function parseResponse (response) {
		if (response['initialAcceptanceValues']) {
			_initialAcceptanceValues = response['initialAcceptanceValues'];
		}
		_siteFieldsById = Object.keys(response['siteFieldsById'] || {}).reduce(function (acc, site_field_id) {
			acc[site_field_id] = new SiteField(response['siteFieldsById'][site_field_id], root);
			return acc;
		}, {});
		let sections = [];
		try {
			sections = JSON.parse(response.description);
		} catch (e) {
			sections = [{content: response.description}];
		}
		_fieldsBySection([]);
		_sections([]);
		_allFields([]);
		let __sections = [];
		sections.forEach(function (section) {
			let sectionFields = [];
			if (section.controls) {
				if (!Array.isArray(section.controls)) {
					section.controls = [section.controls]
				}
				let fieldData = $.extend(true, {}, {
					tag: 'controls',
					controls: section.controls
				});
				let policyField = new PolicyField(fieldData, self, root);
				sectionFields.push(policyField);
				_allFields.push(policyField);
			}
			sectionFields = sectionFields.concat((section.content.match(POLICY_REG_EXP) || []).map(function (tag) {
				let matches = tag.matchAll(POLICY_REG_EXP),
					fieldData,
					match;
				for (match of matches) {
					let matched, tag, colon, site_field_id, pipe, format, last_char, final_char, fieldModifier;
					[matched, tag, colon, site_field_id, pipe, format, last_char, final_char, fieldModifier] = match;
					site_field_id = tag === 'custom_field' ? parseInt(site_field_id) || null : null;
					fieldData = {
						tag: tag,
						required: (fieldModifier || '').indexOf('*') >= 0 ? 1 : 0,
						readOnly: (fieldModifier || '').indexOf('!') >= 0 ? 1 : 0,
						live: (fieldModifier || '').indexOf('!!') >= 0 ? 1 : 0
					};

					if(typeof format !== 'undefined') {
						if(format.length > 1 && format[0] === format[format.length-1] && (format[0] === '"' || format[0] === "'")) {
							format = format.substr(1, format.length - 2);
						}
						fieldData.format = format;
					}
					if (site_field_id) {
						fieldData.site_field_id = site_field_id;
					}
				}
				fieldData.placeHolder = POLICY_KEY_VALUE_TAGS[fieldData.tag];
				let policyField = new PolicyField(fieldData, self, root);
				_allFields.push(policyField);
				return policyField ;
			}));
			_fieldsBySection.push(sectionFields);
			__sections.push(section);
		});
		_sections(__sections);
		let club_policy = self.club_policy();
		if (club_policy) {
			if (club_policy.acknowledge_identity()) {
				let policyField = new PolicyField({
					tag: 'acknowledge_identity',
					required: 1
				}, self, root);
				self.acknowledgeIdentityField(policyField);
				_allFields.push(policyField);
			}
			if (self.requireAcknowledgeAgeOfMajority()) {
				let policyField = new PolicyField({
					tag: 'acknowledged_age_of_majority',
					required: 1
				}, self, root);
				self.acknowledgedAgeOfMajorityField(policyField);
				_allFields.push(policyField);
			}
			if ((club_policy.digital_signature() || self.digitalSignature())) {
				let policyField = new PolicyField({
					tag: 'digital_signature',
					placeHolder: POLICY_KEY_VALUE_TAGS['digital_signature'],
					required: 1
				}, self, root);
				self.digitalSignatureField(policyField);
				_allFields.push(policyField);
			}
		}

		let user = self.user(),
			participant = self.participant(),
			address = self.address(),
			uTags = {
				member_name: 'name',
				member_first_name: 'first_name',
				member_last_name: 'last_name',
				member_email: 'email',
			},
			pTags = {
				participant_first_name: 'first_name',
				participant_last_name: 'last_name',
				participant_name: 'name',
				participant_birthdate: 'birthdate',
				participant_age: 'age',
				participant_gender: 'full_gender'
			},
			aTags = {
				member_address1: 'address1',
				member_address2: 'address2',
				member_city: 'city',
				member_prov_state: 'prov',
				member_postal_zip: 'postal',
				member_country: 'country',
				member_tel: 'phone',
				member_tel_alt: 'cell',
				company_name: 'company_name',
			};
		let allPromises = [];
		_allFields().forEach(function (policyField) {
			if (policyField.site_field_id()) {
				let parent_site_field_value;
				if (typeof root.getSiteFieldValue === 'function') {
					let site_field = policyField.site_field(),
						context = self.applyToContext() || null;
					if(site_field && context) {
						parent_site_field_value = root.getSiteFieldValue(site_field, context);
					}
				} else if (root instanceof AddParticipant && root.participant() && typeof root.participant().getSiteFieldValueBySiteFieldId === 'function') {
					parent_site_field_value = root.participant().getSiteFieldValueBySiteFieldId(policyField.site_field_id());
				}
				if (parent_site_field_value) {
					let updateInitialValues = (function (policyField) {
						return function (site_field_value, resolvePromise) {
							if (site_field_value.site_field.mode() === 'image') {
								let obs = ko.observable();
								let subscribe = obs.subscribe(function (value) {
									_initialAcceptanceValues[policyField.tagIndex()] = value;
									subscribe.dispose();
									if (typeof resolvePromise === 'function') {
										resolvePromise(1);
									}
								});
								policyField.setImageData(site_field_value, obs);
							} else {
								_initialAcceptanceValues[policyField.tagIndex()] = ((site_field_value.getValues() || []).join(', '));
							}
						}
					})(policyField);
					let tag = policyField.tagIndex()
					if (!_initialAcceptanceValues[tag]) {
						if (parent_site_field_value.site_field.mode() === 'image') {
							let promise = new Promise(function (resolve) {
								updateInitialValues(parent_site_field_value, resolve);
							});
							allPromises.push(promise);
						} else {
							updateInitialValues(parent_site_field_value);
						}
					}
					if (ko.isObservable(parent_site_field_value.firstValue())) {
						parent_site_field_value.firstValue().subscribe(function () {
							updateInitialValues(parent_site_field_value);
						});
					}
					parent_site_field_value.values.subscribe(function () {
						updateInitialValues(parent_site_field_value);
					});
				}
			} else {
				let tag = policyField.tagIndex(), obj, objTag, objProp;
				if (user && uTags[tag] && user[uTags[tag]]) {
					objTag = tag;
					objProp = uTags[tag];
					obj = user;
				} else if (address && aTags[tag] && address[aTags[tag]]) {
					objTag = tag;
					objProp = aTags[tag];
					obj = address;
				} else if (participant && pTags[tag] && participant[pTags[tag]]) {
					objTag = tag;
					objProp = pTags[tag];
					obj = participant;
				}
				if (obj) {
					let propValue = ko.unwrap(obj[objProp]) || '';
					if (!_initialAcceptanceValues[tag] && propValue) {
						_initialAcceptanceValues[objTag] = propValue;
					}
					if (ko['isObservable'](obj[objProp])) {
						obj[objProp].subscribe(function (propValue) {
							_initialAcceptanceValues[objTag] = propValue;
						});
					}
				}
			}
		});
		if (allPromises.length) {
			Promise.all(allPromises).then((values) => {
				reMapAcceptanceData(self);
			});
			allPromises = [];
		 	return;
		}
		reMapAcceptanceData(self);
	}

	self.setResponse = function (response) {
		_loaded(false);
		parseResponse(response);
		_loaded(true);
	};

	self.load = function () {
		if (_loaded()) {
			return $.Deferred().resolve(true).promise();
		}

		if (_isLoading) {
			return _isLoading;
		}

		let deferred = $.Deferred();
		_isLoading = deferred.promise();

		let post = {
			policy: self.club_policy_id()
		};

		let orderClubPolicyId = self.order_club_policy_id['peek']();
		if (orderClubPolicyId) {
			post.order_club_policy_id = orderClubPolicyId;
		}

		let participantId = self.participant_id();
		if (participantId) {
			post.participant_id = participantId;
		}

		let viewedLang = self['viewed_lang']();
		if (viewedLang) {
			post.lang = viewedLang;
		}

		UP.Services.AjaxPostCall('/policies/policy-view.php?policy=' + post.policy, post, function (response) {
			_isLoading = null;

			if (response.reload) {
				self.reloadCheckout(response.msg);
				return;
			}

			if (response.error) {
				deferred.reject(false);
				alert(response.error);
				return;
			}

			parseResponse(response);
			_loaded(true);
			deferred.resolve(true);
		});

		return _isLoading;
	};

	self.open = function () {
		let deferred = $.Deferred();

		if (_opening) {
			return deferred.reject().promise();
		}
		_opening = true;

		self.load().then(function () {
			if (_markToReMapAcceptanceData) {
				reMapAcceptanceData(self);
				_markToReMapAcceptanceData = false;
			}
			showModal({
				template: 'policyContentTemp',
				viewModel: self
			}, true).then(deferred.resolve, deferred.reject);
		}, deferred.reject);

		return deferred;
	};

	self.expected_expiry_unix = ko.pureComputed(function() {
		if(self.expiry_time()) {
			return self.expiry_time();
		} else if (self.club_policy().duration_type() === 'end_date') {
			return self.club_policy().effective_end_date();
		} else if(self.club_policy().duration_type() === 'effective_duration') {
			return strtotime(self.club_policy().effective_duration());
		}
	});

	self.expected_expiry_time = function() {
		if (self.calculated_expiry_time_formatted() !== null) {
			return self.calculated_expiry_time_formatted();
		} else if (self.club_policy().duration_type() === 'end_date') {
			return moment.unix(self.club_policy().effective_end_date()).format(_DATE_FORMATS[MEDIUM_DATE]);
		} else if(self.club_policy().duration_type() === 'effective_duration') {
			return moment.unix(uplifter_strtotime(self.club_policy().effective_duration())).format(_DATE_FORMATS[MEDIUM_DATE]);
		}
		return null;
	};

	self.creating_participant = ko['pureComputed'](function () {
		return ko.unwrap(root.create_participant);
	});

	self.requireAcknowledgeAgeOfMajority = ko.pureComputed(function () {
		const clubPolicy = self.club_policy();
		if (!clubPolicy) {
			return false;
		}

		const ageOfMajority = parseInt(clubPolicy.age_of_majority(), 10);
		if (!ageOfMajority) {
			return false;
		}

		if (!clubPolicy.acknowledge_age_of_majority() && !self.acknowledged_age_of_majority()) {
			return false;
		}

		if (clubPolicy.acknowledge_identity() === 'parent / legal guardian if participant is under-age') {
			const user = self.user();
			let userAge = user ? user.getAge(self.accepted() || null) : null;
			return userAge === null || userAge < ageOfMajority;
		}

		return true;
	});


	self.digitalSignaturePlaceholder = ko['pureComputed'](function () {
		let club_policy = self.club_policy();
		if (club_policy.acknowledge_identity() === 'participant' || (club_policy.acknowledge_identity() === 'parent / legal guardian if participant is under-age' && self.isParticipantAgeOfMajority()) || (!club_policy.acknowledge_identity() && club_policy.apply_to() === 'participant'))  {
			return jsmsgParticipantName;
		}
		return jsmsgParentName;
	});

	self.isParticipantAgeOfMajority = ko['pureComputed'](function() {
		let club_policy = self.club_policy(),
		participant = self.participant();
		return (
			participant && club_policy.age_of_majority() &&
			parseInt(participant['age'](), 10) >= parseInt(club_policy.age_of_majority(), 10)
		);
	});

	self.missingSignature = ko['pureComputed'](function () {
		return self.club_policy().digital_signature() && self.original_accepted() && self.order_club_policy_id() && !(self.original_digital_signature()||'').trim();
	});

	self.displaySetting = ko['pureComputed'](function () {
		let club_policy = self.club_policy();
		return club_policy && (club_policy['acknowledge_identity']() || (club_policy.age_of_majority() && club_policy.acknowledge_age_of_majority()) || club_policy.digital_signature() || self.digitalSignature());
	});
	self.displayTransferEmail = ko['pureComputed'](function () {
		let club_policy = self.club_policy();
		return club_policy && club_policy['allow_email_transfer']() && !self.accepted() && (!self.acceptanceError() || club_policy.apply_to() === 'user');
	});

	self.displayScrollError = ko['pureComputed'](function () {
		return !self.errorsByKey().acknowledged_age_of_majority && !self.acceptanceError() && !self.accepted() && !self.hasScrollDown() && !window['acceptPolicy'] && (window['policyMandatoryScroll'] || self.displaySetting() || self.displayTransferEmail());
	});

	self.scrollErrorString = ko['pureComputed'](function () {
		return self.displayScrollError() ? interpolate(window['jsmgPolicyScrollError'], [self.clubPolicyType().toLowerCase()]) : null;
	});

	self.viewLink = ko['pureComputed'](function () {
		let order_club_policy_id = self.order_club_policy_id(),
			club_policy_id = self.club_policy_id(),
			auth_code = self.auth_code();
		if (order_club_policy_id && auth_code) {
			let params = {
				code: auth_code,
				order_club_policy_id: order_club_policy_id,
				policy: club_policy_id
			};
			return (window.adminScope ? '/admin/' : '/policies/') + 'policy-view.php?' + $.param(params);
		} else if (self.accepted_club_policy()) {
			let accepted_club_policy = self.accepted_club_policy();
			let params = {
				code: accepted_club_policy.auth_code,
				policy: accepted_club_policy.club_policy_id,
				order_club_policy_id: accepted_club_policy.order_club_policy_id
			};
			return (window.adminScope ? '/admin/' : '/policies/') + 'policy-view.php?' + $.param(params);
		} else if (club_policy_id) {
			return (window.adminScope ? '/admin/' : '/policies/') + 'policy-view.php?policy=' + club_policy_id;
		}
		return null;
	});

	self.downloadLink = ko['pureComputed'](function () {
		if (self.deleted()) {
			return null;
		}
		let order_club_policy_id = self.order_club_policy_id(),
			club_policy_id = self.club_policy_id(),
			auth_code = self.auth_code(),
			accepted = self.original_accepted();
		if (order_club_policy_id && auth_code && accepted) {
			let params = {
				code: auth_code,
				policy: club_policy_id,
				order_club_policy_id: order_club_policy_id,
				download: 1,
			};
			return (window.adminScope ? '/admin/' : '/policies/') + 'policy-view.php?' + $.param(params);
		} else if (self.accepted_club_policy()) {
			let accepted_club_policy = self.accepted_club_policy();
			let params = {
				code: accepted_club_policy.auth_code,
				policy: accepted_club_policy.club_policy_id,
				order_club_policy_id: accepted_club_policy.order_club_policy_id,
				download: 1,
			};
			return (window.adminScope ? '/admin/' : '/policies/') + 'policy-view.php?' + $.param(params);
		}
		return null;
	});

	self.paymentMethod = ko['pureComputed'](function () {
		let club_policy = self.club_policy();
		if (root && club_policy && club_policy.merchant_payment_method_id()) {
			let merchant_payment_method_id = club_policy.merchant_payment_method_id();
			if (typeof root.getPaymentMethodById === 'function') {
				return root.getPaymentMethodById(merchant_payment_method_id);
			} else if (ko['isObservable'](root.order) && ko['isObservable'](root.order().paymentMethods)) {
				return root.order()['paymentMethods']().find(function (mpm) {
					return -merchant_payment_method_id === -mpm.merchant_payment_method_id();
				});
			} else if (ko['isObservable'](root.merchant) && ko['isObservable'](root.merchant().paymentMethods)) {
				return root.merchant().paymentMethods().find(function (mpm) {
					return -merchant_payment_method_id === -mpm.merchant_payment_method_id();
				});
			}
		}
		return null;
	});

	self.groupingApplyToContext = ko.pureComputed(function () {
		let club_policy = self.club_policy();
		if (club_policy) {
			let visibility = club_policy.visibility();
			if (visibility === 'payment') {
				let paymentMethod = self.paymentMethod();
				if (!paymentMethod) {
					return null;
				}
				return paymentMethod;
			}
			return self.applyToContext();
		}
		return null;
	});

	self.applyToContext = ko.pureComputed(function () {
		let club_policy = self.club_policy();
		if (club_policy) {
			let apply_to = club_policy.apply_to();
			if (apply_to === 'user' && self.user()) {
				return self.user();
			}
			if (apply_to === 'participant' && self.participant()) {
				return self.participant();
			}
		}
		return null;
	});
	self.applyToKey = ko.pureComputed(function () {
		let club_policy = self.club_policy(),
			club_policy_id = club_policy && club_policy.club_policy_id();
		if (!club_policy_id) {
			return null;
		}
		let applyToKey = [club_policy_id],
			apply_to = club_policy.apply_to();

		if (apply_to === 'user') {
			let user_id = self.user_id();
			if (!user_id) {
				return null;
			}
			applyToKey.push(user_id);
			applyToKey.push('');
		} else {
			let user_id = self.user_id();
			applyToKey.push(user_id ? user_id : '');
			let participant_id = self.participant_id();
			if (!participant_id) {
				return null;
			}
			applyToKey.push(participant_id);
		}
		if (club_policy.merchant_payment_method_id()) {
			applyToKey.push(club_policy.merchant_payment_method_id());
			let user_payment_token_id = self.user_payment_token_id();
			if (!user_payment_token_id && self['accepted_club_policy']()) {
				user_payment_token_id = self['accepted_club_policy']().user_payment_token_id;
			}
			if (user_payment_token_id) {
				applyToKey.push(user_payment_token_id);
			}
		}
		return applyToKey.join(':');
	});
	self.clubPolicyType = ko.pureComputed(function () {
		let club_policy = self.club_policy();
		if (club_policy) {
			let typeLang = self.viewed_lang() || window.lang;
			if(typeLang in club_policy.club_policy_type_description){
				return club_policy.club_policy_type_description[typeLang].summary();
			}
		}
		return '';
	});

	self.hasEditableContent = ko.pureComputed(function () {
		if (_loaded()) {
			return self.editableFields().length;
		}
		return false;
	});

	self.editableContentHash = ko.pureComputed(function () {
		return JSON.stringify(self.policyFields().reduce(function (acc, policyField) {
			acc.push(policyField.getFormData());
			return acc;
		}, []));
	});

	self.editableContentHasChange = ko.pureComputed(function () {
		let initialValues = _initialValues();
		return _.isEmpty(self.acceptance_data) || (typeof initialValues !== 'undefined' && initialValues !== self.editableContentHash());
	});

	self.enableCloseAndSaveButton = ko.pureComputed(function () {
		return !self.original_accepted() && (self.editableContentHasChange() || self.isDisabled() || (self.transfer_code() && !self.accepted()) || !self.allowAcceptance() || (root && root.constructor.name === 'AdminNonAcceptedPolicies'));
	});

	self.isAccountPolicyPage = ko.pureComputed(function () {
		return root && root.constructor.name === 'UserPolicies';
	});

	self.allowAcceptanceContext  = ko.pureComputed(function () {
		let club_policy = self.club_policy();
		if (club_policy) {
			let acknowledge_identity = club_policy['acknowledge_identity'](),
				creating_participant = self.creating_participant(),
				participant = self.participant();

			if (acknowledge_identity === 'participant' || creating_participant) {
				return participant;
			}
			return self.user() || null;
		}
		return null;
	});

	self.hasAgeRestrictions = ko.pureComputed(function () {
		if (_loaded()) {
			let club_policy = self.club_policy();
			if (club_policy) {
				let acknowledge_age_of_majority = club_policy['acknowledge_age_of_majority']();
				if (acknowledge_age_of_majority) {
					return true;
				}
				return _sections().find(function (section) {
					let controls = section.controls;
					if (_.isUndefined(controls)) {
						return false;
					}
					for (let i = 0, lenI = controls.length; i < lenI; i++) {
						let control = controls[i];
						for (let j = 0, lenJ = ageRangeKeys.length; j < lenJ; j++) {
							let controlKey = ageRangeKeys[j];
							if (!_.isUndefined(control[controlKey])) {
								return  true;
							}
						}
					}
					return false;
				});
			}
		}
		return false;
	});

	self.acceptanceError = ko.pureComputed(function () {
		let club_policy = self.club_policy();
		if (club_policy) {
			if (!self.accepted() && self.isAccountPolicyPage()) {
				if (window['adminScope']) {
					if (club_policy.acceptance_by() === 'user') {
						return window['jsmsgAcceptOnBeHalfError'];
					}
				} else if (club_policy.acceptance_by() !== 'user') {
					return window['jsmsgAcceptRegularUserOnBeHalfError'];
				}
			}
			let acknowledge_age_of_majority = club_policy['acknowledge_age_of_majority']() && club_policy['age_of_majority']() ? parseInt(club_policy['age_of_majority'](), 10) : null,
				acknowledge_identity = club_policy['acknowledge_identity']();
			if (acknowledge_age_of_majority) {
				let errorString = '',
					allowAcceptanceContext = self.allowAcceptanceContext(),
					apply_to = club_policy.apply_to(),
					age = 0;
				if (acknowledge_identity === 'participant') {
					errorString = window['jsmsgParticipantAcceptanceError'];
					let participant = self.participant();
					if (participant && participant.participant_id()) {
						errorString += ' ' + interpolate(window['jsmsgGoToProfile'], [(window.adminScope ? '/admin' : '') + '/participants/participant.php?participant=' + participant.participant_id()]);
					} else {
						errorString += ' ' + window['jsmsgClosePopup'];
					}
				} else {
					errorString = window['jsmsgMemberAcceptanceError'];
					if (root && root.constructor.name === 'Checkout') {
						errorString += ' ' + interpolate(window['jsmsgGoToProfile'], ['/users/']);
					} else if (!self.allowPreview()) {
						errorString += ' ' + window['jsmsgClosePopup'];
					}
				}
				if (allowAcceptanceContext) {
					age = parseInt(ko.unwrap(allowAcceptanceContext['age']), 10) || 0;
				}
				if ((acknowledge_identity === 'participant' && age < acknowledge_age_of_majority) ||
					((apply_to === 'user' || acknowledge_identity === 'parent / legal guardian if participant is under-age') && window['birthdateRequired'] && (!allowAcceptanceContext || (allowAcceptanceContext && age < acknowledge_age_of_majority)))
				) {
					let birthdate = allowAcceptanceContext ? ko.unwrap(allowAcceptanceContext['birthdate']) : null;
					return interpolate(errorString, [acknowledge_age_of_majority, club_policy.type().toLowerCase(), birthdate||window['jsmsgNotSet']]);
				}
			}
			let sections = _sections(),
				ageRequirements = {};
			for (let i = 0, len = sections.length; i < len; i++) {
				(sections[i].controls || []).forEach(function (control) {
					for (let prop in control) {
						ageRequirements[prop] = true;
					}
				});
			}
			ageRequirements = sections.map(function (section) {
				return (section.controls || []);
			}).filter(function (controls) {
				return controls.length;
			}).flat().reduce(function (acc, cur) {
				Object.keys(cur).forEach(function (prop) {
					if (!acc[prop] && ['participant_min', 'participant_max', 'member_min', 'member_max'].indexOf(prop) !== -1) {
						acc[prop] = true;
					}
				});
				return acc;
			}, {});
			let errorString = '',
				memberAge,
				participantAge;

			if (self.creating_participant()) {
				memberAge = self.participant() ? ko.unwrap(self.participant().age) : 0;
			} else {
				memberAge = self.user() ? ko.unwrap(self.user().age) : 0;
			}
			participantAge = self.participant() ? ko.unwrap(self.participant().age) : 0;

			if (!memberAge && (ageRequirements['member_min'] || ageRequirements['member_max'])) {
				errorString = interpolate(window.adminScope ? window['jsmsgMemberPolicyUnknownAgeAdmin'] : window['jsmsgMemberPolicyUnknownAge'], [club_policy.type().toLowerCase()]);
				if (root && (root.constructor.name === 'Checkout' || root.constructor.name === 'AdminNonAcceptedPolicies')) {
					let goToURL = (window.adminScope ? '/admin' : '') + ('/users/' + (window.adminScope ? '?user=' + ko.unwrap(self.user().user_id) :  ''));
					errorString += ' ' + interpolate(window['jsmsgGoToProfile'], [goToURL]);
				} else if (!self.allowPreview()) {
					errorString += ' ' + window['jsmsgClosePopup'];
				}
			}
			if (!participantAge && (ageRequirements['participant_min'] || ageRequirements['participant_max'])) {
				errorString += (errorString ? '<br>' : errorString) + interpolate(window['jsmsgParticipantPolicyUnknownAge'], [club_policy.type().toLowerCase()]);
				if (!self.allowPreview()) {
					let participant = self.participant();
					if (participant.participant_id()) {
						errorString += ' ' + interpolate(window['jsmsgGoToProfile'], [(window.adminScope ? '/admin' : '') + '/participants/participant.php?participant=' + participant.participant_id()]);
					} else {
						errorString += ' ' + window['jsmsgClosePopup'];
					}
				}
			}
			return errorString;
		}
		return null;
	});

	self.allowAcceptance = ko.pureComputed(function () {
		let acknowledged_by = self.acknowledgeIdentityField() && self.acknowledgeIdentityField().value(),
			acknowledged_age_of_majority = self.acknowledgedAgeOfMajorityField() && self.acknowledgedAgeOfMajorityField().value(),
			signed_digital_signature = ((self.digitalSignatureField() && self.digitalSignatureField().value())||'').trim(),
			hasScrollDown = self.hasScrollDown(),
			allow = true,
			club_policy = self.club_policy(),
			original_accepted = self.original_accepted();

		if (club_policy) {
			if (((window['adminScope'] && club_policy.acceptance_by() === 'user' && !self.allowPreview()) || (!window['adminScope'] && club_policy.acceptance_by() !== 'user'))) {
				return false;
			}
			let acknowledge_identity = club_policy['acknowledge_identity'](),
				acknowledge_age_of_majority = club_policy['acknowledge_age_of_majority']() && club_policy['age_of_majority']() ? parseInt(club_policy['age_of_majority'](), 10) : null,
				digital_signature = club_policy['digital_signature'](),
				apply_to = club_policy['apply_to']();
			if (acknowledge_age_of_majority && !original_accepted) {
				let allowAcceptanceContext = self.allowAcceptanceContext(),
					age = allowAcceptanceContext ? parseInt(ko.unwrap(allowAcceptanceContext['age']), 10) : 0;
				if (acknowledge_identity === 'participant' || ((apply_to === 'user' || acknowledge_identity === 'parent / legal guardian if participant is under-age') && window['birthdateRequired'] && (!allowAcceptanceContext || (allowAcceptanceContext && age < acknowledge_age_of_majority)))) {
					allow = allow && (age >= acknowledge_age_of_majority);
				}
			}
			if (acknowledge_identity) {
				allow = allow && acknowledged_by;
			}
			if (acknowledge_age_of_majority && self.requireAcknowledgeAgeOfMajority()) {
				allow = allow && acknowledged_age_of_majority;
			}
			if (digital_signature) {
				allow = allow && (signed_digital_signature !== "" && signed_digital_signature);
			}
			if (!original_accepted && window['policyMandatoryScroll'] && !window['acceptPolicy']) {
				allow = allow && hasScrollDown;
			}
			let policyFields = self.policyFields();
			for (let i = 0, len = policyFields.length; i < len; i++) {
				let policyField = policyFields[i];
				if (policyField.isEditable() && policyField.required() && !policyField.value()) {
					allow = false;
					break;
				}
			}
		}
		return allow;
	});

	self.isDisabled = ko.computed(function () {
		if (self.club_policy()) {
			const acceptance_by = self.club_policy().acceptance_by();
			return !!(
				self.deleted() ||
				(self.order_club_policy_id() && self.original_accepted() && root && root.constructor.name !== 'Checkout') ||
				(
					(
						(window['adminScope'] && acceptance_by === 'user') ||
						(!window['adminScope'] && acceptance_by !== 'user')
					) && !self.allowPreview()
				) ||
				ko.unwrap(self.accepted_club_policy) ||
				self.acceptanceError() ||
				self.cantAcceptPolicyOnImport() ||
				(window['acceptPolicy'] && self.accepted()) ||
				(self.isAccountPolicyPage() && self.original_accepted()) ||
				(self.transfer_code() && self.original_accepted()));
		}
		return true;
	});
	self.acceptButtonCssClasses = ko.pureComputed(function () {
		let cssClasses = {
			btnAction: true,
		};
		if (!self.allowAcceptance()) {
			cssClasses.tooltip = true;
		}
		return cssClasses;
	});
	self.acceptButtonAttributes = ko.pureComputed(function () {
		let attr = {};
		if (!self.allowAcceptance() && self.displayScrollError()) {
			attr.title = self.scrollErrorString();
		}
		return attr;
	});
	self.getRoot = function () {
		return root;
	};
};

var ClubPolicy = function (
	data,
	mapping,
	adminPage,
	clubPolicyEdit
) {
	let self = this;
	let _mapping = {};
	if (typeof mapping === 'object') {
		_mapping = mapping;
	} else if (typeof  mapping === 'function') {
		_mapping = mapping(self, adminPage, clubPolicyEdit)||{};
	}

	ko.mapping.fromJS(data, _mapping, self);
	self.hasTags = ko.pureComputed(function () {
		return self.category_tags && self.category_tags() || self.category_level_tags && self.category_level_tags() || self.season_tags && self.season_tags() || self.product_tags && self.product_tags() || self.facility_tags && self.facility_tags() || self.location_tags && self.location_tags();
	});
	self.attr = {
		href: (window.adminScope ? '/admin' : '/policies') + '/policy-view.php?policy=' + self.club_policy_id()
	};
	self.summary = ko.pureComputed(function () {
		return self.local_string[lang].summary();
	});
	self.expiration = ko['pureComputed'](function () {
		if (self['duration_type']() === 'effective_duration') {
			return self['effective_duration'];
		} else if (self.effective_end_date()) {
			return self['effective_end_date'].date(SHORT_DATE);
		}
		return null;
	});

	if(typeof self.effective_end_date_formatted !== 'undefined') {
		self.effective_end_date_formatted.subscribe(function (val) {
			self.effective_end_date(strtotime(val));
		});
	}

	self.isLeaguePolicy = !!self.league_policy_id();

	self.club_policy_type = ko.observable();
	self.type = ko.pureComputed(function () {
		return self.club_policy_type_description[lang].summary();
	});
	self.groupingType = ko.pureComputed(function () {
		return self.club_policy_type_description[lang].content();
	});

	self.acceptanceByUser = ko.pureComputed(function() {
		return self.acceptance_by() === 'user' || ['payment','event'].indexOf(self.visibility()) >= 0;
	})

	self.allow_acknowledge_age_of_majority = ko.pureComputed(function() {
		return self.age_of_majority() && self.acceptanceByUser();
	});

	self.has_acknowledge_age_of_majority = ko.pureComputed(function() {
		return self.acknowledge_age_of_majority() && self.allow_acknowledge_age_of_majority()
	})

	self.has_expiry = ko.pureComputed(function() {
		return self.visibility() === 'event' || ['infinite', 'none'].indexOf(self.duration_type()) === -1;
	});

	self.allow_acknowledge_identity = ko.pureComputed(function() {
		return self.acceptanceByUser()
	});

	self.has_acknowledge_identity = ko.pureComputed(function() {
		return self.acknowledge_identity() && self.allow_acknowledge_identity()
	});

	self.allow_digital_signature = ko.pureComputed(function() {
		return self.acceptanceByUser();
	});

	self.has_digital_signature = ko.pureComputed(function() {
		return self.digital_signature() && self.allow_digital_signature();
	});

	self.allow_required = ko.pureComputed(function() {
		return self.acceptanceByUser();
	});

	self.has_required = ko.pureComputed(function() {
		return self.required() && self.allow_required();
	});
	self.isValidForParticipant = function (participant) {
		let age = participant.age();

		if (self.noBirthdate(age)) {
			return true;
		}

		return self.meetsPolicyMaximumAgeRequirements(age) && self.meetsPolicyAgeOfMajorityRequirements(age);
	};

	self.noBirthdate = function (age) {
		return age === null || age === undefined;
	};

	self.meetsPolicyMaximumAgeRequirements = function (age) {
		let max_participant_age = self['max_participant_age']();

		return !max_participant_age || parseInt(age) <= parseInt(max_participant_age);
	};

	self.meetsPolicyAgeOfMajorityRequirements = function (age) {
		let present_only_if_age_of_majority = self.present_only_if_age_of_majority(),
			age_of_majority = self.age_of_majority();

		return !present_only_if_age_of_majority || (age_of_majority && parseInt(age) >= parseInt(age_of_majority));
	};
};

var Payment = function (options, root) {
	var self = this;
	var parent = options.parent;
	var mapping = {
		refunds: {
			create: function (options) {
				return new Payment(options, root);
			}
		}
	};
	if(typeof options.data.status_copy === 'undefined') {
		options.data.status_copy = options.data.status;
	}
	if(typeof options.data.isGCEligibleForAdminRetry === 'undefined') {
		options.data.isGCEligibleForAdminRetry = false;
	}

	ko.mapping.fromJS(options.data, mapping, self);

	self.mappingFromJS = function(val) {
		if (val) {
			self.approval_code(val.approval_code);
			self.transaction_id(val.transaction_id);
			self.merchant_payment_method_id(val.merchant_payment_method_id);
			self.status(val.status);
			self.gift_certificate_id(val.gift_certificate_id);
			self.note(val.note);
			self.transaction_time(val.transaction_time);
			self.transaction_amount(val.transaction_amount);
		}
	};

	if (typeof EditableContent !== 'undefined') {
		EditableContent.call(self);
	}
	self.parent = options.parent;
	self.merchant_payment_method = ko.pureComputed(function () {
		var merchant_payment_method_id = self.merchant_payment_method_id();
		if(ko.isObservable(root.merchant)) {
			return root.merchant().merchant_payment_methods().find(function (merchant_payment_method) {
				return merchant_payment_method_id === merchant_payment_method.merchant_payment_method_id();
			});
		} else if(ko.isObservable(root.merchants)) {
			var merchant_id = self.merchant_id();
			return root.merchants().find(function(merchant) {
				return merchant_id === merchant.merchant_id();
			}).merchant_payment_methods().find(function (merchant_payment_method) {
				return merchant_payment_method_id === merchant_payment_method.merchant_payment_method_id();
			});
		}
	});

	self.temporary = ko.observable((typeof options.data.temporary !== 'undefined') ? options.data.temporary : !self.order_transaction_id());

	if (typeof EditableContent !== 'undefined') {
		self.edit.subscribe(function (val) {
			if (val && self.temporary()) {
				self.temporary(false);
				root.order().finalPayments.push(self);
			}
		});
	}


	self.edited = ko.pureComputed(function () {
		var edited = false;
		if(self.deleted() != options.data.deleted) {
			edited = true;
		}
		if(self.status() != options.data.status) {
			edited = true;
		}
		if(emptyIfNull(self.note()) != emptyIfNull(options.data.note)) {
			edited = true;
		}
		if(getFormattedDateTime(self.transaction_time()) != getFormattedDateTime(options.data.transaction_time)) {
			edited = true;
		}
		if(self.transaction_amount() != options.data.transaction_amount) {
			edited = true;
		}
		if(emptyIfNull(self.original_transaction_id()) != emptyIfNull(options.data.original_transaction_id)) {
			edited = true;
		}
		if(emptyIfNull(self.original_approval_code()) != emptyIfNull(options.data.original_approval_code)) {
			edited = true;
		}
		if(self.merchant_payment_method_id() != options.data.merchant_payment_method_id) {
			edited = true;
		}
		if(!self.order_transaction_id() && !self.temporary()) {
			edited = true
		}
		return edited;
	});

	self.balance = ko.pureComputed(function () {
		if (self.status() === 'declined' || self.deleted() > 0) {
			return 0;
		}
		if (typeof self.refunds === 'function') {
			var totalRefunds = self.refunds().reduce(function (acc, refund) {
				return refund.order_transaction_id() && root.order() && refund.order_id() !== root.order().order_id() ? parseFloat(acc) : parseFloat(acc) + parseFloat(refund.balance());
			}, 0);
			return self.order_transaction_id() && root.order() && self.order_id() !== root.order().order_id() ? parseFloat(totalRefunds) : parseFloat(self.transaction_amount()) + totalRefunds;
		} else {
			return self.order_transaction_id() && root.order() && self.order_id() !== root.order().order_id() ? 0.0 : self.transaction_amount();
		}
	});

	self.refundable_balance = ko.pureComputed(function() {
		if (self.status() === 'declined' || self.deleted() > 0 || self.transaction_type() === 'refund' || (self.order_transaction_id() && self.order_id() !== root.order().order_id())) {
			return 0;
		}
		if (typeof self.refunds === 'function') {
			var totalRefunds = self.refunds().reduce(function (acc, refund) {
				return parseFloat(acc) + parseFloat(refund.balance());
			}, 0);

			return Math.max(parseFloat(self.transaction_amount()) + totalRefunds, 0);
		} else {
			return self.transaction_amount();
		}
	});

	self.payment_method = ko.pureComputed(function () {
		return self.merchant_payment_method().local_string[lang].summary();
	});

	self.paymentMethodHasToken = ko.pureComputed(function () {
			return (self.original_merchant_payment_method_id() === self.merchant_payment_method_id() && self.token_summary()) ? 1 : 0;
	})

	self.update_time_formatted = ko.pureComputed(function () {
		return getFormattedDateTime(self.update_time() || self.create_time());
	});

	self.process_time_formatted = ko.pureComputed(function () {
		var process_time = self.process_time();
		if (process_time) {
			return getFormattedDateTime(process_time);
		}
	});

	self.transaction_time_formatted = ko.pureComputed({
		read: function () {
			return getFormattedDateTime(self.transaction_time());
		},
		write: function (installmentDate) {
			self.transaction_time(moment(installmentDate, "YYYY-MM-DD h:mm A").unix())
		}
	});

	self.allRefunds = ko.pureComputed(function () {
		var refunds = self.refunds();
		refunds.sort(function (a, b) {
			return a.transaction_time() > b.transaction_time();
		});
		return refunds;
	});

	self.paid_balance = ko.pureComputed(function () {
		if (self.original_status() === 'paid') {
			var totalPaidRefunds = self.refunds().reduce(function (acc, refund) {
				if (refund.original_status() === 'paid') {
					return !refund.order_transaction_id() || refund.order_id() === root.order().order_id() ? parseFloat(acc) + parseFloat(refund.balance()) : parseFloat(acc);
				}
				return parseFloat(acc);
			}, 0);
			return !self.order_transaction_id() || self.order_id() === root.order().order_id() ? parseFloat(self.transaction_amount()) + totalPaidRefunds : totalPaidRefunds;
		}
		return 0;
	});

	self.can_refund = ko.pureComputed(function () {
		return self.balance() > 0 && self.order_transaction_id() > 0 && self.original_status() === 'paid' && (self.processed() & 1) === 1;
	});
	self.show_delete = ko.pureComputed(function () {
		var matchWithRefunds = true;
		if (self.transaction_type() === 'payment' && self.refunds().length > 0) {
			matchWithRefunds = (parseFloat(self.transaction_amount()) + self.refunds().reduce(function (acc, refund) {
				if (refund.original_status() === 'paid') {
					return parseFloat(acc) + parseFloat(refund.transaction_amount());
				}
				return parseFloat(acc);
			}, 0) === 0);
		}
		return self.deletable() && (self.original_status() !== 'paid' || (self.original_status() === 'paid' && self.merchant_payment_method().canDeletePaid())) && !self.temporary() && matchWithRefunds && (!self.order_transaction_id() || !root.order() || self.order_id() === root.order().order_id());
	});
	self.show_edit = ko.pureComputed(function () {
		return self.editable() && self.original_status() !== 'declined' && !self.deleted() && (!self.order_transaction_id() || !root.order() || self.order_id() === root.order().order_id());
	});
	self.show_approve_gift_certificate = ko.pureComputed(function() {
		return self.merchant_payment_method().class_name() == 'giftCertificatePayment' && self.status() === 'pending' && root.order().order_id() === self.order_id() && !self.deleted()
	});
	self.show_cancel_processing = ko.pureComputed(function () {
		return self.original_status() === 'processing' && !self.merchant_payment_method().adminCanPay();
	});
	self.refundTransaction = function (transaction) {
		var data = ko.mapping.toJS(transaction);
		if (data.refunded_order_transaction_id || data.transaction_type !== 'payment') {
			throw 'Cannot refund refund';
		}

		var d = new Date(),
			newRefund = new Payment({
				data: $.extend(true, {}, root.sampleTransaction, {
					transaction_type: 'refund',
					refunded_order_transaction_id: self.order_transaction_id(),
					payment_token: self.payment_token(),
					awaiting_token: self.awaiting_token(),
					transaction_time: Math.floor(d.getTime() / 1000),
					transaction_amount: Math.min(0, Math.max(root.order().balance(), self.balance() * -1)),
					merchant_payment_method_id: self.merchant_payment_method_id(),
					gift_certificate_id: self.gift_certificate_id(),
					status: 'paid',
					temporary: false
				}),
				parent: self
			}, root);
		newRefund.original_status('');

		newRefund.edit(true);
		self.refunds.push(newRefund);

	};

	self.approveGiftCertificate = function (payment) {
		payment.status('processing');
	};

	if (self.transaction_type() === 'refund') {
		self.transaction_amount.subscribe(function (val) {
			if (val > 0) {
				self.transaction_amount(val * -1);
			}
		});
	}

	self.payment_passed = ko.computed(function () {
		return isBeforeNow(self.transaction_time)();
	});
	self.availablePaymentMethods = ko.pureComputed(function () {
		return root.merchant().paymentMethodsIncludingDisabled().filter(function (mpm) {
			// include the original payment method even if disabled in case of cancel edit, the original mpm wont be overridden
			if (mpm.merchant_payment_method_id() === self.original_merchant_payment_method_id()) {
				return true;
			}

			if (self.transaction_type() === 'refund') {
				return mpm.ready() && !mpm.isDeprecated() && (!mpm.isOnlinePayment() || mpm.merchant_payment_method_id() === parent.merchant_payment_method_id());
			}

			return !mpm.isDisabled() && !mpm.isDeactivated()
		});
	});
	self.paymentStatusOptions = ko.pureComputed(function () {
		var isOnlinePayment = self.merchant_payment_method().isOnlinePayment();
		var isOfflinePayment = self.merchant_payment_method().isOfflinePayment();
		var noPendingStatus = self.merchant_payment_method().noPendingStatus();
		var isBatchOnlinePayment = self.merchant_payment_method().isBatchOnlinePayment();
		var selectableOptions = $.extend(true, {}, root.paymentStatuses);
		var order_token = root.order().payment_tokens()[self.merchant_payment_method().merchant_payment_method_id()];
		var hasRefunds = typeof self.refunds === 'function' && self.refunds().length > 0;



		// don't allow paid directly
			delete selectableOptions.paid;
			var original_status = self.original_status();
			if ((noPendingStatus || self.refunded_order_transaction_id() || self.transaction_type() === 'refund') && (!(self.original_merchant_payment_method_class_name() === 'giftCertificatePayment' && original_status === 'pending'))) {
				delete selectableOptions.pending;
			}
			if (hasRefunds || !isOfflinePayment || self.refunded_order_transaction_id()) {
				delete selectableOptions.undeposited;
				delete selectableOptions.declined;
			}
			if (hasRefunds || (isOnlinePayment && ((!self.payment_token() && !order_token) || self.awaiting_token()) && !self.refunded_order_transaction_id())) {
				delete selectableOptions.processing;
			}
			if (original_status && original_status !== 'pending') {
				delete selectableOptions.pending;
			}
		return Object.keys(selectableOptions).map(function (key) {
			return selectableOptions[key];
		});
	});

	self.show_transaction_id = ko.pureComputed(function () {
		return !self.merchant_payment_method().isOnlinePayment() && (self.merchant_payment_method().class_name() !== 'giftCertificatePayment' || !self.gift_certificate_id());
	});
	self.gift_certificate_id.subscribe(function (value) {
		var gc = root.giftCertificates().find(function (gc) {
			return gc.gift_certificate_id() == value;
		});
		gc && self.transaction_id(gc.cert_code());
	});
	self.merchant_payment_method_id.subscribe(function () {
		setTimeout(function () {
			if (self.gift_certificate_id() && self.merchant_payment_method().class_name() !== 'giftCertificatePayment') {
				self.gift_certificate_id(null);
				self.transaction_id(typeof self.original_transaction_id !== 'undefined' ? self.original_transaction_id() : null);
			}
			if (self.merchant_payment_method().class_name() !== 'giftCertificatePayment' && typeof self.parent.pay_by === 'function') {
				self.parent.pay_by(self.merchant_payment_method());
			}
		});
	});
	self.autoAdded = ko.pureComputed(function () {
		return self.temporary && self.temporary()
	});
	self.removeRefund = function (refund) {
		var currentValue = refund.deleted();
		if (!currentValue && refund.gift_certificate_id() && refund.status() == 'paid') {
			if (!window.confirm(jsmsgConfirmDeleteGCRefund)) {
				return null;
			}
		}
		refund.order_transaction_id() ? refund.deleted(self.deleted() ? self.deleted() : !currentValue) : self.refunds.remove(refund);
	};

	self.giftCertificatesOptions = ko.pureComputed(function () {
		let merchant = ko.unwrap(root.merchant)
		if (!merchant) {
			return [];
		}
		var response = [];
		if (typeof root['merchantGiftCertificates'] === 'function') {
			var gcs = root.merchantGiftCertificates();
			for (var i = 0; i < gcs.length; i++) {
				var item = gcs[i];
				response.push({
					gift_certificate_id: ko.unwrap(item.gift_certificate_id),
					title: ko.unwrap(item.cert_code) + ' ( ' + ko.unwrap(item.cert_value.currency()) + ' )'
				});
			}
		}
		if (self.transaction_type() === 'refund') {
			response.push({
				gift_certificate_id: null,
				title: ko.pureComputed(function () {
					return jsmsgCreateNew + ' ' + self.merchant_payment_method().name();
				})
			});
		}
		return response;
	});

	self.order_number_link = ko.pureComputed(function() {
		return ('<a target="_blank" href="/admin/order-edit.php?order=' + self.order_id() +  '">' + self.order_number() + '</a>');
	});
};

var MerchantPaymentMethod = function (options, root) {
	let self = this,
		_defaults = {
			excludedTokenId: null,
			validTokensOnly: true,
			addCreate: false,
		};
	ko.mapping.fromJS(Object.assign({}, _defaults, options.data) , {}, self);

	self.isDisabled = ko['pureComputed'](function () {
		return self.status() === 'disabled';
	});

	self.isDeactivated = ko['pureComputed'](function () {
		return self.status() === 'deactivated';
	});

	self.name = ko['pureComputed'](function () {
		return self.dropdown_string[lang].summary();
	});

	self.payment_token = ko['pureComputed']({
		read: function () {
			return root.getPaymentToken(self.merchant_payment_method_id());
		}, write: function (paymentToken) {
			root.setPaymentToken(self.merchant_payment_method_id(), paymentToken);
		}
	});
	self.paymentTokens = (function () {
		let paymentTokens = ko.observable([]);
		let _createNewOption = new UserPaymentToken({
			merchant_payment_method_id: self.merchant_payment_method_id(),
			isCompleted: false,
			summary: window['jsmsgEnterNew']
		}, root);
		return ko['pureComputed']({
			read: function () {
				if (self['reusableToken']() && ko['isObservable'](root.userPaymentTokens)) {
					let userPaymentTokens = root.userPaymentTokens()||[];
					let tokens = (userPaymentTokens).filter(function (paymentToken) {
						return -self.merchant_payment_method_id() === -paymentToken.merchant_payment_method_id() &&
							(!self.excludedTokenId() || -paymentToken.user_payment_token_id() !== -self.excludedTokenId()) &&
							(!self.validTokensOnly() || paymentToken.isValid())
					}).sort(function (a, b) {
						let val_A = (a.default_token() ? 1 : 0) + (((a.update_time()||0) > (b.update_time()||0)) ? 1 : 0);
						let val_B = (b.default_token() ? 1 : 0) + (((b.update_time()||0) > (a.update_time()||0)) ? 1 : 0);
						if (val_A > val_B) {
							return -1;
						}
						if (val_B > val_A) {
							return 1;
						}
						return 0;
					});
					tokens.push(_createNewOption);
					paymentTokens(tokens);
				}
				return paymentTokens();
			},
			write: function (value) {
				paymentTokens(value);
			}
		});
	})();
	self.paymentPolicies = (function () {
		let _cachePolicies = {};
		return ko['pureComputed'](function () {
			let order = root.order && root.order();
			let paymentPolicies = [],
				policies = self.policies()||[],
				use_credit,
				gcPaymentMethod;
			if (order) {
				order.order_policies().forEach(function (op) {
					if (op.order_club_policy_id() && !op.user_payment_token_id() && op.club_policy() &&	op.club_policy().visibility() === 'payment' && op.merchant_payment_method_id() === self.merchant_payment_method_id()
					) {
						_cachePolicies[op.club_policy_id()] = op;
					}
				});
				use_credit = order.use_credit();
				let credit_available = ko.unwrap(order.credit_available);
				let usable_credit = ko.unwrap(order.usable_credit);
				if (use_credit && (credit_available || usable_credit)) {
					gcPaymentMethod = root.gcPaymentMethod();
				}
			} else if (typeof root.gcPaymentMethodByMerchantId === 'function' && typeof root.applyCredit === 'function') {
				use_credit = root.applyCredit();
				if (use_credit) {
					gcPaymentMethod = root.gcPaymentMethodByMerchantId()[self.merchant_id()];
				}
			}
			if (use_credit && gcPaymentMethod && self.merchant_payment_method_id() !== gcPaymentMethod.merchant_payment_method_id()) {
				policies = policies.concat((gcPaymentMethod.policies()||[]));
			}
			let merchant_payment_method_id = self.merchant_payment_method_id();
			(policies).forEach(function (club_policy_id) {
				if (!_cachePolicies[club_policy_id]) {
					let overrides = {
						club_policy_id: club_policy_id,
						merchant_payment_method_id: merchant_payment_method_id
					};
					if (order) {
						overrides.order_id = order.order_id();
						overrides.user_id = order.user_id();
						overrides.account_id = order.account_id();
					} else if (window.viewUser) {
						overrides.user_id = +window.viewUser.user_id;
						overrides.account_id = +window.viewUser.account_id;
					}
					let policy = $.extend(true, {} , root['sampleOrderClubPolicy'], overrides);
					_cachePolicies[club_policy_id] = new OrderClubPolicy(policy, root);
				}
				paymentPolicies.push(_cachePolicies[club_policy_id]);
			});
			return paymentPolicies;
		});
	})();
	self.selectedToken = ko.observable();
	self.isCompleted = ko.observable();

	self.defaultToken = ko['pureComputed'](function () {
		let paymentTokens = self.paymentTokens()||[];
		let defaultToken = paymentTokens.find(function (paymentToken) {
			return paymentToken['default_token']();
		});
		if (!defaultToken && paymentTokens[0]) {
			defaultToken = paymentTokens[0];
		}
 		return defaultToken;
	});

	self.allowPayment = ko['pureComputed'](function () {
		if (!window['adminScope']) {
			let paymentPolicies = self.paymentPolicies();
			for (let i = 0, len = paymentPolicies.length; i < len; i++) {
				if (paymentPolicies[i]['viewed']() !== 1 || (paymentPolicies[i].club_policy().required() && !paymentPolicies[i].accepted())) {
					return false;
				}
			}
		}
		return true;
	});

	self.setDefaultTokenOption = function () {
		let selectedToken = self.selectedToken();
		if (!selectedToken) {
			self.selectedToken(self.defaultToken() || self.paymentTokens()[0])
		}
	};

	self.setMerchantPaymentMethodText = ko['pureComputed'](function () {
		let text = self.payment_token() ? jsmsgMerchantPaymentMethodUdateText : jsmsgMerchantPaymentMethodAddText;
		return text.replace('%s', self.name());
	});

	self.addNewText = ko['pureComputed'](function () {
		return window['jsmsgAddX'].replace('%s', self.name());
	});
	self.addToAccountText = ko['pureComputed'](function () {
		return window['jsmsgAddXToAccount'].replace('%s', self.name());
	});

	self.applicablePolicies = ko['pureComputed'](function () {
		let applicablePolicies = self.paymentPolicies() || [];
		if (root && root.constructor.name === 'PaymentTokens') {
			return applicablePolicies.filter(function (paymentPolicy) {
				return !paymentPolicy.original_accepted() && !paymentPolicy.accepted_club_policy();
			});
		}
		return applicablePolicies;
	});

	self.groupedApplicablePolicies = ko.pureComputed(function () {
		let result = new ObjectMap();
		self.applicablePolicies().forEach(function (paymentPolicy) {
			let groupingType = paymentPolicy.club_policy().groupingType();
			let obj = result.get(groupingType);
			if (!obj) {
				obj = {
					type: groupingType,
					policies: []
				};
				result.put(groupingType, obj);
			}
			obj.policies.push(paymentPolicy);
		});
		return result.values();
	});
};

var Merchant = function (options, root) {
	var self = this;
	ko.mapping.fromJS(options.data, {
		merchant_payment_methods: {
			create: function (options) {
				return new MerchantPaymentMethod(options, root);
			}
		}
	}, self);

	function filterPaymentMethods(includeDisabled) {
		return self.merchant_payment_methods().filter(function (merchantPaymentMethod) {
			return merchantPaymentMethod.ready() || (includeDisabled && merchantPaymentMethod.isDisabled());
		});
	}

	self.paymentMethods = ko.pureComputed(function () {
		return filterPaymentMethods(false);
	});

	// we want to include disabled payments in case we need to revert pending payments to original mpm id in admin edit
	self.paymentMethodsIncludingDisabled = ko.pureComputed(function () {
		return filterPaymentMethods(true);
	});

};

var createHTMLElement = function (templateName, viewModel) {
	var temporaryDiv = document.createElement("div");
	temporaryDiv.style.display = "none";
	document.body.appendChild(temporaryDiv);

	var deferredElement = $.Deferred();
	ko.renderTemplate(
		templateName,
		viewModel,
		{
			afterRender: function (nodes) {
				var elements = nodes.filter(function (node) {
					return node.nodeType === 1;
				});
				deferredElement.resolve(elements[0]);
			}
		},
		temporaryDiv,
		'replaceNode'
	);
	return deferredElement;
};

var showModal = function (options, isBootstrap) {
	if (typeof options === "undefined") {
		throw new Error("An options argument is required.");
	}
	if (typeof options.viewModel !== "object") {
		throw new Error("options.viewModel is required.");
	}

	let viewModel = options.viewModel;
	let template = options.template || viewModel.template;
	if (!template) {
		throw new Error("options.template is required.");
	}

	let _createFBModal = function ($ui, viewModel) {
		let deferredResult = $.Deferred();
		let $window = $(window);
		let $boxWrap,
			$modalHeader,
			$modalBody,
			$modalFooter,
			$fancyboxInner,
			$popContent,
			lastWindowHeight = window.innerHeight,
			lastBodyHeight,
			copyOptions = Object.assign({}, options);
		let setting = {
			href: '#' + $ui.attr('id'),
			type: 'inline',
			minWidth: '50%',
			scrolling: 'no',
			modal: true,
			autoResize: true,
			afterClose: function () {
				$ui.each(function (index, element) {
					ko.cleanNode(element);
				});
				$ui.remove();
				$window.unbind('resize', $.fancybox.update);
				if (typeof viewModel['afterClose'] === 'function') {
					viewModel['afterClose'](viewModel);
				}
			},
			afterShow: function () {
				$boxWrap = $('.fancybox-skin');
				$popContent = $boxWrap.find('.popContent');
				if ($popContent.size()) {
					$fancyboxInner = $boxWrap.find('.fancybox-inner');
					$modalHeader = $popContent.children('header');
					$modalBody = $popContent.children('div.popBody');
					$modalFooter = $popContent.children('footer');
					lastBodyHeight = $modalBody[0].scrollHeight;
					updateFB();
					$window.bind('resize', $.fancybox.update);
				}
				if (typeof viewModel['afterShow'] === 'function') {
					viewModel['afterShow'](viewModel);
				}
			},
			onUpdate: function () {
				if ($popContent && $popContent.size()) {
					var lwh = lastWindowHeight;
					lastWindowHeight = window.innerHeight;
					if (lastWindowHeight > lwh) {
						$modalBody.css({maxHeight: ($modalBody.height() + lastWindowHeight - lwh) + 'px'});
						updateFB();
						return;
					}

					var lbh = lastBodyHeight;
					lastBodyHeight = $modalBody[0].scrollHeight;
					if (lastBodyHeight > lbh) {
						$modalBody.css({maxHeight: ($modalBody.height() + lastBodyHeight - lbh) + 'px'});
						updateFB();
						return;
					}

					var newModalBodyHeight = $fancyboxInner.height() - $modalHeader.outerHeight(true) - $modalFooter.outerHeight(true);
					$modalBody.css({maxHeight: newModalBodyHeight + 'px', overflowY: 'auto'});
					if ($modalBody.height() < newModalBodyHeight) {
						$modalBody.css({overflowY: 'visible'});
					}
				}
			}
		};
		delete copyOptions.viewModel;
		delete copyOptions.template;
		setting = Object.assign({}, setting, copyOptions, {href: '#' + $ui.attr('id')});
		$.fancybox(setting);
		$.fancybox.viewModel = viewModel;
		viewModel.deferredResult = deferredResult;
		return deferredResult;
	};

	let _createBSModal = function ($ui, viewModel, options) {
		let _defaultBsOption = {backdrop: 'static', keyboard: false},
			bsOptions = Object.assign({}, _defaultBsOption, options['bsOptions']||{});
		if (!template) {
			throw new Error("options.template is required.");
		}
		let deferredModalResult = $.Deferred();
		let modal = new bootstrap.Modal(document.getElementById($ui.attr('id')), bsOptions);
		//this seems to be having a negative impact on policies
		//$ui.addClass('dropdownOverflow');
		viewModel.modal = {
			close: function (result) {
				if (typeof result !== "undefined") {
					deferredModalResult['resolveWith'](viewModel, [result]);
				} else {
					deferredModalResult['rejectWith'](viewModel, []);
				}
			},
			BSModal: modal
		};
		$ui[0].addEventListener('show.bs.modal', function () {
			let zIndex = 1040 + (10 * $('.modal:visible').length),
				$fancyboxOpened = $('.fancybox-opened');
			if ($fancyboxOpened.length) {
				let zIndexFB = parseInt($fancyboxOpened.css('z-index'));
				if (zIndexFB) {
					zIndex = zIndexFB + 2;
				}
			}
			$(this).css('z-index', zIndex);
			setTimeout(function() {
				$('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
			}, 0);
		});
		modal.show();
		deferredModalResult.always(function () {
			modal.hide();
		});
		$ui[0].addEventListener('hidden.bs.modal', function () {
			$ui.each(function (index, element) { ko['cleanNode'](element); });
			$ui.remove();
			if (typeof viewModel['afterClose'] === 'function') {
				viewModel['afterClose'](viewModel);
			}
		});
		if (typeof viewModel['afterShow'] === 'function') {
			$ui[0].addEventListener('shown.bs.modal', function () {
				if (typeof viewModel['afterShow'] === 'function') {
					viewModel['afterShow'](viewModel);
				}
			});
		}
		return deferredModalResult;
	};

	return createHTMLElement(template, viewModel)
		.pipe($)
		.pipe(function ($ui) {
			viewModel.$BSModalDOM = $ui;
			if (isBootstrap) {
				return _createBSModal($ui, viewModel, options);
			}
			return _createFBModal($ui, viewModel, options);
		});
};

var simpleParticipant = function (participant) {
	var self = this;
	self.participant_id = participant.participant_id();
	self.dropdownLabel = participant.dropdownLabel();
	self.name = participant.name();
	self.disabled = ko.observable(false);
};

var simpleSiteGroup = function (site_group) {
	let self = this;
	self.site_group_id = site_group.site_group_id();
	self.dropdownLabel = site_group.name();
	self.name = site_group.name();
	self.participant_ids = site_group.participant_ids();
};

var SelectControl = function (parent) {
	var self = this;
	self.parent = parent;

	if (typeof self.parent['SelectControlOptions'] === 'undefined') {
		var participants = self.parent.participants(),
			participantsArray = [];
		self.parent.SelectControlParticipantsById = {};

		for (var i = 0; i < participants.length; i++) {
			(function (participants, i) {
				var participant = participants[i],
					participantObject = new simpleParticipant(participant);
				self.parent.SelectControlParticipantsById[ko.unwrap(participant.participant_id)] = participantObject;
				participantsArray.push(ko.pureComputed(function () {
					participantObject.disabled();
					return participantObject;
				}));
			})(participants, i);
		}
		//https://so.uplifter.vm/pages/synchro-comp/?sort=start_date
		//office@skateoakville.ca
		self.parent.SelectControlOptions = ko.observableArray(participantsArray);
	}
	self.options = self.parent.SelectControlOptions;

	self.participant_id = ko.observable();
	self.set_participant_id = ko.observable();
	self.participant_id.subscribe(function (val) {
		var old_participant_id = self.set_participant_id();
		if (old_participant_id !== val) {
			parent.order_item().category_level_id(null);
			if (old_participant_id) {
				self.parent.selectedParticipantIds.remove(old_participant_id);
				self.parent.SelectControlParticipantsById[old_participant_id].disabled(false);
			}
			if (val) {
				self.set_participant_id(val);
				self.parent.selectedParticipantIds.push(val);
				self.parent.SelectControlParticipantsById[val].disabled(true);
			}
		}
	});
	self.adjustDropdown = function () {
		this.$dropdown.height('');
		var $dropdown = this.$dropdown,
			$control = this.$control,
			windowInnerHeight = window.innerHeight,
			controlHeight = $control.outerHeight(true),
			dropDownHeight = $dropdown.height(),
			topSpace = this.settings.dropdownParent === 'body' ? $control.offset().top - window.scrollY : $control.position().top,
			bottomSpace = windowInnerHeight - topSpace - controlHeight;

		$dropdown.height(Math.min(dropDownHeight, bottomSpace));
	};

	self.error = ko.observable(false);
};

var SiteGroupSelectControl = function (parent) {
	var self = this;
	self.parent = parent;

	var site_groups = parent.root.siteGroupsBySiteGroupTypeId()[parent.order_item().product().site_group_type_id()] || [];
	var siteGroupsArray = [];
	self.parent.SelectControlSiteGroupsById = {};

	for (var i = 0; i < site_groups.length; i++) {
		(function (site_groups, i) {
			var siteGroup = site_groups[i];
			var siteGroupObject = new simpleSiteGroup(siteGroup);
			self.parent.SelectControlSiteGroupsById[ko.unwrap(siteGroup.site_group_id)] = siteGroupObject;
			siteGroupsArray.push(siteGroupObject);
		})(site_groups, i);
	}

	self.site_group_id = ko.observable();
	self.site_group_id.subscribe(function (val) {
		var old_site_group_id = self.parent.order_item().program_registration.site_group_id();
		if (old_site_group_id != val) {
			self.parent.order_item().category_level_id(null);
			if (old_site_group_id) {
				self.parent.selectedParticipantIds([]);
				self.parent.selectedParticipants([]);
				self.parent.order_item().program_registration.site_group_id(null);
			}
			if (val) {
				self.parent.order_item().program_registration.site_group_id(val);

				var siteGroup = ko.utils.arrayFirst(self.parent.root.site_groups(), function (item) {
					return item.site_group_id() == val;
				});

				ko.utils.arrayForEach(siteGroup.participant_ids(), function (id) {
					//may return null if select a site group that contains participants not eligible for this program
					if (self.parent.root.getParticipantById(id)) {
						self.parent.selectedParticipantIds.push(id);
						self.parent.selectedParticipants.push(self.parent.root.getParticipantById(id));
					}
				});

			}
		}
	});


	self.parent.SelectControlOptions = ko.observableArray(siteGroupsArray);
	self.options = self.parent.SelectControlOptions;

	self.adjustDropdown = function () {
		this.$dropdown.height('');
		var $dropdown = this.$dropdown,
			$control = this.$control,
			windowInnerHeight = window.innerHeight,
			controlHeight = $control.outerHeight(true),
			dropDownHeight = $dropdown.height(),
			topSpace = this.settings.dropdownParent === 'body' ? $control.offset().top - window.scrollY : $control.position().top,
			bottomSpace = windowInnerHeight - topSpace - controlHeight;
		$dropdown.height(Math.min(dropDownHeight, bottomSpace));
	};

	self.error = ko.observable(false);
};

var OrderItemEdit = function (order_item, root, suggestedParticipant) {
	var self = this;
	var _timeout;
	self.wasSkipped = ko.observable();
	self.root = root;
	self.errorsByKey = ko.observable([]);
	self.errors = ko['pureComputed'](function () {
		var errorsByKey = self.errorsByKey();
		return Object.keys(errorsByKey).map(function (key) {
			return errorsByKey[key];
		});
	});
	self.showAddParticipant = ko['pureComputed'](function () {
		return typeof self.errorsByKey()['noEnoughParticipants'] !== 'undefined';
	});
	self.warningsByKey = ko.observable([]);
	self.warnings = ko['pureComputed'](function () {
		let warningsByKey = self.warningsByKey(), showDropInOptions = self.order_item() ?  self.order_item().showDropInOptions() : false;
		return Object.keys(warningsByKey).filter(function (key) {
			return (key !== 'registrationFullDropIn' && key !== 'registrationFull') || (key === 'registrationFullDropIn' && showDropInOptions) || (key === 'registrationFull' && !showDropInOptions);
		}).map(function (key) {
			return warningsByKey[key];
		});
	});
	self.showViewCart = ko['pureComputed'](function () {
		return typeof self.warningsByKey()['registrationFull'] === 'undefined' && typeof self.warningsByKey()['addedToWaitlist'] === 'undefined' && !self.errors().length;
	});
	self.program_registration_id = ko.observable();
	self.requireSFS = ko.observable(true);
	self.itemAdded = ko.observable(false);
	self.onCheckout = ko.observable((typeof window.updateCheckout === 'function'));
	self.title = ko.observable();
	self.fromWaitList = ko.observable(false);
	self.order_item = ko.observable(order_item);
	self.cart_code = ko.observable();
	self.dropdowns = ko['observableArray']([]);

	//EVENTSQUARE//
	self.requiresMembershipValidation = ko.observable();
	self.requiredConnectionNames = ko['observableArray']([]);
	self.membershipConnectionsTooltip = ko.computed(function() {
		var names = self.requiredConnectionNames();
		if (!names || !names.length) {
			return "";
		}
		return interpolate(jsmsgRequiredMembershipsTooltip, [names.join(", ")]);
	});

	self.selectedParticipantIds = ko['observableArray']();
	self.selectedParticipants = ko['observableArray']();
	self.product = ko.observable(null);
	self.participants = (function () {
		var _participants = ko.observable();
		return ko.pureComputed({
			read: function () {
				var order_item = self.order_item();
				if (order_item) {
					var remove_participant_ids = [];
					var product_id = order_item.product_id();
					var order_item_id = order_item.order_item_id();
					var item_participant_ids = order_item.participant_ids();
					//we do allow duplicate participants for products
					if (order_item.registration() || (order_item.product() && order_item.product().subscription_id())) {
						root.order().order_items().forEach(function (item) {
							if (product_id && order_item_id !== item.order_item_id() && product_id === item.product_id()) {
								remove_participant_ids = remove_participant_ids.concat(item.participant_ids());
							}
						});
					}
					_participants(root.participants().filter(function (participant) {
						var participant_id = participant.participant_id();
						return remove_participant_ids.indexOf(participant_id) < 0 || item_participant_ids.indexOf(participant_id) >= 0;
					}));
				} else {
					_participants([]);
				}
				return _participants();
			},
			write: function (value) {
				_participants(value);
			},
			owner: self
		});
	})();
	self.next = ko.observable();
	self.itemNumber = ko.observable();
	self.itemsCount = ko.observable(1);
	self.itemsAddedCount = ko.observable(0);
	self.spots = ko.observable();
	self.spots_dropin = ko.observable();
	self.event_id = ko.observable();

	self.orderItemProduct = ko['pureComputed'](function () {
		var product;
		if (self.order_item()) {
			product = self.order_item().product();
		} else if (self.product()) {
			product = self.product();
		}
		return product;
	});

	self.addParticipant = function () {
		self.dropdowns.push(new SelectControl(self));
		updateFB();
	};

	self.removeParticipant = function (control) {
		self.dropdowns.remove(control);
		if (self.dropdowns().length === 0) {
			self.addParticipant();
		}
		updateFB();
	};

	self.siteGroupRemoveParticipant = function (participant) {
		self.selectedParticipantIds.remove(function (item) {
			return item == participant.participant_id();
		});

		self.selectedParticipants.remove(function (item) {
			return item.participant_id() == participant.participant_id();
		});
	};

	self.showAddIcon = ko.pureComputed(function () {
		return (
			self.dropdowns().length < self.order_item().product().program.maximum_participants_per_registration() && self.dropdowns().length < self.participants().length
		);
	});
	let _submitting = ko.observable(false);
	self.processing = ko['pureComputed'](function () {
		return _submitting() || (root && root['loadingSiteFields']());
	});

	self.allowSaveErrorMessage = ko.computed(function () {
		if (!self.order_item() || self.processing() || self.order_item().apply_to() !== 'participant') {
			return null;
		}
		if (self.order_item().product().site_group_type_id() && !self.order_item().program_registration.site_group_id()) {
			return 'You need to select a ' + self.order_item().product().site_group_type.local_string[lang].content() + '.';
		}

		var msg = self.selectedParticipantIds().length + ' participants selected. You must select ';
		var plural = false;

		if (self.order_item().product().program) {
			if (self.order_item().product().program.minimum_participants_per_registration() != self.order_item().product().program.maximum_participants_per_registration()) {
				msg += 'between ' + self.order_item().product().program.minimum_participants_per_registration() + ' and ' + self.order_item().product().program.maximum_participants_per_registration();
				plural = true;
			} else {
				msg += self.order_item().product().program.minimum_participants_per_registration();
				if (self.order_item().product().program.minimum_participants_per_registration() > 1) {
					plural = true;
				}
			}
			msg += ' participant' + (plural ? 's' : '') + '.';

			return msg;
		}
	});

	self.enableChooseParticipant = ko.pureComputed(function () {
		return self.selectedParticipantIds().length >= self.order_item().product().program.minimum_participants_per_registration();
	});
	var _validate = function () {
		var oi = self.order_item();
		var errors = [];
		if (oi.apply_to() === 'participant') {
			var product = oi.product(),
				constraints = ko.mapping.toJS(product['constraints']);
			var result = validate.single(oi.participant_ids().length, constraints);
			if (result) {
				errors = errors.concat(result);
			}
		}
		if (self.requireSFS()) {
			oi.site_field_values().forEach(function (sfv) {
				var result = sfv.validate();
				if (result.length) {
					errors = errors.concat(result);
				}
			});
		}
		if(!oi.order_item_id() && oi.isDropInProgram() && oi.drop_in_events_selected().length === 0 && !oi.selectedEvent()) {
			errors.push(jsmsgMustSelectEvent);
		}
		self.errorsByKey(errors);
		updateFB();
		return self.errorsByKey().length === 0;
	};
	self.processed = ko.observable();
	self.processedWithError = ko.observable();
	var processOrderItem = function (data, action) {
		_submitting(true);
		var formData = new FormData();
		formData.append('action', action);
		formData.append('step', '1');
		formData.append('order_item_id', data.order_item_id());
		formData.append('onCheckout', self.onCheckout());
		formData.append('qty', data.qty());
		if(data.isDropInProgram()) {
			var event_ids = data.drop_in_events_selected();
			for(var i = 0, iLen = event_ids.length; i < iLen; i++) {
				formData.append('event_ids[]', event_ids[i]);
			}
		}

		/* Please be carefully with these variable names (back compatibility)*/
		var product = data.product();
		if (product.subscription) {
			formData.append('subscriptionId', product.subscription.subscription_id());
		} else {
			formData.append('productId', product.product_id());
		}
		if (data.registration()) {
			if(self.cart_code()) {
				formData.append('cart_code', self.cart_code());
			}
			self.selectedParticipantIds().forEach(function (id) {
				formData.append('participantIds[]', id);
			});
			formData.append('site_group_id', self.order_item().program_registration.site_group_id());
			formData.append('program_registration_id', self.program_registration_id());
		} else {
			//there should be only one...so this is fine
			self.selectedParticipantIds().forEach(function (id) {
				formData.append('participantId', id);
			});
		}
		if (self.fromWaitList()) {
			formData.append('program_registration_id', data.program_registration.program_registration_id());
		}
		formData.append('context_id', data.context_id());
		var sfvs = data.site_field_values();
		if (sfvs.length) {
			sfvs.forEach(function (sfv) {
				sfv.addToFormData(formData);
			});
		}
		UP.Services.AjaxPostMultipartForm('/registration/checkout/', formData, function (response) {
			_submitting(false);
			self.errorsByKey([]);
			self.warningsByKey([]);
			if (response.errors) {
				self.errorsByKey(response.errors);
				self.processedWithError(true);
				updateFB();
				$('.popBody').scrollTop(0);
				return;
			}
			if (typeof self.processed() === 'function') {
				self.deferredResult.resolve(true);
				self.processed()(response);
			}
		});

	};
	self.wasCanceled = ko.observable(false);
	self.processModal = function (process, data, action) {
		if (process) {
			if (_validate()) {
				processOrderItem.call(self, data, action);
			} else {
				$('.popBody').scrollTop(0);
			}
		} else {
			self.wasCanceled(true);
			if (self.onCheckout()) {
				window.updateURL();
			} else if (self.fromWaitList()) {
				location.reload();
			} else {
				self.deferredResult.resolve(false);
				$.fancybox.close();

				if (typeof window.queueReload !== 'undefined' && window.queueReload) {
					$.fancybox.showLoading();
					window.location.reload(true)
				}
			}
		}
	};

	function removeProgramRegistration() {
		var program_registration_id = self.program_registration_id();
		if (program_registration_id) {
			$.ajax({
				type: 'POST',
				dataType: 'json',
				async: false,
				url: '/registration/checkout/',
				data: {
					action: 'RemoveProgramRegistration',
					program_registration_id: program_registration_id,
					step: 1
				}
			});
		}
	}

	self.afterShow = function () {
		var program_registration_id = self.program_registration_id();
		if (program_registration_id) {
			var keepAlive = function () {
				$.ajax({
					type: 'GET',
					url: '/ajax/keep-alive.php?' + $.param({program_registration_id: program_registration_id}),
					success: function () {
						if (_timeout !== false) {
							_timeout = setTimeout(keepAlive, 120000);
						}
					},
					error: function () {
						if (_timeout !== false) {
							_timeout = setTimeout(keepAlive, 5000);
						}
					},
					timeout: 10000,
					dataType: 'json'
				});
			};
			if (!_timeout) {
				_timeout = setTimeout(keepAlive, 120000);
				window.addEventListener('beforeunload', removeProgramRegistration);
			}
		}
		if (typeof window.enableAddToCartButton === 'function') {
			window.enableAddToCartButton();
			window.enableAddToCartButton = null;
		}
	};
	var _hasClosed = false;
	self.afterClose = function () {
		if (!_hasClosed) {
			var program_registration_id = self.program_registration_id();
			if (program_registration_id) {
				clearTimeout(_timeout);
				_timeout = false;
				if (!self.itemAdded() && !self.fromWaitList() && !self.warningsByKey()['addedToWaitlist']) {
					removeProgramRegistration();
				}
				window.removeEventListener('beforeunload', removeProgramRegistration);
			}
			if (self.itemAdded() && !self.next()) {
				OrderItemEdit.itemsAdded = [];
			}
			if (self.itemsCount() > 1 && self.wasCanceled() && OrderItemEdit.itemsAdded.length) {
				var data = {
					action: 'RemoveOrderItems',
					order_item_ids: OrderItemEdit.itemsAdded
				};
				UP.Services.AjaxPostCall('/registration/checkout/', data, function (response) {
					OrderItemEdit.itemsAdded = [];
					if (response['updateCount']) {
						updateCartCount(response.count);
					}
				});
			}
			_hasClosed = true;
		}
	};
	self.matchingModalCancelCallback = function (participant, create_participant) {
		self.addNewParticipant(participant, null, null, create_participant);
	};
	self.matchingParticipantCallback = function (response) {
		var oi = self.order_item();
		if (oi.apply_to() !== 'participant') {
			return;
		}
		var participant_ids = {};
		self.dropdowns().forEach(function (dropdown, index) {
			participant_ids[index] = dropdown.set_participant_id();
		});
		updateParticipants(response, participant_ids);
		if(response.userParticipant) {
			viewUser.alreadyParticipant = true;
		}
		self.open();
	};
	self.getAddParticipantURL = function (formData) {
		formData.append('action', 'CreateParticipant');
		formData.append('step', '1');
		return '/registration/checkout/'
	};
	self.getFindParticipantURL = function (formData) {
		formData.append('action', 'FindParticipant');
		formData.append('step', '1');
		return '/registration/checkout/'
	};
	self.getMatchParticipantURL = function (formData) {
		formData.append('action', 'SelectParticipant');
		formData.append('step', '1');
		return '/registration/checkout/'
	};
	self.getMatchFindParticipantURL = function (formData) {
		formData.append('action', 'SelectFindParticipant');
		formData.append('step', '1');
		return '/registration/checkout/'
	};
	self.findParticipant = function(participant, cancelClose) {
		self.addNewParticipant(participant, cancelClose, true);
	};
	self.addNewParticipant = function (participant, cancelClose, findOnly, create_participant) {
		var oi = self.order_item();
		if (oi.apply_to() !== 'participant') {
			return;
		}
		var addParticipant = new AddParticipant(participant, null, null, self, findOnly, create_participant);
		addParticipant.afterShow = function () {
			self.afterShow();
		};
		addParticipant.afterClose = function () {
			_hasClosed = true;
			self.afterClose();
			_hasClosed = false;
		};
		var participant_ids = {};
		self.dropdowns().forEach(function (dropdown, index) {
			participant_ids[index] = dropdown.set_participant_id();
		});
		$.fancybox.showLoading();
		_hasClosed = true;
		addParticipant.open().then(function (response) {
			if(response || !cancelClose) {
				_hasClosed = false;
				updateParticipants(response, participant_ids);
				self.open();
			} else {
				$.fancybox.close();
			}
		});
	};
	self.addAddress = function (addParticipant) {
		let addAddress = new AddAccountAddress();
		addAddress.afterShow = function () {
			self.afterShow();
		};
		addAddress.afterClose = function () {
			self.afterClose();
		};
		addAddress.open().then(function (response) {
			if (response) {
				if (response['account_address']) {
					viewUser.address = response['account_address'].address;
				}
				if (typeof addParticipant === 'function') {
					addParticipant();
				} else {
					self.open();
				}
			} else {
				$.fancybox.close();
			}
		});
	};

	self.displaySFVS = ko['pureComputed'](function () {
		let oi = self.order_item(),
			sfvs = oi.site_field_values()||[];
		return self.requireSFS() && (sfvs.length > 1 || (sfvs.length === 1 && sfvs[0].displaySFV()));
	});

	(ko.unwrap((order_item || {}).drop_in_events || [])).forEach(function (event) {
		let oi = self.order_item();
		if (oi) {
			let product = oi.product();
			if (product) {
				let max_registrations = product.program['max_registrations'](),
					max_dropin_registrations = product.program['max_dropin_registrations'](),
					max_full_registrations = product.program['max_full_registrations'](),
					max_waitlist = product.program['max_waitlist'](),
					max_dropin_waitlist = product.program['max_dropin_waitlist'](),
					max_full_waitlist = product.program['max_full_waitlist'](),
					qty_registered = event.qty_registered(),
					qty_waitlisted = event.qty_waitlisted();

				event.canRegister = ko.pureComputed(function () {
					return (
						(max_registrations === null || qty_registered < Math.min(max_registrations, max_full_registrations || max_registrations)) &&
						(max_dropin_registrations === null || qty_registered < max_dropin_registrations)
					)
				});
				event.canWaitlist = ko.pureComputed(function () {
					return (
						(max_waitlist === null || qty_waitlisted < Math.min(max_waitlist, max_full_waitlist || max_waitlist)) &&
						(max_dropin_waitlist === null || qty_waitlisted < max_dropin_waitlist)
					);
				});
			}
		}
	});

	function updateParticipants(response, participant_ids) {
		var oi = self.order_item(), participant = null, simple = null, errorsByKey = self.errorsByKey(), toReplace;
		if (oi.apply_to() !== 'participant') {
			return;
		}
		if (response.participant) {
			participant = new Participant({data: response.participant, parent: root});
			simple = new simpleParticipant(participant);
			/** Add/replace participant in all places */
			self.SelectControlParticipantsById[participant['participant_id']()] = simple;
			if (!response.target || (response.target && response.target === 'createNew')) {
				root.participants.push(participant);
				if (typeof window.updateCheckout === 'function') {
					window.updateCheckout({participant: response.participant});
				}
			} else {
				toReplace = root.participants().find(function (p) {
					return p.participant_id() === participant.participant_id();
				});
				root.participants.replace(toReplace, participant);
				if (typeof window.updateCheckout === 'function') {
					window.updateCheckout({participant: response.participant}, null, true);
				}
			}
			if (oi.registration()) {
				self.dropdowns().forEach(function (dropdown) {
					if (!response.target || (response.target && response.target === 'createNew')) {
						dropdown.options.push(ko['pureComputed'](function () {
							simple.disabled();
							return simple;
						}));
					} else {
						toReplace = dropdown.options().find(function (opt) {
							return opt().participant_id === participant.participant_id();
						});
						dropdown.options.replace(toReplace, ko['pureComputed'](function () {
							simple.disabled();
							return simple;
						}));
					}
				});
			} else {
				if (!response.target || (response.target && response.target === 'createNew')) {
					oi.dropdown.options.push(ko['pureComputed'](function () {
						simple.disabled();
						return simple;
					}));
				} else {
					toReplace = oi.dropdown.options().find(function (opt) {
						return opt().participant_id === participant.participant_id();
					});
					oi.dropdown.options.replace(toReplace, ko['pureComputed'](function () {
						simple.disabled();
						return simple;
					}));
				}
				delete errorsByKey['noEnoughParticipants'];
				self.errorsByKey(errorsByKey);
			}
			/** Remove 'noEnoughParticipants' error */
			if ((oi.registration() && parseInt(root.participants().length, 10) >= parseInt(oi.product().program['minimum_participants_per_registration'](), 10)) || (!oi.registration() && root.participants().length)) {
				delete errorsByKey['noEnoughParticipants'];
				self.errorsByKey(errorsByKey);
			}
		}

		/** back-populate/populate participant dropdowns */
		if (oi.registration()) {
			if (participant) {
				var index = _.toArray(participant_ids).indexOf('' + participant.participant_id());
				participant_ids[index !== -1 ? index : 0] = participant.participant_id()
			}
			self.dropdowns().forEach(function (dropdown, index) {
				var participant_id = participant_ids[index];
				if (participant_id) {
					dropdown.participant_id(participant_id);
					self.selectedParticipantIds.push(participant_id);
				}
			});
		} else {
			var participant_id = participant_ids[0];
			if (participant) {
				participant_id = participant.participant_id();
			}
			if (participant_id) {
				oi.dropdown.participant_id(participant_id);
				self.selectedParticipantIds.push(participant_id)
			}
		}
	}

	self.skip = function () {
		if (self.itemsCount() > 1) {
			var next = self.next();
			if (next) {
				if (next.constructor.name === 'ProductOrderItemEdit') {
					self.wasSkipped(true);
					$.fancybox.close();
				} else {
					next.open();
				}
			} else {
				$.fancybox.close();
			}
		}
	};
	self.beforeOpen = ko.observable();
	self.open = function () {
		let beforeOpen = self.beforeOpen();
		self.beforeOpen(null);
		if (typeof beforeOpen === 'function') {
			beforeOpen();
		} else {
			let oi = self.order_item(), event_id = self.event_id();
			if (oi && oi.canToggleDropIn() && (event_id || !oi.canToggleFullProgram() || (parseInt(self.spots()) === 0 && parseInt(self.spots_dropin()) > 0))) {
				oi.toggleDropIn();
				if (event_id) {
					let event = oi.drop_in_events().find(function(event) {
						return event.event_id() === event_id;
					});
					if(event && (event.canRegister() || event.canWaitlist())) {
						let option = oi.selectedDropInEvent(event_id);
						if (ko['isObservable'](option)) {
							option(true);
						}
					}
				}
			}
			return showModal({
				template: 'editOrderItemTemp',
				viewModel: self
			});
		}
	};

	/*Initialization*/
	if (order_item) {
		if (order_item.registration()) {
			var participant_ids = order_item.participant_ids() || [];
			if (participant_ids.length) {
				if (!order_item.product().site_group_type_id()) {
					participant_ids.forEach(function (id) {
						var dropdown = new SelectControl(self);
						self.dropdowns.push(dropdown);
						dropdown.participant_id(id);
					});
				} else {
					var dropdown = new SiteGroupSelectControl(self);
					dropdown.site_group_id(order_item.program_registration.site_group_id());
					self.dropdowns.push(dropdown);
					participant_ids.forEach(function (id) {
						self.selectedParticipantIds.push(id);
						self.selectedParticipants.push(self.root.getParticipantById(id));
					});
				}
			} else {
				if (!order_item.product().site_group_type_id()) {
					var dropdown = new SelectControl(self);
					self.dropdowns.push(dropdown);
					if (order_item.product().program['maximum_participants_per_registration']() === 1) {
						if (suggestedParticipant !== null) {
							dropdown.participant_id(suggestedParticipant.participant_id);
						} else if (self.participants().length === 1) {
							dropdown.participant_id(self.participants()[0].participant_id());
						}
					}
				} else {
					var dropdown = new SiteGroupSelectControl(self);
					self.dropdowns.push(dropdown);
				}
			}

		} else if (order_item.apply_to() === 'participant') {
			order_item.dropdown = new SelectControl(self);
			var participant_id = order_item.participant_id();
			if (participant_id) {
				order_item.dropdown.participant_id(participant_id);
			}
		}
		order_item.popup(self);
		updateFB();
	}
};
OrderItemEdit.itemsAdded = [];

var updateCartCount = (function () {
	return function (count) {
		if (typeof OrderItemCount === 'object' && typeof OrderItemCount['order_item_count'] === 'function') {
			if (parseInt(count, 10) >= 0) {
				OrderItemCount.order_item_count(count);
			}
		}
	}
})();

var getOrderItems = (function () {
	return function (data, callback) {
		if (data.productId || data.subscriptionId || data.program_registration_id || data.action) {
			var url = '/registration/checkout/';
			data.step = 1;
			data.action = 'GetOrderItem';
			data.ajaxLogin = true;
			UP.Services.AjaxPostCall(url, data, function (response) {
				var vms = [];
				if (response.success) {
					if (response['updateCount']) {
						updateCartCount(response.count);
						if (typeof window.updateCheckout === 'function') {
							window.updateCheckout(response)
						}
						let oi_ids = response['oi_ids']||[];
						if (oi_ids.length) {
							OrderItemEdit.itemsAdded = OrderItemEdit.itemsAdded.concat(oi_ids);
						}
						var vm = new OrderItemEdit();
						vm.product(response.product ? new Product(response.product) : null);
						vm.itemAdded(oi_ids.length > 0);
						vm.itemsAddedCount(OrderItemEdit.itemsAdded.length);
						if (parseInt(data.qty) > 1 && vm.itemAdded() && response.warnings) {
							vm.warningsByKey(response.warnings);
						}
						vms.push(vm);
					} else {
						var orderData = {
							order: response.order,
							products: response.products,
							site_fields: response.site_fields,
							site_field_values: response.site_field_values,
							participants: response.participants,
							site_groups: response.site_groups
						};
						var orderCommon = new OrderCommon(orderData);
						var vms = orderCommon.order().order_items().map(function (oi) {
							if (oi.registration() && data.participantIds) {
								var max = oi.product().program['maximum_participants_per_registration']();
								var count = 0;
								for (var i = 0, len = data.participantIds.length; i < len; i++) {
									var id = data.participantIds[i];
									if (orderCommon.getParticipantById(id)) {
										oi.program_registration.program_registration_participants.push(new ProgramRegistrationParticipant({participant_id: id}, orderCommon));
										count++;
									}
									if (count >= max) {
										break;
									}
								}
							} else if (oi.product() && oi.product().apply_to() === 'participant' && data.participantId && orderCommon.getParticipantById(data.participantId)) {
								oi.participant_id(data.participantId);
							}
							var vm = new OrderItemEdit(oi, orderCommon, response['suggestedParticipant'] || null);
							vm.participants(orderCommon.participants());
							vm.title(response.title);
							vm.requireSFS(response.requireSFS);
							vm.fromWaitList(response.fromWaitList || false);
							vm.warningsByKey(response.warnings || []);
							vm.errorsByKey(response.errors || []);
							vm.program_registration_id(response.program_registration_id || null);
							vm.showAdd = ko.observable(response.showAdd);
							vm.showFind = ko.observable(response.showFind);
							vm.spots(response.spots);
							vm.spots_dropin(response.spots_dropin);
							vm.event_id(response.event_id||null);
							vm.requiresMembershipValidation(response.showMembershipValidationFooter || false);
							vm.requiredConnectionNames(response.requiredConnectionNames || []);
							return vm;
						});
						for (var i = 0, len = vms.length; i < len; i++) {
							vms[i].itemNumber(i + 1);
							vms[i].itemsCount(data.qty||0);
							if (vms[i + 1]) {
								vms[i].next(vms[i + 1]);
							}
							if (i === 0) {
								let addParticipant, addAddress;
								if (response.addParticipant) {
									addParticipant = function () {
										let self = this,
											showAdd = ko.unwrap(self.showAdd),
											showFind = ko.unwrap(self.showFind);
										if(showAdd && !showFind || (showAdd && showFind)) {
											self.addNewParticipant(null);
										} else if(!showAdd && showFind) {
											self.findParticipant(null, true);
										}
									}.bind(vms[i]);
								}
								if (window['require_address'] && !viewUser.address) {
									addAddress = function (addParticipant) {
										let self = this;
										self.addAddress(addParticipant);
									}.bind(vms[i]);
								}
								if (typeof addParticipant === 'function' || typeof addAddress === 'function') {
									vms[i].beforeOpen(function () {
										if (addAddress) {
											addAddress(addParticipant);
										} else {
											addParticipant();
										}
									});
								}
							}
						}
					}
				} else {
					var vm = new OrderItemEdit();
					vm.product(response.product ? new Product(response.product) : null);
					vm.errorsByKey(response.errors || []);
					vms.push(vm);
				}
				if (typeof callback === 'function') {
					callback(vms);
				}
			});
		}
	}
})();
let AddAccountAddress = function (account_address) {
	let self = this;
	self.showWarning = ko.observable(true);
	account_address = account_address ? new AccountAddress({data: ko.mapping.toJS(account_address), parent: self}, self) : new AccountAddress({data: {}, parent: self}, self);
	if (!account_address.address.address_id()) {
		account_address.address.first_name(window.viewUser.first_name);
		account_address.address.last_name(window.viewUser.last_name);
		account_address.address.email(window.viewUser.email);
	}
	self.account_address = ko.observable(account_address);
	self.saveAccountAddress = function (form) {
		let account_address = self.account_address(),
			address_id = account_address.address.address_id(),
			data = {
				action: address_id ? 'EDIT_ACCOUNT_ADDRESS' : 'ADD_ACCOUNT_ADDRESS',
				account_address: ko.mapping.toJS(account_address)
			};
		if (address_id && JSON.stringify(account_address.getOriginalData()) === JSON.stringify(data.account_address)) {
			$.fancybox.close();
			return;
		}
		UP.Services.AjaxPostCall(window.adminScope ? '/admin/users/?user=' + window.viewUser.user_id : '/users/', data, function (response) {
			if (response.errors) {
				return AccountAddress.parseErrors(response.errors, $(form));
			}
			self.deferredResult.resolve(response);
		});
	};
	self.cancel = function () {
		self.deferredResult.resolve(0);
	};
	self.open = function () {
		return showModal({
			template: 'addAddressModalTemp',
			viewModel: self,
			maxWidth: '400px'
		});
	};
};

var addToCartAjax = function (data) {
	let clearEventCache = function (editOrderItem) {
		if (editOrderItem.event_id() && window.calendar) {
			window.clearEventCache = 'currentView';
			window.calendar.refetchEvents();
		}
	};
	getOrderItems(data, function (response) {
		response.forEach(function (oie) {
			var afterShow = oie.afterShow;
			oie.afterShow = (function () {
				var self = this;
				afterShow.call(self, arguments);
				if (self.itemAdded()) {
					clearEventCache(self);
					if (self.onCheckout()) {
						if (typeof window.updateURL === 'function') {
							window.updateURL();
						}
						if (typeof window.updateCheckout === 'function') {
							window.updateCheckout(response);
						}
					}
					setTimeout(function () {
						if ($.fancybox.viewModel === self) {
							$.fancybox.close();
						}
					}, 3000);
				}
			}).bind(oie);
			oie.processed((function (response) {
				let self = this;
				let next = self.next();

				self.order_item(null);
				if (response['product'] && typeof updateProduct === 'function') {
					updateProduct(response.product);
				}
				if (response['updateCount']) {
					updateCartCount(response.count);
				}
				let oi_ids =response['oi_ids']||[];
				if (oi_ids) {
					OrderItemEdit.itemsAdded = OrderItemEdit.itemsAdded.concat(response['oi_ids']||[]);
				}
				if (self.onCheckout()) {
					if (typeof window.updateURL === 'function') {
						window.updateURL();
					}
					if (typeof window.updateCheckout === 'function') {
						window.updateCheckout(response);
					}
				}
				if (!next) {
					if (oi_ids.length) {
						self.itemAdded(true);
						clearEventCache(self);
					}
					self.itemsAddedCount(OrderItemEdit.itemsAdded.length);
					if (response.warnings) {
						self.warningsByKey(response.warnings);
					} else if (!self.fromWaitList()) {
						setTimeout(function() {
								if ($.fancybox.viewModel === self) {
									$.fancybox.close();
								}
								if (typeof window.queueReload !== 'undefined') {
									location.reload()
								}
						}, 3000);
					}
					self.afterClose();
				} else {
					next.open();
				}
				updateFB();
			}).bind(oie));
		});
		response[0].open();
	});
};

function closeToolTips () {
	$('.tooltipstered').each(function() {
		var $this = $(this), init = $this.data('tooltip-init');
		if (init) {
			$this.tooltipster('close');
		}
	});
}

var ProductOrderItemEdit = function (product_id) {
	var self = this;
	self.product_id = ko.observable(product_id);
	self.next = ko.observable();
	self.onCheckout = ko.observable((typeof window.updateCheckout === 'function'));
	self.itemNumber = ko.observable();
	self.itemsCount = ko.observable();
	self.load = function () {
		var _load = function () {
			if (ProductOrderItemEdit.skipableItems.indexOf(self.product_id()) !== -1 && self.next()) {
				self.next().load();
				return;
			}
			var _itemAdded = false;
			var data = {
				productId: self.product_id(),
				onCheckout: self.onCheckout()
			};
			if (self.product_id() === ProductOrderItemEdit.firstProduct) {
				ProductOrderItemEdit.participantsCache = [];
			}
			if (ProductOrderItemEdit.participantsCache.length) {
				data.participantIds = ProductOrderItemEdit.participantsCache;
				data.participantId = ProductOrderItemEdit.participantsCache[0];
			}
			getOrderItems(data, function (response) {
				var oie = response[0];
				oie.itemsAddedCount(OrderItemEdit.itemsAdded.length);
				oie.onCheckout(self.onCheckout());
				oie.next(self.next());
				oie.itemNumber(self.itemNumber());
				oie.itemsCount(self.itemsCount());
				var afterShow = oie.afterShow;
				oie.afterShow = (function () {
					var self = this;
					afterShow.call(self, arguments);
					if (self.itemAdded()) {
						setTimeout($.fancybox.close, 3000);
					}
				}).bind(oie);
				if (oie.next()) {
					var afterClose = oie.afterClose;
					oie.afterClose = (function () {
						var self = this;
						self.itemAdded(_itemAdded);
						afterClose.call(self, arguments);
						if (self.wasSkipped() || (!self.wasCanceled() && self.itemAdded())) {
							self.next().load();
						}
					}).bind(oie);
				}
				oie.processed((function (response) {
					var self = this;
					var next = self.next();
					var oi = self.order_item();
					self.order_item(null);
					if (response['updateCount']) {
						updateCartCount(response.count);
					}
					if (typeof window.updateCheckout === 'function') {
						window.updateCheckout(response)
					}
					if (response['updateCount'] && (!response.warnings || (!response.warnings['registrationFull'] && !response.warnings['addedToWaitlist']))) {
						_itemAdded = true;
						if (ProductOrderItemEdit.firstProduct === null) {
							ProductOrderItemEdit.firstProduct = oi.product_id();
						}
						if (oi.apply_to() === 'participant' && !_.isEqual(ProductOrderItemEdit.participantsCache, oi.participant_ids())) {
							ProductOrderItemEdit.participantsCache = oi.participant_ids();
						}
					}
					if (response['oi_ids']) {
						OrderItemEdit.itemsAdded = OrderItemEdit.itemsAdded.concat(response['oi_ids']||[]);
					}
					if (next) {
						$.fancybox.close();
					} else {
						self.itemAdded(_itemAdded);
						self.itemsAddedCount(OrderItemEdit.itemsAdded.length);
						if (!self.fromWaitList()) {
							setTimeout(function() {
								$.fancybox.close();
								if (typeof window.queueReload !== 'undefined') {
									location.reload()
								}
							}, 3000);
						}
						self.afterClose();
					}
					updateFB();
				}).bind(oie));

				if (oie.itemAdded() && oie.next()) {
					if (ProductOrderItemEdit.firstProduct === null) {
						ProductOrderItemEdit.firstProduct = self.product_id();
					}
					if (oie.product() && oie.product().apply_to() === 'account' && oie.product()['subscription_id']) {
						if (ProductOrderItemEdit.skipableItems.indexOf(oie.product().product_id()) === -1) {
							ProductOrderItemEdit.skipableItems.push(oie.product().product_id());
						}
					}
					oie.next().load();
				} else {
					oie.open();
				}
			}, true);
		};
		window.requestAnimationFrame(_load);
	};
};
ProductOrderItemEdit.firstProduct = null;
ProductOrderItemEdit.participantsCache = [];
ProductOrderItemEdit.skipableItems = [];

$(document).on('submit', 'form.addToCartAjax, form[action="/registration/checkout.php"], form[action="/registration/checkout/"]', function (e) {
	var scope = parent.$('#editOrderItemTemp') !== 'undefined' && typeof parent.addToCartAjax === 'function' ? parent : window;
	e.preventDefault();
	var data = {};
	if (this.qty) {
		var $qty = $(this.qty);
		if ($qty.val() === '' || !parseInt($qty.val(), 10)) {
			$qty.val(1);
		}
		data.qty = $qty.val();
	}
	if (this.product_id) {
		data.productId = $(this.product_id).val();
	} else if (this.productId) {
		data.productId = $(this.productId).val();
	} else if (this.elements['product_id[]']) {
		if (this.elements['product_id[]'].length) {
			var productId = [];
			this.elements['product_id[]'].forEach(function (input) {
				var val = $(input).val();
				if (parseInt(val, 10) > 0) {
					productId.push(val);
				}
			});
			if (productId.length) {
				if (productId.length === 1) {
					data.productId = productId[0];
				} else {
					data.productId = productId;
				}
			}
		} else {
			data.productId = $(this.elements['product_id[]']).val();
		}
	}
	if (this.subscription_id) {
		data.subscriptionId = $(this.subscription_id).val();
	} else if (this.subscriptionId) {
		data.subscriptionId = $(this.subscriptionId).val();
	}
	if (this.program_registration_id) {
		data.program_registration_id = $(this.program_registration_id).val();
	}
	if (this.event_id) {
		data.event_id = $(this.event_id).val();
	}
	closeToolTips();
	let $addToCartAjaxForms = $('form.addToCartAjax input[type="submit"]').prop('disabled', true);
	window.enableAddToCartButton = (function () {
		return function () {
			$addToCartAjaxForms.prop('disabled', false);
		}
	})();
	$addToCartAjaxForms.prop('disabled', true);
	if (Array.isArray(data.productId)) {
		var vms = [], i, len;

		for (i = 0, len = (data.qty||1); i < len; i++) {
			data.productId.forEach(function (id) {
				vms.push(new ProductOrderItemEdit(parseInt(id, 10)));
			});
		}
		for (i = 0, len = vms.length; i < len; i++) {
			vms[i].itemNumber(i + 1);
			vms[i].itemsCount(len);
			if (vms[i + 1]) {
				vms[i].next(vms[i + 1]);
			}
		}
		vms[0].load();
	} else {
		scope.addToCartAjax(data);
	}
	return false;
});

var AddParticipant = function (participant, site_group_type_id, site_group_id, root, findOnly, create_participant) {
	var self = this;
	var _participantSample = window['participantSample'] || {};
	self.participant = ko.observable();
	let _clubPoliciesById = ko.onDemandObservable(function () {
		_clubPoliciesById(AddParticipant.clubPoliciesById);
		let get = {
			action: 'GetFormInfo',
			type: 'policies',
			user: viewUser.user_id
		};
		let url = window['adminScope'] ? '/admin/users/add-child.php' : '/users/add-child.php';
		UP.Services.AjaxGetCall(url, get, function (response) {
			let clubPoliciesById = {};
			Object.keys(response).forEach(function (id) {
				clubPoliciesById[id] = new ClubPolicy(response[id]);
			});
			AddParticipant.clubPoliciesById = clubPoliciesById;
			_clubPoliciesById(AddParticipant.clubPoliciesById);
			updateFB();
		});
	}, self);

	self.getClubPolicyById = function (id) {
		if (AddParticipant.clubPoliciesById[id]) {
			return AddParticipant.clubPoliciesById[id];
		} else if (typeof root['getClubPolicyById'] === 'function' && root['getClubPolicyById'](id)) {
			AddParticipant.clubPoliciesById[id] = root['getClubPolicyById'](id);
			return AddParticipant.clubPoliciesById[id];
		}
		return _clubPoliciesById()[id];
	};

	self.participant(!participant ? new Participant({data: $.extend({}, _participantSample, findOnly ? {lookUp: true} : {}), parent: self}) : participant);
	var site_field_ids = Object.keys(_participantSample['site_field_values'] || {});
	if (typeof root['getSiteFieldById'] === 'function') {
		site_field_ids.forEach(function (site_field_id) {
			var sf = root['getSiteFieldById'](site_field_id);
			if (sf) {
				AddParticipant.siteFieldsById[site_field_id] = sf;
			}
		});
	}

	var _siteFieldsById = ko.onDemandObservable(function () {
		_siteFieldsById(AddParticipant.siteFieldsById);
		var loaded = Object.keys(AddParticipant.siteFieldsById);
		var diff = _.difference(site_field_ids, loaded);
		if (diff.length) {
			var get = {
				action: 'GetFormInfo',
				type: 'site_fields',
				user: viewUser.user_id,
				site_field_ids: diff
			};
			var url = window['adminScope'] ? '/admin/users/add-child.php' : '/users/add-child.php';
			UP.Services.AjaxGetCall(url, get, function (response) {
				Object.keys(response).forEach(function (site_field_id) {
					AddParticipant.siteFieldsById[site_field_id] = new SiteField(response[site_field_id], self);
				});
				_siteFieldsById(AddParticipant.siteFieldsById);
				updateFB();
			});
		}
	}, self);
	self.getSiteFieldById = function (site_field_id) {
		if (AddParticipant.siteFieldsById[site_field_id]) {
			return AddParticipant.siteFieldsById[site_field_id];
		}
		return _siteFieldsById()[site_field_id];
	};

	var _participantFieldsByName = ko.onDemandObservable(function () {
		_participantFieldsByName(AddParticipant.siteParticipantFieldByName);
		var get = {
			action: 'GetFormInfo',
			type: 'participant_fields',
			user: viewUser.user_id
		};
		var url = window['adminScope'] ? '/admin/users/add-child.php' : '/users/add-child.php';
		UP.Services.AjaxGetCall(url, get, function (response) {
			var participantFieldsByName = {};
			Object.keys(response).forEach(function (index) {
				var spf = new SiteParticipantField({data: response[index]});
				participantFieldsByName[spf['field_name']()] = spf;
			});
			AddParticipant.siteParticipantFieldByName = participantFieldsByName;
			_participantFieldsByName(AddParticipant.siteParticipantFieldByName);
			updateFB();
		});
	}, self);
	self.getSiteParticipantFieldByName = function (name) {
		if (typeof root['getSiteParticipantFieldByName'] === 'function' && typeof root['getSiteParticipantFieldByName'](name)) {
			AddParticipant.siteParticipantFieldByName[name] = root['getSiteParticipantFieldByName'](name);
			return AddParticipant.siteParticipantFieldByName[name];
		} else if (AddParticipant.siteParticipantFieldByName[name]) {
			return AddParticipant.siteParticipantFieldByName[name];
		}
		return _participantFieldsByName()[name];
	};

	self.openClubPolicy = function (orderPolicy) {
		orderPolicy.closeCallback(function () {
			if (orderPolicy.isDisabled()) {
				orderPolicy.resetPolicy();
			}
			orderPolicy.modal.close();
		});
		orderPolicy.open();
	};
	let _lastValues = {};
	ko.computed(function () {
		let participant = self.participant();
		let currentValues = {
			dd: participant.dd(),
			mm: participant.mm(),
			yyyy: participant.yyyy()
		};
		if (
			(typeof _lastValues.dd !== 'undefined' && _lastValues.dd !== currentValues.dd) ||
			(typeof _lastValues.mm !== 'undefined' && _lastValues.mm !== currentValues.mm) ||
			(typeof _lastValues.yyyy !== 'undefined' && _lastValues.yyyy !== currentValues.yyyy)
		) {
			participant.applicablePolicies().forEach(function (orderPolicy) {
				if (orderPolicy.hasAgeRestrictions()) {
					orderPolicy.resetPolicy();
					orderPolicy.viewed(0);
				}
			});
		}
		_lastValues = currentValues
	});
	self.errors = ko['observableArray']([]);
	self.warnings = ko['observableArray']([]);
	self.create_participant = ko.observable(!!create_participant);

	self.create_participant.subscribe(function (checked) {
		let participant = self.participant();
		if (checked && viewUser.birthdate) {
			participant.dd(self.user_dd());
			participant.mm(self.user_mm());
			participant.yyyy(self.user_yyyy());
		} else if (!checked) {
			participant.dd('');
			participant.mm('');
			participant.yyyy('');
		}
	});

	self.site_group_type_id = ko.observable(site_group_type_id);
	self.site_group_id = ko.observable(site_group_id);
	self.alreadyParticipant = ko.observable(viewUser.alreadyParticipant);

	self.user_first_name = ko.pureComputed(function() {
		return viewUser.first_name;
	});
	self.user_last_name = ko.pureComputed(function() {
		return viewUser.last_name
	});
	self.user_gender_id = ko.pureComputed(function() {
		return viewUser.gender_id
	});
	self.user_yyyy = ko.pureComputed(function() {
		var birthdayParts = viewUser.birthdate.split('-');
		if(birthdayParts.length === 3) {
			return birthdayParts[0];
		}
	});
	self.user_mm = ko.pureComputed(function() {
		var birthdayParts = viewUser.birthdate.split('-');
		if(birthdayParts.length === 3) {
			return birthdayParts[1];
		}
	});
	self.user_dd = ko.pureComputed(function() {
		var birthdayParts = viewUser.birthdate.split('-');
		if(birthdayParts.length === 3) {
			return birthdayParts[2];
		}
	});

	self.showBirthdate = ko['pureComputed'](function () {
		return (self.create_participant() && !viewUser.birthdate) || !self.create_participant() || self.alreadyParticipant();
	});

	self.addToFormData = function (formData) {
		var participant = self.participant(), site_group_type_id = self.site_group_type_id(), site_group_id = self.site_group_id();
		participant.addToFormData(formData);
		formData.append('create_participant', (self.create_participant() && !self.alreadyParticipant() ? '1' : ''));
		if (site_group_type_id && site_group_id) {
			formData.append('site_group_type_id', site_group_type_id);
			formData.append('site_group_id', site_group_id);
		}
	};
	self.processing = ko.observable(false);
	var matchingModal = new MatchingParticipantsModal();
	self.findParticipant = function(response) {
		self.addParticipant(response, true);
	};

	self.addParticipant = function (response, findParticipant) {
		self.processing(true);
		if (!response) {
			self.deferredResult.resolve(false);
			self.processing(false);
			return;
		}
		var participant = self.participant();
		var toValidate = {
			first_name: participant.first_name(),
			last_name: participant.last_name(),
			gender_id: participant.gender_id(),
			birthdate: ''
		};
		var yyyy = participant.yyyy(), mm = participant.mm(), dd = participant.dd() ? participant.dd().padStart(2, '0') : '';
		if (parseInt(yyyy, 10) && parseInt(mm) && parseInt(dd)) {
			toValidate.birthdate = [yyyy, mm, dd].join('-')
		}
		var constraints = ko.mapping.toJS(self.participant()['constraints']);
		if (self.create_participant()) {
			delete toValidate.first_name;
			delete toValidate.last_name;
			delete toValidate.gender_id;
			delete constraints.first_name;
			delete constraints.last_name;
			delete constraints.gender_id;
		}
		if (!self.showBirthdate()) {
			delete toValidate.birthdate;
			delete constraints.birthdate;
		}
		var errors = validate(toValidate, constraints, {format: 'flat'}) || [];
		participant.site_field_values_create().forEach(function (sfv) {
			if (typeof sfv.site_field['constraints'] !== 'undefined') {
				var mode = sfv.mode(), constraints = ko.mapping.toJS(sfv.site_field['constraints']);
				if (window['preventDuplicates'] && !participant.lookUp) {
					if (mode === 'simple') {
						delete constraints.entry.presence;
					} else if (mode === 'select') {
						delete constraints.values.length;
					} else if (['file', 'image'].indexOf(mode) !== -1) {
						delete constraints.entry.presence;
						delete constraints.entry.exclusion;
					}
				}
				if(window['adminScope'] && mode === 'file'){
					delete constraints.entry.presence;
					delete constraints.entry.exclusion;
				}
				errors = errors.concat(sfv.validate(constraints) || []);
			}
		});
		if (!participant.lookUp) {
			participant.applicablePolicies().forEach(function (op) {
				const club_policy = op.club_policy()
				if (club_policy.acceptance_by() === 'user' && typeof club_policy['constraints'] !== 'undefined') {
					let constraints = ko.mapping.toJS(club_policy['constraints']);
					errors = errors.concat(validate({viewed: op.viewed(), accepted: op.accepted()}, constraints, {format: 'flat'}) || []);
				}
			});
		}

		self.errors([]);
		if (errors.length) {
			self.errors(errors);
			self.processing(false);
			updateFB();
			let div = $('#addParticipant .popBody');
			if(div.size()) {
				div[0].scrollTo({ top: 0, behavior: 'smooth' });
			}
			return;
		}

		var formData = new FormData();
		self.addToFormData(formData);
		var set_instructor = null;
		if (typeof participant.instructor === 'function') {
			set_instructor = participant.instructor();
		}

		var url = findParticipant ? root.getFindParticipantURL(formData) :root.getAddParticipantURL(formData);
		UP.Services.AjaxPostMultipartForm(url, formData, function (response) {
			self.processing(false);
			self.errors([]);
			if (response.errors) {
				self.errors(response.errors);
				updateFB();
			} else if (response.targets) {
				var targets = response.targets;
				var matches = [];
				for (var key in targets) {
					if (targets.hasOwnProperty(key)) {
						matches.push(new Participant({data: targets[key], parent: self}));
					}
				}
				var participant = self.participant();
				if(self.create_participant() && !self.alreadyParticipant()) {
					participant.first_name(viewUser.first_name);
					participant.last_name(viewUser.last_name);
					if(viewUser.birthdate) {
						var birthdateParts = viewUser.birthdate.split('-');
						if(birthdateParts.length === 3) {
							participant.yyyy(birthdateParts[0]);
							participant.mm(birthdateParts[1]);
							participant.dd(birthdateParts[2]);
						}
					}
					participant.gender_id(viewUser.gender_id);
				}
				matchingModal.setRoot(self);
				matchingModal.findParticipant(findParticipant);

				matchingModal.createNewValues(participant);
				matchingModal.matches(matches);

				matchingModal.setMatchingParticipantCallback(function (val) {
					var formData = new FormData();
					participant.instructor(set_instructor);
					self.addToFormData(formData);
					formData.append('targetId', val);
					if(matchingModal.findParticipant()) {
						var url = root.getMatchFindParticipantURL(formData);
					} else {
						var url = root.getMatchParticipantURL(formData);
					}
					UP.Services.AjaxPostMultipartForm(url, formData, function (response) {
						matchingModal.errors([]);
						if (response.errors) {
							matchingModal.errors(response.errors);
							updateFB();
							return;
						}
						if (typeof root['matchingParticipantCallback'] === 'function') {
							response.target = val;
							root['matchingParticipantCallback'](response);
						}
					});
				});
				matchingModal.cancelCallback(function () {
					if (typeof root['matchingModalCancelCallback'] === 'function') {
						participant.instructor(set_instructor);
						root['matchingModalCancelCallback'](participant, self.create_participant());
					}
				});
				matchingModal.open();
			} else {
				if(response.userParticipant) {
					viewUser.alreadyParticipant = true;
				}
				self.deferredResult.resolve(response);
			}
		});
	};

	self.loading = ko.computed(function () {
		var sfs = [];
		self.participant().site_field_values_create().forEach(function (sfv) {
			sfs.push("" + sfv.site_field.site_field_id());
		});
		var loaded = Object.keys(AddParticipant.siteFieldsById);
		return _.difference(sfs, loaded).length;
	});

	self.afterShow = function () {
		if (typeof window.enableAddToCartButton === 'function') {
			window.enableAddToCartButton();
			window.enableAddToCartButton = null;
		}
	};

	self.open = function () {
		return showModal({
			template: 'addParticipantTemp',
			viewModel: self
		});
	};
};
AddParticipant.siteFieldsById = {};
AddParticipant.siteParticipantFieldByName = {};
AddParticipant.clubPoliciesById = {};

(function ($) {
	var MovableSideBar = function (el) {
		var element = el,
			parent = el.parent(),
			$window = $(window),
			offset = el.offset(),
			lastY = 0,
			lastH = element.height(),
			lastMT = 0,
			lastCalc = 0,
			lastT;
		el.css('position', 'absolute');
		parent.css('position', 'relative');

		this.redraw = function () {
			var elH = element.height(),
				scrollY = window.scrollY,
				winH = window.innerHeight;
			parent.css('minHeight', elH);

			var topY = offset.top,
				availableH = parent.height(),
				top = Math.max(0, Math.min(availableH - elH, scrollY - topY));
			el.css('top', top);
			if (winH < elH) {
				if (scrollY > lastY) {
					//scrolling down
					lastMT = Math.max(top * -1, Math.min(0, scrollY + winH - (topY + availableH)), winH - elH, lastMT + lastY - scrollY);
				} else if (scrollY < lastY) {
					//scrolling up
					lastMT = Math.min(0, Math.max(lastMT, lastMT + lastY - scrollY));
				}
			} else {
				lastMT = 0;
			}

			el.css('marginTop', lastMT);
			lastY = scrollY;
			lastH = availableH;
			lastT = top;
			lastCalc = Date.now();
		};

		$window
			.resize(this.redraw)
			.scroll(this.redraw);
		this.redraw();
	};
	$.fn.movableSideBar = function () {
		var args = arguments;
		this.each(function () {
			var $this = $(this),
				$MovableSidebar = $(this).data('MovableSidebar');
			if (!$MovableSidebar) {
				$MovableSidebar = new MovableSideBar($this);
				$(this).data('MovableSidebar', $MovableSidebar);
			}
			if (args.length > 0) {
				var fn = args.shift();
				if (typeof $MovableSidebar[fn] === 'function') {
					$MovableSidebar[fn](args);
				}
			}
		});
	};
}(jQuery));
var Program = function (data, product) {
	var self = this;

	if(typeof data.show_waitlist_position !== 'undefined') {
		data.show_waitlist_position = "" + emptyIfNull(data.show_waitlist_position);
	}
	if(typeof data.can_self_withdraw !== 'undefined') {
		data.can_self_withdraw = "" + emptyIfNull(data.can_self_withdraw);
	}
	if(typeof data.drop_in_can_self_withdraw !== 'undefined') {
		data.drop_in_can_self_withdraw = "" + emptyIfNull(data.drop_in_can_self_withdraw);
	}
	let mappingObject = {
		linked_programs: {
			create: function (options) {
				return new Product(options.data);
			}
		}
	}

	if(typeof ProgramEditCommon !== 'undefined' && typeof ProgramEditCommon.getProgramGroupInstructorsModel === 'function') {
		mappingObject['program_group_instructors'] = {
			create: function (options) {
				return new ProgramEditCommon.getProgramGroupInstructorsModel(options.data, self);
			}
		}
	}
	ko.mapping.fromJS(data, mappingObject, self);
	if (!window.BATCH_EDIT_PROGRAM) {
		self.product = product;
	}

	self.category_level_ids = (function () {
		var _category_level_ids = ko['observableArray']([]);
		self['category_levels']().forEach(function (category_level) {
			_category_level_ids.push(category_level.category_level_id())
		});
		return ko['pureComputed']({
			read: function () {
				return _category_level_ids();
			},
			write: function (values) {
				_category_level_ids(values || []);
			}
		});
	})();


	self.membership_api_connection_ids = ko.observableArray(data.membership_api_connection_ids || []);

	if (typeof self.age_cutoff_date_formatted === 'undefined') {
		self.age_cutoff_date_formatted = ko.observable(self['age_cutoff_date'].date(SHORT_DATE)());
	}
	self.withdrawal_deadline_formatted = ko.observable(self['withdrawal_deadline'].date(SHORT_DATE_TIME)());

	self.has_linked_programs = ko.pureComputed(function() {
		return typeof self.linked_programs !== 'undefined' && self.linked_programs().length > 0;
	});

	self.linked_product_ids = ko.pureComputed(function() {
		var ret = {};
		if(self.linked_programs !== 'undefined') {
			var lp = self.linked_programs();
			for(var i = 0, iLen = lp.length; i < iLen; i++) {
				var product = lp[i];
				ret[product.id()] = product;
			}
		}
		return ret;
	});

	self.drop_in_registration_start_error = ko.pureComputed(function() {
		var drop_in_registration_start = self.drop_in_registration_start();
		if(drop_in_registration_start && uplifter_strtotime(drop_in_registration_start) === false) {
			return true;
		}
	});
	self.drop_in_registration_cutoff_error = ko.pureComputed(function() {
		var drop_in_registration_cutoff = self.drop_in_registration_cutoff();
		if(drop_in_registration_cutoff && uplifter_strtotime(drop_in_registration_cutoff) === false) {
			return true;
		}
	});
	self.drop_in_withdrawal_deadline_error = ko.pureComputed(function() {
		let drop_in_withdrawal_deadline = self.drop_in_withdrawal_deadline();
		if(drop_in_withdrawal_deadline && uplifter_strtotime(drop_in_withdrawal_deadline) === false) {
			return true;
		}
	});
	self.drop_in_registration_start_placeholder = ko.pureComputed(function () {
		return self.registration_start_time_formatted();
	});
	self.drop_in_registration_cutoff_placeholder = ko.pureComputed(function() {
		if (self.drop_in_registration_start()) {
			return jsmsgEventEnd;
		}
		return self.registration_cutoff_formatted();
	});

	self.programIsParent = ko.observable(typeof self['shared_capacity_parents'] === 'undefined' || self.shared_capacity_parents() === 0);
};

var Product = function (data, root) {
	var self = this;

	if(typeof data.signup_notifications !== 'undefined') {
		data.signup_notifications = "" + emptyIfNull(data.signup_notifications);
	}

	ko.mapping.fromJS(data, {
		program: {
			create: function (options) {
				if(typeof CREATED_PROGRAMS_CACHE !== 'undefined' && typeof options.data.program_id !== 'undefined' && options.data.program_id) {
					if(typeof CREATED_PROGRAMS_CACHE[options.data.program_id] === 'undefined') {
						CREATED_PROGRAMS_CACHE[options.data.program_id] = new Program(options.data, self, root);
					}
					return CREATED_PROGRAMS_CACHE[options.data.program_id];
				}
				return new Program(options.data, self, root);
			}
		},
		recurrence_site_field: {
			create: function (options) {
				return new SiteField(options.data, self);
			}
		},
		auto_renew_fee_settings: {
			create: function (options) {
				return ko.observable(options.data || {});
			}
		},
	}, self);

	self.no_recurrence = ko.pureComputed({
		read: function(val) {
			var recurrence = self.recurrence();
			return recurrence ? recurrence : '';
		},
		write: function(val) {
			self.recurrence('');
		}
	});

	self.program_date_range = ko.pureComputed(function () {
		if (self.program) {
			return moment(self.program.start_date()).format(_DATE_FORMATS[MEDIUM_DATE]) + (self.program.start_date() !== self.program.end_date() ? ' - ' + moment(self.program.end_date()).format(_DATE_FORMATS[MEDIUM_DATE]) : '');
		}
	});

	self.product_detail_url = ko.pureComputed(function() {
		return 'https://' + document.domain + '/registration/product-detail/' + encodeURIComponent(encodeURIComponent(data.sku));
	});

	self.clone = function() {
		return new Product(data);
	}
};

var Order = function (options, root) {
	var self = this;
	var mapping = {
		order_items: {
			create: function (options) {
				return new OrderItem(options, root);
			}
		},
		payments: {
			create: function (options) {
				return new Payment(options, root);
			}
		},
		user: {
			create: function (options) {
				return new User(options);
			}
		},
		notes: {
			create: function (options) {
				return new Note(options);
			}
		},
		order_policies: {
			create: function (options) {
				return new OrderClubPolicy(options.data, root);
			}
		},
		paymentMethods: {
			create: function (options) {
				return new MerchantPaymentMethod(options, root);
			}
		},
		ignore: [
			'prerequisite_site_field_ids'
		]
	};
	ko.mapping.fromJS(options.data, mapping, self);
	self.prerequisite_site_field_ids = ko.observable(options.data && options.data.hasOwnProperty('prerequisite_site_field_ids') ? options.data.prerequisite_site_field_ids : null);
	self.vm = options.parent;

	var CheckoutItem = function () {

		var self = this;
		self.registration_event = ko.observable(null)
		self.order_items = ko.observableArray([]);
		self.next_invoice_date = ko.pureComputed(function() {
			return self.order_items().length ? self.order_items()[0].next_invoice_date() : null;
		});
		self.next_invoice_amount = ko.pureComputed(function() {
			return null;
		});
		self.product = ko.pureComputed(function () {
			return self.order_items().length ? self.order_items()[0].product() : null;
		});
		self.itemsSummary = ko.pureComputed(function () {
			return self.order_items().length ? self.order_items()[0].local_string[lang] : null;
		});
		self.orderItemCount = ko.pureComputed(function () {
			return self.order_items().length;
		});
		self.itemsOriginalPrice = ko.pureComputed(function () {
			var itemsOriginalPrice = 0;
			self.order_items().forEach(function (item) {
				itemsOriginalPrice += item.original_item_price();
			});
			if (price_inclusive_of_taxes) {
				itemsOriginalPrice = getPriceInclusiveOfTaxes(itemsOriginalPrice, self.product() && self.product().taxes);
			}
			return itemsOriginalPrice;
		});
		self.itemsDiscountPrice = ko.pureComputed(function () {
			var itemsDiscountPrice = 0;
			self.order_items().forEach(function (item) {
				itemsDiscountPrice += parseFloat(item.discount_price());
			});
			if (price_inclusive_of_taxes) {
				itemsDiscountPrice = getPriceInclusiveOfTaxes(itemsDiscountPrice, self.product() && self.product().taxes);
			}
			return itemsDiscountPrice;
		});
		self.itemsTotal = ko.pureComputed(function () {
			var itemsTotal = 0;
			self.order_items().forEach(function (item) {
				itemsTotal += item.total();
			});
			if (price_inclusive_of_taxes) {
				itemsTotal = getPriceInclusiveOfTaxes(itemsTotal, self.product() && self.product().taxes);
			}
			return itemsTotal;
		});
		self.itemsOriginalExtendedPrice = ko.pureComputed(function () {
			var itemsOriginalExtendedPrice = 0;
			self.order_items().forEach(function (item) {
				itemsOriginalExtendedPrice += item.original_extended_price();
			});
			if (price_inclusive_of_taxes) {
				itemsOriginalExtendedPrice = getPriceInclusiveOfTaxes(itemsOriginalExtendedPrice, self.product() && self.product().taxes);
			}
			return itemsOriginalExtendedPrice;
		});
		self.isSubscription = ko.pureComputed(function () {
			var order_items = self.order_items();
			return (order_items.length && order_items[0].product() && order_items[0].product().subscription);
		});
		self.isRegistration = ko.pureComputed(function () {
			var order_items = self.order_items();
			return (order_items.length && order_items[0].product() && order_items[0].product().registration());
		});
		self.isMultiQtyAllowed = ko.pureComputed(function () {
			var order_items = self.order_items();
			return (order_items.length && order_items[0].multiQtyAllowedComputed());
		});
		self.isTicket = ko.pureComputed(function () {
			var order_items = self.order_items();
			return (order_items.length && order_items[0] && order_items[0].is_ticket());
		});
		self.maxRedemption = ko.pureComputed(function () {
			var order_items = self.order_items();
			return order_items.length ? order_items[0].max_redemption() : null;
		});
		self.applyTo = ko.pureComputed(function () {
			if (self.order_items()[0]) {
				return self.order_items()[0].apply_to();
			}
			return null;
		});
		self.hasSFV = ko.pureComputed(function () {
			var order_items = self.order_items();
			return (order_items.length && order_items[0].site_field_values().length > 0);
		});
		self.getFirstItem = ko.pureComputed(function () {
			if (self.orderItemCount() === 1) {
				return self.order_items()[0];
			}
			return null;
		});
		self.getCssClasses = function () {
			var str = '';
			if (self.orderItemCount() > 1 || (self.orderItemCount() === 1 && (self.hasSFV() || self.getFirstItem().error() || self.getFirstItem().warning()))) {
				str = 'accordionContainer'
			} else {
				str = 'm-row';
			}
			if (self.isRegistration()) {
				str += ' dottedDivider';
			}
			return str;
		};

		self.accordionOpened = ko.observable(false);
		self.accordionId = ko.pureComputed(function () {
			if (self.order_items().length) {
				return 'CheckoutItem_' + self.order_items()[0].context_id();
			}
		});
		self.toggleAccordion = function () {
			self.accordionOpened(!self.accordionOpened());
			root.accordionStates[self.accordionId()] = self.accordionOpened();
		};

		self.getHeaderCssClasses = function () {
			var ois = self.order_items();
			var str = self.accordionOpened() ? 'active' : '';
			for (var i = 0, len = ois.length; i < len; i++) {
				if (ois[i].error() || !root.validateSiteFieldValues(ois[i].site_field_values())()) {
					return str + ' error';
				}
			}

			for (i = 0, len = ois.length; i < len; i++) {
				if (ois[i].warning()) {
					return str + ' warnings';
				}
			}
			return str;
		};
		self.isAutoAdded = ko.pureComputed(function () {
			return self.order_items()[0].auto_added();
		});
		self.isPhantomItem = ko.pureComputed(function () {
			return self.order_items()[0].isPhantomItem();
		});
		self.isCoupon = ko.pureComputed(function () {
			return self.order_items()[0].auto_added() && self.order_items()[0].auto_added_coupon_id();
		});
		self.current_billing_period =  ko.pureComputed(function () {
			if (self.order_items().length && self.order_items()[0].recurrence() && self.itemsTotal()) {
				let oi = self.order_items()[0];
				return [oi.recurrence_interval_start_time.date(MEDIUM_DATE)(), oi.recurrence_interval_end_time.date(MEDIUM_DATE)()].join(' - ');
			}
			return null;
		});
	};
	
	var _rollUpItems = {};
	self.order_items().forEach(function (orderItem) {
		var rollup;
		if (typeof orderItem.rollup === 'function') {
			rollup = orderItem.rollup();
		}
		if (rollup) {
			_rollUpItems[rollup] = orderItem;
		}
	});

	self.registrations = ko.pureComputed(function () {
		return self.order_items().filter(function (orderItem) {
			return (orderItem.product() && orderItem.product().registration());
		});
	});
	
	self.allRegistrations = ko['pureComputed'](function () {
		var registrations = self.registrations();
		if (_rollUpItems['registration']) {
			registrations.push(_rollUpItems['registration']);
		}
		return registrations;
	});

	self.registrationsCount = ko.pureComputed(function () {
		return self.registrations().length;
	});

	self.registrationsTotal = ko.pureComputed(function () {
		return self.registrations().reduce(function (acc, item) {
			return acc + parseFloat(item.discount_price());
		}, 0);
	});

	self.registrationsByProduct = ko.pureComputed(function () {
		var registrationsByProductId = {};
		var result = [];
		self.registrations().forEach(function (item) {
			var product_id = item.product_id() + ':' + item.event_id();
			if (!registrationsByProductId[product_id]) {
				registrationsByProductId[product_id] = [];

				var cr = new CheckoutItem();
				cr.registration_event(item.registration_event);
				cr.order_items(registrationsByProductId[product_id]);
				result.push(cr);
			}
			registrationsByProductId[product_id].push(item);

		});
		return result;
	});

	self.products = ko.pureComputed(function () {
		return self.order_items().filter(function (orderItem) {
			return ((!orderItem.rollup || (orderItem.rollup && !orderItem.rollup())) && (!orderItem.product() || (orderItem.product() && !orderItem.product().program && !orderItem.product().subscription)));
		});
	});
	
	self.allProducts = ko['pureComputed'](function () {
		var products = self.products();
		if (_rollUpItems['product']) {
			products.push(_rollUpItems['product']);
		}
		return products;
	});

	self.subscriptions = ko.pureComputed(function () {
		return self.order_items().filter(function (orderItem) {
			return (orderItem.product() && orderItem.product().subscription);
		});
	});
	
	self.allSubscriptions = ko['pureComputed'](function () {
		var subscriptions = self.subscriptions();
		if (_rollUpItems['subscription']) {
			subscriptions.push(_rollUpItems['subscription']);
		}
		return subscriptions;
	});

	self.productsAndSubscriptionsTotal = ko.pureComputed(function () {
		var items = self.subscriptions().concat(self.products());
		return items.reduce(function (acc, item) {
			return acc + parseFloat(item.discount_price());
		}, 0);
	});

	self.productsAndSubscriptions = ko.pureComputed(function () {
		var productsAndSubscriptions = {};
		var result = [];
		var items = self.subscriptions().concat(self.products());
		items.forEach(function (item) {
			var product_id = item.product_id(),
				auto_added_coupon_id = item.auto_added_coupon_id(),
				context_id = item.context_id();
			if (product_id) {
				if (item.multiQtyAllowed()){
					var cr = new CheckoutItem();
					cr.order_items([item]);
					result.push(cr);
				} else {
					if (!productsAndSubscriptions[product_id]) {
						productsAndSubscriptions[product_id] = [];
					}
					productsAndSubscriptions[product_id].push(item);
				}
			} else if (auto_added_coupon_id) {
				if (!productsAndSubscriptions[auto_added_coupon_id]) {
					productsAndSubscriptions[auto_added_coupon_id] = [];
				}
				productsAndSubscriptions[auto_added_coupon_id].push(item);
			} else {
				if (!productsAndSubscriptions[context_id]) {
					productsAndSubscriptions[context_id] = [];
				}
				productsAndSubscriptions[context_id].push(item);
			}
		});

		Object.keys(productsAndSubscriptions).forEach(function (product_id) {
			var cr = new CheckoutItem();
			cr.order_items(productsAndSubscriptions[product_id]);
			result.push(cr);
		});
		return result;
	});

	self.productsAndSubscriptionsTotalQty = ko.pureComputed(function () {
		var total = 0;
		ko.utils.arrayForEach(self.products(), function (product) {
			total += parseInt(product.qty());
		});
		return total + self.subscriptions().length;
	});

	self.orderItemsTotalQty = ko.pureComputed(function () {
		var total = 0;
		ko.utils.arrayForEach(self.order_items(), function (item) {
			total += parseInt(item.qty());
		});
		return total;
	});

	self.payment_tokens = ko.observable(options.data.payment_tokens);
	self.payment_interval.subscribe(function () {
		//this hack will ensure that our checkout sidebar moves if it needs to in order to allow for the size of the installments box
		setTimeout(function () {
			$(window).scroll();
		});
	});

	self.shipping = ko.computed(function () {
		var account_address = root.getAccountAddress(self.shipping_address_id);
		if (account_address) {
			var data = ko.mapping.toJS(account_address);
			var ac = new AccountAddress({
				data: data,
				parent: self
			}, root);
			ac.ORIGINAL = account_address;
			return ac;
		}
		return null;
	});

	self.billing = ko.computed(function () {
		var account_address = root.getAccountAddress(self.billing_address_id);
		if (account_address) {
			var data = ko.mapping.toJS(account_address);
			var ac = new AccountAddress({
				data: data,
				parent: self
			}, root);
			ac.ORIGINAL = account_address;
			return ac;
		}
		return null;
	});

	self.view_link = {
		href: '/admin/order-view.php?order=' + self.order_id()
	};

	self.completed_time_formatted = ko.pureComputed(function () {
		var completed_time = self.completed_time();
		if (completed_time) {
			return getFormattedDateTime(completed_time);
		}
	});

	self.status_label = ko.pureComputed(function () {
		var status_label = '';
		var balance_unpaid = self.balance_unpaid();
		var total = self.total();
		var balance = self.balance();
		if (!balance_unpaid && balance == 0) {
			status_label = 'PAID';
		} else if (balance_unpaid < 0 && balance != 0) {
			status_label = 'OVER PAYMENT';
		} else if (self.is_processing_locked()){
			status_label = 'LOCKED';
		} else if (balance_unpaid != 0 && balance_unpaid !== total) {
			status_label = 'PARTIALLY PAID';
		} else if (balance_unpaid === total && total !== 0) {
			status_label = 'UNPAID';
		}
		return status_label;
	});

	self.not_deleted_order_items = ko.pureComputed(function () {
		return self.order_items().filter(function (item) {
			return !item.deleted();
		});
	});

	self.orderItemCount = ko.pureComputed(function () {
		return self.not_deleted_order_items().length;
	});

	self.subtotal = ko.pureComputed(function () {
		var items = self.not_deleted_order_items();
		var subtotal = items.reduce(function (acc, item) {
			return parseFloat(acc) + parseFloat(item.discount_price());
		}, 0);
		return parseFloat(subtotal);
	});

	self.taxes = ko.pureComputed(function () {
		var items = self.not_deleted_order_items();
		var taxes = {};
		items.forEach(function (item) {
			item.getTaxes().forEach(function (tax) {
				if (typeof taxes[tax.tax_code()] === 'undefined') {
					taxes[tax.tax_code()] = {
						tax_code: tax.tax_code(),
						tax_rate_normalized: tax.tax_rate_normalized(),
						tax_total: 0
					}
				}
				taxes[tax.tax_code()].tax_total += parseFloat(tax.tax_total());
			});
		});
		return Object.keys(taxes).map(function (key) {
			return taxes[key];
		}).filter(function (tax) {
			return tax.tax_total !== 0;
		});
	});

	self.usable_credit = ko.pureComputed(function () {
		let merchantGiftCertificates = ko.unwrap(root.merchantGiftCertificates) || [];
		return merchantGiftCertificates.reduce(function (acc, gc) {
			return parseFloat(acc) + parseFloat(ko.unwrap(gc.cert_value));
		}, 0);
	});
	self.taxTotal = ko.pureComputed(function () {
		var taxTotal = self.taxes().reduce(function (acc, val) {
			return parseFloat(acc) + parseFloat(val.tax_total);
		}, 0);
		return parseFloat(taxTotal);
	});
	self.total = ko.pureComputed(function () {
		var total = self.subtotal() + self.taxTotal();
		return round(total);
	});

	self.total_with_credit = ko.pureComputed(function () {
		var total = self.total();
		if (root.gcPaymentMethod() && self.use_credit() && self.credit_available()) {
			total = total - self.credit_available();
		}
		return round(total);
	});

	self.pending_tokenizations = ko.pureComputed(function () {
		return $.map(
			//build an object
			self.payments().reduce(
				function (prev, payment) {
					if ((payment.status() === 'pending' || !payment.order_transaction_id()) &&
						typeof prev[payment.merchant_payment_method_id()] === 'undefined' &&
						payment.merchant_payment_method().requiresToken()) {
						prev[payment.merchant_payment_method_id()] = payment.merchant_payment_method();
					}
					return prev;
				},
				{}
			),
			//convert object to array
			function (value) {
				return [value];
			}
		);
	});
	self.removePayment = function (payment) {
		var currentValue = payment.deleted();
		if (payment.transaction_type() === 'payment' && payment.refunds().length > 0) {
			if (!currentValue) {
				if (!window.confirm('the reversal will occur against the original gift certificate.')) {
					return null;
				}
			}
			payment.refunds().forEach(function (refund) {
				refund.order_transaction_id() ? refund.deleted(!currentValue) : self.refunds.remove(refund);
			})
		}
		payment.order_transaction_id() ? payment.deleted(!currentValue) : self.finalPayments.remove(payment);

		if (payment.merchant_payment_method() && payment.merchant_payment_method().class_name() !== 'giftCertificatePayment') {
			self.pay_by(payment.merchant_payment_method());
		}
	};
	self.use_installments = ko.observable(self.payment_interval() === 'installments');
	self.use_installments.subscribe(function(val) {
		if(val) {
			self.payment_interval('installments')
		} else {
			self.payment_interval('once');
		}
	});

	self.pay_by = ko.observable();
	if(ko.isObservable(self.checkout_merchant_payment_method_id)) {
		self.pay_by.subscribe(function (val) {
			if (val && ko.isObservable(val.merchant_payment_method_id)) {
				self.checkout_merchant_payment_method_id(val.merchant_payment_method_id());
			} else {
				self.checkout_merchant_payment_method_id(null)
			}
		});
	}

	var _installment_time = ko.observable(null),
		installment_time = ko.pureComputed(function () {
			return _installment_time() || self.completed_time() || Math.floor(Date.now() / 1000);
		});

	self.installment_date = ko.pureComputed({
		read: function () {
			var completed_time = installment_time();
			if (completed_time) {
				var date = new Date(completed_time ? completed_time * 1000 : null);
				return $.datepicker.formatDate(convertFromMoment(_DATE_FORMATS[SHORT_DATE]) + ' ', date) + $.datepicker.formatTime(convertFromMoment(_DATE_FORMATS[TIME_ONLY]), {
					hour: date.getHours(),
					minute: date.getMinutes()
				});
			}
			return '';
		}, write: function (installmentDate) {
			_installment_time(moment(installmentDate, "YYYY-MM-DD h:mm A").unix())
		}
	});

	self.orderHasExpired = function () {
		if (!self.create_time() || !self.stale_timeout() || self.status() !== 'pending') {
			return false;
		}
		var update_time = self.update_time();
		var expiry = update_time + self.stale_timeout();
		var now = Math.floor((new Date()).getTime() / 1000);
		return expiry < now;
	};
	
	self.isLocked = ko['pureComputed'](function () {
		return (self['is_processing_locked']() || self.orderHasExpired()) || self.status() === 'submitted' || self.status() === 'submitting';
	});

	self.staleTimeout = function () {
		return self.stale_timeout();
	};

	self.countdown = ko.observable('');

	var updateCountDown = function () {
		if (self.status() === 'pending' && !self.orderHasExpired() && self.stale_timeout() > 0) {
			var invoiceExpiryCheck = true;
			var update_time = self.update_time();
			var expiry = update_time + self.stale_timeout();
			var warningTime = 5 * 60; //5 minutes
			var pageController;
			var countdown = function () {
				var now = Math.floor((new Date()).getTime() / 1000);
				let _timeOffset = ko.unwrap(window.timeOffset);
				if (expiry >= now && expiry < now + warningTime && invoiceExpiryCheck) {
					//warning
					invoiceExpiryCheck = false;
					pageController = root.pageController();
					if (pageController === 'uplifter\\orders\\AdminEdit') {
						if (confirm(jsmsgConfirmExpiringOrder)) {
							var data = {
								order: JSON.stringify({continueOrder: true})
							};
							UP.Services.AjaxPostCall(window.location.href, data, function (response) {
								if (parseInt(response)) {
									self.update_time(response);
									expiry = parseInt(response) + self.stale_timeout();
								} else {
									alert(jsmsgOrderAlreadyExpired);
								}
							});
						}
					} else if (pageController === 'uplifter\\orders\\Checkout') {
						alert(jsmsgConfirmExpiringOrderOnCheckout);
					}
				}
				if (self.status() === 'pending' && !(expiry < now)) {
					self.countdown(timeDifference(new Date(expiry * 1000), _timeOffset*1000));
					window.requestAnimationFrame(countdown);
				}
				if (expiry < now) {
					if (pageController === 'uplifter\\orders\\Checkout') {
						window.location.reload();
					} else if (pageController === 'uplifter\\orders\\AdminEdit') {
						self.update_time(self.update_time()-1); //force to recalculate isLocked
						self.isLocked();
					}
				}
			};
			window.requestAnimationFrame(countdown);
		}
	};
	updateCountDown();

	self.changeStatus = function (newStatus) {
		var data = {
			order: JSON.stringify({status: newStatus})
		};
		UP.Services.AjaxPostCall(window.location.href, data, function (response) {
			if (response.errors) {
				if(Array.isArray(response.errors)) {
					alert(response.errors.join("\n"));
				} else if(typeof response.errors === 'object' && response.errors !== null) {
					alert(Object.values(response.errors).join("\n"))
				} else {
					alert(response.errors);
				}
			} else {
				self.status(response.status ? response.status : newStatus);
				if (response.update_time) {
					self.update_time(response.update_time);
					updateCountDown();
				}
			}
		});
	};

	self.emailReceipt = function () {
		var data = {
			order: JSON.stringify({sendReceipt: true})
		};
		UP.Services.AjaxPostCall(window.location.href, data, function (response) {
			if (response.errors) {
				root.errors(response.errors);
			} else if (response.success) {
				alert(response.success);
			}
		});
	};

	self.rawInstallments = ko.pureComputed(function () {
		var totalToApply = parseFloat(self.total()),
			installments = new ObjectMap();

		self.not_deleted_order_items().forEach(function (orderItem) {
			var itemInstallments = orderItem.rawInstallments();
			for (var i = 0; i < itemInstallments.length; i++) {
				var paymentAmount = itemInstallments[i].amount,
					time = itemInstallments[i].time,
					installment = installments.get(time) || {
						time: time,
						amount: 0
					};
				installment.amount += paymentAmount;
				installments.put(time, installment);
				totalToApply -= paymentAmount;
			}
		});

		var finalInstallments = installments.values();
		if (totalToApply !== 0 && finalInstallments.length > 0) {
			finalInstallments[0].amount += totalToApply;
		}
		return finalInstallments;
	});

	self.currentInstallments = ko.pureComputed(function () {
		//ensure binding to installment time updates
		self.installment_date();
		var baseTime = installment_time(),
			installments = new ObjectMap();
		self.rawInstallments().forEach(function (rawInstallment) {
			var paymentAmount = rawInstallment.amount,
				time = Math.max(rawInstallment.time, baseTime),
				installment = installments.get(time) || {
					time: time,
					amount: 0
				};
			installment.amount += paymentAmount;
			installments.put(time, installment);
		});

		//now we need to pull out all negative installments
		var tmpInstallments = installments.values(),
			toRemove = 0,
			filteredInstallments = [];
		for (var i = 0; i < tmpInstallments.length; i++) {
			if (tmpInstallments[i].amount <= 0) {
				toRemove -= tmpInstallments[i].amount;
			} else {
				filteredInstallments.push(tmpInstallments[i]);
			}
		}

		var installmentSorter = function (a, b) {
			return a.time - b.time;
		};

		if (toRemove === 0) {
			filteredInstallments.sort(installmentSorter);
			return filteredInstallments;
		}
		var finalInstallments = [];
		//finally we need to pull out the removal amount
		//todo: we could add a more even distribution of removals, but we'd need to do it optionally, and reflect that in the php code also.
		filteredInstallments.reverse();
		for (var i = 0; i < filteredInstallments.length; i++) {
			if (filteredInstallments[i].amount <= toRemove) {
				toRemove -= filteredInstallments[i].amount;
			} else {
				filteredInstallments[i].amount -= toRemove;
				toRemove = 0;
				finalInstallments.push(filteredInstallments[i]);
			}
		}
		finalInstallments.sort(installmentSorter);
		return finalInstallments;
	});

	self.currentInstallmentsWithCredit = ko.pureComputed(function () {
		var credit_available = root.gcPaymentMethod()? self.credit_available() : 0,
			currentInstallments = self.currentInstallments(),
			finalInstallments = [];
		for (var i = 0; i < currentInstallments.length; i++) {
			var thisInstallment = $.extend({}, currentInstallments[i]),
				amountToRemove = Math.max(0, Math.min(credit_available, thisInstallment.amount));
			thisInstallment.amount -= amountToRemove;
			credit_available -= amountToRemove;
			if (thisInstallment.amount > 0) {
				finalInstallments.push(thisInstallment);
			}
		}
		return finalInstallments;
	});

	self.finalPayments = self.payments;

	self.payments = ko.pureComputed({
		write: function (payments) {
			ko.mapping.fromJS(payments, self.finalPayments);
		},
		read: function () {
			var payments = $.extend([], self.finalPayments()),
				realBalance = round(self.realBalance()),
				pay_by = self.pay_by();
			if (realBalance > 0 && self.completed_time() && pay_by) {
				//add temporary payments here

				var use_installments = self.use_installments(),
					use_credit = self.use_credit(),
					paymentStatus = 'pending',
					currentGiftCertificates,
					installments;

				if (pay_by.noPendingStatus()) {
					paymentStatus = 'undeposited';
				}
				if (use_credit) {
					currentGiftCertificates = $.extend(true, {}, ko.mapping.toJS(root.merchantGiftCertificates));
				}
				if (use_installments) {
					installments = $.extend(true, [], self.currentInstallments());
				}

				if (use_credit || use_installments) {
					var balanceToRemoveFromInstallments,
						balanceToRemoveFromInstallment;
					for (i in payments) {
						var payment = payments[i];
						if (payment.deleted() > 0 || payment.status() === 'declined') {
							continue;
						}
						if (use_credit) {
							if (payment.merchant_payment_method().class_name() === 'giftCertificatePayment' && (!payment.processed() || !payment.order_transaction_id())) {
								for (var j in currentGiftCertificates) {
									if (currentGiftCertificates.hasOwnProperty(j) && currentGiftCertificates[j].gift_certificate_id === payment.gift_certificate_id()) {
										currentGiftCertificates[j].cert_value -= payment.transaction_amount();
									}

								}
							}
							var refunds = payment.refunds();
							for (var k in refunds) {
								var refund = refunds[k];
								if (refund.deleted() > 0 || refund.status() === 'declined') {
									continue;
								}

								if (refund.merchant_payment_method().class_name() === 'giftCertificatePayment' && !refund.order_transaction_id()) {
									for (var j in currentGiftCertificates) {
										if (currentGiftCertificates.hasOwnProperty(j) && currentGiftCertificates[j].gift_certificate_id === refund.gift_certificate_id()) {
											currentGiftCertificates[j].cert_value -= refund.transaction_amount();
										}
									}

								}
							}
						}

						if (use_installments) {
							balanceToRemoveFromInstallments = payment.balance();
							//first check within a day of the installment time
							for (var j = 0; j < installments.length; j++) {
								if (balanceToRemoveFromInstallments === 0) {
									break;
								}
								if (installments[j].time < payment.transaction_time() + 60 * 60 * 24 && installments[j].time > payment.transaction_time() - 60 * 60 * 24) {
									balanceToRemoveFromInstallment = Math.min(balanceToRemoveFromInstallments, installments[j].amount);
									installments[j].amount -= balanceToRemoveFromInstallment;
									balanceToRemoveFromInstallments -= balanceToRemoveFromInstallment;
								}
							}
							//next remove from any installments before
							if (balanceToRemoveFromInstallments > 0) {
								for (var j = 0; j < installments.length; j++) {
									if (balanceToRemoveFromInstallments === 0) {
										break;
									}
									if (installments[j].time <= payment.transaction_time() - 60 * 60 * 24) {
										balanceToRemoveFromInstallment = Math.min(balanceToRemoveFromInstallments, installments[j].amount);
										installments[j].amount -= balanceToRemoveFromInstallment;
										balanceToRemoveFromInstallments -= balanceToRemoveFromInstallment;
									}
								}
							}
							//finally remove from any installments after
							if (balanceToRemoveFromInstallments > 0) {
								for (var j = 0; j < installments.length; j++) {
									if (balanceToRemoveFromInstallments === 0) {
										break;
									}
									if (installments[j].time >= payment.transaction_time() + 60 * 60 * 24) {
										balanceToRemoveFromInstallment = Math.min(balanceToRemoveFromInstallments, installments[j].amount);
										installments[j].amount -= balanceToRemoveFromInstallment;
										balanceToRemoveFromInstallments -= balanceToRemoveFromInstallment;
									}
								}
							}
						}
					}

					var usable_credit = 0;
					if (use_credit) {
						for (var i in currentGiftCertificates) {
							if (currentGiftCertificates.hasOwnProperty((i))) {
								usable_credit += Math.max(0, currentGiftCertificates[i].cert_value);
							}
						}
						usable_credit = Math.max(0, Math.min(usable_credit, realBalance));
						var gcPaymentMethod = root.gcPaymentMethod();
						if (usable_credit && gcPaymentMethod) {
							if (use_installments) {
								//remove credit amount from payments
								balanceToRemoveFromInstallments = usable_credit;
								if (balanceToRemoveFromInstallments > 0) {
									for (var j = 0; j < installments.length; j++) {
										if (balanceToRemoveFromInstallments === 0) {
											break;
										}
										balanceToRemoveFromInstallment = Math.min(balanceToRemoveFromInstallments, installments[j].amount);
										installments[j].amount -= balanceToRemoveFromInstallment;
										balanceToRemoveFromInstallments -= balanceToRemoveFromInstallment;
									}
								}
							}
							//add credit payments
							for (var i in currentGiftCertificates) {
								if (currentGiftCertificates.hasOwnProperty(i) && round(currentGiftCertificates[i].cert_value) > 0) {
									var giftCertificate = currentGiftCertificates[i];
									if (usable_credit && giftCertificate.cert_value > 0) {
										var amountToApply = Math.min(giftCertificate.cert_value, usable_credit),
											d = new Date(),
											payment = new Payment({
												data: $.extend(true, {}, root.sampleTransaction, {
													transaction_time: Math.floor(d.getTime() / 1000),
													transaction_amount: amountToApply,
													merchant_payment_method_id: gcPaymentMethod.merchant_payment_method_id(),
													gift_certificate_id: giftCertificate.gift_certificate_id,
													transaction_id: giftCertificate.cert_code,
													status: 'processing'
												}),
												parent: self
											}, root);
										payment.temporary(true);
										payments.push(payment);
										usable_credit -= amountToApply;
										realBalance -= amountToApply;
									}
								}
							}
						}
					}
				}
				if (round(realBalance) > 0) {
					if (use_installments) {
						for (var i = 0; i < installments.length; i++) {
							if (round(installments[i].amount) > 0) {
								payment = new Payment({
									data: $.extend(true, {}, root.sampleTransaction, {
										transaction_time: installments[i].time,
										transaction_amount: installments[i].amount,
										merchant_payment_method_id: pay_by.merchant_payment_method_id(),
										status: paymentStatus
									}),
									parent: self
								}, root);
								payment.temporary(true);
								payments.push(payment);
								realBalance -= installments[i].amount;
							}
						}
					} else if (round(realBalance) > 0) {
						var d = new Date(),
							payment = new Payment({
								data: $.extend(true, {}, root.sampleTransaction, {
									transaction_time: Math.floor(d.getTime() / 1000),
									transaction_amount: realBalance,
									merchant_payment_method_id: pay_by.merchant_payment_method_id(),
									status: paymentStatus
								}),
								parent: self
							}, root);
						payment.temporary(true);
						payments.push(payment);
					}
				}
			}
			payments.sort(function (a, b) {
				return a.transaction_time() - b.transaction_time();
			});
			return payments;
		}
	});

	self.realBalance = ko.pureComputed(function () {
		return round((parseFloat(self.total()) - self.finalPayments().reduce(function (acc, payment) {
			return acc + payment.balance();
		}, 0)));
	});

	self.balance = ko.pureComputed(function () {
		return round((parseFloat(self.total()) - self.payments().reduce(function (acc, payment) {
			return acc + payment.balance();
		}, 0)));
	});
	self.balance_unpaid = ko.pureComputed(function () {
		return round((parseFloat(self.total()) - self.payments().reduce(function (acc, payment) {
			return acc + payment.paid_balance();
		}, 0)));
	});

	self.hasCreditCardPayment = ko.pureComputed(function () {
		var hasCreditCardPayment = false;
		self.paymentMethods().forEach(function (paymentMethod) {
			if (paymentMethod.class_name() === 'creditCardPayment') {
				hasCreditCardPayment = true;
			}
		});
		return hasCreditCardPayment;
	});

	self.addOrderItem = function(newOrderItem) {
		var product = newOrderItem.product();
		if(product && product.merchant_id() && !self.merchant_id()) {
			newOrderItem.merchant_id(product.merchant_id());
		}
		if (!self.order_items().length || !self.merchant_id()) {
			self.merchant_id(newOrderItem.merchant_id());
		}
		self.order_items.push(newOrderItem);
	};

	let _order_policies = ko.observableArray(ko.unwrap(self.order_policies));
	self.order_policies = ko.pureComputed({
		write: function (order_policies) {
			_order_policies(order_policies);
		},
		read: function () {
			return _order_policies();
		}
	});

	self.orderPoliciesByApplyToKey = ko.pureComputed(function () {
		return self.order_policies().reduce(function (acc, orderPolicy) {
			if (orderPolicy.applyToKey()) {
				acc[orderPolicy.applyToKey()] = orderPolicy;
			}
			return acc;
		}, {});
	});

	self.getOrderPoliciesByApplyToKey = function (applyToKey) {
		let policyLookup = self.orderPoliciesByApplyToKey();
		if (policyLookup[applyToKey] && policyLookup[applyToKey].order_club_policy_id()) {
			return policyLookup[applyToKey];
		}
		return null;
	};
};

var OrderItem = function (options, root) {
	if(typeof options === 'object' && options !== null &&
		typeof options['data'] === 'object' && options.data !== null &&
		typeof root === 'object' && root !== null &&
		typeof root['mutate'] === 'function') {
		root.mutate('order_item', options.data);

		if(options.adjustments === null) {
			delete options.adjustments;
		}
		if(options.taxes === null) {
			delete options.taxes;
		}
	}
	var order_item_data = options.data;
	var self = this;
	if(typeof options.data['program_registration'] !== 'undefined' && options.data['program_registration'] === null) {
		delete options.data.program_registration;
	}
	if(typeof options.data['subscription_signup'] !== 'undefined' && options.data['subscription_signup'] === null) {
		delete options.data.subscription_signup;
	}
	var mapping = {
		adjustments: {
			create: function (options) {
				return new Adjustment(options, root);
			}
		},
		referenced_adjustments: {
			create: function (options) {
				return new Adjustment(options, root);
			}
		},
		taxes: {
			create: function (options) {
				return new Tax(options, root);
			}
		},
		program_registration: {
			create: function (options) {
				return new ProgramRegistration(options.data, root, self);
			}
		},
		subscription_signup: {
			create: function (options) {
				return new SubscriptionSignup(options.data, root);
			}
		},
		drop_in_events: {
			create: function (options) {
				return new (function(options) {
					var self = this;
					ko.mapping.fromJS(options.data, {}, self);
					self.location = ko.pureComputed(function() {
						return order_item_data.drop_in_locations[self.location_id()];
					});
				})(options);
			}
		},
		registration_event: {
			create: function (options) {
				return options.data === null ? null : new (function (options) {
					var self = this;
					ko.mapping.fromJS(options.data, {}, self);
				})(options);
			}
		},
		auto_renew_fee_settings: {
			create: function (options) {
				return ko.observable(options.data || {});
			}	
		},
		include: ['editRecurringFee', 'recurrence_error_clear'],
	};
	if(options.data.rollup) {
		options.data.order_items = null;
	}
	ko.mapping.fromJS(options.data, mapping, self);
	self._options = options;
	self._root = root;
	self.order = options.parent;
	if (typeof EditableContent !== 'undefined') {
		EditableContent.call(self);

		var forceRedraw = function() {
			//first we'll do an immediate pass
			setTimeout(function () {
				$('#orderEdit ul.listItems li.orderItem').css('display', 'block');
				setTimeout(function () {
					$('#orderEdit ul.listItems li.orderItem').css('display', '');
					//then we'll do another pass after 50ms in case there were stragglers
					setTimeout(function () {
						$('#orderEdit ul.listItems li.orderItem').css('display', 'block');
						setTimeout(function () {
							$('#orderEdit ul.listItems li.orderItem').css('display', '');
							//just in case, we'll triple check after another 500ms
							setTimeout(function () {
								$('#orderEdit ul.listItems li.orderItem').css('display', 'block');
								setTimeout(function () {
									$('#orderEdit ul.listItems li.orderItem').css('display', '');
								}, 500);
							}, 500);
						}, 50);
					}, 50);
				});
			});
		};

		var startEdit = self.startEdit;
		self.startEdit = function() {
			startEdit();
			forceRedraw();
		};
		var finishEdit = self.finishEdit;
		self.finishEdit = function() {
			finishEdit();
			forceRedraw();
		};
		var cancelEdit = self.cancelEdit;
		self.cancelEdit = function() {
			cancelEdit();
			forceRedraw();
		};
	}

	self.clone = function() {
		return new OrderItem(options, root);
	}

	self.netPrice = ko.pureComputed(function() {
		let netPrice = self.discount_price();
		self.referenced_adjustments().forEach(function(adj) {
			netPrice -= adj.total_adjustment();
		});
		return netPrice;
	});

	self.referencedAdjustmentTotal = ko.pureComputed(function() {
		let adjTotal = 0;
		self.referenced_adjustments().forEach(function(adj) {
			adjTotal += adj.total_adjustment();
		});
		return adjTotal * -1;
	});

	self.dropIn = ko.observable();
	self.allowDropIn = ko.pureComputed(function() {
		return (typeof self.drop_in_events === 'function' && self.drop_in_events().length > 0);
	});

	self.original_extended_price_display = ko.pureComputed(function () {
		let original_extended_price = self['original_extended_price']();
		if (price_inclusive_of_taxes) {
			original_extended_price = getPriceInclusiveOfTaxes(original_extended_price, self.product() && self.product().taxes);
		}
		return original_extended_price;
	});
	self.total_display = ko.pureComputed(function () {
		let total = self.total();
		if (price_inclusive_of_taxes) {
			total = getPriceInclusiveOfTaxes(total, self.product() && self.product().taxes);
		}
		return total;
	});

	/*****************************************************************************
	 ********* This code needs to be kept in sync with ***************************
	 ********* OrderItem.alwaysDropinOnly in /js/usimplecms/registration.js ******
	 *****************************************************************************/
	self.alwaysDropInOnly = ko.pureComputed(function() {
		if(self.allowDropIn()) {
			let program = self.product().program;
			let maxRegistrations = ko.unwrap(program.max_registrations);
			let maxFullRegistrations = ko.unwrap(program.max_full_registrations);
			let maxDropInRegistrations = ko.unwrap(program.max_dropin_registrations);
			let maxWaitlist = ko.unwrap(program.max_waitlist);
			let maxFullWaitlist = ko.unwrap(program.max_full_waitlist);
			let maxDropInWaitlist = ko.unwrap(program.max_dropin_waitlist);
			if (
				(maxRegistrations === 0 || maxFullRegistrations === 0) &&
				(maxWaitlist === 0 || maxFullWaitlist === 0) &&
				(
					(maxDropInRegistrations !== 0 && maxRegistrations !== 0) ||
					(maxDropInWaitlist !== 0 && maxWaitlist !== 0)
				)
			) {
				return true;
			}
		}
		return false;
	});
	/*****************************************************************************
	 ********* This code needs to be kept in sync with ***************************
	 ********* OrderItem.dropinOnly in /js/usimplecms/registration.js ************
	 *****************************************************************************/
	self.dropinOnly = ko.pureComputed(function() {
		if(self.allowDropIn()) {
			if(self.alwaysDropInOnly()) {
				return true;
			}
			let program = self.product().program;
			let drop_in_events = ko.unwrap(self.drop_in_events);
			return typeof drop_in_events !== 'undefined' && drop_in_events !== null && drop_in_events.length && (isBeforeNow(program.registration_cutoff)() || (isAfterNow(program.registration_start_time)() && !ko.unwrap(window.userHasBetaOrders)));
		}
		return false;
	});

	self.canToggleFullProgram = ko.pureComputed(function() {
		return !self.dropinOnly();
	});

	self.canToggleDropIn = ko.pureComputed(function() {
		return !self.order_item_id() &&
			self.product() &&
			self.product().program &&
			(
				(self.product().program.max_dropin_registrations() !== 0 && self.product().program.max_registrations() !== 0) ||
				(self.product().program.max_dropin_waitlist() !== 0 && self.product().program.max_waitlist() !== 0)
			) &&
			self.allowDropIn() && (
			typeof self.program_registration === 'undefined' ||
			typeof self.program_registration.checksum_id === 'undefined' ||
			!self.program_registration.checksum_id());
	});

	self.toggleDropIn = function() {
		if(!self.event_id() && self.canToggleDropIn()) {
			self.event_id(0);
			setTimeout(updateFB);
		}
	};

	self.toggleFullProgram = function() {
		if(!self.event_id() && self.canToggleDropIn()) {
			self.event_id(null);
			setTimeout(updateFB);
		}
	};

	self.dropInToggled = ko.pureComputed(function() {
		return self.event_id() === 0;
	});

	self.isFullProgram = ko.pureComputed(function() {
		return self.allowDropIn() && self.event_id() === null;
	});

	self.isDropInProgram = ko.pureComputed(function() {
		return self.allowDropIn() && self.event_id() !== null;
	});

	self.showDropInOptions = ko.pureComputed(function() {
		return self.allowDropIn() && self.event_id() === 0;
	});

	var dropInEventsSelected = {}, dropInEventSelections = [];
	self.selectedDropInEvent = function(event_id) {
		if(typeof dropInEventsSelected[event_id] === 'undefined') {
			dropInEventsSelected[event_id] = ko.observable(false);
			dropInEventSelections.push({
				event_id: event_id,
				selection: dropInEventsSelected[event_id]
			});
		}
		return dropInEventsSelected[event_id];
	};

	self.drop_in_events_selected = ko.pureComputed(function() {
		var ret = [];
		for(var i = 0, iLen = dropInEventSelections.length; i < iLen; i++) {
			if(dropInEventSelections[i].selection()) {
				ret.push(dropInEventSelections[i].event_id);
			}
		}
		return ret;
	});

	self.selectedEvent = ko['pureComputed'](function () {
		if (self.order_item_id()) {
			if(self.isDropInProgram() && parseInt(self.event_id())) {
				return (self.drop_in_events() || []).find(function (event) {
					return event.event_id() === self.event_id();
				});
			}
		} else if(self.program_registration && self.program_registration.event_id()) {
			return (self.drop_in_events() || []).find(function (event) {
				return event.event_id() === self.program_registration.event_id();
			});
		}
		return null;
	});

	self.siteGroupById = function (val) {
		return ko.utils.arrayFirst(self._root.site_groups(), function (item) {
			return item.site_group_id() == val;
		});
	};

	self.edited = ko.pureComputed(function() {
		if(ko.unwrap(self.rollup)) {
			var order_items = self.order_items();
			if(order_items !== null) {
				for (var i = 0; i < order_items.length; i++) {
					if (order_items[i].edited()) {
						return true;
					}
				}
			}
			return false;
		}
		if(!self.order_item_id() && !self.auto_added()) {
			return true;
		}
		var edited = false;
		if(self.deleted() != options.data.deleted) {
			edited = true;
		}
		if(self.tax_credit_eligible() != options.data.tax_credit_eligible) {
			edited = true;
		}
		if(self.force() != options.data.force) {
			edited = true;
		}
		var adjustments = self.adjustments();
		if(adjustments.length !== options.data.adjustments.length) {
			edited = true;
		} else {
			for(var i in options.data.adjustments) {
				if(adjustments[i].adjustment_title() !== adjustments[i].originalData.adjustment_title) {
					edited = true;
				}
				if(adjustments[i].is_discount() !== adjustments[i].originalData.is_discount) {
					edited = true;
				}
				if(Math.abs(adjustments[i].total_adjustment()) !== Math.abs(adjustments[i].originalData.total_adjustment)) {
					edited = true;
				}
				if(adjustments[i].coupon_id() !== adjustments[i].originalData.coupon_id) {
					edited = true;
				}
			}
		}
		var taxes = self.taxes();
		if(taxes.length !== options.data.taxes.length) {
			edited = true;
		} else {
			for(var j in options.data.taxes) {
				if(taxes[j].tax_code() !== taxes[j].originalData.tax_code) {
					edited = true;
				}
				if(taxes[j].tax_name() !== taxes[j].originalData.tax_name) {
					edited = true;
				}
				if(taxes[j].tax_rate() !== taxes[j].originalData.tax_rate) {
					edited = true;
				}
				if(taxes[j].tax_total() !== taxes[j].originalData.tax_total) {
					edited = true;
				}
			}
		}
		if(typeof self.program_registration !== 'undefined') {
			var pr = self.program_registration;
			if(self.withdrawn() != options.data.withdrawn) {
				edited = true;
			}
			if(self.category_level_id() != options.data.category_level_id) {
				edited = true;
			}
			if(pr.site_group_id() != pr.originalData.site_group_id) {
				edited = true;
			}
			if(typeof pr.program_registration_participants === 'undefined') {
				return true;
			} else {
				var prp = pr.program_registration_participants();
				if(pr.program_registration_participants().length !== pr.originalData.program_registration_participants.length) {
					edited = true;
				} else {
					for(var k in pr.originalData.program_registration_participants) {
						if (prp[k].participant_id() !== prp[k].originalData.participant_id) {
							edited = true;
						}
					}
				}
			}
		} else {
			if(self.participant_id() != options.data.participant_id) {
				edited = true;
			}
			if(typeof self.subscription_signup !== 'undefined') {
				if(self.subscription_signup.expiry_date_formatted() != self.subscription_signup.originalData.expiry_date_formatted) {
					edited = true;
				}
				if(self.subscription_signup.processed() != self.subscription_signup.originalData.processed) {
					edited = true;
				}
			}
		}
		return edited;
	});

	self.currentSiteGroup = ko['pureComputed'](function () {
		if (self.program_registration && self.program_registration.site_group_id()) {
			return self.siteGroupById(self.program_registration.site_group_id());
		}
	});

	self.orderItemType = ko.pureComputed(function () {
		var orderItemType = '';
		if (self.registration()) {
			orderItemType = 'registration';
		} else if (self.subscription_id()) {
			orderItemType = 'subscription';
		} else {
			orderItemType = 'product';
		}
		return orderItemType;
	});

	self.popup = ko.observable();

	self.getTaxes = ko.pureComputed(function() {
		if(ko.unwrap(self.rollup) && self.order_items() !== null) {
			var taxes = {};
			self.order_items().forEach(function (item) {
				if(!item.deleted()) {
					item.getTaxes().forEach(function (tax) {
						if (typeof taxes[tax.tax_code()] === 'undefined') {
							taxes[tax.tax_code()] = {
								tax_code: tax.tax_code(),
								tax_rate_normalized: tax.tax_rate_normalized(),
								tax_total: 0
							}
						}
						taxes[tax.tax_code()].tax_total += parseFloat(tax.tax_total());
					});
				}
			});
			return Object.keys(taxes).map(function (key) {
				var data = {};
				ko.mapping.fromJS(taxes[key], {}, data);
				return data;
			}).filter(function (tax) {
				return tax.tax_total() !== 0;
			});
		}
		return self.taxes();
	});

	self.discount_price = ko.pureComputed(function () {
		if(ko.unwrap(self.rollup) && ko.unwrap(self.order_items) !== null) {
			return self.order_items().reduce(function (acc, item) {
				if(!item.deleted()) {
					return parseFloat(acc) + parseFloat(item.discount_price());
				}
				return parseFloat(acc);
			}, 0);
		}
		var total_adjustments = self.adjustments().reduce(function (acc, val) {
			var total_adjustment = val.total_adjustment();
			return parseFloat(acc) + parseFloat(val.is_discount() ? (-1 * total_adjustment) : total_adjustment);
		}, 0);
		return self.item_total_no_discounts() + parseFloat(total_adjustments);
	});

	self.item_total_no_discounts = ko.pureComputed(function () {
		if(ko.unwrap(self.rollup) && ko.unwrap(self.order_items) !== null) {
			return self.discount_price();
		}
		return parseFloat(self.item_price()) * self.qty();
	});

	self.item_unit_price_with_discounts = ko.pureComputed(function () {
		var total_adjustments = self.adjustments().reduce(function (acc, val) {
			var unit_adjustment = val.unit_adjustment();
			return parseFloat(acc) + parseFloat(val.is_discount() ? (-1 * unit_adjustment) : unit_adjustment);
		}, 0);
		return self.item_price() + parseFloat(total_adjustments);
	});

	self.create_time_formatted = ko.pureComputed(function () {
		var create_time = self.create_time();
		if (create_time && typeof getFormattedDateTime === 'function') {
			return getFormattedDateTime(create_time);
		}
	});

	self.update_time_formatted = ko.pureComputed(function () {
		var update_time = self.update_time();
		if (update_time && typeof getFormattedDateTime === 'function') {
			return getFormattedDateTime(update_time);
		}
	});

	self.taxTotal = ko.pureComputed(function () {
		var total = self.getTaxes().reduce(function (acc, val) {
			return parseFloat(acc) + parseFloat(val.tax_total());
		}, 0);
		return parseFloat(total);
	});

	self.item_total = ko.pureComputed(function () {
		return parseFloat(self.discount_price()) + parseFloat(self.taxTotal());
	});

	self.participant = ko.pureComputed(function () {
		return root.getParticipantById(self.participant_id());
	});

	self.participant_ids = ko.pureComputed(function () {
		var participant_ids = [],
			participantId = self.participant_id();
		if (self.popup()) {
			return self.popup().selectedParticipantIds();
		}
		if (self.program_registration) {
			var registrationParticipants = self.program_registration.program_registration_participants();
			registrationParticipants.forEach(function (prp) {
				participant_ids.push(prp.participant_id());
			});
		} else if (participantId) {
			participant_ids.push(participantId);
		}
		return participant_ids.sort();
	});

	self.participant_ids.subscribe(function (participant_ids) {
		if (!self.order.order_id()) {
			var instructorFields = self.site_field_values().filter(function (sfv) {
				return (sfv.mode() === 'instructor' && sfv.site_field.validation.populated_with_populate_participant_instructors());
			});
			if (instructorFields.length && !participant_ids.length) {
				for (var i = 0, len = instructorFields.length; i < len; i++) {
					instructorFields[i].setValues([]);
				}
			} else if (instructorFields.length && participant_ids.length) {
				var instructor_ids = [];
				participant_ids.forEach(function (participant_id) {
					var p = root.getParticipantById(participant_id);
					instructor_ids = instructor_ids.concat(p.instructor_ids());
				});
				instructorFields.forEach(function (sfv) {
					var newValues = [];
					for (var i = 0, len = instructor_ids.length; i < len; i++) {
						newValues.push(JSON.stringify({instructor_id: parseInt(instructor_ids[i], 10)}));
						if (newValues.length >= 1 && !sfv.allowMultiples()) {
							break;
						}
					}
					sfv.setValues(newValues);
				});
			}
		}
	});

	self.category_level_ids = ko.pureComputed(function () {
		var response = [];
		if (self.product().program) {
			var categoryLevels = ko.unwrap(self.category_levels);
			for (var i = 0; i < categoryLevels.length; i++) {
				var categoryLevel = ko.unwrap(categoryLevels[i]);
				response.push(ko.unwrap(categoryLevel.category_level_id));
			}
		}
		return response;
	});

	self.category_levels = ko.pureComputed(function () {
		var categoryLevels = [],
			categoryLevelId = self._options.data.category_level_id;
		if(self.product().program) {
			categoryLevels = self.product().program.category_levels();
			if (categoryLevelId && typeof categoryLevels.find(function (category_level) {
				return category_level.category_level_id() === categoryLevelId;
			}) === 'undefined' && typeof root['category_levels'] === 'function') {
				var categoryLevel = root.category_levels().find(function (category_level) {
					return category_level.category_level_id() === categoryLevelId;
				});
				if(typeof categoryLevel !== 'undefined') {
					categoryLevels.unshift(categoryLevel);
				}
			}
		}
		return categoryLevels;
	});

	self.categoryLevelId = ko.pureComputed({
		read: function () {
			var categoryLevelId = self.category_level_id();
			if (categoryLevelId) {
				return categoryLevelId;
			}

			if (self.product() && self.product().program) {
				var categoryLevelIds = self.category_level_ids();
				if (categoryLevelIds.length === 1) {
					return categoryLevelIds[0];
				}
				//find first category level overlap
				var participant_ids = self.participant_ids();
				if (participant_ids.length) {
					var participant_id = participant_ids[0];
					var participant = root.getParticipantById(participant_id);
					if (participant) {
						var participantCategoryLevels = participant.category_level_priorities();
						for (var j = 0; j < participantCategoryLevels.length; j++) {
							if (categoryLevelIds.indexOf(participantCategoryLevels[j]) >= 0) {
								return participantCategoryLevels[j];
							}
						}
					}
				}
			}
		},
		write: function (val) {
			setTimeout(function () {
				self.category_level_id(val);
			});
		}
	});

	if (!self.context_id()) {
		self.context_id(generateContextId(32));
	}

	self.showAdjustments = ko.observable(false);
	self.showTaxes = ko.observable(false);

	self.addParticipant = function () {
		var prp = new ProgramRegistrationParticipant({}, root),
			currentParticipantIds = self.participant_ids(),
			participants = root.participants();
		prp.participant_id = ko.observable();
		prp.participant = ko.pureComputed(function () {
			return root.getParticipantById(prp.participant_id());
		});

		for (var i = 0; i < participants.length; i++) {
			var participant_id = participants[i].participant_id();
			if (currentParticipantIds.indexOf(participant_id) < 0) {
				prp.participant_id(participant_id);
				break;
			}
		}
		if (prp.participant_id()) {
			self.program_registration.program_registration_participants.push(prp);
		} else {
			//this shouldn't be allowed to happen
			alert(jsmsgErrorUnknown);
		}
	};

	self.removeParticipant = function (prp) {
		self.program_registration.program_registration_participants.remove(prp);
	};

	self.category_level = ko.pureComputed(function () {
		var categoryLevelId = self.categoryLevelId();
		return self.category_levels().find(function (category_level) {
			return category_level.category_level_id() === categoryLevelId;
		});
	});
	self.addAdjustment = function (adjustment) {
		var options = {
			data: ko.mapping.toJS(adjustment),
			parent: self
		};

		var newAdjustment = new Adjustment(options, root);
		newAdjustment.edit(true);
		self.adjustments.push(newAdjustment);
		root.toggle(self.showAdjustments);
	};

	self.addCustomAdjustment = function (orderItem, event, extraData) {
		var data = Object.assign({}, {
				adjustment_title: null,
				coupon_code: null,
				coupon_id: null,
				create_time: null,
				created_by: null,
				deleted: 0,
				editable: true,
				expired: false,
				id: null,
				is_discount: true,
				order_id: null,
				order_item_adjustment_id: null,
				order_item_id: null,
				unit_adjustment: 0,
				referenced_order_item_info: {}
			}, extraData||{}),
			summary;
		if (event) {
			summary = $(event.target).closest('tr').find('.custom_adjustment_summary');
			data.adjustment_title = $.trim(summary.val());
		}
		if (!data.adjustment_title) {
			alert(jsmsgErrorDescriptionNeeded);
			return;
		}
		var options = {
			data: data,
			parent: self
		};
		var newAdjustment = new Adjustment(options, root);
		newAdjustment.edit(true);
		self.adjustments.push(newAdjustment);
		if (summary) {
			summary.val('');
		}
		if (self.showAdjustments()) {
			root.toggle(self.showAdjustments);
		}
		return newAdjustment;
	};
	self.removeAdjustment = function (adjustment) {
		!adjustment.order_item_adjustment_id() && self.adjustments.remove(adjustment);
	};
	self.reverseAdjustment = function (adjustment) {
		var data = ko.mapping.toJS(adjustment);
		data.order_item_adjustment_id = null;
		data.id = null;
		data.unit_adjustment *= -1;
		data.is_discount = !data.is_discount;
		data.editable = true;
		var options = {
			data: data,
			parent: self
		};
		var newAdjustment = new Adjustment(options, root);
		newAdjustment.edit(true);
		self.adjustments.push(newAdjustment);
	};

	self.removeTax = function (tax) {
		self.taxes.remove(tax);
	};
	self.addTax = function (tax) {
		var options = {
			data: {
				site_tax_id: tax.site_tax_id,
				tax_code: tax.tax_code,
				tax_name: tax.tax_name,
				tax_rate: tax.tax_rate,
				tax_rate_normalized: tax.tax_rate_normalized
			},
			parent: self
		};
		var newTax = new Tax(options, root);
		self.taxes.push(newTax);
		root.toggle(self.showTaxes);
	};

	self.product = ko.pureComputed(function () {
		var product_id = self.product_id();
		if (product_id) {
			return root.productsById()[product_id] || null;
		}
		return null;
	});

	self.isFull = ko.pureComputed(function () {
		var spotsLeft = self.spotsLeft();
		return spotsLeft === 0 || spotsLeft < 0;
	});
	self.spotsLeft = ko.pureComputed(function () {
		var product = self.product();
		if(product && product.program) {
			if(typeof product.spots !== 'undefined') {
				return product.spots();
			}
			var max_registrations = product.program.max_registrations();
			if(max_registrations !== null) {
				return max_registrations - (product.qty_registered() + product.qty_waitlisted())
			}
		}
		return null;
	});
	self.showSpotsLeft = ko.pureComputed(function () {
		return self.spotsLeft() > 0 && self.spotsLeft() <= 3;
	});
	self.showRegistrationStart = ko.pureComputed(function () {
		return self.product() && self.product().program && isAfterNow(self.product().program.registration_start_time)();
	});
	self.showRegistrationEnd = ko.pureComputed(function () {
		return self.product() && self.product().program && isBeforeNow(self.product().program.registration_cutoff)();
	});

	self.site_field_ids = ko.pureComputed(function() {
		let product = self.product();
		if(product && product.tagged_object_ids) {
			if(self.event_id() || self.showDropInOptions()) {
				return product.tagged_object_ids.site_field().concat(product.tagged_object_ids.site_field_with_event());
			} else {
				return product.tagged_object_ids.site_field().concat(product.tagged_object_ids.site_field_no_event());
			}
		}
		return[];
	});

	self.all_site_field_values = (function () {
		let _lastValues = null,
			_cachedSiteFields = ko.observable(null);
		//we need to display a potentially differing list of site fields when the item is a full program reg vs drop in
		self.event_id.subscribe(function() {
			_cachedSiteFields(null);
		});
		return ko.pureComputed(function () {
			let all_site_field_values = [],
				site_field_ids = self.site_field_ids() || [];
			if (site_field_ids.length) {
				let _siteFields = _cachedSiteFields();
				if (_siteFields === null) {
					_siteFields = {};
					_cachedSiteFields(_siteFields);
					for (let i = 0; i < site_field_ids.length; i++) {
						let site_field_id = site_field_ids[i];
						_siteFields[site_field_id] = getSiteFieldById(site_field_id, root);
					}
				}

				let loading = getSiteFieldByIdLoading();

				if (loading === true && _lastValues !== null) {
					return _lastValues;
				}

				if (loading === false) {
					for (let i = 0; i < site_field_ids.length; i++) {
						let site_field_id = site_field_ids[i],
							site_field = ko.unwrap(_siteFields[site_field_id]);
						if (site_field) {
							let site_field_values = site_field.getValuesFor(self);
							all_site_field_values = all_site_field_values.concat(site_field_values);
						}
					}
				}
				all_site_field_values.sort(function (a, b) {
					return ko.unwrap(ko.unwrap(a.site_field).sort_order) - ko.unwrap(ko.unwrap(b.site_field).sort_order);
				});
				_lastValues = all_site_field_values;
				return all_site_field_values;
			}
			return [];
		}).extend({rateLimit: { timeout: 500, method: "notifyWhenChangesStop" }});
	})();

	self.site_field_values = ko.pureComputed(function () {
		let completed_time, order = root.order();
		if (order && order['original_completed_time']) {
			completed_time = order['original_completed_time']();
		}
		return self.all_site_field_values().filter(function (siteFieldValue) {
			return siteFieldValue.isForOrderItem(self, completed_time);
		});
	});

	self.other_site_field_values = ko.pureComputed(function () {
		return self.all_site_field_values().filter(function (siteFieldValue) {
			return siteFieldValue.site_field.context() !== 'order_item';
		});
	});

	self.order_club_policies = (function () {
		let _cachePolicies = {};
		return ko.pureComputed(function () {
			let product = self.product(),
				order = root.order(),
				time = Math.floor((new Date()).getTime() / 1000);
			if (order && product && product.tagged_object_ids) {
				let user_id = order.user_id(),
					order_club_policies = {};
				product.tagged_object_ids.club_policy().forEach(function (club_policy_id) {
					let club_policy = root.getClubPolicyById(club_policy_id);
					if (club_policy && (!club_policy.effective_end_date() || club_policy.effective_end_date() > time)) {
						let orderPolicyData = $.extend(true, {}, root.sampleOrderClubPolicy, {
							club_policy_id: club_policy_id,
							user_id: user_id
						});
						if (club_policy.apply_to() === 'participant') {
							self.participant_ids().forEach(function (participant_id) {
								if (typeof root.getParticipantById === 'function') {
									let participant = root.getParticipantById(participant_id);
									if (participant && club_policy.isValidForParticipant(participant)) {
										let applyToKey = [club_policy_id, user_id, participant_id].join(':');
										if ((root['userAcceptedPolicies'] || {})[applyToKey] && -root['userAcceptedPolicies'][applyToKey].participant_id === -participant_id) {
											orderPolicyData.accepted_club_policy = root['userAcceptedPolicies'][applyToKey];
										}
										if (!_cachePolicies[applyToKey]) {
											_cachePolicies[applyToKey] = order.getOrderPoliciesByApplyToKey(applyToKey);
											if (!_cachePolicies[applyToKey]) {
												orderPolicyData.participant_id = participant_id;
												_cachePolicies[applyToKey] = new OrderClubPolicy(orderPolicyData, root);
											}
										}
										order_club_policies[applyToKey] = _cachePolicies[applyToKey];
									}
								}
							});
						} else {
							let applyToKey = [club_policy_id, user_id,''].join(':');
							if ((root['userAcceptedPolicies'] || {})[applyToKey]) {
								orderPolicyData.accepted_club_policy = root['userAcceptedPolicies'][applyToKey];
							}
							if (!_cachePolicies[applyToKey]) {
								_cachePolicies[applyToKey] = order.getOrderPoliciesByApplyToKey(applyToKey);
								if (!_cachePolicies[applyToKey]) {
									_cachePolicies[applyToKey] = new OrderClubPolicy(orderPolicyData, root);
								}
							}
							order_club_policies[applyToKey] = _cachePolicies[applyToKey];
						}
					}
				});
				return Object.values(order_club_policies);
			}
			return [];
		});
	})();

	self.rawInstallments = ko.pureComputed(function () {
		let
			totalTaxToApply = parseFloat(self.taxTotal()),
			taxToApply = totalTaxToApply,
			taxRemaining = totalTaxToApply,
			itemTotal = parseFloat(self.discount_price()),
			totalToApply = round(itemTotal + totalTaxToApply),
			installmentCount = self.installments(),
			installmentPeriod = self.installment_period(),
			// installment_start is a real UTC instant meaning midnight in the site's timezone; keep it in
			// that frame. moment honours moment.tz.setDefault(), so the arithmetic below stays in the
			// site's zone and needs no browser-offset compensation.
			installmentStart = self.installment_start(),
			installmentInterval = self.installment_interval(),
			itemQty = parseInt(self.qty()),
			initialPaymentAmount = round(self.initial_payment_amount() * itemQty),
			installmentPaymentAmount = round((itemTotal - (initialPaymentAmount * itemQty)) / installmentCount),
			itemInstallments = new ObjectMap(),
			distributeTax = self.distribute_tax(),
			taxPerInstallment = 0.0,
			paymentAmount = totalToApply;

		if (installmentCount && installmentPeriod && installmentStart && itemTotal > 0.0) {
			paymentAmount = initialPaymentAmount;
			if(totalTaxToApply !== 0.0) {
				if (distributeTax === 'even') {
					taxToApply = round(totalTaxToApply * paymentAmount / (totalToApply - totalTaxToApply))
					taxPerInstallment = round((taxRemaining - taxToApply) / installmentCount);
				} else if (initialPaymentAmount === 0.0 && distributeTax === 'first') {
					taxToApply = 0.0;
				}
				paymentAmount = round(paymentAmount + taxToApply);
			}
			paymentAmount = Math.min(totalToApply, paymentAmount);
		}
		if (paymentAmount !== 0) {
			itemInstallments.put(null, {
				time: null,
				amount: paymentAmount
			});
			totalToApply = round(totalToApply - paymentAmount);
			taxRemaining = round(taxRemaining - taxToApply);
		}

		if (totalToApply > 0 && installmentCount && installmentPeriod && installmentStart) {
			var time = installmentStart;
			for (var i = 0; i < installmentCount; i++) {
				if (i > 0) {
					switch (installmentInterval.toLowerCase()) {
						case 'days':
							time = strtotime('+' + (i * installmentPeriod) +
								' days', installmentStart);
							break;
						case 'weeks':
							time = strtotime('+' + (i * installmentPeriod) +
								' weeks', installmentStart);
							break;
						case 'months':
							time = strtotime('+' + (i * installmentPeriod) +
								' months', installmentStart);
							break;
					}
				}

				//all payments at the beginning of the day
				time = moment(time * 1000).startOf('day').unix();

				if (i + 1 === installmentCount) {
					paymentAmount = totalToApply;
					taxToApply = taxRemaining;
				} else if (taxPerInstallment === 0.0 && taxRemaining > 0) {
					paymentAmount = round(installmentPaymentAmount + taxRemaining)
					taxToApply = taxRemaining;
				} else {
					paymentAmount = round(installmentPaymentAmount + taxPerInstallment);
					taxToApply = taxPerInstallment;
				}
				paymentAmount = Math.min(paymentAmount, totalToApply);

				if (paymentAmount !== 0) {
					var installment = itemInstallments.get(time) || {
						time: time,
						amount: 0
					};
					installment.amount += paymentAmount;
					itemInstallments.put(time, installment);
					totalToApply = round(totalToApply - paymentAmount);
					taxRemaining = round(taxRemaining - taxToApply);
				}
			}
		}
		var finalInstallments = itemInstallments.values();
		if (totalToApply !== 0) {
			finalInstallments[0].amount += totalToApply;
		}
		return finalInstallments;
	});

	self.itemParticipantsSummary = ko.pureComputed(function () {
		var summary = [],
			participant_ids = self.participant_ids(),
			len = participant_ids.length;
		if (len > 6) {
			len = 6;
		}
		for (var i = 0; i < len; i++) {
			let participant = root.getParticipantById(participant_ids[i]);
			if (participant) {
				summary.push(participant.name());
			}
		}
		if (len === 6) {
			summary[5] = summary[5] + '...';
		}
		return summary.join(', ');
	});

	self.accordionOpened = ko.observable(false);
	self.accordionId = ko.pureComputed(function () {
		return 'OrderItem_' + self.context_id();
	});
	self.toggleAccordion = function () {
		self.accordionOpened(!self.accordionOpened());
		root.accordionStates[self.accordionId()] = self.accordionOpened();
	};

	self.qty.subscribe(function (val, test) {
		val = parseInt(val);
		if (!val || val < 1) {
			self.qty(1);
		} else {
			if (typeof root.updateItemQty === 'function') {
				$(document).find('.multiQtyInput').prop('disabled', true);
				root.updateItemQty(self, val, function () {
					$(document).find('.multiQtyInput').prop('disabled', false);
				});
			}
		}
	});

	// keep synced with order_item::multiQtyAllowed
	self.multiQtyAllowedComputed = ko.pureComputed(function () {
		if (self.order_item_id()) {
			//use saved item's value
			return !!self.multiQtyAllowed();
		}
		if (typeof _MULTI_QTY_ALLOWED === 'undefined' || !_MULTI_QTY_ALLOWED) {
			return false;
		}
		//custom added products currently always meet requirements of multi quantity allowed
		if (!self.product()) {
			return true;
		}

		return self.product().apply_to() !== 'participant'
			&& !self.product().is_ticket()
			&& !self.registration()
			&& !self.subscription_id()
			&& !self.subscription()
			&& !self.auto_added()
			&& !self.product().subtotal_percent()
			&& !self.product().hasOrderItemSiteField(); // products that have multi qty must continue to have multi qty
	});

	self.addingToWaitList = ko.observable(false);
	self.openState = ko.observable({focused: false, shouldOpen: false});
	var _rollupItemsLoaded = false;
	self.toggle = function (oi) {
		function _toggle() {
			var shouldOpen = oi.openState().shouldOpen;
			self.openState({focused: true, shouldOpen: !shouldOpen});
			forceRedraw();
		}
		if (_rollupItemsLoaded) {
			_toggle();
			return;
		}
		var hasCalculationChanged = root.hasCalculationChanged();
		var saved_item_ids = [];
		root.order().order_items().forEach(function (oi) {
			var id = oi.order_item_id();
			if (id) {
				saved_item_ids.push(id);
			}
		});
		UP.Services.AjaxPostCall(window.location, {order: JSON.stringify({expandRollupItem: {item_ids:saved_item_ids, rollup: oi['rollup']()}})}, function (response) {
			if (!response.errors) {
				_rollupItemsLoaded = true;
				root.updateVM({products: response.products});
				var order_items = response.order_items.map(function (data) {
					return new OrderItem({data: data, parent: root.order()}, root);
				});
				oi.order_items(order_items);
				_toggle();
				if (!hasCalculationChanged) {
					root.recalculateOrderItemData();
					root.recalculateOrderJSON()
				}
			}
		});
	};
	self.recurrence_error_clear = ko.observable();
	self.toggleRecurrenceError = function () {
		self.recurrence_error_clear(!self.recurrence_error_clear());
	};
	let _editRecurringFee;
	self.editRecurringFee = ko.pureComputed({
		read: function () {
			if (!_editRecurringFee && self.recurrence() && self.recurrence_processed() <= 0 && self.order && self.order_item_id() && self.order['original_completed_time'] && self.order['original_completed_time']()) {
				_editRecurringFee = new EditRecurringFee(self, root);
			}
			return _editRecurringFee;
		}, write: function (fee) {
			if(fee) {
				ko.mapping.fromJS(fee, _editRecurringFee);
			}
		}
	});
	self.grouped_drop_in_events = ko.pureComputed(function () {
		let drop_in_events = ko.unwrap(self.drop_in_events);
		if (drop_in_events) {
			let grouped_drop_in_events = drop_in_events.reduce(function (acc, event) {
				let start_date = event.event_start_time.date(SHORT_DATE)();
				if (!acc[start_date]) {
					acc[start_date] = {
						start_date: ko.observable(start_date),
						events: []
					};
				}
				acc[start_date].events.push(event);
				return acc;
			}, {});
			return Object.values(grouped_drop_in_events);
		}
		return null;
	});

	self.mappingFromJS = function(val) {
		self.editRecurringFee(val.editRecurringFee);
		delete val.editRecurringFee;
		ko.mapping.fromJS(val, self);
	};
};
var Adjustment = function (options, root) {
	var self = this;

	if(typeof options.data === 'object' && options.data !== null &&
		typeof root === 'object' && self.root !== null &&
		typeof root['mutate'] === 'function') {
		root.mutate('order_item_adjustment', options.data);
	}

	var _unit_adjustment = ko.observable(options.data.unit_adjustment);
	var mapping = {
		unit_adjustment: {
			create: function () {
				return ko.pureComputed({
					read: function () {
						if (isNaN(_unit_adjustment())) {
							_unit_adjustment(-1);
							_unit_adjustment(0);
						}
						return round(Math.abs(_unit_adjustment()));
					},
					write: function (value) {
						if (isNaN(value)) {
							_unit_adjustment(-1);
							_unit_adjustment(0);
						}
						else {
							_unit_adjustment(self.is_discount() ? ((-1) * value) : value);
						}
					},
					owner: self
				});
			}
		},
		ignore: ['qty', 'total_adjustment']
	};
	ko.mapping.fromJS(options.data, mapping, self);

	self.originalData = options.data;
	self.order_item = options.parent;
	if(typeof EditableContent !== 'undefined') {
		EditableContent.call(self);
	}
	self.css = ko.pureComputed(function () {
		return self.is_discount() ? 'icon-subtract' : 'icon-add';
	});
	self.referenced_order_item_summary = ko.pureComputed(function () {
		var summary = [];
		if (self.referenced_order_item_info.hasOwnProperty('order_number')) {
			summary.push('<a target="_blank" href="/admin/order-edit.php?order=' + self.referenced_order_item_info.order_number() + '&order_item=' + self.referenced_order_item_id() + '">' + self.referenced_order_item_info.order_number() + '</a>');
		}
		if (self.referenced_order_item_info.hasOwnProperty('sku')) {
			summary.push(self.referenced_order_item_info.sku());
		}
		if (self.referenced_order_item_info.hasOwnProperty('deleted') && self.referenced_order_item_info.deleted()) {
			return summary.join(' - ') + ' [' + jsmsgDeleted + ']';
		}

		var participants = [];
		if (self.referenced_order_item_info.hasOwnProperty('participant_ids')) {
			self.referenced_order_item_info.participant_ids().forEach(function (id) {
				var p = root.getParticipantById(id);
				if (p) {
					participants.push(p.name());
				}
			});
			if (participants.length > 0) {
				summary.push(participants.join(', '));
			}
		}
		return summary.join(' - ');
	});
	self.qty = ko.pureComputed(function () {
		var qty = self.order_item && self.order_item.qty ? self.order_item.qty() : 0;
		return parseInt(qty)
	});
	self.total_adjustment = ko.pureComputed(function () {
		return self.qty() * parseFloat(self.unit_adjustment());
	});

	self.order_number_link = ko.pureComputed(function() {
		return ('<a target="_blank" href="/admin/order-edit.php?order=' + self.order_id() + '&order_item=' + self.order_item_id() + '">' + self.order_number() + '</a>');
	});
};

var Tax = function (options, root) {
	var self = this;
	var mapping = {
		ignore: [
			'tax_total', 'tax_unit_price'
		]
	};

	if(typeof options === 'object' && options !== null &&
		typeof root === 'object' && self.root !== null &&
		typeof root['mutate'] === 'function') {
		root.mutate('order_item_tax', options);
	}

	ko.mapping.fromJS(options.data, mapping, self);
	self.order_item = options.parent;
	self.originalData = options.data;
	if (typeof EditableContent !== 'undefined') {
		EditableContent.call(self);
	}
	self.tax_unit_price = ko.pureComputed(function () {
			return round((self.tax_rate() * parseFloat(self.order_item.item_unit_price_with_discounts())), 2);
		});
	self.tax_total = ko.pureComputed(function () {
		if (typeof self.order_item['rollup'] === 'function' && self.order_item['rollup']()) {
			return options.data.tax_total;
		}
		return round((self.tax_rate() * parseFloat(self.order_item.discount_price())), 2);
	});
};

var ProgramRegistrationParticipant = function (options, root) {
	var self = this;

	if(typeof options === 'object' && options !== null &&
		typeof root === 'object' && self.root !== null &&
		typeof root['mutate'] === 'function') {
		root.mutate('program_registration_participant', options);
	}

	delete (options['participant']);

	ko.mapping.fromJS($.extend(true, {
		deleted: 0,
		participant_id: null,
		program_registration_participant_id: null
	}, options), {}, self);


	self.originalData = options;

	self.participant = ko.pureComputed(function () {
		return root.getParticipantById(self.participant_id());
	});
};

var ProgramRegistration = function (options, root, orderItem) {
	var self = this;

	if(typeof options === 'object' && options !== null &&
		typeof root === 'object' && self.root !== null &&
		typeof root['mutate'] === 'function') {
		root.mutate('program_registration', options);
		if(options.program_registration_participants === null) {
			delete options.program_registration_participants;
		}
	}

	ko.mapping.fromJS($.extend(true, {
		program_registration_id: null,
		create_time: null,
		deleted: 0,
		program_registration_participants: [],
		site_group: null,
		site_group_id: null,
		status: "Registered",
		withdrawal_time: null,
		created_by_user_name: null
	}, options), {
		program_registration_participants: {
			create: function (options) {
				return new ProgramRegistrationParticipant(options.data, root);
			}
		}
	}, self);

	self._root = root;
	self._orderItem = orderItem;
	self.originalData = options;

	self.withdrawal_time_formatted = ko.pureComputed(function () {
		var withdrawal_time = self.withdrawal_time();
		if (withdrawal_time) {
			return getFormattedDateTime(withdrawal_time);
		}
	});

	self.site_group_id.subscribe(function (val) {
		if (!val) {
			self.site_group_id(null);
			self.program_registration_participants([]);
		} else {
			self.program_registration_participants([]);
			var siteGroup = self._orderItem.siteGroupById(val);

			siteGroup.participant_ids().forEach(function (id) {
				if (self._root.getParticipantById(id)) {
					var registration = new ProgramRegistrationParticipant({participant_id: id}, self._root);
					self.program_registration_participants.push(registration)
				}
			});
			updateFB();
		}
	});

};

var SubscriptionSignup = function (data, root) {
	var self = this;

	if(typeof data === 'object' && data !== null &&
		typeof root === 'object' && self.root !== null &&
		typeof root['mutate'] === 'function') {
		root.mutate('subscription_signup', data);
	}

	ko.mapping.fromJS(data, {}, self);

	self.originalData = data;

	//setting these seems to cause recursion
	self._root = root;
};

var OrderCommon = function (data) {
	var self = this;

	var account_addresses = [];
	if (data.account_addresses) {
		account_addresses = data.account_addresses.map(function (account_address) {
			return new AccountAddress({data: account_address, parent: self}, self);
		});
	}

	self.account_addresses = ko.observableArray(account_addresses);
	self.account_addresses_by_address_id = ko.computed(function () {
		var account_addresses_by_address_id = {};
		self.account_addresses().forEach(function (account_address) {
			if (account_address.address.address_id()) {
				account_addresses_by_address_id[account_address.address.address_id()] = account_address;
			}
		});
		return account_addresses_by_address_id;
	});

	self.account_addresses_options = ko.pureComputed(function () {
		var options = [];
		self.account_addresses().forEach(function (ac) {
			options.push(ac);
		});
		if (self.order().user.email()) {
			options.push(new AccountAddress({data: {address_name: jsmsgCreateNewAddress}, parent: self}, self));
		}
		return options;
	});

	self.account_addresses_billing_options = ko['pureComputed'](function () {
		var options = [];
		self.account_addresses().forEach(function (ac) {
			options.push(ac);

		});
		options.push(new AccountAddress({data: {address_name: jsmsgCreateNewAddress}, parent: self}, self));
		return options;
	});

	self.getAccountAddress = function (address_id) {
		var id = address_id();
		var account_addresses_by_address_id = self.account_addresses_by_address_id();
		var account_address = (account_addresses_by_address_id.hasOwnProperty(id)) ? account_addresses_by_address_id[id] : self.account_addresses()[0];
		if (account_address) {
			address_id(account_address.address.address_id());
			return account_address;
		}
		return null;
	};

	if (data.site_participant_fields) {
		self.site_participant_fields = ko.observableArray([]);
		data.site_participant_fields.forEach(function (data) {
			var spv = new SiteParticipantField({data: data, parent: self});
			self.site_participant_fields.push(spv);
		});
		self.site_participant_fields_by_name = ko.computed(function () {
			var site_participant_fields_by_name = {};
			self.site_participant_fields().forEach(function (site_participant_field) {
				site_participant_fields_by_name[site_participant_field.field_name()] = site_participant_field;
			});
			return site_participant_fields_by_name;
		});
		self.getSiteParticipantFieldByName = function (name) {
			return self.site_participant_fields_by_name()[name];
		};
	}

	self.products = ko.observableArray((data.products || []).map(function (product) {
		return new Product(product);
	}));
	self.productsById = ko.pureComputed(function () {
		var productByIds = {};
		self.products().forEach(function (product) {
			productByIds[product.product_id()] = product;
		});
		return productByIds;
	});

	self.participants = ko.observableArray((data.participants || []).map(function (data) {
		return new Participant({data: data, parent: self});
	}));

	self.site_groups = ko.observableArray((data.site_groups || []).map(function (data) {
		return new SiteGroup({data: data, parent: self});
	}));
	self.siteGroupsBySiteGroupTypeId = ko.pureComputed(function () {
		var siteGroups = {};
		self.site_groups().forEach(function (site_group) {
			if (!siteGroups[site_group.site_group_type_id()]) {
				siteGroups[site_group.site_group_type_id()] = [];
			}
			siteGroups[site_group.site_group_type_id()].push(site_group);
		});

		//add empty value
		self.site_groups().forEach(function (site_group) {
			if (!site_group.site_group_id()) {
				Object.keys(siteGroups).forEach(function (key, index) {
					siteGroups[key].unshift(site_group);
				});
			}
		});

		return siteGroups;
	});

	self.participantsById = ko.pureComputed(function () {
		var participantsById = {},
			participants = self.participants();
		for (var i = 0; i < participants.length; i++) {
			participantsById[participants[i].participant_id()] = participants[i];
		}
		return participantsById;
	});

	self.getParticipantById = function (participant_id) {
		return self.participantsById()[participant_id];
	};

	let _clubPolicyByIds = {};
	self.addClubPolicy = function (clubPolicy) {
		_clubPolicyByIds[clubPolicy.club_policy_id()] = clubPolicy;
	};
	self.club_policies = ko['observableArray']((data.club_policies || []).map(function (data) {
		let clubPolicy = new ClubPolicy(data);
		self.addClubPolicy(clubPolicy);
		return clubPolicy
	}));
	self.getClubPolicyById = function (id) {
		return _clubPolicyByIds[id];
	};
	self.userPaymentTokens = ko['observableArray']([]);
	var mapping = {
		order: {
			create: function (options) {
				return ko.observable(options.data ? new Order(options, self) : null);
			}
		},
		waitlist: {
			create: function (options) {
				return new WaitList(options, self);
			}
		},
		products: {
			create: function (options) {
				return new Product(options.data, self);
			}
		},
		merchants: {
			create: function (options) {
				return new Merchant(options, self);
			}
		},
		site_field_values: {
			create: function (options) {
				return ko.observable(options.data);
			}
		},
		headless_registrations: {
			create: function (options) {
				return new OrderItem({data: options.data, parent: self.order()}, self);
			}
		},
		userPaymentTokens: {
			create: function (options) {
				return new UserPaymentToken(options.data, self);
			}
		},
		ignore: [
			'provinces',
			'sampleNote',
			'sampleTransaction',
			'sampleOrderItem',
			'account_addresses',
			'account_addresses_by_address_id',
			'participantSample',
			'site_participant_fields',
			'participants',
			'club_policies'
		],
		copy: ['sampleOrderClubPolicy', 'federationParticipantFields', 'userAcceptedPolicies']
	};
	ko.mapping.fromJS(data, mapping, self);
	self.sampleTransaction = data.sampleTransaction;

	self.PayByMethods = ko.pureComputed(function () {
		if (!self.merchant || !self.merchant()) {
			return null;
		}
		var payment_methods = [], merchant_payment_methods = self.merchant().paymentMethods();

		for (var i = 0; i < merchant_payment_methods.length; i++) {
			if (merchant_payment_methods[i].class_name() !== 'giftCertificatePayment' && !merchant_payment_methods[i].isDeprecated() && !merchant_payment_methods[i].isDeactivated()) {
				payment_methods.push(merchant_payment_methods[i]);
			}
		}
		return payment_methods;
	});

	self.waitlistForMerchant = ko.pureComputed(function () {
		if (!self.waitlist || !self.waitlist()) {
			return null;
		}
		var waitlistForMerchant = [],
			merchant_id = self.order().merchant_id(),
			waitlist = self.waitlist();
		for (var i = 0; i < waitlist.length; i++) {
			if (!merchant_id || waitlist[i].product.merchant_id() === merchant_id) {
				waitlistForMerchant.push(waitlist[i]);
			}
		}
		return waitlistForMerchant;
	});

	self.merchant = ko.pureComputed(function () {
		if (!self.merchants || !self.merchants()) {
			let order = ko.unwrap(self.order);
			if (order) {
				return  ko.unwrap(order.merchant) || null;
			}
			return null;
		}
		var merchants = self.merchants(),
			merchant_id = self.order().merchant_id();
		if(merchant_id || merchants.length === 1) {
			for (var i = 0; i < merchants.length; i++) {
				if (!self.canEditMerchant() && !merchant_id) {
					self.order().merchant_id(merchants[i].merchant_id());
					merchant_id = merchants[i].merchant_id();
				}
				if (merchants[i].merchant_id() === merchant_id) {
					return merchants[i];
				}
			}
		}
	});

	self.gcPaymentMethod = ko.pureComputed(function () {
		if (!self.merchant || !self.merchant()) {
			return null;
		}
		return self.merchant().paymentMethods().find(function (merchant_payment_method) {
			return merchant_payment_method.class_name() === 'giftCertificatePayment';
		})
	});

	self.merchantGiftCertificates = ko.pureComputed(function () {
		let giftCertificates = ko.unwrap(self.giftCertificates) || [];
		if (!giftCertificates.length) {
			return [];
		}
		let merchant = ko.unwrap(self.merchant);
		if (!merchant) {
			return giftCertificates;
		}
		return giftCertificates.filter(function (gc) {
			return gc.merchant_id() === ko.unwrap(merchant.merchant_id)
		});
	});

	self.getPaymentToken = function (merchant_payment_method_id) {
		var order = self.order();
		if (order) {
			return order.payment_tokens()[merchant_payment_method_id] || null
		}
	};

	self.setPaymentToken = function (merchant_payment_method_id, paymentToken) {
		var order = self.order();
		if (order) {
			var payment_tokens = order.payment_tokens();
			payment_tokens[merchant_payment_method_id] = paymentToken;
			order.payment_tokens(payment_tokens);

			order.payments().forEach(function (payment) {
				if (payment.merchant_payment_method_id() === merchant_payment_method_id) {
					payment.original_awaiting_token(0);
					if (payment.original_status() !== 'paid' && payment.original_status() !== 'declined') {
						payment.awaiting_token(0);
					}
					payment.refunds().forEach(function (refund) {
						if (payment.merchant_payment_method_id() === merchant_payment_method_id) {
							refund.original_awaiting_token(0);
							if (refund.original_status() !== 'paid' && refund.original_status() !== 'declined') {
								refund.awaiting_token(0);
							}
						}
					})
				}
			});
		}
	};

	self.toggle = function (observable) {
		observable(!observable());
		var $filterable = $('.filterable');
		if ($filterable.length) {
			$filterable.filterTable();
		}
	};
	self.show = function (observable) {
		observable(true);
		var $filterable = $('.filterable');
		if ($filterable.length) {
			$filterable.filterTable();
		}
	};
	self.hide = function (observable) {
		observable(false);
	};

	self.errors = ko.observableArray([]);
	self.warnings = ko.observableArray([]);
	self.errors.subscribe(function (val) {
		if (val.length) {
			$('html, body').animate({scrollTop: 0}, 50);
		}
	});
	self.warnings.subscribe(function (val) {
		if (val.length) {
			$('html, body').animate({scrollTop: 0}, 50);
		}
	});
	self.showSelectPaymentMethod = ko.pureComputed(function () {
		var order = self.order();
		return order &&
			!order.completed_time() &&
			order.status() !== 'cancelled' &&
			(order.registrations().length || order.products().length || order.subscriptions().length) &&
			!(order.status() === 'pending' && order.orderHasExpired());
	});

	self.disablePost = ko.pureComputed(function () {
		return self.order() && self.order().balance() < 0;
	});

	var siteFieldsById = ko.observable({});
	var siteFieldValues = $.extend(true, {}, data.site_field_values);
	self.updateSiteFieldValues = function (site_field_values) {
		$.extend(true, siteFieldValues, site_field_values);
	};
	if (data.site_fields) {
		var newSiteFieldsById = {};
		for (var i in data.site_fields) {
			if (data.site_fields.hasOwnProperty(i)) {
				newSiteFieldsById[i] = new SiteField(data.site_fields[i], self);
			}
		}
		siteFieldsById(newSiteFieldsById);
	}
	self.loadingSiteFields = ko.pureComputed(function () {
		let order = self.order();
		if (order && order.not_deleted_order_items().length) {
			return order.not_deleted_order_items().find(function (orderItem) {
				return orderItem.site_field_ids().find(function (site_field_id) {
					return !ko.unwrap(getSiteFieldById(site_field_id, self));
				});
			});
		}
		return false;
	});

	self.getSiteFieldById = function (site_field_id) {
		let lookup = siteFieldsById();
		if (lookup[site_field_id]) {
			return lookup[site_field_id];
		}
		return null;
	};

	self.site_field_values = ko.pureComputed(function () {
		var result = [],
			order = self.order();
		if (order && order.not_deleted_order_items().length) {
			order.not_deleted_order_items().forEach(function (orderItem) {
				orderItem.other_site_field_values().forEach(function (site_field_value) {
					if (result.indexOf(site_field_value) < 0) {
						result.push(site_field_value);
					}
				});
			});
		}
		result.sort(function (a, b) {
			return ko.unwrap(ko.unwrap(a.site_field).sort_order) - ko.unwrap(ko.unwrap(b.site_field).sort_order)
		});
		return result;
	});

	self.all_site_field_values = ko.pureComputed(function () {
		var result = [],
			order = self.order();

		if (order && order.not_deleted_order_items().length) {
			order.not_deleted_order_items().forEach(function (orderItem) {
				if(orderItem.hasOwnProperty('rollup') && orderItem.rollup() && orderItem.order_items() !== null && orderItem.order_items().length){
					orderItem.order_items().forEach(function(item) {
						result = addSiteFieldValues(item, result);
					});
				}
				else {
					result = addSiteFieldValues(orderItem, result);
				}
			});
		}
		return result;
	});

	let addSiteFieldValues = function (orderItem, result){
		orderItem.site_field_values().forEach(function (site_field_value) {
			if (result.indexOf(site_field_value) < 0) {
				result.push(site_field_value);
			}
		});
		(orderItem.other_site_field_values() || []).forEach(function (site_field_value) {
			if (result.indexOf(site_field_value) < 0) {
				result.push(site_field_value);
			}
		});
		return result;
	}

	self.getSiteFieldValueData = function(siteFieldId, contextId) {
		return ko.observableArray();
	};

	var SiteFieldMap = new ObjectMap();
	
	var _accountOwner = null;
	self.getSiteFieldValue = function (site_field, context) {
		if (context.root && context.root.constructor.name === 'Order' && context.constructor.name === 'User' && site_field['shared_accounts']()) {
			if (!_accountOwner) {
				_accountOwner = new User({data: ko.mapping.toJS(context.root['account']['owner']) , parent: context.root});
			}
			context = _accountOwner;
		}
		var SiteFieldValuesMap = SiteFieldMap.get(site_field),
			contextId = context.context_id();
		if (!SiteFieldValuesMap) {
			SiteFieldValuesMap = new ObjectMap();
			SiteFieldMap.put(site_field, SiteFieldValuesMap);
		}
		var site_field_value = SiteFieldValuesMap.get(contextId);
		if (!site_field_value) {
			var siteFieldId = site_field.site_field_id(), newField = false;
			if (typeof siteFieldValues[siteFieldId] === 'undefined') {
				siteFieldValues[siteFieldId] = {};
			}
			if (typeof siteFieldValues[siteFieldId][contextId] === 'undefined') {
				siteFieldValues[siteFieldId][contextId] = self.getSiteFieldValueData(siteFieldId, contextId);
				newField = true;
			}
			site_field_value = new SiteFieldValue(site_field, context, ko.unwrap(siteFieldValues[siteFieldId][contextId]));
			if(newField && ko.isObservable(siteFieldValues[siteFieldId][contextId])) {
				siteFieldValues[siteFieldId][contextId].subscribe(function (newValue) {
					site_field_value.setValues(newValue);
				});
			}
			SiteFieldValuesMap.put(contextId, site_field_value);
		}
		return site_field_value;
	};

	self.getOrder = function () {
		return self.order();
	};

	self.getUser = function () {
		return self.order().user;
	};

	let updateCategoryLevelIdsForPost = function(){
		let order = self.order();
		if(order !== null){
			return order.order_items().filter(function(item) {
				if(item.product() && item.product().program && !item.category_level_id()){
					item.category_level_id(item.categoryLevelId());
					return true;
				}
			});
		}
		return [];
	}

	let unsetUpdatedCategoryLevelIds = function (order_items){
		order_items.forEach(function(item){
			item.category_level_id(null);
		})
	}

	self.getOrderData = ko.pureComputed(function () {
		let tmp = updateCategoryLevelIdsForPost();
		var order = self.order() ? ko.mapping.toJS(self.order()) : {};
		unsetUpdatedCategoryLevelIds(tmp);
		function filterOrderItem(oi) {
			var orderItem = _.clone(oi);
			//if you are wondering why you are missing data from the post, it is probably missing from here.
			const ORDER_ITEM_PROPS_TO_KEEP = [
				'event_id', 'product_id', 'order_item_id', 'item_price', 'local_string', 'qty',
				'tax_credit_eligible', 'participant_id', 'category_level_id', 'withdrawn', 'deleted',
				'adjustments', 'taxes', 'force', 'auto_added', 'context_id', 'subscription_signup', 'max_redemption',
				'created_by_order_item_id', 'rollup', 'isPhantomItem', 'customProductTempId',
				'recurrence_error_clear', 'created_by_order_item_context_id', 'recurrence_duration', 'earliest_billing',
				'earliest_billing_date', 'renewal_start', 'renewal_start_date', 'recurrence_invoice_in_advance', 'auto_renew_fee_settings',
			];
			for (var k in oi) {
				if (k === 'program_registration') {
					for (var x in orderItem[k]) {
						//if you are wondering why you are missing data from the post, it is probably missing from here.
						if (['program_registration_participants', 'program_registration_id', 'site_group_id'].indexOf(x) < 0) {
							delete (orderItem[k][x]);
						}
					}
					var participantIds = [];
					for (var z = 0; z < orderItem[k]['program_registration_participants'].length; z++) {
						participantIds.push({
							participant_id: parseInt(orderItem[k]['program_registration_participants'][z].participant_id)
						});
					}
					orderItem[k]['program_registration_participants'] = participantIds;
				} else if (k === 'editRecurringFee' && orderItem[k]) {
					let recurrence = orderItem[k].getPostData;
					for (let r in recurrence) {
						if ([
							'onHold',
							'recurrence_hold_until_formatted',
							'recurrence_remaining_renewal_count',
							'recurrence_renewal_expiry_formatted',
							'recurrence_total',
							'recurrence_percent',
						].indexOf(r) >= 0) {
							orderItem[r] = recurrence[r];
						}
					}
					delete (orderItem[k]);
				} else if (ORDER_ITEM_PROPS_TO_KEEP.indexOf(k) < 0) {
					delete (orderItem[k]);
				}
			}
			return orderItem;
		}
		for (var i in order) {
			if (i === 'order_items') {
				var order_items = [];
				//order_items need additional filtering
				for (var j in order[i]) {
					if (order[i][j].hasOwnProperty('rollup') && order[i][j].rollup && order[i][j].order_items !== null && order[i][j].order_items.length) {
						order[i][j].order_items.forEach(function (oi) {
							order_items.push(filterOrderItem(oi));
						});
					}
					else {
						order_items.push(filterOrderItem(order[i][j]));
					}
				}
				order.order_items = order_items;
			} else if (i === 'order_policies') {
				let order_policies = [];
				for (let o in order[i]) {
					let op = order[i][o];
					if (!op.accepted_club_policy && ((op.order_club_policy_id && op.deleted) || !op.deleted)) {
						order_policies.push(order[i][o].getPostData);
					}
				}
				order.order_policies = order_policies;
				//if you are wondering why you are missing data from the post, it is probably missing from here.
			} else if (['payments', 'billing', 'shipping', 'order_items', 'payments', 'notes', 'completed_time', 'payment_tokens', 'merchant_id', 'order_policies', 'checkout_merchant_payment_method_id', 'payment_interval'].indexOf(i) < 0) {
				delete order[i];
			}
		}


		function removeProps(obj, keys) {
			if (obj instanceof Array) {
				obj.forEach(function (item) {
					removeProps(item, keys)
				});
			} else if (typeof obj === 'object' && obj !== null) {
				Object.getOwnPropertyNames(obj).forEach(function (key) {
					if (keys.indexOf(key) !== -1) {
						delete obj[key];
					} else {
						removeProps(obj[key], keys);
					}
				});
			}
		}

		removeProps(order, ['editing', 'can_refund', 'has_gift_certificate', 'new_payment_token']);

		return order;
	});

	self.getSiteFieldValueHashData = ko.pureComputed(function () {
		var allSiteFieldValues = self.all_site_field_values(),
			site_field_values = {};
		for (var i = 0; i < allSiteFieldValues.length; i++) {
			site_field_values[allSiteFieldValues[i].getKey()] = allSiteFieldValues[i].values().map(function(val) {
				return val.value();
			});
		}
		return site_field_values;
	});

	self.getOrderItemHashData = ko.pureComputed(function() {
		// @TODO: checkout doesn't have all the functions needed to run this and doesn't need the result. Find a better way to manage error than failing silently
		try {
			let orderData = self.getOrderData();
			return [orderData.order_items, self.getSiteFieldValueHashData(), orderData.checkout_merchant_payment_method_id, orderData.payment_interval]
		} catch (e) {
			return null;
		}
	});

	var originalOrderItemData = ko.observable(JSON.stringify(self.getOrderItemHashData()));

	self.recalculateOrderItemData = function () {
		originalOrderItemData(JSON.stringify(self.getOrderItemHashData()));
	};
	self.hasCalculationChanged = ko.pureComputed(function() {
		return originalOrderItemData() !== JSON.stringify(self.getOrderItemHashData());
	});

	var orderData = ko.pureComputed(function() {
		var order = self.getOrderData();
		if (!order.billing) {
			order.billing = ko.mapping.toJS(self.newAccountAddressOnBilling())
		}
		if (!order.shipping) {
			order.shipping = ko.mapping.toJS(self.newAccountAddressOnShipping())
		}
		if(!self.hasCalculationChanged()) {
			delete(order['order_items']);
			order['order_items_unchanged'] = true;
		}
		else {
			var originalOrderItems = JSON.parse(originalOrderItemData())[0] || [];
			if (originalOrderItems.length) {
				var order_items = [],
					matched_count = 0,
					matches = {},
					i = null,
					iLen = order['order_items'] ? order['order_items'].length : 0,
					j = null,
					jLen = originalOrderItems.length;
				for (i = 0; i < iLen; i++) {
					var oi = order['order_items'][i],
						match = null;
					for(j = 0; j < jLen; j++) {
						var tmp = originalOrderItems[j];
						if (tmp.context_id === oi.context_id) {
							match = tmp;
							break;
						}
					}
					if (match) {
						matches[match.context_id] = true;
						matched_count++;
					}
					if (!oi.rollup && (!match || (match && JSON.stringify(oi) !== JSON.stringify(match)))) {
						order_items.push(oi);
					}
				}
				if(matched_count !== originalOrderItems.length) {
					for(j = 0; j < jLen; j++) {
						var tmp = originalOrderItems[j];
						if(typeof matches[tmp.context_id] === 'undefined') {
							tmp.deleted = 1;
							order_items.push(tmp);
						}
					}
				}
				order['order_items'] = order_items;
			}
			if(order['order_items'].length === 0) {
				delete(order['order_items']);
				order['order_items_unchanged'] = true;
			}
		}
		return order;
	});

	self.getOrderPostData = function (key) {
		var formData = new FormData(),
			data = {},
			allSiteFieldValues = self.all_site_field_values(),
			order = orderData();
		if (key === 'recalculate') {
			order.completed_time = null;
		}
		data[key] = order;

		formData.append('order', JSON.stringify(data));
		for (var i = 0; i < allSiteFieldValues.length; i++) {
			allSiteFieldValues[i].addToFormData(formData);
		}
		return formData;
	};

	self.getOrderPostDataHash = ko.pureComputed(function () {
		return JSON.stringify([self.getOrderData(), self.getSiteFieldValueHashData()]);
	});

	self.updateVM = function (data, order_item, replaceParticipant) {
		if (typeof data['giftCertificates'] !== 'undefined') {
			ko.mapping.fromJS(data.giftCertificates, {}, self.giftCertificates)
		}
		if (typeof data['participants'] !== 'undefined') {
			data.participants = data.participants.map(function (participant) {
				return new Participant({data: participant, parent: self});
			});
			//todo: we should really be updating the existing array and their internal data rather than replacing it to ensure that any subscriptions are correctly updated
			self.participants(data.participants);
		}
		/** when a participant has been added from checkout or matched on order edit */
		if (typeof data['participant'] !== 'undefined') {
			var participant = new Participant({data: data['participant'], parent: self });
			if (typeof replaceParticipant === 'undefined' || !replaceParticipant) {
				self.participants.push(participant);
			} else {
				var toReplace = self.participants().find(function (p) {
					return p.participant_id() === participant.participant_id();
				});
				if (toReplace) {
					//todo: we should really be updating the details within the participant rather than replacing it to ensure that any subscriptions are correctly updated
					self.participants.replace(toReplace, participant);
				} else {
					self.participants.push(participant);
				}
			}
		}

		if (typeof data['site_fields'] !== 'undefined') {
			siteFieldValues = $.extend(true, {}, data.site_field_values);
			let loadedSiteFieldsById = siteFieldsById();
			for (var i in data.site_fields) {
				if (data.site_fields.hasOwnProperty(i)) {
					let site_field_id = data.site_fields[i].site_field_id,
						siteField = loadedSiteFieldsById[site_field_id];

					if (!siteField) {
						loadedSiteFieldsById[site_field_id] = new SiteField(data.site_fields[i], self);
						siteField = loadedSiteFieldsById[site_field_id];
					}
					if (order_item) {
						var sfv = self.getSiteFieldValue(siteField, order_item);
						if (sfv) {
							var sfvId = sfv.site_field.site_field_id(),
								contextId = order_item.context_id();
							if (typeof siteFieldValues[sfvId] !== 'undefined' && typeof siteFieldValues[sfvId][contextId] !== 'undefined') {
								var valuesToBeSet = ko.unwrap(siteFieldValues[sfvId][contextId]);
								sfv.updateInitialValue(valuesToBeSet[valuesToBeSet.length - 1] || null);
								sfv.setValues(valuesToBeSet);
							}
						}
					}
				}
			}
			siteFieldsById(loadedSiteFieldsById);
		}

		if (typeof data['account_addresses'] !== 'undefined') {
			data.account_addresses = data.account_addresses.map(function (data) {
				return new AccountAddress({
					data: data,
					parent: self
				}, self);
			});
			self.account_addresses(data.account_addresses);
			if (!self.account_addresses().length) {
				self.newAccountAddressOnShipping(new AccountAddress({data: {}, parent: self}, self));
				self.newAccountAddressOnBilling(new AccountAddress({data: {}, parent: self}, self));
			} else {
				self.newAccountAddressOnShipping(null);
				self.newAccountAddressOnBilling(null);
			}
		}

		if (typeof data['site_participant_fields'] !== 'undefined') {
			data.site_participant_fields = data.site_participant_fields.map(function (data) {
				return new SiteParticipantField({data: data, parent: self});
			});
			self.site_participant_fields(data.site_participant_fields);
		}

		if (typeof data['products'] !== 'undefined') {
			var loadedProductIds = Object.keys(self.productsById()).map(function (id) {
				return parseInt(id, 10);
			});
			data.products.forEach(function (data) {
				if (loadedProductIds.indexOf(data.product_id) < 0) {
					var product = new Product(data);
					self.products.push(product);
				}
			});
		}

		if (typeof data['userPaymentTokens'] !== 'undefined') {
			self['userPaymentTokens'](data['userPaymentTokens'].map(function (data) {
				return new UserPaymentToken(data, self);
			}));
		}

		if (typeof data['userAcceptedPolicies'] !== 'undefined') {
			self['userAcceptedPolicies'] = data['userAcceptedPolicies'];
		}

		if (typeof data['club_policies'] !== 'undefined') {
			data.club_policies = (data['club_policies']||[]).map(function (cp) {
				let obj = self.getClubPolicyById(cp.club_policy_id);
				if (!obj) {
					let clubPolicy = new ClubPolicy(cp);
					self.addClubPolicy(clubPolicy);
					return clubPolicy;
				}
				return obj;
			});
			self.club_policies(data.club_policies);
		}

		if (typeof data['order'] !== 'undefined' && data.order !== null) {
			if (typeof data['order']['user'] !== 'undefined' && data.order.user !== null) {
				window.viewUser = data['order']['user'];
			}
			self.order(data.order ? new Order({
				data: data.order,
				parent: self
			}, self) : null);
		}

		if (typeof data['site_groups'] !== 'undefined') {
			data.site_groups = data.site_groups.map(function (data) {
				return new SiteGroup({data: data, parent: self});
			}, self);
			self.site_groups(data.site_groups);
		}

		if (typeof data['waitlist'] !== 'undefined') {
			data.waitlist = data.waitlist.map(function (data) {
				return new WaitList({
					data: data,
					parent: self
				}, self);
			}, self);
			self.waitlist(data.waitlist);
		}

		if (self.order()) {
			self.order().billing_address_id.subscribe(function (value) {
				if (!value) {
					self.newAccountAddressOnBilling(new AccountAddress({data: {}, parent: self}, self));
				}
			});
			self.order().shipping_address_id.subscribe(function (value) {
				if (!value) {
					self.newAccountAddressOnShipping(new AccountAddress({data: {}, parent: self}, self));
				}
			});
		}

		if (typeof data['user_has_participant'] !== 'undefined') {
			self.getOrder().user_has_participant(data['user_has_participant']);
		}
	};

	self.showSiteField = function (siteField) {
		var participant_ids = [];
		self.order().not_deleted_order_items().forEach(function (item) {
			participant_ids = participant_ids.concat(item.participant_ids());
		});
		return siteField.context === 'order' || siteField.context === 'user' || (siteField.context === 'participant' && $.inArray(siteField.context_id, participant_ids) > -1);
	};

	self.newAccountAddressOnBilling = ko.observable(null);
	self.newAccountAddressOnShipping = ko.observable(null);
	if (!self.account_addresses().length) {
		self.newAccountAddressOnShipping(new AccountAddress({data: {}, parent: self}, self));
		self.newAccountAddressOnBilling(new AccountAddress({data: {}, parent: self}, self));
	}
	if (self.order()) {
		self.order().billing_address_id.subscribe(function (value) {
			if (!value) {
				self.newAccountAddressOnBilling(new AccountAddress({}, self));
			}
		});
		self.order().shipping_address_id.subscribe(function (value) {
			if (!value) {
				self.newAccountAddressOnShipping(new AccountAddress({}, self));
			}
		});
	}

	self.editAccountAddress = function (form, address) {
		var account_address = ko.dataFor(form);
		if (ko.mapping.toJSON(account_address) !== JSON.stringify(account_address.initialValue)) {
			var pageController = self.pageController();
			var data = {};
			if (pageController === 'uplifter\\orders\\AdminEdit') {
				data = {
					order: JSON.stringify({createAccountAddress: ko.mapping.toJS(account_address)})
				};
			} else if (pageController === 'uplifter\\orders\\Checkout') {
				data = {
					step: 2,
					action: 'create_account_address',
					account_address: ko.mapping.toJS(account_address),
					addressToUpdate: address
				};
			}
			if (!$.isEmptyObject(data)) {
				UP.Services.AjaxPostCall(window.location.href, data, function (response) {
					if (response.errors) {
						if (pageController === 'uplifter\\orders\\Checkout') {
							for (var i in response.errors){
								var intI = parseInt(i);
								if (!isNaN(intI) && String(intI) === i){
									self.errors.push(response.errors[i])
								}
							}
						}
						return AccountAddress.parseErrors(response.errors, $(form));
					}
					var newAccountAddress = new AccountAddress({
						data: response.account_address,
						parent: self
					}, self);
					self.account_addresses.replace(account_address.ORIGINAL, newAccountAddress);
					if (address === 'shipping') {
						self.order().shipping_address_id(newAccountAddress.address.address_id());
					} else if (address === 'billing') {
						self.order().billing_address_id(newAccountAddress.address.address_id());
					}
					if (response.updateVM) {
						self.updateVM(response);
						if (response.updateTotal) {
							self.displayTotalChange();
						}
					}
				});
			}
		} else {
			account_address.finishEdit();
		}
	};

	self.createAccountAddress = function (form, address) {
		var account_address = ko.dataFor(form);
		var pageController = self.pageController();
		var data = {};
		if (pageController === 'uplifter\\orders\\AdminEdit') {
			data = {
				order: JSON.stringify({createAccountAddress: ko.mapping.toJS(account_address)})
			};
		} else if (pageController === 'uplifter\\orders\\Checkout') {
			data = {
				step: 2,
				action: 'create_account_address',
				account_address: ko.mapping.toJS(account_address),
				addressToUpdate: address
			};
		}
		if (!$.isEmptyObject(data)) {
			UP.Services.AjaxPostCall(window.location.href, data, function (response) {
				if (response.errors) {
					return AccountAddress.parseErrors(response.errors, $(form));
				}
				var account_addresses_by_address_id = self.account_addresses_by_address_id();

				var newAccountAddress = new AccountAddress({data: response.account_address, parent: self}, self);
				if (account_addresses_by_address_id.hasOwnProperty(response.account_address.address.address_id)) {
					self.account_addresses.replace(account_addresses_by_address_id[response.account_address.address.address_id], newAccountAddress);
				} else {
					self.account_addresses.push(newAccountAddress);
				}

				if (address === 'billing') {
					self.order().billing_address_id(newAccountAddress.address.address_id());
					self.newAccountAddressOnBilling(null);
				} else if (address === 'shipping') {
					self.order().shipping_address_id(newAccountAddress.address.address_id());
					self.newAccountAddressOnShipping(null);
					if(typeof self.isBillingInformationDifferent !== 'undefined' && !self.isBillingInformationDifferent()) {
						self.order().billing_address_id(newAccountAddress.address.address_id());
						self.newAccountAddressOnBilling(null);
					}
				}
				if (response.updateVM) {
					self.updateVM(response);
					if (response.updateTotal) {
						self.displayTotalChange();
					}
				}
			});
		}
	};

	self.avatarFieldSet = ko.observable(false);

	let contextOrder = ['order', 'account', 'user', 'instructor', 'participant'];
	self.groupedSiteFieldValues = ko['pureComputed'](function () {
		let result = new ObjectMap(), site_field_values = self.site_field_values();
		for (let i = 0; i < contextOrder.length; i++) {
			let context = contextOrder[i];
			for (let j = 0; j < site_field_values.length; j++) {
				let site_field_value = site_field_values[j],
					site_field = site_field_value.site_field,
					ctx = site_field_value.context();
				let siteFieldContext = site_field.context();
				if (siteFieldContext === 'user' && site_field['shared_accounts']()) {
					siteFieldContext = 'account';
				}
				if (siteFieldContext === context) {
					let obj = result.get(ctx);
					if (typeof obj === 'undefined') {
						obj = {
							name: null,
							site_field_values: []
						};
						if (typeof ctx['name'] === 'function' && ctx.name()) {
							obj.name = site_field.context_title_add_name().trim() + ' ' + (!site_field['shared_accounts']() ? ctx.name() : '');
						}
						result.put(ctx, obj);
					}
					if( site_field_value.site_field.visibility().includes('avatar')){
						self.avatarFieldSet(true);
					}
					obj.site_field_values.push(site_field_value);
				}
			}
		}
		return result.values();
	}).extend({rateLimit: { timeout: 500, method: "notifyWhenChangesStop" }});
	self.areThereAdditionalSiteFieldValues = ko['pureComputed'](function () {
		let information = self.groupedSiteFieldValues();
		let result = false;
		for (let i = 0, len = information.length; i < len; i++) {
			if (information[i].site_field_values.length) {
				result = true;
				break;
			}
		}
		return result;
	});
	self.isActiveFederationMappingField = function (fieldName) {
		let order = self.order();
		if (ko.unwrap(order.hasLeagueSeasonSubscription) && ko.unwrap(self.leagueIcon)) {
			return (self.federationMappedFields||[]).indexOf(fieldName) >= 0;
		}
		return false;
	};
	self.leagueIconClassAttr = function (cssClass) {
		let leagueIcon = ko.unwrap(self.leagueIcon);
		if (leagueIcon) {
			return {
				'class': leagueIcon + ' ' + (cssClass||'')
			};
		}
		return {};
	};

	self.groupedOrderPolicies = ko.pureComputed(function () {
		let result = [],
			groupedByTypeAndContext = {};

		let order_policies = [];

		if (ko.isObservable(self.calculated_order_policies)) {
			order_policies = self.calculated_order_policies();
		} else {
			let order = self.order();
			if (order) {
				order_policies = order.order_policies['peek']().filter(function (orderPolicy) {
					return orderPolicy.club_policy() && orderPolicy.club_policy().acceptance_by() === 'user' && orderPolicy.club_policy().visibility() !== 'payment';
				});
			}
		}

		order_policies.forEach(function (orderPolicy) {
			let club_policy = orderPolicy.club_policy();
			let groupingType = club_policy.groupingType();
			if (!groupedByTypeAndContext[groupingType]) {
				groupedByTypeAndContext[groupingType] = {
					type: groupingType,
					applyToContexts: {}
				};
			}
			let applyToContext = orderPolicy.groupingApplyToContext() ? ko.unwrap(orderPolicy.groupingApplyToContext().name) : null;
			if (!groupedByTypeAndContext[groupingType].applyToContexts[applyToContext]) {
				groupedByTypeAndContext[groupingType].applyToContexts[applyToContext] = {
					applyToContext: applyToContext,
					policies: []
				};
			}
			groupedByTypeAndContext[groupingType].applyToContexts[applyToContext].policies.push(orderPolicy);
		});
		Object.values(groupedByTypeAndContext).forEach(function (entry) {
			result.push({
				type: entry.type,
				policiesByContext: Object.values(entry.applyToContexts)
			});
		});
		return result;
	});
};

var getValidNumberString = function (numberString) {
	var integer = 0,
		decimal = 0,
		decimalPointPosition = 0,
		reg = /[a-z]/ig;

	if (typeof _ACCOUNTING_SETTING !== 'undefined') {
		var val = parseFloat(("" + numberString)
			.replace(new RegExp('[\s ' + RegExp.escape(_ACCOUNTING_SETTING.currency.thousand) + RegExp.escape(_ACCOUNTING_SETTING.currency.symbol) + ']', 'gi'), '')
			.replace(new RegExp('[' + RegExp.escape(_ACCOUNTING_SETTING.currency.decimal) + ']', 'gi'), '.'));

		if (!isNaN(val)) {
			return val;
		}
	}
	//unclear what the goal is with the following code, I don't think we need it
	numberString = (numberString || '').replace(/[\s$??]/ig, ''); /*remove white spaces and currency symbol */
	if (reg.test(numberString)) {
		numberString = '0.00';
	}
	if (isNaN(numberString / 1)) { /*This handles the cases when the user enters something like 12 345,67 */
		if (numberString.lastIndexOf(',') !== -1) {
			decimalPointPosition = numberString.lastIndexOf(',');
		} else if (numberString.indexOf('.') !== -1) {
			decimalPointPosition = numberString.lastIndexOf('.');
		}
		integer = numberString.substr(0, decimalPointPosition);
		decimal = numberString.substr(decimalPointPosition + 1);
		if (decimal.length === 3) {
			numberString = parseInt(numberString.replace(/[,.]/ig, ''));
		} else if (decimal.length <= 2) {
			numberString = parseInt(integer.replace(/[,.]/ig, '')) + '.' + parseInt(decimal);
		}
	}
	return (numberString || '').trim();
};


(function ($) {
	var JQueryInstructorField = function ($el) {
		var self = this;
		var _options = {};
		var $parent = $el.parent();
		var inputName = $el.attr('name');
		var selectedOptions = $el.data('selected-instructors');
		var instructorOptions = $el.data('instructor-options');
		var allowMultiples = $el.data('allow-multiples');
		var email;
		var creatingInstructor = false;

		Object.keys(instructorOptions).forEach(function (key) {
			if (key) {
				_options[key] = instructorOptions[key];
			}
		});

		self.redraw = function () {
			var $container = $('<div></div>');

			var $ul = $('<ul></ul>');
			selectedOptions.forEach(function (val) {
				var text = _options[val];
				if (!text) {
					var decoded = JSON.parse(val);
					text = decoded.first_name + ' ' + decoded.last_name + ' (' + decoded.email + ')';
				}
				var $li = $('<li class="m-row"><input type="hidden" name="' + inputName + '" value=\'' + val + '\'/><span class="m-cell-lock sevenEighth">' + text + '</span><div class="m-cell-lock oneEighth textRight"><span class="icon-delete"></span></div></li>');
				$li.data('value', val);
				$ul.append($li);
			});
			$container.append($ul);
			if (!creatingInstructor) {
				if (allowMultiples || (!allowMultiples && !selectedOptions.length)) {
					$container.append('<input type="text" class="instructor-search" placeholder="' + jsmsgInstructorEmail + '"/>');
				}
			} else {
				$container.append('<input type="text" value="' + email + '" rel="email" placeholder="' + jsmsgEmail + '" disabled="disabled">');
				$container.append('<input type="text" rel="first_name" placeholder="' + jsmsgFirstName + '">');
				$container.append('<input type="text" rel="last_name" placeholder="' + jsmsgLastName + '">');
				var div = $('<div class="textRight"></div>');
				div.append('<button class="btn cancelButton">' + jsmsgCancel + '</button>');
				div.append('<button class="btn saveButton">' + jsmsgAdd + '</button>');
				$container.append(div);
			}
			$parent.html($container);
			$el.focus();
			$container.find('input[name]').trigger('change');
		};

		$parent.on('click', '.icon-delete', function () {
			var value = $(this).closest('li').data('value');
			selectedOptions = selectedOptions.filter(function (item) {
				return item !== value
			});
			var form = $(this).closest('form');
			self.redraw();
			if(form.size()) {
				form.trigger('change');
			}
		});

		function addValueToSFV(jsonValue, email) {
			var values = [];
			if (!allowMultiples) {
				values = [jsonValue];
			} else {
				selectedOptions.forEach(function (key) {
					values.push(key);
				});
				if (values.indexOf(jsonValue) === -1) {
					if (email && _options[jsonValue]) {
						_options[jsonValue] = _options[jsonValue] + ' (' + email + ')';
					}
					values.push(jsonValue);
				}
			}

			if (email) {
				window.instructorSiteFieldLookup[email] = jsonValue;
			}
			selectedOptions = values;
			$el.val('');
			self.redraw();
		}

		var lastAjax = null;
		var timer;
		$parent.on('keyup', 'input.instructor-search', function () {
			clearTimeout(timer);
			var $input = $(this);
			timer = setTimeout(function () {
				email = $input.val();
				if (email.length >= 6) {
					if (window.instructorSiteFieldLookup[email]) {
						addValueToSFV(window.instructorSiteFieldLookup[email]);
						return;
					}

					if (lastAjax !== null) {
						lastAjax.abort();
						lastAjax = null;
					}
					lastAjax = UP.Services.AjaxGetCall('/participants/ajax/get-participant-info.php', {
						action: 'instructorByEmail',
						email: email
					}, function (response) {
						if (response.error) {
							addError(response.error);
						} else if (response.instructor) {
							addValueToSFV(JSON.stringify({instructor_id: parseInt(response.instructor.instructor_id, 10)}), email);
						} else {
							creatingInstructor = true;
							self.redraw();
						}
					});
				}
			}, 500);
		});

		$parent.on('click', '.cancelButton', function (event) {
			event.preventDefault();
			creatingInstructor = false;
			self.redraw();
		});

		$parent.on('click', '.saveButton', function (event) {
			event.preventDefault();
			var data = {
				email: $parent.find('input[rel="email"]').val(),
				first_name: $parent.find('input[rel="first_name"]').val(),
				last_name: $parent.find('input[rel="last_name"]').val()
			};
			if (data.email && data.first_name && data.last_name) {
				addValueToSFV(JSON.stringify(data), data.email);
				creatingInstructor = false;
				self.redraw();
			}
		});

		self.redraw();
	};
	$.fn.jQueryInstructorField = function () {
		var args = arguments;
		this.each(function () {
			var $this = $(this),
				$InstructorField = $(this).data('InstructorField');
			if (!$InstructorField) {
				$InstructorField = new JQueryInstructorField($this);
				$(this).data('InstructorField', $InstructorField);
			}
			if (args.length > 0) {
				var fn = args.shift();
				if (typeof $InstructorField[fn] === 'function') {
					$InstructorField[fn](args);
				}
			}
		});
	};

	$(document).on('click', '.btnDeleteUser', function (e) {
		e.preventDefault();
		if(!confirm(jsmsgConfirmDeleteAccount)){
			return false;
		}

		var data = {};
		data.action = 'DELETE_USER';
		data.delete_user_id = $(this).data('deleteUserId');
		data.view_user_id = $(this).data('viewUserId');

		var url = '/admin/users/?user=' + data.view_user_id;
		$.ajax({
			url: url,
			type: 'POST',
			dataType: 'json',
			data: data,
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				//don't alert of errors if the request was just cancelled
				if(XMLHttpRequest.status !== 0) {
					alert(jsmsgErrorUnknown);
				}
			},
			success: function (response) {
				if (response.error) {
					alert(response.error);
				} else if (response.errors) {
					alert(response.errors.join("\n"));
				} else if (response.redirect) {
					window.location.href = response.redirect;
				} else if (response.reload) {
					window.location.reload();
				}
			},
			beforeSend: function () {
				$.fancybox.showActivity;
			},
			complete: function () {
				$.fancybox.hideActivity;
			}
		});

	});

	$(document).on('click', '.btnUnlinkUser', function (e) {
		e.preventDefault();
		if(!confirm(jsmsgConfirmUnlinkAccount)){
			return false;
		}

		var data = {};
		data.action = 'UnlinkUser';
		data.unlink_user_id = $(this).data('unlinkUserId');
		data.view_user_id = $(this).data('viewUserId');

		var url = '/admin/users/?user=' + data.view_user_id;
		$.ajax({
			url: url,
			type: 'POST',
			dataType: 'json',
			data: data,
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				//don't alert of errors if the request was just cancelled
				if(XMLHttpRequest.status !== 0) {
					alert(jsmsgErrorUnknown);
				}
			},
			success: function (response) {
				if (response.error) {
					alert(response.error);
				} else if (response.errors) {
					alert(response.errors.join("\n"));
				} else if (response.redirect) {
					window.location.href = response.redirect;
				} else if (response.reload) {
					window.location.reload();
				}
			},
			beforeSend: function () {
				$.fancybox.showActivity;
			},
			complete: function () {
				$.fancybox.hideActivity;
			}
		});

	});
}(jQuery));

/*
formats translations from moment for timepicker and datepicker(source/js/jquery-ui-timepicker-addon.js)
 */
var moment_conversation = {
	'dateTimePicker': {
		'A': 'TT',
		'Y': 'yy',
		'MM': 'mm',
		'DD': 'dd'
	},
	'timePicker': {
		'HH': 'H',
		'h': 'g',
		'mm': 'i',
		'ss': 's'
	}
};

/*
Translation from moment date/time formats for datetimepicker, datepicker, timepicker
set timePickerOnly=true for timepicker only
 */
function convertFromMoment(format, timePickerOnly) {
	var _caller = timePickerOnly === true ? 'timePicker' : 'dateTimePicker';
	var _subStr = [];
	var _s = format.indexOf(' ');
	if (_s !== -1) {
		if (format.indexOf(':') !== -1) {//for time
			_subStr = (format.substr(0, _s)).split(':');
		} else {//for date
			_subStr = (format.substr(0, _s)).split('-');
		}
		var _amPMzone = format.split(' ');
		_subStr.push(_amPMzone[1]);//get AM/PM formatting if exist
		/*if (typeof _amPMzone[2] !== 'undefined') {//Zone
			_subStr.push(_amPMzone[2]);
		}*/
	} else {
		if (format.indexOf(':') !== -1) {//for time
			_subStr = format.split(':');
		} else {//for date
			_subStr = format.split('-');
		}
	}
	for (var i = 0; i < _subStr.length; i++) {
		if (_subStr[i] !== 'undefined' && _subStr[i] in moment_conversation[_caller]) {
			format = format.replace(_subStr[i], moment_conversation[_caller][_subStr[i]]);
		}
	}
	return format;
}

var getActionUrl = function (action, viewUserId, url) {
	var params = {action: action};
	if (typeof viewUserId !== 'undefined') {
		params.user = viewUserId;
	}
	return (url ? url : window.location.pathname) + '?' + $.param(params);
};

let CompareParticipantsModal = function () {
	var self = this;
	let _lastMaxHeightByRow = {}, _cacheComparisons = {};
	self.errors = ko['observableArray']([]);
	self.errorsByKey = ko.observable({});
	self.warnings = ko['observableArray']([]);
	self.participant_fields = ko['observableArray']([]);
	self.compare_view = ko.observable(null);
	self.all_participants = ko['observableArray']([]);
	self.participantByIds = ko['pureComputed'](function () {
		let participantByIds = {};
		self.all_participants().forEach(function (participant) {
			participantByIds[participant.participant_id()] = participant;
		});
		return participantByIds;
	});
	self.base_participant_id = ko.observable(null);
	self.base_participant = ko['pureComputed'](function () {
		return self.participantByIds()[self.base_participant_id()];
	});
	self.matching_participant_id = ko.observable(null);
	self.matching_participant = ko['pureComputed'](function () {
		let matching_participant_id = self.matching_participant_id(), base_participant_id = self.base_participant_id();
		if (base_participant_id && matching_participant_id && -base_participant_id !== -matching_participant_id) {
			_getOtherConflictData(base_participant_id, matching_participant_id);
		}
		return self.participantByIds()[matching_participant_id];
	});

	self.matchOptions = ko['pureComputed'](function () {
		return self.all_participants().filter(function (p) {
			return p.participant_id() !== self.base_participant_id();
		});
	});
	self.site_fields = ko['observableArray']([]);
	self.conflictTitles = ko['observableArray']([]);
	self.lookupParticipant = ko.observable();
	self.lookupParticipant['subscribe'](function (values) {
		if (Array.isArray(values) && values.length === 1) {
			let participant_id = values[0].k;
			setTimeout(function() {
				self.lookupParticipant([]);
			});
			if (self.participantByIds()[participant_id]) {
				self.matching_participant_id(participant_id);
				return;
			}
			let get = {
				action: 'GetParticipant',
				participant_id: participant_id
			};
			UP.Services.AjaxGetCall('/admin/participant-duplicate.php', get, function (response) {
				if (response.participant) {
					self.root.addOriginalParticipant(response.participant);
					let participant = new Participant({data: response.participant, parent: self.root});
					self.all_participants.push(participant);
					self.matching_participant_id(participant.participant_id());
				}
			});
		}
	});
	self.ignoreParticipantIds = ko.pureComputed(function () {
		return self.all_participants().map(function (participant) {
			return '' + participant.participant_id();

		});
	});

	self.allowSwap = ko.observable(false);
	self.processing = ko.observable(false);
	self.postMergeCallback = ko.observable(null);
	self.processMerge = function () {
		self.processing(true);
		let match = self.compare_view(),
			base = self.base_participant(),
			form = new FormData();

		form.append('participant[participant_id]', self.base_participant_id());
		form.append('matching_participant_id', self.matching_participant().participant_id());
		[
			'first_name',
			'last_name',
			'gender_id',
			'birthdate',
			'participant_since'
		].forEach(function (key) {
			if (match[key] && base[key] && match[key]() !== base[key]()) {
				form.append('participant[' + key + ']', match[key]());
			}
		});
		self.site_fields().forEach(function (site_field) {
			let baseSFV = base.getSiteFieldValueBySiteFieldId(site_field.site_field_id()),
				compareSFV = match.getSiteFieldValueBySiteFieldId(site_field.site_field_id());
			if (JSON.stringify(baseSFV.getValues()) !== JSON.stringify(compareSFV.getValues())) {
				let sfv = new SiteFieldValue(site_field, base, compareSFV.getValues());
				sfv.addToFormData(form);
			}
		});
		let matchConflicts = match.conflicts();
		base.conflicts().forEach(function (conflict, index) {
			let matchConflict = ko.mapping.toJS(matchConflicts[index]);
			Object.keys(matchConflict).forEach(function (key) {
				form.append('conflicts[' + index + '][' + key + ']', emptyIfNull(matchConflict[key]));
			});
			if (self.compareConflict(conflict, index)) {
				form.append('conflicts[' + index + '][keep]', '1');
			}
		});

		UP.Services.AjaxPostMultipartForm(getActionUrl('MergeParticipants', null, '/admin/participant-duplicate.php'), form, function (response) {
			self.processing(false);
			if (response.errors) {
				let errors = [];
				let errorsByKey = {};
				self.errors([]);
				self.errorsByKey({});
				Object.keys(response.errors).forEach(function (key) {
					let isInt = validate.single(key, {numericality: true});
					if (typeof isInt === 'undefined') {
						errors.push(response.errors[key]);
					} else {
						errorsByKey[key] = response.errors[key];
					}
				});
				self.errors(errors);
				self.errorsByKey(errorsByKey);
				if (response['refreshConflicts']) {
					_getOtherConflictData(self.base_participant_id(), self.matching_participant_id(), true);
				}
				updateFB();
				return null;
			}
			self.cancel();
			let callback = self.postMergeCallback();
			if (typeof callback === 'function') {
				callback(response);
			}
		});
	};

	self.cancelCallback = ko.observable(null);
	self.cancel = function () {
		$.fancybox.close();
		let callback = self.cancelCallback();
		if (typeof callback === 'function') {
			callback();
		}
	};

	self.swap = function () {
		let base_participant_id = self.base_participant_id(), matching_participant_id = self.matching_participant_id();
		self.base_participant_id(null);
		self.matching_participant_id(null);
		self.base_participant_id(matching_participant_id);
		self.matching_participant_id(base_participant_id);
		updateFB();
	};

	self.isAdminScope = ko.observable(false);
	self.setRoot = function (val) {
		self.root = val;
		self.isAdminScope(self.root.hasOwnProperty('adminScope') && self.root.adminScope());
	};

	self.getSFV = function (siteFieldValue) {
		var site_field_id = null;
		if(siteFieldValue['site_field'] instanceof SiteField) {
			site_field_id = siteFieldValue.site_field.site_field_id();
		} else {
			site_field_id = siteFieldValue.site_field_id();
		}
		var createNewValues = self.compare_view();
		if (createNewValues) {
			return createNewValues.site_field_values().find(function (sfv) {
				return site_field_id === sfv.site_field.site_field_id();
			});
		}
		return null;
	};

	self.getSiteFieldValuesData = function (siteFieldValue) {
		var sfv = self.getSFV(siteFieldValue);
		return sfv ? sfv.values() : [];
	};

	self.copySFV = function (sfvToCopy) {
		let participant = self.compare_view();
		if (participant) {
			let site_field = (sfvToCopy['site_field'] instanceof SiteField) ? sfvToCopy.site_field : null;
			if (site_field) {
				let sfvToReceiveValues = participant.getSiteFieldValueBySiteFieldId(site_field.site_field_id());
				if (!site_field.allowMultiples()) {
					sfvToReceiveValues.setValues(sfvToCopy.getValues());
				} else {
					let currentValues = sfvToReceiveValues.getValues(),
						baseSFV = self.base_participant().getSiteFieldValueBySiteFieldId(site_field.site_field_id()),
						matchSFV = self.matching_participant().getSiteFieldValueBySiteFieldId(site_field.site_field_id());
					let union = _.union(baseSFV.getValues(), matchSFV.getValues()).sort();
					let tempValues = _.union(currentValues, sfvToCopy.getValues()).sort();
					if (_.isEqual(union, tempValues)) {
						sfvToReceiveValues.setValues(tempValues);
					} else {
						sfvToReceiveValues.setValues(sfvToCopy.getValues());
					}
				}
			}
			updateCacheComparisons.call(self);
		}
	};

	self.getSiteFieldClassName = function(site_field) {
		if(typeof site_field['site_field'] === 'function') {
			site_field = site_field.site_field;
		}
		var ret = {};
		ret['site-field-' + ko.unwrap(site_field.site_field_id)] = true;
		return ret;
	};

	self.compareConflict = function (conflict_a, index) {
		let compare_view = self.compare_view();
		if (compare_view) {
			let conflict_b = compare_view.conflicts()[index];
			if (conflict_a && conflict_b) {
				return  JSON.stringify(ko.mapping.toJS(conflict_a)) === JSON.stringify(ko.mapping.toJS(conflict_b));
			}
		}
		return false;
	};

	self.copyParticipantValue = function (targetProperty, values) {
		if (self.compare_view()[targetProperty]) {
			self.compare_view()[targetProperty](values);
			updateCacheComparisons.call(self);
		}
	};
	self.copyConflict = function (conflict_a, index) {
		if (self.isLocked(conflict_a, index)) {
			return;
		}
		let compare_view = self.compare_view();
		if (compare_view) {
			let conflict_b = compare_view.conflicts()[index];
			if (conflict_a && conflict_b) {
				let conflict = new Conflict(ko.mapping.toJS(conflict_a));
				compare_view.conflicts.replace(conflict_b, conflict);
			}
			updateCacheComparisons.call(self);
		}
	};
	function updateCacheComparisons () {
		let self = this;
		let base_participant_id = self.base_participant_id(), participant_id = self.matching_participant_id();
		if (parseInt(base_participant_id, 10) && parseInt(participant_id, 10)) {
			_cacheComparisons[[base_participant_id, participant_id].join(':')]['compareView'] = self.compare_view();
			_cacheComparisons[[participant_id, base_participant_id].join(':')]['compareView'] = self.compare_view();
		}
	}
	self.isLocked = function (conflict, index) {
		if (conflict.type() === 'uplifter\\conflicts\\SkateCanadaConflicts') {
			let baseConflict = self.base_participant().conflicts()[index],
				matchConflict = self.matching_participant().conflicts()[index];
			return (
				(baseConflict['skate_canada_contact_guid']() && !matchConflict['skate_canada_contact_guid']()) ||
				(!baseConflict['skate_canada_contact_guid']() && matchConflict['skate_canada_contact_guid']())
			);
		}
		return false;
	};
	self.mergeIssue = ko.observable(false);
	let _lastMergeIssue = false;
	ko.computed(function () {
		let mergeIssue = self.mergeIssue();
		if (_lastMergeIssue !== mergeIssue) {
			let errors = self.errors();
			if (mergeIssue && !_lastMergeIssue && errors.indexOf(mergeIssue) === -1) {
				self.errors.push(mergeIssue);
			} else if (_lastMergeIssue && !mergeIssue && errors.indexOf(_lastMergeIssue) !== -1) {
				self.errors.remove(_lastMergeIssue);
			}
			_lastMergeIssue = mergeIssue
		}
	});

	let Conflict = function (data) {
		let self = this;
		ko.mapping.fromJS(data, {}, self);
	};
	self.fetching = ko.observable(false);
	let _getOtherConflictData = function (base_participant_id, participant_id, force, callback) {
		if (parseInt(base_participant_id, 10) && parseInt(participant_id, 10)) {
			let key = [base_participant_id, participant_id].join(':');
			if (!force && _cacheComparisons[key]) {
				let participantByIds = self.participantByIds();
				participantByIds[base_participant_id].conflicts(_cacheComparisons[key][base_participant_id]||[]);
				participantByIds[participant_id].conflicts(_cacheComparisons[key][participant_id]||[]);
				self.compare_view(_cacheComparisons[key]['compareView']);
				self.conflictTitles(_cacheComparisons[key]['conflictTitles']||[]);
				self.mergeIssue(_cacheComparisons[key]['mergeIssue']||false);
				if (typeof callback === 'function') {
					callback();
				}
			} else {
				let get = {
					action: 'GetOtherConflictData',
					base_participant_id: base_participant_id,
					participant_id: participant_id
				};
				self.fetching(true);
				UP.Services.AjaxGetCall('/admin/participant-duplicate.php', get, function (response) {
					self.fetching(false);
					if (response.errors) {
						self.root.errors(response.errors);
						return null;
					}
					_cacheComparisons[[base_participant_id, participant_id].join(':')] = {};
					_cacheComparisons[[participant_id, base_participant_id].join(':')] = {};
					let compareView = new Participant({
						data: self.root.getOriginalParticipantById(base_participant_id),
						parent: self.root
					});
					self.compare_view(compareView);
					_cacheComparisons[[base_participant_id, participant_id].join(':')]['compareView'] = compareView;
					_cacheComparisons[[participant_id, base_participant_id].join(':')]['compareView'] = compareView;
					if(response.conflicts) {
						let participantByIds = self.participantByIds(), cache = {}, conflictTitles = [];
						participantByIds[base_participant_id].conflicts([]);
						participantByIds[participant_id].conflicts([]);
						self.compare_view().conflicts([]);
						let skateCanada;
						Object.keys(response.conflicts).forEach(function (participant_id) {
							if (participantByIds[participant_id]) {
								let conflicts = (response.conflicts[participant_id]||[]).map(function (data) {
									if (data['summary'] && conflictTitles.indexOf(data['summary']) === -1) {
										conflictTitles.push(data['summary']);
									}
									if (
										!response.mergeIssue &&
										!skateCanada &&
										data['type'] === 'uplifter\\conflicts\\SkateCanadaConflicts' &&
										data['skate_canada_contact_guid']
									) {
										skateCanada = $.extend(true, {}, data);
									}
									return new Conflict(data);
								});
								cache[participant_id] = conflicts;
								participantByIds[participant_id].conflicts(conflicts);
							}
						});
						let	conflicts = (response.conflicts[base_participant_id]||[]).map(function (data) {
							if (skateCanada && data['type'] === 'uplifter\\conflicts\\SkateCanadaConflicts') {
								data = skateCanada;
							}
							return new Conflict(data);
						});
						self.compare_view().conflicts(conflicts);
						cache['compareView'] = self.compare_view();

						cache['conflictTitles'] = conflictTitles;
						cache['mergeIssue'] = response.mergeIssue;
						_cacheComparisons[[base_participant_id, participant_id].join(':')] = cache;
						_cacheComparisons[[participant_id, base_participant_id].join(':')] = cache;
						self.conflictTitles(conflictTitles);
						self.mergeIssue(response.mergeIssue);
					}
					if (typeof callback === 'function') {
						callback();
					}
				});
			}
		}
	};

	self.showSiteField = function (site_field) {
		let base_participant = self.base_participant(), matching_participant = self.matching_participant();
		if (base_participant && matching_participant) {
			let baseSFV = base_participant.getSiteFieldValueBySiteFieldId(site_field.site_field_id()),
				matchSFV = matching_participant.getSiteFieldValueBySiteFieldId(site_field.site_field_id());
			return (
				(
					baseSFV.getValues().length &&
					matchSFV.getValues().length &&
					!baseSFV.compareValue(matchSFV.values())
				) ||
				(
					!baseSFV.getValues().length &&
					matchSFV.getValues().length
				)
			);
		}
		return false;
	};

	self.afterClose = function () {
		_lastMaxHeightByRow = {};
		_cacheComparisons = {};
		self.mergeIssue(false);
	};

	self.open = function () {
		self.errors([]);
		let base_participant_id = self.base_participant_id(), matching_participant_id = self.matching_participant_id();
		if (base_participant_id && matching_participant_id) {
			_getOtherConflictData(base_participant_id, matching_participant_id, false, function () {
				showModal({
					template: 'compareTemp',
					viewModel: self
				});
			});
		} else if (base_participant_id && !matching_participant_id) {
			let compareView = new Participant({
				data: self.root.getOriginalParticipantById(base_participant_id),
				parent: self.root
			});
			self.compare_view(compareView);
			showModal({
				template: 'compareTemp',
				viewModel: self
			});
		} else {
			console.error('Missing participant data!!');
		}
	};
	(function () {
		let render = function () {
			let $compareModal = $('#compareModal'),
				maxHeightByRow = {},
				toUpdate = {};
			if ($compareModal.length) {
				let columns = $('.mergeColumn');
				columns.each(function (i, col) {
					$(col).find('.cell-default').each(function (j, cell) {
						let cssClass = 'mergeRow_' + j, $cell = $(cell), cellHeight = $cell.find('.cellContent').height()||0, cssClasses = $cell.attr('class').split(' ');
						let setClass = cssClasses.find(function (entry) {
							return entry.match(/^mergeRow_.+/);
						});
						if (setClass && setClass !== cssClass) {
							$cell.removeClass(setClass);
						}
						if (!$cell.hasClass(cssClass)) {
							$cell.addClass(cssClass);
						}
						if (!maxHeightByRow[cssClass]) {
							maxHeightByRow[cssClass] = cellHeight;
						}
						if (cellHeight > maxHeightByRow[cssClass]) {
							maxHeightByRow[cssClass] = cellHeight;
						}
					});
				});
				Object.keys(maxHeightByRow).forEach(function (cssClass) {
					let elements = $('.' + cssClass), i, len = elements.length, forceUpdate = false;
					for (i = 0; i < len; i++) {
						if ($(elements[i]).height() !== maxHeightByRow[cssClass]) {
							forceUpdate = true;
							break;
						}
					}
					if (maxHeightByRow[cssClass] !== _lastMaxHeightByRow[cssClass] || forceUpdate) {
						toUpdate[cssClass] = maxHeightByRow[cssClass];
						_lastMaxHeightByRow[cssClass] = maxHeightByRow[cssClass];
					}
				});
				Object.keys(toUpdate).forEach(function (cssClass) {
					let $cell = $('.' + cssClass);
					$cell.height(toUpdate[cssClass]);
				});
			}
			window.requestAnimationFrame(render);
		};
		window.requestAnimationFrame(render);
	})();
};

function removeURLParameter(url, parameter) {
	//prefer to use l.search if you have a location/link object
	var urlparts = url.split('?');
	if (urlparts.length >= 2) {

		var prefix = encodeURIComponent(parameter) + '=';
		var pars = urlparts[1].split(/[&;]/g);

		//reverse iteration as may be destructive
		for (var i = pars.length; i-- > 0;) {
			//idiom for string.startsWith
			if (pars[i].lastIndexOf(prefix, 0) !== -1) {
				pars.splice(i, 1);
			}
		}

		return urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : '');
	}
	return url;
}

var ConfirmModal = function (msg) {
	let self = this;
	self.errors = ko['observableArray']([]);
	self.warnings = ko['observableArray']([]);
	self.success = ko['observableArray']([]);
	self.extraOption = ko.observable();
	self.selected = ko.observable();
	self.msg = ko.observable(msg);
	self.isWarning = ko.observable();
	self.hideCancel = ko.observable();
	self.hideOk = ko.observable();
	self.cancel = function () {
		$.fancybox.close();
	};
	self.ok = function () {
		$.fancybox.close();
	};
};
function openConfirm (data, then, cancel, extraOption, hideCancel) {
	let modal;
	if (typeof data === 'string') {
		modal = new ConfirmModal(data);
		modal.extraOption(extraOption);
		modal.hideCancel(hideCancel);
		if (typeof then === 'function') {
			modal.ok = function () {
				if (typeof then === 'function') {
					then(this);
				} else {
					$.fancybox.close();
				}
			}.bind(modal);
			if (typeof cancel === 'function') {
				modal.cancel = function () {
					if (typeof cancel === 'function') {
						cancel();
					}
					$.fancybox.close();
				}.bind(modal);
			}
		}
	} else if (typeof data === 'object' && data.constructor.name === 'ConfirmModal') {
		modal = data;
	}
	if (!modal) {
		return;
	}
	showModal({
		template: 'confirmModalTemp',
		viewModel: modal,
		minWidth: '320px',
		maxWidth: '500px'
	});
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 */
function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function getRandomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

function getUrlParameter(name, win) {
	var win = typeof win !== 'undefined' ? win : window;
	name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
	var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
	var results = regex.exec(win.location.search);
	return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

function removeUrlParameter(url, parameter) {
	var urlParts = url.split('?');

	if (urlParts.length >= 2) {
		// Get first part, and remove from array
		var urlBase = urlParts.shift();

		// Join it back up
		var queryString = urlParts.join('?');

		var prefix = encodeURIComponent(parameter) + '=';
		var parts = queryString.split(/[&;]/g);

		// Reverse iteration as may be destructive
		for (var i = parts.length; i-- > 0;) {
			// Idiom for string.startsWith
			if (parts[i].lastIndexOf(prefix, 0) !== -1) {
				parts.splice(i, 1);
			}
		}

		url = urlBase;
		if (parts.length) {
			url += '?' + parts.join('&');
		}

	}

	return url;
}

function emptyIfNull(val) {
	if (typeof val === 'undefined' || val === null || val === 'undefined') {
		return '';
	}
	return val;
}

var CaptchaCallback = function() {
	$('.recaptcha').each(function() {
		var $this = $(this);
		setTimeout(function() {
			if(!$this.data('captcha-rendered')) {
				$this.data('captcha-rendered', true)
				if ($this.data('action')) {
					grecaptcha.execute($this.data('sitekey'), {
						action: $this.data('action')
					}).then(function (token) {
						if ($this.is('input')) {
							$this.val(token);
						}
					}, function () {
					});//this function must exist in case of errors
				} else {
					grecaptcha.render($this[0], {
						siteKey: $this.data('sitekey')
					});
				}
			}
		});
	});
};
function interpolate(theString, argumentArray) {
	let regex = /%s/;
	let _r = function(p,c){
		return p.replace(regex,c);
	};
	return argumentArray.reduce(_r, theString);
}
var AddPolicy = function (root) {
	let self = this;
	self.errors = ko['observableArray']([]);
	self.warnings = ko['observableArray']([]);
	self.type = ko.observable();
	self.type_singular = ko.observable();
	self.club_policies = ko['pureComputed'](function () {
		let type = self.type(),
			club_policies = root.club_policies && root.club_policies()||[];
		if (!type) {
			return club_policies;
		}
		return (club_policies).filter(function (club_policy) {
			return club_policy.groupingType() === type;
		});
	});
	self.selected_policies = ko['observableArray']([]);
	self.addCallback = ko.observable(null);
	self.open = function () {
		return showModal({
			template: 'addPolicyTemp',
			viewModel: self
		});
	};
	self.add = function () {
		if (typeof self.addCallback() === 'function') {
			self.addCallback()(self);
		} else {
			self.deferredResult.resolve(self.selected_policies());
		}
	};
	self.cancel = function () {
		self.errors([]);
		self.deferredResult.resolve(false);
	};
};

var EditRecurringFee = function (originalEntry, root) {
	let self = this;
	const EXPIRY_DATE = 'expiry_date';
	const EXPIRY_COUNT = 'expiry_count';
	let options = {
			recurrence_error: null,
			recurrence_interval_start_time_formatted: null,
			recurrence_interval_end_time_formatted: null,
			recurrence_renewal_expiry_formatted: null,
			recurrence_remaining_renewal_count: null,
			recurrence_hold_until_formatted: null,
			recurrence_percent: null,
			recurrence_total: null,
			recurrence_late_fee: null,
			onHold: null,
			recurrence_duration: null,
			registration: null,
			order_item_id: null,
			update_time: null,
			recurrence_duration_holder: null,
			recurrence_percent_holder: null,
			recurrence_total_holder: null,
			next_interval_price: null
		},
		data = Object.assign({}, options, originalEntry || {});
	Object.keys(data).forEach(function(k) {
		if (typeof options[k] === 'undefined') {
			delete data[k];
		}
	});
	data = ko.mapping.toJS(data);
	ko.mapping.fromJS({}, {include: ['recurringFee', 'getPostData', 'expiryOption', 'expiryDate', 'expiryCount']}, self);
	self.recurringFee = ko.observable(ko.mapping.fromJS(data, {
		recurrence_percent: {
			create: function (options) {
				return ko.observable(options.data && round(options.data*100, 2));
			}
		}
	}));
	self.errors = ko['observableArray']([]);
	self.warnings = ko['observableArray']([]);
	self.success = ko['observableArray']([]);
	self.errorsByKey = ko.observable({});
	self.expiryOptions = ko['pureComputed'](function () {
		return root.expiryOptions();
	});
	if (self.recurringFee()) {
		self.recurringFee().onHold['subscribe'](function () {
			updateFB();
		});
	}
	self.expiryOption = ko.observable();
	self.expiryDate = ko.observable();
	self.expiryCount = ko.observable();
	if (data['recurrence_renewal_expiry_formatted']) {
		self.expiryOption(EXPIRY_DATE);
		self.expiryDate(data['recurrence_renewal_expiry_formatted']);
	} else if (data['recurrence_remaining_renewal_count'] !== null && data['recurrence_remaining_renewal_count'] >= 0) {
		self.expiryOption(EXPIRY_COUNT);
		self.expiryCount(data['recurrence_remaining_renewal_count']);
	} else {
		self.expiryOption();
	}
	self.editRecurrenceTotal = ko['pureComputed'](function () {
		return !originalEntry.registration();
	});
	self.isLateFee = ko['pureComputed'](function () {
		return (
			(originalEntry['recurrence_late_fee'] && originalEntry.recurrence_late_fee()) ||
			(originalEntry.product && originalEntry.product() && originalEntry.product()['recurrence_late_fee'] && originalEntry.product()['recurrence_late_fee']())
		);
	});

	self.actualAmountToBePaid = self.next_interval_price;

	self.open = function () {
		return showModal({
			template: 'editRecurringFeeEditTemp',
			viewModel: self
		});
	};
	self.expiryOptionSummary = ko['pureComputed'](function () {
		let option = self.expiryOptions().find(function (option) {
			return option.k() === self.expiryOption();
		});
		return option ? option.v() : null;
	});
	self.recurrencePercentHolder = ko['pureComputed'](function () {
		let placeholder = null;
		if (self.recurringFee()['recurrence_percent_holder'] && self.recurringFee()['recurrence_percent_holder']()) {
			placeholder = self.recurringFee()['recurrence_percent_holder']();
		} else if (originalEntry && originalEntry.product() && originalEntry.product().recurrence_percent) {
			placeholder = originalEntry.product().recurrence_percent();
		}
		return placeholder !== null ? round(placeholder*100, 2): null;
	});
	self.recurrenceTotalHolder = ko['pureComputed'](function () {
		if (self.recurringFee()['recurrence_total_holder'] && parseInt(self.recurringFee()['recurrence_total_holder']()) >= 0) {
			return self.recurringFee()['recurrence_total_holder']();
		} else {
			let product = originalEntry && originalEntry.product();
			if (product) {
				if (product.recurrence_total && parseInt(product.recurrence_total()) >= 0) {
					return product.recurrence_total();
				} else if (product.total && parseInt(product.total()) >= 0) {
					return product.total();
				}
			}
		}
		return null;
	});
	self.recurrenceDurationHolder = ko['pureComputed'](function () {
		if (self.recurringFee()['recurrence_duration_holder'] && self.recurringFee()['recurrence_duration_holder']()) {
			return self.recurringFee()['recurrence_duration_holder']();
		} else if (originalEntry && originalEntry.product() && originalEntry.product().recurrence_duration) {
			return originalEntry.product().recurrence_duration();
		}
		return null;
	});
	self.getPostData = ko.pureComputed(function () {
		let recurringFee = self.recurringFee(),
			post = {
				order_item_id: recurringFee.order_item_id(),
				update_time: recurringFee.update_time()
			};
		if (self.expiryOption() === EXPIRY_DATE) {
			post.recurrence_renewal_expiry_formatted = self.expiryDate();
		} else if (self.expiryOption() === EXPIRY_COUNT) {
			post.recurrence_remaining_renewal_count = self.expiryCount();
		}
		let onHold = recurringFee['onHold'](), recurrence_hold_until_formatted = recurringFee['recurrence_hold_until_formatted']();
		post.onHold = onHold;
		if (onHold && recurrence_hold_until_formatted) {
			post.recurrence_hold_until_formatted = recurrence_hold_until_formatted;
		}
		post.recurrence_interval_start_time_formatted = recurringFee.recurrence_interval_start_time_formatted()||null;
		post.recurrence_interval_end_time_formatted = recurringFee.recurrence_interval_end_time_formatted()||null;
		post.recurrence_duration = recurringFee.recurrence_duration();

		if (self.editRecurrenceTotal() && (recurringFee.recurrence_total() || self.recurrenceTotalHolder() === null)) {
			post.recurrence_total = recurringFee.recurrence_total()||null;
		}
		let recurrence_percent = recurringFee.recurrence_percent();
		if (self.isLateFee() && (recurrence_percent || self.recurrencePercentHolder() === null)) {
			post.recurrence_percent = recurrence_percent ? recurrence_percent/100 : null;
		}
		return post;
	});
	let toBeReplaced;
	self.update = function () {
		self.errorsByKey({});
		self.errors([]);
		let post = self.getPostData();
		let errors = validate(post, root.constraints);
		if (errors) {
			self.errorsByKey(errors);
			return;
		}
		post.action = 'EditRecurrenceFee';
		UP.Services.AjaxPostCall(location.href, post, function (response) {
			if (response.errors) {
				self.errorsByKey(response.errors);
				return;
			} else if (response.error) {
				self.errors([response.error]);
				updateFB();
				return;
			} else if (response.warnings) {
				self.warnings(response.warnings);
				toBeReplaced = ko.mapping.fromJS(response.recurringFee);
				root.recurringFees.replace(originalEntry, toBeReplaced);
				self.recurringFee(toBeReplaced);
				setTimeout(function () {
					self.warnings([]);
				}, 1500);
				updateFB();
				return;
			}
			if (toBeReplaced) {
				response.toBeReplaced = toBeReplaced;
				toBeReplaced = null;
			}
			self.deferredResult.resolve(response);
		});
	};
	self.cancel = function () {
		$.fancybox.close();
	};
};

var WithdrawItemList = function(data, root) {
	let self = this;
	ko.mapping.fromJS(data, {
		itemWithdrawList: {
			create: function (options) {
				return new WithdrawItem(options.data);
			}
		}
	}, self);

	self.fancybox = $.fancybox;
	self.close = function() {
		self.fancybox.close();
		if (self.hasWithdrawnItem() === 1) {
			location.reload();
		}
		return false;
	};

	self.itemWithdrawListById = ko.pureComputed(function() {
		var itemWithdrawListById = {};
		self.itemWithdrawList().forEach(function(item) {
			itemWithdrawListById[item.registration.program_registration_id()] = item;
		});
		return itemWithdrawListById;
	});

	self.getItemFromListById = function(registrationId) {
		let programRegistrationId = registrationId;
		if (typeof self.itemWithdrawList !== "undefined") {
			return self.itemWithdrawListById()[programRegistrationId];
		}
		return null;
	};

	self.checkItemsToWithdraw = function() {
		let canWithdraw = false;
		self.itemWithdrawList().forEach(function(item) {
			if(!item.submittedWithSuccess() && item.displayForWithdrawal) {
				canWithdraw = true;
			}
		});
		self.hasItemsToWithdraw(canWithdraw);
	}

	self.hasItemsToWithdraw = ko.observable(1);
	self.hasWithdrawnItem = ko.observable(0);



	self.withdraw_item = function() {
		let program_registration_id = [];
		self.itemWithdrawList().forEach(function(item) {
			if (item.program_registration()) {
				program_registration_id.push({
					program_registration_id: item.registration.program_registration_id(),
					refund_mode: item.refund_mode(),
					reassigned_order_item_id: item.reassigned_order_item()
				});
			}
		});

		if ( ! program_registration_id) {
			alert(
				jsmsgErrorNoParticipantIdentified
			);

			return false;
		}

		let data = {
			action: 'WithdrawItem',
			program_registration_id: program_registration_id
		};

		self.fancybox.showLoading();
		let url = self.adminScope() ? '/admin/ajax/withdraw-item.php' : '/users/ajax/withdraw-item.php';
		UP.Services.AjaxPostCall(url, data, function (response) {
			try {
				if (response.error) {
					alert(response.error);
				} else {
					response.forEach(function (item) {
						let returnItem;
						returnItem = self.getItemFromListById(item.program_registration_id);
						if (item.error) {
							returnItem.returnedError(1);
							returnItem.errorMessage(item.error);
						} else if (item.success) {
							returnItem.returnedError(0);
							returnItem.errorMessage('');
							returnItem.submittedWithSuccess(1);
							returnItem.successMessage(item.success);
							self.hasWithdrawnItem(1);
						}
					});
					self.checkItemsToWithdraw();
				}

			} catch (exception) {
				alert(exception.message);
			}

			self.fancybox.hideLoading();

		});
		return false;
	}

};

var WithdrawItem = function(data) {
	let self = this;
	ko.mapping.fromJS(data, {
		item: {
			create: function (options) {
				return new OrderItem(options);
			}
		}
	}, self);
	self.displayForWithdrawal = ko.computed(function() {
		return self.adminScope || isAfterNow(self.registration.withdrawal_deadline)();
	});
	self.itemFieldName = ko.computed(function() {
		return 'program_registration_field_' + self.registration.program_registration_id();
	});
	self.registrationEventStartTimeFormatted = ko.computed(function() {
		return self.registration.event_id() ? self.registration.event_start_time_formatted() : null;
	});
	self.withdrawalDeadlineFormatted = ko.computed(function() {
		return moment.unix(self.registration.withdrawal_deadline()).format(_DATE_FORMATS[MEDIUM_DATE_TIME]);
	});
	self.returnedError = ko.observable(0);
	self.submittedWithSuccess = ko.observable(0);
	self.errorMessage =  ko.observable();
	self.successMessage =  ko.observable();
	self.refund_mode = ko.observable('refund');
	self.reassigned_order_item = ko.observable();
	self.program_registration = ko.observable(self.autocheck());

};

let UserPaymentToken =  function (data, root, paymentMethod) {
	let self = this;
	self._originalData = Object.assign({}, data);
	ko.mapping.fromJS(Object.assign({}, {
		user_payment_token_id: null,
		context_id: generateContextId(4),
		isCompleted: true,
		default_token: false,
		canExpire: false,
		isValid: false
	}, data), {
		copy: ['accepted_order_club_policies']
	} , self);
	self.save_token_for_future_purchases = ko.observable();

	self.paymentMethod = (function () {
		if (paymentMethod) {
			return ko.observable(paymentMethod);
		}
		return ko['pureComputed'](function () {
			if (root) {
				let merchant_payment_method_id = self.merchant_payment_method_id();
				if (typeof root.getPaymentMethodById === 'function') {
					return root.getPaymentMethodById(merchant_payment_method_id);
				} else if (ko['isObservable'](root.order) && ko['isObservable'](root.order().paymentMethods)) {
					return root.order()['paymentMethods']().find(function (mpm) {
						return -merchant_payment_method_id === -mpm.merchant_payment_method_id();
					});
				} else if (ko['isObservable'](root.PayByMethods)) {
					return root.PayByMethods().find(function (mpm) {
						return -merchant_payment_method_id === -mpm.merchant_payment_method_id();
					});
				}
			}
			return null;
		});
	})();
	self.showCvcInput = ko.pureComputed(function () {
		if (window.adminScope) {
			return false;
		}
		const isRegularUserMakingPayment = window.accountAction && window.accountAction() === 'MAKE_A_PAYMENT';
		return (isRegularUserMakingPayment || !window.accountAction) && self.user_payment_token_id() && self.paymentMethod();
	});
	self.paymentPolicies = (function () {
		let _cachePolicies = {};
		return ko['pureComputed'](function () {
			let paymentMethod = self.paymentMethod(),
				order = root.order && root.order(),
				use_credit,
				gcPaymentMethod,
				paymentPolicies = [];
			if (paymentMethod) {
				let policies = paymentMethod.policies()||[];
				if (order) {
					order.order_policies().forEach(function (op) {
						if (op.order_club_policy_id() && op.club_policy() && op.club_policy().visibility() === 'payment' && op.user_payment_token_id() === self.user_payment_token_id()) {
							_cachePolicies[op.club_policy_id()] = op;
						}
					});
					use_credit = order.use_credit();
					let credit_available = ko.unwrap(order.credit_available);
					let usable_credit = ko.unwrap(order.usable_credit);
					if (use_credit && (credit_available || usable_credit)) {
						gcPaymentMethod = root.gcPaymentMethod();
					}
				} else if (typeof root.gcPaymentMethodByMerchantId === 'function' && typeof root.applyCredit === 'function') {
					use_credit = root.applyCredit();
					if (use_credit) {
						gcPaymentMethod = root.gcPaymentMethodByMerchantId()[paymentMethod.merchant_id()];
					}
				}
				if (use_credit && gcPaymentMethod) {
					policies = policies.concat((gcPaymentMethod.policies()||[]));
				}
				let merchant_payment_method_id = self.merchant_payment_method_id();
				paymentPolicies = (policies).map(function (club_policy_id) {
					if (!_cachePolicies[club_policy_id]) {
						let overrides = {
							club_policy_id: club_policy_id,
							merchant_payment_method_id: merchant_payment_method_id,
							user_payment_token_id: self.user_payment_token_id(),
							accepted_club_policy: (self['accepted_order_club_policies'] || {})[club_policy_id],
						};
						if (order) {
							overrides.order_id = order.order_id();
							overrides.user_id = order.user_id();
							overrides.account_id = order.account_id();
						} else if (window.viewUser) {
							overrides.user_id = +window.viewUser.user_id;
							overrides.account_id = +window.viewUser.account_id;
						}
						let data = $.extend(true, {}, root['sampleOrderClubPolicy'], overrides);
						_cachePolicies[club_policy_id] = new OrderClubPolicy(data, root);
					}
					return _cachePolicies[club_policy_id];
				});
			}
			return paymentPolicies;
		});
	})();
	self.applicablePolicies = ko['pureComputed'](function () {
		let applicablePolicies = self.paymentPolicies() || [];
		if (root && root.constructor.name === 'PaymentTokens') {
			return applicablePolicies.filter(function (paymentPolicy) {
				return !paymentPolicy.original_accepted() && !paymentPolicy.accepted_club_policy();
			});
		}
		return applicablePolicies;
	});

	self.groupedApplicablePolicies = ko.pureComputed(function () {
		let result = new ObjectMap();
		self.applicablePolicies().forEach(function (paymentPolicy) {
			let groupingType = paymentPolicy.club_policy().groupingType();
			let obj = result.get(groupingType);
			if (!obj) {
				obj = {
					type: groupingType,
					policies: []
				};
				result.put(groupingType, obj);
			}
			obj.policies.push(paymentPolicy);
		});
		return result.values();
	});

	self.allowPayment = ko['pureComputed'](function () {
		let isCompleted = self.isCompleted();
		if (!window['adminScope']) {
			let paymentPolicies = self.paymentPolicies();
			for (let i = 0, len = paymentPolicies.length; i < len; i++) {
				if (paymentPolicies[i]['viewed']() !== 1 || (paymentPolicies[i].club_policy().required() && !paymentPolicies[i].accepted())) {
					return false;
				}
			}
		}
		return isCompleted;
	});
	self.canEditShareSetting = ko['pureComputed'](function () {
		return root['shared_accounts'] && root['shared_accounts']() && window.viewUser && parseInt(window.viewUser.user_id) === self.user_id();
	});
	self.editPaymentToken = ko.observable();
	self.replacePaymentToken = ko.observable();
	self.getOrder = function () {
		return root && ko.unwrap(root.order);
	};
	self.getUser = function () {
		let order = self.getOrder();
		if (order) {
			return ko.unwrap(order.user);
		}
		return root && ko.unwrap(root.user);
	};
	self.ready = ko.observable();
};

let UserPaymentTokenCommon = function () {
	let self = this;
	self.action = ko.observable();
	self.showWarning = ko.observable(false);
	self.paymentMethod = ko.observable();
	self.errors = ko['observableArray']([]);
	self.warnings = ko['observableArray']([]);
	self.processing = ko.observable();
	self.subtitle = ko.observable();
	self.openClubPolicy = function (paymentPolicy) {
		paymentPolicy.open();
	};
	self.successCallback = ko.observable();
};

dateLookupNow = function(el, callback) {
	var val = el.val().trim();
	if(val !== el.data('last_lookup')) {
		el.data('last_lookup', val);
		if (val === '') {
			el.siblings('.datePreview').text('');
			el.removeClass('error');
			el.data('last_date', null);
			return;
		}
		var data = {};
		if (typeof val === 'string' && val.length > 1) {
			var timestamp = getTimestamp(val, el.data('filter-class') === 'Filter\\FutureDateRelativeOnly');
			if(timestamp) {
				var _m = moment.unix(timestamp);
				data.timestamp = timestamp;
				data.normalized = _m.format(_DATE_FORMATS[LONG_DATE]);
				data.date = _m.format('Y-MM-DD');
			}
		}
		if (typeof data['normalized'] !== 'undefined' && data.normalized) {
			el.removeClass('error');
			el.data('last_date', data.date);
			if (typeof callback === 'function') {
				callback(data.normalized);
			} else {
				el.siblings('.datePreview').text(data.normalized);
			}
		} else {
			el.addClass('error');
			if (typeof callback === 'function') {
				callback(jsmsgErrorInvalidDate);
			} else {
				el.siblings('.datePreview').text(jsmsgErrorInvalidDate);
			}
		}
		$(window).resize();
	}
};
getTimestamp = function(val, futureDate) {
	var time = moment().unix(),
		timestamp = uplifter_strtotime(val, time),
		endOfYesterday = strtotime('-1 day 23:59:59', time),
		startOfToday = endOfYesterday + 1,
		endOfToday = strtotime('23:59:59', time);
	if(timestamp) {
		if (futureDate) {
			var timestamp2 = strtotime('23:59:59', timestamp);
			if (!(timestamp > endOfYesterday && timestamp2 > endOfYesterday &&
				(
					uplifter_strtotime(val, endOfYesterday) > endOfYesterday || (
						uplifter_strtotime(val, startOfToday) > startOfToday &&
						uplifter_strtotime(val, endOfToday) > endOfToday
					)
				) &&
				uplifter_strtotime(val + "|23:59:59", timestamp2 + 1) > timestamp2 + 1)) {
				timestamp = false;
			}
		}
	}
	return timestamp;
};

let IndeterminateWidget = function (targetObservable, inputHolder, internalObservable) {
	if (!ko['isObservable'](targetObservable)) {
		return;
	}
	let self = this;
	self.targetObservable = targetObservable;
	targetObservable['subscribe'](function (value) {
		if (inputHolder && ko['isObservable'](inputHolder.attributes)) {
			if (typeof value === 'undefined') {
				let attributes = inputHolder.attributes();
				attributes.placeholder = window['mixedPlaceholder'];
				inputHolder.attributes(attributes);
				return;
			}
			if (value === null || value === '') {
				let attributes = inputHolder.attributes();
				attributes.placeholder = '';
				inputHolder.attributes(attributes);
			}
		}
	});
	let val = targetObservable();
	if (val === '') {
		targetObservable(undefined);
	}
	self.clearValue = function () {
		targetObservable(null);
		if (ko['isObservable'](internalObservable)) {
			internalObservable(null);
		}
		if (targetObservable.tinyMceEDitor && typeof targetObservable.tinyMceEDitor.reload === 'function') {
			targetObservable.tinyMceEDitor.reload({placeholder: ''});
		}
	};
	self.undoChanges = function () {
		targetObservable(undefined);
		if (ko['isObservable'](internalObservable)) {
			internalObservable(undefined);
		}
		if (targetObservable.tinyMceEDitor && typeof targetObservable.tinyMceEDitor.reload === 'function') {
			targetObservable.tinyMceEDitor.reload({placeholder: window['mixedPlaceholder']});
		}
	};
};

function changeInputLang ($element, lang, cssParentClass) {
	let $optionsContainer = $element.parents('.language-selector--container, .language-selector--root'),
		$root = cssParentClass ? $optionsContainer.parents('.' + cssParentClass) : $optionsContainer.parent();

	$root.find('input[data-lang], div.localizedField--container[data-lang]').not('[data-lang="' + lang + '"]').hide();
	$root.find('input[data-lang="' + lang + '"], div.localizedField--container[data-lang="' + lang + '"]').show();

	$element.siblings().removeClass('selected');
	$element.addClass('selected');
}

let LanguageSelector = function (settings) {
	let self = this;
	let langOptions = Object.assign({}, window['langOptions']||{eng: 'English'});
	self.langOptions = ko['observableArray'](Object.keys(langOptions).map(function (lang) {
		return {k: lang, v: langOptions[lang]};
	}));
	self.errorByLangKey = ko.observable({});
	let curLanguage = ko.observable();
	self.changeInputLang = function (langOption, event) {
		changeInputLang($(event.target), langOption.k, settings.cssParentClass);
		curLanguage(langOption.k);
		if (ko['isObservable'](settings.LSObservable)) {
			settings.LSObservable(langOption.k);
		}
		if (typeof settings.afterChange === 'function') {
			settings.afterChange();
		}
	};
	self.getLanguage = function () {
		return curLanguage();
	}
};

window.addEventListener('load', function () {
	setTimeout(function() {
		let div = document.createElement("div");
		div.id = "__DOCUMENT_LOADED";
		div.style.display = "none";
		document.body.appendChild(div);
	});
});

$(document).ready(function () {
	let _trueObservable = ko.observable(true),
		_falseObservable = ko.observable(false),
		timeoutListeners = {
			before: {},
			after: {},
			countdown: {}
		},
		timeLookup = ko.observable(false);
	window.timeOffset = ko.pureComputed(function () {
		let _timeLookup = ko.unwrap(timeLookup);
		if (_timeLookup === false) {
			let storedTimeOffset = localStorage.getItem('timeOffset');
			if (storedTimeOffset !== null) {
				try {
					let storedOffsetParsed = JSON.parse(storedTimeOffset);
					//let's persist the offset for 6 hours
					if (storedOffsetParsed.create_time > moment().unix() - 21600) {
						timeLookup(storedOffsetParsed.offset);
						return storedOffsetParsed.offset;
					}
				} catch (e) {
					console.log(e);
				}
			}
			timeLookup(null);
			$.ajax({
				url: '/app/time',
				type: 'GET',
				dataType: 'json',
				success: function (response) {
					if (!isNaN(response)) {
						let now = moment().unix(),
							timeOffset = response - now;
						timeLookup(timeOffset);
						//let's not cache large offsets in case the user fixes their time
						if (timeOffset < 60 && timeOffset > -60) {
							localStorage.setItem('timeOffset', JSON.stringify({
								offset: timeOffset,
								create_time: now,
							}));
						} else {
							localStorage.removeItem('timeOffset')
						}
					}
				}
			});
			return null;
		}
		return _timeLookup;
	});
	window.timeOffsetNice = ko.pureComputed(function () {
		let timeOffset = window.timeOffset();
		if (timeOffset) {
			return timeDifferenceSimple(timeOffset)
		}
		return '';
	});

	//this is a bit lower than the actual max, but will give us 23 days worth of refresh time per iteration
	const MAX_TIMEOUT_MS = 2000000000;

	window.isBeforeNow = function (timeToCompare, refresh) {
		let _timeToCompare = ko.unwrap(timeToCompare),
			_timeOffset = ko.unwrap(window.timeOffset);
		if (typeof refresh === 'undefined' && _timeOffset === null && ko.isObservable(timeOffset)) {
			timeOffset.subscribe(function (val) {
				if (val !== 0) {
					window.isBeforeNow(_timeToCompare, true);
				}
			})
		}
		if (typeof timeoutListeners.before[_timeToCompare] === 'undefined' || refresh) {
			let currentTime = moment().unix(),
				timeIsLesser = _timeToCompare < currentTime + _timeOffset,
				_observable = timeoutListeners.before[_timeToCompare];
			if (!_observable && timeIsLesser && _timeOffset !== null) {
				timeoutListeners.before[_timeToCompare] = _trueObservable;
			} else {
				if (!_observable) {
					_observable = ko.observable(timeIsLesser);
				} else {
					if (_observable.isBeforeNowTimeout) {
						clearTimeout(_observable.isBeforeNowTimeout);
					}
					if (timeIsLesser !== _observable()) {
						_observable(timeIsLesser);
					}
				}
				if (!timeIsLesser) {
					_observable.isBeforeNowTimeout = setTimeout(function () {
						window.isBeforeNow(_timeToCompare, true);
					}, Math.min(MAX_TIMEOUT_MS, (_timeToCompare - (currentTime + _timeOffset)) * 1000 - ((new Date().getTime()) % 1000)));
				}
				timeoutListeners.before[_timeToCompare] = _observable;
			}
		}
		return timeoutListeners.before[_timeToCompare];
	};

	window.isAfterNow = function (timeToCompare, refresh) {
		let _timeToCompare = ko.unwrap(timeToCompare),
			_timeOffset = ko.unwrap(window.timeOffset);
		if (typeof refresh === 'undefined' && _timeOffset === null && ko.isObservable(timeOffset)) {
			timeOffset.subscribe(function (val) {
				if (val !== 0) {
					window.isAfterNow(_timeToCompare, true);
				}
			})
		}
		if (typeof timeoutListeners.after[_timeToCompare] === 'undefined' || refresh) {
			let currentTime = moment().unix(),
				timeIsGreater = _timeToCompare > currentTime + _timeOffset,
				_observable = timeoutListeners.after[_timeToCompare];
			if (!_observable && !timeIsGreater && _timeOffset !== null) {
				timeoutListeners.after[_timeToCompare] = _falseObservable;
			} else {
				if (!_observable) {
					_observable = ko.observable(timeIsGreater);
				} else {
					if (_observable.isAfterNowTimeout) {
						clearTimeout(_observable.isAfterNowTimeout);
					}
					if (timeIsGreater !== _observable()) {
						_observable(timeIsGreater);
					}
				}
				if (timeIsGreater) {
					_observable.isAfterNowTimeout = setTimeout(function () {
						window.isAfterNow(_timeToCompare, true);
					}, Math.min(MAX_TIMEOUT_MS, (_timeToCompare - (currentTime + _timeOffset)) * 1000 - ((new Date().getTime()) % 1000)));
				}
				timeoutListeners.after[_timeToCompare] = _observable;
			}
		}
		return timeoutListeners.after[_timeToCompare];
	};

	const BUFFER_TIME_MS = 25

	window.getCountdown = function (expiry) {
		let _expiry = ko.unwrap(expiry);
		if (typeof timeoutListeners.countdown[_expiry] === 'undefined') {
			let _lastVal = '',
				_expiryDate = new Date((_expiry + 1) * 1000),
				_countdown = ko.observable(_lastVal),
				_timeOffset = ko.unwrap(window.timeOffset),
				countdownFn = function () {
					let now_offset_ms = (new Date().getTime() + BUFFER_TIME_MS),
						now = Math.floor(now_offset_ms / 1000),
						_timeRemaining = _expiry - (now + _timeOffset);
					if (_timeRemaining > 0) {
						let timeRemaining;
						if (_timeRemaining >= 86400 * 2) {
							timeRemaining = Math.floor(_timeRemaining / 86400) + ' ' + jsmsgDays;
						} else if (_timeRemaining >= 86400) {
							timeRemaining = '1 ' + jsmsgDay;
						} else {
							timeRemaining = timeDifference(_expiryDate, _timeOffset * 1000);
						}
						if (timeRemaining !== _lastVal) {
							_lastVal = timeRemaining;
							let target_ms = (now + 1) * 1000,
								times = 0,
								updateVal = function () {
									if ((new Date()).getTime() >= target_ms) {
										_countdown(timeRemaining);
									} else {
										times++
										window.requestAnimationFrame(updateVal);
									}
								};
							updateVal();
						}
						setTimeout(countdownFn, ((new Date().getTime() + (BUFFER_TIME_MS * 2)) % 1000) - BUFFER_TIME_MS);
					} else if (_lastVal !== '') {
						_countdown('');
					}
				};
			countdownFn();
			window.timeOffset.subscribe(function (val) {
				_timeOffset = val;
			})
			timeoutListeners.countdown[_expiry] = _countdown;
		}
		return timeoutListeners.countdown[_expiry];
	};
});

function getPriceInclusiveOfTaxes(price, taxes) {
	taxes = ko.unwrap(taxes);
	return round(Object.keys(taxes || {}).reduce(function (acc, taxName) {
		if(taxes.hasOwnProperty(taxName)) {
			let rate = ko.unwrap(taxes[taxName].tax_rate_normalized);
			acc += round((price * rate) / 100);
		}
		return acc;
	}, price), 2);
}

function updateURLParams(params, replace) {
	if (window.URLSearchParams) {
		let queryParams = new URLSearchParams(window.location.search);
		for (let param in params) {
			if (params[param]) {
				queryParams.set(param, params[param]);
			} else if (queryParams.has(param)) {
				queryParams.delete(param);
			}
		}

		let url = window.location.pathname + '?' + queryParams.toString();
		if (replace) {
			history.replaceState(null, null, url);
		} else {
			history.pushState(null, null, url);
		}
	}
}

function getQueryParam(param) {
	if (window.URLSearchParams) {
		const urlParams = new URLSearchParams(window.location.search);
		return urlParams.get(param);
	}
	return null;
}

var loadScriptTemplate = (function () {
	let loadedTemplates = {};
	return function (id, callback) {
		if (loadedTemplates.hasOwnProperty(id)) {
			callback(true);
		} else {
			$.ajax({
				url: '/load-template.php',
				method: 'GET',
				dataType: 'html',
				data: {id: id},
				beforeSend: function () {
					$.fancybox.showLoading();
				},
				success: function(rawScriptTemplate) {
					try {
						let tempContainer = document.createElement('div');
						tempContainer.innerHTML = rawScriptTemplate;
						let scriptElement = tempContainer.querySelector('script');
						document.body.appendChild(scriptElement);
						loadedTemplates[id] = true;
						callback(true);
					} catch (error) {
						callback(false);
						throw error;
					}
					$.fancybox.hideLoading();
				},
				error: function(xhr, status, error) {
					console.error("Error:", error);
					callback(false);
					$.fancybox.hideLoading();
				}
			});
		}
	}
})();
function isRelativeDate ($dateString) {
	return uplifter_strtotime($dateString, strtotime('+1 year +1 month +1 week + 1 day')) !== uplifter_strtotime($dateString);
}

$(document).ready(function() {
	// hopefully prevents any zoom slider bugs "please select a valid value. The two nearest valid values are # and #."
	var zoomRange = document.getElementById('zoomRange');
	if (zoomRange) {
		document.getElementById('zoomRange').addEventListener('invalid', function (e) {
			e.preventDefault();
		});

		document.getElementById('zoomRange').addEventListener('input', function () {
			this.setCustomValidity('');
		});
	}
});

var cropper;
var avatarVM;
var minCroppedWidth = 50;
var minCroppedHeight = 50;

// Initialize Cropper.js
function initCropper(image) {
	if (cropper) {
		cropper.destroy();
	}
	cropper = new Cropper(image, {
		aspectRatio: 1,
		viewMode: 0,
		dragMode: 'move',
		autoCropArea: 1,
		zoomOnWheel: false,
		responsive: true,
		guides: false,
		crop: function (event) {
			var width = Math.round(event.detail.width);
			var height = Math.round(event.detail.height);

			if (
				width < minCroppedWidth
				|| height < minCroppedHeight
			) {
				cropper.setData({
					width: Math.max(minCroppedWidth, Math.min(maxHeight, width)),
					height: Math.max(minCroppedHeight, Math.min(maxHeight, height)),
				});
			}
		},
		ready: function (event) {
			var cropper = this.cropper;
			var imageData = cropper.getImageData();
			var cropBoxData = {
				left: 0,
				top: 0,
				width: imageData.width,
				height: imageData.height
			};
			cropper.setCropBoxData(cropBoxData);

			var minSliderZoom = imageData.width / imageData.naturalWidth;
			var maxZoomValue = Math.max(3, minSliderZoom * 2);
			var initialZoomValue = minSliderZoom;

			if(minSliderZoom > 1){
				// the maximum of the width and height ratios required to achieve a 50x50 pixel size
				var minZoomFactor = Math.max(minCroppedWidth / imageData.naturalWidth, minCroppedHeight / imageData.naturalHeight);
				if (minSliderZoom > minZoomFactor) {
					minSliderZoom = minZoomFactor;
				}
				// for smaller images set the initial zoom at halfway point
				initialZoomValue = (minSliderZoom + maxZoomValue) / 2;
			}
			if(avatarVM){
				avatarVM.minZoom(minSliderZoom * 100);
				avatarVM.maxZoom(maxZoomValue  * 100);
				avatarVM.zoomValue(initialZoomValue * 100);
			}
		}
	});
}



var uploadAvatarWidget = function (parent) {
	var self = this;

	const supported = 'mediaDevices' in navigator;
	let player = null;
	let fileInput = null;
	const canvas = document.createElement('canvas');
	const context = canvas.getContext('2d');
	const constraints = {
		video: true,
	};
	var stream;


	self.avatarSiteField = ko.observable();
	self.avatar = ko.observable('/images/img-thumbnail.png');
	self.uploadedImage = ko.observable();
	self.imgVisible = ko.observable(true);
	self.optionVisible = ko.observable(true);
	self.playerVisible = ko.observable(false);
	self.fileToUpload = ko.observable();
	self.selectedOption = ko.observable();
	self.saveImgVisible = ko.observable(false);
	self.cropperVisible = ko.observable(false);
	self.zoomValue = ko.observable();
	self.minZoom = ko.observable();
	self.maxZoom = ko.observable(100);
	self.supported = ko.observable(supported);
	self.permissionGranted = ko.observable(true);
	self.saving = ko.observable(true);
	let avatar = self.avatar();

	self.avatarFieldRequired = ko.pureComputed(function(){
		var required = false;
		parent.site_field_values_create().some(function(sfv){
			if($.inArray('avatar', sfv.site_field.visibility()) !== -1){
				required = sfv.site_field.validation.required();
				return true;
			}
		});
		return required;
	});

	self.deleteIconTitle = ko.pureComputed(function(){
		if( self.avatarFieldRequired()){
			return jsmsgRequiredAvatarTooltip;
		} else {
			return jsmsgNotRequiredAvatarTooltip;
		}
	});

	self.capturePhoto = function () {
		player = $('#player')[0];

		self.selectedOption('capture');
		self.playerVisible(true);
		self.optionVisible(false);
		self.imgVisible(false);
		// Start video stream
		navigator.mediaDevices.getUserMedia(constraints)
			.then((userMediaStream) => {


				self.permissionGranted(true)
				stream = userMediaStream;
				if(player){
					$(player).prop('srcObject', userMediaStream);
				}
				self.saveImgVisible(true);
			})
			.catch((error) => {
				console.error('Error accessing media devices:', error);
				displayAvatarErrorMessage(jsmsgCameraPermissionsNeeded)
				if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
					self.permissionGranted(false);
				} else {
					displayAvatarErrorMessage(jsmsgCameraAccessError)
				}
			});
	};

	self.capture = function () {
		var circularOverlay = $('#circular-frame-overlay');
		var sideLength = Math.max(circularOverlay.width(), circularOverlay.height());

		canvas.width = sideLength;
		canvas.height = sideLength;

		var offsetX = (player.videoWidth - sideLength) / 2;
		var offsetY = (player.videoHeight - sideLength) / 2;

		context.drawImage(player, offsetX, offsetY, sideLength, sideLength, 0, 0, sideLength, sideLength);

		// Stop all video streams
		$(player).prop('srcObject').getVideoTracks().forEach(track => track.stop());
		self.playerVisible(false)
		avatar = canvas.toDataURL();
		self.fileToUpload(dataURItoBlob(avatar));
	};

	self.upload = function () {
		var canvas = cropper.getCroppedCanvas({
			width: 350,
			height: 350,
		});

		avatar = canvas.toDataURL();
		self.fileToUpload(dataURItoBlob(avatar));
	};

	self.save = function () {
		self.imgVisible(true)
		self.saveImgVisible(false)
		self.cropperVisible(false)


		if (self.selectedOption() == 'capture') {
			self.capture();
		} else if (self.selectedOption() == 'upload') {
			self.upload()
		}

		self.avatar(avatar);
		self.optionVisible(true);

		const blob = self.fileToUpload(); //convert Blob to File to add filename
		if (blob instanceof Blob) {
			const file = blobToFile(blob, "avatar.png", blob.type);
			self.fileToUpload(file);
		}

		var newValue = {
			_file_content_url: self.avatar(),
			_file_name: 'avatar.png',
			_file: self.fileToUpload()
		};

		parent.site_field_values_create().forEach(function(sfv){
			if($.inArray('avatar', sfv.site_field.visibility()) !== -1){
				self.avatarSiteField(sfv)
			}
		})

		if (self.avatarSiteField().values().length) {
			self.avatarSiteField().values()[0].value(newValue);
		} else {
			self.avatarSiteField().values.push({value: ko.observable(newValue)});
		}

		self.saving(false)
	};

	self.zoomValue.subscribe(function(newValue) {
		if (cropper) {
			var zoomValue = newValue / 100;
			cropper.zoomTo(zoomValue);
		}
	});

	self.setZoom = function(data, event) {
		var zoomValue = parseFloat(event.target.value);
		self.zoomValue(zoomValue);
		if (cropper) {
			cropper.zoomTo(zoomValue / 100);
		}
	};

	self.zoomIn = function() {
		var currentZoom = self.zoomValue();
		var newZoom = Math.min(currentZoom + 1, self.maxZoom());
		self.zoomValue(newZoom);
		if (cropper) {
			cropper.zoomTo(newZoom / 100);
		}
	};

	self.zoomOut = function() {
		var currentZoom = self.zoomValue();
		var newZoom = Math.max(currentZoom - 1, self.minZoom());
		self.zoomValue(newZoom);
		if (cropper) {
			cropper.zoomTo(newZoom / 100);
		}
	};

	self.fileInputChange = function (data, event) {
		const file = fileInput[0].files[0];
		if (file) {
			self.fileToUpload(file);
			const reader = new FileReader();
			reader.onload = function (e) {
				const img = new Image();
				img.src = reader.result;
				img.onload = function() {
					if (this.width < minCroppedWidth || this.height < minCroppedHeight) {
						alert(jsmsgAvatarTooSmall);
						return;
					}
					self.uploadedImage(e.target.result);
					initCropper($('#imagePreview')[0]);
					self.cropperVisible(true)

					self.playerVisible(false);
					self.optionVisible(false);
					self.imgVisible(false);
					self.saveImgVisible(true);

				}
			};
			reader.readAsDataURL(file);
		}
	};

	self.deleteAvatar = function () {
		if (!self.avatarFieldRequired()) {
			if (!confirm(jsmsgConfirmDeleteAvatar)) {
				return false;
			}
			self.avatar("/images/img-thumbnail.png");
			self.fileToUpload(null)

			var newValue = 'deleted';
			self.avatarSiteField().values()[0].value(newValue);
		}
	};

	self.cancel = function () {
		self.saveImgVisible(false);
		self.imgVisible(true);
		self.optionVisible(true);
		self.playerVisible(false);
		self.cropperVisible(false);

	};

	self.openFileExplorer = function () {
		fileInput = $('#fileInput');

		fileInput.val('');
		self.selectedOption('upload')
		fileInput.click();
	};
}

function dataURItoBlob(dataURI) {
	if (!dataURI) {
		return new Blob();
	}

	var byteString = atob(dataURI.split(',')[1]);
	var ab = new ArrayBuffer(byteString.length);
	var ia = new Uint8Array(ab);

	for (var i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}

	return new Blob([ab], {type: 'image/png'});
}

function blobToFile(blob, fileName, mimeType, lastModified = new Date()) {
	return new File([blob], fileName, {
		type: mimeType,
		lastModified: lastModified,
	});
}
function displayAvatarErrorMessage(message){
	$('#avatar_error_messages').html('<p class="error"><strong>' + message + '</strong></p>');
}
