<template>
  <div class="bc-player">
    <div ref="video" class="bp__inner"></div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import bc from '@brightcove/player-loader'

import { BrightcovePlayerProps, PlayerVueData } from './BrightcovePlayer'

interface DataLocal {
  animId: number
  viewportIn: boolean
}

type BrightcovePlayerData = PlayerVueData & DataLocal

export default Vue.extend({
  name: 'BrightcovePlayer',

  props: {
    id: {
      type: String,
      default: '',
    },
    options: {
      type: Object as PropType<BrightcovePlayerProps | null>,

      default: null,
    },
    isAutoPlay: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      player: null,
      animId: 0,
      viewportIn: false,
    } as BrightcovePlayerData
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
      //
      this.isAutoPlay && this.autoPlay()
    },

    /**
     * destroy
     */
    disposePlayer() {
      this.eventDetach()
      cancelAnimationFrame(this.animId)

      // Nothing to dispose.
      if (!this.player) {
        return
      }

      // Dispose an in-page player.
      if (this.player.dispose) {
        this.player.pause && this.player.pause()
        this.player.dispose()

        // Dispose an iframe player.
      } else if (this.player.parentNode) {
        this.player.parentNode.removeChild(this.player)
      }

      this.player = null
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
      // this.player &&
      //   console.log(
      //     '⬆️ on timeupdate',
      //     `${this.player.currentTime()} / ${this.player.duration()}`,
      //   )
    },
    onPause(e) {
      this.$emit('onPause', e.target)
      console.log('⏸ on pause')
    },
    onEnded(e) {
      this.$emit('onEnded', e.target)
      console.log('⏹ on ended')
    },

    /**
     * audit scroll position
     */
    autoPlay() {
      // element rect
      const rect = this.$el.getBoundingClientRect()
      // scroll position
      const scrollTop =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop
      const top = rect.top + scrollTop - document.documentElement.clientTop
      // viewport height
      const windowHeight = window.innerHeight
      // dist - from window bottom to content top
      const contentTop = scrollTop + windowHeight - top
      // ratio - Until the element is visible and then invisible 0 ~ 1
      const ratio =
        Math.trunc((contentTop / (rect.height + windowHeight)) * 100) / 100

      if (ratio > 0.03 && ratio < 1) {
        !this.viewportIn && this.play()
        this.viewportIn = true
      } else {
        this.pause()
        this.viewportIn = false
      }

      this.animId = requestAnimationFrame(this.autoPlay)
    },

    play() {
      this.player && this.player.paused() && this.player.play()
    },

    pause() {
      this.player && !this.player.paused() && this.player.pause()
    },
  },
  // render(h) {
  //   return h('div')
  // },
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
