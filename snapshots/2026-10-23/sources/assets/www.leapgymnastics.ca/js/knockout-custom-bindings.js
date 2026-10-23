/**
 * Created by luis on 01/06/16.
 */

/**
 * The observable' value could be a timestamp or a formatted  date
 */
ko.subscribable.fn.date = function (formatIndex) {
	var format = _DATE_FORMATS[formatIndex];
	moment.locale(MOMENT_LOCALE || 'en');
	return ko.computed(function () {
		var val = this(), intVal = parseInt(val);
		if (val) {
			if (typeof val === 'number' || (typeof intVal === 'number' && intVal == val)) {
				return format ? moment.unix(val).format(format) : moment.unix(val).format();
			}
			else {
				return format ? moment(val).format(format) : moment(val).format();
			}
		}
	}, this);
};

ko.subscribable.fn.currency = function () {
	return ko.pureComputed(function () {
		let resolved = typeof round === 'undefined' ? this() : round(this());
		if(resolved === -0 && (1/resolved !== Infinity)) {
			//eliminates the possibility of -0
			resolved = 0;
		}
		return resolved === null ? '--' : accounting.formatMoney(resolved);
	}, this);
};
ko.subscribable.fn.decimals = function (precision) {
	return ko.pureComputed(function () {
		let resolved = typeof round === 'undefined' ? this() : round(this());
		if(resolved === -0 && (1/resolved !== Infinity)) {
			//eliminates the possibility of -0
			resolved = 0;
		}
		return resolved === null ? '--' : accounting.formatNumber(resolved, precision);
	}, this);
};

ko.subscribable.fn.maxInputValue = function(max) {
	return ko.computed({
		read: function() {
			return this();
		}, write: function(price) {
			var val = price;
			var _val = 0.00;
			if(!isNaN(parseFloat(val))) {
				_val = val;
			}
			if (_val > max) {
				_val = max;
			}
			var floatVal = parseFloat(_val);
			this(floatVal.toFixed(3));
			this(floatVal.toFixed(2));
		}
	}, this)
};

ko.subscribable.fn.price = function() {
	return ko.pureComputed({
		read: function() {
			var val = this();
			if(!isNaN(parseFloat(val))) {
				return round(val);
			}
			return val;
		}, write: function(price) {
			this(price);
		}
	}, this)
};

ko.subscribable.fn.abs = function() {
	return ko.pureComputed({
		read: function() {
			var val = this();
			if(!isNaN(parseFloat(val))) {
				return Math.abs(val);
			}
			return val;
		}, write: function(val) {
			this(val);
		}
	}, this)
};

ko.subscribable.fn.localizedNumber = function() {
	var pos = _ACCOUNTING_SETTING.currency.format.pos.replace(/[\s]/ig, '');
	var formatMoney = $.extend(true, {}, _ACCOUNTING_SETTING.currency, {symbol: '', format: {pos: pos}});
	return ko.computed({
		read: function() {
			var val = getValidNumberString(this());
			return typeof val === "number" && !isNaN(val) ? accounting.formatMoney(val, formatMoney) : '';
		}, write: function(price) {
			var val = getValidNumberString(price);
			this(null);
			if (typeof val === "number" && !isNaN(val)) {
				this(accounting.formatMoney(val, formatMoney));
			}
		}
	}, this);
};

ko.subscribable.fn.futureDate = function() {
	return ko.pureComputed(
		function() {
			var timestamp = getTimestamp(this(), true);
			if(timestamp) {
				var _m = moment.unix(timestamp);
				return _m.format(_DATE_FORMATS[LONG_DATE]);
			}
		}, this);
};

ko.subscribable.fn.futureDateTime = function() {
	return ko.pureComputed(
		function() {
			var timestamp = getTimestamp(this(), true);
			if(timestamp) {
				var _m = moment.unix(timestamp);
				return _m.format(_DATE_FORMATS[MEDIUM_DATE_TIME]);
			}
		}, this);
};

