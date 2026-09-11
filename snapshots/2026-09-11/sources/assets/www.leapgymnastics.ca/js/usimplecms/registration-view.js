/**
 * Created by luis on 27/05/16.
 */
window.regListCalVM = null;

$(document).ready(function () {
	var qs = function (key) {
		key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&"); // escape RegEx meta chars
		var match = location.search.match(new RegExp("[?&]" + key + "=([^&]+)(&|$)"));
		return match && decodeURIComponent(match[1].replace(/\+/g, " "));
	};

	/* Remove the page rendered by php */
	$('.removable').remove();

	var RegistrationListCalViewModel = function (data) {
		var self = this;

		RegistrationViewModel.call(self, data);

		self.selectedView = ko.observable(qs('calendar') || self.selectedTemplate() === 'calendar-with-top-filters.tpl'  ? 'calendar-view' : self.defaultListTemplate());

		self.toggleView = function (view) {
			self.selectedView(view);
			if (view === 'calendar-view') {
				setTimeout(function () {
					initCalendar();
				});
			} else {
				destroyCalendar();
				self.updateRegistrationUrl();
				$('.filterable').filterTable();
			}
			self.filterProducts();
		};

		self.showOptions = [
			{value: 'open', text: jsmsgOpenPrograms},
			{value: 'full', text: jsmsgOpenAndWaitlistedPrograms}
		];

		self.showSelectedOption = ko.observable(qs('show'));
		self.selectedSortOption = ko.observable(qs('sort') || self.selectedSortOption());

		self.showSelectedOption.subscribe(function () {
			self.filterProducts();
		});
		self.selectedSortOption.subscribe(function () {
			self.filterProducts();
		});
		self.productsById = ko['pureComputed'](function () {
			var productsById = {};
			(self.products()||[]).forEach(function (product) {
				productsById[product.product_id()] = product;
			});
			return productsById;
		});
	};

	RegistrationListCalViewModel.prototype = Object.create(RegistrationViewModel.prototype);
	RegistrationListCalViewModel.prototype.constructor = RegistrationViewModel;

	window.regListCalVM = new RegistrationListCalViewModel(registrationData.data);
	window.regListCalVM.groupedProducts(groupProducts(regListCalVM.products));

	window.updateViewData = function updateViewData(jsonData, callback) {
		var data = JSON.parse(jsonData);
		var filterGroupsMapped = ko.utils.arrayMap(data.filter_groups, function (filterGroup) {
			filterGroup.filters = ko.utils.arrayMap(filterGroup.filters, function (filter) {
				filter.disable = false;
				return filter;
			});
			return new FilterGroupModel(filterGroup);
		});
		window.regListCalVM.filter_groups(filterGroupsMapped);

		var filtersToApply = {};
		for (var i in data.filter_groups) {
			filtersToApply[data.filter_groups[i].type] = [];
			for (var j in data.filter_groups[i].filters) {
				//this needs to be an int so types match
				filtersToApply[data.filter_groups[i].type].push(parseInt(data.filter_groups[i].filters[j].id))
			}
		}

		var productsMapped = ko.utils.arrayMap(data.products, function (product) {
			product.price_display_mode = data.selectedPriceMode;
			product.suppress_remaining = data.suppressRemainingOptions;
			return new RegistrationItem(product, data.lang, window.regListCalVM);
		});
		window.regListCalVM.products(productsMapped);
		window.regListCalVM.selectedTemplate(data.selectedTemplate);
		window.regListCalVM.groupedProducts(groupProducts(regListCalVM.products));
		window.regListCalVM.selectedSortOption(data.sortBy);
		$('form.filter input').trigger('keyup');
		if (typeof callback === 'function') {
			callback();
		}

		destroyCalendar();
		if (data.selectedTemplate === 'calendar-with-top-filters.tpl') {
			window.regListCalVM.selectedView('calendar-view');
			setTimeout(function () {
				initCalendar();
			});
		} else {
			window.regListCalVM.selectedView(data.selectedTemplate.replace('.tpl','').replace('.','-'));
		}
	};

	window.updateProduct = function (new_data_product) {
		var product = window.regListCalVM.productsById()[new_data_product.id];
		if (product) {
			product.qty_waitlisted(new_data_product.qty_waitlisted);
			product.qty_registered(new_data_product.qty_registered);
		}
	};

	ko.applyBindings(window.regListCalVM, $('#registration-list-view')[0]);

	$('.filterable').filterTable();

	$(document).on('submit', 'form.closeTooltip', function (e) {
		e.preventDefault();
		closeToolTips();
	});

	window.additionalCalendarSettings = {
		plugins: ['dayGrid', 'timeGrid', 'list', 'moment', 'momentTimezone'],
		header: {
			left: 'prev,next today',
			center: 'title',
			right: 'dayGridMonth,dayGridWeek,dayGridDay'
		},
		eventTimeFormat: _DATE_FORMATS[TIME_ONLY],
		locale: (MOMENT_LOCALE || 'en'),
		eventClick: function (event) {
			if (event.event.extendedProps.product_id) {
				let that = event.el;
				let product = window.regListCalVM.productsById()[event.event.extendedProps.product_id];
				if (product && !$(that).data('tooltip-init')) {
					$(that).data('tooltip-init', true);
					let temporaryDiv = document.createElement("div");
					temporaryDiv.style.display = "none";
					document.body.appendChild(temporaryDiv);
					ko.renderTemplate(
						'calendarEventTemp',
						new calendarDetailVM(product, window.regListCalVM, event, false, window.userHasBetaOrders),
						{
							afterRender: function (nodes) {
								var elements = nodes.filter(function (node) {
									return node.nodeType === 1;
								});
								var HTML = elements[0].outerHTML;
								document.body.removeChild(elements[0]);
								$(that)
									.tooltipster({
										trigger: 'click',
										animation: 'fade',
										delay: 200,
										theme: 'tooltipster-shadow',
										//touchDevices: true,
										contentAsHTML: true,
										interactive: true,
										content: HTML
									})
									.tooltipster('open');
							}
						},
						temporaryDiv,
						'replaceNode'
					);
				}
			}
		},
		viewRender: function (){
			window.regListCalVM.updateRegistrationUrl();
		},
		eventRender: function(args) {
			if(typeof window.regListCalVM === 'object' && window.regListCalVM !== null &&  typeof window.regListCalVM.productsById === 'function') {
				let productsById = window.regListCalVM.productsById()
				if(typeof productsById === 'object' && productsById !== null) {
					let _product = productsById[args.event.extendedProps.product_id]
					if (typeof _product !== 'undefined') {
						renderEventRegistrationStatus(args, _product);
					}
				}
			}
		}
	};

	var date = qs('date');
	if (date) {
		window.additionalCalendarSettings.defaultDate = date;
	}
	var view = qs('calendar');
	if (view) {
		window.additionalCalendarSettings.defaultView = view;
	}

	if (window.regListCalVM.selectedView() === 'calendar-view') {
		setTimeout(function () {
			initCalendar();
		});
	}
});

