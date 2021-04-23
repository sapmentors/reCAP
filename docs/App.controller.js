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
                    cli: `<p class="green terminal">$&gt; <input type="text" id="terminal" class="cmd terminal" placeholder="cds deploy"></p>`
                })
                this.getView().setModel(Model)
            },
            onAfterRendering() {
                const ui5 = this
                const prompt = document.getElementById("terminal")
                prompt.focus()
                prompt.addEventListener("keydown", (event) => {
                    if (event.key === "Enter" || event.keyCode === 13) {
                        if (prompt.value === "cds watch") {
                            ui5.byId("zsh").setVisible(false)
                            ui5.typeIt("🐬 42 🪐")
                        } else if (prompt.value === "cds deploy") {
                            ui5.byId("zsh").setVisible(false)
                            ui5.typeIt()
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
                    cursor = this.byId("output-past")
                    cursor.setVisible(true)
                    Promise.resolve()
                        .then((_) => {
                            return m.split("").reduce(reducer, "")
                        })
                        .then(async (_) => {
                            await delay(1000)
                            return cursor.setVisible(false)
                        })
                        .then((_) => {
                            return this.byId("zsh").setVisible(true)
                        })
                        .finally((_) => {
                            document.getElementById("terminal").value = ""
                        })
                } else {
                    cursor = this.byId("output")
                    cursor.setVisible(true)
                    Promise.resolve()
                        .then((_) => {
                            return `➡️ CfP`.split("").reduce(reducer, "")
                        })
                        .finally(async (_) => {
                            await delay(700)
                            this.byId("output1").setVisible(true)
                        })
                }
            }
        })
    }
)
