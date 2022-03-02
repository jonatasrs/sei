/**
 * Métodos não suportados no múdulo de webservice do sei:
 * core.d_idle.Lib.WsSei.js
 */
const seipp_api_name = 'Sei++_API: '
const seipp_api = {
  processo: {
    consultar: '__ProcessoConsultar',
    consultar_dados: 'procedimento_alterar',
    marcador: 'andamento_marcador_gerenciar',
    acompanhamento: 'acompanhamento_cadastrar',
    enviar: 'procedimento_enviar'
  },
  procedimento: {
    anotacao: 'anotacao_registrar',
    marcador: 'andamento_marcador_gerenciar'
  },
  listar: {
    processos: 'procedimento_controlar'
  },
  marcador: {
    listar: 'marcador_listar'
  },
  unidade_alterar: ''
}

/**
 * Api POST (Criar/Alterar/Excluir)
 * @param {seipp_api} apirest
 * @param {*} json_data
 */
function ext_ws_post (apirest, json_data, opt_data = null, resp = null) {
  return new Promise((resolve, reject) => {
    if (__isInGroup(seipp_api, apirest)) {
      let ExecPost = null
      if (__isInGroup(seipp_api.processo, apirest) && opt_data != null) {
        /* opt_data corresponde a resposta de consulta do processo = proc */
        ExecPost = Promise.resolve(opt_data).then(proc => {
          /** Pega o link para buscar os dados */
          const link = GetBaseUrl() + proc.LinkComandos.reduce((acc, cur) => {
            if (cur.indexOf(apirest) != -1) acc = cur
            return acc
          })
          console.log(apirest + 'GET ' + apirest + ' > ' + link)
          return fetch(link, { method: 'GET' })
        }).then(response => {
          /** Converte a resposta para ISO-8859-1 */
          const contentType = response.headers.get('content-type')
          if (response.ok) {
            if (contentType && contentType.includes('text/html')) {
              return response.arrayBuffer().then(buf => new TextDecoder('ISO-8859-1').decode(buf))
            } else { console.log(contentType); throw new Error('Erro no Content Type esperado!') }
          } else {
            throw new Error(response.statusText + ': ' + response.status)
          }
        })
      } else if (__isInGroup(seipp_api.listar, apirest) && resp != null) {
        ExecPost = Promise.resolve(resp)
      } else if (apirest == seipp_api.unidade_alterar) {
        ExecPost = Promise.resolve(document.documentElement.outerHTML)
      } else if (resp != null) {
        ExecPost = Promise.resolve(resp)
      }

      if (ExecPost != null) {
        ExecPost.then(resp => {
          /** Trata a resposta de acordo com a api */
          switch (apirest) {
            case seipp_api.processo.marcador:
              return __ProcessoCadastrarMarcador_Post(resp, json_data)
            case seipp_api.processo.acompanhamento:
              return __ProcessoAcompanhamentoCadastrarAlterar_Post(resp, json_data)
            case seipp_api.processo.enviar:
              return __Post_ProcessoEnviar(resp, json_data)
            case seipp_api.listar.processos:
              return __Post_ListarProcessos(resp, json_data)
            case seipp_api.unidade_alterar:
              return __Post_UnidadeAlterar(resp, json_data)
            default:
              return new Error(seipp_api_name + ': Api não implementada')
          }
        }).then(post => {
          /** Envia o post da requisição */
          console.log(seipp_api_name + 'POST ' + apirest + ' > ' + post.url, post.data)
          post.data = postEncodeURI(post.data)
          return fetch(GetBaseUrl() + post.url, {
            body: post.data,
            headers: { 'content-type': 'application/x-www-form-urlencoded', Referer: post.url },
            method: 'POST'
          })
        }).then(function (response) {
          const contentType = response.headers.get('content-type')
          console.log('ext_ws_post', contentType)
          if (response.ok) {
            if (contentType && contentType.includes('text/html')) {
              return response.arrayBuffer().then(buf => new TextDecoder('ISO-8859-1').decode(buf))
            } else if (contentType && contentType.includes('wsapi')) {
              return response.msg
            } else { console.log(contentType); throw new Error('Erro no Content Type esperado!') }
          } else {
            throw new Error(response.statusText + ': ' + response.status)
          }
        }).then(function (resp) {
          resolve(resp)
        })
      } else { reject(seipp_api_name + 'ERRO: Post') }
    } else {
      reject(Error('Api não implementada: ' + apirest))
    }
  })
}

