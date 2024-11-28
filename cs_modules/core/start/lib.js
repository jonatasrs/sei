/** * Configurações do sistema *************************************************/
/** Opção padrão caso não exista opções salvas. */
const DefaultOptions = {
  theme: 'white',
  CheckTypes: [
    'prazo',
    'qtddias',
    'chkbloco',
    'exibeinfointeressado',
    'atalhonovodoc',
    'filtraporatribuicao',
    'carregainformacaoblocos',
    'pesquisarinformacoes',
    'copiarnumeroprocessodocumento',
    'copiarlinkinterno',
    'retirarsobrestamentoreabrirembloco',
    'mostraranotacao',
    'atalhopublicacoeseletronicas',
    'incluirdocaoarrastar'
  ],
  InstallOrUpdate: true,
  ConfiguracoesCores: [
    { valor: '', cor: '00cc00' },
    { valor: '', cor: 'ffff00' },
    { valor: '', cor: 'ffb3cc' },
    { valor: '', cor: '33ccff' },
    { valor: '', cor: 'bfbfbf' }
  ],
  ConfPrazo: { Critico: 0, Alerta: 4 },
  ConfDias: { Critico: 30, Alerta: 20 },
  incluirDocAoArrastar_TipoDocPadrao: 'Anexo',
  usardocumentocomomodelo: true,
  exibeinfoatribuicao: true
}

const CompName = 'Seipp'

/** Options salvas */
var SavedOptions = DefaultOptions // eslint-disable-line no-unused-vars, no-var

/** * Verifica se está utilizando o navegador chrome ***************************/
const isChrome = (typeof browser === 'undefined') /* Chrome: */
var browser = isChrome ? chrome : browser

/** * Url base do sei ***********************************************************/
function GetBaseUrl () {
  const pathname = window.location.pathname.replace('controlador.php', '')
  return `${window.location.origin}${pathname}`
}

/** * MODULES: Generic class log ************************************************/
function __mconsole (ModuleName) {
  this.PModuleName = ModuleName
  console.log('[' + CompName + ' ' + Date.now() + ']  ' + this.PModuleName + ': Loading...')
}
__mconsole.prototype.log = function (message) {
  console.log('[' + CompName + ' ' + Date.now() + ']    ' + this.PModuleName + ': ' + message)
}
__mconsole.prototype.error = function (message) {
  console.error('[' + CompName + ' ' + Date.now() + ']    ERRO: ' + this.PModuleName + ': ' + message)
}

/* adicionar função de log no contexto da página */
execOnPage(`

  function __mconsole(ModuleName) {
    this.PModuleName = ModuleName;
    console.log("[${CompName} " + Date.now() + "]  " + this.PModuleName + ": Loading...");
  }
  __mconsole.prototype.log = function(message) {
      console.log("[${CompName} " + Date.now() + "]    "+ this.PModuleName+": " + message);
  }

`)

function Init (BaseName) {
  console.log('[' + CompName + ' ' + Date.now() + ']' + BaseName)
}

/** * Biblioteca de strings *****************************************************/

/** Adiciona a mascara de CPF/CNPJ. */
function format_cpf (cpf) {
  let mask = cpf

  if (cpf.length === 11) {
    mask = cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  } else if (cpf.length === 14) {
    mask = cpf.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      '$1.$2.$3/$4-$5')
  } else mask = ''
  return mask
}

/** Adicionar link css na página */
function AdicionarLinkCss (doc, id, href) {
  const head = doc.getElementsByTagName('head')[0]
  if (head === undefined) return
  /* Sai se for o CKEditor */
  const htitle = head.getElementsByTagName('title')[0]
  if (htitle !== undefined) { if (htitle.getAttribute('data-cke-title') !== null) return }
  const link = doc.createElement('link')
  link.id = id
  link.rel = 'stylesheet'
  link.type = 'text/css'
  link.href = browser.runtime.getURL(href)
  link.media = 'all'
  head.appendChild(link)
}

