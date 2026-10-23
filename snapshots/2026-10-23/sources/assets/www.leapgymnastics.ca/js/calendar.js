window.adminScope = window.adminScope ? 1 : 0;
window.calendarLocations = {};
window.calendarPrograms = {};
window.calendarOptions = window.calendarOptions ? window.calendarOptions : {};
window.calendarSettings = window.calendarSettings ? window.calendarSettings : {};
window.additionalCalendarSettings = window.additionalCalendarSettings ? window.additionalCalendarSettings : {};
window.calendarInitialized = window.calendarInitialized ? window.calendarInitialized : false;
window.eventLookupTimeout = null;
window.delayTimeout = null;
window.eventLookupDelay = 1;
window.cachedEvents = [];
window.cachedFilteredEvents = [];
window.extraEventFilter = window.extraEventFilter ? window.extraEventFilter : null;
window.currentFilters = window.currentFilters ? window.currentFilters : null;
window.clearEventCache = null; // 'currentView' || 'all'
window.calendar = null;
window.userHasBetaOrders =  window.userHasBetaOrders ? window.userHasBetaOrders : false;

$(document).ready(function () {
	window.calendarSettings = {
		plugins: ['dayGrid', 'timeGrid', 'list', 'moment', 'momentTimezone', 'interaction'],
		header: {
			left: 'prev,next today',
			center: 'title',
			right: 'dayGridMonth,timeGridWeek,timeGridDay'
		},
		height: "auto",
		editable: false,
		timeZone: moment_timezone,
		locale: (MOMENT_LOCALE || 'en'),
		events: function (eventInfo, callback, failureCallback) {
			clearTimeout(window.eventLookupTimeout);
			clearTimeout(window.delayTimeout);

			var data = {};
			data.start = moment(eventInfo.startStr).startOf('day').unix();
			data.end = moment(eventInfo.endStr).endOf('day').unix();
			data = $.extend(data, window.calendarOptions);
			var key = $.param(data);

			if (window.clearEventCache === 'currentView') {
				delete window.cachedEvents[key];
				window.cachedFilteredEvents = [];
			} else if (window.clearEventCache === 'all') {
				window.cachedEvents = [];
				window.cachedFilteredEvents = [];
			}
			window.clearEventCache = null;

			if (typeof window.cachedEvents[key] !== 'undefined') {
				var filteredEvents = window.cachedEvents[key];
				if (typeof window.extraEventFilter === 'function'){
					filteredEvents = window.extraEventFilter(filteredEvents, key);
				}
				formatEvents(filteredEvents, key, callback);
				return null;
			}

			window.eventLookupTimeout = setTimeout(function () {
				const url = new URL(window.location.href);

				url.searchParams.set('calendarAction', 'fetchEvents');
				url.searchParams.set('start', data.start);
				url.searchParams.set('end', data.end);

				const urlString = url.toString();


				$.ajax({
					url: urlString,
					type: 'POST',
					data: data,
					dataType: 'JSON',
					beforeSend: function () {
						$.fancybox.showActivity ? $.fancybox.showActivity() : $.fancybox.showLoading();
					},
					complete: function () {
						$.fancybox.hideActivity ? $.fancybox.hideActivity() : $.fancybox.hideLoading();
					},
					success: function (events) {
						if (events.errors) {
							alert(events.errors.join("\n"));
							return false;
						}

						var missingLocationIds = [];
						var missingProgramIds = [];
						if (events) {
							$.each(events, function (index, event) {
								if (event.location_id && !window.calendarLocations[event.location_id] && missingLocationIds.indexOf(parseInt(event.location_id)) === -1) {
									missingLocationIds.push(parseInt(event.location_id));
								}
								if (event.program_id && !window.calendarPrograms[event.program_id] && missingProgramIds.indexOf(parseInt(event.program_id)) === -1) {
									missingProgramIds.push(parseInt(event.program_id));
								}
							});
						} else {
							events = [];
						}

						window.cachedEvents[key] = events;

						if ((missingLocationIds && missingLocationIds.length) || (missingProgramIds && missingProgramIds.length)) {
							lookupMissingCalendarData({locationIds: missingLocationIds, programIds: missingProgramIds}, events, key, callback);
						} else {
							formatEvents(events, key, callback);
						}
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						//don't alert of errors if the request was just cancelled
						if(XMLHttpRequest.status !== 0) {
							alert(jsmsgErrorUnknown);
						}
					}
				});
			}, window.eventLookupDelay, data, key, callback);

			//prevent calendar lookup spam
			window.eventLookupDelay = 500;
			window.delayTimeout = setTimeout(function () {
				window.eventLookupDelay = 1;
			}, 500);
		},
		eventClick: function (calEvent) {
			if (calEvent.event.extendedProps.participants) {
				let url = window.adminScope  ? '/admin/ajax/display-event.php' : '/ajax/display-event.php';
				url += '?title=' + encodeURIComponent(calEvent.event.title) + '&event_id=' + calEvent.event.extendedProps.event_id;
				if (typeof calEvent.event.extendedProps.participants !== 'undefined') {
					url += '&participants=' + calEvent.event.extendedProps.participants;
				}
				$.fancybox({
					href: url,
					onComplete: function(instance) {
						$('#fancybox-content').on('click', '.withdraw-order-item', function (e) {


							e.stopPropagation();
							$.fancybox.showLoading();
							let program_registration_id;

							if ($(this).attr('rel')) {
								program_registration_id = $(this).attr('rel');
							}

							if ( !program_registration_id) {
								alert(
									jsmsgErrorNoItemToWithdraw
								);
								return false;
							}

							var data = {
								action: 'GetWithdrawalItems',
								program_registration_id: program_registration_id
							};

							if (typeof adminScope !== 'undefined' && adminScope == 1) {
								var href = '/admin/ajax/withdraw-item.php';
							} else {
								var href='/users/ajax/withdraw-item.php'
							}

							UP.Services.AjaxGetCall(href, data, function (response) {
								if (response.error) {
									alert(response.error);
								} else {
									showModal({
										template: 'withdrawItemTemp',
										viewModel: new WithdrawItemList(response, self),
										minWidth: '320px'
									});
								}
							});

						});
					}
				});
			}

			if (calEvent.event.extendedProps.shift) {
				$.fancybox({
					href: window.adminScope ? '/admin/users/ajax/user-shift.php?user=' + calEvent.event.extendedProps.user + '&shift=' + calEvent.event.extendedProps.shift : '/users/ajax/user-shift.php?user=' + calEvent.event.extendedProps.user + '&shift=' + calEvent.event.extendedProps.shift,
					onComplete: saveShift
				});
			}
			if (calEvent.event.extendedProps.volunteer_position) {
				$.fancybox({
					href: '/users/ajax/volunteer-position.php?volunteer_position=' + calEvent.event.extendedProps.volunteer_position
				});
			}
		}
	};

	function formatEvents(filteredEvents, key, callback) {
		if (typeof window.extraEventFilter === 'function') {
			filteredEvents = window.extraEventFilter(filteredEvents, key);
		}

		$.each(filteredEvents, function (index, event) {
			if (event.location_id && typeof window.calendarLocations[event.location_id] !== 'undefined') {
				event.textColor = window.calendarLocations[event.location_id].textColor;
				event.backgroundColor = window.calendarLocations[event.location_id].backgroundColor;
				event.borderColor = window.calendarLocations[event.location_id].borderColor;
				event.color = window.calendarLocations[event.location_id].color;
			}
			if (event.program_id) {
				event['className'].push('program-' + event.program_id);
			}
			if (event.location_id) {
				event['className'].push('location-' + event.location_id);
			}
			if (event.location_id && event.program_id) {
				event.title = calendarPrograms[event.program_id].summary;
			}
			if (event.volunteer_position_id) {
				event.program_summary = calendarPrograms[event.program_id].summary;
			}
		});

		if (callback) {
			callback(filteredEvents);
		}
	}

	function lookupMissingCalendarData(data, events, key, callback) {
		var url = window.location.href;
		url += (url.indexOf('?') === -1 ? '?' : '&');
		url += 'calendarAction=fetchMissingData';

		if (typeof lookupMissingCalenderPrograms === 'function' &&
			(typeof data.programIds !== 'undefined' && Object.keys(data.programIds).length)
		){
			lookupMissingCalenderPrograms(data.programIds);
			data.programIds = [];
		}

		if ((typeof data.programIds === 'undefined' || !Object.keys(data.programIds).length) &&
			(typeof data.locationIds === 'undefined' || !Object.keys(data.locationIds).length)) {
			loadCalendarLegend();
			formatEvents(events, key, callback);
		} else {
			$.ajax({
				url: url,
				type: 'POST',
				data: data,
				dataType: 'json',
				success: function (response) {
					if (response.errors) {
						alert(response.errors.join("\n"));
						return false;
					}
					$.extend(window.calendarLocations, response.calendarLocations);
					$.extend(window.calendarPrograms, response.calendarPrograms);
					loadCalendarLegend();
					formatEvents(events, key, callback);
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					//don't alert of errors if the request was just cancelled
					if(XMLHttpRequest.status !== 0) {
						alert(jsmsgErrorUnknown);
					}
				}
			});
		}
	}

});


