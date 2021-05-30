/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/performance/Measurement","sap/ui/performance/XHRInterceptor","sap/base/util/LoaderExtensions","sap/base/util/now","sap/base/util/uid","sap/base/Log","sap/ui/thirdparty/URI"],function(e,t,i,n,r,s,o){"use strict";var a=window.location.host,u="INTERACTION",p=false,d=[],f=m(),c={"application/zip":true,"application/vnd.rar":true,"application/gzip":true,"application/x-tar":true,"application/java-archive":true,"image/jpeg":true,"application/pdf":true},g="zip,rar,arj,z,gz,tar,lzh,cab,hqx,ace,jar,ear,war,jpg,jpeg,pdf,gzip";function l(e){var t=new o(e).host();return t&&t!==a}function h(e){var t=e.toString();var i="";for(var n=0;n<t.length;n+=2){i+=String.fromCharCode(parseInt(t.substr(n,2),16))}return i.trim()}function m(e){return{event:"startup",trigger:"undetermined",component:"undetermined",appVersion:"undetermined",start:e||window.performance.timing.fetchStart,end:0,navigation:0,roundtrip:0,processing:0,duration:0,requests:[],measurements:[],sapStatistics:[],requestTime:0,networkTime:0,bytesSent:0,bytesReceived:0,requestCompression:"X",busyDuration:0,id:r(),passportAction:"undetermined_startup_0"}}function y(e){if(e.start>f.start&&e.end<f.end){return e}}function v(e){var t=e.startTime>0&&e.startTime<=e.requestStart&&e.requestStart<=e.responseEnd;return t&&e.initiatorType==="xmlhttprequest"}function L(e){this.end=e.responseEnd>this.end?e.responseEnd:this.end;f.requestTime+=e.responseEnd-e.startTime;if(this.roundtripHigherLimit<=e.startTime){f.navigation+=this.navigationHigherLimit-this.navigationLowerLimit;f.roundtrip+=this.roundtripHigherLimit-this.roundtripLowerLimit;this.navigationLowerLimit=e.startTime;this.roundtripLowerLimit=e.startTime}if(e.responseEnd>this.roundtripHigherLimit){this.roundtripHigherLimit=e.responseEnd}if(e.requestStart>this.navigationHigherLimit){this.navigationHigherLimit=e.requestStart}}function S(e){var t={start:e[0].startTime,end:e[0].responseEnd,navigationLowerLimit:e[0].startTime,navigationHigherLimit:e[0].requestStart,roundtripLowerLimit:e[0].startTime,roundtripHigherLimit:e[0].responseEnd};e.forEach(L,t);f.navigation+=t.navigationHigherLimit-t.navigationLowerLimit;f.roundtrip+=t.roundtripHigherLimit-t.roundtripLowerLimit;if(f.networkTime){var i=f.requestTime-f.networkTime;f.networkTime=i/e.length}else{f.networkTime=0}if(f.processing===0){var n=f.start-window.performance.timing.fetchStart;f.duration=t.end-n;f.processing=t.start-n}}function b(t){if(f){var i=window.performance.getEntriesByType("resource");f.end=t;f.duration=f.processing;f.requests=i.filter(v);f.completeRoundtrips=0;f.measurements=e.filterMeasurements(y,true);if(f.requests.length>0){S(f.requests)}f.completeRoundtrips=f.requests.length;var n=f.processing-f.navigation-f.roundtrip;f.processing=n>-1?n:0;f.completed=true;Object.freeze(f);if(f.duration!==0||f.requests.length>0||p){d.push(f);var r=d[d.length-1];if(z.onInteractionFinished&&r){z.onInteractionFinished(r)}if(s.isLoggable()){s.debug("Interaction step finished: trigger: "+f.trigger+"; duration: "+f.duration+"; requests: "+f.requests.length,"Interaction.js")}}f=null;w=null;p=false}}function I(e){var t,i;if(e){var n,r;n=sap.ui.require("sap/ui/core/Component");while(n&&e&&e.getParent){r=n.getOwnerComponentFor(e);if(r||e instanceof n){r=r||e;var s=r.getManifestEntry("sap.app");t=s&&s.id||r.getMetadata().getName();i=s&&s.applicationVersion&&s.applicationVersion.version}e=e.getParent()}}return{id:t?t:"undetermined",version:i?i:""}}var T=false,E=false,w,q,H=false,R=false,A=0,_=0,C=Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype,"src");function D(){Object.defineProperty(HTMLScriptElement.prototype,"src",{set:function(e){var t;if(!this.dataset.sapUiCoreInteractionHandled){t=z.notifyAsyncStep();this.addEventListener("load",function(){t()});this.addEventListener("error",function(){t()});this.dataset.sapUiCoreInteractionHandled="true"}C.set.call(this,e)},get:C.get})}function j(){t.register(u,"send",function(){if(this.pendingInteraction){this.pendingInteraction.bytesSent+=arguments[0]?arguments[0].length:0}});t.register(u,"setRequestHeader",function(e,t){if(!this.requestHeaderLength){this.requestHeaderLength=0}this.requestHeaderLength+=(e+"").length+(t+"").length});t.register(u,"open",function(){var e,t,i;function n(e){if(this.readyState===4){e()}}if(f){if(!l(arguments[1])){e=z.passportHeader.get(this);if(e&&e.length>=370){t=h(e.substring(150,230));if(parseInt(e.substring(8,10),16)>2){i=e.substring(372,404)}}if(!e||t&&i&&f.passportAction.endsWith(t)){this.addEventListener("readystatechange",P.bind(this,f.id))}}this.addEventListener("readystatechange",n.bind(this,z.notifyAsyncStep()));this.pendingInteraction=f;this._ui5RequestUrl=arguments[1]||""}})}function N(e,t,i,n){var r=e.split(".").pop().split(/\#|\?/)[0];if(t==="gzip"||t==="br"||i in c||r&&g.indexOf(r)!==-1||n<1024){return true}else{return false}}function P(e){if(this.readyState===4){if(this.pendingInteraction&&!this.pendingInteraction.completed&&f.id===e){var t=this.getResponseHeader("content-length"),i=N(this.responseURL||this._ui5RequestUrl,this.getResponseHeader("content-encoding"),this.getResponseHeader("content-type"),t),n=this.getResponseHeader("sap-perf-fesrec");this.pendingInteraction.bytesReceived+=t?parseInt(t):0;this.pendingInteraction.bytesReceived+=this.getAllResponseHeaders().length;this.pendingInteraction.bytesSent+=this.requestHeaderLength||0;this.pendingInteraction.requestCompression=i&&this.pendingInteraction.requestCompression!==false;this.pendingInteraction.networkTime+=n?Math.round(parseFloat(n,10)/1e3):0;var r=this.getResponseHeader("sap-statistics");if(r){var s=window.performance.getEntriesByType("resource");this.pendingInteraction.sapStatistics.push({url:this.responseURL,statistics:r,timing:s?s[s.length-1]:undefined})}delete this.requestHeaderLength;delete this.pendingInteraction}}}var z={getAll:function(e){if(e){z.end(true)}return d},filter:function(e){var t=[];if(e){for(var i=0,n=d.length;i<n;i++){if(e(d[i])){t.push(d[i])}}}return t},getPending:function(){return f},clear:function(){d=[]},start:function(e,t){var i=n();if(f){b(i)}if(q){clearTimeout(q)}A=0;if(window.performance.clearResourceTimings){window.performance.clearResourceTimings()}var r=I(t);f=m(i);f.event=e;f.component=r.id;f.appVersion=r.version;f.start=i;if(t&&t.getId){f.trigger=t.getId()}if(s.isLoggable(null,"sap.ui.Performance")){console.time("INTERACTION: "+f.trigger+" - "+f.event)}if(s.isLoggable()){s.debug("Interaction step started: trigger: "+f.trigger+"; type: "+f.event,"Interaction.js")}},end:function(e){if(f){if(e){if(s.isLoggable(null,"sap.ui.Performance")){console.timeEnd("INTERACTION: "+f.trigger+" - "+f.event)}b(f.preliminaryEnd||n());if(s.isLoggable()){s.debug("Interaction ended...")}}else{f.preliminaryEnd=n();f.processing=f.preliminaryEnd-f.start}}},getActive:function(){return T},setActive:function(e){if(e&&!T){j();D();i.notifyResourceLoading=z.notifyAsyncStep}T=e},notifyNavigation:function(){p=true},notifyShowBusyIndicator:function(e){e._sapui_fesr_fDelayedStartTime=n()+e.getBusyIndicatorDelay()},notifyHideBusyIndicator:function(e){if(e._sapui_fesr_fDelayedStartTime){var t=n()-e._sapui_fesr_fDelayedStartTime;z.addBusyDuration(t>0?t:0);delete e._sapui_fesr_fDelayedStartTime}},notifyStepStart:function(e,t,i){if(T){if(!f&&w&&!E||i){var n;if(i){n="startup"}else{n=e}z.start(n,t);f=z.getPending();if(f&&!f.completed&&z.onInteractionStarted){f.passportAction=z.onInteractionStarted(f,i)}w=null;E=true;p=false;setTimeout(function(){w=null;E=false},0)}}},notifyAsyncStep:function(e){if(f){if(s.isLoggable(null,"sap.ui.Performance")&&e){console.time(e)}var t=f.id;z.notifyAsyncStepStart();return function(){z.notifyAsyncStepEnd(t);if(s.isLoggable(null,"sap.ui.Performance")&&e){console.timeEnd(e)}}}else{return function(){}}},notifyAsyncStepStart:function(){if(f){A++;clearTimeout(q);H=false;if(s.isLoggable()){s.debug("Interaction relevant step started - Number of pending steps: "+A)}}},notifyAsyncStepEnd:function(e){if(f&&e===f.id){A--;z.notifyStepEnd(true);if(s.isLoggable()){s.debug("Interaction relevant step stopped - Number of pending steps: "+A)}}},notifyStepEnd:function(e){if(T&&!R){if(A===0||!e){if(H||!e){z.end(true);if(s.isLoggable()){s.debug("Interaction stopped")}H=false}else{z.end();H=true;if(q){clearTimeout(q)}q=setTimeout(z.notifyStepEnd,250);if(s.isLoggable()){s.debug("Interaction check for idle time - Number of pending steps: "+A)}}}}},notifyEventStart:function(e){w=T?e:null},notifyScrollEvent:function(e){if(T){if(!_){z.notifyEventStart(e)}else{clearTimeout(_)}_=setTimeout(function(){z.notifyStepStart(e.sourceElement);_=0;z.notifyStepEnd()},250)}},notifyEventEnd:function(){if(w){if(w.type.match(/^(mousedown|touchstart|keydown)$/)){z.end(true)}}},onInteractionStarted:null,onInteractionFinished:null,setStepComponent:function(e){if(T&&f&&e&&!f.stepComponent){f.stepComponent=e}},addBusyDuration:function(e){if(T&&f){if(!f.busyDuration){f.busyDuration=0}f.busyDuration+=e}}};return z});