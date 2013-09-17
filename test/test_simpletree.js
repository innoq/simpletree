/*jslint vars: true, white: true */
/*global jQuery, QUnit */

(function($) {

"use strict";

var module = QUnit.module,
	test = QUnit.test,
	asyncTest = QUnit.asyncTest,
	expect = QUnit.expect,
	strictEqual = QUnit.strictEqual,
	deepEqual = QUnit.deepEqual,
	start = QUnit.start;

"use strict";

module("SimpleTree");

function setup(listSelector) {
	this.fixtures = $("#qunit-fixture");
	this.list = $(listSelector, this.fixtures);

	var itemsByName = {};
	this.items = $("li", this.list).each(function(i, node) {
		var item = $(node);
		var name = getText(item);
		itemsByName[name] = item;
	});
	this.itemsByName = itemsByName;

	this.list.simpletree();
}

test("initialization", function() {
	setup.call(this, "ul.hierarchy");

	// ensure root list has "tree" class
	strictEqual(this.list.hasClass("tree"), true);
	strictEqual(this.list.find(".tree").length, 0);

	// ensure toggles are only added to non-leaf nodes
	var toggles = $(".toggle", this.list);
	strictEqual(toggles.length, 2);
	var items = $.map(toggles, function(node) {
		var item = $(node).closest("li");
		return getText(item);
	});
	deepEqual(items, ["world", "bar"]);
});

test("multi-initialization", function() {
	var fixtures = $("#qunit-fixture");
	var lists = fixtures.children("ul");

	strictEqual(lists.length, 2);
	strictEqual(fixtures.find("ul.tree").length, 0);

	lists.simpletree();
	strictEqual(fixtures.find("ul.tree").length, 2);

	var toggles = $(".toggle", fixtures);
	strictEqual(toggles.length, 4);
});

asyncTest("collapsing", function() {
	expect(7);

	setup.call(this, "ul.hierarchy");

	var self = this;
	var items = this.items;
	var toggle = function(name) {
		return $(self.itemsByName[name]).children(".toggle");
	};

	strictEqual(items.filter(":visible").length, items.length);

	toggle("bar").click();

	var sequence = [function() {
		strictEqual(items.filter(":visible").length, items.length - 2);
		var hidden = $.map(items.filter(":not(:visible)"), getText);
		deepEqual(hidden, ["lorem", "ipsum"]);

		toggle("bar").click();
	}, function() {
		strictEqual(items.filter(":visible").length, items.length);

		toggle("world").click();
	}, function() {
		var visibles = items.filter(":visible");
		var visibleNames = $.map(visibles, getText);
		strictEqual(visibles.length, 2);
		deepEqual(visibleNames, ["hello", "world"]);

		toggle("world").click();
	}, function() {
		strictEqual(items.filter(":visible").length, items.length);
	}];

	serialize(sequence, 500);
});

test("checkbox auto-selection", function() {
	setup.call(this, "ul.selection");
	var checkboxes = $("input:checkbox", this.list);
	var checkboxesByName = {};
	$.each(this.itemsByName, function(name, item) {
		checkboxesByName[name] = item.find("> label > input:checkbox");
	});

	strictEqual(checkboxes.filter(":checked").length, 0);

	var checkedNames = function() {
		var checked = checkboxes.filter(":checked");
		return $.map(checked, function(node) {
			var item = $(node).closest("li");
			return getText(item);
		});
	}

	checkboxesByName["bar"].prop("checked", true).trigger("change");
	deepEqual(checkedNames(), ["bar", "lorem", "ipsum"]);

	checkboxesByName["hello"].prop("checked", true).trigger("change");
	deepEqual(checkedNames(), ["hello", "bar", "lorem", "ipsum"]);

	checkboxesByName["world"].prop("checked", true).trigger("change");
	var names = checkedNames();
	strictEqual(names.length, this.items.length);
	deepEqual(names, ["hello", "world", "foo", "bar", "lorem", "ipsum", "baz"]);

	checkboxesByName["world"].prop("checked", false).trigger("change");
	deepEqual(checkedNames(), ["hello"]);

	checkboxesByName["hello"].prop("checked", false).trigger("change");
	strictEqual(checkedNames().length, 0);
});

function serialize(sequence, delay) {
	var next = function() {
		var fn = sequence.shift();
		if(fn) {
			setTimeout(function() {
				fn();
				next();
			}, delay);
		} else {
			start();
		}
	};
	next();
}

function getText(el) {
	el = el.jquery ? el : $(el);

	// XXX: special-casing
	var label = el.children("label");
	if(label.length) {
		el = label;
	}

	return el.clone().children().remove().end().text().trim();
}

}(jQuery));
