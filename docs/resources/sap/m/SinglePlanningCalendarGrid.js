/*!
 * OpenUI5
 * (c) Copyright 2009-2023 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./SinglePlanningCalendarUtilities","./library","sap/ui/unified/DateRange","sap/ui/core/Control","sap/ui/core/LocaleData","sap/ui/core/Locale","sap/ui/core/InvisibleText","sap/ui/core/format/DateFormat","sap/ui/core/format/TimezoneUtil","sap/ui/core/Core","sap/ui/core/date/UniversalDate","sap/ui/core/dnd/DragDropInfo","sap/ui/unified/library","sap/ui/unified/calendar/DatesRow","sap/ui/unified/calendar/CalendarDate","sap/ui/unified/calendar/CalendarUtils","sap/ui/unified/DateTypeRange","sap/ui/events/KeyCodes","./SinglePlanningCalendarGridRenderer","sap/ui/core/delegate/ItemNavigation","sap/ui/thirdparty/jquery","./PlanningCalendarLegend","sap/ui/core/InvisibleMessage","sap/ui/core/library","sap/ui/core/date/CalendarUtils","sap/ui/core/Configuration","sap/ui/core/date/UI5Date"],function(e,t,a,i,r,n,o,s,l,g,p,d,u,c,h,f,m,D,_,C,y,S,v,A,M,R,T){"use strict";var b=4.3125,H=3,P=2.125,I=1.5625,w=36e5/2,E=60*1e3,k=.4375,B=0,L=24,F=A.InvisibleMessageMode,N=A.CalendarType,O=t.SinglePlanningCalendarSelectionMode;var x=i.extend("sap.m.SinglePlanningCalendarGrid",{metadata:{library:"sap.m",properties:{startDate:{type:"object",group:"Data"},startHour:{type:"int",group:"Data",defaultValue:0},endHour:{type:"int",group:"Data",defaultValue:24},fullDay:{type:"boolean",group:"Data",defaultValue:true},enableAppointmentsDragAndDrop:{type:"boolean",group:"Misc",defaultValue:false},enableAppointmentsResize:{type:"boolean",group:"Misc",defaultValue:false},enableAppointmentsCreate:{type:"boolean",group:"Misc",defaultValue:false},scaleFactor:{type:"float",group:"Data",defaultValue:1},calendarWeekNumbering:{type:"sap.ui.core.date.CalendarWeekNumbering",group:"Appearance",defaultValue:null},dateSelectionMode:{type:"sap.m.SinglePlanningCalendarSelectionMode",group:"Behavior",defaultValue:O.SingleSelect}},aggregations:{appointments:{type:"sap.ui.unified.CalendarAppointment",multiple:true,singularName:"appointment",dnd:{draggable:true}},specialDates:{type:"sap.ui.unified.DateTypeRange",multiple:true,singularName:"specialDate"},_columnHeaders:{type:"sap.ui.unified.calendar.DatesRow",multiple:false,visibility:"hidden"},_intervalPlaceholders:{type:"sap.m.SinglePlanningCalendarGrid._internal.IntervalPlaceholder",multiple:true,visibility:"hidden",dnd:{droppable:true}},_blockersPlaceholders:{type:"sap.m.SinglePlanningCalendarGrid._internal.IntervalPlaceholder",multiple:true,visibility:"hidden",dnd:{droppable:true}},selectedDates:{type:"sap.ui.unified.DateRange",multiple:true,singularName:"selectedDate"}},dnd:true,associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"},legend:{type:"sap.m.PlanningCalendarLegend",multiple:false}},events:{appointmentSelect:{parameters:{appointment:{type:"sap.ui.unified.CalendarAppointment"},appointments:{type:"sap.ui.unified.CalendarAppointment[]"}}},appointmentDrop:{parameters:{appointment:{type:"sap.ui.unified.CalendarAppointment"},startDate:{type:"object"},endDate:{type:"object"},copy:{type:"boolean"}}},appointmentResize:{parameters:{appointment:{type:"sap.ui.unified.CalendarAppointment"},startDate:{type:"object"},endDate:{type:"object"}}},appointmentCreate:{parameters:{startDate:{type:"object"},endDate:{type:"object"}}},cellPress:{parameters:{startDate:{type:"object"},endDate:{type:"object"}}}}},renderer:_});x.prototype.init=function(){var e=T.getInstance(),t=new c(this.getId()+"-columnHeaders",{showDayNamesLine:false,showWeekNumbers:false,singleSelection:false,startDate:e,calendarWeekNumbering:this.getCalendarWeekNumbering()}).addStyleClass("sapMSinglePCColumnHeader"),a=(60-e.getSeconds())*1e3,i=this._getCoreLocaleData().getTimePattern("medium");t._setAriaRole("columnheader");this.setAggregation("_columnHeaders",t);this.setStartDate(e);this._setColumns(7);this._configureBlockersDragAndDrop();this._configureAppointmentsDragAndDrop();this._configureAppointmentsResize();this._configureAppointmentsCreate();this._oUnifiedRB=sap.ui.getCore().getLibraryResourceBundle("sap.ui.unified");this._oFormatStartEndInfoAria=s.getDateTimeInstance({pattern:"EEEE dd/MM/yyyy 'at' "+i});this._oFormatAriaFullDayCell=s.getDateTimeInstance({pattern:"EEEE dd/MM/yyyy"});this._oFormatYyyymmdd=s.getInstance({pattern:"yyyyMMdd",calendarType:N.Gregorian});this._sLegendId=undefined;setTimeout(this._updateRowHeaderAndNowMarker.bind(this),a)};x.prototype.exit=function(){if(this._oItemNavigation){this.removeDelegate(this._oItemNavigation);this._oItemNavigation.destroy();delete this._oItemNavigation}};x.prototype.onBeforeRendering=function(){var e=this._createAppointmentsMap(this.getAppointments()),t=this.getStartDate(),a=h.fromLocalJSDate(t),i=this._getColumns();this._oVisibleAppointments=this._calculateVisibleAppointments(e.appointments,this.getStartDate(),i);this._oAppointmentsToRender=this._calculateAppointmentsLevelsAndWidth(this._oVisibleAppointments);this._aVisibleBlockers=this._calculateVisibleBlockers(e.blockers,a,i);this._oBlockersToRender=this._calculateBlockersLevelsAndWidth(this._aVisibleBlockers);if(this._iOldColumns!==i||this._oOldStartDate!==t){this._createBlockersDndPlaceholders(t,i);this._createAppointmentsDndPlaceholders(t,i)}this._oInvisibleMessage=v.getInstance()};x.prototype.setCalendarWeekNumbering=function(e){this.setProperty("calendarWeekNumbering",e);var t=this.getAggregation("_columnHeaders");t.setCalendarWeekNumbering(e);return this};x.prototype.onmousedown=function(e){var t=e.target.classList;this._isResizeHandleBottomMouseDownTarget=t.contains("sapMSinglePCAppResizeHandleBottom");this._isResizeHandleTopMouseDownTarget=t.contains("sapMSinglePCAppResizeHandleTop")};x.prototype._isResizingPerformed=function(){return this._isResizeHandleBottomMouseDownTarget||this._isResizeHandleTopMouseDownTarget};x.prototype._configureBlockersDragAndDrop=function(){this.addDragDropConfig(new d({sourceAggregation:"appointments",targetAggregation:"_blockersPlaceholders",dragStart:function(e){if(!this.getEnableAppointmentsDragAndDrop()){e.preventDefault();return false}var t=function(){var e=y(".sapMSinglePCOverlay");setTimeout(function(){e.addClass("sapMSinglePCOverlayDragging")});y(document).one("dragend",function(){e.removeClass("sapMSinglePCOverlayDragging")})};t()}.bind(this),dragEnter:function(e){var t=e.getParameter("dragSession"),a=t.getDragControl(),i=t.getDropControl(),r=this.isAllDayAppointment(a.getStartDate(),a.getEndDate()),n=function(){var e=y(t.getIndicator()),n=a.$().outerHeight(),o=a.$().outerWidth(),s=i.$().closest(".sapMSinglePCBlockersColumns").get(0).getBoundingClientRect(),l=i.getDomRef().getBoundingClientRect(),g=l.left+o-(s.left+s.width);if(r){e.css("min-height",n);e.css("min-width",Math.min(o,o-g))}else{e.css("min-height",t.getDropControl().$().outerHeight());e.css("min-width",t.getDropControl().$().outerWidth())}};if(!t.getIndicator()){setTimeout(n,0)}else{n()}}.bind(this),drop:function(e){var t=e.getParameter("dragSession"),a=t.getDragControl(),i=t.getDropControl(),r=i.getDate().getJSDate(),n,o=e.getParameter("browserEvent"),s=o.metaKey||o.ctrlKey,l=this.isAllDayAppointment(a.getStartDate(),a.getEndDate());n=T.getInstance(r);if(l){n.setMilliseconds(a.getEndDate().getTime()-a.getStartDate().getTime())}this.$().find(".sapMSinglePCOverlay").removeClass("sapMSinglePCOverlayDragging");if(l&&a.getStartDate().getTime()===r.getTime()){return}this.fireAppointmentDrop({appointment:a,startDate:r,endDate:n,copy:s})}.bind(this)}))};x.prototype._configureAppointmentsDragAndDrop=function(){this.addDragDropConfig(new d({sourceAggregation:"appointments",targetAggregation:"_intervalPlaceholders",dragStart:function(e){if(!this.getEnableAppointmentsDragAndDrop()||this._isResizingPerformed()){e.preventDefault();return false}var t=function(){var e=y(".sapMSinglePCOverlay");setTimeout(function(){e.addClass("sapMSinglePCOverlayDragging")});y(document).one("dragend",function(){e.removeClass("sapMSinglePCOverlayDragging")})};t()}.bind(this),dragEnter:function(e){var t=e.getParameter("dragSession"),a=t.getDragControl(),i=t.getDropControl(),r=this.isAllDayAppointment(a.getStartDate(),a.getEndDate()),n=function(){var e=y(t.getIndicator()),n=a.$().outerHeight(),o=i.$().closest(".sapMSinglePCColumn").get(0).getBoundingClientRect(),s=t.getDropControl().getDomRef().getBoundingClientRect(),l=s.top+n-(o.top+o.height);if(r){e.css("min-height",2*t.getDropControl().$().outerHeight())}else{e.css("min-height",Math.min(n,n-l))}};if(!t.getIndicator()){setTimeout(n,0)}else{n()}}.bind(this),drop:function(e){var t=e.getParameter("dragSession"),a=t.getDragControl(),i=t.getDropControl(),r=i.getDate().getJSDate(),n,o=e.getParameter("browserEvent"),s=o.metaKey||o.ctrlKey,l=this.isAllDayAppointment(a.getStartDate(),a.getEndDate());n=T.getInstance(r);if(l){n.setHours(n.getHours()+1)}else{n.setMilliseconds(a.getEndDate().getTime()-a.getStartDate().getTime())}this.$().find(".sapMSinglePCOverlay").removeClass("sapMSinglePCOverlayDragging");if(!l&&a.getStartDate().getTime()===r.getTime()){return}this.fireAppointmentDrop({appointment:a,startDate:r,endDate:n,copy:s})}.bind(this)}))};x.prototype._configureAppointmentsResize=function(){var e=new d({sourceAggregation:"appointments",targetAggregation:"_intervalPlaceholders",dragStart:function(e){if(!this.getEnableAppointmentsResize()||!this._isResizingPerformed()){e.preventDefault();return}var t=e.getParameter("dragSession"),a=t.getDragControl(),i=e.getParameter("browserEvent")&&e.getParameter("browserEvent").target||null;a._sAppointmentPartSuffix=i&&i.id?i.id.replace(a.getId()+"-",""):"";var r=this.$().find(".sapMSinglePCOverlay"),n=y(t.getIndicator()),o=a.$();if(this._isResizeHandleBottomMouseDownTarget){t.setComplexData("bottomHandle","true")}if(this._isResizeHandleTopMouseDownTarget){t.setComplexData("topHandle","true")}n.addClass("sapUiDnDIndicatorHide");setTimeout(function(){r.addClass("sapMSinglePCOverlayDragging")},0);y(document).one("dragend",function(){var e=t.getComplexData("appointmentStartingBoundaries");r.removeClass("sapMSinglePCOverlayDragging");n.removeClass("sapUiDnDIndicatorHide");o.css({top:e.top,height:e.height,"z-index":"auto",opacity:1})});e.getParameter("browserEvent").dataTransfer.setDragImage(W(),0,0)}.bind(this),dragEnter:function(e){var t=e.getParameter("dragSession"),a=t.getDragControl().$().get(0),i=t.getDropControl().getDomRef(),r=t.getComplexData("appointmentStartingBoundaries"),n=function(){var e=y(t.getIndicator());e.addClass("sapUiDnDIndicatorHide")},o,s,l,g,p;if(!r){r={top:a.offsetTop,bottom:a.offsetTop+a.getBoundingClientRect().height,height:a.getBoundingClientRect().height};t.setComplexData("appointmentStartingBoundaries",r)}g=t.getData("bottomHandle")?r.top:r.bottom;o=Math.min(g,i.offsetTop);s=Math.max(g,i.offsetTop+i.getBoundingClientRect().height);l=s-o;p={top:o,height:l,"z-index":1,opacity:.8};t.getDragControl().$().css(p);if(!t.getIndicator()){setTimeout(n,0)}else{n()}},drop:function(e){var t=e.getParameter("dragSession"),a=t.getDragControl(),i=this.indexOfAggregation("_intervalPlaceholders",t.getDropControl()),r=t.getComplexData("appointmentStartingBoundaries"),n;n=this._calcResizeNewHoursAppPos(a.getStartDate(),a.getEndDate(),i,t.getComplexData("bottomHandle"));this.$().find(".sapMSinglePCOverlay").removeClass("sapMSinglePCOverlayDragging");y(t.getIndicator()).removeClass("sapUiDnDIndicatorHide");a.$().css({top:r.top,height:r.height,"z-index":"auto",opacity:1});if(a.getEndDate().getTime()===n.endDate.getTime()&&a.getStartDate().getTime()===n.startDate.getTime()){return}this.fireAppointmentResize({appointment:a,startDate:n.startDate,endDate:n.endDate});setTimeout(function(){this.invalidate()}.bind(this),0)}.bind(this)});this.addDragDropConfig(e)};x.prototype._configureAppointmentsCreate=function(){this.addDragDropConfig(new d({targetAggregation:"_intervalPlaceholders",dragStart:function(e){if(!this.getEnableAppointmentsCreate()){e.preventDefault();return}var t=e.getParameter("browserEvent");var a=this.$().find(".sapMSinglePCOverlay");setTimeout(function(){a.addClass("sapMSinglePCOverlayDragging")});y(document).one("dragend",function(){a.removeClass("sapMSinglePCOverlayDragging");y(".sapUiAppCreate").remove();y(".sapUiDnDDragging").removeClass("sapUiDnDDragging")});t.dataTransfer.setDragImage(W(),0,0);var i=e.getParameter("target"),r=R.getRTL(),n=i.getAggregation("_intervalPlaceholders"),o=n[0].getDomRef().getBoundingClientRect(),s=o.height,l=Math.floor((o.top-i.getDomRef().getBoundingClientRect().top)/s),g=e.getParameter("dragSession"),p=Math.floor(t.offsetY/s)-l,d,u;if(this._iColumns===1){d=p}else{var c=r?0:this.getDomRef().querySelector(".sapMSinglePCRowHeaders").getClientRects()[0].width,h=i._aGridCells[0].getClientRects()[0].width,f=Math.floor(Math.floor(t.offsetX-c)/h),m=n.length/this._iColumns;d=p+f*m}if(d<0){d=0}u=n[d].getDomRef().getBoundingClientRect();g.setComplexData("startingRectsDropArea",{top:Math.ceil(p*s),left:u.left});g.setComplexData("startingDropDate",n[d].getDate())}.bind(this),dragEnter:function(e){var t=e.getParameter("dragSession"),a=t.getDropControl(),i=a.getDomRef(),r=i.offsetHeight,n=i.offsetTop,o=n,s=i.getBoundingClientRect().left,l=s,g=a.$().parents(".sapMSinglePCColumn").get(0),p=y(".sapUiAppCreate");if(!p.get(0)){p=y("<div></div>").addClass("sapUiCalendarApp sapUiCalendarAppType01 sapUiAppCreate");p.appendTo(g)}y(".sapUiDnDDragging").removeClass("sapUiDnDDragging");if(!t.getComplexData("startingRectsDropArea")){t.setComplexData("startingRectsDropArea",{top:n,left:s});t.setComplexData("startingDropDate",a.getDate())}else{o=t.getComplexData("startingRectsDropArea").top;l=t.getComplexData("startingRectsDropArea").left}if(s!==l){e.preventDefault();return false}a.$().closest(".sapMSinglePCColumn").find(".sapMSinglePCAppointments").addClass("sapUiDnDDragging");p.css({top:Math.min(o,n)+2,height:Math.abs(o-n)+r-4,left:3,right:3,"z-index":2});t.setIndicatorConfig({display:"none"})},drop:function(e){var t=e.getParameter("dragSession"),a=t.getDropControl(),i=60/(this.getScaleFactor()*2)*60*1e3,r=t.getComplexData("startingDropDate").getTime(),n=a.getDate().getJSDate().getTime(),o=Math.min(r,n),s=Math.max(r,n)+i;this.fireAppointmentCreate({startDate:T.getInstance(o),endDate:T.getInstance(s)});y(".sapUiAppCreate").remove();y(".sapUiDnDDragging").removeClass("sapUiDnDDragging")}.bind(this)}))};x.prototype._calcResizeNewHoursAppPos=function(e,t,a,i){var r=60/(this.getScaleFactor()*2)*60*1e3,n=this.getAggregation("_intervalPlaceholders")[a].getDate().getTime(),o=n+r,s=i?e.getTime():t.getTime(),l=Math.min(s,n),g=Math.max(s,o);return{startDate:T.getInstance(l),endDate:T.getInstance(g)}};x.prototype._adjustAppointmentsHeightforCompact=function(e,t,a,i){var r,n,o,s,l,g,p,d,u=this._getRowHeight(),c=0,h=.125,f=.125,m=.0625,D=this.getScaleFactor(),_=2*D;if(this._oAppointmentsToRender[e]){this._oAppointmentsToRender[e].oAppointmentsList.getIterator().forEach(function(e){r=e.getData();n=this.getDomRef().querySelector("#"+r.getId()+"-"+i+"_"+c);o=r.getStartDate();s=r.getEndDate();p=t.getTime()>o.getTime();d=a.getTime()<s.getTime();l=p?0:this._calculateTopPosition(o);g=d?0:this._calculateBottomPosition(s);n.style["top"]=l+"rem";n.style["bottom"]=g+"rem";n.querySelector(".sapUiCalendarApp").style["minHeight"]=(u-(h+f+m)*D)/_+"rem";++c}.bind(this))}};x.prototype._adjustBlockersHeightforCompact=function(){var e=this._getBlockersToRender().iMaxlevel,t=(e+1)*this._getBlockerRowHeight(),a=this._getColumns()===1?t+k:t,i=this._getBlockerRowHeight();if(e>0){a=a+.1875}this.$().find(".sapMSinglePCBlockersColumns").css("height",a+"rem");this._oBlockersToRender.oBlockersList.getIterator().forEach(function(e){e.getData().$().css("top",i*e.level+.0625+"rem")})};x.prototype._adjustBlockersHeightforCozy=function(){var e=this._getBlockersToRender()&&this._getBlockersToRender().iMaxlevel,t;if(this._getColumns()===1){t=(e+1)*this._getBlockerRowHeight();this.$().find(".sapMSinglePCBlockersColumns").css("height",t+k+"rem")}};x.prototype._adjustRowHigth=function(){this.$().find(".sapMSinglePCRow").css("height",this._getRowHeight()+"rem")};x.prototype.onAfterRendering=function(){var e=this._getColumns(),t=this.getStartDate(),a=this._getRowHeight();if(a===H){for(var i=0;i<e;i++){var r=new h(t.getFullYear(),t.getMonth(),t.getDate()+i),n=this._getDateFormatter().format(r.toLocalJSDate()),o=new p(r.getYear(),r.getMonth(),r.getDate(),this._getVisibleStartHour()),s=new p(r.getYear(),r.getMonth(),r.getDate(),this._getVisibleEndHour(),59,59);this._adjustAppointmentsHeightforCompact(n,o,s,i)}this._adjustBlockersHeightforCompact()}else{this._adjustBlockersHeightforCozy()}this._adjustRowHigth();this._updateRowHeaderAndNowMarker();V.call(this)};x.prototype._appFocusHandler=function(e,t){var a=sap.ui.getCore().byId(e.target.id)||this._findSrcControl(e);if(a&&a.isA("sap.ui.unified.CalendarAppointment")){this.fireAppointmentSelect({appointment:undefined,appointments:this._toggleAppointmentSelection(undefined,true)});this._focusCellWithKeyboard(a,t);e.preventDefault()}};x.prototype._cellFocusHandler=function(e,t){var a=e.target,i=this._getDateFormatter(),r;if(a.classList.contains("sapMSinglePCRow")||a.classList.contains("sapMSinglePCBlockersColumn")){r=i.parse(a.getAttribute("data-sap-start-date"));if(this._isBorderReached(r,t)){this.fireEvent("borderReached",{startDate:r,next:t===D.ARROW_RIGHT,fullDay:a.classList.contains("sapMSinglePCBlockersColumn")})}}};x.prototype.onsapup=function(e){this._appFocusHandler(e,D.ARROW_UP)};x.prototype.onsapdown=function(e){this._appFocusHandler(e,D.ARROW_DOWN)};x.prototype.onsapright=function(e){this._appFocusHandler(e,D.ARROW_RIGHT);this._cellFocusHandler(e,D.ARROW_RIGHT)};x.prototype.onsapleft=function(e){this._appFocusHandler(e,D.ARROW_LEFT);this._cellFocusHandler(e,D.ARROW_LEFT)};x.prototype.setStartDate=function(e){this._oOldStartDate=this.getStartDate();this.getAggregation("_columnHeaders").setStartDate(e);return this.setProperty("startDate",e)};x.prototype.applyFocusInfo=function(e){var t=this._getVisibleBlockers(),a=this._getVisibleAppointments(),i=Object.keys(a),r,n,o;if(this._sSelectedAppointment){this._sSelectedAppointment.focus();return this}for(n=0;n<t.length;++n){if(t[n].getId()===e.id){t[n].focus();return this}}for(n=0;n<i.length;++n){r=a[i[n]];for(o=0;o<r.length;++o){if(r[o].getId()===e.id){r[o].focus();return this}}}return this};x.prototype.getSelectedAppointments=function(){return this.getAppointments().filter(function(e){return e.getSelected()})};x.prototype.setDateSelectionMode=function(e){this.setProperty("dateSelectionMode",e);return this};x.prototype._isMultiDatesSelectionHeaderAllowed=function(){return O.MultiSelect===this.getDateSelectionMode()};x.prototype._toggleAppointmentSelection=function(e,t){var a=[],i=e&&e.getDomRef(),r,n,o;if(t){r=this.getAppointments();for(o=0,n=r.length;o<n;o++){if((!e||r[o].getId()!==e.getId())&&r[o].getSelected()){r[o].setProperty("selected",false);a.push(r[o])}}}if(e){e.setProperty("selected",!e.getSelected());a.push(e);this._sSelectedAppointment=e.getSelected()&&i?e:undefined}else{this._sSelectedAppointment=undefined}return a};x.prototype._isBorderReached=function(e,t){var a=h.fromLocalJSDate(this.getStartDate()),i=new h(a.getYear(),a.getMonth(),a.getDate()+this._getColumns()-1),r=h.fromLocalJSDate(e),n=t===D.ARROW_LEFT&&r.isSame(a),o=t===D.ARROW_RIGHT&&r.isSame(i);return n||o};x.prototype._focusCellWithKeyboard=function(e,t){var a=this.isAllDayAppointment(e.getStartDate(),e.getEndDate()),i=this._getDateFormatter(),r=T.getInstance(e.getStartDate().getFullYear(),e.getStartDate().getMonth(),e.getStartDate().getDate(),e.getStartDate().getHours()),n=T.getInstance(this.getStartDate().getFullYear(),this.getStartDate().getMonth(),this.getStartDate().getDate(),this.getStartDate().getHours());if(r<n){r=n}if(this._isBorderReached(r,t)){this.fireEvent("borderReached",{startDate:r,next:t===D.ARROW_RIGHT,fullDay:a});return}switch(t){case D.ARROW_UP:if(!a){r.setHours(r.getHours()-1)}break;case D.ARROW_DOWN:if(!a){r.setHours(r.getHours()+1)}break;case D.ARROW_LEFT:r.setDate(r.getDate()-1);break;case D.ARROW_RIGHT:r.setDate(r.getDate()+1);break;default:}if(a&&t!==D.ARROW_DOWN){y("[data-sap-start-date='"+i.format(r)+"'].sapMSinglePCBlockersColumn").trigger("focus")}else{y("[data-sap-start-date='"+i.format(r)+"'].sapMSinglePCRow").trigger("focus")}};x.prototype.onmouseup=function(e){var t=O.MultiSelect===this.getDateSelectionMode();if(!t&&!(e.metaKey||e.ctrlKey)){this.removeAllSelectedDates()}this._bMultiDateSelect=true;this._fireSelectionEvent(e)};x.prototype.ontap=function(e){this._fireSelectionEvent(e)};x.prototype.removeAllSelectedDates=function(e){this.removeAllAggregation("selectedDates",true)};x.prototype.onkeyup=function(e){var t=O.MultiSelect===this.getDateSelectionMode();if((e.which===D.ARROW_LEFT||e.which===D.ARROW_RIGHT)&&e.shiftKey&&t){this._bMultiDateSelectWithArrow=true}else if(e.which===D.SPACE&&!e.shiftKey&&t){this._bMultiDateSelect=true}this._fireSelectionEvent(e);e.preventDefault()};x.prototype.onkeydown=function(e){var t=O.MultiSelect===this.getDateSelectionMode();if(e.which===D.SPACE||e.which===D.ENTER||e.which===D.ARROW_LEFT||e.which===D.ARROW_RIGHT){if(e.which===D.SPACE&&e.shiftKey&&t){this._bCurrentWeekSelection=true}this._fireSelectionEvent(e);var a=this._findSrcControl(e);if(a&&a.isA("sap.ui.unified.CalendarAppointment")){var i=a.getSelected()?"APPOINTMENT_SELECTED":"APPOINTMENT_UNSELECTED";this._oInvisibleMessage.announce(this._oUnifiedRB.getText(i),F.Polite)}e.preventDefault()}};x.prototype._findSrcControl=function(e){var t=e.target,a=t.parentElement,i;if(!a){return e.srcControl}else if(a.classList.contains("sapUiCalendarRowApps")){i=a.getAttribute("data-sap-ui-related")||a.id}else{i=t.getAttribute("data-sap-ui-related")||t.id}return this.getAppointments().find(function(e){return e.sId===i})};x.prototype._fireSelectionEvent=function(e){var t=this._findSrcControl(e),a=e.target;if(e.target.classList.contains("sapMSinglePCRow")||e.target.classList.contains("sapMSinglePCBlockersColumn")){this.fireEvent("cellPress",{startDate:this._getDateFormatter().parse(a.getAttribute("data-sap-start-date")),endDate:this._getDateFormatter().parse(a.getAttribute("data-sap-end-date"))});this.fireAppointmentSelect({appointment:undefined,appointments:this._toggleAppointmentSelection(undefined,true)})}else if(t&&t.isA("sap.ui.unified.CalendarAppointment")){if(a.parentElement&&a.parentElement.getAttribute("id")){var i=a.parentElement.getAttribute("id");var r=a.parentElement.getAttribute("data-sap-ui-related");var n=i.replace(r+"-","");t._setAppointmentPartSuffix(n)}this.fireAppointmentSelect({appointment:t,appointments:this._toggleAppointmentSelection(t,!(e.ctrlKey||e.metaKey))})}else{var o;if(!a.classList.contains("sapUiCalItem")){o=a.parentElement}else{o=a}if(!o.getAttribute("data-sap-day")){return}var s=this._oFormatYyyymmdd.parse(o.getAttribute("data-sap-day"));var l=new h(s.getFullYear(),s.getMonth(),s.getDate());this._handelMultiDateSelection(l,o);this.fireEvent("selectDate",{startDate:l})}};x.prototype._handelMultiDateSelection=function(e,t){if(this._bMultiDateSelect||this._bMultiDateSelectWithArrow){this._bMultiDateSelect=false;this._bMultiDateSelectWithArrow=false;this._toggleMarkCell(e,t)}else if(this._bCurrentWeekSelection&&this.getAggregation("selectedDates")){this._bCurrentWeekSelection=false;this._rangeSelection()}};x.prototype._rangeSelection=function(){var e=this.getAggregation("_columnHeaders")._oItemNavigation.aItemDomRefs;var t;var a;var i;var r;var n=false;for(r=0;r<e.length;r++){t=e[r];a=this._oFormatYyyymmdd.parse(t.getAttribute("data-sap-day"));i=new h(a.getFullYear(),a.getMonth(),a.getDate());if(!this._checkDateSelected(i)){n=true;break}}for(r=0;r<e.length;r++){t=e[r];a=this._oFormatYyyymmdd.parse(t.getAttribute("data-sap-day"));i=new h(a.getFullYear(),a.getMonth(),a.getDate());if(n&&this._checkDateSelected(i)){continue}this._toggleMarkCell(i)}};x.prototype._toggleMarkCell=function(e,t){var i=e.toUTCJSDate();if(!this._checkDateSelected(e)){if(t&&!t.classList.contains("sapUiCalItemSel")){t.classList.add("sapUiCalItemSel")}this.addAggregation("selectedDates",new a({startDate:i}))}else{var r=this.getAggregation("selectedDates");t&&t.classList.remove("sapUiCalItemSel");if(!r){return}for(var n=0;n<r.length;n++){var o=T.getInstance(Date.UTC(0,0,1));var s=r[n].getStartDate();o.setUTCFullYear(s.getFullYear(),s.getMonth(),s.getDate());if(o.getTime()===i.getTime()){this.removeAggregation("selectedDates",n);break}}}};x.prototype._checkDateSelected=function(e){var t=this.getAggregation("selectedDates");if(!t||t&&t.length===0){return false}var a=e.toUTCJSDate().getTime();var i=T.getInstance(Date.UTC(0,0,1));for(var r=0;r<t.length;r++){var n=t[r];var o=n.getStartDate();var s=f.MAX_MILLISECONDS;if(o){i.setUTCFullYear(o.getFullYear(),o.getMonth(),o.getDate());s=i.getTime()}var l=n.getEndDate();var g=-f.MAX_MILLISECONDS;if(l){i.setUTCFullYear(l.getFullYear(),l.getMonth(),l.getDate());g=i.getTime()}if(a===s&&!l||a>=s&&a<=g){return true}}return false};x.prototype._getVisibleStartHour=function(){return this.getFullDay()||!this.getStartHour()?B:this.getStartHour()};x.prototype._getVisibleEndHour=function(){return(this.getFullDay()||!this.getEndHour()?L:this.getEndHour())-1};x.prototype._isVisibleHour=function(e){var t=this.getStartHour(),a=this.getEndHour();if(!this.getStartHour()){t=B}if(!this.getEndHour()){a=L}if(t>a){return t<=e||e<a}return t<=e&&e<a};x.prototype._shouldHideRowHeader=function(e){var t=T.getInstance().getHours(),a=f._areCurrentMinutesLessThan(15)&&t===e,i=f._areCurrentMinutesMoreThan(45)&&t===e-1;return a||i};x.prototype._parseDateStringAndHours=function(e,t){var a=this._getDateFormatter().parse(e);if(t){a.setHours(t)}return a};x.prototype._getDateFormatter=function(){if(!(this._oDateFormat instanceof s)){this._oDateFormat=s.getDateTimeInstance({pattern:"yyyyMMdd-HHmm"})}return this._oDateFormat};x.prototype._formatTimeAsString=function(e){var t=this._getHoursPattern()+":mm",a=s.getTimeInstance({pattern:t},new n(this._getCoreLocaleId()));return a.format(e)};x.prototype._addAMPM=function(e){var t=this._getAMPMFormat();return" "+t.format(e)};x.prototype._calculateTopPosition=function(e){var t=e.getHours()-this._getVisibleStartHour(),a=e.getMinutes(),i=this._getRowHeight();return i*t+i/60*a};x.prototype._calculateBottomPosition=function(e){var t=this._getVisibleEndHour()+1-e.getHours(),a=e.getMinutes(),i=this._getRowHeight();return i*t-i/60*a};x.prototype._updateRowHeaderAndNowMarker=function(){var e=T.getInstance();this._updateNowMarker(e);this._updateRowHeaders(e);setTimeout(this._updateRowHeaderAndNowMarker.bind(this),E)};x.prototype._updateNowMarker=function(e){var t=this.$("nowMarker"),a=this.$("nowMarkerText"),i=this.$("nowMarkerAMPM"),r=!this._isVisibleHour(e.getHours()),n=T.getInstance(e.getTime());t.toggleClass("sapMSinglePCNowMarkerHidden",r);t.css("top",this._calculateTopPosition(n)+"rem");a.text(this._formatTimeAsString(e));i.text(this._addAMPM(e));a.append(i)};x.prototype._updateRowHeaders=function(e){var t=this.$(),a=e.getHours(),i=a+1;t.find(".sapMSinglePCRowHeader").removeClass("sapMSinglePCRowHeaderHidden");if(this._shouldHideRowHeader(a)){t.find(".sapMSinglePCRowHeader"+a).addClass("sapMSinglePCRowHeaderHidden")}else if(this._shouldHideRowHeader(i)){t.find(".sapMSinglePCRowHeader"+i).addClass("sapMSinglePCRowHeaderHidden")}};x.prototype._createAppointmentsMap=function(e){var t=this;return e.reduce(function(e,a){var i=a.getStartDate(),r=a.getEndDate(),n,o,s;if(!i||!r){return e}if(!t.isAllDayAppointment(i,r)){n=h.fromLocalJSDate(i);o=h.fromLocalJSDate(r);while(n.isSameOrBefore(o)){s=t._getDateFormatter().format(n.toLocalJSDate());if(!e.appointments[s]){e.appointments[s]=[]}e.appointments[s].push(a);n.setDate(n.getDate()+1)}}else{e.blockers.push(a)}return e},{appointments:{},blockers:[]})};x.prototype._calculateVisibleAppointments=function(e,t,a){var i={},r,n,o;for(var s=0;s<a;s++){r=new h(t.getFullYear(),t.getMonth(),t.getDate()+s);n=this._getDateFormatter().format(r.toLocalJSDate());o=this._isAppointmentFitInVisibleHours(r);if(e[n]){i[n]=e[n].filter(o,this).sort(this._sortAppointmentsByStartHourCallBack)}}return i};x.prototype._isAppointmentFitInVisibleHours=function(e){return function(t){var a=t.getStartDate().getTime(),i=t.getEndDate().getTime(),r=new p(e.getYear(),e.getMonth(),e.getDate(),this._getVisibleStartHour()).getTime(),n=new p(e.getYear(),e.getMonth(),e.getDate(),this._getVisibleEndHour(),59,59).getTime();var o=a<r&&i>n,s=a>=r&&a<n,l=i>r&&i<=n;return o||s||l}};x.prototype._calculateAppointmentsLevelsAndWidth=function(t){var a=w-(this.getScaleFactor()-1)*5*60*1e3;var i=this;return Object.keys(t).reduce(function(r,n){var o=0,s=new e.list,l=t[n];l.forEach(function(t){var i=new e.node(t),r=t.getStartDate().getTime();if(s.getSize()===0){s.add(i);return}s.getIterator().forEach(function(e){var t=true,n=e.getData(),s=n.getStartDate().getTime(),l=n.getEndDate().getTime(),g=l-s;if(g<a){l=l+(a-g)}if(r>=s&&r<l){i.level++;o=Math.max(o,i.level)}if(e.next&&e.next.level===i.level){t=false}if(r>=l&&t){this.interrupt()}});s.insertAfterLevel(i.level,i)});r[n]={oAppointmentsList:i._calculateAppointmentsWidth(s),iMaxLevel:o};return r},{})};x.prototype._calculateAppointmentsWidth=function(t){t.getIterator().forEach(function(a){var i=a.getData(),r=a.level,n=a.level,o=i.getStartDate().getTime(),s=i.getEndDate().getTime(),l=s-o;if(l<w){s=s+(w-l)}new e.iterator(t).forEach(function(e){var t=e.getData(),i=e.level,l=t.getStartDate().getTime(),g=t.getEndDate().getTime(),p=g-l;if(p<w){g=g+(w-p)}if(n>=i){return}if(o>=l&&o<g||s>l&&s<g||o<=l&&s>=g){a.width=i-n;this.interrupt();return}if(r<i){r=i;a.width++}})});return t};x.prototype._calculateVisibleBlockers=function(e,t,a){var i=new h(t.getYear(),t.getMonth(),t.getDate()+a-1),r=this._isBlockerVisible(t,i);return e.filter(r).sort(this._sortAppointmentsByStartHourCallBack)};x.prototype._isBlockerVisible=function(e,t){return function(a){var i=h.fromLocalJSDate(a.getStartDate()),r=h.fromLocalJSDate(a.getEndDate());var n=i.isBefore(e)&&r.isAfter(t),o=f._isBetween(i,e,t,true),s=f._isBetween(r,e,t,true);return n||o||s}};x.prototype._calculateBlockersLevelsAndWidth=function(t){var a=0,i=new e.list;t.forEach(function(t){var r=new e.node(t),n=h.fromLocalJSDate(t.getStartDate()),o=h.fromLocalJSDate(t.getEndDate());r.width=f._daysBetween(o,n);if(i.getSize()===0){i.add(r);return}i.getIterator().forEach(function(e){var t=true,i=e.getData(),o=h.fromLocalJSDate(i.getStartDate()),s=h.fromLocalJSDate(i.getEndDate());if(n.isSameOrAfter(o)&&n.isSameOrBefore(s)){r.level++;a=Math.max(a,r.level)}if(e.next&&e.next.level===r.level){t=false}if(n.isSameOrAfter(s)&&t){this.interrupt()}});i.insertAfterLevel(r.level,r)},this);return{oBlockersList:i,iMaxlevel:a}};x.prototype._sortAppointmentsByStartHourCallBack=function(e,t){return e.getStartDate().getTime()-t.getStartDate().getTime()||t.getEndDate().getTime()-e.getEndDate().getTime()};x.prototype._getVisibleAppointments=function(){return this._oVisibleAppointments};x.prototype._getAppointmentsToRender=function(){return this._oAppointmentsToRender};x.prototype._getVisibleBlockers=function(){return this._aVisibleBlockers};x.prototype._getBlockersToRender=function(){return this._oBlockersToRender};x.prototype._setColumns=function(e){this._iOldColumns=this._iColumns;this._iColumns=e;this.getAggregation("_columnHeaders").setDays(e);this.invalidate();return this};x.prototype._getColumns=function(){return this._iColumns};x.prototype._getRowHeight=function(){return this._isCompact()?H*this.getScaleFactor():b*this.getScaleFactor()};x.prototype._getBlockerRowHeight=function(){return this._isCompact()?I:P};x.prototype._isCompact=function(){var e=this.getDomRef();while(e&&e.classList){if(e.classList.contains("sapUiSizeCompact")){return true}e=e.parentNode}return false};x.prototype._getCoreLocaleId=function(){if(!this._sLocale){this._sLocale=R.getFormatSettings().getFormatLocale().toString()}return this._sLocale};x.prototype._getCoreLocaleData=function(){var e,t;if(!this._oLocaleData){e=this._getCoreLocaleId();t=new n(e);this._oLocaleData=r.getInstance(t)}return this._oLocaleData};x.prototype._hasAMPM=function(){var e=this._getCoreLocaleData();return e.getTimePattern("short").search("a")>=0};x.prototype._getHoursFormat=function(){var e=this._getCoreLocaleId();if(!this._oHoursFormat||this._oHoursFormat.oLocale.toString()!==e){var t=new n(e),a=this._getHoursPattern();this._oHoursFormat=s.getTimeInstance({pattern:a},t)}return this._oHoursFormat};x.prototype._getHoursPattern=function(){return this._hasAMPM()?"h":"H"};x.prototype._getAMPMFormat=function(){var e=this._getCoreLocaleId(),t=new n(e);if(!this._oAMPMFormat||this._oAMPMFormat.oLocale.toString()!==e){this._oAMPMFormat=s.getTimeInstance({pattern:"a"},t)}return this._oAMPMFormat};x.prototype._getColumnHeaders=function(){return this.getAggregation("_columnHeaders")};x.prototype._getAppointmentAnnouncementInfo=function(e){var t=this._oUnifiedRB.getText("CALENDAR_START_TIME"),a=this._oUnifiedRB.getText("CALENDAR_END_TIME"),i=this._oFormatStartEndInfoAria.format(e.getStartDate()),r=this._oFormatStartEndInfoAria.format(e.getEndDate()),n=t+": "+i+"; "+a+": "+r;return n+"; "+S.findLegendItemForItem(sap.ui.getCore().byId(this._sLegendId),e)};x.prototype.enhanceAccessibilityState=function(e,t){if(e.getId()===this._getColumnHeaders().getId()){t.labelledby=o.getStaticId("sap.m","PLANNINGCALENDAR_DAYS")}};x.prototype._getCellStartEndInfo=function(e,t){var a=this._oUnifiedRB.getText("CALENDAR_START_TIME"),i=this._oUnifiedRB.getText("CALENDAR_END_TIME"),r=!t;if(r){return a+": "+this._oFormatAriaFullDayCell.format(e)+"; "}return a+": "+this._oFormatStartEndInfoAria.format(e)+"; "+i+": "+this._oFormatStartEndInfoAria.format(t)};x.prototype.isAllDayAppointment=function(e,t){return f._isMidnight(e)&&f._isMidnight(t)};x.prototype._createBlockersDndPlaceholders=function(e,t){this.destroyAggregation("_blockersPlaceholders");for(var a=0;a<t;a++){var i=new p(e.getFullYear(),e.getMonth(),e.getDate()+a);var r=new U({date:i});this.addAggregation("_blockersPlaceholders",r,true)}};x.prototype._createAppointmentsMatrix=function(e,t){var a=new h(e.getFullYear(),e.getMonth(),e.getDate()+t);var i=this._getVisibleStartHour(),r=this._getVisibleEndHour();if(!this._dndPlaceholdersMap[a]){this._dndPlaceholdersMap[a]=[]}for(var n=i;n<=r;n++){var o=this._dndPlaceholdersMap[a],s=a.getYear(),l=a.getMonth(),g=a.getDate(),d=this.getScaleFactor()*2,u=60/d*60;for(var c=0;c<d;c++){o.push(this._createAppointmentsDndPlaceHolder(new p(s,l,g,n,0,u*c)))}}};x.prototype._createAppointmentsDndPlaceholders=function(e,t){var a=R.getRTL(),i;this._dndPlaceholdersMap={};this.destroyAggregation("_intervalPlaceholders");if(a){for(i=t-1;i>=0;i--){this._createAppointmentsMatrix(e,i)}}else{for(i=0;i<t;i++){this._createAppointmentsMatrix(e,i)}}};x.prototype._createAppointmentsDndPlaceHolder=function(e){var t=new U({date:e});this.addAggregation("_intervalPlaceholders",t,true);return t};x.prototype._getSpecialDates=function(){var e=this.getSpecialDates();for(var t=0;t<e.length;t++){var a=e[t].getSecondaryType()===u.CalendarDayType.NonWorking&&e[t].getType()!==u.CalendarDayType.NonWorking;if(a){var i=new m;i.setType(u.CalendarDayType.NonWorking);i.setStartDate(e[t].getStartDate());if(e[t].getEndDate()){i.setEndDate(e[t].getEndDate())}e.push(i)}}return e};function W(){var e=y("<span></span>").addClass("sapUiCalAppResizeGhost");e.appendTo(document.body);setTimeout(function(){e.remove()},0);return e.get(0)}var U=i.extend("sap.m.SinglePlanningCalendarGrid._internal.IntervalPlaceholder",{metadata:{library:"sap.m",properties:{date:{type:"object",group:"Data"}}},renderer:{apiVersion:2,render:function(e,t){e.openStart("div",t).class("sapMSinglePCPlaceholder").openEnd().close("div")}}});function V(){var e=this.getDomRef(),t=this.$().find(".sapMSinglePCBlockersColumn").toArray();this._aGridCells=Array.prototype.concat(t);for(var a=0;a<=this._getVisibleEndHour();++a){t=this.$().find("div[data-sap-hour='"+a+"']").toArray();this._aGridCells=this._aGridCells.concat(t)}if(!this._oItemNavigation){this._oItemNavigation=new C;this.addDelegate(this._oItemNavigation)}this._oItemNavigation.setRootDomRef(e);this._oItemNavigation.setItemDomRefs(this._aGridCells);this._oItemNavigation.setCycling(false);this._oItemNavigation.setDisabledModifiers({sapnext:["alt","meta"],sapprevious:["alt","meta"],saphome:["alt","meta"],sapend:["meta"]});this._oItemNavigation.setTableMode(true,true).setColumns(this._getColumns());this._oItemNavigation.setPageSize(this._aGridCells.length)}return x});