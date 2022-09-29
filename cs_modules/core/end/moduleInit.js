/* global seiVersionCompare, seiVersion */

function ModuleInit (BaseName, PageReload = false) {
  const ModName = CompName + '.' + BaseName
  const IsModExec = $("head meta[name='" + ModName + "'").attr('value')

  if (seiVersionCompare('<', '3')) {
    console.log(`[${CompName} ${Date.now()}] ${BaseName} Versão incompatível do SEI. (${seiVersion})`)
    return false
  }
  if (IsModExec !== 'true') {
    $('head').append("<meta name='" + ModName + "' value='true'>")
    console.log('[' + CompName + ' ' + Date.now() + ']' + BaseName)
    return true
  } else if (IsModExec === 'true' && PageReload) {
    window.location.assign(window.location.href)
    console.log('[' + CompName + ' ' + Date.now() + ']' + BaseName + 'Reload page')
    return false
  } else {
    return false
  }
}
