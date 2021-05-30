/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";function t(t,e,r){if(r!==""||r.toLowerCase()==="auto"){t.style(e,r)}}var e={apiVersion:2};e.render=function(e,r){e.openStart("iframe",r);t(e,"width",r.getWidth());t(e,"height",r.getHeight());e.style("display","block");e.style("border","none");e.attr("sandbox","allow-forms allow-popups allow-scripts");e.attr("src",r.getUrl());var i=r.getTitle();if(i){e.attr("title",i)}e.openEnd();e.close("iframe")};return e},true);