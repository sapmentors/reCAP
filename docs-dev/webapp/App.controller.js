sap.ui.define(
    ["sap/ui/core/mvc/Controller", "sap/ui/core/ComponentSupport"],
    Controller => {
        "use strict"
        return Controller.extend("capcom.recap.App", {
            onInit() {},
            onAfterRendering() {
                const sAgendaTableId = sap.ui.core.Fragment.createId("AgendaFragment", "Agenda")
                const oAgendaTable = this.byId(sAgendaTableId)
                this.byId("toAgenda").setHref(`#${oAgendaTable.getId()}`)
            }
        })
    }
)
