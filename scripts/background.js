var disableds = []; // scripts/denied.js

if (localStorage.length == 0) {
	chrome.storage.local.get(function(result) {
		localStorage['search'] = result['search'] !== undefined ? result['search'] : '';
		localStorage['conceal'] = result['conceal'] !== undefined ? result['conceal'] : '';
		localStorage['replace'] = result['replace'] !== undefined ? result['replace'] : '';
		localStorage['replacements'] = result['replacements'] !== undefined ? result['replacements'] : '';
		localStorage['pseudo'] = result['pseudo'] !== undefined ? result['pseudo'] : false;
		localStorage['textbox'] = result['textbox'] !== undefined ? result['textbox'] : true;
	});
}

chrome.runtime.onConnect.addListener(function(port) {
	port.onMessage.addListener(function(message) {
		if (message.type == 'observe') {
			if (/^loading$/i.test(message.state)) {
				port.postMessage({ 'type': 'observe', 'loop': true });
			} else {
				port.postMessage({ 'type': 'observe', 'loop': false });
			}
		} else if (message.type == 'storage') {
			if (localStorage.length > 0) {
				if (disableds.indexOf(message.url) == -1) {
					port.postMessage({ 'type': 'storage', 'loop': false, 'storage': JSON.stringify(localStorage), 'browser': 'chrome' });
				}
			} else {
				port.postMessage({ 'type': 'storage', 'loop': true });
			}
		} else if (message.type == 'deny') {
			chrome.tabs.query({ 'url': message.url }, function(tabs) {
				if (tabs.length > 0) {
					tabs.forEach(function(tab) {
						chrome.tabs.update(tab.id, { 'url': chrome.runtime.getURL('/html/denied.html') + '?url=' + encodeURIComponent(message.url) + '&title=' + encodeURIComponent(message.title) + '&search=' + encodeURIComponent(localStorage['search']) });
					});
				} else {
					chrome.tabs.update(tab.id, { 'url': chrome.runtime.getURL('/html/denied.html') + '?url=' + encodeURIComponent(message.url) + '&title=' + encodeURIComponent(message.title) + '&search=' + encodeURIComponent(localStorage['search']) });
				}
			});
		}		
	});
});

function getLocale() {
	var locale = chrome.i18n.getMessage('@@ui_locale');
	return /^(ja)$/i.test(locale) ? locale : 'ja'; // __LOCALE_BACKGROUND__
}

(function() {
	chrome.browserAction.setPopup({ 'popup': '/html/popup.html' });
}());

