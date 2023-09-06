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
import FlaskIndicatorAnimation from '@/assets/animation/flaskYellow.json';

export default {
  components: {
    WarningBlock, HomeButton, PlayVideo, LottieAnimation
  },

  mixins: [FlaskPageMixin],

  data() {
    return {
      FlaskIndicatorAnimation,
      deviceIds: [1, 2, 3, 4, 5, 6],
      videoFolder: "baku",
      videos: ["1_0.mp4", "1.mp4", "2.mp4", "3.mp4", "4.mp4", "5.mp4", "6.mp4"],
      finalExitTimeSec: 26 + 3,
    };
  },
};
</script>