function lookupMissingCalenderPrograms(missingProgramIds){
	var calendarPrograms = {};
	$.each(missingProgramIds, function(key){
		var id = missingProgramIds[key];
		var product = ko.utils.arrayFirst(window.regListCalVM.products(), function(product){
			return product.program_id() == id;
		});

		// some products have been filtered out by the php ahead of time
		if (product) {
			calendarPrograms[id] = {
				program_id: id,
				summary: product.summary()
			}
		}
	});

	$.extend(window.calendarPrograms, calendarPrograms);
}

function extraEventFilter(events, key) {
	var filterKey = window.currentFilters ? $.param(window.currentFilters) : '';
	if (typeof window.cachedFilteredEvents[key] !== 'undefined' && typeof window.cachedFilteredEvents[key][filterKey] !== 'undefined') {
		return window.cachedFilteredEvents[key][filterKey];
	}
	if (typeof window.cachedFilteredEvents[key] === 'undefined') {
		window.cachedFilteredEvents[key] = [];
	}

	events = ko.utils.arrayFilter(events, function (event) {
		if (typeof event.product_id === 'undefined' || !event.product_id) {
			return true;
		}
		var product = ko.utils.arrayFirst(window.regListCalVM.products(), function (product) {
			return product.product_id() == event.product_id;
		});

		return product && product.show_on_list();
	});

	window.cachedFilteredEvents[key][filterKey] = events;
	return window.cachedFilteredEvents[key][filterKey];
}

function refreshCalendar(newProperties, clearEventCache) {
	if (typeof window.regListCalVM !== 'undefined' && window.regListCalVM.selectedView() === 'calendar-view' && window.calendarInitialized) {
		if (clearEventCache) {
			window.clearEventCache = clearEventCache;
		}
		window.calendar.refetchEvents();
	}
}