ko.subscribable.fn.anyDate = function() {
	return ko.pureComputed(
		function() {
			var timestamp = getTimestamp(this());
			if(timestamp) {
				var _m = moment.unix(timestamp);
				return _m.format(_DATE_FORMATS[LONG_DATE]);
			}
		}, this);
};

ko.subscribable.fn.ucwords = function () {
	return ko.computed(function () {
		return  this().toLowerCase().replace(/\b[a-z]/g, function(letter) {
			return letter.toUpperCase();
		});
	}, this);
};

ko.subscribable.fn.subscribeChanged = function (callback) {
	var savedValue = this.peek();
	return this.subscribe(function (latestValue) {
		var oldValue = savedValue;
		savedValue = latestValue;
		callback(latestValue, oldValue);
	});
};

ko['subscribable'].fn.padStart = function (num, char) {
	return ko['pureComputed'](function () {
		let val = this();
		return val ? ('' + val).padStart(num, char) : val;
	}, this);
};

//an observable that retrieves its value when first bound
ko.onDemandObservable = function(callback, target) {
	var _value = ko.observable();  //private observable

	var result = ko.computed({
		read: function() {
			//if it has not been loaded, execute the supplied function
			if (!result.loaded()) {
				callback.call(target);
			}
			//always return the current value
			return _value();
		},
		write: function(newValue) {
			//indicate that the value is now loaded and set it
			result.loaded(true);
			_value(newValue);
		},
		deferEvaluation: true  //do not evaluate immediately when created
	});

	//expose the current state, which can be bound against
	result.loaded = ko.observable();
	//load it again
	result.refresh = function() {
		result.loaded(false);
	};
	return result;
};

