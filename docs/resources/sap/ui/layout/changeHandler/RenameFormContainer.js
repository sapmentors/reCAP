/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/changeHandler/Base","sap/base/Log"],function(e,t){"use strict";var r={};var n={TARGET_ALIAS:"target"};r.applyChange=function(e,r,i){var o=i.modifier,a=e.getDefinition(),s=e.getDependentControl(n.TARGET_ALIAS,i);return Promise.resolve().then(function(){return o.getAggregation(s,"title")}).then(function(r){if(a.texts&&a.texts.formText&&this._isProvided(a.texts.formText.value)){var n=a.texts.formText.value;var i;if(typeof r==="string"){i=Promise.resolve(o.getProperty(s,"title")).then(function(t){e.setRevertData(t);o.setProperty(s,"title",n)})}else{i=Promise.resolve(o.getProperty(r,"text")).then(function(t){e.setRevertData(t);o.setProperty(r,"text",n)})}return i}else{t.error("Change does not contain sufficient information to be applied: ["+a.layer+"]"+a.namespace+"/"+a.fileName+"."+a.fileType)}}.bind(this))};r.completeChangeContent=function(t,r,i){var o=t.getDefinition();if(!(r.renamedElement&&r.renamedElement.id)){throw new Error("Rename of the group cannot be executed: oSpecificChangeInfo.renamedElement attribute required")}if(!this._isProvided(r.value)){throw new Error("Rename of the group cannot be executed: oSpecificChangeInfo.value attribute required")}t.addDependentControl(r.renamedElement.id,n.TARGET_ALIAS,i);e.setTextInChange(o,"formText",r.value,"XGRP")};r.revertChange=function(e,t,r){var i=e.getRevertData(),o=r.modifier,a=e.getDependentControl(n.TARGET_ALIAS,r);return Promise.resolve().then(function(){return o.getAggregation(a,"title")}).then(function(t){if(typeof t==="string"){o.setProperty(a,"title",i)}else{o.setProperty(t,"text",i)}e.resetRevertData()})};r._isProvided=function(e){return typeof e==="string"};return r},true);