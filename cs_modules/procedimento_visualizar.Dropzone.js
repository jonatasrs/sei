var Dropzone = {};

/* 
	Dropzone.utils
	Objeto com algumas funções úteis
*/
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


/* 
	Dropzone.ui
	IIFE que controla o estado da view
*/

Dropzone.ui = (function() {

	var ui = {};
	
	ui.wrapper = $(`
		<div class='dropzone-wrapper'>
			<div class='dropzone-bg'></div>
			<div class='dropzone-ui'>
			<img class='dropzone-icon'>
			<p class='dropzone-label'></p>
			</div>
		</div>
	`);

	ui.icon = ui.wrapper.find('.dropzone-icon');
	ui.label = ui.wrapper.find('.dropzone-label');

	function mudarIcone(icone) {
		ui.icon.attr('src', browser.extension.getURL(`icons/${icone}`));
	}

	function mudarTexto(texto) {
		ui.label.text(texto);
	}	

	function mudarProgresso(progresso) {
		mudarTexto('Criando documentos...' + progresso + '%');
	}


	function checkarContemArquivos(dataTransfer) {
		return (
			dataTransfer &&
			dataTransfer.files &&
			dataTransfer.types &&
			dataTransfer.types.indexOf('Files') > -1
		);
	}

	function adicionarDropzone() {

		mudarTexto('Arraste aqui...');
		mudarIcone('fileUpload.png');

		ui.wrapper.appendTo("body");

		window.addEventListener('drop', function(evt) {
			if (!checkarContemArquivos(evt.dataTransfer)) return;
			evt.preventDefault();
			mudarIcone('aguarde.gif');
			mudarProgresso(0);
    		for (var i = 0; i < evt.dataTransfer.files.length; i++) {
    			Dropzone.jobs.adicionar(evt.dataTransfer.files[i]);
    		}
    		Dropzone.jobs.executar();
		});

		window.addEventListener('dragover', function(evt) {
			evt.preventDefault();
		});  

		window.addEventListener('dragenter', function(evt) {
			if (!checkarContemArquivos(evt.dataTransfer)) return;
			Dropzone.log(evt.dataTransfer.files);
			ui.wrapper.show();
		});

		window.addEventListener('dragleave', function(evt) {
			evt.preventDefault();
			if (evt.relatedTarget === null) {
				ui.wrapper.hide();
			}
		});		

	};

	return {
		adicionarDropzone: adicionarDropzone,
		mudarProgresso: mudarProgresso,
	};

})();


/* 
	Dropzone.jobs
	IIFE que gerencia os jobs de inserção de documentos
*/

Dropzone.jobs = (function() {

	var jobs = [];

	function adicionar(arquivoParaUpload) {
		var job = {
			arquivo: arquivoParaUpload,
			nome: arquivoParaUpload.name,
			status: 'em_andamento',
			progresso: 0,
		}
		jobs.push(job);
	}

	function executar() {
		jobs.forEach(function(job) {
			var http = new Dropzone.http(job.arquivo, function(novoStatus, novoProgresso) {
				job.status = novoStatus;
				job.progresso = novoProgresso || 0;
				atualizaProgresso();
				verificarSeCompletou();
			});
			http.inserirDocumentoExterno();
		});
	}

	function atualizaProgresso() {
		var totalProgresso = jobs.reduce(function(anterior, job) {
			if (job.status === 'em_andamento') return anterior + job.progresso;
			if (job.status === 'erro') return anterior + 1;
			if (job.status === 'completo') return anterior + 1;
		}, 0);
		var progresso = Math.trunc((totalProgresso / jobs.length) * 100);
		Dropzone.ui.mudarProgresso(progresso)
	}

	function verificarSeCompletou() {
		var haEmAndamento = jobs.some(function(job) { return (job.status === 'em_andamento'); });
		if (haEmAndamento) return; /* jobs ainda em andamento */

		/* jobs terminaram */
		var jobsComErro = jobs.filter(function(job) { return (job.status === 'erro'); });

		/* quando há algum erro */
		if (jobsComErro.length > 0) {
			var jobsStr = jobsComErro.map(function(job) { return job.nome; }).join(', ');
			alert('Ocorreu um erro ao incluir documento externo com o(s) seguinte(s) anexo(s): ' + jobsStr + '.')
		}

		/* recarrega a página sempre que os jobs terminam, independente se erro ou sucesso */
		location.reload();
	}

	return {
		adicionar: adicionar,
		executar: executar,
	}


})();


