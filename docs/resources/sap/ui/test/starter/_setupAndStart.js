/*!
 * OpenUI5
 * (c) Copyright 2009-2023 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/util/UriParameters","sap/base/util/fetch","./_utils"],function(e,t,n){"use strict";var i=Function.prototype.call.bind(Object.prototype.hasOwnProperty);function r(e){return Array.isArray(e)?e:[e]}function o(e){return new Promise(function(t,n){sap.ui.require(r(e),function(){t(Array.prototype.slice.call(arguments))},n)})}function u(e,t,n){if(t){for(var r in t){if(i(n,r)){e[r]=t[r]}}}return e}function a(){function e(e){if(document.body.querySelector("#"+e)==null){var t=document.createElement("div");t.id=e;document.body.insertBefore(t,document.body.firstChild)}}return n.whenDOMReady().then(function(){e("qunit");e("qunit-fixture")})}function s(e){var t=e.sourceFile+":"+e.lineNumber+":"+e.columnNumber,n="Security policy violation: directive '"+e.violatedDirective+"'";if(e.blockedURI){n+=" violated by '"+String(e.blockedURI).slice(0,20)+"'"}if(QUnit.config.current){QUnit.pushFailure(n,t)}else{throw new Error(n+" at "+t)}}var l={altertitle:1,collapse:1,filter:1,fixture:1,hidepassed:1,maxDepth:1,module:1,moduleId:1,notrycatch:1,noglobals:1,seed:1,reorder:1,requireExpects:1,testId:1,testTimeout:1,scrolltop:1};function c(e,t){var n=e.versions;var r=e.version||null;while(typeof r!=="object"){if(!i(n,r)){throw new TypeError("unsupported "+t+" version "+e.version)}r=n[r]}return r}function f(e){var i,r,f,d,p,h,v,g,m;document.title=e.title;if(e.loader){sap.ui.loader.config(e.loader)}if(e.runAfterLoader){i=o(e.runAfterLoader)}else{i=Promise.resolve()}g=c(e.qunit,"qunit");if(g!=null){window.QUnit=window.QUnit||{};QUnit.config=QUnit.config||{};if(e.qunit!=null&&typeof e.qunit==="object"){u(QUnit.config,e.qunit,l)}QUnit.config.autostart=false;r=i.then(function(){return o("sap/ui/test/qunitPause")}).then(function(){n.addStylesheet(g.css);return o(g.module)}).then(function(){m=[];QUnit.jUnitDone=function(e){m.push(e)};return o("sap/ui/qunit/qunit-junit")}).then(function(){delete QUnit.jUnitDone;return o("sap/ui/thirdparty/qunit-reporter-junit")}).then(function(){m.forEach(function(e){QUnit.jUnitDone(e)});m=undefined})}var b=c(e.sinon,"sinon");if(b!=null){f=i.then(function(){return o(b.module)});if(e.sinon.qunitBridge&&r){d=Promise.all([r,f]).then(function(){return o(b.bridge)})}if(e.sinon!=null&&typeof e.sinon==="object"){p=Promise.all([f,d]).then(function(){sinon.config=u(sinon.config||{},e.sinon,sinon.defaultConfig);return arguments})}}else if(g!=null){sap.ui.loader.config({shim:{"sap/ui/thirdparty/sinon-qunit":{deps:[g.module,"sap/ui/thirdparty/sinon"]},"sap/ui/qunit/sinon-qunit-bridge":{deps:[g.module,"sap/ui/thirdparty/sinon-4"]}}})}h=r.then(function(){if(QUnit.urlParams.coverage===undefined){return{}}if(e.coverage.instrumenter==="blanket"){return{instrumenter:"blanket"}}return t("/.ui5/coverage/ping").then(function(t){if(t.status>=400&&e.coverage.instrumenter!=="istanbul"){return{instrumenter:"blanket"}}else if(t.status>=400){return{instrumenter:null,error:"Istanbul is set as instrumenter, but there's no middleware"}}else{return{instrumenter:"istanbul"}}})}).then(function(e){if(!e.instrumenter){return e}if((QUnit.urlParams["coverage-mode"]||e.instrumenter==="blanket")&&QUnit.urlParams["coverage-mode"]!==e.instrumenter){var t=new URL(window.location.href);t.searchParams.set("coverage","true");t.searchParams.set("coverage-mode",e.instrumenter);window.location=t.toString()}return e}).then(function(t){if(t.instrumenter==="blanket"){return o("sap/ui/thirdparty/blanket").then(function(){if(e.coverage&&window.blanket){if(e.coverage.only!=null){window.blanket.options("sap-ui-cover-only",e.coverage.only)}if(e.coverage.never!=null){window.blanket.options("sap-ui-cover-never",e.coverage.never)}if(e.coverage.branchTracking){window.blanket.options("branchTracking",true)}}return o("sap/ui/qunit/qunit-coverage")}).then(function(){QUnit.config.autostart=false})}else if(t.instrumenter==="istanbul"){return o("sap/ui/qunit/qunit-coverage-istanbul").then(function(){var t=function(e){return Array.isArray(e)?JSON.stringify(e):e};if(e.coverage){var n=document.querySelector('script[src$="qunit/qunit-coverage-istanbul.js"]');if(n){if(e.coverage.only!=null){n.setAttribute("data-sap-ui-cover-only",t(e.coverage.only))}if(e.coverage.never!=null){n.setAttribute("data-sap-ui-cover-never",t(e.coverage.never))}}}})}else if(t.instrumenter===null&&t.error){QUnit.test("There's an error with the instrumentation setup or configuration",function(e){e.ok(false,t.error)})}}).then(function(){var e=QUnit.config.urlConfig.some(function(e){return e.id==="coverage"});if(!e){QUnit.config.urlConfig.push({id:"coverage",label:"Enable coverage",tooltip:"Enable code coverage."})}});h=h.then(function(){if(QUnit.urlParams["sap-ui-xx-csp-policy"]){document.addEventListener("securitypolicyviolation",s);QUnit.done(function(){document.removeEventListener("securitypolicyviolation",s)})}QUnit.config.urlConfig.push({id:"sap-ui-xx-csp-policy",label:"CSP",value:{"sap-target-level-1:report-only":"Level 1","sap-target-level-2:report-only":"Level 2"},tooltip:"What Content-Security-Policy should the server send"});if(QUnit.urlParams["rtf"]||QUnit.urlParams["repeat-to-failure"]){QUnit.done(function(e){if(e.failed===0){setTimeout(function(){location.reload()},100)}})}QUnit.config.urlConfig.push({id:"repeat-to-failure",label:"Repeat",value:false,tooltip:"Whether this test should auto-repeat until it fails"})});v=Promise.all([i,r,f,d,p,h]);if(e.beforeBootstrap){v=v.then(function(){return o(e.beforeBootstrap)})}window["sap-ui-config"]=e.ui5||{};if(Array.isArray(window["sap-ui-config"].libs)){window["sap-ui-config"].libs=window["sap-ui-config"].libs.join(",")}window["sap-ui-test-config"]=e.testConfig||{};if(e.bootCore){v=v.then(function(){return new Promise(function(e,t){sap.ui.require(["sap/ui/core/Core"],function(t){t.boot();t.attachInit(e)},t)})})}return v.then(function(){if(e.autostart){return o(e.module).then(function(e){return Promise.all(e)}).then(function(){return a()}).then(function(){if(e.ui5["xx-waitfortheme"]==="init"){return new Promise(function(e,t){sap.ui.require(["sap/ui/qunit/utils/waitForThemeApplied"],e,t)}).then(function(e){return e()})}}).then(function(){QUnit.start()})}else{return a().then(function(){return o(e.module).then(function(e){return Promise.all(e)})})}})}var d=e.fromQuery(window.location.search),p=n.getAttribute("data-sap-ui-testsuite")||d.get("testsuite"),h=n.getAttribute("data-sap-ui-test")||d.get("test");n.getSuiteConfig(p).then(function(e){var t=e.tests[h];if(!t){throw new TypeError("Invalid test name")}return f(t)}).catch(function(e){console.error(e.stack||e);if(typeof QUnit!=="undefined"){QUnit.test("Test Starter",function(){throw e});QUnit.start()}else{n.whenDOMReady().then(function(){document.body.style.color="red";document.body.innerHTML="<pre>"+n.encode(e.stack||e.message||String(e))+"</pre>"})}})});