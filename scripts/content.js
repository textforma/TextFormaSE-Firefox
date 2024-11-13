(function(global) {
	global.port = chrome.runtime.connect();
	global.port.postMessage({ 'type': 'storage', 'url': location.href });
	global.port.onMessage.addListener(function(message) {
		if (message.type == 'storage') {
			if (message.loop) {
				global.port.postMessage({ 'type': 'storage', 'url': location.href });
			} else {
				message.storage = JSON.parse(message.storage);
				global.regex['search'] = message.storage['search'].length > 0 ? new RegExp(message.storage['search'], 'i') : null;
				global.regex['conceal'] = message.storage['conceal'].length > 0 ? new RegExp(message.storage['conceal'], 'i') : null;
				global.regex['replace'] = message.storage['replace'].length > 0 ? new RegExp(message.storage['replace'], 'i') : null;
				if (message.storage['replacements'].length > 0) {
					var replacements = JSON.parse(message.storage['replacements']);
					for (var search in replacements) {
						global.replacements.push({ 'regex': new RegExp(search, 'gi'),  'replacement': replacements[search] });
					}
				}
				global.browser = message.browser;
				global.javascript = message.javascript;
				global.pseudo = (message.storage['pseudo']) == 'true';
				global.textbox = (message.storage['textbox']) == 'true';
				document.documentElement.style.display = 'none';
				if (global.regex['search'] != null) {
					textforma(global);
				} else {
					document.documentElement.style.display = 'block';
				}
			}
		}
	});
}({ 'regex': {}, 'replacements': [] }));
