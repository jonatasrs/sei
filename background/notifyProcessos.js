import { browserActionGetBadgeText, getAlarms } from '../lib/core/tools.js'
import { listarProcessos } from './api.js'
import { notify } from './notify.js'

const periodInMinutes = 0.16
const alarmName = 'notifyProcessos'

async function notifyProcessos () {
  const lista = await listarProcessos()

  const qtdNaoVisualizado = lista.filter(e => !e.processoVisualizado).length
  if (qtdNaoVisualizado) {
    const count = Number(await browserActionGetBadgeText({}))
    if (!count) {
      notify({ title: 'Processos', description: 'Novo processo' })
      browser.browserAction.setBadgeText({ text: '1' })
    }
  }
  browser.storage.local.set({ qtdNaoVisualizado })
}

async function alarmNotifyProcessos (alarmInfo) {
  try {
    await notifyProcessos()
  } catch (error) {
    const result = await clearAlarm()
    console.error(alarmInfo.name, result, error)
    notify({
      title: 'Erro ao checar processos',
      description: `Erro ao carregar dados: ${error}`
    })
  }
}

export async function createAlarm () {
  const alarm = await getAlarms(alarmName)
  if (!alarm) {
    browser.alarms.onAlarm.addListener(alarmNotifyProcessos)
    browser.alarms.create(alarmName, { periodInMinutes })
  }
}

export async function clearAlarm () {
  return await browser.alarms.clear(alarmName)
}