/**
 * Encore raw data post.
 * @param {object} data Objeto com os dados post.
 */
function postEncodeURI (data) {
  let postdata = ''

  for (const name in data) {
    const value = data[name]
    if (postdata != '') { postdata = postdata + '&' }
    postdata = postdata + name + '=' + escape(value.replace(/\s/g, '+'))
  }
  return postdata
}

function ext_ws_get (apirest, params = null, id_url = null) {
  return Promise.resolve().then(() => {
    let link = ''
    if (__isInGroup(seipp_api, apirest)) {
      if (__isInGroup(seipp_api.processo, apirest)) {
        if (apirest == seipp_api.processo.consultar) {
          if (params != null && params != '') {
            link = params
          } else if (id_url != null) {
            link = 'controlador.php?acao=procedimento_trabalhar&id_procedimento=' + id_url
          } else {
            throw new Error('IdProcesso não informado')
          }
        } else { /** Pega o link do comando */
          link = params.LinkComandos.find(function (cmd) {
            if (cmd.indexOf(apirest) != -1) return cmd
          })
        }
        if (link == undefined) {
          switch (apirest) {
            // case ext_wsapi.processo.acompanhamento:
            //   var resp = {msg: null, ok: true, headers: new Headers({ "content-type": "wsapi" }) };
            //   return resp;
            default:
              throw new Error(seipp_api_name + ': Link de comando do processo não encontrado: ' + apirest)
          }
        }
      } else { /** comandos do menu */
        link = $("#main-menu li a[href^='controlador.php?acao=" + apirest + "']").attr('href')
      }
    } else {
      throw new Error('Api não implementada: ' + apirest)
    }
    /** Execulta a consulta */
    link = GetBaseUrl() + link
    console.log(seipp_api_name + 'GET ' + apirest + ' > ' + link)
    return fetch(link, { method: 'GET' })
  }).then(function (response) {
    const contentType = response.headers.get('content-type')
    if (response.ok) {
      if (contentType && contentType.includes('text/html')) {
        return response.arrayBuffer().then(buf => new TextDecoder('ISO-8859-1').decode(buf))
      } else if (contentType && contentType.includes('wsapi')) {
        return response.msg
      } else { console.log(contentType); throw new Error('Erro no Content Type esperado!') }
    } else {
      throw new Error(response.statusText + ': ' + response.status)
    }
  }).then(function (resp) {
    console.log(apirest)
    switch (apirest) {
      case seipp_api.processo.consultar:
        return __ProcessoConsultar(resp)
      case seipp_api.processo.consultar_dados:
        return __ProcessoConsultarDados(resp)
      case seipp_api.processo.marcador:
        return __ProcessoConsultarMarcador(resp)
      case seipp_api.processo.acompanhamento:
        return __ProcessoAcompanhamentoConsultar(resp)
      case seipp_api.marcador.listar:
        return __Get_MarcadorListar(resp)
      case seipp_api.listar.processos:
        return __Get_ListarProcessos(resp)
      default:
        throw new Error('Api não implementada')
    }
  })
}

function __isInGroup (group, value) {
  for (const iterator in group) {
    if (typeof group[iterator] === 'object') if (__isInGroup(group[iterator], value)) return true
    if (group[iterator] == value) return true
  }
  return false
}

/** **** Métodos que usam post ******/
/**
 * Paramentros para envio de processo.
 * @typedef {object} __Param_ProcessoEnviar
 * @prop {boolean} manterAberto Manter processo aberto na unidade atual.
 * @property {boolean} removerAnotacao Remover anotação.
 * @property {boolean} enviarEmail Enviar e-mail de notificação.
 * @property {number} prazo Data Certa = 1 ou Prazo em dias = 2
 * @property {string} dias
 * @property {boolean} diasUteis
 * @property {__Param_Unidades[]} unidades Array de unidades
 */

/**
* Paramentros para envio de processo.
* @typedef {object} __Param_Unidades
* @property {number} id id da unidade.
* @property {string} nome Nome da unidade.
*/

/**
 *
 * @param {string} resp
 * @param {__Param_ProcessoEnviar} json_data
 */
