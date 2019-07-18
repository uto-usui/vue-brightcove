import Brightcove from './BrightcovePlayer'

function plugin(Vue) {
  Vue.component('brightcove', Brightcove)
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin)
}

export default plugin
