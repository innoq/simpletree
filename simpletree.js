/*jslint vars: true, white: true */
/*global jQuery */

(function($) {

"use strict";

function CollapsibleTree(list, options) {
	options = options || {};
	var self = this;

	list = list.jquery ? list : $(list);
	list.addClass("tree").on("click", "span.toggle", function() {
		var context = { context: this, instance: self };
		return self.onToggle.apply(context, arguments);
	});
	if(!options.nocheck) {
		list.on("change", "input:checkbox",  this.onChange);
	}

	$("li:has(ul)", list).prepend('<span class="button toggle">▾</span>');
	if(options.collapsed) {
		var toggle = function(i, node) {
			var btn = $(node);
			self.toggle(btn, false);
		};
		$(".toggle", list).each(toggle);
		$("input:checked").parents("li").children(".toggle").each(toggle);
	}

	list.data("simpletree", this);
}
CollapsibleTree.prototype.onToggle = function(ev) {
	var btn = $(this.context);
	this.instance.toggle(btn);
	// TODO: unselect hidden items?
};
CollapsibleTree.prototype.onChange = function(ev) {
	var checkbox = $(this);
	var active = checkbox.prop("checked");
	checkbox.closest("li").find("input:checkbox").prop("checked", active);
};
// `btn` is a jQuery object referencing either a toggle button or the respective
// list item
// `animated` (optional) can be used to suppress animations
// `collapse` (optional) can be used to force a specific state
CollapsibleTree.prototype.toggle = function(btn, animated, collapse) {
	var item;
	if(btn.is("li")) {
		item = btn;
		btn = btn.children(".toggle");
	} else {
		item = btn.closest("li");
	}
	animated = animated === false ? false : true;
	var collapsed = collapse !== undefined ? !collapse : btn.text() === "▸";

	var actions = animated ? ["slideDown", "slideUp"] : ["show", "hide"];
	var action = collapsed ? actions[0] : actions[1];
	item.children("ul")[action]();
	btn.text(collapsed ? "▾" : "▸");
};

// jQuery API wrapper
$.fn.simpletree = function(options) {
	this.each(function(i, node) {
		new CollapsibleTree(node, options);
	});
	return this;
};

}(jQuery));
