/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/registry/ChangeRegistry","sap/ui/fl/Utils","sap/ui/fl/Layer","sap/ui/fl/LayerUtils","sap/ui/fl/Change","sap/ui/fl/ChangePersistenceFactory","sap/ui/fl/write/_internal/Versions","sap/ui/fl/apply/_internal/flexState/controlVariants/VariantManagementState","sap/ui/fl/apply/_internal/changes/Applier","sap/ui/fl/apply/_internal/changes/Reverter","sap/ui/fl/apply/_internal/controlVariants/URLHandler","sap/ui/core/util/reflection/JsControlTreeModifier","sap/ui/core/util/reflection/XmlTreeModifier","sap/ui/core/Component","sap/base/Log"],function(e,n,t,r,o,i,a,s,p,h,c,l,u,g,f){"use strict";function C(e,t){return Promise.resolve().then(function(){if(t.length!==0){t.reverse();return h.revertMultipleChanges(t,{appComponent:e,modifier:l,flexController:this})}}.bind(this)).then(function(){if(e){var r=e.getModel(n.VARIANT_MODEL_NAME);if(r){t.forEach(function(e){var n=e.getVariantReference();if(n){r.removeChange(e)}});c.update({parameters:[],updateURL:true,updateHashEntry:true,model:r})}}return t})}var d=function(e){this._oChangePersistence=undefined;this._sComponentName=e||"";if(this._sComponentName){this._createChangePersistence()}};d.prototype.getComponentName=function(){return this._sComponentName};d.prototype.setVariantSwitchPromise=function(e){this._oVariantSwitchPromise=e};d.prototype.waitForVariantSwitch=function(){if(!this._oVariantSwitchPromise){this._oVariantSwitchPromise=Promise.resolve()}return this._oVariantSwitchPromise};d.prototype.createBaseChange=function(e,n){var t;var r;if(!n){throw new Error("No application component found. To offer flexibility a valid relation to its owning component must be present.")}e.reference=this.getComponentName();e.packageName="$TMP";t=o.createInitialFileContent(e);r=new o(t);if(e.variantReference){r.setVariantReference(e.variantReference)}return r};d.prototype._createChange=function(e,t,r){var o=r&&(r.controlType||n.getControlType(r));var i=this.createBaseChange(e,t);return this._getChangeHandler(i,o,r,l).then(function(o){if(o){o.completeChangeContent(i,e,{modifier:l,appComponent:t,view:n.getViewForControl(r)})}else{throw new Error("Change handler could not be retrieved for change "+JSON.stringify(e)+".")}return i}).catch(function(e){return Promise.reject(e)})};d.prototype.createChangeWithExtensionPointSelector=function(e,t){return Promise.resolve().then(function(){if(!t){throw new Error("A flexibility change on extension point cannot be created without a valid extension point reference.")}var r=t.view;var o=n.getAppComponentForControl(r);e.selector={name:t.name,viewSelector:l.getSelector(r.getId(),o)};return o}).then(function(n){return this._createChange(e,n)}.bind(this))};d.prototype.createChangeWithControlSelector=function(e,t){var r;return(new n.FakePromise).then(function(){if(!t){throw new Error("A flexibility change cannot be created without a targeted control.")}var o=t.id||t.getId();if(!e.selector){e.selector={}}r=t.appComponent||n.getAppComponentForControl(t);if(!r){throw new Error("No application component found. To offer flexibility, the control with the ID '"+o+"' has to have a valid relation to its owning application component.")}Object.assign(e.selector,l.getSelector(o,r));return r}).then(function(n){return this._createChange(e,n,t)}.bind(this))};d.prototype.addChange=function(e,t){return this.createChangeWithControlSelector(e,t).then(function(e){var r=n.getAppComponentForControl(t);e._ignoreOnce=true;this.addPreparedChange(e,r);e.setQueuedForApply();return e}.bind(this))};d.prototype.addPreparedChange=function(e,t){if(e.getVariantReference()){var r=t.getModel(n.VARIANT_MODEL_NAME);r.addChange(e)}this._oChangePersistence.addChange(e,t);return e};d.prototype.deleteChange=function(e,t){this._oChangePersistence.deleteChange(e);if(e.getVariantReference()){t.getModel(n.VARIANT_MODEL_NAME).removeChange(e)}};d.prototype.applyChange=function(e,t){var r={modifier:l,appComponent:n.getAppComponentForControl(t),view:n.getViewForControl(t)};return p.applyChangeOnControl(e,t,r).then(function(n){if(!n.success){var t=n.error||new Error("The change could not be applied.");this._oChangePersistence.deleteChange(e,true);throw t}return e}.bind(this))};function m(e,t,r,o,i){var a=v(e,o);if(!a){return[]}i.push(e);var s=e.getId();var p=t[s]&&t[s].dependencies||[];for(var h=0,c=p.length;h<c;h++){var l=n.getChangeFromChangesMap(r,p[h]);a=m(l,t,r,o,i);if(a.length===0){i=[];break}delete t[s]}return i}function v(e,n){var t=e.getDependentControlSelectorList();t.push(e.getSelector());return!t.some(function(e){return!l.bySelector(e,n)})}d.prototype.waitForChangesToBeApplied=function(e){var n;if(Array.isArray(e)){n=e}else{n=[e]}var t=n.map(function(e){return this._waitForChangesToBeApplied(e)}.bind(this));return Promise.all(t).then(function(){return undefined})};d.prototype._waitForChangesToBeApplied=function(e){var t=e.id&&sap.ui.getCore().byId(e.id)||e;var r=this._oChangePersistence.getChangesMapForComponent();var o=[];var i=Object.assign({},r.mDependencies);var a=r.mChanges;var s=a[t.getId()]||[];var p=s.filter(function(e){return!e.isCurrentProcessFinished()},this);var h=e.appComponent||n.getAppComponentForControl(t);var c=[];p.forEach(function(e){var n=m(e,i,r.mChanges,h,[]);n.forEach(function(e){if(c.indexOf(e)===-1){c.push(e)}})});c.forEach(function(e){o=o.concat(e.addChangeProcessingPromises())},this);o.push(this.waitForVariantSwitch());return Promise.all(o)};d.prototype.saveAll=function(e,r,o){var i=o?a.getVersionsModel({reference:n.normalizeReference(this._sComponentName),layer:t.CUSTOMER}).getProperty("/persistedVersion"):undefined;return this._oChangePersistence.saveDirtyChanges(e,r,undefined,i).then(function(e){if(o&&e&&e.response){var n=e.response;if(Array.isArray(n)){n=n[0]}a.onAllChangesSaved({reference:n.reference,layer:n.layer})}return e})};d.prototype.processXmlView=function(e,t){var r=g.get(t.componentId);var o=n.getAppComponentForControl(r);t.appComponent=o;t.modifier=u;t.view=e;return this._oChangePersistence.getChangesForView(t).then(p.applyAllChangesForXMLView.bind(p,t)).catch(this._handlePromiseChainError.bind(this,t.view))};d.prototype._handlePromiseChainError=function(e,n){f.error("Error processing view "+n+".");return e};d.prototype._getChangeHandler=function(n,t,r,o){var i=n.getChangeType();var a=n.getLayer();return e.getInstance().getChangeHandler(i,t,r,o,a)};d.prototype.getComponentChanges=function(e,n){return this._oChangePersistence.getChangesForComponent(e,n)};d.prototype.checkForOpenDependenciesForControl=function(e,n){return this._oChangePersistence.checkForOpenDependenciesForControl(e,n)};d.prototype._createChangePersistence=function(){this._oChangePersistence=i.getChangePersistenceForComponent(this.getComponentName());return this._oChangePersistence};d.prototype.resetChanges=function(e,n,t,r,o){return this._oChangePersistence.resetChanges(e,n,r,o).then(C.bind(this,t))};d.prototype.removeDirtyChanges=function(e,n,t,r,o){return this._oChangePersistence.removeDirtyChanges(e,n,t,r,o).then(C.bind(this,n))};d.prototype.applyVariantChanges=function(e,t){var r;return e.reduce(function(e,n){return e.then(function(){var e={modifier:l,appComponent:t};this._oChangePersistence._addRunTimeCreatedChangeAndUpdateDependencies(t,n);r=e.modifier.bySelector(n.getSelector(),t);if(r){return p.applyChangeOnControl(n,r,e)}f.error("A flexibility change tries to change a nonexistent control.")}.bind(this))}.bind(this),new n.FakePromise)};d.prototype.saveSequenceOfDirtyChanges=function(e,n){return this._oChangePersistence.saveDirtyChanges(n,false,e)};d.prototype.getResetAndPublishInfo=function(e){e.reference=this._sComponentName;return this._oChangePersistence.getResetAndPublishInfo(e)};return d},true);