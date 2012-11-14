if ($.browser.msie && $.browser.version < 9) {
	// style new html5 input types
	// $("input").each(function() {
	// 	var $input = $(this);
	// 	if (this.type == "text" && $input.attr("type") != "text") {
	// 		// TODO: replace form fields by copies with type=text (IE8 doesn't allow styling of HTML5 form types)
	// 	}
	// });

	// CSS :checked simulation
	$(document).on("click", ":radio, :checkbox", function() {
		var $input = $(this);
		if ($input.is(":checked")) {
			if ($input.is(":radio")) {
				$("[name='" + $input.attr("name") + "']").removeClass("checked");
			}
			$input.addClass("checked");
		} else if ($input.is(":checkbox")) {
			$input.removeClass("checked");
		}
	});
}


/**
 * jQuery Tools Validator
 */
$.tools.validator.localize("de", {
	"[required]": "Bitte füllen Sie diese Feld aus."
});

$("form").validator({
	lang: "de",
	messageClass: "invalidmsg",
	position: "top right"
});


/**
 * jQuery Validate
 */
// $("form").validate({
// 	errorElement: "span"
// });