// Here's a custom Knockout binding that makes elements shown/hidden via jQuery's fadeIn()/fadeOut() methods
ko.bindingHandlers.fadeVisible = {
	init: function(element, valueAccessor) {
		// Initially set the element to be instantly visible/hidden depending on the value
		var value = valueAccessor();
		$(element).toggle(ko.utils.unwrapObservable(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
	},
	update: function(element, valueAccessor) {
		// Whenever the value subsequently changes, slowly fade the element in or out
		var value = valueAccessor();
		ko.utils.unwrapObservable(value) ? $(element).fadeIn() : $(element).fadeOut();
	}
};

ko.bindingHandlers.uplifterReportTable = {
	init: function(element, valueAccessor) {
		let data = ko.utils.unwrapObservable(valueAccessor());
		if(typeof data !== 'undefined'){
			$(element).empty();
			$(element).uplifterReportTable(data);
		}
	},
	update: function(element, valueAccessor) {
		let data = ko.utils.unwrapObservable(valueAccessor());
		if(typeof data !== 'undefined'){
			$(element).empty();
			$(element).uplifterReportTable(data);
		}
	}
};

/**
 * Disable browser autocomplete / autofill on kojs input fields
 */
ko.bindingHandlers.disableAutoFill = {
	init: function(element) {
		$(element).disableAutoFill();
	},
};

// FancyBox custom binding for knockout. if you find yourself using this binding
// and it does not have all the properties you need, please feel free to add them here (this is the right place)

ko.bindingHandlers.fancyboxModal = {
	init: function (element) {
		$(element).fancybox();
	}
};

ko.bindingHandlers.jqueryTabs = {
	init: function(element) {
		$(element).tabs();
	}
};

ko.bindingHandlers.fancybox = {
	init: function(element, valueAccessor) {
		var value = ko.utils.unwrapObservable(valueAccessor());
		$(element).click(function() {
			$.fancybox({
				type: 'ajax',
				href: value
			});
		});

	}
};

ko.bindingHandlers.priceInput = {
	init: function(element, valueAccessor, allBindings) {
		var $element = $(element);
		var iconClick, isClickable, isNegative;
		valueAccessor = valueAccessor();
		var value = typeof valueAccessor === 'object' && valueAccessor !== null && typeof valueAccessor.value !== 'undefined' ? valueAccessor.value : valueAccessor;
		$element.val(ko.unwrap(value));
		var bindings = allBindings();
		if(typeof bindings['click'] !== 'undefined') {
			iconClick = bindings['click'];
			delete bindings['click'];
		}
		if(typeof bindings['isClickable'] !== 'undefined') {
			isClickable = bindings['isClickable'];
			delete bindings['isClickable'];
		}
		if(typeof bindings['isNegative'] !== 'undefined') {
			isNegative = bindings['isNegative'];
			delete bindings['isNegative'];
		}
		if(typeof bindings['priceInput'] !== 'undefined') {
			delete bindings['priceInput'];
		}
		if(typeof bindings['priceInputIndeterminate'] !== 'undefined') {
			delete bindings['priceInputIndeterminate'];
		}
		createPriceInput($element, valueAccessor, iconClick, isClickable, isNegative, bindings, this);
	}
};

ko.bindingHandlers.percentInput = {
	init: function(element, valueAccessor, allBindings) {
		var $element = $(element);
		var iconClick, isClickable, isNegative;
		valueAccessor = valueAccessor();
		var value = typeof valueAccessor === 'object' && valueAccessor !== null && typeof valueAccessor.value !== 'undefined' ? valueAccessor.value : valueAccessor;
		$element.val(ko.unwrap(value));
		var bindings = allBindings();
		if(typeof bindings['click'] !== 'undefined') {
			iconClick = bindings['click'];
			delete bindings['click'];
		}
		if(typeof bindings['isClickable'] !== 'undefined') {
			isClickable = bindings['isClickable'];
			delete bindings['isClickable'];
		}
		if(typeof bindings['isNegative'] !== 'undefined') {
			isNegative = bindings['isNegative'];
			delete bindings['isNegative'];
		}
		if(typeof bindings['percentInput'] !== 'undefined') {
			delete bindings['percentInput'];
		}
		createPercentInput($element, valueAccessor, iconClick, isClickable, isNegative, bindings, this);
	}
};

ko['bindingHandlers'].accordion = {
	init: function (element, valueAccessor) {
		$(element).next().hide();
		valueAccessor().$element = element;
	},
	update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
		let openState = ko.utils['unwrapObservable'](valueAccessor()),
			focused = openState.focused,
			shouldOpen = openState.shouldOpen,
			allBindings = ko.utils['unwrapObservable']((allBindingsAccessor())),
			collapsible = allBindings.collapsible,
			toClose;
		if (focused && collapsible === true) {
			let clickedGroup = viewModel;
			let groups = [];
			if (typeof allBindings.groups === 'function') {
				groups = allBindings.groups()||[];
			} else if (bindingContext.$root && typeof bindingContext.$root.groups === 'function') {
				groups = bindingContext.$root.groups()||[];
			}
			if (!Array.isArray(groups)) {
				groups = [];
			}
			for (let i = 0, len = groups.length; i < len; i++) {
				if (clickedGroup !== groups[i] && groups[i].openState['peek']().focused && groups[i].openState['peek']().shouldOpen) {
					toClose = groups[i];
					break;
				}
			}
		}

		let header = $(element);
		let dropDown = header.next();
		if (focused && shouldOpen) {
			header.addClass('active');
			let counter = 0;
			dropDown.slideDown({
				queue: false,
				complete: function () {
					counter++;
					if (!toClose || counter === 2) {
						setTimeout(updateFB);
					}
				}
			});
			if (toClose) {
				let header = $(toClose.openState.$element),
					content = header.next();
				header.removeClass('active');
				content.slideUp({
					queue: false,
					complete: function () {
						toClose.openState({focused: true, shouldOpen: false});
						counter++;
						if (counter === 2) {
							setTimeout(updateFB);
						}
					}
				});
			}
		} else if (focused && !shouldOpen) {
			header.removeClass('active');
			dropDown.slideUp({
				complete: function () {
					setTimeout(updateFB);
				}
			});
		} else if (!focused && !shouldOpen) {
			header.removeClass('active');
			dropDown.slideUp({
				complete: function () {
					setTimeout(updateFB);
				}
			});
		}
	}
};

ko.bindingHandlers.instructorFieldAutoComplete = {
	init: function(element, valueAccessor) {
		var $element = $(element);
		var sfv = valueAccessor();
		var get = {
			action: 'instructorByEmail'
		};
		var constructorName = sfv.site_field.getRoot().constructor.name;
		if (constructorName === 'OrderCommon' || constructorName === 'Checkout') {
			get.checkout = true
		}
		
		function addValueToSFV (value) {
			var value = value;
			var values = [];
			if (!sfv.allowMultiples()) {
				values = [value];
			}
			else {
				sfv.values().forEach(function (entry) {
					values.push(entry.value());
				});
				if (values.indexOf(value) === -1) {
					values.push(value);
				}
			}
			sfv.setValues(values);
			$element.val('');
			sfv.error(null);
		}
		
		var lastAjax = null;
		var timer;
		$element.keyup(function () {
			clearTimeout(timer);
			timer = setTimeout(function() {
				var email = $element.val();
				if (email.length >= 6) {
					if (window.instructorSiteFieldLookup[email]) {
						addValueToSFV(window.instructorSiteFieldLookup[email]);
						return;
					}
					
					if(lastAjax !== null) {
						lastAjax.abort();
						lastAjax = null;
					}
					get.email = email;
					lastAjax = UP.Services.AjaxGetCall('/participants/ajax/get-participant-info.php', get, function(response) {
						if(response.error){
							sfv.error(response.error);
						} else if (response.instructor) {
							var value;
							if (response.instructor.instructor_id) {
								value = {instructor_id: parseInt(response.instructor.instructor_id, 10)};
								var instructor = SiteField.instructorsById()[value.instructor_id];
								if (instructor) {
									instructor.email(email);
								}
							}
							else {
								value = {
									email: email,
									first_name: response.instructor.first_name,
									last_name: response.instructor.last_name,
									name: response.instructor.name
								};
							}
							value = JSON.stringify(value);
							addValueToSFV(value);
						}
						else {
							sfv.error(null);
							sfv.instructor(new Instructor({email: email}));
						}
						updateFB();
					});
				}
			}, 500);
		});
		
	}
};

ko.bindingHandlers.selected = {
	update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
		var selected = ko.utils.unwrapObservable(valueAccessor());
		if (selected) element.select();
	}
};

