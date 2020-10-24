function AjustarElementosNativos(BaseName) {

  /** inicialização do módulo ***************************************************/
  var mconsole = new __mconsole(BaseName + ".AjustarElementosNativos");


  let divRelacionados = $('#divRelacionados');

  if (divRelacionados.length === 1) {   

    /* 
      Fix: esconde a div de processos relacionados se este estiver em branco
      (previne o separador nativo do SEI de aparecer duplamente)
    */
    if (divRelacionados.text().trim().length === 0) {
      divRelacionados.hide();

    /*
      Ajusta o layout do título dos processos relacionados
      para manter coerência com o separador das demais funcionalidades
    */
    } else if (divRelacionados.contents().text().trim() === 'Processos Relacionados:') {
      divRelacionados.after("<div class='seipp-separador'><span>Processos relacionados</span></div>");
      divRelacionados.hide();
    }
  }

  /* Adiciona estilo ao botão Consultar Andamento */
  if ($("#divConsultarAndamento").length) {
    $("#divConsultarAndamento").addClass('seipp-consultar-andamento');
  }
}