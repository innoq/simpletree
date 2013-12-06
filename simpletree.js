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
// `btn` is a jQuery object referencing a toggle button
// `animated` is passed through to `setState`
CollapsibleTree.prototype.toggle = function(btn, animated) {
	var item = btn.closest("li");
	var state = btn.text() === "▸" ? "expanded" : "collapsed";
	this.setState(item, state, animated);
};
// `item` is a jQuery object referencing the respective list item
// `state` is either "collapsed" or "expanded"
// `animated` (optional) can be used to suppress animations
CollapsibleTree.prototype.setState = function(item, state, animated) {
	animated = animated === false ? false : true;
	var collapse = state === "collapsed";
	var action = animated ? ["slideUp", "slideDown"] : ["hide", "show"];
	action = collapse ? action[0] : action[1];
	item.children("ul")[action]();
	item.children(".toggle").text(collapse ? "▸" : "▾");
};

// jQuery API wrapper
$.fn.simpletree = function(options) {
	this.each(function(i, node) {
		new CollapsibleTree(node, options);
	});
	return this;
};

}(jQuery));
