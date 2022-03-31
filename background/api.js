import { fetchSei, getActionUrl } from './fetchSei.js'

async function fetchListaDetalhada (newUrl = null) {
  const url = newUrl || await getActionUrl('procedimento_controlar')

  const formData = new URLSearchParams()
  formData.append('hdnTipoVisualizacao', 'D')
  const options = {
    method: 'POST',
    body: formData
  }

  const html = await fetchSei(url, options)
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const form = doc.querySelector('#frmProcedimentoControlar')
  const tipoVisualizacao = form.querySelector('#hdnTipoVisualizacao').value
  if (tipoVisualizacao === 'D') {
    return doc
  } else if (tipoVisualizacao === 'R' && newUrl === null) {
    const storage = await browser.storage.local.get()

    const formUrl = storage.baseUrl + form.getAttribute('action')
    return fetchListaDetalhada(formUrl)
  } else {
    throw Error('Erro ao obter a lista detalhada')
  }
}

export async function listarProcessos () {
  const doc = await fetchListaDetalhada()
  const table = doc.querySelector('#tblProcessosDetalhado')

  if (!table) return []

  const rows = table.querySelectorAll('tbody > tr[id]')

  const json = [...rows].map(row => {
    // const linkAnotacao = row.querySelector('td:nth-child(2) > a[href*="acao=anotacao_registrar"]')
    // const anotacao = linkAnotacao ? linkAnotacao.attributes.onmouseover.value : '\'\',\'\''
    // const [dscAnotacao, usrAnotacao] = anotacao.replaceAll('\'', '')

    const result = {
      id: row.id,
      numProcesso: row.querySelector('td:nth-child(3) > a').innerText,
      processoVisualizado: row.querySelector('td:nth-child(3) > a').classList.contains('processoVisualizado'),
      processoVisitado: row.querySelector('td:nth-child(3) > a').classList.contains('processoVisitado'),
      atribuido: row.querySelector('td:nth-child(4) > a')?.innerText || '',
      tipoProcesso: row.querySelector('td:nth-child(5)').innerText,
      interessados: [...row.querySelectorAll('td:nth-child(6) .spanItemCelula')].map(e => e.innerText),
      anotacao: {
        descricao: '',
        usuario: ''
      },
      marcador: {
        titulo: '',
        descricao: ''
      },
      especificacao: ''
    }
    return result
  })
  return json
}
