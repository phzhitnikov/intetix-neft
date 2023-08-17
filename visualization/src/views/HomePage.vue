<template>
  <div class="kv">
    <div class="anim-warning" style="position:absolute; z-index:2;" v-show="showFlasksLeftWarning">
      <!-- Для выбора нового маршрута необходимо убрать колбы -->
      <img style="width: 1418px; height: 709px;" :src="require('@/assets/images/flasksLeftWarning.svg')"/>
    </div>

    <!-- Timano -->
    <router-link
        to="/timano"
        class="right"
        :class="interval == 3 ? 'home_animation' : ''"
    >
      <div class="box-r box-wrapper">
        <div class="timano_anime">
          <LottieAnimation
              ref="anim"
              :animationData="require('@/assets/animation/icon03.json')"
              :loop="true"
              :autoPlay="true"
          />
        </div>

        <div class="btn">
          ТИМАНО-ПЕЧОРА <br/>
          МИРОВЫЕ РЫНКИ <span>(XXI век)</span>
        </div>

        <LottieAnimation
            class="ladoshka ladoshka_timano_anime"
            ref="anim-lad1"
            :animationData="Ladoshka"
            :loop="true"
            :autoPlay="true"
        />
      </div>
    </router-link>

    <div class="top"></div>

    <!-- Sibir -->
    <router-link
        to="/sibir"
        class="left"
        :class="interval == 1 ? 'home_animation' : ''"
    >
      <div class="box-l box-wrapper">
        <div class="sibir_anime">
          <LottieAnimation
              ref="anim"
              :animationData="require('@/assets/animation/icon02.json')"
              :loop="true"
              :autoPlay="true"
          />
        </div>

        <div class="btn">
          ЗАПАДНАЯ СИБИРЬ - МОСКВА <br/>
          <span>(вторая половина XX века)</span>
        </div>

        <LottieAnimation
            class="ladoshka ladoshka_sibir_anime"
            ref="anim-lad2"
            :animationData="Ladoshka"
            :loop="true"
            :autoPlay="true"
        />
      </div>
    </router-link>

    <!-- Baku -->
    <router-link
        to="/baku"
        class="bottom"
        :class="interval == 2 ? 'home_animation' : ''"
    >
      <div class="box-b box-wrapper">
        <div class="baku_anime">
          <LottieAnimation
              ref="anim"
              :animationData="require('@/assets/animation/icon01.json')"
              :loop="true"
              :autoPlay="true"
          />
        </div>

        <div class="btn">
          БАКУ - САНКТ-ПЕТЕРБУРГ <br/>
          <span> (конец XIX века - начало XX века)</span>
        </div>

        <LottieAnimation
            class="ladoshka ladoshka_baku_anime"
            ref="anim-lad3"
            :animationData="Ladoshka"
            :loop="true"
            :autoPlay="true"
        />
      </div>
    </router-link>

    <span class="circle">
      <h3>
        КАК ПРОЛЕГАЛ ПУТЬ <br/>
        НЕФТИ В РАЗНЫЕ ЭПОХИ?
      </h3>
      <p>Чтобы узнать больше, выберите маршрут и <span style="color: #a90028;">прикоснитесь ладонью</span> к анимации
        <img class="hand" :src="HandIcon"/>
      </p>

    </span>
  </div>
</template>

<script>
import {LottieAnimation} from "lottie-web-vue"
import {mapActions, mapGetters, mapState} from "vuex";

import Ladoshka from '@/assets/animation/animasiya_ladoshka.json'
import HandIcon from '@/assets/images/hand.svg'

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
      HandIcon
    };
  },
  mounted() {
    this.resetButtonValue();

    this.animSwitchTimer = setInterval(() => {
      if (this.interval === 3)
        this.interval = 0;

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
