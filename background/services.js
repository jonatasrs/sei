import { getLocalStorage } from '../lib/core/tools.js'
import { enableNotifyProcessos, disableNotifyProcessos } from './notifyProcessos.js'

export function storageServices (changes, area) {
  initServices()
}

export async function initServices () {
  const storage = await getLocalStorage()
  if (storage.CheckTypes?.includes('notificacoes') && storage.baseUrl) {
    enableNotifyProcessos()
  } else {
    disableNotifyProcessos()
  }
}
