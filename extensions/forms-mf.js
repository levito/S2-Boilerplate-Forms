// https://gist.github.com/Skateside/4071375
// - modified from selector to rule to allow for @media query check
// var supportsCssRule = (function() {
// 	var cache = {};
// 	return function (cssRule) {
// 		var supported = false;
// 		if (cache.hasOwnProperty(cssRule)) {
// 			supported = cache[cssRule];
// 		} else {
// 			var style = document.createElement("style");
// 			style.setAttribute("type", "text\/css");
// 			document.body.appendChild(style);
// 			if (style.styleSheet) {
// 				style.styleSheet.cssText = cssRule;
// 				var rules = style.styleSheet.rules;
// 				supported = !!(rules && rules[0] &&
// 					rules[0].cssRuleText &&
// 					rules[0].cssRuleText.toLowerCase &&
// 					rules[0].cssRuleText.toLowerCase().indexOf("unknown") < 0);
// 			} else {
// 				style.appendChild(document.createTextNode(cssRule));
// 				document.body.appendChild(style);
// 				supported = !!style.sheet.cssRules.length;
// 				document.body.removeChild(style);
// 			}
// 			cache[cssRule] = supported;
// 			document.body.removeChild(style);
// 			style = null;
// 		}
// 		return supported;
// 	};
// })();

// http://lea.verou.me/2009/02/check-if-a-css-property-is-supported/
// http://jsfiddle.net/leaverou/Pmn8m/
// IE fixed and modified from selector to rule to allow for @media query check
function supportsCssRule(rule) {
	var el = document.createElement("div");
	el.innerHTML = ["&shy;", "<style type='text/css'>", rule, "</style>"].join("");
	el = document.body.appendChild(el);
	var style = el.getElementsByTagName("style")[0],
		ret = !!((style.sheet && style.sheet.cssRules) || style.styleSheet.rules)[0];
	document.body.removeChild(el);
	el = null;
	return ret;
}


// :checked polyfill
if (!supportsCssRule(":checked{}")) {
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


// @media query simulation
if (!supportsCssRule("@media min-width:1px{a{}}")) {
	var oldBodyClass = document.body.className;
	var checkWindowWidth = function() {
		if (document.body.clientWidth > 800) {
			document.body.className = oldBodyClass + " gt480 gt800";
		} else if (document.body.clientWidth > 480) {
			document.body.className = oldBodyClass + " gt480";
		} else {
			document.body.className = oldBodyClass;
		}
	};
	checkWindowWidth();
	$(window).resize(checkWindowWidth);
}


// Placeholder polyfill
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
$(".formrow").each(function() {
	var $formrow = $(this);
	if (!$formrow.children(".label").length) {
		var required = false;
		var labels = $formrow.find(".label").map(function() {
			if (this.className.indexOf("req") > -1)
				required = true;
			return this.innerHTML;
		});
		$formrow.prepend(
			$("<label class='label" + (required ? ' req' : '') + "'/>")
			.attr("for", $formrow.find(".label:first").attr("for"))
			.html($.makeArray(labels).join(", "))
		);
	}
});


// jQuery Validate
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
	errorPlacement: function($err, $el) {
		$err.appendTo($el.closest(".formitem"));
	},
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


/**
 * Toggle label position - for demonstration
 */
$(".js_toggleLabelPosition").click(function() {
	$("fieldset").toggleClass("wideform");
});
