<template>
  <div class="bc-player">
    <div ref="video" class="bp__inner"></div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import bc from '@brightcove/player-loader'

import { BrightcovePlayerProps, PlayerVueData } from './BrightcovePlayer'

export default Vue.extend({
  name: 'Brightcove',

  props: {
    id: {
      type: String,
      default: '',
    },
    options: {
      type: Object as PropType<BrightcovePlayerProps | null>,

      default: null,
    },
  },

  data(): PlayerVueData {
    return {
      player: null,
    }
  },

  computed: {
    //
  },

  mounted(): void {
    this.init()
  },

  beforeDestroy() {
    if (this.player) {
      this.disposePlayer()
      this.player = null
    }
  },

  methods: {
    async init() {
      const { ref } = await bc({
        refNode: this.$refs.video as HTMLDivElement,
        ...this.options,
      })

      // video.js object - https://docs.videojs.com/player
      this.player = ref
      this.player && this.eventAttach()
    },

    /**
     * destroy
     */
    disposePlayer() {
      this.eventDetach()

      // destroy player
      if (this.player && this.player.dispose) {
        this.player.dispose()
      }

      // cleanup iframe
      if (this.player && this.player.parentNode) {
        this.player.parentNode.removeChild(this.player)
      }

      // destroy bc instance
      bc.reset()
    },

    /**
     * attach event handlers
     */
    eventAttach() {
      if (this.player) {
        this.player.on('play', this.onPlay)
        this.player.on('timeupdate', this.onTimeupdate)
        this.player.on('pause', this.onPause)
        this.player.on('ended', this.onEnded)
      }
    },

      /**
       * detach event handlers
       */
      eventDetach() {
        if (this.player) {
          this.player.off('play', this.onPlay)
          this.player.off('timeupdate', this.onTimeupdate)
          this.player.off('pause', this.onPause)
          this.player.off('ended', this.onEnded)
        }
      },

    /**
     * handlers
     */
    onPlay(e) {
      this.$emit('onPlay', e.target)
      console.log('▶️ on play')
    },
    onTimeupdate(e) {
      this.$emit('onTimeupdate', e.target)
      this.player &&
        console.log(
          '⬆️ on timeupdate',
          `${this.player.currentTime()} / ${this.player.duration()}`,
        )
    },
    onPause(e) {
      this.$emit('onPause', e.target)
      console.log('⏸ on pause')
    },
    onEnded(e) {
      this.$emit('onEnded', e.target)
      console.log('⏹ on ended')
    },
  },
})
</script>

<style lang="scss" scoped>
.bc-player {
  position: relative;
  width: 100%;
}

.bc__inner {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%;
  transform: translateY(-50%);
  //
  /deep/ video {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
