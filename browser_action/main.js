import { currentBrowser } from '../lib/core/core.js'
import { getLocalStorage } from '../lib/core/tools.js'

export async function checkEnable () {
  const storage = await getLocalStorage()
  const { qtdNaoVisualizado, enabled, status } = storage.browserAction
  const statusNotify = document.querySelector('#status-notify')
  statusNotify.textContent = status
  statusNotify.className = status === 'Ativado' ? 'green' : 'red'
  document.querySelector('#processo-novo').style.display = enabled ? null : 'none'
  if (enabled) {
    document.querySelector('#processo-novo > span').textContent = qtdNaoVisualizado
    document.querySelector('#hostname').textContent = storage.baseUrl
    document.querySelector('#btn-processos').style.display = null
    document.querySelector('#btn-processos').addEventListener('click', () => openControleProcesso(storage.baseUrl))
  } else {
    document.querySelector('#btn-processos').style.display = 'none'
  }
}

function openControleProcesso (baseUrl) {
  currentBrowser.tabs.create({ url: baseUrl })
}

checkEnable()

currentBrowser.runtime.sendMessage({
  from: 'browserAction',
  text: 'Action Clicked'
})
