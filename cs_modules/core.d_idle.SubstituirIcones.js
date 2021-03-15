function SubstituirIcones(BaseName) {
  /** inicialização do módulo */
  var mconsole = new __mconsole(BaseName + ".SubstituirIcones");
  var icones_substituir = ["Acompanhamento",
                           "Atualizar Andamento",
                           "Assinar",
                           "Atribui",
                           "Incluir em Bloco",
                           "Incluir em Bloco de Assinatura",
                           "Cancelar",
                           "Controle",
                           "Consultar/Alterar",
                           "Editar",
                           "Enviar Processo",
                           "Incluir Documento",
                           "Agendar Pub",
                           "Reabrir"];
  var novos_icones = ["acompanhamento.png",
                      "andamento.png",
                      "assinar.png",
                      "atribuir.png",
                      "bloco.png",
                      "blocoassinatura.png",
                      "cancelar.png",
                      "controle.png",
                      "detalhes.png",
                      "editar.png",
                      "enviar.png",
                      "incluir.gif",
                      "publicar.png",
                      "reabrir.png"];
  // O timeout é para "esperar" que o botão de Incluir documento seja adicionado, caso esta opção esteja selecionada pelo usuário
  setTimeout(function(){
    $.each(icones_substituir, function(index, value){
      if ($("#divInfraAreaTelaD [title^='" + value + "']").length > 0) {
        $("#divInfraAreaTelaD [title^='" + value + "']").attr('src', browser.extension.getURL('icons/' + novos_icones[index]));
        console.log("Substituindo " + value + "...");
      }
    });
  }, 200);
}