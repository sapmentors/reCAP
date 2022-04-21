sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        "sap/ui/Device",
        "sap/ui/core/ComponentSupport",
    ],
    (Controller, JSONModel, Device) => {
        return Controller.extend("capcom.recap.App", {
            onInit() {
                // const deviceModel = new JSONModel(Device)
                // deviceModel.setDefaultBindingMode("OneWay")
                // this.setModel(deviceModel, "device")

                const vpanel = this.byId("panelist")
                if (Device.resize.width >= 697) {
                    vpanel.setWidth("44%")
                } else {
                    vpanel.setWidth("88%")
                }

                Device.resize.attachHandler((params) => {
                    console.log(`//> width: ${params.width}`)
                    const vpanel = this.byId("panelist")
                    if (params.width >= 697) {
                        console.log("44%")
                        vpanel.setWidth("44%")
                    } else {
                        console.log("88%")

                        vpanel.setWidth("88%")
                    }
                })

                const oModel = new JSONModel({
                    hereswhy: `<p>the pandemic isn't over 🦠 - and as much as we'd like to have everyone come together in person, we can and will not risk to accidentally create a superspreader event 😪</p>
                    <p>nevertheless, we'd like to offer <span class="glow">the selected speakers</span> 🗣 the opportunity <span class="glow">to come on-site</span> - to at least get that feeling of being on stage 🎤, presenting to an auditorium.<br>
                    (plus you'll be offered to wear <span class="glow">re>≡CAP swag</span> 🤭😜)</p>
                    <p>for such a manageable number of people, we can guarantee to have adequate safety and hygiene 🧴 measures in place - for the health 🤒 of everyone being at ROT.</p>
                    <h3>🌍 all talks will both be streamed live and recorded!</h3>`,
                })
                this.getView().setModel(oModel)
            },
        })
    }
)
