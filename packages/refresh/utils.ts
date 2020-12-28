const pending = (delay?: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('')
    }, delay)
  })
}

const throttle = (fn: Function, delay = 1000): Function => {
  let pre = new Date()
  return function (...args) {
    const now = new Date()
    if (Number(now) - Number(pre) > delay) {
      fn.apply(this, args)
      pre = now
    }
  }
}

export {
  pending,
  throttle
}
