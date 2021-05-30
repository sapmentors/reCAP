/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/CustomData"],function(){"use strict";var t={};t.appliedChangesCustomDataKey="sap.ui.fl.appliedChanges";t.failedChangesCustomDataKeyJs="sap.ui.fl.failedChanges.js";t.failedChangesCustomDataKeyXml="sap.ui.fl.failedChanges.xml";t.notApplicableChangesCustomDataKey="sap.ui.fl.notApplicableChanges";t.getAppliedCustomDataValue=function(a,s,u){var o=e(a,u,this._getCustomDataKey(s,t.appliedChangesCustomDataKey));return o.customDataValue};t.getParsedRevertDataFromCustomData=function(t,a,e){var s=this.getAppliedCustomDataValue(t,a,e);return s&&JSON.parse(s)};t.hasChangeApplyFinishedCustomData=function(a,e,s){var u=s.getAggregation(a,"customData")||[];var o=[this._getCustomDataKey(e,t.appliedChangesCustomDataKey),this._getCustomDataKey(e,t.failedChangesCustomDataKeyJs),this._getCustomDataKey(e,t.notApplicableChangesCustomDataKey)];return u.some(function(t){var a=s.getProperty(t,"key");if(o.indexOf(a)>-1){return!!s.getProperty(t,"value")}})};t.addAppliedCustomData=function(e,s,u,o){var i;var n=this._getCustomDataKey(s,t.appliedChangesCustomDataKey);if(o){i=JSON.stringify(s.getRevertData())}else{i="true"}a(e,n,i,u)};t.addFailedCustomData=function(t,e,s,u){var o=this._getCustomDataKey(e,u);a(t,o,"true",s)};t.destroyAppliedCustomData=function(a,s,u){var o=this._getCustomDataKey(s,t.appliedChangesCustomDataKey);var i=e(a,u,o);if(i.customData){u.destroy(i.customData)}};t.getCustomDataIdentifier=function(a,e,s){if(a){return t.appliedChangesCustomDataKey}if(!e){return t.notApplicableChangesCustomDataKey}if(s){return t.failedChangesCustomDataKeyXml}return t.failedChangesCustomDataKeyJs};t._getCustomDataKey=function(t,a){return a+"."+t.getId()};function a(t,a,s,u){var o=e(t,u.modifier,a);if(!o.customData){u.modifier.createAndAddCustomData(t,a,s,u.appComponent)}else{u.modifier.setProperty(o.customData,"value",s)}}function e(t,a,e){var s=a.getAggregation(t,"customData")||[];var u={};s.some(function(t){var s=a.getProperty(t,"key");if(s===e){u.customData=t;u.customDataValue=a.getProperty(t,"value");return true}});return u}return t},true);