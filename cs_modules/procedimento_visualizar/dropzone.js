/* global __mconsole, GetBaseUrl, SavedOptions */
const dropzone = {}

/*
  Dropzone.utils
  Objeto com algumas funções úteis
*/
dropzone.utils = {

  formatarNumero: function (number) {
    return (number < 10 ? '0' : '') + number
  },

  hoje: function () {
    const dataHoje = new Date()
    return dropzone.utils.formatarNumero(dataHoje.getDate()) +
      '/' +
      dropzone.utils.formatarNumero((dataHoje.getMonth() + 1)) +
      '/' +
      dataHoje.getFullYear()
  },

  /* extraído do sei: InfraUtil.js */
  infraFormatarTamanhoBytes: function (numBytes) {
    let ret = null
    if (numBytes > 1099511627776) {
      ret = Math.round(numBytes / 1099511627776 * 100) / 100 + ' Tb'
    } else if (numBytes > 1073741824) {
      ret = Math.round(numBytes / 1073741824 * 100) / 100 + ' Gb'
    } else if (numBytes > 1048576) {
      ret = Math.round(numBytes / 1048576 * 100) / 100 + ' Mb'
    } else /* if (numBytes > 1024) */ {
      ret = Math.round(numBytes / 1024 * 100) / 100 + ' Kb'
    }
    return ret
  },

  // encodeURIComponent para ISO-8859-1
  escapeComponent: function (str) {
    return escape(str).replace(/\+/g, '%2B')
  }
}

/*
  Dropzone.ui
  IIFE que controla o estado da view
*/

dropzone.ui = (function () {
  const ui = {}

  ui.wrapper = $(`
    <div class='dropzone-wrapper'>
      <div class='dropzone-bg'></div>
      <div class='dropzone-ui'>
      <img class='dropzone-icon'>
      <p class='dropzone-label'></p>
      </div>
    </div>
  `)

  ui.icon = ui.wrapper.find('.dropzone-icon')
  ui.label = ui.wrapper.find('.dropzone-label')

  function mudarIcone (icone) {
    ui.icon.attr('src', browser.runtime.getURL(`icons/${icone}`))
  }

  function mudarTexto (texto) {
    ui.label.text(texto)
  }

  function mudarProgresso (progresso) {
    mudarTexto('Criando documentos...' + progresso + '%')
  }

  function checkarContemArquivos (dataTransfer) {
    return (
      dataTransfer &&
      dataTransfer.files &&
      dataTransfer.types &&
      dataTransfer.types.indexOf('Files') > -1
    )
  }

  function adicionarDropzone () {
    mudarTexto('Arraste aqui...')
    mudarIcone('fileUpload.png')

    ui.wrapper.appendTo('body')

    window.addEventListener('drop', function (evt) {
      evt.preventDefault()
      if (!checkarContemArquivos(evt.dataTransfer)) return
      mudarIcone('aguarde.gif')
      mudarProgresso(0)
      for (let i = 0; i < evt.dataTransfer.files.length; i++) {
        dropzone.jobs.adicionar(evt.dataTransfer.files[i])
      }
      dropzone.jobs.executar()
    })

    window.addEventListener('dragover', function (evt) {
      evt.preventDefault()
    })

    window.addEventListener('dragenter', function (evt) {
      evt.preventDefault()
      if (!checkarContemArquivos(evt.dataTransfer)) return
      ui.wrapper.show()
    })

    window.addEventListener('dragleave', function (evt) {
      evt.preventDefault()
      if (evt.relatedTarget === null) {
        ui.wrapper.hide()
      }
    })
  }

  return {
    adicionarDropzone,
    mudarProgresso
  }
})()

/*
  Dropzone.jobs
  IIFE que gerencia os jobs de inserção de documentos
*/

