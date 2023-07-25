<template>
  <div class="kv">
    <div class="anim-warning" style="position:absolute; z-index:2;" v-show="showFlasksLeftWarning">
      <!-- Расставьте колбы в ниши и выберите маршрут -->
      <LottieAnimation
          ref="anim"
          :animationData="require('@/assets/animation/howToStart.json')"
          :loop="true"
          :autoPlay="true"
      />
    </div>

    <div class="right_wrapper"></div>
    <!-- Timano -->
    <router-link
        to="/timano"
        class="right"
        :class="interval == 3 ? 'home_animation' : ''"
    >
      <router-link to="/timano">
        <div class="box-r">
          <div class="timano_anime">
            <LottieAnimation
                ref="anim"
                :animationData="require('@/assets/animation/icon03.json')"
                :loop="true"
                :autoPlay="true"
            />
          </div>

          <router-link class="btn" to="/timano">
            ТИМАНО-ПЕЧОРА <br/>
            МИРОВЫЕ РЫНКИ <span>(XXI век)</span>
          </router-link>
          <div
              class="ladoshka_timano_anime"
              :class="interval == 3 ? 'home_animation' : ''"
          >
            <LottieAnimation
                ref="anim-lad1"
                :animationData="Ladoshka"
                :loop="true"
                :autoPlay="false"
                class="ladoshka"
            />
          </div>
        </div>
      </router-link>
    </router-link>
    <div class="top"></div>

    <!-- Sibir -->
    <router-link
        to="/sibir"
        class="left"
        :class="interval == 1 ? 'home_animation' : ''"
    >
      <router-link to="/sibir" class="box-l">
        <div class="rink-l">
          <LottieAnimation
              ref="anim"
              :animationData="require('@/assets/animation/icon02.json')"
              :loop="true"
              :autoPlay="true"
          />
          <!-- <img
          :src="require('../assets/images/zapladnaya_sibir.svg')"
          alt="rink"
          class="rink-l"
        /> -->
        </div>
        <router-link class="btn" to="/sibir">
          ЗАПАДНАЯ СИБИРЬ - МОСКВА <br/>
          <span>(вторая половина XX века)</span>
        </router-link>
        <div class="ladoshka_sibir_anime">
          <LottieAnimation
              ref="anim-lad2"
              :animationData="Ladoshka"
              :loop="true"
              :autoPlay="false"
              class="ladoshka"
          />
        </div>
      </router-link>
    </router-link>

    <!-- Baku -->
    <router-link
        to="/baku"
        class="bottom"
        :class="interval == 2 ? 'home_animation' : ''"
    >
      <router-link to="/baku" class="b-box">
        <div class="baku_anime">
          <LottieAnimation
              ref="anim"
              :animationData="require('@/assets/animation/icon01.json')"
              :loop="true"
              :autoPlay="true"
          />
        </div>
        <router-link class="btn" to="/baku">
          БАКУ - САНКТ-ПЕТЕРБУРГ <br/>
          <span> (конец XIX века - начало XX века)</span>
        </router-link>
        <div class="ladoshka_baku_anime">
          <LottieAnimation
              ref="anim-lad3"
              :animationData="Ladoshka"
              :loop="true"
              :autoPlay="true"
              class="ladoshka"
          />

        </div>
      </router-link>
    </router-link>

    <span class="circle">
      <h3>
        КАК ПРОЛЕГАЛ ПУТЬ <br/>
        НЕФТИ В РАЗНЫЕ ЭПОХИ?
      </h3>
      <p>Чтобы узнать, выберите маршрут и коснитесь его названия</p>
    </span>
  </div>
</template>

<script>
import {LottieAnimation} from "lottie-web-vue"
import {mapActions, mapGetters, mapState} from "vuex";

import Ladoshka from '@/assets/animation/animasiya_ladoshka.json'

export default {
  name: "HomePage",
  components: {
    LottieAnimation,
  },
  data() {
    return {
      interval: 2,
      animSwitchTimer: null,
      Ladoshka,
    };
  },
  mounted() {
    this.resetButtonValue();

    this.animSwitchTimer = setInterval(() => {
      switch (this.interval) {
        case 0:
          this.$refs["anim-lad1"].stop();
          this.$refs["anim-lad2"].play();
          break;

        case 1:
          this.$refs["anim-lad2"].stop();
          this.$refs["anim-lad3"].play();
          break;

        case 2:
          this.$refs["anim-lad3"].stop();
          this.$refs["anim-lad1"].play();
          break;

        case 3:
          this.interval = 0;
      }

      this.interval++;
    }, 3600);
  },

  unmounted() {
    clearInterval(this.animSwitchTimer);
  },

  computed: {
    ...mapState(['lastButtonValue']),
    ...mapGetters(['placedFlasksCount']),

    showFlasksLeftWarning() {
      return this.placedFlasksCount > 0;
    }
  },

  watch: {
    lastButtonValue(value) {
      if (this.showFlasksLeftWarning) {
        // Don't allow to select scene if flasks are present on the table
        return;
      }

      switch (value) {
        case "Scene 1":
          this.$router.push({path: '/timano'});
          break;

        case "Scene 2":
          this.$router.push({path: '/baku'});
          break;

        case "Scene 3":
          this.$router.push({path: '/sibir'});
          break;
      }
    },
  },

  methods: {
    ...mapActions(['resetButtonValue'])
  }
};
</script>
