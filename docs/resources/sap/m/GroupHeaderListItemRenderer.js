/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/library","sap/ui/core/Renderer","./ListItemBaseRenderer","./ColumnListItemRenderer"],function(e,t,r,n){"use strict";var a=e.TextDirection;var i=t.extend(r);i.apiVersion=2;i.renderType=function(e,t){var a=t.getTable()?n:r;a.renderType.apply(this,arguments)};i.renderNavigated=function(e,t){var a=t.getTable()?n:r;a.renderNavigated.apply(this,arguments)};i.renderContentLatter=n.renderContentLatter;i.renderCounter=function(e,t){};i.renderLIAttributes=function(e,t){e.class("sapMGHLI");if(t.getUpperCase()){e.class("sapMGHLIUpperCase")}};i.renderLIContentWrapper=function(e,t){var n=t.getTable();if(n){e.openStart("td");e.class("sapMGHLICell");e.attr("colspan",n.getColSpan());e.openEnd()}r.renderLIContentWrapper.apply(this,arguments);if(n){e.close("td")}};i.renderLIContent=function(e,t){var r=t.getTitleTextDirection();e.openStart("span");e.class("sapMGHLITitle");if(r!=a.Inherit){e.attr("dir",r.toLowerCase())}e.openEnd();e.text(t.getTitle());e.close("span");var n=t.getCount()||t.getCounter();if(n){e.openStart("span");e.class("sapMGHLICounter");e.openEnd();e.text(" ("+n+")");e.close("span")}};i.addLegacyOutlineClass=function(e,t){var a=t.getTable()?n:r;a.addLegacyOutlineClass.apply(this,arguments)};i.getAriaRole=function(e){if(e.getTable()){return"row"}return r.getAriaRole.apply(this,arguments)};return i},true);