/*!
 * OpenUI5
 * (c) Copyright 2009-2023 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./BarInPageEnabler","./ToolbarLayoutData","./ToolbarSpacer","./library","sap/ui/core/Control","sap/ui/core/EnabledPropagator","sap/ui/events/KeyCodes","./ToolbarRenderer","sap/ui/core/library"],function(t,e,o,n,r,i,a,s,p){"use strict";var l=n.ToolbarDesign,u=n.ToolbarStyle;var g=2;var c=r.extend("sap.m.Toolbar",{metadata:{interfaces:["sap.ui.core.Toolbar","sap.m.IBar"],library:"sap.m",properties:{width:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:null},active:{type:"boolean",group:"Behavior",defaultValue:false},enabled:{type:"boolean",group:"Behavior",defaultValue:true},height:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:""},design:{type:"sap.m.ToolbarDesign",group:"Appearance",defaultValue:l.Auto},style:{type:"sap.m.ToolbarStyle",group:"Appearance",defaultValue:u.Standard},ariaHasPopup:{type:"string",group:"Accessibility",defaultValue:null}},defaultAggregation:"content",aggregations:{content:{type:"sap.ui.core.Control",multiple:true,singularName:"content"}},associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},events:{press:{parameters:{srcControl:{type:"sap.ui.core.Control"}}}},designtime:"sap/m/designtime/Toolbar.designtime"},renderer:s});i.call(c.prototype);c.shrinkClass="sapMTBShrinkItem";c.isRelativeWidth=function(t){return/^([-+]?\d+%|auto|inherit|)$/i.test(t)};c.getOrigWidth=function(t){var e=sap.ui.getCore().byId(t);if(!e||!e.getWidth){return""}return e.getWidth()};c.checkShrinkable=function(t,n){if(t instanceof o){return this.isRelativeWidth(t.getWidth())}n=n||this.shrinkClass;t.removeStyleClass(n);var r=this.getOrigWidth(t.getId());if(!this.isRelativeWidth(r)){return}var i=t.getLayoutData();if(i instanceof e){return i.getShrinkable()&&t.addStyleClass(n)}if(r.indexOf("%")>0||t.getMetadata().isInstanceOf("sap.ui.core.IShrinkable")){return t.addStyleClass(n)}var a=t.getDomRef();if(a&&(a.firstChild||{}).nodeType==3){return t.addStyleClass(n)}};c.prototype._setEnableAccessibilty=function(t){var e=t?"true":"false",o=t?"toolbar":"none";this.data("sap-ui-fastnavgroup",e,t);this._setRootAccessibilityRole(o);return this};c.prototype.init=function(){this.data("sap-ui-fastnavgroup","true",true);this._oContentDelegate={onAfterRendering:this._onAfterContentRendering}};c.prototype.onAfterRendering=function(){this._checkContents()};c.prototype.onLayoutDataChange=function(){this.rerender()};c.prototype.addContent=function(t){this.addAggregation("content",t);this._onContentInserted(t);return this};c.prototype.insertContent=function(t,e){this.insertAggregation("content",t,e);this._onContentInserted(t);return this};c.prototype.removeContent=function(t){t=this.removeAggregation("content",t);this._onContentRemoved(t);return t};c.prototype.removeAllContent=function(){var t=this.removeAllAggregation("content")||[];t.forEach(this._onContentRemoved,this);return t};c.prototype.ontap=function(t){if(this.getActive()&&!t.isMarked()){t.setMarked();this.firePress({srcControl:t.srcControl})}};c.prototype.onsapenter=function(t){if(this.getActive()&&t.srcControl===this&&!t.isMarked()){t.setMarked();this.firePress({srcControl:this})}};c.prototype.onsapspace=function(t){if(t.srcControl===this){t.preventDefault()}};c.prototype.onkeyup=function(t){if(t.which===a.SPACE){this.onsapenter(t)}};c.prototype.ontouchstart=function(t){this.getActive()&&t.setMarked()};c.prototype._checkContents=function(){this.getContent().forEach(function(t){c.checkShrinkable(t)})};c.prototype._onContentInserted=function(t){if(t){t.attachEvent("_change",this._onContentPropertyChanged,this);t.addEventDelegate(this._oContentDelegate,t)}};c.prototype._onContentRemoved=function(t){if(t){t.detachEvent("_change",this._onContentPropertyChanged,this);t.removeEventDelegate(this._oContentDelegate,t)}};c.prototype._onAfterContentRendering=function(){var t=this.getLayoutData();if(t instanceof e){t.applyProperties()}};c.prototype._onContentPropertyChanged=function(t){var e=t.getParameter("name");if(e==="visible"){this.invalidate()}if(e!="width"){return}var o=t.getSource();var n=o.getWidth().indexOf("%")>0;o.toggleStyleClass(c.shrinkClass,n)};c.prototype._getAccessibilityRole=function(){var t=this._getRootAccessibilityRole(),e=t;if(this.getActive()){e="button"}else if(this._getToolbarInteractiveControlsCount()<g&&t==="toolbar"){e=""}return e};c.prototype._getToolbarInteractiveControlsCount=function(){return this.getContent().filter(function(t){return t.getVisible()&&t.isA("sap.m.IToolbarInteractiveControl")&&typeof t._getToolbarInteractive==="function"&&t._getToolbarInteractive()}).length};c.prototype.getAccessibilityInfo=function(){return{children:this.getContent()}};c.prototype.setDesign=function(t,e){if(!e){return this.setProperty("design",t)}this._sAutoDesign=this.validateProperty("design",t);return this};c.prototype.getActiveDesign=function(){var t=this.getDesign();if(t!=l.Auto){return t}return this._sAutoDesign||t};c.prototype.getTitleControl=function(){var t=sap.ui.require("sap/m/Title");if(!t){return}var e=this.getContent();for(var o=0;o<e.length;o++){var n=e[o];if(n instanceof t&&n.getVisible()){return n}}};c.prototype.getTitleId=function(){var t=this.getTitleControl();return t?t.getId():""};c.prototype.isContextSensitive=t.prototype.isContextSensitive;c.prototype.setHTMLTag=t.prototype.setHTMLTag;c.prototype.getHTMLTag=t.prototype.getHTMLTag;c.prototype.applyTagAndContextClassFor=t.prototype.applyTagAndContextClassFor;c.prototype._applyContextClassFor=t.prototype._applyContextClassFor;c.prototype._applyTag=t.prototype._applyTag;c.prototype._getContextOptions=t.prototype._getContextOptions;c.prototype._setRootAccessibilityRole=t.prototype._setRootAccessibilityRole;c.prototype._getRootAccessibilityRole=t.prototype._getRootAccessibilityRole;c.prototype._setRootAriaLevel=t.prototype._setRootAriaLevel;c.prototype._getRootAriaLevel=t.prototype._getRootAriaLevel;return c});