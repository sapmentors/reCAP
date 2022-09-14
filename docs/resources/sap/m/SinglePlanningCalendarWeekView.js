/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./library","./SinglePlanningCalendarView","sap/ui/core/LocaleData","sap/ui/unified/calendar/CalendarDate","sap/ui/unified/calendar/CalendarUtils"],function(e,t,a,n,i){"use strict";var r=t.extend("sap.m.SinglePlanningCalendarWeekView",{metadata:{library:"sap.m"}});r.prototype.getEntityCount=function(){return 7};r.prototype.getScrollEntityCount=function(){return 7};r.prototype.calculateStartDate=function(e){var t=a.getInstance(sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale()),r=this.getFirstDayOfWeek(),o=r===-1?t.getFirstDayOfWeek():r;e.setDate(e.getDate()-e.getDay()+o);return i._getFirstDateOfWeek(n.fromLocalJSDate(e),{firstDayOfWeek:r,minimalDaysInFirstWeek:t.getMinimalDaysInFirstWeek()}).toLocalJSDate()};return r});