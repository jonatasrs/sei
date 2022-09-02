/* global __mconsole */
function corrigirTabelas (BaseName) {
  /** inicialização do módulo */
  const mconsole = new __mconsole(BaseName + '.corrigirTabelas')

  $('#tblProcessosDetalhado, #tblProcessosGerados, #tblProcessosRecebidos').each(function (index, tabela) {
    $('<thead></thead>').insertAfter(tabela.querySelector('caption')).append(tabela.querySelector('tbody>tr:first-child'))
  })
  mconsole.log('concluído')
}
