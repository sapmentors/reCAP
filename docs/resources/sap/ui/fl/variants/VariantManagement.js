/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/model/Context","sap/ui/model/PropertyBinding","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/Device","sap/ui/core/InvisibleText","sap/ui/core/Control","sap/ui/core/Icon","sap/ui/layout/HorizontalLayout","sap/ui/layout/Grid","sap/m/SearchField","sap/m/RadioButton","sap/m/ColumnListItem","sap/m/Column","sap/m/Text","sap/m/Bar","sap/m/Table","sap/m/Page","sap/m/Toolbar","sap/m/ToolbarSpacer","sap/m/Button","sap/m/ToggleButton","sap/m/CheckBox","sap/m/Dialog","sap/m/Input","sap/m/Label","sap/m/Title","sap/m/ResponsivePopover","sap/m/SelectList","sap/m/ObjectIdentifier","sap/m/OverflowToolbar","sap/m/OverflowToolbarLayoutData","sap/m/VBox","sap/ui/events/KeyCodes","sap/ui/core/library","sap/m/library","sap/ui/fl/Utils","sap/ui/fl/registry/Settings"],function(e,t,i,a,n,o,s,r,l,h,u,d,g,p,f,c,_,m,M,v,y,V,N,A,T,S,b,E,C,I,x,D,O,w,R,P,L,F,B){"use strict";var K=L.OverflowToolbarPriority;var k=L.ButtonType;var U=L.PlacementType;var G=L.PopinDisplay;var H=L.ScreenSize;var z=P.ValueState;var X=P.TextAlign;var W=r.extend("sap.ui.fl.variants.VariantManagement",{metadata:{interfaces:["sap.m.IOverflowToolbarContent"],library:"sap.ui.fl",designtime:"sap/ui/fl/designtime/variants/VariantManagement.designtime",properties:{showSetAsDefault:{type:"boolean",group:"Misc",defaultValue:true},manualVariantKey:{type:"boolean",group:"Misc",defaultValue:false},inErrorState:{type:"boolean",group:"Misc",defaultValue:false},editable:{type:"boolean",group:"Misc",defaultValue:true},modelName:{type:"string",group:"Misc",defaultValue:null},updateVariantInURL:{type:"boolean",group:"Misc",defaultValue:false},resetOnContextChange:{type:"boolean",group:"Misc",defaultValue:true},executeOnSelectionForStandardDefault:{type:"boolean",group:"Misc",defaultValue:false},displayTextForExecuteOnSelectionForStandardVariant:{type:"string",group:"Misc",defaultValue:""}},associations:{for:{type:"sap.ui.core.Control",multiple:true}},events:{save:{parameters:{name:{type:"string"},overwrite:{type:"boolean"},key:{type:"string"},execute:{type:"boolean"},def:{type:"boolean"}}},cancel:{},manage:{},initialized:{},select:{parameters:{key:{type:"string"}}}}},renderer:{apiVersion:2,render:function(e,t){e.openStart("div",t).class("sapUiFlVarMngmt").attr("title",t._oRb.getText("VARIANT_MANAGEMENT_TRIGGER_TT")).openEnd();e.renderControl(t.oVariantLayout);e.close("div")}}});W.INNER_MODEL_NAME="$sapUiFlVariants";W.MAX_NAME_LEN=100;W.COLUMN_FAV_IDX=0;W.COLUMN_NAME_IDX=1;W.COLUMN_EXEC_IDX=3;W.prototype.init=function(){this._sModelName=F.VARIANT_MODEL_NAME;this.attachModelContextChange(this._setModel,this);this._oRb=sap.ui.getCore().getLibraryResourceBundle("sap.ui.fl");this._createInnerModel();this.oVariantInvisibleText=new s;this.oVariantText=new E(this.getId()+"-text",{text:{path:"currentVariant",model:this._sModelName,formatter:function(e){var t="";if(e){t=this.getSelectedVariantText(e);this._setInvisibleText(t,this.getModified())}return t}.bind(this)}});this.oVariantText.addStyleClass("sapUiFlVarMngmtClickable");this.oVariantText.addStyleClass("sapUiFlVarMngmtTitle");if(o.system.phone){this.oVariantText.addStyleClass("sapUiFlVarMngmtTextPhoneMaxWidth")}else{this.oVariantText.addStyleClass("sapUiFlVarMngmtTextMaxWidth")}var e=new b(this.getId()+"-modified",{text:"*",visible:{path:"modified",model:this._sModelName,formatter:function(e){var t=this.getCurrentVariantKey();if(t){this._setInvisibleText(this.getSelectedVariantText(t),e)}return e===null||e===undefined?false:e}.bind(this)}});e.setVisible(false);e.addStyleClass("sapUiFlVarMngmtModified");e.addStyleClass("sapUiFlVarMngmtClickable");e.addStyleClass("sapMTitleStyleH4");this.oVariantPopoverTrigger=new N(this.getId()+"-trigger",{icon:"sap-icon://slim-arrow-down",type:k.Transparent,tooltip:this._oRb.getText("VARIANT_MANAGEMENT_TRIGGER_TT")});this.oVariantPopoverTrigger.addAriaLabelledBy(this.oVariantInvisibleText);this.oVariantPopoverTrigger.addStyleClass("sapUiFlVarMngmtTriggerBtn");this.oVariantPopoverTrigger.addStyleClass("sapMTitleStyleH4");this.oVariantLayout=new h({content:[this.oVariantText,e,this.oVariantPopoverTrigger]});this.oVariantLayout.addStyleClass("sapUiFlVarMngmtLayout");e.setVisible(false);this.oVariantModifiedText=e;this.oVariantInvisibleText.toStatic();this.addDependent(this.oVariantLayout)};W.prototype.getOverflowToolbarConfig=function(){var e={canOverflow:false,invalidationEvents:["save","manage","select"]};return e};W.prototype.getTitle=function(){return this.oVariantText};W.prototype._setInvisibleText=function(e,t){var i;if(e){if(t){i="VARIANT_MANAGEMENT_SEL_VARIANT_MOD"}else{i="VARIANT_MANAGEMENT_SEL_VARIANT"}this.oVariantInvisibleText.setText(this._oRb.getText(i,[e]))}};W.prototype._createInnerModel=function(){var e=new i({showExecuteOnSelection:false,showSetAsDefault:true,editable:true,popoverTitle:this._oRb.getText("VARIANT_MANAGEMENT_VARIANTS")});this.setModel(e,W.INNER_MODEL_NAME);this._bindProperties();this._updateInnerModelWithShowSaveAsProperty()};W.prototype._bindProperties=function(){this.bindProperty("showSetAsDefault",{path:"/showSetAsDefault",model:W.INNER_MODEL_NAME});this.bindProperty("editable",{path:"/editable",model:W.INNER_MODEL_NAME})};W.prototype._updateInnerModelWithShowSaveAsProperty=function(){B.getInstance().then(function(e){this.getModel(W.INNER_MODEL_NAME).setProperty("/showSaveAs",e.isVariantPersonalizationEnabled())}.bind(this))};W.prototype._getShowExecuteOnSelection=function(){var e=this.getModel(W.INNER_MODEL_NAME);if(e){return e.getProperty("/showExecuteOnSelection")}return false};W.prototype._setShowExecuteOnSelection=function(e){var t=this.getModel(W.INNER_MODEL_NAME);if(t){t.setProperty("/showExecuteOnSelection",e)}};W.prototype.setExecuteOnSelection=function(e){var t=this.getModel(this._sModelName);if(t&&this.oContext){t.setProperty(this.oContext+"/executeOnSelection",e)}};W.prototype.getOriginalDefaultVariantKey=function(){var e=this.getModel(this._sModelName);if(e&&this.oContext){return e.getProperty(this.oContext+"/originalDefaultVariant")}return null};W.prototype.setDefaultVariantKey=function(e){var t=this.getModel(this._sModelName);if(t&&this.oContext){t.setProperty(this.oContext+"/defaultVariant",e)}};W.prototype.getDefaultVariantKey=function(){var e=this.getModel(this._sModelName);if(e&&this.oContext){return e.getProperty(this.oContext+"/defaultVariant")}return null};W.prototype.setCurrentVariantKey=function(e){var t=this.getModel(this._sModelName);if(t&&this.oContext){t.setProperty(this.oContext+"/currentVariant",e)}return this};W.prototype.getCurrentVariantKey=function(){var e=this.getModel(this._sModelName);if(e&&this.oContext){return e.getProperty(this.oContext+"/currentVariant")}return null};W.prototype._assignPopoverTitle=function(){var e;var t;var i=this.getModel(this._sModelName);if(i&&this.oContext){e=i.getProperty(this.oContext+"/popoverTitle")}if(e!==undefined){t=this.getModel(W.INNER_MODEL_NAME);if(t){t.setProperty("/popoverTitle",e)}}};W.prototype.getVariants=function(){return this._getItems()};W.prototype.setModified=function(e){var t=this.getModel(this._sModelName);if(t&&this.oContext){t.setProperty(this.oContext+"/modified",e)}};W.prototype.getModified=function(){var e=this.getModel(this._sModelName);if(e&&this.oContext){return e.getProperty(this.oContext+"/modified")}return false};W.prototype.getSelectedVariantText=function(e){var t=this._getItemByKey(e);if(t){return t.title}return""};W.prototype.getStandardVariantKey=function(){var e=this._getItems();if(e&&e[0]){return e[0].key}return null};W.prototype.getShowFavorites=function(){var e=this.getModel(this._sModelName);if(e&&this.oContext){return e.getProperty(this.oContext+"/showFavorites")}return false};W.prototype._clearDeletedItems=function(){this._aDeletedItems=[]};W.prototype._addDeletedItem=function(e){this._aDeletedItems.push(e)};W.prototype._getDeletedItems=function(){return this._aDeletedItems};W.prototype._getItems=function(){var e=[];if(this.oContext&&this.oContext.getObject()){e=this.oContext.getObject().variants.filter(function(e){if(!e.hasOwnProperty("visible")){return true}return e.visible})}return e};W.prototype._getItemByKey=function(e){var t=null;var i=this._getItems();i.some(function(i){if(i.key===e){t=i}return t!==null});return t};W.prototype._rebindControl=function(){this.oVariantText.unbindProperty("text");this.oVariantText.bindProperty("text",{path:"currentVariant",model:this._sModelName,formatter:function(e){var t="";if(e){t=this.getSelectedVariantText(e);this._setInvisibleText(t,this.getModified())}return t}.bind(this)});this.oVariantModifiedText.unbindProperty("visible");this.oVariantModifiedText.bindProperty("visible",{path:"modified",model:this._sModelName,formatter:function(e){var t=this.getCurrentVariantKey();if(t){this._setInvisibleText(this.getSelectedVariantText(t),e)}return e===null||e===undefined?false:e}.bind(this)})};W.prototype.setModelName=function(e){if(this.getModelName()){this.oContext=null}this.setProperty("modelName",e);this._sModelName=e;this._rebindControl();return this};W.prototype._setBindingContext=function(){var t;var i;if(!this.oContext){t=this.getModel(this._sModelName);if(t){i=this._getLocalId(t);if(i){this.oContext=new e(t,"/"+i);this.setBindingContext(this.oContext,this._sModelName);if(!this.getModelName()&&t.registerToModel){t.registerToModel(this)}this._assignPopoverTitle();this._registerPropertyChanges(t);this.fireInitialized()}}}};W.prototype._getLocalId=function(e){if(this.getModelName()&&this._sModelName!==F.VARIANT_MODEL_NAME){return this.getId()}return e.getVariantManagementReferenceForControl(this)};W.prototype._setModel=function(){this._setBindingContext()};W.prototype._registerPropertyChanges=function(e){var i=new t(e,this.oContext+"/showExecuteOnSelection");i.attachChange(function(e){if(e&&e.oSource&&e.oSource.oModel&&e.oSource.sPath){var t=e.oSource.oModel.getProperty(e.oSource.sPath);if(t!==undefined){this._setShowExecuteOnSelection(t)}}}.bind(this));i=new t(e,this.oContext+"/variantsEditable");i.attachChange(function(e){if(e&&e.oSource&&e.oSource.oModel&&e.oSource.sPath){var t;var i=e.oSource.oModel.getProperty(e.oSource.sPath);t=this.getModel(W.INNER_MODEL_NAME);if(t&&i!==undefined){t.setProperty("/editable",i)}}}.bind(this))};W.prototype._obtainControl=function(e){if(e&&e.target&&e.target.id){var t=e.target.id;var i=t.indexOf("-inner");if(i>0){t=t.substring(0,i)}return sap.ui.getCore().byId(t)}return null};W.prototype.handleOpenCloseVariantPopover=function(e){if(!this.bPopoverOpen){this._oCtrlRef=this._obtainControl(e);this._openVariantList()}else if(this.oVariantPopOver&&this.oVariantPopOver.isOpen()){this.oVariantPopOver.close()}else if(this.getInErrorState()&&this.oErrorVariantPopOver&&this.oErrorVariantPopOver.isOpen()){this.oErrorVariantPopOver.close()}};W.prototype.getFocusDomRef=function(){if(this.oVariantPopoverTrigger){return this.oVariantPopoverTrigger.getFocusDomRef()}};W.prototype.onclick=function(e){if(this.oVariantPopoverTrigger&&!this.bPopoverOpen){this.oVariantPopoverTrigger.focus()}this.handleOpenCloseVariantPopover(e)};W.prototype.onkeyup=function(e){if(e.which===R.F4||e.which===R.SPACE||e.altKey===true&&e.which===R.ARROW_UP||e.altKey===true&&e.which===R.ARROW_DOWN){this._oCtrlRef=this._obtainControl(e);this._openVariantList()}};W.prototype.onAfterRendering=function(){this.oVariantText.$().off("mouseover").on("mouseover",function(){this.oVariantPopoverTrigger.addStyleClass("sapUiFlVarMngmtTriggerBtnHover")}.bind(this));this.oVariantText.$().off("mouseout").on("mouseout",function(){this.oVariantPopoverTrigger.removeStyleClass("sapUiFlVarMngmtTriggerBtnHover")}.bind(this))};W.prototype._openInErrorState=function(){var e;if(!this.oErrorVariantPopOver){e=new w({fitContainer:true,alignItems:sap.m.FlexAlignItems.Center,items:[new l({size:"4rem",color:"lightgray",src:"sap-icon://message-error"}),new E({titleStyle:sap.ui.core.TitleLevel.H2,text:this._oRb.getText("VARIANT_MANAGEMENT_ERROR_TEXT1")}),new c({textAlign:sap.ui.core.TextAlign.Center,text:this._oRb.getText("VARIANT_MANAGEMENT_ERROR_TEXT2")})]});e.addStyleClass("sapUiFlVarMngmtErrorPopover");this.oErrorVariantPopOver=new C(this.getId()+"-errorpopover",{title:{path:"/popoverTitle",model:W.INNER_MODEL_NAME},contentWidth:"400px",placement:U.VerticalPreferredBottom,content:[new M(this.getId()+"-errorselpage",{showSubHeader:false,showNavButton:false,showHeader:false,content:[e]})],afterOpen:function(){this.bPopoverOpen=true}.bind(this),afterClose:function(){if(this.bPopoverOpen){setTimeout(function(){this.bPopoverOpen=false}.bind(this),200)}}.bind(this),contentHeight:"300px"});this.oErrorVariantPopOver.attachBrowserEvent("keyup",function(e){if(e.which===32){this.oErrorVariantPopOver.close()}}.bind(this))}if(this.bPopoverOpen){return}this.oErrorVariantPopOver.openBy(this.oVariantLayout)};W.prototype._createVariantList=function(){if(this.oVariantPopOver){return}this.oVariantManageBtn=new V(this.getId()+"-manage",{text:this._oRb.getText("VARIANT_MANAGEMENT_MANAGE"),enabled:true,press:function(){this._openManagementDialog()}.bind(this),layoutData:new O({priority:K.Low})});this.oVariantSaveBtn=new V(this.getId()+"-mainsave",{text:this._oRb.getText("VARIANT_MANAGEMENT_SAVE"),press:function(){this._handleVariantSave()}.bind(this),visible:{path:"modified",model:this._sModelName,formatter:function(e){return e}},type:k.Emphasized,layoutData:new O({priority:K.Low})});this.oVariantSaveAsBtn=new V(this.getId()+"-saveas",{text:this._oRb.getText("VARIANT_MANAGEMENT_SAVEAS"),press:function(){this._openSaveAsDialog()}.bind(this),layoutData:new O({priority:K.Low}),visible:{path:"/showSaveAs",model:W.INNER_MODEL_NAME}});this._oVariantList=new I(this.getId()+"-list",{selectedKey:{path:"currentVariant",model:this._sModelName},itemPress:function(e){var t=null;if(e&&e.getParameters()){var i=e.getParameters().item;if(i){t=i.getKey()}}if(t){this.setCurrentVariantKey(t);this.fireEvent("select",{key:t});this.oVariantPopOver.close()}}.bind(this)});this._oVariantList.setNoDataText(this._oRb.getText("VARIANT_MANAGEMENT_NODATA"));var e=new sap.ui.core.Item({key:"{"+this._sModelName+">key}",text:"{"+this._sModelName+">title}"});this._oVariantList.bindAggregation("items",{path:"variants",model:this._sModelName,template:e});this._oSearchField=new d(this.getId()+"-search");this._oSearchField.attachLiveChange(function(e){this._triggerSearch(e,this._oVariantList)}.bind(this));this.oVariantSelectionPage=new M(this.getId()+"-selpage",{subHeader:new v({content:[this._oSearchField]}),content:[this._oVariantList],footer:new D({content:[new y(this.getId()+"-spacer"),this.oVariantSaveBtn,this.oVariantSaveAsBtn,this.oVariantManageBtn]}),showNavButton:false,showHeader:false,showFooter:{path:"/editable",model:W.INNER_MODEL_NAME}});this.oVariantPopOver=new C(this.getId()+"-popover",{title:{path:"/popoverTitle",model:W.INNER_MODEL_NAME},titleAlignment:"Auto",contentWidth:"400px",placement:U.VerticalPreferredBottom,content:[this.oVariantSelectionPage],afterOpen:function(){this.bPopoverOpen=true;this.oVariantPopoverTrigger.setPressed(true)}.bind(this),afterClose:function(){this.oVariantPopoverTrigger.setPressed(false);if(this.bPopoverOpen){setTimeout(function(){this.bPopoverOpen=false}.bind(this),200)}}.bind(this),contentHeight:"300px"});this.oVariantPopOver.addStyleClass("sapUiFlVarMngmtPopover");if(this.oVariantLayout.$().closest(".sapUiSizeCompact").length>0){this.oVariantPopOver.addStyleClass("sapUiSizeCompact")}this.addDependent(this.oVariantPopOver)};W.prototype.showSaveButton=function(e){if(e===false){this.oVariantSaveAsBtn.setType(k.Emphasized);this.oVariantSaveBtn.setVisible(false)}else{this.oVariantSaveAsBtn.setType(k.Default);this.oVariantSaveBtn.setVisible(true)}};W.prototype._openVariantList=function(){var e;if(this.getInErrorState()){this._openInErrorState();return}if(this.bPopoverOpen){return}if(!this.oContext){return}this._createVariantList();this._oSearchField.setValue("");this._oVariantList.getBinding("items").filter(this._getFilters());this.oVariantSelectionPage.setShowSubHeader(this._oVariantList.getItems().length>9);this.showSaveButton(false);if(this.getModified()){e=this._getItemByKey(this.getCurrentVariantKey());if(e&&e.change){this.showSaveButton(true)}}var t=this._oCtrlRef?this._oCtrlRef:this.oVariantLayout;this._oCtrlRef=null;this.oVariantPopOver.openBy(t)};W.prototype._triggerSearch=function(e,t){if(!e){return}var i=e.getParameters();if(!i){return}var o=i.newValue?i.newValue:"";var s=new a({path:"title",operator:n.Contains,value1:o});t.getBinding("items").filter(this._getFilters(s))};W.prototype._createSaveAsDialog=function(){if(!this.oSaveAsDialog){this.oInputName=new S(this.getId()+"-name",{liveChange:function(){this._checkVariantNameConstraints(this.oInputName)}.bind(this)});var e=new b(this.getId()+"-namelabel",{text:this._oRb.getText("VARIANT_MANAGEMENT_NAME")});e.setLabelFor(this.oInputName);e.addStyleClass("sapUiFlVarMngmtSaveDialogLabel");this.oDefault=new A(this.getId()+"-default",{text:this._oRb.getText("VARIANT_MANAGEMENT_SETASDEFAULT"),visible:{path:"/showSetAsDefault",model:W.INNER_MODEL_NAME},width:"100%"});this.oExecuteOnSelect=new A(this.getId()+"-execute",{text:this._oRb.getText("VARIANT_MANAGEMENT_EXECUTEONSELECT"),visible:{path:"/showExecuteOnSelection",model:W.INNER_MODEL_NAME},width:"100%"});this.oInputManualKey=new S(this.getId()+"-key",{liveChange:function(){this._checkVariantNameConstraints(this.oInputManualKey)}.bind(this)});this.oLabelKey=new b(this.getId()+"-keylabel",{text:this._oRb.getText("VARIANT_MANAGEMENT_KEY"),required:true});this.oLabelKey.setLabelFor(this.oInputManualKey);this.oSaveSave=new V(this.getId()+"-variantsave",{text:this._oRb.getText("VARIANT_MANAGEMENT_SAVE"),type:k.Emphasized,press:function(){if(!this._bSaveOngoing){this._checkVariantNameConstraints(this.oInputName);if(this.oInputName.getValueState()==="Error"){return}this._bSaveOngoing=true;this._bSaveCanceled=false;this._handleVariantSaveAs(this.oInputName.getValue())}}.bind(this),enabled:true});var t=new u({defaultSpan:"L12 M12 S12"});if(this.getShowSetAsDefault()){t.addContent(this.oDefault)}if(this._getShowExecuteOnSelection()){t.addContent(this.oExecuteOnSelect)}this.oSaveAsDialog=new T(this.getId()+"-savedialog",{title:this._oRb.getText("VARIANT_MANAGEMENT_SAVEDIALOG"),afterClose:function(){this._bSaveOngoing=false;if(this._sStyleClass){this.oSaveAsDialog.removeStyleClass(this._sStyleClass);this._sStyleClass=undefined}}.bind(this),beginButton:this.oSaveSave,endButton:new V(this.getId()+"-variantcancel",{text:this._oRb.getText("VARIANT_MANAGEMENT_CANCEL"),press:this._cancelPressed.bind(this)}),content:[e,this.oInputName,this.oLabelKey,this.oInputManualKey,t],stretch:o.system.phone});this.oSaveAsDialog.isPopupAdaptationAllowed=function(){return false};this.oSaveAsDialog.addStyleClass("sapUiContentPadding");this.oSaveAsDialog.addStyleClass("sapUiFlVarMngmtSaveDialog");if(this.oVariantLayout.$().closest(".sapUiSizeCompact").length>0){this.oSaveAsDialog.addStyleClass("sapUiSizeCompact")}this.addDependent(this.oSaveAsDialog)}};W.prototype._cancelPressed=function(){this._bSaveCanceled=true;this.fireCancel();this.oSaveAsDialog.close()};W.prototype.openSaveAsDialogForKeyUser=function(e){this._openSaveAsDialog(e);this.oSaveAsDialog.addStyleClass(e);this._sStyleClass=e};W.prototype._openSaveAsDialog=function(){this._createSaveAsDialog();this.oInputName.setValue(this.getSelectedVariantText(this.getCurrentVariantKey()));this.oInputName.setEnabled(true);this.oInputName.setValueState(z.None);this.oInputName.setValueStateText(null);this.oDefault.setSelected(false);this.oExecuteOnSelect.setSelected(false);if(this.oVariantPopOver){this.oVariantPopOver.close()}if(this.getManualVariantKey()){this.oInputManualKey.setVisible(true);this.oInputManualKey.setEnabled(true);this.oInputManualKey.setValueState(z.None);this.oInputManualKey.setValueStateText(null);this.oLabelKey.setVisible(true)}else{this.oInputManualKey.setVisible(false);this.oLabelKey.setVisible(false)}this.oSaveAsDialog.open()};W.prototype._handleVariantSaveAs=function(e){var t=null;var i=e.trim();var a=this.oInputManualKey.getValue().trim();if(i===""){this.oInputName.setValueState(z.Error);this.oInputName.setValueStateText(this._oRb.getText("VARIANT_MANAGEMENT_ERROR_EMPTY"));return}if(this.getManualVariantKey()){if(a===""){this.oInputManualKey.setValueState(z.Error);this.oInputManualKey.setValueStateText(this._oRb.getText("VARIANT_MANAGEMENT_ERROR_EMPTY"));return}t=a}if(this.oSaveAsDialog){this.oSaveAsDialog.close()}if(this.oDefault.getSelected()){this.setDefaultVariantKey(t)}this.setModified(false);this.fireSave({key:t,name:i,overwrite:false,def:this.oDefault.getSelected(),execute:this.oExecuteOnSelect.getSelected()})};W.prototype._handleVariantSave=function(){var e=this._getItemByKey(this.getCurrentVariantKey());var t=false;if(this.getDefaultVariantKey()===e.key){t=true}if(this.oVariantPopOver){this.oVariantPopOver.close()}this.fireSave({name:e.title,overwrite:true,key:e.key,def:t});this.setModified(false)};W.prototype.openManagementDialog=function(e,t){if(e&&this.oManagementDialog){this.oManagementDialog.destroy();this.oManagementDialog=undefined}this._openManagementDialog(t)};W.prototype._triggerSearchInManageDialog=function(e,t){if(!e){return}var i=e.getParameters();if(!i){return}var o=i.newValue?i.newValue:"";var s=[this._getVisibleFilter(),new a({filters:[new a({path:"title",operator:n.Contains,value1:o}),new a({path:"author",operator:n.Contains,value1:o})],and:false})];t.getBinding("items").filter(s);this._bDeleteOccured=true};W.prototype.getManageDialog=function(){return this.oManagementDialog};W.prototype._createManagementDialog=function(){if(!this.oManagementDialog||this.oManagementDialog.bIsDestroyed){this.oManagementTable=new m(this.getId()+"-managementTable",{contextualWidth:"Auto",fixedLayout:false,growing:true,columns:[new f({width:"3rem",visible:{path:"showFavorites",model:this._sModelName}}),new f({header:new c({text:this._oRb.getText("VARIANT_MANAGEMENT_NAME")}),width:"14rem"}),new f({header:new c({text:this._oRb.getText("VARIANT_MANAGEMENT_DEFAULT"),wrappingType:"Hyphenated"}),hAlign:X.Begin,demandPopin:true,popinDisplay:G.Block,minScreenWidth:H.Tablet,visible:{path:"/showSetAsDefault",model:W.INNER_MODEL_NAME}}),new f({header:new c({text:this._oRb.getText("VARIANT_MANAGEMENT_EXECUTEONSELECT"),wrappingType:"Hyphenated"}),hAlign:this.getDisplayTextForExecuteOnSelectionForStandardVariant()?X.Begin:X.Center,demandPopin:true,popinDisplay:G.Block,minScreenWidth:H.Tablet,visible:{path:"/showExecuteOnSelection",model:W.INNER_MODEL_NAME}}),new f({header:new c({text:this._oRb.getText("VARIANT_MANAGEMENT_AUTHOR")}),demandPopin:true,popinDisplay:G.Block,minScreenWidth:H.Tablet}),new f({hAlign:X.Center}),new f({visible:false})]});this.oManagementSave=new V(this.getId()+"-managementsave",{text:this._oRb.getText("VARIANT_MANAGEMENT_SAVE"),enabled:true,type:k.Emphasized,press:function(){this._handleManageSavePressed()}.bind(this)});this.oManagementCancel=new V(this.getId()+"-managementcancel",{text:this._oRb.getText("VARIANT_MANAGEMENT_CANCEL"),press:function(){this._resumeManagementTableBinding();this.oManagementDialog.close();this._handleManageCancelPressed()}.bind(this)});this.oManagementDialog=new T(this.getId()+"-managementdialog",{contentWidth:"64%",resizable:true,draggable:true,title:this._oRb.getText("VARIANT_MANAGEMENT_MANAGEDIALOG"),beginButton:this.oManagementSave,endButton:this.oManagementCancel,content:[this.oManagementTable],stretch:o.system.phone});this.oManagementDialog.isPopupAdaptationAllowed=function(){return false};this._oSearchFieldOnMgmtDialog=new d;this._oSearchFieldOnMgmtDialog.attachLiveChange(function(e){this._triggerSearchInManageDialog(e,this.oManagementTable)}.bind(this));var e=new _(this.getId()+"-mgmHeaderSearch",{contentMiddle:[this._oSearchFieldOnMgmtDialog]});this.oManagementDialog.setSubHeader(e);if(this.oVariantLayout.$().closest(".sapUiSizeCompact").length>0){this.oManagementDialog.addStyleClass("sapUiSizeCompact")}this.addDependent(this.oManagementDialog);this.oManagementTable.bindAggregation("items",{path:"variants",model:this._sModelName,factory:this._templateFactoryManagementDialog.bind(this),filters:this._getVisibleFilter()});this._bDeleteOccured=false}};W.prototype._setFavoriteIcon=function(e,t){if(e){e.setSrc(t?"sap-icon://favorite":"sap-icon://unfavorite");e.setTooltip(this._oRb.getText(t?"VARIANT_MANAGEMENT_FAV_DEL_TOOLTIP":"VARIANT_MANAGEMENT_FAV_ADD_TOOLTIP"));e.setAlt(this._oRb.getText(t?"VARIANT_MANAGEMENT_FAV_DEL_ACC":"VARIANT_MANAGEMENT_FAV_ADD_ACC"))}};W.prototype._templateFactoryManagementDialog=function(e,t){var i=null;var a;var n;var o;var s;var r=t.getObject();if(!r){return undefined}var h=function(e){this._checkVariantNameConstraints(e.oSource,e.oSource.getBindingContext(this._sModelName).getObject().key)}.bind(this);var u=function(e){this._handleManageTitleChanged(e.oSource.getBindingContext(this._sModelName).getObject())}.bind(this);var d=function(e){this._handleManageDefaultVariantChange(e.oSource,e.oSource.getBindingContext(this._sModelName).getObject(),e.getParameters().selected)}.bind(this);var f=function(e){this._handleManageExecuteOnSelectionChanged(e.oSource.getBindingContext(this._sModelName).getObject())}.bind(this);var _=function(e){this._handleManageDeletePressed(e.oSource.getBindingContext(this._sModelName).getObject());var t=e.oSource.getParent();if(t){t.setVisible(false)}this._reCheckVariantNameConstraints()}.bind(this);var m=function(e){this._handleManageFavoriteChanged(e.oSource,e.oSource.getBindingContext(this._sModelName).getObject())}.bind(this);if(r.rename){o=new S({liveChange:h,change:u,value:"{"+this._sModelName+">title}"})}else{o=new x({title:"{"+this._sModelName+">title}"});if(i){o.setTooltip(i)}}a=new V({icon:"sap-icon://decline",enabled:true,type:k.Transparent,press:_,tooltip:this._oRb.getText("VARIANT_MANAGEMENT_DELETE"),visible:r.remove});this._assignColumnInfoForDeleteButton(a);n=this.oContext.getPath();var M=new l({src:{path:"favorite",model:this._sModelName,formatter:function(e){return e?"sap-icon://favorite":"sap-icon://unfavorite"}},tooltip:{path:"favorite",model:this._sModelName,formatter:function(e){return this._oRb.getText(e?"VARIANT_MANAGEMENT_FAV_DEL_TOOLTIP":"VARIANT_MANAGEMENT_FAV_ADD_TOOLTIP")}.bind(this)},press:m});if(this.getDefaultVariantKey()===r.key){M.addStyleClass("sapUiFlVarMngmtFavNonInteractiveColor")}else{M.addStyleClass("sapUiFlVarMngmtFavColor")}if(this.getDisplayTextForExecuteOnSelectionForStandardVariant()&&this.getStandardVariantKey()===r.key){s=new A({wrapping:true,text:this.getDisplayTextForExecuteOnSelectionForStandardVariant(),select:f,selected:"{"+this._sModelName+">executeOnSelect}"})}else{s=new A({text:"",select:f,selected:"{"+this._sModelName+">executeOnSelect}"})}var v=new p({cells:[M,o,new g({groupName:this.getId(),select:d,selected:{path:n+"/defaultVariant",model:this._sModelName,formatter:function(e){return r.key===e}}}),s,new c({text:"{"+this._sModelName+">author}",textAlign:"Begin"}),a,new c({text:"{"+this._sModelName+">key}"})]});return v};W.prototype._openManagementDialog=function(e){this._createManagementDialog();if(this.oVariantPopOver){this.oVariantPopOver.close()}this._suspendManagementTableBinding();this._clearDeletedItems();this._oSearchFieldOnMgmtDialog.setValue("");if(this._bDeleteOccured){this._bDeleteOccured=false;this.oManagementTable.bindAggregation("items",{path:"variants",model:this._sModelName,factory:this._templateFactoryManagementDialog.bind(this),filters:this._getVisibleFilter()})}if(e){this.oManagementDialog.addStyleClass(e)}this.oManagementDialog.open()};W.prototype._assignColumnInfoForDeleteButton=function(e){if(!this._oInvisibleDeleteColumnName){this._oInvisibleDeleteColumnName=new s({text:this._oRb.getText("VARIANT_MANAGEMENT_ACTION_COLUMN")});this.oManagementDialog.addContent(this._oInvisibleDeleteColumnName)}if(this._oInvisibleDeleteColumnName){e.addAriaLabelledBy(this._oInvisibleDeleteColumnName)}};W.prototype._toggleIconActivityState=function(e,t){if(!e){return}if(t){if(e.hasStyleClass("sapUiFlVarMngmtFavColor")){e.removeStyleClass("sapUiFlVarMngmtFavColor");e.addStyleClass("sapUiFlVarMngmtFavNonInteractiveColor")}}else{if(e.hasStyleClass("sapUiFlVarMngmtFavNonInteractiveColor")){e.removeStyleClass("sapUiFlVarMngmtFavNonInteractiveColor");e.addStyleClass("sapUiFlVarMngmtFavColor")}}};W.prototype._handleManageDefaultVariantChange=function(e,t,i){var a=t.key;if(e){var n=e.getParent().getCells()[W.COLUMN_FAV_IDX];if(i){if(this.getShowFavorites()&&!t.favorite){t.favorite=true;this._setFavoriteIcon(n,true)}this.setDefaultVariantKey(a)}this._toggleIconActivityState(n,i)}};W.prototype._handleManageCancelPressed=function(){var e;var t;this._getDeletedItems().forEach(function(e){e.visible=true});this._getItems().forEach(function(e){e.title=e.originalTitle;e.favorite=e.originalFavorite;e.executeOnSelection=e.originalExecuteOnSelection});e=this.getOriginalDefaultVariantKey();if(e!==this.getDefaultVariantKey()){this.setDefaultVariantKey(e)}t=this.getModel(this._sModelName);if(t){t.checkUpdate()}};W.prototype._handleManageFavoriteChanged=function(e,t){if(this.getDefaultVariantKey()===t.key&&t.favorite){return}t.favorite=!t.favorite;this._setFavoriteIcon(e,t.favorite)};W.prototype._getRowForKey=function(e){var t=null;if(this.oManagementTable){this.oManagementTable.getItems().some(function(i){if(e===i.getCells()[0].getBindingContext(this._sModelName).getObject().key){t=i}return t!==null}.bind(this))}return t};W.prototype._handleManageDeletePressed=function(e){var t;var i=e.key;if(this.oManagementTable.getItems().length===1){return}e.visible=false;this._addDeletedItem(e);if(i===this.getDefaultVariantKey()){this.setDefaultVariantKey(this.getStandardVariantKey());if(this.getShowFavorites()){var a=this._getItemByKey(this.getStandardVariantKey());if(a&&!a.favorite){var n=this._getRowForKey(this.getStandardVariantKey());if(n){a.favorite=true;this._setFavoriteIcon(n.getCells()[W.COLUMN_FAV_IDX],true)}}}}t=this.getModel(this._sModelName);if(t){t.checkUpdate()}this.oManagementCancel.focus()};W.prototype._handleManageExecuteOnSelectionChanged=function(){};W.prototype._handleManageTitleChanged=function(){};W.prototype._handleManageSavePressed=function(){if(this._anyInErrorState(this.oManagementTable)){return}this._getDeletedItems().some(function(e){if(e.key===this.getCurrentVariantKey()){var t=this.getStandardVariantKey();this.setModified(false);this.setCurrentVariantKey(t);this.fireEvent("select",{key:t});return true}return false}.bind(this));this.fireManage();this._resumeManagementTableBinding();this.oManagementDialog.close()};W.prototype._resumeManagementTableBinding=function(){if(this.oManagementTable){var e=this.oManagementTable.getBinding("items");if(e){e.resume()}}};W.prototype._suspendManagementTableBinding=function(){if(this.oManagementTable){var e=this.oManagementTable.getBinding("items");if(e){e.suspend()}}};W.prototype._anyInErrorState=function(e){var t;var i;var a=false;if(e){t=e.getItems();t.some(function(e){i=e.getCells()[W.COLUMN_NAME_IDX];if(i&&i.getValueState&&i.getValueState()===z.Error){a=true}return a})}return a};W.prototype._getFilters=function(e){var t=[];if(e){t.push(e)}t.push(this._getVisibleFilter());if(this.getShowFavorites()){t.push(this._getFilterFavorites())}return t};W.prototype._getVisibleFilter=function(){return new a({path:"visible",operator:n.EQ,value1:true})};W.prototype._getFilterFavorites=function(){return new a({path:"favorite",operator:n.EQ,value1:true})};W.prototype._verifyVariantNameConstraints=function(e,t){if(!e){return}var i=e.getValue();i=i.trim();if(!this._checkIsDuplicate(i,t)){if(i===""){e.setValueState(z.Error);e.setValueStateText(this._oRb.getText("VARIANT_MANAGEMENT_ERROR_EMPTY"))}else if(i.indexOf("{")>-1){e.setValueState(z.Error);e.setValueStateText(this._oRb.getText("VARIANT_MANAGEMENT_NOT_ALLOWED_CHAR",["{"]))}else if(i.length>W.MAX_NAME_LEN){e.setValueState(z.Error);e.setValueStateText(this._oRb.getText("VARIANT_MANAGEMENT_MAX_LEN",[W.MAX_NAME_LEN]))}else{e.setValueState(z.None);e.setValueStateText(null)}}else{e.setValueState(z.Error);e.setValueStateText(this._oRb.getText("VARIANT_MANAGEMENT_ERROR_DUPLICATE"))}};W.prototype._checkVariantNameConstraints=function(e,t){this._verifyVariantNameConstraints(e,t);if(this.oManagementDialog&&this.oManagementDialog.isOpen()){this._reCheckVariantNameConstraints()}};W.prototype._reCheckVariantNameConstraints=function(){var e;var t=false;if(this.oManagementTable){e=this.oManagementTable.getItems();e.some(function(e){var i=e.getBindingContext(this._sModelName).getObject();if(i&&i.visible){var a=e.getCells()[W.COLUMN_NAME_IDX];if(a&&a.getValueState&&a.getValueState()===z.Error){this._verifyVariantNameConstraints(a,i.key);if(a.getValueState()===z.Error){t=true}}}return t}.bind(this))}return t};W.prototype._checkIsDuplicate=function(e,t){if(this.oManagementDialog&&this.oManagementDialog.isOpen()){return this._checkIsDuplicateInManageTable(e,t)}return this._checkIsDuplicateInModel(e,t)};W.prototype._checkIsDuplicateInModel=function(e,t){var i=false;var a=this._getItems();var n=e.toLowerCase();a.some(function(e){if(e.title.toLowerCase()===n){if(t&&t===e.key){return false}i=true}return i});return i};W.prototype._checkIsDuplicateInManageTable=function(e,t){var i;var a=false;var n=e.toLowerCase();if(this.oManagementTable){i=this.oManagementTable.getItems();i.some(function(e){var i;var o=e.getBindingContext(this._sModelName).getObject();if(o&&o.visible){var s=e.getCells()[W.COLUMN_NAME_IDX];if(s&&o.key!==t){if(s.isA("sap.m.Input")){i=s.getValue().toLowerCase()}else{i=s.getTitle().toLowerCase()}if(i===n){a=true}}}return a}.bind(this))}return a};W.prototype.exit=function(){var e;if(this.oVariantInvisibleText){this.oVariantInvisibleText.destroy(true);this.oVariantInvisibleText=undefined}if(this.oDefault&&!this.oDefault._bIsBeingDestroyed){this.oDefault.destroy()}this.oDefault=undefined;if(this.oExecuteOnSelect&&!this.oExecuteOnSelect._bIsBeingDestroyed){this.oExecuteOnSelect.destroy()}this.oExecuteOnSelect=undefined;this._oRb=undefined;this.oContext=undefined;this._oVariantList=undefined;this.oVariantSelectionPage=undefined;this.oVariantLayout=undefined;this.oVariantText=undefined;this.oVariantModifiedText=undefined;this.oVariantPopoverTrigger=undefined;this._oSearchField=undefined;this._oSearchFieldOnMgmtDialog=undefined;e=this.getModel(W.INNER_MODEL_NAME);if(e){e.destroy()}if(this._sStyleClass){this._sStyleClass=undefined}};return W});