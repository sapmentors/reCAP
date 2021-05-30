/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./_AggregationHelper","./_Cache"],function(e,t){"use strict";return{createCache:function(n,r,s,u){var i={},a,o=false,c,h;a=t.create(n,r,u,true);c=new Promise(function(e){h=e});a.getMeasureRangePromise=function(){return c};a.getResourcePathWithQuery=function(t,n){var r=e.buildApply(s,Object.assign({},this.mQueryOptions,{$skip:t,$top:n-t}),1,o,i);o=true;return this.sResourcePath+this.oRequestor.buildQueryString(this.sMetaPath,r,false,true)};a.handleResponse=function(e,t,n,r){var s,u={},a=n.value.shift();function o(e){u[e]=u[e]||{};return u[e]}n["@odata.count"]=a.UI5__count;for(s in i){o(i[s].measure)[i[s].method]=a[s]}h(u);delete this.handleResponse;this.handleResponse(e,t,n,r)};return a}}},false);