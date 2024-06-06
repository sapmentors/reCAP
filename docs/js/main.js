'use strict';

var main = new Vue({
  el: "#main",
  data() {
    return {
      isModalVisible: false,
      eventTime: "event",
      filter: "all",
      activeSpeaker: null,
      lineup: [],
      proposalLineup: [],
      formattedLineup: [],
      lastFocussedElementID: "",
    };
  },
  mounted() {
    axios
      .get("https://recap.cfapps.eu12.hana.ondemand.com/api/proposal/lineup")
      .then((response) => {
        this.lineup = response.data;
        this.formattedLineup = this.formatLineup();
      });

    this.updateLiveSession();
    
    let interval;
    
    let timeNow = new Date().toISOString();
    
    const startCounterTime = new Date(
      "2024-06-04T00:00:00.000+02:00"
    ).toISOString();
    
    const endCounterTime = new Date(
      "2024-06-04T18:10:00.000+02:00"
    ).toISOString();

    if (timeNow > startCounterTime && timeNow <= endCounterTime) {
      interval = setInterval(() => {
        timeNow = new Date().toISOString();
        if (timeNow > endCounterTime) {
          clearInterval(interval);
          return;
        }
        this.updateLiveSession();
      }, 30000);
    }
  },
  methods: {
    toggleAnswer(event) {
      console.log(event.target);
      event.target.classList.toggle("active");
    },
    onFilterChange($event) {
      this.filter = $event.target.value;
      this.formattedLineup = this.formatLineup();
    },
    onTimeChange($event) {
      this.eventTime = $event.target.value;
    },
    getLocalTimeZone() {
      return luxon.DateTime.now().toFormat("Z");
    },
    formatLineup() {
      const tempLineUp = this.lineup.map((session) => {
        session.speakers.map((speaker) => {
          if (speaker.twitterHandle) {
            speaker.twitterHandle = this.formatTwitterLink(
              speaker.twitterHandle
            );
          }

          if (speaker.linkedInUrl) {
            speaker.linkedInUrl = this.formatLinkedInLink(speaker.linkedInUrl);
          }

          if (speaker.mastodonHandle) {
            speaker.mastodonHandle = this.formatMastodonLink(
              speaker.mastodonHandle
            );
          }

          if (speaker.blueskyHandle) {
            speaker.blueskyHandle = this.formatBlueskyLink(
              speaker.blueskyHandle
            );
          }
        });

        let start = session.startTime;
        let end = session.endTime;

        let tempStart = start.substring(0, start.indexOf(":"));
        let tempEnd = end.substring(0, end.indexOf(":"));

        if (tempStart.length == 1 && !tempStart.startsWith("0")) {
          start = "0" + start;
        }

        if (tempEnd.length == 1 && !tempEnd.startsWith("0")) {
          end = "0" + end;
        }

        let newStartTime = "2024-06-04T" + start + ":00.000+02:00";
        let newEndTime = "2024-06-04T" + end + ":00.000+02:00";

        let timeNow = new Date().toISOString();
        let sessionTimeStart = new Date(newStartTime).toISOString();
        let sessionTimeEnd = new Date(newEndTime).toISOString();
        let sessionLiveStatus = false;

        if (timeNow > sessionTimeStart && timeNow < sessionTimeEnd) {
          sessionLiveStatus = true;
        }

        return {
          ...session,
          startTime: newStartTime,
          endTime: newEndTime,
          liveNow: sessionLiveStatus,
        };
      });

      const sortedScheduleTemp = tempLineUp.sort(
        (a, b) =>
          luxon.DateTime.fromISO(a.startTime) -
            luxon.DateTime.fromISO(b.startTime) ||
          a.location.localeCompare(b.location)
      );

      const sortedSchedule = sortedScheduleTemp.filter(
        (schedule) => !schedule.type.includes("expert")
      );

      if (this.filter === "all") {
        return sortedSchedule;
      } else if (this.filter === "talks") {
        return sortedSchedule.filter((schedule) =>
          schedule.type.includes("presentation")
        );
      } else if (this.filter === "workshops") {
        return sortedSchedule.filter((schedule) =>
          schedule.type.includes("workshop")
        );
      } else if (this.filter === "audimax") {
        return sortedSchedule.filter((schedule) =>
          schedule.location.includes("audimax")
        );
      } else if (this.filter === "w1") {
        return sortedSchedule.filter((schedule) =>
          schedule.location.includes("w1")
        );
      } else if (this.filter === "w2") {
        return sortedSchedule.filter((schedule) =>
          schedule.location.includes("w2")
        );
      } else if (this.filter === "w3") {
        return sortedSchedule.filter((schedule) =>
          schedule.location.includes("w3")
        );
      } else {
        return sortedSchedule;
      }
    },
    openSpeakerInfoModal(speaker, id) {
      this.activeSpeaker = speaker;
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
        (el) => el !== undefined
      );
      const activeElementIndex = filteredFocussableElements.indexOf(
        $event.target
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
    updateLiveSession() {
      return this.formattedLineup.map((session) => {
        let timeNow = new Date().toISOString();
        let sessionTimeStart = new Date(session.startTime).toISOString();
        let sessionTimeEnd = new Date(session.endTime).toISOString();

        if (timeNow >= sessionTimeStart && timeNow < sessionTimeEnd) {
          session.liveNow = true;
        } else {
          session.liveNow = false;
        }
      });
    },
  },
  filters: {
    trimTime: function (value) {
      let time = value.substring(value.indexOf("T") + 1);
      let timeSplit = time.split(":");
      let hour = timeSplit[0].startsWith("0")
        ? timeSplit[0].replace(/^0+/, "")
        : timeSplit[0];
      return hour + ":" + timeSplit[1];
    },
    convertTime: function (value, eventTime) {
      if (eventTime === "local") {
        return luxon.DateTime.fromISO(value)
          .toLocal()
          .toISO({ suppressMilliseconds: true });
      }
      return value;
    },
    formatLocation: function (value) {
      if (value) {
        if (value == "audimax") {
          return value;
        } else if (value.startsWith("w1") || value.startsWith("w2")) {
          return "Room W1 | W2";
        } else if (value.startsWith("w3")) {
          return "Room W3";
        } else {
          return value;
        }
      }
    },
    formatType: function (value) {
      if (value) {
        if (value.startsWith("presentation")) {
          return "talk";
        } else if (value.startsWith("workshop")) {
          return "workshop";
        } else if (value.startsWith("yoga")) {
          return "yoga";
        } else if (value.startsWith("lunch") || value.startsWith("food")) {
          return "dining";
        } else {
          return value;
        }
      }
    },
  },
});
