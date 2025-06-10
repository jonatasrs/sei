function ListaPorEspecificacao (BaseName) {
  const processosVisualizados = document.querySelectorAll('.processoVisualizado')
  const processosNaoVisualizados = document.querySelectorAll('.processoNaoVisualizado')

  let i1 = 0 // variável para indexar qual classe de visualizados que o querySelectorAll deve pegar
  let i2 = 0 // variável para indexar qual classe de nãoVisualizados que o querySelectorAll deve pegar
  function visualizados (item1) {
    // pega informações do título do processo
    const info1 = item1.getAttribute('onmouseover')
    const titulo1 = info1.split("'")

    // pega o espaço onde está o número e substitui pelo título
    const processoVisualizado = document.querySelectorAll('.processoVisualizado')[i1]
    if (titulo1[1] !== '') {
      processoVisualizado.textContent = titulo1[1]
    } else (
      processoVisualizado.append(' (sem especificação)')
    )
    i1++
  }

  function naovisualizados (item2) {
    // pega informações do título do processo
    const info2 = item2.getAttribute('onmouseover')
    const titulo2 = info2.split("'")

    // pega o espaço onde está o número e substitui pelo título
    const processoNaoVisualizado = document.querySelectorAll('.processoNaoVisualizado')[i2]
    if (titulo2[1] !== '') {
      processoNaoVisualizado.textContent = titulo2[1]
    } else (
      processoNaoVisualizado.append(' (sem especificação)')
    )
    i2++
  }
  processosVisualizados.forEach(visualizados)
  processosNaoVisualizados.forEach(naovisualizados)
}
