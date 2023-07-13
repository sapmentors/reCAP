sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        "sap/base/security/URLListValidator",
        "sap/ui/core/ComponentSupport",
    ],
    (Controller, JSONModel, URLListValidator, Fragment) => {
        return Controller.extend("recap.App", {
            onInit() {
                const viewStates = new JSONModel({
                    plannerBusy: true,
                    landscape: sap.ui.Device.orientation.landscape,
                })
                this.getView().setModel(viewStates, "view")
                sap.ui.Device.orientation.attachHandler((oEvent) => {
                    this.getView()
                        .getModel("view")
                        .setProperty("/landscape", oEvent.landscape)
                })

                URLListValidator.add("mailto")
                URLListValidator.add("https")
                URLListValidator.add("data")
                const oModel = new JSONModel({
                    pics: `<p>📸&nbsp;&nbsp;<a href="https://photos.google.com/share/AF1QipOY4rVHUwVZCWE19QKJuCVJo1rc1MZ50DvFjSN5KYbDptsqkEUQcpL2JUeiABeQjQ?key=bjhGWXBFRVBzY2NnNGNfN2lKdlIyekFXQ2pZUDBB">Event Impressions</a></p>
                    <p>🎦&nbsp;&nbsp;<a href="https://broadcast.sap.com/replay/23707_reCAP2023">AudiMax Track</a></p>`,
                })
                this.getView().setModel(oModel)
            },
        })
    }
)
