import { browserActionGetBadgeText, clearAlarm, getAlarms } from '../lib/core/tools.js'
import { listarProcessos } from './api.js'
import { notify } from './notify.js'

const periodInMinutes = 5
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
    const result = await disableNotifyProcessos()
    console.error(alarmInfo.name, result, error)
    notify({
      title: 'Erro ao checar processos',
      description: `Erro ao carregar dados: ${error}`
    })
  }
}

export async function enableNotifyProcessos () {
  const alarm = await getAlarms(alarmName)
  if (!alarm) {
    browser.alarms.onAlarm.addListener(alarmNotifyProcessos)
    browser.alarms.create(alarmName, { periodInMinutes })
    await alarmNotifyProcessos({ name: alarmName })
  }
  console.log(alarmName, 'enabled')
}

export async function disableNotifyProcessos () {
  console.log(alarmName, 'disabled')
  return await clearAlarm(alarmName)
}
