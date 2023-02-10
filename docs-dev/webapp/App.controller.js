sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        "sap/ui/Device",
        "sap/ui/core/Fragment",
        "sap/ui/core/ComponentSupport",
    ],
    (Controller, JSONModel, Device, Fragment) => {
        return Controller.extend("recap.App", {
            
            onInit() {
   

                const oModel = new JSONModel({
                    hereswhy: `<p>the pandemic isn't over 🦠 - and as much as we'd like to have everyone come together in person, we can and will not risk to accidentally create a superspreader event 😪</p>
                    <p>nevertheless, we'd like to offer <span class="glow">the selected speakers</span> 🗣 the opportunity <span class="glow">to come on-site</span> - to at least get that feeling of being on stage 🎤, presenting to an auditorium.<br>
                    (plus you'll be offered to wear <span class="glow">re>≡CAP swag</span> 🤭😜)</p>
                    <p>for such a manageable number of people, we can guarantee to have adequate safety and hygiene 🧴 measures in place - for the health 🤒 of everyone being at ROT.</p>
                    <h3>🌍 all talks will both be streamed live and recorded!</h3>`,
                    where: `<p>Our friends from <a href="https://openui5.org/ui5con/germany2023/">UI5con</a> rock their event the previous day, Jul 6.</p><p>So you 🫵 can get the full stack conference experience, back to back.</p>`,
                })
                this.getView().setModel(oModel)
            },
        })
    }
)
