/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/m/table/columnmenu/Entry","sap/m/library"],function(t,e){"use strict";var r=t.extend("sap.m.table.columnmenu.QuickActionBase",{metadata:{abstract:true,library:"sap.m"}});r.prototype.getEffectiveQuickActions=function(){return[this]};r.prototype.setVisible=function(t){if(this.getVisible()==t){return this}this.setProperty("visible",t);this.getMenu()&&this.getMenu()._createQuickActionGrids();return this};r.prototype.getCategory=function(){if(this.getMetadata().hasProperty("category")){return this.getProperty("category")}return e.table.columnmenu.Category.Generic};return r});