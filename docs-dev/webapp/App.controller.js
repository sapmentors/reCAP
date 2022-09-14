sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        "sap/ui/Device",
        "sap/ui/core/Fragment",
        "sap/ui/core/ComponentSupport",
    ],
    (Controller, JSONModel, Device, Fragment) => {
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
                if (!speakers) return
                if (speakers[0].firstName === "Brigitte") {
                    return "(5 min Yoga refresher)"
                }
                return speakers
                    .map(
                        (speaker) => `${speaker.firstName} ${speaker.lastName}`
                    )
                    .join(", ")
            },
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
                            firstName: "Daniel J",
                            lastName: "Hutzel",
                            company: "SAP",
                            bio: "CAP papa",
                            photoUrl: "",
                        },
                        {
                            firstName: "DJ",
                            lastName: "Adams",
                            company: "SAP",
                            bio: "Developer Advocate, CAP afficionado",
                            photoUrl:
                                "https://avatars.services.sap.com/images/dj.adams.png",
                        },
                    ],
                    presentationLinks: [],
                }
                function* times(n) {
                    for (let i = 0; i < n; i++) {
                        yield i
                    }
                }
                const yogaWed = []
                const yogaThu = []
                const yogaSpeaker = {
                    firstName: "Brigitte",
                    lastName: "Felzmann",
                    company: "Brigitte YOGA",
                    bio: "www.brigitte.yoga",
                }
                for (const i of times(4)) {
                    yogaWed.push({
                        id: Date.now(),
                        location: "WED",
                        title: "🧘",
                        description: "🧍 get up, stand up!",
                        startTime: `1${5 + i}:55`,
                        speakers: [yogaSpeaker],
                    })
                    yogaThu.push({
                        id: Date.now(),
                        location: "THU",
                        title: "🧘",
                        description: "🧍 get up, stand up!",
                        startTime: `${9 + i}:55`,
                        speakers: [yogaSpeaker],
                    })
                }

                let _lineup = await fetch(
                    "./lineup.json"
                ).then((r) => r.json())
                _lineup.push(keynote)
                _lineup.push(...yogaWed)
                _lineup.push(...yogaThu)
                // sort by start time
                function sortByTime(a, b) {
                    const _a = new Date(`October 21, 2015 ${a.startTime}`)
                    const _b = new Date(`October 21, 2015 ${b.startTime}`)
                    if (_a < _b) {
                        return -1
                    }
                    if (_a > _b) {
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
                this.byId(
                    Fragment.createId("AgendaWednesdayFragment", "AgendaTable")
                )
                    .setModel(AgendaWednesdayModel)
                    .setBusy(false)
                this.byId(
                    Fragment.createId("AgendaThursdayFragment", "AgendaTable")
                )
                    .setModel(AgendaThursdayModel)
                    .setBusy(false)
            },
            onInit() {
                this.byId(
                    Fragment.createId("AgendaWednesdayFragment", "AgendaTable")
                ).setBusy(true)
                this.byId(
                    Fragment.createId("AgendaThursdayFragment", "AgendaTable")
                ).setBusy(true)
                this.doAgenda() //> intentionally side-eff'ing

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
                    where: `<p>All talks where recorded. We publish them as soon as possible.</p><p>In the meantime you can relax with <a href="assets/reCAP-Yoga-Exercises-2022.pdf">Yoga Excersises</a> from <a href="https://www.brigitte.yoga/">Brigitte</a></p>`,
                })
                this.getView().setModel(oModel)
            },
        })
    }
)
