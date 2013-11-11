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
		$(".toggle", list).each(function(i, node) {
			var btn = $(node);
			self.toggle(btn, ["show", "hide"]);
		});
	}

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
CollapsibleTree.prototype.toggle = function(btn, actions) {
	actions = actions || ["slideDown", "slideUp"];
	var collapsed = btn.text() === "▸";
	var action = collapsed ? actions[0] : actions[1];
	btn.closest("li").children("ul")[action]();
	btn.text(collapsed ? "▾" : "▸");
};

$.fn.simpletree = function(options) {
	this.each(function(i, node) {
		new CollapsibleTree(node, options);
	});
	return this;
};

}(jQuery));
