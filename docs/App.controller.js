sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        "sap/ui/core/ComponentSupport"
    ],
    (Controller, JSONModel) => {
        return Controller.extend("capcom.recap.App", {
            onInit() {
                const Model = new JSONModel({
                    cli: `<p class="green terminal">$&gt; <input type="text" id="terminal" class="cmd terminal" placeholder="cds info"></p>`
                })
                this.getView().setModel(Model)
            },
            onAfterRendering() {
                const ui5 = this
                const prompt = document.getElementById("terminal")
                prompt.focus()
                prompt.addEventListener("keydown", (event) => {
                    if (event.key === "Enter" || event.keyCode === 13) {
                        if (prompt.value === "cds info") {
                            ui5.byId("zsh").setVisible(false)
                            ui5.typeIt(`[CfP] done (> May 21)
[sessions] confirmations > June 4
[agenda] > June 11`)
                        }
                    }
                })
            },
            typeIt(m) {
                const delay = (ms) => {
                    return new Promise((resolve) => setTimeout(resolve, ms))
                }
                let cursor
                const reducer = async (accumulator, curr) => {
                    const res = await accumulator
                    await delay(150)
                    const acc = `${res}${curr}`
                    cursor.setText(acc)
                    return acc
                }
                if (m) {
                    cursor = this.byId("output")
                    cursor.setVisible(true)
                    Promise.resolve().then((_) => {
                        return m.split("").reduce(reducer, "")
                    })
                }
            }
        })
    }
)
