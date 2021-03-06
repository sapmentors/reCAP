/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(
    [
        "sap/ui/core/Control",
        "./library",
        "sap/ui/core/LabelEnablement",
        "sap/ui/core/InvisibleText",
        "sap/ui/core/library",
        "sap/ui/Device",
        "./FileUploaderRenderer",
        "sap/ui/dom/containsOrEquals",
        "sap/ui/events/KeyCodes",
        "sap/base/Log",
        "sap/base/security/encodeXML",
        "sap/ui/thirdparty/jquery",
        "sap/ui/dom/jquery/Aria"
    ],
    function (e, t, i, r, s, o, a, l, n, p, h, u) {
        var d = s.ValueState
        var f = t.FileUploaderHttpRequestMethod
        var g = e.extend("sap.ui.unified.FileUploader", {
            metadata: {
                interfaces: [
                    "sap.ui.core.IFormContent",
                    "sap.ui.unified.IProcessableBlobs"
                ],
                library: "sap.ui.unified",
                designtime: "sap/ui/unified/designtime/FileUploader.designtime",
                properties: {
                    value: { type: "string", group: "Data", defaultValue: "" },
                    enabled: {
                        type: "boolean",
                        group: "Behavior",
                        defaultValue: true
                    },
                    uploadUrl: {
                        type: "sap.ui.core.URI",
                        group: "Data",
                        defaultValue: ""
                    },
                    name: { type: "string", group: "Data", defaultValue: null },
                    width: {
                        type: "sap.ui.core.CSSSize",
                        group: "Misc",
                        defaultValue: ""
                    },
                    uploadOnChange: {
                        type: "boolean",
                        group: "Behavior",
                        defaultValue: false
                    },
                    additionalData: {
                        type: "string",
                        group: "Data",
                        defaultValue: null
                    },
                    sameFilenameAllowed: {
                        type: "boolean",
                        group: "Behavior",
                        defaultValue: false
                    },
                    buttonText: {
                        type: "string",
                        group: "Misc",
                        defaultValue: null
                    },
                    fileType: {
                        type: "string[]",
                        group: "Data",
                        defaultValue: null
                    },
                    multiple: {
                        type: "boolean",
                        group: "Behavior",
                        defaultValue: false
                    },
                    maximumFileSize: {
                        type: "float",
                        group: "Data",
                        defaultValue: null
                    },
                    mimeType: {
                        type: "string[]",
                        group: "Data",
                        defaultValue: null
                    },
                    sendXHR: {
                        type: "boolean",
                        group: "Behavior",
                        defaultValue: false
                    },
                    httpRequestMethod: {
                        type: "sap.ui.unified.FileUploaderHttpRequestMethod",
                        group: "Behavior",
                        defaultValue: f.Post
                    },
                    placeholder: {
                        type: "string",
                        group: "Appearance",
                        defaultValue: null
                    },
                    style: {
                        type: "string",
                        group: "Appearance",
                        defaultValue: null
                    },
                    buttonOnly: {
                        type: "boolean",
                        group: "Appearance",
                        defaultValue: false
                    },
                    useMultipart: {
                        type: "boolean",
                        group: "Behavior",
                        defaultValue: true
                    },
                    maximumFilenameLength: {
                        type: "int",
                        group: "Data",
                        defaultValue: null
                    },
                    valueState: {
                        type: "sap.ui.core.ValueState",
                        group: "Data",
                        defaultValue: d.None
                    },
                    valueStateText: {
                        type: "string",
                        group: "Misc",
                        defaultValue: null
                    },
                    icon: {
                        type: "sap.ui.core.URI",
                        group: "Appearance",
                        defaultValue: ""
                    },
                    iconHovered: {
                        type: "sap.ui.core.URI",
                        group: "Appearance",
                        defaultValue: ""
                    },
                    iconSelected: {
                        type: "sap.ui.core.URI",
                        group: "Appearance",
                        defaultValue: ""
                    },
                    iconFirst: {
                        type: "boolean",
                        group: "Appearance",
                        defaultValue: true
                    },
                    iconOnly: {
                        type: "boolean",
                        group: "Appearance",
                        defaultValue: false
                    }
                },
                aggregations: {
                    parameters: {
                        type: "sap.ui.unified.FileUploaderParameter",
                        multiple: true,
                        singularName: "parameter"
                    },
                    headerParameters: {
                        type: "sap.ui.unified.FileUploaderParameter",
                        multiple: true,
                        singularName: "headerParameter"
                    },
                    xhrSettings: {
                        type: "sap.ui.unified.FileUploaderXHRSettings",
                        multiple: false
                    }
                },
                associations: {
                    ariaDescribedBy: {
                        type: "sap.ui.core.Control",
                        multiple: true,
                        singularName: "ariaDescribedBy"
                    },
                    ariaLabelledBy: {
                        type: "sap.ui.core.Control",
                        multiple: true,
                        singularName: "ariaLabelledBy"
                    }
                },
                events: {
                    change: {
                        parameters: {
                            newValue: { type: "string" },
                            files: { type: "object[]" }
                        }
                    },
                    uploadComplete: {
                        parameters: {
                            fileName: { type: "string" },
                            response: { type: "string" },
                            readyStateXHR: { type: "string" },
                            status: { type: "string" },
                            responseRaw: { type: "string" },
                            headers: { type: "object" },
                            requestHeaders: { type: "object[]" }
                        }
                    },
                    typeMissmatch: {
                        parameters: {
                            fileName: { type: "string" },
                            fileType: { type: "string" },
                            mimeType: { type: "string" }
                        }
                    },
                    fileSizeExceed: {
                        parameters: {
                            fileName: { type: "string" },
                            fileSize: { type: "string" }
                        }
                    },
                    fileEmpty: { parameters: { fileName: { type: "string" } } },
                    fileAllowed: {},
                    uploadProgress: {
                        parameters: {
                            lengthComputable: { type: "boolean" },
                            loaded: { type: "float" },
                            total: { type: "float" },
                            fileName: { type: "string" },
                            requestHeaders: { type: "object[]" }
                        }
                    },
                    uploadAborted: {
                        parameters: {
                            fileName: { type: "string" },
                            requestHeaders: { type: "object[]" }
                        }
                    },
                    filenameLengthExceed: {
                        parameters: { fileName: { type: "string" } }
                    },
                    uploadStart: {
                        parameters: {
                            fileName: { type: "string" },
                            requestHeaders: { type: "object[]" }
                        }
                    }
                }
            }
        })
        g.prototype.init = function () {
            var e = this
            this.oFilePath = t.FileUploaderHelper.createTextField(
                this.getId() + "-fu_input"
            ).addEventDelegate({
                onAfterRendering: function () {
                    if (e.getWidth()) {
                        e._resizeDomElements()
                    }
                }
            })
            this.oBrowse = t.FileUploaderHelper.createButton(
                this.getId() + "-fu_button"
            )
            this.oFilePath.setParent(this)
            this.oBrowse.setParent(this)
            this.oFileUpload = null
            this.bMobileLib =
                this.oBrowse.getMetadata().getName() == "sap.m.Button"
            if (!this.getIconOnly()) {
                this.oBrowse.setText(this.getBrowseText())
            } else {
                this.oBrowse.setTooltip(this.getBrowseText())
            }
            if (sap.ui.getCore().getConfiguration().getAccessibility()) {
                if (!g.prototype._sAccText) {
                    var i = sap.ui
                        .getCore()
                        .getLibraryResourceBundle("sap.ui.unified")
                    g.prototype._sAccText = i.getText("FILEUPLOAD_ACC")
                }
                if (this.oBrowse.addAriaDescribedBy) {
                    this.oBrowse.addAriaDescribedBy(this.getId() + "-AccDescr")
                }
                if (this.oFilePath) {
                    this.oFilePath.addAriaLabelledBy(
                        r.getStaticId("sap.ui.unified", "FILEUPLOAD_FILENAME")
                    )
                }
            }
            this._submitAfterRendering = false
        }
        g.prototype.setButtonText = function (e) {
            this.setProperty("buttonText", e, false)
            if (!this.getIconOnly()) {
                this.oBrowse.setText(e || this.getBrowseText())
            } else {
                this.oBrowse.setTooltip(this.getBrowseText())
            }
            return this
        }
        g.prototype.setIcon = function (e) {
            this.oBrowse.setIcon(e)
            this.setProperty("icon", e, false)
            return this
        }
        g.prototype.setIconHovered = function (e) {
            this.setProperty("iconHovered", e, false)
            if (this.oBrowse.setIconHovered) {
                this.oBrowse.setIconHovered(e)
            }
            return this
        }
        g.prototype.setIconSelected = function (e) {
            this.setProperty("iconSelected", e, false)
            if (this.oBrowse.setIconSelected) {
                this.oBrowse.setIconSelected(e)
            } else {
                this.oBrowse.setActiveIcon(e)
            }
            return this
        }
        g.prototype.setIconFirst = function (e) {
            this.oBrowse.setIconFirst(e)
            this.setProperty("iconFirst", e, false)
            return this
        }
        g.prototype.setIconOnly = function (e) {
            this.setProperty("iconOnly", e, false)
            if (e) {
                this.oBrowse.setText("")
                this.oBrowse.setTooltip(this.getBrowseText())
            } else {
                this.oBrowse.setText(
                    this.getButtonText() || this.getBrowseText()
                )
                this.oBrowse.setTooltip("")
            }
            return this
        }
        g.prototype.getIdForLabel = function () {
            return this.oBrowse.getId()
        }
        g.prototype._ensureBackwardsReference = function () {
            var e = this.oBrowse,
                t = e.getAriaLabelledBy(),
                r = i.getReferencingLabels(this)
            if (t) {
                r.forEach(function (i) {
                    if (t.indexOf(i) === -1) {
                        e.addAriaLabelledBy(i)
                    }
                })
            }
            return this
        }
        g.prototype.setFileType = function (e) {
            var t = this._convertTypesToArray(e)
            this.setProperty("fileType", t, false)
            this._rerenderInputField()
            return this
        }
        g.prototype.setMimeType = function (e) {
            var t = this._convertTypesToArray(e)
            this.setProperty("mimeType", t, false)
            this._rerenderInputField()
            return this
        }
        g.prototype.setMultiple = function (e) {
            this.setProperty("multiple", e, false)
            this._rerenderInputField()
            return this
        }
        g.prototype._rerenderInputField = function () {
            if (this.oFileUpload) {
                var e = this.oFileUpload.files
                this._clearInputField()
                this._prepareFileUpload()
                u(this.oFileUpload).on("change", this.handlechange.bind(this))
                this.oFileUpload.files = e
            }
        }
        g.prototype.setTooltip = function (e) {
            var t, i
            this._refreshTooltipBaseDelegate(e)
            this.setAggregation("tooltip", e, true)
            this._updateAccDescription()
            if (this.oFileUpload) {
                t = this.getTooltip_AsString()
                i = this.$().find(".sapUiFupInputMask")[0]
                if (t) {
                    this.oFileUpload.setAttribute("title", t)
                    i && i.setAttribute("title", t)
                } else {
                    this.oFileUpload.removeAttribute("title")
                    i && i.removeAttribute("title")
                }
            }
            return this
        }
        g.prototype.addAriaLabelledBy = function (e) {
            this.addAssociation("ariaLabelledBy", e)
            this.oBrowse.addAriaLabelledBy(e)
            return this
        }
        g.prototype.removeAriaLabelledBy = function (e) {
            var t = this.removeAssociation("ariaLabelledBy", e)
            this.oBrowse.removeAriaLabelledBy(t)
            return t
        }
        g.prototype.removeAllAriaLabelledBy = function () {
            var e = this.removeAllAssociation("ariaLabelledBy"),
                t = this.oBrowse.getAriaLabelledBy()
            e.forEach(
                function (e) {
                    if (t.indexOf(e) >= 0) {
                        this.oBrowse.removeAriaLabelledBy(e)
                    }
                }.bind(this)
            )
            return e
        }
        g.prototype.addAriaDescribedBy = function (e) {
            this.addAssociation("ariaDescribedBy", e)
            this.oBrowse.addAriaDescribedBy(e)
            return this
        }
        g.prototype.removeAriaDescribedBy = function (e) {
            var t = this.removeAssociation("ariaDescribedBy", e)
            this.oBrowse.removeAriaDescribedBy(t)
            return t
        }
        g.prototype.removeAllAriaDescribedBy = function () {
            var e = this.removeAllAssociation("ariaDescribedBy"),
                t = this.oBrowse.getAriaDescribedBy()
            e.forEach(
                function (e) {
                    if (t.indexOf(e) >= 0) {
                        this.oBrowse.removeAriaDescribedBy(e)
                    }
                }.bind(this)
            )
            return e
        }
        g.prototype._generateAccDescriptionText = function () {
            var e = this.getTooltip_AsString(),
                t = this.getPlaceholder(),
                r = this.getValue(),
                s = i.isRequired(this),
                o = ""
            if (s) {
                o +=
                    sap.ui
                        .getCore()
                        .getLibraryResourceBundle("sap.ui.unified")
                        .getText("FILEUPLOAD_REQUIRED") + " "
            }
            if (e) {
                o += e + " "
            }
            if (r) {
                o += r + " "
            } else if (t) {
                o += t + " "
            }
            o += this._sAccText
            return o
        }
        g.prototype._updateAccDescription = function () {
            var e = document.getElementById(this.getId() + "-AccDescr"),
                t = this._generateAccDescriptionText()
            if (e) {
                e.innerHTML = h(t)
            }
        }
        g.prototype._convertTypesToArray = function (e) {
            if (typeof e === "string") {
                if (e === "") {
                    return []
                } else {
                    return e.split(",").map(function (e) {
                        return e.trim()
                    })
                }
            }
            return e
        }
        g.prototype.exit = function () {
            this.oFilePath.destroy()
            this.oBrowse.destroy()
            if (this.oIFrameRef) {
                u(this.oIFrameRef).off()
                sap.ui.getCore().getStaticAreaRef().removeChild(this.oIFrameRef)
                this.oIFrameRef = null
            }
            if (this.oFileUpload) {
                this._clearInputField()
            }
        }
        g.prototype._clearInputField = function () {
            u(this.oFileUpload).off()
            this.oFileUpload.parentElement.removeChild(this.oFileUpload)
            this.oFileUpload = null
        }
        g.prototype.onBeforeRendering = function () {
            var e = sap.ui.getCore().getStaticAreaRef()
            u(this.oFileUpload).appendTo(e)
            if (!this.getName()) {
                p.warning(
                    "Name property is not set. Id would be used instead to identify the control on the server.",
                    this
                )
            }
            u(this.oFileUpload).off()
        }
        g.prototype.onAfterRendering = function () {
            this.prepareFileUploadAndIFrame()
            this._cacheDOMEls()
            this._addLabelFeaturesToBrowse()
            u(this.oFileUpload).on("change", this.handlechange.bind(this))
            if (!this.bMobileLib) {
                this.oFilePath.$().attr("tabindex", "-1")
            } else {
                this.oFilePath.$().find("input").attr("tabindex", "-1")
            }
            if (!!o.browser.internet_explorer && o.browser.version == 9) {
                this.oBrowse.$().attr("tabindex", "-1")
            }
            setTimeout(this._recalculateWidth.bind(this), 0)
            this.oFilePath
                .$()
                .find("input")
                .removeAttr("role")
                .attr("aria-live", "polite")
            if (this.getValueState() === d.Error && this.getEnabled()) {
                this.oBrowse.$().attr("aria-invalid", "true")
            }
            if (this._submitAfterRendering) {
                this._submitAndResetValue()
                this._submitAfterRendering = false
            }
        }
        g.prototype._cacheDOMEls = function () {
            this.FUEl = this.getDomRef("fu")
            this.FUDataEl = this.getDomRef("fu_data")
        }
        g.prototype.onfocusin = function (e) {
            if (
                !this.oFilePath.shouldValueStateMessageBeOpened ||
                this.oFilePath.shouldValueStateMessageBeOpened()
            ) {
                this.openValueStateMessage()
            }
        }
        g.prototype.onsapfocusleave = function (e) {
            if (
                !e.relatedControlId ||
                !l(
                    this.getDomRef(),
                    sap.ui.getCore().byId(e.relatedControlId).getFocusDomRef()
                )
            ) {
                this.closeValueStateMessage()
            }
        }
        g.prototype._recalculateWidth = function () {
            if (this.getWidth()) {
                if (this.getButtonOnly() && this.oBrowse.getDomRef()) {
                    this.oBrowse.getDomRef().style.width = this.getWidth()
                }
                this._resizeDomElements()
            }
        }
        g.prototype.getFocusDomRef = function () {
            return this.$("fu").get(0)
        }
        g.prototype._resizeDomElements = function () {
            var e = this.getId()
            this._oBrowseDomRef = this.oBrowse.getDomRef()
            var t = u(this._oBrowseDomRef)
            var i = t.parent().outerWidth(true)
            this._oFilePathDomRef = this.oFilePath.getDomRef()
            var r = this._oFilePathDomRef
            var s = this.getWidth()
            if (s.substr(-1) == "%" && r) {
                while (r.id != e) {
                    r.style.width = "100%"
                    r = r.parentNode
                }
                r.style.width = s
            } else {
                if (r) {
                    r.style.width = s
                    var a = u(this._oFilePathDomRef)
                    var l = a.outerWidth() - i
                    if (l < 0) {
                        this.oFilePath.getDomRef().style.width = "0px"
                        if (this.oFileUpload && !o.browser.internet_explorer) {
                            this.oFileUpload.style.width = t.outerWidth(true)
                        }
                    } else {
                        this.oFilePath.getDomRef().style.width = l + "px"
                    }
                }
            }
        }
        g.prototype.onresize = function () {
            this._recalculateWidth()
        }
        g.prototype.onThemeChanged = function () {
            this._recalculateWidth()
        }
        g.prototype.setEnabled = function (e) {
            var t = u(this.oFileUpload)
            this.setProperty("enabled", e)
            this.oFilePath.setEnabled(e)
            this.oBrowse.setEnabled(e)
            e ? t.removeAttr("disabled") : t.attr("disabled", "disabled")
            return this
        }
        g.prototype.setValueState = function (e) {
            this.setProperty("valueState", e, true)
            if (this.oFilePath.setValueState) {
                this.oFilePath.setValueState(e)
            } else {
                p.warning(
                    "Setting the valueState property with the combination of libraries used is not supported.",
                    this
                )
            }
            if (this.oBrowse.getDomRef()) {
                if (e === d.Error && this.getEnabled()) {
                    this.oBrowse.$().attr("aria-invalid", "true")
                } else {
                    this.oBrowse.$().removeAttr("aria-invalid")
                }
            }
            if (l(this.getDomRef(), document.activeElement)) {
                switch (e) {
                    case d.Error:
                    case d.Warning:
                    case d.Success:
                        this.openValueStateMessage()
                        break
                    default:
                        this.closeValueStateMessage()
                }
            }
            return this
        }
        g.prototype.setValueStateText = function (e) {
            if (this.oFilePath.setValueStateText) {
                this.oFilePath.setValueStateText(e)
            } else {
                p.warning(
                    "Setting the valueStateText property with the combination of libraries used is not supported.",
                    this
                )
            }
            return this.setProperty("valueStateText", e, true)
        }
        g.prototype.setPlaceholder = function (e) {
            this.setProperty("placeholder", e, true)
            this.oFilePath.setPlaceholder(e)
            this._updateAccDescription()
            return this
        }
        g.prototype.setStyle = function (e) {
            this.setProperty("style", e, true)
            if (e) {
                if (e == "Transparent") {
                    if (this.oBrowse.setLite) {
                        this.oBrowse.setLite(true)
                    } else {
                        this.oBrowse.setType("Transparent")
                    }
                } else {
                    if (this.oBrowse.setType) {
                        this.oBrowse.setType(e)
                    } else {
                        if (e == "Emphasized") {
                            e = "Emph"
                        }
                        this.oBrowse.setStyle(e)
                    }
                }
            }
            return this
        }
        g.prototype.setValue = function (e, t, i) {
            var r = this.getValue()
            var s
            if (r != e || this.getSameFilenameAllowed()) {
                var o = this.getUploadOnChange() && e
                this.setProperty("value", e, o)
                if (this.oFilePath) {
                    this.oFilePath.setValue(e)
                    if (
                        this.oBrowse.getDomRef() &&
                        !i &&
                        l(this.getDomRef(), document.activeElement)
                    ) {
                        this.oBrowse.focus()
                    }
                }
                var a = this.getDomRef("fu_form"),
                    n = this.getDomRef("fu_input-inner")
                if (this.oFileUpload && a && !e) {
                    a.reset()
                    this.getDomRef("fu_input").value = ""
                    if (n) {
                        n.value = ""
                    }
                    u(this.FUDataEl).val(this.getAdditionalData())
                }
                if (t) {
                    if (window.File) {
                        s = this.FUEl.files
                    }
                    if (!this.getSameFilenameAllowed() || e) {
                        this.fireChange({
                            id: this.getId(),
                            newValue: e,
                            files: s
                        })
                    }
                }
                if (o) {
                    this.upload()
                }
            }
            return this
        }
        g.prototype.clear = function () {
            var e = this.getDomRef("fu_form")
            if (e) {
                e.reset()
            }
            return this.setValue("", false, true)
        }
        g.prototype.onmousedown = function (e) {
            if (!this.bMobileLib) {
                this.oBrowse.onmousedown(e)
            }
        }
        g.prototype.onmouseup = function (e) {
            if (!this.bMobileLib) {
                this.oBrowse.onmouseup(e)
            }
        }
        g.prototype.onmouseover = function (e) {
            if (!this.bMobileLib) {
                u(this.oBrowse.getDomRef()).addClass("sapUiBtnStdHover")
                this.oBrowse.onmouseover(e)
            }
        }
        g.prototype.onmouseout = function (e) {
            if (!this.bMobileLib) {
                u(this.oBrowse.getDomRef()).removeClass("sapUiBtnStdHover")
                this.oBrowse.onmouseout(e)
            }
        }
        g.prototype.setAdditionalData = function (e) {
            this.setProperty("additionalData", e, true)
            var t = this.FUDataEl
            if (t) {
                e = this.getAdditionalData() || ""
                t.value = e
            }
            return this
        }
        g.prototype.sendFiles = function (e, t) {
            var i = this
            var r = true
            for (var s = 0; s < e.length; s++) {
                if (!e[s].bPosted) {
                    r = false
                    break
                }
            }
            if (r) {
                if (this.getSameFilenameAllowed() && this.getUploadOnChange()) {
                    i.setValue("", true)
                }
                return
            }
            var a = e[t]
            var l = a.file.name ? a.file.name : "MultipartFile"
            if (
                (o.browser.edge || o.browser.internet_explorer) &&
                a.file.type &&
                a.xhr.readyState == 1 &&
                !a.requestHeaders.filter(function (e) {
                    return e.name.toLowerCase() == "content-type"
                }).length
            ) {
                var n = a.file.type
                a.xhr.setRequestHeader("Content-Type", n)
                a.requestHeaders.push({ name: "Content-Type", value: n })
            }
            var p = a.requestHeaders
            var h = function (e) {
                var t = {
                    lengthComputable: !!e.lengthComputable,
                    loaded: e.loaded,
                    total: e.total
                }
                i.fireUploadProgress({
                    lengthComputable: t.lengthComputable,
                    loaded: t.loaded,
                    total: t.total,
                    fileName: l,
                    requestHeaders: p
                })
            }
            a.xhr.upload.addEventListener("progress", h)
            a.xhr.onreadystatechange = function () {
                var e
                var t
                var r = {}
                var s
                var o
                var n
                var h
                h = a.xhr.readyState
                var u = a.xhr.status
                if (a.xhr.readyState == 4) {
                    if (a.xhr.responseXML) {
                        e = a.xhr.responseXML.documentElement.textContent
                    }
                    t = a.xhr.response
                    s = a.xhr.getAllResponseHeaders()
                    if (s) {
                        o = s.split("\r\n")
                        for (var d = 0; d < o.length; d++) {
                            if (o[d]) {
                                n = o[d].indexOf(": ")
                                r[o[d].substring(0, n)] = o[d].substring(n + 2)
                            }
                        }
                    }
                    i.fireUploadComplete({
                        fileName: l,
                        headers: r,
                        response: e,
                        responseRaw: t,
                        readyStateXHR: h,
                        status: u,
                        requestHeaders: p
                    })
                }
                i._bUploading = false
            }
            if (a.xhr.readyState === 0 || a.bPosted) {
                t++
                i.sendFiles(e, t)
            } else {
                a.xhr.send(a.file)
                a.bPosted = true
                t++
                i.sendFiles(e, t)
            }
        }
        g.prototype.upload = function (e) {
            var t, i
            if (!this.getEnabled()) {
                return
            }
            t = this.getDomRef("fu_form")
            try {
                this._bUploading = true
                if (this.getSendXHR() && window.File) {
                    var r = this.FUEl.files
                    if (e) {
                        this._sendProcessedFilesWithXHR(r)
                    } else {
                        this._sendFilesWithXHR(r)
                    }
                } else if (t) {
                    i = t.getAttribute("action")
                    if (i !== this.getUploadUrl()) {
                        this._submitAfterRendering = true
                    } else {
                        this._submitAndResetValue()
                    }
                }
            } catch (e) {
                p.error("File upload failed:\n" + e.message)
            }
        }
        g.prototype._submitAndResetValue = function () {
            var e = this.getDomRef("fu_form")
            e.submit()
            this.fireUploadStart()
            this._resetValueAfterUploadStart()
        }
        g.prototype.abort = function (e, t) {
            if (!this.getUseMultipart()) {
                var i = this._aXhr.length - 1
                for (var r = i; r > -1; r--) {
                    if (e && t) {
                        for (
                            var s = 0;
                            s < this._aXhr[r].requestHeaders.length;
                            s++
                        ) {
                            var o = this._aXhr[r].requestHeaders[s].name
                            var a = this._aXhr[r].requestHeaders[s].value
                            if (o == e && a == t) {
                                this._aXhr[r].xhr.abort()
                                this.fireUploadAborted({
                                    fileName: this._aXhr[r].fileName,
                                    requestHeaders: this._aXhr[r].requestHeaders
                                })
                                this._aXhr.splice(r, 1)
                                p.info("File upload aborted.")
                                break
                            }
                        }
                    } else {
                        this._aXhr[r].xhr.abort()
                        this.fireUploadAborted({
                            fileName: this._aXhr[r].fileName,
                            requestHeaders: this._aXhr[r].requestHeaders
                        })
                        this._aXhr.splice(r, 1)
                        p.info("File upload aborted.")
                    }
                }
            } else if (this._uploadXHR && this._uploadXHR.abort) {
                this._uploadXHR.abort()
                this.fireUploadAborted({ fileName: null, requestHeaders: null })
                p.info("File upload aborted.")
            }
        }
        g.prototype.onkeypress = function (e) {
            this.onkeydown(e)
        }
        g.prototype.onclick = function (e) {
            if (this.getSameFilenameAllowed() && this.getEnabled()) {
                this.setValue("", true)
            }
            if (
                this.oBrowse.getDomRef() &&
                (o.browser.safari ||
                    l(this.getDomRef(), document.activeElement))
            ) {
                this.oBrowse.focus()
            }
        }
        g.prototype.onkeydown = function (e) {
            if (!this.getEnabled()) {
                return
            }
            if (this.getSameFilenameAllowed() && this.getUploadOnChange()) {
                this.setValue("", true)
            }
            var t = e.keyCode,
                i = n
            if (t == i.DELETE || t == i.BACKSPACE) {
                if (this.oFileUpload) {
                    this.setValue("", true)
                }
            } else if (t == i.SPACE || t == i.ENTER) {
                if (
                    !(
                        !!o.browser.internet_explorer && o.browser.version <= 9
                    ) &&
                    this.oFileUpload
                ) {
                    this.oFileUpload.click()
                    e.preventDefault()
                    e.stopPropagation()
                }
            } else if (
                t != i.TAB &&
                t != i.SHIFT &&
                t != i.F6 &&
                t != i.PAGE_UP &&
                t != i.PAGE_DOWN &&
                t != i.ESCAPE &&
                t != i.END &&
                t != i.HOME &&
                t != i.ARROW_LEFT &&
                t != i.ARROW_UP &&
                t != i.ARROW_RIGHT &&
                t != i.ARROW_DOWN
            ) {
                e.preventDefault()
                e.stopPropagation()
            }
        }
        g.prototype._isFilenameTooLong = function (e) {
            var t = this.getMaximumFilenameLength()
            if (t !== 0 && e.length > t) {
                p.info(
                    "The filename of " +
                        e +
                        " (" +
                        e.length +
                        " characters)  is longer than the maximum of " +
                        t +
                        " characters."
                )
                return true
            }
            return false
        }
        g.prototype.handlechange = function (e) {
            if (this.oFileUpload && this.getEnabled()) {
                var t = this.getFileType()
                var i = ""
                var r, s, a, l
                var n = this.getDomRef("fu_form")
                if (window.File) {
                    var h = e.target.files
                    if (this._areFilesAllowed(h)) {
                        this.fireFileAllowed()
                        i = this._generateInputValue(h)
                    } else {
                        n.reset()
                        this.setValue("", true, true)
                        return
                    }
                } else if (t && t.length > 0) {
                    r = true
                    s = this.oFileUpload.value || ""
                    a = s.lastIndexOf(".")
                    l = a === -1 ? "" : s.substring(a + 1)
                    for (var u = 0; u < t.length; u++) {
                        if (l == t[u]) {
                            r = false
                        }
                    }
                    if (r) {
                        p.info(
                            "File: " +
                                s +
                                " is of type " +
                                l +
                                ". Allowed types are: " +
                                t +
                                "."
                        )
                        this.fireTypeMissmatch({ fileName: s, fileType: l })
                        n.reset()
                        this.setValue("", true, true)
                        return
                    }
                    if (this._isFilenameTooLong(s)) {
                        this.fireFilenameLengthExceed({ fileName: s })
                        n.reset()
                        this.setValue("", true, true)
                        return
                    }
                    if (s) {
                        this.fireFileAllowed()
                    }
                }
                var d = this.oFileUpload.value || ""
                var f = d.lastIndexOf("\\")
                if (f >= 0) {
                    d = d.substring(f + 1)
                }
                if (this.getMultiple()) {
                    if (
                        !(o.browser.internet_explorer && o.browser.version <= 9)
                    ) {
                        d = i
                    }
                }
                if (d || o.browser.chrome) {
                    this.setValue(d, true)
                }
            }
        }
        g.prototype._sendFilesWithXHR = function (e) {
            var t,
                i,
                r,
                s,
                o = this.getXhrSettings()
            if (e.length > 0) {
                if (this.getUseMultipart()) {
                    t = 1
                } else {
                    t = e.length
                }
                this._aXhr = this._aXhr || []
                for (var a = 0; a < t; a++) {
                    this._uploadXHR = new window.XMLHttpRequest()
                    s = { xhr: this._uploadXHR, requestHeaders: [] }
                    this._aXhr.push(s)
                    s.xhr.open(
                        this.getHttpRequestMethod(),
                        this.getUploadUrl(),
                        true
                    )
                    if (o) {
                        s.xhr.withCredentials = o.getWithCredentials()
                    }
                    if (this.getHeaderParameters()) {
                        var l = this.getHeaderParameters()
                        for (var n = 0; n < l.length; n++) {
                            i = l[n].getName()
                            r = l[n].getValue()
                            s.requestHeaders.push({ name: i, value: r })
                        }
                    }
                    var p = e[a].name
                    var h = s.requestHeaders
                    s.fileName = p
                    s.file = e[a]
                    this.fireUploadStart({ fileName: p, requestHeaders: h })
                    for (var u = 0; u < h.length; u++) {
                        if (s.xhr.readyState === 0) {
                            break
                        }
                        i = h[u].name
                        r = h[u].value
                        s.xhr.setRequestHeader(i, r)
                    }
                }
                if (this.getUseMultipart()) {
                    var d = new window.FormData()
                    var f = this.FUEl.name
                    for (var g = 0; g < e.length; g++) {
                        this._appendFileToFormData(d, f, e[g])
                    }
                    d.append("_charset_", "UTF-8")
                    var c = this.FUDataEl.name
                    if (this.getAdditionalData()) {
                        var y = this.getAdditionalData()
                        d.append(c, y)
                    } else {
                        d.append(c, "")
                    }
                    if (this.getParameters()) {
                        var m = this.getParameters()
                        for (var b = 0; b < m.length; b++) {
                            var F = m[b].getName()
                            r = m[b].getValue()
                            d.append(F, r)
                        }
                    }
                    s.file = d
                    this.sendFiles(this._aXhr, 0)
                } else {
                    this.sendFiles(this._aXhr, 0)
                }
                this._bUploading = false
                this._resetValueAfterUploadStart()
            }
            return this
        }
        g.prototype._appendFileToFormData = function (e, t, i) {
            if (i instanceof window.Blob && i.name) {
                e.append(t, i, i.name)
            } else {
                e.append(t, i)
            }
        }
        g.prototype._sendProcessedFilesWithXHR = function (e) {
            this.getProcessedBlobsFromArray(e)
                .then(
                    function (e) {
                        this._sendFilesWithXHR(e)
                    }.bind(this)
                )
                .catch(function (e) {
                    p.error(
                        "File upload failed: " + e && e.message
                            ? e.message
                            : "no details available"
                    )
                })
            return this
        }
        g.prototype._areFilesAllowed = function (e) {
            var t,
                i,
                r,
                s,
                o,
                a = this.getMaximumFileSize(),
                l = this.getMimeType(),
                n = this.getFileType()
            for (var h = 0; h < e.length; h++) {
                t = e[h].name
                o = e[h].type || "unknown"
                var u = e[h].size / 1024 / 1024
                if (a && u > a) {
                    p.info(
                        "File: " +
                            t +
                            " is of size " +
                            u +
                            " MB which exceeds the file size limit of " +
                            a +
                            " MB."
                    )
                    this.fireFileSizeExceed({ fileName: t, fileSize: u })
                    return false
                }
                if (u === 0) {
                    p.info("File: " + t + " is empty!")
                    this.fireFileEmpty({ fileName: t })
                }
                if (this._isFilenameTooLong(t)) {
                    this.fireFilenameLengthExceed({ fileName: t })
                    return false
                }
                if (l && l.length > 0) {
                    var d = true
                    for (var f = 0; f < l.length; f++) {
                        if (o == l[f] || l[f] == "*/*" || o.match(l[f])) {
                            d = false
                        }
                    }
                    if (d && o !== "unknown") {
                        p.info(
                            "File: " +
                                t +
                                " is of type " +
                                o +
                                ". Allowed types are: " +
                                l +
                                "."
                        )
                        this.fireTypeMissmatch({ fileName: t, mimeType: o })
                        return false
                    }
                }
                if (n && n.length > 0) {
                    i = true
                    r = t.lastIndexOf(".")
                    s = r === -1 ? "" : t.substring(r + 1)
                    for (var g = 0; g < n.length; g++) {
                        if (s.toLowerCase() == n[g].toLowerCase()) {
                            i = false
                        }
                    }
                    if (i) {
                        p.info(
                            "File: " +
                                t +
                                " is of type " +
                                s +
                                ". Allowed types are: " +
                                n +
                                "."
                        )
                        this.fireTypeMissmatch({ fileName: t, fileType: s })
                        return false
                    }
                }
            }
            return true
        }
        g.prototype._sendFilesFromDragAndDrop = function (e) {
            if (this._areFilesAllowed(e)) {
                this._sendFilesWithXHR(e)
            }
            return this
        }
        g.prototype._generateInputValue = function (e) {
            var t = ""
            for (var i = 0; i < e.length; i++) {
                t = t + '"' + e[i].name + '" '
            }
            return t
        }
        g.prototype.getBrowseText = function () {
            if (!g.prototype._sBrowseText) {
                var e = sap.ui
                    .getCore()
                    .getLibraryResourceBundle("sap.ui.unified")
                g.prototype._sBrowseText = e.getText("FILEUPLOAD_BROWSE")
            }
            return g.prototype._sBrowseText
                ? g.prototype._sBrowseText
                : "Browse..."
        }
        g.prototype.getShortenValue = function () {
            return this.getValue()
        }
        g.prototype.prepareFileUploadAndIFrame = function () {
            this._prepareFileUpload()
            if (!this.oIFrameRef) {
                var e = document.createElement("iframe")
                e.style.display = "none"
                e.id = this.getId() + "-frame"
                sap.ui.getCore().getStaticAreaRef().appendChild(e)
                e.contentWindow.name = this.getId() + "-frame"
                this._bUploading = false
                u(e).on(
                    "load",
                    function (e) {
                        if (this._bUploading) {
                            p.info("File uploaded to " + this.getUploadUrl())
                            var t
                            try {
                                t = this.oIFrameRef.contentWindow.document.body
                                    .innerHTML
                            } catch (e) {}
                            this.fireUploadComplete({ response: t })
                            this._bUploading = false
                        }
                    }.bind(this)
                )
                this.oIFrameRef = e
            }
        }
        g.prototype._prepareFileUpload = function () {
            if (!this.oFileUpload) {
                var e = []
                e.push("<input ")
                e.push('type="file" ')
                e.push('aria-hidden="true" ')
                if (this.getName()) {
                    if (this.getMultiple()) {
                        if (
                            !(
                                o.browser.internet_explorer &&
                                o.browser.version <= 9
                            )
                        ) {
                            e.push('name="' + h(this.getName()) + '[]" ')
                        }
                    } else {
                        e.push('name="' + h(this.getName()) + '" ')
                    }
                } else {
                    if (this.getMultiple()) {
                        if (
                            !(
                                o.browser.internet_explorer &&
                                o.browser.version <= 9
                            )
                        ) {
                            e.push('name="' + this.getId() + '[]" ')
                        }
                    } else {
                        e.push('name="' + this.getId() + '" ')
                    }
                }
                e.push('id="' + this.getId() + '-fu" ')
                if (
                    !(!!o.browser.internet_explorer && o.browser.version == 9)
                ) {
                    e.push('tabindex="-1" ')
                }
                e.push('size="1" ')
                if (this.getTooltip_AsString()) {
                    e.push('title="' + h(this.getTooltip_AsString()) + '" ')
                } else if (this.getValue() !== "") {
                    e.push('title="' + h(this.getValue()) + '" ')
                }
                if (!this.getEnabled()) {
                    e.push('disabled="disabled" ')
                }
                if (this.getMultiple()) {
                    if (
                        !(o.browser.internet_explorer && o.browser.version <= 9)
                    ) {
                        e.push("multiple ")
                    }
                }
                if ((this.getMimeType() || this.getFileType()) && window.File) {
                    var t = this._getAcceptedTypes()
                    e.push('accept="' + h(t) + '" ')
                }
                e.push(">")
                this.oFileUpload = u(e.join(""))
                    .prependTo(this.$().find(".sapUiFupInputMask"))
                    .get(0)
            } else {
                u(this.oFileUpload).prependTo(
                    this.$().find(".sapUiFupInputMask")
                )
            }
        }
        g.prototype.openValueStateMessage = function () {
            if (this.oFilePath.openValueStateMessage) {
                this.oFilePath.openValueStateMessage()
                this.oBrowse
                    .$()
                    .addAriaDescribedBy(this.oFilePath.getId() + "-message")
            }
        }
        g.prototype.closeValueStateMessage = function () {
            if (this.oFilePath.closeValueStateMessage) {
                this.oFilePath.closeValueStateMessage()
                this.oBrowse
                    .$()
                    .removeAriaDescribedBy(this.oFilePath.getId() + "-message")
            }
        }
        g.prototype._getAcceptedTypes = function () {
            var e = this.getMimeType() || [],
                t = this.getFileType() || []
            t = t.map(function (e) {
                return e.indexOf(".") === 0 ? e : "." + e
            })
            return t.concat(e).join(",")
        }
        g.prototype._resetValueAfterUploadStart = function () {
            p.info("File uploading to " + this.getUploadUrl())
            if (
                this.getSameFilenameAllowed() &&
                this.getUploadOnChange() &&
                this.getUseMultipart()
            ) {
                this.setValue("", true)
            }
        }
        g.prototype._addLabelFeaturesToBrowse = function () {
            var e
            if (this.oBrowse && this.oBrowse.$().length) {
                e = this.oBrowse.$()
                e.attr("type', 'button")
                e.on(
                    "click",
                    function (e) {
                        e.preventDefault()
                        this.FUEl.click()
                    }.bind(this)
                )
            }
        }
        g.prototype.getProcessedBlobsFromArray = function (e) {
            return new Promise(function (t) {
                t(e)
            })
        }
        g.prototype.checkFileReadable = function () {
            return new Promise(
                function (e, t) {
                    var i
                    if (window.File && this.FUEl && this.FUEl.files.length) {
                        var i = new FileReader()
                        i.readAsArrayBuffer(this.FUEl.files[0].slice(0, 1))
                        i.onload = function () {
                            e()
                        }
                        i.onerror = function () {
                            t(i.error)
                        }
                    } else {
                        e()
                    }
                }.bind(this)
            )
        }
        return g
    }
)
