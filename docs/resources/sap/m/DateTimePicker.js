/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/thirdparty/jquery","./InputBase","./DatePicker","sap/ui/model/type/Date","sap/ui/unified/DateRange","./library","sap/ui/core/library","sap/ui/core/Control","sap/ui/Device","sap/ui/core/format/DateFormat","sap/ui/core/LocaleData","sap/ui/core/Core","sap/ui/core/format/TimezoneUtil","./TimePickerClocks","./DateTimePickerRenderer","./SegmentedButton","./SegmentedButtonItem","./ResponsivePopover","./Button","sap/ui/events/KeyCodes","sap/ui/core/IconPool","sap/ui/qunit/utils/waitForThemeApplied"],function(e,t,i,o,s,n,a,r,p,l,u,h,g,c,f,d,m,_,y,T,C,P){"use strict";var S=n.PlacementType,D=n.ButtonType,v="Phone",w=a.CalendarType;var k=i.extend("sap.m.DateTimePicker",{metadata:{library:"sap.m",properties:{minutesStep:{type:"int",group:"Misc",defaultValue:1},secondsStep:{type:"int",group:"Misc",defaultValue:1},showCurrentTimeButton:{type:"boolean",group:"Behavior",defaultValue:false},showTimezone:{type:"boolean",group:"Behavior"},timezone:{type:"string",group:"Data"}},designtime:"sap/m/designtime/DateTimePicker.designtime",dnd:{draggable:false,droppable:true}},constructor:function(e,t,o){var s;if(typeof e!=="string"&&e!==undefined){o=t;t=e;e=t&&t.id}s=t?Object.keys(t).sort(function(e,t){if(e==="timezone"){return-1}else if(t==="timezone"){return 1}return 0}).reduce(function(e,i){e[i]=t[i];return e},{}):t;i.call(this,e,s,o)}});var z={Short:"short",Medium:"medium",Long:"long",Full:"full"};var V=r.extend("sap.m.internal.DateTimePickerPopup",{metadata:{library:"sap.m",properties:{forcePhoneView:{type:"boolean",group:"Behavior",defaultValue:false}},aggregations:{_switcher:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"},calendar:{type:"sap.ui.core.Control",multiple:false},clocks:{type:"sap.ui.core.Control",multiple:false}}},renderer:{apiVersion:2,render:function(e,t){e.openStart("div",t);e.class("sapMDateTimePopupCont").class("sapMTimePickerDropDown");e.openEnd();var i=t.getAggregation("_switcher");if(i){e.openStart("div");e.class("sapMTimePickerSwitch");e.openEnd();e.renderControl(i);e.close("div")}var o=t.getCalendar();if(o){e.renderControl(o)}e.openStart("div");e.class("sapMTimePickerSep");e.openEnd();e.close("div");var s=t.getClocks();if(s){e.renderControl(s)}e.close("div")}},init:function(){},onBeforeRendering:function(){var t=this.getAggregation("_switcher");if(!t){var i=h.getLibraryResourceBundle("sap.m");var o=i.getText("DATETIMEPICKER_DATE");var s=i.getText("DATETIMEPICKER_TIME");t=new d(this.getId()+"-Switch",{selectedKey:"Cal",items:[new m(this.getId()+"-Switch-Cal",{key:"Cal",text:o}),new m(this.getId()+"-Switch-Clk",{key:"Clk",text:s})]});t.attachSelect(this._handleSelect,this);this.setAggregation("_switcher",t,true)}if(p.system.phone||e("html").hasClass("sapUiMedia-Std-Phone")||this.getForcePhoneView()){t.setVisible(true);t.setSelectedKey("Cal");this.getCalendar().addDelegate({onAfterRendering:function(){this._switchVisibility(t.getSelectedKey())}.bind(this)})}else{t.setVisible(false)}},_handleSelect:function(e){var t=e.getParameter("key");this._switchVisibility(t);if(t==="Clk"){this.getClocks()._focusActiveButton()}},_switchVisibility:function(e){var t=this.getCalendar(),i=this.getClocks();if(!t||!i){return}if(e==="Cal"){t.$().css("display","flex");i.$().css("display","none");t.getFocusDomRef()&&t.getFocusDomRef().focus()}else{t.$().css("display","none");i.$().css("display","")}},switchToTime:function(){var e=this.getAggregation("_switcher");if(e&&e.getVisible()){e.setSelectedKey("Clk");this._switchVisibility("Clk")}},getSpecialDates:function(){return this._oDateTimePicker.getSpecialDates()}});k.prototype.init=function(){i.prototype.init.apply(this,arguments);this._bOnlyCalendar=false};k.prototype.setValue=function(e){var t;i.prototype.setValue.apply(this,arguments);delete this._prefferedValue;if(!this.getDateValue()){t=this._fallbackParse(e);if(typeof t==="string"){this._bValid=true;this._prefferedValue=t;if(this.getDomRef()&&this._$input.val()!==t){this._$input.val(t);this._curpos=this._$input.cursorPos()}}}return this};k.prototype.setTimezone=function(e){var t,i,o;if(this.getTimezone()===e){return this}t=this.getDateValue()||this._parseValue(this.getValue(),false);i=this._formatValue(t,false);this.setProperty("timezone",e);this._oDisplayFormat=null;this._oValueFormat=null;this._oDisplayFormatWithTimezone=null;this._oValueFormatWithTimezone=null;if(this._oTimezonePopup){this._oTimezonePopup.setTitle(e)}o=this._parseValue(i,true);if(o){this.setProperty("dateValue",o);this.setProperty("value",this._formatValue(o,true))}return this};k.prototype.ontap=function(e){if(e.target.parentElement.classList.contains("sapMDTPTimezoneLabel")){this._togglePopoverOpen(this._getTimezoneNamePopup(),e.target);return}i.prototype.ontap.apply(this,arguments)};k.prototype.onAfterRendering=function(){if(this._getShowTimezone()){P().then(function(){var e=this.$().find(".sapMDummyContent"),t;if(!e||!e.length){return}t=e[0].getBoundingClientRect().width;this.$("inner").css("max-width",t+2+"px")}.bind(this))}};k.prototype.getIconSrc=function(){return C.getIconURI("date-time")};k.prototype.exit=function(){i.prototype.exit.apply(this,arguments);if(this._oClocks){this._oClocks.destroy();delete this._oClocks}this._oTimezonePopup=undefined;this._oPopupContent=undefined;p.media.detachHandler(this._handleWindowResize,this)};k.prototype.setDisplayFormat=function(e){this._oDisplayFormatWithTimezone=null;i.prototype.setDisplayFormat.apply(this,arguments);if(this._oClocks){this._oClocks.setValueFormat(M.call(this));this._oClocks.setDisplayFormat(M.call(this))}return this};k.prototype.setValueFormat=function(e){this._oValueFormatWithTimezone=null;return i.prototype.setValueFormat.apply(this,arguments)};k.prototype.setMinutesStep=function(e){this.setProperty("minutesStep",e,true);if(this._oClocks){this._oClocks.setMinutesStep(e)}return this};k.prototype._getDefaultValueStyle=function(){return z.Medium};k.prototype.setMinDate=function(e){i.prototype.setMinDate.call(this,e);if(e){this._oMinDate.setHours(e.getHours(),e.getMinutes(),e.getSeconds())}return this};k.prototype.setMaxDate=function(e){i.prototype.setMaxDate.call(this,e);if(e){this._oMaxDate.setHours(e.getHours(),e.getMinutes(),e.getSeconds())}return this};k.prototype.setSecondsStep=function(e){this.setProperty("secondsStep",e,true);if(this._oClocks){this._oClocks.setSecondsStep(e)}return this};k.prototype.setShowCurrentTimeButton=function(e){var t=this._oClocks;t&&t.setShowCurrentTimeButton(e);return this.setProperty("showCurrentTimeButton",e)};k.prototype._getTimezoneNamePopup=function(){var e;if(this._oTimezonePopup){this._oTimezonePopup.setTitle(this._getTimezone(true));return this._oTimezonePopup}this._oTimezonePopup=new _({showArrow:false,placement:S.VerticalPreferredBottom,offsetX:0,offsetY:3,horizontalScrolling:false,title:this._getTimezone(true)});this.addDependent(this._oTimezonePopup);if(p.system.phone){e=h.getLibraryResourceBundle("sap.m");this._oTimezonePopup.setEndButton(new y({text:e.getText("SUGGESTIONSPOPOVER_CLOSE_BUTTON"),type:D.Emphasized,press:function(){this._oTimezonePopup.close()}.bind(this)}))}return this._oTimezonePopup};k.prototype._togglePopoverOpen=function(e,t){if(e.isOpen()){e.close()}else{e.openBy(t||this.getDomRef())}};k.prototype._getFormatter=function(e){var t=this._getTimezoneFormatterCacheName(e);if(!this[t]){this[t]=l.getDateTimeWithTimezoneInstance(this._getTimezoneFormatOptions(e))}return this[t]};k.prototype._getBindingFormatOptions=function(){var t=this.getBinding("value")||this.getBinding("dateValue"),i;if(t){i=t.getType()}if(this._isSupportedBindingType(i)){return e.extend({},i.getFormatOptions())}};k.prototype._getTimezoneFormatOptions=function(e){var t=this._getBindingFormatOptions()||{},i=e?this.getDisplayFormat():this.getValueFormat(),o=this.getBinding("value")||this.getBinding("dateValue"),s=o&&o.getType&&o.getType();if(e||!this._getTimezone()||s&&!s.isA(["sap.ui.model.odata.type.DateTimeWithTimezone"])){t.showTimezone=false}if(t.relative===undefined){t.relative=false}if(t.calendarType===undefined){t.calendarType=e?this.getDisplayFormatType():w.Gregorian}if(t.strictParsing===undefined){t.strictParsing=true}if(i&&!this._isSupportedBindingType(s)){t[this._checkStyle(i)?"style":"pattern"]=i}return t};k.prototype._getTimezoneFormatterCacheName=function(e){return e?"_oDisplayFormatWithTimezone":"_oValueFormatWithTimezone"};k.prototype._getShowTimezone=function(){var e=this.getBinding("value")||this.getBinding("dateValue"),t=e&&e.getType();if(this.getShowTimezone()===undefined&&t&&t.isA(["sap.ui.model.odata.type.DateTimeWithTimezone"])){return t.getFormatOptions().showTimezone!==false}return this.getShowTimezone()};k.prototype._getTimezone=function(e){var t=this.getBinding("value")||this.getBinding("dateValue"),i=t&&t.getType();if(!this.getTimezone()&&i&&i.isA(["sap.ui.model.odata.type.DateTimeWithTimezone"])&&t.aValues[1]){return t.aValues[1]}return this.getTimezone()||e&&h.getConfiguration().getTimezone()};k.prototype._checkStyle=function(e){if(i.prototype._checkStyle.apply(this,arguments)){return true}else if(e.indexOf("/")>0){var t=[z.Short,z.Medium,z.Long,z.Long];var o=false;for(var s=0;s<t.length;s++){var n=t[s];for(var a=0;a<t.length;a++){var r=t[a];if(e==n+"/"+r){o=true;break}}if(o){break}}return o}return false};k.prototype._parseValue=function(e,t,i){var o=this.getBinding("value")||this.getBinding("dateValue"),s=o&&o.getType(),n;if(s&&s.isA(["sap.ui.model.odata.type.DateTimeWithTimezone"])){var a=o.getCurrentValues().slice(0);a[1]=i||this._getTimezone(true);return s.parseValue(e,"string",a)[0]}n=this._getFormatter(t).parse(e,i||this._getTimezone(true));if(!n||!n.length){return null}return n[0]};k.prototype._formatValue=function(e,t,i){if(!e){return""}return this._getFormatter(!t).format(e,i||this._getTimezone(true))};k.prototype._fallbackParse=function(e){return this._getFallbackParser().parse(e)?"":null};k.prototype._getFallbackParser=function(){if(!this._fallbackParser){this._fallbackParser=l.getDateTimeWithTimezoneInstance({showDate:false,showTime:false,showTimezone:true})}return this._fallbackParser};k.prototype._getPickerParser=function(){if(!this._clocksParser){this._clocksParser=l.getDateTimeWithTimezoneInstance({showTimezone:false})}return this._clocksParser};k.prototype._getLocaleBasedPattern=function(e){var t=u.getInstance(h.getConfiguration().getFormatSettings().getFormatLocale()),i=e.indexOf("/");if(i>0){return t.getCombinedDateTimePattern(e.substr(0,i),e.substr(i+1))}else{return t.getCombinedDateTimePattern(e,e)}};k.prototype._createPopup=function(){var e,t,i,o,s,n;if(!this._oPopup){i=h.getLibraryResourceBundle("sap.m");o=i.getText("TIMEPICKER_SET");s=i.getText("TIMEPICKER_CANCEL");this._oPopupContent=new V(this.getId()+"-PC");this._oPopupContent._oDateTimePicker=this;this._oOKButton=new y(this.getId()+"-OK",{text:o,type:D.Emphasized,press:b.bind(this)});var a=this._getValueStateHeader();this._oPopup=new _(this.getId()+"-RP",{showCloseButton:false,showHeader:false,placement:S.VerticalPreferedBottom,beginButton:this._oOKButton,content:[a,this._oPopupContent],afterOpen:F.bind(this),afterClose:A.bind(this)});a.setPopup(this._oPopup._oControl);if(p.system.phone){e=this.$("inner").attr("aria-labelledby");t=e?document.getElementById(e).getAttribute("aria-label"):"";this._oPopup.setTitle(t);this._oPopup.setShowHeader(true);this._oPopup.setShowCloseButton(true)}else{this._oPopup._getPopup().setDurations(0,0);this._oPopup.setEndButton(new y(this.getId()+"-Cancel",{text:s,press:B.bind(this)}))}this._oPopup.addStyleClass("sapMDateTimePopup");n=this._oPopup.getAggregation("_popup");if(n.setShowArrow){n.setShowArrow(false)}this.setAggregation("_popup",this._oPopup,true)}};k.prototype._openPopup=function(e){if(!this._oPopup){return}if(!e){e=this.getDomRef()}this.addStyleClass(t.ICON_PRESSED_CSS_CLASS);var i=this._oPopup.getAggregation("_popup");i.oPopup.setExtraContent([e]);this._oPopup.openBy(e||this)};k.prototype._createPopupContent=function(){var e=!this._oCalendar;i.prototype._createPopupContent.apply(this,arguments);if(e){this._oPopupContent.setCalendar(this._oCalendar);this._oCalendar.attachSelect(I,this)}if(!this._oClocks){this._oClocks=new c(this.getId()+"-Clocks",{minutesStep:this.getMinutesStep(),secondsStep:this.getSecondsStep(),valueFormat:M.call(this),displayFormat:M.call(this),localeId:this.getLocaleId(),showCurrentTimeButton:this.getShowCurrentTimeButton()});this._oPopupContent.setClocks(this._oClocks)}};k.prototype._attachAfterRenderingDelegate=function(){};k.prototype._selectFocusedDateValue=function(e){var t=this._oCalendar;t.removeAllSelectedDates();t.addSelectedDate(e);return this};k.prototype._fillDateRange=function(){var e=this.getDateValue(),t=true,i;if(e){e=new Date(e.getTime());this._oOKButton.setEnabled(true)}else{t=false;e=this.getInitialFocusedDateValue();if(!e){e=new Date;this._oCalendar.removeAllSelectedDates()}var o=this._oMaxDate.getTime();if(e.getTime()<this._oMinDate.getTime()||e.getTime()>o){e=this._oMinDate}this._oOKButton.setEnabled(false)}i=this._getPickerParser().format(e,this._getTimezone(true));e=this._getPickerParser().parse(i,g.getLocalTimezone())[0];this._oCalendar.focusDate(e);if(t){if(!this._oDateRange.getStartDate()||this._oDateRange.getStartDate().getTime()!=e.getTime()){this._oDateRange.setStartDate(e)}}this._oClocks._setTimeValues(e)};k.prototype._getSelectedDate=function(){var e=i.prototype._getSelectedDate.apply(this,arguments),t,o;if(e){t=this._oClocks.getTimeValues();o=this._oClocks._getDisplayFormatPattern();if(o.search("h")>=0||o.search("H")>=0){e.setHours(t.getHours())}if(o.search("m")>=0){e.setMinutes(t.getMinutes())}if(o.search("s")>=0){e.setSeconds(t.getSeconds())}if(e.getTime()<this._oMinDate.getTime()){e=new Date(this._oMinDate.getTime())}else if(e.getTime()>this._oMaxDate.getTime()){e=new Date(this._oMaxDate.getTime())}}return e};k.prototype.getLocaleId=function(){return h.getConfiguration().getFormatSettings().getFormatLocale().toString()};k.prototype.getAccessibilityInfo=function(){var e=i.prototype.getAccessibilityInfo.apply(this,arguments);e.type=h.getLibraryResourceBundle("sap.m").getText("ACC_CTR_TYPE_DATETIMEINPUT");return e};function b(e){this._handleCalendarSelect()}function B(e){this.onsaphide(e);if(!this.getDateValue()){this._oCalendar.removeAllSelectedDates()}}k.prototype._handleWindowResize=function(e){var t=this.getAggregation("_popup").getContent()[1].getAggregation("_switcher"),i=this.getAggregation("_popup").getContent()[1].getCalendar(),o=this.getAggregation("_popup").getContent()[1].getClocks();if(e.name===v){t.setVisible(true);this.getAggregation("_popup").getContent()[1]._switchVisibility(t.getSelectedKey())}else{t.setVisible(false);o.$().css("display","");i.$().css("display","flex")}};function F(e){this._oCalendar.focus();p.media.attachHandler(this._handleWindowResize,this);this.fireAfterValueHelpOpen()}function A(){this.removeStyleClass(t.ICON_PRESSED_CSS_CLASS);this._oCalendar._closePickers();p.media.detachHandler(this._handleWindowResize,this);this.fireAfterValueHelpClose()}function M(){var e=this.getDisplayFormat();var t;var i=this.getBinding("value");if(i&&i.oType&&i.oType instanceof o){e=i.oType.getOutputPattern()}else if(i&&i.oType&&i.oType.oFormat){e=i.oType.oFormat.oFormatOptions.pattern}else{e=this.getDisplayFormat()}if(!e){e=z.Medium}var s=e.indexOf("/");if(s>0&&this._checkStyle(e)){e=e.substr(s+1)}if(e==z.Short||e==z.Medium||e==z.Long||e==z.Full){var n=h.getConfiguration().getFormatSettings().getFormatLocale();var a=u.getInstance(n);t=a.getTimePattern(e)}else{t=e}return t}function I(e){this._oPopupContent.switchToTime();this._oPopupContent.getClocks()._focusActiveButton();this._oOKButton.setEnabled(true)}return k});