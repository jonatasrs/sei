function ConsultarAtribuicao(BaseName) {
  /** inicialização do módulo ***************************************************/
  var mconsole = new __mconsole(BaseName + ".ConsultarAtribuicao");

  let unidadeAtual = obter_UnidadeAtual();
  if (!unidadeAtual) return;
  let dadosAtribuicao = obter_Atribuicao(unidadeAtual);
  if (!dadosAtribuicao) return;  
  ConsultarInteressado_Criar(unidadeAtual, dadosAtribuicao);
  
  function ConsultarInteressado_Criar(unidadeAtual, dadosAtribuicao) {
    let container = $("#container").length > 0 ? $("#container") : $("body");
    
    container.append(`
      <div class='seipp-separador'><span>Atribuído para</span></div>
      <div id='seipp_atribuicao'>
        <p class="seipp-atribuido-para" title=""></p>
      </div>
    `);  

    if (dadosAtribuicao.login) {
      $('#seipp_atribuicao > p.seipp-atribuido-para').text(dadosAtribuicao.login);
      $('#seipp_atribuicao > p.seipp-atribuido-para').attr('title', `Atribuído na unidade ${unidadeAtual} para ${dadosAtribuicao.nome} (${dadosAtribuicao.login}).`);
    } else {
      $('#seipp_atribuicao > p.seipp-atribuido-para').addClass('seipp-processo-sem-atribuicao');
      $('#seipp_atribuicao > p.seipp-atribuido-para').text('(processo sem atribuição)');
    }
  }

  function obter_UnidadeAtual() {
    let selInfraUnidades = $("select[name='selInfraUnidades']", window.parent.document);
    if (!selInfraUnidades.length) return null;
    let unidadeSelecionada = selInfraUnidades.find(":selected");
    if (!unidadeSelecionada.length) return null;
    return unidadeSelecionada.text();
  }

  function obter_Atribuicao(unidade) {
    const ultimaScriptTag = document.getElementsByTagName('script')[document.getElementsByTagName('script').length-1];
    let regex = new RegExp(String.raw`^Nos\[0\].html = 'Processo aberto.*<a alt=".*" title=".*" class="ancoraSigla">${unidade}<\/a>(.*?)[\.]?<br \/>`, 'm');
    let resultado = regex.exec(ultimaScriptTag.innerHTML);
    if (resultado === null || resultado.length !== 2) return null; /* processo não se encontra aberto */
    let atribuicaoStr = resultado[1];
    regex = /\(atribuído para <a alt=".*" title="(.*?)" class="ancoraSigla">(.*?)<\/a>\)/m;
    resultado = regex.exec(atribuicaoStr);
    if (resultado === null || resultado.length !== 3) return { nome: null, login: null }; /* processo aberto, mas sem atribuição */
    return { nome: resultado[1], login: resultado[2] };
  }
   
}