dropzone.jobs = (function () {
  const jobs = []

  function adicionar (arquivoParaUpload) {
    const job = {
      arquivo: arquivoParaUpload,
      nome: arquivoParaUpload.name,
      status: 'em_andamento',
      progresso: 0
    }
    jobs.push(job)
  }

  function executar () {
    jobs.forEach(function (job) {
      const http = new dropzone.Http(job.arquivo, function (novoStatus, novoProgresso) {
        job.status = novoStatus
        job.progresso = novoProgresso || 0
        atualizaProgresso()
        verificarSeCompletou()
      })
      http.inserirDocumentoExterno()
    })
  }

  function atualizaProgresso () {
    const totalProgresso = jobs.reduce(function (anterior, job) {
      if (job.status === 'em_andamento') return anterior + job.progresso
      if (job.status === 'erro') return anterior + 1
      if (job.status === 'completo') return anterior + 1
      return anterior
    }, 0)
    const progresso = Math.trunc((totalProgresso / jobs.length) * 100)
    dropzone.ui.mudarProgresso(progresso)
  }

  function verificarSeCompletou () {
    const haEmAndamento = jobs.some(function (job) { return (job.status === 'em_andamento') })
    if (haEmAndamento) return /* jobs ainda em andamento */

    /* jobs terminaram */
    const jobsComErro = jobs.filter(function (job) { return (job.status === 'erro') })

    /* quando há algum erro */
    if (jobsComErro.length > 0) {
      const jobsStr = jobsComErro.map(function (job) { return job.nome }).join(', ')
      alert('Ocorreu um erro ao incluir documento externo com o(s) seguinte(s) anexo(s): ' + jobsStr + '. Verifique se o processo encontra-se aberto na unidade.')
    }

    /* recarrega a página sempre que os jobs terminam, independente se erro ou sucesso */
    location.reload()
  }

  return {
    adicionar,
    executar
  }
})()

/*
  Dropzone.http
  Função que deve ser construída (new) para cada upload.
  Faz uma série de requisições AJAX que permite criar o documento externo com o anexo informado como parâmetro.
*/
dropzone.Http = function (arquivoParaUpload, fnNovoStatus) {
  this.arquivoParaUpload = arquivoParaUpload
  this.fnNovoStatus = fnNovoStatus
}

