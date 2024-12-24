/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"z543_approvel/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