(function () {
	ko['bindingHandlers'].siteGroupMember = {
		init: function(element, valueAccessor, allBindings, viewModel) {
			var siteGroup = ko.unwrap(valueAccessor());
			$(element).autocomplete({
				minLength: 2,
				source: function(request, response) {
					UP.Services.AjaxGetCall(viewModel.lookupURL(), request, function(data) {
						var filtered = [], add = true, members = [];
						if (siteGroup.lookFor() === 'PARTICIPANT') {
							members = siteGroup.participantsToAdd();
							data.forEach(function (option) {
								add = true;
								for (var i = 0, len = members.length; i < len; i++) {
									if (parseInt(members[i].id(), 10) === parseInt(option.value, 10)) {
										add = false;
										break;
									}
								}
								if (add) {
									filtered.push(option);
								}
							});
						}
						else if (siteGroup.lookFor() === 'USER') {
							filtered = data;
						}
						response(filtered);
					});
				},
				focus: function() {
					return false;
				},
				select: function(event, ui) {
					if (siteGroup.lookFor() === 'PARTICIPANT') {
						var participant = new Participant({
							data: {
								id: ui.item.value,
								participant_id: ui.item.value,
								name: ui.item.label
							}
						});
						participant.newRole = ko.observable(null);
						siteGroup.participantsToAdd.push(participant);
					}
					else if (siteGroup.lookFor() === 'USER') {
						var user = new User({
							data: {
								id: ui.item.value,
								user_id: ui.item.value,
								name: ui.item.label,
								email: ''
							}
						});
						user.newRole = ko.observable(null);
						siteGroup.usersToAdd.push(user);
					}
					ui.item.value = null;
					updateFB();
				}
			});
		}
	};
})();

