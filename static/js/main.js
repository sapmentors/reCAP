'use strict';

const { createApp } = Vue;

const nav = createApp({
  data() {
    return {
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
    };
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener("resize", this.onResize);
    });
  },
  computed: {
    showMobileNav: function () {
      if (this.windowWidth < 780) {
        return true;
      } else {
        return false;
      }
    },
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    onResize() {
      this.windowHeight = window.innerHeight;
      this.windowWidth = window.innerWidth;
    },
  },
});

// Register components with nav app if they exist
if (window.NavSectionComponent) {
  nav.component('nav-section', window.NavSectionComponent);
}
if (window.NavSectionMobileComponent) {
  nav.component('nav-section-mobile', window.NavSectionMobileComponent);
}
nav.mount("#nav");


const header = createApp({
  data() {
    return {
      showCalendars: false,
    };
  },
  mounted() {},
  methods: {
    toggleCalendars() {
      this.showCalendars = !this.showCalendars;
      const container = document.getElementById("links-container");
      if (container) {
        if (this.showCalendars) {
          container.classList.remove("links-container--hidden");
          container.classList.add("links-container--visible");
        } else {
          container.classList.remove("links-container--visible");
          container.classList.add("links-container--hidden");
        }
      }
    },
  },
});
if (document.getElementById('header')) {
  header.mount("#header");
}

