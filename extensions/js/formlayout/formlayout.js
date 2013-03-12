// loosely based on jqueryUI uniqueId()
(function($, undefined) {
	var uuid = 0;
	$.fn.uuid = function() {
		return this.each(function() {
			this.id = this.id || ["uuid", (++uuid)].join("");
		});
	};
})(jQuery);


// http://lea.verou.me/2009/02/check-if-a-css-property-is-supported/
// http://jsfiddle.net/leaverou/Pmn8m/
// IE fixed and modified from selector to rule to allow for @media query check
//
// use Modernizr if available
// for IE8 support
//function supportsCssRule(rule) {
//	var el = document.createElement("div");
//	el.innerHTML = ["&shy;", "<style type='text/css'>", rule, "</style>"].join("");
//	el = document.body.appendChild(el);
//	var style = el.getElementsByTagName("style")[0],
//		ret = !!((style.sheet && style.sheet.cssRules) || style.styleSheet.rules)[0];
//	document.body.removeChild(el);
//	el = null;
//	return ret;
//}


// :checked polyfill
// for IE8 support
//if (!supportsCssRule(":checked{}")) {
//	var checkedPolyfill = function() {
//		var $input = $(this);
//		if ($input.is(":checked")) {
//			if ($input.is(":radio")) {
//				$("[name='" + $input.attr("name") + "']").removeClass("checked");
//			}
//			$input.addClass("checked");
//		} else if ($input.is(":checkbox")) {
//			$input.removeClass("checked");
//		}
//	};
//	$(document).on("click", ":radio, :checkbox", checkedPolyfill);
//	$(":radio, :checkbox").each(checkedPolyfill);
//}


// @media query simulation
// for IE8 support
//if (!supportsCssRule("@media only all{a{}}")) {
//	var oldBodyClass = document.body.className;
//	var checkWindowWidth = function() {
//		if (document.body.clientWidth > 800) {
//			document.body.className = oldBodyClass + " gt400 gt800";
//		} else if (document.body.clientWidth > 400) {
//			document.body.className = oldBodyClass + " gt400";
//		} else {
//			document.body.className = oldBodyClass;
//		}
//	};
//	checkWindowWidth();
//	$(window).resize(checkWindowWidth);
//}


// Placeholder polyfill
if (!("placeholder" in document.createElement("input"))) {
	$("input[placeholder], textarea[placeholder]").each(function() {
		var $input = $(this);
		$input.data("placeholder", $input.attr("placeholder"));
		$input.removeAttr("placeholder");

		var $clone = $input.clone();
		if ($clone.attr("type") == "password") {
			$clone = $("<input type='text'/>");
			$clone.attr("class", $input.attr("class"));
			$clone.attr("size", $input.attr("size"));
		}
		$clone.data("placeholder", $input.data("placeholder"));
		$clone.addClass("ignore placeholder");
		$clone.attr("readonly", "readonly");
		$clone.val($input.data("placeholder"));
		$clone.removeAttr("name");
		$input.removeAttr("id");
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

		$clone.on("focus", function() {
			var $placeholder = $(this);
			var $input = $placeholder.data("orig-input");
			$clone.hide();
			$input.show().focus();
		});
		$input.on("blur", function() {
			if (this.value == "") {
				var $placeholder = $input.data("placeholder-input");
				$input.hide();
				$placeholder.show();
			}
		});
	});
}


// create shared labels if not already given
$(".wideform").find(".formrow").each(function() {
	var $formrow = $(this);
	var $rowlabel = $formrow.children(".label");
	var uuid = $formrow.find(":input:first").uuid()[0].id;
	if (!$rowlabel.length) {
		var required = false;
		var labels = $.map($formrow.find(".label"), function(el) {
			if (el.className.indexOf("req") > -1)
				required = true;
			return el.innerHTML;
		}).join(", ");
		$formrow.prepend(
			$("<label class='label" + (required ? ' req' : '') + "'/>")
			.attr("for", uuid)
			.html(labels)
		);
	} else {
		if ($rowlabel.is("label"))
			$rowlabel.attr("for", uuid);
	}
});


// polyfill compatible reset, extended for validate
$("form").each(function() {
	var $form = $(this);
	$form.on("reset", function() {
		$form.find("input, textarea").each(function() {
			var $field = $(this);
			$field.removeClass("error checked");
			$("label.error").remove();
			if (typeof $field.data("orig-input") !== "undefined") {
				setTimeout(function() { // IE needs this
					$field.val($field.data("orig-input").data("placeholder"));
				});
			}
		});
	});
});


// jQuery Validate
$.validator.addMethod("pattern", function(val, el, param) {
	if (this.optional(el) || $(el).is(this.settings.ignore)) {
		return true;
	}
	if (typeof param === "string") {
		param = new RegExp("^(?:" + param + ")$");
	}
	return param.test(val);
}, "Ungültiges Format.");

$("form").validate({
	ignore: ".ignore",
	errorPlacement: function($err, $el) {
		$err.appendTo($el.closest(".formitem"));
	},
	// alternative error display behavior: hide on focus (e.g. when error messages cover inputs)
	// focusCleanup: true, // remove errorclass on focus
	// onkeyup: function(el, e) {
	// 	// remove error class on keyup, not on focus
	// 	$(el).removeClass("error");
	// 	// prevent validation on keyup (on blur is soon enough)
	// 	return false;
	// },
	rules: {
		passwordagain: {
			equalTo: "[name=password]"
		}
	},
	messages: {
		zip: {
			pattern: "Bitte geben Sie eine gültige Postleitzahl an."
		}
	}
});




// Toggle label position - for demonstration
$(".js_toggleLabelPosition").click(function() {
	$("fieldset").toggleClass("wideform");
});
