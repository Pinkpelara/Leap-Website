var Note = function (options) {
	var self = this;
	ko.mapping.fromJS(options.data, {}, self);
	self.order = options.parent;
	if(typeof EditableContent !== 'undefined') {
		EditableContent.call(self);
	}
};

var WaitList = function (options, root) {
	var self = this;
	var mapping = {
		order_item: {
			create: function (options) {
				return new OrderItem(options, root);
			}
		}
	};
	ko.mapping.fromJS(options.data, mapping, self);
	self.positionAvailable = ko.pureComputed(function () {
		return self.position() < 0 &&
			self.order_item.product() &&
			self.order_item.product().status() !== 'Unavailable' &&
			isBeforeNow(self.order_item.product().program.registration_start_time)();
	});
	self.vm = options.parent;
};