function __Post_ProcessoEnviar (resp, json_data) {
  return new Promise((resolve, reject) => {
    const excludes = []
    const $html = $($.parseHTML(resp))
    const $form = $html.find('#frmAtividadeListar')
    const post = { url: '', data: {} }
    post.url = $form.attr('action')
    $form.find(':input').each(function () {
      const name = $(this).attr('name')
      let val = $(this).val()
      val = Array.isArray(val) ? val[0] : val
      if (excludes.find(n => n == name) == undefined && val != undefined) {
        switch (name) {
          case 'chkSinManterAberto':
            if (isUndefined(json_data.manterAberto, false)) {
              post.data[name] = 'on'
            }
            break
          case 'chkSinRemoverAnotacoes':
            if (isUndefined(json_data.removerAnotacao, false)) {
              post.data[name] = 'on'
            }
            break
          case 'chkSinEnviarEmailNotificacao':
            if (isUndefined(json_data.enviarEmail, false)) {
              post.data[name] = 'on'
            }
            break
          case 'rdoPrazo':
            post.data[name] = isUndefined(json_data.prazo, val)
            break
          case 'txtDias':
            post.data[name] = isUndefined(json_data.dias, val)
            break
          case 'chkSinDiasUteis':
            if (isUndefined(json_data.diasUteis, false)) {
              post.data[name] = 'on'
            }
            break
          case 'hdnUnidades':
            post.data[name] = isUndefined(json_data.unidades[0].id, val)
            break
          default:
            if ($(this).attr('type') == 'checkbox' || $(this).attr('type') == 'radio') {
              if ($(this).prop('checked')) {
                post.data[name] = val
              }
            } else {
              post.data[name] = val
            }
            break
        }
      }
    })
    resolve(post)
  })
}

function __Post_UnidadeAlterar (resp, json_data) {
  return new Promise((resolve, reject) => {
    const excludes = []
    const $html = $($.parseHTML(resp))
    const $form = $html.find('#frmInfraSelecionarUnidade')
    const post = { url: '', data: {} }
    post.url = $form.attr('action').replace(GetBaseUrl(), '')
    $form.find(':input').each(function () {
      const name = $(this).attr('name')
      let val = $(this).val()
      val = Array.isArray(val) ? val[0] : val
      if (excludes.find(n => n == name) == undefined && val != undefined) {
        switch (name) {
          case 'selInfraUnidades':
            post.data[name] = isUndefined(json_data.idUnidade, false)
            break
          default:
            post.data[name] = val
            break
        }
      }
    })
    resolve(post)
  })
}
/** **** Métodos que usam get *******/

const __Ret_ListarProcessos = {
  /** @type {number} Id do processo */
  id: -1,
  /** @type {string} Número do processo com máscara */
  numDoc: '',
  tipo: '',
  especificacao: '',
  linkHash: '',
  atribuido: '',
  anotacao: {
    descricao: '',
    usuario: '',
    prioridade: false
  },
  marcador: {
    nome: '',
    cor: '',
    descricao: ''
  },
  pontoControle: '',
  status: {
    /** @type {boolean} Indica se o processo foi recebido na unidade */
    visualizado: false,
    visitado: false
  }
}

function __Get_ListarProcessos (resp) {
  return __Get_ControleDeProcessos(resp)
}

/**
 * Pega a lista de processos, ações do processo da tela controle de processo.
 * @param {string} resp html de retorno do fetch.
 * @returns {__Ret_ProcessoListar[]}
 */
