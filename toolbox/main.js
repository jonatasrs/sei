import '../lib/core.js'

export async function checkEnable () {
  const storage = await browser.storage.local.get()
  if (storage.CheckTypes?.includes('notificacoes') && storage.baseUrl) {
    setStatus(true)
  } else {
    setStatus(false)
  }

  if (storage.baseUrl) {
    document.querySelector('#btn-processos').addEventListener('click', () => openControleProcesso(storage.baseUrl))
  }
}

function setStatus (enabled = false) {
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
