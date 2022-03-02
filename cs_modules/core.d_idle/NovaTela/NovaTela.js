const ModNameGerencial = 'core.d_idle/NovaTela'

function NovaTela (BaseName) {
  const ModName = BaseName + '.NovaTela'
  const mconsole = new __mconsole(ModName)
  const Acoes = []

  function AdicionarNovaTela (func) {
    const Acao = func()
    Acoes.push(Acao)
    $('<li>').append($('<a/>').attr('id', Acao.MenuId).attr('href', '.#/gerencial').text(Acao.MenuTexto)).prependTo('#main-menu')
    $('#' + Acao.MenuId).on('click', function () { SalvarAcao(Acao.MenuId) })
  }

  function SalvarAcao (Acao) {
    browser.storage.local.set({ NovaTela: Acao }).then(function (params) {
      mconsole.log('AdicionarNovaTela > Ação acionada no menu: ' + params)
    }, function (err) {
      mconsole.log('AdicionarNovaTela > Ação acionada ERRO: ' + err)
    })
  }

  /** Se existir o menu executa */
  const $MenuProcControlar = $("#main-menu > li > a[href^='controlador.php?acao=procedimento_controlar'")
  if ($('#main-menu').length) {
    $MenuProcControlar.on('click', function () { SalvarAcao(null) })
    AdicionarNovaTela(ControleGerencial)
  }

  /** Processa a nova tela */
  if (window.location.href === GetBaseUrl().concat('#/gerencial')) {
    browser.storage.local.get({ NovaTela: null }).then(function (IdTela) {
      mconsole.log(IdTela.NovaTela)

      if (IdTela.NovaTela != null) {
        for (const Acao of Acoes) {
          mconsole.log('Acao > ' + Acao)
          if (Acao.MenuId === IdTela.NovaTela) { Acao.MenuAcao(ModName) }
        }
      } else {
        const href = $MenuProcControlar.attr('href')
        if (href !== '') { window.location.assign(href) }
      }
    })
  }
}

NovaTela(ModNameGerencial)
