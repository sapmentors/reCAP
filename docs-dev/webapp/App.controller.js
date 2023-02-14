sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        "sap/base/security/URLListValidator",
        "sap/ui/core/ComponentSupport"
    ],
    (Controller, JSONModel, URLListValidator) => {
        return Controller.extend("recap.App", {
            onInit() {
                URLListValidator.add("mailto")
                const oModel = new JSONModel({
                    sponsors: `
                    <p class="copyt">these packages are available:</p>
                    <ul class="copyt">
                        <li><span class="platin">Platin</span> - from 2000€, up to 4000€ or more:<br>mention on website, agenda, slides, blogs, social media and the possibility for an own booth onsite / own session at the event</li>
                        <li><span class="gold">Gold</span> - from 1000€, up to 2000€:<br>mention on website, agenda, slides, blogs, social media</li>
                        <li><span class="silver">Silver</span> - from 500 to 1000€:<br>mention on website</li>
                    </ul>
                    <p class="copyt contact"><a href="recap.conf@gmail.com">drop a line</a> to get in touch, friend!</p>`,
                    cfp: `&rarr; <a href="https://recap.cfapps.eu12.hana.ondemand.com">CfP open</a> (until Mar 31)`,
                    where: `<p>Our friends from <a href="https://openui5.org/ui5con/germany2023/">UI5con</a> rock their event the previous day, Jul 6.</p><p>So you &#x1FAF5; can get the full stack conference experience, back to back.</p>`,
                })
                this.getView().setModel(oModel)
            },
        })
    }
)
