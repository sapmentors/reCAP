/*!
 * OpenUI5
 * (c) Copyright 2009-2023 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/EventProvider","sap/ui/core/routing/async/TargetCache","sap/ui/core/routing/sync/TargetCache","sap/base/assert","sap/base/Log"],function(e,t,n,o,r){"use strict";var i=e.extend("sap.ui.core.routing.TargetCache",{constructor:function(r){if(!r){r={}}this._oCache={view:{},component:{}};this._oComponent=r.component;if(this._oComponent){o(this._oComponent.isA("sap.ui.core.UIComponent"),this+" - the component passed to the constructor needs to be an instance of UIComponent")}e.apply(this,arguments);this.async=r.async;if(this.async===undefined){this.async=true}var i=this.async?t:n;for(var s in i){this[s]=i[s]}},metadata:{publicMethods:["get","set"]},get:function(e,t){var n;try{if(t==="Component"&&!this.async){r.error("sap.ui.core.routing.Target doesn't support loading component in synchronous mode, please switch routing to async");throw new Error("sap.ui.core.routing.Target doesn't support loading component in synchronous mode, please switch routing to async")}if(!e){r.error("the oOptions parameter of getObject is mandatory",this);throw new Error("the oOptions parameter of getObject is mandatory")}n=this._get(e,t)}catch(e){return Promise.reject(e)}if(n instanceof Promise){return n}else if(n.isA("sap.ui.core.mvc.View")){return n.loaded()}else{return Promise.resolve(n)}},fetch:function(e,t){return this._get(e,t,undefined,undefined,true)},set:function(e,t,n){var r;this._checkName(e,t);o(t==="View"||t==="Component","sType must be either 'View' or 'Component'");r=this._oCache[t.toLowerCase()][e];if(!r){r=this._oCache[t.toLowerCase()][e]={}}r[undefined]=n;return this},destroy:function(){e.prototype.destroy.apply(this);if(this.bIsDestroyed){return this}function t(e){if(e&&e.destroy&&!e._bIsBeingDestroyed){e.destroy()}}Object.keys(this._oCache).forEach(function(e){var n=this._oCache[e];Object.keys(n).forEach(function(e){var o=n[e];Object.keys(o).forEach(function(e){var n=o[e];if(n instanceof Promise){n.then(t)}else{t(n)}})})}.bind(this));this._oCache=undefined;this.bIsDestroyed=true;return this},attachCreated:function(e,t,n){return this.attachEvent("created",e,t,n)},detachCreated:function(e,t){return this.detachEvent("created",e,t)},fireCreated:function(e){return this.fireEvent("created",e)},_get:function(e,t,n,o,r){var i;switch(t){case"View":i=this._getView(e,n,r);break;case"Component":i=this._getComponent(e,n,o,r);break;default:throw Error("The given sType: "+t+" isn't supported by TargetCache.getObject")}return i},_getView:function(e,t,n){if(!t){e=this._createId(e)}return this._getViewWithGlobalId(e,false,n)},_getComponent:function(e,t,n,o){if(!t){e=this._createId(e)}return this._getComponentWithGlobalId(e,n,o)},_createId:function(e){if(this._oComponent&&e.id){e=Object.assign({},e,{id:this._oComponent.createId(e.id)})}return e},_checkName:function(e,t){if(!e){var n="A name for the "+t.toLowerCase()+" has to be defined";r.error(n,this);throw Error(n)}}});return i});