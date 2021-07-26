export const debounce = (callback, delay = 400) => {
  let timer
  clearTimeout(timer)
  timer = setTimeout(() => console.log("de"), 500)
}
