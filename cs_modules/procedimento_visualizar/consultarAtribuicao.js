function ConsultarAtribuicao(BaseName) {
  /** inicialização do módulo ***************************************************/
  var mconsole = new __mconsole(BaseName + ".ConsultarAtribuicao");

  let unidadeAtual = obter_UnidadeAtual();
  if (!unidadeAtual) return;
  let dadosAtribuicao = obter_Atribuicao(unidadeAtual);
  if (!dadosAtribuicao) return;
  ConsultarInteressado_Criar(unidadeAtual, dadosAtribuicao);

  function ConsultarInteressado_Criar(unidadeAtual, dadosAtribuicao) {

    const container = $("#container").length > 0 ? $("#container") : $("body");

    container.append(`
      <div class='seipp-separador'><span>${dadosAtribuicao.sigiloso ? "Credencial para" : "Atribuído para"}</span></div>
      <div id='seipp_atribuicao'></div>
    `);

    if (dadosAtribuicao.usuarios.length === 0) {
      $('#seipp_atribuicao').append($('<p />', {
        class: 'seipp-atribuido-para seipp-processo-sem-atribuicao',
        text: '(processo sem atribuição)',
      }));
    } else {
      dadosAtribuicao.usuarios.forEach(function(usuario) {
        $('#seipp_atribuicao').append($('<p />', {
          class: 'seipp-atribuido-para',
          append: [
            $('<img />', {
              attr: {
                height: 10,
                width: 12,
              },
              src: browser.runtime.getURL('icons/interessado.png')
            }),
            $('<span />', { text: usuario.login }),
          ],
          title: dadosAtribuicao.sigiloso
            ? `Credencial para ${usuario.nome} (${usuario.login}) na unidade ${unidadeAtual}.`
            : `Atribuído na unidade ${unidadeAtual} para ${usuario.nome} (${usuario.login}).`
        }));
      });
      if (dadosAtribuicao.sigiloso && typeof dadosAtribuicao.mais !== 'undefined' && dadosAtribuicao.mais > 0) {
        $('#seipp_atribuicao').append($('<p />', {
          class: 'seipp-atribuido-para seipp-atribuido-para-mais',
          text: `+${dadosAtribuicao.mais}`,
          title: `Mais ${dadosAtribuicao.mais} usuário(s) de outra(s) área(s).`,
        }));
      }
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

    /* verificar se processo está aberto em alguma unidade */
    if (!/^Nos\[0\].html = 'Processo aberto/m.test(ultimaScriptTag.innerHTML)) return null;

    /* extrai o que foi atribuído para a variável Nos[0].html */
    const rUsuarios = /^Nos\[0\].html = '(.*)';/m.exec(ultimaScriptTag.innerHTML);
    if (!rUsuarios || rUsuarios.length !== 2) return null;
    const html = rUsuarios[1];

    /* caso de processos públicos ou restritos, busca por atribuição */
    if (/(Processo aberto nas unidades:|Processo aberto somente na unidade)/m.test(html)) {

      let regex = new RegExp(String.raw`(?<=<a alt=".*" title=".*" class="ancoraSigla">)${unidade}<\/a>(.*?)[\.]?<br \/>`, 'm');
      let resultado = regex.exec(html);
      if (resultado === null || resultado.length !== 2) return null; /* processo não está aberto na unidade do usuário */
      let atribuicaoStr = resultado[1];
      regex = /\(atribuído para <a alt=".*" title="(.*?)" class="ancoraSigla">(.*?)<\/a>\)/m;
      resultado = regex.exec(atribuicaoStr);
      if (resultado === null || resultado.length !== 3) return { sigiloso: false, usuarios: [] }; /* processo está aberto na unidade do usuário, mas sem atribuição */
      return { sigiloso: false, usuarios: [{ nome: resultado[1], login: resultado[2] }] };

      /* caso de processos sigilosos, busca pro credenciais */
    } else if (/(Processo aberto com os usuários:|Processo aberto somente com o usuário)/m.test(html)) {
      let regex = /(?<=<a alt=".*?" title="(.*?)" class="ancoraSigla">(.*?))(?=<\/a>&nbsp;\/&nbsp;<a alt=".*?" title=".*?" class="ancoraSigla">(.*?)<\/a>)/g;
      let m;
      let usuarios = [];
      let mais = 0;
      while ((m = regex.exec(html)) !== null) {
        if (m.index === regex.lastIndex) regex.lastIndex++;
        let [nome, login, unidade] = [m[1], m[2], m[3]];
        if (unidade === unidadeAtual) {
          usuarios.push({ nome: nome, login: login });
        } else {
          mais++;
        }
      }
      return { sigiloso: true, usuarios: usuarios, mais: mais };

    /* algum outro texto não identificado */
    } else {
      return null;
    }
  }

}
