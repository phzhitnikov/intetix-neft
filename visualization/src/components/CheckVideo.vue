<template>
  <div class="checkbox_wrapper">
    <input
      type="checkbox"
      class="checkbox"
      :class="{ 'd-block': active }"
      v-for="(item, i) of videos"
      :key="i"
      @click="selectVideo(i)"
      :checked="index == i ? true : false"
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
</template>

<script>
export default {
  props: ["videos", "index", "pathName"],
  data() {
    return {
      active: true,
    };
  },
  methods: {
    selectVideo(i) {
      const list = document.querySelectorAll(".video_wrapper video");
      list.forEach((a) => {
        a.currentTime = 0;
      });
      this.$emit("selectVideo", i);
    },
  },
};
</script>
