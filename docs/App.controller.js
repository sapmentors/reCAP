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
                    cli: `<p class="green terminal">$&gt; <input type="text" id="terminal" class="cmd terminal" placeholder="cds watch"></p>`
                })
                this.getView().setModel(Model)
            },
            onAfterRendering() {
                const ui5 = this
                const prompt = document.getElementById("terminal")
                prompt.addEventListener("keydown", (event) => {
                    if (event.key === "Enter" || event.keyCode === 13) {
                        if (prompt.value === "cds watch") {
                            ui5.byId("zsh").setVisible(false)
                            ui5.typeIt()
                        }
                    }
                })
            },
            typeIt() {
                const delay = (ms) => {
                    return new Promise((resolve) => setTimeout(resolve, ms))
                }
                const cursor = this.byId("output")
                cursor.setVisible(true)
                const reducer = async (accumulator, curr) => {
                    const res = await accumulator
                    await delay(200)
                    const acc = `${res}${curr}`
                    cursor.setText(acc)
                    return acc
                }
                ;`June 25th, 2021\nre>≡CAP online\n💚`
                    .split("")
                    .reduce(reducer, "")
            }
        })
    }
)
