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
                    cli: `<p class="terminal">$&gt; <input type="text" id="terminal" class="cmd terminal" placeholder="cds watch"></p>`,
                    HTML: `
<h1 class="cursor"></h1>
                    `
                })
                this.getView().setModel(Model)
            },
            onAfterRendering() {
                const ui5 = this
                const prompt = document.getElementById("terminal")
                prompt.addEventListener("keydown", (event) => {
                    if (event.key === "Enter" || event.keyCode === 13) {
                        ui5.byId("output").setVisible(true)
                        ui5.byId("zsh").setVisible(false)
                    }
                })
            }
        })
    }
)
