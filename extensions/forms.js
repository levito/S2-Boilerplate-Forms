if ($.browser.msie && $.browser.version < 9) {
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
