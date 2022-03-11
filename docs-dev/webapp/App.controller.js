sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        "sap/ui/core/ComponentSupport"
    ],
    (Controller, JSONModel) => {
        return Controller.extend("capcom.recap.App", {
            onInit() {
                const oModel = new JSONModel({
                    hereswhy: `<p>the pandemic isn't over - and as much as we'd like to have everyone come together in person,<br>
              we can and will not risk to accidentally create a superspreader event</p>`
                })
                this.getView().setModel(oModel)
            }
        })
    }
)
