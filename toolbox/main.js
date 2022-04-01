import '../lib/core/core.js'
import { getLocalStorage } from '../lib/core/tools.js'

export async function checkEnable () {
  const storage = await getLocalStorage()
  if (storage.CheckTypes?.includes('notificacoes') && storage.baseUrl) {
    setEnabled(true)
    document.querySelector('#processo-novo > span').textContent = storage.qtdNaoVisualizado || 0
  } else {
    setEnabled(false)
  }

  if (storage.baseUrl) {
    document.querySelector('#btn-processos').style.display = null
    document.querySelector('#btn-processos').addEventListener('click', () => openControleProcesso(storage.baseUrl))
  } else {
    document.querySelector('#btn-processos').style.display = 'none'
  }
}

function setEnabled (enabled = false) {
  const status = document.querySelector('#status-notify')
  status.textContent = enabled ? 'Ativado' : 'Desativado'
  status.className = enabled ? 'green' : 'red'
  document.querySelector('#processo-novo').style.display = enabled ? null : 'none'
}

function openControleProcesso (baseUrl) {
  browser.tabs.create({ url: baseUrl })
  window.close()
}

browser.browserAction.setBadgeText({ text: '' })
checkEnable()
