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
                // get the live schedule
                let _lineup = await fetch(
                    `https://recap.cfapps.eu10.hana.ondemand.com/api/proposal/lineup`
                ).then((r) => r.json())
                // inject opening, keynote, lunch, afterevent
                _lineup = [..._lineup, ...this.inject()]
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

            inject() {
                const opening = {
                    id: 47111,
                    title: "Grande Opening",
                    description: "re>≡CAP online 2021 starts!",
                    location: "FRI",
                    startTime: "09:00",
                    endTime: "09:15",
                    speakers: [
                        {
                            firstName: "DJ",
                            lastName: "Adams",
                            company: "SAP SE",
                            bio: "",
                            funFact: "",
                            twitterHandle: "@qmacro",
                            linkedInUrl: "",
                            otherSocialMedia: null,
                            photoUrl: ""
                        },
                        {
                            firstName: "Volker",
                            lastName: "Buzek",
                            company: "j&s-soft GmbH",
                            bio: "",
                            funFact: "",
                            twitterHandle: "@vobu",
                            linkedInUrl: "",
                            otherSocialMedia: null,
                            photoUrl: ""
                        }
                    ],
                    presentationLinks: []
                }
                const keynote = {
                    id: 47112,
                    title: "Keynote",
                    description: "---",
                    location: "FRI",
                    startTime: "09:15",
                    endTime: "10:00",
                    speakers: [
                        {
                            firstName: "Daniel",
                            lastName: "Hutzel",
                            company: "SAP SE",
                            bio: "",
                            funFact: "",
                            twitterHandle: "",
                            linkedInUrl: "",
                            otherSocialMedia: null,
                            photoUrl: ""
                        }
                    ],
                    presentationLinks: []
                }
                const beer = {
                    id: 47113,
                    title: "After-Event",
                    description:
                        "we all hang in a Zoom session and share a 🍹\nZoom Link will be provided in the livestream!",
                    location: "FRI",
                    startTime: "16:00",
                    endTime: "20:00",
                    speakers: [
                        {
                            firstName: "#SAPCAP",
                            lastName: "community",
                            company: "the world",
                            bio: "",
                            funFact: "",
                            twitterHandle: "",
                            linkedInUrl: "",
                            otherSocialMedia: null,
                            photoUrl: ""
                        }
                    ],
                    presentationLinks: []
                }
                return [opening, keynote, beer]
            }
        })
    }
)
