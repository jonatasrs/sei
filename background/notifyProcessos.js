import { browserActionGetBadgeText, clearAlarm, getAlarms, getLocalStorage } from '../lib/core/tools.js'
import { isAuthenticated, listarProcessos } from './api.js'

const periodInMinutes = 5
const alarmName = 'notifyProcessos'
const browserAction = {
  enabled: false,
  status: 'Desativado',
  qtdNaoVisualizado: null
}

/**
 * Envia notificações ao sistema
 * @param {Object} message Mensagem {title: '', description: ''}
 */
function notify (message) {
  browser.notifications.create(
    'notifyProcessos',
    {
      type: 'basic',
      iconUrl: browser.runtime.getURL('icons/seipp.png'),
      title: message.title,
      message: message.description
    }
  )
}

async function notifyProcessos () {
  const lista = await listarProcessos()
  browserAction.qtdNaoVisualizado = lista.filter(e => !e.processoVisualizado).length
  browserAction.enabled = true
  browserAction.status = 'Ativado'
  if (browserAction.qtdNaoVisualizado) {
    const count = Number(await browserActionGetBadgeText({}))
    if (!count) {
      notify({ title: 'Processos', description: 'Novo processo' })
      browser.browserAction.setBadgeText({ text: '1' })
    }
  }
  browser.storage.local.set({ browserAction })
}

async function alarmNotifyProcessos (alarmInfo) {
  try {
    await notifyProcessos()
  } catch (error) {
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      browserAction.enabled = true
      browserAction.status = 'Não autenticado'
      browserAction.qtdNaoVisualizado = null
      browser.storage.local.set({ browserAction })
      const badgeText = await browserActionGetBadgeText({})
      if (badgeText !== 'login') {
        notify({
          title: 'Erro ao checar processos',
          description: 'Usuário não está autenticado no SEI/SUPER'
        })
        browser.browserAction.setBadgeText({ text: 'login' })
      }
    } else {
      const result = await disableNotifyProcessos()
      console.error(alarmInfo.name, result, error)
      notify({
        title: 'Erro ao checar processos',
        description: `Erro ao carregar dados: ${error}`
      })
    }
  }
}

async function enableNotifyProcessos () {
  browser.alarms.onAlarm.addListener(alarmNotifyProcessos)
  browser.alarms.create(alarmName, { periodInMinutes })
  await alarmNotifyProcessos({ name: alarmName })
}

async function disableNotifyProcessos () {
  browserAction.enabled = false
  browserAction.status = 'Desativado'
  browserAction.qtdNaoVisualizado = 0
  browser.storage.local.set({ browserAction })
  browser.browserAction.setBadgeText({ text: '' })
  await clearAlarm(alarmName)
}

export async function notifyReceivedMenssage (message) {
  if (message.from === 'browserAction') {
    browser.browserAction.setBadgeText({ text: '' })
  } else if (message.from === 'seippOptionsSave') {
    const storage = await getLocalStorage()
    if (storage.CheckTypes?.includes('notificacoes')) {
      const alarm = await getAlarms(alarmName)
      if (!alarm) enableNotifyProcessos()
    } else {
      disableNotifyProcessos()
    }
  }
}

export async function serviceNotify () {
  const storage = await getLocalStorage()
  if (storage.CheckTypes?.includes('notificacoes') && storage.baseUrl) {
    const alarm = await getAlarms(alarmName)
    if (alarm) await clearAlarm(alarmName)
    enableNotifyProcessos()
  } else {
    disableNotifyProcessos()
  }
}

export async function notifyOnClicked () {
  const storage = await getLocalStorage()
  browser.tabs.create({ url: storage.baseUrl })
}
