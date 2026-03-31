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
header.mount("#header");

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
      proposalLineupJson: proposalLineupJson,
      speakerLineupJson: speakerLineupJson,
    };
  },
  mounted() {
    this.speakers = speakerLineupJson;
    this.lineup = proposalLineupJson;
    this.formattedLineup = this.formatLineup();

    this.formattedSpeakers = this.formatSpeakers(
      this.formattedLineup,
      this.speakers,
    );
    this.groupExpertCornerTopics();
  },
  methods: {
    openSpeakerInfoModal(speakers, id) {
      this.activeSpeakers = speakers;
      this.$refs.agenda.ariaHidden = true;
      this.$refs.speakerModal.ariaHidden = false;
      this.$refs.speakerModal.style.display = "flex";
      this.lastFocussedElementID = id;

      setTimeout(() => {
        this.$refs.speakerModal.focus();
      }, 0);
    },
    closeSpeakerInfoModal() {
      this.activeSpeakers = null;
      this.$refs.agenda.ariaHidden = false;
      this.$refs.speakerModal.ariaHidden = true;
      this.$refs.speakerModal.style.display = "none";

      for (const key in this.$refs) {
        if (
          key.startsWith("twitter") ||
          key.startsWith("github") ||
          key.startsWith("linkedin") ||
          key.startsWith("mastodon") ||
          key.startsWith("bluesky")
        ) {
          delete this.$refs[key];
        }
      }
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
    },
    formatLinkedInLink(handle) {
      if (!handle.startsWith("https:")) {
        return "https://www.linkedin.com/in/" + handle;
      }
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

        let start = session.startTime;
        let end = session.endTime;

        if (
          session.location === "canteen" &&
          session.title.toLowerCase().includes("breakfast")
        ) {
          start = "08:00";
        }

        let tempStart = start.substring(0, start.indexOf(":"));
        let tempEnd = end.substring(0, end.indexOf(":"));

        if (tempStart.length == 1 && !tempStart.startsWith("0")) {
          start = "0" + start;
        }

        if (tempEnd.length == 1 && !tempEnd.startsWith("0")) {
          end = "0" + end;
        }

        let newStartTime = "2025-07-09T" + start + ":00.000+02:00";
        let newEndTime = "2025-07-09T" + end + ":00.000+02:00";

        return {
          ...session,
          startTime: newStartTime,
          endTime: newEndTime,
        };
      });

      const sortedScheduleTemp = tempLineUp.sort(
        (a, b) =>
          luxon.DateTime.fromISO(a.startTime) -
          luxon.DateTime.fromISO(b.startTime),
      );

      this.expertCornerLineupUnsorted = sortedScheduleTemp.filter((schedule) =>
        schedule.location.includes("expert"),
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
        return sortedSchedule.filter(
          (schedule) =>
            schedule.type.includes("hands") ||
            schedule.type.includes("workshop"),
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
      // Create a lookup map from talk ID to location
      const talkIdToRoomMap = new Map(
        talks.map((talk) => [talk.id, talk.location]),
      );

      // Loop through speakers and their proposals to enrich with location
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
        const key = `${corner.startTime}|${corner.endTime}`;
        if (!this.expertCornerLineup[key]) {
          this.expertCornerLineup[key] = [];
        }
        this.expertCornerLineup[key].push(corner);
      });
    },
    formatProficiencyLevel(value) {
      if (!value) return "";
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
    formatLocationTitle(value) {
      if (!value) return "";

      if (value) {
        if (value.toLowerCase().includes("audimax")) {
          return "Yellow";
        } else if (
          value.toLowerCase().includes("w1") ||
          value.toLowerCase().includes("w2")
        ) {
          return "Blue";
        } else if (value.toLowerCase().includes("w3")) {
          return "Orange";
        } else if (value.toLowerCase().includes("expert")) {
          return "Experts Corner";
        } else if (
          value.toLowerCase().includes("canteen") ||
          value.toLowerCase().includes("catering")
        ) {
          return "Canteen";
        } else {
          return value;
        }
      }
    },
    showSessionCalendars(session) {
      if (
        (session.location.toLowerCase().includes("audimax") ||
          session.location.toLowerCase().includes("w1") ||
          session.location.toLowerCase().includes("w2") ||
          session.location.toLowerCase().includes("w3")) &&
        !(
          session.title.toLowerCase().includes("welcome") ||
          session.title.toLowerCase().includes("closing")
        )
      ) {
        return true;
      } else {
        return false;
      }
    },
    decodeBioHtml(value) {
      if (!value) return "";

      const txt = document.createElement("textarea");
      txt.innerHTML = value;

      let decoded = txt.value;
      decoded = decoded.replace(/&amp;|&/g, " and ");
      decoded = decoded.replace(/\\n|\/n|\n/g, "<br>");

      return decoded;
    },
    formatLocation: function (value) {
      if (value) {
        if (value.toLowerCase().includes("audimax")) {
          return "Y";
        } else if (
          value.toLowerCase().includes("w1") ||
          value.toLowerCase().includes("w2")
        ) {
          return "B";
        } else if (value.toLowerCase().includes("w3")) {
          return "O";
        } else if (value.toLowerCase().includes("expert")) {
          return "EXP";
        } else if (
          value.toLowerCase().includes("canteen") ||
          value.toLowerCase().includes("catering")
        ) {
          return "CA";
        } else {
          return value;
        }
      }
    },
    formatLevel: function (value) {
      if (!value) return "";
      return value.charAt(0).toUpperCase();
    },
    trimTime: function (value) {
      let time = value.substring(value.indexOf("T") + 1);
      let timeSplit = time.split(":");
      let hour = timeSplit[0].startsWith("0")
        ? timeSplit[0].replace(/^0+/, "")
        : timeSplit[0];
      return hour + ":" + timeSplit[1];
    },
    trimExpertText: function (value) {
      return value.replace(/^Expert Corner: /, "");
    },
    convertTime: function (value, eventTime) {
      if (eventTime === "local") {
        return luxon.DateTime.fromISO(value)
          .toLocal()
          .toISO({ suppressMilliseconds: true });
      }
      return value;
    },
    decodeHtml: function (value) {
      if (!value) return "";
      const txt = document.createElement("textarea");
      txt.innerHTML = value;
      return txt.value;
    },
  },
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

