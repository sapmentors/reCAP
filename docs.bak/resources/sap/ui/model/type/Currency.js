/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/Log","sap/ui/core/format/NumberFormat","sap/ui/model/CompositeType","sap/ui/model/FormatException","sap/ui/model/ParseException","sap/ui/model/ValidateException","sap/ui/thirdparty/jquery","sap/base/util/isEmptyObject"],function(t,e,r,o,i,a,n,s){"use strict";var u=r.extend("sap.ui.model.type.Currency",{constructor:function(){r.apply(this,arguments);this.sName="Currency";this.bUseRawValues=true}});u.prototype.formatValue=function(t,e){var r=t;if(t==undefined||t==null){return null}if(this.oInputFormat){r=this.oInputFormat.parse(t)}if(!Array.isArray(r)){throw new o("Cannot format currency: "+t+" has the wrong format")}if(r[0]==undefined||r[0]==null){return null}switch(this.getPrimitiveType(e)){case"string":return this.oOutputFormat.format(r);default:throw new o("Don't know how to format currency to "+e)}};u.prototype.parseValue=function(t,e){var r;switch(this.getPrimitiveType(e)){case"string":r=this.oOutputFormat.parse(t);if(!Array.isArray(r)||isNaN(r[0])){throw this._createInvalidUnitParseException()}break;default:throw new i("Don't know how to parse Currency from "+e)}if(this.oInputFormat){r=this.oInputFormat.format(r)}return r};u.prototype.validateValue=function(e){if(this.oConstraints){var r=sap.ui.getCore().getLibraryResourceBundle(),o=[],i=[],s=e,u;if(this.oInputFormat){s=this.oInputFormat.parse(e)}u=s[0];n.each(this.oConstraints,function(e,a){switch(e){case"minimum":if(u<a){o.push("minimum");i.push(r.getText("Currency.Minimum",[a]))}break;case"maximum":if(u>a){o.push("maximum");i.push(r.getText("Currency.Maximum",[a]))}break;default:t.warning("Unknown constraint '"+e+"': Value is not validated.",null,"sap.ui.model.type.Currency")}});if(o.length>0){throw new a(this.combineMessages(i),o)}}};u.prototype.setFormatOptions=function(t){this.oFormatOptions=t;this._createFormats()};u.prototype._handleLocalizationChange=function(){this._createFormats()};u.prototype._createFormats=function(){var t=this.oFormatOptions.source;this.oOutputFormat=e.getCurrencyInstance(this.oFormatOptions);if(t){if(s(t)){t={groupingEnabled:false,groupingSeparator:",",decimalSeparator:"."}}this.oInputFormat=e.getCurrencyInstance(t)}};u.prototype._createInvalidUnitParseException=function(){return new i(sap.ui.getCore().getLibraryResourceBundle().getText("Currency.Invalid"))};u.prototype.getPartsIgnoringMessages=function(){if(this.oFormatOptions.showMeasure===false){return[1]}return[]};return u});