function __Get_ControleDeProcessos (resp, paginar = true, idProcesso = null) {
  return new Promise((resolve, reject) => {
    const $html = $($.parseHTML(resp))
    const confOrig = { tipoVisualizacao: '', meusProcessos: '', idMarcador: '' }
    /** (R = Resumida | D = Detalhada) > mudarVisualizacao() -> hdnTipoVisualizacao = valor */
    confOrig.tipoVisualizacao = $html.find('#hdnTipoVisualizacao').val()
    /** (T = Todos | M = Meus) > verProcessos() -> hdnMeusProcessos = valor */
    confOrig.meusProcessos = $html.find('#hdnMeusProcessos').val()
    confOrig.meusProcessos = confOrig.meusProcessos == '' ? 'T' : confOrig.meusProcessos
    /** filtrado por Marcador > filtrarMarcador(null) -> hdnIdMarcador110000002 = valor ???? */
    confOrig.idMarcador = $html.find("input[id^='hdnIdMarcador']").val()
    /** Se estiver filtrado tem que remover os filtros e buscar a página novamente */
    if (confOrig.meusProcessos == 'M' || confOrig.idMarcador != '' || confOrig.tipoVisualizacao == 'R') {
      /** Fazer um post na página */
      const post_data = { tipoVisualizacao: 'D', meusProcessos: 'T', idMarcador: '' }
      ext_ws_post(seipp_api.listar.processos, post_data, null, resp).then((resp) => __Get_ControleDeProcessos(resp, paginar, idProcesso)).then(ret => {
        /** Retornar filtros iniciais da tela */
        ext_ws_post(seipp_api.listar.processos, confOrig, null, resp).then(() => {
          console.log('__Get_ProcessoListar: Filtros originais redefinidos.')
        })
        resolve(ret)
      })
    } else {
      const $trows = $html.find('#tblProcessosDetalhado tr[id]')
      const processos = []

      $trows.each(function (index) {
        const $trow = $(this)
        /** @type {__Ret_ProcessoListar} */
        const p = {}

        p.id = $trow.attr('id').substr(1)
        p.numDoc = $trow.find('td:nth-child(3) > a').text()
        console.log(p.numDoc)
        p.linkHash = $trow.find('td:nth-child(3) > a').attr('href')
        p.especificacao = /\'([^\'][^\,][^\']*)\'/.exec($trow.find('td:nth-child(3) > a').attr('onmouseover'))[1]
        p.tipo = $trow.find('td:nth-child(5)').text()
        p.atribuido = $trow.find('td:nth-child(4) > a').text()

        const $anotacao = $trow.find("td:nth-child(2) > a[href^='controlador.php?acao=anotacao_registrar']")
        p.anotacao = null
        if ($anotacao.length > 0) {
          var regex = /\'([^\']*)\'/g
          var tx = $anotacao.attr('onmouseover')
          p.anotacao = {}
          p.anotacao.descricao = regex.exec(tx)[1].replace(/\\r\\n/g, '\r\n').replace(/\\n/g, '\n').replace(/\\&/g, '&')
          p.anotacao.descricao = $($.parseHTML(p.anotacao.descricao)).text()
          p.anotacao.usuario = regex.exec(tx)[1]
          p.anotacao.prioridade = $anotacao.find("img[src*='prioridade']").length > 0
        }

        const $marcador = $trow.find("td:nth-child(2) > a[href^='controlador.php?acao=andamento_marcador_gerenciar']")
        p.marcador = null
        if ($marcador.length > 0) {
          var regex = /\'([^\']*)\'/g
          var tx = $marcador.attr('onmouseover')
          p.marcador = {}
          p.marcador.descricao = regex.exec(tx)[1].replace(/\\r\\n/g, '\r\n').replace(/\\n/g, '\n').replace(/\\&/g, '&')
          p.marcador.descricao = $($.parseHTML(p.marcador.descricao)).text()
          p.marcador.nome = regex.exec(tx)[1]
          p.marcador.cor = /\_(.*)\./.exec($marcador.find('img').attr('src'))[1]
        }

        const $pontoControle = $trow.find("td:nth-child(2) > a[href^='controlador.php?acao=andamento_situacao_gerenciar']")
        p.pontoControle = null
        if ($pontoControle.length > 0) {
          p.pontoControle = /\'(.*)\'/.exec($pontoControle.attr('onmouseover'))[1]
        }

        p.status = {}
        p.status.visualizado = $trow.find('td:nth-child(3) > a.processoVisualizado').length > 0
        p.status.visitado = $trow.find('td:nth-child(3) > a.processoVisitado').length > 0

        processos.push(p)
      })

      if (idProcesso != null) {
        if (processos.find(e => e.id == idProcesso) != undefined) {
          paginar = false
        }
      }

      /* Se tiver paginação execulta a busca em todas as paginações */
      if (paginar && $html.find('#divInfraAreaPaginacaoSuperior').children().length > 0) {
        const paginaAtual = $html.find('#hdnInfraPaginaAtual').val()
        let $PaginacaoOption = $html.find('#selInfraPaginacaoSuperior > option')
        const arr = []
        if ($PaginacaoOption.length == 0) {
          $PaginacaoOption = $('<option/><option/>')
        }

        console.log('Total de páginas: ' + $PaginacaoOption.length)

        $PaginacaoOption.each((i, opt) => {
          if (i != paginaAtual) {
            arr.push(ext_ws_post(seipp_api.listar.processos, { paginaAtual: i.toString() }, null, resp).then(html => {
              return __Get_ControleDeProcessos(html, false, idProcesso)
            }))
          }
        })
        Promise.all(arr).then(resps => {
          if (idProcesso != null) {
            const proc = resps.find(e => e != null)
            if (proc != undefined) {
              resolve(resp)
            } else {
              resolve(null)
            }
          } else {
            resolve(resps.reduce((a, c) => a.concat(c), processos))
          }
        })
      } else {
        if (idProcesso != null) {
          /** Busca processo */
          if (processos.find(e => e.id == idProcesso) != undefined) {
            resolve(resp)
          } else {
            resolve(null)
          }
        } else {
          resolve(processos)
        }
      }
    }
  })
}
function __Post_ListarProcessos (resp, json_data) {
  return new Promise((resolve, reject) => {
    const excludes = []
    const $html = $($.parseHTML(resp))
    const $form = $html.find('#frmProcedimentoControlar')
    const hdnIdMarcador = $html.find("input[id^='hdnIdMarcador']").attr('id')
    const post = { url: '', data: {} }
    post.url = $form.attr('action')
    console.log(hdnIdMarcador)
    $form.find('> [name], > * > [name]').each(function () {
      const name = $(this).attr('name')
      const val = $(this).val()
      if (excludes.find(n => n == name) == undefined && val != undefined) {
        switch (name) {
          case 'hdnMeusProcessos':
            post.data[name] = isUndefined(json_data.meusProcessos, val)
            break
          case hdnIdMarcador:
            post.data[name] = isUndefined(json_data.idMarcador, val)
            break
          case 'hdnTipoVisualizacao':
            post.data[name] = isUndefined(json_data.tipoVisualizacao, val)
            break
          case 'hdnInfraPaginaAtual':
            post.data[name] = isUndefined(json_data.paginaAtual, val)
            break
          default:
            post.data[name] = val
            break
        }
      }
    })
    resolve(post)
  })
}

