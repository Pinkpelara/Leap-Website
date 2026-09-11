if(typeof $['filterTable'] === 'undefined') {
	$.filterTable = {};
	if(typeof $.filterTable['defaults'] === 'undefined') {
		$.filterTable.defaults = {};
	}
}
$.filterTable.defaults = $.extend({
	label: "Quick Search: "
}, $.filterTable.defaults);

$.fn.filterTable = function (options) {
	
	var filterTable = function(term, table) {
		var terms = term.value.toLowerCase().split(" ");
		var tables = $(table);
		if(!tables.is('table')) {
			tables = tables.find('table').not(tables.find('table table'));
		}
		tables.each(function() {
			var currentHeader = null;
			var stillShowing = false;
			$(this).children().each(function() {
				if($(this).is('thead')) {
					stillShowing = false;
					currentHeader = $(this);
				}
				if ($(this).is('tbody')) {
					$(this).children('tr').each(function () {
						var showRow = true;
						for (var i = 0; i < terms.length; i++) {
							if ($(this).html().replace(/<[^>]+>/g, "").toLowerCase().indexOf(terms[i]) < 0) {
								showRow = false;
							}
						}
						if (showRow) {
							$(this).css('display', '');
							stillShowing = true;
						} else {
							$(this).css('display', 'none');
						}
					});

					if (currentHeader !== null) {
						if (stillShowing) {
							currentHeader.css('display', '');
						} else {
							currentHeader.css('display', 'none');
						}
					}
				}
			});
		});
	};
	
	options = $.extend(true, {}, $.filterTable.defaults, options);
	
	this.each(function () {
		if(!$(this).data('filterTable-initialized')) {
			$(this).data('filterTable-initialized', true);
			var element = $(this).get(0);
			
			/* Here is dynamically created a form */
			var form = document.createElement('form');
			
			form.setAttribute('class', 'filter');
			// For ie...
			form.attributes['class'].value = 'filter';
			if (options.label) {
				var searchText = document.createElement('span');
				searchText.innerHTML = options.label;
				form.appendChild(searchText);
			}
			var input = document.createElement('input');
			if (options.placeholder) {
				input.setAttribute('placeholder', options.placeholder);
			}
			
			var filter = function() {
				filterTable(input, element);
			};
			input.onkeyup = filter;
			input.onkeypress = function(e) {
				if((e.keyCode ? e.keyCode : e.which) === 13) {
					e.preventDefault();
					e.stopPropagation();
				}
			};
			
			form.appendChild(input);
			element.parentNode.insertBefore(form, element);
			$(this).data('filterTable-filter', filter);
		} else {
			$(this).data('filterTable-filter')();
		}
	});
};


/*
 * Here is the code used to set a filter on all filterable elements, usually I
 * use the behaviour.js library which does that just fine
 */
(function($) {
	var initialized = false;
	var init = function() {
		initialized = true;
		$('.filterable').filterTable();
	};
	$(document).ready(init);
	if($.isReady && !initialized) {
		init();
	}
})(jQuery);


ko.bindingHandlers.filterTable = {
	update: function (element, valueAccessor, allBindings) {
		var options = {
			label: allBindings.get('label'),
			placeholder: allBindings.get('placeholder')
		};
		var hide = allBindings.get('hide');
		if (typeof hide === 'undefined' || (typeof hide === 'function' && hide() !== true)) {
			$(element).filterTable(options);
		}
	}
};