$(document).ready(function() {
	var elements = document.getElementsByClassName('translation');
	$('.translation').each(function() {
		$(this).text((chrome.i18n.getMessage($(this).text())));
	});

	chrome.runtime.getBackgroundPage(function(background) {
		var pseudo = (background.localStorage['pseudo'] !== undefined ? background.localStorage['pseudo'] : 'false') == 'true';
		var textbox = (background.localStorage['textbox'] !== undefined ? background.localStorage['textbox'] : 'true') == 'true';
		$('input[name="pseudo"]').attr('checked', pseudo);
		$('input[name=textbox]').attr('checked', textbox);
	});

	$(':checkbox').on('change', function() {
		var name = $(this).attr('name');
		var value = $(this).is(':checked');
		chrome.runtime.getBackgroundPage(function(background) {
			background.localStorage[name] = value;	
		});
	});
});