function locationEditCallback(response) {
	$.extend(window.calendarLocations[response.location_id], response);
	window.calendarLocations[response.location_id].textColor = response.textColor;
	window.calendarLocations[response.location_id].backgroundColor = response.backgroundColor;
	window.calendarLocations[response.location_id].borderColor = response.borderColor;
	window.calendarLocations[response.location_id].full_location = window.calendarLocations[response.location_id]['facility_name'] + ' - ' + response['local_string'][lang]['summary'];
	loadCalendarLegend();
	window.calendar.refetchEvents();
	$.fancybox.close();
	$.fancybox.hideLoading();
}

function initCalendar() {
	if (!window.calendarInitialized) {
		if (window.additionalCalendarSettings) {
			window.calendarSettings = $.extend(window.calendarSettings, window.additionalCalendarSettings);
		}
		window.calendarInitialized = true;
		var calendarEl = document.getElementById('calendar');
		window.calendar = new FullCalendar.Calendar(calendarEl, window.calendarSettings);
		window.calendar.render();

	}

}
function destroyCalendar() {
	window.cachedEvents = [];
	window.cachedFilteredEvents = [];
	if (window.calendarInitialized){
		window.calendarInitialized = false;
		window.calendar.destroy();
	}
}

function loadCalendarLegend() {
	var calendarLegend = $(document).find('#calendarLegend');
	var legend = calendarLegend.find('.locations'),
		hasElements = false;
	if (legend) {
		legend.empty();
		$.each(window.calendarLocations, function (key, val) {
			hasElements = true;
			var div = $('<div></div>');
			var classes = 'location';
			classes += ' location-' + val.location_id.toString();
			div.addClass(classes);
			if (val.textColor || val.backgroundColor || val.borderColor) {
				div.css('background-color', val.backgroundColor);
				div.css('color', val.textColor);
				div.css('border', '1px solid ' + val.borderColor);
			} else if (val.color) {
				div.css('background-color', val.color);
			}

			var a;
			if (window.permissions && window.permissions.facility_manager) {
				a = $('<a>' + val.full_location + '</a>');
				a.prop('href', '/admin/ajax/location-edit.php?location_id=' + val.location_id.toString() + '&facility_id=' + val.facility_id + '&action=update_location');
				a.css('color', 'inherit');
				a.fancybox({type: 'ajax'});
			} else {
				a = $('<span>' + val.full_location + '</span>');
			}
			div.append(a);

			legend.append(div)
		});
	}

	if(hasElements) {
		calendarLegend.show();
	}
}