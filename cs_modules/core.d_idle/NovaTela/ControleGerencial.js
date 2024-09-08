function ControleGerencial () {
  console.log('ControleGerencial')
  const data = {
    MenuId: 'menu-gerencial',
    MenuTexto: 'Controle Gerencial',
    MenuAcao: null
  }

  data.MenuAcao = function (BaseName) {
    const ModName = BaseName + '.NovaTela'
    const mconsole = new __mconsole(ModName)
    const IdTabela = 'TabelaGR'
    let $tabela = null
    let $progressbar = null
    let Marcadores = []
    let GrupoAcompanhamentos = []
    // let LoginWs = {}
    let CgpAcoesPersonalizadas = []
    const graficos = {
      marcador: {
        config: {
          type: 'pie',
          data: {
            datasets: [{ data: [10] }], labels: ['_']
          },
          options: {
            responsive: true,
            legend: {
              display: true, position: 'top', labels: { boxWidth: 10 }
            },
            title: {
              display: true,
              text: 'Total de processos: ...'
            }
          }
        },
        chart: null
      },
      tipoProcesso: {
        config: {
          type: 'bar',
          data: {
            labels: ['Tipo ...', 'Tipo ...', 'Tipo ...', 'Tipo ...', 'Tipo ...'],
            datasets: [{ data: [1, 5, 10, 5, 10] }]
          },
          options: {
            scales: {
              yAxes: [{ ticks: { min: 0 } }],
              xAxes: [{ display: true, ticks: { display: false } }]
            },
            responsive: true,
            legend: { display: false },
            title: {
              display: true,
              text: 'Processos por tipo'
            }
          },
          plugins: [{
            afterDatasetsDraw: function (chart) {
              const ctx1 = chart.ctx
              chart.data.datasets.forEach(function (dataset, i) {
                const meta = chart.getDatasetMeta(i)
                if (!meta.hidden) {
                  meta.data.forEach(function (element, index) {
                    // Draw the text in black, with the specified font
                    ctx1.fillStyle = 'rgb(0, 0, 0, 0.6)'

                    const fontSize = 10
                    const fontStyle = 'normal'
                    const fontFamily = 'Helvetica Neue'
                    ctx1.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily)

                    // Just naively convert to string for now
                    const dataString = dataset.data[index].toString()

                    // Make sure alignment settings are correct
                    ctx1.textAlign = 'center'
                    ctx1.textBaseline = 'middle'

                    const padding = 1
                    const position = element.tooltipPosition()
                    ctx1.fillText(dataString, position.x, position.y - (fontSize / 2) - padding)
                  })
                }
              })
            }
          }]
        },
        chart: null
      }
    }

    /** Recuperar os dados dos processos pelo wssei */
    const dataprocessos = []
    let progressbar_val = 0

    mconsole.log('Criando nova tela de controle gerencial...')

    /** Verifica a versão mínima do navegador */
    if (!isChrome) {
      currentBrowser.storage.local.get('version').then(function (params) {
        const version = parseInt(params.version)
        if (version < 60) {
          $('#divInfraAreaDados').append('Firefox versão: ' + version + ' - é necessário a versão igual ou maior que 60 do navegador.').css({ backgroundColor: 'red' })
        }
      }, null)
    }

    /** Cria a tabela gerencial */
    TabelaCriar()

    Promise.all([
      /** Pega a lista de marcadores */
      ext_ws_get(seipp_api.marcador.listar).then(function (marc) {
        Marcadores = marc.filter(obj => obj.ativo)
        console.log('marcadores: ', Marcadores)
      }),
      /** Pega a lista de acompanhamento especial */
      null,
      /** Pega a lista de processos da unidade e os dados dos processos */
      ext_ws_get(seipp_api.listar.processos).then(listaProcessos => {
        console.log('Lista de processos:', listaProcessos)
        listaProcessos.sort(
          (a, b) => !a.status.visualizado && b.status.visualizado ? 1 : a.status.visualizado && !b.status.visualizado ? -1 : 0
        )
        if (listaProcessos.length == 0) {
          $progressbar.progressbar('value', 100)
        } else {
          progressbar_val = 100.0 / (listaProcessos.reduce((a, b) => b.status.visualizado ? a + 1 : a, 0) + 1)
          $progressbar.progressbar('value', progressbar_val)
        }
        listaProcessos.forEach(processo => {
          processo.$trrow = TabelaPreencherLista(processo)
        })
        return listaProcessos
      }),
      /** Carrega as ações personalizadas */
      currentBrowser.storage.local.get({ CgpAcoesPersonalizadas: [] }).then(stor => {
        CgpAcoesPersonalizadas = stor.CgpAcoesPersonalizadas
        console.log('CgpAcoesPersonalizadas', CgpAcoesPersonalizadas)
      })
    ]).then(dados => { /** Carrega os dados extra dos processos */
      /** Atualiza os graficos */
      AtualizarGraficos()
      $tabela.trigger('update')
      return dados[2].reduce(function (sequence, processo) {
        return sequence.then(function () {
          if (processo.status.visualizado) {
            return CarregarDadosProcesso(processo)
          } else {
            processo.$trrow.find('#tdprocesso > div:first > a').on('click', function () {
              $(this).off('click')
              $(this).removeClass('processoNaoVisualizado').addClass('processoVisualizado processoVisitado')
              CarregarDadosProcesso(processo).then(DadosExtras => {
                return TabelaPreencherDados(processo.$trrow, DadosExtras)
              }).then()
            })
            return Promise.resolve(null)
          }
        }).then(function (DadosExtras) {
          $progressbar.progressbar('value', $progressbar.progressbar('value') + progressbar_val)
          if (DadosExtras != null) {
            TabelaPreencherDados(processo.$trrow, DadosExtras)
          }
        })
      }, Promise.resolve())
    }).then(() => { /** Finaliza o carregamento e ativa o tablesorter */
      // console.log(dados[2]);
      /** Adicioan a tabela na tela do sei */
      console.log('************ DADOS FINALIZADOS ***************')
      $progressbar.hide()
      $('#cg_comandos > button').show()

      /** Atualiza a tabela */
      // https://mottie.github.io/tablesorter/docs/example-empty-table.html
      $tabela.find('thead > tr > th').removeClass('sorter-false')
      $tabela.trigger('update')
      $tabela.tablesorter().bind('updateComplete', function (e, table) {
        AtualizarGraficos()
      })
    }).catch(erro => {
      console.error(erro)
      $progressbar.progressbar('destroy')
      $('#progressbar div.progress-label').text('')
      if (erro.message.indexOf('Módulo inativo') != -1) {
        $('#divInfraAreaDados').append(erro.toString() + ' Esta funcionalidade necessita que o módulo WebService esteja ativo.')
      } else {
        $('#divInfraAreaDados').append(erro)
      }
    })

    function AtualizarGraficos () {
      const dt = { marcador: [], tipo: [] }

      $tabela.find('tbody > tr').each((i, row) => {
        const $marc = $(row).find('#tdmarcador > div.marcador:visible > #img > img')
        if ($marc.length > 0) {
          const cor = $marc.attr('src')
          const nome = $marc.parent().find('label').text()
          dt.marcador.push({ nome: nome, cor: cor })
        } else {
          dt.marcador.push({ nome: 'Sem marcador', cor: 'gray' })
        }

        dt.tipo.push($(row).find('#tdtipo > div').text())
      })

      /** Processa os dados de marcador */
      graficos.marcador.config.options.title.text = 'Total de processos: ' + dt.marcador.length
      dt.marcador = dt.marcador.reduce((acc, curr) => {
        const a = acc.find((e, i) => {
          const teste = e.nome == curr.nome
          if (teste) {
            e.qtd++
          }
          return teste
        })
        if (a == undefined) {
          acc.push({
            nome: curr.nome,
            cor: curr.cor,
            qtd: 1
          })
        }
        return acc
      }, [])
      if (dt.marcador.length > 0) {
        graficos.marcador.config.data.datasets = [{ data: [], backgroundColor: [] }]
        graficos.marcador.config.data.labels = []
        dt.marcador.forEach(e => {
          graficos.marcador.config.data.datasets[0].data.push(e.qtd)
          graficos.marcador.config.data.labels.push(e.nome)
          switch (e.cor) {
            case 'imagens/marcador_preto.png':
              graficos.marcador.config.data.datasets[0].backgroundColor.push('black')
              break
            case 'imagens/marcador_branco.png':
              graficos.marcador.config.data.datasets[0].backgroundColor.push('white')
              break
            case 'imagens/marcador_cinza.png':
              graficos.marcador.config.data.datasets[0].backgroundColor.push('lightgray')
              break
            case 'imagens/marcador_vermelho.png':
              graficos.marcador.config.data.datasets[0].backgroundColor.push('red')
              break
            case 'imagens/marcador_amarelo.png':
              graficos.marcador.config.data.datasets[0].backgroundColor.push('yellow')
              break
            case 'imagens/marcador_verde.png':
              graficos.marcador.config.data.datasets[0].backgroundColor.push('#66ff33')
              break
            case 'imagens/marcador_azul.png':
              graficos.marcador.config.data.datasets[0].backgroundColor.push('#3399ff')
              break
            case 'imagens/marcador_rosa.png':
              graficos.marcador.config.data.datasets[0].backgroundColor.push('Fuchsia')
              break
            case 'imagens/marcador_roxo.png':
              graficos.marcador.config.data.datasets[0].backgroundColor.push('purple')
              break
            case 'imagens/marcador_ciano.png':
              graficos.marcador.config.data.datasets[0].backgroundColor.push('cyan')
              break
            case 'gray':
              graficos.marcador.config.data.datasets[0].backgroundColor.push('gray')
              break
            default:
              alert('Erro ao atualizar o gráfico, cor não encontrada: ' + e.cor)
              break
          }
        })
      }
      graficos.marcador.config.options.legend.onClick = function (e, legendItem) {
        /* http://www.chartjs.org/docs/latest/configuration/legend.html#custom-on-click-actions */
        console.log(legendItem, this)

        const meta = this.chart.getDatasetMeta(0)

        meta.data[legendItem.index].hidden = !meta.data[legendItem.index].hidden
        this.chart.update()

        /** Filtra a tabela */
        const filters = $.tablesorter.getFilters($tabela)
        let param = ''
        let Filtrar = false
        meta.data.forEach(e => {
          if (!e.hidden) {
            param = param + (param == '' ? '' : '|') + e._view.label + '='
          } else {
            Filtrar = true
          }
        })

        filters[3] = param == '' ? 'null' : Filtrar ? param : ''
        if (filters.reduce((p, c) => !!(c == '' && p), true)) {
          $tabela.trigger('filterReset')
        } else {
          $.tablesorter.setFilters($tabela, filters)
        }
      }

      /** Processa os dados de tipo de processo */
      dt.tipo = dt.tipo.reduce((acc, curr) => {
        const a = acc.find((e, i) => {
          if (e.nome == curr) {
            e.qtd++
            return true
          } else {
            return false
          }
        })
        if (a == undefined) {
          acc.push({
            nome: curr,
            qtd: 1
          })
        }
        return acc
      }, [])
      if (dt.tipo.length > 0) {
        graficos.tipoProcesso.config.data.datasets = [{ data: [], backgroundColor: 'blue' }]
        graficos.tipoProcesso.config.data.labels = []
        dt.tipo.forEach(e => {
          graficos.tipoProcesso.config.data.datasets[0].data.push(e.qtd)
          graficos.tipoProcesso.config.data.labels.push(e.nome)
        })

        graficos.tipoProcesso.config.options.onClick = function (e) {
          const activePoints = this.getElementsAtEvent(e)
          if (activePoints.length > 0) {
            const selectedIndex = activePoints[0]._index
            const data = this.data.datasets[0]
            const Filtar = typeof data.backgroundColor === 'string' ? true : data.backgroundColor[selectedIndex] != 'blue'
            const filters = $.tablesorter.getFilters($tabela)

            if (Filtar) {
              data.backgroundColor = []
              data.backgroundColor[selectedIndex] = 'blue'

              /** Filtra a tabela */
              filters[1] = this.data.labels[selectedIndex]
            } else {
              data.backgroundColor = 'blue'
              /** remover filtro */
              filters[1] = ''
            }
            console.log(filters)
            if (filters.reduce((p, c) => !!(c == '' && p), true)) {
              $tabela.trigger('filterReset')
            } else {
              $.tablesorter.setFilters($tabela, filters)
            }
            this.update()
          }
        }
      }

      /** Atualiza os gráficos */
      graficos.marcador.chart.update()
      graficos.tipoProcesso.chart.update()
    }

    /**  */
    function TabelaCriar () {
      /** Título da nova tela */
      $('#divInfraBarraLocalizacao').text('Controle Gerencial de Processos')
      $('#divInfraAreaDados').removeAttr('style')
      const $comandos = $('<div id="cg_comandos"/>')

      $progressbar = $('<div id="progressbar"><div class="progress-label">0%</div></div>')
      $progressbar.progressbar({
        value: false,
        change: function () {
          $('#progressbar div.progress-label').text($progressbar.progressbar('value').toFixed(1) + '%')
        },
        complete: function () {
          $('#progressbar div.progress-label').text('')
        },
        create: function () {
          $('#progressbar div.progress-label').text('Aguarde...')
        }
      })

      /* Botão e tela de configuração */
      const $cfg_colunas = $('<fieldset/>').append(
        $('<legend/>').text('Editar colunas:'),
        $('<div id="columnSelector" class="columnSelector"/>')
      )

      const $cfg_ações = $('<fieldset/>')
        .append($('<legend/>').text('Editar ações Personalizadas:'))
        .append(
          $('<label for="name"/>').text('Nome'),
          $('<input id ="name" name="name" type="text" spellcheck="true"/>'),
          $('<label for="image"/>').text('Link da imagem do ícone'),
          $('<input id="image" name="image" type="text"/>'),
          $('<label for="cmd"/>').text('Comandos (json)'),
          $('<textarea id="cmd" name="cmd" spellcheck="false"/>')
        )

      const $dialog = $('<div/>')
        .appendTo('body')
        .attr('id', 'cg_configuracao')
        .attr('title', 'Configurações')
        .append($cfg_colunas, $cfg_ações)
        .dialog({
          autoOpen: false,
          modal: true,
          width: 570,
          buttons: {
            Salvar: function () {
              const acao = {}
              acao.nome = $('#cg_configuracao #name').val()
              acao.imagem = $('#cg_configuracao #image').val()
              acao.cmd_acoes = []
              try {
                acao.cmd_acoes = JSON.parse('[' + $('#cg_configuracao #cmd').val() + ']')
                if (acao.nome == '') {
                  CgpAcoesPersonalizadas = []
                } else {
                  CgpAcoesPersonalizadas[0] = acao
                }

                currentBrowser.storage.local.set({ CgpAcoesPersonalizadas }).then(() => {
                  console.log('Salvar > CgpAcoesPersonalizadas: ', CgpAcoesPersonalizadas)
                  /** Incluir/excluir/altear das linhas da tabela */
                  $tabela.find('tbody > tr').each(function (i, e) {
                    let visualizado = false
                    const $tdacoes = $(e).find('#tdacoes')

                    visualizado = $(e).find("#tdprocesso > div[id^='proc'] > a").hasClass('processoVisualizado')
                    if (visualizado) {
                      AtualizarAcaoPersonalizada($tdacoes)
                    }
                  })
                  $dialog.dialog('close')
                })
              } catch (error) {
                alert(error)
              }
            },
            Fechar: function () { $dialog.dialog('close') }
          },
          open: function () {
            let acao = {}
            if (CgpAcoesPersonalizadas[0] != undefined) {
              acao = CgpAcoesPersonalizadas[0]
              $('#cg_configuracao #name').val(acao.nome)
              $('#cg_configuracao #image').val(acao.imagem)
              try {
                $('#cg_configuracao #cmd').val(JSON.stringify(acao.cmd_acoes).replace('}},', '}},\n').replace(/\[|\]/g, ''))
              } catch (error) {
                alert('Erro ao carregar os comandos...')
              }
            }
          },
          close: function () {
            $('#cg_configuracao #name').val('')
            $('#cg_configuracao #image').val('')
            $('#cg_configuracao #cmd').val('')
          }
        })

      const $bt_configuracao = $('<button>').hide().button({
        icon: 'ui-icon-gear'
      }).on('click', () => $dialog.dialog('open'))
      $comandos.append($bt_configuracao, $progressbar)

      /** Criar o html da tabela de processos */
      $tabela = $('<table/>').attr('id', IdTabela).addClass('tablesorter').append('<thead/>').append('<tbody/>')
      const $thead = $('thead', $tabela)
      /** Cabeçalho da tabela */
      const $throw = $('<tr/>')
      $throw.append($('<th/>').text('Processo').attr('data-priority', 'critical').addClass('sorter-false'))
      $throw.append($('<th/>').text('Tipo').attr('data-priority', '1').addClass('sorter-false columnSelector-false'))
      $throw.append($('<th/>').text('Anotação').attr('data-priority', '2').addClass('sorter-false'))
      $throw.append($('<th/>').text('Marcador').attr('data-priority', '3').addClass('sorter-false'))
      $throw.append($('<th/>').text('Acompanhamento').attr('data-priority', '4').addClass('sorter-false columnSelector-false'))
      $throw.append($('<th/>').text('Ações').attr('data-priority', '5').addClass('columnNowrap'))
      $thead.append($throw)

      /** Cria a area de graficos */
      const $graficos = $('<div id="divGraficos"><div class="divGrafBox"><canvas id="chartMarcador"></canvas></div><div class="divGrafBox"><canvas id="chartTipoProcesso"></canvas></div><div class="divGrafBox"><div class="toolbar"><button>Blocos de Assinaturas disponíveis</button><button>Blocos de reuniões disponíveis</button><button>Blocos internos disponíveis</button><button>Relatório de retorno programado</button></div></div></div>"')

      /** Aplica o tablesorter */
      $('#divInfraAreaDados').append($comandos, $graficos, $tabela)
      $tabela.tablesorter({
        theme: 'blue',
        headers: {
          5: { sorter: false, filter: false }
        },
        widgets: ['zebra', 'columnSelector', 'stickyHeaders', 'filter'],
        widgetOptions: {
          // target the column selector markup
          columnSelector_container: $('#columnSelector'),
          columnSelector_name: 'data-selector-name',
          columnSelector_mediaquery: false
        },
        textExtraction: {
          0: function (node, table, cellIndex) {
            if ($(node).find("div[id^='proc'] > a").hasClass('processoVisualizado')) {
              return 1
            } else {
              return 0
            }
          },
          2: function (node, table, cellIndex) {
            let texto = $(node).find("div[class='anotacao']").text()
            texto = texto == '' ? -99999 : texto
            return texto
          },
          3: function (node, table, cellIndex) {
            let texto = $(node).find('#img > label').text()
            texto = texto == '' ? 'Sem marcador' : texto
            return texto
          }
        }
      })

      /** Ativa os graficos */
      graficos.marcador.chart = new Chart(document.getElementById('chartMarcador').getContext('2d'), graficos.marcador.config)
      graficos.tipoProcesso.chart = new Chart(document.getElementById('chartTipoProcesso').getContext('2d'), graficos.tipoProcesso.config)

      $('#divGraficos div.toolbar > button').button({ disabled: true })
    }

    function TabelaPreencherLista (processo) {
      const $tbody = $('tbody', $tabela)
      /** Cria uma nova linha na tabela */
      const $trrow = $('<tr/>')

      /** Processo / Observação da unidade */
      $processo_obs_unidade = $('<div/>')
      const $processo = $('<td/>')
        .attr('id', 'tdprocesso')
        .append($('<div/>')
          .attr('id', 'proc' + processo.id)
          .attr('title', processo.tipo)
          .append($('<a/>')
            .attr('href', 'controlador.php?acao=procedimento_trabalhar&id_procedimento=' + processo.id)
            .attr('target', '_blank')
            .text(processo.numDoc))
          .append($('<img id="aguarde" src="/infra_css/imagens/aguarde_pequeno.gif" />').hide()))
        .append($processo_obs_unidade)
      $trrow.append($processo)
      if (processo.status.visualizado) {
        $processo.find("div[id^='proc'] > a").addClass('processoVisualizado')
      } else {
        $processo.find("div[id^='proc'] > a").addClass('processoNaoVisualizado')
      }
      if (processo.status.visitado) {
        $processo.find("div[id^='proc'] > a").addClass('processoVisitado')
      }

      /** (HIDE) Tipo de processo */
      $trrow.append($('<td/>').attr('id', 'tdtipo').append($('<div/>').text(processo.tipo)))

      /** Anotação */
      const $anotacao = $('<div/>').addClass('anotacao').attr('idproc', processo.id)
      const $nova_anotacao = $('<div/>').addClass('centralizado').append('<button/>')
      const $tdanotacao = $('<td/>').attr('id', 'tdanotacao').append($anotacao, $nova_anotacao)
      $nova_anotacao.find('button').attr('title', 'Adicionar anotação')

      if (processo.anotacao != null) {
        $anotacao.text(processo.anotacao.descricao)
          .attr('prioridade', !!processo.anotacao.prioridade)
      } else {
        $anotacao.hide()
      }
      $nova_anotacao.hide()

      $('button', $nova_anotacao).button({ icon: 'ui-icon-plus' }).on('click', () => $anotacao.trigger('dblclick'))
      $trrow.append($tdanotacao)

      /** (Marcador) Despacho da autoridade */
      const $marcador = $('<div/>').addClass('marcador').attr('idproc', processo.id)
      const $novo_marcador = $('<div/>').addClass('centralizado').append('<button/>')
      const $tdmarcador = $('<td/>').attr('id', 'tdmarcador').append($marcador, $novo_marcador)
      $novo_marcador.find('button').attr('title', 'Adicionar marcador')

      $marcador.append($('<div/>').attr('id', 'img')
        .append($('<img/>'))
        .append($('<label/>'))
      )
      $marcador.append($('<div/>').attr('id', 'text'))
      if (processo.marcador != null) {
        $marcador.find('#img > img')
          .attr('src', 'imagens/marcador_' + processo.marcador.cor + '.png')
          .attr('title', processo.marcador.nome)
        $marcador.find('#img > label')
          .text(processo.marcador.nome)
        $marcador.find('#text').text(processo.marcador.descricao)
      } else {
        $marcador.find('#img').hide()
        $marcador.hide()
      }
      $novo_marcador.hide()
      $('button', $novo_marcador).button({ icon: 'ui-icon-plus' }).on('click', () => {
        if (Marcadores.length > 0) {
          $marcador.trigger('dblclick')
        } else {
          alert('Não existem marcadores para adicionar!')
        }
      })

      $trrow.append($tdmarcador)

      /** Acompanhamento Especial */
      const $acompanhamento = $('<div/>').addClass('acompanhamento').attr('idproc', processo.id).attr('idacomp', '-1').hide()
      const $novo_acompanhamento = $('<div/>').addClass('centralizado').append('<button/>').hide()
      const $tdacompanhamento = $('<td/>').attr('id', 'tdacompanhamento').append($acompanhamento, $novo_acompanhamento)
      $novo_acompanhamento.find('button').attr('title', 'Adicionar em Acompanhamento especial')

      $acompanhamento.append($('<div/>').attr('id', 'img')
        .append($('<img/>'))
        .append($('<label/>'))
      )
      $acompanhamento.append($('<div/>').attr('id', 'text'))

      $('button', $novo_acompanhamento).button({ icon: 'ui-icon-plus' }).on('click', () => {
        $acompanhamento.trigger('dblclick')
      })

      $acompanhamento.on('dblclick', dblclick_acompanhamento)
      $trrow.append($tdacompanhamento)

      /** Açoes */
      const $acoes = $('<td/>').attr('id', 'tdacoes')
      $trrow.append($acoes)

      /** FIM */
      $tbody.append($trrow)
      return $trrow
    }
    function AtualizarAcaoPersonalizada ($tdacoes) {
      $tdacoes.find("div[tipo='personalizada']").remove()
      CgpAcoesPersonalizadas.forEach(acao => {
        const $acao_personalizada = $('<div/>').attr('tipo', 'personalizada')
        $acao_personalizada.append($('<img/>').attr('src', acao.imagem == '' ? currentBrowser.runtime.getURL('icons/check.png') : acao.imagem))
          .attr('title', acao.nome)
          .on('click', function () {
            ExecutarAcoes(acao.cmd_acoes, $tdacoes.parent()).then(r => {
              console.log('Acao personalizada executada.')
            }).catch(console.error)
          })
        $tdacoes.append($acao_personalizada)
      })
    }
    /**
     *
     * @param {ws_ProcessoListar} processo
     * @param {*} DadosExtras
     */
    function TabelaPreencherDados ($trrow, DadosExtras) {
      /** Processo / Observação da unidade */
      const $processo_obs_unidade = $trrow.find('td:first > div:nth-child(2)')
      if (DadosExtras.dados.ObservacaoOutrasUnidades.length) {
        const obs_unidade = DadosExtras.dados.ObservacaoOutrasUnidades[DadosExtras.dados.ObservacaoOutrasUnidades.length - 1]
        $processo_obs_unidade.text(obs_unidade.observacao).attr('title', 'Observação da unidade: ' + obs_unidade.unidade)
      } else if (DadosExtras.dados.Observacao != '') {
        $processo_obs_unidade.text(DadosExtras.dados.Observacao).attr('title', 'Observação da unidade atual.')
      }
      /* Preenche as flags do processo */
      if (DadosExtras.processo.Flags.Restrito != null) {
        $("div[id^='proc']", $trrow).append($('<img/>')
          .attr('src', 'imagens/sei_chave_restrito.gif')
          .attr('title', DadosExtras.processo.Flags.Restrito)
        )
      }
      if (DadosExtras.processo.Flags.PontoControle != null) {
        $("div[id^='proc']", $trrow).append($('<img/>')
          .attr('src', 'imagens/sei_situacao_pequeno.png')
          .attr('title', DadosExtras.processo.Flags.PontoControle)
        )
      }
      if (DadosExtras.processo.Flags.Marcador.Nome != null) {
        $("div[id^='proc']", $trrow).append($('<img/>')
          .attr('src', 'imagens/marcador_' + DadosExtras.processo.Flags.Marcador.Cor + '.png')
          .attr('title', DadosExtras.processo.Flags.Marcador.Nome)
        )
      }
      if (DadosExtras.acompanhamento.id != -1) {
        $("div[id^='proc']", $trrow).append($('<img/>')
          .attr('src', 'imagens/sei_acompanhamento_especial_pequeno.png')
          .attr('title', 'Acompanhamento Especial')
        )
      }
      if (DadosExtras.ciencias && DadosExtras.ciencias.length > 0) { /** Ciência */
        let list_ciencia = ''
        const $ciencia = $('<img/>').attr('src', 'imagens/sei_ciencia_pequeno.gif')

        DadosExtras.ciencias.forEach(function (ciencia) {
          list_ciencia = list_ciencia.concat(ciencia.nome, ' - ', ciencia.data, '\n')
        })
        $ciencia.attr('title', list_ciencia)
        $("div[id^='proc']", $trrow).append($ciencia)
      }

      /* Anotação já retornado pela lista de processos */
      const $anotacao = $trrow.find('#tdanotacao > div.anotacao')
      const $nova_anotacao = $trrow.find('#tdanotacao > div.centralizado')
      $anotacao.on('dblclick', dblclick_anotacao)
      if (!$anotacao.is(':visible')) { $nova_anotacao.show() }

      /* Marcador já retornado pela lista de processos */
      const $marcador = $trrow.find('#tdmarcador > div.marcador')
      const $novo_marcador = $trrow.find('#tdmarcador > div.centralizado')
      $marcador.on('dblclick', dblclick_marcador)
      if (!$marcador.is(':visible')) { $novo_marcador.show() }

      /** Acompanhamento Especial */
      const $acompanhamento = $trrow.find('#tdacompanhamento div.acompanhamento')
      const $novo_acompanhamento = $trrow.find('#tdacompanhamento div.centralizado')

      if (DadosExtras.acompanhamento.id != -1) {
        $novo_acompanhamento.hide()
        $acompanhamento.attr('idacomp', DadosExtras.acompanhamento.id)
        $acompanhamento.find('#img > img')
          .attr('src', 'imagens/sei_acompanhamento_especial_pequeno.png')
          .attr('title', 'Acompanhamento Especial')
        if (DadosExtras.acompanhamento.grupo != null) {
          $acompanhamento.find('#img > label')
            .text(DadosExtras.acompanhamento.grupo.nome)
        }
        $acompanhamento.find('#text').text(DadosExtras.acompanhamento.observacao)
        $acompanhamento.show()
      } else {
        $acompanhamento.find('#img').hide()
        $acompanhamento.hide()
        $novo_acompanhamento.show()
      }

      /** Açoes */
      const $acoes = $trrow.find('#tdacoes')
      const $acao_acompanhamento = $('<div/>')
      const $acao_concluir = $('<div/>')

      $acao_acompanhamento.append($('<img/>').attr('src', 'imagens/sei_acompanhamento_especial_pequeno.png'))
        .attr('idproc', DadosExtras.processo.id)
        .attr('title', 'Adicionar ou alterar Acompanhamento especial')
        .on('click', click_acao_acompanhamento)

      $acao_concluir.append($('<img/>').attr('src', 'imagens/sei_concluir_processo.gif'))
        .attr('idproc', DadosExtras.processo.Numero)
        .attr('title', 'Concluir processo nesta unidade')
        .on('click', click_acao_concluir)

      $acoes.append($acao_acompanhamento, $acao_concluir)

      /** Ações personalizadas */
      AtualizarAcaoPersonalizada($acoes)

      /* Atualiza a tabela */
      $trrow.find('#tdprocesso #aguarde').hide()
    }
    /**
     *
     * @param {*} processo
     */
    function CarregarDadosProcesso (processo) {
      const linkHashProcesso = processo.linkHash
      /** Pega informações extras */
      processo.$trrow.find('#tdprocesso #aguarde').show()
      processo.$trrow.find("#tdprocesso > div[id^='proc'] > a").addClass('processoVisitado')
      return ext_ws_get(seipp_api.processo.consultar, linkHashProcesso).then(function (proc) {
        console.log(proc)
        return Promise.all([
          ext_ws_get(seipp_api.processo.consultar_dados, proc),
          ext_ws_get(seipp_api.processo.marcador, proc),
          ext_ws_get(seipp_api.processo.acompanhamento, proc),
          // ws_get(wsapi.processo.listar_ciencia, null, proc.id)
          null
        ]).then(dados => {
          return Promise.resolve({ processo: proc, dados: dados[0], marcador: dados[1], acompanhamento: dados[2], ciencias: dados[3] })
        })
      })
    }

    function dblclick_anotacao () {
      let $dialog = $('<div/>')
        .attr('id', 'dblclick_anotacao')
        .attr('title', 'Editar anotação')
        .append($('<textarea/>').text($(this).text()).css({ width: '250px', height: '150px', resize: 'none' }))
        .append($('<input/>').attr('type', 'checkbox'))
        .append($('<label/>').text('Prioridade'))
      const $anotacao = $(this)
      if ($anotacao.attr('prioridade') == 'true') $dialog.find('input').attr('checked', 'checked')
      $('body').append($dialog)
      $dialog = $dialog.dialog({
        autoOpen: false,
        height: 270,
        width: 275,
        modal: true,
        resizable: false,
        buttons: {
          Salvar: Salvar,
          Cancelar: function () {
            $dialog.dialog('close')
          }
        },
        close: function () {
          $dialog.dialog('destroy')
          $('#dblclick_anotacao').remove()
        }
      })
      $dialog.dialog('open')

      function Salvar () {
        const descricao = $dialog.find('textarea').val().replace(/\s+$/g, '')
        ws_token().then(Login => {
          const data = {
            descricao: descricao,
            protocolo: $anotacao.attr('idproc'),
            unidade: Login.loginData.IdUnidadeAtual,
            usuario: Login.loginData.IdUsuario,
            prioridade: $dialog.find('input').prop('checked') ? 'S' : 'N'
          }
          console.log($dialog.find('input[checked]'))
          return ws_post(wsapi.anotacao, data)
        }).then(function (params) {
          $anotacao.text(descricao)
          if ($dialog.find('input').prop('checked')) {
            $anotacao.attr('prioridade', true)
          } else {
            $anotacao.attr('prioridade', false)
          }
          if ($anotacao.text() == '') {
            $anotacao.removeAttr('prioridade')
            $anotacao.hide()
            $('div.centralizado', $anotacao.parent()).show()
          } else {
            $anotacao.show()
            $('div.centralizado', $anotacao.parent()).hide()
          }
          $tabela.trigger('update')
          $dialog.dialog('close')
        }).catch(function (err) {
          alert(err)
        })
      }
    }

    function dblclick_marcador () {
      const $select = $('<select/>')
      const $textarea = $('<textarea/>').attr('maxlength', 250).css({ width: '250px', height: '150px', resize: 'none' })
      let $dialog = $('<div/>')
        .attr('id', 'dblclick_marcador')
        .attr('title', 'Editar Marcador')
        .append($('<label/>').text('Marcador:'))
        .append($select)
        .append($textarea)
      const $marcador = $(this)
      $select.append($('<option/>').text('').val(null))
      Marcadores.forEach(function (Marcador) {
        $select.append($('<option/>').text(Marcador.nome).val(Marcador.id)
          .attr('data-url', 'imagens/marcador_' + Marcador.cor + '.png'))
      })
      $select.find('option').each(function () {
        if ($marcador.find('#img > label').text() == $(this).text()) {
          $(this).attr('selected', 'selected')
        }
      })
      $textarea.text($marcador.find('#text').text())
      $('body').append($dialog)
      $dialog = $dialog.dialog({
        autoOpen: false,
        height: 270,
        width: 275,
        modal: true,
        resizable: false,
        buttons: {
          Salvar: Salvar,
          Cancelar: function () {
            $dialog.dialog('close')
          }
        },
        close: function () {
          $dialog.dialog('destroy')
          $('#dblclick_marcador').remove()
        },
        open: function (event, ui) {
          $(this).find('select').iconselectmenu()
            .addClass('ui-menu-icons')
        }
      })
      $dialog.dialog('open')

      function Salvar () {
        const Marcador = {
          id: $select.val(),
          texto: $textarea.val()
        }
        ext_ws_get(seipp_api.processo.consultar, null, $marcador.attr('idproc')).then(
          proc => ext_ws_post(seipp_api.processo.marcador, Marcador, proc)
        ).then(ret => {
          $throw = $marcador.parent().parent()
          if (Marcador.id == '') { /** Remover o marcador */
            $marcador.find('#img').hide()
            $marcador.find('#text').text('')

            /** Remove o flag */
            $throw.find("td:first > div[id^='proc'] > img[src*='imagens/marcador_']").remove()

            $marcador.hide()
            $('div.centralizado', $marcador.parent()).show()
          } else { /** Adicionar/Alterar o marcador */
            const m = Marcadores.find(m => m.id == Marcador.id)
            $marcador.find('#img > img')
              .attr('src', 'imagens/marcador_' + m.cor + '.png')
              .attr('title', m.nome)
            $marcador.find('#img > label')
              .text(m.nome)
            $marcador.find('#img').show()
            $marcador.find('#text').text(Marcador.texto)

            /** Atualiza a flag no processo */
            const $flag_marcador = $throw.find("td:first > div[id^='proc'] > img[src*='imagens/marcador_']")
            if ($flag_marcador.length == 0) {
              $throw.find("td:first > div[id^='proc']").append($('<img/>')
                .attr('src', 'imagens/marcador_' + m.cor + '.png')
                .attr('title', m.nome))
            } else {
              $flag_marcador.attr('src', 'imagens/marcador_' + m.cor + '.png')
                .attr('title', m.nome)
            }

            $marcador.show()
            $('div.centralizado', $marcador.parent()).hide()
          }
          $tabela.trigger('update')
          $dialog.dialog('close')
        }).catch(function (err) {
          console.log(err)
          alert(err)
        })
      }
    }

    function dblclick_acompanhamento () {
      const $select = $('<select/>')
      const $textarea = $('<textarea/>').attr('maxlength', 250).css({ width: '250px', height: '150px', resize: 'none' })
      let $dialog = $('<div/>')
        .attr('id', 'dblclick_acompanhamento')
        .attr('title', 'Editar Acompanhamento Especial')
        .append($('<label/>').text('Grupo:'))
        .append($select)
        .append($textarea)
      const $acompanhamento = $(this)
      const id = $acompanhamento.attr('idacomp')
      $select.append($('<option/>').text('').val(null))
      GrupoAcompanhamentos.forEach(function (Grupo) {
        $select.append($('<option/>').text(Grupo.nome).val(Grupo.id))
      })
      $select.find('option').each(function () {
        if ($acompanhamento.find('#img > label').text() == $(this).text()) {
          $(this).attr('selected', 'selected')
        }
      })
      $textarea.text($acompanhamento.find('#text').text())
      $('body').append($dialog)
      const dialog_buttons = {}
      if (id != -1) { dialog_buttons.Excluir = Excluir }
      dialog_buttons.Salvar = Salvar
      dialog_buttons.Cancelar = () => $dialog.dialog('close')

      $dialog = $dialog.dialog({
        autoOpen: false,
        height: 270,
        width: 275,
        modal: true,
        resizable: false,
        buttons: dialog_buttons,
        close: function () {
          $dialog.dialog('destroy')
          $('#dblclick_acompanhamento').remove()
        }
      })
      $dialog.dialog('open')

      function Salvar () {
        const Acompanhamento = {
          grupo: $select.val(),
          protocolo: $acompanhamento.attr('idproc'),
          observacao: $textarea.val()
        }
        let ws
        if (id == -1) { /** Novo acompanhamento */
          ws = ws_post(wsapi.processo.acompanhar, Acompanhamento)
        } else { /** Alterar acompanhamento */
          const acomp = {
            id: id,
            grupo: Acompanhamento.grupo,
            observacao: Acompanhamento.observacao
          }
          ws = ext_ws_get(seipp_api.processo.consultar, null, Acompanhamento.protocolo).then(
            proc => ext_ws_post(seipp_api.processo.acompanhamento, acomp, proc)
          )
          console.log('Alterar o acompanhamento')
        }
        ws.then(ret => {
          console.log(ret)
          if (Array.isArray(ret)) {
            return ext_ws_get(seipp_api.processo.consultar, null, $acompanhamento.attr('idproc')).then(
              ret => ext_ws_get(seipp_api.processo.acompanhamento, ret)
            )
          } else {
            return ret
          }
        }).then(ret => {
          const $throw = $acompanhamento.parent().parent()
          const m = GrupoAcompanhamentos.find(m => m.id == Acompanhamento.grupo)
          $acompanhamento.find('#img > img')
            .attr('src', 'imagens/sei_acompanhamento_especial_pequeno.png')
            .attr('title', 'Acompanhamento Especial')

          $acompanhamento.find('#img > label').text(m == undefined ? '' : m.nome)
          $acompanhamento.find('#img').show()
          $acompanhamento.find('#text').text(Acompanhamento.observacao)
          $acompanhamento.attr('idacomp', ret.id)

          /** Atualiza a flag no processo */
          const $flag_acompanhamento = $throw.find("td:first > div[id^='proc'] > img[src*='sei_acompanhamento_especial_pequeno']")
          if ($flag_acompanhamento.length == 0) {
            $throw.find("td:first > div[id^='proc']").append($('<img/>')
              .attr('src', 'imagens/sei_acompanhamento_especial_pequeno.png')
              .attr('title', 'Acompanhamento Especial'))

            $acompanhamento.show()
            $('div.centralizado', $acompanhamento.parent()).hide()
          }
          $tabela.trigger('update')
          $dialog.dialog('close')
        }).catch(function (err) {
          console.log(err)
          alert(err)
        })
      }

      function Excluir () {
        const Acomp = {
          idProcesso: $acompanhamento.attr('idproc'),
          excluir: true
        }
        ext_ws_get(seipp_api.processo.consultar, null, $acompanhamento.attr('idproc')).then(
          proc => ext_ws_post(seipp_api.processo.acompanhamento, Acomp, proc)
        ).then(ret => {
          $throw = $acompanhamento.parent().parent()

          $acompanhamento.attr('idacomp', '-1')
          $acompanhamento.find('#img label').text('')
          $acompanhamento.find('#text').text('')

          /** Remove o flag */
          $throw.find("td:first > div[id^='proc'] > img[src*='imagens/sei_acompanhamento_especial_pequeno']").remove()

          $acompanhamento.hide()
          $('div.centralizado', $acompanhamento.parent()).show()
          $tabela.trigger('update')
          $dialog.dialog('close')
        }).catch(function (err) {
          console.log(err)
          alert(err)
        })
      }
    }

    function click_acao_acompanhamento () {
      const $throw = $(this).parent().parent()
      const $acompanhamento = $throw.find('#tdacompanhamento .acompanhamento')
      $acompanhamento.trigger('dblclick')
    }
    function click_acao_concluir () {
      const $acao_concluir = $(this)
      const nprocesso = $acao_concluir.attr('idproc')
      if (confirm('Deseja concluir o processo ' + $acao_concluir.parent().parent().find('div > a').text() + '?')) {
        ws_post(wsapi.processo.concluir, { numeroProcesso: nprocesso }).then(resp => {
          /** Remove o processo da tabela */
          $acao_concluir.parent().parent().remove()
          $tabela.trigger('update')
          alert('Processo concluído')
        }).catch(err => {
          alert(err)
        })
      }
    }

    function ExecutarAcoes (cmd_acoes, $trrow) {
      const MemCache = {}
      const $dialog = $('<div/>').attr({ id: 'DialogExecutarAcoes', title: 'Executando ações...' }).appendTo('body')
      let fimLog = false
      let unidadeAtual = ''

      function IniciarAcoes ($trrow) {
        return new Promise((resolve, reject) => {
          const resp = {
            processo: {
              id: -1,
              numDoc: '',
              anotacao: null,
              marcador: null
            },
            login: null
          }
          resp.processo.id = parseInt($trrow.find("#tdprocesso > div[id^='proc']").attr('id').substr(4))
          resp.processo.numDoc = $trrow.find("#tdprocesso > div[id^='proc'] > a").text()

          const $anotacao = $trrow.find('#tdanotacao > div.anotacao:visible')
          if ($anotacao.length > 0) {
            resp.processo.anotacao = {}
            resp.processo.anotacao.texto = $anotacao.text()
            resp.processo.anotacao.prioridade = JSON.parse($anotacao.attr('prioridade'))
          }

          const $marcador = $trrow.find('#tdmarcador > div.marcador:visible')
          if ($marcador.length > 0) {
            resp.processo.marcador = {}
            resp.processo.marcador.nome = $marcador.find('#img > img').attr('title')
            resp.processo.marcador.cor = /\_(.*)\./.exec($marcador.find('img').attr('src'))[1]
            resp.processo.marcador.descricao = $marcador.find('#text').text()
          }

          resp.login = LoginWs

          $dialog.dialog('open')
          MessageLog('Processo: ' + resp.processo.numDoc + '\n')
          MessageLog('IniciarAcoes => ...OK\n')
          resolve(resp)
        })
      }
      function AnotacaoSalvar (resp, opt) {
        return new Promise((resolve, reject) => {
          MemCache.anotacao = resp.processo.anotacao
          MessageLog('SavarAnotacao => OK\n')
          resolve(resp)
        })
      }
      function ProcessoEnviar (resp, opt) {
        return new Promise((resolve, reject) => {
          const json_data = {
            numeroProcesso: '',
            unidadesDestino: '',
            sinManterAbertoUnidade: 'N',
            sinRemoverAnotacao: 'N',
            sinReabrir: 'S'
          }
          MessageLog('ProcessoEnviar => ...')
          json_data.numeroProcesso = resp.processo.numDoc
          if (opt.unidade == undefined) {
            reject('ERRO: unidade não informada.')
          } else {
            json_data.unidadesDestino = opt.unidade
            ws_post(wsapi.processo.enviar, json_data).then(r => {
              $trrow.remove()
              $tabela.trigger('update')
              MessageLog('OK\n')
              resolve(resp)
            })
          }
        })
      }
      function UnidadeAlterar (resp, opt) {
        return new Promise((resolve, reject) => {
          const json_data = {
            unidade: ''
          }
          MessageLog('UnidadeAlterar => ...')
          if (opt.unidade == undefined) {
            reject('ERRO: unidade não informada.')
          } else {
            json_data.unidade = opt.unidade
            ws_post(wsapi.usuario.alterar_unidade, json_data).then(login => {
              resp.login = login
              unidadeAtual = opt.unidade
              MessageLog('OK\n')
              resolve(resp)
            })
          }
        })
      }
      function AnotacaoCadastrar (resp, opt) {
        return new Promise((resolve, reject) => {
          const json_data = {
            descricao: '',
            protocolo: resp.processo.id,
            unidade: resp.login.loginData.IdUnidadeAtual,
            usuario: resp.login.loginData.IdUsuario,
            prioridade: 'N'
          }
          MessageLog('AnotacaoCadastrar => ...')
          opt.cache = isUndefined(opt.cache, false)
          if (opt.texto == undefined && !opt.cache) {
            reject('ERRO: texto não informado.')
          } else {
            if (opt.cache) {
              json_data.descricao = MemCache.anotacao.texto
              json_data.prioridade = MemCache.anotacao.prioridade ? 'S' : 'N'
            } else {
              json_data.descricao = opt.texto
              json_data.prioridade = isUndefined(opt.prioridade, false) ? 'S' : 'N'
            }
            ws_post(wsapi.anotacao, json_data).then(r => {
              MessageLog('OK\n')
              resolve(resp)
            })
          }
        })
      }

      function MessageLog (msg) {
        const $log = $dialog.find('#LogExecutarAcoes')
        $log.val($log.val() + msg)
        console.log(msg)
      }
      $dialog.append($('<form>')).append(
        $("<textarea id='LogExecutarAcoes'/>").attr({
          id: 'LogExecutarAcoes',
          rows: '20',
          cols: '50',
          readonly: true
        }).css({ backgroundColor: 'lightgray', fontSize: '12px', width: '100%', heigth: '100%', resize: 'none' })
      )
      $dialog.dialog({
        autoOpen: true,
        modal: true,
        width: 'auto',
        beforeClose: function () {
          return fimLog
        }
      })
      console.log($dialog.html())
      $('#DialogExecutarAcoes').parent().find('.ui-dialog-title').css({ fontSize: '12px', fontWeight: 'bold' })
      return cmd_acoes.reduce((seq, acao) => {
        let p = null
        switch (acao.cmd) {
          case 'AnotacaoSalvar':
            p = AnotacaoSalvar
            break
          case 'ProcessoEnviar':
            p = ProcessoEnviar
            break
          case 'UnidadeAlterar':
            p = UnidadeAlterar
            break
          case 'AnotacaoCadastrar':
            p = AnotacaoCadastrar
            break
          default:
            console.log(cmd_acoes)
            console.log(acao)
            return Promise.reject('ExecutarAcoes: Erro -> Comando não encontrado: ' + acao.cmd)
            break
        }
        console.log(p)
        return seq.then(resp => {
          console.log(acao)
          return p(resp, acao.opt)
        })
      }, IniciarAcoes($trrow)).then(r => {
        return Promise.resolve(r).then(resp => {
          if (unidadeAtual != '') {
            const unid = $('#selInfraUnidades > option[selected]').val()
            if (unidadeAtual != unid) {
              const opt = { unidade: unid }
              MessageLog('!!!Retornando à unidade atual...')
              return UnidadeAlterar(resp, opt)
            } else {
              return Promise.resolve(resp)
            }
          }
        }).then(r => {
          fimLog = true
          MessageLog('Concluido com sucesso.')
          $('#DialogExecutarAcoes').parent().find('.ui-dialog-titlebar').css({ backgroundColor: 'green' })
        })
      }).catch(err => {
        fimLog = true
        MessageLog(err.message)
        $('#DialogExecutarAcoes').parent().find('.ui-dialog-titlebar').css({ backgroundColor: 'red' })
        return Promise.reject(err)
      })
    }
  }

  return data
}