dropzone.Http.prototype.passos = {

  /*
    1º passo:
      - ler a url que abre a página 'Incluir Documento'
      - abrir a página
  */
  1: {

    obterUrl: function () {
      const todasAsScriptTag = document.getElementsByTagName('script')
      const regex = /^Nos\[0\].acoes = '<a href="(.*?)" tabindex="451"/m
      // Procurar a primeira scriptTag que contem o código em questao
      const scriptTagProcurada = Array.from(todasAsScriptTag).find(function (element) {
        return regex.exec(element.innerHTML) !== null
      })
      const resultado = regex.exec(scriptTagProcurada.innerHTML)
      if (resultado === null) return null
      return resultado[1]
    },

    abrirPagina: function () {
      const urlDocExterno = this.passos['1'].obterUrl()
      if (urlDocExterno === null) {
        dropzone.log('Erro ao inserir documento externo: não foi possível encontrar o botão de inserir documento.')
        this.fnNovoStatus('erro')
        return
      }
      $.ajax({
        url: GetBaseUrl() + urlDocExterno,
        success: function (resposta) {
          this.passos['2'].abrirPagina.call(this, resposta)
        }.bind(this),
        error: function () {
          dropzone.log('Erro ao inserir documento externo: ocorreu um erro ao abrir a página de inserir documento.')
          this.fnNovoStatus('erro')
        }.bind(this)
      })
    }

  },

  /*
    2º passo:
      - ler a url que aponta para o tipo de documento 'Externo'
      - abrir a página
  */
  2: {

    obterUrl: function (resposta) {
      const regex = /<a\s+(?:[^>]*?\s+)?href="(.*?)" tabindex="1003" class="ancoraOpcao"> Externo<\/a>/m
      const resultado = regex.exec(resposta)
      if (resultado === null) return null
      return resultado[1]
    },

    abrirPagina: function (resposta) {
      const urlNovoDocExterno = this.passos['2'].obterUrl(resposta)
      if (urlNovoDocExterno === null) {
        dropzone.log('Erro ao inserir documento externo: não foi localizado link para o documento tipo externo.')
        this.fnNovoStatus('erro')
        return
      }
      $.ajax({
        url: GetBaseUrl() + urlNovoDocExterno,
        success: function (resposta) {
          this.passos['3'].enviarArquivo.call(this, resposta)
        }.bind(this),
        error: function () {
          dropzone.log('Erro ao inserir documento externo: ocorreu um erro ao abrir a página de escolher o tipo de documento.')
          this.fnNovoStatus('erro')
        }.bind(this)

      })
    }

  },

  /*
    3º passo:
      - extrair a url para submeter o upload
      - faz o upload do arquivo
  */
  3: {

    obterURLUpload: function (resposta) {
      const regex = /^\s*objUpload = new infraUpload\('frmAnexos','(.+?)'\);/m
      const resultado = regex.exec(resposta)
      if (resultado === null) return null
      return resultado[1]
    },

    obterUsuarioEUnidade: function (resposta) {
      const regex = /\s*objTabelaAnexos\.adicionar\(\[arr\['nome_upload'\],arr\['nome'\],arr\['data_hora'\],arr\['tamanho'],infraFormatarTamanhoBytes\(arr\['tamanho'\]\),'(.+?)' ,'(.+?)']\);/gm
      const resultado = regex.exec(resposta)
      if (resultado === null) return null
      return {
        usuario: resultado[1],
        unidade: resultado[2]
      }
    },

    gerarHdnAnexos: function (usuarioEUnidade, uploadIdentificador) {
      const uploadIdentificadores = uploadIdentificador.split('#')
      const id = uploadIdentificadores[0]
      const nome = uploadIdentificadores[1]
      const dthora = uploadIdentificadores[4]
      const tamanho = uploadIdentificadores[3]
      const tamanhoFormatado = dropzone.utils.infraFormatarTamanhoBytes(Number.parseInt(tamanho))
      return `${id}±${nome}±${dthora}±${tamanho}±${tamanhoFormatado}±${usuarioEUnidade.usuario}±${usuarioEUnidade.unidade}`
    },

    enviarArquivo: function (resposta) {
      const urlUpload = this.passos['3'].obterURLUpload(resposta)
      if (urlUpload === null) {
        dropzone.log('Erro ao inserir documento externo: não foi localizada a URL para enviar o arquivo.')
        this.fnNovoStatus('erro')
        return
      }
      const data = new FormData()
      data.append('filArquivo', this.arquivoParaUpload, this.arquivoParaUpload.name)
      $.ajax({
        url: GetBaseUrl() + urlUpload,
        method: 'POST',
        contentType: false,
        processData: false,
        data,
        xhr: function () {
          const xhr = $.ajaxSettings.xhr()
          if (xhr.upload) {
            xhr.upload.onprogress = function (e) {
              if (e.lengthComputable) {
                this.fnNovoStatus('em_andamento', (e.loaded / e.total))
              }
            }.bind(this)
          }
          return xhr
        }.bind(this),
        success: function (uploadIdentificador) {
          const usuarioEUnidade = this.passos['3'].obterUsuarioEUnidade(resposta)
          if (usuarioEUnidade === null) {
            dropzone.log('Erro ao inserir documento externo: não foram localizados dados de usuário/unidade dentro da página.')
            this.fnNovoStatus('erro')
            return
          }
          const hdnAnexos = this.passos['3'].gerarHdnAnexos(usuarioEUnidade, uploadIdentificador)
          this.passos['4'].submeterFormulario.call(this, hdnAnexos, resposta)
        }.bind(this),
        error: function () {
          dropzone.log('Erro ao inserir documento externo: ocorreu um erro ao realizar a operação de upload.')
          this.fnNovoStatus('erro')
        }.bind(this)
      })
    }

  },

  /*
    4º passo:
      - setar os dados do formulário da página do novo documento externo
      - submeter o formulário
  */
  4: {

    /* dá preferência por documento que seja denominado Anexo. Se não, escolhe o primeiro. */
    escolherTipoDocumentoExterno: function (select) {
      const options = select.find('option')
      let tipoDocumento = null
      const tipoPadrao = SavedOptions.incluirDocAoArrastar_TipoDocPadrao || 'Anexo'
      options.each(function () {
        if ($(this).text().trim() === tipoPadrao) tipoDocumento = $(this).attr('value')
      })
      return !tipoDocumento ? options.eq(1).attr('value') : tipoDocumento
    },

    obterDados: function (hdnAnexos, resposta) {
      const $resposta = $(resposta)
      const urlParaEnvio = $resposta.find('form#frmDocumentoCadastro').attr('action')
      const form = {}
      form.hdnInfraTipoPagina = $resposta.find('#hdnInfraTipoPagina').attr('value')
      form.hdnInfraTipoPagina = $resposta.find('#hdnInfraTipoPagina').attr('value')
      form.selSerie = this.passos['4'].escolherTipoDocumentoExterno($resposta.find('#selSerie'))
      form.hdnStaDocumento = $resposta.find('#hdnStaDocumento').attr('value')
      form.hdnIdUnidadeGeradoraProtocolo = $resposta.find('#hdnIdUnidadeGeradoraProtocolo').attr('value')
      form.hdnIdProcedimento = $resposta.find('#hdnIdProcedimento').attr('value')
      form.hdnIdTipoProcedimento = $resposta.find('#hdnIdTipoProcedimento').attr('value')
      form.hdnSinBloqueado = $resposta.find('#hdnSinBloqueado').attr('value')

      const nomeDoDocumento = this.arquivoParaUpload.name.replace(/\.[^/.]+$/, '').slice(0, 49)

      const postFields = {
        hdnInfraTipoPagina: form.hdnInfraTipoPagina,
        selSerie: form.selSerie,
        txtDataElaboracao: dropzone.utils.hoje(),
        txtProtocoloDocumentoTextoBase: '',
        rdoTextoInicial: 'N',
        hdnIdDocumentoTextoBase: '',
        txtNumero: nomeDoDocumento,
        rdoFormato: 'N',
        selTipoConferencia: 'null',
        txtDescricao: '',
        txtRemetente: '',
        hdnIdRemetente: '',
        txtInteressado: '',
        hdnIdInteressado: '',
        txtDestinatario: '',
        hdnIdDestinatario: '',
        txtAssunto: '',
        hdnIdAssunto: '',
        txaObservacoes: '',
        selGrauSigilo: 'null',
        rdoNivelAcesso: '0',
        hdnFlagDocumentoCadastro: '2',
        hdnAssuntos: '',
        hdnInteressados: '',
        hdnDestinatarios: '',
        hdnIdSerie: form.selSerie,
        hdnIdUnidadeGeradoraProtocolo: form.hdnIdUnidadeGeradoraProtocolo,
        hdnStaDocumento: form.hdnStaDocumento,
        hdnIdTipoConferencia: '',
        hdnIdDocumento: '',
        hdnIdProcedimento: form.hdnIdProcedimento,
        hdnAnexos,
        hdnIdHipoteseLegalSugestao: '',
        hdnIdTipoProcedimento: form.hdnIdTipoProcedimento,
        hdnUnidadesReabertura: '',
        hdnSinBloqueado: form.hdnSinBloqueado,
        hdnContatoObject: '',
        hdnContatoIdentificador: '',
        hdnAssuntoIdentificador: ''
      }

      /* montar post body */
      let postData = ''
      for (const k in postFields) {
        if (postData !== '') postData = postData + '&'
        const valor = dropzone.utils.escapeComponent(postFields[k])
        postData = postData + k + '=' + valor
      }

      return {
        url: urlParaEnvio,
        data: postData
      }
    },

    /* como o ajax não deteca um redirect (302), temos que verificar se a página que retornou é a correta */
    paginaRetornouCorretamente: function (resposta) {
      const regex = /<div id="divArvoreHtml"><\/div>/gm
      const resultado = regex.exec(resposta)
      return !(resultado === null)
    },

    submeterFormulario: function (hdnAnexos, resposta) {
      const dados = this.passos['4'].obterDados.call(this, hdnAnexos, resposta)
      $.ajax({
        url: GetBaseUrl() + dados.url,
        method: 'POST',
        data: dados.data,
        success: function (data, textStatus, xhr) {
          if (this.passos['4'].paginaRetornouCorretamente.call(this, data)) {
            this.fnNovoStatus('completo', 1)
          } else {
            dropzone.log('Erro ao inserir documento externo: ocorreu um erro ao concluir a inserção do novo documento (redirecionou para a página errada).')
            this.fnNovoStatus('erro')
          }
        }.bind(this),
        error: function () {
          dropzone.log('Erro ao inserir documento externo: ocorreu um erro ao concluir a inserção do novo documento.')
          this.fnNovoStatus('erro')
        }.bind(this)
      })
    }

  }

}

dropzone.Http.prototype.inserirDocumentoExterno = function () {
  this.passos['1'].abrirPagina.call(this)
}

/*
  Dropzone.log
  Função para tossir o log padrão sei++ no console
*/
dropzone.log = function (mconsole, texto) {
  mconsole.log(texto)
}

/*
  Dropzone.iniciar
  Função invocada para iniciar a dropzone
*/
dropzone.iniciar = function (baseName) {
  dropzone.ui.adicionarDropzone()

  const mconsole = new __mconsole(baseName + '.Dropzone')
  dropzone.log = dropzone.log.bind(this, mconsole)
}
