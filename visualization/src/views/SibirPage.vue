<template>
  <div class="video_page">
    <WarningBlock :warning="priorityWarning"
                  :warningStyle="warningStyle"/>

    <div style="position:absolute; z-index:0;">
      <PlayVideo :videos="videos"
                 :selectedIndex="currentVideoIdx"
                 :videoFolder="videoFolder">
        <HomeButton/>
      </PlayVideo>
    </div>

    <div class="flask_indicator_wrapper" style="z-index:1;"
         v-show="currentFlaskIdx >= 0"
    >
      <LottieAnimation
          ref="flaskIndicator"
          style="position:relative;"
          :style="currentFlaskStyle"
          :animationData=FlaskIndicatorAnimation
          :loop="true"
          :autoPlay="true"
      />
    </div>
  </div>
</template>

<script>
import {LottieAnimation} from "lottie-web-vue"
import PlayVideo from "@/components/PlayVideo";
import FlaskPageMixin from "@/mixins/FlaskPageMixin";
import HomeButton from "@/components/HomeButton.vue";
import WarningBlock from "@/components/WarningBlock.vue";

export default {
  components: {
    WarningBlock, HomeButton, PlayVideo, LottieAnimation
  },

  mixins: [FlaskPageMixin],

  data() {
    return {
      deviceIds: [7, 8, 9, 10, 11],
      videoFolder: "sibir",
      videos: ["7_0.mp4", "7.mp4", "8.mp4", "9.mp4", "10.mp4", "11_fixed.mp4", "11.mp4"],
      finalExitTimeSec: 41 + 3,
    };
  },
};
</script>