function isNumOnly (str) {
  if (isNaN(parseInt(str))) {
    return false
  } else {
    return true
  }
}

/**
 * PARA CHROME: Remove todos velhos eventos.
 * Necessário ao substutuir os eventos padrão.
 * @elemOrSelectors {HTMLElement | string} elemOrSelectors Elemento ou selectors
 */
function RemoveAllOldEventListener (elemOrSelectors) {
  if (typeof elemOrSelectors === 'object') {
    const elementID = elemOrSelectors instanceof jQuery
      ? elemOrSelectors.attr('id')
      : elemOrSelectors.getAttribute('id')

    const codeToRun = `
      $('#${elementID}').replaceWith($('#${elementID}').clone());
    `

    execOnPage(codeToRun)
  } else if (typeof elemOrSelectors === 'string') {
    const codeToRun = `{
      const element = document.querySelector('${elemOrSelectors}')
      element.replaceWith(element.cloneNode(true))
    }`
    execOnPage(codeToRun)
  }
}

/* Função que permite executar um código arbitrário
  no contexto da página, e não da extensão */
function execOnPage (code) {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('injectedScript.js');
  (document.head || document.documentElement).appendChild(script);
  script.onload = function () {
    script.remove();
  };
}

/*
  Função que carrega um script externo
  no contexto da página, e não da extensão.

  Lembre-se de o script deve ter sua permissão concedida
  no 'web_accessible_resources' do manifest.
*/
function addScriptToPage (scriptName, codeOnLoad) {
  const script = document.createElement('script')
  script.async = false;
  (document.head || document.documentElement).appendChild(script)
  if (codeOnLoad) {
    script.onload = function () {
      execOnPage(codeOnLoad)
    }
  }
  script.src = chrome.runtime.getURL(scriptName)
}

/**
 * Espera carregar elementos dentro de um elemento Raiz.
 * @param {*} ElemRaiz Elemento Raiz (jquery select).
 * @param {*} Elem Elemento a ser carregado (jquery select).
 * @param {function} func Função a ser executada apos o carregamento.
 * @param {number} TimeOut Tempo máximo de espera para carregar.
 */
function EsperaCarregar (Modlog, ElemRaiz, Elem, func, TimeOut = 3000) {
  if (TimeOut <= 0) { Modlog.log('Script não executado: TIMEOUT'); return }
  setTimeout(function () {
    if ($(ElemRaiz).find(Elem).length === 0) {
      // Modlog.log(ElemRaiz + ": find -> " + Elem + " : carregando...");
      EsperaCarregar(Modlog, ElemRaiz, Elem, func, TimeOut - 100)
    } else {
      Modlog.log(ElemRaiz + ' : Script executado.')
      func()
    }
  }, 100)
}

/**
 * Raliza a animação Fadein/Fadeout no elemento.
 * @param {HTMLElement} Elem
 */
function AnimacaoFade (Elem) {
  $(Elem).fadeOut(200).fadeIn(200)
}

/**
 * Carrega dados do storage
 */
function carregarDadosStorage (dados, fnSucesso, fnErro) {
  if (isChrome) {
    chrome.storage.local.get(dados, function (items) {
      if (chrome.runtime.lastError) {
        if (fnErro) fnErro()
      } else {
        if (fnSucesso) fnSucesso(items)
      }
    })
  } else {
    browser.storage.local.get(dados).then(fnSucesso, fnErro)
  }
}

/**
 * Salva dados do storage
 */
function salvarDadosStorage (dados, fnSucesso, fnErro) {
  if (isChrome) {
    chrome.storage.local.set(dados, function () {
      if (chrome.runtime.lastError) {
        if (fnErro) fnErro()
      } else {
        if (fnSucesso) fnSucesso()
      }
    })
  } else {
    browser.storage.local.set(dados).then(fnSucesso, fnErro)
  }
}