/**
 * Retorna JSON com os dados e comandos do processo.
 * @param {*} resp
 */
function __ProcessoConsultar (resp) {
  return new Promise((resolve, reject) => {
    const $html = $($.parseHTML(resp))
    const Processo = {
      __tipo: 'processo',
      id: -1,
      Numero: -1,
      Flags: {
        Restrito: null,
        PontoControle: null,
        Marcador: {
          Nome: null,
          Cor: null
        }
      },
      LinkComandos: []
    }

    let linkArvore = $('#ifrArvore', $html).attr('src')
    if (linkArvore != undefined) {
      linkArvore = linkArvore
      resolve(ext_ws_get(seipp_api.processo.consultar, linkArvore))
    } else {
      /** Pega os links dos camandos do processo */
      let x = resp.indexOf('Nos[0].acoes')
      x = resp.indexOf("'", x) + 1
      let y = resp.indexOf('Nos[0]', x) - 3
      const $html2 = $($.parseHTML(resp.substring(x, y)))
      $html2.each(function (i, tag) {
        const href = $(tag).attr('href')
        if (href != '#') Processo.LinkComandos.push(href)
      })
      if (Processo.LinkComandos.length < 1) {
        throw new Error('Link de comandos do processo não encontrado.')
      }
      /** Pega as ações flags do processo */
      x = resp.indexOf('infraArvoreAcao("NIVEL_ACESSO') /** ACESSO RESTRITO */
      if (x != -1) {
        x = resp.indexOf('Acesso Restrito\\n', x) + 17
        y = resp.indexOf('"', x)
        Processo.Flags.Restrito = resp.substring(x, y)
      }
      x = resp.indexOf('infraArvoreAcao("SITUACAO') /** PONTO DE CONTROLE */
      if (x != -1) {
        x = resp.indexOf('Ponto de Controle\\n', x) + 19
        y = resp.indexOf('"', x)
        Processo.Flags.PontoControle = resp.substring(x, y)
      }
      x = resp.indexOf('infraArvoreAcao("MARCADOR') /** MARCADOR */
      if (x != -1) {
        x = resp.indexOf('Marcador\\n', x) + 10
        y = resp.indexOf('"', x)
        Processo.Flags.Marcador.Nome = resp.substring(x, y)
        x = resp.indexOf('_', y) + 1
        y = resp.indexOf('.png', x)
        Processo.Flags.Marcador.Cor = resp.substring(x, y)
      }
      /** Pega o número do processo */
      x = resp.indexOf('Nos[0].acoes') - 30
      x = resp.indexOf('"', x) + 1
      y = resp.indexOf('"', x)
      Processo.Numero = resp.substring(x, y)

      /** Pega o id do processo */
      x = resp.indexOf('id_procedimento=')
      x = resp.indexOf('=', x) + 1
      y = resp.indexOf('&', x)
      Processo.id = resp.substring(x, y)

      resolve(Processo)
    }
  })
}

