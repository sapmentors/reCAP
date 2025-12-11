'use strict';

// Store component definition for Vue 3  
window.NavSectionMobileComponent = {
  data: function () {
    return {
      currentPage: "",
      hamburgerMenuVisible: false,
    };
  },
  methods: {
    isActive: function (name) {
      return this.currentPage.includes(name);
    },
    toggleHamburgerMenu() {
      this.hamburgerMenuVisible = !this.hamburgerMenuVisible;
    },
  },
  mounted() {
    this.currentPage = window.location.href;
  },
  template: `<div class="mobile-nav">
    <div class="mobile-nav-container">
        <a href="index.html" aria-label="Home">
            <span class="sr-only">Link to Home Page</span>

            <img class="logo" src="./images/recap_logo.svg" alt="logo of recap conference">
        </a>

        <button class="mobile-nav-btn" @click="toggleHamburgerMenu()" v-bind:class="{ open: hamburgerMenuVisible }">
            <span></span>
            <span></span>
            <span></span>
        </button>
    </div>

    <ul class="mobile-nav-menu" v-if="hamburgerMenuVisible">
        <!-- <li>
            <a href="program.html" :class="{ active: isActive('program') }" :aria-current="isActive('program')">Agenda</a>
        </li>-->
        <!-- <li>
            <a href="speakerinfo.html" :class="{ active: isActive('speakerinfo') }" :aria-current="isActive('speakerinfo')">Speakers</a>
        </li>-->
        <li>
            <a href="location.html" :class="{ active: isActive('location') }" :aria-current="isActive('location')">Location</a>
        </li>
        <!-- <li>
            <a href="sponsors.html" :class="{ active: isActive('sponsors') }" :aria-current="isActive('sponsors')">Sponsors</a>
        </li>-->
        <!--<li>
            <a href="about.html" :class="{ active: isActive('about') }" :aria-current="isActive('about')">About</a>
        </li>-->
        <li>
            <a href="https://code-connect.dev/faq.html" target="_blank" :class="{ active: isActive('faq') }" :aria-current="isActive('faq')">FAQ</a>
        </li>
        <li>
            <a href="archive.html" :class="{ active: isActive('archive') }" :aria-current="isActive('archive')">Archive</a>
        </li>
    </ul>
  </div>
  `,
};