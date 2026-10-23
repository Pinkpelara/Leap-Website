(function () {
	var inject_binding = function (allBindings, key, value) {
		//https://github.com/knockout/knockout/pull/932#issuecomment-26547528
		return {
			has: function (bindingKey) {
				return (bindingKey === key) || allBindings.has(bindingKey);
			},
			get: function (bindingKey) {
				var binding = allBindings.get(bindingKey);
				if (bindingKey === key) {
					binding = binding ? [].concat(binding, value) : value;
				}
				return binding;
			}
		};
	};
	
	ko.bindingHandlers.selectize = {
		init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
			if (!allBindingsAccessor.has('optionsText')) {
				allBindingsAccessor = inject_binding(allBindingsAccessor, 'optionsText', 'name');
			}
			if (!allBindingsAccessor.has('optionsValue')) {
				allBindingsAccessor = inject_binding(allBindingsAccessor, 'optionsValue', 'id');
			}
			if (typeof allBindingsAccessor.get('optionsCaption') !== 'undefined') {
				allBindingsAccessor = inject_binding(allBindingsAccessor, 'optionsCaption', allBindingsAccessor.get('optionsCaption'));
			}
			if (!allBindingsAccessor.has('optionsMaxOptions')) {
				allBindingsAccessor = inject_binding(allBindingsAccessor, 'optionsMaxOptions', 10000);
			}

			var selectizeSettings = {
				closeAfterSelect: true,
				hideSelected: true,
				valueField: allBindingsAccessor.get('optionsValue'),
				labelField: allBindingsAccessor.get('optionsText'),
				searchField: allBindingsAccessor.get('optionsText'),
				maxOptions: allBindingsAccessor.get('optionsMaxOptions'),
				plugins: [],
				options: ko.mapping.toJS(valueAccessor()()),
			};

			if (allBindingsAccessor.has('hideSelected')) {
				selectizeSettings.hideSelected = allBindingsAccessor.get('hideSelected');
			}
			if (allBindingsAccessor.has('optionsCreate')) {
				selectizeSettings.create = allBindingsAccessor.get('optionsCreate');
				if(selectizeSettings.create === null) {
					delete selectizeSettings['create'];
				}
			}
			if (allBindingsAccessor.has('optionsSortField')) {
				selectizeSettings.sortField = allBindingsAccessor.get('optionsSortField');
			}
			if (allBindingsAccessor.has('selectizePlaceholder')) {
				selectizeSettings.placeholder = allBindingsAccessor.get('selectizePlaceholder');
			}
			if (allBindingsAccessor.has('selectizeDropdownParent')) {
				selectizeSettings.dropdownParent = allBindingsAccessor.get('selectizeDropdownParent');
			}
			if (allBindingsAccessor.has('selectizeOnType')) {
				selectizeSettings.onType = allBindingsAccessor.get('selectizeOnType');
			}
			if (allBindingsAccessor.has('selectizeOnChange')) {
				selectizeSettings.onChange = allBindingsAccessor.get('selectizeOnChange');
			}
			if (allBindingsAccessor.has('selectizeOnDropdownOpen')) {
				selectizeSettings.onDropdownOpen = allBindingsAccessor.get('selectizeOnDropdownOpen');
			}

			if (allBindingsAccessor.has('optionsMaxItems')) {
				selectizeSettings.maxItems = allBindingsAccessor.get('optionsMaxItems');
			}
			if (allBindingsAccessor.has('onItemAdd')) {
				selectizeSettings.onItemAdd = allBindingsAccessor.get('onItemAdd');
			}

			if (allBindingsAccessor.has('selectizeDisable')) {
				selectizeSettings.plugins.push('selectize-disabled');
			}

			if (allBindingsAccessor.has('selectizeRender')) {
				selectizeSettings.render = allBindingsAccessor.get('selectizeRender');
			}

			var $select = $(element).selectize(selectizeSettings)[0].selectize;
			if (allBindingsAccessor.has('selectizeDisable')) {
				if (allBindingsAccessor.get('selectizeDisable')) {
					$select.disable();
				}
			}
			
			if (allBindingsAccessor.has('selectizeEnable')) {
				var enabled = ko.unwrap(allBindingsAccessor.get('selectizeEnable'));
				if (!enabled) {
					$select.disable();
				}
				if (typeof allBindingsAccessor.get('selectizeEnable') === 'function') {
					allBindingsAccessor.get('selectizeEnable').subscribe(function (value) {
						value ? $select.enable() : $select.disable();
					});
				}
			}
			
			$(element).on('remove', function() {
				if (typeof allBindingsAccessor.get('value') === 'function') {
					allBindingsAccessor.get('value')(null);
				}
				setTimeout(function () {
					$select.destroy();
				});
			});
			var valueAccessorValue = valueAccessor();
			valueAccessorValue().forEach(function(opt) {
				if(ko.isObservable(opt)) {
					opt.subscribe(function(val) {
						$select.updateOption(ko.unwrap(val[allBindingsAccessor.get('optionsValue')]), ko.mapping.toJS(val));
					});
				}
			});

			var valueAccessorTimeout;
			valueAccessorValue.subscribe(function (options) {
				clearTimeout(valueAccessorTimeout);
				valueAccessorTimeout = setTimeout(function () {
					options.forEach(function (opt) {
						$select.updateOption(ko.unwrap(opt[allBindingsAccessor.get('optionsValue')]), ko.mapping.toJS(opt));
					});
				}, 25);
			});

			
			if (typeof allBindingsAccessor.get('value') === 'function') {
				var current_val = allBindingsAccessor.get('value')();
				if(current_val) {
					if (typeof $select.forceAddItem === 'function') {
						$select.forceAddItem(current_val);
					}
					else {
						$select.addItem(current_val);
					}
				}
				allBindingsAccessor.get('value').subscribe(function (new_val) {
					if(new_val) {
						if (typeof $select.forceAddItem === 'function') {
							$select.forceAddItem(new_val);
						}
						else {
							$select.addItem(new_val);
						}
					}
					else if (allBindingsAccessor.has('allowToBeCleared') && allBindingsAccessor.get('allowToBeCleared')) {
						$select.setValue('');
					}
				})
			}
			
			if (typeof allBindingsAccessor.get('selectedOptions') === 'function') {
				allBindingsAccessor.get('selectedOptions')().forEach(function (opt) {
					$select.addItem(opt);
				});
			}

		}
	};
}());