/*!
 * OpenUI5
 * (c) Copyright 2009-2023 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/util/reflection/JsControlTreeModifier"],function(e){"use strict";var t={};function r(e){return e.modifier.targets==="xmlTree"}t.applyChange=function(e,t,n){var o=n.modifier;var i=n.view;var a=n.appComponent;var l=e.getContent();if(r(n)){return Promise.reject(Error("Change cannot be applied in XML. Retrying in JS."))}var p=o.bySelector(l.elementSelector||l.sUnhideId,a,i);return Promise.resolve().then(function(){return o.getAggregation(t,"content")}).then(function(t){var r=-1;if(e.getChangeType()==="unhideSimpleFormField"){e.setRevertData(true);t.some(function(e,t){if(e===p){r=t;o.setVisible(e,true)}if(r>=0&&t>r){if(o.getControlType(e)==="sap.m.Label"||o.getControlType(e)==="sap.ui.comp.smartfield.SmartLabel"||o.getControlType(e)==="sap.ui.core.Title"||o.getControlType(e)==="sap.m.Title"||o.getControlType(e)==="sap.m.Toolbar"||o.getControlType(e)==="sap.m.OverflowToolbar"){return true}o.setVisible(e,true)}})}})};t.completeChangeContent=function(t,r,n){var o={};if(r.sUnhideId){var i=sap.ui.getCore().byId(r.sUnhideId);o.elementSelector=e.getSelector(i,n.appComponent);t.addDependentControl(i,"elementSelector",n)}else if(r.revealedElementId){var a=sap.ui.getCore().byId(r.revealedElementId||r.sUnhideId);var l=a.getLabel();o.elementSelector=e.getSelector(l,n.appComponent);t.addDependentControl(l,"elementSelector",n)}else{throw new Error("oSpecificChangeInfo.revealedElementId attribute required")}t.setContent(o)};t.revertChange=function(e,t,r){var n=r.modifier;var o=r.view;var i=r.appComponent;var a=e.getContent();var l=n.bySelector(a.elementSelector||a.sUnhideId,i,o);return Promise.resolve().then(function(){return n.getAggregation(t,"content")}).then(function(t){var r=-1;if(e.getChangeType()==="unhideSimpleFormField"){t.some(function(e,t){if(e===l){r=t;n.setVisible(e,false)}if(r>=0&&t>r){if(n.getControlType(e)==="sap.m.Label"||n.getControlType(e)==="sap.ui.comp.smartfield.SmartLabel"||n.getControlType(e)==="sap.ui.core.Title"||n.getControlType(e)==="sap.m.Title"||n.getControlType(e)==="sap.m.Toolbar"||n.getControlType(e)==="sap.m.OverflowToolbar"){return undefined}n.setVisible(e,false)}});e.resetRevertData()}return Promise.resolve()})};t.getChangeVisualizationInfo=function(t,r){return{affectedControls:[e.bySelector(t.getContent().elementSelector,r).getParent().getId()],updateRequired:true}};return t},true);