ko.bindingHandlers.attachData = {
	init: function (element, valueAccessor) {
		var $element = $(element),
			values = valueAccessor();
		for(var k in values) {
			if(values.hasOwnProperty(k)) {
				$element.data(k, values[k]);
			}
		}
	}
};
/**
 * @see https://stackoverflow.com/questions/8068305/passing-options-to-templates-in-knockout-1-3
 */
ko['bindingHandlers'].templateWithOptions = {
	init: ko['bindingHandlers'].template.init,
	update: function(element, valueAccessor, allBindingsAccessor, viewModel, context) {
		let options = ko.utils['unwrapObservable'](valueAccessor());
		//if options were passed attach them to $data
		context.$data.$item = ko.utils['unwrapObservable'](options['templateOptions']||{});
		//call actual template binding
		ko['bindingHandlers'].template.update(element, valueAccessor, allBindingsAccessor, viewModel, context);
	}
};

ko.observable.fn.inverse = ko.computed.fn.inverse = function() {
	return ko.pureComputed({
		read: function () {
			return !this();
		}, write: function(val) {
			this(!val)
		}
	}, this);
};

ko.bindingHandlers.chosen = {
	init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
		var $element = $(element);
		var settings = ko.unwrap(valueAccessor()) || {};

		if(typeof settings.width === 'undefined') {
			settings.width = '100%';
		}
		$element.chosen(settings);
		if (typeof settings.allow_free_form === 'function') {
			let $chosen_container = $element.next('.chosen-container');
			$chosen_container.on('click', '.no-results', function(event) {
				let newValue = ($chosen_container.find('.chosen-search-input').val()||'').trim();
				settings.allow_free_form(newValue, true);
			});
			$chosen_container.on('keyup', '.chosen-search-input', function(event) {
				let keycode = (event.keyCode ? event.keyCode : event.which),
					newValue = ($(this).val()||'').trim();
				if(keycode === 13 && newValue) {
					settings.allow_free_form(newValue, true);
				}
			});
		}
		['options', 'selectedOptions', 'value'].forEach(function(propName){
			if (allBindings.has(propName)){
				var prop = allBindings.get(propName);
				if (ko.isObservable(prop)){
					prop.subscribe(function(value){
						$element.trigger('chosen:updated');
					});
				}
			}
		});
	}
}

ko.bindingHandlers.scrollTo = {
	scrollTos: [],
	scrollToTimeout: null,
	init: function(element, valueAccessor) {
		if (element.scrollIntoView) {
			let scrollToElement = function (val) {
				if (val && (!(val instanceof Array) || val.length > 0)) {
						clearTimeout(ko.bindingHandlers.scrollTo.scrollToTimeout);
						ko.bindingHandlers.scrollTo.scrollToTimeout = setTimeout(function() {
							element.scrollIntoView({behavior: 'smooth', block: 'start'});
						});
					}
				},
				_value = valueAccessor();
			if (_value instanceof Array) {
				if(ko.bindingHandlers.scrollTo.scrollTos.indexOf(_value) < 0) {
					ko.bindingHandlers.scrollTo.scrollTos.push(_value);
					_value.map(function (val) {
						if (ko.isObservable(val)) {
							val.subscribe(scrollToElement);
						}
						if(ko.unwrap(val)) {
							scrollToElement();
						}
					});
				}
			} else if (ko.isObservable(_value)) {
				_value.subscribe(scrollToElement);
			}
		}
	},
	update: function (element, valueAccessor) {
		if (element.scrollIntoView) {
			let scrollToElement = function (val) {
				if (val && (!(val instanceof Array) || val.length > 0)) {
						clearTimeout(ko.bindingHandlers.scrollTo.scrollToTimeout);
						ko.bindingHandlers.scrollTo.scrollToTimeout = setTimeout(function() {
							element.scrollIntoView({behavior: 'smooth', block: 'start'});
						});
					}
				},
				_value = valueAccessor()
			if (_value instanceof Array) {
				if(ko.bindingHandlers.scrollTo.scrollTos.indexOf(_value) < 0) {
					_value.map(function (val) {
						if (ko.isObservable(val)) {
							ko.bindingHandlers.scrollTo.scrollTos.push(_value);
							val.subscribe(scrollToElement);
						}
						if(ko.unwrap(val)) {
							scrollToElement();
						}
					});
				}
			} else if (ko.isObservable(_value)) {
				if(ko.bindingHandlers.scrollTo.scrollTos.indexOf(_value) < 0) {
					ko.bindingHandlers.scrollTo.scrollTos.push(_value);
					_value.subscribe(scrollToElement);
				}
			} else if (_value) {
				scrollToElement();
			}
		}
	}
}

