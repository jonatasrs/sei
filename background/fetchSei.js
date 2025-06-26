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

/**
 *
 * @param {String} baseUrl URL base do SEI (Default: storage.baseUrl)
 * @returns {Promise<Document>} DOM document
 */
export async function fetchRoot (baseUrl = null) {
  const storage = await getLocalStorage()
  baseUrl = baseUrl || storage.baseUrl
  const parser = new DOMParser()
  const html = await fetchSei(baseUrl)
  return parser.parseFromString(html, 'text/html')
}

export async function getActionUrl (actionName) {
  const storage = await getLocalStorage()
  const doc = await fetchRoot()
  const menu = doc.querySelector('#main-menu, #infraMenu')
  const link = menu.querySelector(`li > a[href*="acao=${actionName}"]`)
  return `${storage.baseUrl}${link.getAttribute('href')}`
}
