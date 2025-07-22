import { browserActionGetBadgeText, clearAlarm, getAlarms, getLocalStorage } from '../lib/core/tools.js'
import { isAuthenticated, listarProcessos } from './api.js'
import { currentBrowser } from '../lib/core/core.js'

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
  const manifest = currentBrowser.runtime.getManifest()
  currentBrowser.notifications.create(
    'notifyProcessos',
    {
      type: 'basic',
      iconUrl: currentBrowser.runtime.getURL(manifest.action.default_icon),
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
      currentBrowser.action.setBadgeText({ text: '1' })
    }
  }
  currentBrowser.storage.local.set({ browserAction })
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
      currentBrowser.storage.local.set({ browserAction })
      const badgeText = await browserActionGetBadgeText({})
      if (badgeText !== 'login') {
        notify({
          title: 'Erro ao checar processos',
          description: 'Usuário não está autenticado no SEI/SUPER'
        })
        currentBrowser.action.setBadgeText({ text: 'login' })
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
  currentBrowser.alarms.onAlarm.addListener(alarmNotifyProcessos)
  currentBrowser.alarms.create(alarmName, { periodInMinutes })
  await alarmNotifyProcessos({ name: alarmName })
}

async function disableNotifyProcessos () {
  browserAction.enabled = false
  browserAction.status = 'Desativado'
  browserAction.qtdNaoVisualizado = 0
  currentBrowser.storage.local.set({ browserAction })
  currentBrowser.action.setBadgeText({ text: '' })
  await clearAlarm(alarmName)
}

export async function notifyReceivedMenssage (message) {
  if (message.from === 'browserAction') {
    currentBrowser.action.setBadgeText({ text: '' })
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
  currentBrowser.tabs.create({ url: storage.baseUrl })
}
