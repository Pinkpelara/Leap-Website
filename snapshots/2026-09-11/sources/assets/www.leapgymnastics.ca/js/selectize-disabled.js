Selectize.define('selectize-disabled', function(options) {

	options = $.extend({
		disableFieldName: 'disabled',
		disableClassName: 'selectize-disabled'
	}, options);

	var selectizeDisabled = function (thisRef, options) {
		var self = thisRef;

		self.setup = (function() {
			var originalSetup = self.setup;
			return function() {
				// // override the item rendering method to add the button to each
				var originalRenderOption = self.settings.render.option;
				self.settings.render.option = function(data) {
					var  $option = $(originalRenderOption.apply(self, arguments));
					if(!(self.items.indexOf(data[self.settings.valueField]) >= 0 || self.items.indexOf("" + data[self.settings.valueField]) >= 0) && data[options.disableFieldName] && data[options.disableFieldName] === true) {
						$option.addClass(options.disableClassName);
					}
					return $option;
				};

				originalSetup.apply(self, arguments);
			};
		})();

		self.addItem = (function() {
			self.forceAddItem =  self.addItem;
			return function (value) {
				if (self.options.hasOwnProperty(value) && (!self.options[value][options.disableFieldName] || self.items.indexOf(value) >= 0 || self.items.indexOf("" + value) >= 0)){
					return self.forceAddItem.apply(self, arguments);
				}
				return null;
			};
		})();
	};
	selectizeDisabled(this, options);
});