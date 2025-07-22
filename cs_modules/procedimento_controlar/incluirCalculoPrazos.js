/* global __mconsole, SavedOptions, RemoveAllOldEventListener, isNumOnly, seiVersionCompare */
function incluirCalculoPrazos (BaseName, TipoDeCalculo) {
  /** inicialização do módulo */
  const mconsole = new __mconsole(BaseName + '.incluirCalculoPrazos')

  IncluirColunaTabela('#tblProcessosDetalhado', TipoDeCalculo)
  IncluirColunaTabela('#tblProcessosGerados', TipoDeCalculo)
  IncluirColunaTabela('#tblProcessosRecebidos', TipoDeCalculo)

  function IncluirColunaTabela (IdTabela, TipoDeCalculo) {
    const table = document.querySelector(IdTabela)

    /**
     * Na versão 4.0 o controle de prazo já é nativo, no entanto, ainda não
     * existe um controle de dias passados de uma determinada data.
     */
    if (TipoDeCalculo === 'prazo' && seiVersionCompare('>=', '4')) {
      /** Aplica a formatação de cores na tabela com base no valor nativo */
      const rows = document.querySelectorAll(`${IdTabela} > tbody > tr`)
      for (const row of rows) {
        const value = row.querySelector('td:nth-child(7)')?.innerText
        FormatarTabela(row, value, TipoDeCalculo)
      }
      return
    }

    mconsole.log(`IncluirColunaTabela: ${IdTabela} - ${TipoDeCalculo}`)
    if (table) {
      /* Inclui o cabeçalho na tabela */
      const theadRow = table.querySelector('thead > tr')
      if (theadRow) {
        const th = document.createElement('th')
        th.className = 'infraTh'
        th.textContent = (TipoDeCalculo === 'qtddias') ? 'Dias' : 'Prazo'
        theadRow.appendChild(th)
        mconsole.log(`Cabeçalho adicionado: ${th.textContent}`)
      }

      /* Inclui os itens na tabela */
      const rows = table.querySelectorAll('tbody > tr')
      rows.forEach(function (row) {
        const td = document.createElement('td')
        td.setAttribute('valign', 'top')
        td.setAttribute('align', 'center')
        td.textContent = Calcular(row, TipoDeCalculo)
        row.appendChild(td)
        FormatarTabela(row, td.textContent, TipoDeCalculo)
        RemoveAllOldEventListener(row)
      })
    }
  }

  /** * Calcula o numero de dias com base no texto do marcador */
  function Calcular (item, TipoDeCalculo) {
    const msecPerDay = 1000 * 60 * 60 * 24
    const cel = item.querySelector("td > a[href*='acao=andamento_marcador_gerenciar']")

    if (cel) {
      let str = cel.getAttribute('onmouseover')

      str = str.substring(str.indexOf("'") + 1, str.indexOf("'", str.indexOf("'") + 1))
      str = str.toLowerCase().replace('é', 'e')

      const hoje = new Date() // Pega a data atual
      const hojeMsec = hoje.getTime()

      if (TipoDeCalculo === 'prazo') {
        if (str.indexOf('ate ') === 0) {
          str = str.substr(4, 10)
        } else {
          return ''
        }
      } else {
        str = str.substr(0, 10)
      }

      if (str.length === 10 && isNumOnly(str.replace('/', ''), 10)) {
        const datei = new Date(str.substring(6, 10), str.substring(3, 5) - 1, str.substring(0, 2)) // yyyy,m,y (m-> 0-11)

        if (!isNaN(datei.getDate())) {
          let days
          if (TipoDeCalculo === 'qtddias') {
            const interval = hojeMsec - datei.getTime()
            days = Math.floor(interval / msecPerDay)
          } else if (TipoDeCalculo === 'prazo') {
            const interval = datei.getTime() - hojeMsec
            days = Math.floor(interval / msecPerDay) + 1
          }
          return days
        }
      }
    }
    return ''
  }

  /* Formata a tabela pelos valores */
  function FormatarTabela (Linha, Valor, TipoDeCalculo) {
    if (Valor === '') return
    if (TipoDeCalculo === 'qtddias') {
      if (Valor > SavedOptions.ConfDias.Alerta && Valor <= SavedOptions.ConfDias.Critico) {
        Linha.classList.add('infraTrseippalerta')
      } else if (Valor > SavedOptions.ConfDias.Critico) {
        Linha.classList.add('infraTrseippcritico')
      }
    } else if (TipoDeCalculo === 'prazo') {
      if (Valor >= SavedOptions.ConfPrazo.Critico && Valor < SavedOptions.ConfPrazo.Alerta) {
        Linha.classList.add('infraTrseippalerta')
      } else if (Valor < SavedOptions.ConfPrazo.Critico) {
        Linha.classList.add('infraTrseippcritico')
      }
    }
  }
}
