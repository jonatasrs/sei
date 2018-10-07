var Dropzone = (function() {


	function formatNumber(number) {
    	return (number < 10 ? '0' : '') + number;
	}


	function hoje() {
		var dataHoje = new Date();
		return formatNumber(dataHoje.getDate()) + '/' + formatNumber((dataHoje.getMonth() + 1)) + '/' + dataHoje.getFullYear();
	}

	function obterURLNovoDoc() {
  		var ultimaScriptTag = document.getElementsByTagName('script')[document.getElementsByTagName('script').length-1];		
  		var regex = /(?<=^Nos\[0\].acoes = '<a href=").*?(?=" tabindex="451")/m;
		var resultado = regex.exec(ultimaScriptTag.innerHTML);
    	if (resultado === null) return null;
		return resultado[0];
	}

	function obterURLDocExterno(resposta) {
		var regex = /(?<=<a href=").*?(?=" tabindex="1003" class="ancoraOpcao"> Externo<\/a>)/m
		var resultado = regex.exec(resposta)
    	if (resultado === null) return null;
		return resultado[0];
	}

	function obterDadosDocExterno(arquivoParaUpload, resposta) {
		var $resposta = $(resposta);
		var urlParaEnvio = $resposta.find('form#frmDocumentoCadastro').attr('action');
		var form = {};
		form['hdnInfraTipoPagina'] = $resposta.find('#hdnInfraTipoPagina').attr('value');
		form['hdnInfraTipoPagina'] = $resposta.find('#hdnInfraTipoPagina').attr('value');
		form['selSerie'] = $resposta.find('#selSerie option').eq(1).attr('value');
		form['hdnStaDocumento'] = $resposta.find('#hdnStaDocumento').attr('value');
		form['hdnIdUnidadeGeradoraProtocolo'] = $resposta.find('#hdnIdUnidadeGeradoraProtocolo').attr('value');
		form['hdnIdProcedimento'] = $resposta.find('#hdnIdProcedimento').attr('value');
		form['hdnIdTipoProcedimento'] = $resposta.find('#hdnIdTipoProcedimento').attr('value');
		form['hdnSinBloqueado'] = $resposta.find('#hdnSinBloqueado').attr('value');

		var postData = {
			hdnInfraTipoPagina: form['hdnInfraTipoPagina'],
			selSerie: form['selSerie'],
			txtDataElaboracao: hoje(),
			txtProtocoloDocumentoTextoBase: '',
			rdoTextoInicial: 'N',
			hdnIdDocumentoTextoBase: '',
			txtNumero: arquivoParaUpload.name.slice(0,49),
			rdoFormato: 'N',
			selTipoConferencia: 'null',
			txtDescricao: '',
			txtRemetente: '',
			hdnIdRemetente: '',
			txtInteressado: '',
			hdnIdInteressado: '',
			txtDestinatario: '',
			hdnIdDestinatario: '',
			txtAssunto: '',
			hdnIdAssunto: '',
			txaObservacoes: '',
			selGrauSigilo: 'null',
			rdoNivelAcesso: '0',
			hdnFlagDocumentoCadastro: '2',
			hdnAssuntos: '',
			hdnInteressados: '',
			hdnDestinatarios: '',
			hdnIdSerie: form['selSerie'],
			hdnIdUnidadeGeradoraProtocolo: form['hdnIdUnidadeGeradoraProtocolo'],
			hdnStaDocumento: form['hdnStaDocumento'],
			hdnIdTipoConferencia: '',
			hdnIdDocumento: '',
			hdnIdProcedimento: form['hdnIdProcedimento'],
			hdnAnexos: '',
			hdnIdHipoteseLegalSugestao: '',
			hdnIdTipoProcedimento: form['hdnIdTipoProcedimento'],
			hdnUnidadesReabertura: '',
			hdnSinBloqueado: form['hdnSinBloqueado'],
			hdnContatoObject: '',
			hdnContatoIdentificador: '',
			hdnAssuntoIdentificador: '',
		}
		
		return {
			url: urlParaEnvio,
			data: postData,
		}

	}

	function passo1_abrirPaginaEscolherDoc(arquivoParaUpload) {
		var urlDocExterno = obterURLNovoDoc();
  	  	$.ajax({ 
  	  		url: urlDocExterno,
  	  		success: function(resposta) {
  	  			var urlNovoDocExterno = obterURLDocExterno(resposta);
  	  			passo2_abrirPaginaNovoDocExterno(arquivoParaUpload, urlNovoDocExterno);
  	  		},
  	  	});		
	}

	function passo2_abrirPaginaNovoDocExterno(arquivoParaUpload, urlNovoDocExterno) {
		$.ajax({
			url: urlNovoDocExterno,
			success: function(resposta) {
				var dadosDocExterno = obterDadosDocExterno(arquivoParaUpload, resposta);
				passo3_submeterNovoDoc(arquivoParaUpload, dadosDocExterno);
			}
		});
	}

	function passo3_submeterNovoDoc(arquivoParaUpload, opcoes) {
		$.ajax({
			url: opcoes.url,
			contentType: 'application/x-www-form-urlencoded; charset=iso-8859-1',
			method: 'POST',
			data: opcoes.data,
			success: function(resposta) {
				location.reload();
			}
		});
	}

	function novoDocumentoExterno(arquivoParaUpload) {
		passo1_abrirPaginaEscolherDoc(arquivoParaUpload);
	}


	function adicionarDropzone() {  
  		var dropzoneEl = $(" \
  			<div class='dropzone-wrapper'> \
  				<div class='dropzone-bg'></div> \
  				<div class='dropzone-ui'> \
    				<img class='dropzone-icon' src='" + browser.extension.getURL("icons/fileUpload.png") + "'> \
    				<p class='dropzone-label'>Arraste aqui...</p> \
  				</div> \
			</div> \
		");

		dropzoneEl.appendTo("body");

		window.addEventListener('drop', function(evt) {
			evt.preventDefault();
			dropzoneEl.hide();
			if (!evt.dataTransfer.files || evt.dataTransfer.files.length === 0) return;
    		for (var i = 0; i < evt.dataTransfer.files.length; i++) {
				novoDocumentoExterno(evt.dataTransfer.files[i]);
    		}

		});

		window.addEventListener('dragover', function(evt) {
			evt.preventDefault();
		});  

		window.addEventListener('dragenter', function(evt) {
			dropzoneEl.show();
		});

		window.addEventListener('dragleave', function(evt) {
			evt.preventDefault();
			if (evt.relatedTarget === null) {
				dropzoneEl.hide();
			}
		});		

	}

	function iniciar(BaseName) {
		var mconsole = new __mconsole(BaseName + ".AdicionarDropzone");
		
		adicionarDropzone();
	}


	return {
		iniciar: iniciar,
	}

})();