/**
 * Consulta os dados do processo (Tela alterar processo)
 * @param {*} $html
 */
function __ProcessoConsultarDados (resp) {
  return new Promise((resolve, reject) => {
    const $html = $($.parseHTML(resp))
    const DadosProcesso = {
      IdProcedimento: -1,
      ProtocoloProcedimentoFormatado: '',
      NomeTipoProcedimento: '',
      /** Novos */
      Numero: '',
      DataAutuacao: null,
      Tipo: '',
      Especificacao: '',
      Interessados: [],
      Observacao: '',
      ObservacaoOutrasUnidades: [],
      NivelAcesso: -1,
      HipoteseLegal: null
    }
    DadosProcesso.IdProcedimento = $('#hdnIdProcedimento', $html).val()
    DadosProcesso.ProtocoloProcedimentoFormatado = $('#hdnProtocoloFormatado', $html).val()
    DadosProcesso.NomeTipoProcedimento = $('#hdnNomeTipoProcedimento', $html).val()
    DadosProcesso.Numero = DadosProcesso.ProtocoloProcedimentoFormatado.replace(/\D/g, '')
    DadosProcesso.DataAutuacao = $('#txtDtaGeracaoExibir', $html).val()
    DadosProcesso.Tipo = DadosProcesso.NomeTipoProcedimento
    DadosProcesso.Especificacao = $('#txtDescricao', $html).val()
    $('#selInteressadosProcedimento > option', $html).each(function name (params) {
      DadosProcesso.Interessados.push($(this).text())
    })
    DadosProcesso.Observacao = $('#txaObservacoes', $html).text()
    $('#divObservacoesOutras > table > tbody > tr[class]', $html).each(function (index) {
      const observacao = {
        index: index,
        unidade: $(this).find('td:nth-child(1)').text(),
        observacao: $(this).find('td:nth-child(2)').text()
      }
      DadosProcesso.ObservacaoOutrasUnidades.push(observacao)
    })

    DadosProcesso.NivelAcesso = $("input[name='rdoNivelAcesso'][checked]", $html).val()
    if (DadosProcesso.NivelAcesso == 1) {
      const Acesso = { nome: '', valor: -1 }
      const $acesso = $('#selHipoteseLegal option[selected]', $html)
      Acesso.nome = $acesso.text()
      Acesso.valor = $acesso.val()
      DadosProcesso.HipoteseLegal = Acesso
    }
    resolve(DadosProcesso)
  })
}

function __ProcessoConsultarMarcador (resp) {
  return new Promise((resolve, reject) => {
    const $html = $($.parseHTML(resp))
    const marcador = {
      id: -1,
      marcador: '',
      data: null,
      usuario: '',
      texto: '',
      cor: '',
      historico: []
    }
    const $tabela = $("#tblHistorico tr[class='infraTrClara']", $html)
    if ($tabela.length) {
      $tabela.each(function () {
        const historico = {
          data: $('td:eq(0)', $(this)).text(),
          usuario: $('td:eq(1)', $(this)).text(),
          marcador: $('td:eq(2)', $(this)).text(),
          texto: $('td:eq(3)', $(this)).text()
        }
        marcador.historico.push(historico)
      })
      const $optsel = $('#selMarcador option[selected]', $html)
      if ($optsel.val() != 'null') {
        marcador.id = $optsel.val()
        marcador.marcador = $optsel.text()
        marcador.data = marcador.historico[0].data
        marcador.usuario = marcador.historico[0].usuario
        marcador.texto = marcador.historico[0].texto
        marcador.cor = $optsel.attr('data-imagesrc')
        marcador.cor = marcador.cor.substring(
          marcador.cor.indexOf('_') + 1,
          marcador.cor.indexOf('.png')
        )
      }
    }
    resolve(marcador)
  })
}
/* var Marcador = {
  id: -1,
  idProcesso: -1,
  texto: ""
}
var post = {
  url: "",
  data: ""
} */
function __ProcessoCadastrarMarcador_Post (resp, json_data) {
  return new Promise((resolve, reject) => {
    const excludes = ['selMarcador']
    const $html = $($.parseHTML(resp))
    const post = { url: '', data: {} }
    post.url = $('#frmGerenciarMarcador', $html).attr('action')

    $('#frmGerenciarMarcador [name]', $html).each(function () {
      const name = $(this).attr('name')
      const val = $(this).val()
      if (excludes.find(n => n == name) == undefined && val != undefined) {
        switch (name) {
          case 'hdnIdMarcador':
            post.data[name] = json_data.id
            break
          case 'txaTexto':
            post.data[name] = json_data.texto
            break
          default:
            post.data[name] = val
            break
        }
      }
    })
    resolve(post)
  })
}

