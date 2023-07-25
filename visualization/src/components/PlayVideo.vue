<template>
  <div
      class="video_wrapper d-block"
  >
    <video
        v-for="(item, i) of videos"
        :key="i"

        ref="videoPlayer"
        class="video"
        :class="i === selectedIndex ? 'd-block' : 'd-none'"
        :src="require(`../assets/video/${videoFolder}/${item}`)"
        type="video/mp4"
        preload
        muted
    ></video>

    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    videos: Array,
    selectedIndex: Number,
    videoFolder: String
  },

  watch: {
    selectedIndex(index) {
      this.playVideo(index);
    },
  },

  mounted() {
    this.playVideo(this.selectedIndex);
  },

  methods: {
    playVideo(index) {
      const videoElement = this.$refs.videoPlayer[index];

      if (videoElement && videoElement instanceof HTMLVideoElement) {
        videoElement.play();
        this.pauseOtherVideos(index);
      }
    },

    // Pause all other videos except the one with selectedIndex
    pauseOtherVideos(selectedIndex) {
      for (let i = 0; i < this.videos.length; i++) {
        if (i === selectedIndex) {
          continue;
        }

        const videoElement = this.$refs.videoPlayer[i];
        if (videoElement && videoElement instanceof HTMLVideoElement) {
          videoElement.pause();
        }
      }
    },
  },
};
</script>