ko.bindingHandlers.stopBubble = {
	init: function(element) {
		ko.utils.registerEventHandler(element, "click", function(event) {
			event.cancelBubble = true;
			if (event.stopPropagation) {
				event.stopPropagation();
			}
		});
		ko.utils.registerEventHandler(element, "mousedown", function(event) {
			event.cancelBubble = true;
			if (event.stopPropagation) {
				event.stopPropagation();
			}
		});
	}
};

ko['bindingHandlers'].LSLanguageSelector = {
	init: function(element, valueAccessor) {
		let temp = document.createElement('div'),
			$elem = $(element);

		$elem.after(temp);
		$elem.remove();
		let setting = valueAccessor() || {};
		let viewModel = setting.viewModel;
		if (!viewModel) {
			viewModel = new LanguageSelector({
				LSObservable: setting.LSObservable,
				afterChange: setting.afterChange,
				cssParentClass: setting.cssParentClass
			});
		}
		ko.renderTemplate(
			'LSLanguageSelectorTemp',
			viewModel,
			{
				afterRender: function (nodes) {
					let languageSelector = nodes.find(function (node) {
						return $(node).hasClass('language-selector');
					});
					if (languageSelector) {
						$(languageSelector).find('span[data-lang="' + (ko.unwrap(window.editingLang) || window['lang'] || 'eng') + '"]').click();
					}
				}
			},
			temp,
			'replaceNode'
		);
	}
};

ko['bindingHandlers'].handsontable = {
	init: function(element, valueAccessor) {
		let value = valueAccessor();
		if(typeof value === 'object' && value !== null) {
			let handsontableData = typeof value.handsontable !== 'undefined' ? value.handsontable : value;
			let hot = new Handsontable(element, handsontableData);
			let scrollBGH = document.createElement('div');
			scrollBGH.className = "scrollBGDisplay scrollBGH";
			let scrollBGV = document.createElement('div');
			scrollBGV.className = "scrollBGDisplay scrollBGV";
			hot.container.append(scrollBGH);
			hot.container.append(scrollBGV);
			if(typeof value.updateSettings === 'object' && value.updateSettings !== null) {
				hot.updateSettings(value.updateSettings);
			}
			if(ko.isObservable(value.object)) {
				value.object(hot);
			}
		}
	}
}