function __ProcessoAcompanhamentoConsultar (resp) {
  return new Promise((resolve, reject) => {
    const acompanhamento = {
      id: -1,
      grupo: null,
      observacao: ''
    }
    const $html = $($.parseHTML(resp))
    if ($('#frmAcompanhamentoCadastro', $html).attr('action').indexOf('acompanhamento_cadastrar') == -1) {
      /** Se tiver acomapnhamento */
      acompanhamento.id = $('#hdnIdAcompanhamento', $html).val()
      acompanhamento.observacao = $('#txaObservacao', $html).val()
      const $sel = $('#selGrupoAcompanhamento > option[selected]', $html)
      if ($sel.val() != 'null') {
        const grupo = {
          id: $sel.val(),
          nome: $sel.text()
        }
        acompanhamento.grupo = grupo
      }
    }
    resolve(acompanhamento)
  })
}
const acompanhamento = {
  id: -1,
  idProcesso: -1,
  grupo: null,
  observacao: ''
}
function __ProcessoAcompanhamentoCadastrarAlterar_Post (resp, json_data) {
  return new Promise((resolve, reject) => {
    const excludes = ['btnExcluir']
    const $html = $($.parseHTML(resp))
    const post = { url: '', data: {} }
    if (isUndefined(json_data.excluir, false)) {
      let x, y
      x = resp.indexOf('controlador.php?acao=acompanhamento_excluir')
      y = resp.indexOf("'", x)
      post.url = resp.substring(x, y)
      excludes.push('sbmAlterarAcompanhamento')
    } else {
      post.url = $('#frmAcompanhamentoCadastro', $html).attr('action')
    }

    $('#frmAcompanhamentoCadastro [name]', $html).each(function () {
      const name = $(this).attr('name')
      const val = $(this).val()

      if (excludes.find(n => n == name) == undefined && val != undefined) {
        switch (name) {
          case 'txaObservacao':
            post.data[name] = isUndefined(json_data.observacao, val)
            break
          case 'selGrupoAcompanhamento':
            post.data[name] = isUndefined(json_data.grupo, val)
            break
          case 'hdnIdAcompanhamento':
            post.data[name] = isUndefined(json_data.id, val)
            break
          case 'hdnIdProcedimento':
            post.data[name] = isUndefined(json_data.idProcesso, val)
            break
          default:
            post.data[name] = val
            break
        }
      }
    })
    resolve(post)
  })
}
/**
 * Busca a lista de marcadores da área.
 * @param {*} resp
 */
function __Get_MarcadorListar (resp) {
  return new Promise((resolve, reject) => {
    const $html = $($.parseHTML(resp))
    const marcadores = []
    const $tabela = $('#divInfraAreaTabela > table > tbody > tr[class]', $html)
    if ($tabela.length) {
      $tabela.each(function () {
        const marcador = {
          id: $('td:eq(3)', $(this)).text(),
          nome: $('td:eq(2)', $(this)).text(),
          cor: $('td:eq(1) > a > img', $(this)).attr('src'),
          ativo: !$(this).hasClass('trVermelha')
        }
        marcador.cor = marcador.cor.substring(
          marcador.cor.indexOf('_') + 1,
          marcador.cor.indexOf('.png')
        )
        marcadores.push(marcador)
      })
      resolve(marcadores)
    } else {
      if ($('#divInfraAreaTabela', $html).length == 1) {
        resolve(marcadores)
      } else {
        reject(seipp_api_name + 'Erro ao listar marcadores')
      }
    }
  })
}
