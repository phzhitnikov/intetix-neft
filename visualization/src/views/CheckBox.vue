<template>
  <div>
    <h1 class="title">Timano</h1>
    <div class="checkbox_wrapper">
      <input
        type="checkbox"
        class="checkbox"
        :class="{ 'd-block': active }"
        v-for="(item, i) of videosTimano"
        :key="i"
        @click="sendMessage(i, $event)"
      />
      <div
        @click="active = !active"
        class="checkbox_burger"
        :class="{ toggle: active }"
      >
        <span class="line1"></span>
        <span class="line2"></span>
        <span class="line3"></span>
      </div>
    </div>

    <!-- <div>
     <LottieAnimation
      ref="anim"
      :animationData="require('@/assets/animation/animasiya_ladoshka.json')"
      :loop="true"
      :autoPlay="true"
    />
 </div> -->
    <!-- <div>
   <LottieAnimation
      ref="anim"
      :animationData="require('@/assets/animation/icon01.json')"
      :loop="true"
      :autoPlay="true"
    />
 </div> -->
    <div>
      <LottieAnimation
        ref="anim"
        :animationData="require('@/assets/animation/howToStart.json')"
        :loop="true"
        :autoPlay="true"
      />
    </div>
  </div>
</template>

<script>
import { LottieAnimation } from "lottie-web-vue"
import io from "socket.io-client";

export default {
  components: {
    LottieAnimation,
  },

  data() {
    return {
      active: true,
      videosTimano: [
        "12_0.mp4",
        "12.mp4",
        "13.mp4",
        "14.mp4",
        "15.mp4",
        "16.mp4",
      ],
      socket: null,
      response: "",
    };
  },
  created() {
    this.socket = io("http://localhost:3005");

    this.socket.on("connect", () => {
      console.log("Connected to server");
    });
  },
  methods: {
    selectVideo(i) {
      const list = document.querySelectorAll(".video_wrapper video");
      list.forEach((a) => {
        a.currentTime = 0;
      });
      this.$emit("selectVideo", i);
    },
    sendMessage(video, e) {
      let isChecked = e.target.checked;//Нажато ли
      console.log(video, isChecked);
      this.response = video;
      this.isChecked = isChecked;
      this.socket.emit("message", this.response);
      this.response = "";
    },
  },
};
</script>


<style scoped>
.title {
  font-size: 100px;
  text-align: center;
}
</style>
