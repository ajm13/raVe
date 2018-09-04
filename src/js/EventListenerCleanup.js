const events = {}
const og_addEventListener = EventTarget.prototype.addEventListener
// const og_removeEventListener = EventTarget.prototype.removeEventListener

EventTarget.prototype.addEventListener = function(type, listener, context) {
  if (!events[context]) events[context] = []
  events[context].push({ element: this, type, listener })
  og_addEventListener.apply(this, [type, listener])
}

// EventTarget.prototype.removeEventListener = function (type) {
//   og_removeEventListener.apply(this, arguments)
// }

window.removeAllEventListeners = function(context) {
  if (!events[context]) return

  for (const { element, type, listener } of events[context]) {
    element.removeEventListener(type, listener)
  }

  events[context] = []
}
