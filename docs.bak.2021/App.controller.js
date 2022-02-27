sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        "sap/ui/core/ComponentSupport"
    ],
    (Controller, JSONModel) => {
        return Controller.extend("capcom.recap.App", {
            decode(encoded) {
                let _
                _ = document.createElement("span")
                _.innerHTML = encoded
                const __ = _.textContent || _.innerText
                _ = null
                return __
            },
            daSpeakers(speakers) {
                return speakers
                    .map(
                        (speaker) => `${speaker.firstName} ${speaker.lastName}`
                    )
                    .join(", ")
            },
            async onInit() {
                // get the live schedule
                let _lineup = await fetch("./lineup.json").then((r) => r.json())
                // sort by start time
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
            },

            onSponsorPress(sUrl) {
                window.open(sUrl)
            }
        })
    }
)
