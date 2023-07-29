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
         v-show="currentFlaskIdx >= 0">
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
      deviceIds: [12, 13, 14, 15, 16],
      videoFolder: "timano",
      videos: ["12_0.mp4", "12.mp4", "13.mp4", "14.mp4", "15.mp4", "16.mp4"],
      finalExitTimeSec: 32 + 3,
    };
  },
};
</script>
