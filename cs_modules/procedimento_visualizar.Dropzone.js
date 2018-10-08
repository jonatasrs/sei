var Dropzone = {};

Dropzone.utils = {

	formatarNumero: function(number) {
    	return (number < 10 ? '0' : '') + number;
	},


	hoje: function() {
		var dataHoje = new Date();
		return Dropzone.utils.formatarNumero(dataHoje.getDate()) + 
			'/' + 
			Dropzone.utils.formatarNumero((dataHoje.getMonth() + 1)) + 
			'/' + 
			dataHoje.getFullYear();
	},

	/* extraído do sei: InfraUtil.js */
	infraFormatarTamanhoBytes: function(numBytes){
		var ret = null;
		if (numBytes > 1099511627776){
			ret = Math.round(numBytes/1099511627776 * 100) / 100 + ' Tb';
		} else if (numBytes > 1073741824) {
			ret = Math.round(numBytes/1073741824 * 100) / 100 + ' Gb';
		} else if (numBytes > 1048576) {
			ret = Math.round(numBytes/1048576 * 100) / 100 + ' Mb';
		} else /* if (numBytes > 1024) */ {
			ret = Math.round(numBytes/1024* 100) / 100 +' Kb';
		}
		return ret;
	}  
};


Dropzone.ui = {

	adicionarDropzone: function() {  

  		var dropzoneEl = $(`
  			<div class='dropzone-wrapper'>
  				<div class='dropzone-bg'></div>
  				<div class='dropzone-ui'>
    				<img class='dropzone-icon' src='${browser.extension.getURL("icons/fileUpload.png")}'>
    				<p class='dropzone-label'>Arraste aqui...</p>
  				</div>
			</div>
		`);

		dropzoneEl.appendTo("body");

		window.addEventListener('drop', function(evt) {
			evt.preventDefault();
			dropzoneEl.hide();
			if (!evt.dataTransfer.files || evt.dataTransfer.files.length === 0) return;
    		for (var i = 0; i < evt.dataTransfer.files.length; i++) {
    			var http = new Dropzone.http(evt.dataTransfer.files[i]);
				http.inserirDocumentoExterno();
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

	},

};


Dropzone.http = function(arquivoParaUpload) {
	this.arquivoParaUpload = arquivoParaUpload;
};

Dropzone.http.prototype.passos = {

	/* 
		1º passo:
			- ler a url que abre a página 'Incluir Documento'
			- abrir a página
	*/
	'1': {

		obterUrl: function() {
			var ultimaScriptTag = document.getElementsByTagName('script')[document.getElementsByTagName('script').length-1];		
			var regex = /(?<=^Nos\[0\].acoes = '<a href=").*?(?=" tabindex="451")/m;
			var resultado = regex.exec(ultimaScriptTag.innerHTML);
			if (resultado === null) return null;
			return resultado[0];
		},

		abrirPagina: function() {
			var urlDocExterno = this.passos['1'].obterUrl();
		  	$.ajax({ 
		  		url: urlDocExterno,
		  		success: function(resposta) {
		  			this.passos['2'].abrirPagina.call(this,resposta);
		  		}.bind(this),
		  	});		
		},

	},



	/* 
		2º passo:
			- ler a url que aponta para o tipo de documento 'Externo'
			- abrir a página
	*/
	'2': { 

		obterUrl: function(resposta) {
			var regex = /(?<=<a href=").*?(?=" tabindex="1003" class="ancoraOpcao"> Externo<\/a>)/m
			var resultado = regex.exec(resposta)
			if (resultado === null) return null;
			return resultado[0];
		},

		abrirPagina: function(resposta) {
			var urlNovoDocExterno = this.passos['2'].obterUrl(resposta);
			$.ajax({
				url: urlNovoDocExterno,
				success: function(resposta) {
					this.passos['3'].enviarArquivo.call(this, resposta);
				}.bind(this),
			});
		},

	},

	/*
		3º passo:
			- extrair a url para submeter o upload
			- faz o upload do arquivo
	*/
	'3': { 

		obterURLUpload: function(resposta) {
			var regex = /(?<=^\s*objUpload = new infraUpload\('frmAnexos',').+?(?='\);)/m;
			var resultado = regex.exec(resposta)
			if (resultado === null) return null;
			return resultado[0];			
		},

		obterUsuarioEUnidade: function(resposta) {
			var regex = /\s*objTabelaAnexos\.adicionar\(\[arr\['nome_upload'\],arr\['nome'\],arr\['data_hora'\],arr\['tamanho'],infraFormatarTamanhoBytes\(arr\['tamanho'\]\),'(.+?)' ,'(.+?)']\);/gm
			var resultado = regex.exec(resposta);
			if (resultado === null) return null;
			return {
				usuario: resultado[1],
				unidade: resultado[2],
			}

		},

		gerarHdnAnexos: function(usuarioEUnidade, uploadIdentificador) {
			var uploadIdentificadores = uploadIdentificador.split('#');
			var id = uploadIdentificadores[0];
			var nome = uploadIdentificadores[1];
			var dthora = uploadIdentificadores[4];
			var tamanho = uploadIdentificadores[3];
			var tamanho_formatado = Dropzone.utils.infraFormatarTamanhoBytes(Number.parseInt(tamanho));
			return `${id}±${nome}±${dthora}±${tamanho}±${tamanho_formatado}±${usuarioEUnidade.usuario}±${usuarioEUnidade.unidade}`
		},

		enviarArquivo: function(resposta) {
			var urlUpload = this.passos['3'].obterURLUpload(resposta);
			var data = new FormData();
			data.append('filArquivo', this.arquivoParaUpload, this.arquivoParaUpload.name);
			$.ajax({
				url: urlUpload,
				method: 'POST',
				contentType: false,
				processData: false,
				data: data,
				success: function(uploadIdentificador) {
					var usuarioEUnidade = this.passos['3'].obterUsuarioEUnidade(resposta);
					var hdnAnexos = this.passos['3'].gerarHdnAnexos(usuarioEUnidade, uploadIdentificador);
					this.passos['4'].submeterFormulario.call(this, hdnAnexos, resposta);
				}.bind(this),
			});			
		},

	},


	/* 
		4º passo:
			- setar os dados do formulário da página do novo documento externo
			- submeter o formulário
	*/
	'4': { 

		/* dá preferência por documento que seja denominado Anexo. Se não, escolhe o primeiro. */
		escolherTipoDocumentoExterno: function(select) {
			var options = select.find('option');
			var tipoDocumento = null;
			options.each(function() {
				if ($(this).text().trim() === 'Anexo') tipoDocumento = $(this).attr('value');
			});
			return !tipoDocumento ? options.eq(1).attr('value') : tipoDocumento;
		},


		obterDados: function(hdnAnexos, resposta) {
			var $resposta = $(resposta);
			var urlParaEnvio = $resposta.find('form#frmDocumentoCadastro').attr('action');
			var form = {};
			form['hdnInfraTipoPagina'] = $resposta.find('#hdnInfraTipoPagina').attr('value');
			form['hdnInfraTipoPagina'] = $resposta.find('#hdnInfraTipoPagina').attr('value');
			form['selSerie'] = this.passos['4'].escolherTipoDocumentoExterno($resposta.find('#selSerie')); 
			form['hdnStaDocumento'] = $resposta.find('#hdnStaDocumento').attr('value');
			form['hdnIdUnidadeGeradoraProtocolo'] = $resposta.find('#hdnIdUnidadeGeradoraProtocolo').attr('value');
			form['hdnIdProcedimento'] = $resposta.find('#hdnIdProcedimento').attr('value');
			form['hdnIdTipoProcedimento'] = $resposta.find('#hdnIdTipoProcedimento').attr('value');
			form['hdnSinBloqueado'] = $resposta.find('#hdnSinBloqueado').attr('value');

			var postFields = {
				hdnInfraTipoPagina: form['hdnInfraTipoPagina'], 						selSerie: form['selSerie'],
				txtDataElaboracao: Dropzone.utils.hoje(),				 				txtProtocoloDocumentoTextoBase: '',
				rdoTextoInicial: 'N', 													hdnIdDocumentoTextoBase: '',
				txtNumero: this.arquivoParaUpload.name.slice(0,49), 					rdoFormato: 'N',
				selTipoConferencia: 'null',					 							txtDescricao: '',
				txtRemetente: '', 														hdnIdRemetente: '',
				txtInteressado: '', 													hdnIdInteressado: '',
				txtDestinatario: '',				 									hdnIdDestinatario: '',
				txtAssunto: '', 														hdnIdAssunto: '',
				txaObservacoes: '', 													selGrauSigilo: 'null',
				rdoNivelAcesso: '0', 													hdnFlagDocumentoCadastro: '2',
				hdnAssuntos: '', 														hdnInteressados: '',
				hdnDestinatarios: '',				 									hdnIdSerie: form['selSerie'],
				hdnIdUnidadeGeradoraProtocolo: form['hdnIdUnidadeGeradoraProtocolo'], 	hdnStaDocumento: form['hdnStaDocumento'],
				hdnIdTipoConferencia: '', 												hdnIdDocumento: '',
				hdnIdProcedimento: form['hdnIdProcedimento'], 							hdnAnexos: hdnAnexos,
				hdnIdHipoteseLegalSugestao: '', 										hdnIdTipoProcedimento: form['hdnIdTipoProcedimento'],
				hdnUnidadesReabertura: '', 												hdnSinBloqueado: form['hdnSinBloqueado'],
				hdnContatoObject: '', 													hdnContatoIdentificador: '',
				hdnAssuntoIdentificador: '',
			}

			/* montar post body */
			var postData = '';
			for (var k in postFields) {
				if (postData !== '') postData = postData + '&';
				var valor = encodeURIComponent(postFields[k]);
				if (k === 'hdnAnexos') valor = valor.replace(/%C2/g,''); /* por alguma razão, esse parâmetro vai mal formado para o servidor */
				postData = postData + k + '=' + valor;
			}
			
			return {
				url: urlParaEnvio,
				data: postData,
			}

		},

		submeterFormulario: function(hdnAnexos, resposta) {
			var dados = this.passos['4'].obterDados.call(this, hdnAnexos, resposta);
			$.ajax({
				url: dados.url,
				method: 'POST',
				data: dados.data,
				processData: false,
				success: function(resposta) {
					/* TODO: checar se código de resposta é 302 */
					location.reload();
				}.bind(this),
			});
		},

	},


};


Dropzone.http.prototype.inserirDocumentoExterno = function() {
	this.passos['1'].abrirPagina.call(this);
};


Dropzone.iniciar = function() {
	Dropzone.ui.adicionarDropzone();
};