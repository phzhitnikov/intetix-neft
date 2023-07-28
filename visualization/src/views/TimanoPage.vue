<template>
  <div class="video_page">
    <div style="position: absolute; z-index: 2;" v-show="showRuinedSequenceWarning">
      <!-- Проверьте расположение ранее установленных фигур и продолжайте путь -->
      <LottieAnimation
          ref="anim"
          :animationData=RuinedSequenceWarningAnimation
          :loop="true"
          :autoPlay="true"
      />
    </div>

    <div style="position: absolute; z-index: 2;" v-show="showInactivityWarning">
      <!-- Для продолжения переставьте фигуры и нажмите кнопку домой -->
      <LottieAnimation
          ref="anim"
          :animationData=InactivityWarningAnimation
          :loop="true"
          :autoPlay="true"
      />
    </div>

    <div style="position: absolute; z-index: 2;" v-show="showWrongFlaskWarning">
      <!-- Неверно! -->
      <LottieAnimation
          ref="anim"
          :animationData=WrongFlaskWarningAnimation
          :loop="true"
          :autoPlay="true"
      />
    </div>

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

export default {
  components: {
    HomeButton, PlayVideo, LottieAnimation
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
