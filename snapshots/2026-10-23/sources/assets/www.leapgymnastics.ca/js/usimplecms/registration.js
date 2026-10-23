/**
 * Created by luis on 27/05/16.
 */
var FilterModel = function (data) {
	var self = this;
	self.disable = ko.observable(false);
	ko.mapping.fromJS(data, {}, self);
	self.attr = ko.pureComputed(function () {
		if (self.type() == 'categories') {
			return window.parent.location.pathname + '?category_id=' +  self.id();
		}
		return null
	});
};

var FilterGroupModel = function (data) {
	var self = this;
	self.selectedOptions = ko.observableArray([]);
	self.selectedOption = ko.observable();
	self.selectedOption.subscribe(function (filter) {
		if (filter !== '') {
			self.selectedOptions.push(filter);
			self.selectedOption('');
			filter.disable(true);
		}
	});
	ko.mapping.fromJS(data, {
		filters: {
			create: function (options) {
				return new FilterModel(options.data);
			}
		}
	}, self);
	self.removeFilter = function (filterItem) {
		ko.utils.arrayForEach(self.filters(), function (filter) {
			if (filter.id() === filterItem.id()) {
				filter.disable(false);
			}
		});
		self.selectedOptions.remove(filterItem);
	};
};

var RegistrationItem = function (data, lang, parent) {
	var self = this;
	self.parent = parent;
	ko.mapping.fromJS(data, {
		program: {
			create: function (options) {
				return new ProgramVM(options.data, self, parent);
			}
		}
	}, self);


	var suppressRemainingSpots = false;
	var suppressWaitlistCount = false;
	if (typeof self.suppress_remaining !== 'undefined') {
		suppressRemainingSpots = self.suppress_remaining().filter(function (obj) {
				return obj.text() === 'suppress_remaining_spots';
			})[0].value();
		suppressWaitlistCount= self.suppress_remaining().filter(function (obj) {
				return obj.text() === 'suppress_waitlist_count';
			})[0].value();
	}

	this.showProductDescription = ko.observable(false);
	self.toggleDescription = function () {
		self.showProductDescription(!self.showProductDescription());
	};
	self.productHasActions = ko.pureComputed(function () {
		return $.inArray(self.status(), ['Beta', 'Public', 'Early Bird']) != -1;
	});

	let	_registrationHasStarted = {},
		_fullRegistrationIsOpen = {}
	self.registrationHasStarted = function (userHasBetaOrders) {
		userHasBetaOrders = !!ko.unwrap(userHasBetaOrders);
		if(typeof _registrationHasStarted[userHasBetaOrders] === 'undefined') {
			_registrationHasStarted[userHasBetaOrders] = ko.pureComputed(function () {
				if (self.dropinOnly()) {
					return (userHasBetaOrders || (self.status() === 'Public' && !isAfterNow(self.program.dropin_registration_start_time)())) && isAfterNow(self.program.dropin_registration_cutoff)()
				}
				return (userHasBetaOrders || (self.status() === 'Public' && !isAfterNow(self.program.registration_start_time)())) && isAfterNow(self.program.registration_cutoff)();
			});
		}
		return _registrationHasStarted[userHasBetaOrders]
	};

	self.showButtons = function(userHasBetaOrders) {
		return self.registrationHasStarted(userHasBetaOrders)() || self.showTimer();
	}

	self.showBetaMode = function(userHasBetaOrders) {
		return ko.pureComputed(function() {
			return ko.unwrap(userHasBetaOrders) && self.registrationHasStarted(userHasBetaOrders)() && self.status() === 'Beta';
		});
	}

	self.haveBetaMode = function (userHasBetaOrders) {
		return ko.pureComputed(function() {
			return ko.unwrap(userHasBetaOrders) && self.registrationHasStarted(userHasBetaOrders)() && (self.status() === 'Beta' || self.fullRegistrationWillOpen());
		});
	}

	self.buttonsEnabled = function(userHasBetaOrders) {
		return self.registrationHasStarted(userHasBetaOrders);
	}

	let _countdown = null;
	self.countdown = ko.pureComputed(function() {
		if(_countdown === null) {
			_countdown = getCountdown(self.program.registration_start_time());
		}
		return _countdown();
	});

	self.fullRegistrationIsOpen = function (userHasBetaOrders) {
		userHasBetaOrders = !!ko.unwrap(userHasBetaOrders);
		if(typeof _fullRegistrationIsOpen[userHasBetaOrders] === 'undefined') {
			_fullRegistrationIsOpen[userHasBetaOrders] = ko.pureComputed(function () {
				return !self.dropinOnly() && (userHasBetaOrders || (self.status() === 'Public' && !isAfterNow(self.program.registration_start_time)())) && isAfterNow(self.program.registration_cutoff)();
			});
		}
		return _fullRegistrationIsOpen[userHasBetaOrders];
	};

	self.allowDropIn = ko.pureComputed(function() {
		return self.program.allow_drop_in();
	})

	/*****************************************************************************
	 ************* This code needs to be kept in sync with ***********************
	 ************* OrderItem.alwaysDropInOnly in /js/ui.js ***********************
	 *****************************************************************************/
	self.alwaysDropInOnly = ko.pureComputed(function() {
		if(self.allowDropIn()) {
			let program = self.program;
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
	 ************* This code needs to be kept in sync with ***********************
	 ************* OrderItem.dropinOnly in /js/ui.js *****************************
	 *****************************************************************************/
	self.dropinOnly = ko.pureComputed(function() {
		if(self.allowDropIn()) {
			if(self.alwaysDropInOnly()) {
				return true;
			}
			let program = self.program;
			let drop_in_events = ko.unwrap(program.drop_in_events);
			return typeof drop_in_events !== 'undefined' && drop_in_events !== null && drop_in_events.length && (isBeforeNow(program.registration_cutoff)() || isAfterNow(program.registration_start_time)());
		}
		return false;
	});

	self.waitlistSpotsAvailable = ko.pureComputed(function () {
		return self.waitlist_spots() === null || self.waitlist_spots() > 0 || (self.allowDropIn() && (self['waitlist_spots_dropin']() === null ||  self['waitlist_spots_dropin']() > 0));
	});

	self.showWaitlisted = ko.pureComputed(function () {
		return (parseInt(self.spots()) === 0 && (parseInt(self['spots_dropin']()) === 0 || !self.allowDropIn())) && !self.alwaysDropInOnly();
	});

	self.showWaitlistSpots = ko.pureComputed(function() {
		return !suppressWaitlistCount && self.showWaitlisted();
	})

	self.showProgramIsFull = ko.pureComputed(function() {
		return self.showWaitlisted();
	});

	self.fullRegistrationWillOpen = ko.pureComputed(function() {
		return self.status() === 'Public' && isAfterNow(self.program.registration_start_time)() && !self.alwaysDropInOnly();
	})

	self.showRegistrationBegins = ko.pureComputed(function() {
		return self.fullRegistrationWillOpen() && (!self.showTimer() || isAfterNow(self.program.registration_start_time() - 86399)());
	});

	self.showTimer = ko.pureComputed(function() {
		return window.timeOffset() !== null && typeof registration_timer_display_time === 'number' && registration_timer_display_time > 0 && self.fullRegistrationWillOpen() && !isAfterNow(self.program.registration_start_time() - registration_timer_display_time)()
	});

	self.showWaitlistIsFull = ko.pureComputed(function() {
		return self.showWaitlisted() && !self.waitlistSpotsAvailable()
	});

	self.showSystemTimeWarning = ko.pureComputed(function() {
		let _timeOffset = window.timeOffset();
		if(_timeOffset <= -60 && self.fullRegistrationWillOpen()) {
			return self.program.registration_start_time() - (typeof registration_timer_display_time === 'number' ? registration_timer_display_time : 0) <= moment().unix()
		}
		return false;
	});

	self.buttonText = ko.pureComputed(function() {
		if(self.showWaitlisted()) {
			return jsmsgJoinWaitlist;
		}
		if(self.dropinOnly()) {
			return jsmsgDropInButtonText;
		}
		return jsmsgRegister;
	});

	self.volunteerAttr = {
		href: '/volunteering/search/?program_id=' + self.program.program_id()
	};

	self.registrationHasNotStarted = ko.pureComputed(function () {
		return isAfterNow(self.program.registration_start_time)();
	});

	self.showSpotsLeft = ko.pureComputed(function () {
		return !self.showWaitlisted() && (self.program.max_full_registrations() !== 0 && self.program.max_full_waitlist() !== 0 && !suppressRemainingSpots && (self.spots() < 5 && self.spots() !== null)) && !self.alwaysDropInOnly();
	});

	self.showDropinSpotsLeft = ko.pureComputed(function () {
		return self.allowDropIn() && (!suppressRemainingSpots && (self.spots_dropin() < 5 && self.spots_dropin() !== null));
	});

	if(typeof self.spots === 'undefined' && typeof self.program) {
		self.spots = self.program.spots;
	}

	self.selected = ko.observable();
	self.toggleSelected = function () {
		self.selected(!self.selected());
	};
	self.item_price = ko.pureComputed(function() {
		//this is replicated from product::_get_current_total
		if (ko.unwrap(self['recurrence'])) {
			let earliest_billing_date = ko.unwrap(self['earliest_billing_date']);
			if (earliest_billing_date) {
				let time = moment.unix();
				if (self.program) {
					let start_date = ko.unwrap(self.program.start_date);
					time = start_date ? strtotime(start_date) : time;
				}
				if (moment.unix(uplifter_strtotime(earliest_billing_date, time)) > moment()) {
					return 0.0;
				}
			}
		}
		if (self.registration() && self.total() === null) {
			let current_price = self.program.current_price();
			if (window['price_inclusive_of_taxes']) {
				current_price = getPriceInclusiveOfTaxes(current_price, self.taxes);
			}
			return current_price;
		}
		let total = self.total();
		if (window['price_inclusive_of_taxes']) {
			total = getPriceInclusiveOfTaxes(total, self.taxes);
		}
		return total;
	});
	self.base_price = ko.pureComputed(function() {
		if (self.registration()) {
			let base_price = self.program.base_price();
			if (window['price_inclusive_of_taxes']) {
				base_price = getPriceInclusiveOfTaxes(base_price, self.taxes);
			}
			return base_price;
		}
		let total = self.total();
		if (window['price_inclusive_of_taxes']) {
			total = getPriceInclusiveOfTaxes(total, self.taxes);
		}
		return total;
	});
	self.installment_item_price = ko.pureComputed(function () {
		if (self.registration() && self.total() === null) {
			return self.program.current_price();
		}
		return self.total();
	});

	self.program_date_range = ko.pureComputed(function () {
		if(self.program && typeof _DATE_FORMATS === 'object' &&  typeof MEDIUM_DATE === 'number') {
			return moment(self.program.start_date()).format(_DATE_FORMATS[MEDIUM_DATE]) + (self.program.start_date() !== self.program.end_date() ? ' - ' + moment(self.program.end_date()).format(_DATE_FORMATS[MEDIUM_DATE]) : '');
		}
	});

	self.start_date_formatted = ko.pureComputed(function() {
		if(self.program && typeof _DATE_FORMATS === 'object' &&  typeof MEDIUM_DATE === 'number') {
			return moment(self.program.start_date()).format(_DATE_FORMATS[MEDIUM_DATE]);
		}
	});

	self.end_date_formatted = ko.pureComputed(function() {
		if(self.program && typeof _DATE_FORMATS === 'object' &&  typeof MEDIUM_DATE === 'number') {
			return moment(self.program.end_date()).format(_DATE_FORMATS[MEDIUM_DATE]);
		}
	});

	self.registration_date_range = ko.pureComputed(function() {
		return self.program.registration_start_time_formatted() + ' - ' + self.program.registration_cutoff_formatted()
	});

	self.summary = ko.pureComputed(function() {
		return self.local_string[lang].summary();
	});
	self.description = ko.pureComputed(function() {
		return self.local_string[lang].content();
	});

	self.current_initial_payment_amount = ko.pureComputed(function() {
		return Math.min(self.initial_payment_amount(), self.item_price());
	});

	self.installmentPrice = ko.computed(function () {
		let installments = self.installments(),
			program_price = self.installment_item_price(),
			initial_payment_amount = self.current_initial_payment_amount(),
			installment_interval = self.installment_interval(),
			installment_period = self.installment_period(),
			installment_amount = 0.0;

		if (installments != null && installments > 0 && initial_payment_amount != null && installment_interval !== null) {
			installment_interval = installment_interval.toLowerCase();
			installment_amount = Math.max(0, (program_price - initial_payment_amount) / installments);
			if(installment_amount > 0) {
				let installment_start = self.installment_start();
				let now = moment().unix();
				while(now > installment_start && installments > 0) {
					installments--;
					initial_payment_amount += installment_amount;
					installment_start = strtotime('+' + installment_period + ' ' + installment_interval, installment_start)
				}

				if(installments === 1) {
					installment_amount = program_price - initial_payment_amount;
				}
			}
		}

		if (installment_amount > 0 && installments > 0) {
			let distribute_tax = self.distribute_tax();
			let installmentPeriod = installment_period === 1 ? jsmsgPeriodTranslations.singular[installment_interval] : installment_period + ' ' + jsmsgPeriodTranslations.plural[installment_interval];
			let dueNowOrFirstPaymentMsg = jsmsgDueNow;
			let due = 0;

			if(initial_payment_amount > 0) {
				if(!window['price_inclusive_of_taxes']) {
					due = initial_payment_amount; // initial payment no tax
				}
				else if(distribute_tax === 'even') {
					due = getPriceInclusiveOfTaxes(initial_payment_amount, self.taxes); // initial amount + taxes
					installment_amount = getPriceInclusiveOfTaxes(installment_amount, self.taxes); // installment amount + taxes
				}
				else {
					due = initial_payment_amount + getPriceInclusiveOfTaxes(program_price, self.taxes) - program_price; // amount due at checkout(initial payment + tax)
				}
			}
			else {
				if(!window['price_inclusive_of_taxes']) {
					return ko.observable(installment_amount).currency()()  + ' / ' + installmentPeriod;
				}
				switch (distribute_tax) {
					case 'checkout':
							due =  getPriceInclusiveOfTaxes(program_price, self.taxes) - program_price; // program price including tax
						break;
					case 'first':
						due =  installment_amount + getPriceInclusiveOfTaxes(program_price, self.taxes) - program_price; // installment + total tax due at first payment
						dueNowOrFirstPaymentMsg = jsmsgFirstPayment; // switch 'Due Now' to 'First Payment'
						break;
					case'even':
						return ko.observable(getPriceInclusiveOfTaxes(installment_amount, self.taxes)).currency()()  + ' / ' + installmentPeriod; // installment amount + tax
				}
			}
			return dueNowOrFirstPaymentMsg + ": " + ko.observable(due).currency()() + '<br/>' + ko.observable(installment_amount).currency()()  + ' / ' + installmentPeriod;
		}
		return self.installment_item_price.currency()();
	});

	self.show_on_list = ko.observable(true);
};


var RegistrationViewModel = function (data) {
	var self = this;

	var mapping = {
		locations: {
			create: function (options) {
				return new LocationVM(options.data, self);
			}
		},
		facilities: {
			create: function (options) {
				return new FacilityVM(options.data, self);
			}
		},
		filter_groups: {
			create: function (options) {
				return new FilterGroupModel(options.data);
			}
		},
		products: {
			create: function (options) {
				return new RegistrationItem(options.data, data.lang, self);
			}
		},
	};

	ko.mapping.fromJS(data, mapping, self);

	/**
	 * Name are converted for back compatibility reasons
	 * @returns {string}
	 */
	self.getQueryString = function() {
		var filters = _.clone(self.selectedFilterIds());
		var getParams = {
			season_id: filters.seasons,
			category_id: filters.categories,
			category_level_id: filters.category_levels,
			location_id: filters.locations,
		};
		if(typeof self.showSelectedOption !== 'undefined' && self.showSelectedOption()) {
			getParams.show = self.showSelectedOption();
		}
		//no need to include the first option
		if(typeof self.selectedSortOption !== 'undefined' && self.selectedSortOption() && self.selectedSortOption() !== self.sortOptions()[0].value()) {
			getParams.sort = self.selectedSortOption();
		}
		var cal = $('#calendar');

		if(cal.length > 0 && cal.fullCalendar) {
			var view = cal.fullCalendar('getView');
			if (view.type) {
				getParams.calendar = view.type;
			}
			if (view.start) {
				getParams.date = view.start.format('YYYY-MM-DD');
			}
		}

		var qs = $.param(getParams);
		return qs.length > 0 ? '?' + qs : '';
	};

	self.selectedTemplateId = ko.pureComputed(function () {
		return self.selectedTemplate().replace('.', '-');
	});
	self.defaultListTemplate = ko.pureComputed(function () {
		return self.selectedTemplateId().replace('-tpl','');
	});

	self.selectedFilterIds = ko.pureComputed(function () {
		var filterIds = {};
		ko.utils.arrayForEach(self.filter_groups(), function(filterGroup) {
			filterIds[filterGroup.type()] = [];
		});
		ko.utils.arrayForEach(self.filter_groups(), function(filterGroup) {
			ko.utils.arrayForEach(filterGroup.selectedOptions(), function(filter) {
				filterIds[filterGroup.type()].push(parseInt(filter.id()));
			});
		});
		return filterIds;
	});

	self.redirectUrl = ko.observable('/registration/');
	self.redirection = ko.pureComputed(function () {return '/login/?redirect=' + encodeURIComponent(self.redirectUrl());});

	self.filterProducts = function () {
		if (typeof $.fancybox !== 'undefined') {
			$.fancybox.showLoading();
		}

		var filters = {};
		ko.utils.arrayForEach(self.filter_groups(), function (filterGroup) {
			if (typeof filters[filterGroup.type()] === 'undefined') {
				filters[filterGroup.type()] = [];
			}
			ko.utils.arrayForEach(filterGroup.selectedOptions(), function (filter) {
				filters[filterGroup.type()].push(parseInt(filter.id()));
			});
		});

		ko.utils.arrayForEach(self.products(), function (product) {
			var show = true;
			if (show && typeof filters.categories !== 'undefined' && filters.categories.length > 0) {
				show &= ($.inArray(product.program.category_id(), filters.categories) >= 0);
			}
			if (show && typeof filters.seasons !== 'undefined' && filters.seasons.length > 0) {
				show &= ($.inArray(product.program.season_id(), filters.seasons) >= 0);
			}
			if (show && typeof filters.locations !== 'undefined' && filters.locations.length > 0) {
				show &= ($.inArray(product.program.location().location_id(), filters.locations) >= 0);
			}

			if (show && typeof filters.category_levels !== 'undefined' && filters.category_levels.length > 0) {
				var hasCategoryLevel = false;
				ko.utils.arrayForEach(product.program.category_levels(), function (categoryLevel) {
					if ($.inArray(categoryLevel.category_level_id(), filters.category_levels) >= 0) {
						hasCategoryLevel = true;
					}
				});
				show &= hasCategoryLevel;
			}

			if (show && typeof self.showSelectedOption !== 'undefined') {
				var showOption = self.showSelectedOption();
				if (showOption === 'open') {
					if (( product.program.max_registrations() && product.qty_registered() >= product.program.max_registrations()) || product.qty_waitlisted() > 0) {
						show = false;
					}
				} else if (showOption === 'full') {
					if (product.qty_waitlisted() < product.program.max_waitlist()) {
						show = false;
					}
				}
			}

			product.show_on_list(show);
		});

		self.updateRegistrationUrl();

		if (typeof $.fancybox !== 'undefined') {
			$.fancybox.hideLoading();
		}

		window.currentFilters = {
			category_id: filters.categories ? filters.categories : [],
			category_level_id: filters.category_levels ? filters.category_levels : [],
			season_id: filters.seasons ? filters.seasons : [],
			location_id: filters.locations ? filters.locations : [],
			availability: typeof self.showSelectedOption === 'function' && self.showSelectedOption() ? self.showSelectedOption() : null
		};

		if (typeof window.refreshCalendar === 'function') {
			window.refreshCalendar();
		}
	};

	self.updateRegistrationUrl = function () {
		var queryString = self.getQueryString();

		if (typeof window.parent.updateRegistratrionUrl !== 'undefined') {
			var JSONData = ko.toJSON({url: queryString});
			window.parent.updateRegistratrionUrl(JSONData);
		} else {
			if (typeof window.history.replaceState !== 'undefined') {
				if (queryString) {
					var urlParts = window.location.pathname.split('/');
					window.history.replaceState("Filters", "Filters", urlParts.pop() + queryString);
				} else {
					window.history.replaceState("Filters", "Filters", window.location.pathname);
				}
			} else if (document.location !== document.location.pathname + queryString) {
				//support for ie 8/9.
				document.location = document.location.pathname + queryString;
			}
		}

		self.redirectUrl(window.location.pathname + window.location.search);
	};

	self.sortProduct = function (l, r) {
		var sortOption = self.selectedSortOption(), diff;
		if (sortOption === '') {
			return;
		}
		if (!self.selectedSortOption() || sortOption === 'display_order') {
			if( (diff = l.program.category.display_order() - r.program.category.display_order()) ){
				return diff;
			}
			else if( (diff = l.program.category_levels()[0].category_order() - r.program.category_levels()[0].category_order()) ){
				//checking for unset category_order ( 0 )
				if(l.program.category_levels()[0].category_order() === 0 ){
					return 1;
				}
				else if(r.program.category_levels()[0].category_order() === 0){
					return -1;
				}
				else {
					return diff;
				}
			}
			else if( (diff = l.program.category_levels()[0].category_level_id() - r.program.category_levels()[0].category_level_id()) ){
				return diff;
			}
			else if( (diff = new Date(l.program.start_date()) - new Date(r.program.start_date())) ){
				return diff;
			}
			else {
				return l.program.first_event_start_timestamp() - r.program.first_event_start_timestamp()
			}
		}
		else if (sortOption === 'start_date') {
			return (diff = new Date(l.program.start_date()) - new Date(r.program.start_date())) ? diff : l.program.first_event_start_timestamp() - r.program.first_event_start_timestamp();
		}
		else if (sortOption === 'program_name') {
			return l.program.program_name() === r.program.program_name() ? ((diff = new Date(l.program.start_date()) - new Date(r.program.start_date())) ? diff : l.program.first_event_start_timestamp() - r.program.first_event_start_timestamp()) : l.program.program_name() < r.program.program_name() ? -1 : 1;
		}
		else if (sortOption === 'registration_start_time') {
			return (diff = l.program.registration_start_time() - r.program.registration_start_time()) ? diff : (diff = new Date(l.program.start_date()) - new Date(r.program.start_date())) ? diff : l.program.first_event_start_timestamp() - r.program.first_event_start_timestamp();
		}
		else if (sortOption === 'sku') {
			return l.sku() === r.sku() ? 0 : l.sku() < r.sku() ? -1 : 1;
		}
		else if (sortOption ===  'open') {
			return (l.qty_waitlisted() > r.qty_waitlisted() &&
				l.qty_registered() > r.qty_registered() &&
				l.program.start_date() < r.program.start_date() &&
				l.program.program_name() > r.program.program_name());
		}
	};

	self.groupedProducts = ko.observableArray([]);

	self.showGroupTitle = function (group) {
		for (var i = 0; i < group.products.length; i++) {
			if (group.products[i].show_on_list()) {
				return true;
			}
		}
	};
	self.redirectUrl(window.location.pathname + window.location.search);
};

RegistrationViewModel.prototype.toJSON = function() {
	var products = ko.mapping.toJS(ko.utils.arrayFilter(this.products, function (product) {
		return product.show_on_list;
	}));

	var selectedProductIds = [];
	ko.utils.arrayForEach(products, function (product) {
		selectedProductIds.push(product.id);
	});

	var selectedFilterGroups = [];
	ko.utils.arrayForEach(ko.mapping.toJS(this.filter_groups), function(filterGroup) {
		selectedFilterGroups.push({
			name: filterGroup.name,
			type: filterGroup.type,
			filters: (filterGroup.selectedOptions.length > 0) ? filterGroup.selectedOptions : filterGroup.filters,
			selectedOptions: []
		});
	});

	return {
		filter_groups: selectedFilterGroups,
		products: products,
		selectedTemplate: ko.utils.unwrapObservable(this.selectedTemplate),
		selectedFilterIds: this.selectedFilterIds,
		selectedProductIds: selectedProductIds,
		selectedPriceMode: ko.utils.unwrapObservable(this.selectedPriceMode),
		suppressRemainingOptions: ko.utils.unwrapObservable(this.suppressRemainingOptions),
		sortBy: ko.utils.unwrapObservable(this.selectedSortOption),
		lang: this.lang
	};
};

function groupProducts (products) {
	var groups = {};
	products().forEach(function (product) {
		var names = {};
		if(product.program.category.group_program_listing()) {
			names['category_' + product.program.category.category_id()] = {
				name: product.program.category.summary(),
				display_order: '' + product.program.category.display_order().toString().padStart(3, '0')
			};
		}
		else {
			product.program.category_levels().forEach(function (categoryLevel) {
				names['category_level_' + categoryLevel.category_level_id()] = {
					name:	product.program.category.summary() + ': ' +  categoryLevel.summary(),
					display_order: '' + product.program.category.display_order().toString().padStart(3, '0') + categoryLevel.category_order().toString().padStart(3, '0')
				};
			});
		}
		for(var key in names) {
			if(names.hasOwnProperty(key)) {
				if (typeof groups[key] === 'undefined') {
					groups[key] = {
						name: names[key].name,
						display_order: names[key].display_order,
						products: []
					}
				}
				groups[key].products.push(product);
			}
		}
	});
	groups = _.toArray(groups);
	groups.sort(function (a, b) {
		var nameA = a.display_order.toUpperCase(); // ignore upper and lowercase
		var nameB = b.display_order.toUpperCase(); // ignore upper and lowercase
		if (nameA < nameB) {
			return -1;
		}
		if (nameA > nameB) {
			return 1;
		}
		// names must be equal
		return 0;
	});
	return groups;
}

var FacilityVM = function (data, parent) {
	var self = this;
	self.parent = parent;
	ko.mapping.fromJS(data, {}, self);

	self.summary = ko.pureComputed(function () {
		return self.local_string[lang].summary();
	});
	self.description = ko.pureComputed(function () {
		return self.local_string[lang].content();
	});
};

var LocationVM = function (data, parent) {
	var self = this;
	self.parent = parent;
	ko.mapping.fromJS(data, {}, self);
	self.facility = ko.pureComputed(function () {
		return ko.utils.arrayFirst(self.parent.facilities(), function (facility) {
			return facility.facility_id() === self.facility_id();
		});
	});

	self.summary = ko.pureComputed(function () {
		return self.local_string[lang].summary();
	});
	self.description = ko.pureComputed(function () {
		return self.local_string[lang].content();
	});
};

var ProgramVM = function (data, parent, root) {
	var self = this;

	ko.mapping.fromJS(data, {}, self);

	self.parent = parent;
	self.root = root;
	self.events = ko.observableArray();

	self.location = ko.pureComputed(function () {
		return ko.utils.arrayFirst(self.root.locations(), function (location) {
			return -location.location_id() === -self.default_location_id();
		});
	});

	self.facility = ko.pureComputed(function () {
		return ko.utils.arrayFirst(self.root.facilities(), function (facility) {
			return facility.facility_id() == self.location().facility_id();
		});
	});

	self.spots = ko.pureComputed(function () {
		return Math.max(0, self.max_registrations() - self.parent.qty_registered() - self.parent.qty_waitlisted());
	});
	self.registered = self.qty_registered = ko.pureComputed(function () {
		return self.parent.qty_registered();
	});
	self.waitlisted = self.qty_waitlisted = ko.pureComputed(function () {
		return self.parent.qty_waitlisted();
	});
	self.registered_and_waitlisted = ko.pureComputed(function () {
		return self.parent.qty_waitlisted() + self.parent.qty_registered();
	});

	self.drop_in_price_range = ko.pureComputed(function() {
		var drop_in_events = ko.unwrap(self.drop_in_events);
		if(typeof drop_in_events !== 'undefined' && drop_in_events !== null) {
			var prices = drop_in_events.map(function(event) {
				return ko.unwrap(event.price);
			}) || [];
			if(prices.length === 0) {
				prices.push(ko.unwrap(self.default_event_price));
			}
			var minPrice = Math.min.apply(null, prices),
				maxPrice = Math.max.apply(null, prices);
			if (window['price_inclusive_of_taxes'] && self.parent && self.parent.taxes) {
				minPrice = getPriceInclusiveOfTaxes(minPrice, self.parent.taxes);
				maxPrice = getPriceInclusiveOfTaxes(maxPrice, self.parent.taxes);
			}
			if(minPrice !== maxPrice) {
				return ko.observable(minPrice).currency()() + ' - ' + ko.observable(maxPrice).currency()();
			}
			return ko.observable(minPrice).currency()();
		}
		let default_event_price = self.default_event_price();
		if (window['price_inclusive_of_taxes'] && self.parent && self.parent.taxes) {
			default_event_price = getPriceInclusiveOfTaxes(default_event_price, self.parent.taxes);
		}
		return ko.observable(default_event_price).currency()();
	});

	self.summary = ko.pureComputed(function () {
		return self.local_string[lang].summary();
	});
	self.description = ko.pureComputed(function () {
		return self.local_string[lang].content();
	});

	self.season.summary = ko.pureComputed(function () {
		return self.season.local_string[lang].summary();
	});
	self.season.description = ko.pureComputed(function () {
		return self.season.local_string[lang].content();
	});

	self.category.summary = ko.pureComputed(function () {
		return self.category.local_string[lang].summary();
	});
	self.category.description = ko.pureComputed(function () {
		return self.category.local_string[lang].content();
	});

	ko.utils.arrayForEach(self.category_levels(), function (categoryLevel) {
		categoryLevel.summary = ko.pureComputed(function () {
			return categoryLevel.local_string[lang].summary();
		});
		categoryLevel.description = ko.pureComputed(function () {
			return categoryLevel.local_string[lang].content();
		});
	});
};

var calendarDetailVM = function (product, root, event, isCalendarWidget = false, userHasBetaOrders = false) {
	let self = this;
	self.product = product;
	self.root = root;
	self.backgroundColor = event.event.backgroundColor;
	self.borderColor = event.event.borderColor;
	self.event = event.event.extendedProps;
	self.userHasBetaOrders = userHasBetaOrders;

	if (isCalendarWidget) {
		self.buttonAction = window.eventDetailOptions['buttonAction'];
		self.registerURL = "https://" + document.domain + "/registration/product-detail/" + encodeURIComponent(encodeURIComponent(event.event.extendedProps.sku));
		self.addToCartURL = sameParentDomain() ? "#" : "https://" + document.domain + "/registration/checkout/";
		self.addToCartAjax = sameParentDomain();
	}
	self.isDropOnlyProgram = ko['pureComputed'](function () {
		return self.event.drop_in_only;
		return self.event.allow_drop_in &&
			((self.product.program.max_full_registrations() === 0 &&
				(self.product.program.max_full_waitlist() === 0 || self.product.program.max_waitlist() === 0))
				|| (isBeforeNow(self.product.program.registration_cutoff)() && isAfterNow(self.event.registration_cutoff)));
	});
	self.startAndEndDate = ko['pureComputed'](function () {
		if (self.isDropOnlyProgram()) {
			let start = self['event'].event_start_time;
			let end = self['event']['event_end_time'];
			if (start === end) {
				return moment.unix(start).format(_DATE_FORMATS[SHORT_DATE_TIME]);
			} else if ((end - start) >= (24*60*60)) {
				return moment.unix(start).format(_DATE_FORMATS[MEDIUM_DATE_TIME]) + ' - ' + moment.unix(end).format(_DATE_FORMATS[MEDIUM_DATE_TIME]);
			} else {
				return moment.unix(start).format(_DATE_FORMATS[MEDIUM_DATE_TIME]) + ' - ' + moment.unix(end).format(_DATE_FORMATS[TIME_ONLY]);
			}
		} else {
			return self.product.program_date_range();
		}
	});
	self.event_price = ko['pureComputed'](function() {
		if (window['price_inclusive_of_taxes']) {
			return getPriceInclusiveOfTaxes(self.event.price, self.product.taxes);
		}
		return self.event.price;
	});
	self.location = ko['pureComputed'](function () {
		if (self['event'] && product.program && -product.program.default_location_id() !== -self['event'].location_id) {
			return self.root.locations().find(function (location) {
				return -location.location_id() === -self['event'].location_id;
			});
		}
		return product.program.location();
	});
	self.registration_start_time = ko.pureComputed(function() {
		if(self.isDropOnlyProgram()) {
			return self.event.registration_start_time
		}
		return product.program.registration_start_time();
	});
	self.registration_cutoff = ko.pureComputed(function() {
		if(self.isDropOnlyProgram()) {
			return self.event.registration_cutoff
		}
		return product.program.registration_cutoff();
	});
	self.showWaitlisted = ko['pureComputed'](function () {
		return self.product.showWaitlisted() && parseInt(self.product.program['max_waitlist']()) !== 0 && parseInt(self.product.program['max_dropin_waitlist']()) !== 0;
	});
	self.showDropinWaitlisted = ko['pureComputed'](function () {
		return !self['event'].spots_dropin && self['event']['waitlist_spots_dropin'];
	});
	self.waitlistDropinSpotsAvailable = ko['pureComputed'](function () {
		return self['event']['waitlist_spots_dropin'] === null || parseInt(self['event']['waitlist_spots_dropin']) !== 0;
	});
	self.showProductDetailsButton = ko['pureComputed'](function() {
		return (
			(
				(self.product.program.spots() || self.product.waitlist_spots()) &&
				(!isAfterNow(self.product.program.registration_start_time)() && isAfterNow(self.product.program.registration_cutoff)())
			) &&
			(
				!self.event.allow_drop_in  ||
				(isAfterNow(self.event.registration_start_time)() && isBeforeNow(self.event.registration_cutoff)()) ||
				(self.event.spots_dropin || self.event.waitlist_spots_dropin)
			)
		);
	});
};

function renderEventRegistrationStatus(args, _product) {
	let _event = args.event.extendedProps,
		_product_spots,
		_program_registration_start_time,
		_program_registration_cutoff,
		_program_waitlist_spots;
	if (_product === null) {
		_product_spots = parseInt(_event.program_spots, 10) >= 0 ? parseInt(_event.program_spots) : null;
		_program_registration_start_time = _event.program_registration_start_time;
		_program_registration_cutoff = _event.program_registration_cutoff;
		_program_waitlist_spots = _event.program_waitlist_spots;
	} else {
		_product_spots = parseInt(_product.spots(), 10) >= 0 ? parseInt(_product.spots(), 10) : null;
		_program_registration_start_time = _product.program.registration_start_time();
		_program_registration_cutoff = _product.program.registration_cutoff();
		_program_waitlist_spots = parseInt(_product.waitlist_spots(), 10);
	}
	let $element = $(args.el);
	if (!$element.hasClass('programEvent')) {
		return;
	}
	if ((_product_spots !== null && _product_spots <= 0 && (!_event.allow_drop_in || !_event.spots_dropin)) ||
		(isBeforeNow(_program_registration_cutoff)() && isBeforeNow(_event.registration_cutoff)())
	) {

		if ($element.context.tagName.toUpperCase() === 'TR') {
			$element.find('.fc-event-dot').addClass('registrationFull');
		}
		$element.addClass('registrationFull');
	}
	if (
		(_product_spots !== null && _product_spots <= 0 && (!_event.allow_drop_in || !_event.spots_dropin) &&
			!_program_waitlist_spots && !_event.waitlist_spots_dropin
		) ||
		(
			(
				isAfterNow(_program_registration_start_time)() ||
				isBeforeNow(_program_registration_cutoff)()
			) &&
			(
				!_event.allow_drop_in ||
				isAfterNow(_event.registration_start_time)() ||
				isBeforeNow(_event.registration_cutoff)()
			)
		)
	) {
		if ($element.context.tagName.toUpperCase() === 'TR') {
			$element.find('.fc-event-dot').addClass('registrationClosed');
		} else {
			$element.addClass('registrationClosed');
		}
	}
	if (_event.allow_drop_in &&
		_event.spots_dropin &&
		!isAfterNow(_event.registration_start_time)() &&
		isAfterNow(_event.registration_cutoff)()) {
		if ($element.context.tagName.toUpperCase() === 'TR') {
			$element.find('.fc-list-item-marker').append("<span class='statTag staticIcon icon-dropin iconRestyle' style='margin-left: 3px;'></span>");
		} else {
			$element.html("<div class='statTag staticIcon icon-dropin rightAlign iconRestyle' style='margin: 1px;'></div>" + $element.html());
		}
	}
}