const main = createApp({
  compilerOptions: {
    isCustomElement: (tag) => tag === "tito-widget",
  },
  data() {
    return {
      team: [
        {
          name: "Margot Wollny",
          location: "Walldorf",
          image: "images/committee/margot-wollny.png",
        },
        {
          name: "Fabian Tempel",
          location: "Potsdam",
          image: "images/committee/margot-wollny.png",
        },
        {
          name: "Inna Atanasova",
          location: "Montreal",
          image: "images/committee/margot-wollny.png",
        },
      ],
      committee: [
        {
          name: "DJ Adams",
          role: "Developer Advocate",
          image: "images/committee/dj-adams.jpg",
        },
        {
          name: "Volker Buzek",
          role: "Camunda, SAP Mentor",
          image: "images/committee/volker-buzek.jpg",
        },
        {
          name: "Daniel Hutzel",
          role: "CPO CAP",
          image: "images/committee/daniel-hutzel.jpg",
        },
        {
          name: "Frank Köppert",
          role: "asbrucon GmbH",
          image: "images/committee/frank-koeppert.jpg",
        },
        {
          name: "Ole Lilienthal",
          role: "Unit Lead CAP",
          image: "images/committee/ole-lilienthal.jpg",
        },
        {
          name: "Danielle Lyle",
          role: "Comentec",
          image: "images/committee/danielle-lyle.jpg",
        },
        {
          name: "Ben Patterson",
          role: "Rev-Trac",
          image: "images/committee/ben-patterson.jpg",
        },
        {
          name: "Holger Schäfer",
          role: "Uniorg",
          image: "images/committee/holger-schaefer.jpg",
        },
        {
          name: "Daniel Schipper",
          role: "Blackwyse",
          image: "images/committee/daniel-schipper.jpg",
        },
        {
          name: "Harikishore Sreenivasalu",
          role: "Aarini Consulting",
          image: "images/committee/harikishore-sreenivasalu.jpg",
        },
        {
          name: "Martin Stenzig",
          role: "alphaOak",
          image: "images/committee/martin-stenzig.jpg",
        },
        {
          name: "Mike Zaschka",
          role: "Independent SAP Solution Architect",
          image: "images/committee/mike-zaschka.jpg",
        },
      ],
      activeSpeakers: null,
      lastFocussedElementID: "",
      speakers: [],
      filter: "all",
      activeSpeakers: null,
      lineup: [],
      proposalLineup: [],
      formattedLineup: [],
      formattedSpeakers: [],
      expertCornerLineup: {},
      expertCornerLineupUnsorted: [],
      speakerLineupJson: [],
      activeSession: null,
      agendaViewMode: "grid", // 'grid' or 'linear'
    };
  },
  async mounted() {
    try {
      const response = await fetch('https://recap.cfapps.eu12.hana.ondemand.com/api/speaker/lineup');
      this.speakerLineupJson = await response.json();
    } catch (e) {
      console.error('Failed to fetch speaker lineup:', e);
      this.speakerLineupJson = [];
    }
    this.speakers = this.speakerLineupJson;

    try {
      const response = await fetch('https://recap.cfapps.eu12.hana.ondemand.com/api/proposal/lineup');
      this.lineup = await response.json();
    } catch (e) {
      console.error('Failed to fetch proposal lineup:', e);
      this.lineup = [];
    }

    this.formattedLineup = this.formatLineup();

    this.formattedSpeakers = this.formatSpeakers(this.formattedLineup, this.speakers);
    this.groupExpertCornerTopics();
  },
  methods: {
    openSpeakerInfoModal(speakers, id) {
      this.activeSpeakers = speakers;
      this.lastFocussedElementID = id;

      this.$refs.speakerModal.ariaHidden = false;
      this.$refs.speakerModal.style.display = "flex";

      setTimeout(() => {
        this.$refs.speakerModal.focus();
      }, 0);
    },
    closeSpeakerInfoModal() {
      this.activeSpeakers = null;

      // Blur focus before hiding the modal
      if (document.activeElement && this.$refs.speakerModal.contains(document.activeElement)) {
        document.activeElement.blur();
      }

      this.$refs.speakerModal.ariaHidden = true;
      this.$refs.speakerModal.style.display = "none";

      document.getElementById(this.lastFocussedElementID).focus();
    },
    focusTrapModal($event) {
      let focussableElements = [];
      focussableElements.push(this.$refs.close);

      for (const key in this.$refs) {
        if (
          key.startsWith("twitter") ||
          key.startsWith("github") ||
          key.startsWith("linkedin") ||
          key.startsWith("mastodon") ||
          key.startsWith("bluesky")
        ) {
          const element = this.$refs[key];
          if (Array.isArray(element)) {
            focussableElements.push(element[0]);
          } else {
            focussableElements.push(element);
          }
        }
      }

      const filteredFocussableElements = focussableElements.filter(
        (el) => el !== undefined,
      );
      const activeElementIndex = filteredFocussableElements.indexOf(
        $event.target,
      );

      if (activeElementIndex != filteredFocussableElements.length - 1) {
        if ($event.shiftKey) {
          if (activeElementIndex === 0) {
            filteredFocussableElements[
              filteredFocussableElements.length - 1
            ].focus();
          } else {
            filteredFocussableElements[activeElementIndex - 1].focus();
          }
        } else {
          filteredFocussableElements[activeElementIndex + 1].focus();
        }
      } else {
        if ($event.shiftKey) {
          filteredFocussableElements[activeElementIndex - 1].focus();
        } else {
          filteredFocussableElements[0].focus();
        }
      }
    },
    formatTwitterLink(handle) {
      if (!handle.startsWith("https:")) {
        return "https://twitter.com/" + handle;
      }
      return handle;
    },
    formatLinkedInLink(handle) {
      if (!handle.startsWith("https:")) {
        return "https://www.linkedin.com/in/" + handle;
      }
      return handle;
    },
    formatMastodonLink(handle) {
      if (!handle.startsWith("https:")) {
        if (handle.includes("@saptodon.org")) {
          return "https://saptodon.org/" + handle.replace("@saptodon.org", "");
        }

        return "https://saptodon.org/" + handle;
      }
    },
    formatBlueskyLink(handle) {
      if (!handle.startsWith("https:")) {
        return "https://bsky.app/profile/" + handle.replace("@", "");
      }
      return handle;
    },
    shuffleSpeakersArray(array) {
      const newArray = [...array];
      const filteredArray = newArray.filter((el) => el.hasPhoto);
      const length = filteredArray.length;

      for (let start = 0; start < length; start++) {
        const randomPosition = Math.floor(
          (filteredArray.length - start) * Math.random(),
        );
        const randomItem = filteredArray.splice(randomPosition, 1);
        filteredArray.push(...randomItem);
      }

      return filteredArray;
    },
    formatAndShuffleSpeakersArray(array) {
      const formattedArray = this.formatSpeakersArray(array);
      return this.shuffleSpeakersArray(formattedArray);
    },
    formatSpeakersArray(array) {
      const newArray = [...array];
      const formattedArray = newArray.map((speaker) => {
        const fullName = speaker.firstName + " " + speaker.lastName;

        if (speaker.twitterHandle) {
          speaker.twitterHandle = this.formatTwitterLink(speaker.twitterHandle);
        }

        if (speaker.linkedInUrl) {
          speaker.linkedInUrl = this.formatLinkedInLink(speaker.linkedInUrl);
        }

        if (speaker.mastodonHandle) {
          speaker.mastodonHandle = this.formatMastodonLink(
            speaker.mastodonHandle,
          );
        }

        if (speaker.blueskyHandle) {
          speaker.blueskyHandle = this.formatBlueskyLink(speaker.blueskyHandle);
        }

        return {
          ...speaker,
          fullName: fullName,
          showMore: false,
        };
      });

      return formattedArray;
    },
    onFilterChange($event) {
      this.filter = $event.target.value;
      this.formattedLineup = this.formatLineup();
    },
    formatLineup() {
      const tempLineUp = this.lineup.map((session) => {
        session.speakers.map((speaker) => {
          if (speaker.twitterHandle) {
            speaker.twitterHandle = this.formatTwitterLink(
              speaker.twitterHandle,
            );
          }

          if (speaker.linkedInUrl) {
            speaker.linkedInUrl = this.formatLinkedInLink(speaker.linkedInUrl);
          }

          if (speaker.mastodonHandle) {
            speaker.mastodonHandle = this.formatMastodonLink(
              speaker.mastodonHandle,
            );
          }

          if (speaker.blueskyHandle) {
            speaker.blueskyHandle = this.formatBlueskyLink(
              speaker.blueskyHandle,
            );
          }
        });

        let start = session.startTime || "";
        let end = session.endTime || "";

        if (
          session.location === "canteen" &&
          session.title.toLowerCase().includes("breakfast")
        ) {
          start = "08:00";
        }

        if (start && end) {
          let tempStart = start.substring(0, start.indexOf(":"));
          let tempEnd = end.substring(0, end.indexOf(":"));

          if (tempStart.length == 1 && !tempStart.startsWith("0")) {
            start = "0" + start;
          }

          if (tempEnd.length == 1 && !tempEnd.startsWith("0")) {
            end = "0" + end;
          }
        }

        // Default values for sessions without valid times
        let newStartTime = start ? "2026-07-15T" + start + ":00.000+02:00" : null;
        let newEndTime = end ? "2026-07-15T" + end + ":00.000+02:00" : null;

        let calendarStartDate = "";
        let calendarEndDate = "";
        let officeStartDate = "";
        let officeEndDate = "";

        // Only generate calendar dates if we have valid times
        if (newStartTime && newEndTime) {
          const startDate = new Date(newStartTime);
          const endDate = new Date(newEndTime);

          // Check if dates are valid before calling toISOString
          if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
            calendarStartDate = startDate.toISOString().replace(/-|:|\.\d+/g, "");
            calendarEndDate = endDate.toISOString().replace(/-|:|\.\d+/g, "");
            officeStartDate = startDate.toISOString();
            officeEndDate = endDate.toISOString();
          }
        }

        const forbiddenCharacters = new RegExp("#", "g");
        const removeForbiddenCharachters = (text) => {
          if (typeof text === "string") {
            let formattedText = text.replace(/(&amp;|&)/g, " and ");
            return formattedText.replace(forbiddenCharacters, "");
          }
          return "";
        };

        const removeForbiddenCharachtersOutlook = (text) => {
          if (typeof text === "string") {
            let formattedText = text.replace(/(?:\r\n|\r|\n)/g, "\\n");
            formattedText = formattedText.replace(/<br>/g, "\\n");
            formattedText = formattedText.replace(/(&amp;|&)/g, " and ");
            return formattedText.replace(forbiddenCharacters, "");
          }
          return "";
        };
        const sessionLocation = (location) => {
          if (location.toLowerCase().includes("audimax")) {
            return "Audimax";
          } else if (
            location.toLowerCase().includes("w1") ||
            location.toLowerCase().includes("w2")
          ) {
            return "Room W1/W2";
          } else if (location.toLowerCase().includes("w3")) {
            return "Room W3";
          } else {
            return location;
          }
        };

        let cal = [
          "BEGIN:VCALENDAR",
          "VERSION:2.0",
          "BEGIN:VEVENT",
          "DTSTART:" + calendarStartDate,
          "DTEND:" + calendarEndDate,
          "SUMMARY:" +
            "reCAP: " +
            removeForbiddenCharachtersOutlook(session.title),
          "LOCATION:" + sessionLocation(session.location),
          "DESCRIPTION:" +
            removeForbiddenCharachtersOutlook(session.description),
          "UID:" + session.id,
          "END:VEVENT",
          "END:VCALENDAR",
        ].join("\n");

        let calDescription = "";

        if (session.description) {
          let formattedDescription = session.description.replace(/&amp;/g, "&");
          calDescription = formattedDescription.replace(
            /(?:\r\n|\r|\n)/g,
            "<br>",
          );
        }

        return {
          ...session,
          startTime: newStartTime,
          endTime: newEndTime,
          calendars: [
            {
              google: encodeURI(
                [
                  "https://www.google.com/calendar/render",
                  "?action=TEMPLATE",
                  "&text=" +
                    "reCAP: " +
                    removeForbiddenCharachters(session.title),
                  "&dates=" + calendarStartDate,
                  "/" + calendarEndDate,
                  "&location=" + sessionLocation(session.location),
                  "&details=" + removeForbiddenCharachters(calDescription),
                  "&sprop=&sprop=name:",
                ].join(""),
              ),
              office365: encodeURI(
                [
                  "https://outlook.office365.com/owa/",
                  "?path=/calendar/action/compose",
                  "&rru=addevent",
                  "&subject=" +
                    "reCAP: " +
                    removeForbiddenCharachters(session.title),
                  "&startdt=" + officeStartDate,
                  "&enddt=" + officeEndDate,
                  "&location=" + sessionLocation(session.location),
                  "&body=" + removeForbiddenCharachters(calDescription),
                ].join(""),
              ),
              ics: encodeURI("data:text/calendar;charset=utf8," + cal),
            },
          ],
        };
      });

      const sortedScheduleTemp = tempLineUp.sort(
        (a, b) =>
          luxon.DateTime.fromISO(a.startTime) -
          luxon.DateTime.fromISO(b.startTime),
      );

      this.expertCornerLineupUnsorted = sortedScheduleTemp.filter((schedule) =>
        schedule.type.includes("expert"),
      );

      const sortedSchedule = sortedScheduleTemp.filter(
        (schedule) => !schedule.type.includes("expert"),
      );

      if (this.filter === "all") {
        return sortedSchedule;
      } else if (this.filter === "talks") {
        return sortedSchedule.filter((schedule) =>
          schedule.type.includes("presentation"),
        );
      } else if (this.filter === "workshops") {
        return sortedSchedule.filter((schedule) =>
          schedule.type.includes("hands"),
        );
      } else if (this.filter === "audimax") {
        return sortedSchedule.filter(
          (schedule) => schedule.location.toLowerCase() === "audimax",
        );
      } else if (this.filter === "w1") {
        return sortedSchedule.filter((schedule) =>
          schedule.location.toLowerCase().includes("w1"),
        );
      } else if (this.filter === "w3") {
        return sortedSchedule.filter((schedule) =>
          schedule.location.toLowerCase().includes("w3"),
        );
      } else if (this.filter === "beginner") {
        return sortedSchedule.filter(
          (schedule) => schedule.proficiencyLevel === "beginner",
        );
      } else if (this.filter === "intermediate") {
        return sortedSchedule.filter(
          (schedule) => schedule.proficiencyLevel === "intermediate",
        );
      } else if (this.filter === "advanced") {
        return sortedSchedule.filter(
          (schedule) => schedule.proficiencyLevel === "advanced",
        );
      } else {
        return sortedSchedule;
      }
    },
    formatSpeakers(talks, speakers) {
      const talkIdToRoomMap = new Map(
        talks.map((talk) => [talk.id, talk.location]),
      );

      speakers.forEach((speaker) => {
        speaker.proposals.forEach((proposal) => {
          const location = talkIdToRoomMap.get(proposal.id);
          if (location) {
            proposal.location = location;
          } else {
            proposal.location = "Audimax";
          }
        });
      });

      return speakers;
    },
    groupExpertCornerTopics() {
      this.expertCornerLineupUnsorted.forEach((corner) => {
        const timeSlot = corner.startTime;
        if (!this.expertCornerLineup[timeSlot]) {
          this.expertCornerLineup[timeSlot] = [];
        }
        this.expertCornerLineup[timeSlot].push(corner);
      });
    },
    getSessionsByRoom(room) {
      // Get sessions for this specific room (excluding break sessions)
      const roomSessions = this.formattedLineup.filter(
        (session) =>
          session.location === room &&
          session.type &&
          !session.type.includes("expert") &&
          !this.isBreakSession(session)
      );

      // Sort by start time
      return roomSessions.sort((a, b) =>
        a.startTime.localeCompare(b.startTime),
      );
    },
    getBreakSessions() {
      // Get all break/catering sessions
      return this.formattedLineup.filter(
        (session) => this.isBreakSession(session)
      ).sort((a, b) =>
        a.startTime.localeCompare(b.startTime)
      );
    },
    timeToMinutes(timeStr) {
      if (!timeStr) return 0;

      // Handle ISO format (e.g., "2026-07-15T09:00:00.000+02:00")
      if (timeStr.includes("T")) {
        const time = timeStr.substring(timeStr.indexOf("T") + 1);
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 100 + minutes;
      }

      // Handle simple format (e.g., "9:00")
      const [hours, minutes] = timeStr.split(":").map(Number);
      return hours * 100 + minutes;
    },
    isBreakSession(session) {
      const lowerTitle = session.title.toLowerCase();
      const lowerType = (session.type || "").toLowerCase();

      return (
        lowerType.includes("break") ||
        lowerType.includes("lunch") ||
        lowerType.includes("catering") ||
        lowerTitle.includes("break") ||
        lowerTitle.includes("lunch") ||
        lowerTitle.includes("coffee") ||
        session.location === "canteen"
      );
    },
    isPitchSession(session) {
      const lowerType = (session.type || "").toLowerCase();
      return lowerType.includes("pitch");
    },
    toggleAgendaView() {
      this.agendaViewMode = this.agendaViewMode === "grid" ? "linear" : "grid";
    },
    getAllSessionsSorted() {
      // Get all sessions except expert corner sessions
      const allSessions = this.lineup.filter(
        (session) => session.type && !session.type.includes("expert"),
      );

      // Sort by start time (convert to minutes for proper numerical comparison)
      return allSessions.sort((a, b) => {
        const timeA = this.timeToMinutes(a.startTime);
        const timeB = this.timeToMinutes(b.startTime);
        return timeA - timeB;
      });
    },
    getSessionSpeakers(sessionId) {
      // Find the session and return its speakers array directly
      const session = this.lineup.find((s) => s.id === sessionId);
      return session && session.speakers ? session.speakers : [];
    },
    openSessionDialog(session) {
      this.activeSession = session;

      this.$refs.sessionModal.ariaHidden = false;
      this.$refs.sessionModal.style.display = "flex";

      setTimeout(() => {
        this.$refs.sessionModal.focus();
      }, 0);
    },
    closeSessionDialog() {
      this.activeSession = null;

      // Blur focus before hiding the modal
      if (document.activeElement && this.$refs.sessionModal.contains(document.activeElement)) {
        document.activeElement.blur();
      }

      this.$refs.sessionModal.ariaHidden = true;
      this.$refs.sessionModal.style.display = "none";
    },
    focusTrapSessionModal($event) {
      let focussableElements = [];
      focussableElements.push(this.$refs.sessionCloseButton);

      for (const key in this.$refs) {
        if (
          key.startsWith("session-twitter") ||
          key.startsWith("session-github") ||
          key.startsWith("session-linkedin") ||
          key.startsWith("session-mastodon") ||
          key.startsWith("session-bluesky")
        ) {
          const element = this.$refs[key];
          if (Array.isArray(element)) {
            focussableElements.push(element[0]);
          } else {
            focussableElements.push(element);
          }
        }
      }

      const filteredFocussableElements = focussableElements.filter(
        (el) => el !== undefined,
      );
      const activeElementIndex = filteredFocussableElements.indexOf(
        $event.target,
      );

      if ($event.shiftKey) {
        // Shift+Tab - go backwards
        if (activeElementIndex === 0) {
          // If at first element, go to last
          filteredFocussableElements[
            filteredFocussableElements.length - 1
          ].focus();
        } else {
          // Otherwise go to previous
          filteredFocussableElements[activeElementIndex - 1].focus();
        }
      } else {
        // Tab - go forwards
        if (activeElementIndex === filteredFocussableElements.length - 1) {
          // If at last element, go to first
          filteredFocussableElements[0].focus();
        } else {
          // Otherwise go to next
          filteredFocussableElements[activeElementIndex + 1].focus();
        }
      }
    },
    formatProficiencyLevel(value) {
      if (!value) return "";
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
    formatLocationTitle(value) {
      if (!value) return "";

      if (value) {
        if (value.toLowerCase().includes("audimax")) {
          return "A";
        } else if (
          value.toLowerCase().includes("w1") ||
          value.toLowerCase().includes("w2")
        ) {
          return "W1/2";
        } else if (value.toLowerCase().includes("w3")) {
          return "W3";
        } else if (value.toLowerCase().includes("expert")) {
          return "EXP";
        } else if (value.toLowerCase().includes("canteen")) {
          return "CAN";
        } else {
          return value;
        }
      }
    },
    decodeBioHtml(value) {
      if (!value) return "";
      const txt = document.createElement("textarea");
      txt.innerHTML = value;

      let decoded = txt.value;

      // Replace "&amp;" or "&" with " and "
      decoded = decoded.replace(/&amp;|&/g, " and ");

      // Replace \n or /n with <br> for HTML rendering
      decoded = decoded.replace(/\\n|\/n|\n/g, "<br>");

      return decoded;
    },
    trimTime(value) {
      if (!value) return "";
      let time = value.substring(value.indexOf("T") + 1);
      let timeSplit = time.split(":");
      let hour = timeSplit[0].startsWith("0")
        ? timeSplit[0].replace(/^0+/, "")
        : timeSplit[0];
      return hour + ":" + timeSplit[1];
    },
    formatLocation(value) {
      if (value) {
        if (value.toLowerCase().includes("audimax")) {
          return "Audimax";
        } else if (
          value.toLowerCase().includes("w1") ||
          value.toLowerCase().includes("w2")
        ) {
          return "W1/W2";
        } else if (value.toLowerCase().includes("w3")) {
          return "W3";
        } else if (value.toLowerCase().includes("expert")) {
          return "Expert Corner";
        } else if (value.toLowerCase().includes("canteen")) {
          return "Canteen";
        } else {
          return value;
        }
      }
    },
    trimExpertText(value) {
      return value.replace(/^Expert Corner: /, "");
    },
    decodeHtml(value) {
      if (!value) return "";
      const txt = document.createElement("textarea");
      txt.innerHTML = value;
      return txt.value;
    },
    formatSessionType(value) {
      if (!value) return "";
      if (value.toLowerCase().includes("presentation")) {
        return "Talk";
      } else if (value.toLowerCase().includes("hands")) {
        return "Workshop";
      } else {
        return value;
      } 
    },
  }
});

// Register calendar-link component with main app if it exists
if (window.CalendarLinkComponent) {
  main.component('calendar-link', window.CalendarLinkComponent);
}
main.mount("#main");

const footer = createApp({
  data() {
    return {};
  },
});

// Register footer-section component with footer app if it exists
if (window.FooterSectionComponent) {
  footer.component('footer-section', window.FooterSectionComponent);
}
footer.mount('#footer');

