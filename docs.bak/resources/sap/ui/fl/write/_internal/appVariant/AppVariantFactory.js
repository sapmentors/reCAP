/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/write/_internal/appVariant/AppVariant","sap/ui/thirdparty/jquery","sap/ui/fl/descriptorRelated/internal/Utils","sap/ui/fl/write/_internal/connectors/LrepConnector","sap/base/util/merge"],function(e,r,t,n,a){"use strict";function i(e){if(!e.url){e.url="/sap/bc/lrep"}return n.appVariant.load(e)}var s={};s.load=function(t){if(t.id===undefined||typeof t.id!=="string"){throw new Error("Parameter "+t.id+" must be provided of type string")}return i({reference:t.id}).then(function(n){var i=n.response;if(!r.isPlainObject(i)){i=JSON.parse(i)}t=a({},t,i);return new e(t)})};s.prepareCreate=function(r){try{t.checkParameterAndType(r,"reference","string");t.checkParameterAndType(r,"id","string");if(r.version){t.checkParameterAndType(r,"version","string")}if(!r.layer){r.layer="CUSTOMER"}else{t.checkParameterAndType(r,"layer","string")}if(r.skipIam){t.checkParameterAndType(r,"skipIam","boolean")}if(r.transport){t.checkTransportRequest(r.transport)}if(r.package){t.checkPackage(r.package)}}catch(e){return Promise.reject(e)}r.content=[];var n=new e(r);n.setMode("NEW");return Promise.resolve(n)};s.prepareUpdate=function(e){return s.load(e).then(function(e){e.setMode("EXISTING");return e})};s.prepareDelete=function(r){return(r.isForSmartBusiness?Promise.resolve(new e(r)):s.load(r)).then(function(e){e.setMode("DELETION");return e})};return s},true);