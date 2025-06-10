export const isChrome = typeof chrome !== 'undefined'
export const currentBrowser = isChrome ? chrome : browser
