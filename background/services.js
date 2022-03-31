import { createAlarm, clearAlarm } from './notifyProcessos.js'

export function storageServices (changes, area) {
  initServices()
}

export async function initServices () {
  const storage = await browser.storage.local.get()
  if (storage.CheckTypes?.includes('notificacoes') && storage.baseUrl) {
    createAlarm()
  } else {
    clearAlarm()
  }
}
