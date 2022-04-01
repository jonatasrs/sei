import { getLocalStorage } from '../lib/core/tools.js'

export async function fetchSei (url, options = { method: 'GET' }) {
  const resp = await fetch(url, options)
  if (resp.ok) {
    // const contentType = resp.headers.get('content-type')
    const buffer = await resp.arrayBuffer()
    const body = new TextDecoder('ISO-8859-1').decode(buffer)
    return body
  }
}

export async function getActionUrl (actionName) {
  const storage = await getLocalStorage()
  const parser = new DOMParser()
  const html = await fetchSei(storage.baseUrl)
  const doc = parser.parseFromString(html, 'text/html')
  const menu = doc.querySelector('#main-menu, #infraMenu')
  const link = menu.querySelector(`li > a[href*="acao=${actionName}"]`)
  return `${storage.baseUrl}${link.getAttribute('href')}`
}