/* 
	Dropzone.http
	Função que deve ser construída (new) para cada upload.
	Faz uma série de requisições AJAX que permite criar o documento externo com o anexo informado como parâmetro.
*/
Dropzone.http = function(arquivoParaUpload, fnNovoStatus) {
	this.arquivoParaUpload = arquivoParaUpload;
	this.fnNovoStatus = fnNovoStatus;
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
			var regex = /^Nos\[0\].acoes = '<a href="(.*?)" tabindex="451"/m;
			var resultado = regex.exec(ultimaScriptTag.innerHTML);
			if (resultado === null) return null;
			return resultado[1];
		},

		abrirPagina: function() {
			var urlDocExterno = this.passos['1'].obterUrl();
			if (urlDocExterno === null) {
				Dropzone.log("Erro ao inserir documento externo: não foi possível encontrar o botão de inserir documento.");
				this.fnNovoStatus('erro');
				return;
			}
		  	$.ajax({ 
		  		url: GetBaseUrl() + urlDocExterno,
		  		success: function(resposta) {
		  			this.passos['2'].abrirPagina.call(this,resposta);
		  		}.bind(this),
		  		error: function() {
		  			Dropzone.log("Erro ao inserir documento externo: ocorreu um erro ao abrir a página de inserir documento.");
					this.fnNovoStatus('erro');
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
			var regex = /<a href="(.*?)" tabindex="1003" class="ancoraOpcao"> Externo<\/a>/m
			var resultado = regex.exec(resposta)
			if (resultado === null) return null;
			return resultado[1];
		},

		abrirPagina: function(resposta) {
			var urlNovoDocExterno = this.passos['2'].obterUrl(resposta);
			if (urlNovoDocExterno === null) {
				Dropzone.log("Erro ao inserir documento externo: não foi localizado link para o documento tipo externo.");
				this.fnNovoStatus('erro');
				return;
			}
			$.ajax({
				url: GetBaseUrl() + urlNovoDocExterno,
				success: function(resposta) {
					this.passos['3'].enviarArquivo.call(this, resposta);
				}.bind(this),
		  		error: function() {
					Dropzone.log("Erro ao inserir documento externo: ocorreu um erro ao abrir a página de escolher o tipo de documento.");
					this.fnNovoStatus('erro');
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
			var regex = /^\s*objUpload = new infraUpload\('frmAnexos','(.+?)'\);/m;
			var resultado = regex.exec(resposta)
			if (resultado === null) return null;
			return resultado[1];			
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
			if (urlUpload === null) {
				Dropzone.log("Erro ao inserir documento externo: não foi localizada a URL para enviar o arquivo.");
				this.fnNovoStatus('erro');
				return;
			}			
			var data = new FormData();
			data.append('filArquivo', this.arquivoParaUpload, this.arquivoParaUpload.name);
			$.ajax({
				url: GetBaseUrl() + urlUpload,
				method: 'POST',
				contentType: false,
				processData: false,
				data: data,
				xhr: function() {
					var xhr = $.ajaxSettings.xhr();
					if (xhr.upload) {
						xhr.upload.onprogress = function (e) {
							if (e.lengthComputable) {
								this.fnNovoStatus('em_andamento', (e.loaded / e.total));
							}
						}.bind(this);
					}
					return xhr;
				}.bind(this),				
				success: function(uploadIdentificador) {
					var usuarioEUnidade = this.passos['3'].obterUsuarioEUnidade(resposta);
					if (usuarioEUnidade === null) {
						Dropzone.log("Erro ao inserir documento externo: não foram localizados dados de usuário/unidade dentro da página.");
						this.fnNovoStatus('erro');
						return;
					}						
					var hdnAnexos = this.passos['3'].gerarHdnAnexos(usuarioEUnidade, uploadIdentificador);
					this.passos['4'].submeterFormulario.call(this, hdnAnexos, resposta);
				}.bind(this),
		  		error: function() {
		  			Dropzone.log("Erro ao inserir documento externo: ocorreu um erro ao realizar a operação de upload.");
					this.fnNovoStatus('erro');
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
			var tipoPadrao = SavedOptions.incluirDocAoArrastar_TipoDocPadrao || 'Anexo';
			options.each(function() {
				if ($(this).text().trim() === tipoPadrao) tipoDocumento = $(this).attr('value');
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

			var nomeDoDocumento = this.arquivoParaUpload.name.replace(/\.[^/.]+$/, '').slice(0,49)

			var postFields = {
				hdnInfraTipoPagina: form['hdnInfraTipoPagina'], 						selSerie: form['selSerie'],
				txtDataElaboracao: Dropzone.utils.hoje(),				 				txtProtocoloDocumentoTextoBase: '',
				rdoTextoInicial: 'N', 													hdnIdDocumentoTextoBase: '',
				txtNumero: nomeDoDocumento,							 					rdoFormato: 'N',
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

		/* como o ajax não deteca um redirect (302), temos que verificar se a página que retornou é a correta */
		paginaRetornouCorretamente: function(resposta) {
			var regex = /<div id="divArvoreHtml"><\/div>/gm
			var resultado = regex.exec(resposta);
			return !(resultado === null);
		},

		submeterFormulario: function(hdnAnexos, resposta) {
			var dados = this.passos['4'].obterDados.call(this, hdnAnexos, resposta);
			$.ajax({
				url: GetBaseUrl() + dados.url,
				method: 'POST',
				data: dados.data,
				success: function(data, textStatus, xhr) {
					if (this.passos['4'].paginaRetornouCorretamente.call(this, data)) {
						this.fnNovoStatus('completo', 1);	
					} else {
		  				Dropzone.log("Erro ao inserir documento externo: ocorreu um erro ao concluir a inserção do novo documento (redirecionou para a página errada).");
						this.fnNovoStatus('erro');	
					}
				}.bind(this),
		  		error: function() {
		  			Dropzone.log("Erro ao inserir documento externo: ocorreu um erro ao concluir a inserção do novo documento.");
					this.fnNovoStatus('erro');
		  		}.bind(this),				
			});
		},

	},


};


Dropzone.http.prototype.inserirDocumentoExterno = function() {
	this.passos['1'].abrirPagina.call(this);
};


/*
	Dropzone.log
	Função para tossir o log padrão sei++ no console
*/
Dropzone.log = function(mconsole, texto) {
	mconsole.log(texto);
}


/*
	Dropzone.iniciar
	Função invocada para iniciar a dropzone
*/
Dropzone.iniciar = function(Basename) {

	Dropzone.ui.adicionarDropzone();

  	var mconsole = new __mconsole(BaseName + ".Dropzone");
  	Dropzone.log = Dropzone.log.bind(this, mconsole);
};