import { listarProcessos } from './api.js'
import { notify } from './notify.js'

const periodInMinutes = 5
const alarmName = 'notifyProcessos'

async function notifyProcessos () {
  const lista = await listarProcessos()

  const naoVisualizado = lista.some(e => !e.processoVisualizado)
  if (naoVisualizado) {
    const count = Number(await browser.browserAction.getBadgeText({}))
    if (!count) {
      notify({ title: 'Processos', description: 'Novo processo' })
      browser.browserAction.setBadgeText({ text: '1' })
    }
  }
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
  const alarm = await browser.alarms.get(alarmName)
  if (!alarm) {
    browser.alarms.onAlarm.addListener(alarmNotifyProcessos)
    browser.alarms.create(alarmName, { periodInMinutes })
  }
}

export async function clearAlarm () {
  return await browser.alarms.clear(alarmName)
}
