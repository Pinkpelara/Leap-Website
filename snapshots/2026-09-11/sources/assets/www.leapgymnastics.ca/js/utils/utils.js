/**
 * Created by luis on 03/05/16.
 */

var UP = window.UP || {};

UP.Services = UP.Services || {};
(function () {

	let requestCount = 0;

	function ajaxCall(fullUrl, dataObj, callbackFunction, beforeSendCustomLoading, completeCustomLoading, type, dataType, multipart, cache) {
		if (dataObj instanceof FormData && navigator.userAgent.match(/version\/11((\.[0-9]*)*)? .*safari/i)) {
			try {
				eval(
					"for (var pair of dataObj.entries()) {\
						if (pair[1] instanceof File && pair[1].name === '' && pair[1].size === 0) {\
							dataObj.delete(pair[0]);\
						}\
					}"
				);
			} catch (e) { }
		}
		if (!dataObj.lang && lang) {
			dataObj.lang = lang;
		}
		var config = {
			url: fullUrl,
			cache: cache || false,
			data: dataObj,
			dataType: dataType,
			type: type,
			beforeSend: function () {
				if (typeof beforeSendCustomLoading === "function") {
					beforeSendCustomLoading();
				}
				else {
					requestCount++;
					$.fancybox.showLoading();
				}
			},
			success: function (response) {
				if (typeof response === 'object' && response !== null && response.sessionExpired) {
					if (dataObj.ajaxLogin) {
						var callback = function() {
							ajaxCall(fullUrl, dataObj, callbackFunction, beforeSendCustomLoading, completeCustomLoading, type, dataType, multipart);
						};
						UP.Services.login(callback);

						return false;
					} else {
						alert(response.message);
						if(response.redirect) {
							window.parent.location = response.redirect;
						}
						return false;
					}
				} else if (typeof callbackFunction === 'function') {
					callbackFunction(response);
				}
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				//don't alert of errors if the request was just cancelled
				if(XMLHttpRequest.status !== 0) {
					if (dataObj.ajaxLogin) {
						window.parent.location = "/";
					} else {
						//console.log("error :" + XMLHttpRequest.responseText);
						alert(jsmsgErrorUnexpected);
					}
				}
			},
			complete: function () {
				if(beforeSendCustomLoading !== 'function') {
					requestCount--;
					if (requestCount <= 0) {
						$.fancybox.hideLoading();
					}
				}
				if (typeof completeCustomLoading === "function") {
					completeCustomLoading();
				}
			}
		};
		if (multipart) {
			config.processData = false;
			config.contentType = false;
		}
		return $.ajax(config);
	}

	UP.Services.login = function(callback) {
		let fancyBoxOptions = {
			type: 'iframe',
			href: '/ajax/login.php'
		};
		let fancyBox2ToFancyBox1 = {
			afterClose: 'onClosed',
			onCancel: 'onCancel'
		};
		let callbacks = {
			afterClose: function () {
				if (window.viewUser && typeof callback === 'function') {
					callback();
				} else if(window.queueReload) {
					window.location.reload()
				} else if (typeof window.enableAddToCartButton === 'function') {
					window.enableAddToCartButton();
					window.enableAddToCartButton = null;
				} else if (window.viewUser && !window.viewUser.address && window['require_address']) {
					setTimeout(function () {
						let modal = new AddAccountAddress();
						modal.open().then(function (response) {
							if (response['account_address']) {
								viewUser.address = response['account_address'].address;
							}
							$.fancybox.close();
						});
					});
				}
			},
			onCancel: function () {
				if (typeof window.enableAddToCartButton === 'function') {
					window.enableAddToCartButton();
					window.enableAddToCartButton = null;
				}
			}
		};
		if (typeof $.fancybox.version === 'undefined') {
			Object.keys(callbacks).forEach(function (key) {
				fancyBoxOptions[fancyBox2ToFancyBox1[key]] = callbacks[key];
			}) ;
		} else {
			Object.keys(callbacks).forEach(function (key) {
				fancyBoxOptions[key] = callbacks[key];
			}) ;
		}
		$.fancybox(fancyBoxOptions);
	};

	UP.Services.CacheAjaxGetCall = function (fullUrl, dataObj, callbackFunction, beforeSendCustomLoading, completeCustomLoading) {
		return ajaxCall(fullUrl, dataObj, callbackFunction, beforeSendCustomLoading, completeCustomLoading, 'get', 'json', false, true);
	};
	
	UP.Services.AjaxPostCall = function (fullUrl, dataObj, callbackFunction, beforeSendCustomLoading, completeCustomLoading) {
		return ajaxCall(fullUrl, dataObj, callbackFunction, beforeSendCustomLoading, completeCustomLoading, 'post', 'json', false);
	};
	
	UP.Services.AjaxGetCall = function (fullUrl, dataObj, callbackFunction, beforeSendCustomLoading, completeCustomLoading) {
		return ajaxCall(fullUrl, dataObj, callbackFunction, beforeSendCustomLoading, completeCustomLoading, 'get', 'json', false);
	};
	
	UP.Services.AjaxPostMultipartForm = function (fullUrl, dataObj, callbackFunction, beforeSendCustomLoading, completeCustomLoading) {
		return ajaxCall(fullUrl, dataObj, callbackFunction, beforeSendCustomLoading, completeCustomLoading, 'post', 'json', true);
	};

	function silentAjaxCall (fullUrl, dataObj, callbackFunction, type, dataType) {
		$.ajax({
			url: fullUrl,
			cache: false,
			data: dataObj,
			dataType: dataType,
			type: type,
			success: function (response) {
				if (typeof callbackFunction === 'function') {
					callbackFunction(response);
				}
			}
		});
	}

	UP.Services.silentAjaxPostCall = function (fullUrl, dataObj, callbackFunction) {
		return silentAjaxCall(fullUrl, dataObj, callbackFunction,'post', 'json');
	};
	
})();
