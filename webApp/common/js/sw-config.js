/**
 * @author monkeywang
 * Date: 17/4/24
 */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js').then((reg) => {
    console.log('register a service worker: ', reg)
  }).catch((err) => {
    console.log('err: ', err)
  })
}
