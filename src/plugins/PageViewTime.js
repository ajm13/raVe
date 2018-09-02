/* eslint-disable */

export default {
  install(Vue, options) {
    const { router } = options

    const tracking = {}
    let currentPage

    const logTime = useBeacon => {
      const options = useBeacon ? { transport: 'beacon' } : {}

      const diff = Date.now() - tracking[currentPage].show
      const time = Math.floor((diff + tracking[currentPage].total) / 1000)

      Vue.$ga.time('Page View Time', 'total', time, currentPage, options)
    }

    router.beforeEach((to, from, next) => {
      if (currentPage) logTime()
      next()
    })

    router.afterEach((to, from) => {
      currentPage = to.name
      tracking[currentPage] = {
        show: Date.now(),
        total: 0
      }
    })

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        const time = Date.now() - tracking[currentPage].show
        tracking[currentPage].total += time
      } else {
        tracking[currentPage].show = Date.now()
      }
    })

    window.addEventListener('unload', () => logTime(true))
  }
}