ko['bindingHandlers'].floatingHorizontalScrollbar = {
	init: function (element, valueAccessor) {
		const $scrollingElement = element;
		const $valueAccessed = valueAccessor();

		if(
			typeof $valueAccessed !== 'object' ||
			$valueAccessed === null ||
			typeof $valueAccessed.wrapper === 'undefined' ||
			typeof $valueAccessed.container === 'undefined'
		) {
			return;
		}

		$scrollingElement.style.overflowX = 'hidden';

		//convert NodeList to array so we can use .forEach
		Array.prototype.slice.call($scrollingElement.querySelectorAll($valueAccessed.wrapper)).forEach(function($wrapper) {
			//convert NodeList to array so we can use .reduce
			const $containers = Array.prototype.slice.call($wrapper.querySelectorAll($valueAccessed.container));
			if (!$containers.length) {
				return;
			}

			const $scrollerWrapper = document.createElement('div');
			$scrollerWrapper.className = 'floatingHorizontalScrollbarWrapper'
			$scrollerWrapper.style.position = 'relative';
			$scrollerWrapper.style.overflowY = 'visible';
			$scrollerWrapper.style.overflowX = 'none';


			const $scroller = document.createElement('div');
			$scroller.className = 'realScrollbar'
			$scroller.style.position = 'absolute';
			$scroller.style.overflowX = 'scroll';
			$scroller.style.display = 'block';
			$scrollerWrapper.appendChild($scroller);

			const $width = document.createElement('div');
			$width.style.height = '1px'
			$scroller.appendChild($width);

			const $hiddenScroller = document.createElement('div');
			$hiddenScroller.className = 'fakeScrollbar'
			$hiddenScroller.style.position = 'relative';
			$hiddenScroller.style.overflowX = 'scroll';
			$hiddenScroller.style.display = 'block';
			$hiddenScroller.style.visibility = 'hidden';
			$hiddenScroller.style.width = '1px';
			$scrollerWrapper.appendChild($hiddenScroller);

			$scrollingElement.after($scrollerWrapper);

			let lastOuterWidth = null,
				lastScrollWidth = null,
				isScrolling = false,
				scrollInitialized = false,
				resizeScroller = function () {
					if(isScrolling) {
						return;
					}
					$scrollingElement.style.overflowX = 'auto'
					$scroller.style.display = 'none';
					$containers.forEach(function (el) {
						el.style.overflowX = 'auto'
					});

					let newScrollWidth = $containers.reduce(function (carry, el) {
							return Math.max(carry, el.offsetLeft + el.scrollWidth)
						}, 0),
						newOuterWidth = $scrollingElement.clientWidth;
					if (lastScrollWidth !== newScrollWidth) {
						lastScrollWidth = newScrollWidth;
						$width.style.width = lastScrollWidth + 'px'
					}
					if (lastOuterWidth !== newOuterWidth) {
						lastOuterWidth = newOuterWidth;
						$scroller.style.width = lastOuterWidth + 'px'
					}

					if (newScrollWidth <= newOuterWidth) {
						$scrollerWrapper.style.display = 'none'
						$scroller.scrollLeft = 0;
						$containers.forEach($container => {
							$container.scrollLeft = $scroller.scrollLeft;
						});
					} else {
						$containers.forEach(function (el) {
							el.style.overflowX = 'hidden'
						});
						$scrollerWrapper.style.display = 'block'
						$scroller.style.display = 'block';
						$scrollingElement.style.overflowX = 'hidden'
						if(!scrollInitialized) {
							if($scrollerWrapper.offsetHeight === 0) {
								$hiddenScroller.style.height = '15px';
								$scroller.style.height = '15px';
							}
							scrollInitialized = true;
						}

					}
				},
				stopScrolling = function() {
					isScrolling = false;
					window.removeEventListener('mouseup', stopScrolling);
				};

			$scroller.addEventListener('mousedown', function(e) {
				if(e.button === 0) {
					isScrolling = true;
					window.addEventListener('mouseup', stopScrolling);
				}
			});
			setInterval(resizeScroller,200)

			let animation = null,
				ignoreScrollEvent = false,
				scrollFn = function() {
					if (ignoreScrollEvent) return false;

					if (animation) cancelAnimationFrame(animation);
					animation = requestAnimationFrame(() => {
						ignoreScrollEvent = true;

						$containers.forEach($container => {
							$container.scrollLeft = $scroller.scrollLeft;
						});

						ignoreScrollEvent = false;
					});
				}
			$scroller.addEventListener('scroll', scrollFn);
		});
	}
}

ko['bindingHandlers'].tinyMCE = (function () {

	function _initTinyMCE (element, targetObservable, otherSettings) {
		if (targetObservable.tinyMceEDitor) {
			targetObservable.tinyMceEDitor.destroy();
		}

		let setting = $.extend(true, {}, typeof window.getTinyMCESettings === 'function' ? window.getTinyMCESettings() : {}, otherSettings || {});
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
		if (typeof window.initStandardTinyMCE === 'function') {
			setTimeout(function () {
				window.initStandardTinyMCE(setting);
			});
		}
	}

	return {
		init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
			ko['bindingHandlers'].textInput.init.call(this, element, valueAccessor, allBindings, viewModel, bindingContext);
			let targetObservable = valueAccessor();
			_initTinyMCE(element, targetObservable);
		}
	};
})();