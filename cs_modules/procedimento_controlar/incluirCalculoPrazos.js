/* global __mconsole, SavedOptions, RemoveAllOldEventListener */
// eslint-disable-next-line no-unused-vars
function incluirCalculoPrazos (BaseName, TipoDeCalculo) {
  /** inicialização do módulo */
  const mconsole = new __mconsole(BaseName + '.incluirCalculoPrazos')

  IncluirColunaTabela('#tblProcessosDetalhado', TipoDeCalculo)
  IncluirColunaTabela('#tblProcessosGerados', TipoDeCalculo)
  IncluirColunaTabela('#tblProcessosRecebidos', TipoDeCalculo)

  function IncluirColunaTabela (IdTabela, TipoDeCalculo) {
    const table = document.querySelector(IdTabela)

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
        setTimeout(() => {
          RemoveAllOldEventListener(row)
        }, 1000)
      })
    }
  }

  /** * Calcula o numero de dias com base no texto do marcador */
  function Calcular (item, TipoDeCalculo) {
    const msecPerDay = 1000 * 60 * 60 * 24
    const marcadores = item.querySelectorAll("td > a[href*='acao=andamento_marcador_gerenciar']")
    for (const marcador of marcadores) {
      let str = marcador.getAttribute('onmouseover')

      str = str.substring(str.indexOf("'") + 1, str.indexOf("'", str.indexOf("'") + 1))
      str = str.toLowerCase().replace('é', 'e')

      const hoje = new Date() // Pega a data atual
      const hojeMsec = hoje.getTime()

      if (TipoDeCalculo === 'prazo') {
        if (str.indexOf('ate ') === 0) {
          str = str.substr(4, 10)
        } else {
          continue
        }
      } else {
        str = str.substr(0, 10)
      }

      if (isValidDate(str)) {
        const arrDate = str.split('/')
        const datei = new Date(arrDate[2], arrDate[1] - 1, arrDate[0]) // yyyy,m,y (m-> 0-11)
        mconsole.log(`Data calculada: ${datei.toLocaleDateString()}`)
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

function isValidDate (dateString) {
  // Verifica o padrão dd/mm/yyyy
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/
  const match = dateString.match(regex)
  if (!match) return false

  const day = parseInt(match[1], 10)
  const month = parseInt(match[2], 10) - 1 // meses começam do zero
  const year = parseInt(match[3], 10)

  const date = new Date(year, month, day)

  // Verifica se a data criada corresponde aos valores originais
  return (
    date.getFullYear() === year &&
    date.getMonth() === month &&
    date.getDate() === day
  )
}
