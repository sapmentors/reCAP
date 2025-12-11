'use strict';

// Store component definition for Vue 3
window.FooterSectionComponent = {
  template: `<div class="wrap">

      <div class="footer-container">
          <div class="links-container">
                <a href="https://www.computerservice-wolf.com/impressum.html" rel="noopener noreferrer" target="_blank"
                  hreflang="en">Legal Notice</a>

                <a href="https://bsky.app/profile/recap-conf.bsky.social" rel="noopener noreferrer" target="_blank"
                  hreflang="en" title="Follow us on Bluesky">
                  <svg aria-hidden="true">
                        <use xlink:href="images/icons/sprite.svg#bluesky"></use>
                    </svg>Bluesky
                </a>

                <a href="https://www.linkedin.com/company/recap-conference/" rel="noopener noreferrer" target="_blank"
                  hreflang="en">
                  <svg aria-hidden="true">
                        <use xlink:href="images/icons/sprite.svg#linkedin"></use>
                    </svg>LinkedIn
                </a>

                <a href="mailto:recap.conf@gmail.com?subject=[reCAP 2025] Question" target="_blank" rel="noopener noreferrer" title="contact us via mail">
                    <svg aria-hidden="true">
                        <use xlink:href="images/icons/sprite.svg#mail"></use>
                    </svg>Mail
                </a>

                <svg class="pixelfilter sr-only" hidden>
                <filter id="pixelate-mosaic" x="0%" y="0%" width="100%" height="100%">
                    <!--Thanks to Zoltan Fegyver for figuring out pixelation and producing the awesome pixelation map. -->
                    <feGaussianBlur stdDeviation="2" in="SourceGraphic" result="smoothed"></feGaussianBlur>
                    <feImage width="15" height="15" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAIAAAACDbGyAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAWSURBVAgdY1ywgOEDAwKxgJhIgFQ+AP/vCNK2s+8LAAAAAElFTkSuQmCC" result="displacement-map"></feImage>
                    <feTile in="displacement-map" result="pixelate-map"></feTile>
                    <feDisplacementMap in="smoothed" in2="pixelate-map" xChannelSelector="R" yChannelSelector="G" scale="50" result="pre-final"></feDisplacementMap>
                    <feComposite operator="in" in2="SourceGraphic"></feComposite>
                </filter>

                <filter id="pixelate" x="0" y="0">
                    <feFlood x="5" y="5" height="1" width="1"></feFlood>

                    <feComposite width="3" height="3"></feComposite>

                    <feTile result="a"></feTile>

                    <feComposite in="SourceGraphic" in2="a" operator="in"></feComposite>

                    <feMorphology operator="dilate" radius="1.5"></feMorphology>
                </filter>

            </svg>

          </div>
      </div>
  </div>`,
};