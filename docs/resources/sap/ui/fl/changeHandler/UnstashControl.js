/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";var e={};e.applyChange=function(e,t,n){var a=e.getContent();var r=n.modifier;var i=false;e.setRevertData({originalValue:n.modifier.getStashed(t)});var o=r.setStashed(t,i,n.appComponent)||t;if(a.parentAggregationName){var g=a.parentAggregationName;var s=r.getParent(o);r.removeAggregation(s,g,o);r.insertAggregation(s,g,o,a.index,n.view)}return o};e.revertChange=function(e,t,n){var a=e.getRevertData();n.modifier.setStashed(t,a.originalValue);e.resetRevertData()};e.completeChangeContent=function(e,t){var n=e.getDefinition();if(t.content){n.content=t.content}};e.getCondenserInfo=function(e){return{affectedControl:e.getSelector(),classification:sap.ui.fl.condenser.Classification.Reverse,uniqueKey:"stashed"}};return e});