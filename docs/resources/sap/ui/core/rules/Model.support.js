/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/support/library","sap/ui/support/supportRules/util/StringAnalyzer","sap/ui/model/CompositeBinding","sap/ui/model/ListBinding","sap/ui/model/json/JSONModel","sap/ui/model/odata/ODataMetadata"],function(e,t,a,n,i,o){"use strict";var d=e.Categories;var s=e.Severity;var r=e.Audiences;function c(e,a){var n=-1;var i=false;e.forEach(function(e){var o=t.calculateLevenshteinDistance(a,e);if(n===-1||o<n){n=o;i=e}});return i}var l=function(e,t,a){a.getElements().forEach(function(t){var a={};Object.assign(a,t.mBindingInfos,t.mObjectBindingInfos);Object.keys(a).forEach(function(n){var i=a[n].binding,o;if(!i||i.getModel().bAutoExpandSelect){return}if(i.isA("sap.ui.model.odata.v2.ODataListBinding")&&(!i.mParameters||!i.mParameters.select)){o="The aggregation '"+n+"' of element "+t.getId()+" with binding path '"+i.getPath()+"' is bound against a "+"collection, yet no binding parameter 'select' is used. Using 'select' "+"may improve performance."}else if(i.isA("sap.ui.model.odata.v4.ODataListBinding")&&(!i.mParameters||!i.mParameters.$select)){o="The aggregation '"+n+"' of element "+t.getId()+" with binding path '"+i.getPath()+"' is "+"bound against a collection, yet no OData query option '$select' is used."+" Using '$select' may improve performance. Alternatively, enable the "+"automatic generation of '$select' and '$expand' in the model using the "+"'autoExpandSelect' parameter."}else if(i.isA("sap.ui.model.odata.v2.ODataContextBinding")&&(!i.mParameters||!i.mParameters.select)){o="The element "+t.getId()+" with binding path '"+i.getPath()+"' is bound against an entity, yet no binding "+"parameter 'select' is used. Using 'select' may improve performance."}else if(i.isA("sap.ui.model.odata.v4.ODataContextBinding")&&(!i.mParameters||!i.mParameters.$select)){o="The element "+t.getId()+" with binding path '"+i.getPath()+"' is bound against an entity, yet no OData query"+" option '$select' is used. Using '$select' may improve performance. "+"Alternatively, enable the automatic generation of '$select' and "+"'$expand' in the model using the 'autoExpandSelect' parameter."}if(o){e.addIssue({context:{id:t.getId()},details:o,severity:s.Low})}})})};var g={id:"bindingPathSyntaxValidation",audiences:[r.Control,r.Application],categories:[d.Bindings],enabled:true,minversion:"1.32",title:"Model: Unresolved binding path",description:"The binding path used in the model could not be resolved",resolution:"Check the binding path for typos",resolutionurls:[{href:"https://openui5.hana.ondemand.com/api/sap.ui.model.Context",text:"API Reference: Context"},{href:"https://openui5.hana.ondemand.com/topic/e5310932a71f42daa41f3a6143efca9c",text:"Documentation: Data Binding Tutorial"},{href:"https://openui5.hana.ondemand.com/topic/97830de2d7314e93b5c1ee3878a17be9",text:"Documentation: Data Binding Tutorial - Step 12: Aggregation Binding Using Templates"},{href:"https://openui5.hana.ondemand.com/topic/6c7c5c266b534e7ea9a28f861dc515f5",text:"Documentation: Data Binding Tutorial - Step 13: Element Binding"}],check:function(e,t,d){var r=d.getElements();Object.keys(r).forEach(function(t){var d=r[t],l=d.mBindingInfos;Object.keys(l).forEach(function(t){var r=l[t].binding;if(r&&!(r instanceof a)&&r.getModel&&r.getModel()){var g=r.getModel();if(r.getValue&&r.getValue()===undefined||r instanceof n&&r.getLength()===0){var m=false;if(g instanceof i){var u=g.getObject(r.getPath());if(!u){var p=g.getData();m=c(Object.keys(p),r.getPath())}}else if(g.oMetadata&&g.oMetadata instanceof o){var h=g.oMetadata._getEntityTypeByPath(r.getPath());if(!h){var f=[];g.oMetadata.getServiceMetadata().dataServices.schema.forEach(function(e){if(e.entityContainer){e.entityContainer.forEach(function(e){if(e.entitySet){e.entitySet.forEach(function(e){if(e.name){f.push(e.name)}})}})}});m=c(f,r.getPath())}}if(m){e.addIssue({severity:s.Medium,details:"Element "+d.getId()+" with binding path '"+r.getPath()+"' has unresolved bindings."+" You could try '"+m+"' instead",context:{id:d.getId()}})}}else if(r.getValue&&r.getValue()===r.getPath()){e.addIssue({severity:s.Low,details:"Element "+d.getId()+" with binding path '"+r.getPath()+"' has the same value as the path. Potential Error.",context:{id:d.getId()}})}}})})}};var m={audiences:[r.Application],categories:[d.Bindings,d.Performance],description:"Using $select allows the back end to send only necessary properties",enabled:true,id:"selectUsedInBoundAggregation",minversion:"1.38",resolution:"Use the '$select' binding parameter when binding an aggregation against "+"an OData V4 model, or 'select' in case of an OData V2 model",resolutionurls:[{href:"https://openui5.hana.ondemand.com/topic/408b40efed3c416681e1bd8cdd8910d4.html#loio408b40efed3c416681e1bd8cdd8910d4/section_useSelectQuery",text:"Documentation: Performance: Speed Up Your App"},{href:"https://openui5.hana.ondemand.com/topic/10ca58b701414f7f93cd97156f898f80",text:"OData V4 only: Automatic determination of $expand and $select"},{href:"https://openui5.hana.ondemand.com/api/sap.ui.model.odata.v4.ODataModel%23methods/bindList",text:"Documentation: v4.ODataModel#bindList"},{href:"https://openui5.hana.ondemand.com/api/sap.ui.model.odata.v2.ODataModel%23methods/bindList",text:"Documentation: v2.ODataModel#bindList"}],title:"Model: Use the $select/select binding parameter when binding aggregations to "+"improve performance",check:l};return[g,m]},true);