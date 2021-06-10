sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        "sap/ui/core/ComponentSupport"
    ],
    (Controller, JSONModel) => {
        return Controller.extend("capcom.recap.App", {
            daSpeakers(speakers) {
                return speakers
                    .map(
                        (speaker) => `${speaker.firstName} ${speaker.lastName}`
                    )
                    .join(", ")
            },
            async onInit() {
                const Model = new JSONModel({
                    cli: `<p class="green terminal">$&gt; <input type="text" id="terminal" class="cmd terminal" placeholder="cds info"></p>`
                })
                this.getView().setModel(Model)

                const _lineup = await fetch(
                    `https://recap.cfapps.eu10.hana.ondemand.com/api/proposal/lineup`
                ).then((r) => r.json())
                // inject opening, keynote, lunch, afterevent
                const lineup = _lineup.sort((a, b) => {
                    if (a.startTime < b.startTime) {
                        return -1
                    }
                    if (a.startTime > b.startTime) {
                        return 1
                    }
                    return 0
                })
                const LineupModel = new JSONModel(lineup)
                this.getView().setModel(LineupModel, "LineupModel")
            }
        })
    }
)
