<template>
  <div style="position: absolute; z-index: 2;" :style="warningStyle" v-show="warning === Warning.RuinedSequence">
    <!-- Проверьте расположение ранее установленных фигур и продолжайте путь -->
    <LottieAnimation
        :animationData=RuinedSequenceWarningAnimation
        :loop="true"
        :autoPlay="true"
        :speed="animationSpeed"
    />
  </div>

  <div style="position: absolute; z-index: 2;" :style="warningStyle" v-show="warning === Warning.Inactivity">
    <!-- Для продолжения переставьте фигуры и нажмите кнопку домой -->
    <LottieAnimation
        :animationData=InactivityWarningAnimation
        :loop="true"
        :autoPlay="true"
        :speed="animationSpeed"
    />
  </div>

  <div style="position: absolute; z-index: 2;" :style="warningStyle" v-show="warning === Warning.WrongFlask">
    <!-- Неверно! -->
    <LottieAnimation
        :animationData=WrongFlaskWarningAnimation
        :loop="true"
        :autoPlay="true"
        :speed="animationSpeed"
    />
  </div>
</template>

<script>
import {LottieAnimation} from "lottie-web-vue";

import RuinedSequenceWarningAnimation from "@/assets/animation/checkFiguresAndProceed.json";
import InactivityWarningAnimation from '@/assets/animation/inactivityWarning.json';
import WrongFlaskWarningAnimation from '@/assets/animation/wrong.json';
import {Warning} from "@/utils";

export default {
  components: {LottieAnimation},
  props: ['warning', 'warningStyle'],

  data() {
    return {
      Warning,

      // Animations
      RuinedSequenceWarningAnimation,
      WrongFlaskWarningAnimation,
      InactivityWarningAnimation,

      // Settings
      animationSpeed: 0.65,
    }
  },

  computed: {
  }

}
</script>
