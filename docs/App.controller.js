sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        "sap/ui/Device",
        "sap/ui/core/ComponentSupport"
    ],
    (Controller, JSONModel, Device) => {
        return Controller.extend("capcom.recap.App", {
            async doAgenda() {
                const keynote = {
                    id: 1,
                    title: "Keynote",
                    type: "drive-by",
                    description: "The KEYNOTE",
                    location: "WED",
                    startTime: "14:00",
                    endTime: "14:50",
                    speakers: [
                        {
                            firstName: "Daniel",
                            lastName: "Hutzel",
                            company: "SAP",
                            bio: "CAP papa",
                            photoUrl: ""
                        }
                    ],
                    presentationLinks: []
                }

                let _lineup = await fetch(
                    "https://recap.cfapps.eu10.hana.ondemand.com/api/proposal/lineup"
                ).then((r) => r.json())
                // sort by start time
                function sortByTime(a, b) {
                    if (a.startTime < b.startTime) {
                        return -1
                    }
                    if (a.startTime > b.startTime) {
                        return 1
                    }
                    return 0
                }
                const agendaWednesday = _lineup
                    .filter((session) => session.location === "WED")
                    .sort((a, b) => sortByTime(a, b))
                const agendaThursday = _lineup
                    .filter((session) => session.location === "THU")
                    .sort((a, b) => sortByTime(a, b))
                const AgendaWednesdayModel = new JSONModel(agendaWednesday)
                const AgendaThursdayModel = new JSONModel(agendaThursday)
                this.getView().setModel(
                    AgendaWednesdayModel,
                    "AgendaWednesdayModel"
                )
                this.getView().setModel(
                    AgendaThursdayModel,
                    "AgendaThursdayModel"
                )
                console.log("//> ",agendaWednesday, agendaThursday)
            },
            onInit() {
                doAgenda()

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
                    <h3>🌍 all talks will both be streamed live and recorded!</h3>`
                })
                this.getView().setModel(oModel)
            }
        })
    }
)
