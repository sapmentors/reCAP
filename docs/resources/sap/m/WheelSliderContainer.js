/*!
 * OpenUI5
 * (c) Copyright 2009-2023 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/Device","sap/ui/base/EventProvider","sap/ui/core/Control","sap/ui/thirdparty/jquery","./WheelSliderContainerRenderer"],function(e,t,r,i,n){"use strict";var o=r.extend("sap.m.WheelSliderContainer",{metadata:{library:"sap.m",properties:{labelText:{type:"string"},width:{type:"sap.ui.core.CSSSize",group:"Appearance"},height:{type:"sap.ui.core.CSSSize",group:"Appearance"}},aggregations:{sliders:{type:"sap.m.WheelSlider",multiple:true}}},renderer:n});o.prototype.init=function(){this._fnLayoutChanged=i.proxy(this._onOrientationChanged,this);e.resize.attachHandler(this._fnLayoutChanged);this._onSliderExpanded=this._onSliderExpanded.bind(this)};o.prototype.exit=function(){this.$().off("selectstart",s);this.$().off(e.browser.firefox?"DOMMouseScroll":"mousewheel",this._onmousewheel);e.resize.detachHandler(this._fnOrientationChanged)};o.prototype.onAfterRendering=function(){this.$().off(e.browser.firefox?"DOMMouseScroll":"mousewheel",this._onmousewheel);this.$().on(e.browser.firefox?"DOMMouseScroll":"mousewheel",i.proxy(this._onmousewheel,this));this.$().off("selectstart",s);this.$().on("selectstart",s)};o.prototype.onsaphome=function(e){var t=this._getFirstSlider(),r=this._getCurrentSlider();if(r&&document.activeElement===r.getDomRef()){t.focus()}};o.prototype.onsapend=function(e){var t=this._getLastSlider(),r=this._getCurrentSlider();if(r&&document.activeElement===r.getDomRef()){t.focus()}};o.prototype.onsapleft=function(e){var t,r=this._getCurrentSlider(),i=-1,n=-1,o=this.getSliders();if(r&&document.activeElement===r.getDomRef()){i=o.indexOf(r);n=i>0?i-1:o.length-1;t=o[n];t.focus()}};o.prototype.onsapright=function(e){var t,r=this._getCurrentSlider(),i=-1,n=-1,o=this.getSliders();if(r&&document.activeElement===r.getDomRef()){i=o.indexOf(r);n=i<o.length-1?i+1:0;t=o[n];t.focus()}};o.prototype._onmousewheel=function(e){var t=this._getCurrentSlider();if(t){t._onMouseWheel(e)}};o.prototype._onOrientationChanged=function(){var e=this.getSliders();for(var t=0;t<e.length;t++){if(e[t].getIsExpanded()){e[t]._updateSelectionFrameLayout()}}};o.prototype._getCurrentSlider=function(){var e=this.getSliders();if(e){for(var t=0;t<e.length;t++){if(e[t].getIsExpanded()){return e[t]}}}return null};o.prototype._getFirstSlider=function(){return this.getSliders()[0]||null};o.prototype._getLastSlider=function(){var e=this.getSliders();return e[e.length-1]||null};o.prototype._onSliderExpanded=function(e){var t=this.getSliders();for(var r=0;r<t.length;r++){if(t[r]!==e.oSource&&t[r].getIsExpanded()){t[r].setIsExpanded(false)}}};o.prototype.addSlider=function(r){if(!e.system.desktop&&!t.hasListener(r,"expanded",this._onSliderExpanded,this)){r.attachExpanded(this._onSliderExpanded)}return this.addAggregation("sliders",r)};function s(){return false}return o});