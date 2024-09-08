import { isChrome, currentBrowser } from '../lib/core/core.js';
import { handleInstalled } from '../lib/core/tools.js';
import { initServices } from './services.js';

/******************************************************************************
 SEI ++: Script que adiciona novas funcionalidades ao SEI
 Autor: Jonatas Evaristo
*******************************************************************************/


currentBrowser.runtime.onInstalled.addListener(handleInstalled);


if (!isChrome) {
  currentBrowser.runtime.getBrowserInfo().then(function (info) {
    currentBrowser.storage.local.set({ version: info.version }).then(null, null);
  });
}


initServices();
