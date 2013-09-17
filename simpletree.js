/*jslint vars: true, white: true */
/*global jQuery */

(function($) {

"use strict";

function CollapsibleTree(list) {
	list = list.jquery ? list : $(list);
	list.addClass("tree").
		on("click", "span.toggle", this.onToggle).
		on("change", "input:checkbox",  this.onChange);
	$("li:has(ul)", list).prepend('<span class="button toggle">▾</a>');
}
CollapsibleTree.prototype.onToggle = function(ev) {
	var btn = $(this);
	var collapsed = btn.text() === "▸";
	var action = collapsed ? "slideDown" : "slideUp";
	btn.closest("li").children("ul")[action]();
	btn.text(collapsed ? "▾" : "▸");
	// TODO: unselect hidden items?
};
CollapsibleTree.prototype.onChange = function(ev) {
	var checkbox = $(this);
	var active = checkbox.prop("checked");
	checkbox.closest("li").find("input:checkbox").prop("checked", active);
};

$.fn.simpletree = function() {
	this.each(function(i, node) {
		new CollapsibleTree(node);
	});
	return this;
};

}(jQuery));
