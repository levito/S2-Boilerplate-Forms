if ($.browser.msie && $.browser.version < 9) {
	// style new html5 input types
	// $("input").each(function() {
	// 	var $input = $(this);
	// 	if (this.type == "text" && $input.attr("type") != "text") {
	// 		// TODO: replace form fields by copies with type=text (IE8 doesn't allow styling of HTML5 form types)
	// 	}
	// });

	// CSS :checked simulation
	var checkedPolyfill = function() {
		var $input = $(this);
		if ($input.is(":checked")) {
			if ($input.is(":radio")) {
				$("[name='" + $input.attr("name") + "']").removeClass("checked");
			}
			$input.addClass("checked");
		} else if ($input.is(":checkbox")) {
			$input.removeClass("checked");
		}
	}
	$(document).on("click", ":radio, :checkbox", checkedPolyfill);
	$(":radio, :checkbox").each(checkedPolyfill);
}


/**
 * Placeholder polyfill
 */
if (!("placeholder" in document.createElement("input"))) {
	$("input[placeholder], textarea[placeholder]").each(function() {
		var $input = $(this);
		$input.data("placeholder", $input.attr("placeholder"));
		$input.removeAttr("placeholder");

		var $clone = $input.clone();
		if ($.browser.msie && $clone.attr("type") == "password") {
			$clone = $("<input type='text'/>");
			$clone.attr("class", $input.attr("class"));
			$clone.attr("size", $input.attr("size"));
		}
		$clone.data("placeholder", $input.data("placeholder"));
		$clone.attr("readonly", "readonly");
		$clone.val($input.data("placeholder"));
		$clone.removeAttr("name");
		$input.removeAttr("id");
		$clone.addClass("ignore placeholder");
		if (!!$clone.attr("type") && $clone.attr("type").toLowerCase() == "password") {
			$clone.attr("type", "text");
		}
		$clone.css("display", $input.css("display"));
		$input.data("placeholder-input", $clone);
		$clone.data("orig-input", $input);
		$clone.hide();
		$input.before($clone);

		if (this.value == "") {
			$input.hide();
			$clone.show();
		} else {
			$clone.hide();
			$input.show();
		}

		$clone.focus(function() {
			var $placeholder = $(this);
			var $input = $placeholder.data("orig-input");
			var placeholderValue = $placeholder.val();
			$placeholder.hide().val("").val(placeholderValue); // opera text selection fix
			$input.show().focus();
		});
		$input.blur(function() {
			if (this.value == "") {
				var $placeholder = $input.data("placeholder-input");
				$input.hide();
				$placeholder.show();
			}
		});
	});
}


/**
 * jQuery Validate
 */
$.validator.addMethod("pattern", function(value, element, param) {
	if (this.optional(element)) {
		return true;
	}
	if (typeof param === 'string') {
		param = new RegExp('^(?:' + param + ')$');
	}
	return param.test(value);
}, "Ungültiges Format.");

$("form").validate({
	rules: {
		passwordagain: {
			equalTo: "#password"
		}
	},
	messages: {
		zip: {
			pattern: "Bitte geben Sie eine gültige Postleitzahl an."
		}
	}
});
